#!/usr/bin/env python3
"""Render the supplied marketing PPTX exactly as shown by macOS Quick Look.

Quick Look thumbnails the first slide of a PPTX. For each source slide, this
script moves its presentation-order reference to the first position in a
temporary copy, renders that copy, and discards it. The source PPTX is never
modified. No slide contents, charts, pictures, or text are reconstructed.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import posixpath
import shutil
import struct
import subprocess
import tempfile
from pathlib import Path
from zipfile import ZipFile

from lxml import etree
from PIL import Image, ImageDraw, ImageFont, ImageOps


HERE = Path(__file__).resolve().parent
DEFAULT_SOURCE = Path.home() / "Downloads/Melooloo_Strategi_Pemasaran_v3_23Okt2026.pptx"
SIZES = {"main": (1, 21), "backup": (22, 51)}

# Page numbers refer to the presentation order of the supplied v3 PowerPoint.
TITLES = [
    "Strategi pemasaran",
    "Siapa membeli?",
    "Pembeli membeli melon premium tanpa jaminan rasa",
    "Pembeli kami: B2B 68%, B2C 32%",
    "Kami hanya perlu 4–6% pasar premium DKI",
    "Mengapa Melooloo?",
    "Pemasok premium di dalam Jakarta",
    "Pembedanya bisa diperiksa pembeli",
    "Yang sulit ditiru butuh lebih dari tiga tahun",
    "Merek yang dilihat, dicicipi, dan dikunjungi",
    "Bagaimana kami menjual?",
    "Harga 14–17 kali di bawah Crown Melon",
    "Satu format untuk satu kanal",
    "B2B mengunci volume sejak Tahun 0",
    "B2C menjadi 60% volume di Tahun 5",
    "Anggaran komunikasi untuk pengalaman",
    "Tiga tahap perjalanan pelanggan",
    "Berapa biayanya?",
    "Pemasaran sekitar 6% pendapatan",
    "Tiga rem sebelum anggaran dan ekspansi",
    "Premium. Local. Consistent.",
    "Slide cadangan untuk tanya jawab",
    "Pemutus pembelian per kanal",
    "14 hotel pertama dalam dua gelombang",
    "Pasar tersedia dari 158 pintu",
    "Survei 253 responden",
    "Wawancara ritel",
    "Harga per buah di rak",
    "Peta positioning",
    "Delapan uji mutu",
    "Peran dan margin setiap kanal",
    "Anggaran Tahun 1 berdasarkan aktivitas",
    "Biaya dan peran program komunitas",
    "Anggaran pemasaran sepuluh tahun",
    "Kontribusi pemasaran bersih",
    "Jadwal aktivitas Tahun 0–1",
    "Biaya lokapasar di luar model",
    "Pasar Surabaya dan Bali",
    "Lima lapisan pesaing",
    "Peta struktur kompetitif",
    "Replikasi Jakarta ke Surabaya dan Bali",
    "KPI pemasaran Tahun 1, 5, dan 10",
    "Kontribusi kotor pelanggan B2C",
    "Kesetaraan dan pembeda produk",
    "Perjalanan pelanggan B2C dan hotel",
    "Segmen pelanggan B2B dan B2C",
    "Risiko pemasaran dan mitigasi",
    "Lima kanal dengan peran berbeda",
    "Situs Melooloo.id dan ketertelusuran",
    "Budaya hadiah melon premium",
    "Program komunitas enam langkah",
]


def source_order(zip_file: ZipFile) -> tuple[list[etree._Element], dict[str, str]]:
    root = etree.fromstring(zip_file.read("ppt/presentation.xml"))
    slide_list = root.find("{http://schemas.openxmlformats.org/presentationml/2006/main}sldIdLst")
    if slide_list is None:
        raise ValueError("Missing slide list in PowerPoint")
    relationships = etree.fromstring(zip_file.read("ppt/_rels/presentation.xml.rels"))
    rid_to_part = {}
    for element in relationships:
        rid = element.get("Id")
        target = element.get("Target", "")
        if target.startswith("/"):
            rid_to_part[rid] = target.lstrip("/")
        else:
            rid_to_part[rid] = posixpath.normpath(posixpath.join("ppt", target))
    return list(slide_list), rid_to_part


def text_for_slide(zip_file: ZipFile, part: str) -> str:
    root = etree.fromstring(zip_file.read(part))
    values = [value.strip() for value in root.xpath('//*[local-name()="t"]/text()')]
    return "\n".join(value for value in values if value)


def reorder_presentation(xml: bytes, index: int) -> bytes:
    root = etree.fromstring(xml)
    slide_list = root.find("{http://schemas.openxmlformats.org/presentationml/2006/main}sldIdLst")
    assert slide_list is not None
    children = list(slide_list)
    slide_list.remove(children[index])
    slide_list.insert(0, children[index])
    return etree.tostring(root, xml_declaration=True, encoding="UTF-8", standalone=True)


def temporary_pptx(source: Path, target: Path, index: int) -> None:
    """Copy ZIP entries byte-for-byte at the content level except ordering XML."""
    with ZipFile(source) as original, ZipFile(target, "w") as output:
        for item in original.infolist():
            data = original.read(item.filename)
            if item.filename == "ppt/presentation.xml":
                data = reorder_presentation(data, index)
            output.writestr(item, data)


def png_size(path: Path) -> tuple[int, int]:
    with path.open("rb") as stream:
        header = stream.read(24)
    if header[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError(f"Quick Look did not produce a PNG: {path}")
    return struct.unpack(">II", header[16:24])


def render_one(source: Path, number: int, size: int, output: Path) -> tuple[int, int]:
    with tempfile.TemporaryDirectory(prefix=f"melooloo-slide-{number:02d}-") as temp_name:
        temp = Path(temp_name)
        reordered = temp / f"marketing_slide_{number:02d}.pptx"
        temporary_pptx(source, reordered, number - 1)
        preview_dir = temp / "preview"
        preview_dir.mkdir()
        proc = subprocess.run(
            ["qlmanage", "-t", "-s", str(size), "-o", str(preview_dir), str(reordered)],
            capture_output=True,
            text=True,
            timeout=120,
            check=False,
        )
        previews = list(preview_dir.glob("*.png"))
        if proc.returncode != 0 or len(previews) != 1:
            raise RuntimeError(f"Quick Look failed on slide {number}: {proc.stdout}\n{proc.stderr}")
        dimensions = png_size(previews[0])
        if dimensions[0] < 2000 or abs(dimensions[0] / dimensions[1] - 16 / 9) > 0.015:
            raise ValueError(f"Unexpected slide {number} dimensions: {dimensions}")
        output.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(previews[0], output)
        return dimensions


def make_contact(entries: list[dict], name: str) -> None:
    thumb_w, thumb_h, label_h, columns = 360, 203, 31, 4
    rows = (len(entries) + columns - 1) // columns
    canvas = Image.new("RGB", (columns * thumb_w, rows * (thumb_h + label_h)), "#e9eee8")
    draw = ImageDraw.Draw(canvas)
    font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 15)
    for i, entry in enumerate(entries):
        col, row = i % columns, i // columns
        x, y = col * thumb_w, row * (thumb_h + label_h)
        image = Image.open(HERE / entry["image"])
        image = ImageOps.fit(image.convert("RGB"), (thumb_w, thumb_h))
        canvas.paste(image, (x, y))
        label = f'{entry["source"]:02d}  {entry["title"]}'
        draw.text((x + 8, y + thumb_h + 5), label[:41], font=font, fill="#163f2b")
    dest = HERE / "qa" / f"{name}-contact.jpg"
    dest.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(dest, "JPEG", quality=88, optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", nargs="?", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--size", type=int, default=2400, help="Quick Look width in pixels (default: 2400)")
    parser.add_argument("--start", type=int, default=1)
    parser.add_argument("--end", type=int, default=51)
    parser.add_argument("--manifest-only", action="store_true", help="Rebuild metadata and contact sheets from existing PNGs")
    args = parser.parse_args()
    source = args.source.expanduser().resolve()
    if not source.is_file():
        parser.error(f"Source not found: {source}")
    if not (1 <= args.start <= args.end <= 51):
        parser.error("Expected 1 <= --start <= --end <= 51")
    sha256 = hashlib.sha256(source.read_bytes()).hexdigest()
    rel_attr = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"
    with ZipFile(source) as archive:
        slide_ids, rid_to_part = source_order(archive)
        if len(slide_ids) != 51 or len(TITLES) != 51:
            raise ValueError(f"Expected 51 slides and titles; found {len(slide_ids)} and {len(TITLES)}")
        all_entries = []
        for number, slide_id in enumerate(slide_ids, 1):
            part = rid_to_part[slide_id.get(rel_attr)]
            all_entries.append({
                "source": number,
                "title": TITLES[number - 1],
                "image": f"slides/slide-{number:02d}.png",
                "text": text_for_slide(archive, part),
            })

    dimensions: dict[int, tuple[int, int]] = {}
    for number in range(args.start, args.end + 1):
        target = HERE / "slides" / f"slide-{number:02d}.png"
        dimensions[number] = png_size(target) if args.manifest_only else render_one(source, number, args.size, target)
        print(f"{'Checked' if args.manifest_only else 'Rendered'} slide {number:02d}/51  {dimensions[number][0]}x{dimensions[number][1]}  {target.stat().st_size:,} bytes", flush=True)

    if args.start == 1 and args.end == 51:
        manifest = {
            "sourceFile": source.name,
            "sourceSha256": sha256,
            "renderer": "macOS Quick Look at 2400 px; first-slide reorder in temporary PPTX",
            "main": all_entries[:21],
            "backup": all_entries[21:],
        }
        (HERE / "manifest.js").write_text(
            "// Generated by render.py from the unmodified source PPTX.\n"
            "window.MELOOLOO_ORIGINAL_MARKETING = "
            + json.dumps(manifest, ensure_ascii=False, separators=(",", ":"))
            + ";\n",
            encoding="utf-8",
        )
        (HERE / "manifest.json").write_text(
            json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        make_contact(all_entries[:21], "main")
        make_contact(all_entries[21:], "backup")
        print(f"Verified {len(all_entries)} source slides; SHA-256 {sha256}", flush=True)
        print("Main: 1–21 | Backup index: 22 | Backup detail: 23–51", flush=True)


if __name__ == "__main__":
    main()
