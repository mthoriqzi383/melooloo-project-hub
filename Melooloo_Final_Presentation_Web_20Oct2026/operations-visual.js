(() => {
  'use strict';
  const E = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const image = name => name.startsWith('assets/') ? name : `assets/editorial/${name}${name.includes('.')?'':'.jpg'}?v=visual-refresh-1`;
  const photo = (name, label) => `<div class="ops-photo"><img src="${image(name)}" alt="${E(label)}" loading="eager"><span>VISUALISASI KONSEP · BUKAN FASILITAS TERPASANG</span></div>`;
  const metric = (value, label, detail='') => `<div class="ops-metric"><strong>${value}</strong><span>${E(label)}</span>${detail?`<small>${E(detail)}</small>`:''}</div>`;
  const panel = () => `<div class="ops-beat-panel" aria-live="polite"><small data-beat-number>01 / 04</small><strong data-beat-title></strong><p data-beat-description></p><em>KLIK TAHAP ATAU TEKAN →</em></div>`;
  const scene = (n, heading, body, note='', interactive=false) => `<div class="vscene ops-scene ops-${n}${interactive?' ops-interactive':''}"${interactive?` data-interactive-slide="${n}"`:''}>${heading}<div class="ops-content">${body}</div></div>`;

  function supply(heading) {
    const sites = `<div class="ops-site"><small>LOKASI A · USULAN</small><div class="ops-site-plan" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><strong>Rooftop Jakarta</strong><span>modul greenhouse · bagian dari 35 unit awal</span></div><div class="ops-site"><small>LOKASI B · USULAN</small><div class="ops-site-plan" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><strong>Rooftop Jakarta</strong><span>lokasi kedua menjaga kontinuitas panen</span></div>`;
    const vendors = [['01','BENIH','Fujisawa RZ F1 · kontrak + stok 2 siklus'],['02','NUTRISI & IoT','AB Mix / sensor · sedikitnya 2 vendor'],['03','PENGIRIMAN','Cold chain + armada cadangan']];
    return scene(21,heading,`<div class="ops-supply-route"><div class="ops-supply-sites">${sites}</div><div class="ops-supply-arrow">PANEN PAGI <b>→</b> SORTIR & DINGINKAN <b>→</b> MITRA B2B <strong>&lt;12 JAM</strong></div><div class="ops-supply-vendors">${vendors.map(([n,k,v])=>`<div><small>${n} / TIER PEMASOK</small><strong>${k}</strong><span>${v}</span></div>`).join('')}</div></div>`,`Skema modul ilustratif, bukan pembagian 35 unit. Titik rooftop dan SLA perlu verifikasi lapangan.`);
  }
  function cost(heading) {
    return scene(23,heading,`<div class="ops-cost-left"><small>MEMBANGUN · CAPEX TAHUN 0</small><strong>Rp7.503 <em>juta</em></strong><div class="ops-cost-bar"><span style="width:67.5%"></span></div><p>Rp5.066 juta untuk 35 greenhouse · 67,5% dari CAPEX Y0.</p><div class="ops-cost-foot">Termasuk Rp479 juta modal kerja praoperasi pada tabel Mery.</div></div><div class="ops-cost-right"><div><small>MENJALANKAN · OPEX Y0</small><strong>Rp3.137 <em>juta</em></strong><span>gaji, sewa, logistik, overhead, pemasaran</span></div><div><small>OPERASI Y1 · KAPASITAS PENUH AWAL</small><strong>Rp3.808 <em>juta</em></strong><span>OPEX · 35 unit · 4 siklus panen</span></div></div>`,`Angka mengikuti PowerPoint Keuangan Mery halaman 5; diagram biaya pada Canva menggunakan model lama.`);
  }
  function priorities(heading) {
    const rows=[
      ['Kualitas','SANGAT TINGGI','Satu tanaman, satu buah; benih unggul dan kendali Brix.'],
      ['Keandalan','TINGGI','Iklim terpantau, listrik cadangan, jadwal panen terjaga.'],
      ['Kecepatan','TINGGI','Kebun dekat pasar, panen pagi, target kirim B2B <12 jam.'],
      ['Fleksibilitas','SEDANG','Greenhouse modular; kapasitas dan kanal dapat ditambah bertahap.'],
      ['Biaya','SEDANG','Efisiensi air dan susut produk membantu menyerap investasi awal.']
    ];
    return scene(24,heading,`<div class="ops-priority-head"><span>OBJECTIVE</span><span>PRIORITAS</span><span>KEPUTUSAN OPERASI</span></div><div class="ops-priority-rows">${rows.map(([name,rank,why],i)=>`<div><b>${String(i+1).padStart(2,'0')}</b><strong>${name}</strong><em class="${i<3?'ops-rank-high':''}">${rank}</em><span>${why}</span></div>`).join('')}</div>`,`Lima dimensi dari matriks strategi operasi; target mutu dan ketepatan perlu diuji saat fasilitas berjalan.`);
  }
  function team(heading) {
    const groups=[
      ['01','AGRONOMI','Standar budidaya · one plant one fruit · Brix dan grading','Head of Agronomy & Quality'],
      ['02','TEKNOLOGI & IoT','Kalibrasi sensor · alarm · irigasi · rekam data','Smart Greenhouse & IoT Lead'],
      ['03','LOGISTIK','Jadwal panen · cold chain · serah terima ritel','Distribusi & fulfillment']
    ];
    return scene(25,heading,`<div class="ops-team-axis"><span>DATA & SOP TERPUSAT</span><b>↓</b><strong>SATU STANDAR MUTU</strong></div><div class="ops-team-grid">${groups.map(([n,title,work,role])=>`<div><small>${n} / FUNGSI</small><strong>${title}</strong><p>${work}</p><span>${role}</span></div>`).join('')}</div>`,`Struktur fungsi tetap relevan; kebutuhan headcount pada Canva mengikuti skenario kapasitas lama dan perlu dihitung ulang untuk 237 GH.`);
  }
  function supplyRisk(heading) {
    const rows=[
      ['Benih Fujisawa','Tinggi','Rendah','Kontrak tahunan; varietas alternatif; stok ≥2 siklus'],
      ['Nutrisi AB Mix','Sedang','Sedang','≥2 vendor; kontrak harga; kaji formula sendiri'],
      ['Cold chain','Tinggi','Sedang','2 mitra logistik; armada internal sebagai cadangan'],
      ['Sensor / IoT','Sedang','Sedang','Suku cadang kritis; servis preventif; operator terlatih'],
      ['Konstruksi GH','Tinggi','Rendah','2–3 kontraktor; buffer proyek 20%; supervisi internal']
    ];
    return scene(26,heading,`<div class="ops-table ops-risk-matrix"><div class="ops-table-head"><span>RISIKO</span><span>DAMPAK</span><span>PELUANG</span><span>PERTAHANAN</span></div>${rows.map((r,i)=>`<div class="ops-table-row"><b>${String(i+1).padStart(2,'0')}</b><strong>${r[0]}</strong><em>${r[1]}</em><em>${r[2]}</em><span>${r[3]}</span></div>`).join('')}</div>`,`Matriks sumber mengutamakan mitigasi pada risiko dengan dampak dan probabilitas minimal sedang.`);
  }
  function agenda(heading) {
    const items=[
      ['01','Greenhouse dan cara kerjanya','200 m²','Satu modul','Geometri dan alat di dalam GH'],
      ['02','Hasil panen dan pertumbuhannya','50 → 817 t','Skala','Panen dari Y0 sampai Y10'],
      ['03','parameter kunci dan cara kontrolnya','4 parameter','Mutu','Iklim, pH, dan nutrisi'],
      ['04','Metode penanaman','8 tahap','Ritme kerja','Dari semai sampai sanitasi'],
      ['05','perhitungan siklus','73 hari','Siklus','Mengapa lima panen mungkin'],
      ['06','R&D dan Pembeda','Rp4.250 jt','Benih','Program R&D bertahap']
    ];
    return scene(28,heading,`<div class="ops-agenda-grid">${items.map(([n,topic,value,name,detail])=>`<div><small>${n} / ${E(topic)}</small><strong>${value}</strong><b>${name}</b><span>${detail}</span></div>`).join('')}</div>`,`Enam topik operasi pada rangkaian berikutnya.`);
  }
  function unit(heading) {
    return scene(29,heading,`<div class="ops-unit-photo">${photo('assets/hero-greenhouse.png','Visualisasi interior satu modul greenhouse Melooloo')}<div class="ops-unit-stamp">10 m × 20 m</div></div><div class="ops-unit-right"><div class="ops-unit-metrics">${metric('200 m²','luas modul')}${metric('140 m²','area ditanami')}${metric('14 × 30','baris × tanaman')}${metric('420','titik tanam')}</div><div class="ops-unit-detail"><small>GEOMETRI YANG MENENTUKAN</small><span>DFT 3 inci · pipa 0,8 m dari lantai · jalur kerja 80 cm · jarak tanam 40–50 cm · trellis 2,5 m · atap 4,5 m.</span></div></div>`,`Satu tanaman satu buah · Fujisawa RZ F1 · hasil model 3.591 kg per unit per tahun pada 5 siklus.`);
  }
  function technology(heading) {
    return scene(30,heading,`<div class="ops-tech-photo">${photo('technology-dosing-v1.png','Visualisasi realistis tangki nutrisi, probe dan pompa greenhouse')}<div class="ops-tech-pin pin-tank"><b>01</b><span>TANGKI NUTRISI</span></div><div class="ops-tech-pin pin-probe"><b>02</b><span>PROBE pH / EC</span></div><div class="ops-tech-pin pin-pump"><b>03</b><span>POMPA &amp; PIPA</span></div></div><div class="ops-tech-rail"><div><small>01 / BUDIDAYA</small><strong>DFT + trellis</strong><span>Larutan berputar; buah ditopang vertikal.</span></div><div><small>02 / HASIL</small><strong>1 tanaman → 1 buah</strong><span>420 tanaman × 1,8 kg × 95% = 718,2 kg/siklus.</span></div><div><small>03 / PEMANTAUAN</small><strong>4 parameter</strong><span>Suhu · kelembapan · pH · EC/TDS.</span></div><div><small>04 / KONTINUITAS</small><strong>1.200 W</strong><span>Genset cadangan untuk sirkulasi nutrisi.</span></div></div>`,`Rancangan modular 200 m²; lima siklus memproyeksikan 3.591 kg per unit per tahun.`);
  }
  function controls(heading) {
    const rows=[
      ['Suhu','25–30°C siang · 18–22°C malam','Blower + exhaust','OTOMATIS','Rp1,75 jt/unit'],
      ['Kelembapan','60–70% tumbuh · 50–60% buah','Dehumidifier','OTOMATIS','Rp13 jt/unit'],
      ['pH','5,8–6,5','Sensor rendam + pH up/down','MANUAL 2×/HARI','Rp350 rb/unit'],
      ['EC / TDS','900–1.750 ppm','Sensor rendam + AB Mix / RO','MANUAL 2×/HARI','Rp350 rb/unit']
    ];
    return scene(31,heading,`<div class="ops-control-table"><div class="ops-control-head"><span>PARAMETER</span><span>TARGET</span><span>ALAT</span><span>MODE</span><span>ESTIMASI BIAYA</span></div>${rows.map((r,i)=>`<button type="button" data-beat-target="${i}" class="ops-control-row"><strong>${r[0]}</strong><span>${r[1]}</span><span>${r[2]}</span><b>${r[3]}</b><em>${r[4]}</em></button>`).join('')}</div><div class="ops-control-bottom"><div><strong>3 titik / GH</strong><span>sensor IoT + ESP32 · alarm ke operator · estimasi Rp15 jt/GH</span></div><div><strong>1.200 W</strong><span>genset cadangan · pompa nutrisi tetap berjalan</span></div>${panel()}</div>`,`Dua kontrol otomatis, dua koreksi nutrisi oleh operator. Harga alat merupakan estimasi rencana.`,true);
  }
  function dft(heading) {
    return scene(32,heading,`<div class="ops-dft-loop"><div class="ops-dft-node"><small>01</small><strong>BAK A+B</strong><span>stok pekat terpisah</span></div><b>→</b><div class="ops-dft-node"><small>02</small><strong>POMPA</strong><span>cadangan daya 1.200 W</span></div><b>→</b><div class="ops-dft-node"><small>03</small><strong>PIPA DFT</strong><span>akar terendam 24 jam</span></div><b>↻</b><div class="ops-dft-node"><small>04</small><strong>KEMBALI</strong><span>larutan balik ke bak</span></div></div><div class="ops-dft-bottom"><div>${metric('45–60 L','estimasi air per kg melon')}${metric('80–85%','target penghematan air')}</div><div><small>KELEMAHAN YANG DIJAGA</small><p>Satu jalur berbagi larutan. Bibit lemah disaring di nursery (5–10%); pompa dan listrik harus punya cadangan.</p></div></div>`,`Penghematan air dan risiko gagal panen adalah sasaran perencanaan, bukan hasil fasilitas yang sudah berjalan.`);
  }
  function growth(heading) {
    const tons=[50.3,100.5,162.3,223.4,284.4,345.5,421.6,490.5,576,706,816.6];
    const units=[35,35,52,69,86,103,127,143,172,213,237];
    const milestones=[['Y0','50,3 t','35 GH · 2 siklus trial'],['Y2','162,3 t','52 GH · 3 lokasi · 5 siklus'],['Y6','421,6 t','127 GH · masuk Surabaya'],['Y10','816,6 t','237 GH · Jakarta, Surabaya, Bali']];
    return scene(33,heading,`<div class="ops-growth-head"><strong>50,3 → 816,6 <em>ton/tahun</em></strong><span>35 → 237 GREENHOUSE · Y0–Y10</span></div><div class="ops-growth-plot">${tons.map((v,i)=>`<div class="ops-growth-col" style="--bar-height:${(v/816.6*100).toFixed(1)}%"><span>${i===0||i===2||i===6||i===10?String(v).replace('.',','):''}</span><i style="height:${(v/816.6*100).toFixed(1)}%" class="${i>=9?'is-bali':i>=6?'is-surabaya':''}"></i><small>Y${i}</small></div>`).join('')}</div><div class="ops-growth-units">${units.map((v,i)=>`<span>${v}</span>`).join('')}</div><div class="ops-growth-milestones">${milestones.map((m,i)=>`<button type="button" data-beat-target="${i}"><b>${m[0]}</b><strong>${m[1]}</strong></button>`).join('')}${panel()}</div>`,`Produksi memuat faktor yield 95%; greenhouse baru dihitung hanya 3 siklus pada tahun pertamanya.`,true);
  }
  function replication(heading) {
    return scene(34,heading,`<div class="ops-replication-big">${metric('16,2×','pertumbuhan tonase · 50,3 ke 816,6')}${metric('6,8×','pertumbuhan modul · 35 ke 237')}${metric('0,71','rasio pertumbuhan biaya tetap terhadap volume')}</div><div class="ops-replication-track"><small>MESIN SKALA</small><div><span>Y2–Y5</span><strong>+17 GH / TAHUN</strong></div><b>→</b><div><span>JAKARTA</span><strong>17–18 / ATAP</strong></div><b>→</b><div><span>EKSPANSI</span><strong>20–41 / LAHAN</strong></div></div>`,`Model sumber menggandakan modul standar; rasio 0,71 adalah proyeksi, bukan penghematan yang sudah terukur.`);
  }
  function pillars(heading) {
    const columns=[
      ['BANYAK','237 unit','11 lokasi · 3 kota',['816,6 t panen Y10','5 siklus/unit/tahun','jeda tanam 4 hari']],
      ['SERAGAM','4 parameter','suhu · lembap · pH · nutrisi',['<10% beda hasil antarlokasi','>15° target Brix','90% target Grade A']],
      ['AMAN','Setiap hari','petani memeriksa tanaman',['10 titik acak / unit','2 perangkap / unit','3 tingkat protokol wabah']]
    ];
    return scene(35,heading,`<div class="ops-pillars">${columns.map(([title,big,sub,bullets],i)=>`<div class="ops-pillar ops-pillar-${i}"><small>0${i+1} / ${title}</small><strong>${big}</strong><span>${sub}</span><ul>${bullets.map(s=>`<li>${s}</li>`).join('')}</ul></div>`).join('')}</div>`,`Jumlah dari modul · keseragaman dari parameter · keamanan dari inspeksi manusia dan protokol.`);
  }

  function sweetness(heading) {
    const stages=[
      ['01','DAUN & AKAR','900–1.100','60–70%','Batang kuat, daun cukup'],
      ['02','BUNGA & PENTIL','1.100–1.300','60–70%','Serbuki; pilih satu buah'],
      ['03','BUAH MEMBESAR','1.300–1.500','50–60%','Bobot menuju 1,8 kg'],
      ['04','PEMATANGAN','1.500–1.750','50–60%','Gula naik 10–14 hari akhir']
    ];
    return scene(36,heading,`<div class="ops-sweet-track">${stages.map(([n,name,ppm,rh,purpose],i)=>`<div class="ops-sweet-stage"><small>${n} / ${name}</small><strong>${ppm}</strong><em>ppm nutrisi</em><div><b>${rh}</b><span>kelembapan</span></div><p>${purpose}</p></div>`).join('')}</div><div class="ops-sweet-footer"><div><strong>&gt;15° BRIX</strong><span>target mutu produk</span></div><p>DFT menjaga akar terendam. Pematangan mengatur konsentrasi nutrisi bertahap; rencana uji Brix per batch menjadi verifikasi target kemanisan.</p></div>`,`Target parameter sama untuk setiap lokasi; sasaran beda hasil antarlokasi di bawah 10%.`);
  }
  function intervention(heading) {
    const bands=[
      ['<5','PANTAU','catat jumlah per perangkap per minggu'],
      ['5–15','WASPADA','agens hayati setelah inspeksi'],
      ['>15','TINDAK','tindakan berizin sesuai protokol']
    ];
    const outbreak=[
      ['1–3 tanaman','CABUT & TANDAI','awasi radius 2 m selama seminggu'],
      ['4–15 tanaman','HENTIKAN JALUR','uji akar/larutan; tunda panen unit'],
      ['>15 / 2 unit','KARANTINA','lokasi ≤2 jam; survei ≤24 jam']
    ];
    return scene(37,heading,`<div class="ops-intervene-left"><small>THRIPS / PER PERANGKAP / MINGGU</small><div class="ops-thrips-bands">${bands.map(([level,action,detail],i)=>`<div><strong>${E(level)}</strong><b>${action}</b><span>${detail}</span></div>`).join('')}</div><p>Inspeksi 10 titik acak dan 2 perangkap per unit, setiap hari.</p></div><div class="ops-intervene-right"><small>JIKA WABAH MENYEBAR</small><div class="ops-outbreak">${outbreak.map(([trigger,action,detail])=>`<div><b>${E(trigger)}</b><strong>${action}</strong><span>${detail}</span></div>`).join('')}</div></div>`,`Skenario sumber: satu lokasi 17 unit × satu siklus ≈12,2 ton atau sekitar Rp0,9 miliar hasil yang terpapar.`);
  }
  function nursery(heading) {
    const rows=[
      ['Waktu','18 hari','66 hari'],['Kelembapan','70–90%','70% → 50%'],['Suhu','25–28°C stabil','beda siang/malam ≥7°C'],['Cahaya','naungan 30–50%','penuh'],['Nutrisi','400–800 ppm','900–1.750 ppm'],['Saringan mutu','buang 5–10% bibit','satu buah per tanaman']
    ];
    return scene(38,heading,`<div class="ops-nursery-images"><div>${photo('nursery','Area nursery benih melon')}<strong>NURSERY</strong></div><div>${photo('grow-aisle','Lorong tanaman dalam greenhouse')}<strong>GROW HOUSE</strong></div></div><div class="ops-nursery-table"><div class="ops-nursery-head"><span>PARAMETER</span><span>BIBIT</span><span>TANAMAN PRODUKSI</span></div>${rows.map(r=>`<div><strong>${r[0]}</strong><span>${r[1]}</span><span>${r[2]}</span></div>`).join('')}</div>`,`Nursery 25–30 m² per lokasi melayani unit bergilir; pemisahan 18 hari inilah yang membuka slot greenhouse 73 hari.`);
  }
  function process(heading) {
    const steps=[
      ['01','SEMAI','18 hari · nursery','bibit lemah disaring'],
      ['02','PINDAH','hari 1 · GH','tanam DFT + penyangga'],
      ['03','VEGETATIF','GH','ikat sulur, pangkas tunas'],
      ['04','BUNGA','GH','serbuki; sisakan 1 buah'],
      ['05','BUAH','GH','gantung, bungkus, pangkas'],
      ['06','MATANG','10–14 hari','naikkan nutrisi; cek Brix'],
      ['07','PANEN','<12 jam kirim','sortir, grading, kemas'],
      ['08','SANITASI','7 hari · GH','cuci jalur; ganti larutan']
    ];
    return scene(39,heading,`<div class="ops-process-track">${steps.map(([n,name,time,job])=>`<div><small>${n} / ${time}</small><strong>${name}</strong><span>${job}</span></div>`).join('')}</div><div class="ops-process-summary"><span>NURSERY 18 HARI</span><b>∥</b><span>GH PRODUKSI 63–66 HARI</span><b>+</b><span>SANITASI 7 HARI</span><strong>= SLOT 73 HARI</strong></div>`,`Periode semai berjalan paralel; 90% Grade A dan SLA kirim <12 jam adalah target pada sumber.`);
  }
  function labor(heading) {
    const tasks=[['Pindah tanam',1.2],['Ikat sulur',1.8],['Pangkas',2.1],['Serbuki & pilih buah',1.5],['Bungkus & gantung',.9],['Inspeksi',.6],['Panen & sortir',1.2]];
    return scene(40,heading,`<div class="ops-labor-bars"><small>WAKTU SENTUH TANAMAN / SIKLUS</small>${tasks.map(([name,v])=>`<div><span>${name}</span><i><b style="width:${v/2.1*100}%"></b></i><strong>${String(v.toFixed(1)).replace('.',',')}</strong></div>`).join('')}<footer>TOTAL <strong>9,30 MENIT</strong> / TANAMAN</footer></div><div class="ops-labor-side"><div><small>SETELAH JALAN + SANITASI + CATATAN</small><strong>9,6–10,0</strong><span>menit kebutuhan riil</span></div><div><small>KAPASITAS MODEL</small><strong>1 : 6</strong><span>petani : GH · 288 hari × 7 jam/tahun</span></div><div class="ops-labor-stress">Jika >10 menit, turunkan ke 1:5 → tambahan biaya sekitar Rp4,7 miliar sepanjang 11 tahun dalam simulasi kebutuhan tenaga.</div></div>`,`Kebutuhan aktual harus divalidasi dengan catatan waktu dua siklus; angka biaya stres bukan OPEX dasar.`);
  }
  function cycle(heading) {
    return scene(41,heading,`<div class="ops-cycle-compare"><div><small>SEMAI DI DALAM GH</small><strong>88–91 hari</strong><span>≈4 panen/tahun</span><i style="--fill:100%"></i></div><div><small>NURSERY BERJALAN PARALEL</small><strong>73 hari</strong><span>63–66 hari tumbuh + 7 hari sanitasi</span><i style="--fill:80%"></i></div></div><div class="ops-cycle-equations"><div><small>SLOT PER TAHUN</small><strong>365 ÷ 73 = 5,0</strong></div><div><small>HASIL PER SIKLUS</small><strong>420 × 1,8 × 95% = 718,2 kg</strong></div><div><small>HASIL TAHUNAN / GH</small><strong>718,2 × 5 = 3.591 kg</strong></div></div>`,`Pada Y0 hanya 2 siklus trial, Y1 4 siklus, dan greenhouse baru dihitung 3 siklus di tahun pertamanya.`);
  }
  function seeds(heading) {
    return scene(42,heading,`<div class="ops-seed-intro">Fujisawa RZ F1 bisa dibeli pesaing. Keunggulan jangka panjang harus tumbuh dari pasokan, proses, dan pengembangan varietas.</div><div class="ops-seed-paths"><div><small>JALUR 01 / SAAT INI</small><strong>Amankan pasokan</strong><b>6–12 bulan</b><span>Perjanjian dengan distributor PT Excelindo / Rijk Zwaan, volume tahunan dan alternatif benih.</span><em>Genetik tetap bukan milik Melooloo.</em></div><div><small>JALUR 02 / JANGKA PANJANG</small><strong>Kembangkan benih</strong><b>7–8 tahun</b><span>Mitra pemuliaan yang diusulkan: UGM atau IPB. Koleksi 40–60 plasma nutfah, uji, lalu pendaftaran PVT.</span><em>Target penggunaan benih sendiri: Tahun 7+.</em></div></div>`,`Program pemuliaan masih rencana. Kemitraan, eksklusivitas, dan hak varietas belum dibuktikan sebagai perjanjian yang berlaku.`);
  }
  function seedBudget(heading) {
    const phases=[
      ['Y1–Y2','Rp950 jt','40–60 plasma nutfah & silang awal'],
      ['Y3–Y4','Rp1.050 jt','20–30 kandidat hibrida tersisa'],
      ['Y5–Y6','Rp1.050 jt','uji di GH, BUSS, pendaftaran'],
      ['Y7–Y10','Rp1.200 jt','galur tetua & produksi rutin']
    ];
    return scene(43,heading,`<div class="ops-seed-total"><small>PROGRAM PEMULIAAN · 10 TAHUN</small><strong>Rp4.250 <em>juta</em></strong><span>Anggaran usulan, belum masuk proyeksi keuangan dasar.</span></div><div class="ops-seed-phases">${phases.map(([period,cost,output],i)=>`<button type="button" data-beat-target="${i}"><small>FASE ${i+1} · ${period}</small><strong>${cost}</strong><span>${output}</span></button>`).join('')}</div><div class="ops-seed-bottom"><div><strong>GERBANG BERHENTI</strong><span>Jika bukti tidak cukup di akhir fase, hentikan sebelum dana berikutnya.</span></div><div><strong>Rp2,0 M</strong><span>paparan maksimum jika program dihentikan pada akhir Y4</span></div>${panel()}</div>`,`Program Rp4.250 juta belum termasuk dalam proyeksi keuangan dasar.`,true);
  }
  function moat(heading) {
    const locks=[
      ['73 hari','Nursery paralel membuka 5 siklus'],['4 parameter','Resep iklim & nutrisi lintas lokasi'],['1 : 5,1','Kapasitas kerja efektif dalam asumsi'],['17–18 unit','Kepadatan lokasi atap Jakarta'],['<12 jam','Kedekatan kebun ke pelanggan'],['Y7+','Target varietas sendiri & PVT']
    ];
    return scene(44,heading,`<div class="ops-moat-grid">${locks.map(([number,detail],i)=>`<div><small>0${i+1} / KAPABILITAS</small><strong>${E(number)}</strong><span>${detail}</span></div>`).join('')}</div><div class="ops-moat-summary">KEUNGGULAN DATANG DARI <b>ENAM SISTEM YANG SALING MENGUATKAN</b>, BUKAN SATU ALAT.</div>`,`Semua keunggulan di atas adalah rancangan/target pada materi sumber dan perlu pembuktian operasional.`);
  }
  function capacity(heading) {
    return scene(45,heading,`<div class="ops-capacity-equation">${metric('420','tanaman / GH')}<b>×</b>${metric('1,8 kg','bobot buah')}<b>×</b>${metric('95%','faktor yield')}<b>=</b><div class="ops-capacity-result"><strong>718,2 kg</strong><span>per siklus / GH</span></div></div><div class="ops-capacity-assumptions"><div><small>Y0 · TRIAL</small><strong>2 siklus</strong><span>35 GH → 50,3 ton</span></div><div><small>GH BARU</small><strong>3 siklus</strong><span>pada tahun dibangun</span></div><div><small>Y10 · SEBARAN</small><strong>103 / 69 / 65</strong><span>GH Jakarta / Surabaya / Bali</span></div></div>`,`Faktor 95% sudah tertanam di setiap angka produksi; jangan menguranginya dua kali.`);
  }
  function downside(heading) {
    const rows=[
      ['Waktu kerja >10 menit','Catatan 2 siklus','Turunkan rasio ke 1:5','+Rp4,7 M / 11 tahun'],
      ['Siklus hanya 4,5','Kalender tanam','Revisi volume Y10','sekitar 735 ton'],
      ['Varietas baru gagal','Gerbang akhir Y4','Stop R&D, pakai Fujisawa','batas rugi Rp2,0 M'],
      ['Wabah tingkat 3','Ronde harian','Karantina; alihkan pasokan','12,2 ton terpapar'],
      ['Atap Jakarta kurang','Negosiasi sewa','Majukan ekspansi kota lain','sewa/logistik naik']
    ];
    return scene(46,heading,`<div class="ops-downside-head"><span>SINYAL</span><span>DIDETEKSI DARI</span><span>RESPONS</span><span>DAMPAK MODEL</span></div><div class="ops-downside-rows">${rows.map((r,i)=>`<div><b>0${i+1}</b><strong>${E(r[0])}</strong><span>${E(r[1])}</span><span>${E(r[2])}</span><em>${E(r[3])}</em></div>`).join('')}</div>`,`Dampak merupakan skenario uji sumber, bukan biaya atau volume yang sudah terjadi.`);
  }

  const renderers = {21:supply,23:cost,24:priorities,25:team,26:supplyRisk,28:agenda,29:unit,30:technology,31:controls,32:dft,33:growth,34:replication,35:pillars,36:sweetness,37:intervention,38:nursery,39:process,40:labor,41:cycle,42:seeds,43:seedBudget,44:moat,45:capacity,46:downside};
  window.MELOOLOO_RENDER_OPERATIONS = (n, item, heading) => renderers[n]?.(heading) || null;
})();
