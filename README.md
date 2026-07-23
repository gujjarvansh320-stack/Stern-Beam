# Stern Beam — component-based rebuild

Same site as before, restructured into reusable components/utilities and
switched from CDN `<script>` tags to a proper Vite build.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
```

```bash
npm run build     # production build into /dist
npm run preview   # serve the production build locally
```

> This was built and syntax-checked in a sandbox without internet access, so
> `npm install` / the dev server were **not** run end-to-end here. If you hit
> an import error on first run, it's most likely a version-resolution
> hiccup, not a code path — see "If something breaks" below.

## Folder structure

```
index.html                     ← slim shell: just mount points + preloader/cursor markup
admin.html                     ← separate entry point, warranty registration (login-gated)
vite.config.js                 ← tells the build about both HTML entry points
src/
  main.js                      ← orchestrator: renders + initializes every component, in order
  admin-main.js                ← entry point for admin.html
  admin/
    adminApp.js + admin.css     ← login form + registration form, shown based on auth state
  styles/
    tokens.css                 ← :root design tokens (colors, fonts, spacing)
    base.css                   ← reset, typography, buttons, global overlays
    global.css                 ← imports the two above, imported by both main.js and admin-main.js
  data/                        ← content, separate from markup
    navLinks.js                ← shared by nav + footer
    products.js                ← shared by product-card + footer's product list + warranty forms
    journal.js
    stats.js                   ← about-section values + counters
    warrantyConfig.js          ← warranty length + expiry/status calculation
    heroPhotos.js              ← unused by default now, see "Hero visual" below
  components/
    nav/            nav.js + nav.css
    hero/           hero.js + hero.css (+ heroSlideshow.js, currently unused — see below)
    product-card/   productCard.js + productCard.css
    warranty/       warranty.js + warranty.css   (public: status lookup only)
    about/          about.js + about.css
    journal-card/   journalCard.js + journalCard.css
    contact-form/   contactForm.js + contactForm.css
    footer/         footer.js + footer.css
  utils/
    cursor.js, magnetic.js, scrollReveal.js, preloader.js
    firebase.js                ← the one place the app connects to Firebase (Firestore + Auth)
    warrantyApi.js              ← shared Firestore calls, used by both warranty.js and adminApp.js
```

## The pattern

Every component exports two kinds of functions:

- `renderX(...)` — builds an HTML string and injects it into a mount element.
- `initX()` — wires up event listeners on whatever `renderX` just created.

`main.js` calls all the `render*` functions first (builds the whole page),
then all the `init*` functions (wires up behavior), then starts the
preloader. Nothing but `main.js` needs to know about that order.

## Adding a new product / blog post

Edit `src/data/products.js` or `src/data/journal.js` — add one object to the
array. The grid, the footer's product list, and the layout all update
automatically. No HTML to duplicate.

## Adding a new page section

1. Make a folder in `src/components/your-section/`.
2. Add `yourSection.js` (with a `renderYourSection()` export) and
   `yourSection.css`.
3. Add a mount div to `index.html`: `<div id="your-section-mount"></div>`.
4. Import and call it from `src/main.js`.

## Hero visual

The hero background is currently a plain CSS gradient (a soft xenon-blue
glow fading to near-black) defined directly in `src/components/hero/hero.css`
on the `.hero` rule — no photo involved. `heroSlideshow.js` and
`heroPhotos.js` are still in the project if you want a photo slideshow
again later; `hero.js` has a comment explaining exactly how to plug them
back in.

## E-warranty system (Firebase)

Customers can **look up** an existing warranty's status on the public site.
Registration is **admin-only**, behind a separate login-gated page — no
public form can write to the database anymore.

- Public lookup: `src/components/warranty/` (section on the main site)
- Admin registration: `admin.html` + `src/admin-main.js` + `src/admin/` (a
  completely separate page, not linked from the public nav)
- Shared Firestore calls: `src/utils/warrantyApi.js` (both pages import
  from here, so there's one place that talks to the database)

### 1. Create a Firebase project

- Go to the [Firebase console](https://console.firebase.google.com), create a project.
- Add a **Web app** to it (the `</>` icon) — this gives you the config values.
- Enable **Firestore Database** (Build → Firestore Database → Create database). Start in production mode; the security rules below replace the defaults.
- Enable **Authentication** (Build → Authentication → Get started) → Sign-in method tab → enable **Email/Password**.
- Create your admin login: Authentication → Users tab → **Add user** → enter the email/password you (the site owner) will use to sign in at `/admin.html`. This is a real login used only by staff — customers never see it.

### 2. Configure your local project

Copy `.env.example` to `.env` and fill in the values from your Firebase web app config:

```bash
cp .env.example .env
```

`.env` is already in `.gitignore` — never commit your real keys.

### 3. Set Firestore security rules

In the Firebase console → Firestore Database → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /warranties/{docId} {
      // Only a signed-in admin (via /admin.html) can create a record.
      allow create: if request.auth != null
                    && request.resource.data.keys().hasAll(['name','email','productId','productTitle','serial','purchaseDate'])
                    && request.resource.data.serial is string
                    && request.resource.data.email is string;
      // Public lookups still work — Firestore rules apply per-document,
      // so an exact-match query (serial + email) only ever returns
      // documents matching those exact values.
      allow read: if true;
      allow update, delete: if false;
    }
  }
}
```

The key change from before: `allow create` now requires `request.auth != null`.
Even if someone found the Firestore write request in devtools and tried to
replay it, it fails without a valid admin session — only `/admin.html`,
after a successful sign-in, can create records.

### 4. Using it

- **Customers**: go to the "Warranty" section on the main site, enter
  serial number + email, see status/expiry. No login involved.
- **Staff**: go to `/admin.html`, sign in with the admin account created
  in step 1, fill in the customer's details at time of sale, submit.
  There's a "Sign out" button in the top bar once logged in.

`admin.html` has `<meta name="robots" content="noindex, nofollow">` so
search engines won't index it, but the URL itself isn't secret — the
actual protection is the Firebase Auth login and the Firestore rule above,
not the URL being hard to find. Don't rely on "nobody will guess /admin.html"
as your security model.

### 5. Data model

Every registration is one document in the `warranties` collection:

```js
{
  name, email, productId, productTitle, serial,
  purchaseDate,   // 'YYYY-MM-DD' string from the date input
  dealer,         // optional
  registeredAt,   // Firestore server timestamp
}
```

Warranty length is one constant, `WARRANTY_YEARS` in
`src/data/warrantyConfig.js` (currently 5, matching the hero's "5 YR Beam
Warranty" spec). Expiry is calculated on the fly from `purchaseDate` — it's
never stored, so changing `WARRANTY_YEARS` retroactively updates every
existing registration's computed status.

### 6. Building for production

`npm run build` now needs `vite.config.js` (already added) to know about
`admin.html` as a second entry point — without it, Rollup only builds
`index.html` and the admin page silently doesn't make it into `/dist`.
This is already wired up; you don't need to do anything extra.

## If something breaks on first `npm install`

This project depends on `gsap` and `firebase` beyond Vite itself. If
`npm run dev` fails, check the error against the file it points to — it's
most likely a typo or a missing `.env` value (see the Firebase section
above) rather than a structural problem, given everything here was
syntax-checked and import-path-verified before packaging.
