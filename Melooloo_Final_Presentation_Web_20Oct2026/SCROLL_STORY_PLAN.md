# Melooloo scrolling presentation — editorial plan

## Purpose

Create a continuous, presentation-ready reading experience from the 66-page source. The existing page-by-page player and editable PowerPoint remain the detailed references. The scrolling edition reorders and groups the evidence; it is not a transcript.

## Source hierarchy

1. For finance, use the later **MELOOLOO – Financial Strategy (Mery)** material already transcribed in `finance-data.js` and source pages 53–64. The older July BP workbook, chapter guides, and Canva financial pages contain different scenarios and must not silently supply replacement figures.
2. For operations and people, use the revised source pages 27–52, with the original 66-page source in `slides-data.js` as detail. Headcount source totals require reconciliation with its role rows; the SDM payroll table and finance OPEX classify labor differently.
3. For market and marketing, use pages 3–19. The current finance material supersedes the older Y1 revenue and marketing budget shown on Canva pages 8 and 17.
4. Rooftop imagery and location are **concept visuals and a proposed site**, not evidence of approved structural capacity, lease rights, or final roof placement.

## Story architecture

| Web chapter | Source pages | Visual device | What the audience should understand |
| --- | --- | --- | --- |
| Opening | 1–2, 65–66 | full-bleed roof image, restrained word reveal | The business proposition and what is proposed |
| Opportunity | 3–5 | demand/supply range composition, five-force highlight | The premium market gap is an estimate; buyer power is the strongest force |
| Business model | 6–7 | complete BMC image plus nine labeled cells | The value proposition, activities and revenue paths form one system |
| Market and brand | 8–19 | TAM→SAM→SOM, product photography, five-channel selector | The premium customer, price architecture and activation path |
| One greenhouse | 20–32 | sticky, scroll-led image sequence and sensor/actuator labels | How a 200 m² module works, including what stays manual |
| Repeatable production | 33–47 | animated production line, nursery→grow→clean timeline | How 35 GH could scale to 237 GH under the current scenario |
| People | 48–52 and 2 | headcount growth and authentic portraits | Who must run the system; unknown portraits remain blank |
| Finance | 53–64 | accessible metric-switch chart, investment split, scenario comparison | The initial funding, forecast, narrow Y1 BEP margin, valuation and risks |
| Decision | 64–66 | three risk statements and links to complete evidence | GO is conditional on the current financial model and mitigations |

## Motion rules

- Motion explains sequence or change: a reader-controlled greenhouse sequence; charts reveal data; chapter progress tracks position.
- Keep copy visible without animation. Use transform/opacity and SVG stroke reveal, plus `IntersectionObserver`; avoid running expensive work every scroll frame.
- Respect `prefers-reduced-motion`; all content and controls remain usable without animation.
- Avoid looped decorations, artificial dashboards, and floating UI that competes with the evidence.

## Audience controls

- Fixed chapter index with direct links; scroll progress; chart mode buttons; five-channel selector.
- Each chapter links back to relevant original pages. Full 3D facility, editable PowerPoint and slide player remain reachable.
- Mobile design uses the same narrative in a single column, with fewer sticky effects.

## Design basis

Editorial field report: dark pine, warm paper, one acid-green accent; oversized typographic arguments, varied image crops, fine rules and generous space. Photographic/3D concept assets already held in this project are reused with appropriate concept labels.

## Motion implementation references

- [Chrome: Scroll-driven animations](https://developer.chrome.com/docs/css-ui/scroll-driven-animations/) informed the reader-controlled progress and sequence. The page uses a light JavaScript fallback for consistent behavior across browsers.
- [MDN: Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) informed chapter activation, image sequence changes, and one-time reveal triggers.
- [MDN: `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion) and [W3C: Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions) informed the reduced-motion path: all information and controls work without motion.
