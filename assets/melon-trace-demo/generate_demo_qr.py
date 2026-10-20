"""Generate a scannable demo QR and A6 sample card for the public trace page.

Dependencies: segno, Pillow, cairosvg. The destination is a stable public demo URL.
All sample numbers and dates are explicitly identified as simulations on the page.
"""

from __future__ import annotations

import base64
from io import BytesIO
from pathlib import Path

import cairosvg
from PIL import Image
import segno


ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent
URL = "https://mthoriqzi383.github.io/melooloo-project-hub/trace-demo.html"
GREEN = "#123b2b"
CREAM = "#f7f5eb"


def main() -> None:
    qr = segno.make(URL, error="h", boost_error=False)
    qr.save(OUT / "melooloo-trace-demo-qr.svg", kind="svg", scale=16,
            border=4, dark=GREEN, light="#ffffff")
    qr.save(OUT / "melooloo-trace-demo-qr.png", kind="png", scale=32,
            border=4, dark=GREEN, light="#ffffff")

    logo = Image.open(ROOT / "Melooloo_Final_Presentation_Web_20Oct2026/assets/logo.png")
    logo.thumbnail((450, 450), Image.Resampling.LANCZOS)
    data = BytesIO()
    logo.save(data, format="PNG", optimize=True)
    logo_uri = "data:image/png;base64," + base64.b64encode(data.getvalue()).decode()

    matrix = list(qr.matrix_iter(scale=1, border=4))
    n = len(matrix)
    cells = " ".join(f"M{x} {y}h1v1h-1z" for y, row in enumerate(matrix)
                     for x, filled in enumerate(row) if filled)
    qr_scale = 68 / n
    card = f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
      width="105mm" height="148mm" viewBox="0 0 105 148" role="img"
      aria-label="Melooloo sample melon traceability QR card">
      <rect width="105" height="148" fill="{CREAM}"/>
      <rect width="105" height="4" fill="{GREEN}"/>
      <image x="11" y="8" width="17" height="18" xlink:href="{logo_uri}"/>
      <text x="31" y="16" fill="{GREEN}" font-family="Arial,sans-serif" font-size="4.3" font-weight="700">JEJAK BUAH</text>
      <text x="31" y="21" fill="#71806f" font-family="Arial,sans-serif" font-size="2.5" letter-spacing=".5">TRACEABILITY EXPERIENCE</text>
      <rect x="78" y="10" width="16" height="7" rx="3.5" fill="#e7b978"/>
      <text x="86" y="14.7" text-anchor="middle" fill="{GREEN}" font-family="Arial,sans-serif" font-size="2.7" font-weight="700">DEMO</text>
      <text x="11" y="35" fill="{GREEN}" font-family="Arial,sans-serif" font-size="8.8" font-weight="700">Cerita di balik</text>
      <text x="11" y="44" fill="{GREEN}" font-family="Arial,sans-serif" font-size="8.8" font-weight="700">buahmu.</text>
      <text x="11" y="51" fill="#5b705f" font-family="Arial,sans-serif" font-size="3.05">Pindai untuk melihat tanam, panen, Brix, dan perjalanan lot.</text>
      <rect x="10" y="57" width="85" height="77" rx="3" fill="#ffffff"/>
      <g transform="translate(18.5 61.5) scale({qr_scale:.9f})" fill="{GREEN}"><path d="{cells}"/></g>
      <text x="52.5" y="139" text-anchor="middle" fill="{GREEN}" font-family="Arial,sans-serif" font-size="3.25" font-weight="700">LOT DEMO-001 · DATA SIMULASI</text>
      <text x="52.5" y="144" text-anchor="middle" fill="#6e806d" font-family="Arial,sans-serif" font-size="2.7">Bukan QR untuk buah produksi atau bukti hasil panen</text>
    </svg>'''
    (OUT / "melooloo-trace-demo-card.svg").write_text(card)
    cairosvg.svg2png(bytestring=card.encode(),
                    write_to=str(OUT / "melooloo-trace-demo-card.png"),
                    output_width=1240, output_height=1748)
    print(f"QR version {qr.version}; {n} × {n} matrix; destination: {URL}")


if __name__ == "__main__":
    main()
