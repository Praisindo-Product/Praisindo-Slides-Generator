import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Path, Svg } from "@react-pdf/renderer";
import type { IconType } from "react-icons";

/**
 * Phosphor icons through react-icons/pi, the design system's family, redrawn as PDF vectors (the PDF
 * renderer cannot draw a DOM icon). A slide names the icon component directly, e.g. PiBank. Icons
 * drawn with circles or rects instead of paths are refused; pick another.
 */

interface Shape {
  readonly viewBox: string;
  readonly paths: readonly string[];
}

const shapes = new Map<IconType, Shape>();

function shapeOf(icon: IconType): Shape {
  const cached = shapes.get(icon);
  if (cached) return cached;
  const markup = renderToStaticMarkup(React.createElement(icon));
  const viewBox = /viewBox="([^"]+)"/.exec(markup)?.[1] ?? "0 0 256 256";
  const paths = [...markup.matchAll(/<path[^>]*?\sd="([^"]+)"/g)].map((match) => match[1]);
  if (paths.length === 0 || /<(circle|rect|line|polyline|polygon|ellipse)\b/.test(markup)) {
    throw new Error("Icon " + (icon.name || "?") + " is not drawn from paths alone and cannot be redrawn in the PDF.");
  }
  const shape = { viewBox, paths };
  shapes.set(icon, shape);
  return shape;
}

export function Icon({ icon, size = 12, color }: { icon: IconType; size?: number; color: string }) {
  const shape = shapeOf(icon);
  return (
    <Svg width={size} height={size} viewBox={shape.viewBox}>
      {shape.paths.map((path, index) => (
        <Path key={index} d={path} fill={color} />
      ))}
    </Svg>
  );
}
