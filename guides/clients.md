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
| `ocbc-sekuritas` | OCBC Sekuritas | `#e32028` |
| `mandiri` | Bank Mandiri | `#003d79`, `#ffb700` |
| `bri` | BRI | `#0857c3` |
| `bca` | BCA | `#0f60ad` |
| `bni` | BNI | `#006885`, `#f15a22` |
| `bsi` | BSI | `#00a39d`, `#f8ad3c` |
| `ocbc` | OCBC | `#e30613`, `#b10615` |
| `danamon` | Danamon | `#f15a22`, `#004d43` |
| `permata` | Permata Bank | `#0064ff`, `#002850` |
| `danareksa-im` | Danareksa Investments | `#0032a0` |
| `manulife-am` | Manulife Investments | `#00a758`, `#282b3e` |
| `bahana-tcw` | Bahana TCW | `#d7181f` |
| `sucor-am` | Sucor Asset Management | `#3a5896` |
| `syailendra` | Syailendra Capital | `#f06432`, `#55554b` |
| `sinarmas-am` | Sinarmas Asset Management | `#ed1c25` |
| `ashmore` | Ashmore | `#00305d`, `#00a8dd` |
| `eastspring` | Eastspring Investments | `#ed1b2e`, `#68727a` |

The palettes of the first seven are the institutions' theme presets in WMS-IMS Ultimate
(`src/data/seeds/institution-presets.ts` there). Keep them in step. The others have no preset
there yet; their branding comes from public sources, below.

### Public branding sources (November 2026)

The largest Indonesian banks (by total assets, June 2026) and investment managers (by mutual fund
assets, September 2026) not covered by presets. Colours marked "logo" are the logo file's own
fills; confirm them with the institution before they matter.

| Id | Logo | Colours | Notes |
| --- | --- | --- | --- |
| `ocbc-sekuritas` | ocbcsekuritas.com header | logo | |
| `mandiri` | Wikimedia Commons, Bank_Mandiri_logo_2016.svg | Mandiri brand guideline | Dark version: wordmark reversed to white, as the guideline's inverse logo |
| `bri` | Commons, BRI_2025.svg (the December 2025 logo) | logo | Drawn white on dark |
| `bca` | pustaka.bca.co.id logo-bca.svg and logo-bca-white.svg | logo | |
| `bni` | Commons, Bank_Negara_Indonesia_logo_(2004).svg | logo | Dark version: wordmark reversed to white |
| `bsi` | Commons, Bank_Syariah_Indonesia.svg | logo | |
| `ocbc` | Commons, Logo-ocbc.svg (the 2023 OCBC logo) | ocbc.id logo and site | Drawn white on dark |
| `danamon` | danamon.co.id header (2024 logo, member of MUFG) | logo | A rename to MUFG Danamon is proposed for 2027. Dark version: wordmark and byline reversed to white |
| `permata` | Commons, Permata_Bank_(2024).svg (the lotus logo) | logo and site | Dark version: wordmark reversed to white |
| `danareksa-im` | none published yet (merger of 1 October 2026) | danareksainvestments.com site | Named in text |
| `manulife-am` | manulifeim.co.id symbol and wordmark, set side by side | site | |
| `bahana-tcw` | bahanatcw.com colour PNG and white SVG | logo | |
| `sucor-am` | sucorinvestam.com logo.svg, cropped to the artwork | logo | Drawn white on dark |
| `syailendra` | syailendracapital.com logo-footer.svg | logo | Light version: the white wordmark drawn in the logo's grey |
| `sinarmas-am` | sinarmas-am.co.id header PNG (for dark backgrounds) | logo | Light version: the white wordmark drawn in black; replace with an official file when available |
| `ashmore` | ashmoregroup.com logo.svg | logo | Dark version: wordmark reversed to white |
| `eastspring` | eastspring.com logo_id.png | logo and site | Drawn white on dark |

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
