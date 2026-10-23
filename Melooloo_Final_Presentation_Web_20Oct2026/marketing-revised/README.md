# Marketing slide revisions

Most assets are rendered from temporary copies of the supplied `Melooloo_Strategi_Pemasaran_v3_23Okt2026.pptx`. Slide 2.1 uses its separate revised PowerPoint. The `marketing-original/` archive remains unchanged.

- `slide-04.png`: adds **Wellness Community** as the fourth B2C category, using the source deck's people icon.
- `slide-07-v2.png`: replaces marketing slide 2.1 with the supplied `Melooloo_Slide_2.1_Peta_Persaingan_v2_23Okt2026.pptx`. It is a direct 2400-pixel Quick Look render of the single-slide PowerPoint; its searchable transcript comes from that file. The competition taste scores remain labeled as team hypotheses in the slide.
- `slide-13.png`: removes the **0 hari diskon pada buah bersegel** badge and its circle, revealing the original packaging photos beneath it.
- `slide-42.png`: removes the **Hari diskon pada buah bersegel** row from the backup KPI table.
- `slide-46.png`: adds **Wellness Community** as the fourth B2C group in the backup segment table.

The surviving main marketing slides use the approved presentation titles. `build_titles.py` updates only their native PowerPoint title text before rendering; it also preserves the category and pricing revisions on slides 4 and 13 and removes the cover's presenter placeholder. Slides 15 and 19 are rendered to `title-base-slide-15.png` and `title-base-slide-19.png`, which `build-chart-slides.mjs` uses beneath the restored charts.

On the owner's Mac, with the source PowerPoint in `~/Downloads/`, regenerate in this order:

1. `python3 build.py` for backup slides 42 and 46.
2. `python3 build_titles.py` for all surviving main slide PNGs and the title bases for 15 and 19.
3. `node build-chart-slides.mjs` for the chart composites.

To regenerate the slide 2.1 replacement, call `render_one()` from `marketing-original/render.py` with the supplied single-slide PowerPoint, slide number `1`, size `2400`, and output `marketing-revised/slide-07-v2.png`.
