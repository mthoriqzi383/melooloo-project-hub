"""Build the standalone 36-page deck from the earlier Melooloo marketing deck.

The October 23 v3 HTML is used only for the detailed backup pages. The six
main pages below follow the supplied v2 guide and October Chapter 4 paper.
"""
from pathlib import Path
import json
import re

HERE = Path(__file__).resolve().parent
SOURCE = Path.home() / 'Project/BP/Melooloo_Deck_Pemasaran_Web_v3_23Okt2026/index.html'
html = SOURCE.read_text()
matches = list(re.finditer(r'<section class="slide\b.*?</section>', html, re.S))
sections = {re.search(r'\bid="([^"]+)"', m.group()).group(1): m.group() for m in matches}
assert len(sections) == 51

def slide(code, title, body, source, *, small=False, kicker='strategi pemasaran · slide utama', note=''):
    return f'''<section class="slide m36-main" id="{code}" data-code="{code}" data-group="utama" data-name="{title}" aria-label="{code} {title}">
      <div class="tag">{kicker}</div>
      <h2 class="title{' sm' if small else ''}">{title}</h2>
      <div class="rule"></div>
      <div class="body m36-body">{body}</div>
      <div class="foot"><div>{source}</div><div>{code}</div></div>
    </section>'''

main = {}
main['M1'] = slide('M1', 'Pembeli sudah ada; Tahun 1 cukup menjangkau 4–6% pasar premium DKI', '''
  <div class="m36-three">
    <div class="m36-panel frag"><div class="lbl"><span class="num">1</span>pembeli kami</div>
      <div class="m36-dual"><div><small>B2B · TAHUN 1</small><strong>68%</strong><span>volume Grade A</span><p>Ritel premium · hotel bintang 5 · e-grocery</p></div><div class="accent"><small>B2C · TAHUN 1</small><strong>32%</strong><span>volume Grade A</span><p>Premium Lifestyle · Gift &amp; Occasion · Health-Conscious Urban</p></div></div>
      <div class="m36-mini">B2B memberi lantai volume; B2C dikembangkan lewat langganan dan hadiah.</div>
    </div>
    <div class="m36-panel frag"><div class="lbl"><span class="num">2</span>masalah mereka</div>
      <div class="m36-problem">Rasa melon baru ketahuan <em>setelah dibelah.</em></div>
      <div class="m36-numbers"><div><strong>94,5%</strong><span>memilih karena rasa manis</span></div><div><strong>79%</strong><span>tertarik menjadikan melon hadiah</span></div></div>
      <div class="m36-mini">Ritel tidak memeriksa Brix di rak; mutu perlu dijamin pemasok. Survei primer n = 253.</div>
    </div>
    <div class="m36-panel frag"><div class="lbl"><span class="num">3</span>ukuran pasar</div>
      <div class="m36-funnel"><div><small>TAM · JABODETABEK</small><strong>32.100 ton</strong><span>≈ Rp 558 miliar/tahun</span></div><div><small>SAM · PREMIUM DKI</small><strong>1.460–2.190 ton</strong><span>estimasi permintaan/tahun</span></div><div><small>158 PINTU SASARAN</small><strong>236,9 ton</strong><span>121 ritel + 37 hotel · potensi volume</span></div><div class="hit"><small>SOM · TAHUN 1</small><strong>85,5 ton</strong><span>4–6% dari SAM premium DKI</span></div></div>
      <div class="m36-mini">Tahun 5: 310,9 ton atau 14–21% SAM. Batang tidak berskala.</div>
    </div>
  </div>''', 'Sumber: survei n = 253 (Lampiran A), wawancara Suzuya (Lampiran K), Tabel 4.1 dan 4.6–4.7; paper rev15 hlm. 36–47, 65.', small=True)

main['M2'] = slide('M2', 'Di Jakarta, posisi melon greenhouse premium masih terbuka dan mutunya dapat diperiksa', '''
  <div class="m36-sub">Positioning yang direncanakan: melon premium dari smart greenhouse Jakarta, tiba di titik penjualan &lt;24 jam setelah panen.</div>
  <div class="m36-three m36-m2">
    <div class="m36-panel frag"><div class="lbl"><span class="num">1</span>ruang bersaing</div>
      <img class="m36-map" src="img/g41.png" alt="Peta struktur kompetitif usulan; posisi Melooloo adalah hipotesis" loading="eager">
      <div class="m36-compare"><div><strong>&lt;70 t</strong><span>volume yang diungkap satu produsen sekitar Jakarta</span></div><b>vs</b><div><strong>236,9 t</strong><span>potensi volume di 158 pintu sasaran</span></div></div>
      <div class="m36-mini">Volume pesaing lain belum diketahui. Sweet Greens (±90 km) dinilai ancaman penting; komitmen pendanaan DEG USD 750.000 adalah data pembanding, bukan bukti penjualan.</div>
    </div>
    <div class="m36-panel frag"><div class="lbl"><span class="num">2</span>setara vs berbeda</div>
      <div class="m36-tagline">Premium. Local. Consistent.</div>
      <div class="m36-pop"><small>SETARA · POINT OF PARITY</small><p>Brix ≥15 · jaring rata · residu di bawah BMR · kemasan hadiah</p></div>
      <div class="m36-pod"><small>BERBEDA · POINT OF DIFFERENCE</small><p><b>&lt;24 jam</b> dari panen ke rak</p><p>Kebun Jakarta dapat dikunjungi</p><p>QR segel menuju data lot dan kebun</p><p>Dipetik pada kematangan puncak</p></div>
      <div class="m36-mini">Janji mutu dan pengalaman ini adalah rencana operasi yang perlu dibuktikan saat peluncuran.</div>
    </div>
    <div class="m36-panel frag"><div class="lbl"><span class="num">3</span>bukti di tangan pembeli</div>
      <div class="m36-phone"><div class="m36-phone-head">melooloo · cek buahmu</div><strong>Melooloo Signature</strong><small>Grade A · contoh tampilan</small><div>Kebun: greenhouse [kode], Jakarta</div><div>Dipanen: [tanggal], pukul [jam]</div><div>Nikmati sebelum: [tanggal]</div><div>Kemanisan: lulus uji Brix ≥15 <em>per lot</em></div><div>Keamanan: residu di bawah BMR <em>per lot</em></div><div>Log sensor <svg viewBox="0 0 220 28" aria-label="Ilustrasi grafik sensor"><polyline points="2,22 38,12 74,18 110,7 146,14 182,9 218,17" fill="none" stroke="#7AA23A" stroke-width="3"/></svg></div><div>Agronomis [nama]</div><span>Garansi Janji Manis</span><div>Segel no. [nomor]</div></div>
      <div class="m36-mini">Mockup rencana. Uji Brix ditampilkan per lot.</div>
    </div>
  </div>
  <div class="m36-ribbon">Daya tiru terlama: akses rooftop 5–10 tahun · data kalibrasi budidaya · kontrak hotel · pelanggan langganan <span>rencana / hipotesis daya tiru</span></div>''', 'Sumber: Gambar 4.1, Tabel 4.9–4.12 dan Lampiran L.3; paper rev15 hlm. 49–57, 61, 66–67, 73.', small=True)

