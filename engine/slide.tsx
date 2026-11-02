import * as React from "react";
import { Image, Page, Path, Svg, Text, View } from "@react-pdf/renderer";
import type { IconType } from "react-icons";
import { PRAISINDO_WORDMARK } from "../brand/praisindo-wordmark";
import { type ClientBrand, type ClientId, type ClientInks } from "./clients";
import { Icon } from "./icons";
import { ACCENT, ACCENT_SUBTLE, BORDER, d, MUTED_STRONG, registerFonts, SLIDE_CONTENT_W, SLIDE_H, SLIDE_W } from "./theme";

registerFonts();

/* ------------------------------------------------------------------ deck input */

export interface DeckMeta {
  /** The output file's name, without the extension. */
  readonly file: string;
  /** The deck's title, printed in every slide header. */
  readonly title: string;
  /** Where it is presented, printed on the cover with the date, e.g. "Jakarta". */
  readonly place?: string;
  /** As printed, e.g. "3 November 2026". */
  readonly date: string;
  /** "Rahasia" or "Confidential" by default. */
  readonly classification?: string;
  /** The deck's language, for the words the frame prints. Indonesian by default. */
  readonly language?: "id" | "en";
}

/**
 * A slide and how it is drawn: a content slide has the white frame (header, footer, number), a
 * dark slide is a cover or closing slide in the client's dark theme.
 */
export interface DeckSlide {
  readonly kind: "content" | "dark";
  readonly Render: () => React.ReactElement;
}

export interface Deck {
  readonly meta: DeckMeta;
  /** A client from engine/clients.ts, or one made with defineClient. `--client` on the build overrides it. */
  readonly client: ClientId | ClientBrand;
  readonly slides: readonly DeckSlide[];
}

export function defineDeck(deck: Deck): Deck {
  return deck;
}

/* ------------------------------------------------------------------ render context */

export interface Logo {
  /** A PNG data URI, trimmed to the artwork. */
  readonly src: string;
  /** Width over height. */
  readonly ratio: number;
}

export interface DeckAssets {
  readonly praisindo: Logo;
  /** The Censof wordmark for "a censof company": its purple for white paper, white for dark slides. */
  readonly censof: { readonly light: Logo; readonly dark: Logo };
  readonly client?: { readonly light: Logo; readonly dark: Logo };
}

/** Where each slide's first page landed, filled in as the document renders; see render.tsx. */
export interface PageMarks {
  slides: Record<number, number>;
}

export interface DeckRender {
  readonly meta: DeckMeta;
  readonly client: ClientBrand;
  readonly inks: ClientInks;
  readonly assets: DeckAssets;
  /** False for the PowerPoint images, where PowerPoint numbers the slides with a live field. */
  readonly numbered: boolean;
  readonly marks: PageMarks;
}

const DeckContext = React.createContext<DeckRender | null>(null);
export const DeckProvider = DeckContext.Provider;
const SlideIndex = React.createContext(-1);
export const SlideIndexProvider = SlideIndex.Provider;

export function useDeck(): DeckRender {
  const deck = React.useContext(DeckContext);
  if (!deck) throw new Error("A slide component rendered outside a deck. Build decks with engine/build.mjs.");
  return deck;
}

const WORDS = {
  id: { for: "untuk", confidential: "Rahasia" },
  en: { for: "for", confidential: "Confidential" },
} as const;

export function useWords() {
  return WORDS[useDeck().meta.language ?? "id"];
}

/** Records the page a slide's first page landed on, so an overflowing slide is caught. */
export function PageMark() {
  const { marks } = useDeck();
  const index = React.useContext(SlideIndex);
  return (
    <Text
      style={{ position: "absolute", left: 0, top: 0, fontSize: 1, color: "#ffffff", opacity: 0 }}
      render={({ pageNumber }) => {
        // Recording where the slide landed is the point; the renderer calls this after paginating.
        if (marks.slides[index] === undefined || pageNumber < marks.slides[index]) marks.slides[index] = pageNumber;
        return " ";
      }}
    />
  );
}

export function LogoImage({ logo, height }: { logo: Logo; height: number }) {
  // eslint-disable-next-line jsx-a11y/alt-text -- a PDF image has no alternative text
  return <Image src={logo.src} style={{ height, width: height * logo.ratio, objectFit: "contain" }} />;
}

/* ------------------------------------------------------------------ the Praisindo lockup */

/**
 * The Praisindo lockup, on every deck: the blue mark, the name in Fraunces (brand/make-wordmark.mjs),
 * and "a censof company" beneath in the deck's typeface. The name's capitals stand at 56% of the mark
 * and rest on a line near its base. The Censof wordmark is drawn at the line's x-height on its
 * baseline, so the three words read as one size. Navy and blue on white paper, white on dark slides;
 * the mark stays blue. Do not restyle it per deck.
 */
