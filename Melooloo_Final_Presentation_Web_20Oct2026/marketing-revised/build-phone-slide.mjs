import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const base = readFileSync(join(here, 'slide-08.png')).toString('base64');
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="1354" viewBox="0 0 2400 1354" role="img" aria-labelledby="title desc">
  <title id="title">Point of Parity dan Point of Difference — contoh antarmuka jejak buah Melooloo</title>
  <desc id="desc">Slide pemasaran dengan ilustrasi aplikasi pelanggan. Data contoh DEMO-001 menampilkan Brix 15,2 derajat dari sampel lot, tanggal tanam dan panen, serta status asal kebun dan uji residu yang belum tersedia.</desc>
  <defs>
    <filter id="phone-shadow" x="-20%" y="-15%" width="150%" height="140%"><feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#0b3522" flood-opacity=".16"/></filter>
    <clipPath id="screen-clip"><rect x="1364" y="293" width="504" height="907" rx="44"/></clipPath>
    <linearGradient id="metric-glow" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#174b31"/><stop offset="1" stop-color="#0b3825"/></linearGradient>
  </defs>

  <image href="data:image/png;base64,${base}" x="0" y="0" width="2400" height="1354"/>
  <!-- Preserve the authored slide; replace only the former phone and its annotations. -->
  <rect x="1284" y="225" width="1116" height="1046" fill="#fdf5e2"/>

  <g filter="url(#phone-shadow)"><rect x="1347" y="276" width="538" height="941" rx="62" fill="#0b3925"/></g>
  <rect x="1364" y="293" width="504" height="907" rx="44" fill="#fffcf3"/>
  <g clip-path="url(#screen-clip)">
    <rect x="1364" y="293" width="504" height="119" fill="#0d412a"/>
    <rect x="1364" y="377" width="504" height="35" fill="#0d412a"/>
    <text x="1391" y="322" fill="#e9f0de" font-family="Arial, sans-serif" font-size="17" font-weight="700">9:41</text>
    <path d="M1791 316h9m5-4v8m9-11v11m9-14v14" fill="none" stroke="#e9f0de" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="1830" y="309" width="19" height="11" rx="3" fill="none" stroke="#e9f0de" stroke-width="2"/><rect x="1832" y="311" width="13" height="7" rx="1" fill="#e9f0de"/>
    <circle cx="1396" cy="371" r="15" fill="#a5bd62"/>
    <path d="M1389 376c5-9 11-11 16-11-1 9-6 13-16 11Zm8-10c-2-4-5-5-8-5 0 5 3 8 8 8" fill="none" stroke="#0d412a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="1423" y="381" fill="#fff9e8" font-family="Georgia,serif" font-size="32" font-weight="bold">melooloo</text>
    <text x="1829" y="376" text-anchor="end" fill="#d8e8c0" font-family="Arial,sans-serif" font-size="17" font-weight="700" letter-spacing="1.2">JEJAK BUAH</text>
  </g>

  <text x="1392" y="454" fill="#123b28" font-family="Georgia,serif" font-size="39" font-weight="bold">Kenali melonmu.</text>
  <text x="1392" y="489" fill="#42614c" font-family="Arial,sans-serif" font-size="21">Melooloo Signature · Grade A</text>
  <rect x="1391" y="511" width="289" height="39" rx="20" fill="#e6eed6"/>
  <circle cx="1415" cy="530.5" r="5" fill="#6d9741"/>
  <text x="1430" y="537" fill="#34583b" font-family="Arial,sans-serif" font-size="17" font-weight="700" letter-spacing=".5">DEMO-001  ·  DATA CONTOH</text>

  <rect x="1391" y="569" width="448" height="178" rx="25" fill="url(#metric-glow)"/>
  <text x="1417" y="605" fill="#c9e49b" font-family="Arial,sans-serif" font-size="17" font-weight="700" letter-spacing="1.7">KEMANISAN · SAMPEL LOT</text>
  <text x="1414" y="689" fill="#fffbe9" font-family="Georgia,serif" font-size="78" font-weight="bold">15,2</text>
  <text x="1590" y="687" fill="#d5e9ab" font-family="Arial,sans-serif" font-size="35" font-weight="700">°Bx</text>
  <text x="1419" y="721" fill="#d5e9ab" font-family="Arial,sans-serif" font-size="19">Target mutu: ≥15°Bx</text>
  <circle cx="1759" cy="659" r="50" fill="none" stroke="#92b55a" stroke-opacity=".65" stroke-width="2"/>
  <path d="M1759 609c-11 25-11 75 0 100m0-100c11 25 11 75 0 100m-50-50h100m-83-32c19 11 46 11 66 0m-66 64c19-11 46-11 66 0" fill="none" stroke="#92b55a" stroke-opacity=".65" stroke-width="2"/>

  <rect x="1391" y="766" width="216" height="120" rx="19" fill="#f2f5e9" stroke="#dce6d2" stroke-width="2"/>
  <path d="M1416 802c2-12 10-17 20-17-1 10-7 18-20 17Zm0 0v16" fill="none" stroke="#669246" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="1452" y="801" fill="#667c61" font-family="Arial,sans-serif" font-size="16" font-weight="700" letter-spacing="1.2">DITANAM</text>
  <text x="1417" y="847" fill="#123b28" font-family="Georgia,serif" font-size="27" font-weight="bold">05 Jul 2026</text>

  <rect x="1623" y="766" width="216" height="120" rx="19" fill="#f2f5e9" stroke="#dce6d2" stroke-width="2"/>
  <circle cx="1649" cy="795" r="12" fill="none" stroke="#669246" stroke-width="3"/>
  <path d="M1649 788v8l6 3" fill="none" stroke="#669246" stroke-width="3" stroke-linecap="round"/>
  <text x="1685" y="801" fill="#667c61" font-family="Arial,sans-serif" font-size="16" font-weight="700" letter-spacing="1.2">DIPANEN</text>
  <text x="1649" y="847" fill="#123b28" font-family="Georgia,serif" font-size="27" font-weight="bold">20 Sep 2026</text>

  <text x="1393" y="921" fill="#688058" font-family="Arial,sans-serif" font-size="16" font-weight="700" letter-spacing="1.5">STATUS PENELUSURAN</text>
  <path d="M1392 936h446M1392 1016h446M1392 1096h446" stroke="#dbe3d2" stroke-width="2"/>
  <path d="M1416 962c0-10 7-17 16-17s16 7 16 17c0 12-16 27-16 27s-16-15-16-27Zm16-7a7 7 0 1 0 0 14 7 7 0 0 0 0-14Z" fill="none" stroke="#628a4d" stroke-width="3" stroke-linejoin="round"/>
  <text x="1466" y="967" fill="#1b412e" font-family="Arial,sans-serif" font-size="21" font-weight="700">Asal kebun</text>
  <text x="1466" y="993" fill="#657a67" font-family="Arial,sans-serif" font-size="17">Belum diverifikasi</text>
  <text x="1819" y="980" text-anchor="end" fill="#718872" font-family="Arial,sans-serif" font-size="27">›</text>

  <path d="M1416 1045l16-7 16 7v13c0 13-8 20-16 24-8-4-16-11-16-24v-13Zm9 13 5 5 10-11" fill="none" stroke="#628a4d" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="1466" y="1046" fill="#1b412e" font-family="Arial,sans-serif" font-size="21" font-weight="700">Uji residu</text>
  <text x="1466" y="1073" fill="#657a67" font-family="Arial,sans-serif" font-size="17">Belum tersedia</text>
  <text x="1819" y="1061" text-anchor="end" fill="#718872" font-family="Arial,sans-serif" font-size="27">›</text>

  <rect x="1391" y="1110" width="448" height="63" rx="20" fill="#91ae4d"/>
  <text x="1615" y="1150" text-anchor="middle" fill="#123b28" font-family="Arial,sans-serif" font-size="21" font-weight="700">Lihat perjalanan lengkap  ↗</text>
  <rect x="1568" y="1185" width="97" height="5" rx="3" fill="#a8b7a4"/>

  <rect x="1612" y="250" width="253" height="47" rx="23.5" fill="#fffdf7" stroke="#97a790" stroke-width="2"/>
  <text x="1738.5" y="281" text-anchor="middle" fill="#385743" font-family="Arial,sans-serif" font-size="20" font-weight="700">ILUSTRASI APLIKASI</text>

  <g font-family="Arial,sans-serif">
    <circle cx="1885" cy="652" r="7" fill="#0d442c"/>
    <path d="M1892 652h59" stroke="#0d442c" stroke-width="3"/>
    <text x="1972" y="622" fill="#6e8f45" font-size="17" font-weight="700" letter-spacing="2">01 / MUTU</text>
    <text x="1972" y="662" fill="#123b28" font-family="Georgia,serif" font-size="32" font-weight="bold">Hasil Brix</text>
    <text x="1972" y="696" fill="#4c624e" font-size="21">dari sampel lot</text>

    <circle cx="1885" cy="826" r="7" fill="#0d442c"/>
    <path d="M1892 826h59" stroke="#0d442c" stroke-width="3"/>
    <text x="1972" y="797" fill="#6e8f45" font-size="17" font-weight="700" letter-spacing="2">02 / PANEN</text>
    <text x="1972" y="838" fill="#123b28" font-family="Georgia,serif" font-size="32" font-weight="bold">Tanggal panen</text>
    <text x="1972" y="871" fill="#4c624e" font-size="21">terhubung ke riwayat lot</text>

    <circle cx="1885" cy="1048" r="7" fill="#0d442c"/>
    <path d="M1892 1048h59" stroke="#0d442c" stroke-width="3"/>
    <text x="1972" y="1017" fill="#6e8f45" font-size="17" font-weight="700" letter-spacing="2">03 / KEAMANAN</text>
    <text x="1972" y="1059" fill="#123b28" font-family="Georgia,serif" font-size="31" font-weight="bold">Status uji residu</text>
    <text x="1972" y="1092" fill="#4c624e" font-size="21">muncul saat data tersedia</text>
  </g>

  <text x="1616" y="1254" text-anchor="middle" fill="#596d5c" font-family="Arial,sans-serif" font-size="18">Tampilan contoh • bukan hasil panen nyata</text>
</svg>`;

writeFileSync(join(here, 'slide-08-v2.svg'), svg);
