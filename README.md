# Denis Adityan Rohmansyah — Electrical Engineering Portfolio

Responsive, single-page personal portfolio built with HTML5, CSS3, and vanilla JavaScript.

## Features
- Dark Engineering theme with navy backgrounds and cyan accents
- Responsive navigation for desktop and mobile
- Education timeline, technical interests, projects, achievements, experience, and contact links
- Four projects in the requested order: kWh-Ku, NEV Absenku, Fiber-Optic Network Installation, and Technical Mentoring and Support for Students
- Synchronized image galleries with swipe, arrows, dots, image counters, and automatic slide rotation
- Image lightbox, project filters, subtle scroll-reveal animations, and reduced-motion support
- Fallback visual panels if local photo assets have not been added yet

## Project structure
- `index.html` — portfolio content and page structure
- `css/style.css` — responsive layout, visual styles, and animations
- `js/script.js` — navigation, filters, synchronized galleries, lightbox, and reveal animations
- `assets/images/` — optimized WebP images (see `assets/images/README.md`)
- `assets/documents/` — PDF certificates (see `assets/documents/README.md`)

## Media assets

These optimized WebP files are already committed:
- `profile.webp`
- `kwh-ku-login.webp`
- `nevabsenku-login.webp`
- `fiber-lab-installation-01.webp`
- `fiber-lab-installation-02.webp`
- `community-mentoring-01.webp`
- `community-mentoring-02.webp`

The achievement photos, certificate previews, and original BNSP certificate PDF still need to be copied from the latest prepared portfolio ZIP into their referenced paths:
- `achievement-national.webp`
- `achievement-province.webp`
- `achievement-banyumas.webp`
- `certificate-national.webp`
- `certificate-province.webp`
- `assets/documents/sertifikat-jointer-bnsp.pdf`

Keep the filenames unchanged because the HTML references them. Until the remaining files are added, the page's missing-image fallback prevents broken image icons, but certificate links that point to missing files will not open successfully.

## Run locally
Open `index.html` in a browser, or use a local server such as VS Code Live Server.

## Publish with GitHub Pages
1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch `main` and folder `/(root)`, then save.
4. After deployment, check the site on desktop and mobile. Add the media assets before public launch.

## Content accuracy
Education dates, roles, project descriptions, and achievements are based on details supplied by the portfolio owner. The year of the Banyumas Regency competition result remains unspecified because it has not been confirmed.