export const PRAISINDO_BLUE = "#0093dd";
export const PRAISINDO_NAVY = "#0b2f57";
// The wordmark's x-height is 44 of its 65 pixels; Libre Franklin's is 0.53 em.
const CENSOF_HEIGHT_EM = (0.53 * 65) / 44;
// With a line height of 1, Libre Franklin's baseline sits 0.966 em below the top of the line.
const BASELINE_EM = 0.966;

function PraisindoName({ height, color }: { height: number; color: string }) {
  const { top, width, body } = PRAISINDO_WORDMARK;
  return (
    <Svg width={(height * width) / top} height={height} viewBox={`0 ${-top} ${width} ${top}`}>
      <Path d={body} fill={color} />
    </Svg>
  );
}

export function PraisindoLockup({ height, dark }: { height: number; dark?: boolean }) {
  const { assets } = useDeck();
  const { top, capHeight } = PRAISINDO_WORDMARK;
  const name = (height * 0.56 * top) / capHeight;
  const size = height * 0.32;
  const line = dark ? "#ffffff" : PRAISINDO_BLUE;
  const word = { fontSize: size, lineHeight: 1, color: line };
  const markWidth = height * assets.praisindo.ratio;
  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: height * 0.28 }}>
        <View style={{ width: markWidth, height }}>
          {/* The mark's swooshes are cut out of the tile; on a dark slide they are filled white, as on paper. */}
          {dark ? <View style={{ position: "absolute", left: height * 0.04, top: height * 0.04, width: markWidth - height * 0.08, height: height * 0.92, backgroundColor: "#ffffff", borderRadius: height * 0.06 }} /> : null}
          <LogoImage logo={assets.praisindo} height={height} />
        </View>
        <View style={{ marginTop: height * 0.8 - name }}>
          <PraisindoName height={name} color={dark ? "#ffffff" : PRAISINDO_NAVY} />
        </View>
      </View>
      <View style={{ flexDirection: "row", alignItems: "flex-end", gap: size * 0.26, marginTop: height * 0.04 }}>
        <Text style={word}>a</Text>
        <View style={{ marginBottom: size * (1 - BASELINE_EM) }}>
          <LogoImage logo={dark ? assets.censof.dark : assets.censof.light} height={size * CENSOF_HEIGHT_EM} />
        </View>
        <Text style={word}>company</Text>
      </View>
    </View>
  );
}

/** The client's logo, or its name when it has none. Nothing for a Praisindo deck. */
export function ClientLogo({ height, dark }: { height: number; dark?: boolean }) {
  const { client, assets } = useDeck();
  if (client.id === "praisindo") return null;
  if (assets.client) return <LogoImage logo={dark ? assets.client.dark : assets.client.light} height={height} />;
  return <Text style={{ fontSize: height * 0.8, fontWeight: 600, color: dark ? "#ffffff" : MUTED_STRONG }}>{client.name}</Text>;
}

/* ------------------------------------------------------------------ slide frame */

export const CHROME_MARK = 16;

