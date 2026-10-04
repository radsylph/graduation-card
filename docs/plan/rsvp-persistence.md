# RSVP Persistence — Plan

Status: Approved · 2026-10-04

## Goal

Make the RSVP form remember, on the current device, that a guest has already
submitted an RSVP for a given event. On subsequent visits, hide the form and
show an RSVP confirmation instead — with an option to change the answer. The
submit flow (POST to the Apps Script) is untouched, and nothing here prevents
duplicate submissions from another device; this is a device-scoped convenience,
not identity-level assurance.

## Decisions

- **Scope**: per-device convenience. `localStorage` is per-browser, so this
  does not prove "this person already responded" across devices; it only
  covers the same browser. Shared devices are out of scope.
- **Storage**: `localStorage`, key `judith:rsvp:${typeOrigin}` — project-
  namespaced and per event, so the family and friends forms don't collide.
- **Record schema**: `{ name, email, attending: boolean, submittedAt: ISO }`.
  `attending` is normalized to a boolean at write time; no `version` field.
- **Write timing**: only after `response.ok`. Validation failures, network
  errors, and 4xx/5xx responses never persist a record.
- **Reversible**: an RSVP confirmation shows a "¿Cambiar mi respuesta?" button
  that clears the record and re-shows the form, so guests can revise a
  misclicked or changed answer.
- **Module**: storage lives in a small `src/lib/rsvp-store.ts` (save/get/clear)
  with try/catch guards so unavailable storage (private mode, quota) never
  breaks the form.
- **Markup**: a sibling `<div data-rsvp-confirmation>` outside the `<form>`;
  the existing `<p data-confirmation>` stays for the transient success/error
  message during submission.
- **Copy**: two variants depending on attendance — "asistencia confirmada" for
  yes, "respuesta registrada" for no — each followed by the change-answer
  button.
- **Accepted tradeoff**: the form is present in the static HTML and is hidden
  only when the client script runs, so a brief flash of the form can appear
  before the RSVP confirmation on slow connections.

## File changes

| File                               | Change                                                                 |
| ---------------------------------- | ---------------------------------------------------------------------- |
| `src/lib/rsvp-store.ts`            | New; `RsvpRecord` type + `saveRsvp`/`getRsvp`/`clearRsvp` with guards. |
| `src/components/RsvpForm.astro`    | Sibling confirmation markup, storage wiring, initial `renderState`, change-answer button. |
| `CONTEXT.md`                       | Added `RSVP record` and `RSVP confirmation` to the glossary.           |
| `docs/plan/rsvp-persistence.md`    | This plan.                                                             |

## Implementation notes

- The module and the component script both use `typeOrigin` (the event slug)
  as the key suffix; it is already available to the script via `define:vars`.
- `renderState()` runs on load and after each submit: if a valid record exists,
  hide the form and fill the confirmation; otherwise show the form and hide
  the confirmation.
- On successful submit: set the transient confirmation text, `saveRsvp(...)`,
  reset the form, then `renderState()`.
- The change-answer button is `type="button"` and on click clears the record,
  resets the form, re-shows it, and focuses the name input.
- The RSVP confirmation is `role="status"` with `tabindex="-1"` so it can
  receive focus when the form disappears.

## Validation

- `npm run build`
- Manual check in dev server:
  1. Submit a valid RSVP → transient message shows, record saved.
  2. Reload → form hidden, RSVP confirmation shown with the right variant.
  3. "¿Cambiar mi respuesta?" → form re-shows with cleared record; reload keeps
     it visible.
  4. Submit the other event's form → confirmations are independent per event.
- Review against the Web Interface Guidelines (focus management, `role="status"`).

## Follow-ups

- If duplicate-proofing across devices is ever required, the Apps Script would
  need a lookup endpoint keyed by email, and the page a GET on load.
