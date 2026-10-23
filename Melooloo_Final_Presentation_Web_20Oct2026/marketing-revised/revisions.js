(() => {
  'use strict';
  const source = window.MELOOLOO_ORIGINAL_MARKETING;
  const main = source?.main;
  if (!Array.isArray(main) || main.length !== 21) throw new Error('Marketing source slides are missing.');
  const sourceText = number => [...main,...(source.backup || [])].find(entry => entry.source === number)?.text || '';
  window.MELOOLOO_MARKETING_REVISIONS = {
    4: {
      revisedImage: 'marketing-revised/slide-04.png',
      text: sourceText(4).replace('Health-Conscious Urban\n', 'Health-Conscious Urban\nWellness Community\n')
    },
    13: {
      revisedImage: 'marketing-revised/slide-13.png',
      text: sourceText(13).replace('0 hari\ndiskon pada buah bersegel\n', '')
    },
    15: {
      revisedImage: 'marketing-revised/slide-15.svg',
      text: sourceText(15) + '\nPorsi volume Grade A: Tahun 1 B2B 68%, B2C 32%; Tahun 5 B2B 40%, B2C 60%; Tahun 10 B2B 48%, B2C 52%.'
    },
    19: {
      revisedImage: 'marketing-revised/slide-19.svg',
      text: sourceText(19) + '\nAnggaran pemasaran sebagai persentase pendapatan: Tahun 0–10 berturut-turut 14,4%; 10,3%; 8,1%; 6,3%; 6,5%; 5,9%; 6,6%; 5,8%; 5,7%; 6,5%; 5,4%. Pembanding: Gartner 7,7% dan The CMO Survey B2C 12%.'
    },
    24: {
      revisedImage: 'marketing-revised/slide-24.svg',
      text: sourceText(24) + '\nEmpat belas hotel sasaran terbagi dalam dua gelombang: 3.405 kamar pada gelombang pertama dan 3.347 kamar pada gelombang kedua, total 6.752 kamar.'
    },
    26: {
      revisedImage: 'marketing-revised/slide-26.svg',
      text: sourceText(26) + '\nKesediaan membayar dalam survei 253 responden: 137 orang di bawah Rp 100.000 per buah; 74 orang Rp 100.000–200.000; 17 orang Rp 200.000–400.000; 25 orang Rp 400.000–600.000.'
    },
    28: {
      revisedImage: 'marketing-revised/slide-28.svg',
      text: sourceText(28) + '\nHarga per buah: Melooloo Rp 178.200; Baby Blonde di AEON Rp 129.000; Cantaloupe Jepang Rp 97.200; Golden Rp 97.000; Hamigua Rp 87.600; Kaze Hydroponic Ranch Market Rp 69.900.'
    },
    32: {
      revisedImage: 'marketing-revised/slide-32.svg',
      text: sourceText(32) + '\nAnggaran pemasaran Tahun 1 Rp 768 juta terdiri dari sembilan aktivitas. Alokasi terbesar adalah Events and Experiences Rp 201 juta, Sales Promotion Rp 137 juta, dan Advertising Rp 118 juta.'
    },
    33: {
      revisedImage: 'marketing-revised/slide-33.svg',
      text: sourceText(33) + '\nBiaya per pelanggan baru: komunitas Rp 330.000, Kunjungan Kebun Rp 192.000, dan iklan berbayar Rp 75.000.'
    },
    34: {
      revisedImage: 'marketing-revised/slide-34.svg',
      text: sourceText(34) + '\nAnggaran pemasaran per kota ditampilkan sebagai batang bertumpuk dari Tahun 0 sampai Tahun 10.'
    },
    35: {
      revisedImage: 'marketing-revised/slide-35.svg',
      text: sourceText(35) + '\nKontribusi pemasaran bersih meningkat dari Rp 1.311 juta di Tahun 0 menjadi Rp 20.143 juta di Tahun 5 dan Rp 52.386 juta di Tahun 10.'
    },
    42: {
      revisedImage: 'marketing-revised/slide-42.png',
      text: sourceText(42).replace('Hari diskon pada buah bersegel\n0\n0\n—\n', '')
    },
    46: {
      revisedImage: 'marketing-revised/slide-46.png',
      text: sourceText(46)
        .replace('Tiga pembeli B2B dan tiga sub-segmen B2C', 'Tiga pembeli B2B dan empat kelompok B2C')
        .replace('Health-Conscious Urban, dijangkau lewat komunitas', 'Health-Conscious Urban')
        .replace('Pendukung; komunitas menjadi saluran akuisisi utama', 'Pendukung\nWellness Community\nAnggota studio pilates, yoga, klub lari, dan padel; aktivitas komunitas dan langganan\nPendukung')
        .replace('Tabel 4.2, 4.4, 4.5, hlm. 38–44', 'Tabel 4.2, 4.4, 4.5, 4.24; paper hlm. 38–44, 80')
    }
  };
})();
