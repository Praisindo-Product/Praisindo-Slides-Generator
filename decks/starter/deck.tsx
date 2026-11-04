import * as React from "react";
import { Text, View } from "@react-pdf/renderer";
import { PiArrowsLeftRight, PiChartPieSlice, PiShieldCheck, PiStack, PiUsers } from "react-icons/pi";
import {
  Card,
  ClosingSlide,
  CoverSlide,
  d,
  defineDeck,
  DefinitionRow,
  FigureStrip,
  IconTile,
  Row,
  Slide,
  SLIDE_GAP,
  StatementNote,
  StatementTable,
  StepNumber,
  Table,
  Tag,
  useDeck,
  type StatementRow,
} from "praisindo-slides";

/**
 * The starter template: one slide of each kind the engine draws, with placeholder copy. Copy this
 * folder to start a deck, then replace the copy and delete the slides you do not need.
 *
 *   npm run build -- decks/starter --pptx --client cimb-niaga
 *
 * The placeholders say what belongs in each place. Replace every one; none should reach a client.
 */

function Cover() {
  const { client } = useDeck();
  return <CoverSlide overline={client.id === "praisindo" ? "Praisindo" : "Praisindo untuk " + client.name} title="Judul presentasi dalam beberapa kata" lead="Satu kalimat yang menyebut apa yang dipresentasikan dan untuk siapa." />;
}

function Summary() {
  const cards = [
    { icon: PiStack, label: "Kondisi saat ini", title: "Masalah dalam satu frasa", text: "Dua kalimat yang menjelaskan kondisi saat ini dan dampaknya." },
    { icon: PiChartPieSlice, label: "Yang dibangun", title: "Solusi dalam satu frasa", text: "Dua kalimat yang menjelaskan apa yang dibangun dan dari data apa." },
    { icon: PiUsers, label: "Pengguna", title: "Siapa yang memakai", text: "Siapa yang memakai, dan di mana mereka memakainya." },
  ];
  return (
    <Slide overline="Ringkasan" title="Judul yang menyatakan inti slide" description="Satu kalimat pendukung. Deskripsi boleh dihapus bila judul sudah cukup.">
      <View style={d.row}>
        {cards.map((card) => (
          <Card key={card.label} style={{ flex: 1, minHeight: 150 }}>
            <IconTile icon={card.icon} />
            <Text style={[d.cardLabel, { marginTop: 12 }]}>{card.label}</Text>
            <Text style={[d.cardTitle, { marginTop: 3 }]}>{card.title}</Text>
            <Text style={[d.cardText, { marginTop: 6 }]}>{card.text}</Text>
          </Card>
        ))}
      </View>
      <View style={{ marginTop: SLIDE_GAP }}>
        <FigureStrip
          figures={[
            { label: "Angka utama", value: "5", note: "Apa yang dihitung" },
            { label: "Angka kedua", value: "T-2", note: "Satuan dan dasarnya" },
            { label: "Angka ketiga", value: "24 bulan", note: "Periode" },
            { label: "Angka keempat", value: "Jan 2025", note: "Sejak kapan" },
          ]}
        />
      </View>
    </Slide>
  );
}

function Process() {
  const steps = ["Langkah pertama", "Langkah kedua", "Langkah ketiga", "Langkah keempat"];
  const width = (864 - SLIDE_GAP * (steps.length - 1)) / steps.length;
  return (
    <Slide overline="Alur proses" title="Dari awal sampai hasil, dalam empat langkah" description="Satu kalimat tentang siapa yang menjalankan proses ini dan seberapa sering.">
      <View style={{ position: "relative" }}>
        <View style={{ position: "absolute", left: 10, right: width - 10, top: 10, height: 0.75, backgroundColor: "#d8e0ec" }} />
        <View style={d.row}>
          {steps.map((step, index) => (
            <View key={step} style={{ width }}>
              <StepNumber value={index + 1} />
              <Text style={[d.cardTitle, { marginTop: 12, fontSize: 12 }]}>{step}</Text>
              <Text style={[d.cardText, { marginTop: 6 }]}>Dua kalimat: siapa melakukan apa, dengan data atau sistem apa.</Text>
            </View>
          ))}
        </View>
      </View>
      <Card raised style={{ marginTop: 40 }}>
        <DefinitionRow first label="Masukan" value="Apa yang masuk ke proses" />
        <DefinitionRow label="Keluaran" value="Apa yang dihasilkan, dan untuk siapa" />
      </Card>
    </Slide>
  );
}

