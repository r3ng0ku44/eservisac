const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('#nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');
const pageViews = document.querySelectorAll('.page-view');
const pageLinks = document.querySelectorAll('[data-page]');

const closeMenu = () => {
  navMenu?.classList.remove('open');
  navToggle?.classList.remove('open');
  navToggle?.setAttribute('aria-expanded', 'false');
};

navToggle?.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

const showPage = (pageId, updateHash = true) => {
  const targetId = document.getElementById(pageId) ? pageId : 'inicio';

  pageViews.forEach((page) => {
    page.classList.toggle('active', page.id === targetId);
  });

  pageLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset.page === targetId);
  });

  document.title = `${document.getElementById(targetId)?.dataset.title || 'Inicio'} | ESERVISAC`;

  if (updateHash && location.hash !== `#${targetId}`) {
    history.pushState(null, '', `#${targetId}`);
  }

  window.scrollTo({ top: 0, behavior: 'instant' });
  closeMenu();
  revealVisibleItems();
};

pageLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const pageId = link.dataset.page;
    if (!pageId) return;
    event.preventDefault();
    showPage(pageId, true);
  });
});

window.addEventListener('popstate', () => {
  showPage(location.hash.replace('#', '') || 'inicio', false);
});

window.addEventListener('hashchange', () => {
  showPage(location.hash.replace('#', '') || 'inicio', false);
});

const revealElements = document.querySelectorAll('.reveal');
const revealVisibleItems = () => {
  revealElements.forEach((el) => {
    const page = el.closest('.page-view');
    if (page?.classList.contains('active')) el.classList.add('visible');
  });
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
revealElements.forEach((el) => observer.observe(el));

showPage(location.hash.replace('#', '') || 'inicio', false);

document.querySelector('#year').textContent = new Date().getFullYear();

/* Slider de la pantalla principal: si gusta ud edita aquí las imágenes si desea puede cambiarlas. Atte linder */
const slides = [...document.querySelectorAll('.hero-slide')];
const dots = [...document.querySelectorAll('.slider-dots button')];
let currentSlide = 0;
let sliderTimer;

const setSlide = (index) => {
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle('active', i === currentSlide));
  dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
};

const startSlider = () => {
  clearInterval(sliderTimer);
  sliderTimer = setInterval(() => setSlide(currentSlide + 1), 4500);
};

dots.forEach((dot) => {
  dot.addEventListener('click', () => {
    setSlide(Number(dot.dataset.slide));
    startSlider();
  });
});

if (slides.length) startSlider();

const form = document.querySelector('#contact-form');
const note = document.querySelector('#form-note');
form?.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const nombre = data.get('nombre');
  const contacto = data.get('contacto');
  const servicio = data.get('servicio');
  const mensaje = data.get('mensaje');

  const subject = encodeURIComponent(`Consulta web ESERVISAC - ${servicio}`);
  const body = encodeURIComponent(
    `Nombre / Empresa: ${nombre}\n` +
    `Correo o teléfono: ${contacto}\n` +
    `Servicio o producto: ${servicio}\n\n` +
    `Mensaje:\n${mensaje}`
  );

  /* EDITAR AQUÍ: reemplazar aqui  ventas@eservisac.com.pe por el correo oficial de destino. atte linder */
  window.location.href = `mailto:ventas@eservisac.com.pe?subject=${subject}&body=${body}`;
  note.textContent = 'Tu consulta está lista para enviarse desde tu correo.';
});
