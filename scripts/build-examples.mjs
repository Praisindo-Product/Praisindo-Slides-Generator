#!/usr/bin/env node
// Builds the worked example and the starter for every client, with PowerPoint files, as a check
// that the engine works end to end. Run after changing the engine.
//
//   npm run examples

import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const build = (...args) => execFileSync(process.execPath, [path.join(root, "engine/build.mjs"), ...args], { stdio: "inherit", cwd: root });
const CLIENTS = ["praisindo", "cimb-niaga", "nobu-bank", "btn", "trimegah-am", "batavia", "maybank-am"];

build("decks/consolidated-wealth-statement-cimb-niaga", "--pptx");
for (const client of CLIENTS) build("decks/starter", "--pptx", "--client", client);
console.log("\nAll examples built. Look at the contact sheets in each deck's output/preview folder.");
