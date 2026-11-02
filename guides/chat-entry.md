# Chat entry

For an AI assistant asked for a Praisindo deck in a general chat (Claude chat on the web, desktop
or mobile, or another AI chat) instead of Claude Code on the person's computer. The same procedure
is in Corpus as "Praisindo Slides Generator: chat entry procedure" (COR-2016).

The generator is meant to run locally, in Claude Code: it needs a shell, Node.js and the engine's
files to render the PDF and PowerPoint in the house style and check every slide. A general chat
cannot do that.

## Where you are running

- **Claude Code on the person's computer**, or **Claude Code on the web** with this repository
  open: the normal workflow (`skills/praisindo-slides-generator/SKILL.md`).
- **A general chat**: follow the three steps below. Even with a code sandbox, do not try to install
  and run the generator there.

## 1. Say it is meant to run locally

Before any work, tell the person, in their language:

> The Praisindo Slides Generator runs on your computer through Claude Code, so it can build the PDF
> and PowerPoint in the Praisindo style and check every slide. I can't run it in this chat.
>
> Setting it up takes about 10 minutes: install Node.js 22, Git and Claude Code, open Claude Code
> and say "fetch corpus for the slides generator skills". The user manual is COR-2008.
>
> If you'd like, I can still help here: I can plan the deck, write every slide's content, sort out
> the client's branding, and prepare the deck file so your local Claude Code (or a colleague's)
> builds it in one step. I can't produce the final PDF or PowerPoint here.

Mention Claude Code on the web (claude.ai/code) as the remote option: it can open this repository,
which is public (github.com/Praisindo-Product/Praisindo-Slides-Generator).

## 2. The minimum service, if they want it

Following the slide guidelines and after studying the worked examples, as you would locally:

1. **Deck plan**: one line per slide with the section, the title stating the point, what it shows
   and how.
2. **Slide content, final**: every title, description and body copy; every fact and figure from the
   source, the arithmetic checked, units and periods stated, illustrative figures marked.
3. **Client branding**: from the registry, or found online (official logo, colours inferred by
   searching), or asked for; with sources and a proposed palette.
4. **The deck file**: `deck.tsx` written with `guides/engine.md` (in Corpus: the engine API reference,
   COR-2017, with the starter attached), as a file or a code block, marked as not yet built.

Do not claim you ran the generator, do not recreate the Praisindo shell or lockup by hand in
anything meant for a client, and do not produce a client-ready PDF or PowerPoint in the chat. A rough
preview is acceptable only when labelled "Draft preview, not the Praisindo house style; not for
clients", with no logos.

## 3. Hand-off

1. Save the file as `decks/<deck-name>/deck.tsx`.
2. In Claude Code with the generator: "build decks/<deck-name> with the slides generator, with the
   PowerPoint file". Claude builds it, fixes any slide that does not fit, checks every slide and
   hands over the files.
3. Without a deck file: paste the plan and content into Claude Code and ask for the deck.
