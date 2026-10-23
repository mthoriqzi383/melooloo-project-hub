# Original marketing slides

These are faithful static renders of the user supplied `Melooloo_Strategi_Pemasaran_v3_23Okt2026.pptx`. Slides 1–21 are the main presentation. Slide 22 is the backup index; slides 23–51 are backup material for questions.

The source PPTX is not changed or published here. To regenerate on macOS, place it in `~/Downloads` and run:

```bash
python3 marketing-original/render.py ~/Downloads/Melooloo_Strategi_Pemasaran_v3_23Okt2026.pptx
```

The script uses Quick Look to render the first slide of a temporary PPTX. It moves each source slide to the first position in turn, preserving all slide content and relationships. It writes 51 full-size PNGs, `manifest.js`, `manifest.json`, and two review contact sheets. Each PNG is 2400 × 1354 pixels, approximately 16:9. The manifest includes the source SHA-256 to identify the exact deck used. Its `image` paths are relative to this folder; a page in the parent presentation folder should prefix them with `marketing-original/`.

To rebuild the manifest and contact sheets without re-rendering existing PNGs, add `--manifest-only`.

Quick Look captures the slide's static appearance. PowerPoint transitions, animations, playable media, text selection, and editability are not preserved in the PNGs. The original PPTX remains the editable source. The slides retain their original placeholders and source footnotes.
