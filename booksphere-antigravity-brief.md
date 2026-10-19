# BookSphere: Implementation Brief for Antigravity

## 0. Goal
`booksphere.html` is a working single-file prototype (vanilla HTML/CSS/JS). Its layout, features and animations work, but its visuals are crude code-drawn stand-ins. The target look is `reference/reference.jpg` (the 5-screen painted storybook mockup). **Rebuild the visual layer using the supplied illustration assets, keep all behaviour, and split the file into a normal project structure.** Do not rewrite the app from scratch.

## 1. Rules of engagement
- Work incrementally, one section at a time. Commit (or snapshot) after each step in section 8.
- No frameworks or build step. Plain HTML, CSS and ES modules or plain scripts. It must open from a static server.
- Keep every existing feature working (section 2). Re-test them after each step.
- Fidelity to the reference is the success criterion. After each screen, screenshot it at 1440×900 and 390×844 and compare it with the reference. List the remaining differences honestly; do not claim a match you have not checked.
- Don't invent artwork. If an asset is missing (section 5), use a neutral placeholder and log it in `assets/MISSING.md`. Never mix code-drawn art into painted screens.
- Do not mention anywhere in the UI that data is sample data.

## 2. What exists today (preserve)
Single file `booksphere.html`, hash-routed views `home, dashboard, explore, mybooks, dna, streaks, clubs`.
- **Data:** `B` (books), `G`/`GC` (genres and colours), `P` (Reading DNA personas), `CITY`/`CL` (local clubs by city; sample data, keep it feeling real), `QT` (hero quotes).
- **State:** `S` in `localStorage` key `bs-v1`. Library entries `{id, st, prog, score}` with statuses reading/done/plan/hold/drop (MAL/AniList-style tracking modal with status, page slider, score). Streak log by date, joined clubs, user-created clubs.
- **Logic:** `dna()` (genre weights → persona, bars, donut), `recs()` (match % from DNA), `streak()`/`longest()`.
- **Motion:** pixel-art `Cat()` state machine (sleep → yawn → walk → sit, click to wake or send a heart, floating "z"s), coffee steam wisps, fireflies, swaying vines, lantern flicker, rotating hero quotes with dots, and the **login portal** (leather doors swing open, golden light, sparks, dashboard zooms in).
- **Interactions:** login modal, tracker modal, create-club modal, toast, city selector, search and genre chips on Explore.

## 3. Target project structure
```
index.html
css/  base.css  nav.css  home.css  dashboard.css  explore.css  dna.css  clubs.css  portal.css
js/   data.js  state.js  router.js  views.js  cat.js  effects.js  portal.js  modals.js  main.js
assets/  (see section 4)
reference/reference.jpg   <- the original 5-screen mockup (user to add)
```
Keep `data.js` as the single place to swap in a real API later. Create `assets/manifest.js` mapping logical names → file paths, so artwork can be replaced later without touching view code.

## 4. Asset inventory and processing
Rename on import:

| Supplied file | Rename to | Use |
|---|---|---|
| Enchanted_Cozy_Reading_Nook.png (1536×1024, opaque) | `assets/hero/nook.png` | **Home hero background.** Cream text area on the left. Has no cat and no steam; the mug is visible. |
| Whimsical_Botanical_Storybook_Dashboard_Frame.png (1536×1024, opaque) | `assets/frames/page-frame.png` | Page background for Dashboard, Explore, Reading DNA, Book Clubs, My Books, Streaks. Corner decorations: lantern, shelf, books, globe. |
| Vintage_Storybook_Reading_Asset_Sheet-removebg-preview.png (612×408, alpha) | `assets/sheets/library.png` | 12 book covers, shelf with open book, 3 book stacks, open book, leaf sprigs, corner vine. |
| Your_Reading_DNA…-removebg-preview.png (612×408, alpha) | `assets/sheets/dna.png` | Girl reading (persona card), globe and book, moons, sparkles, sprigs. The trait pills in the sheet are style reference only; keep traits as live HTML text. |
| Cozy_Watercolor_Library_Sticker_Set.png (618×404, alpha) | `assets/sheets/stickers.png` | Blank parchment banner (quote note), book stack with plants, open book and stack, **sleeping cat on books**, corner sprig. |
| Botanical_Vine_and_Ivy_Ornament_Collection.png (1536×1024, alpha) | `assets/sheets/vines.png` | 9 painted vine garlands (corners, horizontal swags, hanging strands). Cut each out as its own PNG. |
| vines.png (500×500, alpha) | `assets/_unused/vines-photo.png` | **Do not use.** Photoreal jungle vines clash with the painted style. |

