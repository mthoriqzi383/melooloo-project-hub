#!/usr/bin/env python3
"""Review a team draft and optionally stage approved text edits locally.

Usage:
  python3 review_slide_draft.py team-draft.json
  python3 review_slide_draft.py team-draft.json --approve

Approval updates published-edits.js in this folder. It never pushes the website.
"""
import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
APPROVED = ROOT / "published-edits.js"
PREFIX = "/* Reviewed edits are added here by the publishing script. */\nwindow.MELOOLOO_PUBLISHED_EDITS = "
MARKETING_PAGES = set(range(67, 88)) - {75, 76}
DISPLAY_ORDER = [*range(1, 8), *sorted(MARKETING_PAGES), *range(20, 45), *range(47, 67)]
DISPLAY_INDEX = {number: index + 1 for index, number in enumerate(DISPLAY_ORDER)}
VALID_PAGES = set(DISPLAY_ORDER)
SUPPORTED_DECKS = {
    "Melooloo Final Presentation 60",
    "Melooloo Final Presentation 66",
    "Melooloo Final Presentation 73",
    "Melooloo Final Presentation 71",
}


def read_approved():
    contents = APPROVED.read_text(encoding="utf-8")
    match = re.search(r"window\.MELOOLOO_PUBLISHED_EDITS\s*=\s*(\{.*\})\s*;\s*$", contents, re.S)
    if not match:
        raise ValueError("Published edits file has an unexpected format")
    return json.loads(match.group(1))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("draft", type=Path)
    parser.add_argument("--approve", action="store_true", help="Stage reviewed edits locally; does not publish to the web")
    args = parser.parse_args()
    if args.draft.stat().st_size > 2_000_000:
        parser.error("Draft exceeds 2 MB")
    draft = json.loads(args.draft.read_text(encoding="utf-8"))
    if draft.get("schema") != 1 or draft.get("deck") not in SUPPORTED_DECKS or not isinstance(draft.get("slides"), dict):
        parser.error("This is not a Melooloo slide draft")
    published = read_approved()
    proposed = json.loads(json.dumps(published))
    proposed.setdefault("slides", {})
    conflicts = []
    count = 0
    print(f"Draf: {args.draft.name} | Penyunting: {draft.get('author') or '(tidak diisi)'}")
    for number, slide in sorted(draft["slides"].items(), key=lambda item: int(item[0]) if item[0].isdigit() else 999):
        if not number.isdigit() or int(number) not in VALID_PAGES or not isinstance(slide, dict):
            conflicts.append(f"Invalid slide: {number}")
            continue
        text = slide.get("text", {})
        if not isinstance(text, dict):
            conflicts.append(f"Slide {number}: text is invalid")
            continue
        label = f"SLIDE {number}"
        if int(number) in MARKETING_PAGES:
            label += f" · tayang {DISPLAY_INDEX[int(number)]} · PowerPoint pemasaran {int(number) - 66}"
        if slide.get("note"):
            print(f"\n{label} · CATATAN: {str(slide['note'])[:2000]}")
        if int(number) in MARKETING_PAGES and text:
            conflicts.append(f"Slide {number}: original marketing slides accept reviewer notes only")
            continue
        for position, patch in sorted(text.items(), key=lambda item: int(item[0]) if item[0].isdigit() else 999):
            if not position.isdigit() or not 0 <= int(position) <= 500 or not isinstance(patch, dict):
                conflicts.append(f"Slide {number}: invalid position {position}")
                continue
            base, value, expected = patch.get("base"), patch.get("value"), patch.get("from")
            if not all(isinstance(part, str) for part in (base, value, expected)) or not value.strip() or len(value) > 2000 or len(base) > 2000:
                conflicts.append(f"Slide {number}, text {position}: invalid value")
                continue
            current = proposed["slides"].get(number, {}).get("text", {}).get(position, {"base": base, "value": base})
            if current.get("base") != base or current.get("value") != expected:
                conflicts.append(f"Slide {number}, text {position}: public version changed after this draft")
                continue
            print(f"\nSLIDE {number} · TEKS {int(position)+1}\n  OLD: {expected}\n  NEW: {value}")
            proposed["slides"].setdefault(number, {"text": {}})["text"][position] = {"base": base, "value": value}
            count += 1
    print(f"\n{count} perubahan teks, {len(conflicts)} konflik.")
    for problem in conflicts:
        print(f"CONFLICT: {problem}", file=sys.stderr)
    if conflicts:
        return 2
    if args.approve:
        if count == 0:
            print("Tidak ada perubahan teks untuk diterbitkan.")
            return 0
        index = ROOT / "index.html"
        html = index.read_text(encoding="utf-8")
        updated = re.sub(r'published-edits\.js\?v=[^"\']+',
                         'published-edits.js?v=' + datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S'), html)
        if updated == html:
            raise ValueError("Could not update the published edit version in index.html")
        APPROVED.write_text(PREFIX + json.dumps(proposed, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
        index.write_text(updated, encoding="utf-8")
        print(f"Disiapkan di {APPROVED}. Tinjau diff dan pratinjau sebelum push.")
    else:
        print("Mode tinjau saja. Gunakan --approve setelah konten disetujui.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
