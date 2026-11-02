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
