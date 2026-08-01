# AGENTS.md — FAANG Tech Lab Website

This file is a quick-start guide for AI coding agents working on the FAANG Tech Lab static website. It describes the project structure, technology stack, build/deployment flow, conventions, and things to watch out for when making changes.

---

## Project overview

This is a **static HTML/CSS/JS marketing website** for **FAANG Tech Lab**, a technology education and training institute based in Guntur, Andhra Pradesh, India. The site advertises instructor-led courses (Java, DSA, Cybersecurity, Python, MERN Stack, Spring Boot, Git/GitHub, AI) and provides a contact form for prospective students.

Key facts:

- **No backend is bundled in this repo.** The site is plain static HTML and can be served by any static host.
- **Contact form submissions are sent via EmailJS** from the browser using a public key embedded in the pages.
- **Production is deployed to Azure Static Web Apps** from the `development` branch using GitHub Actions.
- The site targets the domain `https://www.faangtechlab.com` (also `faangtechlab.com`).

---

## Technology stack

- **Markup:** HTML5 (semantic elements, accessibility attributes).
- **Styling:**
  - Custom CSS in `style.css` (CSS variables, light/dark theme via `data-theme`, keyframe animations, responsive media queries).
  - Tailwind CSS loaded from CDN (`https://cdn.tailwindcss.com`) for course landing pages under `best-*/index.html`.
- **Scripting:** Vanilla JavaScript in `script.js` (no frameworks).
- **Icons/Fonts:**
  - Font Awesome 6 (CDN).
  - Google Fonts `Inter`.
- **Animation library:** AOS (Animate On Scroll) loaded from CDN on the home page.
- **Form handling:** EmailJS SDK v4 (CDN) + client-side validation.
- **Package manager:** npm (used only for repository metadata / deployment scripts; zero runtime dependencies).
- **CI/CD:** GitHub Actions → Azure Static Web Apps.

---

## Project structure

```
faang-deployment/
├── index.html                          # Home page
├── style.css                           # Global stylesheet used by all pages
├── script.js                           # Global JavaScript used by all pages
├── package.json                        # npm metadata (no real build)
├── sitemap.xml                         # SEO sitemap
├── AGENTS.md                           # This file
├── .github/workflows/
│   └── azure-static-web-apps-icy-sea-003716100.yml   # Deployment workflow
├── assets/                             # Images, logos, PDF brochures, favicons
│   ├── faviconassets/                  # favicon.ico, webmanifest, touch icons
│   ├── *.jpg / *.jpeg / *.png / *.webp # Course/team/office photos and logos
│   └── *.pdf                           # Course brochures
└── best-<course>-training-course-in-guntur/
    └── index.html                      # SEO landing page for each course
```

### Course landing pages

Each subdirectory contains a standalone `index.html` for a specific course. Examples:

- `best-java-training-course-institute-in-guntur/`
- `best-cyber-security-training-institute-course-in-guntur/`
- `best-dsa-course-training-institute-in-guntur/`
- `best-python-programming-training-course-institute-course-in-guntur/`
- `best-MERN-Stack_Development-course-in-guntur/`
- `best-Spring-Boot-training-course-in-guntur/`
- `best-artificial-intelligence-training-course-in-guntur/`
- `best-Git-and-GitHub-Mastery-training-course-in-guntur/`

These pages:

- Extend Tailwind CSS via an inline config (`tailwind.config` inside a `<script>` tag) with FAANG brand colors.
- Link back to `../style.css` and `../script.js` for shared styling and behavior.
- Reuse the same navbar, contact section, WhatsApp float, and footer structure from the home page.
- Include course-specific SEO meta tags, Schema.org JSON-LD, skills lists, key features, and testimonials.

---

## Build and test commands

There is **no build step**. The project is a static site.

```bash
# Verify the npm scripts (they are effectively no-ops)
npm run build         # echo 'No build step required for static HTML site'
npm run build:azure   # echo 'No build step required for static HTML site'
npm run start         # echo 'Static site - no start command needed'
```

To preview locally, serve the folder with any static file server:

```bash
# Option 1: Python 3
python3 -m http.server 8080

# Option 2: Node / npx
npx serve .

# Option 3: VS Code Live Server extension
```

Then open `http://localhost:8080`.

### Linting / testing

There are no automated tests, linters, or formatters configured. Validation is currently manual:

- Open the changed page in a browser.
- Check responsive behavior at 320px, 375px, 414px, 768px, 992px+, and 1400px+.
- Verify the contact form still validates and submits via EmailJS.
- Confirm no console errors.

---

## Code style guidelines

### HTML

- Use semantic elements (`<section>`, `<article>`, `<nav>`, `<footer>`).
- Keep indentation consistent (4 spaces in the existing files).
- Add `id` attributes to major sections for in-page navigation.
- Use relative paths for internal links and assets:
  - Home page: `assets/...`
  - Course pages: `../assets/...`, `../index.html#about`, etc.
- Include SEO meta tags and Schema.org JSON-LD on new course pages (follow existing examples).
- Comment out unused sections rather than deleting them; the codebase retains commented blocks (e.g., the `#team` section, old Spring Boot backend form code) for easy restoration.

### CSS

