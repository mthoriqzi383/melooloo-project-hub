(() => {
  'use strict';
  const slides = window.MELOOLOO_SLIDES;
  if (!Array.isArray(slides) || slides.length !== 66) throw new Error('Expected exactly 66 presentation slides.');
  const story = window.MELOOLOO_STORY;
  if (!Array.isArray(story) || story.length !== 66) throw new Error('Expected exactly 66 redesigned slides.');
  if (typeof window.MELOOLOO_RENDER_FINANCE !== 'function') throw new Error('Finance visual layouts did not load.');
  if (typeof window.MELOOLOO_RENDER_OPERATIONS !== 'function') throw new Error('Operations visual layouts did not load.');
  if (typeof window.MELOOLOO_RENDER_HR !== 'function') throw new Error('HR visual layouts did not load.');
  const $ = id => document.getElementById(id);
  const sections = [
    {name:'Peluang & model',start:1,end:7,palette:0,cue:'Dari celah pasar menuju model bisnis'},
    {name:'Operasi & teknologi',start:20,end:47,palette:2,cue:'Dari satu greenhouse menjadi sistem'},
    {name:'Tim',start:48,end:52,palette:3,cue:'Orang yang menjaga mutu setiap hari'},
    {name:'Investasi',start:53,end:56,palette:4,cue:'Modal untuk membangun kapasitas'},
    {name:'Kelayakan',start:57,end:64,palette:5,cue:'Apakah angka mendukung keputusan?'},
    {name:'Pasar & merek',start:8,end:19,palette:1,cue:'Dari target menuju pengalaman merek'},
    {name:'Penutup',start:65,end:66,palette:6,cue:'Keputusan dan langkah berikutnya'}
  ];
  const reservedPages = new Set([45,46]);
  const routeOrder = sections.flatMap(section => Array.from({length:section.end-section.start+1},(_,i)=>section.start+i)).filter(n => !reservedPages.has(n));
  if (routeOrder.length !== 64 || new Set(routeOrder).size !== 64) throw new Error('Presentation route must include 64 pages and exclude Cadangan.');
  const modelUrl = '../Greenhouse_Full_Facility_Walkthrough_28Sep2026/index.html?city=1&fly=1';
  const contexts = {
    21:['CORNER_SE','Lihat lokasi rooftop'],22:['CORNER_SE','Lihat lokasi rooftop'],
    29:['G04','Masuk ke grow aisle'],30:['G04','Masuk ke grow aisle'],
    31:['G11','Lihat titik sensor'],32:['G11','Lihat titik sensor'],
    37:['G11','Lihat sistem monitoring'],38:['S03','Lihat area nursery']
  };
  let page = 1;
  let playing = false;
  let chapterTimer;
  let sceneLoaded = false;
  let priorFocus;
  let beat = 0;
  let draftEdits = {schema:1,slides:{}};
  const publishedEdits = window.MELOOLOO_PUBLISHED_EDITS || {schema:1,slides:{}};
  const editCore = window.MELOOLOO_SLIDE_EDIT_CORE;
  if (new URLSearchParams(location.search).has('editor')) document.documentElement.classList.add('editor-preview');
  let editableTexts = [];
  function applySlideEdits() {
    editableTexts = editCore?.apply($('storySlide'),page,publishedEdits,draftEdits) || [];
    const visibleTitle = $('storySlide').querySelector('.story-copy h2');
    if (visibleTitle) $('slideTitle').textContent = visibleTitle.textContent;
  }
  const interactiveBeats = {
    3: [
      ['Permintaan premium','Estimasi kebutuhan di DKI: 1.460–2.190 ton per tahun.'],
      ['Pasokan bermerek','Estimasi pasokan dari produsen lokal bermerek: 400–1.200 ton per tahun.'],
      ['Celah estimasi','Selisih kedua rentang tersebut diperkirakan 260–1.790 ton per tahun.']
    ],
    5: [
      ['Pendatang baru','Sedang · skor 2,825. Hambatan masuk: investasi, keahlian teknis, standar ritel, dan akses benih.'],
      ['Daya tawar pembeli','Tinggi · pembeli memiliki alternatif pasokan lokal dan impor.'],
      ['Daya tawar pemasok','Sedang · diversifikasi, kontrak tahunan, dan pengembangan nursery sendiri.'],
      ['Ancaman substitusi','Sedang · impor Jepang dan buah premium lokal. Pembeda: kesegaran dan kedekatan.'],
      ['Rivalitas','Sedang · persaingan antarprodusen melon premium.']
    ],
    7: [
      ['Customer Segments','B2B supermarket premium · B2C konsumen urban.'],
      ['Value Propositions','Melon premium, manis konsisten, tampilan dan kemasan.'],
      ['Channels','Distribusi B2B, event dan HoReCa, marketplace.'],
      ['Customer Relationships','Account management, cerita merek, media sosial, komunitas.'],
      ['Revenue Streams','Kontrak B2B dan penjualan langsung B2C.'],
      ['Key Resources','Greenhouse, sensor IoT, benih premium, tim agronomis.'],
      ['Key Activities','Automasi, quality control, distribusi, branding, R&D.'],
      ['Key Partners','Pemasok, mitra greenhouse dan IoT, ritel, institusi riset.'],
      ['Cost Structure','Konstruksi, operasi, benih, tenaga, pemasaran, R&D, utilitas.']
    ],
    31: [
      ['Suhu','Blower dan exhaust bekerja otomatis dalam target 25–30°C siang dan 18–22°C malam.'],
      ['Kelembapan','Dehumidifier menjaga 60–70% saat tumbuh dan 50–60% saat berbuah.'],
      ['pH','Operator memeriksa dua kali sehari lalu mengoreksi larutan ke rentang 5,8–6,5.'],
      ['EC / TDS','Operator menyesuaikan AB Mix dan air RO sesuai fase, dari 900 hingga 1.750 ppm.']
    ],
    33: [
      ['Y0 · masa coba','35 greenhouse di dua lokasi menjalankan dua siklus; panen 50,3 ton.'],
      ['Y2 · modul bertambah','52 greenhouse di tiga lokasi; unit baru hanya dihitung tiga siklus tahun itu.'],
      ['Y6 · kota kedua','Surabaya masuk dengan 24 unit baru; Jakarta berhenti pada 103 unit.'],
      ['Y10 · tiga kota','237 greenhouse di 11 lokasi menghasilkan proyeksi 816,6 ton.']
    ],
    43: [
      ['Fase 1 · kumpulkan','Rp950 juta untuk plasma nutfah dan persilangan awal.'],
      ['Fase 2 · seleksi','Rp1.050 juta untuk memilih 20–30 kandidat hibrida.'],
      ['Fase 3 · uji','Rp1.050 juta untuk uji greenhouse, BUSS, dan pendaftaran.'],
      ['Fase 4 · produksi','Rp1.200 juta untuk menjaga galur tetua dan memproduksi benih rutin.']
    ],
    49: [
      ['Seleksi kompetensi','Uji kemampuan agrikultur, adaptasi teknologi, kedisiplinan, integritas, dan keselarasan nilai.'],
      ['Onboarding','Orientasi budaya serta kemampuan teknis sebelum menangani proses greenhouse.'],
      ['Reality check','Kelulusan probation bergantung pada kinerja dan pemahaman sistem urban farming.']
    ],
    50: [
      ['Komersial','Business Development dan Marketing memiliki kepala fungsi serta staf pendukung.'],
      ['Operasi','HRGA, operasi lokasi, head grower, farmer, dan driver membentuk jalur pelaksanaan.'],
      ['Keuangan','Head of Finance memimpin staf Finance & Accounting di bawah Finance Director.']
    ],
    56: [
      ['Modal awal','Lima pendiri menanggung 100% dana awal Rp10.462 juta, masing-masing 20% saham.'],
      ['Ekspansi','Rencana CAPEX Y1–Y10 Rp46.094 juta: 30% kas internal dan 70% kredit investasi.']
    ],
    60: [
      ['Y0 · investasi','FCF kumulatif −Rp8,8 miliar setelah modal awal dan masa trial.'],
      ['Y2 · terendah','FCF kumulatif −Rp9,8 miliar; ekspansi memperpanjang pemulihan kas.'],
      ['Y5 · mendekati nol','FCF kumulatif −Rp1,5 miliar menjelang titik balik.'],
      ['Y6 · balik modal','FCF kumulatif +Rp2,0 miliar, sehingga payback diperkirakan 5,4 tahun.'],
      ['Y10 · skala','FCF kumulatif +Rp43,3 miliar; kas akhir yang berbeda definisi adalah Rp39,64 miliar.']
    ],
    63: [
      ['Pesimis · 25%','Pendapatan turun 25% dan OPEX naik 15% menghasilkan NPV negatif Rp19,9 miliar.'],
      ['Most likely · 55%','NPV dasar dengan nilai likuidasi Y10 adalah positif Rp23,5 miliar.'],
      ['Optimis · 20%','Dalam skenario optimis, NPV diproyeksikan mencapai Rp53,5 miliar.'],
      ['Expected NPV','Bobot 25%, 55%, dan 20% menghasilkan expected NPV sekitar Rp18,7 miliar.']
    ]
  };
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pad = n => String(n).padStart(2,'0');
  const sectionFor = n => sections.find(s => s.start <= n && n <= s.end);
  const pageImage = n => n === 7 ? 'assets/bmc-source-page-07.png' : slides[n - 1]?.image;
  const escape = value => String(value ?? '').replace(/[&<>"']/g,char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const figure = n => `figures/figure-${String(n).padStart(3,'0')}.jpg`;
  const wideFigures = new Set([7,10,33,50,52]);
  const photo = n => ({18:'figures/figure-018.jpg',22:'assets/roof-context.png',29:'assets/hero-greenhouse.png',30:'assets/hero-greenhouse.png'})[n] || 'assets/hero-greenhouse.png';
  const chapterIndex = n => sectionFor(n).palette;
  const sourceWarnings = {
    8:'Halaman Canva ini memakai proyeksi pendapatan Y1 lama. Angka pada desain HTML, Rp7,4 miliar, mengikuti PowerPoint Keuangan Mery halaman 6.',
    17:'Halaman Canva ini memakai anggaran pemasaran Y1 lama. Angka pada desain HTML, Rp768 juta untuk pemasaran dan penjualan, mengikuti tabel OPEX PowerPoint Keuangan Mery halaman 5.',
    20:'Materi operasi awal pada Canva memakai roadmap 35→52 greenhouse; rangkaian operasi rinci setelahnya memakai skenario 35→237 greenhouse. Keduanya dipertahankan sesuai materi sumber.',
    21:'Lokasi Jakarta Selatan dan Timur pada halaman sumber adalah usulan lama. Lokasi rooftop saat ini tetap usulan dan membutuhkan verifikasi lapangan.',
    23:'Angka slide operasi mengikuti Canva awal. Materi keuangan Mery pada slide 53–64 memakai model yang lebih baru.',
    25:'Angka headcount pada materi operasi awal mengikuti skenario 52 greenhouse. Materi HR revisi dan skenario operasi rinci memiliki horizon berbeda.',
    43:'Anggaran pemuliaan benih Rp4.250 juta pada halaman sumber adalah usulan tambahan dan belum masuk proyeksi keuangan dasar PowerPoint Mery.',
    51:'Total headcount pada tabel sumber dipakai dalam grafik HTML. Rincian per jabatan belum sepenuhnya menjumlah ke total tercetak; angka tersebut perlu direkonsiliasi sebelum sidang.',
    52:'Payroll all pada tabel SDM tidak sama dengan baris Gaji & tunjangan di OPEX PowerPoint Mery. Total Y9 pada tabel SDM juga tidak sama dengan jumlah empat komponennya (Rp11.255 juta setelah pembulatan vs total tercetak Rp11.524 juta). Perlu rekonsiliasi sebelum sidang.',
    56:'Model sumber menyebut pendanaan Y0 100% ekuitas pendiri, sementara WACC 12,77% dihitung dengan bobot ekuitas:utang 50:50. Bobot 50:50 adalah asumsi valuasi dan perlu dijelaskan atau dihitung ulang untuk struktur pendanaan aktual.',
    65:'Halaman Canva ini menggunakan model keuangan lama. Angka keuangan yang berlaku untuk presentasi ini berasal dari PowerPoint Mery pada slide 53–64.'
  };

  function setUrl(value) { history.replaceState(null,'',location.pathname + location.search + '#' + value); }
  function factMarkup(facts, type) {
    return `<div class="story-facts story-facts-${type}">${facts.map(([value,label],i)=>`<div class="story-fact" style="--fact-index:${i}"><span class="story-fact-index">${pad(i+1)}</span><strong>${escape(value)}</strong><span class="story-fact-label">${escape(label)}</span></div>`).join('')}</div>`;
  }
  function renderStory(n) {
    const item = story[n-1];
    const section = sectionFor(n);
    const start = `<article class="story-canvas story-${item.type}${wideFigures.has(n)?' story-wide':''} story-chapter-${chapterIndex(n)}${item.type==='finance'?'':' story-visual'}" aria-label="Slide sumber ${n}: ${escape(item.title)}"><div class="story-grain" aria-hidden="true"></div><div class="story-topline"><span><i></i> MELOOLOO / ${item.type==='finance'?'KEUANGAN':escape(section.name).toUpperCase()}</span></div>`;
    const financeOverline = {54:'ASUMSI PROYEKSI',55:'INVESTASI',56:'PENDANAAN',57:'RENCANA CAPEX & OPEX',58:'PROYEKSI LABA RUGI',59:'NERACA'};
    const overline = n >= 60 && n <= 64 ? '' : financeOverline[n] || section.name;
    const heading = `<div class="story-copy">${overline ? `<div class="story-overline">${escape(overline)}</div>` : ''}<h2>${escape(item.title)}</h2><p>${escape(item.lead)}</p></div>`;
    const footer = `<div class="story-footer"><span>PT MELOOLOO SEGAR INDONESIA</span></div>`;
    let body;
    const visual = window.MELOOLOO_RENDER_HR?.(n,item,heading) || window.MELOOLOO_RENDER_OPERATIONS?.(n,item,heading) || window.MELOOLOO_RENDER_VISUAL?.(n,item,heading);
    if (visual) {
      body = visual;
    } else if (item.type === 'finance') {
      body = window.MELOOLOO_RENDER_FINANCE(n,heading);
    } else if (item.type === 'hero') {
      body = `<div class="story-hero-photo" aria-hidden="true"></div><div class="story-hero-wash" aria-hidden="true"></div><div class="story-hero-content">${heading}${factMarkup(item.facts,'hero')}</div>`;
    } else if (item.type === 'figure') {
      body = `<div class="story-layout story-layout-figure">${heading}${factMarkup(item.facts,'rail')}<button class="story-figure" type="button" data-open-source aria-label="Buka halaman ${n} dari PDF sumber"><img src="${figure(n)}" alt="Potongan bagan atau tabel dari slide sumber ${n}"><span>PERBESAR DATA SUMBER <b>↗</b></span></button></div>`;
    } else if (item.type === 'chart') {
      const harvest = [50.3,100.5,162.3,223.4,284.4,345.5,421.6,490.5,576.0,706.0,816.6];
      const bars = harvest.map((value,i)=>`<div class="story-chart-item" style="--height:${(value/816.6*100).toFixed(2)}%;--bar-index:${i}"><span class="story-chart-value">${String(value.toFixed(1)).replace('.',',')}</span><span class="story-chart-bar"></span><strong>Y${i}</strong></div>`).join('');
      body = `<div class="story-layout story-layout-chart">${heading}${factMarkup(item.facts,'chart')}<button class="story-chart" type="button" data-open-source aria-label="Buka tabel sumber produksi per tahun"><span class="story-chart-axis">TON / TAHUN</span><span class="story-chart-grid" aria-hidden="true"></span><span class="story-chart-bars">${bars}</span><span class="story-chart-source">LIHAT TABEL LENGKAP DARI PDF SUMBER ↗</span></button></div>`;
    } else if (item.type === 'photo') {
      const note = n === 22 || n === 29 || n === 30 ? 'VISUALISASI KONSEP · BUKAN DOKUMENTASI LOKASI TERPASANG' : 'VISUALISASI KONSEP';
      body = `<div class="story-layout story-layout-photo">${heading}<div class="story-photo-frame"><img src="${photo(n)}" alt="Visual pendukung ${escape(item.title)}"><span>${note}</span></div>${factMarkup(item.facts,'photo')}</div>`;
    } else {
      body = `<div class="story-layout story-layout-cards">${heading}<div class="story-cards-art" aria-hidden="true"></div>${factMarkup(item.facts,'grid')}</div>`;
    }
    $('storySlide').innerHTML = start + body + footer + '</article>';
    $('storySlide').querySelectorAll('[data-open-source]').forEach(button => button.addEventListener('click',openSource));
    $('storySlide').querySelectorAll('[data-beat-target]').forEach(button => button.addEventListener('click',() => setBeat(Number(button.dataset.beatTarget))));
  }
  function setBeat(value) {
    const steps = interactiveBeats[page];
    if (!steps) return;
    beat = Math.min(steps.length-1,Math.max(0,value));
    const scene = $('storySlide').querySelector('[data-interactive-slide]');
    if (!scene) return;
    scene.dataset.beat = String(beat);
    scene.querySelectorAll('[data-beat-target]').forEach(button => {
      const index = Number(button.dataset.beatTarget);
      button.dataset.active = String(index === beat);
      button.dataset.past = String(index < beat);
      button.setAttribute('aria-pressed',String(index === beat));
    });
    scene.querySelectorAll('.vs-forces-lines path').forEach((path,index) => { path.dataset.active = String(index === beat); });
    scene.querySelector('[data-beat-number]').textContent = `${pad(beat+1)} / ${pad(steps.length)}`;
    scene.querySelector('[data-beat-title]').textContent = steps[beat][0];
    scene.querySelector('[data-beat-description]').textContent = steps[beat][1];
    applySlideEdits();
    $('stageNext').setAttribute('aria-label',beat < steps.length-1 ? `Sorot tahap berikutnya: ${steps[beat+1][0]}` : 'Halaman berikutnya');
    $('stagePrev').setAttribute('aria-label',beat > 0 ? `Kembali ke tahap sebelumnya: ${steps[beat-1][0]}` : 'Halaman sebelumnya');
  }
  function showChapter(section) {
    if (reducedMotion) return;
    clearTimeout(chapterTimer);
    const number = sections.indexOf(section) + 1;
    $('chapterVeil').dataset.chapter = String(number);
    $('chapterVeilKicker').textContent = `MELOOLOO / BAGIAN ${pad(number)}`;
    $('chapterVeilTitle').textContent = section.name;
    $('chapterVeilRange').textContent = `${section.cue} · HALAMAN ${pad(section.start)}–${pad(section.end)}`;
    const veil = $('chapterVeil');
    veil.classList.remove('is-visible');
    void veil.offsetWidth;
    veil.classList.add('is-visible');
    chapterTimer = setTimeout(() => veil.classList.remove('is-visible'), 1400);
  }
  function syncContext() {
    const context = contexts[page];
    $('contextAction').hidden = !context;
    if (context) $('contextTitle').textContent = context[1];
    $('playerMap').innerHTML = `<span class="map-launch-icon" aria-hidden="true">◇</span> ${escape(context?.[1] || 'Buka 3D')}`;
    $('playerMap').setAttribute('aria-label', context ? `${context[1]} dalam model 3D` : 'Buka model greenhouse 3D');
  }
  function syncDrawer() {
    document.querySelectorAll('.drawer-item').forEach(button => {
      if (Number(button.dataset.page) === page) button.setAttribute('aria-current','page');
      else button.removeAttribute('aria-current');
    });
  }
  function showPage(value, options={}) {
    const requestedPage = Math.min(66,Math.max(1,Number(value) || 1));
    const nextPage = reservedPages.has(requestedPage) ? 47 : requestedPage;
    const routePosition = routeOrder.indexOf(nextPage);
    const previousSection = sectionFor(page);
    const nextSection = sectionFor(nextPage);
    const changed = page !== nextPage;
    page = nextPage;
    if (!playing) { playing = true; $('landing').hidden = true; $('player').hidden = false; }
    $('slideCount').textContent = `${pad(routePosition+1)} / ${routeOrder.length}`;
    $('chapterLabel').textContent = nextSection.name.toUpperCase();
    $('progressChapter').textContent = nextSection.name;
    $('slideTitle').textContent = story[page-1].title;
    $('progressFill').style.width = `${(routePosition+1) / routeOrder.length * 100}%`;
    $('stagePrev').disabled = routePosition === 0;
    $('stageNext').disabled = routePosition === routeOrder.length - 1;
    syncContext(); syncDrawer();
    setUrl(`slide=${page}`);
    if (changed || options.force) {
      renderStory(page);
      beat = 0;
      if (interactiveBeats[page]) setBeat(0);
      else {
        $('stageNext').setAttribute('aria-label','Halaman berikutnya');
        $('stagePrev').setAttribute('aria-label','Halaman sebelumnya');
        applySlideEdits();
      }
    }
    if (changed && previousSection !== nextSection && !options.skipChapter) showChapter(nextSection);
  }
  function next() {
    if (interactiveBeats[page] && beat < interactiveBeats[page].length-1) setBeat(beat+1);
    else showPage(routeOrder[Math.min(routeOrder.length - 1,routeOrder.indexOf(page)+1)]);
  }
  function prev() {
    if (interactiveBeats[page] && beat > 0) setBeat(beat-1);
    else {
      showPage(routeOrder[Math.max(0,routeOrder.indexOf(page)-1)]);
      if (interactiveBeats[page]) setBeat(interactiveBeats[page].length-1);
    }
  }
  function exit() {
    closeDrawer(); closeText(); closeSource(); closeScene();
    playing = false;
    $('player').hidden = true;
    $('landing').hidden = false;
    setUrl('cover');
    $('startButton').focus();
  }

  function buildNavigation() {
    const index = $('landingIndex');
    const list = $('drawerList');
    for (const section of sections) {
      const jump = document.createElement('button');
      jump.type = 'button';
      jump.innerHTML = `<small>${pad(section.start)}–${pad(section.end)}</small><strong></strong>`;
      jump.querySelector('strong').textContent = section.name;
      jump.addEventListener('click',() => showPage(section.start,{skipChapter:true}));
      index.append(jump);
      const heading = document.createElement('h3');
      heading.className = 'drawer-section';
      heading.textContent = `${pad(section.start)}–${pad(section.end)} / ${section.name.toUpperCase()}`;
      list.append(heading);
      for (let n=section.start;n<=section.end;n++) {
        if (reservedPages.has(n)) continue;
        const item = document.createElement('button');
        item.type = 'button'; item.className = 'drawer-item'; item.dataset.page = String(n);
        item.dataset.search = `${n} ${story[n-1].title} ${slides[n-1].title} ${slides[n-1].section} ${slides[n-1].text}`.toLocaleLowerCase();
        const num = document.createElement('span'); num.textContent = pad(n);
        const title = document.createElement('strong'); title.textContent = story[n-1].title;
        item.append(num,title);
        item.addEventListener('click',() => { showPage(n,{skipChapter:true}); closeDrawer(); });
        list.append(item);
      }
    }
  }
  function openDrawer() {
    priorFocus = document.activeElement;
    $('drawer').hidden = false; $('scrim').hidden = false;
    $('slideSearch').value = '';
    filterDrawer(); syncDrawer();
    $('slideSearch').focus();
  }
  function closeDrawer() {
    if ($('drawer').hidden) return;
    $('drawer').hidden = true; $('scrim').hidden = true;
    priorFocus?.focus?.();
  }
  function filterDrawer() {
    const query = $('slideSearch').value.trim().toLocaleLowerCase();
    for (const item of document.querySelectorAll('.drawer-item')) item.hidden = !item.dataset.search.includes(query);
    for (const heading of document.querySelectorAll('.drawer-section')) {
      let sibling = heading.nextElementSibling; let visible = false;
      while (sibling && !sibling.classList.contains('drawer-section')) { if (!sibling.hidden) visible = true; sibling = sibling.nextElementSibling; }
      heading.hidden = !visible;
    }
  }
  function openText() {
    priorFocus = document.activeElement;
    $('textModalTitle').textContent = `${pad(page)} / ${slides[page-1].title}`;
    const extracted = slides[page-1].text.trim();
    const warning = sourceWarnings[page] ? `CATATAN: ${sourceWarnings[page]}\n\n` : '';
    $('slideText').textContent = warning + (extracted.length > 100 ? extracted : 'Halaman ini terutama berupa gambar atau tabel, sehingga teks otomatisnya tidak lengkap. Buka “Referensi” untuk membaca data lengkap.');
    $('textModal').hidden = false;
    $('textModalClose').focus();
  }
  function closeText() { if (!$('textModal').hidden) { $('textModal').hidden = true; priorFocus?.focus?.(); } }
  function openSource() {
    priorFocus = document.activeElement;
    $('sourceModalTitle').textContent = `${pad(page)} / ${story[page-1].title}`;
    $('sourceModalKicker').textContent = page === 57 || page === 59 ? `POWERPOINT REVISI MERY · HALAMAN ${page === 57 ? '01' : '02'}` : page >= 53 && page <= 64 ? `POWERPOINT KEUANGAN MERY · HALAMAN ${pad(page-52)}` : sourceWarnings[page] ? 'HALAMAN ASLI · LIHAT CATATAN PEMBARUAN' : 'HALAMAN ASLI DARI PDF CANVA';
    $('sourceModalNotice').hidden = !sourceWarnings[page];
    $('sourceModalNotice').textContent = sourceWarnings[page] || '';
    $('sourceModalImage').src = pageImage(page);
    $('sourceModalImage').alt = `Halaman PDF sumber ${page}: ${slides[page-1].title}`;
    $('sourceModal').hidden = false;
    $('sourceModalClose').focus();
  }
  function closeSource() { if (!$('sourceModal').hidden) { $('sourceModal').hidden = true; priorFocus?.focus?.(); } }
  function setStop(stop) {
    const src = `${modelUrl}#${encodeURIComponent(stop)}`;
    const frame = $('sceneFrame');
    $('sceneDirectLink').href = src;
    document.querySelectorAll('[data-stop]').forEach(b => b.setAttribute('aria-current',String(b.dataset.stop===stop)));
    if (!sceneLoaded || !frame.src) { frame.src = src; sceneLoaded = true; }
    else { try { frame.contentWindow.location.hash = stop; } catch { frame.src = src; } }
  }
  function openScene(stop) {
    priorFocus = document.activeElement;
    $('scene').hidden = false;
    setStop(stop || contexts[page]?.[0] || 'CORNER_SE');
    $('sceneClose').focus();
  }
  function closeScene() {
    if ($('scene').hidden) return;
    $('scene').hidden = true;
    priorFocus?.focus?.();
  }
  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.().catch(() => {});
  }
  function loadHash() {
    const match = location.hash.match(/^#slide=(\d+)$/);
    if (match) showPage(Number(match[1]),{skipChapter:true,force:true});
  }

  buildNavigation();
  $('startButton').addEventListener('click',() => showPage(1,{force:true,skipChapter:true}));
  $('landingMap').addEventListener('click',() => openScene('CORNER_SE'));
  $('headerMap').addEventListener('click',() => openScene('CORNER_SE'));
  $('headerChapters').addEventListener('click',openDrawer);
  $('contentsButton').addEventListener('click',openDrawer);
  $('drawerClose').addEventListener('click',closeDrawer);
  $('scrim').addEventListener('click',closeDrawer);
  $('slideSearch').addEventListener('input',filterDrawer);
  $('transcriptButton').addEventListener('click',openText);
  $('sourceButton').addEventListener('click',openSource);
  $('textModalClose').addEventListener('click',closeText);
  $('textModal').addEventListener('click',event => { if (event.target === $('textModal')) closeText(); });
  $('sourceModalClose').addEventListener('click',closeSource);
  $('sourceModal').addEventListener('click',event => { if (event.target === $('sourceModal')) closeSource(); });
  $('fullscreenButton').addEventListener('click',toggleFullscreen);
  $('stagePrev').addEventListener('click',prev);
  $('stageNext').addEventListener('click',next);
  $('exitButton').addEventListener('click',exit);
  $('playerMap').addEventListener('click',() => openScene(contexts[page]?.[0] || 'CORNER_SE'));
  $('contextButton').addEventListener('click',() => openScene(contexts[page]?.[0] || 'CORNER_SE'));
  $('sceneClose').addEventListener('click',closeScene);
  $('sceneFrame').addEventListener('load',() => $('scene').classList.add('is-ready'));
  document.querySelectorAll('[data-stop]').forEach(button => button.addEventListener('click',() => setStop(button.dataset.stop)));
  document.addEventListener('keydown',event => {
    if (event.key === 'Escape') { if (!$('scene').hidden) closeScene(); else if (!$('sourceModal').hidden) closeSource(); else if (!$('textModal').hidden) closeText(); else if (!$('drawer').hidden) closeDrawer(); return; }
    if (!$('scene').hidden || !$('sourceModal').hidden || !$('textModal').hidden || !$('drawer').hidden) return;
    if (event.target instanceof HTMLInputElement) return;
    if (event.target instanceof HTMLElement && event.target.closest('[data-beat-target]') && event.key === ' ') return;
    if (!playing) { if (event.key === 'Enter' && document.activeElement === document.body) showPage(1,{force:true}); return; }
    if (['ArrowRight','PageDown',' '].includes(event.key)) { event.preventDefault(); next(); }
    else if (['ArrowLeft','PageUp'].includes(event.key)) { event.preventDefault(); prev(); }
    else if (event.key === 'Home') { event.preventDefault(); showPage(1); }
    else if (event.key === 'End') { event.preventDefault(); showPage(routeOrder.at(-1)); }
    else if (event.key.toLowerCase() === 'f') toggleFullscreen();
    else if (event.key.toLowerCase() === 'g') openScene(contexts[page]?.[0] || 'CORNER_SE');
  });
  addEventListener('hashchange',loadHash);
  if (new URLSearchParams(location.search).has('editor')) {
    $('storySlide').addEventListener('click', event => {
      const target = event.target;
      if (!(target instanceof Element) || !target.closest('.story-canvas')) return;
      const range = document.caretRangeFromPoint?.(event.clientX,event.clientY);
      const direct = range?.startContainer?.nodeType === Node.TEXT_NODE ? range.startContainer : null;
      let entry = direct && editableTexts.find(item => item.node === direct);
      if (!entry && target !== $('storySlide').querySelector('.story-canvas')) {
        entry = editableTexts.find(item => item.parent === target || target.contains(item.parent));
      }
      if (entry) parent.postMessage({type:'melooloo-editor-pick',page,index:entry.index},location.origin);
    });
    window.MELOOLOO_EDITOR_API = {
      getPage: () => page,
      getPrimaryTexts: () => {
        const title = $('storySlide').querySelector('.story-copy h2');
        const lead = $('storySlide').querySelector('.story-copy p');
        return {
          title: editableTexts.find(entry => entry.parent === title)?.index ?? null,
          lead: editableTexts.find(entry => entry.parent === lead)?.index ?? null
        };
      },
      getTexts: () => editableTexts.map(({index,base,current,approved,proposed,tag,parent}) => ({
        index,base,current,approved,proposed,tag,
        visible: !!parent && getComputedStyle(parent).visibility !== 'hidden'
      })),
      highlight: index => {
        document.querySelectorAll('[data-editor-highlight]').forEach(el => {
          el.style.outline = el.dataset.editorOldOutline || '';
          delete el.dataset.editorHighlight;
          delete el.dataset.editorOldOutline;
        });
        const target = editableTexts.find(entry => entry.index === index)?.parent;
        if (target) {
          target.dataset.editorOldOutline = target.style.outline;
          target.dataset.editorHighlight = '1';
          target.style.outline = '2px solid #c7ed94';
        }
      },
      setDraft: value => {
        draftEdits = value && value.schema === 1 && value.slides ? value : {schema:1,slides:{}};
        showPage(page,{force:true,skipChapter:true});
      },
      showPage: value => showPage(value,{force:true,skipChapter:true})
    };
  }
  loadHash();
})();
