#!/usr/bin/env node
// Starts a deck from the starter template, in decks/<name> under the current folder.
//
//   node scripts/new-deck.mjs <name> [--client <id>]

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const name = args.find((arg, index) => !arg.startsWith("--") && args[index - 1] !== "--client");
const clientAt = args.indexOf("--client");
const client = clientAt >= 0 ? args[clientAt + 1] : undefined;

if (!name || !/^[a-z0-9][a-z0-9-]*$/.test(name)) {
  console.error("Name the deck in lowercase words joined by hyphens: node scripts/new-deck.mjs quarterly-review-nobu [--client nobu-bank]");
  process.exit(1);
}

const engineRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = path.resolve("decks", name);
if (existsSync(path.join(target, "deck.tsx"))) {
  console.error("decks/" + name + "/deck.tsx already exists.");
  process.exit(1);
}
mkdirSync(target, { recursive: true });
let source = readFileSync(path.join(engineRoot, "decks/starter/deck.tsx"), "utf8");
const file = name
  .split("-")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join("-");
source = source.replace('file: "Praisindo-Starter"', 'file: "' + file + '"');
if (client) source = source.replace('client: "praisindo"', 'client: "' + client + '"');
writeFileSync(path.join(target, "deck.tsx"), source);
if (!existsSync(path.resolve("tsconfig.json")) && path.resolve(".") !== engineRoot) {
  // Outside the engine's repository: a tsconfig so editors resolve "praisindo-slides".
  writeFileSync(
    path.resolve("decks", "tsconfig.json"),
    JSON.stringify({ extends: path.join(engineRoot, "tsconfig.json").replace(/\\/g, "/"), compilerOptions: { baseUrl: engineRoot.replace(/\\/g, "/") }, include: ["./**/*.tsx"] }, null, 2) + "\n",
  );
}
console.log("Started decks/" + name + "/deck.tsx from the starter" + (client ? " for " + client : "") + ".");
console.log("Build it with: node " + path.join(engineRoot, "engine/build.mjs").replace(/\\/g, "/") + " decks/" + name);