function Chrome() {
  const { meta, client } = useDeck();
  return (
    <View style={d.chrome} fixed>
      <View style={d.brand}>
        <PraisindoLockup height={CHROME_MARK} />
        {/* The divider and the deck's name line up with the mark, not the whole lockup. */}
        <View style={{ height: CHROME_MARK, flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View style={d.brandDivider} />
          <Text style={d.brandContext}>{meta.title}</Text>
        </View>
      </View>
      <View style={{ height: CHROME_MARK, justifyContent: "center" }}>
        <ClientLogo height={client.logoHeight ?? 12} />
      </View>
    </View>
  );
}

export function useFooterParts(): string[] {
  const { meta, client } = useDeck();
  const words = useWords();
  return [meta.classification ?? words.confidential, client.id === "praisindo" ? "Praisindo" : "Praisindo " + words.for + " " + client.name, meta.date];
}

function Footer() {
  const { numbered } = useDeck();
  const parts = useFooterParts();
  return (
    <View style={d.footer} fixed>
      <View style={d.footerGroup}>
        {parts.map((part) => (
          <Text key={part}>{part}</Text>
        ))}
      </View>
      {numbered ? <Text render={({ pageNumber, totalPages }) => pageNumber + " / " + totalPages} /> : null}
    </View>
  );
}

/** A content slide: the frame, an overline naming the section, a title that says the slide's point, an optional description. */
export function Slide({ overline, title, description, children }: { overline: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <Page size={{ width: SLIDE_W, height: SLIDE_H }} style={d.slide}>
      <PageMark />
      <Chrome />
      <Footer />
      <View style={d.titleBlock}>
        <Text style={d.overline}>{overline}</Text>
        <Text style={d.title}>{title}</Text>
        {description ? <Text style={d.description}>{description}</Text> : null}
      </View>
      {children}
    </Page>
  );
}

/** The header and footer alone. The PowerPoint export draws its slide layout from this. */
export function BlankSlide() {
  return (
    <Page size={{ width: SLIDE_W, height: SLIDE_H }} style={d.slide}>
      <PageMark />
      <Chrome />
      <Footer />
    </Page>
  );
}

/* ------------------------------------------------------------------ blocks */

export type ViewStyle = Exclude<React.ComponentProps<typeof View>["style"], readonly unknown[] | undefined>;

export function Card({ children, style, raised }: { children: React.ReactNode; style?: ViewStyle; raised?: boolean }) {
  return <View style={[d.card, raised ? d.cardRaised : {}, style ?? {}]}>{children}</View>;
}

export function IconTile({ icon, size = 26, color = ACCENT, background = ACCENT_SUBTLE }: { icon: IconType; size?: number; color?: string; background?: string }) {
  return (
    <View style={[d.tile, { width: size, height: size, backgroundColor: background }]}>
      <Icon icon={icon} size={Math.round(size * 0.56)} color={color} />
    </View>
  );
}

export function Tag({ children, color = MUTED_STRONG, background }: { children: React.ReactNode; color?: string; background?: string }) {
  return (
    <View style={[d.tag, background ? { backgroundColor: background } : {}]}>
      <Text style={[d.tagText, { color }]}>{children}</Text>
    </View>
  );
}

export function StepNumber({ value }: { value: number | string }) {
  return (
    <View style={d.number}>
      <Text style={d.numberText}>{value}</Text>
    </View>
  );
}

/** A label and its value on one line, divided from the next by a hairline. */
export function DefinitionRow({ label, value, first, labelWidth = 92 }: { label: string; value: string; first?: boolean; labelWidth?: number }) {
  return (
    <View style={{ flexDirection: "row", paddingVertical: 6, borderTopWidth: first ? 0 : 0.75, borderTopColor: BORDER }}>
      <Text style={[d.small, { width: labelWidth, fontSize: 9.5 }]}>{label}</Text>
      <Text style={[d.body, { flex: 1 }]}>{value}</Text>
    </View>
  );
}

/** A row of figures divided by hairlines: a label, a value, a note. */
export function FigureStrip({ figures }: { figures: readonly { label: string; value: string; note?: string }[] }) {
  return (
    <View style={[d.card, { flexDirection: "row", gap: 18 }]}>
      {figures.map((figure, index) => (
        <View key={figure.label} style={{ flex: 1, paddingLeft: index === 0 ? 0 : 14, borderLeftWidth: index === 0 ? 0 : 0.75, borderLeftColor: BORDER }}>
          <Text style={d.figureLabel}>{figure.label}</Text>
          <Text style={d.figureValue}>{figure.value}</Text>
          {figure.note ? <Text style={d.figureNote}>{figure.note}</Text> : null}
        </View>
      ))}
    </View>
  );
}

/* ------------------------------------------------------------------ tables */

export interface Column {
  readonly label: string;
  readonly w?: number;
  readonly align?: "left" | "right" | "center";
}

const TableLayout = React.createContext<{ columns: readonly Column[]; widths: readonly number[] }>({ columns: [], widths: [] });

export function Table({ columns, width = SLIDE_CONTENT_W, children }: { columns: readonly Column[]; width?: number; children: React.ReactNode }) {
  const fixed = columns.reduce((sum, column) => sum + (column.w ?? 0), 0);
  const flexible = columns.filter((column) => column.w === undefined).length || 1;
  const widths = columns.map((column) => column.w ?? (width - fixed) / flexible);
  return (
    <TableLayout.Provider value={{ columns, widths }}>
      <View style={{ width }}>
        <View style={d.thead}>
          {columns.map((column, index) => (
            <View key={index} style={[d.headCell, { width: widths[index] }]}>
              <Text style={[d.th, column.align === "right" ? d.right : column.align === "center" ? d.center : {}]}>{column.label}</Text>
            </View>
          ))}
        </View>
        {children}
      </View>
    </TableLayout.Provider>
  );
}

export type Cell = string | React.ReactElement | { readonly text: string; readonly strong?: boolean; readonly muted?: boolean };

export function Row({ cells, last, group, strong, dense, padding }: { cells: readonly Cell[]; last?: boolean; group?: boolean; strong?: boolean; dense?: boolean; padding?: number }) {
  const { columns, widths } = React.useContext(TableLayout);
  return (
    <View style={[d.tr, group ? d.trGroup : {}, last ? d.trLast : {}]}>
      {columns.map((column, index) => {
        const cell = cells[index] ?? "";
        const style = [d.cell, { width: widths[index] }, dense ? { paddingVertical: 3.6 } : {}, padding !== undefined ? { paddingVertical: padding } : {}];
        if (React.isValidElement(cell)) {
          return (
            <View key={index} style={style}>
              {cell}
            </View>
          );
        }
        const spec = typeof cell === "string" ? { text: cell } : (cell as { text: string; strong?: boolean; muted?: boolean });
        const align = column.align === "right" ? d.right : column.align === "center" ? d.center : {};
        return (
          <View key={index} style={style}>
            <Text style={[d.cellText, align, spec.strong || strong ? d.strong : {}, spec.muted ? d.muted : {}]}>{spec.text}</Text>
          </View>
        );
      })}
    </View>
  );
}