main['M3'] = slide('M3', 'Harga premium Melooloo memberi ruang margin tanpa meniru harga melon lelang', '''
  <div class="m36-price frag"><div class="m36-price-head"><b>Tangga harga per kg · tidak berskala</b><span>14–17× di bawah Crown Melon <em>hitungan tim</em></span></div>
    <div class="m36-price-grid"><div><small>MELON PASAR</small><strong>Rp17 rb</strong></div><div class="cost"><small>HPP MELOOLOO</small><strong>Rp28,7 rb</strong><span>lantai biaya, bukan produk</span></div><div><small>SUNPRIDE</small><strong>Rp66–72 rb</strong></div><div class="me"><small>MELOOLOO B2B</small><strong>Rp75 rb</strong></div><div class="me"><small>MELOOLOO LANGSUNG</small><strong>Rp99 rb</strong></div><div><small>PREMIUM LOKAPASAR</small><strong>Rp108–122 rb</strong></div><div class="break"><small>CROWN MELON</small><strong>Rp1,3–1,7 jt</strong><span>skala harga terputus //</span></div></div>
  </div>
  <div class="m36-m3-bottom"><div class="m36-panel frag"><div class="lbl"><span class="num">1</span>format mengikuti jalur</div><div class="m36-product-row"><img src="img/l4.jpg" alt="Ilustrasi Signature Pack"><div><strong>Lewat mitra · Rp75.000/kg</strong><span>Signature di ritel/e-grocery · Chef Selection di hotel</span></div></div><div class="m36-product-row"><img src="img/l5.jpg" alt="Ilustrasi Gift Edition"><div><strong>Langsung · setara Rp99.000/kg</strong><span>Weekly · Season Pass · Gift Edition Rp535.000/box</span></div></div><div class="m36-dark-band">Tanpa diskon Grade A pada buah bersegel</div></div>
    <div class="m36-panel frag"><div class="lbl"><span class="num">2</span>bukti harga dan biaya</div><div class="m36-proof-grid"><div><strong>45,8%</strong><span>bersedia ≥Rp100.000 <b>per buah</b>, bukan pada harga Gift Edition</span></div><div><strong>≈62% / ≈71%</strong><span>margin kotor B2B / B2C pada harga model</span></div><div><strong>≥100</strong><span>target pra-pesan berbayar sebelum Weekly diluncurkan</span></div></div><div class="m36-mini">Pada sekitar Rp178.200/buah, paper memperkirakan ±23% WTP melalui interpolasi; bukan hasil pertanyaan langsung.</div></div>
  </div>''', 'Sumber: Lampiran L.6 (listing Agustus 2026), Tabel 4.18–4.20; paper rev15 hlm. 52, 74–77. Rasio Crown = Rp1.345.000–1.687.500 ÷ Rp99.000 (hitungan tim).', small=True)

main['M4'] = slide('M4', 'B2B menjadi jangkar volume; B2C ditargetkan 60% volume pada Tahun 5', '''
  <div class="m36-timeline frag"><div><small>K3 · TAHUN 0</small><strong>Validasi pasar</strong><p>Target panen pertama · tasting dinner 7 hotel · pengajuan ritel · uji pra-pesan</p></div><div><small>K4 · TAHUN 0</small><strong>Mulai masuk kanal</strong><p>Target 18 akun HoReCa terkontrak, 17 pintu ritel · Weekly diluncurkan</p></div><div><small>TAHUN 1</small><strong>Bangun B2C</strong><p>Season Pass · Gift Edition Imlek/Idulfitri · Kunjungan Kebun</p></div></div>
  <div class="m36-m4-bottom"><div class="m36-panel frag"><div class="lbl"><span class="num">1</span>bauran volume Grade A</div>
    <div class="m36-mix"><span>Tahun 1</span><div><i style="width:68%">B2B 68%</i><b style="width:32%">B2C 32%</b></div></div><div class="m36-mix"><span>Tahun 5</span><div><i style="width:40%">B2B 40%</i><b style="width:60%">B2C 60%</b></div></div><div class="m36-mix"><span>Tahun 10</span><div><i style="width:48%">B2B 48%</i><b style="width:52%">B2C 52%</b></div></div>
    <div class="m36-mini">B2B melalui ritel, hotel, e-grocery; B2C melalui situs/WhatsApp dan official store.</div>
  </div><div class="m36-panel frag"><div class="lbl"><span class="num">2</span>IMC dan akuisisi Tahun 1 <em class="m36-badge">hitungan tim</em></div>
    <div class="m36-imc"><div><b>Pengalaman</b><strong>Rp338 jt</strong><span>Uji Manis, Kunjungan Kebun, Panen Perdana, komunitas</span></div><div><b>Digital + CRM</b><strong>Rp240 jt</strong><span>iklan, konten, situs, WhatsApp</span></div><div><b>Kredibilitas</b><strong>Rp99 jt</strong><span>PR, uji pihak ketiga, garansi, survei merek</span></div><div><b>Penjualan B2B</b><strong>Rp91 jt</strong><span>tenaga penjualan, jamuan cicip chef</span></div></div><div class="m36-outcome"><strong>2.912 pelanggan baru</strong><span>target Y1: 2.112 akuisisi berbayar termasuk Uji Manis + 800 program komunitas/kebun</span></div>
  </div></div>''', 'Sumber: Tabel 4.1, 4.21, 4.23, 4.25–4.26; paper rev15 hlm. 36–37, 77–88. K3/K4 adalah target rencana, belum bukti realisasi.', small=True)

