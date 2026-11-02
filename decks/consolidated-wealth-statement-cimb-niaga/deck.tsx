import * as React from "react";
import { Polyline, Svg, Text, View } from "@react-pdf/renderer";
import type { IconType } from "react-icons";
import {
  PiArrowsLeftRight,
  PiBank,
  PiCalendarCheck,
  PiChartPieSlice,
  PiClockCounterClockwise,
  PiCoins,
  PiCreditCard,
  PiDatabase,
  PiEnvelopeSimple,
  PiFileText,
  PiGauge,
  PiLockSimple,
  PiNotePencil,
  PiShieldCheck,
  PiStack,
  PiUser,
  PiUsers,
} from "react-icons/pi";
import {
  ACCENT,
  Actor,
  Arrow,
  Badge,
  BORDER,
  Card,
  ClosingSlide,
  CoverSlide,
  d,
  DANGER,
  defineDeck,
  DefinitionRow,
  DiagramLayer,
  FOREGROUND,
  Group,
  HAIRLINE,
  Icon,
  IconTile,
  Legend,
  MUTED,
  MUTED_STRONG,
  Node,
  RAISED,
  Row,
  Slide,
  SLIDE_CONTENT_W,
  SLIDE_GAP,
  StatementNote,
  StatementTable,
  StepNumber,
  StoreLabel,
  StoreShape,
  SUBTLE,
  SUCCESS,
  SUCCESS_SUBTLE,
  Table,
  Tag,
  useDark,
  useDeck,
  useTones,
  type Point,
  type StatementRow,
  type Tone,
  type ViewStyle,
} from "praisindo-slides";

/**
 * WORKED EXAMPLE. Consolidated Wealth Statement for CIMB Niaga, as presented on 3 November 2026:
 * what the statement holds, how it is produced each day, the statement's sections with figures,
 * the architecture, the risks and the decisions needed to finish the requirement and design
 * documents. Written in Indonesian for the bank's teams.
 *
 * Read it for the patterns: a cover with a preview of the product's own output, cards and figure
 * strips, a process track, a timeline, statement tables over two slides, an allocation bar with its
 * table, a four-column solution view, a technical diagram with numbered interfaces and the table
 * that explains them, risks as cards, decisions as a table. The finished PDF and PowerPoint file
 * are in references/.
 */

/* ------------------------------------------------------------------ cover and closing */

/** The cover shows the statement itself: the worked example's net worth and allocation, as the product draws them. */
function StatementPreview() {
  const { client } = useDeck();
  const tokens = useDark();
  const colors = [client.palette.primary, client.palette.dark.secondary ?? client.palette.primary, "#3987e5"];
  const allocation = [
    { name: "Banking", value: "1.215,0", share: 54.2 },
    { name: "Wealth", value: "877,5", share: 39.1 },
    { name: "Insurance", value: "150,0", share: 6.7 },
  ].map((item, index) => ({ ...item, color: colors[index] }));
  return (
    <View style={{ position: "absolute", right: 56, top: 112, width: 318 }}>
      {/* The previous month's statement, locked, behind the current one. */}
      <View style={{ position: "absolute", left: 16, right: -12, top: -12, height: 280, borderWidth: HAIRLINE, borderColor: tokens.border, borderRadius: 10, backgroundColor: tokens.background }} />
      <View style={{ backgroundColor: tokens.surface, borderWidth: HAIRLINE, borderColor: tokens.border, borderRadius: 10, paddingVertical: 18, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 10.5, fontWeight: 600, color: tokens.foreground }}>Wealth Position</Text>
          <View style={{ backgroundColor: tokens.raised, borderRadius: 3, paddingHorizontal: 6, paddingTop: 2.5, paddingBottom: 2 }}>
            <Text style={{ fontSize: 8, fontWeight: 500, color: tokens.mutedStrong }}>Posisi 31 Okt 2026</Text>
          </View>
        </View>
        <Text style={{ fontSize: 8.5, color: tokens.muted, marginTop: 16 }}>Net worth</Text>
        <Text style={{ fontSize: 26, fontWeight: 600, letterSpacing: -0.6, color: tokens.foreground, marginTop: 3 }}>Rp 1.627,5 jt</Text>
        <View style={{ flexDirection: "row", gap: 2, marginTop: 14, height: 6 }}>
          {allocation.map((item) => (
            <View key={item.name} style={{ flex: item.share, backgroundColor: item.color, borderRadius: 1.5 }} />
          ))}
        </View>
        <View style={{ marginTop: 12 }}>
          {allocation.map((item) => (
            <View key={item.name} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 6, borderBottomWidth: HAIRLINE, borderBottomColor: tokens.border }}>
              <View style={{ width: 6, height: 6, borderRadius: 1.5, backgroundColor: item.color, marginRight: 8 }} />
              <Text style={{ fontSize: 9.5, color: tokens.foreground, flex: 1 }}>{item.name}</Text>
              <Text style={{ fontSize: 9.5, color: tokens.mutedStrong, width: 70, textAlign: "right" }}>{item.value}</Text>
              <Text style={{ fontSize: 9.5, color: tokens.muted, width: 44, textAlign: "right" }}>{item.share.toFixed(1).replace(".", ",")}%</Text>
            </View>
          ))}
          <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 6 }}>
            <View style={{ width: 6, height: 6, marginRight: 8 }} />
            <Text style={{ fontSize: 9.5, color: tokens.foreground, flex: 1 }}>Liabilitas</Text>
            <Text style={{ fontSize: 9.5, color: tokens.mutedStrong, width: 70, textAlign: "right" }}>(615,0)</Text>
            <View style={{ width: 44 }} />
          </View>
        </View>
        <Text style={{ fontSize: 7.5, color: tokens.muted, marginTop: 8 }}>Rp juta. Ilustrasi nasabah Preferred, angka fiktif.</Text>
      </View>
    </View>
  );
}

function Cover() {
  const { meta, client } = useDeck();
  return <CoverSlide overline={"WMS 2.0 untuk " + client.name} title={meta.title} lead={"Satu laporan untuk seluruh aset, liabilitas, proteksi, dan arus kas nasabah " + client.name + "."} aside={<StatementPreview />} />;
}

function Closing() {
  const { meta, client } = useDeck();
  return <ClosingSlide overline={meta.title} title="Terima kasih" lead={"Langkah berikutnya: menyepakati lima keputusan, lalu menyelesaikan User Requirement, DSR, dan System Design bersama tim " + client.name + "."} />;
}

/* ------------------------------------------------------------------ 2 summary */

