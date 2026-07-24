import './footer.css';
import { navLinks } from '../../data/navLinks.js';

/** Renders the footer, reusing navLinks and a product title list so both
 *  stay in sync with the nav and products section automatically. */
export function renderFooter(products, mountSelector = '#footer-mount') {
  const mount = document.querySelector(mountSelector);
  if (!mount) return;

  const siteLinks = navLinks.map((l) => `<a href="${l.href}">${l.label}</a>`).join('');
  const productLinks = products
    .map((p) => `<a href="#products">${p.title}</a>`)
    .join('');

  mount.innerHTML = `
    <footer class="footer">
      <div class="footer-top">
        <div class="footer-brand">
          <span class="nav-logo-text">STERN&nbsp;BEAM</span>
          <p>Automotive lighting systems, engineered for real roads.</p>
        </div>
        <div class="footer-cols">
          <div class="footer-col">
            <h4>Site</h4>
            ${siteLinks}
          </div>
          <div class="footer-col">
            <h4>Products</h4>
            ${productLinks}
          </div>
          <div class="footer-col footer-newsletter">
            <h4>Stay in the loop</h4>
            <p>New releases and beam-testing notes, once a month.</p>
            <form class="newsletter-form" id="newsletterForm">
              <input type="email" placeholder="you@email.com" required />
              <button type="submit" aria-label="Subscribe">
                <svg width="16" height="16" viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
            </form>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
<p>&copy; 2026 Stern Beam Lighting Co. All Rights Reserved. | Designed & Developed by <a href="https://elitewebagency.in" target="_blank" rel="noopener noreferrer" class="agency-link">Elite Web Agency</a></p>    </footer>
  `;
}

/** Wires up the (client-side simulated) newsletter submit. */
export function initNewsletterForm() {
  const newsletterForm = document.getElementById('newsletterForm');
  if (!newsletterForm) return;

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input');
    const btn = newsletterForm.querySelector('button');
    const original = input.placeholder;
    input.value = '';
    input.placeholder = 'Subscribed ✓';
    btn.style.opacity = '0.6';
    setTimeout(() => {
      input.placeholder = original;
      btn.style.opacity = '1';
    }, 2200);
  });
}
