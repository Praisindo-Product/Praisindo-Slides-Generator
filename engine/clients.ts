import { mix, SERIES } from "./theme";

/**
 * The clients a deck can be made for, with the brand each prints in. The palettes are the
 * institutions' theme presets in WMS-IMS Ultimate (src/data/seeds/institution-presets.ts there);
 * keep the two in step. "praisindo" is a deck for no client in particular.
 *
 * A deck can also bring its own client (defineClient below) when the institution is not here yet;
 * add it here once it is used twice. See guides/clients.md.
 */

export interface ClientBrand {
  readonly id: string;
  /** As printed in the footer, e.g. "CIMB Niaga". */
  readonly name: string;
  readonly legalName?: string;
  /**
   * The logo for white paper and the one for dark slides: SVG, PNG or JPEG, relative to the
   * repository root, or absolute. A client without logos is named in text.
   */
  readonly logos?: { readonly light: string; readonly dark: string };
  /** The logo's height in the slide header, in points. Bold, all-capital logos read larger, so they sit smaller; logos with a small second line sit larger. */
  readonly logoHeight?: number;
  /** Draw the dark-slide logo in white, for a logo that has no version for dark backgrounds. */
  readonly whiteOnDark?: boolean;
  readonly palette: {
    /** The brand colour. */
    readonly primary: string;
    /** The second brand colour, if the brand has one. */
    readonly secondary: string | null;
    /** The client's dark theme, for the cover and the closing slide. */
    readonly dark: { readonly background: string; readonly surface: string; readonly text: string; readonly secondary?: string | null };
  };
}

/** A client a deck brings itself. Only id and name are required; missing colours fall back to Praisindo's, missing logos to the name in text. */
export interface ClientInput extends Omit<ClientBrand, "palette"> {
  readonly palette?: {
    readonly primary?: string;
    readonly secondary?: string | null;
    readonly dark?: Partial<ClientBrand["palette"]["dark"]>;
  };
}

export function defineClient(client: ClientInput): ClientBrand {
  const base = CLIENTS.praisindo.palette;
  const palette = client.palette ?? {};
  const primary = palette.primary ?? base.primary;
  return {
    ...client,
    palette: {
      primary,
      secondary: palette.secondary === undefined ? (palette.primary ? null : base.secondary) : palette.secondary,
      dark: {
        background: palette.dark?.background ?? base.dark.background,
        surface: palette.dark?.surface ?? base.dark.surface,
        text: palette.dark?.text ?? base.dark.text,
        secondary: palette.dark?.secondary ?? (palette.primary ? null : base.dark.secondary),
      },
    },
  };
}