main['M5'] = slide('M5', 'Tiga tahap perjalanan pelanggan punya target yang bisa diperiksa', '''
  <div class="m36-sub">Tujuan: dikenal dan dipercaya sebagai melon premium lokal di Jakarta; B2C direncanakan menjadi sumber pendapatan utama Jakarta sejak Tahun 3.</div>
  <div class="m36-three m36-journey"><div class="m36-panel frag"><div class="m36-step">01 · KENAL</div><small>TITIK SENTUH</small><p>Konten panen Instagram/TikTok · menu hotel mitra · komunitas studio/klub lari · Panen Perdana dan PR</p><small>TARGET TAHUN 1 → TAHUN 5</small><div class="m36-jnum"><strong>10% → 40%</strong><span>aided awareness SES A/A+ Jabodetabek</span></div><div class="m36-jnum"><strong>≥3 → ≥10</strong><span>hotel mitra mencantumkan asal Melooloo di menu</span></div></div>
    <div class="m36-panel frag"><div class="m36-step">02 · COBA &amp; BELI</div><small>TITIK SENTUH</small><p>Uji Manis · Kunjungan Kebun · Signature di rak · pra-pesan, situs, WhatsApp</p><small>TARGET TAHUN 1 → TAHUN 5</small><div class="m36-jnum"><strong>3.303 → 10.909</strong><span>pelanggan B2C aktif</span></div><div class="m36-jnum"><strong>17 → 35</strong><span>pintu ritel; akun HoReCa 17 → 36</span></div><div class="m36-mini">≥100 pra-pesan berbayar adalah gerbang pra-peluncuran.</div></div>
    <div class="m36-panel highlighted frag"><div class="m36-step">03 · SETIA &amp; REKOMENDASI</div><small>TITIK SENTUH</small><p>Weekly/Season Pass · segel dan QR · garansi Janji Manis · referral buah Rp50.000</p><small>TARGET TAHUN 1 → TAHUN 5</small><div class="m36-jnum"><strong>35% → 58%</strong><span>retensi B2C</span></div><div class="m36-jnum"><strong>60% → 80%</strong><span>perpanjangan Weekly; retensi B2B 70% → 90%</span></div><div class="m36-mini">15% pelanggan baru ditargetkan datang dari referral. ↩ ke tahap Kenal</div></div></div>
  <div class="m36-ribbon">Diukur melalui survei merek 2×/tahun · CRM menurut sumber pelanggan · audit menu dan harga rak bulanan · target CSI 80 → 90</div>''', 'Sumber: Tabel 4.1, 4.16, 4.24; paper rev15 hlm. 36–37, 64–70, 84–86. Seluruh angka adalah target rencana.', small=True)

main['M6'] = slide('M6', 'Belanja pemasaran turun dari 10,3% ke 5,9% pendapatan, dengan tiga gerbang', '''
  <div class="m36-three"><div class="m36-panel frag"><div class="lbl"><span class="num">1</span>ekonomi pemasaran</div>
    <div class="m36-econ"><div><strong>Rp768 jt</strong><span>anggaran Y1 · 10,3% pendapatan</span></div><div><strong>Rp75 rb → Rp40 rb</strong><span>target CAC kanal berbayar Y1 → Y5</span></div><div><strong>Rp3,8 M → Rp20,1 M</strong><span>NMC Y1 → Y5, proyeksi kontribusi pemasaran</span></div></div><div class="m36-mini">NMC per Rp1 belanja pemasaran mencapai sekitar Rp9–11 sejak Y3 dalam model; bukan ROI iklan inkremental.</div>
  </div><div class="m36-panel frag"><div class="lbl"><span class="num">2</span>intensitas biaya</div>
    <div class="m36-revenue">Pendapatan: <b>Rp7,4 M</b> Y1 → <b>Rp32,3 M</b> Y5 → <b>Rp86,6 M</b> Y10</div>
    <div class="m36-chart" role="img" aria-label="Rasio anggaran pemasaran terhadap pendapatan: Tahun 0 14,4%; Tahun 1 10,3%; Tahun 2 8,1%; Tahun 3 6,3%; Tahun 4 6,5%; Tahun 5 5,9%; Tahun 6 6,6%; Tahun 7 5,8%; Tahun 8 5,7%; Tahun 9 6,5%; Tahun 10 5,4%"><div class="m36-yaxis"><span>15%</span><span>10%</span><span>5%</span></div><svg viewBox="0 0 540 300" preserveAspectRatio="none" aria-hidden="true"><path d="M0 50H540 M0 145H540 M0 240H540" stroke="#d7dbc8" stroke-width="2"/><path d="M0 105H540 M0 189H540" stroke="#9aa39a" stroke-dasharray="8 6" stroke-width="2"/><text x="355" y="99" fill="#636B63" font-size="18" font-weight="700">CMO Survey 12%</text><text x="345" y="183" fill="#636B63" font-size="18" font-weight="700">Gartner 7,7%</text><polyline points="6,60 58,137 110,179 162,213 214,209 266,220 318,207 370,222 422,224 474,209 526,230" fill="none" stroke="#7AA23A" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><g fill="#7AA23A"><circle cx="6" cy="60" r="7"/><circle cx="58" cy="137" r="7"/><circle cx="266" cy="220" r="7"/><circle cx="526" cy="230" r="7"/></g></svg><div class="m36-xaxis"><span>Y0</span><span>Y1</span><span>Y2</span><span>Y3</span><span>Y4</span><span>Y5</span><span>Y6</span><span>Y7</span><span>Y8</span><span>Y9</span><span>Y10</span></div><div class="m36-chart-values">Y0 14,4% · Y1 10,3% · Y5 5,9% · Y10 5,4%</div></div><div class="m36-mini">Y0 hanya satu semester. Tolok ukur menurut paper: Gartner 2025 dan CMO Survey 2026.</div>
  </div><div class="m36-panel frag"><div class="lbl"><span class="num">3</span>tiga gerbang keputusan</div><div class="m36-gates"><div><b>01 · PRA-PELUNCURAN</b><strong>≥100 pra-pesan berbayar</strong><span>sebelum Weekly diluncurkan</span></div><div><b>02 · AKHIR TAHUN 1</b><strong>800 pelanggan program + 35% retensi</strong><span>jika tidak tercapai, alihkan anggaran</span></div><div><b>03 · SEBELUM EKSPANSI</b><strong>≥90% Grade A terjual penuh</strong><span>selama dua siklus sebelum tahap/kota baru</span></div></div></div></div>''', 'Sumber: Tabel 4.28–4.29 dan model Oktober; paper rev15 hlm. 36, 48, 89–94, 158. Seluruh metrik adalah proyeksi/gerbang rencana.', small=True)

keep = ['M0', 'M1', 'M2', 'T', 'M3', 'M4', 'M5', 'M6'] + [f'B{i}' for i in range(1,29)]
assert len(keep) == 36
sections['M0'] = sections['M0'].replace('<span style="font-weight:700">[NAMA PRESENTER]</span> · [peran di tim]', '<span style="font-weight:700">Tim Melooloo</span> · Kelompok 6')
for key, value in main.items(): sections[key] = value