**Slicing:** write a small script (Python and PIL, or Node) that finds connected components on the alpha channel (with a small dilation to keep each sprig together), crops each piece with 4 px padding, and exports individual transparent PNG and WebP files to `assets/slices/<sheet>/<name>-NN.png`. Name the meaningful ones by hand: the 12 covers `cover-<slug>.png`, `shelf-open-book`, `stack-1..3`, `banner-parchment`, `cat-sleeping-books`, `girl-reading`, `moon`, `globe-book`, `sparkle-1..n`, `vine-1..9`. Show the contact sheet for review before wiring anything.

**Known limitation:** the three small sheets are about 612 px wide, so each cover is about 60 px wide. Cover art will look soft on the Explore grid and on retina screens. Use them as-is for now, keep file names and the manifest stable, and expect higher-resolution replacements (section 5). Do not add sharpening or fake upscaling.

## 5. Assets still pending (use placeholders and log in `assets/MISSING.md`)
1. **Cat sprite sheet** (walk, sit, stretch, yawn, wash, look-up, sleep), transparent, same calico painted style. This is the highest priority. See section 7.
2. **6 club cover illustrations** (4:3): Cozy Readers, Fantasy Realms, Page Turners, Mindful Reads, Romance Circle, Sci-Fi Explorers.
3. **6 more book covers** (2:3) for Mystery and Non-Fiction: Gone Girl, The Silent Patient, Sapiens, Educated, The Hobbit, Pride and Prejudice. The supplied 12 have no Mystery or Non-Fiction titles, which the Reading DNA screen needs.
4. **High-resolution individual covers** (800×1200), including a corrected *Project Hail Mary* (the supplied cover reads "ANDY HAIL MARY").
5. Optional: illustrated icon set (flame, book stack, open book, bell, search, house, books, DNA, hourglass, people, compass, gear), and a logo.

Until 2 to 4 arrive: keep the supplied 12 covers as the catalogue, keep the existing CSS-gradient covers only for books with no image, and flag them in `MISSING.md`.

## 6. Screen-by-screen instructions

**Global:** match nav, spacing, type and colours to the reference. Landing nav is a floating pill (Home, Explore, Reading DNA, Book Clubs, About, search icon, dark-green Login button). Inner pages show the logo, links, search, bell and an avatar circle. Add the **About** page (short, on-brand). Add back arrows on Explore, Reading DNA and Book Clubs. Pick the closest Google Font to the reference's headline serif by visual comparison (candidates: Lora, Cormorant Garamond, Fraunces) and note the choice. Add `prefers-reduced-motion` handling.

**Home hero:** replace the SVG scene with `nook.png` as a 3:2 container (`aspect-ratio:3/2`, full width, max-height about 100vh), with headline, copy and the "Explore the Shelves →" button over the left cream area. Put `banner-parchment` bottom-left carrying the rotating quote, plus carousel dots. Approximate anchors (percent of image; **verify visually with a debug overlay and tune**): mug rim about 70% x / 64% y (steam origin); window arch about 53–79% x / 6–62% y (shimmer and clouds); lanterns about 3% x / 8% y, 96% x / 15% y and 96% x / 86% y (flicker glow); blanket and pillow about 70–91% x / 76–88% y (cat nap spot); sill top about 13–68% x / 78–86% y (cat walking line). Below 900 px wide, stack the text above the image and crop the image with `object-position` toward the right side.

**Dashboard, Explore, Reading DNA, Book Clubs, My Books, Streaks:** set `page-frame.png` as a fixed full-viewport background (`background-size:cover`) over the parchment colour. Content cards stay semi-opaque cream and must not cover the corner artwork. On narrow screens, scale the frame to viewport height and let the corners crop.
- *Dashboard:* greeting, quote note (`banner-parchment`), four stat cards with painted flame, books, open-book and the progress ring, Continue Reading, Today's Recommendation, with `cat-sleeping-books` bottom-right and a gentle breathing animation.
- *Explore:* real cover images, bookmark button, genre chips with a scroll arrow, shelf decoration top-right.
- *Reading DNA:* `girl-reading` with moon and sparkles in the persona card, `globe-book` top-right, live trait pills, genre bars and donut. Keep the bar-grow and donut-spin animations.
- *Book Clubs:* club cards with the 4:3 cover images (placeholder gradient plus emoji until supplied), Join toggle, city selector, Create a Club.

