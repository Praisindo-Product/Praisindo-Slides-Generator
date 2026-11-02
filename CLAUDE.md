# Praisindo Slides Generator

This repository makes Praisindo slide decks: an engine that renders PDF and PowerPoint in the
Praisindo design system, the guides and references an agent needs, and a Claude Code plugin.

When someone asks for a deck, slides or a presentation, read
`skills/praisindo-slides-generator/SKILL.md` and follow it. Here, ENGINE is this folder.

## Working on the engine itself

- `engine/`: the renderer (`theme.ts`, `slide.tsx` for the shell and blocks, `dark.tsx` for the
  cover and closing, `statement.tsx`, `diagram.tsx`, `clients.ts`, `render.tsx`, `pptx.ts`,
  `build.mjs`). Decks import it as `"praisindo-slides"`.
- `brand/`: the Praisindo mark, the Censof wordmark, the Praisindo wordmark outlines
  (`make-wordmark.mjs` regenerates them), and client logos.
- `fonts/`: Libre Franklin and Fraunces, with their licences.
- `decks/`: the starter and the worked examples. `references/`: finished files to study.
- `guides/`: slide guidelines, workflow, engine and client references, the design system, and
  general design skills.

After changing the engine: `npm run typecheck` and `npm run examples`, then look at the contact
sheets. Keep `guides/engine.md` in step with what the engine exports. The shell (header, footer,
cover and closing frame) and the Praisindo lockup are fixed by design; change them only when the
person responsible for the brand asks.

## Rules for this repository

- Commit or push only when asked.
- Client palettes follow the institution presets in WMS-IMS Ultimate; keep them in step.
- No em dashes or middle dots in any copy or documentation.
