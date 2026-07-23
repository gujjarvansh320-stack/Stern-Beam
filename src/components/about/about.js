import './about.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function renderValueCard(value) {
  return `
    <div class="value-card">
      <div class="value-icon">${value.icon}</div>
      <h3>${value.title}</h3>
      <p>${value.desc}</p>
    </div>
  `;
}

function renderStat(stat) {
  return `
    <div class="about-stat">
      <span class="about-stat-value" data-counter="${stat.value}" data-suffix="${stat.suffix}">0</span>
      <span class="about-stat-label">${stat.label}</span>
    </div>
  `;
}

/** Renders the About section. Narrative copy is brand-specific and kept
 *  inline here; the values grid and stats strip are data-driven and reusable. */
export function renderAboutSection(values, stats, mountSelector = '#about-mount') {
  const mount = document.querySelector(mountSelector);
  if (!mount) return;

  mount.innerHTML = `
    <section class="about" id="about">
      <div class="about-grid">
        <div class="about-copy">
          <p class="eyebrow reveal-up"><span class="eyebrow-dot"></span>WHO WE ARE</p>
          <h2 class="reveal-up">Founded in the dark,<br/>built for the light.</h2>
          <p class="reveal-up">
            Stern Beam started in 2014 with three automotive engineers and one
            complaint: factory lighting wasn't good enough for the roads we
            actually drove. So we built our own reflectors, sourced our own
            diodes, and tested every unit on unlit backroads until the beam
            pattern was right — not just bright.
          </p>
          <p class="reveal-up">
            A decade later, that's still the whole job. We don't chase lumen
            numbers for the spec sheet. We chase a beam that lands exactly
            where a driver needs it, in weather that would kill a lesser
            housing.
          </p>
          <div class="about-stats reveal-up">
            ${stats.map(renderStat).join('')}
          </div>
        </div>
        <div class="about-values reveal-up">
          ${values.map(renderValueCard).join('')}
        </div>
      </div>
    </section>
  `;
}

/** Animates each [data-counter] element from 0 to its target once it scrolls into view. */
export function initCounters() {
  document.querySelectorAll('[data-counter]').forEach((counterEl) => {
    const target = parseFloat(counterEl.dataset.counter);
    const suffix = counterEl.dataset.suffix || '';
    const state = { val: 0 };
    ScrollTrigger.create({
      trigger: counterEl,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(state, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            counterEl.textContent = Math.round(state.val).toLocaleString() + suffix;
          },
        });
      },
    });
  });
}
