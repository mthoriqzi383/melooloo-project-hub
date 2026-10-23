#!/usr/bin/env python3
"""Render focused marketing revisions without changing the supplied PPTX.

The source slides are edited as PowerPoint objects in a temporary copy. This
preserves the original photography, typography, and all other source slides.
"""

from __future__ import annotations

import copy
import tempfile
from pathlib import Path
from zipfile import ZipFile

from lxml import etree

from sys import path as python_path

HERE = Path(__file__).resolve().parent
MARKETING = HERE.parent / "marketing-original"
python_path.insert(0, str(MARKETING))
from render import render_one  # noqa: E402


SOURCE = Path.home() / "Downloads/Melooloo_Strategi_Pemasaran_v3_23Okt2026.pptx"
P = "http://schemas.openxmlformats.org/presentationml/2006/main"
A = "http://schemas.openxmlformats.org/drawingml/2006/main"
R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
PKG = "http://schemas.openxmlformats.org/package/2006/relationships"
NS = {"p": P, "a": A}


def object_by_id(root: etree._Element, object_id: int) -> etree._Element:
    matches = root.xpath(
        f'./p:cSld/p:spTree/*[p:nvSpPr/p:cNvPr/@id="{object_id}" '
        f'or p:nvPicPr/p:cNvPr/@id="{object_id}"]',
        namespaces=NS,
    )
    if len(matches) != 1:
        raise ValueError(f"Expected one PowerPoint object with ID {object_id}")
    return matches[0]


def move_y(obj: etree._Element, y: int) -> None:
    off = obj.find(f".//{{{A}}}xfrm/{{{A}}}off")
    if off is None:
        raise ValueError("Object has no position")
    off.set("y", str(y))


def resize_height(obj: etree._Element, height: int) -> None:
    ext = obj.find(f".//{{{A}}}xfrm/{{{A}}}ext")
    if ext is None:
        raise ValueError("Object has no size")
    ext.set("cy", str(height))


def replace_text(obj: etree._Element, old: str, new: str) -> None:
    runs = obj.findall(f".//{{{A}}}t")
    current = "".join(run.text or "" for run in runs)
    if current != old:
        raise ValueError(f"Expected {old!r}, found {current!r}")
    runs[0].text = new
    for run in runs[1:]:
        run.text = ""


def revise_b2c(source: ZipFile) -> tuple[bytes, bytes]:
    slide = etree.fromstring(source.read("ppt/slides/slide4.xml"))
    users_slide = etree.fromstring(source.read("ppt/slides/slide51.xml"))
    relationships = etree.fromstring(source.read("ppt/slides/_rels/slide4.xml.rels"))
    tree = slide.find(f"{{{P}}}cSld/{{{P}}}spTree")
    assert tree is not None

    # Four rows fit in the original green card. The third label wraps to two
    # lines, so the fourth is spaced farther below it.
    positions = {24: 4_080_000, 25: 4_080_000,
                 26: 4_620_000, 27: 4_620_000,
                 28: 5_160_000, 29: 5_160_000}
    for object_id, y in positions.items():
        move_y(object_by_id(slide, object_id), y)

    # Reuse the matching users icon already present in the source deck.
    users = copy.deepcopy(object_by_id(users_slide, 8))
    icon_info = users.find(f"{{{P}}}nvPicPr/{{{P}}}cNvPr")
    assert icon_info is not None
    icon_info.set("id", "35")
    icon_info.set("name", "s2_ic_wellness")
    icon_info.set("descr", "users")
    move_y(users, 5_735_000)
    off = users.find(f"{{{P}}}spPr/{{{A}}}xfrm/{{{A}}}off")
    ext = users.find(f"{{{P}}}spPr/{{{A}}}xfrm/{{{A}}}ext")
    assert off is not None and ext is not None
    off.set("x", "9285503")
    ext.set("cx", "347472")
    ext.set("cy", "347472")
    blip = users.find(f".//{{{A}}}blip")
    assert blip is not None
    blip.set(f"{{{R}}}embed", "rId11")

    wellness = copy.deepcopy(object_by_id(slide, 25))
    label_info = wellness.find(f"{{{P}}}nvSpPr/{{{P}}}cNvPr")
    assert label_info is not None
    label_info.set("id", "36")
    label_info.set("name", "s2_t_wellness")
    move_y(wellness, 5_735_000)
    values = wellness.findall(f".//{{{A}}}t")
    assert len(values) == 1
    values[0].text = "Wellness Community"

    anchor = object_by_id(slide, 29)
    insert_at = tree.index(anchor) + 1
    tree.insert(insert_at, users)
    tree.insert(insert_at + 1, wellness)

    relation = etree.Element(f"{{{PKG}}}Relationship")
    relation.set("Id", "rId11")
    relation.set("Type", f"{R}/image")
    relation.set("Target", "../media/image-51-1.png")
    relationships.append(relation)
    return (
        etree.tostring(slide, xml_declaration=True, encoding="UTF-8", standalone=True),
        etree.tostring(relationships, xml_declaration=True, encoding="UTF-8", standalone=True),
    )


def revise_pricing(source: ZipFile) -> bytes:
    slide = etree.fromstring(source.read("ppt/slides/slide13.xml"))
    for object_id in (23, 24):
        obj = object_by_id(slide, object_id)
        obj.getparent().remove(obj)
    return etree.tostring(slide, xml_declaration=True, encoding="UTF-8", standalone=True)


