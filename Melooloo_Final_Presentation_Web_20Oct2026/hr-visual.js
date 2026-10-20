(() => {
  'use strict';
  const E = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const panel = () => '<div class="hr-beat-panel" aria-live="polite"><small data-beat-number>01 / 03</small><strong data-beat-title></strong><p data-beat-description></p></div>';
  const scene = (n, heading, body, note = '', interactive = false) => `<div class="vscene hr-scene hr-${n}${n === 48 ? ' hr-dark' : ''}"${interactive ? ` data-interactive-slide="${n}"` : ''}>${heading}<div class="hr-content">${body}</div>${note ? `<div class="hr-note">${note}</div>` : ''}</div>`;

  function mandate(heading) {
    const outcomes = [
      ['4/5','skor kinerja rata-rata','review tiap semester'],
      ['1×','pelatihan per orang / tahun','kompetensi smart greenhouse'],
      ['<7%','turnover / tahun','sasaran retensi'],
      ['≥85%','engagement index','sasaran dalam 5 tahun']
    ];
    return scene(48, heading, `<div class="hr-mandate-left"><small>MANUSIA MENJAGA HASIL</small><div class="hr-mandate-arc"><span>REKRUT</span><b>→</b><span>LATIH</span><b>→</b><span>UKUR</span><b>→</b><span>PERTAHANKAN</span></div><p>Keahlian agronomi, teknologi pertanian, dan QC diterjemahkan menjadi keputusan yang berulang di setiap greenhouse.</p><div class="hr-mandate-picture"><img class="hr-binder-logo" src="assets/logo.png" alt=""><span>VISUALISASI KONSEP PELATIHAN · BUKAN FOTO TIM TERPASANG</span></div></div><div class="hr-mandate-right">${outcomes.map(([value,label,detail],i) => `<div><small>0${i+1} / TARGET SUMBER</small><strong>${E(value)}</strong><span>${E(label)}</span><em>${E(detail)}</em></div>`).join('')}</div>`, 'Target dari halaman SDM sumber; ini sasaran rencana, belum hasil operasional.');
  }

  function hiring(heading) {
    const stages = [
      ['01','Seleksi kompetensi','Agrikultur, adaptasi teknologi, disiplin, integritas, dan keselarasan nilai.'],
      ['02','Onboarding','Orientasi budaya dan SOP teknis sebelum menangani mutu panen.'],
      ['03','Reality check','Penilaian kinerja dan pemahaman sistem menentukan kelulusan probation.']
    ];
    return scene(49, heading, `<div class="hr-hiring-scale"><small>RENCANA TIM · TOTAL PERSONEL SUMBER</small><svg class="hr-hiring-slope" viewBox="0 0 440 160" preserveAspectRatio="none" aria-hidden="true"><path d="M25 141 C105 136 155 124 219 103 S346 55 412 20"/><circle cx="25" cy="141" r="6"/><circle cx="219" cy="103" r="6"/><circle cx="412" cy="20" r="6"/></svg><div class="hr-hiring-line"><div><b>Y0</b><strong>18</strong><span>Jakarta · awal operasi</span></div><i></i><div><b>Y5</b><strong>39</strong><span>ekspansi bertahap</span></div><i></i><div><b>Y10</b><strong>85</strong><span>Jakarta · Surabaya · Bali</span></div></div><p>Slide sumber merencanakan posisi inti secara full-time untuk menjaga standar dan kontinuitas.</p></div><div class="hr-hiring-process"><small>GERBANG PENGADAAN</small>${stages.map(([n,title,description],i) => `<button type="button" data-beat-target="${i}"><b>${n}</b><strong>${E(title)}</strong><span>${E(description)}</span></button>`).join('')}${panel()}</div>`, '18 → 39 → 85 personel adalah proyeksi pada materi sidang, bukan jumlah karyawan saat ini.', true);
  }

  function organization(heading) {
    const branches = [
      ['KOMERSIAL','Commercial Director', [['Head of Business Development','Staff Business Development'],['Head of Marketing','Staff Marketing']]],
      ['OPERASI','Operation Director', [['Head of HRGA','Staff HRGA / Admin','Driver'],['Head of Operation / GM','Head Grower','Farmer']]],
      ['KEUANGAN','Finance Director', [['Head of Finance','Staff Finance & Accounting']]]
    ];
    const column = ([label,title,lines],i) => `<button type="button" class="hr-org-branch" data-beat-target="${i}" aria-label="Sorot cabang ${E(label)}"><small>0${i+1} / ${E(label)}</small><strong>${E(title)}</strong><div class="hr-org-splits">${lines.map(chain => `<div>${chain.map((role,k) => `<span class="hr-org-role${k === 0 ? ' is-head' : ''}">${E(role)}</span>`).join('<i>↓</i>')}</div>`).join('')}</div></button>`;
    return scene(50, heading, `<div class="hr-org-ceo"><small>ARAH & TATA KELOLA</small><strong>CEO</strong></div><div class="hr-org-connector"><i></i></div><div class="hr-org-columns">${branches.map(column).join('')}</div><div class="hr-org-bottom">${panel()}<span>Bagan mempertahankan seluruh peran dari halaman sumber; tidak menampilkan nama individu.</span></div>`, 'Bagan ini memetakan fungsi dan jalur pelaporan, bukan jumlah orang per kotak jabatan.', true);
  }

  function headcount(heading) {
    const total = [18,18,23,27,32,39,52,58,64,81,85];
    const farmers = [6,6,9,12,15,18,22,25,30,39,41];
    const points = [['Y0','18','35 GH · 2 lokasi awal'],['Y5','39','103 GH · ekspansi Jakarta'],['Y6','52','127 GH · masuk Surabaya'],['Y10','85','237 GH · 3 kota']];
    return scene(51, heading, `<div class="hr-headcount-top"><strong>18 <i>→</i> 85 <em>personel</em></strong><span>RUMAH KACA 35 → 237 · Y0–Y10</span></div><div class="hr-headcount-plot">${total.map((value,i) => `<div class="hr-headcount-col" style="--height:${(value/85*100).toFixed(1)}%;--farmer:${(farmers[i]/value*100).toFixed(1)}%"><span>${[0,5,6,10].includes(i) ? value : ''}</span><i></i><b>Y${i}</b></div>`).join('')}</div><div class="hr-headcount-legend"><span><i></i> Farmer pada tabel sumber</span><span><i></i> Personel lain pada total sumber</span></div><div class="hr-headcount-milestones">${points.map(([year,count,detail],i) => `<button type="button" data-beat-target="${i}"><small>${year}</small><strong>${count}</strong><span>${detail}</span></button>`).join('')}${panel()}</div>`, 'Total dan baris Farmer mengikuti tabel sumber. Rincian jabatan pada tabel belum sepenuhnya menjumlah ke total tercetak.', true);
  }

  function payroll(heading) {
    const payroll = [1682,1721,2243,3064,3644,5094,7732,8579,9452,11161,11822];
    const milestones = [
      ['Y0','Rp1.682 jt','Rp12,6 jt hiring · Rp11 jt training · Rp7 jt teknologi'],
      ['Y5','Rp5.094 jt','Rp6,3 jt hiring · Rp48 jt training · Rp7 jt teknologi'],
      ['Y10','Rp11.822 jt','Rp5,6 jt hiring · Rp71 jt training · Rp7 jt teknologi']
    ];
    return scene(52, heading, `<div class="hr-payroll-head"><div><small>PAYROLL ALL · TABEL SDM SUMBER</small><strong>Rp1.682 <i>→</i> 11.822 <em>juta</em></strong></div><div><small>TOTAL BIAYA SDM Y10 · SUMBER</small><strong>Rp11.905 <em>juta</em></strong></div></div><div class="hr-payroll-chart">${payroll.map((value,i) => `<div class="hr-payroll-bar" style="--height:${(value/11822*100).toFixed(1)}%"><span>${[0,5,10].includes(i) ? E(String(value).replace(/\B(?=(\d{3})+(?!\d))/g,'.')) : ''}</span><i></i><b>Y${i}</b></div>`).join('')}</div><div class="hr-payroll-bottom"><div class="hr-payroll-choices">${milestones.map(([year,cost,detail],i) => `<button type="button" data-beat-target="${i}"><small>${year}</small><strong>${cost}</strong><span>${detail}</span></button>`).join('')}</div>${panel()}</div>`, 'Angka payroll SDM tidak sama dengan baris “Gaji & tunjangan” OPEX Mery; klasifikasinya perlu direkonsiliasi. Total Y9 pada tabel sumber juga tidak cocok dengan jumlah komponennya.', true);
  }

  const renderers = {48:mandate,49:hiring,50:organization,51:headcount,52:payroll};
  window.MELOOLOO_RENDER_HR = (n, item, heading) => renderers[n]?.(heading) || null;
})();
