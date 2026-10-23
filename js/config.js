/*
 * ============================================================
 *  CONFIGURACIÓN DE LA INVITACIÓN
 *  Edita solo este archivo para cambiar textos, fechas y lugares.
 * ============================================================
 */
window.INVITACION = {
  // Nombre corto (portada grande, sobre y despedida)
  nombre: "Evangelyn",

  // Fecha y hora del evento principal (formato AAAA-MM-DDTHH:MM:SS, hora local)
  fecha: "2027-01-16T15:00:00",
  fechaTexto: "Sábado 16 de enero de 2027",
  duracionHoras: 7,
  zonaHoraria: "America/Costa_Rica",

  // Paleta de colores: olivo | rural | romantico | gala | encantado | tropical | minimal | verano
  // (Para previsualizar otra sin editar: agrega ?tema=rural al final del enlace)
  tema: "olivo",

  frase:
    "Hay momentos que se esperan toda la vida. Hoy dejo atrás mi niñez para comenzar a escribir una nueva historia, y quiero que seas parte de ella.",

  padres: ["Uarner Blanco Morales", "Ana Yancy Rodríguez Salazar"],
 

  ceremonia: {
    titulo: "Misa",
    hora: "3:00 p.m.",
    lugar: "Granja La Loma",
    direccion: "Aguas Zarcas, San Carlos",
    mapa: "https://www.google.com/maps/search/?api=1&query=Granja+La+Loma+Aguas+Zarcas",
  },

  recepcion: {
    titulo: "Recepción",
    hora: "5:00 p.m.",
    lugar: "Granja La Loma",
    direccion: "Aguas Zarcas, San Carlos",
    mapa: "https://www.google.com/maps/search/?api=1&query=Granja+La+Loma+Aguas+Zarcas",
  },

  vestimenta: {
    tipo: "Libre",
    nota: "Ven a tu gusto, como te sientas más cómodo. Con cariño te pedimos reservar el color verde olivo para la cumpleañera.",
  },

  regalos: {
    texto:
      "Tu presencia es mi mejor regalo. Si deseas tener un detalle conmigo, habrá un buzón para sobres el día del evento.",
  },

  rsvp: {
    fechaLimite: "Viernes 4 de diciembre de 2026",
    // Máximo de personas por confirmación (si el enlace no trae ?pases=N)
    maxPersonas: 6,
    // Pega aquí la URL de tu aplicación web de Google Apps Script (ver README).
    // Mientras esté vacía, el formulario funciona en "modo demostración" y no guarda nada.
    urlGoogleScript: "https://script.google.com/macros/s/AKfycbx-fGlsQx9mclwjSGDWIDmmsC5vII0DbjRM1rzLP1JgjBY0p3s8Y45lztIUXjgYsswQ/exec",
  },

  // Opcional: URL de un archivo .mp3 (por ejemplo "musica/cancion.mp3"). Vacío = sin música.
  musica: "",
};
