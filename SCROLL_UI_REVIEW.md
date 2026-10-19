# Parchment scroll controls

Uses the user-supplied `Images/Weathered Treasure Map Scroll Frame.png`.
No new artwork was generated for this pass; the source is preserved unchanged.

## Result

The landing-page hero actions, chapter/closing actions, Login and active Home
navigation now use the supplied scroll instead of the walnut plaque. The chapter
bookmark adopts the same parchment palette. Other application screens retain
their existing interface.

`review/scroll-buttons.html` is a working, repeatable animation preview and links
to desktop and phone screenshots. Complete captures are in `review/scroll/`.

## Motion and behavior

- Fixed left roll/compass; centre paper unfolds from the left; right edge travels
  with it. The supplied art is proportioned into three pieces rather than
  squeezing its full illustration into every button.
- Hover or visible keyboard focus gently unfurls the scroll. Pointer exit
  returns it to its readable, mostly open resting state.
- Activation rolls the parchment closed, fades its label briefly, then forwards
  the original route/modal action after 190 ms. Repeated clicks during that
  brief animation are ignored, avoiding duplicate actions.
- Touch receives press feedback; pointer cancellation clears that state.
- Reduced motion keeps the artwork still and executes actions immediately.
- Labels remain real text, the artwork is hidden from assistive technology, and
  the hit target does not resize or move during the visual animation.
- ResizeObserver recalculates the roll travel when button widths or fonts change.
  Event listeners, observers and pending timers are cleaned up on navigation.

## Files

- `css/scroll-ui.css`: artwork, animation, responsive sizing and reduced motion.
- `js/home.js`: accessible button layers and action forwarding.
- `scripts/prepare_scroll_ui.py`: reproducible source slicing and optimization.
- `assets/ui/scroll/{roll,paper,edge}.webp`: 49 KB combined; PNG fallbacks retained.
- `css/bookcraft.css`: excludes scroll controls from the previous wood styling.

## Verification

`node scripts/hero-review.cjs scroll` checks 1440×900, 1920×1080, 2560×1080 and
390×844 and saves screenshots and results in `review/scroll/`.

The checks cover unfurling on hover, settling on exit, identical hit-target
geometry before/after hover, keyboard focus and Enter activation, the closing
state, touch cancellation, reduced-motion navigation, chapter/hero layout,
tracker and cat actions, login through the existing portal, and persisted state
after reload. No uncaught page errors or console errors were observed.

Final mobile Lighthouse simulation: **85/100**, first contentful paint 1.8 s,
largest contentful paint 4.1 s, total blocking time 70 ms, layout shift 0.007,
570 KiB transferred. The superseded wood texture is no longer requested by the
landing page. Saved report: `review/scroll/mobile-lighthouse.report.html` and JSON.
