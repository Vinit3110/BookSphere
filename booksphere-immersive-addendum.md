# BookSphere: Immersive Hero Addendum

**This supersedes "Home hero" (section 6) and the hero parts of section 7 in `booksphere-antigravity-brief.md`.** Everything else in that brief still applies.

## Why the current hero fails
The first brief asked for the art in a 3:2 container, so it renders as a boxed card with page margins, a floating nav above it, and a narrow text column. The headline wraps one word per line and collides with the quote banner. The left side looks grey instead of warm parchment. The cat is tiny and the steam is barely visible. The target is closer to Genshin Impact's site: the artwork *is* the page, edge to edge, with the UI floating on top of it.

## 1. Layout: full-bleed and cinematic
- `.hero` is `width:100%; height:100svh; min-height:640px; overflow:hidden`. No max-width, no side margins, no border radius, no card.
- The nav overlays the hero (`position:fixed`, floating pill, transparent over the art, turning solid cream with a soft shadow after scrolling about 40 px). No cream gap above the art.
- The image layer is `object-fit:cover; object-position:62% 50%` so the window, shelf, mug and blanket always stay in frame.
- **Wide screens (aspect wider than 3:2):** fill the extra width on the left with the parchment colour sampled from the image's left edge (plus the paper-grain texture), and fade the image's left edge into it with `mask-image: linear-gradient(to right, transparent, #000 18%)`. There must be no visible seam.
- **Tall and mobile screens:** anchor the image to the bottom; put the text on a parchment gradient at the top; crop toward the window and cat.
- Remove any grey or dim overlay on the cream zone. Day/dusk/night tints may only affect the window and lantern glow, as blend layers masked to exclude the left 45% of the image.

## 2. Typography and UI on the art
- Headline: fixed lines "A universe / of books, / built for you.", each `white-space:nowrap`, `font-size:clamp(44px,6.2vw,96px)`, in a left safe zone (`left:6vw; width:44vw`) vertically centred. Subtitle underneath, then a primary CTA "Explore the Shelves →" and a ghost CTA "Discover your Reading DNA".
- Quote banner (parchment slice) bottom-left, clear of the headline. The text must fit inside the banner (size the banner to its content with padding) and sit above the book stack. Add a layout test that fails if the banner and h1 boxes overlap at any tested viewport.
- Quote dots stay. Add a bouncing scroll-down chevron bottom-centre.
- Floating **"Book of the Day"** badge top-right: small cover with a soft glow and sparkles, opening the tracker modal on click (the equivalent of Genshin's event badge).

## 3. Depth and motion
- Slow push-in on load (`scale 1.05 → 1`, 6 s ease-out).
- Mouse parallax on three planes, using `transform` only: background image ±6 px, vine overlays ±14 px, cat, steam and fireflies ±10 px. Gentle device-tilt parallax on mobile if permitted.
- Vine slices over the top-left and top-right, swaying from their attach point. Lantern glows flicker (screen blend). Steam rises from the mug rim, soft and clearly visible. Fireflies and sparkles drift. A cloud drift or water shimmer is clipped to the window arch.
- The cat is at least 1.25× the scale of her painted size in the art, so she reads as alive. She stays in front of the art and behaves as before (nap, wake, stretch, wash, wander, return). Tapping her still sends a heart.

## 4. Intro sequence (about 1.6 s, once per session)
A warm dark vignette fades out, lanterns ignite (opacity ramp), steam starts, headline lines rise with a 120 ms stagger, then the nav slides down. Skip it on revisits in the same session and under `prefers-reduced-motion`.

## 5. Below the hero: keep the world going
A scroll-driven section titled **"Your reading life, in three rooms"**: Reading DNA, Streaks and Book Clubs, each as a large painted panel built from the frame and sticker assets. Panels reveal on scroll (IntersectionObserver, fade and rise, parallax on foliage), with a sticky progress indicator. Streaks shows ivy growing leaf by leaf. End with a footer that has lanterns and a short sign-off. Use the same cream-and-gold design language throughout.

## 6. Phase 2 (optional, after Phase 1 is approved): ambient video loop
This is the biggest single step toward Genshin-level feel. Generate an 8 to 10 s **seamless loop** from `nook.png` using an image-to-video tool, with no cat in it. Motion: steam, lantern flicker, vine sway, drifting light in the window. Ship it as `hero.webm` and `hero.mp4` (each ≤ 2.5 MB), in a `<video autoplay muted loop playsinline poster="nook.webp">`. Keep the cat, fireflies and parallax overlays on top. Fall back to the still image on slow connections or reduced motion.
Prompt (for the user): "Subtle seamless loop of this painted storybook reading nook: steam curling from the green mug, warm lantern flames flickering, ivy leaves swaying gently, soft light shimmering in the arched window. Camera static. No new objects, no characters."

## 7. Acceptance
- At 1440×900, 1920×1080, 2560×1080 and 390×844 the hero fills the viewport edge to edge with no gap or seam.
- The headline is three lines and nothing overlaps it. No grey wash on the cream area.
- Steam, lantern glow, vines and fireflies are visibly moving. The cat is clearly alive. The intro plays once.
- Mobile Lighthouse performance is at least 80. Reduced-motion users get a still hero.
- Provide before and after screenshots at all four sizes. List any remaining differences from the intent honestly.
