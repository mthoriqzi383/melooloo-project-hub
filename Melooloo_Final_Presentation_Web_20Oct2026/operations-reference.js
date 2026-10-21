(() => {
  'use strict';
  const original = window.MELOOLOO_RENDER_OPERATIONS;
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const frame = (page, heading, body) => `<div class="vscene ops-scene ops-reference ops-${page}">${heading}<div class="ops-content">${body}</div></div>`;
  const goal = heading => frame(20, heading, `
    <div class="op20-vision"><small>VISI OPERASI</small><strong>Sistem produksi pangan perkotaan yang tangguh dan terstandarisasi</strong><span>Melon premium setara kualitas impor, secara berkelanjutan.</span></div>
    <div class="op20-metrics">
      <div><strong>Brix &gt;15°</strong><span>90% hasil panen Grade A</span></div>
      <div><strong>4–5×/tahun</strong><span>Siklus panen non-musiman melalui CEA</span></div>
      <div><strong>80–85%</strong><span>Lebih hemat air · 45–60 liter/kg</span></div>
      <div><strong>&lt;10%</strong><span>Target risiko gagal panen dengan IoT real-time</span></div>
    </div>
    <div class="op20-roadmap"><small>PETA JALAN EKSPANSI KAPASITAS · 5 TAHUN</small><div class="op20-numbers"><strong>106</strong><i>→</i><strong>197</strong><em>ton/tahun</em></div><div class="op20-track"><span>Y1</span><i></i><span>Y5</span></div><p>35 → 52 unit greenhouse · 2 → 3 lokasi rooftop Jakarta</p><p>Kapasitas teoretis maksimum ±119 ton/tahun ditarget konservatif ke 106 ton pada Tahun 1 untuk ramp-up dan learning curve.</p></div>`);
  const supply = heading => frame(21, heading, `
    <div class="op21-sites"><div><small>01 / JAKARTA SELATAN</small><strong>17 <em>unit</em></strong><span>Rooftop strategis · lokasi usulan</span></div><div><small>02 / JAKARTA TIMUR</small><strong>18 <em>unit</em></strong><span>Rooftop strategis · lokasi usulan</span></div><div class="op21-total"><strong>±7.000 m²</strong><span>total dua lokasi · model terdesentralisasi menjaga operasi jika satu lokasi terganggu</span></div></div>
    <div class="op21-flow"><span>PANEN</span><b>→</b><span>SORTIR + COLD CHAIN</span><b>→</b><strong>MITRA B2B &lt;12 JAM</strong></div>
    <div class="op21-vendors">
      <div><small>TIER 1 · KRITIS</small><strong>Benih premium</strong><p>Fujisawa RZ F1 dari PT Excelindo; kontrak tahunan untuk keaslian dan stok.</p></div>
      <div><small>TIER 2 · PENDUKUNG</small><strong>Nutrisi &amp; sensor IoT</strong><p>AB Mix dan platform IoT (Habibi Garden dkk.); diversifikasi ≥2 vendor per kebutuhan.</p></div>
      <div><small>TIER 3 · JASA</small><strong>Logistik cold chain</strong><p>Ninja Xpress Cold Chain dkk.; SLA same-day delivery ke mitra.</p></div>
    </div><div class="op21-next">TAHUN 3 <b>→</b> LOKASI KE-3 <b>→</b> 42 GREENHOUSE</div>`);
  const location = heading => frame(22, heading, `
    <div class="op22-photo"><img src="assets/editorial/roof-cluster.jpg" alt="Visualisasi konsep kelompok greenhouse di atas rooftop Jakarta"><span>VISUALISASI KONSEP · LOKASI PERLU VERIFIKASI</span></div>
    <div class="op22-specs"><small>GREENHOUSE DI ATAS ROOFTOP</small><strong>17–18 <em>unit/lokasi</em></strong><div><span>1 rumah kaca</span><b>±200 m²</b></div><div><span>Luas per lokasi</span><b>±3.400–3.600 m²</b></div><div><span>Siklus panen</span><b>4–5× per tahun</b></div><div><span>Kapasitas produksi</span><b>±60–70 ton/tahun</b></div><p>Sensor suhu, kelembapan, cahaya, pH, EC, dan air mengirim data ke dashboard IoT.</p></div>
    <div class="op22-facilities"><small>FASILITAS PENDUKUNG ROOFTOP</small><span>Akses &amp; keamanan</span><span>Sortir &amp; packing</span><span>Cold room</span><span>Gudang</span><span>Ruang nutrisi</span><span>Staf &amp; kantor</span><span>Utilitas air &amp; listrik</span></div>`);
  const cost = heading => frame(23, heading, `
    <div class="op23-invest"><small>ALOKASI INVESTASI AWAL · CAPEX TAHUN 0</small><strong>Rp7,46 <em>miliar</em></strong><div class="op23-tags"><span>Greenhouse 35 unit</span><span>Modal kerja pra-operasi</span><span>Cold storage &amp; distribusi</span><span>Lokasi rooftop</span><span>Legal &amp; kantor</span><span>Kontingensi 5%</span></div></div>
    <div class="op23-performance"><div><small>COST PER TON · Y0 → Y10</small><strong>Rp29,2 → 45,3 jt</strong><span>CAGR ±4,5% per tahun</span></div><div><small>OPEX RATIO</small><strong>64% → 49–52%</strong><span>Stabil mulai Tahun 2</span></div><div><small>PERTUMBUHAN Y0 → Y10</small><div class="op23-comparison"><strong>4,12×</strong><em>vs</em><strong>3,71×</strong></div><span>Biaya vs produksi; laju biaya sedikit melampaui volume</span></div></div>`);
  const priorities = heading => {
    const rows = [
      ['Kualitas','Sangat Tinggi','Benih unggul Fujisawa RZ F1 + sistem one plant one fruit — nutrisi difokuskan pada satu buah terbaik per tanaman.'],
      ['Keandalan','Tinggi','Kontrol iklim otomatis di dalam smart greenhouse memastikan jadwal panen tetap tepat waktu meski cuaca ekstrem.'],
      ['Kecepatan','Tinggi','Konsep Hyper-Proximity (0-km Distribution) lewat rooftop farming — produk tiba di tangan konsumen di hari yang sama saat panen.'],
      ['Fleksibilitas','Sedang','Fasilitas produksi bersifat modular — volume produksi atau varietas melon dapat disesuaikan cepat dengan tren pasar.'],
      ['Biaya','Sedang','Efisiensi biaya logistik & penurunan kerugian produk rusak mengompensasi investasi awal teknologi yang tinggi.']
    ];
    return frame(24, heading, `<div class="op24-table"><div class="op24-head"><span>DIMENSI PERFORMA</span><span>PRIORITAS</span><span>IMPLEMENTASI STRATEGIS</span></div>${rows.map((row,i)=>`<div class="op24-row"><b>${String(i+1).padStart(2,'0')}</b><strong>${row[0]}</strong><em>${row[1]}</em><span>${row[2]}</span></div>`).join('')}</div>`);
  };
  const team = heading => {
    const roles = [
      ['Agronomi','Head of Agronomy & Quality Excellence','Mengawasi standar budidaya dan pemeliharaan tanaman di seluruh unit greenhouse.'],
      ['Teknologi & IoT','Smart Greenhouse & IoT System Lead','Menjaga kestabilan sensor, sistem automasi irigasi, dan pengolahan data untuk keputusan agronomis.'],
      ['Logistik & Distribusi','Distribusi rooftop ke mitra ritel','Mengatur rantai pasok dari rooftop langsung ke mitra ritel premium di Jakarta.']
    ];
    return frame(25, heading, `<div class="op25-roles">${roles.map((role,i)=>`<div><small>0${i+1} / DIVISI</small><strong>${role[0]}</strong><b>${role[1]}</b><p>${role[2]}</p></div>`).join('')}</div><div class="op25-growth"><div><strong>±14</strong><span>Tahun 0 · 1 CEO + 4 Direktur + tenaga lapangan · 2 siklus trial</span></div><div><strong>±20</strong><span>Tahun 1–2 · operasional penuh 35 greenhouse</span></div><div><strong>±26</strong><span>Tahun 5 · steady-state, mendukung ~52 greenhouse</span></div><p>SOP menjaga kualitas lintas lokasi. Dalam jangka panjang (&gt;5 tahun), model direplikasi ke Surabaya dan Bali; operasi fisik tersebar, data IoT terpusat.</p></div>`);
  };
  const risks = heading => {
    const rows = [
      ['Kelangkaan benih Fujisawa RZ F1','Tinggi','Rendah','Kontrak tahunan dengan PT Excelindo; varietas alternatif Inthanon RZ; stok cadangan ≥2 siklus.'],
      ['Kenaikan harga nutrisi AB Mix','Sedang','Sedang','Diversifikasi ≥2 vendor; negosiasi kontrak tahunan; eksplorasi formulasi nutrisi mandiri.'],
      ['Gangguan logistik cold chain','Tinggi','Sedang','Kontrak dengan 2 penyedia jasa logistik; armada distribusi internal sebagai backup.'],
      ['Kerusakan peralatan IoT / sensor','Sedang','Sedang','Stok suku cadang kritis; kontrak pemeliharaan preventif; pelatihan troubleshooting operator.'],
      ['Keterlambatan konstruksi GH baru','Tinggi','Rendah','Tender terbatas 2–3 kontraktor terseleksi; buffer waktu proyek 20%; supervisi internal.']
    ];
    return frame(26, heading, `<div class="op26-table"><div class="op26-head"><span>RISIKO</span><span>DAMPAK</span><span>PROBABILITAS</span><span>STRATEGI MITIGASI</span></div>${rows.map((row,i)=>`<div class="op26-row"><b>${String(i+1).padStart(2,'0')}</b><strong>${row[0]}</strong><em>${row[1]}</em><em>${row[2]}</em><span>${row[3]}</span></div>`).join('')}</div><div class="op26-bottom">Mitigasi untuk setiap risiko dengan skor ≥ Sedang × Sedang.</div>`);
  };
  const replacement = {20:goal,21:supply,22:location,23:cost,24:priorities,25:team,26:risks};
  window.MELOOLOO_RENDER_OPERATIONS = (page,item,heading) => replacement[page]?.(heading) || original(page,item,heading);
})();
