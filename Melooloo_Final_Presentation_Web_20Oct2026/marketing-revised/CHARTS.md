# Recovered marketing charts

The macOS Quick Look renderer omitted native PowerPoint charts from the marketing slide PNGs. These nine self-contained SVGs preserve each original slide as an embedded PNG and restore the missing chart as vector content. The source PNGs in `../marketing-original/slides/` and the supplied PPTX remain unchanged.

| Derivative | PowerPoint chart | Data in the original chart cache |
| --- | --- | --- |
| `slide-15.svg` | `ppt/charts/chart3.xml` | Grade A volume mix: Tahun 1 B2B 68% / B2C 32%; Tahun 5 40% / 60%; Tahun 10 48% / 52% |
| `slide-19.svg` | `ppt/charts/chart4.xml` | Marketing spending as % of revenue, Th0–Th10: 14.4, 10.3, 8.1, 6.3, 6.5, 5.9, 6.6, 5.8, 5.7, 6.5, 5.4. Benchmarks in the PPTX: Gartner 7.7%; The CMO Survey B2C products 12%. |
| `slide-24.svg` | `ppt/charts/chart5.xml` and `chart6.xml` | Wave 1 hotel rooms: 889, 662, 488, 428, 333, 333, 272 (3,405 total). Wave 2: 695, 649, 600, 373, 366, 346, 318 (3,347 total). Combined 6,752 rooms. |
| `slide-26.svg` | `ppt/charts/chart7.xml` | Survey response counts by willingness to pay: below Rp 100,000 = 137; Rp 100,000–200,000 = 74; Rp 200,000–400,000 = 17; Rp 400,000–600,000 = 25. Total 253 respondents. |
| `slide-28.svg` | `ppt/charts/chart8.xml` | Price per fruit: Melooloo Rp 178,200; AEON Baby Blonde Rp 129,000; Cantaloupe Jepang Rp 97,200; Golden Rp 97,000; Hamigua Rp 87,600; Kaze Hydroponic Ranch Market Rp 69,900. |
| `slide-32.svg` | `ppt/charts/chart9.xml` | Nine Year 1 activity budgets, in Rp million: 201, 137, 118, 91, 72, 54, 50, 30, 15. Sum 768. |
| `slide-33.svg` | `ppt/charts/chart10.xml` | Cost per new customer: community Rp 330,000; greenhouse visit Rp 192,000; paid advertising Rp 75,000. |
| `slide-34.svg` | `ppt/charts/chart11.xml` | Four stacked city series across Th0–Th10. The rounded chart values sum to Rp 25,302 million across the horizon; the slide headline rounds this to Rp 25.3 billion. The original table notes small differences caused by row rounding. |
| `slide-35.svg` | `ppt/charts/chart12.xml` | Net marketing contribution across Th0–Th10: Rp 1,311 million to Rp 52,386 million; source chart contains all 11 annual values. |

To regenerate these files, run `node build-chart-slides.mjs` in this directory. The SVGs are full 2400 × 1354 slides and can replace the corresponding image paths in the main presentation and backup gallery. The embedded PNG data URI ensures the original design renders when the SVG itself is used in an HTML `<img>` element.

Accessible summaries for the host page:

- Slide 15: “Porsi volume Grade A: Tahun 1 B2B 68 persen dan B2C 32 persen; Tahun 5 B2B 40 persen dan B2C 60 persen; Tahun 10 B2B 48 persen dan B2C 52 persen.”
- Slide 19: “Anggaran pemasaran sebagai persentase pendapatan turun dari 14,4 persen di Tahun 0 menjadi 10,3 persen di Tahun 1 dan 5,4 persen di Tahun 10. Tolok ukur yang ditampilkan adalah Gartner 7,7 persen dan The CMO Survey produk B2C 12 persen.”
- Slide 24: “Empat belas hotel sasaran terbagi dalam dua gelombang: 3.405 kamar pada gelombang pertama dan 3.347 kamar pada gelombang kedua, total 6.752 kamar.”
- Slide 26: “Kesediaan membayar dalam survei 253 responden: 137 orang di bawah Rp 100.000 per buah; 74 orang Rp 100.000–200.000; 17 orang Rp 200.000–400.000; 25 orang Rp 400.000–600.000.”
- Slide 28: “Melooloo Rp 178.200 per buah dibanding Baby Blonde di AEON Rp 129.000 dan empat melon rak lain seharga Rp 69.900–97.200.”
- Slide 32: “Anggaran Tahun 1 Rp 768 juta terdiri dari sembilan aktivitas. Terbesar Events and Experiences Rp 201 juta, Sales Promotion Rp 137 juta, dan Advertising Rp 118 juta.”
- Slide 33: “Biaya per pelanggan baru: komunitas Rp 330.000, Kunjungan Kebun Rp 192.000, dan iklan berbayar Rp 75.000.”
- Slide 34: “Anggaran pemasaran per kota ditampilkan sebagai batang bertumpuk dari Tahun 0 sampai Tahun 10, meliputi Jakarta, Pusat, Surabaya Raya, dan Bali.”
- Slide 35: “Kontribusi pemasaran bersih meningkat dari Rp 1.311 juta di Tahun 0 menjadi Rp 20.143 juta di Tahun 5 dan Rp 52.386 juta di Tahun 10.”

The SVGs were visually checked in Chromium at full 16:9 scale after generation.