def revise_kpis(source: ZipFile) -> bytes:
    slide = etree.fromstring(source.read("ppt/slides/slide42.xml"))
    tables = slide.xpath(".//p:graphicFrame//a:tbl", namespaces=NS)
    if len(tables) != 1:
        raise ValueError("Expected one KPI table")
    rows = tables[0].findall(f"{{{A}}}tr")
    last_text = "|".join(rows[-1].xpath(".//a:t/text()", namespaces=NS))
    if last_text != "Hari diskon pada buah bersegel|0|0|—":
        raise ValueError(f"Unexpected final KPI row: {last_text}")
    tables[0].remove(rows[-1])
    return etree.tostring(slide, xml_declaration=True, encoding="UTF-8", standalone=True)


def revise_segments(source: ZipFile) -> bytes:
    slide = etree.fromstring(source.read("ppt/slides/slide46.xml"))
    tree = slide.find(f"{{{P}}}cSld/{{{P}}}spTree")
    assert tree is not None
    replace_text(
        object_by_id(slide, 3),
        "Tiga pembeli B2B dan tiga sub-segmen B2C, dengan target utama yang jelas",
        "Tiga pembeli B2B dan empat kelompok B2C, dengan target utama yang jelas",
    )
    replace_text(
        object_by_id(slide, 33),
        "Health-Conscious Urban, dijangkau lewat komunitas",
        "Health-Conscious Urban",
    )
    replace_text(
        object_by_id(slide, 35),
        "Pendukung; komunitas menjadi saluran akuisisi utama",
        "Pendukung",
    )
    replace_text(
        object_by_id(slide, 36),
        "Sumber: Tabel 4.2, 4.4, 4.5, hlm. 38–44.",
        "Sumber: Tabel 4.2, 4.4, 4.5, 4.24; paper hlm. 38–44, 80.",
    )

    # The original three B2C rows use the full height of the card. Four
    # shorter rows retain the two-column composition and original typefaces.
    starts = (2_170_000, 3_140_000, 4_110_000, 5_080_000)
    rows = (
        (23, 24, 25, 27),
        (28, 29, 30, 31),
        (32, 33, 34, 35),
    )
    for start, (box_id, label_id, body_id, status_id) in zip(starts, rows):
        box = object_by_id(slide, box_id)
        move_y(box, start)
        resize_height(box, 900_000)
        label = object_by_id(slide, label_id)
        move_y(label, start)
        resize_height(label, 900_000)
        body = object_by_id(slide, body_id)
        move_y(body, start + 45_000)
        resize_height(body, 515_000)
        status = object_by_id(slide, status_id)
        move_y(status, start + 620_000)
        resize_height(status, 275_000)

    # The first segment alone has a green status dot.
    move_y(object_by_id(slide, 26), starts[0] + 676_000)

    wellness = (
        (32, 38, "s2_sh_wellness", None),
        (33, 39, "s2_t_wellness", "Wellness Community"),
        (34, 40, "s2_t_wellness_desc", "Anggota studio pilates, yoga, klub lari, dan padel; aktivitas komunitas dan langganan"),
        (35, 41, "s2_t_wellness_status", "Pendukung"),
    )
    anchor = object_by_id(slide, 35)
    insert_at = tree.index(anchor) + 1
    for source_id, new_id, name, new_text in wellness:
        obj = copy.deepcopy(object_by_id(slide, source_id))
        info = obj.find(f"{{{P}}}nvSpPr/{{{P}}}cNvPr")
        assert info is not None
        info.set("id", str(new_id))
        info.set("name", name)
        start = starts[3]
        if source_id in (32, 33):
            move_y(obj, start)
        elif source_id == 34:
            move_y(obj, start + 45_000)
        else:
            move_y(obj, start + 620_000)
        if new_text is not None:
            existing = "".join(node.text or "" for node in obj.findall(f".//{{{A}}}t"))
            replace_text(obj, existing, new_text)
        tree.insert(insert_at, obj)
        insert_at += 1
    return etree.tostring(slide, xml_declaration=True, encoding="UTF-8", standalone=True)


def main() -> None:
    if not SOURCE.is_file():
        raise FileNotFoundError(SOURCE)
    with tempfile.TemporaryDirectory(prefix="melooloo-marketing-revised-") as temp_dir:
        revised_pptx = Path(temp_dir) / "marketing-revised.pptx"
        with ZipFile(SOURCE) as original, ZipFile(revised_pptx, "w") as revised:
            slide4, slide4_relationships = revise_b2c(original)
            slide13 = revise_pricing(original)
            slide42 = revise_kpis(original)
            slide46 = revise_segments(original)
            updates = {
                "ppt/slides/slide4.xml": slide4,
                "ppt/slides/_rels/slide4.xml.rels": slide4_relationships,
                "ppt/slides/slide13.xml": slide13,
                "ppt/slides/slide42.xml": slide42,
                "ppt/slides/slide46.xml": slide46,
            }
            for entry in original.infolist():
                revised.writestr(entry, updates.get(entry.filename, original.read(entry.filename)))

        for number in (4, 13, 42, 46):
            output = HERE / f"slide-{number:02d}.png"
            dimensions = render_one(revised_pptx, number, 2400, output)
            print(f"Rendered {output.name}: {dimensions[0]}x{dimensions[1]}")


if __name__ == "__main__":
    main()
