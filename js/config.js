/*
 * ============================================================
 *  CONFIGURACIÓN DE LA INVITACIÓN
 *  Edita solo este archivo para cambiar textos, fechas y lugares.
 * ============================================================
 */
window.INVITACION = {
  // Nombre de la quinceañera
  nombre: "Nombre",

  // Fecha y hora del evento principal (formato AAAA-MM-DDTHH:MM:SS, hora local)
  fecha: "2027-03-20T19:00:00",
  fechaTexto: "Sábado 20 de marzo de 2027",
  duracionHoras: 6,
  zonaHoraria: "America/Costa_Rica",

  // Paleta de colores: romantico | gala | encantado | tropical | minimal | verano
  // (Para previsualizar otra sin editar: agrega ?tema=gala al final del enlace)
  tema: "romantico",

  frase:
    "Hay momentos que se esperan toda la vida. Hoy dejo atrás mi niñez para comenzar a escribir una nueva historia, y quiero que seas parte de ella.",

  padres: ["Nombre del papá", "Nombre de la mamá"],
  padrinos: ["Nombre del padrino", "Nombre de la madrina"],

  ceremonia: {
    titulo: "Ceremonia religiosa",
    hora: "5:00 p.m.",
    lugar: "Parroquia Nombre del Lugar",
    direccion: "Dirección de la parroquia",
    mapa: "https://maps.google.com/?q=Parroquia",
  },

  recepcion: {
    titulo: "Recepción",
    hora: "7:00 p.m.",
    lugar: "Salón de Eventos Nombre",
    direccion: "Dirección del salón",
    mapa: "https://maps.google.com/?q=Salon+de+eventos",
  },

  vestimenta: {
    tipo: "Formal",
    nota: "Con cariño te pedimos reservar el color rosa para la quinceañera.",
  },

  regalos: {
    texto:
      "Tu presencia es mi mejor regalo. Si deseas tener un detalle conmigo, habrá un buzón para sobres el día del evento.",
  },

  rsvp: {
    fechaLimite: "1 de marzo de 2027",
    // Máximo de personas por confirmación (si el enlace no trae ?pases=N)
    maxPersonas: 6,
    // Pega aquí la URL de tu aplicación web de Google Apps Script (ver README).
    // Mientras esté vacía, el formulario funciona en "modo demostración" y no guarda nada.
    urlGoogleScript: "",
  },

  // Opcional: URL de un archivo .mp3 (por ejemplo "musica/cancion.mp3"). Vacío = sin música.
  musica: "",
};
