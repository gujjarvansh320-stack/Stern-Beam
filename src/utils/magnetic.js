/** Makes any [data-magnetic] element drift slightly toward the cursor on hover. */
export function initMagnetic() {
  document.body.addEventListener('mousemove', (e) => {
    const btn = e.target.closest?.('[data-magnetic]');
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const relX = e.clientX - r.left - r.width / 2;
    const relY = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${relX * 0.28}px, ${relY * 0.35}px)`;
  });

  document.body.addEventListener(
    'mouseout',
    (e) => {
      const btn = e.target.closest?.('[data-magnetic]');
      if (btn) btn.style.transform = 'translate(0,0)';
    },
    true
  );
}
