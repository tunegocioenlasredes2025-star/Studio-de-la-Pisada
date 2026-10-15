// Studio de la Pisada · sin dependencias.
(function () {
  // El botón flotante de WhatsApp aparece recién después de pasar la portada (arriba ya está el botón grande).
  var flota = document.querySelector('.wa-flota');
  var hero = document.querySelector('.hero');
  if (flota && hero && 'IntersectionObserver' in window) {
    flota.style.transition = 'opacity .25s, transform .25s';
    new IntersectionObserver(function (e) {
      var ver = !e[0].isIntersecting;
      flota.style.opacity = ver ? '1' : '0';
      flota.style.transform = ver ? 'none' : 'translateY(20px)';
      flota.style.pointerEvents = ver ? 'auto' : 'none';
    }).observe(hero);
  }

  // Escaneo del pie: en el aire → apoya → barrido con el mapa de presión → medidas → se repite.
  var esc = document.querySelector('.escaneo');
  if (!esc) return;
  var estado = esc.querySelector('[data-estado]');
  var nums = esc.querySelectorAll('[data-n]');
  var quieto = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (quieto) { esc.className = 'escaneo listo estatico'; estado.textContent = 'Estudio listo'; return; }

  var timers = [];
  function en(ms, fn) { timers.push(setTimeout(fn, ms)); }
  function fase(clase, texto) { esc.className = 'escaneo ' + clase; if (texto) estado.textContent = texto; }
  function contar() {
    var t0 = performance.now();
    (function paso(t) {
      var k = Math.min(1, (t - t0) / 900);
      nums.forEach(function (b) { b.textContent = Math.round(+b.dataset.n * (0.6 + 0.4 * k)); });
      if (k < 1) requestAnimationFrame(paso);
    })(t0);
  }
  function ciclo() {
    timers.forEach(clearTimeout); timers = [];
    nums.forEach(function (b) { b.textContent = '—'; });
    // Reinicia sin transición para que el barrido vuelva arriba de golpe.
    fase('', 'Apoyá los pies');
    void esc.offsetWidth;
    en(80, function () { fase('aire', 'Apoyá los pies'); });
    en(1300, function () { fase('apoya', 'Pies apoyados'); });
    en(2400, function () { fase('escanea', 'Escaneando…'); });
    en(5300, function () { fase('listo', 'Estudio listo'); contar(); });
    en(10500, function () { fase('listo fuera'); });
    en(11300, ciclo);
  }

  // Solo anima cuando se ve (ahorra batería en el celu).
  var corriendo = false;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      if (e[0].isIntersecting && !corriendo) { corriendo = true; ciclo(); }
      else if (!e[0].isIntersecting && corriendo) { corriendo = false; timers.forEach(clearTimeout); fase('listo estatico', 'Estudio listo'); nums.forEach(function (b) { b.textContent = b.dataset.n; }); }
    }, { threshold: 0.25 }).observe(esc);
  } else { ciclo(); }
})();
