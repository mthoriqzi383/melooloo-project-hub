(() => {
  'use strict';
  const E = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const panel = () => '<div class="hr-beat-panel" aria-live="polite"><small data-beat-number>01 / 03</small><strong data-beat-title></strong><p data-beat-description></p></div>';
  const scene = (n, heading, body, note = '', interactive = false) => `<div class="vscene hr-scene hr-${n}${n === 48 ? ' hr-dark' : ''}"${interactive ? ` data-interactive-slide="${n}"` : ''}>${heading}<div class="hr-content">${body}</div></div>`;

  function mandate(heading) {
    const outcomes = [
      ['4/5','skor kinerja rata-rata','review tiap semester'],
      ['1×','pelatihan per orang / tahun','kompetensi smart greenhouse'],
      ['<7%','turnover / tahun','sasaran retensi'],
      ['≥85%','engagement index','sasaran dalam 5 tahun']
    ];
    return scene(48, heading, `<div class="hr-mandate-left"><small>MANUSIA MENJAGA HASIL</small><div class="hr-mandate-arc"><span>REKRUT</span><b>→</b><span>LATIH</span><b>→</b><span>UKUR</span><b>→</b><span>PERTAHANKAN</span></div><p>Keahlian agronomi, teknologi pertanian, dan QC diterjemahkan menjadi keputusan yang berulang di setiap greenhouse.</p><div class="hr-mandate-picture"><img class="hr-binder-logo" src="assets/logo.png" alt=""><span>VISUALISASI KONSEP PELATIHAN · BUKAN FOTO TIM TERPASANG</span></div></div><div class="hr-mandate-right">${outcomes.map(([value,label,detail],i) => `<div class="hr-target-card"><small>0${i+1} / TARGET SUMBER</small><div class="hr-target-main"><strong>${E(value)}</strong><span>${E(label)}</span></div><em>${E(detail)}</em></div>`).join('')}</div>`, 'Target dari halaman SDM sumber; ini sasaran rencana, belum hasil operasional.');
  }

  function hiring(heading) {
    const stages = [
      ['01','Seleksi kompetensi','Agrikultur, adaptasi teknologi, disiplin, integritas, dan keselarasan nilai.'],
      ['02','Onboarding','Orientasi budaya dan SOP teknis sebelum menangani mutu panen.'],
      ['03','Reality check','Penilaian kinerja dan pemahaman sistem menentukan kelulusan probation.']
    ];
    return scene(49, heading, `<div class="hr-hiring-scale"><small>RENCANA TIM · TOTAL PERSONEL SUMBER</small><svg class="hr-hiring-slope" viewBox="0 0 440 160" preserveAspectRatio="none" aria-hidden="true"><path d="M25 141 C105 136 155 124 219 103 S346 55 412 20"/><circle cx="25" cy="141" r="6"/><circle cx="219" cy="103" r="6"/><circle cx="412" cy="20" r="6"/></svg><div class="hr-hiring-line"><div><b>Y0</b><strong>18</strong><span>Jakarta · awal operasi</span></div><i></i><div><b>Y5</b><strong>39</strong><span>ekspansi bertahap</span></div><i></i><div><b>Y10</b><strong>85</strong><span>Jakarta · Surabaya · Bali</span></div></div><p>Slide sumber merencanakan posisi inti secara full-time untuk menjaga standar dan kontinuitas.</p></div><div class="hr-hiring-process"><h3>PENGADAAN SDM</h3>${stages.map(([n,title,description],i) => `<button type="button" data-beat-target="${i}"><b>${n}</b><span class="hr-hiring-step-copy"><strong>${E(title)}</strong><span>${E(description)}</span></span></button>`).join('')}${panel()}</div>`, '18 → 39 → 85 personel adalah proyeksi pada materi sidang, bukan jumlah karyawan saat ini.', true);
  }

  function organization(heading) {
    const branches = [
      ['KOMERSIAL','Commercial Director', [['Head of Business Development','Staff Business Development'],['Head of Marketing','Staff Marketing']]],
      ['OPERASI','Operation Director', [['Head of HRGA','Staff HRGA / Admin','Driver'],['Head of Operation / GM','Head Grower','Farmer']]],
      ['KEUANGAN','Finance Director', [['Head of Finance','Staff Finance & Accounting']]]
    ];
    const column = ([label,title,lines],i) => `<button type="button" class="hr-org-branch" data-beat-target="${i}" aria-label="Sorot cabang ${E(label)}"><small>0${i+1} / ${E(label)}</small><strong>${E(title)}</strong><div class="hr-org-splits">${lines.map(chain => `<div class="hr-org-chain">${chain.map((role,k) => `${k ? '<i class="hr-org-link" aria-hidden="true"></i>' : ''}<span class="hr-org-role${k === 0 ? ' is-head' : ''}">${E(role)}</span>`).join('')}</div>`).join('')}</div></button>`;
    return scene(50, heading, `<div class="hr-org-ceo"><small>ARAH & TATA KELOLA</small><strong>CEO</strong></div><div class="hr-org-connector" aria-hidden="true"><i></i></div><div class="hr-org-columns">${branches.map(column).join('')}</div><div class="hr-org-bottom">${panel()}<span>Seluruh peran dari halaman sumber ditampilkan tanpa nama individu.</span></div>`, 'Bagan ini memetakan fungsi dan jalur pelaporan, bukan jumlah orang per kotak jabatan.', true);
  }

  function headcount(heading) {
    const total = [18,18,23,27,32,39,52,58,64,81,85];
    const farmers = [6,6,9,12,15,18,22,25,30,39,41];
    const years = total.map((_,i) => `Y${i}`);
    return scene(51, heading, `<div class="hr-headcount-top"><strong>18 <i>→</i> 85 <em>personel</em></strong><span>35 → 237 GREENHOUSE · Y0–Y10</span></div><div class="hr-headcount-plot" role="img" aria-label="Proyeksi total personel meningkat dari 18 pada Y0 menjadi 85 pada Y10; jumlah farmer meningkat dari 6 menjadi 41">${total.map((value,i) => `<div class="hr-headcount-col" style="--height:${(value/85*82).toFixed(1)}%;--farmer:${(farmers[i]/value*100).toFixed(1)}%"><strong>${value}</strong><i></i></div>`).join('')}</div><div class="hr-headcount-legend"><span><i></i> Farmer</span><span><i></i> Personel lainnya menurut total sumber</span></div><table class="hr-headcount-table"><caption>Proyeksi jumlah farmer dan total personel tiap tahun</caption><thead><tr><th scope="col">PERSONEL</th>${years.map(y=>`<th scope="col">${y}</th>`).join('')}</tr></thead><tbody><tr><th scope="row">Farmer</th>${farmers.map(v=>`<td>${v}</td>`).join('')}</tr><tr class="hr-headcount-total"><th scope="row">Total</th>${total.map(v=>`<td>${v}</td>`).join('')}</tr></tbody></table>`, 'Farmer dan total mengikuti tabel sumber. Rincian jabatan lain belum sepenuhnya menjumlah ke total tercetak.');
  }

  function payroll(heading) {
    const payroll = [1682,1721,2243,3064,3644,5094,7732,8579,9452,11161,11822];
    const hiring = ['12,6','0,7','4,2','3,5','4,9','6,3','11,2','6,3','6,3','14,7','5,6'];
    const training = [11,36,40,42,44,48,56,58,61,72,71];
    const technology = Array(11).fill(7);
    const total = [1713,1765,2294,3116,3700,5156,7806,8650,9526,11524,11905];
    const fmt = v => String(v).replace(/\B(?=(\d{3})+(?!\d))/g,'.');
    const row = (label,values,className='') => `<tr class="${className}"><th scope="row">${label}</th>${values.map((value,i) => `<td${i===9&&className==='hr-cost-total'?' class="hr-cost-needs-check"':''}>${E(fmt(value))}${i===9&&className==='hr-cost-total'?'<sup>*</sup>':''}</td>`).join('')}</tr>`;
    return scene(52, heading, `<div class="hr-cost-intro"><div><small>PROYEKSI PENGELUARAN SDM · RP JUTA</small><strong>Rp1.713 <i>→</i> Rp11.905</strong></div><p>Payroll, rekrutmen, pelatihan, dan teknologi HR ditampilkan untuk setiap tahun.</p></div><table class="hr-cost-table"><caption>Rincian proyeksi biaya SDM Tahun 0 sampai Tahun 10, dalam juta rupiah</caption><thead><tr><th scope="col">KOMPONEN · RP JT</th>${payroll.map((_,i)=>`<th scope="col">Y${i}</th>`).join('')}</tr></thead><tbody>${row('Payroll all',payroll)}${row('Rekrutmen',hiring)}${row('Pelatihan',training)}${row('Teknologi HR',technology)}${row('Total biaya SDM',total,'hr-cost-total')}</tbody></table><div class="hr-cost-reading"><span><b>Y0</b> Rp1.713 jt</span><span><b>Y5</b> Rp5.156 jt</span><span><b>Y10</b> Rp11.905 jt</span></div>`, '* Total Y9 Rp11.524 jt tercetak pada sumber, tetapi empat komponennya berjumlah Rp11.255 jt setelah pembulatan. Klasifikasi payroll SDM vs OPEX keuangan juga perlu direkonsiliasi.');
  }

  const renderers = {48:mandate,49:hiring,50:organization,51:headcount,52:payroll};
  window.MELOOLOO_RENDER_HR = (n, item, heading) => renderers[n]?.(heading) || null;
})();
