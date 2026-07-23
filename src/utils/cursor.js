/** Custom cursor: a small dot that tracks the mouse exactly, and a lagging
 *  ring that eases toward it. Expands over anything tagged [data-cursor-pop]. */
export function initCursor() {
  if (window.matchMedia('(hover:none), (pointer:coarse)').matches) return;

  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });

  function raf() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(raf);
  }
  raf();

  // Delegated so it also picks up elements rendered by components after this runs.
  document.body.addEventListener('mouseover', (e) => {
    if (e.target.closest('[data-cursor-pop]')) ring.classList.add('hovering');
  });
  document.body.addEventListener('mouseout', (e) => {
    if (e.target.closest('[data-cursor-pop]')) ring.classList.remove('hovering');
  });
}
