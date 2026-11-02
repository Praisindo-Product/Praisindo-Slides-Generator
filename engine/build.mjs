#!/usr/bin/env node
// Builds a deck into a PDF, slide previews and contact sheets, and optionally a PowerPoint file.
//
//   node engine/build.mjs <deck>                       a deck folder (with deck.tsx) or a deck file
//   node engine/build.mjs <deck> --pptx                also the PowerPoint file
//   node engine/build.mjs <deck> --client nobu-bank    for another client (engine/clients.ts)
//   node engine/build.mjs <deck> --out <folder>        output folder; <deck folder>/output by default
//   node engine/build.mjs <deck> --no-preview          skip the PNG previews
//
// The deck can live anywhere: in decks/ here, or in another project when the engine is installed as
// the Claude Code plugin. A deck imports the engine as "praisindo-slides". The deck is TypeScript, so
// it is bundled with esbuild first and then run with Node from the engine's folder, which is where
// its packages, fonts and brand files are.

import { build } from "esbuild";
import { existsSync, mkdirSync, rmSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const args = process.argv.slice(2);
const option = (name) => {
  const at = args.indexOf(name);
  return at >= 0 ? args[at + 1] : undefined;
};
const valued = new Set(["--client", "--out"]);
const target = args.find((arg, index) => !arg.startsWith("--") && !valued.has(args[index - 1]));

if (!target) {
  console.error("Name a deck: node engine/build.mjs decks/starter [--pptx] [--client <id>] [--out <folder>]");
  process.exit(1);
}

let deckFile = path.resolve(target);
if (existsSync(deckFile) && statSync(deckFile).isDirectory()) deckFile = path.join(deckFile, "deck.tsx");
if (!existsSync(deckFile)) {
  console.error("No deck at " + deckFile + ". A deck is a folder with a deck.tsx, or a .tsx file.");
  process.exit(1);
}
const deckDir = path.dirname(deckFile);
const outDir = path.resolve(option("--out") ?? path.join(deckDir, "output"));
const invokedFrom = process.cwd();

const engineRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
if (!existsSync(path.join(engineRoot, "node_modules", "@react-pdf"))) {
  console.error("The engine's packages are not installed. Run `npm ci` in " + engineRoot + " first.");
  process.exit(1);
}
process.chdir(engineRoot);

// Inside node_modules, so the bundle finds the engine's packages, which it leaves external.
const work = path.join(engineRoot, "node_modules", ".cache", "praisindo-slides");
mkdirSync(work, { recursive: true });
const bundle = path.join(work, "render-" + process.pid + ".mjs");
const settings = { deckDir, outDir, invokedFrom, client: option("--client"), pptx: args.includes("--pptx"), preview: !args.includes("--no-preview") };

try {
  await build({
    stdin: {
      contents: [
        "import deck from " + JSON.stringify(deckFile.replace(/\\/g, "/")) + ";",
        'import { renderDeck } from "./engine/render";',
        "await renderDeck(deck, " + JSON.stringify(settings) + ");",
      ].join("\n"),
      resolveDir: engineRoot,
      loader: "ts",
    },
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node20",
    jsx: "automatic",
    packages: "external",
    // Aliases resolve against the working directory, so pin it to the engine.
    absWorkingDir: engineRoot,
    alias: { "praisindo-slides": "./engine/index.ts" },
    outfile: bundle,
    logLevel: "warning",
  });
  await import(pathToFileURL(bundle).href);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  rmSync(bundle, { force: true });
}
