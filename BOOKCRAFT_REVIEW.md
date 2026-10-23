# Wooden controls and continuous book pages

Implemented for the landing page on 19 October 2026, following the approved plan.
The accepted nook composition and the application’s existing route/account/state
behavior are retained.

## Review

Open `review/bookcraft.html` for the current screenshot gallery, including all
four sizes and the three chapters, closing page, and previous implementation.
The earlier Phase 1 gallery is retained separately at `review/index.html`.

## What changed

- Primary and secondary hero actions, chapter actions, landing Login and active
  navigation use an actual generated walnut plaque with fine brass edging.
  A sliced image frame retains its corners at different button widths; labels
  remain real HTML text. Hover adds lift and a restrained light pass, pressing
  settles the control, and keyboard focus remains visible.
- The lower page is continuous and full-width. The opening page, three chapters
  and closing scene reach both browser edges. Text and central illustrations
  retain a comfortable reading measure inside the full-width painting.
- Painted frame corners are cropped as separate proportioned pieces and arranged
  differently on each chapter, rather than stretching the complete old frame.
- Centre folds, thin page edges, folios, an active chapter bookmark, a soft
  light sweep and small scroll-linked movement create the book treatment.
  Native wheel, touch and keyboard scrolling remain available.
- The Streaks illustration is now a new, clean standalone painted open book;
  fragments from neighboring sticker cells are no longer displayed. The reader
  crop is cleaned with alpha-connected components, preserving the main painting.
- A generated bookshelf painting closes the page at full viewport height, with
  quiet parchment for live copy, books and warm lanterns below. The phone crop
  favours the central open book and shelf. The chapter bookmark ends before it.
- Chapter and footer images are loaded on approach with IntersectionObserver.
  Phone-sized WebP delivery versions and PNG sources/fallbacks are retained.
- Reduced motion disables the page sweep, perspective reveal and parallax.

## Files and generated artwork

`css/bookcraft.css` contains the landing-scoped visual layer. `js/home.js` renders
the chapter markup and owns the scroll/reveal/image-loading lifecycle.
`scripts/prepare_bookcraft_assets.py` reproduces delivery assets from retained
source paintings. The app still needs no framework or build step.

New assets were made with the **built-in ImageGen tool**:

- `assets/craft/walnut-plaque-original.png` → `walnut-plaque.webp`
- `assets/craft/closing-library-original.png` → `closing-library.webp` and
  `closing-library-mobile.webp`
- `assets/craft/ritual-book-original.png` → `ritual-book.webp`

Full prompts and provenance are recorded in `assets/craft/GENERATION.md`.
The supplied nook, cat, frame and source sheets were preserved.

## Verification

`node scripts/hero-review.cjs bookcraft` captures and checks 1440×900,
1920×1080, 2560×1080 and 390×844. Evidence is stored in `review/bookcraft/`.

- Hero fills each viewport and preserves the three-line headline.
- Headline and quote do not overlap; Mochi remains in the visible viewport.
- Every chapter and the footer span the exact browser width, with no horizontal
  overflow. Chapter copy clears the central illustration at each size.
- Chapter images decode successfully when they enter view; bookmark selection
  follows the visible chapter. The closing painting loads when approached.
- The primary button uses the painted wood asset.
- Tracker badge, cat heart, Reading DNA action, navigation and login still work.
  Login reaches the dashboard through the portal and survives reload.
- No uncaught page errors or browser console errors during the checks.
- Reduced-motion hero and chapters have no running CSS animations.

Mobile Lighthouse 13.5, simulated mobile run against a local static server:

| Measure | Result |
| --- | --- |
| Performance | **81 / 100** |
| First contentful paint | 1.9 s |
| Largest contentful paint | 4.8 s |
| Total blocking time | 110 ms |
| Layout shift | 0 |
| Total transferred resources | 591 KiB |

Report: `review/bookcraft/mobile-lighthouse.report.html`; JSON alongside it.
This meets the prior ≥80 target; these are local simulated measurements.

## Deliberate limits

The page treatment uses depth, shadows and light rather than literal curling
paper geometry. No wheel interception or forced scroll snapping is introduced.
Existing low-resolution reader/globe artwork remains at a restrained display
size. Other app screens keep their previous controls and layout. Mochi’s
multi-pose sprite animations and the optional background video remain separate
pending work from the previous brief.

## Local viewing

Run `python -m http.server 4173 --bind 127.0.0.1` from the project root and open
`http://127.0.0.1:4173/index.html#home`.
The new gallery is `http://127.0.0.1:4173/review/bookcraft.html`.
