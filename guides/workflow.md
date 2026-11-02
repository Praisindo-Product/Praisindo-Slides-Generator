# Making a deck, step by step

`ENGINE` below is the folder this guide is in, one level up: the repository root when you work in
the cloned repo, or the plugin's folder when the skill is installed as a plugin. Run the build
from wherever the deck is; the build finds its own packages, fonts and brand files.

## 1. Understand the ask

Find out, from the request and any material attached:

- the audience and the occasion (a client meeting, an internal review, a proposal);
- the client, which sets the logo and colours (`engine/clients.ts`; `praisindo` for none). If the
  client is not in the registry, get its branding now: find the official logo online and infer the
  colours by searching, or ask the person to upload them (`guides/clients.md`);
- the language (Indonesian unless the person says otherwise or the source is in English);
- the source material: a draft deck, a document, notes, figures, screenshots of the product.

Ask only what you cannot work out. Do not ask about styling; the design system decides it.

## 2. Calibrate on the worked examples

Read `guides/slide-guidelines.md` (what is fixed, what is yours), then look at the worked examples
before writing anything: the finished decks in `references/`, their sources in `decks/`, and the
client statement the product prints. Use them to calibrate the finish, the shell and the plainness
of the copy. Then design the deck the material calls for; do not reproduce their structure.

## 3. Pull the content out of the source

- A PowerPoint file: `node ENGINE/scripts/extract-pptx.mjs <file.pptx>` prints every slide's text
  in order, including grouped shapes and tables. Open the images in the file's `ppt/media` folder
  if the slides rely on pictures (unzip the .pptx).
- A PDF: read it page by page.
- Screenshots: read every number off them, and check the totals add up.

List every fact and figure. This list is what the deck must still carry at the end.

## 4. Outline

Write the slide list in the chat: for each slide, its title (the point) and how it will show it
(a table, a chart, a diagram, a single figure, something new). For a short deck, carry on; for a
long one or a change of story, let the person see the outline first.

## 5. Write the deck

```
node ENGINE/scripts/new-deck.mjs <deck-name> [--client <id>]
```

This copies the starter into `decks/<deck-name>/deck.tsx` in the current folder. Set `meta`
(file, title, place, date, language) and `client`, then write each slide as a small component and
list it in `slides`. Keep the shell (`Slide`, `CoverSlide`, `ClosingSlide`); inside it, use the
engine's components or build your own with react-pdf primitives (see `guides/engine.md`). Icons
come from `"react-icons/pi"`.

Keep the content in plain constants at the top of each slide function, so copy is easy to find and
change. Take colours from the deck context, never as hex values for a client.

## 6. Build and look

```
node ENGINE/engine/build.mjs decks/<deck-name>
```

- If the build reports a slide that runs to two pages, fix that slide and build again.
- Open every contact sheet in `decks/<deck-name>/output/preview/<file>/` and look. Read crowded
  slides at full size (`slide-NN.png`). Fix overlap, clipping, cramped cards, orphaned words and
  large empty areas. Build again until every sheet is clean.

## 7. PowerPoint

```
node ENGINE/engine/build.mjs decks/<deck-name> --pptx
```

The PowerPoint file has the same slides as images, live slide numbers, a "Praisindo content"
layout with the header and footer, and a blank framed slide at the end to duplicate. If the file
is open in PowerPoint, the build writes `<file> (updated).pptx` beside it.

For the same deck for another client: `--client <id>`; the files get the client's id in their name.

## 8. Hand over

Give the paths of the PDF and the PowerPoint file. Say, briefly: what changed from the source,
what you left out and why, which figures are illustrative, and anything you could not verify.

## Checklist

- [ ] Worked examples looked at to calibrate; the deck's design follows its own content.
- [ ] The shell, lockup and client branding come from the engine, unchanged.
- [ ] Every fact and figure from the source is in the deck, or its omission is reported.
- [ ] Titles state the point; plain language; no em dashes or middle dots.
- [ ] Figures reconcile; units, periods and illustrative status are stated.
- [ ] Client colours come from the context; the deck still works with `--client praisindo`.
- [ ] The build passes; every contact sheet looked at; PDF and PowerPoint delivered.
