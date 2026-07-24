// import './warranty.css';
// import { lookupWarranty } from '../../utils/warrantyApi.js';
// import { calculateExpiryDate, getWarrantyStatus, formatDate, WARRANTY_YEARS } from '../../data/warrantyConfig.js';

// /** Renders the public warranty section: info column + status lookup card.
//  *  Registration is admin-only — see /admin.html — so there's no register
//  *  form here, only a way for customers to check an existing warranty. */
// export function renderWarrantySection(mountSelector = '#warranty-mount') {
//   const mount = document.querySelector(mountSelector);
//   if (!mount) return;

//   mount.innerHTML = `
//     <section class="warranty" id="warranty">
//       <div class="warranty-grid">
//         <div class="warranty-info reveal-up">
//           <p class="eyebrow"><span class="eyebrow-dot"></span>PROTECT YOUR PURCHASE</p>
//           <h2>Check your e-warranty</h2>
//           <p class="section-desc" style="margin-left:0;">
//             Every Stern Beam product ships with a ${WARRANTY_YEARS}-year warranty,
//             registered by your dealer at the time of purchase. Enter your
//             serial number and email below to check its status.
//           </p>
//           <div class="warranty-points">
//             <div class="warranty-point">
//               <span class="warranty-point-icon">
//                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2l8 4v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6l8-4z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>
//               </span>
//               <p><strong>${WARRANTY_YEARS} years of coverage</strong>Starting from your purchase date, on every product line.</p>
//             </div>
//             <div class="warranty-point">
//               <span class="warranty-point-icon">
//                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 12l6 6L20 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
//               </span>
//               <p><strong>Registered at purchase</strong>Your dealer registers your product for you — no sign-up needed.</p>
//             </div>
//           </div>
//         </div>

//         <div class="warranty-card reveal-up">
//           <form class="warranty-panel active" id="warrantyLookupForm" novalidate>
//             <div class="warranty-row">
//               <div class="warranty-field">
//                 <label for="lSerial">Serial number</label>
//                 <input type="text" id="lSerial" name="serial" placeholder="e.g. SB-2026-004821" required />
//               </div>
//               <div class="warranty-field">
//                 <label for="lEmail">Email used at registration</label>
//                 <input type="email" id="lEmail" name="email" placeholder="john@email.com" required />
//               </div>
//             </div>
//             <button type="submit" class="btn btn-primary warranty-submit" data-magnetic>
//               <span class="btn-label">Check status</span>
//               <span class="btn-sending">Checking<i>.</i><i>.</i><i>.</i></span>
//             </button>
//             <p class="warranty-message" id="lookupMessage" role="status"></p>
//             <div class="warranty-result" id="warrantyResult"></div>
//           </form>
//         </div>
//       </div>
//     </section>
//   `;
// }

// function showMessage(el, text, type) {
//   el.textContent = text;
//   el.className = `warranty-message show ${type}`;
// }

// function setSending(button, isSending) {
//   button.classList.toggle('sending', isSending);
//   button.disabled = isSending;
// }

// /** Wires up the status-lookup form. */
// export function initWarrantyForms() {
//   const lookupForm = document.getElementById('warrantyLookupForm');
//   if (!lookupForm) return; // section not rendered

//   const lookupMessage = document.getElementById('lookupMessage');
//   const resultBox = document.getElementById('warrantyResult');

//   lookupForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const button = lookupForm.querySelector('.warranty-submit');
//     setSending(button, true);
//     lookupMessage.classList.remove('show');
//     resultBox.classList.remove('show');

//     const formData = new FormData(lookupForm);
//     const serial = formData.get('serial');
//     const email = formData.get('email');

//     try {
//       const record = await lookupWarranty(serial, email);

//       if (!record) {
//         showMessage(lookupMessage, 'No registration found for that serial number and email.', 'error');
//         setSending(button, false);
//         return;
//       }

//       const expiry = calculateExpiryDate(record.purchaseDate);
//       const status = getWarrantyStatus(expiry);

//       resultBox.innerHTML = `
//         <div class="warranty-result-top">
//           <strong>${record.productTitle}</strong>
//           <span class="warranty-status-badge ${status}">${status}</span>
//         </div>
//         <div class="warranty-result-rows">
//           <div class="warranty-result-row"><span>Serial number</span><b>${record.serial}</b></div>
//           <div class="warranty-result-row"><span>Registered to</span><b>${record.name}</b></div>
//           <div class="warranty-result-row"><span>Purchase date</span><b>${formatDate(new Date(record.purchaseDate))}</b></div>
//           <div class="warranty-result-row"><span>Expires</span><b>${formatDate(expiry)}</b></div>
//         </div>
//       `;
//       resultBox.classList.add('show');
//     } catch (err) {
//       console.error('Warranty lookup failed:', err);
//       showMessage(lookupMessage, "Couldn't reach the server. Please try again in a moment.", 'error');
//     } finally {
//       setSending(button, false);
//     }
//   });
// }




import './warranty.css';
import { lookupWarranty } from '../../utils/warrantyApi.js';
// Removed 'calculateExpiryDate' since we will trust the database expiry date now
import { getWarrantyStatus, formatDate, WARRANTY_YEARS } from '../../data/warrantyConfig.js'; 

