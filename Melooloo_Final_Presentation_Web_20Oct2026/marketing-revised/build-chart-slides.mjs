/**
 * Restore native PPTX charts omitted by the macOS Quick Look slide renderer.
 *
 * The data below is transcribed from the c:pt caches in chart3.xml through
 * chart6.xml of Melooloo_Strategi_Pemasaran_v3_23Okt2026.pptx. We preserve the
 * original slide PNG beneath each vector chart so the marketing layout stays
 * aligned with the supplied deck. Source PNGs are not changed.
 *
 * Run from this directory: node build-chart-slides.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const W = 2400;
const H = 1354;
const green = '#7AA23A';
const dark = '#103A25';
const gray = '#9AA39A';
const muted = '#67736A';
const paper = '#FFF7E5';

function esc(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function line(x1, y1, x2, y2, color, width = 2, dash = '') {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
}

function txt(x, y, value, size = 30, color = dark, weight = 400, anchor = 'start', family = 'Georgia, serif') {
  return `<text x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${esc(value)}</text>`;
}

function rect(x, y, w, h, fill, rx = 0, stroke = '', sw = 0) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${sw}"` : ''}/>`;
}

function circle(cx, cy, r, fill, stroke = '', sw = 0) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${sw}"` : ''}/>`;
}

function composite(slide, title, description, overlay) {
  const slideName = `slide-${String(slide).padStart(2, '0')}.png`;
  const base = [15, 19].includes(slide)
    ? join(dir, `title-base-${slideName}`)
    : join(dir, `../marketing-original/slides/${slideName}`);
  const background = readFileSync(base).toString('base64');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="title desc"><title id="title">${esc(title)}</title><desc id="desc">${esc(description)}</desc><image x="0" y="0" width="${W}" height="${H}" href="data:image/png;base64,${background}"/>${overlay}</svg>`;
  writeFileSync(join(dir, `slide-${String(slide).padStart(2, '0')}.svg`), svg);
}

function b2bB2cMix() {
  const rows = [
    { year: 'Tahun 1', b2b: 68, b2c: 32 },
    { year: 'Tahun 5', b2b: 40, b2c: 60 },
    { year: 'Tahun 10', b2b: 48, b2c: 52 },
  ];
  const x = 390;
  const bw = 1860;
  const bh = 132;
  let out = txt(84, 382, 'PORSI VOLUME GRADE A', 25, muted, 700, 'start', 'Arial, sans-serif');
  out += line(84, 400, 2310, 400, '#DCCFAD', 2);
  rows.forEach((row, i) => {
    const y = 443 + i * 192;
    const grayWidth = bw * row.b2b / 100;
    out += txt(90, y + 79, row.year, 42, dark, 700);
    out += rect(x, y, bw, bh, '#E5E6D8', 10);
    out += rect(x, y, grayWidth, bh, gray, 10);
    out += rect(x + grayWidth - 6, y, bw - grayWidth + 6, bh, green, 10);
    out += txt(x + grayWidth / 2, y + 78, `${row.b2b}%`, 55, dark, 700, 'middle');
    out += txt(x + grayWidth + (bw - grayWidth) / 2, y + 78, `${row.b2c}%`, 55, paper, 700, 'middle');
    if (i === 1) {
      out += rect(x - 12, y - 12, bw + 24, bh + 24, 'none', 18, dark, 3);
    }
  });
  composite(15, 'B2B dan B2C: porsi volume Grade A', 'Tahun 1 B2B 68 persen dan B2C 32 persen; Tahun 5 B2B 40 persen dan B2C 60 persen; Tahun 10 B2B 48 persen dan B2C 52 persen.', out);
}

function marketingBudget() {
  const actual = [14.4, 10.3, 8.1, 6.3, 6.5, 5.9, 6.6, 5.8, 5.7, 6.5, 5.4];
  const x0 = 205; const x1 = 2145; const y0 = 456; const y1 = 870;
  const xx = i => x0 + (x1 - x0) * i / 10;
  const yy = v => y1 - (y1 - y0) * v / 16;
  let out = '';
  for (const v of [0, 4, 8, 12, 16]) {
    out += line(x0, yy(v), x1, yy(v), '#DDD4BD', 2);
    out += txt(x0 - 26, yy(v) + 10, `${v}%`, 25, muted, 400, 'end', 'Arial, sans-serif');
  }
  out += line(x0, yy(12), x1, yy(12), '#67736A', 5, '16 11');
  out += line(x0, yy(7.7), x1, yy(7.7), '#9AA39A', 5, '16 11');
  const points = actual.map((v, i) => `${xx(i)},${yy(v)}`).join(' ');
  out += `<polyline points="${points}" fill="none" stroke="${green}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`;
  actual.forEach((v, i) => {
    out += circle(xx(i), yy(v), 11, green, paper, 3);
    if ([0, 1, 2, 3, 5, 10].includes(i)) {
      const labelY = i === 2 ? yy(v) + 41 : yy(v) - 21;
      out += txt(xx(i) + (i === 0 ? 94 : 0), labelY, String(v).replace('.', ',') + '%', 28, dark, 700, 'middle', 'Arial, sans-serif');
    }
    out += txt(xx(i), 921, `Th${i}`, 25, dark, i === 5 ? 700 : 400, 'middle', 'Arial, sans-serif');
  });
  // A direct legend keeps the two reference series distinguishable at a glance.
  out += line(355, 968, 440, 968, green, 10);
  out += txt(458, 978, 'Anggaran pemasaran', 28, dark, 700);
  out += line(1045, 968, 1130, 968, gray, 5, '16 11');
  out += txt(1148, 978, 'Gartner 7,7%', 28, dark);
  out += line(1600, 968, 1685, 968, muted, 5, '16 11');
  out += txt(1703, 978, 'CMO Survey B2C 12%', 28, dark);
  composite(19, 'Anggaran pemasaran sebagai persentase pendapatan', 'Anggaran pemasaran 14,4 persen pada Tahun 0, 10,3 persen pada Tahun 1, lalu 5,4 hingga 8,1 persen pada Tahun 2 sampai 10. Tolok ukur Gartner 7,7 persen dan The CMO Survey produk B2C 12 persen.', out);
}

function hotelRooms() {
  const waves = [
    [
      ['Hotel Mulia Senayan', 889], ['Shangri-La', 662], ['Fairmont', 488],
      ['Grand Hyatt', 428], ['Ritz-Carlton Mega Kuningan', 333],
      ['JW Marriott', 333], ['Mandarin Oriental', 272],
    ],
    [
      ['Hotel Borobudur', 695], ['The Sultan', 649], ['Grand Sahid Jaya', 600],
      ['Crowne Plaza', 373], ['AYANA Midplaza', 366], ['Gran Meliá', 346],
      ['Le Méridien', 318],
    ],
  ];
  let out = '';
  waves.forEach((rows, wave) => {
    const base = wave === 0 ? 100 : 1220;
    const start = base + 440;
    const barW = 450;
    out += txt(base, 372, `GELOMBANG ${wave + 1}`, 31, dark, 700);
    out += txt(base + 1040, 372, `${rows.reduce((n, [, rooms]) => n + rooms, 0).toLocaleString('id-ID')} kamar`, 28, muted, 700, 'end');
    out += line(base, 390, base + 1040, 390, '#DCCFAD', 2);
    rows.forEach(([name, rooms], i) => {
      const y = 425 + i * 83;
      out += txt(base, y + 41, name, 28, dark, i < 2 ? 700 : 400);
      out += rect(start, y + 7, barW, 45, '#ECE9D8', 2);
      out += rect(start, y + 7, barW * rooms / 900, 45, gray, 2);
      out += txt(base + 1030, y + 43, rooms.toLocaleString('id-ID'), 28, dark, 700, 'end');
    });
  });
  composite(24, '14 hotel pertama dalam dua gelombang', 'Gelombang 1 memuat 3.405 kamar di tujuh hotel. Gelombang 2 memuat 3.347 kamar di tujuh hotel. Total 6.752 kamar.', out);
}

function willingnessToPay() {
  const rows = [
    ['< Rp 100.000', 137], ['Rp 100.000–200.000', 74],
    ['Rp 200.000–400.000', 17], ['Rp 400.000–600.000', 25],
  ];
  let out = txt(110, 677, 'KESEDIAAN MEMBAYAR PER BUAH', 27, muted, 700, 'start', 'Arial, sans-serif');
  out += line(110, 694, 1420, 694, '#DCCFAD', 2);
  rows.forEach(([name, count], i) => {
    const y = 727 + i * 116;
    out += txt(110, y + 43, name, 30, dark, i === 0 ? 700 : 400);
    out += rect(595, y + 7, 650, 52, '#E9E8D8', 2);
    out += rect(595, y + 7, 650 * count / 137, 52, i === 0 ? green : gray, 2);
    out += txt(1385, y + 46, count, 30, dark, 700, 'end');
  });
  composite(26, 'Distribusi kesediaan membayar dari survei 253 responden', 'Dari 253 responden, 137 memilih di bawah Rp 100.000 per buah, 74 memilih Rp 100.000 sampai 200.000, 17 memilih Rp 200.000 sampai 400.000, dan 25 memilih Rp 400.000 sampai 600.000.', out);
}

function retailFruitPrice() {
  const rows = [
    ['Melooloo kanal langsung', 178200],
    ['Baby Blonde · AEON', 129000],
    ['Cantaloupe Jepang · AEON', 97200],
    ['Golden · AEON', 97000],
    ['Hamigua · AEON', 87600],
    ['Kaze Hydroponic · Ranch Market', 69900],
  ];
  let out = txt(110, 380, 'HARGA PER BUAH · RP', 27, muted, 700, 'start', 'Arial, sans-serif');
  out += line(110, 399, 1500, 399, '#DCCFAD', 2);
  rows.forEach(([name, price], i) => {
    const y = 435 + i * 122;
    out += txt(115, y + 31, name, 29, dark, i === 0 ? 700 : 400);
    out += rect(115, y + 51, 1050, 45, '#E9E8D8', 2);
    out += rect(115, y + 51, 1050 * price / 178200, 45, i === 0 ? green : gray, 2);
    out += txt(1475, y + 88, `Rp ${price.toLocaleString('id-ID')}`, 29, dark, 700, 'end');
  });
  composite(28, 'Perbandingan harga melon per buah di rak', 'Melooloo kanal langsung Rp 178.200 per buah; Baby Blonde AEON Rp 129.000; Cantaloupe Jepang AEON Rp 97.200; Golden AEON Rp 97.000; Hamigua AEON Rp 87.600; Kaze Hydroponic Ranch Market Rp 69.900.', out);
}

function activityBudget() {
  const rows = [
    ['Events & Experiences', 201], ['Sales Promotion', 137], ['Advertising', 118],
    ['Personal Selling B2B', 91], ['Interactive Marketing', 72],
    ['Bukti Premium', 54], ['Direct Marketing (CRM)', 50],
    ['PR & Publicity', 30], ['Riset & Brand Tracking', 15],
  ];
  let out = txt(110, 381, 'ANGGARAN TAHUN 1 · RP JUTA', 27, muted, 700, 'start', 'Arial, sans-serif');
  out += line(110, 400, 1445, 400, '#DCCFAD', 2);
  rows.forEach(([name, amount], i) => {
    const y = 427 + i * 83;
    out += txt(110, y + 38, name, 27, dark, i < 2 ? 700 : 400);
    out += rect(650, y + 10, 580, 42, '#E9E8D8', 2);
    out += rect(650, y + 10, 580 * amount / 201, 42, green, 2);
    out += txt(1420, y + 42, amount, 29, dark, 700, 'end');
  });
  composite(32, 'Anggaran pemasaran Tahun 1 menurut aktivitas', 'Total Rp 768 juta tersusun dari Events and Experiences 201 juta, Sales Promotion 137 juta, Advertising 118 juta, Personal Selling B2B 91 juta, Interactive Marketing 72 juta, Bukti Premium 54 juta, Direct Marketing CRM 50 juta, PR and Publicity 30 juta, serta Riset and Brand Tracking 15 juta.', out);
}

function acquisitionCost() {
  const rows = [
    ['Komunitas', 330000], ['Kunjungan Kebun', 192000], ['Iklan berbayar', 75000],
  ];
  let out = txt(110, 383, 'BIAYA PER PELANGGAN BARU', 27, muted, 700, 'start', 'Arial, sans-serif');
  out += line(110, 400, 1445, 400, '#DCCFAD', 2);
  rows.forEach(([name, cost], i) => {
    const y = 467 + i * 180;
    out += txt(113, y + 25, name, 39, dark, i === 0 ? 700 : 400);
    out += rect(113, y + 51, 1100, 72, '#E9E8D8', 2);
    out += rect(113, y + 51, 1100 * cost / 330000, 72, i === 0 ? green : gray, 2);
    out += txt(1408, y + 105, `Rp ${cost.toLocaleString('id-ID')}`, 35, dark, 700, 'end');
  });
  composite(33, 'Biaya akuisisi per pelanggan baru Tahun 1', 'Komunitas Rp 330.000 per pelanggan baru; Kunjungan Kebun Rp 192.000; iklan berbayar Rp 75.000.', out);
}

function tenYearBudget() {
  const series = [
    { name: 'Jakarta', color: green, values: [372,652,860,1000,1382,1431,1476,1428,1498,1569,1653] },
    { name: 'Pusat', color: dark, values: [135,116,209,207,266,332,382,444,529,638,741] },
    { name: 'Surabaya Raya', color: gray, values: [0,0,0,0,0,150,791,909,1131,1241,1058] },
    { name: 'Bali', color: '#CDD3CB', values: [0,0,0,0,0,0,0,0,173,1263,1266] },
  ];
  const plotX = 186; const plotY = 425; const plotW = 1350; const bottom = 888; const plotH = bottom - plotY;
  let out = txt(112, 377, 'ANGGARAN PER KOTA · RP JUTA', 27, muted, 700, 'start', 'Arial, sans-serif');
  for (const v of [0,1000,2000,3000,4000,5000]) {
    const y = bottom - plotH * v / 5000;
    out += line(plotX, y, plotX + plotW, y, '#DDD4BD', 2);
    out += txt(plotX - 19, y + 9, v === 0 ? '0' : `${v / 1000} rb`, 23, muted, 400, 'end', 'Arial, sans-serif');
  }
  for (let i = 0; i <= 10; i++) {
    const x = plotX + 36 + i * 124;
    let y = bottom;
    series.forEach(s => {
      const h = plotH * s.values[i] / 5000;
      if (h > 0) out += rect(x, y - h, 70, h, s.color);
      y -= h;
    });
    out += txt(x + 35, 927, `Th${i}`, 22, dark, 400, 'middle', 'Arial, sans-serif');
  }
  let lx = 142;
  series.forEach(s => {
    out += rect(lx, 969, 27, 20, s.color);
    out += txt(lx + 40, 988, s.name, 25, dark);
    lx += s.name === 'Surabaya Raya' ? 350 : 285;
  });
  composite(34, 'Anggaran pemasaran sepuluh tahun menurut kota', 'Diagram batang bertumpuk menunjukkan anggaran Jakarta, Pusat, Surabaya Raya dan Bali dari Tahun 0 sampai Tahun 10; Surabaya mulai Tahun 5 dan Bali mulai Tahun 8. Sumber angka lengkap ada dalam tabel pada slide.', out);
}

function netMarketingContribution() {
  const values = [1311,3794,7587,11891,15706,20143,24590,29490,35528,43483,52386];
  const plotX = 184; const plotY = 425; const plotW = 1350; const bottom = 899; const plotH = bottom - plotY;
  let out = txt(112, 376, 'KONTRIBUSI PEMASARAN BERSIH · RP JUTA', 27, muted, 700, 'start', 'Arial, sans-serif');
  for (const v of [0,10000,20000,30000,40000,50000]) {
    const y = bottom - plotH * v / 55000;
    out += line(plotX, y, plotX + plotW, y, '#DDD4BD', 2);
    out += txt(plotX - 16, y + 9, v === 0 ? '0' : `${v / 1000} rb`, 23, muted, 400, 'end', 'Arial, sans-serif');
  }
  values.forEach((value, i) => {
    const x = plotX + 37 + i * 124;
    const h = plotH * value / 55000;
    out += rect(x, bottom - h, 72, h, green);
    out += txt(x + 36, 940, `Th${i}`, 22, dark, 400, 'middle', 'Arial, sans-serif');
    if ([0,5,10].includes(i)) out += txt(x + 36, bottom - h - 13, value.toLocaleString('id-ID'), 25, dark, 700, 'middle', 'Arial, sans-serif');
  });
  composite(35, 'Kontribusi pemasaran bersih dari Tahun 0 sampai Tahun 10', 'Kontribusi pemasaran bersih dalam Rp juta meningkat dari 1.311 pada Tahun 0 menjadi 20.143 pada Tahun 5 dan 52.386 pada Tahun 10. Angka tahunan lengkap ada pada chart sumber.', out);
}

b2bB2cMix();
marketingBudget();
hotelRooms();
willingnessToPay();
retailFruitPrice();
activityBudget();
acquisitionCost();
tenYearBudget();
netMarketingContribution();