# Carry across the full existing backup slide compositions. Correct claims
# where the October paper or v2 guide makes the earlier wording too broad.
replacements = {
  'B3': [('≈ 36% pintu sasaran','≈ 36% potensi volume dari 158 pintu sasaran')],
  'B4': [('sekitar <span class="b">23% responden</span> masih bersedia','estimasi interpolasi sekitar <span class="b">23% responden</span> masih bersedia'),('belum difokuskan pada SES A/A+, sehingga angka kesediaan membayar bersifat konservatif.','belum difokuskan pada SES A/A+; interpretasi mengikuti profil sampel.')],
  'B6': [('Per buah, Melooloo 38% di atas melon termahal di rak, tetapi setara satu boks stroberi Jepang','Pada sampel rak AEON Agustus 2026, Melooloo 38% di atas melon termahal; setara satu boks stroberi Jepang')],
  'B11': [('Iklan berbayar','Akuisisi berbayar (iklan + Uji Manis)')],
  'B12': [('Anggaran 10 tahun Rp 25,3 miliar','Anggaran kumulatif Y0–Y10 Rp 25,3 miliar')],
  'B17': [('belum ada produsen premium berbasis greenhouse di dalam DKI','riset tim belum mengidentifikasi produsen premium greenhouse di DKI'),('dana USD 750.000 dari DEG','komitmen pendanaan USD 750.000 (DEG, 2024)'),('rendah (jarak dekat)','jarak distribusi lebih pendek (hipotesis)')],
  'B20': [('Per pelanggan B2C, kontribusi kotor tahun pertama sekitar 5 kali biaya akuisisinya','Perbandingan model: kontribusi per pelanggan aktif sekitar 5× biaya akuisisi per pelanggan baru'),('Hanya tahun pertama, bukan nilai seumur pelanggan; tolok ukur umum LTV:CAC minimal 3. Angka ini tidak tertulis di paper.','Ilustrasi hitungan tim dengan penyebut berbeda: kontribusi per pelanggan aktif versus biaya akuisisi per pelanggan baru. Bukan LTV:CAC, ROI kohort, atau bukti balik modal pelanggan.')],
  'B24': [('12 mitra komunitas dan Kunjungan Kebun','6 mitra komunitas Y1 (target 12 mulai Y3) dan Kunjungan Kebun'),('anggaran bottom-up ±5–6% pendapatan','anggaran bottom-up 10,3% pendapatan Y1; sekitar 5–6% pada tahun berikutnya')],
  'B27': [('pola yang sama sudah terlihat di Jakarta','minat hadiah dan penawaran premium mulai terlihat di Jakarta'),('Kami meniru cara Jepang membangun premium','Rancangan Melooloo mengadaptasi cara Jepang membangun premium')],
}
for code, pairs in replacements.items():
    for old, new in pairs:
        sections[code] = sections[code].replace(old, new)

# The remaining placeholders are replaced by concept images and one native UI
# illustration; no restaurant, courier, or marketplace partnership is implied.
sections['B25'] = sections['B25'].replace('<div class="ph phx"><b>P-19</b><span>hidangan penutup melon di hotel</span><small>gambar buatan tim · ganti di sini</small></div>', '<img src="img/hotel-dessert-concept.png" alt="Ilustrasi konsep hidangan melon di restoran hotel"><span class="icap">Ilustrasi konsep · bukan mitra aktif</span>')
sections['B25'] = sections['B25'].replace('<div class="ph phx"><b>P-20</b><span>kiriman Weekly di depan pintu</span><small>gambar buatan tim · ganti di sini</small></div>', '<img src="img/weekly-delivery-concept.png" alt="Ilustrasi konsep pengiriman langganan Weekly"><span class="icap">Ilustrasi konsep · layanan rencana</span>')
sections['B25'] = sections['B25'].replace('<div class="ph phx"><b>P-21</b><span>ponsel dengan aplikasi belanja generik</span><small>gambar buatan tim · ganti di sini</small></div>', '<div class="m36-grocery" aria-label="Ilustrasi generik katalog e-grocery"><div>belanja buah</div><span>🍈 &nbsp; melon premium</span><b>+ keranjang</b></div>')
sections['B28'] = sections['B28'].replace('<div class="ph phx" style="height:100%"><b>P-27</b><span>lari pagi dari kebun</span><small>gambar buatan tim · ganti di sini</small></div>', '<div class="m36-run"><img src="img/community-run-concept.png" alt="Ilustrasi konsep kegiatan lari pagi komunitas"><span>Ilustrasi oleh tim Melooloo · program rencana</span></div>')
sections['B28'] = sections['B28'].replace('±80 anggota terjangkau per mitra × konversi 25% =', 'Asumsi: ±80 anggota terjangkau per mitra × konversi 25% =').replace('Pilot: satu studio dan lari pagi pertama di K4 Tahun 0.', 'Rencana pilot: satu studio dan lari pagi pertama di K4 Tahun 0.')
sections['B26'] = sections['B26'].replace('Situs Melooloo.id: katalog yang bisa dilacak sampai ke greenhouse dan jam panennya', 'Rancangan situs Melooloo.id: katalog dan pelacakan ke kebun serta jam panen').replace('Setiap buah punya halaman sendiri:', 'Setiap buah direncanakan memiliki halaman:').replace('Dikirim pada hari panen, atau diambil', 'Direncanakan dikirim pada hari panen, atau diambil')
sections['B25'] = sections['B25'].replace('Lima kanal dengan peran berbeda: B2B memberi volume, kanal langsung memberi margin', 'Lima kanal direncanakan dengan peran berbeda: B2B untuk volume, langsung untuk margin')
sections['B26'] = sections['B26'].replace('<div class="ci"></div><b>Melooloo Weekly</b>', '<div class="ci"><img src="img/l4.jpg" alt="Ilustrasi Weekly"></div><b>Melooloo Weekly</b>')
sections['B26'] = sections['B26'].replace('<div class="ci"></div><b>Melooloo Season Pass</b>', '<div class="ci"><img src="img/l2.jpg" alt="Ilustrasi Season Pass"></div><b>Melooloo Season Pass</b>')
sections['B26'] = sections['B26'].replace('<div><b>Dipanen:</b> [tanggal], pukul [jam]</div>', '<div><b>Dipanen:</b> [tanggal], pukul [jam]</div><div><b>Nikmati sebelum:</b> [tanggal]</div>')
sections['B9'] = sections['B9'].replace('<th>% volume Grade A</th>', '<th>% volume Grade A<br><small>gabungan kota pada Th10</small></th>')
sections['T'] = sections['T'].replace('</section>', '<div class="t-source">Sumber: paper rev15 hlm. 62–64, 68–69, 84; Lampiran L Gambar L.1, L.2, L.5. Visualisasi konsep.</div>\n</section>')
sections['B27'] = sections['B27'].replace('minat hadiah dan penawaran premium mulai terlihat di Jakarta', 'minat hadiah dan penawaran premium terlihat di Jakarta')
sections['B27'] = sections['B27'].replace('Crown Melon sudah dijual di Jakarta lewat ±14 toko reseller lokapasar', 'Crown Melon tercantum pada ±14 reseller lokapasar di Jakarta')
sections['B27'] = sections['B27'].replace('<b>Yubari Melons Fetch Record 5.8 M. Yen at 1st Auction of Season</b>', '<b><a href="https://www.nippon.com/es/news/yjj2026052200376/" target="_blank" rel="noopener">Sepasang Yūbari terjual 5,8 juta yen pada lelang pembuka musim ↗</a></b>')
sections['B27'] = sections['B27'].replace('<b>A melon, or a message? The prized fruit at the centre of the Albanese controversy</b>', '<b><a href="https://www.sbs.com.au/news/article/what-are-crown-melons-japan-albanese-comments/ont8zo9ws" target="_blank" rel="noopener">Crown Melon menjadi hadiah diplomatik Jepang ↗</a></b>')
sections['B27'] = sections['B27'].replace('<small>CNN, dimuat ulang WCPO · 22 Maret 2017</small><b>$27,000 melons? Unwrapping the high price of Japan\'s luxury fruit habit</b>', '<small>nippon.com · 9 September 2016</small><b><a href="https://www.nippon.com/en/views/b06001/" target="_blank" rel="noopener">Buah premium sebagai hadiah di Jepang ↗</a></b>')
sections['B27'] = sections['B27'].replace('Sumber: nippon.com/Jiji Press (22/5/2026; 9/9/2016); JawaPos.com (24/5/2026); SBS News (13/8/2026); CNN via WCPO (22/3/2017); paper hlm. 8–9, 54–55, 65, 68, 74, 76; Lampiran K.', 'Sumber: nippon.com/Jiji Press (22/5/2026), nippon.com (9/9/2016), JawaPos (24/5/2026), SBS News (13/8/2026); paper rev15 Bab IV dan Lampiran K. Harga lelang adalah publisitas, bukan harga ritel.')

