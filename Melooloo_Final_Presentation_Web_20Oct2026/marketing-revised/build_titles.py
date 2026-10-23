#!/usr/bin/env python3
"""Render marketing slides with the approved, presentation-ready titles.

Only the surviving main slides are rendered. The original PPTX and the
marketing-original archive are never changed. Previously approved content
revisions to slides 4 and 13 are applied in the same temporary PPTX.
"""

from __future__ import annotations

import argparse
import tempfile
from pathlib import Path
from zipfile import ZipFile

from lxml import etree

from build import A, HERE, P, SOURCE, revise_b2c, revise_pricing
from render import render_one


TITLES = {
    1: ("strategipemasaran", "Strategi Pemasaran"),
    3: ("Pembeli sudah membeli melon premium, tetapi tidak ada yang menjamin rasanya", "Kualitas Rasa Melon Premium Belum Terjamin"),
    4: ("Pembeli kami: B2B 68% volume Tahun 1, B2C 32%", "Segmentasi dan Target Pasar"),
    5: ("Kami hanya perlu 4–6% pasar premium DKI di Tahun 1", "Estimasi Ukuran Pasar (TAM, SAM, SOM)"),
    7: ("Satu-satunya pemasok premium di dalam Jakarta", "Peta Persaingan dan Posisi Melooloo"),
    8: ("Pembedanya bisa diperiksa sendiri oleh pembeli", "Point of Parity dan Point of Difference"),
    12: ("Harga 14–17 kali di bawah Crown Melon", "Strategi Harga dan Perbandingan Pasar"),
    13: ("Satu format untuk satu kanal", "Format Produk per Kanal"),
    14: ("B2B mengunci volume sejak Tahun 0, mengikuti jadwal panen", "Strategi Masuk Pasar Tahun 0–1"),
    15: ("B2C menjadi 60% volume di Tahun 5", "Bauran Kanal Distribusi Tahun 1–10"),
    16: ("Anggaran komunikasi terbesar untuk pengalaman, karena pembeli harus mencicipi sebelum percaya", "Komunikasi Pemasaran Terpadu (IMC) Tahun 1"),
    17: ("Kami siap diukur di tiga tahap perjalanan pelanggan", "Sasaran Pemasaran per Tahap Perjalanan Pelanggan"),
    19: ("Pemasaran hemat: ±6% pendapatan, di bawah tolok ukur", "Anggaran Pemasaran terhadap Pendapatan"),
    20: ("Terkendali: tiga rem sebelum anggaran dan ekspansi berjalan", "Mekanisme Pengendalian Anggaran dan Ekspansi"),
    21: ("Premium. Local. Consistent.", "Ringkasan Strategi Pemasaran"),
}

NS = {"p": P, "a": A}


def retitle(xml: bytes, old: str, new: str) -> bytes:
    root = etree.fromstring(xml)
    shapes = [
        shape for shape in root.xpath(".//p:sp", namespaces=NS)
        if "".join(shape.xpath(".//a:t/text()", namespaces=NS)) == old
    ]
    if len(shapes) != 1:
        raise ValueError(f"Expected one title shape for {old!r}; found {len(shapes)}")
    runs = shapes[0].findall(f".//{{{A}}}t")
    if old == "strategipemasaran":
        # Preserve the cover's two-line composition and each run's styling.
        if len(runs) != 2:
            raise ValueError("Expected two cover title runs")
        runs[0].text, runs[1].text = "Strategi", "Pemasaran"
    else:
        runs[0].text = new
        for run in runs[1:]:
            run.text = ""
    return etree.tostring(root, xml_declaration=True, encoding="UTF-8", standalone=True)


def remove_cover_placeholder(xml: bytes) -> bytes:
    root = etree.fromstring(xml)
    shapes = [
        shape for shape in root.xpath(".//p:sp", namespaces=NS)
        if "".join(shape.xpath(".//a:t/text()", namespaces=NS))
        == "[NAMA PRESENTER]  ·  [peran di tim]"
    ]
    if len(shapes) != 1:
        raise ValueError(f"Expected one cover presenter placeholder; found {len(shapes)}")
    shapes[0].getparent().remove(shapes[0])
    return etree.tostring(root, xml_declaration=True, encoding="UTF-8", standalone=True)


def revise_imc_label(xml: bytes) -> bytes:
    root = etree.fromstring(xml)
    labels = root.xpath(".//a:t[text()='Pengalaman   ']", namespaces=NS)
    if len(labels) != 1:
        raise ValueError(f"Expected one IMC label; found {len(labels)}")
    labels[0].text = "Experiences   "
    return etree.tostring(root, xml_declaration=True, encoding="UTF-8", standalone=True)


def main(only_slide: int | None = None) -> None:
    if not SOURCE.is_file():
        raise FileNotFoundError(SOURCE)
    with tempfile.TemporaryDirectory(prefix="melooloo-marketing-titles-") as temp_name:
        revised_pptx = Path(temp_name) / "marketing-title-revised.pptx"
        with ZipFile(SOURCE) as original, ZipFile(revised_pptx, "w") as revised:
            slide4, slide4_relationships = revise_b2c(original)
            updates = {
                "ppt/slides/slide4.xml": slide4,
                "ppt/slides/_rels/slide4.xml.rels": slide4_relationships,
                "ppt/slides/slide13.xml": revise_pricing(original),
            }
            for number, (old, new) in TITLES.items():
                part = f"ppt/slides/slide{number}.xml"
                updates[part] = retitle(updates.get(part, original.read(part)), old, new)
            updates["ppt/slides/slide16.xml"] = revise_imc_label(updates["ppt/slides/slide16.xml"])
            updates["ppt/slides/slide1.xml"] = remove_cover_placeholder(updates["ppt/slides/slide1.xml"])
            for entry in original.infolist():
                revised.writestr(entry, updates.get(entry.filename, original.read(entry.filename)))

        for number in ([only_slide] if only_slide is not None else TITLES):
            filename = f"slide-{number:02d}.png"
            if number in (15, 19):
                output = HERE / f"title-base-{filename}"
            elif number == 16:
                output = HERE / "slide-16-v2.png"
            else:
                output = HERE / filename
            dimensions = render_one(revised_pptx, number, 2400, output)
            print(f"Rendered {output.name}: {dimensions[0]}x{dimensions[1]}", flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--slide", type=int, choices=sorted(TITLES), help="Render only one surviving main slide")
    main(parser.parse_args().slide)
