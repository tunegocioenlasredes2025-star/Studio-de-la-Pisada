const WA = '5491166384242';

// menú mobile
const nav = document.querySelector('.nav');
const burger = document.querySelector('.nav__burger');
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
document.querySelectorAll('.nav__links a').forEach(a =>
  a.addEventListener('click', () => { nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); })
);

// aparición al hacer scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// formulario → WhatsApp
document.getElementById('form').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  const nombre = f.nombre.value.trim();
  if (!nombre) { f.nombre.classList.add('err'); f.nombre.focus(); return; }
  f.nombre.classList.remove('err');
  const lineas = [
    `¡Hola! Soy ${nombre} y quiero coordinar un estudio de la pisada.`,
    f.zona.value.trim() && `Zona: ${f.zona.value.trim()}`,
    `Es ${f.para.value.toLowerCase()}.`,
    f.mensaje.value.trim()
  ].filter(Boolean);
  window.open(`https://wa.me/${WA}?text=${encodeURIComponent(lineas.join('\n'))}`, '_blank', 'noopener');
});

document.getElementById('y').textContent = new Date().getFullYear();