source_footers = {
  'B1':'Sumber: paper rev15 Tabel 4.25, hlm. 84–85; seluruh jadwal/akun adalah target.',
  'B2':'Sumber: paper rev15 Lampiran J Tabel J.1, hlm. 194; hotel adalah calon sasaran, bukan kontrak aktif.',
  'B3':'Sumber: paper rev15 Tabel 4.6–4.7; potensi volume 158 pintu adalah hasil model.',
  'B4':'Sumber: paper rev15 Lampiran A Gambar A.7 dan pembahasan kesediaan membayar Bab IV; n = 253.',
  'B5':'Sumber: paper rev15 Lampiran K dan wawancara Suzuya; bukti wawancara, bukan kontrak.',
  'B6':'Sumber: paper rev15 Lampiran L Tabel L.7, sekitar hlm. 212; sampel rak AEON Agustus 2026.',
  'B7':'Sumber: paper rev15 Gambar 4.2 dan Lampiran L Tabel L.4; posisi adalah hipotesis tim.',
  'B8':'Sumber: paper rev15 Tabel 4.15, hlm. 64; standar mutu yang direncanakan.',
  'B9':'Sumber: paper rev15 Tabel 4.21–4.22, hlm. 77–78; struktur kanal dalam rencana.',
  'B10':'Sumber: paper rev15 Tabel 4.23, hlm. 81; anggaran Y1 dalam model.',
  'B11':'Sumber: paper rev15 Tabel 4.24, hlm. 83; biaya akuisisi adalah hitungan model.',
  'B12':'Sumber: paper rev15 Tabel 4.28, hlm. 89 (anggaran) dan Tabel 4.29, hlm. 90 (pendapatan).',
  'B13':'Sumber: paper rev15 Tabel 4.29, hlm. 90; NMC/MROI adalah proyeksi, bukan ROI iklan inkremental.',
  'B14':'Sumber: paper rev15 Tabel 4.26, hlm. 85; tahapan adalah rencana.',
  'B15':'Sumber: paper rev15 Bab IV distribusi dan aspek keuangan; estimasi biaya lokapasar = hitungan tim.',
  'B16':'Sumber: paper rev15 Lampiran L Tabel L.2 (sekitar hlm. 203) dan Bab IV target wilayah.',
  'B17':'Sumber: paper rev15 §4.5.1, Gambar 4.3, dan riset pesaing tim; posisi dan dampak adalah hipotesis.',
  'B18':'Sumber: paper rev15 Tabel 4.27, hlm. 87; roadmap ekspansi adalah rencana.',
  'B19':'Sumber: paper rev15 Tabel 4.1, hlm. 36–37, dan Tabel 4.16, hlm. 69; seluruh angka target.',
  'B20':'Sumber: hitungan ilustratif tim dari paper rev15 Tabel 4.1, 4.24 dan 4.29.',
  'B25':'Sumber: paper rev15 Tabel 4.18, 4.21–4.22; bauran kanal adalah target model, foto adalah ilustrasi konsep.',
  'B26':'Sumber: paper rev15 Tabel 4.18, 4.23 dan rancangan situs/QR Bab IV; seluruh tampilan adalah ilustrasi.',
  'B28':'Sumber: paper rev15 Tabel 4.1, 4.23–4.26; angka konversi/mitra adalah asumsi dan target.'
}
for code, footer in source_footers.items():
    sections[code] = re.sub(r'(<div class="foot"><div>).*?(</div><div>'+code+r'</div>)', lambda m: m.group(1)+footer+m.group(2), sections[code], count=1, flags=re.S)

