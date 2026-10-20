(function () {
  "use strict";

  var C = window.INVITACION;
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var CLAVE_LOCAL = "rsvp-xv-enviado";
  var reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Parámetros del enlace (?invitado=Familia%20Pérez&pases=4&tema=gala) ----------
  var params = new URLSearchParams(location.search);
  var invitado = (params.get("invitado") || "").trim().slice(0, 80);
  var pases = parseInt(params.get("pases"), 10);
  var maxPersonas = pases > 0 ? Math.min(pases, 20) : C.rsvp.maxPersonas;

  var tema = params.get("tema") || C.tema;
  document.documentElement.dataset.theme = tema;
  if (tema === "olivo" || tema === "rural") {
    $$('use[href="#rama"]').forEach(function (u) { u.setAttribute("href", "#rama-olivo"); });
  }
  document.title = "Mis XV Años · " + C.nombre;

  // ---------- Textos desde config.js ----------
  function obtener(ruta) {
    return ruta.split(".").reduce(function (o, k) { return o == null ? undefined : o[k]; }, C);
  }
  $$("[data-campo]").forEach(function (el) {
    var v = obtener(el.dataset.campo);
    if (v != null) el.textContent = v;
  });
  $$("[data-lista]").forEach(function (ul) {
    (obtener(ul.dataset.lista) || []).forEach(function (n) {
      var li = document.createElement("li");
      li.textContent = n;
      ul.appendChild(li);
    });
  });

  if (invitado) {
    $$("[data-invitado]").forEach(function (el) { el.hidden = false; });
    $$("[data-invitado-nombre]").forEach(function (el) { el.textContent = invitado; });
    $("#pases-texto").textContent = maxPersonas === 1 ? "1 pase" : maxPersonas + " pases";
  }

  // ---------- Tarjetas de evento ----------
  var eventos = $("#eventos");
  [
    { datos: C.ceremonia, icono: "i-iglesia" },
    { datos: C.recepcion, icono: "i-copa" },
  ].forEach(function (ev) {
    var d = ev.datos;
    if (!d) return;
    var art = document.createElement("article");
    art.className = "tarjeta revelar";
    art.innerHTML =
      '<svg aria-hidden="true"><use href="#' + ev.icono + '"/></svg>' +
      "<h3></h3><p class=\"tarjeta__hora\"></p><p class=\"tarjeta__lugar\"></p><p class=\"tarjeta__dir\"></p>" +
      '<a class="boton boton--borde" target="_blank" rel="noopener">Ver ubicación</a>';
    art.querySelector("h3").textContent = d.titulo;
    art.querySelector(".tarjeta__hora").textContent = d.hora;
    art.querySelector(".tarjeta__lugar").textContent = d.lugar;
    art.querySelector(".tarjeta__dir").textContent = d.direccion;
    art.querySelector("a").href = d.mapa;
    eventos.appendChild(art);
  });

  // ---------- Sobre de apertura + pétalos + música ----------
  var audio = null;
  var btnMusica = $("#musica");
  if (C.musica) {
    audio = new Audio(C.musica);
    audio.loop = true;
    btnMusica.addEventListener("click", function () {
      if (audio.paused) audio.play(); else audio.pause();
    });
    audio.addEventListener("play", function () { btnMusica.classList.remove("pausada"); btnMusica.setAttribute("aria-label", "Pausar música"); });
    audio.addEventListener("pause", function () { btnMusica.classList.add("pausada"); btnMusica.setAttribute("aria-label", "Reproducir música"); });
  }

  $("#abrir").addEventListener("click", function () {
    var sobre = this;
    if (sobre.classList.contains("abierto")) return;
    sobre.classList.add("abierto");
    if (audio) {
      btnMusica.hidden = false;
      audio.play().catch(function () { btnMusica.classList.add("pausada"); });
    }
    setTimeout(function () {
      $("#intro").classList.add("oculto");
      document.body.classList.remove("bloqueado");
      lanzarPetalos();
      revelarVisibles();
    }, reducirMovimiento ? 0 : 1500);
  });

  // ---------- Ramas colgantes con lucecitas ----------
  function crearEnredadera(cont) {
    var cantidad = parseInt(cont.dataset.vinas, 10) || 12;
    var alto = cont.clientHeight || 400;
    var ancho = cont.clientWidth || 400;
    // En pantallas angostas se reducen para que no se amontonen
    if (ancho < 600) cantidad = Math.round(cantidad * 0.75);
    var html = "";
    for (var i = 0; i < cantidad; i++) {
      var x = (i + 0.5) / cantidad + (Math.random() - 0.5) * (0.5 / cantidad);
      var borde = Math.min(1, Math.abs(x - 0.5) * 2); // 0 = centro, 1 = orillas
      var L = Math.round(alto * (0.12 + 0.82 * Math.pow(borde, 1.7)) * (0.75 + Math.random() * 0.3));
      html += vina(L, x);
    }
    cont.innerHTML = follaje(ancho) + html;
    if (!reducirMovimiento) luciernagas(cont, ancho < 600 ? 8 : 12);
  }

  // Franja de follaje en la parte superior, de donde cuelgan las ramas
  function follaje(ancho) {
    var h = 34, hojas = "";
    for (var i = 0, n = Math.round(ancho / 4); i < n; i++) {
      var x = (Math.random() * ancho).toFixed(1);
      var y = (Math.pow(Math.random(), 1.8) * h).toFixed(1);
      var esc = 1 - y / h * 0.4;
      hojas += '<ellipse class="h' + (1 + Math.floor(Math.random() * 3)) + '" cx="' + x + '" cy="' + y +
        '" rx="' + (3.4 * esc).toFixed(1) + '" ry="' + (8 * esc).toFixed(1) +
        '" transform="rotate(' + Math.round(Math.random() * 180 - 90) + " " + x + " " + y + ')"/>';
    }
    return '<svg class="follaje" width="100%" height="' + (h + 8) + '" viewBox="0 0 ' + ancho + " " + (h + 8) +
      '" preserveAspectRatio="none">' + hojas + "</svg>";
  }

  function vina(L, x) {
    var w = 44, cx = w / 2;
    var amp = 2 + Math.random() * 4, fase = Math.random() * 6;
    function px(y) { return cx + Math.sin(y / 36 + fase) * amp * (y / L); }
    var d = "M" + cx + " 0";
    for (var y = 6; y <= L; y += 6) d += " L" + px(y).toFixed(1) + " " + y;
    var hojas = "", luces = "";
    var paso = 7 + Math.random() * 3, lado = Math.random() < 0.5 ? 1 : -1;
    for (y = 6; y < L - 4; y += paso) {
      var esc = 1.2 - (y / L) * 0.55;
      var lx = px(y);
      var ang = 30 + Math.random() * 25;
      var hx = (lx + lado * 4.5 * esc).toFixed(1), hy = (y + 3 * esc).toFixed(1);
      hojas += '<ellipse class="h' + (1 + Math.floor(Math.random() * 3)) + '" cx="' + hx + '" cy="' + hy +
        '" rx="' + (2.6 * esc).toFixed(1) + '" ry="' + (6.2 * esc).toFixed(1) +
        '" transform="rotate(' + (-lado * ang).toFixed(0) + " " + hx + " " + hy + ')"/>';
      if (Math.random() < 0.22) {
        var r = 1.2 + Math.random() * 1.1, ly = (y + 1).toFixed(1), lcx = (lx - lado * 3).toFixed(1);
        luces += '<g class="luz" style="animation-delay:' + (-Math.random() * 4).toFixed(1) + 's">' +
          '<circle class="halo" cx="' + lcx + '" cy="' + ly + '" r="' + (r * 3.2).toFixed(1) + '"/>' +
          '<circle cx="' + lcx + '" cy="' + ly + '" r="' + r.toFixed(1) + '"/></g>';
      }
      lado = -lado;
    }
    hojas += '<ellipse class="h2" cx="' + px(L).toFixed(1) + '" cy="' + (L - 3) + '" rx="2" ry="4.5"/>';
    return '<div class="vina" style="left:' + (x * 100).toFixed(1) + "%;height:" + L +
      "px;animation-duration:" + (5 + Math.random() * 4).toFixed(1) + "s;animation-delay:" + (-Math.random() * 6).toFixed(1) + 's">' +
      '<svg width="' + w + '" height="' + L + '" viewBox="0 0 ' + w + " " + L + '">' +
      '<path class="tallo" d="' + d + '"/>' + hojas + luces + "</svg></div>";
  }

  function luciernagas(cont, n) {
    var padre = cont.parentNode;
    for (var i = 0; i < n; i++) {
      var s = document.createElement("span");
      s.className = "luciernaga";
      s.setAttribute("aria-hidden", "true");
      s.style.left = 5 + Math.random() * 90 + "%";
      s.style.top = 8 + Math.random() * 75 + "%";
      s.style.animationDuration = 7 + Math.random() * 7 + "s, " + (2 + Math.random() * 3).toFixed(1) + "s";
      s.style.animationDelay = -Math.random() * 8 + "s, " + -Math.random() * 3 + "s";
      padre.appendChild(s);
    }
  }

  $$(".enredadera").forEach(crearEnredadera);

  function lanzarPetalos() {
    if (reducirMovimiento) return;
    var cont = $("#petalos");
    for (var i = 0; i < 14; i++) {
      var p = document.createElement("span");
      var tam = 11 + Math.random() * 7;
      p.className = "petalo h" + (1 + Math.floor(Math.random() * 3));
      p.style.left = Math.random() * 100 + "%";
      p.style.width = (tam * 0.42).toFixed(1) + "px";
      p.style.height = tam.toFixed(1) + "px";
      p.style.animationDuration = 9 + Math.random() * 8 + "s";
      p.style.animationDelay = Math.random() * 8 + "s";
      cont.appendChild(p);
    }
  }

  // ---------- Animaciones al hacer scroll ----------
  var observador = "IntersectionObserver" in window
    ? new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("visible"); observador.unobserve(e.target); }
        });
      }, { threshold: 0.15 })
    : null;
  function revelarVisibles() {
    $$(".revelar:not(.visible)").forEach(function (el) {
      if (observador) observador.observe(el); else el.classList.add("visible");
    });
  }

  // ---------- Cuenta regresiva ----------
  var fechaEvento = new Date(C.fecha);
  var unidades = {};
  $$("[data-u]").forEach(function (el) { unidades[el.dataset.u] = el; });
  function pad(n) { return n < 10 ? "0" + n : String(n); }
  function actualizarCuenta() {
    var diff = fechaEvento - new Date();
    if (diff <= 0) {
      $("#cuenta-regresiva").hidden = true;
      var fin = $("#cuenta-fin");
      fin.hidden = false;
      fin.textContent = diff > -C.duracionHoras * 3600000 ? "¡Hoy es el gran día!" : "¡Gracias por acompañarme!";
      clearInterval(intervalo);
      return;
    }
    unidades.dias.textContent = Math.floor(diff / 86400000);
    unidades.horas.textContent = pad(Math.floor(diff / 3600000) % 24);
    unidades.min.textContent = pad(Math.floor(diff / 60000) % 60);
    unidades.seg.textContent = pad(Math.floor(diff / 1000) % 60);
  }
  var intervalo = setInterval(actualizarCuenta, 1000);
  actualizarCuenta();

  // ---------- Agregar a Google Calendar ----------
  function formatoCal(d) {
    return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + "T" + pad(d.getHours()) + pad(d.getMinutes()) + "00";
  }
  var finEvento = new Date(fechaEvento.getTime() + C.duracionHoras * 3600000);
  $("#calendario").href =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" + encodeURIComponent("XV Años de " + C.nombre) +
    "&dates=" + formatoCal(fechaEvento) + "/" + formatoCal(finEvento) +
    "&ctz=" + encodeURIComponent(C.zonaHoraria) +
    "&location=" + encodeURIComponent(C.recepcion.lugar + ", " + C.recepcion.direccion) +
    "&details=" + encodeURIComponent("¡Te espero! " + location.href.split("?")[0]);

  // ---------- Formulario de confirmación ----------
  var form = $("#form-rsvp");
  var selCantidad = $("#cantidad");
  var contNombres = $("#nombres");
  var errorEl = $("#error");

  for (var n = 1; n <= maxPersonas; n++) {
    var opt = document.createElement("option");
    opt.value = n;
    opt.textContent = n === 1 ? "1 persona" : n + " personas";
    selCantidad.appendChild(opt);
  }

  function asiste() { return form.asistencia.value === "si"; }

  function renderNombres() {
    var total = asiste() ? parseInt(selCantidad.value, 10) : 1;
    var previos = $$("#nombres input").map(function (i) { return i.value; });
    contNombres.innerHTML = "";
    for (var i = 0; i < total; i++) {
      var div = document.createElement("div");
      div.className = "campo nombre-item";
      var id = "nombre-" + i;
      var etiqueta = !asiste() ? "Tu nombre completo"
        : i === 0 ? "Nombre completo (persona 1 · tú)"
        : "Nombre completo (persona " + (i + 1) + ")";
      div.innerHTML = '<label for="' + id + '"></label><input type="text" required maxlength="80" autocomplete="' + (i === 0 ? "name" : "off") + '">';
      div.querySelector("label").textContent = etiqueta;
      var input = div.querySelector("input");
      input.id = id;
      input.value = previos[i] || "";
      contNombres.appendChild(div);
    }
  }

  function alCambiarAsistencia() {
    $("#campo-cantidad").hidden = !asiste();
    renderNombres();
  }
  $$('input[name="asistencia"]').forEach(function (r) { r.addEventListener("change", alCambiarAsistencia); });
  selCantidad.addEventListener("change", renderNombres);
  alCambiarAsistencia();

  function mostrarError(msg) {
    errorEl.textContent = msg;
    errorEl.hidden = !msg;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    mostrarError("");

    var inputs = $$("#nombres input");
    var vacio = null;
    inputs.forEach(function (i) {
      var malo = i.value.trim().length < 2;
      i.setAttribute("aria-invalid", malo ? "true" : "false");
      if (malo && !vacio) vacio = i;
    });
    if (vacio) {
      mostrarError("Por favor escribe el nombre de cada persona.");
      vacio.focus();
      return;
    }

    var nombres = inputs.map(function (i) { return i.value.trim(); });
    var datos = {
      invitacion: invitado,
      asistencia: form.asistencia.value,
      cantidad: asiste() ? nombres.length : 0,
      nombres: JSON.stringify(nombres),
      telefono: form.telefono.value.trim(),
      mensaje: form.mensaje.value.trim(),
      website: form.website.value,
    };

    var boton = $("#enviar");
    boton.disabled = true;
    boton.textContent = "Enviando…";

    enviar(datos)
      .then(function (demo) { mostrarExito(nombres, demo); })
      .catch(function () {
        mostrarError("No pudimos enviar tu confirmación. Revisa tu conexión e inténtalo de nuevo.");
      })
      .then(function () {
        boton.disabled = false;
        boton.textContent = "Enviar confirmación";
      });
  });

  function enviar(datos) {
    if (!C.rsvp.urlGoogleScript) {
      // Modo demostración
      return new Promise(function (ok) { setTimeout(function () { ok(true); }, 700); });
    }
    return fetch(C.rsvp.urlGoogleScript, { method: "POST", body: new URLSearchParams(datos) })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json().catch(function () { return { ok: true }; });
      })
      .then(function (res) {
        if (!res.ok) throw new Error(res.error || "Error");
        return false;
      });
  }

  function mostrarExito(nombres, demo) {
    var si = asiste();
    form.hidden = true;
    $("#ya-respondio").hidden = true;
    $("#exito-titulo").textContent = si ? "¡Gracias por confirmar!" : "¡Gracias por avisarnos!";
    $("#exito-texto").textContent = si
      ? (nombres.length === 1 ? "Registramos tu asistencia:" : "Registramos la asistencia de " + nombres.length + " personas:")
      : "Lamentamos que no puedas acompañarnos. ¡Te tendremos presente!";
    var lista = $("#exito-lista");
    lista.innerHTML = "";
    if (si) nombres.forEach(function (n) { var li = document.createElement("li"); li.textContent = n; lista.appendChild(li); });
    $("#exito-demo").hidden = !demo;
    var exito = $("#exito");
    exito.hidden = false;
    exito.focus();
    if (!demo) { try { localStorage.setItem(CLAVE_LOCAL, "1"); } catch (err) { /* sin almacenamiento */ } }
  }

  try {
    if (localStorage.getItem(CLAVE_LOCAL)) {
      $("#ya-respondio").hidden = false;
      form.hidden = true;
    }
  } catch (err) { /* sin almacenamiento */ }
  $("#enviar-otra").addEventListener("click", function () {
    $("#ya-respondio").hidden = true;
    form.hidden = false;
  });
})();
