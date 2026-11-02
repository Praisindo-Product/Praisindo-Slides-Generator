import * as React from "react";
import { Text, View } from "@react-pdf/renderer";
import { PiCaretDown } from "react-icons/pi";
import { Icon } from "./icons";
import { useDeck } from "./slide";
import { BORDER, d, DANGER, FOREGROUND, HAIRLINE, MUTED, RADIUS, RAISED, SLIDE_CONTENT_W, SUBTLE, SUCCESS } from "./theme";

/**
 * A statement's comparative table as the WMS-IMS client statement prints it, in the client's brand:
 * tinted group rows, brand-coloured totals bands, losses in red and signed gains in green. Use it for
 * Profit & Loss, Cash Flow and any section shown against earlier periods.
 *
 * A long statement section goes over two slides (for example operating activities, then investing,
 * financing and the closing balance); carry the band that links them to the top of the second.
 */

export type StatementRow =
  | { readonly kind: "group"; readonly label: string }
  | { readonly kind: "heading"; readonly label: string }
  | {
      readonly kind: "line" | "total" | "band" | "sub";
      readonly label: string;
      /** A reference printed small after the label, such as an account number. */
      readonly account?: string;
      readonly values: readonly string[];
      readonly note?: string;
      /** Colour positive values green as well as negative ones red, as unrealized results are shown. */
      readonly signed?: boolean;
    };

export function StatementTable({
  headers,
  rows,
  labelWidth = 300,
  valueWidth = 130,
  padding = 3.4,
}: {
  /** The description column, one per value column, then the notes column. */
  headers: readonly string[];
  rows: readonly StatementRow[];
  labelWidth?: number;
  valueWidth?: number;
  padding?: number;
}) {
  const { inks } = useDeck();
  const valueCount = headers.length - 2;
  const note = SLIDE_CONTENT_W - labelWidth - valueWidth * valueCount;
  const cell = { paddingVertical: padding } as const;
  const text = { fontSize: 9 } as const;
  const valueColor = (value: string, signed?: boolean) => (value === "-" ? FOREGROUND : value.startsWith("-") ? DANGER : value.startsWith("+") || signed ? SUCCESS : FOREGROUND);
  return (
    <View style={{ borderWidth: HAIRLINE, borderColor: BORDER, borderRadius: RADIUS, overflow: "hidden" }}>
      <View style={{ flexDirection: "row", backgroundColor: RAISED, borderBottomWidth: HAIRLINE, borderBottomColor: BORDER }}>
        {headers.map((label, index) => (
          <Text
            key={label + index}
            style={[d.th, d.cell, cell, { width: index === 0 ? labelWidth : index === headers.length - 1 ? note : valueWidth, fontWeight: 600, color: FOREGROUND }, index > 0 && index < headers.length - 1 ? d.right : {}]}
          >
            {label}
          </Text>
        ))}
      </View>
      {rows.map((row, index) => {
        const rule = index === rows.length - 1 ? {} : { borderBottomWidth: HAIRLINE, borderBottomColor: BORDER };
        if (row.kind === "group" || row.kind === "heading") {
          const group = row.kind === "group";
          return (
            <View key={index} style={[{ backgroundColor: group ? inks.tint : "#ffffff" }, d.cell, cell, rule]}>
              <Text style={[d.cellText, text, d.strong, group ? { color: inks.ink } : {}]}>{row.label}</Text>
            </View>
          );
        }
        const band = row.kind === "band";
        const bold = band || row.kind === "total";
        const background = band ? inks.ink : row.kind === "total" ? SUBTLE : "#ffffff";
        return (
          <View key={index} style={[{ flexDirection: "row", alignItems: "center", backgroundColor: background }, rule]}>
            <View style={[d.cell, cell, { width: labelWidth, flexDirection: "row", alignItems: row.kind === "sub" ? "center" : "baseline", gap: 8, paddingLeft: row.kind === "sub" ? 14 : 10 }]}>
              {row.kind === "sub" ? <Icon icon={PiCaretDown} size={8} color={inks.ink} /> : null}
              <Text style={[d.cellText, text, bold ? d.strong : {}, band ? { color: "#ffffff" } : {}]}>{row.label}</Text>
              {row.account ? <Text style={[d.small, { fontSize: 7.5 }]}>{row.account}</Text> : null}
            </View>
            {row.values.map((value, column) => (
              <Text key={column} style={[d.cellText, text, d.cell, cell, d.right, { width: valueWidth }, bold ? d.strong : {}, { color: band ? "#ffffff" : valueColor(value, row.signed) }]}>
                {value}
              </Text>
            ))}
            <Text style={[d.small, d.cell, cell, { width: note, fontSize: 8, color: band ? "#ffffff" : MUTED }]}>{row.note ?? ""}</Text>
          </View>
        );
      })}
    </View>
  );
}

/** A footnote under a statement table, as the statement prints it. */
export function StatementNote({ children }: { children: string }) {
  return <Text style={[d.small, { marginTop: 8, fontSize: 8 }]}>{children}</Text>;
}

/**
 * A composition: a segmented bar and the table that names it, as the design system asks (an
 * allocation bar is always paired with category, value and share). Colours default to the client's
 * series.
 */
export function AllocationBar({ items, valueLabel, shareLabel = "Porsi", categoryLabel = "Kategori" }: { items: readonly { name: string; value: string; share: number; color?: string }[]; valueLabel: string; shareLabel?: string; categoryLabel?: string }) {
  const { inks } = useDeck();
  const colored = items.map((item, index) => ({ ...item, color: item.color ?? inks.series[index % inks.series.length] }));
  return (
    <View>
      <View style={{ flexDirection: "row", gap: 2, height: 10 }}>
        {colored.map((item) => (
          <View key={item.name} style={{ flex: item.share, backgroundColor: item.color, borderRadius: 2 }} />
        ))}
      </View>
      <View style={{ marginTop: 10 }}>
        <View style={{ flexDirection: "row", paddingVertical: 5, borderBottomWidth: HAIRLINE, borderBottomColor: BORDER }}>
          <Text style={[d.th, { flex: 1 }]}>{categoryLabel}</Text>
          <Text style={[d.th, d.right, { width: 80 }]}>{valueLabel}</Text>
          <Text style={[d.th, d.right, { width: 56 }]}>{shareLabel}</Text>
        </View>
        {colored.map((item) => (
          <View key={item.name} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 5.5, borderBottomWidth: HAIRLINE, borderBottomColor: BORDER }}>
            <View style={{ width: 7, height: 7, borderRadius: 1.5, backgroundColor: item.color, marginRight: 8 }} />
            <Text style={[d.cellText, { flex: 1 }]}>{item.name}</Text>
            <Text style={[d.cellText, d.right, { width: 80 }]}>{item.value}</Text>
            <Text style={[d.cellText, d.right, { width: 56 }]}>{item.share.toFixed(1).replace(".", ",")}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

