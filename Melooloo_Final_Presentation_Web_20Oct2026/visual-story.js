(() => {
  'use strict';
  const E = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const img = name => `assets/editorial/${name}${name.includes('.')?'':'.jpg'}?v=visual-refresh-1`;
  const descriptions = {
    'signature-pack':'Konsep Signature Pack Melooloo dengan logo pada pita dan label buah',
    'gift-edition':'Konsep kotak hadiah berisi tiga melon premium',
    'gift-edition-branded':'Konsep Gift Edition berisi tiga melon dengan logo Melooloo pada sisi depan kotak',
    'shelf':'Konsep kemasan Melooloo bermerek di rak ritel',
    'community-roof':'Konsep aktivitas komunitas tanpa wajah dengan matras dan sampel melon di rooftop',
    'greenhouse-unit':'Visualisasi satu modul greenhouse dari atas',
    'grow-aisle':'Visualisasi lorong tanaman melon di dalam greenhouse',
    'sensor-bench':'Visualisasi sensor dan alat pengukuran nutrisi greenhouse',
    'nursery':'Visualisasi area bibit greenhouse',
    'uji-manis-v1.png':'Konsep booth Uji Manis Melooloo tanpa manusia',
    'pilates-props-v1.png':'Konsep aktivasi komunitas Pilates dengan properti dan melon Melooloo tanpa manusia',
    'roof-walk-photoreal-v1.png':'Visualisasi konsep greenhouse pada rooftop dari sudut pejalan kaki'
  };
  const fig = n => `figures/figure-${String(n).padStart(3,'0')}.jpg`;
  const concept = 'VISUALISASI KONSEP · BUKAN FOTO FASILITAS TERPASANG';
  const fact = (f,i) => `<div class="vs-fact"><small>${String(i+1).padStart(2,'0')}</small><strong>${E(f[0])}</strong><span>${E(f[1])}</span></div>`;
  const facts = (item,count) => `<div class="vs-facts">${item.facts.slice(0,count||item.facts.length).map(fact).join('')}</div>`;
  const source = (n,label='Lihat data pada halaman asli') => `<button class="vs-source" type="button" data-open-source>${E(label)} <span aria-hidden="true">↗</span></button>`;
  const photo = (name,caption=concept) => `<div class="vs-photo"><img src="${img(name)}" alt="${E(descriptions[name] || 'Visualisasi konsep Melooloo')}" loading="eager"><span>${E(caption)}</span></div>`;
  const entries = (item,kind='') => `<div class="vs-entries ${kind}">${item.facts.map((f,i)=>`<div class="vs-entry"><b>${String(i+1).padStart(2,'0')}</b><strong>${E(f[0])}</strong><span>${E(f[1])}</span></div>`).join('')}</div>`;
  const beatPanel = count => `<div class="vs-beat-panel" aria-live="polite"><div class="vs-beat-number"><span data-beat-number>01 / ${String(count).padStart(2,'0')}</span><span class="vs-beat-rule" aria-hidden="true"></span></div><strong data-beat-title></strong><p data-beat-description></p><small>KLIK ELEMEN ATAU TEKAN →</small></div>`;
  const layouts = {
    1:['cover','grow-aisle'],2:['roster'],3:['gap'],4:['problem'],5:['forces'],6:['strategy'],7:['bmc'],
    8:['cover','signature-pack'],9:['channels'],10:['funnel'],11:['compare'],12:['evidence'],13:['evidence'],14:['cover','product-lineup'],15:['product'],16:['chain'],17:['allocation'],18:['gallery'],19:['score'],
    20:['cover','roof-cluster'],21:['evidence'],22:['cover','roof-walk-photoreal-v1.png'],23:['score'],24:['ladder'],25:['departments'],26:['risk'],27:['cover','greenhouse-unit'],28:['questions'],29:['unit'],30:['tech'],31:['loop'],32:['water'],33:['growth'],34:['growthstats'],35:['score'],36:['nutrients'],37:['thresholds'],38:['nursery'],39:['process'],40:['efficiency'],41:['cycle'],42:['promise','grow-aisle'],43:['phases'],44:['score'],45:['formula'],46:['risk'],47:['cover','grow-aisle'],
    48:['cover','nursery'],49:['process'],50:['org'],51:['evidence'],52:['evidence'],65:['decision'],66:['cover','grow-aisle']
  };
  function cover(n,item,heading,name) {
    const top = n===66 ? '<div class="vs-cover-mark">TERIMA KASIH <span>MELOOLOO / JAKARTA</span></div>' : '';
    return `<div class="vscene vs-cover vs-dark vs-page-${n}"><div class="vs-cover-image" style="background-image:url('${img(name)}')"></div><div class="vs-cover-shade"></div>${top}<div class="vs-cover-copy">${heading}<div class="vs-cover-rule"></div>${facts(item,4)}</div><div class="vs-concept">${concept}${n===22?' · PENEMPATAN ATAP BELUM DIVERIFIKASI':''}</div></div>`;
  }
  function roster(item,heading) {
    return `<div class="vscene vs-roster"><div class="vs-intro">${heading}<div class="vs-hairline"></div><p class="vs-side-label">KELOMPOK 06<br>PERENCANAAN BISNIS</p></div><div class="vs-roster-list">${item.facts.map((f,i)=>`<div><em>${String(i+1).padStart(2,'0')}</em><strong>${E(f[0])}</strong><span>${E(f[1])}</span></div>`).join('')}</div></div>`;
  }
  function gap(item,heading) {
    return `<div class="vscene vs-gap vs-interactive" data-interactive-slide="3"><div class="vs-title">${heading}</div><div class="vs-gap-plot"><div class="vs-axis"><span>0</span><span>550</span><span>1.100</span><span>1.650</span><span>2.200 TON</span></div><button class="vs-range vs-focus-target" type="button" data-beat-target="0" aria-label="Sorot permintaan premium"><span>PERMINTAAN PREMIUM</span><div><i style="--from:66.4%;--to:99.5%"></i></div><b>1.460–2.190</b></button><button class="vs-range vs-range-supply vs-focus-target" type="button" data-beat-target="1" aria-label="Sorot pasokan bermerek"><span>PASOKAN BERMEREK</span><div><i style="--from:18.2%;--to:54.5%"></i></div><b>400–1.200</b></button><button class="vs-gap-note vs-focus-target" type="button" data-beat-target="2" aria-label="Sorot celah pasar estimasi"><small>CELAH ESTIMASI</small><strong>260–1.790</strong><span>ton per tahun</span></button></div>${beatPanel(3)}${source(3)}</div>`;
  }
  function problem(heading) {
    return `<div class="vscene vs-problem">${heading}<div class="vs-problem-body"><div class="vs-problem-main"><section class="vs-problem-card vs-problem-gap"><small>01 / KESENJANGAN PASAR</small><strong>1,46%</strong><p>Produksi di wilayah konsumsi tinggi Jabodetabek, menurut slide sumber.</p><div class="vs-problem-divider"></div><b>30–40%</b><span>risiko gagal panen konvensional · hanya 1–2 panen/tahun</span></section><section class="vs-problem-card vs-problem-solution"><small>02 / TARGET HIDROPONIK</small><div><strong>&lt;10%</strong><span>risiko gagal panen</span></div><div><strong>4–5</strong><span>panen per tahun</span></div><div><strong>80–85%</strong><span>hemat air</span></div><div><strong>2×</strong><span>produktivitas</span></div></section><section class="vs-problem-card vs-problem-model"><small>03 / MODEL B2B2C</small><div><span>B2B UTAMA · RITEL / HORECA</span><strong>Rp75.000<em>/kg</em></strong></div><div><span>B2C PENDUKUNG · LANGSUNG</span><strong>Rp99.000<em>/kg</em></strong></div><p>Porsi B2C tumbuh bertahap · konsep rooftop Jakarta: panen dan kirim di hari yang sama.</p></section></div><div class="vs-problem-survey"><div class="vs-survey-intro"><strong>253</strong><span>responden survei primer<br>Mei–Agustus 2026</span></div><div><strong>94,5%</strong><span>rasa manis faktor utama</span></div><div><strong>45,8%</strong><span>bersedia ≥Rp100.000/buah</span></div><div><strong>78,7%</strong><span>tertarik memberi melon sebagai hadiah</span></div></div><small class="vs-problem-unit">Perbandingan budidaya mengikuti asumsi slide sumber. Harga strategi per kg; kesediaan bayar survei per buah.</small></div></div>`;
  }
  function compare(n,item,heading) {
    const halves = n===4 ? [
      ['01 / PASAR','Produksi jauh dari titik konsumsi',item.facts[0],item.facts[3]],
      ['02 / PRODUKSI','Budidaya konvensional sulit konsisten',item.facts[1],item.facts[2]]
    ] : [
      ['01 / PARITY','Layak dibandingkan sebagai melon premium',item.facts[0],['Standar','syarat dasar kategori']],
      ['02 / DIFFERENCE','Alasan memilih Melooloo',item.facts[1],['Urban','kesegaran dan kedekatan']]
    ];
    return `<div class="vscene vs-compare">${heading}<div class="vs-compare-pair">${halves.map((x,i)=>`<div class="vs-compare-side vs-side-${i}"><small>${E(x[0])}</small><h3>${E(x[1])}</h3><strong>${E(x[2][0])}</strong><p>${E(x[2][1])}</p><div class="vs-compare-foot"><b>${E(x[3][0])}</b><span>${E(x[3][1])}</span></div></div>`).join('')}</div></div>`;
  }
  function forces(item,heading) {
    const labels=['Pendatang baru','Pembeli','Pemasok','Substitusi','Rivalitas'];
    const notes=['CAPEX + teknis · skor 2,825','Alternatif lokal & impor','Diversifikasi pemasok','Impor & buah premium lokal','Menurut sumber: 54 ton/tahun'];
    return `<div class="vscene vs-forces vs-interactive" data-interactive-slide="5">${heading}<div class="vs-forces-stage"><svg class="vs-forces-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M52 53 L20 15"/><path d="M52 53 L85 14"/><path d="M52 53 L14 51"/><path d="M52 53 L88 56"/><path d="M52 53 L51 88"/></svg><div class="vs-forces-center"><span>PORTER</span><strong>5</strong><small>FORCES</small></div>${item.facts.map((f,i)=>`<button class="vs-force vs-force-${i} vs-focus-target" type="button" data-beat-target="${i}" aria-label="Sorot ${labels[i]}"><span>${String(i+1).padStart(2,'0')} / ${labels[i]}</span><strong>${E(f[0])}</strong><small>${E(notes[i])}</small></button>`).join('')}</div><div class="vs-forces-takeaway">Pembeli paling kuat → konsistensi mutu, traceability, kontrak.</div>${beatPanel(5)}</div>`;
  }
  function promise(n,item,heading,name) {
    return `<div class="vscene vs-promise"><div class="vs-promise-image">${photo(name)}</div><div class="vs-promise-copy">${heading}<div class="vs-promise-rule"></div>${entries(item,'vs-entries-compact')}</div></div>`;
  }
  function strategy(heading) {
    const values=[['M','Modern Precision Farming'],['E','Excellence in Premium Quality'],['L','Long-Term Partnership'],['O','Original Local Mastery'],['O','Operational Efficiency & Scalability']];
    return `<div class="vscene vs-strategy">${heading}<div class="vs-strategy-main"><div class="vs-strategy-photo">${photo('signature-pack')}</div><div class="vs-strategy-content"><div class="vs-strategy-vision"><div><small>VISI · RINGKASAN</small><strong>Standar baru kualitas dan efisiensi melon premium Indonesia, dengan daya saing global.</strong></div><div><b>14 → 26</b><span>karyawan · Y1 ke Y5</span></div></div><div class="vs-strategy-specs"><div><strong>15–18°</strong><span>Brix · target rasa</span></div><div><strong>≥1,5–2,0 kg</strong><span>ukuran buah</span></div><div><strong>4–5</strong><span>panen per tahun</span></div></div><div class="vs-strategy-roadmap"><div><small>1–2 TAHUN</small><strong>100–125 ton</strong><span>per tahun · GH IoT ±7.000 m² · ≥5 kontrak B2B · B2C mulai · target gagal panen &lt;6%</span></div><div><small>3–5 TAHUN</small><strong>+17 GH</strong><span>di 2 lokasi baru · operational excellence · pertumbuhan B2C</span></div><div><small>&gt;5 TAHUN</small><strong>≥2 kota</strong><span>target: sekitar 190 ton/tahun & posisi setara impor</span></div></div></div></div><div class="vs-strategy-values">${values.map(([letter,label],i)=>`<div><b>${letter}</b><span>${E(label)}</span></div>`).join('')}</div><div class="vs-strategy-note">Profil sumber: PT Melooloo Segar Indonesia · IoT, hidroponik presisi dan AI analitik sebagai rancangan teknologi · netting rapi, tekstur renyah.</div></div>`;
  }
  function chain(n,item,heading) {
    const nodes = ['Ritel premium','Hotel & restoran','Direct to consumer','Event','Marketplace'];
    return `<div class="vscene vs-chain">${heading}<div class="vs-chain-track">${nodes.map((s,i)=>`<div class="vs-chain-node"><b>${String(i+1).padStart(2,'0')}</b><strong>${E(s)}</strong><i aria-hidden="true">${i<nodes.length-1?'→':''}</i></div>`).join('')}</div><div class="vs-chain-foot">${facts(item,2)}</div></div>`;
  }
  function bmc() {
    // Coordinates follow the original 16:9 PDF page; the diagram itself is never redrawn.
    const blocks = [
      ['Customer Segments',77.1,22.5,16.7,49.6],
      ['Value Propositions',41.6,22.5,16.8,49.6],
      ['Channels',59.4,48.2,16.6,23.9],
      ['Customer Relationships',59.4,22.5,16.6,23.9],
      ['Revenue Streams',50.6,74.1,43.1,18.0],
      ['Key Resources',23.9,48.2,16.7,23.9],
      ['Key Activities',23.9,22.5,16.7,23.9],
      ['Key Partners',6.2,22.5,16.6,49.6],
      ['Cost Structure',6.2,74.1,43.2,18.0]
    ];
    const hotspots = blocks.map(([label,x,y,w,h],i)=>`<button class="vs-bmc-hotspot vs-focus-target" type="button" data-beat-target="${i}" aria-label="Sorot blok ${E(label)}" style="left:${x}%;top:${y}%;width:${w}%;height:${h}%"></button>`).join('');
    return `<div class="vscene vs-bmc vs-interactive" data-interactive-slide="7"><img class="vs-bmc-original" src="assets/bmc-source-page-07.png" alt="Business Model Canvas asli Melooloo dari halaman 7 PDF sumber, dengan kesembilan blok lengkap" loading="eager">${hotspots}<div class="vs-bmc-status" aria-live="polite"><small>IKUTI 9 BLOK · <span data-beat-number>01 / 09</span></small><strong data-beat-title></strong><span data-beat-description></span><em>TEKAN → ATAU KLIK BLOK</em></div></div>`;
  }
  function channels(item,heading) {
    return `<div class="vscene vs-channels">${heading}<div class="vs-channels-main"><div><span>B2B</span><strong>65%</strong><p>Ritel premium · HoReCa · pembelian institusi</p></div><div><span>B2C</span><strong>35%</strong><p>Keluarga premium · gifting · komunitas</p></div></div><div class="vs-channels-bar"><i></i><i></i></div><div class="vs-channels-note">Dua jalur, satu standar buah premium.</div></div>`;
  }
  function funnel(item,heading) {
    return `<div class="vscene vs-funnel">${heading}<div class="vs-funnel-steps"><div><span>01 / TOTAL ADDRESSABLE MARKET</span><strong>16.800 <small>ton</small></strong><p>Jabodetabek · tahunan</p></div><div><span>02 / SERVICEABLE AVAILABLE MARKET</span><strong>236,9 <small>ton</small></strong><p>Saluran yang dapat dilayani</p></div><div><span>03 / SERVICEABLE OBTAINABLE MARKET</span><strong>90,5 <small>ton</small></strong><p>Target Tahun 1</p></div></div>${source(10,'Buka perhitungan TAM / SAM / SOM')}</div>`;
  }
  function evidence(n,item,heading) {
    const use = n===21 ? fig(21) : n===23 ? fig(23) : fig(n);
    const note = n===23 ? 'Bagan CAPEX Canva menggunakan model lama; angka terbaru ada pada bagian keuangan.' : n===21 ? 'Peta sumber · lokasi perlu verifikasi lapangan.' : 'Data dan bagan dari materi sumber.';
    return `<div class="vscene vs-evidence"><div class="vs-evidence-side">${heading}${facts(item,3)}<p>${E(note)}</p>${source(n)}</div><button class="vs-evidence-image" type="button" data-open-source aria-label="Perbesar data sumber"><img src="${use}" alt="Bagan sumber untuk halaman ${n}"></button></div>`;
  }
  function product(item,heading) {
    return `<div class="vscene vs-product">${heading}<div class="vs-product-pair"><div>${photo('signature-pack')}<strong>Signature Pack</strong><span>Rp 75.000/kg · jalur B2B</span></div><div>${photo('gift-edition-branded')}<strong>Gift Edition</strong><span>Rp 535.000 · kotak tiga buah</span></div></div><div class="vs-product-note">253 responden dalam pengujian kesediaan membayar · kemasan adalah visualisasi konsep</div></div>`;
  }
  function allocation(item,heading) {
    return `<div class="vscene vs-allocation">${heading}<div class="vs-allocation-total"><span>ANGGARAN PEMASARAN & PENJUALAN Y1 · MODEL BARU</span><strong>Rp 768 <small>juta</small></strong></div><div class="vs-allocation-grid"><div><b>70%</b><span>MEMBANGUN KESADARAN</span><i></i></div><div><b>30%</b><span>KONVERSI PROSPEK</span><i></i></div></div><p>Pembagian 70/30 berasal dari materi Canva dan perlu dibaca sebagai rencana alokasi, bukan realisasi.</p></div>`;
  }
  function gallery(item,heading) {
    return `<div class="vscene vs-gallery">${heading}<div class="vs-gallery-photos"><div>${photo('uji-manis-v1.png')}<b>01 · UJI MANIS</b></div><div>${photo('shelf')}<b>02 · RAK RITEL</b></div><div>${photo('pilates-props-v1.png')}<b>03 · KOMUNITAS PILATES</b></div></div><div class="vs-gallery-note">Tiga titik pengalaman merek: cicip di booth, temukan di rak, lalu bawa ke komunitas. Semua foto adalah konsep tanpa wajah manusia.</div></div>`;
  }
  function score(n,item,heading) {
    return `<div class="vscene vs-score vs-score-${n}">${heading}<div class="vs-score-line">${item.facts.map((f,i)=>`<div class="vs-score-cell"><span>${String(i+1).padStart(2,'0')} / ${E(f[1])}</span><strong>${E(f[0])}</strong></div>`).join('')}</div>${n===23?'<p>Sumber angka: PowerPoint Keuangan Mery, halaman 5. Bagan Canva asli memakai basis biaya lama.</p>':n===19?'<p>Ukuran NMC, MROS, dan MROI sesuai halaman pemasaran Canva; periksa kesesuaian dengan model keuangan terbaru sebelum mengutipnya.</p>':''}</div>`;
  }
  function ladder(item,heading) {
    return `<div class="vscene vs-ladder">${heading}<div class="vs-ladder-rows">${['Kualitas','Keandalan','Kecepatan','Fleksibilitas','Biaya'].map((x,i)=>`<div><small>${String(i+1).padStart(2,'0')}</small><strong>${x}</strong><span>${['Brix dan penampilan konsisten','Panen dapat diprediksi','Dekat pasar Jakarta','Unit modular dan kanal beragam','Efisiensi air dan tenaga'][i]}</span></div>`).join('')}</div></div>`;
  }
  function departments(item,heading) {
    return `<div class="vscene vs-departments">${heading}<div class="vs-dept-stem">SATU STANDAR MUTU <span>↓</span></div><div class="vs-dept-list">${item.facts.map((f,i)=>`<div><em>${String(i+1).padStart(2,'0')}</em><strong>${E(f[0])}</strong><span>${E(f[1])}</span></div>`).join('')}</div></div>`;
  }
  function risk(n,item,heading) {
    const heads=n===26?['Sinyal','Tindakan','Hasil yang dijaga']:['Sinyal','Respons','Konsekuensi'];
    return `<div class="vscene vs-risk">${heading}<div class="vs-risk-table">${item.facts.map((f,i)=>`<div><small>${heads[i]}</small><strong>${E(f[0])}</strong><span>${E(f[1])}</span></div>`).join('')}</div><div class="vs-risk-baseline">MITIGASI = DETEKSI DINI + PROTOKOL + PEMASOK ALTERNATIF</div></div>`;
  }
  function questions(item,heading) {
    return `<div class="vscene vs-questions">${heading}<div class="vs-question-list">${item.facts.map((f,i)=>`<div><small>PERTANYAAN ${String(i+1).padStart(2,'0')}</small><strong>${E(f[0])}</strong><span>${E(f[1])}</span></div>`).join('')}</div></div>`;
  }
  function unit(item,heading) {
    return `<div class="vscene vs-unit"><div class="vs-unit-photo">${photo('grow-aisle')}</div><div class="vs-unit-head">${heading}</div><div class="vs-unit-specs">${entries(item,'vs-entries-compact')}</div></div>`;
  }
  function tech(item,heading) {
    return `<div class="vscene vs-tech">${heading}<div class="vs-tech-stage">${photo('greenhouse-unit')}<div class="vs-tech-call vs-tech-call-1"><b>DFT</b><span>Sirkulasi nutrisi</span></div><div class="vs-tech-call vs-tech-call-2"><b>IoT</b><span>Sensor lingkungan</span></div><div class="vs-tech-call vs-tech-call-3"><b>1.200 W</b><span>Cadangan daya</span></div></div></div>`;
  }
  function loop(item,heading) {
    return `<div class="vscene vs-loop">${heading}<div class="vs-loop-main"><div class="vs-loop-sensor">${photo('sensor-bench')}<span>SENSOR / LAPANGAN</span></div><div class="vs-loop-arrows"><span>DATA →</span><span>← TINDAKAN</span></div><div class="vs-loop-controller"><small>KEPUTUSAN</small><strong>Target per fase</strong><p>Suhu · kelembapan · pH · nutrisi</p><div>AUTOMASI + INTERVENSI PETANI</div></div></div>${facts(item,4)}</div>`;
  }
  function water(item,heading) {
    return `<div class="vscene vs-water">${heading}<div class="vs-water-main"><div class="vs-water-drop"><span>80–85<small>%</small></span></div><div><span>HEMAT AIR DIBANDING CARA KONVENSIONAL</span><strong>45–60 liter</strong><p>air per kilogram melon dalam desain DFT sumber</p></div></div><div class="vs-water-note">Larutan bersirkulasi kembali ke tangki · pasokan listrik cadangan menjadi bagian dari desain.</div></div>`;
  }
  function growth(item,heading) {
    const vals=[50.3,100.5,162.3,223.4,284.4,345.5,421.6,490.5,576,706,816.6];
    return `<div class="vscene vs-growth">${heading}<div class="vs-growth-chart"><div class="vs-growth-grid"></div>${vals.map((v,i)=>`<div class="vs-growth-bar" style="--height:${v/816.6*100}%"><strong>${i===0||i===1||i===10?String(v).replace('.',','):''}</strong><i style="height:${v/816.6*100}%"></i><span>Y${i}</span></div>`).join('')}</div><div class="vs-growth-end"><strong>816,6 t</strong><span>Produksi Y10 pada roadmap operasi sumber</span></div>${source(33)}</div>`;
  }
  function growthstats(item,heading) {
    return `<div class="vscene vs-growthstats">${heading}<div class="vs-growthstats-split"><div><small>VOLUME</small><strong>16,2×</strong><span>pertumbuhan produksi Y0–Y10</span></div><div><small>MODUL</small><strong>6,8×</strong><span>pertumbuhan jumlah greenhouse</span></div></div><p>Skala berasal dari replikasi unit produksi yang sama.</p></div>`;
  }
  function nutrients(item,heading) {
    const stages=['Daun & akar','Bunga & pentil','Buah membesar','Pematangan'];
    return `<div class="vscene vs-nutrients">${heading}<div class="vs-nutrient-stages">${item.facts.map((f,i)=>`<div><small>FASE ${String(i+1).padStart(2,'0')}</small><strong>${stages[i]}</strong><span>${E(f[0])}</span><i></i></div>`).join('')}</div><div class="vs-nutrient-rule"><span>KEPEKATAN NUTRISI MENINGKAT SESUAI FASE</span><b>→</b></div></div>`;
  }
  function thresholds(item,heading) {
    return `<div class="vscene vs-thresholds">${heading}<div class="vs-threshold-scale"><div><span>&lt;5 THRIPS</span><strong>Pantau</strong></div><div><span>5–15 THRIPS</span><strong>Waspada</strong></div><div><span>&gt;15 THRIPS</span><strong>Tindak</strong></div></div><div class="vs-threshold-foot"><strong>10</strong><span>titik inspeksi / unit</span><strong>2</strong><span>perangkap / unit</span></div></div>`;
  }
  function nursery(item,heading) {
    return `<div class="vscene vs-nursery">${heading}<div class="vs-nursery-side"><div>${photo('nursery')}<b>18 HARI</b><span>bibit tumbuh dalam lingkungan nursery</span></div><div>${photo('grow-aisle')}<b>66 HARI</b><span>tanaman menyelesaikan siklus di grow house</span></div></div><div class="vs-nursery-note">Dua lingkungan berjalan paralel untuk menjaga lima siklus tahunan.</div></div>`;
  }
  function process(n,item,heading) {
    const stages=n===39?['Semai','Pindah tanam','Rawat tajuk','Penyerbukan','Pilih buah','Pematangan','Panen','Sortir']:['Rencanakan','Seleksi','Onboarding','Kembangkan'];
    return `<div class="vscene vs-process">${heading}<div class="vs-process-steps">${stages.map((s,i)=>`<div><b>${String(i+1).padStart(2,'0')}</b><strong>${s}</strong><i></i></div>`).join('')}</div><div class="vs-process-foot">${n===39?'DARI BIBIT KE BUAH SIAP KIRIM':'TIM TEKNIS BERKEMBANG SEIRING JUMLAH GREENHOUSE'}</div></div>`;
  }
  function efficiency(item,heading) {
    return `<div class="vscene vs-efficiency">${heading}<div class="vs-efficiency-visual"><div><small>WAKTU SENTUH TANAMAN</small><strong>9,30</strong><span>menit per tanaman per siklus</span></div><div class="vs-efficiency-arrow">→</div><div><small>KEBUTUHAN TOTAL</small><strong>9,6–10,0</strong><span>menit termasuk sanitasi, jalan, pencatatan</span></div></div>${source(40,'Buka tabel kapasitas kerja')}</div>`;
  }
  function cycle(item,heading) {
    return `<div class="vscene vs-cycle">${heading}<div class="vs-cycle-line"><div><small>SEMAI DI GREENHOUSE</small><strong>88–91 hari</strong><span>sekitar 4 siklus / tahun</span></div><span class="vs-cycle-vs">VS</span><div><small>NURSERY PARALEL</small><strong>73 hari</strong><span>66 hari tanam + 7 hari sanitasi</span></div></div><div class="vs-cycle-formula">365 HARI ÷ 73 HARI <b>= 5 PANEN / TAHUN</b></div></div>`;
  }
  function phases(item,heading) {
    const periods=['Y1–Y2','Y3–Y4','Y5–Y6','Y7–Y10'];
    return `<div class="vscene vs-phases">${heading}<div class="vs-phase-track">${item.facts.map((f,i)=>`<div><small>FASE ${i+1} / ${periods[i]}</small><strong>${E(f[0])}</strong><span>${['Koleksi & karakterisasi','Persilangan & seleksi','Uji multilokasi','Produksi rutin'][i]}</span></div>`).join('')}</div><p>Setiap fase memerlukan keputusan lanjut atau berhenti sesuai bukti hasil.</p></div>`;
  }
  function formula(item,heading) {
    return `<div class="vscene vs-formula">${heading}<div class="vs-formula-equation"><div><strong>420</strong><span>tanaman / unit</span></div><b>×</b><div><strong>95%</strong><span>faktor yield</span></div><b>×</b><div><strong>1,8 kg</strong><span>bobot / buah</span></div></div><div class="vs-formula-result">≈ <strong>718,2 kg</strong><span>hasil per siklus / greenhouse sesuai asumsi</span></div></div>`;
  }
  function org(item,heading) {
    const role=(title,sub)=>`<div><strong>${title}</strong><span>${sub}</span></div>`;
    return `<div class="vscene vs-org">${heading}<div class="vs-org-chart"><div class="vs-org-top">${role('CEO','strategi dan tata kelola')}</div><div class="vs-org-trunk"></div><div class="vs-org-row">${role('Komersial','pasar dan hubungan pelanggan')}${role('Operasi','agronomi, mutu, logistik')}${role('Keuangan & SDM','sumber daya dan kontrol')}</div><div class="vs-org-foot">STRUKTUR FUNGSI · BUKA BAGAN SUMBER UNTUK RINCIAN JABATAN</div></div>${source(50)}</div>`;
  }
  function decision(item,heading) {
    return `<div class="vscene vs-decision vs-dark"><div class="vs-decision-image" style="background-image:url('${img('roof-cluster')}')"></div><div class="vs-decision-wash"></div><div class="vs-decision-main"><span>KEPUTUSAN INVESTASI</span>${heading}<div class="vs-decision-go">GO <i>↗</i></div><div class="vs-decision-facts">${facts(item,4)}</div><p>Dengan mitigasi penerimaan harga, ketahanan produksi, dan piutang B2B · memakai model keuangan Mery.</p></div><div class="vs-concept">${concept}</div></div>`;
  }
  window.MELOOLOO_RENDER_VISUAL = (n,item,heading) => {
    const [kind,name] = layouts[n] || [];
    if (!kind) return null;
    const renderers={cover:()=>cover(n,item,heading,name),roster:()=>roster(item,heading),gap:()=>gap(item,heading),problem:()=>problem(heading),compare:()=>compare(n,item,heading),forces:()=>forces(item,heading),promise:()=>promise(n,item,heading,name),strategy:()=>strategy(heading),chain:()=>chain(n,item,heading),bmc:()=>bmc(),channels:()=>channels(item,heading),funnel:()=>funnel(item,heading),evidence:()=>evidence(n,item,heading),product:()=>product(item,heading),allocation:()=>allocation(item,heading),gallery:()=>gallery(item,heading),score:()=>score(n,item,heading),ladder:()=>ladder(item,heading),departments:()=>departments(item,heading),risk:()=>risk(n,item,heading),questions:()=>questions(item,heading),unit:()=>unit(item,heading),tech:()=>tech(item,heading),loop:()=>loop(item,heading),water:()=>water(item,heading),growth:()=>growth(item,heading),growthstats:()=>growthstats(item,heading),nutrients:()=>nutrients(item,heading),thresholds:()=>thresholds(item,heading),nursery:()=>nursery(item,heading),process:()=>process(n,item,heading),efficiency:()=>efficiency(item,heading),cycle:()=>cycle(item,heading),phases:()=>phases(item,heading),formula:()=>formula(item,heading),org:()=>org(item,heading),decision:()=>decision(item,heading)};
    return renderers[kind]();
  };
})();
