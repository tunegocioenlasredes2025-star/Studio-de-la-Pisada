// Studio de la Pisada · sin dependencias.
// El botón flotante de WhatsApp aparece recién después de pasar la portada (arriba ya está el botón grande).
(function () {
  var flota = document.querySelector('.wa-flota');
  var hero = document.querySelector('.hero');
  if (!flota || !hero || !('IntersectionObserver' in window)) return;
  flota.style.transition = 'opacity .25s, transform .25s';
  new IntersectionObserver(function (e) {
    var ver = !e[0].isIntersecting;
    flota.style.opacity = ver ? '1' : '0';
    flota.style.transform = ver ? 'none' : 'translateY(20px)';
    flota.style.pointerEvents = ver ? 'auto' : 'none';
  }).observe(hero);
})();
