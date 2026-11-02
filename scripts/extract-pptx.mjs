#!/usr/bin/env node
// Prints the text of every slide in a PowerPoint file, in order, with its speaker notes, so a
// source deck can be read before it is remade. Grouped shapes and tables are included; text is in
// the order PowerPoint stores it, which is usually top to bottom.
//
//   node scripts/extract-pptx.mjs <file.pptx>

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "package.json"));
const JSZip = require("jszip");

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/extract-pptx.mjs <file.pptx>");
  process.exit(1);
}

const decode = (text) => text.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");

/** The paragraphs of a slide part: each <a:p> joined from its runs. */
function paragraphs(xml) {
  return [...xml.matchAll(/<a:p>([\s\S]*?)<\/a:p>/g)]
    .map((match) => [...match[1].matchAll(/<a:t>([\s\S]*?)<\/a:t>/g)].map((run) => decode(run[1])).join(""))
    .map((text) => text.trim())
    .filter(Boolean);
}

const zip = await JSZip.loadAsync(readFileSync(path.resolve(file)));
const presentation = await zip.file("ppt/presentation.xml").async("string");
const rels = await zip.file("ppt/_rels/presentation.xml.rels").async("string");
const targets = Object.fromEntries([...rels.matchAll(/Id="([^"]+)"[^>]*Target="([^"]+)"/g)].map((match) => [match[1], match[2]]));
const order = [...presentation.matchAll(/<p:sldId [^>]*r:id="([^"]+)"/g)].map((match) => "ppt/" + targets[match[1]].replace(/^\//, "").replace(/^ppt\//, ""));

for (const [index, part] of order.entries()) {
  const xml = await zip.file(part).async("string");
  console.log("\n===== Slide " + (index + 1) + " (" + path.basename(part) + ")");
  for (const line of paragraphs(xml)) console.log("- " + line);
  const relsPart = part.replace("slides/", "slides/_rels/") + ".rels";
  const slideRels = zip.file(relsPart) ? await zip.file(relsPart).async("string") : "";
  const media = [...slideRels.matchAll(/Target="\.\.\/media\/([^"]+)"/g)].map((match) => match[1]);
  if (media.length) console.log("  images: " + media.join(", "));
  const notes = /Target="\.\.\/notesSlides\/([^"]+)"/.exec(slideRels);
  if (notes && zip.file("ppt/notesSlides/" + notes[1])) {
    const text = paragraphs(await zip.file("ppt/notesSlides/" + notes[1]).async("string")).filter((line) => !/^\d+$/.test(line));
    if (text.length) console.log("  notes: " + text.join(" / "));
  }
}
