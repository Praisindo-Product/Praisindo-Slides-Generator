import * as React from "react";
import { Path, Polygon, Polyline, Svg, Text, View } from "@react-pdf/renderer";
import type { IconType } from "react-icons";
import { PiUser } from "react-icons/pi";
import { Icon } from "./icons";
import { useDeck } from "./slide";
import { ACCENT, ACCENT_SUBTLE, BORDER, d, MUTED, MUTED_STRONG, mix, RADIUS, RAISED } from "./theme";

/**
 * Architecture diagrams, drawn on a fixed grid in points: boxes and groups placed absolutely, lines
 * and arrows in one SVG layer beneath, numbered badges on the lines that a table on the next slide
 * explains. Praisindo's systems are in the accent tint, the client's in its brand tint. Lay out
 * coordinates by hand on paper first; keep lines orthogonal and avoid crossings by choosing lanes.
 * See decks/consolidated-wealth-statement-cimb-niaga (TechnicalDiagram) for a worked example.
 */

export type Tone = "praisindo" | "client";

export function useTones() {
  const { inks, client } = useDeck();
  return {
    praisindo: { fill: ACCENT_SUBTLE, border: "#b9c7ef" },
    client: { fill: inks.tint, border: mix(client.palette.primary, "#ffffff", 0.6) },
  } as const;
}

export type Point = readonly [number, number];
const LINE = "#7d8aa0";

/** An orthogonal line with an arrowhead at its end (and at its start when `both`). Use inside DiagramLayer. */
export function Arrow({ points, both }: { points: readonly Point[]; both?: boolean }) {
  const head = (tip: Point, from: Point) => {
    const dx = Math.sign(tip[0] - from[0]);
    const dy = Math.sign(tip[1] - from[1]);
    const base: Point = [tip[0] - dx * 5, tip[1] - dy * 5];
    const a: Point = [base[0] - dy * 2.6, base[1] + dx * 2.6];
    const b: Point = [base[0] + dy * 2.6, base[1] - dx * 2.6];
    return <Polygon points={[tip, a, b].map((p) => p.join(",")).join(" ")} fill={LINE} />;
  };
  return (
    <>
      <Polyline points={points.map((p) => p.join(",")).join(" ")} stroke={LINE} strokeWidth={0.9} fill="none" />
      {head(points[points.length - 1], points[points.length - 2])}
      {both ? head(points[0], points[1]) : null}
    </>
  );
}

/** The path of a database cylinder. Use inside DiagramLayer with <Path d={cylinder(...)} />. */
export function cylinder(x: number, y: number, w: number, h: number): string {
  const rx = w / 2;
  const ry = 4.5;
  return [`M ${x} ${y + ry}`, `A ${rx} ${ry} 0 0 1 ${x + w} ${y + ry}`, `L ${x + w} ${y + h - ry}`, `A ${rx} ${ry} 0 0 1 ${x} ${y + h - ry}`, "Z", `M ${x} ${y + ry}`, `A ${rx} ${ry} 0 0 0 ${x + w} ${y + ry}`].join(" ");
}

/** The diagram's canvas: a fixed-size box everything is placed in. */
export function Diagram({ width, height, children }: { width: number; height: number; children: React.ReactNode }) {
  return <View style={{ position: "relative", width, height }}>{children}</View>;
}

/** The SVG layer for lines and cylinders, the size of the diagram. Place it after the groups so lines draw over group fills. */
export function DiagramLayer({ width, height, children }: { width: number; height: number; children: React.ReactNode }) {
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", left: 0, top: 0 }}>
      {children}
    </Svg>
  );
}

/** A database: the cylinder in the line layer is drawn with StoreShape, the label with StoreLabel. */
export function StoreShape({ x, y, w, h = 50, tone }: { x: number; y: number; w: number; h?: number; tone: Tone }) {
  const tones = useTones();
  return <Path d={cylinder(x, y, w, h)} fill="#ffffff" stroke={tones[tone].border} strokeWidth={0.9} />;
}