function Summary() {
  const cards: { icon: IconType; label: string; title: string; text: string }[] = [
    { icon: PiNotePencil, label: "Kondisi saat ini", title: "Disusun manual oleh RM", text: "RM merangkum kekayaan nasabah dari beberapa sistem. Prosesnya lama dan hasilnya bisa berbeda antar RM." },
    { icon: PiStack, label: "Yang dibangun", title: "Satu statement konsolidasi", text: "Aset, liabilitas, asuransi, dan arus kas nasabah di CIMB Niaga dalam satu statement, disusun Portfolio Service dari data DWH dan WMS." },
    { icon: PiUsers, label: "Pengguna", title: "RM, BM, WM, dan nasabah", text: "RM, BM, dan WM membuka statement di WMS 2.0. Nasabah menerima PDF terproteksi melalui email." },
  ];
  const figures = [
    { value: "5", label: "Kategori produk", note: "Banking, wealth, proteksi, liabilitas, arus kas" },
    { value: "3", label: "Segmen nasabah", note: "Regular, Preferred, Private" },
    { value: "T-2", label: "Posisi data harian", note: "Untuk statement bulan berjalan" },
    { value: "2", label: "Jenis statement", note: "Bulan berjalan dan bulanan" },
    { value: "24 bulan", label: "Riwayat", note: "Snapshot setiap akhir bulan" },
    { value: "Jan 2025", label: "Awal data historis", note: "Data mulai dimuat dari bulan ini" },
  ];
  return (
    <Slide overline="Ringkasan" title="Satu statement untuk seluruh relasi nasabah" description="Consolidated Wealth Statement di WMS 2.0 menggantikan ringkasan kekayaan nasabah yang selama ini disusun manual.">
      <View style={d.row}>
        {cards.map((card) => (
          <Card key={card.label} style={{ flex: 1, minHeight: 160 }}>
            <IconTile icon={card.icon} />
            <Text style={[d.cardLabel, { marginTop: 12 }]}>{card.label}</Text>
            <Text style={[d.cardTitle, { marginTop: 3 }]}>{card.title}</Text>
            <Text style={[d.cardText, { marginTop: 6 }]}>{card.text}</Text>
          </Card>
        ))}
      </View>
      <View style={[d.card, { flexDirection: "row", marginTop: SLIDE_GAP, paddingVertical: 14, gap: 18 }]}>
        {figures.map((figure, index) => (
          <View key={figure.label} style={{ flex: 1, paddingLeft: index === 0 ? 0 : 14, borderLeftWidth: index === 0 ? 0 : HAIRLINE, borderLeftColor: BORDER }}>
            <Text style={d.figureLabel}>{figure.label}</Text>
            <Text style={d.figureValue}>{figure.value}</Text>
            <Text style={d.figureNote}>{figure.note}</Text>
          </View>
        ))}
      </View>
    </Slide>
  );
}

/* ------------------------------------------------------------------ 3 coverage */

function Coverage() {
  const categories: { icon: IconType; name: string; items: string[] }[] = [
    { icon: PiBank, name: "Banking product", items: ["CASA (giro dan tabungan)", "Time deposit", "Structured product"] },
    { icon: PiChartPieSlice, name: "Wealth product", items: ["Reksa dana", "Obligasi"] },
    { icon: PiShieldCheck, name: "Insurance dan protection", items: ["Unit link", "Asuransi tradisional"] },
    { icon: PiCreditCard, name: "Liabilities", items: ["Pinjaman", "Kartu kredit"] },
    { icon: PiArrowsLeftRight, name: "Cash flow", items: ["Transaksi debit", "Transaksi kredit"] },
  ];
  return (
    <Slide overline="Cakupan data" title="Lima kategori produk dalam satu statement" description="Seluruh relasi nasabah di CIMB Niaga, dari rekening sampai transaksi harian.">
      <View style={d.row}>
        {categories.map((category) => (
          <Card key={category.name} style={{ flex: 1, minHeight: 186 }}>
            <IconTile icon={category.icon} />
            <Text style={[d.cardTitle, { marginTop: 12, fontSize: 12 }]}>{category.name}</Text>
            <View style={{ marginTop: 8 }}>
              {category.items.map((item, index) => (
                <Text key={item} style={[d.body, { paddingVertical: 4.5, borderTopWidth: index === 0 ? 0 : HAIRLINE, borderTopColor: BORDER, color: MUTED_STRONG }]}>
                  {item}
                </Text>
              ))}
            </View>
          </Card>
        ))}
      </View>
      <View style={[d.row, { marginTop: SLIDE_GAP }]}>
        <Card style={{ flex: 1, flexDirection: "row", gap: 14 }}>
          <IconTile icon={PiUsers} />
          <View style={{ flex: 1 }}>
            <Text style={d.cardTitle}>Nasabah</Text>
            <Text style={[d.cardText, { marginTop: 4 }]}>Nasabah yang terdaftar di WMS, untuk ketiga segmen.</Text>
            <View style={{ flexDirection: "row", gap: 6, marginTop: 10 }}>
              <Tag>Regular</Tag>
              <Tag>Preferred</Tag>
              <Tag>Private</Tag>
            </View>
          </View>
        </Card>
        <Card style={{ flex: 1, flexDirection: "row", gap: 14 }}>
          <IconTile icon={PiDatabase} />
          <View style={{ flex: 1 }}>
            <Text style={d.cardTitle}>Data</Text>
            <Text style={[d.cardText, { marginTop: 4 }]}>Data historis dimuat mulai Januari 2025. Setelah itu diperbarui setiap hari dari DWH dan WMS, dan seluruhnya disimpan di WMS.</Text>
          </View>
        </Card>
      </View>
    </Slide>
  );
}

/* ------------------------------------------------------------------ 4 process */

function Process() {
  const steps = [
    { title: "Sumber data", text: "DWH bank: CASA, deposito, kredit, kartu kredit, dan transaksi. WMS: nasabah, RM, reksa dana, obligasi, dan bancassurance." },
    { title: "Ekstraksi harian", text: "Batch Service menjalankan ETL setiap hari ke Staging WMS 2.0. Posisi data T-2." },
    { title: "Rekonsiliasi", text: "Data dari tiap sumber dicocokkan. Snapshot akhir bulan disimpan selama 24 bulan." },
    { title: "Konsolidasi", text: "Portfolio Service menghitung posisi, P&L, arus kas, dan performance. Narasi disusun dari aturan yang disepakati." },
    { title: "Statement", text: "Statement bulan berjalan dan statement bulanan. PDF dienkripsi AES-256." },
    { title: "Distribusi", text: "RM, BM, dan WM membuka statement di WMS 2.0 melalui SSO. RM mengirim PDF ke email nasabah saat diperlukan." },
  ];
  const sections = ["Overview", "Wealth Position", "Profit & Loss", "Cash Flow", "Performance", "Narasi"];
  const stepW = (SLIDE_CONTENT_W - SLIDE_GAP * (steps.length - 1)) / steps.length;
  return (
    <Slide overline="Alur proses" title="Dari data sumber sampai statement diterima nasabah" description="Proses yang dijalankan layanan WMS 2.0 setiap hari.">
      <View style={{ position: "relative" }}>
        {/* The track the numbers sit on. */}
        <View style={{ position: "absolute", left: 10, right: stepW - 10, top: 10, height: HAIRLINE, backgroundColor: BORDER }} />
        <View style={d.row}>
          {steps.map((step, index) => (
            <View key={step.title} style={{ width: stepW }}>
              <StepNumber value={index + 1} />
              <Text style={[d.cardTitle, { marginTop: 12, fontSize: 12 }]}>{step.title}</Text>
              <Text style={[d.cardText, { marginTop: 6 }]}>{step.text}</Text>
            </View>
          ))}
        </View>
      </View>
      <Card raised style={{ marginTop: 44, flexDirection: "row", alignItems: "center", gap: 16 }}>
        <View style={{ width: 150 }}>
          <Text style={d.cardTitle}>Isi statement</Text>
          <Text style={[d.small, { marginTop: 2 }]}>Enam bagian, untuk kedua jenis statement</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 8, flex: 1 }}>
          {sections.map((section) => (
            <View key={section} style={{ flex: 1, backgroundColor: "#ffffff", borderWidth: HAIRLINE, borderColor: BORDER, borderRadius: 5, paddingVertical: 8 }}>
              <Text style={[d.body, d.center, { fontWeight: 500 }]}>{section}</Text>
            </View>
          ))}
        </View>
      </Card>
    </Slide>
  );
}

