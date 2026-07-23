import './hero.css';
import gsap from 'gsap';
// Photo slideshow was here before — src/components/hero/heroSlideshow.js and
// src/data/heroPhotos.js still exist if you want photos back later. To
// re-enable: import { initHeroSlideshow } from './heroSlideshow.js' and
// { heroPhotos } from '../../data/heroPhotos.js', add back
// <div class="hero-slideshow-mount" id="heroSlideshowMount"></div> as the
// first child of .hero below, and call
// initHeroSlideshow('#heroSlideshowMount', heroPhotos) from main.js.

/** Renders the hero section (photo slideshow mount + copy + spec strip). */
export function renderHero(mountSelector = '#hero-mount') {
  const mount = document.querySelector(mountSelector);
  if (!mount) return;

  mount.innerHTML = `
    <section class="hero" id="home">
      <div class="hero-vignette" aria-hidden="true"></div>

      <div class="hero-content">
        <p class="eyebrow reveal-up">
          <span class="eyebrow-dot"></span>AUTOMOTIVE LIGHTING SYSTEMS
        </p>
        <h1 class="hero-title">
          <span class="line" data-line>Light built to</span>
          <span class="line" data-line><em>cut through</em> anything.</span>
        </h1>
        <p class="hero-sub reveal-up">
          Stern Beam engineers headlights, fog lamps and LED systems for
          drivers who refuse to compromise on visibility — tested on real
          roads, not just on paper.
        </p>
        <div class="hero-actions reveal-up">
          <a href="#products" class="btn btn-primary" data-cursor-pop data-magnetic>
            Explore Products
            <svg width="16" height="16" viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a>
          <a href="#about" class="btn btn-ghost" data-cursor-pop data-magnetic>Our Story</a>
        </div>
      </div>

      <div class="hero-specs reveal-up">
        <div class="hero-spec">
          <span class="hero-spec-value">32,000</span>
          <span class="hero-spec-label">Max Lumens Output</span>
        </div>
        <div class="hero-spec-divider"></div>
        <div class="hero-spec">
          <span class="hero-spec-value">600M</span>
          <span class="hero-spec-label">Effective Beam Range</span>
        </div>
        <div class="hero-spec-divider"></div>
        <div class="hero-spec">
          <span class="hero-spec-value">IP68</span>
          <span class="hero-spec-label">Ingress Protection</span>
        </div>
        <div class="hero-spec-divider"></div>
        <div class="hero-spec">
          <span class="hero-spec-value">2 YR</span>
          <span class="hero-spec-label">Beam Warranty</span>
        </div>
      </div>

      <div class="scroll-cue" aria-hidden="true">
        <span>SCROLL</span>
        <div class="scroll-cue-line"><i></i></div>
      </div>
    </section>
  `;
}

/** Plays the staggered text-reveal intro once the preloader finishes. */
export function playHeroIntro() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.fromTo('[data-line]', { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.12 })
    .to('.hero-content .eyebrow', { opacity: 1, y: 0, duration: 0.7 }, '-=0.7')
    .to('.hero-sub', { opacity: 1, y: 0, duration: 0.7 }, '-=0.55')
    .to('.hero-actions', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
    .to('.hero-specs', { opacity: 1, y: 0, duration: 0.8 }, '-=0.4');
}
