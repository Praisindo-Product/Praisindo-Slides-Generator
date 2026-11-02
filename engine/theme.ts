import { Font, StyleSheet } from "@react-pdf/renderer";
import path from "node:path";

/**
 * The document language Praisindo's products print in: Libre Franklin, the light theme's tokens on
 * white paper, a brand header and a hairline footer, bordered cards and tables with a raised header
 * row. It is the same language as the WMS-IMS client wealth statement and the feature catalog
 * (references/). Slides are 16:9 at 960 by 540 points; the type is a size larger than on A4.
 *
 * The cover and the closing slide use a dark theme, tinted by the client (engine/clients.ts).
 */

/** The repository root. engine/build.mjs runs everything from there. */
export const ROOT = process.cwd().replace(/\\/g, "/");
export const FONT = "Libre Franklin";

let registered = false;
export function registerFonts(): void {
  if (registered) return;
  registered = true;
  Font.register({
    family: FONT,
    fonts: [400, 500, 600, 700].map((fontWeight) => ({ src: path.join(ROOT, "fonts/libre-franklin-" + fontWeight + ".ttf"), fontWeight })),
  });
  // A product or column name split with a hyphen reads as a typo, so nothing hyphenates.
  Font.registerHyphenationCallback((word) => [word]);
}

/* ------------------------------------------------------------------ tokens (light theme) */

export const FOREGROUND = "#0d1522";
export const MUTED = "#4d5b70";
export const MUTED_STRONG = "#334054";
export const BORDER = "#d8e0ec";
export const RAISED = "#f2f5fa";
export const SUBTLE = "#f7f9fc";
export const ACCENT = "#2f57cc";
// The *-subtle tokens are low-alpha tints; on white paper they resolve to these.
export const ACCENT_SUBTLE = "#eaeffe";
export const SUCCESS = "#10794f";
export const SUCCESS_SUBTLE = "#e7f2ed";
export const WARNING = "#8a5a06";
export const WARNING_SUBTLE = "#f5ecdc";
export const DANGER = "#b4272c";
export const DANGER_SUBTLE = "#f8e6e6";
export const NEUTRAL_SUBTLE = "#eef1f6";

/** Categorical series for charts, after the client's own brand colours. */
export const SERIES = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4"] as const;

export const RADIUS = 7;
export const HAIRLINE = 0.75;

/* ------------------------------------------------------------------ slide geometry */

export const SLIDE_W = 960;
export const SLIDE_H = 540;
export const SLIDE_PADDING_X = 48;
export const SLIDE_CONTENT_W = SLIDE_W - SLIDE_PADDING_X * 2;
export const SLIDE_GAP = 14;
/** Where the content of a slide may end before it meets the footer. */
export const SLIDE_CONTENT_BOTTOM = SLIDE_H - 48;

/* ------------------------------------------------------------------ colour helpers */

function channels(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  return [0, 2, 4].map((at) => parseInt(value.slice(at, at + 2), 16)) as [number, number, number];
}

/** A colour part of the way from one to another: mix(a, b, 0) is a, mix(a, b, 1) is b. */
export function mix(from: string, to: string, amount: number): string {
  const a = channels(from);
  const b = channels(to);
  return "#" + a.map((value, index) => Math.round(value + (b[index] - value) * amount).toString(16).padStart(2, "0")).join("");
}

/* ------------------------------------------------------------------ styles */

export const d = StyleSheet.create({
  slide: { paddingTop: 26, paddingBottom: 48, paddingHorizontal: SLIDE_PADDING_X, fontFamily: FONT, fontSize: 10, color: FOREGROUND, backgroundColor: "#ffffff" },
  // No padding: the background is drawn edge to edge, and the content sits in an inner frame.
  dark: { fontFamily: FONT, fontSize: 10 },
  darkFrame: { paddingTop: 40, paddingHorizontal: 56 },

  chrome: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: 8, marginBottom: 13, borderBottomWidth: HAIRLINE, borderBottomColor: BORDER },
  brand: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  brandDivider: { width: HAIRLINE, height: 12, backgroundColor: BORDER, marginHorizontal: 4 },
  brandContext: { fontSize: 9, color: MUTED },

  footer: { position: "absolute", left: SLIDE_PADDING_X, right: SLIDE_PADDING_X, bottom: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 7, borderTopWidth: HAIRLINE, borderTopColor: BORDER, fontSize: 7.5, color: MUTED },
  footerGroup: { flexDirection: "row", gap: 14 },

  titleBlock: { marginBottom: 18 },
  overline: { fontSize: 9.5, fontWeight: 500, color: MUTED, marginBottom: 5 },
  title: { fontSize: 22, fontWeight: 600, letterSpacing: -0.44, lineHeight: 1.2 },
  description: { fontSize: 11, color: MUTED, marginTop: 6, maxWidth: 640, lineHeight: 1.45 },

  card: { borderWidth: HAIRLINE, borderColor: BORDER, borderRadius: RADIUS, paddingVertical: 14, paddingHorizontal: 16 },
  cardRaised: { backgroundColor: SUBTLE },
  cardLabel: { fontSize: 8.5, fontWeight: 500, color: MUTED },
  cardTitle: { fontSize: 12.5, fontWeight: 600, letterSpacing: -0.12 },
  cardText: { fontSize: 10, lineHeight: 1.5, color: MUTED_STRONG },
  row: { flexDirection: "row", gap: SLIDE_GAP },

  body: { fontSize: 10, lineHeight: 1.5 },
  small: { fontSize: 8.5, color: MUTED, lineHeight: 1.45 },
  strong: { fontWeight: 600 },
  muted: { color: MUTED },
  right: { textAlign: "right" },
  center: { textAlign: "center" },

  figureLabel: { fontSize: 8.5, color: MUTED },
  figureValue: { fontSize: 18, fontWeight: 600, letterSpacing: -0.2, marginTop: 4 },
  figureNote: { fontSize: 8.5, color: MUTED_STRONG, marginTop: 3, lineHeight: 1.4 },

  thead: { flexDirection: "row", backgroundColor: RAISED, borderWidth: HAIRLINE, borderColor: BORDER, borderTopLeftRadius: RADIUS, borderTopRightRadius: RADIUS },
  th: { fontSize: 8.5, fontWeight: 500, color: MUTED_STRONG },
  tr: { flexDirection: "row", borderLeftWidth: HAIRLINE, borderRightWidth: HAIRLINE, borderBottomWidth: HAIRLINE, borderColor: BORDER },
  trLast: { borderBottomLeftRadius: RADIUS, borderBottomRightRadius: RADIUS },
  trGroup: { backgroundColor: SUBTLE },
  cell: { paddingHorizontal: 10, paddingVertical: 5 },
  headCell: { paddingHorizontal: 10, paddingVertical: 6 },
  cellText: { fontSize: 9.5, lineHeight: 1.4 },

  tag: { alignSelf: "flex-start", borderRadius: 3, paddingHorizontal: 7, paddingTop: 3, paddingBottom: 2.5, backgroundColor: RAISED },
  tagText: { fontSize: 8.5, fontWeight: 500, color: MUTED_STRONG },

  tile: { alignItems: "center", justifyContent: "center", borderRadius: 6, backgroundColor: ACCENT_SUBTLE },
  number: { width: 20, height: 20, borderRadius: 10, backgroundColor: "#ffffff", borderWidth: HAIRLINE, borderColor: BORDER, alignItems: "center", justifyContent: "center" },
  numberText: { fontSize: 8.5, fontWeight: 600, color: MUTED_STRONG },
});
