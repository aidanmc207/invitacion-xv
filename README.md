# Invitación interactiva · XV Años

Invitación web para una fiesta de quince años: sobre animado que se abre, cuenta regresiva, ubicaciones con Google Maps, botón para agregar al calendario y formulario de **confirmación de asistencia** que guarda las respuestas en una hoja de Google Sheets.

## Estructura

| Archivo | Para qué sirve |
|---|---|
| `js/config.js` | **El único archivo que hay que editar**: nombre, fecha, lugares, textos, paleta, URL del formulario. |
| `index.html` | La invitación. |
| `generador.html` | Crea enlaces personalizados por invitado (con nombre y número de pases) y los envía por WhatsApp. |
| `google-apps-script/Codigo.gs` | Código que se pega en Google Sheets para recibir las confirmaciones. |
| `css/styles.css` | Estilos y las 6 paletas de color. |

## 1. Publicar con GitHub Pages

1. En el repositorio: **Settings → Pages**.
2. En *Source* elige **Deploy from a branch**, rama `main`, carpeta `/ (root)` y presiona **Save**.
3. Después de 1–2 minutos la invitación estará en `https://<tu-usuario>.github.io/<repositorio>/`.

## 2. Guardar las confirmaciones en Google Sheets (gratis)

> Usa **tu propia cuenta de Google**. Las respuestas quedan en tu Google Drive.

1. Entra a [sheets.new](https://sheets.new) y crea una hoja llamada, por ejemplo, *Confirmaciones XV*.
2. Menú **Extensiones → Apps Script**. Borra lo que aparece y pega todo el contenido de `google-apps-script/Codigo.gs`. Guarda (💾).
3. En la barra superior selecciona la función **`configurar`** y presiona **Ejecutar**. Google pedirá permisos: *Revisar permisos → tu cuenta → Configuración avanzada → Ir a (no seguro) → Permitir*. (Es normal: el script es tuyo.)
   Esto crea tres pestañas: **Resumen**, **Respuestas** y **Lista de invitados**.
4. **Implementar → Nueva implementación** → tipo **Aplicación web**:
   - *Ejecutar como*: **Yo**
   - *Quién tiene acceso*: **Cualquier usuario**
   Presiona **Implementar** y copia la **URL de la aplicación web** (termina en `/exec`).
5. Pega esa URL en `js/config.js`:
   ```js
   urlGoogleScript: "https://script.google.com/macros/s/XXXXXXXX/exec",
   ```
   Guarda y sube el cambio (puedes editar el archivo directamente en GitHub con el ícono del lápiz).

Mientras `urlGoogleScript` esté vacío, el formulario funciona en **modo demostración** (no guarda nada).

### Cómo se ven las respuestas

- **Resumen**: total de personas confirmadas, respuestas recibidas, cuántas dijeron sí y cuántas no (se actualiza solo).
- **Respuestas**: una fila por formulario enviado (fecha, invitación, ¿asiste?, cantidad, nombres, teléfono, mensaje).
- **Lista de invitados**: **una fila por persona** que asistirá. Es la lista lista para imprimir o para el control en la entrada.

Consejos:
- Para recibir un correo con cada confirmación, escribe tu correo en `CORREO_AVISO` dentro del script y vuelve a implementar (*Implementar → Gestionar implementaciones → editar → Nueva versión*).
- Puedes compartir la hoja (solo lectura) con la familia desde el botón **Compartir** de Google Sheets.
- Si cambias el código del script, siempre crea una **nueva versión** de la implementación para que la URL siga funcionando.

## 3. Enlaces personalizados (recomendado)

Abre `https://<tu-usuario>.github.io/<repositorio>/generador.html`, escribe un invitado por línea (`Familia Pérez, 4`) y obtendrás para cada uno:

- un enlace como `…/?invitado=Familia%20P%C3%A9rez&pases=4` que saluda por nombre y **limita a 4** las personas que puede confirmar;
- un botón para enviarlo por WhatsApp con un mensaje listo.

En la hoja, la columna **Invitación** indica de qué enlace vino cada respuesta, así sabes quién falta por responder.
Si prefieres un solo enlace para todos, comparte la dirección normal: permite hasta `maxPersonas` personas (configurable).

## 4. Personalizar

Todo en `js/config.js`:

- `nombre`, `fecha`, `fechaTexto`, `frase`, `padres`, `padrinos`
- `ceremonia` y `recepcion` (hora, lugar, dirección y enlace de Google Maps)
- `vestimenta`, `regalos`, `rsvp.fechaLimite`, `rsvp.maxPersonas`
- `musica`: sube un `.mp3` al repositorio (por ejemplo `musica/cancion.mp3`) y escribe su ruta; suena al abrir el sobre.

### Paletas disponibles (`tema`)

| Valor | Estilo |
|---|---|
| `olivo` | Verde olivo predominante con detalles rosados en oro rosa **(predeterminada)** |
| `rural` | Campestre: verde olivo, lino, sobre kraft con cordel, costuras y flores silvestres rosadas |
| `romantico` | Rosa palo, marfil, oro rosa y eucalipto |
| `gala` | Azul marino, lavanda, dorado y blanco |
| `encantado` | Verde salvia, blush, champán y beige |
| `tropical` | Coral, durazno, menta y blanco cálido |
| `minimal` | Malva, ciruela, plata y blanco nieve |
| `verano` | Azul cielo, rosa bebé, amarillo manteca y plata |

Para comparar sin editar nada, agrega `?tema=rural` (u otro) al final del enlace.
