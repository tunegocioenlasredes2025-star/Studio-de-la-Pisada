const WA = '5491166384242';

/* ---------- menú mobile ---------- */
const nav = document.querySelector('.nav');
const burger = document.querySelector('.nav__burger');
if (nav && burger) {
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  document.querySelectorAll('.nav__links a').forEach(a =>
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded', false);
    })
  );
}

/* ---------- aparición al hacer scroll ----------
   NO se usa IntersectionObserver a propósito: con un scroll rápido las secciones
   pasan entre frames, no se registran y quedan invisibles para siempre.
   Acá se mide la posición real en cada scroll, y a los 4 s se muestra todo igual. */
const revelables = [...document.querySelectorAll('.reveal')];
let pedido = false;
function revisar() {
  pedido = false;
  const alto = window.innerHeight;
  for (let i = revelables.length - 1; i >= 0; i--) {
    const el = revelables[i];
    if (el.getBoundingClientRect().top < alto - 60) {
      el.classList.add('in');
      revelables.splice(i, 1);
    }
  }
}
function pedirRevision() {
  if (!pedido) { pedido = true; requestAnimationFrame(revisar); }
}
addEventListener('scroll', pedirRevision, { passive: true });
addEventListener('resize', pedirRevision, { passive: true });
revisar();
setTimeout(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('in')), 4000);

/* ---------- formularios → WhatsApp ---------- */
function enviarPorWhatsApp(form, armarMensaje) {
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target;
    const val = n => (f[n] && f[n].value ? f[n].value.trim() : '');

    // nombre y teléfono son los dos únicos obligatorios
    let error = null;
    if (!val('nombre')) error = f.nombre;
    else if (f.tel && !val('tel')) error = f.tel;
    [f.nombre, f.tel].forEach(c => c && c.classList.remove('err'));
    if (error) { error.classList.add('err'); error.focus(); return; }

    const texto = armarMensaje(val).filter(Boolean).join('\n');
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
  });
}

// consulta general (inicio)
enviarPorWhatsApp(document.getElementById('form'), val => [
  `¡Hola! Soy ${val('nombre')}.`,
  val('quien') && `${val('quien')}.`,
  val('zona') && `Localidad: ${val('zona')}`,
  val('tel') && `Mi teléfono: ${val('tel')}`,
  val('mensaje')
]);

// comodato (profesionales)
enviarPorWhatsApp(document.getElementById('form-pro'), val => [
  `¡Hola! Soy ${val('nombre')} y quiero información sobre el podógrafo en comodato.`,
  val('especialidad') && `Especialidad: ${val('especialidad')}`,
  val('matricula') && `Matrícula: ${val('matricula')}`,
  val('zona') && `Consultorio en: ${val('zona')}`,
  val('volumen') && `Pacientes por semana que podrían necesitarlo: ${val('volumen')}`,
  val('tel') && `Mi teléfono: ${val('tel')}`,
  val('mensaje')
]);

const anio = document.getElementById('y');
if (anio) anio.textContent = new Date().getFullYear();
