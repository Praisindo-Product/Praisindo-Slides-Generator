# Clients

A deck is made for a client, or for no client (`praisindo`). The client sets the logo in the
header and on the cover, the cover's dark theme and glow, the statement tables' tint and bands, the
diagram's client tint, and the chart series. Everything else stays Praisindo's.

## Clients in the registry

| Id | Name | Brand colours |
| --- | --- | --- |
| `praisindo` | Praisindo (no client) | `#0093dd`, `#0b2f57` |
| `cimb-niaga` | CIMB Niaga | `#ed3024`, `#790008` |
| `nobu-bank` | Nobu Bank | `#06d7a1` |
| `btn` | Bank BTN | `#005bfd`, `#ff0000` |
| `trimegah-am` | Trimegah Asset Management | `#f05a22`, `#0038a0` |
| `batavia` | Batavia Prosperindo Aset Manajemen | `#002878` |
| `maybank-am` | Maybank Asset Management | `#ffc600`, `#373737` |

The palettes are the institutions' theme presets in WMS-IMS Ultimate
(`src/data/seeds/institution-presets.ts` there). Keep them in step.

## Adding a client

1. Put the logos in `brand/clients/<id>/`: one for white paper and one for dark slides (the same
   file if it works on both). SVG, PNG or JPEG; the engine trims and rasterises them.
2. Add an entry to `CLIENTS` in `engine/clients.ts`: `id`, `name` (as printed in the footer),
   `legalName`, `logos`, `logoHeight` and `palette` (`primary`, `secondary` or null, and `dark` with
   `background`, `surface`, `text` and optionally `secondary` for the dark theme).
3. Set `logoHeight` so the logo carries the same weight as the Praisindo lockup in the header:
   about 11 to 12 points for a bold, all-capital logo, 15 for a plain wordmark, 18 to 20 for a logo
   with a small second line. If the client has no logo for dark backgrounds, set `whiteOnDark`.
4. Build the starter for it (`node engine/build.mjs decks/starter --client <id>`) and look at the
   cover, a content slide and the statement slide. Adjust `logoHeight` until the two brands balance.

Contrast is handled for you: the engine darkens a light brand colour until white text on it reads
(4.5:1) for bands and headings, and until it holds 3:1 on white for chart series.

## A client that is not in the registry yet

A deck never fails for want of a client's brand:

- `--client "Bank Mega"` (or `client: "bank-mega"`) for a client the registry does not know builds
  with the client named in text where its logo would be, in Praisindo's colours, and the build
  prints how to add it.
- A logo file that is missing or unreadable falls back to the name in text, with a warning.
- `defineClient` needs only `id` and `name`; missing colours fall back to Praisindo's.

### Getting a new client's branding

Before building for a client the registry does not have, get its branding one of two ways:

1. **Find it online.** Look for the official logo on the institution's own website, its press or
   media kit, its annual report, or Wikimedia Commons. Prefer SVG, then a large PNG with a
   transparent background; take the current logo, not an old one. Find a version for dark
   backgrounds too, or set `whiteOnDark`.
   Infer the brand colours by searching: the institution's brand guidelines if published, its
   website's colours, or the colours of the logo itself. Choose a `primary`, a `secondary` if the
   brand has one, and a dark theme (a near-black `background` tinted toward the brand, a slightly
   lighter `surface`, an off-white `text`).
2. **Ask the person** to upload the logo files and brand colours, when nothing reliable can be
   found online or the person has an official kit.

Save the logos in `brand/clients/<id>/` and add the client to `engine/clients.ts` when working in
this repository; when working from the plugin, save them beside the deck and use `defineClient` in
the deck. Tell the person where the logo and colours came from, so they can confirm them before
the deck goes to the client. Until the branding is in, the fallback above keeps the deck building.

When working outside this repository (the plugin), a deck can bring its own client:

```tsx
import { defineClient, defineDeck } from "praisindo-slides";

const client = defineClient({
  id: "bank-contoh",
  name: "Bank Contoh",
  logos: { light: "logo-light.svg", dark: "logo-dark.svg" }, // relative to the deck's folder
  logoHeight: 13,
  palette: { primary: "#0a6cff", secondary: null, dark: { background: "#070b14", surface: "#0d1320", text: "#f3f6fb" } },
});

export default defineDeck({ meta: { /* ... */ }, client, slides: [ /* ... */ ] });
```

Move it into the registry once a second deck needs it.