**Login portal:** keep the current flow (modal → doors → light → dashboard zoom). Restyle the doors with a leather and gold-foil look. Optional upgrade: add a variant that zooms the camera into the hero's arched window, flares to white, then cross-fades to the dashboard. Implement it behind a flag and show both for review.

## 7. Animation specs
- **Cat (painted sprites):** replace the pixel-art renderer in `cat.js` but keep the state machine (sleep → yawn → walk → sit → mug-sniff → return to nap). Frames are named `assets/cat/<state>_<n>.png` (`walk_1..6`, `sit_1..4`, `stretch_1..3`, `yawn_1..2`, `wash_1..3`, `lookup_1`, `sleep_1..2`). The same baseline and scale across frames. Face right, flip with `scaleX(-1)`. Walk at about 8 fps and move along the sill walking line. Sleep alternates frames or scales Y about 2% for breathing, with floating "z"s. Clicking wakes her or sends a heart. Until the sprites exist, use `cat-sleeping-books` for the dashboard and a breathing static nap on the blanket for the hero. Do **not** ship the pixel cat on painted art. Layering note: the hero is a flat image, so the cat renders in front. Keep her walking line clear of foreground ivy, or overlay a few vine slices on top of her feet for depth.
- **Coffee steam:** 3 to 4 soft wisps (blurred, semi-transparent, warm white) rising from the mug rim, swaying, expanding and fading. 3 to 4 s loops, staggered.
- **Lanterns:** flickering warm glow overlays (radial gradient, `mix-blend-mode:screen`) at the anchors.
- **Vines:** use sliced vine garlands along the hero top and corners. Pivot sway of 2 to 4° on the attach point, 5 to 8 s, desynchronised.
- **Window:** slow cloud drift or water-shimmer overlay clipped to the arch; occasional twinkle.
- **Ambient:** fireflies and gold sparkles (reuse the sparkle slices), plus a very subtle mouse-parallax on overlay layers.
- Keep everything GPU-friendly (`transform` and `opacity`) and pause off-screen animations.

## 8. Order of work
1. Create the project structure and split the file with **no visual change**. Confirm parity.
2. Import and slice assets. Produce the contact sheet and manifest.
3. Home hero with the real image, the steam, lantern glow, vines and the quote banner.
4. Page frame plus dashboard.
5. Covers wired into data. Explore, My Books and the tracker modal.
6. Reading DNA with the girl illustration.
7. Book Clubs with cover images or placeholders.
8. Cat sprites (when supplied), portal restyle and polish.
9. Responsive pass (390, 768, 1440, 1920), performance pass (convert PNG to WebP with PNG fallback, lazy-load covers, keep the initial payload under about 3 MB), then the reference comparison report.

## 9. Acceptance checklist
- Each of the 5 reference screens matches closely at 1440×900. Differences are listed.
- All features in section 2 still work. `localStorage` state survives reload.
- No console errors. No layout break at 390 px.
- No code-drawn art on painted screens. Missing assets are logged in `assets/MISSING.md`.
- Animations run smoothly. Reduced-motion users get static art.

---

## Appendix: generation prompts for pending assets (for the user, not for Antigravity/Agent)
**Cat sheet:** "Sprite sheet of one orange-and-cream calico cat in a warm hand-painted watercolor storybook style, ink linework, transparent background, side view facing right, identical scale and ground line in every cell, 512×512 cells. Rows: walking cycle (6 frames), sitting with tail in 4 positions, standing stretch (3), yawning (2), washing a paw (3), looking up (1), curled asleep (2: inhale and exhale)."
**Club covers (×6, 4:3):** same style as the reading nook. Cozy Readers: tea and coffee cups with an open book. Fantasy Realms: castle at night under a crescent moon. Page Turners: stack of books with a magnifying glass. Mindful Reads: potted plant beside an open book. Romance Circle: red roses with an open letter. Sci-Fi Explorers: brass telescope under stars.
**Covers (×6, 2:3, 800×1200):** match the existing cover set exactly, one file per cover, legible title and author text.
