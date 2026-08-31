const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');
const backToTop = document.querySelector('[data-back-to-top]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function updateScrollUI() {
  const scrolled = window.scrollY > 20;
  header?.classList.toggle('scrolled', scrolled);
  backToTop?.classList.toggle('visible', window.scrollY > 700);
  updateActiveNav();
}

function closeMenu() {
  if (!menuButton || !nav) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  nav.classList.remove('open');
  document.body.classList.remove('menu-open');
}

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menuButton.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
  nav?.classList.toggle('open', !open);
  document.body.classList.toggle('menu-open', !open);
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

window.addEventListener('resize', () => {
  if (window.innerWidth > 840) closeMenu();
});

window.addEventListener('scroll', updateScrollUI, { passive: true });

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
});

document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

if (reduceMotion || !('IntersectionObserver' in window)) {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -45px' });

  document.querySelectorAll('.reveal').forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    revealObserver.observe(element);
  });
}

const sectionLinks = new Map(
  [...document.querySelectorAll('.site-nav a[href^="#"]')].map((link) => [link.getAttribute('href').slice(1), link])
);

function updateActiveNav() {
  const marker = window.scrollY + Math.min(window.innerHeight * 0.34, 280);
  let activeId = '';

  sectionLinks.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section && section.offsetTop <= marker) activeId = id;
  });

  sectionLinks.forEach((link, id) => {
    const active = id === activeId;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}

updateActiveNav();

window.addEventListener('load', () => {
  if (!window.location.hash) return;
  const target = document.querySelector(window.location.hash);
  if (!target) return;
  window.setTimeout(() => {
    const previousBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    target.scrollIntoView({ block: 'start' });
    window.requestAnimationFrame(() => {
      document.documentElement.style.scrollBehavior = previousBehavior;
    });
  }, 50);
});

updateScrollUI();
