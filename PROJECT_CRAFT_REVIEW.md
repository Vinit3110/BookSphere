# BookSphere — project-wide storybook pass

The existing static project and its local state/router are retained. Nothing was deployed and no dependencies or artwork-generation calls were needed.

## Implemented

- Shared parchment scroll controls throughout navigation, dashboard, shelves, clubs and dialogs. The supplied treasure-map artwork still supplies the rolled edge, paper and curled end. Hover/focus unfurls; activation rolls up before the existing action runs once. Reduced motion has no action delay.
- Paper-grain cards and forms, warm brass/ink colors, botanical page backgrounds, bookmark ribbons, compact parchment filters, account controls and matching toasts.
- One viewport-sized storybook containing chapter 01, 02, 03 and the illustrated final page. A half-width, two-sided leaf rotates 180° around the center crease; the other half remains still. Reverse turns use the same spine in the opposite direction. Changing paper shade and the incoming spread replace vertically stacked panels.
- Next/previous, direct chapter bookmarks, arrow/Page Up/Page Down keys, wheel at the book boundary, and horizontal swipe. Hidden spreads are inert, and the current-page status is announced without moving focus unnecessarily.
- Mobile app navigation now has its own horizontal row. Sidebar overlap and hidden My Books Edit actions are fixed.

## Verification

`node scripts/project-review.cjs` runs isolated browser contexts at 1440×900 and 390×844. It checks that only half the spread rotates, measures the hinge at three animation positions against the exact center of the book, and verifies the reverse hinge too. It also checks the four-page sequence, reverse turns, keyboard, wheel, swipe, stable document height, hidden-page focus exclusion, all seven non-home routes, no horizontal overflow, painted action controls, search, genre filters, tracker save/remove, reading log, club join/leave, city selection, club creation and persistence. Reduced motion is checked separately.

`node scripts/hero-review.cjs project-hero` checks the retained hero at 1440×900, 1920×1080, 2560×1080 and 390×844, including artwork sizing, title/quote clearance, Mochi, scroll cue, login/portal, persisted sign-in and reduced motion.

Screenshots and machine-readable results are in `review/project/` and `review/project-hero/`. Open `review/project-preview.html` for the visual review.

## Honest limits

The page turn is a lightweight CSS 3D paper rotation, not a physics-based curling-paper simulation. Small screens can scroll within a spread if their height cannot accommodate its content. Clubs retain their existing neutral illustrated-color placeholders and emoji because six club paintings are missing; covers without supplied art retain their existing typographic fallback. Accounts and reading data remain browser-local, as before. See `assets/MISSING.md` for the existing asset gaps.
