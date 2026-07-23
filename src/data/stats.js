// Value cards in the About section — icon is inline SVG markup (kept small,
// swap for an <img> src if you move to real icon files).
export const values = [
  {
    title: "Precision optics",
    desc: "Reflectors cut to within fractions of a millimetre for a clean, glare-free beam edge.",
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.4"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  },
  {
    title: "Real-world testing",
    desc: "Every housing spends weeks on unlit roads and closed test tracks before it ships.",
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 12l6 6L20 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  },
  {
    title: "Weatherproof by design",
    desc: "IP66–IP69K housings, sealed and pressure-tested against rain, dust and jet wash.",
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2l8 4v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6l8-4z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
  },
  {
    title: "Lifetime beam support",
    desc: "Free beam-alignment guidance for the life of the product, from our own engineers.",
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3v18M5 8l7-5 7 5M5 8v9a2 2 0 002 2h10a2 2 0 002-2V8" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
  },
];

// Animated counters in the About section.
export const stats = [
  { value: 12, suffix: "", label: "Years engineering light" },
  { value: 480, suffix: "K+", label: "Vehicles fitted" },
  { value: 34, suffix: "", label: "Countries shipped" },
  { value: 6200, suffix: "+", label: "Dyno & road test hours" },
];
