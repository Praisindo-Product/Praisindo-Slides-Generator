import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import * as React from "react";
import { Document, renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import sharp from "sharp";
import { clientInks, resolveClient, type ClientBrand } from "./clients";
import { writePptx } from "./pptx";
import { BlankSlide, DeckProvider, SlideIndexProvider, type Deck, type DeckAssets, type Logo, type PageMarks } from "./slide";
import { ROOT } from "./theme";

export interface RenderOptions {
  /** The folder the deck file is in; relative logo paths of a deck's own client resolve from here first. */
  readonly deckDir: string;
  /** Where the PDF, the PowerPoint file and the previews are written. */
  readonly outDir: string;
  /** A client id that replaces the deck's own. */
  readonly client?: string;
  /** Also write the PowerPoint file. */
  readonly pptx?: boolean;
  /** Write a PNG of every slide and contact sheets of four, for review. On by default. */
  readonly preview?: boolean;
  /** The folder the build was run from, for printing paths. */
  readonly invokedFrom?: string;
}

function assetPath(file: string, deckDir: string): string {
  if (path.isAbsolute(file)) return file;
  const fromDeck = path.join(deckDir, file);
  return existsSync(fromDeck) ? fromDeck : path.join(ROOT, file);
}

/** The renderer draws PNG and JPEG only, so each logo is rasterised at print size and trimmed to its artwork; `white` redraws it in white. */
async function logo(file: string, white = false): Promise<Logo> {
  let png = await sharp(file, { density: 300 }).trim().resize({ height: 240 }).png().toBuffer();
  if (white) {
    const { width = 1, height = 1 } = await sharp(png).metadata();
    const alpha = await sharp(png).ensureAlpha().extractChannel(3).toBuffer();
    png = await sharp({ create: { width, height, channels: 3, background: "#ffffff" } }).joinChannel(alpha).png().toBuffer();
  }
  const { width = 1, height = 1 } = await sharp(png).metadata();
  return { src: "data:image/png;base64," + png.toString("base64"), ratio: width / height };
}

/** The Censof wordmark is kept as a white mask (brand/censof-wordmark.png) and tinted here. */
async function censof(color: string): Promise<Logo> {
  const mask = path.join(ROOT, "brand/censof-wordmark.png");
  const { width = 1, height = 1 } = await sharp(mask).metadata();
  const alpha = await sharp(mask).ensureAlpha().extractChannel(3).toBuffer();
  const png = await sharp({ create: { width, height, channels: 3, background: color } }).joinChannel(alpha).png().toBuffer();
  return { src: "data:image/png;base64," + png.toString("base64"), ratio: width / height };
}

/** The client's logos, or nothing (the client is then named in text) when a file is missing or unreadable. */
async function clientLogos(client: ClientBrand, deckDir: string): Promise<DeckAssets["client"]> {
  if (!client.logos) return undefined;
  const light = assetPath(client.logos.light, deckDir);
  const dark = assetPath(client.logos.dark, deckDir);
  const missing = [...new Set([client.logos.light, client.logos.dark])].filter((file) => !existsSync(assetPath(file, deckDir)));
  if (missing.length) {
    console.warn("No logo file " + missing.join(" or ") + " in the deck's folder or the engine's, so " + client.name + " is named in text. Add the file, or fix the path in its client entry.");
    return undefined;
  }
  try {
    return { light: await logo(light), dark: await logo(dark, client.whiteOnDark) };
  } catch (error) {
    console.warn("Could not read the logo of " + client.name + " (" + (error instanceof Error ? error.message : error) + "), so it is named in text.");
    return undefined;
  }
}

/**
 * The Praisindo mark for dark slides. Its swooshes are cut out of the blue tile, so on a dark slide
 * they are filled white, as on paper: a white tile of the mark's own size and corner radius is laid
 * beneath it, a pixel and a half inside the edge so the tile's antialiased rim keeps no white fringe.
 * The radius is measured from the artwork (where the top row turns opaque).
 */
async function praisindoOnDark(file: string): Promise<Logo> {
  const png = await sharp(file, { density: 300 }).trim().resize({ height: 240 }).png().toBuffer();
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let radius = 0;
  while (radius < info.width / 2 && data[radius * 4 + 3] < 128) radius += 1;
  const inset = 1.5;
  const tile = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${info.width}" height="${info.height}"><rect x="${inset}" y="${inset}" width="${info.width - inset * 2}" height="${info.height - inset * 2}" rx="${Math.max(0, radius - inset)}" fill="#ffffff"/></svg>`,
  );
  const filled = await sharp(tile).composite([{ input: png }]).png().toBuffer();
  return { src: "data:image/png;base64," + filled.toString("base64"), ratio: info.width / info.height };
}

