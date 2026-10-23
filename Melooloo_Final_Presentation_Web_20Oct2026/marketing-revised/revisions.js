(() => {
  'use strict';
  const source = window.MELOOLOO_ORIGINAL_MARKETING;
  const main = source?.main;
  if (!Array.isArray(main) || main.length !== 21) throw new Error('Marketing source slides are missing.');
  const sourceText = number => [...main,...(source.backup || [])].find(entry => entry.source === number)?.text || '';
  window.MELOOLOO_MARKETING_REVISIONS = {
    7: {
      text: "1  Pasar dan Konsumen\n2  Positioning dan Diferensiasi\n3  Bauran Pemasaran\n4  Anggaran Pemasaran\nPeta Persaingan dan Posisi Melooloo\nMelon premium dari kebun smart greenhouse di dalam Jakarta, tiba di titik penjualan kurang dari 24 jam setelah panen.\nJARAK PRODUKSI × SKOR RASA\nhipotesis\nritel premium bernama\ndistributor / supermarket\nlangsung · reseller · agrowisata\ncelah: ≤ 60 km dan rasa ≥ 4\n2\n3\n4\n5\n10\n100\n1.000\n10.000\ndalam DKI\n//\njarak produksi ke konsumen Jakarta (km, skala logaritmik)\n↑ rasa: kemanisan & konsistensi (skor 1–5)\nMELOOLOO\nrencana · rasa 4,3\nCrown Melon\nimpor Jepang · ±5.900 km · 4,7\nSweet Greens\nDang Sweet · ±90 km · 4,1\nUrbana Farm\nKaranganyar · ±500 km · 4,0\nWohsae\nMalang · ±800 km · 3,7\nAkaruku\nCisauk · ±30 km · 3,3\nSunpride\nnasional · ±250 km · 2,9\njarak tidak dipublikasikan\nMirai Melon\nskor rasa 3,5\nMama Melon\nBogor · skor rasa 3,0\nMelon tanpa merek\npasar tradisional · 2,2\ntanpa skor rasa\nIr. Yoga Purnomo\nBekasi · ±25 km\nKabul Pamudji\nSemarang · ±450 km\nCELAH YANG DITUJU\ndekat konsumen + ritel premium bernama\nRasa ≥ 4 hanya dari pemain berjarak 90–5.900 km; ancaman terbesar Sweet Greens (dana USD 750.000).\nSumber: Lampiran L Tabel L.3 (jarak, kanal), Tabel L.4 (skor rasa, penilaian tim) dan Tabel L.5; Gambar 4.1–4.2; paper hlm. 44–47, 50–57.\n2.1"
    },
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

  // These are the titles for the 15 marketing pages still in the main deck.
  // The six removed source pages retain their archived titles.
  const mainTitles = {
    1: ['Strategi Pemasaran', 'strategi\npemasaran'],
    3: ['Kualitas Rasa Melon Premium Belum Terjamin', 'Pembeli sudah membeli melon premium, tetapi tidak ada yang menjamin rasanya'],
    4: ['Segmentasi dan Target Pasar', 'Pembeli kami: B2B 68% volume Tahun 1, B2C 32%'],
    5: ['Estimasi Ukuran Pasar (TAM, SAM, SOM)', 'Kami hanya perlu 4–6% pasar premium DKI di Tahun 1'],
    7: ['Peta Persaingan dan Posisi Melooloo', 'Satu-satunya pemasok premium di dalam Jakarta'],
    8: ['Point of Parity dan Point of Difference', 'Pembedanya bisa diperiksa sendiri oleh pembeli'],
    12: ['Strategi Harga dan Perbandingan Pasar', 'Harga 14–17 kali di bawah Crown Melon'],
    13: ['Format Produk per Kanal', 'Satu format untuk satu kanal'],
    14: ['Strategi Masuk Pasar Tahun 0–1', 'B2B mengunci volume sejak Tahun 0, mengikuti jadwal panen'],
    15: ['Bauran Kanal Distribusi Tahun 1–10', 'B2C menjadi 60% volume di Tahun 5'],
    16: ['Komunikasi Pemasaran Terpadu (IMC) Tahun 1', 'Anggaran komunikasi terbesar untuk pengalaman, karena pembeli harus mencicipi sebelum percaya'],
    17: ['Sasaran Pemasaran per Tahap Perjalanan Pelanggan', 'Kami siap diukur di tiga tahap perjalanan pelanggan'],
    19: ['Anggaran Pemasaran terhadap Pendapatan', 'Pemasaran hemat: ±6% pendapatan, di bawah tolok ukur'],
    20: ['Mekanisme Pengendalian Anggaran dan Ekspansi', 'Terkendali: tiga rem sebelum anggaran dan ekspansi berjalan'],
    21: ['Ringkasan Strategi Pemasaran', 'Premium. Local. Consistent.']
  };
  for (const [key, [title, oldHeadline]] of Object.entries(mainTitles)) {
    const number = Number(key);
    const revision = window.MELOOLOO_MARKETING_REVISIONS[number] ||= {};
    const transcript = revision.text ?? sourceText(number);
    const extension = number === 15 || number === 19 ? 'svg' : 'png';
    const image = number === 7 ? 'slide-07-v2.png' : `slide-${String(number).padStart(2, '0')}.${extension}`;
    const version = number === 7 ? 'competition-map-v2-20261023' : 'marketing-titles-20261023';
    revision.revisedImage = `marketing-revised/${image}?v=${version}`;
    revision.title = title;
    revision.text = transcript.includes(oldHeadline)
      ? transcript.replace(oldHeadline, title)
      : transcript.includes(title) ? transcript : `${title}\n${transcript}`;
    if (number === 1) {
      revision.text = revision.text.replace('[NAMA PRESENTER]\n·  [peran di tim]\n', '');
    }
  }
})();
