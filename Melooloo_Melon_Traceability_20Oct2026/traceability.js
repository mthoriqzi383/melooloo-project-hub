const stages = [
  {
    index: "01 / 07 · ASAL BENIH",
    title: "Cerita dimulai dari benih.",
    description: "Varietas dan lot benih adalah titik awal. Hanya identitas yang cocok dengan catatan tanam yang tampil di halaman buah.",
    public: "Varietas yang sesuai dengan lot",
    record: "Lot benih, pemasok, bukti terima",
    rule: "Tidak menyebut asal benih sebagai fakta jika belum dicocokkan dengan batch tanam.",
    previewName: "Asal benih",
    previewValue: "[varietas & lot benih]",
  },
  {
    index: "02 / 07 · SEMAI DAN TANAM",
    title: "Dari tray ke rumah tanam.",
    description: "Batch semai harus terhubung ke greenhouse dan zona penanaman sebelum perjalanan buah bisa ditelusuri mundur.",
    public: "Tanggal semai dan awal tanam",
    record: "ID batch, tray, tanggal, GH dan zona",
    rule: "Hindari tanggal perkiraan yang tidak tercatat sebagai tanggal kegiatan.",
    previewName: "Semai & tanam",
    previewValue: "[tanggal semai / tanam]",
  },
  {
    index: "03 / 07 · TUMBUH TERPANTAU",
    title: "Tumbuh dengan catatan.",
    description: "Aktivitas perawatan dan data sensor dapat menjelaskan lingkungan tanam, tetapi ringkasannya harus berasal dari GH dan periode lot yang tepat.",
    public: "Praktik budidaya dan ringkasan terpilih",
    record: "Log agronomi, ID GH, kualitas data sensor",
    rule: "Jangan membuat grafik suhu, pH, EC, atau kelembapan dari angka ilustrasi.",
    previewName: "Tumbuh di greenhouse",
    previewValue: "[ringkasan yang diverifikasi]",
  },
  {
    index: "04 / 07 · PANEN",
    title: "Saat buah dipanen.",
    description: "Panen membentuk lot yang dapat ditelusuri. Tanggal dan lokasi panen harus sama dengan label serta catatan produksi.",
    public: "Tanggal panen dan kebun asal",
    record: "ID lot panen, waktu, GH/zona, kuantitas",
    rule: "Klaim “dipanen hari ini” hanya muncul bila waktu panen dan kanalnya mendukung.",
    previewName: "Panen",
    previewValue: "[tanggal & jam panen]",
  },
  {
    index: "05 / 07 · SELEKSI MUTU",
    title: "Mutu yang punya dasar.",
    description: "Grade, berat, dan kemanisan ditampilkan sesuai cakupan pemeriksaan. Hasil sampel lot tidak boleh terlihat sebagai hasil per buah.",
    public: "Grade; berat; Brix bila ada hasil sah",
    record: "Lembar QC, metode, sampel/per buah, rilis",
    rule: "Tuliskan “sampel lot” atau “per buah” secara eksplisit di samping Brix.",
    previewName: "Pemeriksaan mutu",
    previewValue: "[hasil QC & cakupan uji]",
  },
  {
    index: "06 / 07 · PENGEMASAN",
    title: "Identitas tidak terputus.",
    description: "Kode pada buah dan kemasan harus menunjuk ke lot yang benar. Bila hasil panen dipilah atau dikemas ulang, hubungan input dan output disimpan.",
    public: "Tanggal kemas dan kecocokan kode",
    record: "Lot input-output, hasil scan label, petugas",
    rule: "Jangan menerbitkan QR yang menuju lot lain atau halaman generik produk.",
    previewName: "Dikemas",
    previewValue: "[tanggal & kode kemas]",
  },
  {
    index: "07 / 07 · PERJALANAN",
    title: "Siap sampai ke pelanggan.",
    description: "Status pengiriman dan penerimaan melengkapi cerita sampai kanal penjualan, tanpa membuka data pribadi penerima.",
    public: "Status kirim dan mitra yang diizinkan",
    record: "ID pengiriman, lot, dispatch, penerimaan",
    rule: "Jika penerimaan mitra belum tercatat, berhenti pada status “dikirim”.",
    previewName: "Distribusi",
    previewValue: "[status kirim / terima]",
  },
];

const fields = {
  index: document.getElementById("stage-index"),
  title: document.getElementById("stage-title"),
  description: document.getElementById("stage-description"),
  public: document.getElementById("stage-public"),
  record: document.getElementById("stage-record"),
  rule: document.getElementById("stage-rule"),
  previewNumber: document.getElementById("preview-step-number"),
  previewName: document.getElementById("preview-step-name"),
  previewValue: document.getElementById("preview-step-value"),
};
const buttons = [...document.querySelectorAll(".stage-button")];
const motionAllowed = !matchMedia("(prefers-reduced-motion: reduce)").matches;

function setStage(index, moveFocus = false) {
  if (!Number.isInteger(index) || index < 0 || index >= stages.length) return;
  const stage = stages[index];
  fields.index.textContent = stage.index;
  fields.title.textContent = stage.title;
  fields.description.textContent = stage.description;
  fields.public.textContent = stage.public;
  fields.record.textContent = stage.record;
  fields.rule.textContent = stage.rule;
  fields.previewNumber.textContent = String(index + 1).padStart(2, "0");
  fields.previewName.textContent = stage.previewName;
  fields.previewValue.textContent = stage.previewValue;
  buttons.forEach((button, buttonIndex) => {
    const active = buttonIndex === index;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  if (moveFocus) buttons[index].focus();
  if (motionAllowed) {
    for (const element of [document.querySelector(".stage-story"), document.querySelector(".preview-step")]) {
      element.animate([
        { opacity: .55, transform: "translateY(7px)" },
        { opacity: 1, transform: "translateY(0)" },
      ], { duration: 240, easing: "ease-out" });
    }
  }
}

buttons.forEach((button, index) => {
  button.addEventListener("click", () => setStage(index));
  button.addEventListener("keydown", event => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    setStage((index + (event.key === "ArrowRight" ? 1 : -1) + stages.length) % stages.length, true);
  });
});
