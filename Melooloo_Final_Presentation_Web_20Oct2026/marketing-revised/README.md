# Marketing slide revisions

Most assets are rendered from temporary copies of the supplied `Melooloo_Strategi_Pemasaran_v3_23Okt2026.pptx`. Slide 2.1 uses its separate revised PowerPoint. The `marketing-original/` archive remains unchanged.

- `slide-04.png`: adds **Wellness Community** as the fourth B2C category, using the source deck's people icon.
- `slide-07-v2.png`: replaces marketing slide 2.1 with the supplied `Melooloo_Slide_2.1_Peta_Persaingan_v2_23Okt2026.pptx`. It is a direct 2400-pixel Quick Look render of the single-slide PowerPoint; its searchable transcript comes from that file. The competition taste scores remain labeled as team hypotheses in the slide.
- `slide-08-v2.svg`: replaces the phone illustration on slide 2.2 with a clearer QR traceability screen. `build-phone-slide.mjs` composes it over the titled source render. The sample values match `trace-demo.html`; garden location and residue results remain unavailable in the demo.
- `slide-08-v3.png`: direct render of the supplied `Melooloo_Slide_2.2_PoP_PoD_v2_23Okt2026.pptx`. `slide-08-v3.svg` uses that render for the revised PoP/PoD details and keeps the clearer traceability phone from v2. Regenerate with `node build-phone-slide.mjs slide-08-v3.png slide-08-v3.svg`.
- `slide-12-v2.png`: direct 2400-pixel Quick Look render of the supplied `Melooloo_Slide_3.1_Tangga_Harga_23Okt2026.pptx`, replacing the previous price ladder. Its searchable transcript and navigation title follow the new PowerPoint.
- `slide-13.png`: removes the **0 hari diskon pada buah bersegel** badge and its circle, revealing the original packaging photos beneath it.
- `slide-16-v2.png`: changes the IMC category label from **Pengalaman** to **Experiences** while retaining its original PowerPoint styling.
- `slide-42.png`: removes the **Hari diskon pada buah bersegel** row from the backup KPI table.
- `slide-46.png`: adds **Wellness Community** as the fourth B2C group in the backup segment table.

The surviving main marketing slides use the approved presentation titles. `build_titles.py` updates only their native PowerPoint title text before rendering; it also preserves the category and pricing revisions on slides 4 and 13 and removes the cover's presenter placeholder. Slides 15 and 19 are rendered to `title-base-slide-15.png` and `title-base-slide-19.png`, which `build-chart-slides.mjs` uses beneath the restored charts.

On the owner's Mac, with the source PowerPoint in `~/Downloads/`, regenerate in this order:

1. `python3 build.py` for backup slides 42 and 46.
2. `python3 build_titles.py` for all surviving main slide PNGs and the title bases for 15 and 19. Use `python3 build_titles.py --slide 16` to regenerate only the IMC slide.
3. `node build-chart-slides.mjs` for the chart composites.
4. `node build-phone-slide.mjs` for slide 2.2, after `slide-08.png` is rendered.

To regenerate the slide 2.1 replacement, call `render_one()` from `marketing-original/render.py` with the supplied single-slide PowerPoint, slide number `1`, size `2400`, and output `marketing-revised/slide-07-v2.png`.
Use the same call with `Melooloo_Slide_3.1_Tangga_Harga_23Okt2026.pptx` for `marketing-revised/slide-12-v2.png`.
