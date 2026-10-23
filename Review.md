# BookSphere — Comprehensive Project Review

> **Reviewed:** 19 October 2026  
> **Scope:** Full codebase audit — HTML, CSS, JS, assets, tooling, documentation, architecture and UX

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture & Project Structure](#2-architecture--project-structure)
3. [HTML — index.html](#3-html--indexhtml)
4. [CSS — Design System & Stylesheets](#4-css--design-system--stylesheets)
5. [JavaScript — Logic, State & Rendering](#5-javascript--logic-state--rendering)
6. [Assets & Media Pipeline](#6-assets--media-pipeline)
7. [UX & Visual Design](#7-ux--visual-design)
8. [Accessibility](#8-accessibility)
9. [Performance](#9-performance)
10. [Tooling & Scripts](#10-tooling--scripts)
11. [Documentation](#11-documentation)
12. [Stale / Dead Code](#12-stale--dead-code)
13. [What Should Be Added](#13-what-should-be-added)
14. [What Should Be Removed](#14-what-should-be-removed)
15. [Nice-to-Have Additions](#15-nice-to-have-additions)
16. [Prioritised Action Items](#16-prioritised-action-items)

---

## 1. Executive Summary

BookSphere is an impressive, richly illustrated single-page reading-tracker web app built with vanilla HTML, CSS and JavaScript — no frameworks, no build step, no dependencies. The visual craft is outstanding: a hand-painted watercolour aesthetic with real illustration assets, page-turn animations, parallax effects, scroll-based reveals, and a pixel/painted cat companion. The app has working localStorage persistence, hash routing, modals, toasts, a DNA/personality system, streak tracking, and book clubs.

### What works well

| Area | Strength |
|---|---|
| **Visual identity** | Cohesive painted storybook world — hero, frames, walnut controls, scroll-paper buttons |
| **Animation craft** | Steam, fireflies, cat breathing, lantern flicker, page turns, intro sequence — all GPU-friendly |
| **Responsiveness** | Thorough breakpoints (390, 700, 900, 1000, 1100, 2000px). Mobile-first hero layout |
| **Reduced motion** | Comprehensive `prefers-reduced-motion` handling across every stylesheet |
| **Feature set** | Tracking modal (MAL-style), DNA persona, streak heatmap, club creation, city selector, search |
| **Asset pipeline** | WebP with PNG fallback, lazy loading via IntersectionObserver, self-hosted fonts |
| **Testing scripts** | Playwright-based automated screenshot/assertion scripts covering layout, interactions, Lighthouse |
| **Documentation** | Detailed brief, addendum, MISSING.md, GENERATION.md with full provenance |

### What needs attention

| Area | Concern |
|---|---|
| **Inline monolith** | ~49 KB HTML file embeds ~130 lines of inline `<style>` and ~120 lines of inline `<script>` alongside 13 external CSS files |
| **Minified-in-source** | Almost all CSS and JS is written in aggressively compressed single-line form — unreadable without tooling |
| **Data/logic coupling** | Book data, state, router, views, components, and cat renderer all live in one `<script>` block |
| **No manifest usage** | `assets/manifest.js` exists as an ES module but is never imported — dead code |
| **Missing covers** | 6 of 16 books have no illustration assets; CSS gradient fallbacks look jarring next to painted art |
| **Accessibility gaps** | No skip links, no ARIA landmarks on inner pages, color contrast issues on muted text |

---

## 2. Architecture & Project Structure

### Current layout

```
BookSphere/
├── index.html                  # Application entry point: monolith, ~49 KB
├── css/                        # 14 stylesheet files
│   ├── fonts.css               # Self-hosted Fraunces + Nunito
│   ├── base.css                # CSS custom properties, card/button overrides
│   ├── nav.css                 # Navigation pill
│   ├── home.css                # Full-bleed hero, vines, cat, reading rooms (92 lines)
│   ├── bookcraft.css           # Walnut controls, page corners, book layout (85 lines)
│   ├── scroll-ui.css           # Treasure-scroll button painting (35 lines)
│   ├── storybook.css           # Viewport book, page turns (41 lines)
│   ├── app-craft.css           # Shared material palette for inner pages (35 lines)
│   ├── dashboard.css           # Dashboard overrides (2 lines)
│   ├── explore.css             # Shelf decoration, grid (3 lines)
│   ├── dna.css                 # Persona illustration (3 lines)
│   ├── clubs.css               # Club card overrides (2 lines)
│   ├── portal.css              # Login door reskin (2 lines)
│   └── about.css               # About card (2 lines)
├── js/
│   ├── ui.js                   # Scroll-control mutation, ARIA roles, keyboard support
│   ├── book.js                 # Page turn engine (wheel, touch, keys, 3D fold)
│   └── home.js                 # Immersive hero/rooms renderer, cat, parallax, quotes
├── assets/                     # Illustration art + fonts
├── scripts/                    # Python slicing + Playwright review scripts
├── review/                     # Screenshot galleries and Lighthouse reports
└── Images/                     # Raw source illustrations (unused at runtime)
```

### Structural issues

| Issue | Severity | Detail |
|---|---|---|
| **Hybrid monolith** | HIGH | `index.html` contains ~2,600 characters of inline `<style>`, the entire data layer (16 books, 7 genres, 6 clubs, 4 cities, quotes, personas), all state management, all view renderers, the pixel cat engine, post-render hooks, the router, and all event handlers — in one `<script>` block. The brief explicitly called for splitting into `data.js`, `state.js`, `router.js`, `views.js`, `cat.js`, `effects.js`, `portal.js`, `modals.js`, `main.js`. This was never completed. |
| **Inline styles duplicate external** | MEDIUM | Lines 12–88 of `index.html` are a full `<style>` block with ~3,500 characters of CSS rules. Many of these (`.hero`, `.card`, `.btn`, `.quote`, `.nav`, `.steam`, etc.) are then overridden or extended by the 13 external CSS files, creating a confusing cascade. |
| **CSS file count** | MEDIUM | 14 CSS files (13 external + 1 inline) for a static page is excessive. `dashboard.css`, `clubs.css`, `portal.css`, `about.css` are each 2–3 lines. These should be consolidated. |
| **`manifest.js` is dead** | MEDIUM | The `assets/manifest.js` file is an ES module (`export const assets = ...`) but nothing imports it. Cover paths are hardcoded in the `ART` object on line 122. |
| **Canonical entry point** | RESOLVED | The application now lives directly in `index.html`; the obsolete meta-refresh page and its extra navigation step were removed. |

**The brief's #1 instruction — split into a clean project structure — was only partially done. The JS split is the most critical remaining work.**

---

## 3. HTML — index.html

### What works

- **SEO basics**: Has `<title>`, `<meta charset>`, `<meta viewport>` with `viewport-fit=cover`, a favicon, and preload hints for critical assets and fonts.
- **Semantic structure**: Uses `<nav>`, `<main>`, correct `lang="en"`, and `<section>` within views.
- **Preloading strategy**: Hero image, mobile hero image, and both font files are preloaded with correct `type`, `media`, and `fetchpriority`.
- **Portal SVG**: The inline SVG for the vine symbol is efficiently defined once and reused with `<use>`.

### What should be fixed

| Issue | Line(s) | Detail |
|---|---|---|
| **No `<meta name="description">`** | — | Missing entirely. Hurts SEO. |
| **Inline styles block** | 11–89 | ~88 lines of dense CSS inlined in `<head>`. This was the original prototype CSS and should have been migrated to the external files during the split. Most rules are now overridden, creating dead weight and specificity conflicts. |
| **Massive inline script** | 96–217 | ~121 lines containing 16 book records, 7 data objects, full state management, 8 view renderers, a pixel cat engine, and all event routing. This is the prototype monolith that the brief asked to split. |
| **Line 161 contradicts line 131** | 131, 161 | `R.home` is defined as a function on line 131, then immediately overridden by `R.home = BookSphereHome.render` on line 161. The original inline hero renderer is dead code. |
| **`data-act="q"` on dots** | 145 | The home view renders quote dots with `data-act="q"`, but the action handler `A.q` on line 209 calls `window.sq(+d.i)`. This works but `window.sq` is reassigned on line 187 by `BookSphereHome.mount()`, making the inline `sq` definition on line 183 dead. |
| **Non-standard entities used as icons** | 189 | Uses `⌕` (search) and `♧` (bell) — these are mathematical/card symbols, not icon fonts. They render inconsistently across platforms. |
| **Default form values** | 198 | Login input has `value="Vinit"` hardcoded. This is a development artifact. |
| **No `<h1>` outside home** | — | Inner pages like Dashboard, Explore, DNA, Clubs, Streaks have `<h2>` as the top heading. Only `home` has an `<h1>`. The heading hierarchy breaks for non-home routes. |

---

## 4. CSS — Design System & Stylesheets

### What works

- **Custom properties**: `:root` defines a coherent palette (`--paper`, `--green`, `--ink`, `--gold`, etc.) used consistently.
- **Font loading**: Self-hosted with `font-display: swap`, preloaded — excellent performance.
- **GPU-friendly animations**: Almost all animations use `transform` and `opacity` only. The brief's requirement is met.
- **Responsive excellence**: The home hero handles ultra-wide (2560px), standard desktop (1440), tablet (~1000), and mobile (390) with dedicated `@media` rules. The `aspect-ratio` and `svh` unit usage is modern and correct.
- **Reduced motion**: Every single stylesheet has a `@media(prefers-reduced-motion:reduce)` block. This is thorough.
- **Scroll-control system**: The `scroll-ui.css` treasure-scroll button is a genuinely creative UI component — real artwork sliced into 3 pieces (roll, paper, edge), dynamically sized via `ResizeObserver`, with hover/focus unfurl, activation roll-up, and touch support.
- **Page turn**: `storybook.css` implements a convincing 3D page-turn with `perspective`, `backface-visibility`, and cloned snapshot faces.

### What should be fixed

| Issue | File | Detail |
|---|---|---|
| **Readability** | All files | Every CSS file is written in compressed single-line form. `home.css` is 92 lines but those 92 lines contain what would be ~600 lines formatted. `bookcraft.css` (85 lines) would be ~500. This makes maintenance, debugging, and collaboration nearly impossible. The project has no minification step, so this compression is purely in the source. |
| **Inline/external conflicts** | `index.html` + `base.css` + `app-craft.css` | The inline `<style>` defines `.card`, `.btn`, `.nav`, `.hero`, `.quote`, etc. Then `base.css` redefines `.card`, `.btn`. Then `app-craft.css` redefines `.card` again with different `background`, `border-radius`, and `box-shadow`. The cascade relies on load order, not specificity, making it fragile. |
| **`!important` usage** | `clubs.css:1` | `background-color:#ded0af!important` and `background-image:...!important` — signals a specificity war. |
| **Duplicate animation names** | inline + `home.css` | `@keyframes in` is defined inline (line 26) and `@keyframes in` is depended on by `.bd` (line 75). These share the animation namespace, which could collide. |
| **Dead selectors** | `bookcraft.css:4` | `body[data-page="home"] :is(.hero-primary,...):not(.scroll-control)` — the `.scroll-control` class is now added to all these elements by `ui.js`, so the `:not(.scroll-control)` branch is dead. These rules no longer apply. |
| **`dashboard.css` has a cat fallback hack** | `dashboard.css:1` | `.nook canvas{display:none}.nook:before{content:'';...background:url(...cat-sleeping-books.webp)}` — hides the pixel cat canvas and uses a pseudo-element instead. This works but is a brittle override of the inline HTML. |
| **Missing `border-box` on pseudo-elements** | `base.css` | `*{box-sizing:border-box}` is set inline but doesn't include `*::before, *::after`. |
| **Hardcoded asset paths everywhere** | Multiple | CSS files reference `../assets/slices/hero/paper-grain.webp`, `../assets/craft/walnut-plaque.webp`, `../assets/frames/page-frame.webp`, etc. with absolute relative paths. The `manifest.js` was supposed to centralise these. |

### Nice CSS work worth preserving

- The `page-corners` system with individual `mask-image` + `mask-composite: intersect` for each corner piece is elegant.
- The `@keyframes paper-light-pass` sweep effect on page reveals is subtle and effective.
- The `conic-gradient` reading goal ring and DNA donut are clean implementations.

---

## 5. JavaScript — Logic, State & Rendering

### What works

- **Complete feature set**: All features from the brief are implemented and working — tracking, DNA, streaks, clubs, search, quotes, login, portal.
- **`localStorage` persistence**: State saves and survives reload. Initial seeded data provides a compelling demo.
- **Lightweight pixel cat**: The canvas-based cat state machine (sleep/yawn/walk/sit) in ~60 lines is impressive. The `requestAnimationFrame` tick loop properly filters disconnected canvases.
- **`BookSphereHome` lifecycle**: Clean IIFE with proper teardown — AbortController for event listeners, IntersectionObserver disconnect, timer clearance. This is well-engineered.
- **`BookSphereBook` page turn**: Handles wheel interception only at spread boundaries, respects inner scroll, manages inert states, prefetches lazily, and properly cleans up on abort. The 3D fold animation with cloned snapshots is technically sophisticated.
- **`BookSphereUI` scroll controls**: The ResizeObserver-based dynamic scroll sizing and the clever click interception (delay/roll-up/forwarded click) is a creative approach.

### What should be fixed

| Issue | Severity | Detail |
|---|---|---|
| **Data is not in `data.js`** | HIGH | The brief explicitly calls for `data.js` as the single place to swap in a real API later. Instead, all 16 books, genres, clubs, cities, quotes, and personas are hardcoded in the inline script. There is no `data.js` file at all. |
| **State is not in `state.js`** | HIGH | State initialisation, `save()`, streak/longest/done/pages/dna/recs are all inline. No `state.js`. |
| **Views are not in `views.js`** | HIGH | All 7 view renderers (`R.home` through `R.about`) are inline template literals. No `views.js`. |
| **No `router.js`** | HIGH | The hash router (`render()`, `go()`, `hashchange` listener) is inline. |
| **No `modals.js`** | MEDIUM | `modal()`, `close()`, `login()`, `track()` are inline. |
| **No `portal.js`** | MEDIUM | The portal animation is inline. |
| **Variable naming** | MEDIUM | Extremely terse: `B` (books), `G` (genres), `GC` (genre colours), `P` (personas), `S` (state), `U` (UI state), `A` (action handlers), `R` (routes), `E` (enter flag). This was acceptable for the original prototype but should have been renamed during the split. |
| **Global pollution** | MEDIUM | `$`, `$$`, `B`, `G`, `GC`, `ST`, `P`, `CITY`, `CL`, `QT`, `S`, `save`, `U`, `cats`, `timer`, `E`, `pend`, `tt`, `bk`, `ent`, `streak`, `longest`, `done`, `pages`, `dna`, `recs`, `tod`, `lum`, `ART`, `cover`, `item`, `side`, `shell`, `chips`, `clubs`, `R`, `exg`, `Cat`, `last`, `post`, `setNav`, `render`, `go`, `toast`, `modal`, `close`, `login`, `portal`, `track`, `A` — **56+ global variables/functions**. |
| **`innerHTML` everywhere** | MEDIUM | All views use string concatenation and `innerHTML` assignment. This is XSS-safe only because the data is static, but it would be unsafe if user-generated content were ever introduced. |
| **No error boundaries** | MEDIUM | If any view function throws, the entire app becomes blank. No try/catch around `R[r]()`. |
| **Magic numbers** | LOW | `recs()` formula: `Math.min(98, Math.round(62 + w[b.g] * 120 + b.id * 7 % 9))` — the recommendation algorithm uses unexplained constants. |
| **Dead home renderer** | LOW | Lines 131–146 define `R.home` which is immediately overridden on line 161. The 15-line SVG scene renderer is dead code. |
| **Pixel cat in painted world** | LOW | The brief says "Do NOT ship the pixel cat on painted art." The pixel cat (`Cat()`) is still fully present in the inline script, rendered on `#c1` and `#c2` canvases. `dashboard.css` hides the canvas with `display:none`, but the JS still creates and ticks it. |

### Code quality metrics (inline script only)

| Metric | Value |
|---|---|
| Approximate lines (unminified) | ~650 |
| Global symbols | 56+ |
| Functions | 28 |
| Template literal views | 8 (home, dashboard, explore, mybooks, dna, streaks, clubs, about) |
| Event listeners (direct) | 4 (click, input, change, keydown) |

---

## 6. Assets & Media Pipeline

### What works

- **WebP with PNG fallback**: Every illustration has both `.webp` and `.png`. The hero uses `<picture>` with `<source>` for format and viewport selection.
- **Self-hosted fonts**: Fraunces and Nunito served as `.woff2` with OFL license files retained.
- **Lazy loading**: IntersectionObserver-driven `data-src`/`data-srcset` swap for chapter images.
- **Asset provenance**: `GENERATION.md` records full prompts for AI-generated assets. Source PNGs retained beside delivery WebP.
- **`MISSING.md`**: Honest documentation of what's still needed.
- **Slicing pipeline**: Python scripts for cropping illustration sheets into individual assets.

### What should be fixed

| Issue | Detail |
|---|---|
| **`manifest.js` unused** | The asset manifest was created per the brief but is an ES module that no code imports. Cover paths are hardcoded in the `ART` object. If `manifest.js` were used, cover swaps would be a data change, not a code change. |
| **6 covers missing** | Books 11–16 (Gone Girl, The Silent Patient, Sapiens, Educated, The Hobbit, Pride and Prejudice) have no illustration assets. Their CSS gradient fallbacks create a jarring visual mismatch next to the painted covers. |
| **2 unreferenced cover slices** | `cover-people-we-meet-on-vacation.webp` and `cover-psalm-for-the-wild-built.webp` exist in `assets/slices/library/` but are not in the `ART` object or `manifest.js`. These were sliced from the sheet but don't correspond to any book in the `B` array. |
| **Hero image is 3.0 MB (PNG)** | `assets/hero/nook.png` is 3,175,539 bytes. The WebP is 368 KB — good. But the PNG is served as a fallback and is enormous. Consider converting to AVIF for modern browsers. |
| **`_unused` directory** | Contains `vines-photo.png` (256 KB). Per the brief, this should not be used. It should be removed from the project entirely. |
| **`Images/` directory** | 8 raw source illustrations totalling ~12.5 MB. These are not referenced at runtime. They should be in a separate `sources/` or excluded from version control. |
| **Large original PNGs in `craft/`** | `walnut-plaque-original.png` (2.1 MB), `closing-library-original.png` (2.6 MB), `ritual-book-original.png` (2.9 MB) are retained for provenance but inflate the project. Consider moving to a separate archive. |
| **No AVIF generation** | The pipeline generates WebP from PNG but doesn't produce AVIF, which would be 30–50% smaller for these illustration-style images. |
| **`contact-sheet.png`** | 380 KB file in `assets/` root — appears to be a development artifact for reviewing sliced assets. |

---

## 7. UX & Visual Design

### What works beautifully

- **Immersive hero**: The full-bleed nook painting with parallax, steam, fireflies, lantern glow, and Mochi the cat is genuinely magical. The intro sequence (vignette fade, lantern ignite, headline stagger) creates a premium first impression.
- **Book of the Day badge**: The floating card with sparkle, slight rotation, and cover thumbnail is a charming touch.
- **Scroll-cue**: The "THERE'S MORE TO YOUR STORY" prompt with bouncing chevron guides discovery.
- **Page turn metaphor**: The storybook navigation in the reading rooms section is delightful — physical page turns with shadow, perspective, and chapter bookmarks.
- **Painted controls**: The walnut-plaque buttons and treasure-scroll unfurl effect are unique and memorable.
- **DNA persona system**: The genre weight calculation, donut chart, personality descriptions, and trait pills make reading data feel personal.
- **Quote banner**: Using the actual parchment slice as a banner background with rotating quotes is on-brand.

### What should be fixed

| Issue | Detail |
|---|---|
| **No loading state** | When the app first loads, there's a brief flash of unstyled content before the hero image arrives. A skeleton/loading state would smooth this. |
| **About page is bare** | `R.about` returns a single card with 3 lines of text. It's the least developed view. |
| **Streaks UX gap** | "Log today's reading" logs a flat 20 minutes. There's no way to specify how long you actually read. |
| **No book detail view** | Clicking a book opens the tracker modal immediately. There's no intermediate detail page showing synopsis, reviews, or related books. |
| **Club cards have no real content** | Without the 6 illustrated covers, club cards are gradient+emoji blocks. The meeting details (venue, distance, date) are generated — adding "Venue to be decided" for user-created clubs breaks immersion. |
| **Search is title/author/genre only** | No search by vibe, tag, or mood descriptor — missed opportunity given the "vibes" data (`b.v`) exists. |
| **No onboarding flow** | New users see a pre-seeded library. There's no empty state, no book selection wizard, no genre preference picker. |
| **City selector limited to 4 cities** | Nagpur, Mumbai, Pune, Bengaluru. No way to add custom cities. |

---

## 8. Accessibility

### What works

- **`prefers-reduced-motion`**: Comprehensive across all 14 CSS sources. Animations disabled, transitions removed.
- **ARIA in book controls**: `aria-label`, `aria-current`, `aria-hidden`, `role="status"`, `aria-live="polite"` on the page status.
- **Keyboard navigation**: `ui.js` adds `role="button"` and `tabIndex=0` to interactive elements, with Enter/Space handlers.
- **`inert` on hidden pages**: Non-current book pages are marked `inert`, preventing focus trapping.
- **Focus management**: After page turn, focus moves to the book status element.

### What should be fixed

| Issue | WCAG | Detail |
|---|---|---|
| **No skip-to-content link** | 2.4.1 | Users must tab through the entire nav on every page. |
| **Color contrast on `.mut`** | 1.4.3 | `.mut` (muted text) uses `#80694a` on `#f7ecd4` — contrast ratio ~3.5:1, failing AA for normal text. Same issue with `#766043` on paper backgrounds. |
| **No `<main>` landmark on inner views** | 1.3.1 | `<main id="app">` exists but the shell/wrap views inside it don't use `<section>` with `aria-labelledby`. Screen readers see a flat structure. |
| **Modal focus trap missing** | 2.4.3 | Clicking backdrop closes the modal, but there's no focus trap within it. Tab can escape to background content. |
| **Range slider has no visible value** | 1.3.1 | The pages-read slider in the tracker modal shows the value via a separate `<span id="tpv">`, but the slider itself has no `aria-valuetext` or visible thumb label. |
| **Score select has no "rated" context** | 1.3.1 | The score dropdown shows numbers 1–10 but no indication of what scale (stars? out of 10?). |
| **Toast announcements** | 4.1.3 | `#toast` doesn't have `role="alert"` or `aria-live`. Screen readers don't announce it. |
| **Nav icon symbols** | 1.1.1 | The search and bell symbols are mathematical/card Unicode characters used as interactive icons with only `aria-label` — acceptable, but real SVG icons would render consistently. |

---

## 9. Performance

### What works

- **Lighthouse 81/100** (mobile, simulated) — meets the >=80 target.
- **Font preloading**: Both fonts preloaded, swap displayed.
- **Hero image preloading**: Desktop and mobile variants preloaded with `fetchpriority="high"`.
- **Lazy image loading**: Chapter illustrations loaded on intersection.
- **No framework overhead**: Zero JS dependencies. Total JS is ~22 KB (3 external files + inline).
- **GPU animations**: All motion uses `transform`/`opacity`.
- **Layout shift: 0** — no CLS issues.

### What should be fixed

| Issue | Impact | Detail |
|---|---|---|
| **14 CSS requests** | Medium | 13 external `<link>` tags + 1 inline block = 14 render-blocking CSS sources. At minimum, the 6 tiny files (2–3 lines each) should be merged. |
| **No CSS minification** | Low | CSS is "minified" by being written on single lines, but no actual minification (removing comments, shortening values) is done. |
| **Inline CSS is duplicated** | Medium | ~3.5 KB of inline CSS that's mostly overridden wastes bandwidth. |
| **`nook.png` fallback is 3 MB** | High | If WebP isn't supported (very rare now), the user downloads a 3 MB PNG. Consider AVIF as a middle tier. |
| **No HTTP caching hints** | Low | Static site — but no `Cache-Control` headers or service worker. Fine for development, needs attention for production. |
| **Render-blocking font CSS** | Low | `fonts.css` is a `<link>` in `<head>`. The fonts themselves are `swap`, but the stylesheet blocks first paint. Inline it. |
| **`requestAnimationFrame` tick for pixel cat** | Low | The pixel cat's `rAF` loop runs continuously even when the cat canvas is hidden by `dashboard.css`. The loop does filter disconnected canvases, but ticks still fire. |

---

## 10. Tooling & Scripts

### What works

- **`scripts/hero-review.cjs`** and **`scripts/project-review.cjs`**: Playwright-based automated testing that captures screenshots at multiple viewports, asserts layout invariants (no overlap, no horizontal overflow, correct page turn hinge position), checks all routes, verifies persistence, and generates a Lighthouse report.
- **Python slicing scripts**: `slice_assets.py`, `prepare_hero_assets.py`, `prepare_bookcraft_assets.py`, `prepare_scroll_ui.py` — proper asset pipeline.
- **Local-server-in-test**: The review scripts spin up an `http.Server` on port 0, avoiding port conflicts.

### What should be fixed

| Issue | Detail |
|---|---|
| **Hardcoded Playwright path** | `scripts/project-review.cjs:1` requires Playwright from `C:/Users/deore/.cache/codex-runtimes/...`. This is a machine-specific absolute path that will fail on any other machine. Should use a local `node_modules` or a `package.json`. |
| **No `package.json`** | The project has no `package.json`, no `npm` setup, no way to install dev dependencies. The scripts rely on globally/externally installed Playwright. |
| **No CI/CD** | No GitHub Actions, no automated testing on push. The Playwright scripts are manual. |
| **Python scripts assume PIL** | `slice_assets.py` uses Pillow (`PIL`), which must be manually installed. No `requirements.txt`. |

---

## 11. Documentation

### What works

- **`booksphere-antigravity-brief.md`**: Exceptionally detailed 105-line brief covering goals, rules, data preservation, asset inventory, screen instructions, animation specs, and acceptance criteria.
- **`booksphere-immersive-addendum.md`**: Clear superseding document for the hero redesign.
- **`assets/MISSING.md`**: Honest inventory of what art is still needed.
- **`assets/craft/GENERATION.md`**: Full prompts for AI-generated assets with provenance.
- **`BOOKCRAFT_REVIEW.md`** and **`PROJECT_CRAFT_REVIEW.md`**: Detailed implementation reports with Lighthouse scores and verification steps.
- **`REFERENCE_COMPARISON.md`**, **`SCROLL_UI_REVIEW.md`**, **`IMMERSIVE_HERO_REVIEW.md`**: Additional review documents.

### What should be fixed

| Issue | Detail |
|---|---|
| **No README.md** | The project has no `README.md`. A developer finding this repo has no quick-start guide, no setup instructions, no architecture overview. |
| **Review documents proliferate** | 6 review/progress documents at root level (`BOOKCRAFT_REVIEW.md`, `IMMERSIVE_HERO_REVIEW.md`, `PROJECT_CRAFT_REVIEW.md`, `REFERENCE_COMPARISON.md`, `SCROLL_UI_REVIEW.md`, plus the `review/` directory with 14 subdirectories and 6 HTML files). These are development artifacts, not user-facing. They should be consolidated or archived. |
| **No inline code comments** | The CSS and JS files have almost zero inline comments explaining *why* something is done. The few comments that exist describe *what*, not *why*. |

---

## 12. Stale / Dead Code

| Item | Location | Why it's stale |
|---|---|---|
| **Original SVG hero renderer** | `index.html:131–146` | Overridden by `R.home = BookSphereHome.render` on line 161 |
| **Inline `post.home`** | `index.html:180–184` | Overridden by `post.home = () => BookSphereHome.mount(...)` on line 187 |
| **`window.sq`** | `index.html:183` | Set inline, then reassigned by `BookSphereHome.mount()` |
| **Inline `<style>` block** | `index.html:11–89` | ~88 lines of CSS that's mostly overridden by the 13 external files |
| **Pixel cat `Cat()` function** | `index.html:164–178` | The brief says don't ship pixel cat on painted art. Dashboard hides the canvas but JS still ticks. |
| **`manifest.js`** | `assets/manifest.js` | ES module that nothing imports |
| **`bookcraft.css` lines 4–9** | `css/bookcraft.css:4–9` | `:not(.scroll-control)` walnut-plaque styles — all targets now have `.scroll-control`, so these never apply |
| **`cover-people-we-meet-on-vacation`** | `assets/slices/library/` | Asset exists but no book in the data array uses it |
| **`cover-psalm-for-the-wild-built`** | `assets/slices/library/` | Same — sliced but unreferenced |
| **`_unused/vines-photo.png`** | `assets/_unused/` | Marked as "do not use" in the brief |
| **`contact-sheet.png`** | `assets/` | Development artifact for reviewing slices |

---

## 13. What Should Be Added

### Must-have

| Addition | Rationale |
|---|---|
| **`README.md`** | Project setup, architecture, development workflow, asset pipeline instructions |
| **`package.json`** | Dev dependency management (Playwright), scripts for `dev`, `test`, `build` |
| **Proper JS module split** | `data.js`, `state.js`, `router.js`, `views.js`, `modals.js`, `portal.js` — as specified in the brief |
| **Skip-to-content link** | WCAG 2.4.1 compliance |
| **Toast `role="alert"`** | Screen reader announcement |
| **Modal focus trap** | WCAG 2.4.3 compliance |
| **`<meta name="description">`** | SEO |

### Should-have

| Addition | Rationale |
|---|---|
| **Loading/skeleton state** | Smoother perceived performance while hero image loads |
| **Empty state for new users** | Currently shows pre-seeded data; new users should see onboarding |
| **Book detail view** | Clicking a book should show more info before the tracker |
| **Search by vibe/tag** | The `v` (vibe) field exists but isn't searchable |
| **Favicon as proper icon** | Currently using a book cover WebP — should be a proper `.ico` or SVG |

---

## 14. What Should Be Removed

| Item | Reason |
|---|---|
| **Inline `<style>` block** | Migrate remaining useful rules to external files, delete the rest |
| **Dead `R.home` and `post.home` definitions** | Overridden immediately after — pure dead code |
| **Pixel cat renderer (`Cat()`)** | Brief explicitly prohibits pixel art on painted screens |
| **`assets/_unused/`** | Contains only one file explicitly marked "do not use" |
| **`assets/contact-sheet.png`** | Development artifact |
| **`Images/` directory** | Raw source files not used at runtime — archive separately |
| **Large original PNGs in `craft/`** | `*-original.png` files total ~7.6 MB — archive separately |
| **`login` input default value** | `value="Vinit"` is a dev artifact |
| **Extraneous review documents** | 6 root-level `.md` review files + `review/` with 14 subdirs — consolidate to one `CHANGELOG.md` |

---

## 15. Nice-to-Have Additions

These aren't bugs or missing requirements, but would significantly elevate the project:

| Addition | Impact | Effort |
|---|---|---|
| **Dark mode** | The warm palette could beautifully invert to a cozy nighttime reading theme with deep browns and soft gold. The `data-time="night"` system already exists for the hero — extend it site-wide. | Medium |
| **Reading timer** | Instead of logging flat "20 minutes", let users start/stop a timer. Store actual reading minutes. | Medium |
| **Book notes/highlights** | A small text field per book in the tracker for personal notes or favourite quotes. | Low |
| **Genre preference picker on first visit** | New users pick 3 genres, get immediate personalised recommendations, skip the pre-seeded library. | Medium |
| **Share your DNA** | A "share card" generator that creates a pretty image of your reading persona and genre breakdown. | Medium |
| **Reading goal configuration** | The `S.goal` is hardcoded to 12. Let users set their own annual reading goal. | Low |
| **Export/import library** | JSON export/import for backup and migration between devices. | Low |
| **PWA manifest + service worker** | Offline access, installability. The app is already fully static — this is low-hanging fruit. | Medium |
| **Animated page transitions** | View changes currently use a simple fade. Cross-fade between routes with the page-turn metaphor would be magical. | High |
| **Real book API integration** | Connect to Open Library or Google Books API for real covers, descriptions, page counts, and a vastly larger catalogue. | High |
| **AVIF image format** | 30–50% smaller than WebP for illustration-style art. Add as a `<source>` in `<picture>` elements. | Low |

---

## 16. Prioritised Action Items

### Critical (do first)

1. **Split the inline `<script>` into modules** per the brief's structure: `data.js`, `state.js`, `router.js`, `views.js`, `modals.js`, `portal.js`. Rename single-letter variables. Remove globals.
2. **Remove the inline `<style>` block**. Audit each rule — migrate any still-needed rules into the appropriate external CSS file, delete the rest.
3. **Remove dead code**: the overridden `R.home`, `post.home`, pixel cat `Cat()`, and the original SVG scene.
4. **Wire up `manifest.js`** or remove it. Currently it's dead code.

### Important (do soon)

5. **Consolidate CSS**: Merge the 6 tiny CSS files (dashboard, explore, dna, clubs, portal, about) into `app-craft.css` or a single `pages.css`.
6. **Fix accessibility**: Add skip link, toast `role="alert"`, modal focus trap, colour contrast on `.mut`.
7. **Add `README.md`** with setup, architecture, and development instructions.
8. **Add `package.json`** with Playwright as a dev dependency, fix the hardcoded import path.
9. **Format the source code** — run Prettier on all CSS and JS files.
10. **Add `<meta name="description">`** and fix heading hierarchy (`<h1>` per view).

### Nice improvements (when time allows)

11. Clean up the `Images/` directory and large `*-original.png` files.
12. Generate the 6 missing book covers.
13. Generate the 6 club cover illustrations.
14. Add a book detail view.
15. Add a loading skeleton for the hero.
16. Add PWA manifest and service worker.
17. Add AVIF format support.
18. Implement dark/night mode.

---

> **Bottom line:** The visual and interaction design of this project is genuinely exceptional for a vanilla HTML/CSS/JS codebase. The primary technical debt is structural — the split from monolith to modules was started but not completed. Completing that split would make this a showcase-quality project.