export const CLIENTS = {
  praisindo: {
    id: "praisindo",
    name: "Praisindo",
    palette: { primary: "#0093dd", secondary: "#0b2f57", dark: { background: "#090c12", surface: "#111722", text: "#f5f7fb", secondary: "#537cf6" } },
  },
  "cimb-niaga": {
    id: "cimb-niaga",
    name: "CIMB Niaga",
    legalName: "PT Bank CIMB Niaga Tbk",
    logos: { light: "brand/clients/cimb-niaga/logo-light.svg", dark: "brand/clients/cimb-niaga/logo-dark.svg" },
    logoHeight: 11.5,
    palette: { primary: "#ed3024", secondary: "#790008", dark: { background: "#170a0c", surface: "#211013", text: "#f8f1f1", secondary: "#e0656a" } },
  },
  "nobu-bank": {
    id: "nobu-bank",
    name: "Nobu Bank",
    legalName: "PT Bank Nationalnobu Tbk",
    logos: { light: "brand/clients/nobu-bank/logo.svg", dark: "brand/clients/nobu-bank/logo.svg" },
    logoHeight: 12.5,
    palette: { primary: "#06d7a1", secondary: null, dark: { background: "#08120f", surface: "#0e1b18", text: "#f2f8f6" } },
  },
  btn: {
    id: "btn",
    name: "Bank BTN",
    legalName: "PT Bank Tabungan Negara (Persero) Tbk",
    logos: { light: "brand/clients/btn/logo.svg", dark: "brand/clients/btn/logo.svg" },
    logoHeight: 15,
    whiteOnDark: true,
    palette: { primary: "#005bfd", secondary: "#ff0000", dark: { background: "#070b16", surface: "#0d1322", text: "#f3f6fc", secondary: "#ff5a5a" } },
  },
  "trimegah-am": {
    id: "trimegah-am",
    name: "Trimegah Asset Management",
    legalName: "PT Trimegah Asset Management",
    logos: { light: "brand/clients/trimegah-am/logo-light.svg", dark: "brand/clients/trimegah-am/logo-dark.svg" },
    logoHeight: 20,
    palette: { primary: "#f05a22", secondary: "#0038a0", dark: { background: "#070d1a", surface: "#0d1526", text: "#f3f5fa", secondary: "#4a7fe8" } },
  },
  batavia: {
    id: "batavia",
    name: "Batavia Prosperindo Aset Manajemen",
    legalName: "PT Batavia Prosperindo Aset Manajemen",
    logos: { light: "brand/clients/batavia/logo-light.svg", dark: "brand/clients/batavia/logo-dark.svg" },
    logoHeight: 18,
    palette: { primary: "#002878", secondary: null, dark: { background: "#090b11", surface: "#10131c", text: "#f3f4f8", secondary: "#5b82e0" } },
  },
  "maybank-am": {
    id: "maybank-am",
    name: "Maybank Asset Management",
    legalName: "PT Maybank Asset Management",
    logos: { light: "brand/clients/maybank-am/logo-light.png", dark: "brand/clients/maybank-am/logo-dark.png" },
    logoHeight: 18,
    palette: { primary: "#ffc600", secondary: "#373737", dark: { background: "#0d0c09", surface: "#171510", text: "#f8f6f0", secondary: "#b3ada0" } },
  },
  /** No preset in WMS-IMS Ultimate yet: logo and red from ocbcsekuritas.com. */
  "ocbc-sekuritas": {
    id: "ocbc-sekuritas",
    name: "OCBC Sekuritas",
    legalName: "PT OCBC Sekuritas Indonesia",
    logos: { light: "brand/clients/ocbc-sekuritas/logo.svg", dark: "brand/clients/ocbc-sekuritas/logo.svg" },
    logoHeight: 12,
    whiteOnDark: true,
    palette: { primary: "#e32028", secondary: null, dark: { background: "#160a0b", surface: "#201012", text: "#f8f1f1", secondary: "#e8676b" } },
  },

  /*
   * The largest banks and investment managers in Indonesia, without presets in WMS-IMS Ultimate
   * yet. Logos from each institution's website or Wikimedia Commons (November 2026); reversed and
   * light versions made here are noted per client. Sources are listed in guides/clients.md.
   */
  mandiri: {
    id: "mandiri",
    name: "Bank Mandiri",
    legalName: "PT Bank Mandiri (Persero) Tbk",
    logos: { light: "brand/clients/mandiri/logo-light.svg", dark: "brand/clients/mandiri/logo-dark.svg" },
    logoHeight: 14,
    palette: { primary: "#003d79", secondary: "#ffb700", dark: { background: "#070e17", surface: "#0d1622", text: "#eff1f6", secondary: "#ffb700" } },
  },
  bri: {
    id: "bri",
    name: "BRI",
    legalName: "PT Bank Rakyat Indonesia (Persero) Tbk",
    logos: { light: "brand/clients/bri/logo.svg", dark: "brand/clients/bri/logo.svg" },
    logoHeight: 12,
    whiteOnDark: true,
    palette: { primary: "#0857c3", secondary: null, dark: { background: "#08101d", surface: "#0e192a", text: "#eff2f8", secondary: "#4681d2" } },
  },
  bca: {
    id: "bca",
    name: "BCA",
    legalName: "PT Bank Central Asia Tbk",
    logos: { light: "brand/clients/bca/logo-light.svg", dark: "brand/clients/bca/logo-dark.svg" },
    logoHeight: 19,
    palette: { primary: "#0f60ad", secondary: null, dark: { background: "#09111b", surface: "#0f1a28", text: "#eff2f8", secondary: "#4b88c2" } },
  },
  bni: {
    id: "bni",
    name: "BNI",
    legalName: "PT Bank Negara Indonesia (Persero) Tbk",
    logos: { light: "brand/clients/bni/logo-light.svg", dark: "brand/clients/bni/logo-dark.svg" },
    logoHeight: 11.5,
    palette: { primary: "#006885", secondary: "#f15a22", dark: { background: "#071218", surface: "#0d1b23", text: "#eff3f6", secondary: "#408ea4" } },
  },
  bsi: {
    id: "bsi",
    name: "BSI",
    legalName: "PT Bank Syariah Indonesia Tbk",
    logos: { light: "brand/clients/bsi/logo.svg", dark: "brand/clients/bsi/logo.svg" },
    logoHeight: 15,
    palette: { primary: "#00a39d", secondary: "#f8ad3c", dark: { background: "#07171a", surface: "#0d2126", text: "#eff4f7", secondary: "#40bab6" } },
  },
  ocbc: {
    id: "ocbc",
    name: "OCBC",
    legalName: "PT Bank OCBC NISP Tbk",
    logos: { light: "brand/clients/ocbc/logo.svg", dark: "brand/clients/ocbc/logo.svg" },
    logoHeight: 12,
    whiteOnDark: true,
    palette: { primary: "#e30613", secondary: "#b10615", dark: { background: "#1c090e", surface: "#261017", text: "#f5f0f3", secondary: "#ea444e" } },
  },
  danamon: {
    id: "danamon",
    name: "Danamon",
    legalName: "PT Bank Danamon Indonesia Tbk",
    logos: { light: "brand/clients/danamon/logo-light.svg", dark: "brand/clients/danamon/logo-dark.svg" },
    logoHeight: 27,
    palette: { primary: "#f15a22", secondary: "#004d43", dark: { background: "#1d100f", surface: "#281918", text: "#f6f2f4", secondary: "#f58359" } },
  },
  permata: {
    id: "permata",
    name: "Permata Bank",
    legalName: "PT Bank Permata Tbk",
    logos: { light: "brand/clients/permata/logo-light.svg", dark: "brand/clients/permata/logo-dark.svg" },
    logoHeight: 15,
    palette: { primary: "#0064ff", secondary: "#002850", dark: { background: "#071123", surface: "#0d1a31", text: "#eff3fa", secondary: "#408bff" } },
  },
  /** No logo published yet after the October 2026 merger; named in text until it is. */
  "danareksa-im": {
    id: "danareksa-im",
    name: "Danareksa Investments",
    legalName: "PT Danareksa Investment Management Indonesia",
    palette: { primary: "#0032a0", secondary: null, dark: { background: "#070d1a", surface: "#0d1526", text: "#eff1f7", secondary: "#597ac1" } },
  },
  /** The symbol and wordmark from manulifeim.co.id, set side by side as the site shows them. */
  "manulife-am": {
    id: "manulife-am",
    name: "Manulife Investments",
    legalName: "PT Manulife Aset Manajemen Indonesia",
    logos: { light: "brand/clients/manulife-am/logo-light.svg", dark: "brand/clients/manulife-am/logo-dark.svg" },
    logoHeight: 11,
    palette: { primary: "#00a758", secondary: "#282b3e", dark: { background: "#071714", surface: "#0d221e", text: "#eff5f5", secondary: "#40bd82" } },
  },
  "bahana-tcw": {
    id: "bahana-tcw",
    name: "Bahana TCW",
    legalName: "PT Bahana TCW Investment Management",
    logos: { light: "brand/clients/bahana-tcw/logo-light.png", dark: "brand/clients/bahana-tcw/logo-dark.svg" },
    logoHeight: 18,
    palette: { primary: "#d7181f", secondary: null, dark: { background: "#1b0a0f", surface: "#251218", text: "#f5f0f3", secondary: "#e15257" } },
  },
  "sucor-am": {
    id: "sucor-am",
    name: "Sucor Asset Management",
    legalName: "PT Sucorinvest Asset Management",
    logos: { light: "brand/clients/sucor-am/logo.svg", dark: "brand/clients/sucor-am/logo.svg" },
    logoHeight: 22,
    whiteOnDark: true,
    palette: { primary: "#3a5896", secondary: null, dark: { background: "#0d1019", surface: "#141925", text: "#f0f2f7", secondary: "#6b82b0" } },
  },
  /** The site's logo for dark backgrounds; the light version draws its white in the logo's grey #55554b. */
  syailendra: {
    id: "syailendra",
    name: "Syailendra Capital",
    legalName: "PT Syailendra Capital",
    logos: { light: "brand/clients/syailendra/logo-light.svg", dark: "brand/clients/syailendra/logo-dark.svg" },
    logoHeight: 9,
    palette: { primary: "#f06432", secondary: "#55554b", dark: { background: "#1d1110", surface: "#281a1a", text: "#f6f3f4", secondary: "#f48b65" } },
  },
  /** The site only has a logo for dark backgrounds; the light version draws its white wordmark in black. */
  "sinarmas-am": {
    id: "sinarmas-am",
    name: "Sinarmas Asset Management",
    legalName: "PT Sinarmas Asset Management",
    logos: { light: "brand/clients/sinarmas-am/logo-light.png", dark: "brand/clients/sinarmas-am/logo-dark.png" },
    logoHeight: 16,
    palette: { primary: "#ed1c25", secondary: null, dark: { background: "#1d0b0f", surface: "#271219", text: "#f6f0f4", secondary: "#f2555c" } },
  },
  ashmore: {
    id: "ashmore",
    name: "Ashmore",
    legalName: "PT Ashmore Asset Management Indonesia Tbk",
    logos: { light: "brand/clients/ashmore/logo-light.svg", dark: "brand/clients/ashmore/logo-dark.svg" },
    logoHeight: 14,
    palette: { primary: "#00305d", secondary: "#00a8dd", dark: { background: "#070d14", surface: "#0d141f", text: "#eff1f5", secondary: "#00a8dd" } },
  },
  eastspring: {
    id: "eastspring",
    name: "Eastspring Investments",
    legalName: "PT Eastspring Investments Indonesia",
    logos: { light: "brand/clients/eastspring/logo-light.png", dark: "brand/clients/eastspring/logo-light.png" },
    logoHeight: 17,
    whiteOnDark: true,
    palette: { primary: "#ed1b2e", secondary: "#68727a", dark: { background: "#1d0b10", surface: "#27121a", text: "#f6f0f4", secondary: "#f25462" } },
  },
} satisfies Record<string, ClientBrand>;