async function loadAssets(client: ClientBrand, deckDir: string): Promise<DeckAssets> {
  const mark = path.join(ROOT, "brand/praisindo-logo.svg");
  return {
    praisindo: await logo(mark),
    praisindoDark: await praisindoOnDark(mark),
    censof: { light: await censof("#7030a0"), dark: await censof("#ffffff") },
    client: await clientLogos(client, deckDir),
  };
}

async function renderPdf(deck: Deck, client: ClientBrand, assets: DeckAssets, numbered: boolean, withFrame: boolean): Promise<{ buffer: Buffer; marks: PageMarks; pages: number }> {
  const marks: PageMarks = { slides: {} };
  const pages = deck.slides.map((slide, index) => React.createElement(SlideIndexProvider, { key: index, value: index }, React.createElement(slide.Render)));
  if (withFrame) pages.push(React.createElement(SlideIndexProvider, { key: "frame", value: deck.slides.length }, React.createElement(BlankSlide)));
  const element = React.createElement(
    Document,
    { title: deck.meta.title, author: "Praisindo", subject: deck.meta.title + (client.id === "praisindo" ? "" : " - " + client.name), creator: "Praisindo", producer: "Praisindo" },
    React.createElement(DeckProvider, { value: { meta: deck.meta, client, inks: clientInks(client), assets, numbered, marks } }, ...pages),
  ) as unknown as React.ReactElement<DocumentProps>;
  const buffer = await renderToBuffer(element);
  // Counted in the file itself: every page object, not the page tree nodes.
  const pageCount = (buffer.toString("latin1").match(/\/Type\s*\/Page(?![s\w])/g) ?? []).length;
  return { buffer, marks, pages: pageCount };
}

/** Every slide must be exactly one page. A slide whose content does not fit spills onto the next page; name it. */
function checkFit(deck: Deck, marks: PageMarks, pages: number, extra: number): void {
  const count = deck.slides.length + extra;
  if (pages === count) return;
  const starts = Array.from({ length: count }, (_, index) => marks.slides[index] ?? NaN);
  const offenders = starts
    .map((start, index) => ({ index, pages: (index + 1 < count ? starts[index + 1] : pages + 1) - start }))
    .filter((slide) => slide.pages !== 1 && slide.index < deck.slides.length)
    .map((slide) => "slide " + (slide.index + 1) + " (" + (deck.slides[slide.index].Render.name || "anonymous") + ") runs to " + slide.pages + " pages");
  throw new Error("The deck has " + deck.slides.length + " slides but rendered " + (pages - extra) + " pages. Content does not fit on:\n  " + (offenders.join("\n  ") || "a slide the check could not place; look at the previews") + "\nShorten the copy, tighten the table padding, or split the slide in two.");
}

async function pngs(buffer: Buffer, scale: number): Promise<Buffer[]> {
  const { pdf } = await import("pdf-to-img");
  const images: Buffer[] = [];
  for await (const image of await pdf(buffer, { scale })) images.push(image);
  return images;
}

/** Contact sheets of four slides, two by two, for reviewing a deck at a glance. */
async function contactSheets(images: Buffer[], dir: string): Promise<number> {
  const width = 960;
  const height = 540;
  let sheet = 0;
  for (let start = 0; start < images.length; start += 4) {
    const group = images.slice(start, start + 4);
    const composite = await Promise.all(
      group.map(async (image, index) => ({ input: await sharp(image).resize(width, height, { fit: "contain", background: "#ffffff" }).toBuffer(), left: (index % 2) * (width + 10), top: Math.floor(index / 2) * (height + 10) })),
    );
    sheet += 1;
    await sharp({ create: { width: width * 2 + 10, height: height * 2 + 10, channels: 3, background: "#8a8f98" } })
      .composite(composite)
      .png()
      .toFile(path.join(dir, "sheet-" + sheet + ".png"));
  }
  return sheet;
}

const SPEAKING_RATE = 140;

