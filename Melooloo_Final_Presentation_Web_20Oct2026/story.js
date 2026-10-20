(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) document.documentElement.classList.add('motion-ready');

  const head = $('#siteHead');
  const progress = $('#readProgress');
  const heroPhoto = $('.hero-photo');
  const heroHeight = $('.hero').offsetHeight;
  let frame = 0;
  function updateScroll() {
    frame = 0;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    head.classList.toggle('scrolled', scrollY > 32);
    if (!reduceMotion && scrollY <= heroHeight) heroPhoto.style.setProperty('--hero-shift', `${(-scrollY * .085).toFixed(1)}px`);
  }
  addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(updateScroll); }, {passive:true});
  addEventListener('resize', updateScroll);
  updateScroll();

  const menuToggle = $('#menuToggle');
  const nav = $('#storyNav');
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  $$('#storyNav a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));

  const reveal = $$('.reveal');
  const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  }, {threshold:.08, rootMargin:'0px 0px -7% 0px'}) : null;
  reveal.forEach(el => revealObserver ? revealObserver.observe(el) : el.classList.add('is-visible'));

  const sections = $$('main section[id]');
  const sectionObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      $$('#storyNav a').forEach(a => {
        const active = a.getAttribute('href') === `#${entry.target.id}`;
        a.classList.toggle('active', active);
        if (active) a.setAttribute('aria-current','location'); else a.removeAttribute('aria-current');
      });
    }
  }, {rootMargin:'-30% 0px -60% 0px'}) : null;
  if (sectionObserver) sections.forEach(el => sectionObserver.observe(el));

  const canvasData = [
    ['VALUE PROPOSITION','Manis konsisten. Asal dekat.','Melon premium dengan rasa, tampilan, dan kemasan yang dirancang untuk ritel dan hadiah.'],
    ['CUSTOMER SEGMENTS','B2B untuk volume. B2C untuk hubungan.','Ritel premium dan HoReCa menjadi pembeli utama; konsumen urban premium, gifting, dan komunitas memperluas kanal langsung.'],
    ['KEY ACTIVITIES','Kendalikan, periksa, lalu kirim.','Budidaya berbantuan IoT, quality control, pengemasan, distribusi, branding, dan pengembangan produk bekerja sebagai rangkaian.'],
    ['REVENUE STREAMS','Kontrak dan penjualan langsung.','Pendapatan berasal dari kontrak B2B dan pembelian langsung B2C. Struktur biaya mencakup greenhouse, benih, nutrisi, tenaga, utilitas, pemasaran, dan R&D.']
  ];
  const canvasExplain = $('#canvasExplain');
  $$('#canvasTabs button').forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.canvas);
    $$('#canvasTabs button').forEach(b => {const active = b === button; b.classList.toggle('is-active',active); b.setAttribute('aria-pressed',String(active));});
    const [label,title,body] = canvasData[index];
    canvasExplain.innerHTML = `<small>${label}</small><h3>${title}</h3><p>${body}</p>`;
  }));

  const channels = [
    ['01 / RITEL PREMIUM','Di rak tempat pelanggan mencari buah premium.','Pasokan terjadwal, kemasan siap rak, sampling di gerai mitra, dan materi titik jual.','Rp75.000/kg ke peritel'],
    ['02 / HOTEL & RESTORAN','Spesifikasi untuk dapur profesional.','Penjualan langsung ke chef dan hotel, dengan pasokan yang konsisten dan kemasan sesuai kebutuhan.','Rp75.000/kg B2B'],
    ['03 / E-GROCERY','Buah premium di kanal belanja rutin.','Kemasan siap kirim dan integrasi stok mendukung mitra e-grocery pada fase setelah kanal awal.','Rp78.000–82.000/kg pada sumber kanal'],
    ['04 / LANGSUNG B2C','Hubungan langsung dengan pembeli.','Website, WhatsApp, dan langganan melayani konsumen urban di area yang tidak berbenturan dengan gerai mitra.','Rp99.000/kg B2C'],
    ['05 / EVENT & KORPORAT','Hadiah menjadi titik masuk merek.','Gift Edition, aktivasi komunitas, dan pesanan korporat membutuhkan kapasitas musiman serta kemasan yang terjaga.','Rp535.000 per gift box tiga buah']
  ];
  const channelDetail = $('#channelDetail');
  $$('#channelButtons button').forEach(button => button.addEventListener('click', () => {
    const [label,title,body,price] = channels[Number(button.dataset.channel)];
    $$('#channelButtons button').forEach(b => {const active = b === button; b.classList.toggle('is-active',active); b.setAttribute('aria-pressed',String(active));});
    channelDetail.innerHTML = `<small>${label}</small><h4>${title}</h4><p>${body}</p><strong>${price}</strong>`;
  }));

  const stages = [
    {src:'assets/editorial/greenhouse-unit.jpg',alt:'Visual konsep satu unit greenhouse Melooloo',badge:'VISUAL KONSEP · MODUL GREENHOUSE',title:'Satu unit yang terukur',text:'200 m² per unit; 140 m² area tanam; 14 jalur DFT dengan 30 tanaman per jalur.'},
    {src:'assets/editorial/nursery.jpg',alt:'Visual konsep nursery bibit melon',badge:'VISUAL KONSEP · NURSERY',title:'Nursery berjalan paralel',text:'Bibit dipersiapkan terpisah agar slot greenhouse produktif dapat berlangsung sekitar 73 hari.'},
    {src:'assets/editorial/sensor-bench.jpg',alt:'Visual konsep sensor dan panel kontrol greenhouse',badge:'VISUAL KONSEP · SENSOR & PANEL',title:'Pembacaan menjadi tindakan',text:'Suhu dan kelembapan dapat otomatis; pH dan nutrisi diperiksa lalu dikoreksi operator.'},
    {src:'assets/editorial/grow-aisle.jpg',alt:'Visual konsep jalur tanaman melon di dalam greenhouse',badge:'VISUAL KONSEP · GROW HOUSE',title:'Mutu dijaga sampai panen',text:'Inspeksi, satu buah terpilih per tanaman, pengukuran Brix, sortir, dan pengiriman.'}
  ];
  const preloadStages = () => stages.slice(1).forEach(s => {const img = new Image(); img.src = s.src;});
  if ('IntersectionObserver' in window) {
    const preloadObserver = new IntersectionObserver(entries => {if (entries[0].isIntersecting) {preloadStages();preloadObserver.disconnect();}}, {rootMargin:'900px'});
    preloadObserver.observe($('#operationsStory'));
  } else preloadStages();
  const stageImage = $('#stageImage');
  let currentStage = 0;
  function setStage(index) {
    if (index === currentStage || !stages[index]) return;
    currentStage = index;
    const stage = stages[index];
    $$('.ops-step').forEach((step,i) => step.classList.toggle('is-active',i===index));
    $('#stageCounter').textContent = `${String(index+1).padStart(2,'0')} / 04`;
    $('#stageTitle').textContent = stage.title;
    $('#stageText').textContent = stage.text;
    $('#stageBadge').textContent = stage.badge;
    if (reduceMotion) {stageImage.src=stage.src; stageImage.alt=stage.alt; return;}
    stageImage.classList.add('changing');
    const next = new Image();
    next.onload = () => {if (currentStage !== index) return; stageImage.src=stage.src; stageImage.alt=stage.alt; requestAnimationFrame(()=>stageImage.classList.remove('changing'));};
    next.onerror = () => stageImage.classList.remove('changing');
    next.src=stage.src;
  }
  const steps = $$('.ops-step');
  if ('IntersectionObserver' in window) {
    const stepObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if (visible) setStage(Number(visible.target.dataset.stage));
    }, {threshold:[.1,.3,.55],rootMargin:'-26% 0px -25% 0px'});
    steps.forEach(el=>stepObserver.observe(el));
  }

  const production = [50.3,100.5,162.3,223.4,284.4,345.5,421.6,490.5,576.0,706.0,816.6];
  const x = i => 48 + i * 82.4;
  const y = v => 300 - v / 850 * 265;
  const line = production.map((v,i)=>`${i?'L':'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  $('#growthLine').setAttribute('d',line);
  $('#growthArea').setAttribute('d',`${line} L 872 300 L 48 300 Z`);
  $('#growthDots').innerHTML = [0,5,10].map(i => `<circle class="growth-dot" cx="${x(i).toFixed(1)}" cy="${y(production[i]).toFixed(1)}" r="6"/><text class="growth-dot-label" x="${x(i).toFixed(1)}" y="${(y(production[i])-16).toFixed(1)}" text-anchor="${i===0?'start':i===10?'end':'middle'}">${String(production[i]).replace('.',',')} t</text>`).join('');
  const growthPath = $('#growthLine');
  if (!reduceMotion) {
    const length = growthPath.getTotalLength();
    growthPath.style.strokeDasharray=String(length);
    growthPath.style.strokeDashoffset=String(length);
    const growthObserver = new IntersectionObserver(entries=>{if(entries[0].isIntersecting){$('#growthChart').classList.add('is-visible');growthPath.style.strokeDashoffset='0';growthObserver.disconnect();}}, {threshold:.15});
    growthObserver.observe($('#growthChart'));
  }

  const finance = window.MELOOLOO_FINANCE;
  const financeModes = {
    revenue:{data:finance.revenue,min:0,max:90,title:'Pendapatan naik seiring kapasitas.',reading:'Dari Rp3,5 miliar pada Y0 ke Rp86,6 miliar pada Y10. Laba bersih diproyeksikan positif mulai Y1.',aria:'Grafik pendapatan naik dari Rp3,5 miliar Y0 ke Rp86,6 miliar Y10'},
    netIncome:{data:finance.netIncome,min:-2,max:22,title:'Laba bersih diproyeksikan positif mulai Y1.',reading:'Y0 masih rugi Rp1,3 miliar dalam masa trial; Y10 mencapai proyeksi laba bersih Rp19,6 miliar.',aria:'Grafik laba bersih: rugi Rp1,3 miliar Y0, positif sejak Y1, Rp19,6 miliar Y10'},
    cumulativeFcf:{data:finance.cumulativeFcf,min:-12,max:48,title:'Kas bebas kumulatif berbalik pada Y6.',reading:'Titik terendah Rp−9,8 miliar di Y2; kumulatif menjadi +Rp2,0 miliar di Y6 dan +Rp43,3 miliar di Y10.',aria:'Grafik arus kas bebas kumulatif negatif sampai Y5, menjadi positif di Y6, mencapai Rp43,3 miliar Y10'}
  };
  let currentFinance = 'revenue';
  function plot(mode) {
    const d = financeModes[mode];
    if (!d) return;
    const W=900,H=355,left=32,right=868,top=24,bottom=315;
    const yVal = value => bottom-(value-d.min)/(d.max-d.min)*(bottom-top);
    const zeroY=yVal(0);
    const barW=48;
    const gap=(right-left)/(d.data.length-1);
    const rows=[0,.25,.5,.75,1].map(t=>{const yy=top+t*(bottom-top);return `<line class="axis" x1="${left}" x2="${right}" y1="${yy.toFixed(1)}" y2="${yy.toFixed(1)}"/>`;}).join('');
    const bars=d.data.map((value,i)=>{
      const cx=left+i*gap;
      const yy=yVal(value);
      const rectY=Math.min(yy,zeroY);
      const height=Math.max(2,Math.abs(yy-zeroY));
      const selected=[0,5,10].includes(i);
      const label=selected?`<text class="fin-label" x="${cx.toFixed(1)}" y="${value>=0?(rectY-12).toFixed(1):(rectY+height+19).toFixed(1)}" text-anchor="middle">${String(value).replace('.',',')}</text>`:'';
      const year=innerWidth<650 && !selected?'':`<text class="fin-year" x="${cx.toFixed(1)}" y="344" text-anchor="middle">Y${i}</text>`;
      return `<rect class="bar ${i===10?'is-end':''} ${value<0?'is-negative':''}" x="${(cx-barW/2).toFixed(1)}" y="${rectY.toFixed(1)}" width="${barW}" height="${height.toFixed(1)}"><title>Y${i}: ${String(value).replace('.',',')} miliar rupiah</title></rect>${label}${year}`;
    }).join('');
    const target=$('#financePlot');
    target.innerHTML=`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">${rows}<line class="zero" x1="${left}" x2="${right}" y1="${zeroY.toFixed(1)}" y2="${zeroY.toFixed(1)}"/><g>${bars}</g></svg>`;
    target.setAttribute('aria-label',d.aria);
    $('#financeChartTitle').textContent=d.title;
    $('#financeReading').textContent=d.reading;
    if (!reduceMotion) target.querySelectorAll('.bar').forEach((bar,i)=>bar.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:520,delay:i*55,easing:'cubic-bezier(.2,.75,.2,1)',fill:'both'}));
  }
  plot(currentFinance);
  $$('#financeSwitch button').forEach(button=>button.addEventListener('click',()=>{
    currentFinance=button.dataset.finance;
    $$('#financeSwitch button').forEach(b=>{const active=b===button;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active));});
    plot(currentFinance);
  }));
  let resizeTimer;
  addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>plot(currentFinance),180)});
})();
