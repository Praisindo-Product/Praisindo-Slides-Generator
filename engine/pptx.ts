import { writeFileSync } from "node:fs";
import PptxGenJS from "pptxgenjs";
import { SLIDE_H, SLIDE_PADDING_X, SLIDE_W } from "./theme";

/**
 * The PowerPoint file. Each slide is the PDF slide as one full-bleed image, so it looks exactly like
 * the PDF. On top:
 *
 * - content slides get a live slide number where the PDF prints it, so numbering stays right when
 *   slides are added, moved or removed;
 * - the file carries a slide layout, "Praisindo content", whose background is the header and footer
 *   with a slide number and title placeholders set in the deck's type. New Slide in PowerPoint with
 *   that layout gives a framed slide to fill in by hand. The last slide is one, ready to duplicate.
 *
 * Text is set in Libre Franklin; install fonts/libre-franklin-*.ttf to see it as designed.
 */

const inches = (points: number) => points / 72;
const MUTED = "4D5B70";
const FOREGROUND = "0D1522";

export interface PptxInput {
  readonly out: string;
  readonly title: string;
  readonly subject: string;
  /** PNG data URIs, one per slide. */
  readonly images: readonly string[];
  readonly kinds: readonly ("content" | "dark")[];
  /** A PNG data URI of the header and footer alone, for the layout. */
  readonly frame: string;
  /** The deck's language, for the placeholder prompts. */
  readonly language: "id" | "en";
}

/** pptxgenjs takes "image/png;base64,..." without the "data:" scheme. */
const data = (uri: string) => uri.replace(/^data:/, "");

export async function writePptx(input: PptxInput): Promise<string> {
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "PRAISINDO_16x9", width: inches(SLIDE_W), height: inches(SLIDE_H) });
  pptx.layout = "PRAISINDO_16x9";
  pptx.title = input.title;
  pptx.subject = input.subject;
  pptx.author = "Praisindo";
  pptx.company = "Praisindo";

  const number = { x: inches(SLIDE_W - SLIDE_PADDING_X - 80), y: inches(511.5), w: inches(80), h: inches(14), margin: 0, fontFace: "Libre Franklin", fontSize: 7.5, color: MUTED, align: "right" as const };
  const prompts = input.language === "en" ? { overline: "Section", title: "Slide title", body: "One sentence on what this slide shows." } : { overline: "Bagian", title: "Judul slide", body: "Satu kalimat tentang isi slide ini." };
  const box = (y: number, h: number) => ({ x: inches(SLIDE_PADDING_X), y: inches(y), w: inches(SLIDE_W - SLIDE_PADDING_X * 2), h: inches(h), margin: 0, fontFace: "Libre Franklin", align: "left" as const, valign: "top" as const });

  pptx.defineSlideMaster({
    title: "Praisindo content",
    background: { data: data(input.frame) },
    slideNumber: number,
    objects: [
      { placeholder: { options: { name: "overline", type: "body", ...box(71, 14), fontSize: 9.5, color: MUTED }, text: prompts.overline } },
      { placeholder: { options: { name: "title", type: "title", ...box(85, 32), fontSize: 22, bold: true, color: FOREGROUND }, text: prompts.title } },
      { placeholder: { options: { name: "description", type: "body", ...box(119, 18), fontSize: 11, color: MUTED }, text: prompts.body } },
    ],
  });
  pptx.defineSlideMaster({ title: "Praisindo image", background: { color: "FFFFFF" } });

  input.images.forEach((image, index) => {
    const slide = pptx.addSlide({ masterName: "Praisindo image" });
    slide.addImage({ data: data(image), x: 0, y: 0, w: inches(SLIDE_W), h: inches(SLIDE_H) });
    if (input.kinds[index] === "content") slide.slideNumber = number;
  });
  const blank = pptx.addSlide({ masterName: "Praisindo content" });
  blank.addText(prompts.overline, { placeholder: "overline" });
  blank.addText(prompts.title, { placeholder: "title" });
  blank.addText(prompts.body, { placeholder: "description" });

  const buffer = (await pptx.write({ outputType: "nodebuffer" })) as Buffer;
  try {
    writeFileSync(input.out, buffer);
    return input.out;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== "EBUSY" && code !== "EPERM" && code !== "EACCES") throw error;
    // The file is open in PowerPoint; write beside it rather than fail.
    const beside = input.out.replace(/\.pptx$/, " (updated).pptx");
    writeFileSync(beside, buffer);
    console.warn("The PowerPoint file is open elsewhere, so this build was written to " + beside);
    return beside;
  }
}