/** The speaker script as plain text, one block per slide with a speaking time at 140 words a minute; undefined when no slide has one. */
function scriptText(deck: Deck, client: ClientBrand): string | undefined {
  if (!deck.slides.some((slide) => slide.script?.trim())) return undefined;
  const en = deck.meta.language === "en";
  const words = (text: string) => text.split(/\s+/).filter(Boolean).length;
  const seconds = (text: string) => Math.max(10, Math.round(((words(text) / SPEAKING_RATE) * 60) / 5) * 5);
  const total = deck.slides.reduce((sum, slide) => sum + (slide.script?.trim() ? seconds(slide.script) : 0), 0);
  const lines = [
    deck.meta.title + (client.id === "praisindo" ? "" : " - " + client.name),
    (en ? "Speaker script, " : "Naskah presentasi, ") + [deck.meta.place, deck.meta.date].filter(Boolean).join(", "),
    (en ? "About " + Math.max(1, Math.round(total / 60)) + " minutes spoken, at " : "Sekitar " + Math.max(1, Math.round(total / 60)) + " menit bicara, dengan ") + SPEAKING_RATE + (en ? " words a minute." : " kata per menit."),
    "",
  ];
  deck.slides.forEach((slide, index) => {
    const text = slide.script?.trim();
    lines.push("----------------------------------------------------------------");
    lines.push("Slide " + (index + 1) + " / " + deck.slides.length + (text ? ", " + (en ? "about " : "sekitar ") + seconds(text) + (en ? " seconds" : " detik") : ""));
    lines.push("");
    lines.push(text ?? (en ? "(No script for this slide.)" : "(Tidak ada naskah untuk slide ini.)"));
    lines.push("");
  });
  return lines.join("\n");
}

export async function renderDeck(deck: Deck, options: RenderOptions): Promise<void> {
  const client = resolveClient(options.client ?? deck.client);
  const assets = await loadAssets(client, options.deckDir);
  const file = deck.meta.file + (options.client ? "-" + client.id : "");
  mkdirSync(options.outDir, { recursive: true });
  const relative = (target: string) => path.relative(options.invokedFrom ?? process.cwd(), target) || target;

  const { buffer, marks, pages } = await renderPdf(deck, client, assets, true, false);
  checkFit(deck, marks, pages, 0);
  const pdfOut = path.join(options.outDir, file + ".pdf");
  writeFileSync(pdfOut, buffer);
  console.log("Wrote " + relative(pdfOut) + " (" + deck.slides.length + " slides, " + Math.round(buffer.length / 1024) + " KB) for " + client.name);

  const script = scriptText(deck, client);
  if (script) {
    const scriptOut = path.join(options.outDir, file + "-script.txt");
    writeFileSync(scriptOut, script, "utf8");
    console.log("Wrote " + relative(scriptOut) + " (the speaker script)");
  }

  if (options.preview !== false) {
    const dir = path.join(options.outDir, "preview", file);
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });
    const images = await pngs(buffer, 2);
    images.forEach((image, index) => writeFileSync(path.join(dir, "slide-" + String(index + 1).padStart(2, "0") + ".png"), image));
    const sheets = await contactSheets(images, dir);
    console.log("Wrote " + images.length + " slide previews and " + sheets + " contact sheets to " + relative(dir));
  }

  if (options.pptx) {
    // Without printed page numbers: PowerPoint numbers the slides itself. The extra last page is the bare frame for the slide layout.
    const unnumbered = await renderPdf(deck, client, assets, false, true);
    checkFit(deck, unnumbered.marks, unnumbered.pages, 1);
    const images = (await pngs(unnumbered.buffer, 3)).map((image) => "data:image/png;base64," + image.toString("base64"));
    const written = await writePptx({
      out: path.join(options.outDir, file + ".pptx"),
      title: deck.meta.title,
      subject: deck.meta.title + (client.id === "praisindo" ? "" : " - " + client.name),
      images: images.slice(0, deck.slides.length),
      kinds: deck.slides.map((slide) => slide.kind),
      frame: images[deck.slides.length],
      language: deck.meta.language ?? "id",
      notes: deck.slides.map((slide) => slide.script),
    });
    console.log("Wrote " + relative(written) + " (" + (deck.slides.length + 1) + " slides, the last one blank to duplicate)");
  }
}

