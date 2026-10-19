/**
 * Recibe las confirmaciones de la invitación y las guarda en esta hoja de cálculo.
 *
 * Instalación (ver README.md del proyecto):
 *  1. Abre tu Google Sheet  ->  Extensiones  ->  Apps Script.
 *  2. Pega este código, guarda y ejecuta una vez la función "configurar".
 *  3. Implementar -> Nueva implementación -> Aplicación web
 *     (Ejecutar como: Yo · Quién tiene acceso: Cualquier usuario).
 *  4. Copia la URL y pégala en js/config.js -> rsvp.urlGoogleScript
 */

// Opcional: escribe un correo para recibir un aviso por cada confirmación. Vacío = sin avisos.
const CORREO_AVISO = '';

const HOJA_RESPUESTAS = 'Respuestas';
const HOJA_LISTA = 'Lista de invitados';
const HOJA_RESUMEN = 'Resumen';
const MAX_NOMBRES = 20;

function configurar() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  hoja_(ss, HOJA_RESPUESTAS, ['Fecha', 'Invitación', '¿Asiste?', 'Cantidad', 'Nombres', 'Teléfono', 'Mensaje']);
  hoja_(ss, HOJA_LISTA, ['Fecha', 'Invitación', 'Nombre']);
  let resumen = ss.getSheetByName(HOJA_RESUMEN);
  if (!resumen) {
    resumen = ss.insertSheet(HOJA_RESUMEN, 0);
    resumen.getRange('A1:B5').setValues([
      ['Resumen', ''],
      ['Personas confirmadas', `=COUNTA('${HOJA_LISTA}'!C2:C)`],
      ['Respuestas recibidas', `=COUNTA('${HOJA_RESPUESTAS}'!A2:A)`],
      ['Respuestas "Sí"', `=COUNTIF('${HOJA_RESPUESTAS}'!C2:C,"Sí")`],
      ['Respuestas "No"', `=COUNTIF('${HOJA_RESPUESTAS}'!C2:C,"No")`],
    ]);
    resumen.getRange('A1').setFontWeight('bold').setFontSize(14);
    resumen.getRange('A2:A5').setFontWeight('bold');
    resumen.setColumnWidth(1, 220);
  }
  const hoja1 = ss.getSheetByName('Hoja 1') || ss.getSheetByName('Sheet1');
  if (hoja1 && hoja1.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(hoja1);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const p = (e && e.parameter) || {};
    if (p.website) return json_({ ok: true }); // bot

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const respuestas = hoja_(ss, HOJA_RESPUESTAS, ['Fecha', 'Invitación', '¿Asiste?', 'Cantidad', 'Nombres', 'Teléfono', 'Mensaje']);
    const lista = hoja_(ss, HOJA_LISTA, ['Fecha', 'Invitación', 'Nombre']);

    let nombres = [];
    try { nombres = JSON.parse(p.nombres || '[]'); } catch (err) { nombres = []; }
    nombres = nombres.map(limpiar_).filter(String).slice(0, MAX_NOMBRES);
    if (!nombres.length) return json_({ ok: false, error: 'Faltan nombres' });

    const asiste = p.asistencia === 'si';
    const fecha = new Date();
    const invitacion = limpiar_(p.invitacion);

    respuestas.appendRow([
      fecha,
      invitacion,
      asiste ? 'Sí' : 'No',
      asiste ? nombres.length : 0,
      nombres.join(', '),
      limpiar_(p.telefono),
      limpiar_(p.mensaje, 500),
    ]);
    if (asiste) {
      const filas = nombres.map(n => [fecha, invitacion, n]);
      lista.getRange(lista.getLastRow() + 1, 1, filas.length, 3).setValues(filas);
    }

    if (CORREO_AVISO) {
      MailApp.sendEmail(
        CORREO_AVISO,
        `Confirmación XV: ${asiste ? 'Sí' : 'No'} (${asiste ? nombres.length : 0})`,
        `${invitacion ? 'Invitación: ' + invitacion + '\n' : ''}Nombres: ${nombres.join(', ')}\nMensaje: ${limpiar_(p.mensaje, 500)}`
      );
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({ ok: true, mensaje: 'El servicio de confirmaciones está activo.' });
}

function hoja_(ss, nombre, encabezados) {
  let h = ss.getSheetByName(nombre);
  if (!h) {
    h = ss.insertSheet(nombre);
    h.appendRow(encabezados);
    h.getRange(1, 1, 1, encabezados.length).setFontWeight('bold').setBackground('#F6EAE7');
    h.setFrozenRows(1);
  }
  return h;
}

// Quita espacios, limita el largo y evita que un texto se interprete como fórmula.
function limpiar_(valor, max) {
  let s = String(valor == null ? '' : valor).trim().slice(0, max || 100);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