function Comparison() {
  const rows = [
    ["Akses data", "Apa yang perlu disepakati", "Pemilik"],
    ["Jadwal", "Apa yang perlu disepakati", "Pemilik"],
    ["Hak akses", "Apa yang perlu disepakati", "Pemilik"],
  ];
  return (
    <Slide overline="Keputusan" title="Tiga keputusan yang dibutuhkan" description="Tabel untuk daftar yang dibandingkan per baris. Angka rata kanan, teks rata kiri.">
      <Table columns={[{ label: "No", w: 40, align: "center" }, { label: "Keputusan", w: 180 }, { label: "Yang perlu disepakati" }, { label: "Pemilik", w: 140 }]}>
        {rows.map(([title, what, owner], index) => (
          <Row key={title} padding={10} last={index === rows.length - 1} cells={[{ text: String(index + 1), muted: true }, { text: title, strong: true }, what, owner]} />
        ))}
      </Table>
      <View style={{ flexDirection: "row", gap: 6, marginTop: 14 }}>
        <Tag>Tag netral</Tag>
        <Tag color="#10794f" background="#e7f2ed">
          Selesai
        </Tag>
      </View>
    </Slide>
  );
}

const STATEMENT: readonly StatementRow[] = [
  { kind: "group", label: "Kelompok" },
  { kind: "line", label: "Baris", values: ["1,000.00", "900.00"], note: "Catatan singkat" },
  { kind: "line", label: "Baris keluar", values: ["-400.00", "-350.00"] },
  { kind: "total", label: "Subtotal", values: ["600.00", "550.00"] },
  { kind: "band", label: "Total", values: ["600.00", "550.00"] },
];

function Statement() {
  return (
    <Slide overline="Contoh statement" title="Tabel statement dengan pembanding" description="Untuk bagian statement: warna kelompok dan total mengikuti brand klien. IDR, angka ilustrasi.">
      <StatementTable headers={["Description", "31 Oct 2026 (IDR)", "30 Sep 2026 (IDR)", "Notes"]} rows={STATEMENT} />
      <StatementNote>* Catatan kaki statement, bila ada.</StatementNote>
      <View style={[d.row, { marginTop: 18 }]}>
        <Card style={{ flex: 1, flexDirection: "row", gap: 12 }}>
          <IconTile icon={PiShieldCheck} />
          <Text style={[d.cardText, { flex: 1 }]}>Kartu pendek untuk satu hal yang perlu diingat dari tabel di atas.</Text>
        </Card>
        <Card style={{ flex: 1, flexDirection: "row", gap: 12 }}>
          <IconTile icon={PiArrowsLeftRight} />
          <Text style={[d.cardText, { flex: 1 }]}>Kartu kedua, bila perlu. Hapus bila tidak.</Text>
        </Card>
      </View>
    </Slide>
  );
}

function Closing() {
  return <ClosingSlide overline="Judul presentasi" title="Terima kasih" lead="Langkah berikutnya, dalam satu kalimat." />;
}

export default defineDeck({
  meta: { file: "Praisindo-Starter", title: "Judul presentasi", place: "Jakarta", date: "3 November 2026" },
  client: "praisindo",
  // `script` is what the presenter says on each slide, in spoken sentences that add to the slide
  // rather than read it. The build writes it to <file>-script.txt and the PowerPoint speaker notes.
  // Delete the scripts when the deck needs none.
  slides: [
    { kind: "dark", Render: Cover, script: "Pembuka: siapa kami, untuk siapa presentasi ini, dan apa yang ingin diputuskan di akhir sesi." },
    { kind: "content", Render: Summary, script: "Inti slide dengan kata-kata lain dari judulnya, lalu satu bukti yang paling penting, lalu peralihan ke slide berikutnya." },
    { kind: "content", Render: Process, script: "Jelaskan alur langkah demi langkah sambil menunjuk slide. [Petunjuk demo, bila ada]" },
    { kind: "content", Render: Comparison, script: "Sebutkan keputusan yang dibutuhkan dan siapa yang memutuskan. Bila ditanya detail: lihat lampiran." },
    { kind: "content", Render: Statement, script: "Arahkan audiens ke satu angka yang penting di tabel; angka lainnya ada di slide untuk dibaca." },
    { kind: "dark", Render: Closing, script: "Tutup dengan langkah berikutnya dan undang pertanyaan." },
  ],
});
