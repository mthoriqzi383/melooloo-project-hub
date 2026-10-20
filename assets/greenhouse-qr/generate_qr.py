"""Regenerate the public greenhouse QR and A5 presentation card.

Dependencies: segno, pillow, cairosvg. The QR destination is a stable site URL;
3d.html controls the eventual walkthrough location.
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
URL = "https://mthoriqzi383.github.io/melooloo-project-hub/3d.html"
GREEN = "#0b3325"
PAPER = "#f5f7ed"


def main() -> None:
    qr = segno.make(URL, error="h", boost_error=False)
    qr.save(OUT / "melooloo-greenhouse-3d-qr.svg", kind="svg", scale=12,
            border=4, dark=GREEN, light="#ffffff")
    qr.save(OUT / "melooloo-greenhouse-3d-qr.png", kind="png", scale=48,
            border=4, dark=GREEN, light="#ffffff")

    logo = Image.open(ROOT / "Melooloo_Final_Presentation_Web_20Oct2026/assets/logo.png")
    logo.thumbnail((550, 450), Image.Resampling.LANCZOS)
    data = BytesIO()
    logo.save(data, format="PNG", optimize=True)
    logo_uri = "data:image/png;base64," + base64.b64encode(data.getvalue()).decode()

    matrix = list(qr.matrix_iter(scale=1, border=4))
    n = len(matrix)
    cells = " ".join(f"M{x} {y}h1v1h-1z" for y, row in enumerate(matrix)
                     for x, filled in enumerate(row) if filled)
    qr_scale = 100 / n
    card = f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
      width="148mm" height="210mm" viewBox="0 0 148 210" role="img"
      aria-label="Melooloo greenhouse 3D QR presentation card">
      <rect width="148" height="210" fill="{PAPER}"/>
      <rect width="148" height="5" fill="{GREEN}"/>
      <image x="17" y="10" width="27" height="25" xlink:href="{logo_uri}"/>
      <text x="50" y="23" fill="{GREEN}" font-family="Arial,sans-serif" font-size="6.1" font-weight="700">GREENHOUSE 3D</text>
      <text x="50" y="29" fill="#64746a" font-family="Arial,sans-serif" font-size="2.8" letter-spacing=".6">PRESENTATION ACCESS</text>
      <text x="17" y="46" fill="{GREEN}" font-family="Arial,sans-serif" font-size="9.4" font-weight="700">Jelajahi greenhouse 3D.</text>
      <text x="17" y="54" fill="#52675b" font-family="Arial,sans-serif" font-size="3.5">Pindai untuk membuka walkthrough interaktif.</text>
      <rect x="16" y="62" width="116" height="116" rx="4" fill="#ffffff"/>
      <g transform="translate(24 70) scale({qr_scale:.9f})" fill="{GREEN}"><path d="{cells}"/></g>
      <text x="74" y="187" text-anchor="middle" fill="{GREEN}" font-family="Arial,sans-serif" font-size="4.1" font-weight="700">SCAN UNTUK MEMBUKA PETA 3D</text>
      <text x="74" y="194" text-anchor="middle" fill="#52675b" font-family="Arial,sans-serif" font-size="2.9">mthoriqzi383.github.io/melooloo-project-hub/3d.html</text>
      <line x1="17" y1="199" x2="131" y2="199" stroke="#c9d9c7" stroke-width=".3"/>
      <text x="17" y="203" fill="#64746a" font-family="Arial,sans-serif" font-size="2.35">Visualisasi konsep · kelayakan lokasi rooftop belum diverifikasi.</text>
    </svg>'''
    svg_path = OUT / "melooloo-greenhouse-3d-scan-card.svg"
    svg_path.write_text(card)
    cairosvg.svg2png(bytestring=card.encode(),
                    write_to=str(OUT / "melooloo-greenhouse-3d-scan-card.png"),
                    output_width=1748, output_height=2480)
    print(f"QR version {qr.version}, matrix {n} × {n}; URL: {URL}")


if __name__ == "__main__":
    main()
