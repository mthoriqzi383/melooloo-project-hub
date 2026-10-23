(() => {
  'use strict';

  const asset = name => `assets/marketing/${name}`;
  const editorial = name => `assets/editorial/${name}`;
  const image = (src, alt, label = 'VISUALISASI KONSEP') =>
    `<div class="mk-image"><img src="${src}" alt="${alt}" loading="eager"><span>${label}</span></div>`;
  const scene = (n, heading, body, dark = false, layout = '') =>
    `<div class="vscene mk-scene mk-page-${n} ${layout}${dark ? ' mk-dark' : ''}">${heading}<div class="mk-main">${body}</div></div>`;

  function buyerProblem(heading) {
    return scene(8, heading, `
      <div class="mk-8-copy">
        <p class="mk-eyebrow">ALASAN MEMBELI</p>
        <strong class="mk-8-statement">Rasa manis harus bisa <em>dibuktikan.</em></strong>
        <div class="mk-8-stats">
          <div><strong>94,5%</strong><span>memilih melon karena rasa manis</span></div>
          <div><strong>79%</strong><span>tertarik menjadikan melon hadiah</span></div>
        </div>
        <p class="mk-small">Survei primer · 253 responden</p>
      </div>
      <div class="mk-8-photo">${image(asset('reference-gift-edition.jpg'), 'Konsep Gift Edition Melooloo dengan kemasan bermerek')}</div>
    `, true, 'mk-8');
  }

  function buyers(heading) {
    return scene(9, heading, `
      <div class="mk-buyer-card mk-buyer-b2b">
        <div class="mk-buyer-head"><span>B2B · VOLUME GRADE A TAHUN 1</span><strong>68<em>%</em></strong></div>
        ${image(asset('reference-uji-manis.jpg'), 'Konsep booth Uji Manis Melooloo di ritel premium')}
        <div class="mk-buyer-list"><b>Ritel premium</b><b>Hotel bintang 5</b><b>E-grocery</b></div>
      </div>
      <div class="mk-buyer-card mk-buyer-b2c">
        <div class="mk-buyer-head"><span>B2C · VOLUME GRADE A TAHUN 1</span><strong>32<em>%</em></strong></div>
        ${image(asset('reference-gift-edition.jpg'), 'Konsep Gift Edition Melooloo untuk pelanggan langsung')}
        <div class="mk-buyer-list"><b>Premium Lifestyle</b><b>Gift &amp; Occasion</b><b>Health-Conscious Urban</b><b>Wellness Community</b></div>
      </div>
      <div class="mk-buyer-foot"><span>PINTU SASARAN</span><strong>121 ritel premium <i>+</i> 37 hotel bintang 5</strong><em>Proyeksi pasar awal</em></div>
    `);
  }

  function market(heading) {
    const rows = [
      ['01', 'TAM · Jabodetabek', '32.100', 'ton / tahun', '100%'],
      ['02', 'SAM · premium DKI', '1.460–2.190', 'ton / tahun', '77%'],
      ['03', 'Pintu sasaran', '236,9', 'ton · 158 pintu', '54%']
    ];
    return scene(10, heading, `
      <div class="mk-market-stack">
        ${rows.map(([no,label,value,unit,width]) => `<div class="mk-market-row"><small>${no}</small><div><span>${label}</span><strong>${value}</strong><em>${unit}</em></div><i style="--reach:${width}"></i></div>`).join('')}
        <div class="mk-market-som"><span>04 / SOM TAHUN 1</span><strong>85,5 <em>ton</em></strong><p>4–6% dari pasar premium DKI</p><b>→</b></div>
      </div>
      <div class="mk-market-bottom"><strong>Tahun 5 · 310,9 ton</strong><span>Proyeksi 14–21% SAM</span><small>ALUR PENYEMPITAN PASAR · PANJANG PITA ILUSTRATIF</small></div>
    `);
  }

  function proof(heading) {
    const pod = [
      ['01', 'Target &lt;24 jam', 'dari panen ke rak'],
      ['02', 'Kebun', 'dapat dikunjungi'],
      ['03', 'QR per buah', 'data kebun dan lot'],
      ['04', 'Panen', 'saat matang optimal']
    ];
    return scene(11, heading, `
      <div class="mk-proof-left">
        <div class="mk-proof-promise">Premium.<br><em>Local.</em><br>Consistent.</div>
        <div class="mk-proof-parity"><small>SETARA · POINT OF PARITY</small><p>Target Brix ≥15 · jaring rata · residu di bawah BMR · kemasan hadiah</p></div>
        <div class="mk-proof-difference"><small>BERBEDA · POINT OF DIFFERENCE</small><div>${pod.map(([n,a,b]) => `<span><b>${n}</b><strong>${a}</strong><em>${b}</em></span>`).join('')}</div></div>
      </div>
      <div class="mk-trace-area"><div class="mk-phone">
        <div class="mk-phone-top"><img src="assets/logo.png" alt="" aria-hidden="true"><b>melooloo</b><span>cek buahmu</span></div>
        <div class="mk-phone-fruit">Melooloo Signature <span>Grade A</span></div>
        <div class="mk-phone-row"><small>KEBUN</small><strong>Greenhouse [kode] · Jakarta</strong></div>
        <div class="mk-phone-row"><small>PANEN</small><strong>[tanggal] · [jam]</strong></div>
        <div class="mk-phone-row"><small>RASA</small><strong>Uji Brix ≥15 · per lot</strong></div>
        <div class="mk-phone-row"><small>KEAMANAN</small><strong>Ringkasan uji residu lot</strong></div>
        <div class="mk-phone-bottom">Garansi Janji Manis <b>↗</b></div>
      </div><span class="mk-trace-caption">CONTOH HALAMAN KETERTELUSURAN</span></div>
    `);
  }

  function competitors(heading) {
    return scene(12, heading, `
      <div class="mk-nearby">
        <div class="mk-nearby-hero"><small>POSISI YANG DITUJU</small><strong>Jakarta</strong><span>kebun dekat pembeli premium</span><em>Target panen ke rak &lt;24 jam</em></div>
        <div class="mk-distance"><div><b>±90 km</b><strong>Sweet Greens</strong><span>pesaing lokal terdekat yang disebut</span></div><div><b>±500 km</b><strong>Urbana Farm</strong><span>luar wilayah pasar inti</span></div><div><b>±5.900 km</b><strong>Crown Melon</strong><span>impor Jepang</span></div></div>
        <small class="mk-distance-note">JARAK INDIKATIF · URUTAN TIDAK BERSKALA</small>
      </div>
      <div class="mk-gap">
        <small>CELAH PASAR PADA 158 PINTU</small>
        <div><strong>&lt;70 <em>ton</em></strong><span>pasokan produsen Jabodetabek yang terungkap / tahun</span></div>
        <b>versus</b>
        <div><strong>236,9 <em>ton</em></strong><span>pasar tersedia pada pintu sasaran</span></div>
      </div>
    `);
  }

  function brand(heading) {
    return scene(13, heading, `
      <div class="mk-brand-photo">${image(asset('reference-garden-visit.jpg'), 'Konsep area kunjungan kebun Melooloo dengan papan merek dan QR')}</div>
      <div class="mk-brand-copy"><div class="mk-brand-mark"><img src="assets/logo.png" alt="Logo Melooloo"><span>Premium.<br>Local.<br>Consistent.</span></div>
        <div class="mk-brand-beats"><div><b>01</b><strong>Dilihat</strong><span>asal kebun di dalam kota</span></div><div><b>02</b><strong>Dicicipi</strong><span>Uji Manis dan bukti Brix per lot</span></div><div><b>03</b><strong>Dikunjungi</strong><span>pengalaman Kunjungan Kebun</span></div></div>
        <p>Brand yang dekat dengan kebun, rak, dan komunitas Jakarta.</p>
      </div>
    `);
  }

  function price(heading) {
    return scene(14, heading, `
      <div class="mk-price-head"><div><small>POSISI HARGA</small><strong>14–17×</strong><span>di bawah Crown Melon pada harga langsung Rp99.000/kg</span></div><div class="mk-price-scale"><div><span>HPP RENCANA</span><b>Rp28,7 rb/kg</b></div><div><span>MELOOLOO B2B</span><b>Rp75 rb/kg</b></div><div><span>LANGSUNG</span><b>Rp99 rb/kg</b></div><div><span>CROWN MELON</span><b>Rp1,3–1,7 jt/kg</b></div></div></div>
      <div class="mk-format-grid"><div>${image(asset('reference-signature-pack.jpg'), 'Konsep Signature Pack Melooloo dengan segel bermerek')}<strong>Lewat mitra</strong><span>Signature · Chef Selection</span><b>±62% margin kotor rencana</b></div><div>${image(asset('reference-gift-edition.jpg'), 'Konsep Gift Edition Melooloo dalam kotak bermerek')}<strong>Langsung</strong><span>Weekly · Season Pass · Gift Edition</span><b>±71% margin kotor rencana</b></div></div>
    `);
  }

  function channels(heading) {
    const steps = [
      ['K3 · Y0','Panen pertama','Tasting dinner 7 hotel · pengajuan ritel · uji pra-pesan'],
      ['K4 · Y0','Masuk kanal','18 akun HoReCa · 17 pintu ritel · Weekly diluncurkan'],
      ['TAHUN 1','Bangun kebiasaan','Season Pass · Gift Edition · Kunjungan Kebun']
    ];
    const mixes = [['Y1',68,32],['Y5',40,60],['Y10',48,52]];
    return scene(15, heading, `
      <div class="mk-rollout">${steps.map(([when,title,detail],i)=>`<div><small>0${i+1} / ${when}</small><strong>${title}</strong><span>${detail}</span></div>`).join('')}</div>
      <div class="mk-mix"><div class="mk-mix-label"><small>BAURAN VOLUME GRADE A · RENCANA</small><div><span><i></i>B2B · lantai volume</span><span><i></i>B2C · mesin margin</span></div></div>${mixes.map(([year,b2b,b2c])=>`<div class="mk-mix-row"><b>${year}</b><div><span style="width:${b2b}%">${b2b}%</span><strong style="width:${b2c}%">${b2c}%</strong></div></div>`).join('')}</div>
    `);
  }

  function imc(heading) {
    const rows=[
      ['Pengalaman','Rp338 jt','Uji Manis · Kunjungan Kebun · Panen Perdana · komunitas',44],
      ['Digital & CRM','Rp240 jt','Iklan · konten panen · situs · WhatsApp',31],
      ['Kredibilitas','Rp99 jt','PR · uji pihak ketiga · garansi · survei merek',13],
      ['Penjualan B2B','Rp91 jt','Tenaga penjualan · jamuan cicip chef',12]
    ];
    return scene(16, heading, `
      <div class="mk-imc-total"><small>IMC · ANGGARAN TAHUN 1</small><strong>Rp768 <em>juta</em></strong><span>Proyeksi pembagian komunikasi</span></div>
      <div class="mk-imc-rows">${rows.map(([label,value,desc,width])=>`<div class="mk-imc-row"><div><strong>${label}</strong><b>${value}</b></div><i><span style="width:${width}%"></span></i><p>${desc}</p></div>`).join('')}</div>
      <div class="mk-imc-outcomes"><div><strong>2.912</strong><span>pelanggan baru · target Tahun 1</span></div><div><strong>17 + 17</strong><span>pintu ritel + akun HoReCa · target Tahun 1</span></div></div>
    `);
  }

  function journey(heading) {
    const stages=[
      ['01','KENAL','Konten panen · menu hotel · komunitas · PR','10% → 40%','aided awareness SES A/A+ · Y1 ke Y5'],
      ['02','COBA & BELI','Uji Manis · Kunjungan Kebun · Signature · situs','3.303 → 10.909','pelanggan B2C aktif · Y1 ke Y5'],
      ['03','SETIA & MEREKOMENDASIKAN','Weekly · QR · Janji Manis · referral','35% → 58%','retensi B2C · Y1 ke Y5']
    ];
    return scene(17, heading, `
      <div class="mk-journey-track"><span>KENAL</span><b>→</b><span>COBA &amp; BELI</span><b>→</b><span>SETIA</span><b class="mk-loop">↶ referral</b></div>
      <div class="mk-journey-grid">${stages.map(([n,title,touch,value,kpi])=>`<div class="mk-journey-step"><small>${n} / TAHAP</small><strong>${title}</strong><p>${touch}</p><div><b>${value}</b><span>${kpi}</span></div></div>`).join('')}</div>
      <div class="mk-measure"><span>DIUKUR DENGAN</span><b>survei merek dua kali setahun</b><b>CRM per sumber pelanggan</b><b>audit menu dan harga rak</b></div>
    `);
  }

  function activations(heading) {
    return scene(18, heading, `
      <div class="mk-gallery-card mk-gallery-primary">${image(asset('reference-uji-manis.jpg'), 'Booth konsep Uji Manis Melooloo di ritel tanpa wajah manusia')}<div><small>01 / RITEL</small><strong>Uji Manis</strong><span>Pembeli melihat pengukuran rasa sebelum memilih.</span></div></div>
      <div class="mk-gallery-card">${image(asset('reference-garden-visit.jpg'), 'Area konsep Kunjungan Kebun Melooloo tanpa wajah manusia')}<div><small>02 / KEBUN</small><strong>Kunjungan Kebun</strong><span>Asal produk dapat dilihat langsung.</span></div></div>
      <div class="mk-gallery-card">${image(editorial('pilates-props-v1.png'), 'Properti aktivasi Pilates Melooloo tanpa orang')}<div><small>03 / KOMUNITAS</small><strong>Studio &amp; klub lari</strong><span>Rasa dikenalkan lewat pengalaman komunitas.</span></div></div>
    `);
  }

  function economics(heading) {
    const gates=[
      ['01','Sebelum Weekly','≥100 pra-pesan berbayar','lolos → diluncurkan'],
      ['02','Akhir Tahun 1','800 pelanggan program + retensi 35%','bila belum tercapai → alihkan anggaran'],
      ['03','Sebelum ekspansi','≥90% Grade A terjual harga penuh · 2 siklus','lolos → tahap atau kota baru']
    ];
    return scene(19, heading, `
      <div class="mk-econ-top"><div><small>TAHUN 1 · BUDGET</small><strong>Rp768 <em>juta</em></strong><span>10,3% pendapatan proyeksi</span></div><div><small>TAHUN 5 · RASIO BUDGET</small><strong>5,9<em>%</em></strong><span>turun seiring skala penjualan</span></div><div><small>CAC IKLAN</small><strong>75 → 40 <em>rb</em></strong><span>target biaya per pelanggan · Y1 ke Y5</span></div></div>
      <div class="mk-econ-nmc"><span>NMC TAHUN 1 → TAHUN 5</span><strong>Rp3,8 M <b>→</b> Rp20,1 M</strong><small>proyeksi kontribusi pemasaran</small></div>
      <div class="mk-gates"><div class="mk-gates-label">TIGA REM SEBELUM BELANJA &amp; EKSPANSI</div>${gates.map(([n,when,target,decision])=>`<div><small>${n} / ${when}</small><strong>${target}</strong><span>${decision}</span></div>`).join('')}</div>
    `);
  }

  function buyersAndMarket(heading) {
    const pools = [
      ['TAM JABODETABEK', '32.100', 'ton/tahun'],
      ['SAM PREMIUM DKI', '1.460–2.190', 'ton/tahun'],
      ['158 PINTU SASARAN', '236,9', 'ton/tahun'],
      ['SOM TAHUN 1', '85,5', 'ton · 4–6% SAM']
    ];
    return scene(9, heading, `
      <div class="mk-audience-pair">
        <div><small>VOLUME GRADE A · TAHUN 1</small><strong>68<em>%</em></strong><b>B2B</b><span>ritel premium · hotel bintang 5 · e-grocery</span></div>
        <div><small>VOLUME GRADE A · TAHUN 1</small><strong>32<em>%</em></strong><b>B2C</b><span>Premium Lifestyle · Gift &amp; Occasion · Health-Conscious Urban · Wellness Community</span></div>
        <div class="mk-audience-photo">${image(asset('reference-gift-edition.jpg'), 'Konsep kemasan Gift Edition Melooloo bermerek')}</div>
      </div>
      <div class="mk-pool-flow"><span>DARI PASAR KE TARGET TAHUN 1 <b>→</b></span><div>${pools.map(([label,value,unit],i)=>`<section class="${i===3?'selected':''}"><small>${label}</small><strong>${value}</strong><em>${unit}</em></section>`).join('')}</div></div>
    `, false, 'mk-combined-buyers');
  }

  function proximityAndProof(heading) {
    return scene(10, heading, `
      <div class="mk-position-city"><div class="mk-position-photo">${image(asset('reference-rooftop.jpg'), 'Visualisasi konsep greenhouse di rooftop Jakarta')}</div><div class="mk-position-place"><small>POSISI YANG DIRENCANAKAN</small><strong>Di dalam<br>Jakarta.</strong><span>Target &lt;24 jam dari panen ke rak.</span></div><div class="mk-position-gap"><b>&lt;70 ton</b><span>pasokan lokal terungkap</span><i>vs</i><b>236,9 ton</b><span>pasar pada 158 pintu</span></div></div>
      <div class="mk-position-difference"><div><small>SETARA · PoP</small><p>Target Brix ≥15 · jaring rata · residu di bawah BMR · kemasan hadiah</p></div><div><small>BERBEDA · PoD</small><ul><li>Panen dekat pasar</li><li>Kebun dapat dikunjungi</li><li>QR per buah ke data lot</li><li>Dipetik saat matang puncak</li></ul><div class="mk-proof-route"><span>KEBUN</span><b>→</b><span>LOT</span><b>→</b><span>BUAH</span></div></div><span>Sweet Greens ±90 km · jarak indikatif</span></div>
      <div class="mk-position-phone"><div class="mk-phone"><div class="mk-phone-top"><img src="assets/logo.png" alt="" aria-hidden="true"><b>melooloo</b><span>cek buahmu</span></div><div class="mk-phone-fruit">Signature <span>Grade A · contoh tampilan</span></div><div class="mk-phone-row"><small>KEBUN</small><strong>Greenhouse [kode]</strong></div><div class="mk-phone-row"><small>PANEN</small><strong>[tanggal] · [jam]</strong></div><div class="mk-phone-row"><small>RASA</small><strong>Uji Brix ≥15 · per lot</strong></div><div class="mk-phone-row"><small>KEAMANAN</small><strong>Ringkasan residu lot</strong></div><div class="mk-phone-journey"><span>TANAM</span><span>RAWAT</span><span>PANEN</span><span>UJI LOT</span></div><div class="mk-phone-bottom">Janji Manis <b>↗</b></div></div><span>RANCANGAN HALAMAN QR</span></div>
    `, false, 'mk-combined-proof');
  }

  function brandActivations(heading) {
    return scene(11, heading, `
      <div class="mk-gallery-card mk-gallery-primary">${image(asset('reference-garden-visit.jpg'), 'Konsep Kunjungan Kebun Melooloo dengan signage bermerek tanpa wajah')}<div><small>01 / DILIHAT</small><strong>Kunjungan Kebun</strong><span>Asal dan cara budidaya dapat diperiksa sendiri.</span></div></div>
      <div class="mk-gallery-card">${image(asset('reference-uji-manis.jpg'), 'Konsep booth Uji Manis Melooloo tanpa wajah')}<div><small>02 / DICICIPI</small><strong>Uji Manis</strong><span>Rasa diperlihatkan di titik beli.</span></div></div>
      <div class="mk-gallery-card">${image(editorial('pilates-props-v1.png'), 'Properti aktivasi komunitas Pilates Melooloo tanpa orang')}<div><small>03 / DIBAGIKAN</small><strong>Komunitas</strong><span>Studio dan klub lari memperkenalkan pengalaman merek.</span></div></div>
    `, false, 'mk-18 mk-combined-activations');
  }

  function productAndPrice(heading) {
    return scene(12, heading, `
      <div class="mk-price-head"><div><small>POSISI HARGA</small><strong>14–17×</strong><span>di bawah Crown Melon pada harga langsung Rp99.000/kg</span></div><div class="mk-price-scale"><div><span>HPP RENCANA</span><b>Rp28,7 rb/kg</b></div><div><span>MELOOLOO B2B</span><b>Rp75 rb/kg</b></div><div><span>LANGSUNG</span><b>Rp99 rb/kg</b></div><div><span>CROWN MELON</span><b>Rp1,3–1,7 jt/kg</b></div></div></div>
      <div class="mk-format-grid"><div>${image(asset('reference-signature-pack.jpg'), 'Konsep Signature Pack Melooloo dengan segel bermerek')}<strong>Lewat mitra</strong><span>Signature · Chef Selection</span><b>±62% margin kotor rencana</b></div><div>${image(asset('reference-gift-edition.jpg'), 'Konsep Gift Edition Melooloo dalam kotak bermerek')}<strong>Langsung</strong><span>Weekly · Season Pass · Gift Edition Rp535.000/box</span><b>±71% margin kotor rencana</b></div></div>
      <div class="mk-price-evidence"><strong>45,8%</strong><span>survei bersedia membayar ≥Rp100.000 per buah</span></div>
    `, false, 'mk-14 mk-combined-price');
  }

  function launchAndImc(heading) {
    const steps=[
      ['K3 · Y0','Panen pertama','tasting dinner 7 hotel · uji pra-pesan'],
      ['K4 · Y0','Masuk kanal','18 akun HoReCa · 17 pintu ritel'],
      ['Y1','Bangun kebiasaan','Weekly · Season Pass · Gift Edition · kunjungan']
    ];
    const imc=[
      ['Pengalaman','338',44],
      ['Digital & CRM','240',31],
      ['Kredibilitas','99',13],
      ['Penjualan B2B','91',12]
    ];
    return scene(13, heading, `
      <div class="mk-launch-steps"><small>URUTAN MASUK PASAR · TARGET</small>${steps.map(([when,title,detail])=>`<div><b>${when}</b><strong>${title}</strong><span>${detail}</span></div>`).join('')}</div>
      <div class="mk-launch-mix"><small>BAURAN VOLUME GRADE A</small><div><b>Y1</b><span style="--b2b:68%">68% B2B <em>32% B2C</em></span></div><div><b>Y5</b><span style="--b2b:40%">40% B2B <em>60% B2C</em></span></div><p>B2B menjaga volume; B2C menaikkan porsi margin.</p></div>
      <div class="mk-launch-imc"><small>IMC Y1 · Rp768 JUTA</small>${imc.map(([label,value,width])=>`<div><span>${label}</span><b>Rp${value} jt</b><i><em style="width:${width}%"></em></i></div>`).join('')}<p>Target 2.912 pelanggan baru · 17 pintu ritel · 17 akun HoReCa</p></div>
    `, false, 'mk-combined-channel');
  }

  function measuredJourney(heading) {
    const stages=[
      ['01','KENAL','Konten panen · menu hotel · komunitas · PR','10% → 40%','aided awareness SES A/A+ · Y1 ke Y5'],
      ['02','COBA & BELI','Uji Manis · Kunjungan Kebun · Signature · situs','3.303 → 10.909','pelanggan B2C aktif · Y1 ke Y5'],
      ['03','SETIA & MEREKOMENDASIKAN','Weekly · QR · Janji Manis · referral','35% → 58%','retensi B2C · Y1 ke Y5']
    ];
    return scene(14, heading, `
      <div class="mk-journey-track"><span>KENAL</span><b>→</b><span>COBA &amp; BELI</span><b>→</b><span>SETIA</span><b class="mk-loop">↶ referral</b></div>
      <div class="mk-journey-grid">${stages.map(([n,title,touch,value,kpi])=>`<div class="mk-journey-step" data-step="${n}"><small>${n} / TAHAP</small><strong>${title}</strong><p>${touch}</p><div><b>${value}</b><span>${kpi}</span></div></div>`).join('')}</div>
      <div class="mk-measure"><span>DIUKUR DENGAN</span><b>survei merek dua kali setahun</b><b>CRM per sumber pelanggan</b><b>audit menu dan harga rak</b></div>
    `, false, 'mk-17');
  }

  function spendingAndGates(heading) {
    const gates=[
      ['01','Sebelum Weekly','≥100 pra-pesan berbayar','lolos → diluncurkan'],
      ['02','Akhir Tahun 1','800 pelanggan program + retensi 35%','bila belum tercapai → alihkan anggaran'],
      ['03','Sebelum ekspansi','≥90% Grade A harga penuh · 2 siklus','lolos → tahap atau kota baru']
    ];
    return scene(15, heading, `
      <div class="mk-econ-top"><div><small>TAHUN 1 · BUDGET</small><strong>Rp768 <em>juta</em></strong><span>10,3% pendapatan proyeksi</span></div><div><small>TAHUN 5 · RASIO BUDGET</small><strong>5,9<em>%</em></strong><span>turun seiring skala penjualan</span></div><div><small>CAC IKLAN</small><strong>75 → 40 <em>rb</em></strong><span>target biaya per pelanggan · Y1 ke Y5</span></div></div>
      <div class="mk-econ-nmc"><span>NMC TAHUN 1 → TAHUN 5</span><strong>Rp3,8 M <b>→</b> Rp20,1 M</strong><small>proyeksi kontribusi pemasaran</small></div>
      <div class="mk-gates"><div class="mk-gates-label">TIGA REM SEBELUM BELANJA &amp; EKSPANSI</div>${gates.map(([n,when,target,decision])=>`<div data-gate="${n}"><small>${n} / ${when}</small><strong>${target}</strong><span>${decision}</span></div>`).join('')}</div>
    `, false, 'mk-19');
  }

  const renderers = {
    8: buyerProblem,
    9: buyersAndMarket,
    10: proximityAndProof,
    11: brandActivations,
    12: productAndPrice,
    13: launchAndImc,
    14: measuredJourney,
    15: spendingAndGates
  };
  window.MELOOLOO_RENDER_MARKETING = (n, item, heading) =>
    renderers[n]?.(heading) || null;
})();
