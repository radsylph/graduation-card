# Disclaimer Section — Plan

Status: Implemented · 2026-10-04

## Goal

Add a standalone `Disclaimer` section to `/invitation` that asks guests to keep their phones away during the event so everyone can be present and connect. The section also reserves a placeholder for a "no cellphones" SVG that will be added later.

## Decisions

- **Placement**: `Disclaimer.astro` is its own section, inserted between `DressCode` and `RsvpForm` on `/invitation`.
- **Copy** (formal Spanish, matching the invitation tone):
  - Heading: `Una noche sin distracciones`
  - Body: `Para fomentar la conexión entre todos, te pedimos guardar tu celular durante la celebración. Disfrutemos juntos este momento.`
- **SVG placeholder**: centered above the heading inside `.no-phone-sign`, roughly `120px × 120px`, responsive, `aria-hidden="true"`, with a `<!-- TODO: replace with no-cellphone SVG -->` comment.
- **Visual treatment**: reuse the shared `.card` utility with the same treatment as `DressCode` and `RsvpForm`:
  - `max-w-170`, centered, `mt-12`
  - padding `p-[clamp(1.5rem,4vw,2.5rem)]`
  - heading in `font-display text-gold`
  - body in `text-black` for contrast on the parchment card
- **Animation**: wrap in `FadeInText` with `delay={0.25}` so it staggers between `DressCode` (`0.2`) and `RsvpForm` (`0.3`).
- **Accessibility**: `<section aria-labelledby="disclaimer-heading">` and a matching `id` on the heading. The SVG will receive descriptive `alt`/`aria-label` text when it is added.
- **Component name**: keep `src/components/Disclaimer.astro` and document the term in `CONTEXT.md`.

## File changes

| File                              | Change                                                                |
| --------------------------------- | --------------------------------------------------------------------- |
| `src/components/Disclaimer.astro` | New section component with heading, body, and SVG placeholder.        |
| `src/pages/invitation.astro`      | Import `Disclaimer` and render it between `DressCode` and `RsvpForm`. |
| `CONTEXT.md`                      | Add the `Disclaimer` term to the glossary.                            |

## Implementation notes

- The component is static; no client-side script is needed.
- Keep the SVG wrapper as simple as possible so swapping in the real asset later is a one-line change:

  ```astro
  <div class="no-phone-sign" aria-hidden="true">
      <!-- TODO: replace with no-cellphone SVG -->
  </div>
  ```

- `.no-phone-sign` should be centered with `mx-auto` and scale down on small screens, e.g. `w-[clamp(80px,25vw,120px)] aspect-square`.
- In `invitation.astro`, import and render it like this:

  ```astro
  import Disclaimer from "../components/Disclaimer.astro";
  ```

  ```astro
  <FadeInText enhance duration={0.7} yOffset={30} delay={0.25}>
      <Disclaimer />
  </FadeInText>
  ```

- The `.card` utility sets `color: var(--color-cream)`; override the body paragraph with `text-black` so it remains readable against the parchment background.