/** Renders the public warranty section: info column + status lookup card.
 *  Registration is admin-only — see /admin.html — so there's no register
 *  form here, only a way for customers to check an existing warranty. */
export function renderWarrantySection(mountSelector = '#warranty-mount') {
  const mount = document.querySelector(mountSelector);
  if (!mount) return;

  mount.innerHTML = `
    <section class="warranty" id="warranty">
      <div class="warranty-grid">
        <div class="warranty-info reveal-up">
          <p class="eyebrow"><span class="eyebrow-dot"></span>PROTECT YOUR PURCHASE</p>
          <h2>Check your e-warranty</h2>
          <p class="section-desc" style="margin-left:0;">
            Every Stern Beam product ships with a ${WARRANTY_YEARS}-year warranty,
            registered by your dealer at the time of purchase. Enter your
            car number and email below to check its status.
          </p>
          <div class="warranty-points">
            <div class="warranty-point">
              <span class="warranty-point-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2l8 4v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6l8-4z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>
              </span>
              <p><strong>${WARRANTY_YEARS} years of coverage</strong>Starting from your purchase date, on every product line.</p>
            </div>
            <div class="warranty-point">
              <span class="warranty-point-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 12l6 6L20 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>
              <p><strong>Registered at purchase</strong>Your dealer registers your product for you — no sign-up needed.</p>
            </div>
          </div>
        </div>

        <div class="warranty-card reveal-up">
          <form class="warranty-panel active" id="warrantyLookupForm" novalidate>
            <div class="warranty-row">
              <div class="warranty-field">
                <label for="lCarNumber">Car number</label>
                <input type="text" id="lCarNumber" name="carNumber" placeholder="e.g. HR 20 AB 1234" required />
              </div>
              <div class="warranty-field">
                <label for="lEmail">Email used at registration</label>
                <input type="email" id="lEmail" name="email" placeholder="martin@email.com" required />
              </div>
            </div>
            <button type="submit" class="btn btn-primary warranty-submit" data-magnetic>
              <span class="btn-label">Check status</span>
              <span class="btn-sending">Checking<i>.</i><i>.</i><i>.</i></span>
            </button>
            <p class="warranty-message" id="lookupMessage" role="status"></p>
            <div class="warranty-result" id="warrantyResult"></div>
          </form>
        </div>
      </div>
    </section>
  `;
}

function showMessage(el, text, type) {
  el.textContent = text;
  el.className = `warranty-message show ${type}`;
}

function setSending(button, isSending) {
  button.classList.toggle('sending', isSending);
  button.disabled = isSending;
}

/** Wires up the status-lookup form. */
export function initWarrantyForms() {
  const lookupForm = document.getElementById('warrantyLookupForm');
  if (!lookupForm) return; // section not rendered

  const lookupMessage = document.getElementById('lookupMessage');
  const resultBox = document.getElementById('warrantyResult');

  lookupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const button = lookupForm.querySelector('.warranty-submit');
    setSending(button, true);
    lookupMessage.classList.remove('show');
    resultBox.classList.remove('show');

    const formData = new FormData(lookupForm);
    const carNumber = formData.get('carNumber'); // Grabs car number instead of serial
    const email = formData.get('email');

    try {
      const record = await lookupWarranty(carNumber, email);

      if (!record) {
        showMessage(lookupMessage, 'No registration found for that car number and email.', 'error');
        setSending(button, false);
        return;
      }

      // Uses the exact expiry date calculated by your backend database (Fixes the 5-year bug!)
      // const expiry = new Date(record.ExpiryDate);
      // const status = getWarrantyStatus(expiry);

// Determine if the product is a projector (case-insensitive check)
      const productName = (record.productTitle || '').toLowerCase();
      const isProjector = productName.includes('projector');
      
      let expiry;
      
      if (isProjector) {
        // Calculate exactly 1 year from the original purchase date
        const purchaseDate = new Date(record.purchaseDate);
        expiry = new Date(purchaseDate);
        expiry.setFullYear(expiry.getFullYear() + 1);
      } else {
        // Fall back to the database expiry (e.g., standard 2 years)
        expiry = new Date(record.ExpiryDate);
      }
      
      const status = getWarrantyStatus(expiry);

      resultBox.innerHTML = `
        <div class="warranty-result-top">
          <strong>${record.productTitle}</strong>
          <span class="warranty-status-badge ${status}">${status}</span>
        </div>
        <div class="warranty-result-rows">
          <div class="warranty-result-row"><span>Car number</span><b>${record.carNumber || 'N/A'}</b></div>
          <div class="warranty-result-row"><span>Serial number</span><b>${record.serial}</b></div>
          <div class="warranty-result-row"><span>Registered to</span><b>${record.name}</b></div>
          <div class="warranty-result-row"><span>Purchase date</span><b>${formatDate(new Date(record.purchaseDate))}</b></div>
          <div class="warranty-result-row"><span>Expires</span><b>${formatDate(expiry)}</b></div>
        </div>
      `;
      resultBox.classList.add('show');
    } catch (err) {
      console.error('Warranty lookup failed:', err);
      showMessage(lookupMessage, "Couldn't reach the server. Please try again in a moment.", 'error');
    } finally {
      setSending(button, false);
    }
  });
}