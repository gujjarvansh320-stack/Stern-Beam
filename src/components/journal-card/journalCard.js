// import './journalCard.css';

// /** Renders a single journal/blog card from one post data object. */
// export function renderJournalCard(post) {
//   return `
//     <article class="journal-card reveal-up" data-cursor-pop>
//       <div class="journal-thumb" data-thumb="${post.id}"></div>
//       <div class="journal-body">
//         <span class="journal-tag">${post.tag}</span>
//         <h3>${post.title}</h3>
//         <p>${post.desc}</p>
//         <span class="journal-meta">${post.readTime}</span>
//       </div>
//     </article>
//   `;
// }

// /** Renders the full journal section (heading + grid) into the mount point. */
// export function renderJournalSection(posts, mountSelector = '#journal-mount') {
//   const mount = document.querySelector(mountSelector);
//   if (!mount) return;

//   mount.innerHTML = `
//     <section class="journal" id="journal">
//       <div class="section-head">
//         <p class="eyebrow reveal-up"><span class="eyebrow-dot"></span>FROM THE GARAGE</p>
//         <h2 class="reveal-up">The Journal</h2>
//         <p class="section-desc reveal-up">Notes on optics, fitment and the odd war story from the test track.</p>
//       </div>
//       <div class="journal-grid">
//         ${posts.map(renderJournalCard).join('')}
//       </div>
//     </section>
//   `;
// }



import './journalCard.css';

/** Renders a single journal/blog card from one post data object. */
export function renderJournalCard(post) {
  // Removed "reveal-up" from the class list below so all cards show instantly
  return `
    <article class="journal-card" data-cursor-pop>
      <div class="journal-thumb" data-thumb="${post.id}"></div>
      <div class="journal-body">
        <span class="journal-tag">${post.tag}</span>
        <h3>${post.title}</h3>
        <p>${post.desc}</p>
        <span class="journal-meta">${post.readTime}</span>
      </div>
    </article>
  `;
}

/** Renders the full journal section (heading + grid) into the mount point. */
export function renderJournalSection(posts, mountSelector = '#journal-mount') {
  const mount = document.querySelector(mountSelector);
  if (!mount) return;

  mount.innerHTML = `
    <section class="journal" id="journal">
      <div class="section-head">
        <p class="eyebrow reveal-up"><span class="eyebrow-dot"></span>FROM THE GARAGE</p>
        <h2 class="reveal-up">The Journal</h2>
        <p class="section-desc reveal-up">Notes on optics, fitment and the odd war story from the test track.</p>
      </div>
      <div class="journal-grid">
        ${posts.map(renderJournalCard).join('')}
      </div>
    </section>
  `;
}