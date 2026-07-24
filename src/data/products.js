// Each object here renders one <product-card> via renderProductCard().
// Add a new product by adding a new object — no markup duplication needed.
//
// To use a real photo instead of the built-in SVG icon: drop your image
// file into /public/photos/products/ and add an `image` field pointing to
// it, e.g. image: '/photos/products/headlight.jpg'. Leave `image` out (or
// set it to null) and the card falls back to the SVG icon automatically.
export const products = [
  {
    id: "headlight",
    glow: "xenon",
    tag: "Headlight Series",
    title: "LED Headlights",
    image: "./photos/hero-car-1.PNG", // e.g. '/photos/products/headlight.jpg'
    desc: "Built with advanced german LED technology, our 180W LED Headlight delivers unmatched brightness, superior beam focus, and long-lasting reliability for a safer and more confident drive.",
    specs: [
      { label: "Output", value: "18,000 LM" },
      { label: "Color Temp", value: "6,000K" },
      { label: "Rating", value: "IP68" },
      { label: "Watt", value: "180W" },
    ],
  },
  {
    id: "fog",
    glow: "amber",
    tag: "Headlight Series",
    title: "LED Headlights",
    image: "./photos/hero-car-2.PNG", // e.g. '/photos/products/fog-lamp.jpg'
desc: "Built with advanced german LED technology, our 240W LED Headlight delivers unmatched brightness, superior beam focus, and long-lasting reliability for a safer and more confident drive.",    specs: [
      { label: "Output", value: "24,000 LM" },
      { label: "Color Temp", value: "6,000k" },
      { label: "Rating", value: "IP68" },
      { label: "Watt", value: "240W" },
    ],
  },
  {
    id: "bar",
    glow: "white",
    tag: "Headlight Series",
    title: "LED Headlights",
    image: "./photos/hero-car-3.PNG", // e.g. '/photos/products/light-bar.jpg'
desc: "Built with advanced german LED technology, our 320W LED Headlight delivers unmatched brightness, superior beam focus, and long-lasting reliability for a safer and more confident drive.",    
specs: [
      { label: "Output", value: "32,000 LM" },
      { label: "Color Temp", value: "6,000K" },
      { label: "Rating", value: "IP68" },
      { label: "Watt", value: "320W" },
    ],
  },
  {
    id: "tail",
    glow: "red",
    tag: "Projector Series",
    title: "Projector",
    image: "./photos/hero-car-4.PNG", // e.g. '/photos/products/tail-light.jpg'
    desc: "Experience the next level of driving performance with our 150W Laser projector. Designed to deliver ultra-bright illumination with both power and precision, ensuring safety and confident on every journey.",
    specs: [
      { label: "Color", value: "Single Color" },
      { label: "Beam", value: "High Beam with Laser" },
      { label: "Rating", value: "IP68" },
      { label: "Watt", value: "150W" },
    ],
  },
  {
    id: "headlight",
    glow: "xenon",
    tag: "Projector Series",
    title: "Projector",
    image: "./photos/hero-car-5.PNG", // e.g. '/photos/products/headlight.jpg'
    desc: "Experience the next level of driving performance with our 160W Laser projector. Designed to deliver ultra-bright illumination with both power and precision, ensuring safety and confident on every journey.",
    specs: [
      { label: "Color", value: "Tri Color" },
      { label: "Beam", value: "High Beam With Laser" },
      { label: "Rating", value: "IP68" },
      { label: "Watt", value: "160W" },
    ],
  },
  {
    id: "headlight",
    glow: "xenon",
    tag: "Auxilliary Series",
    title: "Auxilliary Light",
    image: "./photos/hero-car-6.PNG", // e.g. '/photos/products/headlight.jpg'
    desc: "Drive with confidence using our premium auxiliary lights, delivering powerful illumination, superior visibility, and dependable performance wherever the road takes you.",
    specs: [
      { label: "Output", value: "18,000 LM" },
      { label: "Color Temp", value: "6,000K" },
      { label: "Rating", value: "IP68" },
    ],
  },
];
