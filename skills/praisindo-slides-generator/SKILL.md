---
name: praisindo-slides-generator
description: Make Praisindo slide decks (client presentations, proposals, product overviews, internal reviews) in the Praisindo design system, delivered as PDF and PowerPoint. Use whenever someone asks for slides, a deck or a presentation for Praisindo or one of its clients (CIMB Niaga, Nobu Bank, Bank BTN, Trimegah, Batavia, Maybank AM or others), or asks to remake, restyle or fix an existing deck in the Praisindo style.
---

# Praisindo Slides Generator

You make decks with a TypeScript slide engine that renders PDF and PowerPoint in Praisindo's
document language. Every deck shares a fixed shell and look; what goes inside is designed for its
content.

## Where the engine is

ENGINE is `${CLAUDE_PLUGIN_ROOT}` when this skill runs from the installed plugin. If that text is
not a real path (you are working inside the cloned repository and reached this file from
`CLAUDE.md`), ENGINE is the repository root.

Before the first build, make sure the engine's packages are installed:

```
npm ci --prefix "ENGINE"
```

(Skip it when `ENGINE/node_modules/@react-pdf` exists. Node 20.19 or later is required.)

## Read first, every time

1. `ENGINE/guides/slide-guidelines.md`: what is fixed in every deck and what is yours to decide.
2. The worked examples, to calibrate finish and tone (not to copy their structure):
   `ENGINE/references/README.md` lists them. Open the finished PDFs in `ENGINE/references/` and
   their sources in `ENGINE/decks/`.
3. `ENGINE/guides/workflow.md`: the steps from request to delivered files.
4. As needed: `ENGINE/guides/engine.md` (components and build), `ENGINE/guides/clients.md`
   (client brands), `ENGINE/guides/design-system.md` (the full design system; the guide for every
   visual decision), `ENGINE/guides/design-skills/` (general taste, secondary to the above).

## Fixed in every deck

- The slide shell: `Slide` for content (header with the Praisindo lockup, deck title and client
  logo; footer with classification, client, date, page number), `CoverSlide` / `ClosingSlide` /
  `DarkSlide` for the dark cover and closing.
- The Praisindo lockup, exactly as the engine draws it.
- The design system's look and feel: Libre Franklin, light tokens on white, the dark theme for cover
  and closing only, hairlines, the type scale, sentence case.
- Client logo and colours from `engine/clients.ts` via `useDeck()`, never hard-coded. For a client
  not in the registry, find its official logo online and infer its brand colours by searching, or
  ask the person to upload them; then add it or define it in the deck, and say where the branding
  came from (`ENGINE/guides/clients.md`). Until then the deck still builds, the client named in
  text in Praisindo's colours.
- 16:9, one page per slide, PDF and PowerPoint delivered.

Everything else (story, layout, visuals, new components) is your design, guided by the design
system and the quality bar of the worked examples.

## Commands

Work in the person's current folder; decks go in `decks/<name>/`.

```
node ENGINE/scripts/extract-pptx.mjs <source.pptx>             read a source deck's text
node ENGINE/scripts/new-deck.mjs <name> [--client <id>]        start decks/<name>/deck.tsx
node ENGINE/engine/build.mjs decks/<name>                      PDF, previews, contact sheets
node ENGINE/engine/build.mjs decks/<name> --pptx               also the PowerPoint file
node ENGINE/engine/build.mjs decks/<name> --pptx --client btn  for another client
```

After every build, look at every contact sheet in `decks/<name>/output/preview/<file>/` and fix
what you see. Hand over the PDF and PowerPoint paths with a short note: what changed from the
source, what was left out, which figures are illustrative, what you could not verify.
