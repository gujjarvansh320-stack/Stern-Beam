import './productCard.css';

// Small inline SVG "visual" per product id — swap for a photo/<img> later
// without touching the card markup or styles.
const VISUALS = {
  headlight: `
    <svg viewBox="0 0 200 140" class="product-svg">
      <defs>
        <radialGradient id="gXenon" cx="35%" cy="45%" r="70%">
          <stop offset="0%" stop-color="#EAF7FF"/>
          <stop offset="45%" stop-color="#6EC8FF"/>
          <stop offset="100%" stop-color="#0E3A52" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="70" cy="70" rx="60" ry="50" fill="url(#gXenon)"/>
      <circle cx="70" cy="70" r="30" fill="none" stroke="#8fd6ff" stroke-width="1.2" opacity="0.7"/>
      <circle cx="70" cy="70" r="14" fill="#EAF7FF"/>
      <path d="M115 40 L195 15 M120 70 L198 70 M115 100 L195 125" stroke="#6EC8FF" stroke-width="1" opacity="0.5"/>
    </svg>`,
  fog: `
    <svg viewBox="0 0 200 140" class="product-svg">
      <defs>
        <radialGradient id="gAmber" cx="35%" cy="45%" r="70%">
          <stop offset="0%" stop-color="#FFF3E0"/>
          <stop offset="45%" stop-color="#FFA53E"/>
          <stop offset="100%" stop-color="#4a2a0e" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="70" cy="70" rx="60" ry="50" fill="url(#gAmber)"/>
      <circle cx="70" cy="70" r="34" fill="none" stroke="#ffcf94" stroke-width="1.2" opacity="0.7"/>
      <circle cx="70" cy="70" r="12" fill="#FFF3E0"/>
      <path d="M40 115 Q70 130 100 115" stroke="#FFA53E" stroke-width="1" fill="none" opacity="0.6"/>
    </svg>`,
  bar: `
    <svg viewBox="0 0 200 140" class="product-svg">
      <defs>
        <linearGradient id="gBar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#0E1013" stop-opacity="0"/>
          <stop offset="50%" stop-color="#F5F7FA"/>
          <stop offset="100%" stop-color="#0E1013" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect x="20" y="62" width="160" height="16" rx="8" fill="url(#gBar)"/>
      <g opacity="0.8">
        <rect x="30" y="66" width="4" height="8" fill="#F5F7FA"/>
        <rect x="50" y="66" width="4" height="8" fill="#F5F7FA"/>
        <rect x="70" y="66" width="4" height="8" fill="#F5F7FA"/>
        <rect x="90" y="66" width="4" height="8" fill="#F5F7FA"/>
        <rect x="110" y="66" width="4" height="8" fill="#F5F7FA"/>
        <rect x="130" y="66" width="4" height="8" fill="#F5F7FA"/>
        <rect x="150" y="66" width="4" height="8" fill="#F5F7FA"/>
      </g>
    </svg>`,
  tail: `
    <svg viewBox="0 0 200 140" class="product-svg">
      <defs>
        <radialGradient id="gRed" cx="35%" cy="45%" r="70%">
          <stop offset="0%" stop-color="#FFD9D6"/>
          <stop offset="45%" stop-color="#FF4438"/>
          <stop offset="100%" stop-color="#3a0b08" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="70" cy="70" rx="60" ry="50" fill="url(#gRed)"/>
      <g>
        <rect x="45" y="60" width="8" height="20" rx="3" fill="#FF4438" opacity="0.4"/>
        <rect x="60" y="60" width="8" height="20" rx="3" fill="#FF4438" opacity="0.6"/>
        <rect x="75" y="60" width="8" height="20" rx="3" fill="#FF4438" opacity="0.8"/>
        <rect x="90" y="60" width="8" height="20" rx="3" fill="#FF6A60" opacity="1"/>
      </g>
    </svg>`,
};

/** Renders a single product card's markup from one product data object.
 *  Uses product.image (a real photo) if set; otherwise falls back to the
 *  inline SVG icon in VISUALS, so cards don't break while you're still
 *  photographing some products. */
export function renderProductCard(product) {
  const specs = product.specs
    .map((s) => `<li><span>${s.label}</span><b>${s.value}</b></li>`)
    .join('');

  const visualMarkup = product.image
    ? `<img src="${product.image}" alt="${product.title}" loading="lazy" class="product-photo" />`
    : VISUALS[product.id] || '';

  return `
    <article class="product-card" data-tilt data-glow="${product.glow}">
      <div class="product-card-top">
        <span class="product-tag">${product.tag}</span>
        <h3>${product.title}</h3>
      </div>
      <div class="product-visual${product.image ? ' has-photo' : ''}" data-product="${product.id}">
        ${visualMarkup}
      </div>
      <p class="product-desc">${product.desc}</p>
      <ul class="product-specs">${specs}</ul>
      <a href="#contact" class="product-link" data-cursor-pop>
        Request specs
        <svg width="12" height="12" viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </a>
    </article>
  `;
}

/** Renders the full products section (heading + grid of cards) into the mount point. */
export function renderProductsSection(products, mountSelector = '#products-mount') {
  const mount = document.querySelector(mountSelector);
  if (!mount) return;

  mount.innerHTML = `
    <section class="products" id="products">
      <div class="section-head">
        <p class="eyebrow reveal-up"><span class="eyebrow-dot"></span>THE LINEUP</p>
        <h2 class="reveal-up">Four systems.<br/>One standard of light.</h2>
        <p class="section-desc reveal-up">
          Every unit in the Stern Beam range shares the same optical platform —
          precision-cut reflectors, automotive-grade LEDs and a housing rated
          for whatever the road throws at it.
        </p>
      </div>
      <div class="product-grid">
        ${products.map(renderProductCard).join('')}
      </div>
    </section>
  `;
}

/** Wires up the 3D mouse-tilt + glow-follow interaction on every rendered card. */
export function initProductTilt() {
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    const damp = 18;
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rotateY = (px - 0.5) * damp;
      const rotateX = (0.5 - py) * damp;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      card.style.setProperty('--mx', px * 100 + '%');
      card.style.setProperty('--my', py * 100 + '%');
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}
