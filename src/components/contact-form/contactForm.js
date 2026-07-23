import './contactForm.css';
// import { FaInstagramSquare } from "react-icons/fa";

/** Renders the full contact section: info column + form. */
export function renderContactSection(mountSelector = '#contact-mount') {
  const mount = document.querySelector(mountSelector);
  if (!mount) return;

  mount.innerHTML = `
    <section class="contact" id="contact">
      <div class="contact-grid">
        <div class="contact-info reveal-up">
          <p class="eyebrow"><span class="eyebrow-dot"></span>GET IN TOUCH</p>
          <h2>Talk to our lighting engineers</h2>
          <p class="section-desc" style="margin-left:0;">
            Fitment question, bulk order, or a beam pattern that doesn't look
            right — our engineers answer their own inbox.
          </p>
          <ul class="contact-list">
            <li>
              <span class="contact-list-label">Phone</span>
              <a href="tel:+91 8950814822">+91 8950814822</a>
            </li>
            <li>
              <span class="contact-list-label">Email</span>
              <a href="mailto:Sternbeamindia6@gmail.com">Sternbeamindia6@gmail.com</a>
            </li>
            <li>
              <span class="contact-list-label">Workshop</span>
              <span>Hisar,Haryana</span>
            </li>
          </ul>
          <div class="contact-social">
            <a href="https://www.instagram.com/stern_beam_india?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" aria-label="Instagram" data-cursor-pop>IG</a>
          </div>
        </div>

        <form class="contact-form reveal-up" id="contactForm" novalidate>
          <div class="form-row">
            <div class="form-field">
              <label for="fName">Full name</label>
              <input type="text" id="fName" name="name" placeholder="John Carter" required />
            </div>
            <div class="form-field">
              <label for="fEmail">Email</label>
              <input type="email" id="fEmail" name="email" placeholder="john@email.com" required />
            </div>
          </div>
          <div class="form-field">
            <label for="fVehicle">Vehicle model</label>
            <input type="text" id="fVehicle" name="vehicle" placeholder="e.g. 2021 Ford Ranger" />
          </div>
          <div class="form-field">
            <label for="fMessage">Message</label>
            <textarea id="fMessage" name="message" rows="4" placeholder="Tell us what you're fitting and what you need..." required></textarea>
          </div>
          <button type="submit" class="btn btn-primary form-submit" data-magnetic>
            <span class="btn-label">Send message</span>
            <span class="btn-sending">Sending<i>.</i><i>.</i><i>.</i></span>
          </button>
          <p class="form-success" id="formSuccess" role="status">Message sent — an engineer will reply within one business day.</p>
        </form>
      </div>
    </section>
  `;
}

export function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    
    // Show visual feedback
    btn.classList.add('sending');
    successMsg.classList.remove('show');

    // 1. Gather form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const vehicle = formData.get('vehicle') || 'Not specified';
    const message = formData.get('message');

    // 2. Format the message string for WhatsApp
    const wpMessage = `*New Contact Request*\n\n*Name:* ${name}\n*Email:* ${email}\n*Vehicle:* ${vehicle}\n\n*Message:*\n${message}`;

    // 3. Set your WhatsApp number (Include country code)
    const myWhatsAppNumber = "918950814822"; // <-- REPLACE WITH YOUR ACTUAL NUMBER
    
    // Safety check: This removes everything except numbers (strips +, spaces, dashes)
    const cleanNumber = myWhatsAppNumber.replace(/[^0-9]/g, ""); 

    // 4. Open WhatsApp in a new tab using the reliable API endpoint
    const wpUrl = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodeURIComponent(wpMessage)}`;
    window.open(wpUrl, '_blank');

    // 5. Reset form and show success
    btn.classList.remove('sending');
    successMsg.classList.add('show');
    contactForm.reset();
  });
}