/**
 * Auto-rotating crossfade slideshow for the hero visual.
 * Renders `photos` into the given container and cycles through them.
 */
export function initHeroSlideshow(containerSelector, photos, intervalMs = 4200) {
  const container = document.querySelector(containerSelector);
  if (!container || !photos.length) return { stop() {} };

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  container.innerHTML = `
    <div class="hero-photo-frame">
      ${photos
        .map(
          (p, i) => `
        <div class="hero-slide${i === 0 ? ' active' : ''}" data-index="${i}">
          <img src="${p.src}" alt="${p.alt}" loading="${i === 0 ? 'eager' : 'lazy'}" />
        </div>`
        )
        .join('')}
      <div class="hero-photo-frame-border" aria-hidden="true"></div>
      <div class="hero-slide-dots">
        ${photos
          .map(
            (_, i) => `
          <button class="hero-slide-dot${i === 0 ? ' active' : ''}" data-goto="${i}" aria-label="Show photo ${i + 1}">
            <i></i>
          </button>`
          )
          .join('')}
      </div>
    </div>
  `;

  const slides = [...container.querySelectorAll('.hero-slide')];
  const dots = [...container.querySelectorAll('.hero-slide-dot')];
  let current = 0;
  let timer = null;

  function goTo(index) {
    if (index === current) return;
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    restartTimer();
  }

  function next() {
    goTo((current + 1) % slides.length);
  }

  function restartTimer() {
    if (reducedMotion) return; // don't auto-advance for reduced-motion users
    clearInterval(timer);
    timer = setInterval(next, intervalMs);
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => goTo(parseInt(dot.dataset.goto, 10)));
  });

  // Pause auto-advance while the user is hovering to inspect a photo
  container.addEventListener('mouseenter', () => clearInterval(timer));
  container.addEventListener('mouseleave', restartTimer);

  restartTimer();

  return {
    stop() {
      clearInterval(timer);
    },
  };
}
