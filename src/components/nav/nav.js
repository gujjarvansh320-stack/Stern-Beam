import './nav.css';
import { navLinks } from '../../data/navLinks.js';

/**
 * Builds the desktop nav + mobile menu markup from the shared
 * navLinks data, and injects it into the given mount element.
 */
export function renderNav(mountSelector = '#nav-mount') {
  const mount = document.querySelector(mountSelector);
  if (!mount) return;

  const desktopLinks = navLinks
    .map(
      (link, i) =>
        `<a href="${link.href}" class="nav-link${i === 0 ? ' active' : ''}" data-cursor-pop>${link.label}</a>`
    )
    .join('');

  const mobileLinks = navLinks
    .map((link) => `<a href="${link.href}" class="mobile-link">${link.label}</a>`)
    .join('');

  mount.innerHTML = `
    <header class="nav" id="siteNav">
      <a href="#home" class="nav-logo" data-cursor-pop>
        <span class="nav-logo-mark">
          <svg viewBox="0 0 40 40" width="30" height="30" aria-hidden="true">
            <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" stroke-width="1.4"/>
            <circle cx="20" cy="20" r="7" fill="currentColor"/>
            <line x1="20" y1="1" x2="20" y2="8" stroke="currentColor" stroke-width="1.4"/>
            <line x1="20" y1="32" x2="20" y2="39" stroke="currentColor" stroke-width="1.4"/>
          </svg>
        </span>
        <span class="nav-logo-text">STERN&nbsp;BEAM</span>
      </a>

      <nav class="nav-links" id="navLinks">${desktopLinks}</nav>

      <a href="#contact" class="btn btn-primary nav-cta" data-cursor-pop>Get a Quote</a>

      <button class="nav-burger" id="navBurger" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </header>

    <div class="mobile-menu" id="mobileMenu">
      ${mobileLinks}
      <a href="#contact" class="btn btn-primary" style="margin-top:24px;">Get a Quote</a>
    </div>

    <div class="scroll-progress" id="scrollProgress"></div>
  `;
}

/** Wires up scroll state, active-link tracking, mobile toggle, and the scroll-progress bar. */
export function initNav() {
  const navEl = document.getElementById('siteNav');
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  const progressBar = document.getElementById('scrollProgress');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');
  if (!navEl) return;

  function onScroll() {
    navEl.classList.toggle('scrolled', window.scrollY > 40);
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - doc.clientHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  mobileMenu.querySelectorAll('.mobile-link').forEach((l) =>
    l.addEventListener('click', () => {
      burger.classList.remove('open');
      mobileMenu.classList.remove('open');
    })
  );

  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove('active'));
          const match = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
          if (match) match.classList.add('active');
        }
      });
    },
    { rootMargin: '-45% 0px -45% 0px' }
  );
  sections.forEach((s) => activeObserver.observe(s));
}