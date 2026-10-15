// Studio de la Pisada · animaciones con GSAP + ScrollTrigger (cdnjs).
// Sin GSAP o con "reducir movimiento", la página queda quieta y completa (no se pierde nada).
(function () {
  // El botón flotante de WhatsApp aparece recién después de pasar la portada.
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
  } else if (flota) { flota.style.opacity = '1'; flota.style.pointerEvents = 'auto'; }

  var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (quieto || !window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  document.documentElement.classList.add('anima');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  // ---------- Títulos que suben línea por línea ----------
  function partir(h) {
    var partes = [];
    var texto = '';
    h.childNodes.forEach(function (n) {
      if (n.nodeType === 3) texto += n.textContent;
      else { if (texto.trim()) partes.push({ t: texto.trim() }); texto = ''; partes.push({ el: n }); }
    });
    if (texto.trim()) partes.push({ t: texto.trim() });
    h.textContent = '';
    return partes.map(function (p) {
      var ln = document.createElement('span'); ln.className = 'ln';
      var inn = p.el || document.createElement('span');
      if (!p.el) { inn.textContent = p.t; inn.className = 'ln-t'; }
      ln.appendChild(inn); h.appendChild(ln);
      return inn;
    });
  }
  $$('[data-lineas]').forEach(function (h, i) {
    var lineas = partir(h);
    var enPortada = h.closest('.hero');
    gsap.from(lineas, {
      yPercent: 105, duration: 1.1, ease: 'power4.out', stagger: 0.12, delay: enPortada ? 0.15 : 0,
      scrollTrigger: enPortada ? null : { trigger: h, start: 'top 88%', once: true }
    });
  });

  // ---------- Portada ----------
  gsap.from('.hero [data-sube]', { y: 28, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.12, delay: 0.45 });
  gsap.fromTo('.hero-marco', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', delay: 0.1 });
  gsap.fromTo('.hero-marco img', { scale: 1.25 }, { scale: 1, duration: 2, ease: 'expo.out', delay: 0.1 });
  gsap.from('.hero-foto figcaption', { opacity: 0, y: 12, duration: 0.8, delay: 1.2 });
  gsap.to('.hero-marco img', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // ---------- Del pie a la plantilla ----------
  var pin = $('.historia-pin');
  var caps = $$('.capitulos li');
  var capas = { cubierta: $('.capa.cubierta'), espuma: $('.capa.espuma'), arco: $('.capa.arco'), metatarso: $('.capa.metatarso'), talon: $('.capa.talon') };
  var rotulos = { cubierta: $('.r-cubierta'), espuma: $('.r-espuma'), arco: $('.r-arco'), metatarso: $('.r-metatarso'), talon: $('.r-talon') };
  var escena = $('.escena');
  var esCelu = window.matchMedia('(max-width: 899px)').matches;

  if (esCelu) Object.keys(rotulos).forEach(function (k) { rotulos[k].textContent = rotulos[k].dataset.c; });

  function activar(n) { caps.forEach(function (li, i) { li.classList.toggle('activo', i === n); }); }
  activar(0);

  // Pone cada rótulo al costado de su capa, siga donde siga la capa en 3D.
  // Rótulos en columna a la derecha de la pila, con una línea hasta su capa y sin pisarse entre sí.
  function ubicarRotulos() {
    var r0 = escena.getBoundingClientRect();
    var items = Object.keys(capas).map(function (k) {
      var r = capas[k].getBoundingClientRect();
      return { lab: rotulos[k], borde: r.right - r0.left, y: r.top + r.height / 2 - r0.top };
    });
    var col = Math.max.apply(null, items.map(function (o) { return o.borde; })) + (esCelu ? 26 : 44);
    items.sort(function (a, b) { return a.y - b.y; });
    var sep = esCelu ? 24 : 32, ant = -1e9;
    items.forEach(function (o) {
      var y = Math.max(o.y, ant + sep); ant = y;
      o.lab.style.setProperty('--l', Math.max(14, col - o.borde - 6) + 'px');
      o.lab.style.transform = 'translate(' + col + 'px,' + (y - o.lab.offsetHeight / 2) + 'px)';
    });
  }

  // Posición "volando" de cada pieza antes de llegar (desordenadas, giradas).
  var vuelo = esCelu ? 0.55 : 1;
  var desde = {
    cubierta: { x: 260 * vuelo, y: -220, rotation: 24, z: 0 },
    espuma: { x: -300 * vuelo, y: -120, rotation: -18, z: 0 },
    arco: { x: 320 * vuelo, y: 140, rotation: 40, z: 0 },
    metatarso: { x: -260 * vuelo, y: 210, rotation: -35, z: 0 },
    talon: { x: 180 * vuelo, y: 300, rotation: 30, z: 0 }
  };
  // Vista explotada: una capa arriba de la otra, separadas en altura.
  var altura = esCelu ? 0.6 : 1;
  var explotada = { cubierta: 190, espuma: 70, arco: -110, metatarso: -110, talon: -110 };
  var armada = { cubierta: 6, espuma: 3, arco: 0, metatarso: 0, talon: 0 };

  Object.keys(capas).forEach(function (k) {
    gsap.set(capas[k], Object.assign({ opacity: 0, scale: 0.7 }, desde[k]));
  });
  gsap.set('.pila, .pie-escaneo, .final', { xPercent: -50, yPercent: -50, x: 0, y: 0 });
  gsap.set('.pila', { rotationX: 0, rotationZ: 0 });

  var tl = gsap.timeline({
    defaults: { ease: 'none' },
    // Todo lo que acompaña (paso activo, barra, rótulos) sigue a la animación, no al scroll: así no se desfasa si scrolleás rápido.
    onUpdate: function () {
      var t = tl.time();
      activar(t < 1.25 ? 0 : t < 2.2 ? 1 : t < 4.6 ? 2 : 3);
      gsap.set('.progreso i', { scaleX: tl.progress() });
      if (t > 3.2 && t < 4.7) ubicarRotulos();
    },
    scrollTrigger: { trigger: pin, start: 'top top', end: esCelu ? '+=260%' : '+=320%', pin: true, scrub: 0.8, anticipatePin: 1 }
  });

  // 1 · Barrido: la foto del pie se convierte en mapa de presión.
  tl.set('.linea-barrido', { opacity: 1 }, 0.15)
    .fromTo('.linea-barrido', { top: '0%' }, { top: '100%', duration: 1.1, ease: 'power1.inOut' }, 0.15)
    .fromTo('.pp', { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power1.inOut' }, 0.15)
    .to('.linea-barrido', { opacity: 0, duration: 0.15 }, 1.25)
    // 2 · Queda el mapa un momento y se achica hacia la base de la plantilla.
    .to('.pie-escaneo', { scale: 0.92, duration: 0.6 }, 1.6)
    .to('.pie-escaneo', { opacity: 0, rotationX: 50, rotationZ: -24, duration: 0.7, ease: 'power2.in' }, 2.2)
    // 3 · Las piezas llegan volando y se ordenan en la vista explotada.
    .to('.pila', { rotationX: 56, rotationZ: -26, y: '4%', xPercent: esCelu ? -100 : -70, duration: 1, ease: 'power2.inOut' }, 2.3);
  ['talon', 'metatarso', 'arco', 'espuma', 'cubierta'].forEach(function (k, i) {
    tl.to(capas[k], { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, z: explotada[k] * altura, duration: 0.9, ease: 'power3.out' }, 2.4 + i * 0.16);
  });
  tl.to('.rotulos li', { opacity: 1, duration: 0.3, stagger: 0.06 }, 3.35)
    .to({}, { duration: 0.5 }, 3.7) // pausa para leer
    // 4 · Se comprimen: queda la plantilla armada.
    .to('.rotulos li', { opacity: 0, duration: 0.25 }, 4.25);
  Object.keys(capas).forEach(function (k) {
    tl.to(capas[k], { z: armada[k], duration: 0.8, ease: 'power2.inOut' }, 4.3);
  });
  tl.to('.pila', { rotationX: 0, rotationZ: 0, y: 0, xPercent: -50, scale: 0.9, duration: 0.8, ease: 'power2.inOut' }, 5.05)
    .to('.pila', { opacity: 0, duration: 0.3 }, 5.55)
    .fromTo('.final', { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out' }, 5.6)
    .to({}, { duration: 0.4 }, 6.3);

  // ---------- Consultorio: la foto se arma con piezas ----------
  $$('[data-mosaico]').forEach(function (fig) {
    var img = $('img', fig);
    var cols = esCelu ? 3 : 5, filas = esCelu ? 3 : 4;
    var teselas = [];
    fig.classList.add('armando');
    for (var f = 0; f < filas; f++) for (var c = 0; c < cols; c++) {
      var t = document.createElement('div');
      t.className = 'tesela';
      t.style.cssText = 'left:' + (c * 100 / cols) + '%;top:' + (f * 100 / filas) + '%;width:' + (100 / cols + 0.15) + '%;height:' + (100 / filas + 0.15) + '%;' +
        'background-image:url(' + img.getAttribute('src') + ');background-size:' + (cols * 100) + '% ' + (filas * 100) + '%;' +
        'background-position:' + (cols > 1 ? c * 100 / (cols - 1) : 0) + '% ' + (filas > 1 ? f * 100 / (filas - 1) : 0) + '%';
      fig.appendChild(t); teselas.push({ el: t, c: c, f: f });
    }
    var tlm = gsap.timeline({ scrollTrigger: { trigger: fig, start: 'top 92%', end: 'center 55%', scrub: 0.8 } });
    teselas.forEach(function (o) {
      var dx = (o.c - (cols - 1) / 2), dy = (o.f - (filas - 1) / 2);
      tlm.fromTo(o.el,
        { x: dx * (esCelu ? 24 : 60) + gsap.utils.random(-20, 20), y: dy * 50 + gsap.utils.random(40, 100), rotation: gsap.utils.random(-9, 9), scale: 0.86, opacity: 0 },
        { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, ease: 'power2.out', duration: 1 }, gsap.utils.random(0, 0.5));
    });
    ScrollTrigger.create({ trigger: fig, start: 'center 55%', onEnter: function () { fig.classList.remove('armando'); teselas.forEach(function (o) { o.el.style.visibility = 'hidden'; }); },
      onLeaveBack: function () { fig.classList.add('armando'); teselas.forEach(function (o) { o.el.style.visibility = ''; }); } });
  });

  // ---------- Fotos que se descubren con una máscara ----------
  $$('[data-revela]').forEach(function (fig) {
    gsap.fromTo(fig, { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut', scrollTrigger: { trigger: fig, start: 'top 80%', once: true } });
    gsap.fromTo($('img', fig), { scale: 1.2 }, { scale: 1, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: fig, start: 'top 80%', once: true } });
  });

  // ---------- Campaña: el precio aparece grande ----------
  gsap.from('.monto b', { yPercent: 40, opacity: 0, duration: 1.1, ease: 'power4.out', scrollTrigger: { trigger: '.promo', start: 'top 85%', once: true } });
  gsap.from('.incluye li', { x: -20, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.promo', start: 'top 85%', once: true } });

  // ---------- Listas que entran de a una ----------
  $$('.pasos li, .sede, .faq details, .lista li').forEach(function (el) {
    gsap.from(el, { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
  });

  // Los links del menú bajan suave (el smooth de CSS se apaga porque traba el scroll fijo).
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href'); if (id.length < 2) return;
      var dest = $(id); if (!dest) return;
      e.preventDefault();
      window.scrollTo({ top: dest.getBoundingClientRect().top + window.scrollY - 76, behavior: 'smooth' });
    });
  });

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