prefix = html[:matches[0].start()]
suffix = html[matches[-1].end():]
prefix = '<!doctype html>\n<html lang="id"><head><meta name="viewport" content="width=device-width, initial-scale=1">\n' + prefix
# The source did not include explicit html/head/body tags. Keep the standalone
# document valid while preserving its existing presentation framework.
prefix = prefix.replace('</style>', '</style>\n</head><body>', 1)
prefix = prefix.replace('<title>Deck Pemasaran Melooloo</title>', '<title>Melooloo | Strategi Pemasaran · 36 Slide</title>')
prefix = prefix.replace('</style>', '''
/* Standalone main-slide compositions, aligned with the Sidang Akhir deep-green/cream system. */
.m36-main .title{font-family:Arial,Helvetica,sans-serif;font-weight:750;letter-spacing:-.05em;line-height:1.08}
.m36-body{display:flex;flex-direction:column;gap:16px}
.m36-three{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;min-height:0;flex:1}
.m36-panel{box-sizing:border-box;min-width:0;background:#fffdf7;border:1px solid var(--rule);border-top:6px solid var(--ink);border-radius:12px;padding:20px 22px;display:flex;flex-direction:column;gap:12px;overflow:hidden}
.m36-panel.highlighted{background:var(--flesh);border:3px solid var(--melon)}
.m36-panel .lbl{font-size:24px;line-height:30px;margin-bottom:4px}
.m36-panel small{font:700 15px/20px var(--body);letter-spacing:.08em;color:var(--melon-ink)}
.m36-mini{font:400 15px/22px var(--body);color:var(--mute);margin-top:auto;border-top:1px solid var(--rule);padding-top:10px}
.m36-dual{display:grid;grid-template-rows:1fr 1fr;gap:10px;flex:1}
.m36-dual>div{background:var(--rival-lt);padding:14px 18px;border-radius:10px;display:flex;flex-direction:column}
.m36-dual>div.accent{background:#e5f0d0}
.m36-dual strong{font:800 66px/1 var(--display);color:var(--ink)}
.m36-dual span{font-size:19px;font-weight:700}.m36-dual p{font-size:18px;line-height:26px;margin:8px 0 0}
.m36-problem{background:var(--flesh);border-radius:12px;padding:24px;font:800 34px/42px var(--display);color:var(--ink)}
.m36-problem em{font-style:normal;text-decoration:underline;text-decoration-color:var(--melon);text-decoration-thickness:5px}
.m36-numbers{display:grid;grid-template-columns:1fr 1fr;gap:10px;flex:1}
.m36-numbers>div{background:#fff;border:1px solid var(--rule);border-radius:10px;padding:20px 14px;display:flex;flex-direction:column;justify-content:center}
.m36-numbers strong{font:800 46px/1 var(--display);color:var(--ink)}.m36-numbers span{font-size:18px;line-height:24px;margin-top:8px}
.m36-funnel{display:flex;flex-direction:column;gap:7px;flex:1}
.m36-funnel>div{display:flex;flex-direction:column;background:var(--rival-lt);border-radius:8px;padding:9px 16px;min-height:0}.m36-funnel>div:nth-child(2){margin-left:7%}.m36-funnel>div:nth-child(3){margin-left:14%}.m36-funnel>.hit{margin-left:21%;background:var(--melon)}
.m36-funnel strong{font:800 27px/32px var(--display);color:var(--ink)}.m36-funnel span{font-size:16px;line-height:22px}
.m36-sub{font:italic 22px/30px var(--body);color:var(--ink)}
.m36-m2{flex:1}.m36-map{width:100%;height:220px;object-fit:contain;background:white;border:1px solid var(--rule);border-radius:8px}
.m36-compare{display:grid;grid-template-columns:1fr 34px 1fr;gap:6px;align-items:center;text-align:center;background:#f0f1e9;padding:12px;border-radius:8px}
.m36-compare div{display:flex;flex-direction:column}.m36-compare strong{font:800 34px var(--display);color:var(--ink)}.m36-compare span{font-size:14px;line-height:20px}.m36-compare b{font-size:20px;color:var(--mute)}
.m36-tagline{font:800 29px var(--display);color:var(--ink)}.m36-pop,.m36-pod{border-radius:10px;padding:16px 18px}.m36-pop{border:1px solid var(--rival);background:#fff}.m36-pod{border:3px solid var(--melon);background:var(--flesh);flex:1}
.m36-pop p,.m36-pod p{font-size:18px;line-height:25px;margin:8px 0 0}.m36-pod p{border-top:1px solid rgba(18,57,31,.2);padding-top:8px}
.m36-phone{width:310px;align-self:center;border:13px solid var(--ink);border-radius:30px;background:var(--cream);padding:12px 17px;display:flex;flex-direction:column;gap:6px;font-size:14px;line-height:19px;box-shadow:0 8px 24px rgba(12,42,27,.16)}
.m36-phone-head{margin:-12px -17px 4px;padding:14px 18px;background:var(--ink);color:white;font-size:15px}.m36-phone strong{font-size:19px;color:var(--ink)}.m36-phone>div:not(.m36-phone-head){border-bottom:1px solid var(--rule);padding-bottom:5px}.m36-phone span{background:var(--melon);padding:8px;text-align:center;font-weight:700}.m36-phone em{font-style:normal;color:var(--mute)}
.m36-phone svg{display:block;width:100%;height:24px;margin-top:2px}
.m36-ribbon{border-top:2px solid var(--rule);padding:8px 0;font-size:16px;line-height:22px;color:var(--ink)}.m36-ribbon span{float:right;color:var(--mute);font-size:13px}
.m36-price{height:230px;background:#fffdf7;border:1px solid var(--rule);border-radius:12px;padding:18px 22px}.m36-price-head{display:flex;justify-content:space-between;font-size:20px}.m36-price-head em{font-size:14px;font-style:normal;border:1px solid var(--ink);border-radius:20px;padding:3px 8px}
.m36-price-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:12px;align-items:stretch;margin-top:20px}.m36-price-grid>div{border-top:3px solid var(--rival);padding-top:14px;display:flex;flex-direction:column;gap:8px}.m36-price-grid>div.cost{border-left:3px dashed var(--ink);border-top:0;padding-left:12px}.m36-price-grid>div.me{border-color:var(--melon)}.m36-price-grid>div.break{border-color:var(--rival);border-left:4px double var(--ink);padding-left:12px}
.m36-price-grid small{font-size:13px}.m36-price-grid strong{font:800 26px/32px var(--display);color:var(--ink)}.m36-price-grid .me strong{color:var(--melon-ink)}.m36-price-grid span{font-size:14px;line-height:18px}
.m36-m3-bottom,.m36-m4-bottom{display:grid;grid-template-columns:1fr 1fr;gap:24px;min-height:0;flex:1}.m36-product-row{display:flex;align-items:center;gap:20px;border-top:1px solid var(--rule);padding:8px 0}.m36-product-row img{width:110px;height:90px;object-fit:cover;border-radius:8px}.m36-product-row div{display:flex;flex-direction:column;gap:5px}.m36-product-row strong{font-size:22px;color:var(--ink)}.m36-product-row span{font-size:18px;line-height:24px}.m36-dark-band{background:var(--ink);color:white;padding:11px 18px;font-weight:700;font-size:20px;border-radius:8px}
.m36-proof-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;flex:1}.m36-proof-grid>div{background:var(--flesh);padding:20px;display:flex;flex-direction:column;justify-content:center;gap:12px;border-radius:8px}.m36-proof-grid strong{font:800 38px/1 var(--display);color:var(--ink)}.m36-proof-grid span{font-size:17px;line-height:25px}
.m36-timeline{height:170px;display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.m36-timeline>div{border-top:5px solid var(--ink);background:#fffdf7;padding:14px 22px}.m36-timeline small{display:block;color:var(--melon-ink);font-weight:700;font-size:16px}.m36-timeline strong{display:block;font:800 25px var(--display);color:var(--ink)}.m36-timeline p{font-size:17px;line-height:24px;margin:5px 0}
.m36-mix{display:grid;grid-template-columns:110px 1fr;gap:10px;align-items:center;margin:17px 0}.m36-mix>span{font-size:19px;font-weight:700}.m36-mix>div{display:flex;height:60px;overflow:hidden;border-radius:7px}.m36-mix i,.m36-mix b{box-sizing:border-box;display:flex;align-items:center;justify-content:center;font:800 20px var(--display);font-style:normal}.m36-mix i{background:var(--rival-lt)}.m36-mix b{background:var(--melon)}
.m36-badge{font-size:13px;font-style:normal;border:1px solid var(--ink);border-radius:20px;padding:1px 8px}.m36-imc{display:flex;flex-direction:column;gap:5px}.m36-imc>div{display:grid;grid-template-columns:135px 100px 1fr;gap:8px;align-items:center;border-top:1px solid var(--rule);padding:8px 0;font-size:15px;line-height:21px}.m36-imc strong{font-size:19px;color:var(--ink)}.m36-outcome{margin-top:auto;background:var(--flesh);border-radius:8px;padding:11px 16px;display:flex;align-items:center;gap:18px}.m36-outcome strong{font:800 27px var(--display);white-space:nowrap}.m36-outcome span{font-size:16px;line-height:22px}
.m36-journey .m36-panel>p{font-size:18px;line-height:27px;min-height:90px}.m36-step{background:var(--ink);color:white;padding:13px 20px;font:800 26px var(--display);clip-path:polygon(0 0,95% 0,100% 50%,95% 100%,0 100%)}.m36-jnum{padding:12px 0;border-top:1px solid var(--rule);display:flex;flex-direction:column;gap:5px}.m36-jnum strong{font:800 36px/1 var(--display);color:var(--ink)}.m36-jnum span{font-size:18px;line-height:25px}
.m36-econ{display:flex;flex-direction:column;gap:14px;flex:1}.m36-econ>div{background:var(--flesh);border-radius:8px;padding:17px;display:flex;flex-direction:column;gap:6px}.m36-econ strong{font:800 35px/1.1 var(--display);color:var(--ink)}.m36-econ span{font-size:17px}.m36-revenue{font-size:17px;line-height:26px;background:#e7efd8;padding:11px 15px;border-radius:8px}
.m36-chart{position:relative;height:315px;padding:18px 4px 0 34px;box-sizing:border-box}.m36-chart svg{width:100%;height:260px}.m36-yaxis{position:absolute;top:30px;bottom:46px;left:0;display:flex;flex-direction:column;justify-content:space-between;font-size:14px}.m36-xaxis{display:flex;justify-content:space-between;font-size:12px;font-weight:700}.m36-gates{display:flex;flex-direction:column;gap:15px;flex:1}.m36-gates>div{border-left:7px solid var(--melon);background:#edf1e5;padding:18px;display:flex;flex-direction:column;gap:7px}.m36-gates b{font-size:16px;color:var(--melon-ink)}.m36-gates strong{font:800 25px/1.1 var(--display);color:var(--ink)}.m36-gates span{font-size:18px;line-height:24px}
.m36-chart-values{font-size:13px;font-weight:700;color:var(--ink);margin-top:6px}
.t-source{position:absolute;z-index:5;bottom:8px;left:48px;right:48px;color:#eef6e5;background:rgba(18,57,31,.88);border-radius:5px;padding:5px 10px;font:600 13px/18px var(--body)}
.m36-grocery{width:100%;height:100%;box-sizing:border-box;background:#f8f7ed;padding:14px;display:flex;flex-direction:column;gap:7px;font:700 15px var(--body);color:var(--ink)}.m36-grocery div{background:var(--ink);color:white;padding:4px 8px}.m36-grocery span{background:#fff;border:1px solid var(--rule);padding:9px}.m36-grocery b{align-self:end;background:var(--melon);padding:4px 8px}.m36-run{height:100%;position:relative}.m36-run img{width:100%;height:100%;object-fit:cover;border-radius:14px}.m36-run span{position:absolute;bottom:8px;left:8px;background:rgba(18,57,31,.85);color:white;padding:5px 8px;border-radius:4px;font-size:12px}
.news a{color:inherit;text-decoration:underline;text-decoration-color:var(--melon)}.news a:hover{color:var(--melon-ink)}
.review .frag,.review .frag .rise,.review .frag .grow-x,.review .frag .grow-y,.review .frag .grow-c,.review .slide .title{opacity:1!important;transform:none!important;transition:none!important;animation:none!important;clip-path:none!important}
.viewport{bottom:60px}
.embed .bar-ui,.embed .notes,.embed .ov{display:none!important}
.embed .viewport{inset:0}.embed .stage{box-shadow:none}
</style>''', 1)

