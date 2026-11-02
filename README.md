# Praisindo Slides Generator

Tell Claude what deck you need; get a PDF and a PowerPoint file in the Praisindo design system.

The repository holds a slide engine (TypeScript, rendering with react-pdf and pptxgenjs), the
guides and design system Claude follows, worked examples and reference documents, client brand
assets, and a Claude Code plugin that packages all of it as the `praisindo-slides-generator` skill.

## What every deck gets

- The Praisindo shell: header with the Praisindo lockup, the deck title and the client's logo;
  footer with classification, client, date and page number; a dark cover and closing slide in the
  client's colours.
- The Praisindo design system's look: Libre Franklin, light paper, hairline cards and tables.
- The client's brand applied for you (CIMB Niaga, Nobu Bank, Bank BTN, Trimegah AM, Batavia,
  Maybank AM, OCBC Sekuritas, or Praisindo alone), and the same deck rebuildable for another
  client in one command.
- A check that every slide fits on one page, previews and contact sheets for review, a PDF, and a
  PowerPoint file with live slide numbers and a framed layout for adding slides by hand.

Inside the shell, the layout and visuals are designed for each deck's content.

## Where it runs

The generator runs on your computer, in Claude Code, which is what lets it build the files in the
house style and check every slide. In a general Claude chat it cannot run: the chat says so, and if
you still want help there, it plans the deck, writes the content, sorts out the client's branding
and prepares a deck file for you to build later (`guides/chat-entry.md`). You can also use Claude
Code on the web (claude.ai/code) with this repository, which is public.

## Setup

Requirements: Node.js 20.19 or later (22 recommended, see `.nvmrc`), Git, and Claude Code.

### Option 1: install the plugin (use it from any folder)

```
claude plugin marketplace add Praisindo-Product/Praisindo-Slides-Generator
claude plugin install praisindo-slides-generator@praisindo
```

Claude Code copies the plugin and installs its packages. If the first build reports missing
packages, Claude runs `npm ci` in the plugin's folder (the skill tells it how).

Update later with:

```
claude plugin marketplace update praisindo
claude plugin update praisindo-slides-generator@praisindo
```

### Option 2: clone the repository (to work on decks and the engine here)

```
git clone https://github.com/Praisindo-Product/Praisindo-Slides-Generator.git
cd Praisindo-Slides-Generator
npm ci
claude
```

`CLAUDE.md` points Claude to the skill, so no install is needed when you work inside the clone.

### Option 3: from Corpus

Ask Claude, with the Praisindo connector enabled: "fetch corpus for the slides generator skills".
The Corpus skill sets up the generator (cloning or unpacking it and installing packages) and then
works as above.

## Using it

Open Claude Code in the folder where you want the deck, and say what you need:

- "Buatkan deck untuk CIMB Niaga tentang rencana integrasi DWH, 8 sampai 10 slide."
- "Remake this deck in our style: C:\Users\me\Downloads\proposal.pptx"
- "Make the same deck for Nobu Bank."
- "Add a slide after the cash flow with this table" (paste a screenshot).

Claude reads the guidelines and the worked examples, pulls the content out of your source, shows
an outline for longer decks, writes the deck in `decks/<name>/deck.tsx`, builds it, checks every
slide, and hands you:

```
decks/<name>/output/<File>.pdf
decks/<name>/output/<File>.pptx
decks/<name>/output/preview/<File>/        a PNG per slide and contact sheets
```

Ask for changes in plain words ("the cover feels empty", "split slide 7", "use English"); Claude
edits the deck and rebuilds.

### Commands, if you want to run them yourself

```
npm run build -- decks/<name>                      PDF and previews
npm run build -- decks/<name> --pptx               also PowerPoint
npm run build -- decks/<name> --pptx --client btn  for another client
npm run starter                                    the starter template
npm run examples                                   every example, for every client
node scripts/new-deck.mjs <name> --client <id>     start a deck from the starter
node scripts/extract-pptx.mjs <file.pptx>          print a deck's text
```

### Editing in PowerPoint

Slides are images of the rendered slides, so they look exactly like the PDF. To add a slide by
hand, duplicate the last slide or choose New Slide with the "Praisindo content" layout: it has the
header, footer, slide number and title placeholders. Install the fonts in `fonts/` to see the
placeholders in Libre Franklin. If the file is open in PowerPoint during a build, the new file is
written beside it as `<File> (updated).pptx`.

## Layout

```
engine/       the renderer; decks import it as "praisindo-slides"
brand/        Praisindo mark and wordmark, Censof wordmark, client logos
fonts/        Libre Franklin and Fraunces, with licences
decks/        starter template and worked examples
references/   finished decks and product documents to study
guides/       slide guidelines, workflow, engine and client references, design system, design skills
skills/       the praisindo-slides-generator skill
scripts/      new deck, PowerPoint text extraction, build all examples
.claude-plugin/   plugin and marketplace manifests
```

## Contributing

- Add a client: `guides/clients.md`.
- Add a component to the engine: put it in `engine/`, export it from `engine/index.ts`, document
  it in `guides/engine.md`, run `npm run typecheck` and `npm run examples`.
- Add a worked example: its source in `decks/`, its finished files in `references/`, a line in
  `references/README.md`.
- Release a new plugin version: bump `version` in `.claude-plugin/plugin.json`.

Fonts are under the SIL Open Font License (`fonts/OFL-*.txt`). Client logos belong to their
institutions and are used for presentations to them.
