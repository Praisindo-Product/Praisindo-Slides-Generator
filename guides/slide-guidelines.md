# Slide guidelines

What stays constant in every Praisindo deck, and what is yours to decide. The design system
(`guides/design-system.md`) is the guide for everything visual; this page says how it applies to
slides. It is not a template: two decks on different subjects should look like they came from the
same company, not like the same deck with new words.

## Fixed: the same in every deck

These are the house look. Do not change them per deck.

- **The slide shell.** Content slides use `Slide`: the header with the Praisindo lockup, the deck's
  title and the client's logo, and the footer with classification, client, date and page number.
  The cover and closing slide use the dark frame (`CoverSlide`, `ClosingSlide` or `DarkSlide`):
  the client's dark theme with its glow, the brand row at the top, place, date and classification
  at the foot. The PowerPoint layout is drawn from the same shell.
- **The Praisindo lockup.** The blue mark, the name in Fraunces, "a censof company" beneath. The
  engine draws it; never restyle, resize, recolour or remove it.
- **The look and feel of the design system.** Libre Franklin; the light theme's tokens on white
  paper; hairline borders, the card and table language, the type scale, sentence case; dark theme
  for the cover and closing slide only. Charts follow the design system's colour rules.
- **Client branding from the registry.** The client's logo and colours come from
  `engine/clients.ts` through the deck context (`useDeck().client`, `useDeck().inks`), never as
  hex values in a deck. A deck rebuilt with `--client` for another institution must still look right.
- **The format.** 16:9 slides, one page each (the build fails otherwise), delivered as PDF and
  PowerPoint.

## Yours to decide: everything inside the shell

The story, the number and order of slides, the layout of each slide, the kind of visual, the
density. Choose what serves the content and the audience.

- The engine's components (cards, tables, statement tables, figure strips, step tracks, diagrams)
  are a starting toolkit, not a menu. When the content wants something else, build it with
  react-pdf's primitives (`View`, `Text`, `Svg`, `Path`, `Rect`, `Image`) in the same visual
  language: a chart, a timeline, a matrix, a before and after, a single large figure, a quote, a
  map of systems, a screenshot of the product with callouts.
- A component you build that is likely to be useful again belongs in the engine (`engine/`), with
  a line in `guides/engine.md`.
- Use the design system for judgement calls: its principles (lead with the decision, structure
  over decoration, one obvious point per scope, quiet but not faint), its information patterns,
  its rules for numbers, charts, tables and status.

## The worked examples are a quality bar

Look at `references/` and `decks/` before you start, to calibrate: how finished a slide should be,
how the shell carries different content, how plain the copy is, how figures are shown. Then make
the deck the material calls for. Do not copy their structure, slide types or wording unless the
content genuinely has the same shape.

## Quality, whatever the layout

- **Content first.** Keep every fact and figure the source carries; shorten words, not facts. If
  something is left out, say so to the person you are working with.
- **Say the point.** A slide's title tells the reader what to take away. The overline, if used,
  names the section in sentence case.
- **Plain language.** Write like a product, not a pitch: real names, concrete verbs, no filler or
  hype words (seamless, robust, end-to-end, leverage, unlock and the like). No em dashes or middle
  dots as separators (the design system's writing rules).
- **Figures you can trust.** Check totals, subtotals, shares and balances before setting them;
  state units, currency, period and basis; mark illustrative figures as such; right-align numbers
  that are compared.
- **Decoration earns its place or goes.** Visuals explain something in the content. No ornament
  for its own sake (stock shapes, emoji, decorative numbering, background patterns).
- **Language.** Write in the language the person asks for; Indonesian institutions usually get
  Indonesian, with product and section names as the product shows them.

## Finish

- Every slide is exactly one page; the build names any slide that overflows. Fix it by editing or
  splitting, not by shrinking type below the design system's sizes.
- Look at every contact sheet after each build (`output/preview/<file>/sheet-*.png`) and at any
  slide that looks crowded at full size. Fix overlap, clipping, cramped or empty areas.
- When you hand over: what changed from the source, what was left out and why, which figures are
  illustrative, what you could not verify.
