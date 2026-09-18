# Welcome Screen — Plan

Status: Approved · 2026-09-18

## Goal

Add a welcome screen at `/` showing a closed envelope sealed with wax. Clicking the wax seal opens the invitation.

## Decisions

- **Route mechanics (V2)**: `/` serves the welcome screen directly — no redirect. The invitation moves from `/` to `/invitation`. `welcome.astro` is deleted.
- **Navigation**: a semantic `<a href="/invitation">` wrapping the seal, so it works without JS, supports open-in-new-tab, and is screen-reader friendly.
- **Composition**: envelope centered fullscreen, wax seal positioned at 50%/70% of the envelope, seal width 20% of the envelope.
- **Background**: soft paper tone `#f5f1e8`, swappable via the `--paper` CSS variable.
- **Animation**: seal "peel" (scale/rotate/fade with a lifting shadow), then the envelope crossfades from the closed envelope to the flat envelope (`FlatEnvlopedClosed.svg`), then navigate. `prefers-reduced-motion` and JS-disabled users both fall back to instant native navigation.
- **Accessibility**: `aria-label="Open the invitation"` on the link, decorative `alt=""` on both images, a visible focus ring, and a hover affordance.
- **Layout**: reuse `Layout.astro`, adding an optional `title` prop; welcome title is `Judith — You’re Invited`.

## File changes

| File                         | Change                                                        |
| ---------------------------- | ------------------------------------------------------------- |
| `src/pages/index.astro`      | Replaced with the welcome screen (envelope + seal).           |
| `src/pages/invitation.astro` | New; holds the previous placeholder invitation content.       |
| `src/pages/welcome.astro`    | Deleted.                                                      |
| `src/layouts/Layout.astro`   | Added optional `title` prop (default unchanged).              |
| `CONTEXT.md`                 | New glossary (Welcome screen, Invitation, Wax seal, Opening). |

## Implementation notes

- Assets are imported as Astro image assets (`.src`), matching the existing `Welcome.astro`.
- Envelope aspect ratio is `361.5 : 227.25`; on desktop the wrapper width is `min(20vw, calc(88svh * 1.5906))`, and on phones (`max-width: 768px`) it widens to `min(92vw, calc(88svh * 1.5906))` so it fits the viewport while preserving shape.
- The flat envelope layer renders at the closed envelope's full width, centered on it via `translate: -50% -50%`, and capped at `87svh` so it still fits short viewports.
- Animation is ~1050ms total: seal peel (400ms) → envelope crossfade to the flat envelope (400ms, delayed 400ms) → short beat → `location.assign('/invitation')`.
- Returning to `/` via the browser back button restores the page from the back/forward cache in its opened state; a `pageshow` listener clears the pending timer and resets the sealed state so the seal is clickable again.

## Validation

- `npm run build`
- Manual check in the dev server (`astro dev --background`)
- Review the new pages against the Web Interface Guidelines.

## Follow-ups

- Replace placeholder content on `/invitation` with the real invitation.
- A literal flap-lifting animation would still require separate flap artwork; the open effect crossfades to the flat envelope instead.
- Swap to red velvet by changing `--paper` in `src/pages/index.astro`.
- `Welcome.astro` (component) now collides semantically with the "welcome screen" — rename it when the invitation page is rebuilt.