/* ------------------------------------------------------------------ 5 statement types */

function Timeline() {
  const width = SLIDE_CONTENT_W - 32 - 182 - 22;
  const x = (day: number) => ((day - 1) / 29) * width;
  const ticks = [1, 5, 10, 15, 20, 25, 30];
  return (
    <View style={{ flexDirection: "row", gap: 22, marginTop: 12 }}>
      <View style={{ width: 160, backgroundColor: SUBTLE, borderWidth: HAIRLINE, borderColor: BORDER, borderRadius: 6, paddingVertical: 10, paddingHorizontal: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Icon icon={PiLockSimple} size={11} color={MUTED_STRONG} />
          <Text style={[d.body, d.strong]}>Oktober 2026</Text>
        </View>
        <Text style={[d.small, { marginTop: 4 }]}>Statement bulanan dikunci, posisi 31 Oktober</Text>
      </View>
      <View style={{ width, height: 68, position: "relative" }}>
        <Text style={[d.small, { position: "absolute", top: 0, right: width - x(16) + 6, color: ACCENT, fontWeight: 500 }]}>Posisi data T-2, 16 Nov</Text>
        <Text style={[d.small, { position: "absolute", top: 0, left: x(18) + 6, color: FOREGROUND, fontWeight: 500 }]}>Hari ini, 18 Nov</Text>
        <View style={{ position: "absolute", top: 20, left: 0, width, height: 18, backgroundColor: RAISED, borderRadius: 4 }} />
        <View style={{ position: "absolute", top: 20, left: 0, width: x(16), height: 18, backgroundColor: ACCENT, borderTopLeftRadius: 4, borderBottomLeftRadius: 4, justifyContent: "center", paddingLeft: 8 }}>
          <Text style={{ fontSize: 8.5, fontWeight: 500, color: "#ffffff" }}>Statement bulan berjalan, 1–16 Nov</Text>
        </View>
        <View style={{ position: "absolute", top: 12, left: x(16) - 0.5, width: 1, height: 30, backgroundColor: ACCENT }} />
        <View style={{ position: "absolute", top: 12, left: x(18) - 0.5, width: 1, height: 30, backgroundColor: FOREGROUND }} />
        {ticks.map((day) => (
          <Text key={day} style={[d.small, { position: "absolute", top: 46, left: x(day) - 20, width: 40, textAlign: "center" }]}>
            {day} Nov
          </Text>
        ))}
      </View>
    </View>
  );
}

function StatementTypes() {
  const types = [
    { icon: PiClockCounterClockwise, title: "Statement bulan berjalan", sub: "Posisi terkini", rows: [["Pembaruan", "Setiap hari"], ["Posisi data", "T-2, dua hari sebelum tanggal akses"], ["Periode", "Awal bulan sampai tanggal posisi T-2"]] },
    { icon: PiCalendarCheck, title: "Statement bulanan", sub: "Catatan resmi akhir bulan", rows: [["Pembaruan", "Sekali, setelah tutup bulan"], ["Posisi data", "Akhir bulan"], ["Periode", "Awal sampai akhir bulan, lalu dikunci"]] },
  ];
  return (
    <Slide overline="Jenis statement" title="Dua jenis statement dari sumber data yang sama" description="Statement bulan berjalan menunjukkan posisi terkini. Statement bulanan menjadi catatan resmi yang tidak berubah lagi.">
      <View style={d.row}>
        {types.map((type) => (
          <Card key={type.title} style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <IconTile icon={type.icon} />
              <View>
                <Text style={d.cardTitle}>{type.title}</Text>
                <Text style={[d.small, { marginTop: 1 }]}>{type.sub}</Text>
              </View>
            </View>
            {type.rows.map(([label, value], index) => (
              <DefinitionRow key={label} label={label} value={value} first={index === 0} />
            ))}
          </Card>
        ))}
      </View>
      <Card style={{ marginTop: SLIDE_GAP }}>
        <Text style={d.cardTitle}>Contoh: statement dibuka pada 18 November 2026</Text>
        <Timeline />
      </Card>
    </Slide>
  );
}

/* ------------------------------------------------------------------ 6 worked example: position */

function Allocation() {
  // The client's brand colours first, then the platform's series (engine/clients.ts).
  const { inks } = useDeck();
  const items = [
    { name: "Banking", value: "1.215,0", share: 54.2, color: inks.series[0] },
    { name: "Wealth", value: "877,5", share: 39.1, color: inks.series[1] },
    { name: "Insurance", value: "150,0", share: 6.7, color: inks.series[2] },
  ];
  return (
    <Card style={{ marginTop: SLIDE_GAP, flex: 1 }}>
      <Text style={d.cardTitle}>Alokasi aset per kategori</Text>
      <View style={{ flexDirection: "row", gap: 2, height: 10, marginTop: 12 }}>
        {items.map((item) => (
          <View key={item.name} style={{ flex: item.share, backgroundColor: item.color, borderRadius: 2 }} />
        ))}
      </View>
      <View style={{ marginTop: 10 }}>
        <View style={{ flexDirection: "row", paddingVertical: 5, borderBottomWidth: HAIRLINE, borderBottomColor: BORDER }}>
          <Text style={[d.th, { flex: 1 }]}>Kategori</Text>
          <Text style={[d.th, d.right, { width: 80 }]}>Rp juta</Text>
          <Text style={[d.th, d.right, { width: 56 }]}>Porsi</Text>
        </View>
        {items.map((item) => (
          <View key={item.name} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 5.5, borderBottomWidth: HAIRLINE, borderBottomColor: BORDER }}>
            <View style={{ width: 7, height: 7, borderRadius: 1.5, backgroundColor: item.color, marginRight: 8 }} />
            <Text style={[d.cellText, { flex: 1 }]}>{item.name}</Text>
            <Text style={[d.cellText, d.right, { width: 80 }]}>{item.value}</Text>
            <Text style={[d.cellText, d.right, { width: 56 }]}>{item.share.toFixed(1).replace(".", ",")}%</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

function PositionExample() {
  const assets = [
    ["CASA IDR", "Saldo rekening", "250,0"],
    ["CASA USD", "USD 10.000 × 16.500", "165,0"],
    ["Time deposit", "Pokok deposito", "500,0"],
    ["Structured product", "Nilai pasar", "300,0"],
    ["Reksa dana", "200.000 unit × NAB 1.850", "370,0"],
    ["Obligasi", "Nominal 500 jt × harga 101,50%", "507,5"],
    ["Unit link", "Nilai investasi", "150,0"],
  ];
  const liabilities = [
    ["Pinjaman (KPR)", "Outstanding pokok", "(600,0)"],
    ["Kartu kredit", "Tagihan berjalan", "(15,0)"],
  ];
  const tableW = 528;
  return (
    <Slide overline="Contoh statement" title="Wealth Position dan net worth" description="Nasabah Preferred, posisi 31 Oktober 2026. Angka fiktif, kurs USD/IDR 16.500.">
      <View style={d.row}>
        <Table width={tableW} columns={[{ label: "Produk", w: 150 }, { label: "Perhitungan" }, { label: "Rp juta", w: 90, align: "right" }]}>
          <Row group dense cells={[{ text: "Aset", strong: true }, "", ""]} />
          {assets.map((cells) => (
            <Row key={cells[0]} dense cells={[cells[0], { text: cells[1], muted: true }, cells[2]]} />
          ))}
          <Row dense strong cells={["Total aset", "", "2.242,5"]} />
          <Row group dense cells={[{ text: "Liabilitas", strong: true }, "", ""]} />
          {liabilities.map((cells) => (
            <Row key={cells[0]} dense cells={[cells[0], { text: cells[1], muted: true }, cells[2]]} />
          ))}
          <Row dense strong last cells={["Total liabilitas", "", "(615,0)"]} />
        </Table>
        <View style={{ flex: 1 }}>
          <Card raised>
            <Text style={d.figureLabel}>Net worth</Text>
            <Text style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.6, marginTop: 4 }}>Rp 1.627,5 jt</Text>
            <Text style={[d.figureNote, { fontSize: 9.5 }]}>Total aset 2.242,5 dikurangi total liabilitas 615,0</Text>
          </Card>
          <Allocation />
        </View>
      </View>
    </Slide>
  );
}

/* ------------------------------------------------------------------ 7 statement tables: profit and loss, cash flow */

const STATEMENT_HEADERS = ["Description", "31 Oct 2026 (IDR)", "30 Sep 2026 (IDR)", "31 Dec 2025 (IDR)", "Notes"];

const PNL_ROWS: readonly StatementRow[] = [
  { kind: "group", label: "Income" },
  { kind: "line", label: "Bunga Tabungan", values: ["918,881.03", "887,493.54", "490,295.00"], note: "After PPh 20%" },
  { kind: "total", label: "Total Income", values: ["918,881.03", "887,493.54", "490,295.00"] },
  { kind: "group", label: "Expenses" },
  { kind: "total", label: "Total Expenses", values: ["-", "-", "-"] },
  { kind: "band", label: "Net Income", values: ["918,881.03", "887,493.54", "490,295.00"] },
  { kind: "group", label: "Unrealized Gains / Losses (Mark to Market)" },
  { kind: "sub", label: "Mutual Fund", values: ["886,829.77", "1,703,437.73", "-575,052.07"], signed: true },
  { kind: "line", label: "Manulife Dana Campuran", account: "99000000002 11683 Reguler, IDR", values: ["886,829.77", "1,703,437.73", "-575,052.07"], signed: true },
  { kind: "sub", label: "Bonds", values: ["1,741,452.50", "11,458,019.50", "7,707,637.50"], signed: true },
  { kind: "line", label: "FR0073 INDOGB 8.75 15/05/2031", account: "99000000002 11514 Reguler, IDR", values: ["1,000,000.00", "2,000,000.00", "-4,000,000.00"], signed: true },
  { kind: "line", label: "PERGOV 01", account: "99000000002 55218 Reguler, USD", values: ["741,452.50", "9,458,019.50", "11,707,637.50"], signed: true },
  { kind: "total", label: "Total Unrealized Gain / Loss", values: ["2,628,282.27", "13,161,457.23", "7,132,585.43"], signed: true },
  { kind: "band", label: "Total Investment Profit/Loss", values: ["3,547,163.30", "14,048,950.77", "7,622,880.43"] },
];

function ProfitLossExample() {
  return (
    <Slide overline="Contoh statement" title="Profit & Loss" description="Dibandingkan dengan akhir bulan lalu dan akhir tahun lalu. IDR, angka ilustrasi.">
      <StatementTable headers={STATEMENT_HEADERS} rows={PNL_ROWS} labelWidth={344} valueWidth={132} />
      <StatementNote>
        * Unrealized gains/losses represent changes in market value and do not constitute income until realized. PPh (withholding tax) has been deducted from all interest and dividend income at applicable rates.
      </StatementNote>
    </Slide>
  );
}

const NET_OPERATING: StatementRow = { kind: "band", label: "Net Operating Cash Flow", values: ["102,395,822.08", "110,148,398.14", "350,410,114.18"] };

const CASH_OPERATING_ROWS: readonly StatementRow[] = [
  { kind: "group", label: "Operating Activities" },
  { kind: "heading", label: "Inflows" },
  { kind: "line", label: "Bunga Deposito (Netto)", values: ["10,500,000.00", "10,500,000.00", "6,333,333.33"], note: "After PPh 20%" },
  { kind: "line", label: "Bunga Tabungan", values: ["1,364,572.08", "1,343,689.20", "1,076,780.85"], note: "After PPh 20%" },
  { kind: "line", label: "Gaji/Penghasilan", values: ["135,000,000.00", "135,000,000.00", "405,000,000.00"], note: "Net of PPh 21" },
  { kind: "line", label: "Kupon Obligasi", values: ["11,531,250.00", "19,304,708.94", "-"], note: "After PPh 10%" },
  { kind: "total", label: "Total Operating Inflows", values: ["158,395,822.08", "166,148,398.14", "412,410,114.18"] },
  { kind: "heading", label: "Outflows" },
  { kind: "line", label: "Pengeluaran Rutin", values: ["-46,000,000.00", "-46,000,000.00", "-52,000,000.00"], note: "Living expenses" },
  { kind: "line", label: "Premi Asuransi", values: ["-10,000,000.00", "-10,000,000.00", "-10,000,000.00"], note: "2 polis aktif" },
  { kind: "total", label: "Total Operating Outflows", values: ["-56,000,000.00", "-56,000,000.00", "-62,000,000.00"] },
  NET_OPERATING,
];

const CASH_BALANCE_ROWS: readonly StatementRow[] = [
  NET_OPERATING,
  { kind: "group", label: "Investing Activities" },
  { kind: "line", label: "Penempatan Investasi", values: ["-15,000,000.00", "-15,000,000.00", "-15,000,000.00"], note: "One Time" },
  { kind: "band", label: "Net Investing Cash Flow", values: ["-15,000,000.00", "-15,000,000.00", "-15,000,000.00"] },
  { kind: "group", label: "Financing Activities" },
  { kind: "line", label: "Angsuran Pinjaman", values: ["-21,331,377.20", "-21,331,377.20", "-24,460,118.05"], note: "Pembayaran pinjaman yang tidak dapat dibedakan per produk dari kode transaksi" },
  { kind: "line", label: "Pembayaran Pokok Kartu Kredit", values: ["-37,850,000.00", "-41,200,000.00", "-38,200,000.00"], note: "One Time" },
  { kind: "band", label: "Net Financing Cash Flow", values: ["-59,181,377.20", "-62,531,377.20", "-62,660,118.05"] },
  { kind: "total", label: "Net Change in Cash Position", values: ["+28,214,444.88", "+32,617,020.94", "+272,749,996.13"] },
  { kind: "line", label: "Selisih Kurs Kas Valas", values: ["529,003.19", "1,315,416.06", "2,669,564.62"], note: "Revaluasi saldo valas ke kurs akhir periode" },
  { kind: "line", label: "Opening Cash Balance (1 Oct 2026)", values: ["3,486,918,203.32", "3,452,985,766.32", "3,633,701,483.89"] },
  { kind: "band", label: "Closing Cash Balance (31 Oct 2026)", values: ["3,515,661,651.39", "3,486,918,203.32", "3,909,121,044.64"] },
];

function CashFlowOperating() {
  return (
    <Slide overline="Contoh statement" title="Cash Flow: aktivitas operasional" description="Pergerakan kas nasabah dalam periode: operasional, investasi, dan pendanaan. IDR, angka ilustrasi.">
      <StatementTable headers={STATEMENT_HEADERS} rows={CASH_OPERATING_ROWS} labelWidth={250} valueWidth={128} padding={4.6} />
    </Slide>
  );
}

function CashFlowBalance() {
  return (
    <Slide overline="Contoh statement" title="Cash Flow: investasi, pendanaan, dan saldo kas" description="Saldo kas akhir sama dengan Cash & Deposits di Balance Sheet. IDR, angka ilustrasi.">
      <StatementTable headers={STATEMENT_HEADERS} rows={CASH_BALANCE_ROWS} labelWidth={250} valueWidth={128} padding={3.4} />
      <StatementNote>* Cash flows reflect transactions through CIMB Niaga accounts only. Transactions through other banks are not captured. The Closing Cash Balance ties to Cash & Deposits on the Balance Sheet.</StatementNote>
    </Slide>
  );
}

/* ------------------------------------------------------------------ 8 investment income history */

const INCOME_MONTHS = ["Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026", "May 2026", "Jun 2026", "Jul 2026", "Aug 2026", "Sep 2026", "Oct 2026"];
const COUPON = ["-", "-", "-", "-", "39,375,000.00", "-", "-", "-", "-", "-"];
const INTEREST = ["606,285.29", "637,391.58", "668,528.97", "699,697.50", "730,897.20", "801,503.10", "832,804.60", "856,137.40", "887,493.54", "918,881.03"];
const INCOME_TOTAL = ["606,285.29", "637,391.58", "668,528.97", "699,697.50", "40,105,897.20", "801,503.10", "832,804.60", "856,137.40", "887,493.54", "918,881.03"];

function IncomeHistory() {
  const columns = [{ label: "Bulan", w: 96 }, { label: "Kupon Obligasi FR0073", align: "right" as const }, { label: "Xtra Fintech Rekening Dana Lender", align: "right" as const }, { label: "Total", w: 120, align: "right" as const }];
  const products = [
    { name: "Kupon Obligasi FR0073", type: "Coupon", ytd: "39,375,000.00", accumulated: "118,125,000.00" },
    { name: "Xtra Fintech Rekening Dana Lender", type: "Interest", ytd: "7,639,620.21", accumulated: "11,141,301.77" },
  ];
  return (
    <Slide overline="Contoh statement" title="Investment Income History" description="Pendapatan tunai rutin dari kupon, dividen tunai, dan bunga, sejak posisi dibuka. IDR, angka ilustrasi.">
      <View style={d.row}>
        <Table width={560} columns={columns}>
          {INCOME_MONTHS.map((month, index) => (
            <Row key={month} padding={4.2} cells={[month, { text: COUPON[index], muted: COUPON[index] === "-" }, INTEREST[index], { text: INCOME_TOTAL[index], strong: true }]} />
          ))}
          <Row padding={3.4} group last cells={[{ text: "YTD 2026", strong: true }, { text: "39,375,000.00", strong: true }, { text: "7,639,620.21", strong: true }, { text: "47,014,620.21", strong: true }]} />
        </Table>
        <View style={{ flex: 1 }}>
          <Card raised style={{ paddingVertical: 12, flexShrink: 0 }}>
            <Text style={d.figureLabel}>YTD 2026</Text>
            <Text style={[d.figureValue, { fontSize: 17 }]}>IDR 47,014,620.21</Text>
            <Text style={[d.figureLabel, { marginTop: 10 }]}>Akumulasi sejak posisi dibuka</Text>
            <Text style={[d.figureValue, { fontSize: 17 }]}>IDR 129,266,301.77</Text>
          </Card>
          <Card style={{ marginTop: SLIDE_GAP, flexShrink: 0, paddingVertical: 12 }}>
            <Text style={d.cardTitle}>Per produk</Text>
            <View style={{ flexDirection: "row", marginTop: 8, paddingBottom: 4, borderBottomWidth: HAIRLINE, borderBottomColor: BORDER }}>
              <Text style={[d.th, { flex: 1 }]}>Produk</Text>
              <Text style={[d.th, d.right, { width: 70 }]}>YTD 2026</Text>
              <Text style={[d.th, d.right, { width: 76 }]}>Akumulasi</Text>
            </View>
            {products.map((product, index) => (
              <View key={product.name} style={{ flexDirection: "row", paddingVertical: 5, borderBottomWidth: index === products.length - 1 ? 0 : HAIRLINE, borderBottomColor: BORDER }}>
                <View style={{ flex: 1, paddingRight: 6 }}>
                  <Text style={[d.cellText, { fontSize: 8.5 }]}>{product.name}</Text>
                  <Text style={[d.small, { fontSize: 7.5 }]}>{product.type}</Text>
                </View>
                <Text style={[d.cellText, d.right, { width: 70, fontSize: 8.5 }]}>{product.ytd}</Text>
                <Text style={[d.cellText, d.right, { width: 76, fontSize: 8.5 }]}>{product.accumulated}</Text>
              </View>
            ))}
          </Card>
        </View>
      </View>
    </Slide>
  );
}

/* ------------------------------------------------------------------ 9 wealth performance */

const METRICS: readonly { metric: string; value: string; valueColor?: string; target: string; status: string; good: boolean; description: string }[] = [
  { metric: "Net Worth", value: "IDR 6,761,010,001.40", valueColor: SUCCESS, target: "Growing MoM", status: "+0.68%", good: true, description: "Total assets minus total liabilities" },
  { metric: "Portfolio Return", value: "0.05%", valueColor: SUCCESS, target: "> Inflation (0.25%)", status: "Below", good: false, description: "Total return divided by total investment assets at the start of the period" },
  { metric: "Monthly Savings Rate (October 2026)", value: "48.21%", target: "> 30%", status: "Strong", good: true, description: "Net Operating Cash Flow / Total Operating Inflow" },
  { metric: "Debt-to-Asset Ratio", value: "0.00x", target: "< 0.50x", status: "Healthy", good: true, description: "Total Liabilities / Total Assets" },
  { metric: "Cash Runway", value: "21.0 Months", target: "> 6 months", status: "Good", good: true, description: "Closing cash / average monthly operating outflow" },
];

const ALLOCATION_GROUPS = [
  { name: "Cash & Cash Equivalent", covers: "Money Market, CASA and Deposits", actual: 14.06, ideal: 10, difference: "+4.06", color: "#790008" },
  { name: "Fixed Income", covers: "Bonds and Fixed Income Funds", actual: 74.02, ideal: 40, difference: "+34.02", color: "#eb6834" },
  { name: "Growth", covers: "Equity and Balanced Funds, Structured Products", actual: 11.93, ideal: 50, difference: "-38.07", color: "#eda100" },
];

const COLUMN_H = 100;

/** A stacked column, the first group at the bottom, as the statement draws it. */
function StackedColumn({ label, values }: { label: string; values: readonly number[] }) {
  const total = values.reduce((sum, value) => sum + value, 0);
  return (
    <View style={{ alignItems: "center", width: 34 }}>
      <View style={{ width: 28, height: COLUMN_H, flexDirection: "column-reverse", borderRadius: 2, overflow: "hidden" }}>
        {values.map((value, index) => (
          <View key={index} style={{ height: (COLUMN_H * value) / total, backgroundColor: ALLOCATION_GROUPS[index].color }} />
        ))}
      </View>
      <Text style={[d.small, { marginTop: 4 }]}>{label}</Text>
    </View>
  );
}

function WealthPerformance() {
  const percent = (value: number) => value.toFixed(2) + "%";
  return (
    <Slide overline="Contoh statement" title="Wealth Performance" description="Indikator utama bulan Oktober 2026, dan alokasi aset dibandingkan model portofolio nasabah. Angka ilustrasi.">
      <Table columns={[{ label: "Metric", w: 196 }, { label: "Value", w: 130, align: "right" }, { label: "Benchmark / Target", w: 120 }, { label: "Status", w: 74 }, { label: "Description" }]}>
        {METRICS.map((row, index) => (
          <Row
            key={row.metric}
            padding={3.2}
            last={index === METRICS.length - 1}
            cells={[
              row.metric,
              <Text key="value" style={[d.cellText, d.right, d.strong, row.valueColor ? { color: row.valueColor } : {}]}>
                {row.value}
              </Text>,
              row.target,
              <Tag key="status" color={row.good ? SUCCESS : DANGER} background={row.good ? SUCCESS_SUBTLE : "#f8e6e6"}>
                {row.status}
              </Tag>,
              { text: row.description, muted: true },
            ]}
          />
        ))}
      </Table>
      <Card style={{ marginTop: 12, paddingVertical: 11 }}>
        <Text style={d.cardTitle}>Asset Group Allocation vs Aggressive Risk Portfolio Model</Text>
        <View style={{ flexDirection: "row", gap: 20, marginTop: 8 }}>
          <View style={{ flexDirection: "row", gap: 10, paddingTop: 4 }}>
            <StackedColumn label="Actual" values={ALLOCATION_GROUPS.map((group) => group.actual)} />
            <StackedColumn label="Model" values={ALLOCATION_GROUPS.map((group) => group.ideal)} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", paddingBottom: 4, borderBottomWidth: HAIRLINE, borderBottomColor: BORDER }}>
              <Text style={[d.th, { flex: 1 }]}>Asset Group</Text>
              <Text style={[d.th, d.right, { width: 80 }]}>Actual</Text>
              <Text style={[d.th, d.right, { width: 80 }]}>Ideal</Text>
              <Text style={[d.th, d.right, { width: 100 }]}>Difference (pp)</Text>
            </View>
            {ALLOCATION_GROUPS.map((group) => (
              <View key={group.name} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 3.5, borderBottomWidth: HAIRLINE, borderBottomColor: BORDER }}>
                <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: group.color, marginRight: 9 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[d.cellText, d.strong]}>{group.name}</Text>
                  <Text style={[d.small, { fontSize: 8 }]}>{group.covers}</Text>
                </View>
                <Text style={[d.cellText, d.right, d.strong, { width: 80 }]}>{percent(group.actual)}</Text>
                <Text style={[d.cellText, d.right, d.muted, { width: 80 }]}>{percent(group.ideal)}</Text>
                <Text style={[d.cellText, d.right, { width: 100 }]}>{group.difference}</Text>
              </View>
            ))}
            <View style={{ flexDirection: "row", paddingVertical: 4 }}>
              <Text style={[d.cellText, d.strong, { flex: 1, paddingLeft: 16 }]}>Total</Text>
              <Text style={[d.cellText, d.right, d.strong, { width: 80 }]}>100.00%</Text>
              <Text style={[d.cellText, d.right, d.muted, { width: 80 }]}>100.00%</Text>
              <View style={{ width: 100 }} />
            </View>
          </View>
        </View>
      </Card>
    </Slide>
  );
}