export type ClientId = keyof typeof CLIENTS;

/**
 * The client a deck is built for. A name or id that is not in the registry still builds: the
 * client is named in text where its logo would be, in Praisindo's colours, with a note on how to
 * add its logo and brand colours.
 */
export function resolveClient(client: ClientId | ClientBrand | string): ClientBrand {
  if (typeof client !== "string") return defineClient(client);
  const known = CLIENTS as Record<string, ClientBrand>;
  const slug = client.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const found = known[client] ?? known[slug] ?? Object.values(known).find((entry) => entry.name.toLowerCase() === client.trim().toLowerCase());
  if (found) return found;
  // "bank-mega" reads as "Bank Mega"; a name with spaces is kept as given.
  const name = /\s/.test(client.trim()) ? client.trim() : slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  console.warn(
    "Client \"" + client + "\" is not in engine/clients.ts, so it is named in text, in Praisindo's colours. " +
      "For its logo and brand colours, add it there (guides/clients.md) or define it in the deck with defineClient. Known clients: " +
      Object.keys(known).join(", ") +
      ".",
  );
  return defineClient({ id: slug || "client", name });
}

/* ------------------------------------------------------------------ derived colours */

function luminance(hex: string): number {
  const value = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((at) => {
    const channel = parseInt(value.slice(at, at + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/** The colour, darkened just enough to reach a contrast ratio against white. */
export function onWhite(color: string, ratio: number): string {
  let shade = color;
  for (let step = 1; contrast(shade, "#ffffff") < ratio && step <= 20; step += 1) shade = mix(color, "#000000", step * 0.05);
  return shade;
}

export interface ClientInks {
  /** A strong brand colour that holds white text (4.5:1): totals bands, group headings. */
  readonly ink: string;
  /** A pale brand tint for group rows and highlighted cells. */
  readonly tint: string;
  /** Chart series: the brand colours first, each held to 3:1 on white, then the platform's. */
  readonly series: readonly string[];
}

export function clientInks(client: ClientBrand): ClientInks {
  const { primary, secondary } = client.palette;
  const strong = secondary && contrast(secondary, "#ffffff") >= 4.5 ? secondary : primary;
  const brand = [primary, secondary].filter((color): color is string => Boolean(color)).map((color) => onWhite(color, 3));
  return {
    ink: onWhite(strong, 4.5),
    tint: mix(primary, "#ffffff", 0.9),
    series: [...brand, ...SERIES.filter((color) => !brand.includes(color))],
  };
}

/** The dark theme's tokens for the cover and the closing slide, derived from the client's dark palette. */
export function darkTokens(client: ClientBrand) {
  const { background, surface, text } = client.palette.dark;
  return {
    background,
    surface,
    raised: mix(surface, text, 0.06),
    border: mix(background, text, 0.16),
    foreground: text,
    muted: mix(text, background, 0.32),
    mutedStrong: mix(text, background, 0.14),
  };
}
