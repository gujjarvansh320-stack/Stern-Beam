/** Drives the preloader progress bar, then fades it out and fires onComplete(). */
export function initPreloader(onComplete) {
  const el = document.getElementById('preloader');
  if (!el) { onComplete?.(); return; }
  const bar = el.querySelector('.preloader-bar span');
  let progress = 0;

  const tick = () => {
    progress += Math.random() * 18;
    if (progress > 100) progress = 100;
    bar.style.width = progress + '%';
    if (progress < 100) {
      setTimeout(tick, 120);
    } else {
      setTimeout(() => {
        el.classList.add('done');
        document.body.classList.add('loaded');
        onComplete?.();
      }, 250);
    }
  };

  window.addEventListener('load', () => setTimeout(tick, 200));
  // Fallback in case 'load' fires very late or already fired
  setTimeout(tick, 2200);
}