/* ------------------------------------------------------------------ 8 solution architecture */

function SystemCard({ icon, title, text, tone, style }: { icon?: IconType; title: string; text?: string; tone: Tone; style?: ViewStyle }) {
  const tones = useTones();
  return (
    <View style={[{ backgroundColor: tones[tone].fill, borderWidth: HAIRLINE, borderColor: tones[tone].border, borderRadius: 6, paddingVertical: 9, paddingHorizontal: 10 }, style ?? {}]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        {icon ? <Icon icon={icon} size={12} color={FOREGROUND} /> : null}
        <Text style={[d.body, d.strong]}>{title}</Text>
      </View>
      {text ? <Text style={[d.small, { marginTop: 3, color: MUTED_STRONG }]}>{text}</Text> : null}
    </View>
  );
}

function ColumnHead({ label }: { label: string }) {
  return <Text style={[d.cardLabel, { marginBottom: 8 }]}>{label}</Text>;
}

function Chevron() {
  return (
    <View style={{ width: 14, alignItems: "center", paddingTop: 70 }}>
      <Svg width={8} height={12} viewBox="0 0 8 12">
        <Polyline points="1,1 6,6 1,11" stroke={MUTED} strokeWidth={1.2} fill="none" />
      </Svg>
    </View>
  );
}

function SolutionArchitecture() {
  const tones = useTones();
  return (
    <Slide overline="Arsitektur solusi" title="Data CIMB Niaga diolah setiap hari sampai ke pengguna" description="Empat tahap, dari sistem sumber bank sampai statement di tangan RM dan nasabah.">
      <View style={{ position: "absolute", right: 48, top: 92 }}>
        <Legend />
      </View>
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: 168 }}>
          <ColumnHead label="Sumber data" />
          <SystemCard tone="client" icon={PiDatabase} title="DWH bank" text="CASA, deposito, kredit, kartu kredit, transaksi harian" />
          <SystemCard tone="client" icon={PiDatabase} title="Data WMS" text="Nasabah, RM, reksa dana, obligasi, bancassurance" style={{ marginTop: 8 }} />
        </View>
        <Chevron />
        <View style={{ width: 196 }}>
          <ColumnHead label="Pengolahan harian" />
          <View style={{ backgroundColor: tones.praisindo.fill, borderWidth: HAIRLINE, borderColor: tones.praisindo.border, borderRadius: 6, paddingVertical: 9, paddingHorizontal: 10 }}>
            <Text style={[d.body, d.strong]}>Batch Service</Text>
            {["Ekstrak DWH sekali sehari, lalu rekonsiliasi", "Transaksi ke Financial Monitoring, posisi produk ke Portfolio", "Snapshot akhir bulan, riwayat 24 bulan, dan retensi"].map((item) => (
              <View key={item} style={{ flexDirection: "row", gap: 6, marginTop: 5 }}>
                <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: MUTED, marginTop: 5 }} />
                <Text style={[d.small, { flex: 1, color: MUTED_STRONG }]}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
        <Chevron />
        <View style={{ flex: 1 }}>
          <ColumnHead label="Layanan statement" />
          <View style={{ backgroundColor: tones.praisindo.fill, borderWidth: HAIRLINE, borderColor: tones.praisindo.border, borderRadius: 6, padding: 10 }}>
            <Text style={[d.body, d.strong]}>Portfolio Service</Text>
            <Text style={[d.small, { marginTop: 2, color: MUTED_STRONG }]}>Menyusun statement: Overview, Wealth Position, P&L, Cash Flow, Performance</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
              {[
                ["Financial Monitoring", "P&L, arus kas, liabilitas, KPI"],
                ["Narrative Generator", "Narasi dari aturan yang disepakati"],
                ["Document Generator", "PDF terproteksi"],
                ["Notification Service", "Email ke nasabah dan RM"],
              ].map(([title, text]) => (
                <View key={title} style={{ width: "48.6%", backgroundColor: "#ffffff", borderWidth: HAIRLINE, borderColor: tones.praisindo.border, borderRadius: 5, paddingVertical: 6, paddingHorizontal: 8 }}>
                  <Text style={[d.cellText, d.strong]}>{title}</Text>
                  <Text style={[d.small, { marginTop: 1 }]}>{text}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <Chevron />
        <View style={{ width: 150 }}>
          <ColumnHead label="Pengguna" />
          <SystemCard tone="praisindo" icon={PiUsers} title="RM, BM, WM" text="Di WMS 2.0 melalui SSO: lihat, unduh PDF, kirim email" />
          <SystemCard tone="praisindo" icon={PiUser} title="Nasabah" text="PDF melalui email, dibuka dengan tanggal lahir" style={{ marginTop: 8 }} />
        </View>
      </View>
      <Card style={{ marginTop: 18, paddingVertical: 6 }}>
        <DefinitionRow first label="Master data" value="Customer (nasabah, RM), PMS Datamaster (PAA, inflasi), WMS Datamaster (kurs), CMS (disclaimer)" />
        <DefinitionRow label="Keamanan" value="SSO dan cakupan nasabah per RM dan cabang, Statement Buddy (delegasi), PDF AES-256, maker-checker, audit dan error monitoring" />
      </Card>
    </Slide>
  );
}

/* ------------------------------------------------------------------ 9 technical architecture */

const DW = SLIDE_CONTENT_W;
const DH = 318;
const STORE_H = 50;

interface Store {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly label: string;
  readonly tone: Tone;
}

function TechnicalDiagram() {
  const services = ["Portfolio Service", "Financial Monitoring Service", "Narrative Generator Service", "Doc Generator Service"];
  const mainDb = ["Portfolio DB", "Financial DB", "Narrative DB", "DocGen DB"];
  const stores: Store[] = [
    ...mainDb.map((label, i) => ({ x: 450 + i * 56, y: 142, w: 48, label, tone: "praisindo" as const })),
    ...["Porto banking product", "Debit dan credit transaction", "Reference"].map((label, i) => ({ x: 456 + i * 72, y: 260, w: 58, label, tone: "praisindo" as const })),
    ...["Porto banking product", "Debit dan credit transaction", "Reference"].map((label, i) => ({ x: 714 + i * 50, y: 260, w: 44, label, tone: "client" as const })),
  ];
  // Lines are orthogonal, laid in lanes so none cross. Badges number the interfaces in the next slide's table.
  const arrows: { points: Point[]; badge?: Point; n?: number }[] = [
    { points: [[54, 28], [96, 28]], badge: [76, 28], n: 1 },
    { points: [[34, 132], [34, 98], [148, 98], [148, 66]], badge: [76, 98], n: 2 },
    { points: [[200, 30], [224, 30]] },
    { points: [[274, 30], [298, 30]], badge: [286, 30], n: 4 },
    { points: [[298, 50], [274, 50]] },
    { points: [[224, 50], [200, 50]], badge: [212, 50], n: 5 },
    { points: [[704, 42], [672, 42]], badge: [688, 42], n: 6 },
    { points: [[340, 84], [340, 136]], badge: [340, 110], n: 7 },
    { points: [[420, 84], [420, 234], [402, 234]], badge: [420, 190], n: 8 },
    { points: [[556, 84], [556, 120]], badge: [556, 102], n: 9 },
    { points: [[360, 214], [360, 176]], badge: [360, 195], n: 10 },
    { points: [[298, 156], [240, 156]], badge: [269, 156], n: 11 },
    { points: [[150, 150], [52, 150]], badge: [100, 150], n: 12 },
    { points: [[195, 176], [195, 282], [52, 282]], badge: [195, 230], n: 13 },
    { points: [[784, 136], [784, 108], [640, 108], [640, 84]], badge: [712, 108], n: 14 },
    { points: [[556, 238], [556, 212]], badge: [556, 225], n: 15 },
    { points: [[704, 282], [672, 282]] },
  ];
  return (
    <View style={{ position: "relative", width: DW, height: DH }}>
      <Group x={298} y={0} w={374} h={84} title="PMS Service, WMS 2.0" tone="praisindo" />
      <Group x={704} y={0} w={160} h={84} title="WMS 2.0 (Data Master dan OMS)" tone="praisindo" />
      <Group x={440} y={120} w={232} h={92} title="Main DB PMS, WMS 2.0" tone="praisindo" />
      <Group x={440} y={238} w={232} h={80} title="Staging WMS 2.0" tone="praisindo" />
      <Group x={704} y={238} w={160} h={80} title="DWH CIMB Niaga" tone="client" dashed />

      <DiagramLayer width={DW} height={DH}>
        {stores.map((store) => (
          <StoreShape key={store.x + store.label} x={store.x} y={store.y} w={store.w} h={STORE_H} tone={store.tone} />
        ))}
        {arrows.map((arrow, index) => (
          <Arrow key={index} points={arrow.points} />
        ))}
      </DiagramLayer>
      {stores.map((store) => (
        <StoreLabel key={"label" + store.x + store.label} x={store.x} y={store.y} w={store.w} h={STORE_H} label={store.label} />
      ))}

      <Actor x={34} y={6} label="Operation / WM" />
      <Actor x={34} y={134} label="RM / BM / WM" />
      <Actor x={34} y={266} label="Nasabah" />

      <Node x={96} y={14} w={104} h={52} title="UI WMS 2.0" sub="Consolidated Wealth Statement" tone="praisindo" />
      <Node x={224} y={14} w={50} h={52} title="Traefik" sub="Casdoor SSO" tone="praisindo" />
      {services.map((title, i) => (
        <Node key={title} x={308 + i * 90} y={26} w={82} h={46} title={title} tone="praisindo" />
      ))}
      <Node x={712} y={24} w={144} h={24} title="Customer, RM dan Data Master" tone="praisindo" />
      <Node x={712} y={52} w={144} h={26} title="Order dan Outstanding" sub="Reksa dana, obligasi, bancassurance" tone="praisindo" />
      <Node x={150} y={136} w={90} h={40} title="Email" icon={PiEnvelopeSimple} tone="client" />
      <Node x={298} y={136} w={104} h={40} title="Notification Service" tone="praisindo" />
      <Node x={298} y={214} w={104} h={40} title="Document Store" sub="Object storage (PDF)" tone="praisindo" icon={PiFileText} />
      <Node x={724} y={136} w={120} h={40} title="Batch Service" sub="Scheduler" tone="praisindo" />

      {arrows.map((arrow, index) => (arrow.badge && arrow.n ? <Badge key={index} at={arrow.badge} n={arrow.n} /> : null))}
      {/* RmCs01 and RmCs02 share one path. */}
      <Badge at={[92, 98]} n={3} />
    </View>
  );
}

function TechnicalArchitecture() {
  return (
    <Slide overline="Arsitektur teknis" title="Komponen dan antarmuka" description="Nomor pada panah merujuk ke daftar antarmuka di halaman berikutnya.">
      <View style={{ position: "absolute", right: 48, top: 92 }}>
        <Legend />
      </View>
      <TechnicalDiagram />
    </Slide>
  );
}

/* ------------------------------------------------------------------ 10 interfaces */

const INTERFACES: readonly [string, string, string, string][] = [
  ["WmUi01", "Operation / WM", "UI WMS 2.0", "Setup data master dan reference data"],
  ["RmCs01", "RM / BM / WM", "UI WMS 2.0", "Melihat consolidated statement di layar"],
  ["RmCs02", "RM / BM / WM", "UI WMS 2.0", "Memicu pengiriman consolidated statement lewat email"],
  ["UiAp01", "UI WMS 2.0", "PMS Service, melalui Traefik dan Casdoor SSO", "Insert dan update data master"],
  ["ApUi01", "PMS Service", "UI WMS 2.0", "Data consolidated statement (JSON)"],
  ["WmAp01", "WMS 2.0", "PMS Service", "Membaca data customer, RM, dan portofolio WMS"],
  ["ApNt01", "PMS Service", "Notification Service", "Instruksi mengirim notifikasi"],
  ["ApDc01", "PMS Service", "Document Store", "Membuat dan menyimpan PDF consolidated statement"],
  ["ApDb01", "PMS Service", "Main DB PMS", "Membaca dan menulis data"],
  ["DcNt01", "Document Store", "Notification Service", "Melampirkan PDF"],
  ["NtEm01", "Notification Service", "Email", "Mengirim consolidated statement"],
  ["RmEm01", "Email", "RM / BM / WM", "Membuka PDF consolidated statement"],
  ["CsEm01", "Email", "Nasabah", "Membuka PDF consolidated statement, terproteksi kata sandi"],
  ["BtAp01", "Batch Service", "PMS Service", "Memicu job harian"],
  ["StAp01", "Staging WMS 2.0", "Main DB PMS", "ETL porto bank dan cash flow, posisi T-2"],
];

function Interfaces() {
  return (
    <Slide overline="Arsitektur teknis" title="Daftar antarmuka" description="Data DWH CIMB Niaga diekstrak ke Staging WMS 2.0 sekali sehari oleh Batch Service.">
      <Table columns={[{ label: "No", w: 34, align: "center" }, { label: "Kode", w: 70 }, { label: "Dari", w: 150 }, { label: "Ke", w: 230 }, { label: "Isi" }]}>
        {INTERFACES.map(([code, from, to, what], index) => (
          <Row key={code} padding={2.6} last={index === INTERFACES.length - 1} cells={[{ text: String(index + 1), muted: true }, { text: code, strong: true }, from, to, what]} />
        ))}
      </Table>
    </Slide>
  );
}

/* ------------------------------------------------------------------ 11 risks */

function Risks() {
  const risks: { icon: IconType; title: string; cause: string; handling: string }[] = [
    { icon: PiCoins, title: "Biaya dan infrastruktur", cause: "Volume data harian besar, dan kebutuhan penyimpanan PDF belum final.", handling: "Keputusan retensi dan kapasitas. PDF disimpan di object storage." },
    { icon: PiStack, title: "Akurasi data", cause: "Rekonsiliasi antar sumber data, dan selisih pembulatan dalam perhitungan.", handling: "Rekonsiliasi di batch harian. Parameter kurs dan kategori transaksi." },
    { icon: PiGauge, title: "Performa dan keamanan", cause: "Waktu pembuatan PDF per permintaan, dan keamanan email ke nasabah.", handling: "PDF AES-256 dibuka dengan tanggal lahir. SSO, audit, dan error monitoring." },
  ];
  return (
    <Slide overline="Risiko" title="Tiga risiko utama dan penanganannya" description="Tiap risiko sudah punya penanganan di desain. Sisanya bergantung pada keputusan di halaman berikutnya.">
      <View style={d.row}>
        {risks.map((risk) => (
          <Card key={risk.title} style={{ flex: 1, minHeight: 236 }}>
            <IconTile icon={risk.icon} />
            <Text style={[d.cardTitle, { marginTop: 12 }]}>{risk.title}</Text>
            <Text style={[d.cardLabel, { marginTop: 14 }]}>Penyebab</Text>
            <Text style={[d.cardText, { marginTop: 3 }]}>{risk.cause}</Text>
            <View style={{ marginTop: 14, paddingTop: 12, borderTopWidth: HAIRLINE, borderTopColor: BORDER }}>
              <Text style={d.cardLabel}>Penanganan di desain</Text>
              <Text style={[d.cardText, { marginTop: 3, color: FOREGROUND }]}>{risk.handling}</Text>
            </View>
          </Card>
        ))}
      </View>
    </Slide>
  );
}

/* ------------------------------------------------------------------ 12 decisions and next steps */

function Decisions() {
  const decisions = [
    ["Akses data DWH", "Tabel, histori 24 bulan, dan akses baca harian"],
    ["Jadwal data", "Jam data siap, batas laporan pagi, dan penanggung jawab"],
    ["Hak akses", "Peran SSO, cabang, RM pemilik, dan delegasi"],
    ["Parameter bisnis", "Kurs, kategori transaksi, alokasi ideal, narasi, dan template"],
    ["Operasional", "Retensi, kapasitas, pemantauan, dan eskalasi"],
  ];
  const steps = [
    { title: "Dokumen perencanaan", text: "Menyusun User Requirement (UR), DSR, dan System Design (SD)." },
    { title: "Integration assessment dan analysis", text: "Memvalidasi akses dan struktur data DWH dan WMS." },
  ];
  return (
    <Slide overline="Keputusan dan langkah berikutnya" title="Lima keputusan untuk menyelesaikan UR dan DSR" description="Kelima keputusan ini menjadi dasar dokumen System Design.">
      <View style={d.row}>
        <Table width={540} columns={[{ label: "No", w: 34, align: "center" }, { label: "Keputusan", w: 140 }, { label: "Yang perlu disepakati" }]}>
          {decisions.map(([title, what], index) => (
            <Row key={title} padding={13} last={index === decisions.length - 1} cells={[{ text: String(index + 1), muted: true }, { text: title, strong: true }, what]} />
          ))}
        </Table>
        <Card style={{ flex: 1 }}>
          <Text style={d.cardTitle}>Langkah berikutnya</Text>
          {steps.map((step, index) => (
            <View key={step.title} style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
              <StepNumber value={index + 1} />
              <View style={{ flex: 1 }}>
                <Text style={[d.body, d.strong]}>{step.title}</Text>
                <Text style={[d.cardText, { marginTop: 2 }]}>{step.text}</Text>
              </View>
            </View>
          ))}
          <View style={{ marginTop: 16, paddingTop: 12, borderTopWidth: HAIRLINE, borderTopColor: BORDER, flexDirection: "row", gap: 10, alignItems: "center" }}>
            <IconTile icon={PiFileText} size={22} />
            <View>
              <Text style={d.cardLabel}>Hasil</Text>
              <Text style={[d.body, d.strong]}>Dokumen System Design final</Text>
            </View>
          </View>
        </Card>
      </View>
    </Slide>
  );
}

/* ------------------------------------------------------------------ deck */

export default defineDeck({
  meta: {
    file: "Consolidated-Wealth-Statement-CIMB-Niaga",
    title: "Consolidated Wealth Statement",
    place: "Jakarta",
    date: "3 November 2026",
    classification: "Rahasia",
  },
  client: "cimb-niaga",
  slides: [
    { kind: "dark", Render: Cover },
    { kind: "content", Render: Summary },
    { kind: "content", Render: Coverage },
    { kind: "content", Render: Process },
    { kind: "content", Render: StatementTypes },
    { kind: "content", Render: PositionExample },
    { kind: "content", Render: ProfitLossExample },
    { kind: "content", Render: IncomeHistory },
    { kind: "content", Render: CashFlowOperating },
    { kind: "content", Render: CashFlowBalance },
    { kind: "content", Render: WealthPerformance },
    { kind: "content", Render: SolutionArchitecture },
    { kind: "content", Render: TechnicalArchitecture },
    { kind: "content", Render: Interfaces },
    { kind: "content", Render: Risks },
    { kind: "content", Render: Decisions },
    { kind: "dark", Render: Closing },
  ],
});