- The main stylesheet is `style.css`. Course pages add page-specific styles in a `<style>` block but still import `../style.css`.
- Theme colors are controlled by CSS custom properties in `:root` and `html[data-theme='dark']`.
- Brand palette:
  - Primary deep blue: `#1A237E`
  - Accent purple: `#764BA2`
  - Body light sand: `#FCF3C3`
  - Light blue section: `#E8F0FA`
- Avoid inline styles where possible; existing inline styles are mostly legacy/one-off overrides.
- Media queries target breakpoints: 992px, 768px, 480px, 414px, 390px, 375px, 360px.

### JavaScript

- Use vanilla JS; no bundler.
- All global page behavior lives in `script.js`.
- Course pages add their own small inline `<script>` blocks for page-specific behavior (e.g., testimonial auto-scroll) but rely on `script.js` for theme, hamburger, and popup logic.
- Prefer `const`/`let`, event delegation, and defensive null checks (the existing code already guards DOM elements with `if (element)`).
- Use `console.warn` / `console.error` for unexpected states, not `alert()`.

---

## Testing instructions

1. **Local preview** with a static server (see Build commands above).
2. **Navigation:** Click all navbar links on desktop and mobile; confirm smooth scroll and mobile menu close.
3. **Theme:** The theme toggle code is present in `script.js` but the toggle button is currently commented out on the home page. Verify that `localStorage.theme` defaults to `light` and that `html[data-theme='dark']` styles still work if the toggle is re-enabled.
4. **Contact form:**
   - Submit empty fields → validation message should appear.
   - Submit invalid email/phone → validation message should appear.
   - Valid submission → EmailJS should send the message. **Do not spam the live service while testing.**
5. **Auto-scroll sections:** Courses grid, CodeGym wrapper, Training the Trainers wrapper, and testimonial wrappers should scroll horizontally and pause on hover/touch.
6. **Promotional popup:** Appears once per session after a 2–3s delay; close button, Escape key, and outside click should dismiss it.
7. **Office gallery image modal:** Clicking an office image opens a modal; Escape and click-outside close it.
8. **WhatsApp float:** Visible bottom-right and links to `https://wa.me/918179423238`.
9. **Cross-page consistency:** When editing `style.css` or `script.js`, check both the home page and at least one course landing page for regressions.

---

## Security considerations

- **EmailJS public key is committed in plain text** (`8j315xx0_TkS_EWJj`) in `index.html` and course pages. This is expected for EmailJS client-side integrations, but do not rotate it without updating every page that initializes EmailJS.
- **No CSRF/backend concerns** because there is no server-side API in this repo.
- **External CDN assets:** The site relies on `cdn.tailwindcss.com`, `cdnjs.cloudflare.com`, `fonts.googleapis.com`, `unpkg.com`, and `cdn.emailjs.com`. A compromise of any of these CDNs could inject content into the site.
- **User input:** The contact form validates name, email, phone, and course selection in the browser before sending to EmailJS. No server-side sanitization exists.
- **Links:** External links generally include `rel="noopener noreferrer"` and `target="_blank"`. Maintain this pattern for new external links.
- **Secrets:** Do not commit API tokens, private keys, or Azure credentials. The only GitHub secret used is `AZURE_STATIC_WEB_APPS_API_TOKEN_ICY_SEA_003716100`, which is configured in the repository settings.

---

## Deployment process

The project is continuously deployed via **Azure Static Web Apps**.

- **Triggering branch:** `development` (not `main`).
- **Workflow file:** `.github/workflows/azure-static-web-apps-icy-sea-003716100.yml`
- **Build settings:**
  - `app_location: "/"`
  - `output_location: "/"`
  - `skip_app_build: true` — the site is static, so no build is run.

What this means for agents:

- Open pull requests against `development`.
- Merging to `development` triggers the `build_and_deploy_job`.
- Closed pull requests run the `close_pull_request_job` to clean up preview environments.
- There is no staging/preview URL documented in this repo; Azure Static Web Apps creates preview URLs for PRs automatically if the platform is configured to do so.

Before considering work complete, confirm:

- The workflow file still parses (valid YAML).
- The `sitemap.xml` is updated if new pages are added.
- New assets are referenced with correct relative paths for both the home page and course pages.

---

## Common gotchas

- **The active deployment branch is `development`, not `main`.** Pushing to `main` does not deploy the site.
- **Course pages use Tailwind + custom styles + shared styles.** A change to `style.css` can affect course pages, and a Tailwind utility class can override `style.css` rules due to CSS cascade/source order.
- **The `#team` section is commented out** on the home page and in course navigation footers. Re-enabling it requires uncommenting both the HTML and the nav/footer links.
- **Theme toggle is commented out** in the home page navbar but the JavaScript logic remains functional.
- **Image paths differ per page type.** Home page uses `assets/...`; course pages use `../assets/...`.
- **Sitemap priorities/URLs** should be kept in sync with actual folder names and canonical URLs.

---

## Useful commands

```bash
# Serve locally
python3 -m http.server 8080

# Validate sitemap is well-formed XML
xmllint --noout sitemap.xml

# Check repository status
git status
git branch -a

# View recent commits
git log --oneline -10
```

---

## Maintainer notes

- Author: FAANG Tech Lab
- License: MIT
- Repository: https://github.com/zaheer037/faang-deployment.git
- Production domain: https://www.faangtechlab.com
- Contact email shown on site: learn@faangtechlab.com
- Phone shown on site: +91 8179423238
