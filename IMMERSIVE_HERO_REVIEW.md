# Immersive landing page — Phase 1 review

Implemented against `booksphere-immersive-addendum.md`. The work is confined to
the landing experience and shared font/image loading needed for its performance.
The original app routes, tracker, localStorage key and login portal remain in use.

## Review the result

Open `review/index.html` for the complete before-and-after gallery, including all
four requested sizes, the reading rooms, a daylight view, and reduced motion.

| Viewport | Before | After |
| --- | --- | --- |
| 1440 × 900 | [Before](review/before/1440x900.png) | [After](review/after/1440x900.png) |
| 1920 × 1080 | [Before](review/before/1920x1080.png) | [After](review/after/1920x1080.png) |
| 2560 × 1080 | [Before](review/before/2560x1080.png) | [After](review/after/2560x1080.png) |
| 390 × 844 | [Before](review/before/390x844.png) | [After](review/after/390x844.png) |

Before captures were taken from the actual previous implementation before the
new source changes. `review/baseline/` preserves its HTML and home stylesheet.
Screenshots use Chrome at device scale 1. The primary captures show the local
night treatment; `review/after/1440x900-day.png` shows daylight.

## Implemented

- Hero starts at (0, 0), fills 100% of the viewport, has no card edges or gap.
  The painting retains its original proportions; wide screens extend its paper
  into the left side with a feathered mask. The left-edge mask was widened to
  prevent ghost foliage showing behind the headline.
- Fixed translucent navigation floats over the art and becomes cream after
  scrolling 40 px. On phones, the compact bar keeps the logo and account action.
- Three explicit, unbroken headline lines; primary and Reading DNA CTAs; a
  parchment quote with working dots; a scrolling chevron; and a Book of the Day
  badge that opens the existing tracker.
- Shared painting coordinates for the mug steam, lantern glows, clipped window
  light, and larger cat. Phones crop toward the window, mug and blanket, with a
  parchment gradient preserving text contrast above them.
- Six-second push-in, three parallax planes, sliced painted vines with sway,
  visible steam wisps, flickering lantern glows, fireflies, and window shimmer.
  Browser-local time changes only the window and lantern treatment.
- A once-per-session vignette/lantern/headline/nav introduction. Same-session
  revisits skip it. IntersectionObserver and page visibility pause hero motion.
  Device tilt is used only where the browser already permits it; no sensor
  permission prompt is introduced.
- Three painted reading-room panels, reveal transitions, sticky section
  progress, leaf-by-leaf ivy growth, route links and a two-lantern footer.
- Still artwork under reduced motion, with no running hero CSS animations.
- Same Fraunces and Nunito fonts served locally with their OFL licenses;
  preloaded hero art; a downsampled phone WebP; WebP/PNG picture fallbacks; and
  deferred frame backgrounds on panels that have not entered view.

## Browser acceptance checks

`node scripts/hero-review.cjs after` checks all four sizes and saves the evidence
in `review/after/`. Playwright is loaded from the bundled runtime by default;
`PLAYWRIGHT_MODULE` can point to another installed Playwright package.

- Hero dimensions match each viewport exactly; no horizontal overflow.
- Headline has exactly three lines, none overflow their safe zone, and the quote
  and headline rectangles do not overlap. At 1440 × 900, the previous title was
  565 px high and overlapped the quote; the new title is 284 px high and clears it.
- Mochi remains inside the visible viewport at each size.
- Book of the Day opens the tracker; tapping Mochi produces a heart.
- The chevron scrolls to the reading rooms and the nav turns cream.
- Same-session navigation skips the intro, and the Reading DNA CTA opens DNA.
- Login still passes through the portal to the dashboard; the signed-in name
  survives reload.
- No browser console errors or uncaught page errors during these checks.
- Reduced-motion capture has zero running hero CSS animations.

## Mobile performance

Final Lighthouse 13.5 mobile simulation against the local static server:

| Measure | Result |
| --- | --- |
| Performance score | **83 / 100** |
| First contentful paint | 1.8 s |
| Largest contentful paint | 4.5 s |
| Total blocking time | 70 ms |
| Cumulative layout shift | 0 |
| Total transferred resources | 606 KiB |

The requested score of at least 80 is met. The saved HTML report is at
`review/mobile-lighthouse.report.html`, with machine-readable results alongside
it. These are local simulated measurements, not deployed-site field data.

## Remaining differences and deferred work

1. **Mochi's animation artwork is still missing.** The supplied illustration
   includes the sleeping cat and books as one piece. Breathing, floating z's, a
   small greeting movement and hearts are implemented. Real yawning, stretching,
   washing, looking and walking require the painted sprite frames in
   `assets/MISSING.md`; those poses have not been invented or claimed complete.
2. **Night is a window-local colour/light treatment.** The original daytime
   painting is retained; the sky is not replaced by a separately painted night
   scene. The parchment is unaffected.
3. **The art is still a flat painting.** Three overlay planes create restrained
   depth, but the castle, shelf and individual baked-in leaves cannot move
   independently without separated source artwork.
4. **Phase 2 video remains deferred**, as the addendum specifies approval after
   Phase 1. No video loop was generated or substituted for the painting.
5. The crop and spacing deliberately differ between phones and desktop so the
   key objects stay visible. Final screenshots are provided for visual review;
   no pixel-identical match to the original five-screen reference is claimed.

## Local preview

From the repository root, run `python -m http.server 4173 --bind 127.0.0.1`,
then open `http://127.0.0.1:4173/booksphere.html#home`.
The screenshot gallery is `http://127.0.0.1:4173/review/`.
No framework, build step, account or deployment is required.
