/* =========================================================================
   STERN BEAM — main.js
   This file no longer contains section markup or feature logic itself.
   It only:
     1. imports global styles + data
     2. renders each component into its mount point
     3. initializes each component's behavior (incl. the hero photo slideshow)
   Look inside src/components/*, and src/utils/* for the actual implementations.
   ========================================================================= */

import './styles/global.css';

// data
import { products } from './data/products.js';
import { journalPosts } from './data/journal.js';
import { values, stats } from './data/stats.js';

// components
import { renderNav, initNav } from './components/nav/nav.js';
import { renderHero, playHeroIntro } from './components/hero/hero.js';
import { renderProductsSection, initProductTilt } from './components/product-card/productCard.js';
import { renderWarrantySection, initWarrantyForms } from './components/warranty/warranty.js';
import { renderAboutSection, initCounters } from './components/about/about.js';
import { renderJournalSection } from './components/journal-card/journalCard.js';
import { renderContactSection, initContactForm } from './components/contact-form/contactForm.js';
import { renderFooter, initNewsletterForm } from './components/footer/footer.js';

// utils
import { initPreloader } from './utils/preloader.js';
import { initCursor } from './utils/cursor.js';
import { initMagnetic } from './utils/magnetic.js';
import { initScrollReveal } from './utils/scrollReveal.js';

function renderPage() {
  renderNav('#nav-mount');
  renderHero('#hero-mount');
  renderProductsSection(products, '#products-mount');
  renderWarrantySection('#warranty-mount');
  renderAboutSection(values, stats, '#about-mount');
  renderJournalSection(journalPosts, '#journal-mount');
  renderContactSection('#contact-mount');
  renderFooter(products, '#footer-mount');
}

function initPage() {
  initNav();
  initProductTilt();
  initWarrantyForms();
  initCounters();
  initContactForm();
  initNewsletterForm();
  initCursor();
  initMagnetic();
  initScrollReveal();
}

// 1. Build the DOM from components
renderPage();

// 2. Wire up behavior for everything just rendered
initPage();

// 3. Run the preloader, then play the hero's text-reveal intro
initPreloader(() => {
  playHeroIntro();
});
