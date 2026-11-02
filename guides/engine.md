# Engine reference

A deck is a TypeScript file that default-exports `defineDeck(...)`. It imports the engine as
`"praisindo-slides"`, layout primitives (`View`, `Text`, `Svg`...) from `"@react-pdf/renderer"`, and
icons from `"react-icons/pi"`. The engine renders with [react-pdf](https://react-pdf.org): flexbox
layout in points, on a 960 by 540 page.

```tsx
import { Text, View } from "@react-pdf/renderer";
import { PiBank } from "react-icons/pi";
import { Card, CoverSlide, ClosingSlide, d, defineDeck, IconTile, Slide } from "praisindo-slides";

function Cover() {
  return <CoverSlide overline="Praisindo untuk CIMB Niaga" title="Judul presentasi" lead="Satu kalimat." />;
}

function Point() {
  return (
    <Slide overline="Ringkasan" title="Judul yang menyatakan inti slide">
      <Card>
        <IconTile icon={PiBank} />
        <Text style={[d.cardTitle, { marginTop: 12 }]}>Judul kartu</Text>
      </Card>
    </Slide>
  );
}

export default defineDeck({
  meta: { file: "Nama-File", title: "Judul presentasi", place: "Jakarta", date: "3 November 2026" },
  client: "cimb-niaga",
  slides: [
    { kind: "dark", Render: Cover },
    { kind: "content", Render: Point },
    { kind: "dark", Render: () => <ClosingSlide overline="Judul presentasi" title="Terima kasih" /> },
  ],
});
```

## Deck

| Export | What it is |
| --- | --- |
| `defineDeck({ meta, client, slides })` | The deck. `slides` is a list of `{ kind: "content" \| "dark", Render }`. |
| `meta` | `file` (output name), `title` (printed in every header), `date`, `place?`, `classification?` (default "Rahasia"/"Confidential"), `language?` ("id" default, or "en"). |
| `client` | A client id from `engine/clients.ts`, or a `defineClient({...})` object. `--client` overrides it. |
| `useDeck()` | Inside a slide: `{ meta, client, inks, assets }`. `inks.ink` (strong brand colour that holds white text), `inks.tint` (pale brand tint), `inks.series` (chart colours, brand first). |
| `useWords()` | The frame's words in the deck's language. |

## Slides

| Export | Use |
| --- | --- |
| `Slide({ overline, title, description?, children })` | A content slide: header with the Praisindo lockup and the client's logo, footer with classification, client, date and page number. Children go below the title block, inside 864 points of width and about 300 points of height. |
| `CoverSlide({ overline, title, lead?, aside? })` | The dark cover. `aside` is placed absolutely on the right (see the worked example's statement preview). |
| `ClosingSlide({ overline, title, lead? })` | The dark closing slide. |
| `DarkSlide({ children, aside? })` | A custom dark slide with the same background, brand row and footer. |
| `useDark()` | The dark theme's tokens (`background`, `surface`, `raised`, `border`, `foreground`, `muted`, `mutedStrong`) for content on a dark slide. |
| `BlankSlide()` | Header and footer only. The PowerPoint export uses it for its layout. |

## Blocks

A starting toolkit. Inside a slide you can build anything with react-pdf's primitives (`View`,
`Text`, `Svg`, `Path`, `Rect`, `Circle`, `Line`, `Image`) using the tokens and styles below; move a
new component into `engine/` when it is useful beyond one deck.

| Export | Use |
| --- | --- |
| `Card({ children, style?, raised? })` | A bordered card; `raised` gives the subtle fill. |
| `IconTile({ icon, size?, color?, background? })` | A Phosphor icon in a tinted tile. |
| `Tag({ children, color?, background? })` | A small label. Success: `color={SUCCESS} background={SUCCESS_SUBTLE}`; danger: `DANGER`, `DANGER_SUBTLE`. |
| `StepNumber({ value })` | A numbered circle for steps. |
| `DefinitionRow({ label, value, first?, labelWidth? })` | Label and value on a line, hairline between rows. |
| `FigureStrip({ figures })` | A row of figures (label, value, note) divided by hairlines. |
| `Table({ columns, width?, children })` and `Row({ cells, last?, group?, strong?, dense?, padding? })` | A table with a raised header. Columns take `label`, `w?` (points; the rest share the remaining width) and `align?`. A cell is a string, `{ text, strong?, muted? }` or an element. |
| `StatementTable({ headers, rows, labelWidth?, valueWidth?, padding? })` | A statement section against earlier periods, in the client's brand. Rows: `group`, `heading`, `line`, `sub`, `total`, `band`; values as printed strings; negatives red, `signed` rows green when positive, `+` values green. |
| `StatementNote({ children })` | The footnote under a statement table. |
| `AllocationBar({ items, valueLabel })` | A segmented bar with its category, value and share table. |
| `Icon({ icon, size?, color })` | A bare Phosphor icon. |

## Diagrams

`Diagram`, `DiagramLayer` (the SVG layer for lines), `Arrow({ points, both? })`, `Node`, `Group`,
`StoreShape` and `StoreLabel` (a database cylinder and its label), `Badge({ at, n })`, `Actor`,
`Legend`, `useTones()` and `cylinder()`. Place boxes absolutely on a grid you plan first; see
`TechnicalDiagram` in the worked example.

## Theme

`d` holds the shared styles (`d.cardTitle`, `d.cardText`, `d.small`, `d.body`, `d.strong`,
`d.row`, `d.figureValue`...). Tokens: `FOREGROUND`, `MUTED`, `MUTED_STRONG`, `BORDER`, `RAISED`,
`SUBTLE`, `ACCENT`, `ACCENT_SUBTLE`, `SUCCESS`, `DANGER`, `WARNING` and their `_SUBTLE` tints,
`SLIDE_CONTENT_W` (864), `SLIDE_GAP` (14), `HAIRLINE`, `RADIUS`, `mix(a, b, amount)`.

Type sizes are set: title 22, description 11, card title 12.5, body 10, small 8.5, tables 9 to
9.5. Do not go below 7.5 for any text a reader needs.

## Build

```
node engine/build.mjs <deck folder or file> [--pptx] [--client <id>] [--out <folder>] [--no-preview]
```

Writes `<deck>/output/<file>.pdf`, previews and contact sheets in `output/preview/<file>/`, and
with `--pptx` the PowerPoint file. Fails, naming the slide, if any slide runs over one page.

## Limits of the renderer

- No CSS grid; use flex rows with explicit widths.
- `position: "absolute"` children of a slide are placed relative to the page.
- Images must be PNG or JPEG (the engine rasterises SVG logos for you).
- Text cannot rotate; set vertical labels as stacked lines or leave them out.
- An icon drawn with circles or rectangles cannot be redrawn; the engine says which and you pick another.
