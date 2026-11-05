---
name: praisindo-slides-generator
description: Make Praisindo slide decks (client presentations, proposals, product overviews, internal reviews) in the Praisindo design system, delivered as PDF and PowerPoint. Use whenever someone asks for slides, a deck or a presentation for Praisindo or one of its clients (CIMB Niaga, Bank Mandiri, BRI, BCA, BNI, BTN, Trimegah, Manulife, Batavia or others), or asks to remake, restyle or fix an existing deck in the Praisindo style.
---

# Praisindo Slides Generator

You make decks with a TypeScript slide engine that renders PDF and PowerPoint in Praisindo's
document language. Every deck shares a fixed shell and look; what goes inside is designed for its
content.

## Where you are running

This skill needs Claude Code: a shell and files on the person's computer (or Claude Code on the web
with this repository). In a general chat the generator cannot run; follow
`guides/chat-entry.md` (Corpus COR-2016): say it runs locally and how to set it up, and if the
person insists, give the minimum service (plan, content, branding, a `deck.tsx` to build later).

## Starting from nothing

When the person has set nothing up ("Halo, tolong cek corpus untuk slides generator. Saya mau buat
slide ..."), follow `ENGINE/guides/getting-started.md` (Corpus skill COR-2014 carries the same
steps): check Node.js and Git, clone or update the engine, `npm ci`, check the build, then make the
deck they asked for in the same conversation, without making them ask again.

## Where the engine is

ENGINE is `${CLAUDE_PLUGIN_ROOT}` when this skill runs from the installed plugin. If that text is
not a real path (you are working inside the cloned repository and reached this file from
`CLAUDE.md`), ENGINE is the repository root.

Before the first build, make sure the engine's packages are installed:

```
npm ci --prefix "ENGINE"
```

(Skip it when `ENGINE/node_modules/@react-pdf` exists. Node 20.19 or later is required.) In a
clone, `git -C ENGINE pull --ff-only` first, so the person builds with the current version.

The repository is public. Never commit or push a client deck, its logos or its outputs unless the
person says it may be public.

## Read first, every time

1. `ENGINE/guides/slide-guidelines.md`: what is fixed in every deck and what is yours to decide.
2. `ENGINE/guides/presentation-principles.md`: how the best decks are built, from consulting practice
   and research (storyline, action titles, legibility by setting, charts, the speaker script). Principles
   to decide with, not templates.
3. The worked examples, to calibrate finish and tone (not to copy their structure):
   `ENGINE/references/README.md` lists them. Open the finished PDFs in `ENGINE/references/` and
   their sources in `ENGINE/decks/`.
4. `ENGINE/guides/workflow.md`: the steps from request to delivered files.
5. As needed: `ENGINE/guides/engine.md` (components and build), `ENGINE/guides/clients.md`
   (client brands), `ENGINE/guides/design-system.md` (the full design system; the guide for every
   visual decision), `ENGINE/guides/design-skills/` (general taste, secondary to the above).

## Ask before you build

In one message, before the outline (with the question tool when there is one), ask what the request
and the material do not already answer. Give your recommended option first.

- **Setting:** presented in a room (projected or on a shared screen) or read on a device (laptop,
  tablet, sent ahead). It sets type size and density.
- **When a reference is given** (a deck, a document, notes): build it strictly by the reference, or
  improve upon it with consulting-grade storylining and research-based principles, with a speaker
  script in a .txt file.
- **Script:** whether a speaker script is wanted (included by default when improving).
- **Only if unclear:** the audience and the decision sought, the time slot, the language, the client.

Whatever the answer, suggest content improvements you see (a missing executive summary, no clear ask,
weak evidence for a claim). When building strictly by the reference, list them at hand-over instead of
applying them. `ENGINE/guides/workflow.md` has the detail.

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
node ENGINE/engine/build.mjs decks/<name>                      PDF, previews, contact sheets, script
node ENGINE/engine/build.mjs decks/<name> --pptx               also the PowerPoint file
node ENGINE/engine/build.mjs decks/<name> --pptx --client btn  for another client
```

After every build, look at every contact sheet in `decks/<name>/output/preview/<file>/` and fix
what you see. Hand over the PDF and PowerPoint paths, and the script (`<file>-script.txt`) when
there is one, with a short note: what changed from the source, what was left out or moved to the
appendix, what you added that needs confirming, which figures are illustrative, what you could not
verify.
