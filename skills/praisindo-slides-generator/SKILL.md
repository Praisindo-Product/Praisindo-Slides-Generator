---
name: praisindo-slides-generator
description: Make Praisindo slide decks (client presentations, proposals, product overviews, internal reviews) in the Praisindo design system, delivered as PDF and PowerPoint. Use whenever someone asks for slides, a deck or a presentation for Praisindo or one of its clients (CIMB Niaga, Bank Mandiri, BRI, BCA, BNI, BTN, Trimegah, Manulife, Batavia or others), or asks to remake, restyle or fix an existing deck in the Praisindo style.
---

# Praisindo Slides Generator

You make decks with a TypeScript slide engine that renders PDF and PowerPoint in Praisindo's
document language. Every deck shares a fixed shell and look; what goes inside is designed for its
content.

## First, every time: work from the latest instructions

Mandatory, before anything else in this skill: on every new deck request, and again when a
conversation resumes after a break, make sure the instructions and the engine are the latest
published version. Never work from stale instructions, including a copy you read earlier in the
conversation or remember from another one. Only skip this if the person explicitly tells you not to
update.

1. **Find how ENGINE was installed** (see "Where the engine is" below, and
   `ENGINE/guides/getting-started.md` for a machine with nothing set up).
2. **A clone (ENGINE has a `.git` folder):** check the remote, then update.
   ```
   git -C ENGINE fetch --quiet origin main
   git -C ENGINE rev-parse --short HEAD origin/main
   ```
   - The same commit: current. Carry on.
   - Behind: note the old commit, then `git -C ENGINE pull --ff-only origin main`. If
     `git -C ENGINE diff --name-only <old> HEAD -- package-lock.json` lists the lockfile, run
     `npm ci --prefix ENGINE` again. Then **read this file again from the start**: what you read
     before the pull is stale.
   - The pull is refused (local changes to files the update touches, another branch, or a diverged
     history): never discard, reset, stash or switch branches without the person's yes. Read the
     latest instructions straight from the remote and follow those:
     `git -C ENGINE show origin/main:skills/praisindo-slides-generator/SKILL.md`, and the same for
     every guide you use (`origin/main:guides/<name>.md`). Tell the person their copy is behind and
     what blocks the update, and offer to update it (for example stash, pull, stash pop) on their
     yes. If the latest instructions rely on an engine feature their local copy lacks, say so before
     building.
3. **The plugin (ENGINE is `${CLAUDE_PLUGIN_ROOT}`):** `claude plugin marketplace update praisindo`,
   then `claude plugin update praisindo-slides-generator@praisindo`, then read this file again from
   ENGINE. If the update cannot run, read the latest instructions from GitHub instead:
   `curl -fsSL https://raw.githubusercontent.com/Praisindo-Product/Praisindo-Slides-Generator/main/skills/praisindo-slides-generator/SKILL.md`
   (and `.../main/guides/<name>.md`).
4. **An archive install (no `.git` folder, usually `~/Praisindo-Slides-Generator-install/...`):**
   compare `version` in `ENGINE/package.json` with the highest version attached to Corpus COR-2009.
   If Corpus has a newer one, download and unpack it and use it. If Git and GitHub are available,
   clone the repository instead and use the clone from then on.
5. **Coming from Corpus:** load the skill with `skill.get praisindo-slides-generator` at the start of
   each deck request, never from memory. Once ENGINE is current, this file is the authority; where
   Corpus and the repository differ, the repository wins.
6. **Offline, or the remote cannot be reached:** carry on with the local copy, and tell the person
   which commit or version you are using and that you could not check for a newer one.

Then say in one line what you are working from, for example "Generator up to date (commit a7c082c)".

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

(Skip it when `ENGINE/node_modules/@react-pdf` exists and the lockfile did not change in an update.
Node 20.19 or later is required.) Updating comes first: "First, every time" above.

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

## Write concisely

When writing a deck from scratch or improving a reference, keep the copy short and straightforward:
say each thing once in the fewest words that keep the meaning, and omit what the viewer would not
miss (move what someone might ask about to the appendix or the script). Numbers, conditions, controls,
owners and dates stay exact. List what you omitted at hand-over. When building strictly by a
reference, keep its wording and suggest these cuts instead. `ENGINE/guides/presentation-principles.md`,
section 3, has the detail.

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
