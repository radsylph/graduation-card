# Invitation Page — Plan

Status: Approved · 2026-09-18

## Goal

Build the invitation page at `/invitation` with the gothic/ceremonial palette:
a hero (envelope reveal + live countdown), a location section (map + venue
text), and an RSVP form. The welcome screen at `/` is left untouched.

## Decisions

- **Route**: `/invitation` is the event page; `/` (welcome screen) is unchanged.
- **Event**: Judith's graduation; date `2026-10-10`, 18:00 GMT-4 (placeholder `TODO`).
- **Guest name**: read from the `?guest=Jane` query parameter client-side;
  falls back to "Guest", and pre-fills the RSVP name field.
- **Palette**: main canvas `#0E0E0E`, cards `#2E2E2E`, parchment `#F7EFE2`,
  gold `#C09D3E`, crimson `#A61F1F`, velvet `#7A1212`, body cream `#F7EFE2`.
- **Fonts**: Google Fonts — Cinzel (display) + Cormorant Garamond (body), with
  system-serif fallbacks. Loaded via a new `<slot name="head" />` in `Layout.astro`
  so the welcome screen's fonts are unaffected.
- **Styling**: scoped Astro CSS per component; palette and font stacks are CSS
  custom properties in `global.css`, plus a shared `.card` utility (unused by `/`).
- **Hero**: the parchment card is the hero container — double gold borders, the
  four-frame envelope reveal, graduation typography, and a wax seal. The countdown
  sits below it in its own charcoal card.
- **Animation**: the four envelope frames play once on load and hold the final
  frame; `prefers-reduced-motion` shows the static open frame.
- **Countdown**: `Countdown.astro` takes a `date` (ISO) prop; renders
  days/hours/minutes/seconds and swaps to "The day has arrived" at zero.
- **Location**: keyless Google Maps embed (`?q=…&output=embed`) with a placeholder
  address (TODO) beside placeholder venue text.
- **RSVP**: `name`, `email`, and an `attending` radio pair ("Joyfully accepts" /
  "Regretfully declines"); client-side validation, a local confirmation message,
  and no data is sent or stored.

## File changes

| File                                 | Change                                                                          |
| ------------------------------------ | ------------------------------------------------------------------------------- |
| `src/pages/invitation.astro`         | Rewritten: hero (InvitationCard + Countdown), Location, RSVP, guest-name script. |
| `src/components/InvitationCard.astro` | New; parchment card with envelope reveal, typography, and wax seal.             |
| `src/components/Countdown.astro`     | New; live countdown with a `date` prop.                                         |
| `src/components/RsvpForm.astro`      | New; name/email/attending form with local confirmation.                         |
| `src/components/Welcome.astro`       | Deleted (unused Astro starter placeholder).                                     |
| `src/layouts/Layout.astro`           | Added `<slot name="head" />`.                                                   |
| `src/styles/global.css`              | Added palette + font tokens and a shared `.card` utility.                       |
| `CONTEXT.md`                         | Added `Invitation card`, `Guest name`, `RSVP` to the glossary.                  |

## Implementation notes

- The event date lives once in `invitation.astro` as `EVENT_DATE`
  (`2026-10-10T18:00:00-04:00`), passed to `Countdown` and formatted for the card.
- The envelope reveal uses four stacked `<img>` layers whose `opacity` keyframes
  step through the frames; the container is anchored to frame 4's aspect ratio
  (`357 / 441.75`) with `object-position: center bottom` so the letter grows upward.
- The guest name is assigned via `textContent` (no HTML injection) and only when
  `?guest=` is present; otherwise the salutation reads "Dear Guest".
- The Google Maps iframe is grayscaled with CSS to sit within the gothic palette.

## Validation

- `npm run build`
- Manual check in the dev server (`astro dev --background`)
- Review against the Web Interface Guidelines.

## Follow-ups

- Replace the placeholder venue/address and confirm the ceremony time.
- Wire the RSVP form to a real backend (data is currently discarded).
- Consider a literal flap-lift animation if dedicated flap artwork is added.
