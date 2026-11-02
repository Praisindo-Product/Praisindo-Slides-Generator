import * as React from "react";
import { Defs, Page, RadialGradient, Rect, Stop, Svg, Text, View } from "@react-pdf/renderer";
import { darkTokens } from "./clients";
import { ClientLogo, PageMark, PraisindoLockup, useDeck, useWords } from "./slide";
import { d, HAIRLINE, SLIDE_H, SLIDE_W } from "./theme";

/**
 * The cover and the closing slide, in the client's dark theme with a soft glow of its brand colours
 * from the lower right. The Praisindo lockup and the client's logo sit top left; the place, date and
 * classification sit on a hairline at the foot. Content goes in the frame between.
 */

/** The dark theme's tokens for content placed on a dark slide (for example a preview card on the cover). */
export function useDark() {
  return darkTokens(useDeck().client);
}

function Glow() {
  const { client } = useDeck();
  const { palette } = client;
  const tokens = useDark();
  const second = palette.dark.secondary ?? palette.secondary ?? palette.primary;
  return (
    <Svg width={SLIDE_W} height={SLIDE_H} viewBox={`0 0 ${SLIDE_W} ${SLIDE_H}`} style={{ position: "absolute", left: 0, top: 0 }}>
      <Defs>
        <RadialGradient id="glow" cx={SLIDE_W * 0.92} cy={SLIDE_H * 1.05} r={SLIDE_W * 0.72} gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={palette.primary} stopOpacity={0.32} />
          <Stop offset="0.42" stopColor={second} stopOpacity={0.26} />
          <Stop offset="1" stopColor={second} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x={0} y={0} width={SLIDE_W} height={SLIDE_H} fill={tokens.background} />
      <Rect x={0} y={0} width={SLIDE_W} height={SLIDE_H} fill="url(#glow)" />
    </Svg>
  );
}

const DARK_MARK = 22;

function DarkBrand() {
  const { client } = useDeck();
  const tokens = useDark();
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
      <PraisindoLockup height={DARK_MARK} dark />
      {client.id === "praisindo" ? null : (
        <View style={{ height: DARK_MARK, flexDirection: "row", alignItems: "center", gap: 18 }}>
          <View style={{ width: HAIRLINE, height: DARK_MARK, backgroundColor: tokens.border, marginLeft: 8 }} />
          {/* The client's logo is scaled as in the header, about 1.4 times larger. */}
          <ClientLogo height={(client.logoHeight ?? 12) * 1.39} dark />
        </View>
      )}
    </View>
  );
}

function DarkFooter() {
  const { meta } = useDeck();
  const words = useWords();
  const tokens = useDark();
  return (
    <View style={{ position: "absolute", left: 56, right: 56, bottom: 34, flexDirection: "row", justifyContent: "space-between", paddingTop: 10, borderTopWidth: HAIRLINE, borderTopColor: tokens.border }}>
      <Text style={{ fontSize: 9, color: tokens.muted }}>{[meta.place, meta.date].filter(Boolean).join(", ")}</Text>
      <Text style={{ fontSize: 9, color: tokens.muted }}>{meta.classification ?? words.confidential}</Text>
    </View>
  );
}

/** A dark slide: background, brand row and footer. Children are laid out in the frame below the brand row; `aside` is placed absolutely (for a preview card). */
export function DarkSlide({ children, aside }: { children?: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <Page size={{ width: SLIDE_W, height: SLIDE_H }} style={d.dark}>
      <Glow />
      <PageMark />
      <View style={d.darkFrame}>
        <DarkBrand />
        {children}
      </View>
      {aside}
      <DarkFooter />
    </Page>
  );
}

/**
 * The cover: an overline (the product or programme), the title, one line saying what it is. `aside`
 * holds an optional visual on the right, best taken from the deck's own content (a figure, a
 * preview of the product's output), never decoration.
 */
export function CoverSlide({ overline, title, lead, aside }: { overline: string; title: string; lead?: string; aside?: React.ReactNode }) {
  const tokens = useDark();
  return (
    <DarkSlide aside={aside}>
      <View style={{ marginTop: 132, width: aside ? 450 : 620 }}>
        <Text style={{ fontSize: 11, fontWeight: 500, color: tokens.muted }}>{overline}</Text>
        <Text style={{ fontSize: 40, fontWeight: 600, letterSpacing: -1, lineHeight: 1.08, color: tokens.foreground, marginTop: 10 }}>{title}</Text>
        {lead ? <Text style={{ fontSize: 13, lineHeight: 1.5, color: tokens.mutedStrong, marginTop: 16, maxWidth: 420 }}>{lead}</Text> : null}
      </View>
    </DarkSlide>
  );
}

/** The closing slide: a thank-you and the next step, in one sentence. */
export function ClosingSlide({ overline, title, lead }: { overline: string; title: string; lead?: string }) {
  const tokens = useDark();
  return (
    <DarkSlide>
      <View style={{ marginTop: 120, width: 560 }}>
        <Text style={{ fontSize: 11, fontWeight: 500, color: tokens.muted }}>{overline}</Text>
        <Text style={{ fontSize: 40, fontWeight: 600, letterSpacing: -1, color: tokens.foreground, marginTop: 10 }}>{title}</Text>
        {lead ? <Text style={{ fontSize: 13, lineHeight: 1.5, color: tokens.mutedStrong, marginTop: 16, maxWidth: 470 }}>{lead}</Text> : null}
      </View>
    </DarkSlide>
  );
}