export function StoreLabel({ x, y, w, h = 50, label }: { x: number; y: number; w: number; h?: number; label: string }) {
  return (
    <View style={{ position: "absolute", left: x, top: y + 12, width: w, height: h - 14, alignItems: "center", justifyContent: "center", paddingHorizontal: 2 }}>
      <Text style={{ fontSize: w < 50 ? 6.5 : 7, textAlign: "center", lineHeight: 1.2, color: MUTED_STRONG }}>{label}</Text>
    </View>
  );
}

/** A system or service box. */
export function Node({ x, y, w, h, title, sub, tone, icon }: { x: number; y: number; w: number; h: number; title: string; sub?: string; tone: Tone; icon?: IconType }) {
  const tones = useTones();
  return (
    <View style={{ position: "absolute", left: x, top: y, width: w, height: h, backgroundColor: tone === "praisindo" ? "#ffffff" : tones[tone].fill, borderWidth: 0.75, borderColor: tones[tone].border, borderRadius: 4, alignItems: "center", justifyContent: "center", paddingHorizontal: 4 }}>
      {icon ? <Icon icon={icon} size={10} color={MUTED_STRONG} /> : null}
      <Text style={{ fontSize: 8, fontWeight: 600, textAlign: "center", lineHeight: 1.25 }}>{title}</Text>
      {sub ? <Text style={{ fontSize: 7, color: MUTED, textAlign: "center", marginTop: 1, lineHeight: 1.25 }}>{sub}</Text> : null}
    </View>
  );
}

/** A group of systems, its name at the top. Dashed for a system outside the delivery's scope. */
export function Group({ x, y, w, h, title, tone, dashed }: { x: number; y: number; w: number; h: number; title: string; tone: Tone; dashed?: boolean }) {
  const tones = useTones();
  return (
    <View style={{ position: "absolute", left: x, top: y, width: w, height: h, backgroundColor: tones[tone].fill, borderWidth: 0.75, borderColor: tones[tone].border, borderStyle: dashed ? "dashed" : "solid", borderRadius: RADIUS }}>
      <Text style={{ fontSize: 7.5, fontWeight: 500, color: MUTED_STRONG, textAlign: "center", marginTop: 5 }}>{title}</Text>
    </View>
  );
}

/** A numbered badge on a line, explained in a table. */
export function Badge({ at, n }: { at: Point; n: number }) {
  return (
    <View style={{ position: "absolute", left: at[0] - 6.5, top: at[1] - 6.5, width: 13, height: 13, borderRadius: 6.5, backgroundColor: ACCENT, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 6.8, fontWeight: 600, color: "#ffffff" }}>{n}</Text>
    </View>
  );
}

/** A person or role, centred on x. */
export function Actor({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <View style={{ position: "absolute", left: x - 34, top: y, width: 68, alignItems: "center" }}>
      <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: RAISED, borderWidth: 0.75, borderColor: BORDER, alignItems: "center", justifyContent: "center" }}>
        <Icon icon={PiUser} size={12} color={MUTED_STRONG} />
      </View>
      <Text style={{ fontSize: 7.5, fontWeight: 500, marginTop: 3, textAlign: "center" }}>{label}</Text>
    </View>
  );
}

/** The key to the two tones, placed top right of a slide (position it absolutely). */
export function Legend({ praisindo = "Sistem Praisindo", client }: { praisindo?: string; client?: string }) {
  const tones = useTones();
  const { client: brand } = useDeck();
  const items: [Tone, string][] = [["praisindo", praisindo], ["client", client ?? "Sistem " + brand.name]];
  return (
    <View style={{ flexDirection: "row", gap: 14 }}>
      {items.map(([tone, label]) => (
        <View key={tone} style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <View style={{ width: 12, height: 8, borderRadius: 2, backgroundColor: tones[tone].fill, borderWidth: 0.75, borderColor: tones[tone].border }} />
          <Text style={d.small}>{label}</Text>
        </View>
      ))}
    </View>
  );
}