# Update the existing presenter controls and notes for the new 36-page order.
suffix = suffix.replace('1 / 28', '1 / 36')
suffix = suffix.replace('if(!withT&&curId===\'T\') show(\'C3\')', "if(!withT&&curId==='T') show('M3')")
suffix = suffix.replace("show('BX')", "show('B1')")
suffix = suffix.replace("var ix=$('ix');", "var ix=document.createElement('div');")
suffix = suffix.replace('var withT=store.get(\'mlo-withT\',true);', "var withT=true;")
suffix = suffix.replace("var stepMode=store.get('mlo-step',true), withT=store.get('mlo-withT',true);", "var stepMode=store.get('mlo-step',false), withT=true;")
suffix = suffix.replace("function list(){return slides.filter(function(s){return withT||s.id!=='T'})}", "function list(){return slides}")
suffix = suffix.replace("$('withT').addEventListener('change',function(e){ withT=e.target.checked; store.set('mlo-withT',withT); if(!withT&&curId==='T') show('M3'); else ui() });", "$('withT').disabled=true;")
suffix = suffix.replace('Sertakan slide T (merek, setelah 2.2)', 'Slide T termasuk dalam 36 halaman')
suffix = suffix.replace('Slide tambahan (setelah 2.3)', 'Slide merek (setelah M2)')
suffix = suffix.replace("else if(opts.full||reduce.matches){", "else if(opts.full||reduce.matches||location.search.includes('review=1')){")
suffix = suffix.replace("var root=document.documentElement; root.classList.add('js');", "var root=document.documentElement; root.classList.add('js'); if(location.search.includes('review=1')) root.classList.add('review'); if(location.search.includes('embed=1')) root.classList.add('embed');")
suffix = suffix.replace("M0:{say:'Pembuka bagian pemasaran: sebutkan nama dan peran, lalu empat pertanyaan yang dijawab bagian ini.'},", "M0:{say:'Pembuka bagian pemasaran: empat pertanyaan dari pembeli dan pasar sampai anggaran.'},\n    M1:{say:'Pembeli kami sudah membeli melon premium hari ini, tetapi rasa baru diketahui setelah dibelah. Survei n=253 menunjukkan 94,5% memilih berdasarkan kemanisan dan 79% tertarik pada melon sebagai hadiah. Dengan 85,5 ton SOM Tahun 1, kami memerlukan 4–6% dari estimasi SAM premium DKI.',next:'Pembelinya ada. Pertanyaan berikutnya: mengapa mereka memilih kami?'},\n    M2:{say:'Riset kami belum mengidentifikasi pemasok melon premium berbasis greenhouse di dalam DKI. Brix 15 dan jaring rapi adalah syarat dasar; pembeda yang direncanakan ialah pengiriman kurang dari 24 jam, kebun yang bisa dikunjungi, dan QR berisi data lot.',avoid:'Jangan menyebut satu-satunya pemasok, Brix unik, atau kapasitas satu pesaing sebagai seluruh pasokan pesaing.',next:'Mutu yang bisa dibuktikan memberi kami ruang harga.'},\n    M3:{say:'Harga B2B Rp75.000/kg dan langsung setara Rp99.000/kg berada di atas HPP Rp28.658/kg; margin kotor model sekitar 62% dan 71%. Gift Edition Rp535.000/box. WTP 45,8% berlaku untuk Rp100.000 per buah, bukan harga Gift Edition.',next:'Harga dan format sudah jelas; ini urutan mendapatkan pembeli.'},\n    M4:{say:'Kontrak B2B menjadi lantai volume. B2C ditargetkan naik dari 32% volume Grade A Tahun 1 ke 60% Tahun 5. IMC Y1 Rp768 juta dibagi antara pengalaman, digital dan CRM, kredibilitas, dan penjualan B2B.',avoid:'K3/K4 Tahun 0 dan pelanggan baru adalah target model, bukan bukti realisasi.',next:'Setiap aktivitas tadi punya target yang bisa diperiksa.'},\n    M5:{say:'Target aided awareness SES A/A+ Jabodetabek naik 10% ke 40%; pelanggan B2C aktif 3.303 ke 10.909; retensi B2C 35% ke 58% dari Tahun 1 ke 5.',next:'Dan semua target itu dicapai dengan biaya yang terkendali.'},\n    M6:{say:'Anggaran Y1 Rp768 juta atau 10,3% pendapatan, turun menjadi 5,9% pada Y5. Ada tiga gerbang: pra-pesan, evaluasi program Tahun 1, dan penjualan penuh Grade A sebelum ekspansi. NMC adalah proyeksi kontribusi, bukan ROI iklan inkremental.',next:'Angka pendapatan ini menjadi dasar proyeksi keuangan.'},")

