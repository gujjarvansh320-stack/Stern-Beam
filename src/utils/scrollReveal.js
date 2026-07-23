import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Fades/slides in every .reveal-up element currently in the DOM, plus
 * staggers the direct children of any `.product-grid, .journal-grid,
 * .about-values` container. Call this AFTER all components have rendered
 * their markup (since ScrollTrigger needs the elements to exist).
 */
export function initScrollReveal() {
  document.querySelectorAll('.reveal-up').forEach((el) => {
    if (el.closest('.hero-content') || el.closest('.hero-specs')) return; // hero handles its own intro
    gsap.fromTo(
      el,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      }
    );
  });

  gsap.utils.toArray('.product-grid, .journal-grid, .about-values').forEach((grid) => {
    gsap.from(grid.children, {
      opacity: 0,
      y: 34,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: grid, start: 'top 85%', once: true },
    });
  });
}
