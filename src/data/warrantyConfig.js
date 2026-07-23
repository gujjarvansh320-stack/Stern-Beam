// Standard warranty length for every Stern Beam product. Split this into
// per-product years (e.g. from data/products.js) later if different product
// lines ever carry different warranty terms.
export const WARRANTY_YEARS = 2;

/** Adds WARRANTY_YEARS to a purchase date (a 'YYYY-MM-DD' string or Date) and returns a Date. */
export function calculateExpiryDate(purchaseDate) {
  const date = purchaseDate instanceof Date ? new Date(purchaseDate) : new Date(purchaseDate);
  date.setFullYear(date.getFullYear() + WARRANTY_YEARS);
  return date;
}

/** Returns 'active' or 'expired' by comparing an expiry Date against now. */
export function getWarrantyStatus(expiryDate) {
  return expiryDate.getTime() >= Date.now() ? 'active' : 'expired';
}

/** Formats a Date as e.g. "14 Jul 2031" for display. */
export function formatDate(date) {
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}