presenter_notes = {
  'M0': {'say':'Pembuka bagian pemasaran: empat pertanyaan dari pembeli dan pasar sampai anggaran.'},
  'M1': {'say':'Pasar premium DKI diperkirakan 1.460–2.190 ton/tahun. SOM Y1 85,5 ton adalah 4–6% dari rentang itu. Angka survei berasal dari n=253 responden; seluruh volume adalah estimasi dan target.', 'next':'Pembelinya ada. Pertanyaan berikutnya: mengapa mereka memilih kami?'},
  'M2': {'say':'Brix 15, jaring rapi, dan residu aman adalah syarat kategori. Pengiriman kurang dari 24 jam, kunjungan kebun, dan QR data lot adalah pembeda yang direncanakan.', 'avoid':'Jangan mengklaim satu-satunya pemasok di DKI atau menyebut konsep sebagai operasi yang sudah berjalan.', 'next':'Mutu yang bisa dibuktikan memberi kami ruang harga.'},
  'T': {'say':'Merek dirancang agar pelanggan dapat mencicipi, melihat kebun, dan memeriksa data lot melalui QR. Aktivasi dan tampilan ini masih rencana.', 'next':'Mutu yang bisa dibuktikan memberi kami ruang harga.'},
  'M3': {'say':'Harga model B2B Rp75.000/kg dan langsung Rp99.000/kg. Gift Edition Rp535.000/box. Angka 45,8% WTP adalah untuk Rp100.000 per buah, bukan harga Gift Edition.', 'next':'Harga dan format sudah jelas; ini urutan kami mendapatkan pembeli.'},
  'M4': {'say':'B2B direncanakan sebagai lantai volume. B2C naik dari 32% volume Grade A Y1 ke 60% Y5 dalam model. IMC Y1 total Rp768 juta.', 'avoid':'K3/K4 Y0 serta pelanggan baru adalah target, bukan realisasi.', 'next':'Setiap aktivitas tadi punya target yang bisa diperiksa.'},
  'M5': {'say':'Ukur kenal, coba/beli, dan setia. Aided awareness SES A/A+ Jabodetabek ditargetkan 10% ke 40%; pelanggan B2C aktif 3.303 ke 10.909; retensi 35% ke 58% dari Y1 ke Y5.', 'next':'Dan semua target itu dicapai dengan biaya yang terkendali.'},
  'M6': {'say':'Anggaran Y1 Rp768 juta atau 10,3% pendapatan, turun menjadi 5,9% pada Y5. NMC adalah proyeksi kontribusi pemasaran, bukan ROI iklan inkremental.', 'next':'Angka pendapatan ini pula yang menjadi dasar proyeksi keuangan.'},
  'B25': {'say':'Lima kanal ini adalah rancangan distribusi. Foto hidangan hotel dan pengiriman Weekly adalah ilustrasi konsep; hotel dan ritel yang disebut adalah target penjualan, bukan mitra aktif.'},
  'B26': {'say':'Situs, CRM, dan halaman QR adalah rancangan produk digital. Anggaran Y1 Rp20 juta berasal dari model; tidak menunjukkan situs dan pelacakan individual sudah beroperasi.'},
  'B27': {'say':'Jepang memberi contoh budaya hadiah buah premium. Harga lelang Yūbari adalah publisitas dan tidak dibandingkan langsung dengan harga ritel Melooloo. Untuk Jakarta, sumbernya adalah listing penjual dan minat survei, belum pembelian Gift Edition yang diamati.'},
  'B28': {'say':'Pilot studio pada K4 Y0 dan enam mitra Y1 adalah rencana. Perhitungan 80 anggota × 25% konversi adalah asumsi model, bukan hasil aktivitas. Evaluasi Y1 menggunakan target 800 pelanggan program dan retensi 35%.'}
}
suffix = re.sub(r'var NOTES=\{.*?\n  \};', 'var NOTES=' + json.dumps(presenter_notes, ensure_ascii=False) + ';', suffix, count=1, flags=re.S)

all_slides = '\n\n'.join(sections[code] for code in keep)
output = prefix + all_slides + suffix + '\n</body></html>\n'
output = output.replace('<!-- B21 -->\n\n\n', '')
(HERE / 'index.html').write_text(output)
print(f'Wrote {HERE / "index.html"} with {len(keep)} slides')

# The separate backup review contains only B1–B28. The complete set remains
# in index.html for cross-reference.
backup_codes = [f'B{i}' for i in range(1,29)]
backup = prefix + '\n\n'.join(sections[code] for code in backup_codes) + suffix + '\n</body></html>\n'
backup = backup.replace('Melooloo | Strategi Pemasaran · 36 Slide', 'Melooloo | Cadangan Pemasaran · 28 Slide')
backup = backup.replace('1 / 36', '1 / 28').replace('Slide T termasuk dalam 36 halaman', '28 halaman cadangan')
backup = backup.replace("$('M0').classList.remove('active');", "$('B1').classList.remove('active');")
backup = backup.replace("if(!el||!el.classList.contains('slide')) id='M0';", "if(!el||!el.classList.contains('slide')) id='B1';")
(HERE / 'backup.html').write_text(backup)
print(f'Wrote {HERE / "backup.html"} with {len(backup_codes)} backup slides')
