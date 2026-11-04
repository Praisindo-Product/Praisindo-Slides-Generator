# Making a deck, step by step

`ENGINE` below is the folder this guide is in, one level up: the repository root when you work in
the cloned repo, or the plugin's folder when the skill is installed as a plugin. Run the build
from wherever the deck is; the build finds its own packages, fonts and brand files.

## 1. Understand the ask

Find out, from the request and any material attached:

- the audience, the occasion (a client meeting, an internal review, a proposal) and what the audience
  should decide or do afterwards;
- the setting: presented in a room or read on a device;
- the time slot, which sets the length of the main story;
- the client, which sets the logo and colours (`engine/clients.ts`; `praisindo` for none). If the
  client is not in the registry, get its branding now: find the official logo online and infer the
  colours by searching, or ask the person to upload them (`guides/clients.md`);
- the language (Indonesian unless the person says otherwise or the source is in English);
- the source material: a draft deck, a document, notes, figures, screenshots of the product.

Ask only what you cannot work out. Do not ask about styling; the design system decides it.

### The questions to ask

Ask them together, in one message, before the outline; use the question tool when there is one. Put
your recommended option first and say in a few words what each option means.

1. **Room or device.** "Will this be presented in a room (projected or on a shared screen) or read on a
   device (laptop, tablet, sent ahead)?" Room decks use larger type and fewer words; device decks must
   explain themselves. When the person cannot say, assume a room. Sizes are in
   `presentation-principles.md`, section 6.
2. **Strict or improved, when there is a reference.** When the person gives a deck, a document or
   notes: "Should I build it strictly by the reference (same structure and content, in the Praisindo
   style), or improve upon it (storyline, titles and structure by consulting practice and
   research-based principles, with a speaker script)?" Recommend improving unless the reference is
   already approved or the person needs it unchanged. What each means is in
   `presentation-principles.md`, section 11.
3. **Script.** "Would you like a speaker script (a .txt file, also in the PowerPoint notes)?"
   Included by default when improving; ask when building strictly.
4. **Anything else you cannot infer:** who the audience is and what they should decide, how long the
   slot is, the language, the client.

Skip any question the request already answers, and do not ask again later in the same work unless
something changes.

### Suggest, always

Whichever way the person chooses, say what would make the deck stronger: a missing executive summary,
no clear ask or next step, a title that does not state its point, a claim without evidence, a slide
that carries two messages, detail that belongs in the appendix. When improving, apply them. When
building strictly by the reference, list them at hand-over and apply none.

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

Write the slide list in the chat as a ghost deck: for each slide, its action title (the point as a
sentence) and how it will show it (a table, a chart, a diagram, a single figure, something new). Read
the titles alone in order: they should tell the story (`presentation-principles.md`, section 2).
Mark which slides are the main story and which are appendix. For a short deck, carry on; for a long
one, an improved storyline or a change of story, let the person see the outline first.

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

Size the type for the setting (`presentation-principles.md`, section 6): the design system's scale
for a device, larger body and label sizes inside the frame for a room.

When a script is wanted, give each slide a `script` in `slides` (`{ kind, Render, script }`): what the
presenter says, in spoken sentences, adding to the slide rather than reading it
(`presentation-principles.md`, section 10). The build writes `<file>-script.txt` and puts the same text
in the PowerPoint speaker notes.

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

Give the paths of the PDF, the PowerPoint file and the script (when there is one). Say, briefly:
what changed from the source, what you left out or moved to the appendix and why, what you added that
the person must confirm (a proposed decision, owner or date), which figures are illustrative, and
anything you could not verify. When you built strictly by the reference, list the improvements you
would suggest.

## Checklist

- [ ] Setting (room or device), reference handling (strict or improved) and script asked, or clear
      from the request.
- [ ] Worked examples looked at to calibrate; the deck's design follows its own content.
- [ ] Read alone, the titles tell the story; one message per slide; the deck ends with the ask.
- [ ] Type and density suit the setting.
- [ ] The shell, lockup and client branding come from the engine, unchanged.
- [ ] Every fact and figure from the source is in the deck, or its omission is reported.
- [ ] Titles state the point; plain language; no em dashes or middle dots.
- [ ] Figures reconcile; units, periods and illustrative status are stated.
- [ ] Client colours come from the context; the deck still works with `--client praisindo`.
- [ ] The script, if wanted, is on every slide and its timing fits the slot.
- [ ] The build passes; every contact sheet looked at; PDF, PowerPoint and script delivered.
