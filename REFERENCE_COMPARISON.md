# Reference comparison — current pass

> Historical report from the initial visual pass. The landing-page findings and
> browser-capture limitation below are superseded by `IMMERSIVE_HERO_REVIEW.md`
> and the before/after gallery at `review/index.html`.

The supplied screenshot was used as a visual direction and the supplied painted
assets were inspected before wiring. The landing page now uses the painted nook
as its full hero; the inner library pages use the illustrated page frame; the
catalogue uses the supplied cover crops; and Reading DNA and the dashboard use
their supplied character/sticker illustrations.

## Remaining differences from the reference

- The supplied hero has no painted cat or cat animation frames. A supplied
  sleeping-cat sticker is used as a gently breathing static overlay instead.
- Club cards remain neutral parchment placeholders with their existing icons
  until the six requested 4:3 illustrations arrive.
- Six catalogue titles retain their CSS cover fallback because no supplied cover
  exists. The included 12 sheet covers are small source crops, so they are soft
  at large grid sizes.
- The current prototype is intentionally still powered by its pre-existing
  single-file interaction layer in `index.html`; the visual styles and
  assets are now separated, but the full JavaScript module extraction described
  in the brief remains a follow-up refactor.
- `reference/reference.jpg` is not present in the workspace. The chat image was
  used as the reference preview, but placing the original file at that path is
  needed for a repeatable pixel comparison.

## Verification performed

- `python scripts/slice_assets.py` regenerated the asset crops, PNG fallbacks,
  WebP files, and `assets/contact-sheet.png` successfully.
- The app script passed a JavaScript parse check with Node.
- A local static server returned HTTP 200 for the entry page, application,
  hero WebP, representative cover WebP, and page CSS.

## Screenshot QA status

Automated 1440×900 and 390×844 capture could not be completed in this runtime:
both installed Chromium-based browsers exited before rendering because their GPU
process could not initialize in the sandbox. This is an environment limitation,
not a pass claim. Run the static app in a normal browser at those breakpoints
before signing off the final spacing and overlay anchors.
