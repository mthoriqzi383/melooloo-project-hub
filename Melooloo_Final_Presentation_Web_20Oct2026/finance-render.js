(() => {
  'use strict';
  const D = window.MELOOLOO_FINANCE;
  const id = n => String(n).padStart(2,'0');
  const decimal = n => Number(n).toFixed(1).replace('.',',');
  const whole = n => Math.round(n).toLocaleString('id-ID');
  const cell = (label,value) => `<div class="fin-stat"><span>${label}</span><strong>${value}</strong></div>`;
  const row = (a,b) => `<div class="fin-row"><span>${a}</span><strong>${b}</strong></div>`;
  const note = text => `<div class="fin-note">${text}</div>`;
  const source = '';
  const beatPanel = () => '<div class="fin-beat-panel" aria-live="polite"><small data-beat-number>01 / 02</small><strong data-beat-title></strong><p data-beat-description></p></div>';
  const wrap = (n,heading,body,extra='') => `<div class="finance-layout finance-page-${n} ${extra}"${extra.includes('fin-interactive') ? ` data-interactive-slide="${n}"` : ''}>${heading}<div class="finance-main">${body}</div></div>`;

  function assumptions(n,heading) {
    const left = [
      ['Kapasitas GH','35 Y0 → 103 Y5 → 237 Y10'],
      ['Siklus panen','2 Y0 · 4 Y1 · 5 mulai Y2'],
      ['Hasil per GH / siklus','420 tanaman × 1,8 kg × 95%'],
      ['Grade A','80% Y0 → 85% Y1 → 90% Y2+'],
      ['Harga Grade A','B2B Rp75 rb · B2C Rp99 rb/kg'],
      ['Grade B / C','Rp35 rb / Rp15 rb/kg'],
      ['Porsi B2B Grade A','75% Y0 → 40% Y5'],
      ['Harga / inflasi OPEX','+3% / +5% mulai Y2']
    ];
    const right = [
      ['Risk-free SUN 10 th','6,59%'],['Beta / ERP','1,33 / 7,50%'],
      ['Cost of equity','16,57%'],['Bunga bank','11,50%'],
      ['Debt setelah pajak','8,97%'],['Bobot modal','50% : 50%'],
      ['WACC','12,77%']
    ];
    return wrap(n,heading,`<div class="fin-two fin-assumptions"><div class="fin-card"><h3>PARAMETER OPERASI</h3>${left.map(x=>row(...x)).join('')}</div><div class="fin-card fin-card-dark"><h3>BIAYA MODAL</h3>${right.map(x=>row(...x)).join('')}</div></div>`);
  }
  function investment(n,heading) {
    return wrap(n,heading,`<div class="fin-invest"><div class="fin-invest-total"><small>TOTAL DANA TAHUN 0</small><strong>Rp10.462<em>juta</em></strong><div class="fin-split"><span style="width:67.1%"></span><span style="width:32.9%"></span></div><div class="fin-split-label"><span>67,1% CAPEX ASET TETAP</span><span>32,9% MODAL KERJA</span></div>${note('OPEX Y0 Rp3.137 juta · pendapatan trial Y0 Rp3.509 juta.')}</div><div class="fin-invest-detail"><div class="fin-card"><h3>CAPEX · Rp7.024 juta</h3>${[['Greenhouse 35 unit','5.066'],['Cold storage & kendaraan','650'],['Rooftop & deposit 2 lokasi','600'],['Legal & kantor','351'],['Kontingensi','357']].map(x=>row(...x)).join('')}</div><div class="fin-card"><h3>Modal kerja · Rp3.438 juta</h3>${row('Pra-operasi','479')}${row('Buffer kas','2.959')}${note('Buffer kas setara 5,3 bulan biaya kas operasi Y1.')}</div></div></div>${source}`);
  }
  function funding(n,heading) {
    return wrap(n,heading,`<div class="fin-funding"><div class="fin-funding-initial"><button type="button" class="fin-funding-select" data-beat-target="0">01 / TAHUN 0 · MODAL PENDIRI</button><strong class="fin-giant">100%</strong><p>Rp10.462 juta dari lima pendiri. Masing-masing Rp2.092,4 juta dan 20% saham.</p><div class="fin-founder-list">Emily <b>·</b> Thoriq <b>·</b> Carlos <b>·</b> Nindio <b>·</b> Mery</div></div><div class="fin-funding-expansion"><button type="button" class="fin-funding-select" data-beat-target="1">02 / Y1–Y10 · CAPEX EKSPANSI</button><strong class="fin-expansion-total">Rp46.094 juta</strong><div class="fin-funding-split"><div style="width:30%"><b>30%</b><span>Kas internal<br>Rp13.830 jt</span></div><div style="width:70%"><b>70%</b><span>Kredit investasi<br>Rp32.264 jt</span></div></div>${beatPanel()}<div class="fin-term-row"><span>Bunga <b>11,5%</b></span><span>Tenor <b>5 tahun</b></span><span>Grace <b>1 tahun</b></span><span>D/E maks <b>0,39×</b></span></div></div></div>${source}`,'fin-interactive');
  }
  function spending(n,heading) {
    const years=['Y0','Y1','Y2','Y3','Y4','Y5','Y6–Y10'];
    const capex=[
      ['Greenhouse (baru + penggantian)','5.066','0','2.461','2.461','3.091','2.727','23.911'],
      ['Cold storage & kendaraan','650','0','325','325','325','325','2.272'],
      ['Renovasi & deposit lokasi','600','0','292','287','294','301','2.039'],
      ['Legal & kantor','351','50','130','132','165','142','988'],
      ['Modal kerja & kontingensi','836','3','160','160','194','175','2.359'],
      ['Total CAPEX*','7.503','53','3.368','3.365','4.069','3.670','31.569']
    ];
    const opex=[
      ['Gaji & tunjangan','1.053','1.073','1.187','1.688','1.815','2.905','28.979'],
      ['Sewa lokasi','1.248','1.218','1.776','2.284','2.995','3.774','23.492'],
      ['Logistik & distribusi','163','351','607','879','1.206','1.581','16.766'],
      ['Perawatan, admin & overhead','166','399','564','716','903','1.124','15.398'],
      ['Pemasaran & penjualan','507','768','1.069','1.207','1.649','1.912','18.191'],
      ['Total OPEX','3.137','3.808','5.202','6.774','8.567','11.296','102.827']
    ];
    const table=(label,rows)=>`<section class="fin-ledger-section"><h3>${label}</h3><table class="fin-ledger"><thead><tr><th scope="col">Komponen (Rp juta)</th>${years.map(y=>`<th scope="col">${y}</th>`).join('')}</tr></thead><tbody>${rows.map((r,i)=>`<tr${i===rows.length-1?' class="total"':''}>${r.map((v,j)=>`<${j?'td':'th scope="row"'}>${v}</${j?'td':'th'}>`).join('')}</tr>`).join('')}</tbody></table></section>`;
    return wrap(n,heading,`<div class="fin-ledger-stack">${table('A / CAPITAL EXPENDITURE',capex)}${table('B / OPERATING EXPENDITURE',opex)}<p class="fin-ledger-definition">*Y0 CAPEX Rp7.503 juta mencakup CAPEX Rp7.024 juta dan modal kerja praoperasi Rp479 juta. Total CAPEX Y0–Y10 Rp53,6 miliar.</p></div>`);
  }
  function income(n,heading) {
    const bars=D.revenue.map((v,i)=>`<div class="fin-yearbar"><span>${decimal(v)}</span><div class="fin-bar-track"><i style="height:${(v/86.6*100).toFixed(2)}%"></i></div><strong>${D.years[i]}</strong></div>`).join('');
    const incomes=D.netIncome.map((v,i)=>`<div class="fin-income-val ${v<0?'negative':''}">${decimal(v)}</div>`).join('');
    return wrap(n,heading,`<div class="fin-income"><div class="fin-chart-heading"><span>PENDAPATAN / RP MILIAR</span><strong>3,5 <i>→</i> 86,6</strong></div><div class="fin-revenue-bars">${bars}</div><div class="fin-income-row"><span>LABA BERSIH</span><div>${incomes}</div></div><div class="fin-takeaway"><b>Y1</b> laba bersih mulai positif <span>·</span> <b>Rp78,3 miliar</b> kumulatif Y0–Y10</div></div>${source}`);
  }
  function balance(n,heading) {
    const b=D.balance;
    const series=[['Total aset',b.assets,'asset'],['Total liabilitas',b.liabilities,'liability'],['Total ekuitas',b.equity,'equity']];
    const bars=b.years.map((year,i)=>`<div class="fin-balance-group"><div class="fin-balance-cluster">${series.map(([name,values,key])=>`<div class="fin-balance-column ${key}" style="height:${(values[i]/90*100).toFixed(1)}%" title="${name} ${year}: Rp${decimal(values[i])} miliar"><span>${decimal(values[i])}</span></div>`).join('')}</div><strong>${year}</strong></div>`).join('');
    const cards=[
      ['01 / TOTAL ASET','Rp9,4 → 81,6 M','Didorong kas (Rp39,6 M di Y10) dan greenhouse baru di 3 kota.'],
      ['02 / TOTAL EKUITAS','Rp9,1 → 65,5 M','Tumbuh dari laba ditahan, setelah dividen 30% mulai Y3.'],
      ['03 / TOTAL LIABILITAS','maks 28% aset','Sebagian besar kredit investasi bank untuk ekspansi.']
    ];
    return wrap(n,heading,`<div class="fin-balance-dashboard"><div class="fin-balance-plot"><div class="fin-balance-key">${series.map(([name,,key])=>`<span><i class="${key}"></i>${name}</span>`).join('')}<b>Rp miliar</b></div><div class="fin-balance-axis"><span>90</span><span>60</span><span>30</span><span>0</span></div><div class="fin-balance-clusters">${bars}</div></div><div class="fin-balance-insights">${cards.map(([label,value,detail],i)=>`<div class="fin-balance-insight${i===0?' primary':''}"><small>${label}</small><strong>${value}</strong><p>${detail}</p></div>`).join('')}</div></div>`);
  }
  function cashflow(n,heading) {
    const v=D.cumulativeFcf;
    const x=i=>62+i*87;
    const y=a=>245-(a+10)/55*205;
    const path=v.map((a,i)=>`${i?'L':'M'} ${x(i)} ${y(a).toFixed(1)}`).join(' ');
    const dots=v.map((a,i)=>`<g class="fin-fcf-point ${i===6?'is-payback':''}"><circle cx="${x(i)}" cy="${y(a).toFixed(1)}" r="${i===6?7:4}"/><text x="${x(i)}" y="${i>=7?y(a)+19:y(a)-12}" text-anchor="middle">${decimal(a)}</text><text class="fin-fcf-year" x="${x(i)}" y="270" text-anchor="middle">Y${i}</text></g>`).join('');
    return wrap(n,heading,`<div class="fin-fcf"><div class="fin-chart-heading"><span>ARUS KAS BEBAS KUMULATIF / RP MILIAR</span><strong>Balik modal <i>Y6</i></strong></div><div class="fin-fcf-beats">${[['Y0','−8,8'],['Y2','−9,8'],['Y5','−1,5'],['Y6','+2,0'],['Y10','+43,3']].map(([year,value],i)=>`<button type="button" data-beat-target="${i}"><b>${year}</b><strong>${value}</strong></button>`).join('')}</div><svg class="fin-fcf-svg" viewBox="0 0 1000 285" role="img" aria-label="Arus kas bebas kumulatif negatif sampai Y5, lalu positif dari Y6 dan mencapai Rp43,3 miliar pada Y10"><line class="fin-zero" x1="48" y1="${y(0).toFixed(1)}" x2="950" y2="${y(0).toFixed(1)}"/><path d="${path}"/>${dots}</svg><div class="fin-fcf-focus">${beatPanel()}</div><div class="fin-cash-footer">${cell('PAYBACK','±5,4 tahun')}${cell('DISCOUNTED PAYBACK','Tahun 7')}${cell('KAS AKHIR Y10','Rp39,64 M')}</div></div>${source}`,'fin-interactive');
  }
  function breakEven(n,heading) {
    const b=D.breakEven;
    const maxProduction=Math.max(...b.productionKg);
    const rows=b.years.map((year,i)=>`<div class="fin-bep-year"><div class="fin-bep-title"><strong>${year}</strong><span>${b.safetyMargin[i]}</span></div><div class="fin-bep-bars"><div class="fin-bep-threshold" style="width:${(b.thresholdKg[i]/maxProduction*100).toFixed(1)}%"><span>BEP ${whole(b.thresholdKg[i])} kg</span></div><div class="fin-bep-production" style="width:${(b.productionKg[i]/maxProduction*100).toFixed(1)}%"><span>PANEN ${whole(b.productionKg[i])} kg</span></div></div></div>`).join('');
    return wrap(n,heading,`<div class="fin-bep"><div class="fin-bep-key"><span>VOLUME PANEN VS TITIK IMPAS</span><b>SAFETY MARGIN ↗</b></div>${rows}<div class="fin-bep-note">Y0 adalah masa trial dua siklus dan belum mencapai BEP.</div></div>${source}`);
  }
  function viability(n,heading) {
    return wrap(n,heading,`<div class="fin-viability"><div class="fin-kpi-primary"><div><span>NPV / NILAI LIKUIDASI Y10</span><strong>Rp23,5 <em>miliar</em></strong><small>Lebih besar dari nol</small></div><div><span>IRR</span><strong>26,1<em>%</em></strong><small>Di atas WACC 12,77%</small></div></div><div class="fin-kpi-secondary">${cell('PAYBACK','5,4 tahun')}${cell('PROFITABILITY INDEX','4,14×')}${cell('MIRR','21,9%')}${cell('DISCOUNTED PAYBACK','Y7')}</div><div class="fin-go">LAYAK INVESTASI <b>GO</b><span>berdasarkan skenario most likely pada materi keuangan</span></div></div>${source}`);
  }
  function scenarios(n,heading) {
    const cards=D.scenarios.map((s,i)=>`<button type="button" data-beat-target="${i}" class="fin-scenario ${s.npv<0?'negative':''} ${i===1?'base':''}"><small>${s.name} · ${s.weight}</small><strong>${s.npv<0?'−':'+'}Rp${decimal(Math.abs(s.npv))} M</strong><div class="fin-scenario-bar"><i style="width:${(Math.abs(s.npv)/53.5*100).toFixed(1)}%"></i></div></button>`).join('');
    const sensitivity=[
      ['Pendapatan','−11,195','23,547','57,793','turun 14,4%'],
      ['OPEX','36,485','23,547','10,447','naik 35,9%'],
      ['WACC','32,597','23,547','16,723','29,3% WACC']
    ];
    return wrap(n,heading,`<div class="fin-scenarios fin-scenarios-detailed"><div class="fin-scenario-grid">${cards}</div><div class="fin-sensitivity-table"><div class="fin-sensitivity-head"><span>UJI SATU VARIABEL · NPV RP MILIAR</span><span>−25%</span><span>BASE</span><span>+25%</span><span>NPV = 0</span></div>${sensitivity.map(r=>`<div class="fin-sensitivity-row">${r.map((v,i)=>`<${i?'span':'strong'}>${v}</${i?'span':'strong'}>`).join('')}</div>`).join('')}</div><div class="fin-scenario-bottom">${beatPanel()}<span>Pendapatan paling sensitif. Pesimis: pendapatan −25% dan OPEX +15%; nilai NPV mencakup likuidasi Y10.</span></div></div>${source}`,'fin-interactive');
  }
  function decision(n,heading) {
    const risks=[
      ['01','Harga premium','Kontrak pra-jual B2B, bukti Brix dan label per buah; Grade A tanpa diskon.'],
      ['02','IoT / gagal panen','Sensor multi-vendor, SOP manual cadangan, dua lokasi sejak Y1, IPM hama.'],
      ['03','Piutang B2B','SOP penagihan otomatis, invoice financing siaga, kas minimal 4,5 bulan biaya.']
    ];
    return wrap(n,heading,`<div class="fin-decision"><div class="fin-decision-head"><div><span>KEPUTUSAN INVESTASI</span><strong>GO</strong></div><p>NPV Rp23,5 M · IRR 26,1%<br>MIRR 21,9% · PI 4,14×<br>Payback ±5,4 tahun</p></div><div class="fin-risks">${risks.map(([num,title,body])=>`<div><small>${num} / RISIKO TINGGI</small><h3>${title}</h3><p>${body}</p></div>`).join('')}</div></div>${source}`);
  }
  function render(n,heading) {
    switch(n) {
      case 53: {
        const x = i => 18 + i * 31;
        const y = value => 168 - (value + 10) / 55 * 137;
        const points = D.cumulativeFcf.map((value,i) => `${i?'L':'M'}${x(i)},${y(value).toFixed(1)}`).join(' ');
        const curve = `<svg class="fin-cover-curve" viewBox="0 0 350 190" role="img" aria-label="Arus kas bebas kumulatif model Mery berbalik positif pada tahun 6 dan meningkat hingga tahun 10"><line x1="18" y1="${y(0).toFixed(1)}" x2="328" y2="${y(0).toFixed(1)}"/><path d="${points}"/><circle cx="${x(6)}" cy="${y(D.cumulativeFcf[6]).toFixed(1)}" r="4"/><circle cx="${x(10)}" cy="${y(D.cumulativeFcf[10]).toFixed(1)}" r="5"/><text x="18" y="187">Y0</text><text x="${x(6)}" y="187" text-anchor="middle">Y6 · POSITIF</text><text x="${x(10)}" y="187" text-anchor="end">Y10</text></svg>`;
        return wrap(n,heading,`${curve}<div class="fin-cover-mark">10 TAHUN PROYEKSI</div><div class="fin-cover-rule"></div><div class="fin-cover-bottom">${cell('DANA AWAL','Rp10.462 jt')}${cell('WACC','12,77%')}${cell('NPV MOST LIKELY','Rp23,5 M')}</div>`,'fin-cover');
      }
      case 54: return assumptions(n,heading);
      case 55: return investment(n,heading);
      case 56: return funding(n,heading);
      case 57: return spending(n,heading);
      case 58: return income(n,heading);
      case 59: return balance(n,heading);
      case 60: return cashflow(n,heading);
      case 61: return breakEven(n,heading);
      case 62: return viability(n,heading);
      case 63: return scenarios(n,heading);
      case 64: return decision(n,heading);
      default: throw new Error(`No finance layout for slide ${id(n)}`);
    }
  }
  window.MELOOLOO_RENDER_FINANCE=render;
})();
