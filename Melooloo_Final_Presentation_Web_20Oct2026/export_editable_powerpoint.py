"""Rebuild the 66-slide HTML deck as editable PowerPoint objects.

Text, cards, bars, lines, markers, borders, and diagram labels become native
PowerPoint objects. Photographs and brand artwork remain separate replaceable
image objects. Source figures on pages 7, 12, and 13 are redrawn as native
PowerPoint diagrams so those pages do not depend on flattened slide images.
"""

from __future__ import annotations

import argparse
import json
import math
import re
import tempfile
from pathlib import Path
from urllib.parse import unquote, urlparse

from PIL import Image, ImageOps
from playwright.sync_api import sync_playwright
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_CONNECTOR, MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, MSO_AUTO_SIZE, PP_ALIGN
from pptx.oxml.xmlchemy import OxmlElement
from pptx.util import Inches, Pt


HERE = Path(__file__).resolve().parent
REPO = HERE.parent
PUBLIC_URL = (
    "https://mthoriqzi383.github.io/melooloo-project-hub/"
    "Melooloo_Final_Presentation_Web_20Oct2026/index.html"
)
SLIDE_W = 13.333333
SLIDE_H = 7.5

EXTRACT = r"""() => {
  const root = document.querySelector('.story-canvas');
  const base = root.getBoundingClientRect();
  const out = [];
  const visible = e => {
    const c = getComputedStyle(e), r = e.getBoundingClientRect();
    return c.display !== 'none' && c.visibility !== 'hidden' && Number(c.opacity) > .005 &&
      r.width > .5 && r.height > .5 && r.right > base.left && r.left < base.right &&
      r.bottom > base.top && r.top < base.bottom;
  };
  const rect = r => [r.left-base.left,r.top-base.top,r.width,r.height];
  const detail = c => ({bg:c.backgroundColor,bgi:c.backgroundImage,bgs:c.backgroundSize,bgp:c.backgroundPosition,
    border:[c.borderTopWidth,c.borderRightWidth,c.borderBottomWidth,c.borderLeftWidth],
    borderStyle:[c.borderTopStyle,c.borderRightStyle,c.borderBottomStyle,c.borderLeftStyle],
    borderColor:[c.borderTopColor,c.borderRightColor,c.borderBottomColor,c.borderLeftColor],
    radius:c.borderTopLeftRadius,opacity:c.opacity,clip:c.clipPath,
    objectFit:c.objectFit,objectPosition:c.objectPosition});
  function walk(e) {
    if (!visible(e)) return;
    if (e.classList.contains('story-grain') || e.classList.contains('vs-bmc-hotspot') ||
        e.classList.contains('vs-focus-target') && e.classList.contains('vs-bmc-hotspot')) return;
    const c = getComputedStyle(e), r = e.getBoundingClientRect();
    const tag = e.tagName.toLowerCase();
    if (tag === 'svg') { [...e.querySelectorAll('path,line,polyline,rect,circle,ellipse,text')].forEach(walk); return; }
    if (tag === 'path' || tag === 'polyline' || tag === 'line') {
      let pts = [];
      if (tag === 'path' && e.getTotalLength) {
        const len=e.getTotalLength(), count=Math.max(2,Math.min(36,Math.ceil(len/12)));
        for(let i=0;i<=count;i++) {const p=e.getPointAtLength(len*i/count).matrixTransform(e.getScreenCTM());pts.push([p.x-base.left,p.y-base.top]);}
      } else if (tag === 'line') {
        const m=e.getScreenCTM();
        const a=new DOMPoint(Number(e.getAttribute('x1')),Number(e.getAttribute('y1'))).matrixTransform(m);
        const b=new DOMPoint(Number(e.getAttribute('x2')),Number(e.getAttribute('y2'))).matrixTransform(m);
        pts=[[a.x-base.left,a.y-base.top],[b.x-base.left,b.y-base.top]];
      } else if (tag === 'polyline') {
        const m=e.getScreenCTM();
        pts=(e.getAttribute('points')||'').trim().split(/\s+/).map(p=>p.split(',').map(Number)).filter(p=>p.length===2).map(p=>{const q=new DOMPoint(p[0],p[1]).matrixTransform(m);return [q.x-base.left,q.y-base.top]});
      }
      out.push({kind:'polyline',pts,stroke:c.stroke,strokeWidth:c.strokeWidth,opacity:c.opacity});
      return;
    }
    if (tag === 'img') {
      out.push({kind:'image',box:rect(r),src:e.currentSrc||e.src,...detail(c)});
    } else {
      const bg = c.backgroundImage !== 'none' || c.backgroundColor !== 'rgba(0, 0, 0, 0)';
      const border = [c.borderTopWidth,c.borderRightWidth,c.borderBottomWidth,c.borderLeftWidth]
        .some((v,i)=>parseFloat(v)>.25 && [c.borderTopStyle,c.borderRightStyle,c.borderBottomStyle,c.borderLeftStyle][i]!=='none');
      if (bg || border || e === root) out.push({kind:'box',box:rect(r),tag,classes:e.className?.baseVal||e.className||'',...detail(c)});
    }
    for (const child of e.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        let value = child.textContent.replace(/\s+/g,' ').trim();
        if (!value) continue;
        const range=document.createRange();range.selectNodeContents(child);
        const tr=range.getBoundingClientRect();
        if (tr.width<.5 || tr.height<.5) continue;
        const display=c.display;
        const box=(display==='block'||display==='flex'||display==='grid'||tag==='p'||tag==='h2'||tag==='h3')
          ? [r.left-base.left,tr.top-base.top,r.width,tr.height] : rect(tr);
        out.push({kind:'text',text:value,box,tag,classes:e.className?.baseVal||e.className||'',
          font:c.fontFamily,fontSize:c.fontSize,fontWeight:c.fontWeight,fontStyle:c.fontStyle,
          lineHeight:c.lineHeight,letterSpacing:c.letterSpacing,color:c.color,align:c.textAlign,
          transform:c.textTransform,whiteSpace:c.whiteSpace,opacity:c.opacity});
      } else if (child.nodeType === Node.ELEMENT_NODE) walk(child);
    }
  }
  walk(root);
  return {w:base.width,h:base.height,label:root.getAttribute('aria-label'),items:out};
}"""


def css_color(value: str | None):
    if not value or value in {"transparent", "none", "currentcolor", "currentColor"}:
        return None
    value = value.strip()
    if value.startswith("#"):
        code = value[1:]
        if len(code) == 3:
            code = "".join(ch * 2 for ch in code)
        if len(code) >= 6:
            return (tuple(int(code[i : i + 2], 16) for i in (0, 2, 4)), 1.0)
    match = re.search(r"rgba?\(([^)]+)\)", value, re.I)
    if match:
        parts = [p.strip() for p in match.group(1).split(",")]
        if len(parts) >= 3:
            rgb = tuple(max(0, min(255, round(float(p.rstrip("%")) * (2.55 if "%" in p else 1)))) for p in parts[:3])
            return (rgb, float(parts[3]) if len(parts) > 3 else 1.0)
    return None


def rgb(value) -> RGBColor:
    return RGBColor(*value)


def set_alpha(color_obj, alpha: float) -> None:
    """Add native DrawingML transparency to a PowerPoint fill/line color."""
    if alpha >= .999:
        return
    x = color_obj._xFill[0] if color_obj._xFill is not None and len(color_obj._xFill) else None
    if x is None:
        return
    a = OxmlElement("a:alpha")
    a.set("val", str(max(0, min(100000, round(alpha * 100000)))))
    x.append(a)


def in_box(box, base_w, base_h):
    x, y, w, h = box
    return (x / base_w * SLIDE_W, y / base_h * SLIDE_H, w / base_w * SLIDE_W, h / base_h * SLIDE_H)


def shape_box(slide, shape_type, box, base_w, base_h, fill=None, line=None, line_width=0.6):
    x, y, w, h = in_box(box, base_w, base_h)
    if w <= .001 or h <= .001:
        return None
    shape = slide.shapes.add_shape(shape_type, Inches(x), Inches(y), Inches(w), Inches(h))
    if fill is None:
        shape.fill.background()
    else:
        shape.fill.solid()
        shape.fill.fore_color.rgb = rgb(fill[0])
        set_alpha(shape.fill.fore_color, fill[1])
    if line is None:
        shape.line.fill.background()
    else:
        shape.line.color.rgb = rgb(line[0])
        set_alpha(shape.line.color, line[1])
        shape.line.width = Pt(line_width)
    return shape


def connector(slide, p0, p1, base_w, base_h, color=("#123f2b", 1), width=0.6):
    def to_in(p):
        return (p[0] / base_w * SLIDE_W, p[1] / base_h * SLIDE_H)
    a, b = to_in(p0), to_in(p1)
    line = slide.shapes.add_connector(
        MSO_CONNECTOR.STRAIGHT, Inches(a[0]), Inches(a[1]), Inches(b[0]), Inches(b[1])
    )
    col = css_color(color[0]) if isinstance(color[0], str) else color
    if col:
        line.line.color.rgb = rgb(col[0])
        set_alpha(line.line.color, col[1])
    line.line.width = Pt(width)
    return line


def add_border(slide, item, bw, bh):
    box = item["box"]
    widths = [float(str(v).replace("px", "") or 0) for v in item.get("border", [])]
    styles = item.get("borderStyle", [])
    colors = item.get("borderColor", [])
    x, y, w, h = box
    edges = [((x, y), (x + w, y)), ((x + w, y), (x + w, y + h)),
             ((x + w, y + h), (x, y + h)), ((x, y + h), (x, y))]
    for i in range(min(4, len(widths))):
        col = css_color(colors[i])
        if widths[i] > .2 and styles[i] != "none" and col and col[1] > .02:
            connector(slide, *edges[i], bw, bh, col, max(.35, widths[i] * SLIDE_W / bw * 72))


def gradient_colors(value):
    parts = re.findall(r"rgba?\([^)]*\)|#[0-9a-fA-F]{3,8}", value or "")
    return [css_color(p) for p in parts if css_color(p)]


def render_gradient(slide, item, bw, bh):
    bgi = item.get("bgi", "")
    if "gradient(" not in bgi or "url(" in bgi:
        return
    colors = gradient_colors(bgi)
    if not colors:
        return
    x, y, w, h = item["box"]
    if w < 5 or h < 5:
        return
    if len(colors) == 1:
        shape_box(slide, MSO_SHAPE.RECTANGLE, [x, y, w, h], bw, bh, colors[0])
        return
    horizontal = "90deg" in bgi or "to right" in bgi
    a, b = colors[0], colors[1]
    strips = 10
    for i in range(strips):
        t = (i + .5) / strips
        col = tuple(round(a[0][k] * (1 - t) + b[0][k] * t) for k in range(3))
        alpha = a[1] * (1 - t) + b[1] * t
        cell = [x + i*w/strips, y, w/strips+.2, h] if horizontal else [x, y+i*h/strips, w, h/strips+.2]
        shape_box(slide, MSO_SHAPE.RECTANGLE, cell, bw, bh, (col, alpha))


def resolve_src(src: str):
    path = unquote(urlparse(src).path)
    anchor = "/Melooloo_Final_Presentation_Web_20Oct2026/"
    if anchor in path:
        candidate = HERE / path.split(anchor, 1)[1]
        return candidate if candidate.exists() else None
    candidate = HERE / path.lstrip("/")
    return candidate if candidate.exists() else None


def add_image(slide, item, bw, bh, temp: Path, cache: dict):
    src = item.get("src")
    if not src:
        urls = re.findall(r"url\([\"']?([^\"')]+)", item.get("bgi", ""))
        if not urls:
            return
        src = urls[-1]
    path = resolve_src(src)
    if path is None:
        return
    x, y, w, h = in_box(item["box"], bw, bh)
    if w <= 0 or h <= 0:
        return
    key = (str(path), round(w / h, 4))
    if key not in cache:
        with Image.open(path) as im:
            im = im.convert("RGBA" if "A" in im.getbands() else "RGB")
            ratio = w / h
            if im.width / im.height > ratio:
                target = (max(1, round(im.height * ratio)), im.height)
            else:
                target = (im.width, max(1, round(im.width / ratio)))
            fit = ImageOps.fit(im, target, method=Image.Resampling.LANCZOS)
            out = temp / f"picture-{len(cache):03d}.png"
            fit.save(out, optimize=True)
            cache[key] = out
    slide.shapes.add_picture(str(cache[key]), Inches(x), Inches(y), Inches(w), Inches(h))


def render_text(slide, item, bw, bh):
    text = item["text"]
    if item.get("transform") == "uppercase":
        text = text.upper()
    elif item.get("transform") == "lowercase":
        text = text.lower()
    if not text:
        return
    col = css_color(item.get("color"))
    if col is None or col[1] < .015:
        return
    x, y, w, h = in_box(item["box"], bw, bh)
    x = max(0, x)
    y = max(0, y)
    w = min(SLIDE_W - x, w + .035)
    h = min(SLIDE_H - y, h + .035)
    if w <= .015 or h <= .015:
        return
    box = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = box.text_frame
    tf.clear()
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    tf.word_wrap = True
    tf.auto_size = MSO_AUTO_SIZE.TEXT_TO_FIT_SHAPE
    tf.vertical_anchor = MSO_ANCHOR.TOP
    p = tf.paragraphs[0]
    p.alignment = {"center": PP_ALIGN.CENTER, "right": PP_ALIGN.RIGHT}.get(item.get("align"), PP_ALIGN.LEFT)
    p.space_before = p.space_after = Pt(0)
    run = p.add_run()
    run.text = text
    f = run.font
    css_font = item.get("font", "")
    if "Arial Narrow" in css_font:
        f.name = "Arial Narrow"
    elif "Georgia" in css_font or "Times New Roman" in css_font:
        f.name = "Georgia"
    else:
        f.name = "Arial"
    size_token = str(item.get("fontSize", "16px"))
    if size_token.endswith("pt"):
        size_pt = float(size_token[:-2])
    else:
        px = float(size_token.replace("px", "") or 16)
        size_pt = px / bw * SLIDE_W * 72
    f.size = Pt(max(5.5, min(80, size_pt)))
    weight = item.get("fontWeight", "400")
    f.bold = weight in {"bold", "bolder"} or str(weight).isdigit() and int(weight) >= 600
    f.italic = item.get("fontStyle") in {"italic", "oblique"}
    f.color.rgb = rgb(col[0])
    set_alpha(f.color, col[1] * float(item.get("opacity", 1)))
    return box


def add_dom_items(slide, payload, temp, cache, source_number):
    bw, bh = payload["w"], payload["h"]
    for item in payload["items"]:
        kind = item["kind"]
        if kind == "box":
            if source_number in {7, 12, 13} and "vs-bmc" in str(item.get("classes", "")):
                continue
            background = css_color(item.get("bg"))
            rounded = "50%" in str(item.get("radius"))
            if background and background[1] > .005:
                shape_type = MSO_SHAPE.OVAL if rounded else MSO_SHAPE.RECTANGLE
                border_color = css_color((item.get("borderColor") or [None])[0]) if rounded else None
                border_width = float(str((item.get("border") or ["0"])[0]).replace("px", "") or 0)
                shape_box(slide, shape_type, item["box"], bw, bh, background,
                          border_color if rounded and border_width > .2 else None,
                          max(.35, border_width * SLIDE_W / bw * 72))
            bgi = item.get("bgi", "")
            if "url(" in bgi:
                add_image(slide, item, bw, bh, temp, cache)
                # Preserve the darkened cover treatment with a native editable wash.
                if "vs-cover-image" in str(item.get("classes", "")):
                    pass
            elif "gradient(" in bgi:
                render_gradient(slide, item, bw, bh)
            if not rounded:
                add_border(slide, item, bw, bh)
        elif kind == "image":
            if source_number in {7, 12, 13} and any(x in item.get("src", "") for x in ("bmc-source", "figure-012", "figure-013")):
                continue
            add_image(slide, item, bw, bh, temp, cache)
        elif kind == "text":
            if source_number == 7 and ("vs-bmc" in str(item.get("classes", "")) or item.get("text", "").startswith("IKUTI 9 BLOK")):
                continue
            if source_number == 4 and item.get("text") in {"Rp75.000", "Rp99.000"}:
                item = {**item, "fontSize": f"{float(item['fontSize'].replace('px', '')) * .90}px"}
            if source_number == 4 and item.get("text") == "/kg":
                box = item["box"]
                item = {**item, "box": [box[0] + 14, box[1], box[2], box[3]]}
            render_text(slide, item, bw, bh)
        elif kind == "polyline":
            points = item.get("pts", [])
            stroke = css_color(item.get("stroke"))
            if len(points) > 1 and stroke:
                sw = float(str(item.get("strokeWidth", "1")).replace("px", "") or 1)
                for a, b in zip(points, points[1:]):
                    connector(slide, a, b, bw, bh, stroke, max(.5, sw * SLIDE_W / bw * 72))


def add_bmc(slide):
    """Native nine-block BMC, matching the original diagram's complete structure."""
    cream = ((250, 248, 241), 1)
    dark = ((25, 62, 39), 1)
    line = ((103, 132, 104), 1)
    shape_box(slide, MSO_SHAPE.RECTANGLE, [0, 0, 1000, 562.5], 1000, 562.5, cream)
    title = {"kind":"text","text":"BUSINESS MODEL CANVAS","box":[210,20,580,42],"fontSize":"42px","fontWeight":"700","font":"Arial","color":"#193E27","align":"center"}
    render_text(slide,title,1000,562.5)
    boxes = [
      ("Key Partners", ["Supplier benih premium", "Supplier kebutuhan perkebunan", "Mitra greenhouse & IoT", "Retailer premium", "Institusi riset pertanian"], 45,100,175,300),
      ("Key Activities", ["Automasi IoT", "QC & packaging", "Distribusi & logistik", "Branding & pemasaran", "R&D dan inovasi"],230,100,170,143),
      ("Key Resources", ["Greenhouse", "Sensor IoT", "Benih melon premium", "Tim agronomis & teknisi"],230,253,170,147),
      ("Value Propositions", ["Melon premium", "Rasa manis konsisten", "Visual buah yang estetis", "Kemasan konsisten", "Urban smart farming", "Kemampuan supply konsisten"],410,100,180,300),
      ("Customer Relationships", ["Account management", "Storytelling brand", "Social media engagement", "Community building"],600,100,170,143),
      ("Channels", ["Distribusi B2B supermarket", "Event & HoReCa", "Marketplace", "Online delivery & e-commerce"],600,253,170,147),
      ("Customer Segments", ["B2B: supermarket premium", "B2C: konsumen urban menengah atas", "Health conscious customers", "Gen Z & Millennial lifestyle & foodie"],780,100,175,300),
      ("Cost Structure", ["Konstruksi & operasi greenhouse", "Benih & nutrisi", "Tenaga kerja & teknisi", "Pemasaran & branding", "R&D", "Utilitas dasar"],45,411,450,110),
      ("Revenue Streams", ["Kontrak penjualan B2B", "Penjualan langsung B2C"],505,411,450,110),
    ]
    for label, values, x, y, w, h in boxes:
        shape_box(slide,MSO_SHAPE.RECTANGLE,[x,y,w,h],1000,562.5,((255,255,255),1),line,.75)
        render_text(slide,{"kind":"text","text":label,"box":[x+10,y+9,w-20,26],"fontSize":"17px","fontWeight":"700","font":"Arial","color":"#193E27"},1000,562.5)
        if label == "Cost Structure":
            for i,value in enumerate(values):
                col=i//3;row=i%3
                render_text(slide,{"kind":"text","text":"• "+value,"box":[x+11+col*(w/2),y+40+row*21,w/2-20,20],"fontSize":"12.5px","fontWeight":"400","font":"Arial","color":"#243827"},1000,562.5)
        elif label == "Revenue Streams":
            for i,value in enumerate(values):
                render_text(slide,{"kind":"text","text":"• "+value,"box":[x+11+i*(w/2),y+43,w/2-20,40],"fontSize":"14px","fontWeight":"400","font":"Arial","color":"#243827"},1000,562.5)
        else:
            top=y+36 if label=="Key Activities" else y+40
            step=21 if label=="Key Activities" else 25
            for value in values:
                render_text(slide,{"kind":"text","text":"• "+value,"box":[x+11,top,w-22,step],"fontSize":"12.8px","fontWeight":"400","font":"Arial","color":"#243827"},1000,562.5)
                top += step


SCATTER = {
    12: {
        "title":"Peta Struktur Kompetitif Melon Premium Jakarta",
        "x":"Jarak produksi ke konsumen Jakarta (km, skala logaritmik)",
        "y":"Kemampuan melayani kanal ritel modern",
        "points":[
            (0.03,0.86,"Melooloo",(33,132,72),"star"),(0.34,0.6,"Ir. Yoga Purnomo",(48,114,160),"circle"),
            (0.47,0.6,"Sweet Greens",(190,83,65),"circle"),(0.69,0.6,"Wohsae",(207,124,46),"circle"),
            (0.57,0.86,"Sunpride",(149,78,168),"circle"),(0.64,0.86,"Urbana Farm",(196,79,60),"circle"),
            (0.94,0.86,"Crown Melon",(150,77,163),"circle"),(0.63,0.37,"Kabul Pamudji",(220,132,45),"circle"),
            (0.37,0.14,"Akaruku",(122,137,142),"circle")]
    },
    13: {
        "title":"Peta Positioning Melon Premium Jakarta",
        "x":"Persepsi kesegaran & kejelasan asal produk",
        "y":"Persepsi kualitas & konsistensi rasa",
        "points":[
            (0.76,0.74,"Melooloo",(33,132,72),"star"),(0.73,0.80,"Titik ideal",(33,132,72),"cross"),
            (0.40,0.83,"Crown Melon",(133,74,152),"circle"),(0.54,0.65,"Urbana Farm",(201,80,66),"circle"),
            (0.61,0.67,"Dang Sweet Melon",(189,75,56),"circle"),(0.50,0.60,"Wohsae",(210,139,49),"circle"),
            (0.56,0.55,"Mirai Melon",(206,128,41),"circle"),(0.65,0.50,"Akaruku",(211,142,59),"circle"),
            (0.53,0.42,"Sunpride",(50,124,170),"circle"),(0.59,0.44,"Mama Melon",(37,157,131),"circle"),
            (0.30,0.23,"Melon tanpa merek",(103,128,136),"circle")]
    }
}


def add_scatter(slide, source):
    """Editable PowerPoint markers/labels and axes for source charts 12 and 13."""
    spec = SCATTER[source]
    x0, y0, w, h = 5.55, 1.47, 4.86, 4.84
    legend_x = 10.55
    shape_box(slide,MSO_SHAPE.RECTANGLE,[x0,y0,w,h],SLIDE_W,SLIDE_H,((255,255,255),1),((178,195,178),1),.7)
    shape_box(slide,MSO_SHAPE.RECTANGLE,[x0,y0,w*.47,h],SLIDE_W,SLIDE_H,((222,239,223),.62)) if source==12 else shape_box(slide,MSO_SHAPE.RECTANGLE,[x0+w*.5,y0,w*.5,h*.5],SLIDE_W,SLIDE_H,((221,241,222),.6))
    for i in range(1,5):
        xx=x0+w*i/5; yy=y0+h*i/5
        connector(slide,(xx,y0),(xx,y0+h),SLIDE_W,SLIDE_H,((205,216,204),1),.4)
        connector(slide,(x0,yy),(x0+w,yy),SLIDE_W,SLIDE_H,((205,216,204),1),.4)
    connector(slide,(x0,y0+h),(x0+w,y0+h),SLIDE_W,SLIDE_H,((56,78,60),1),1)
    connector(slide,(x0,y0),(x0,y0+h),SLIDE_W,SLIDE_H,((56,78,60),1),1)
    for idx,(px,py,label,col,kind) in enumerate(spec["points"],1):
        xx=x0+w*px; yy=y0+h*(1-py)
        marker=MSO_SHAPE.STAR_5_POINT if kind=='star' else MSO_SHAPE.OVAL
        shape_box(slide,marker,[xx-.075,yy-.075,.15,.15],SLIDE_W,SLIDE_H,(col,1),((41,66,44),1),.6)
        render_text(slide,{"kind":"text","text":str(idx),"box":[xx+.08,yy-.10,.18,.18],"fontSize":"7pt","fontWeight":"700","font":"Arial","color":"#193E27"},SLIDE_W,SLIDE_H)
        ly=y0+.18+(idx-1)*.40
        shape_box(slide,MSO_SHAPE.OVAL,[legend_x,ly+.025,.11,.11],SLIDE_W,SLIDE_H,(col,1))
        render_text(slide,{"kind":"text","text":f"{idx:02d}  {label}","box":[legend_x+.18,ly,1.70,.36],"fontSize":"9pt","fontWeight":"700" if label=='Melooloo' else "400","font":"Arial","color":"#193E27"},SLIDE_W,SLIDE_H)
    render_text(slide,{"kind":"text","text":spec["x"],"box":[x0+.25,y0+h+.15,w-.5,.32],"fontSize":"10pt","fontWeight":"600","font":"Arial","color":"#193E27","align":"center"},SLIDE_W,SLIDE_H)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", default="http://127.0.0.1:8787")
    parser.add_argument("--output", default=str(HERE / "exports" / "Melooloo_Final_Presentation_66_Editable.pptx"))
    parser.add_argument("--limit", type=int, default=66)
    args = parser.parse_args()
    output = Path(args.output).resolve()
    output.parent.mkdir(parents=True, exist_ok=True)
    prs = Presentation()
    prs.slide_width, prs.slide_height = Inches(SLIDE_W), Inches(SLIDE_H)
    prs.core_properties.title = "Melooloo — Presentasi Sidang Akhir (Editable)"
    prs.core_properties.subject = "PowerPoint objects rebuilt from the 66-slide web deck"
    prs.core_properties.author = "Melooloo"
    blank = prs.slide_layouts[6]
    manifest=[]
    with tempfile.TemporaryDirectory(prefix="melooloo-editable-") as td, sync_playwright() as pw:
        temp=Path(td); cache={}
        browser=pw.chromium.launch(channel="chrome",headless=True)
        page=browser.new_page(viewport={"width":1920,"height":1200},reduced_motion="reduce")
        def local(route):
            path=REPO / unquote(urlparse(route.request.url).path).lstrip("/")
            route.fulfill(path=str(path)) if path.is_file() else route.continue_()
        page.route(f"{args.base_url.rstrip('/')}**", local)
        page.goto(f"{args.base_url.rstrip('/')}/{HERE.name}/index.html#slide=1",wait_until="networkidle",timeout=60000)
        route=page.locator(".drawer-item").evaluate_all("items=>items.map(e=>Number(e.dataset.page))")
        if len(route)!=66 or set(route)!=set(range(1,67)):
            raise RuntimeError(f"Invalid source route: {route}")
        for pos,source in enumerate(route[:args.limit],1):
            if pos>1: page.evaluate("n=>location.hash=`#slide=${n}`",source)
            page.wait_for_function("n=>document.querySelector('.story-canvas')?.getAttribute('aria-label')?.startsWith(`Slide sumber ${n}:`)",arg=source,timeout=30000)
            page.evaluate("() => document.getAnimations().forEach(a => { try { if(a.effect?.getTiming().iterations !== Infinity) a.finish(); } catch(e) {} })")
            payload=page.evaluate(EXTRACT)
            slide=prs.slides.add_slide(blank)
            add_dom_items(slide,payload,temp,cache,source)
            if source==7: add_bmc(slide)
            if source in SCATTER: add_scatter(slide,source)
            title=payload["label"].split(": ",1)[-1]
            slide.notes_slide.notes_text_frame.text=(
                f"Melooloo presentation {pos}/66 · source slide {source}\n{title}\n"
                f"Interactive web version: {PUBLIC_URL}#slide={source}\n"
                "Native PowerPoint text and drawing objects; photos are separate replaceable images."
            )
            manifest.append({"presentation_slide":pos,"source_slide":source,"title":title,"objects":len(slide.shapes),"editable_text_boxes":sum(s.has_text_frame and bool(s.text.strip()) for s in slide.shapes)})
            print(f"{pos:02d}/{min(args.limit,66)} source {source:02d}: {len(slide.shapes)} objects",flush=True)
        browser.close()
        prs.save(output)
    output.with_suffix(".json").write_text(json.dumps({"format":"editable native PowerPoint export","slides":manifest},ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(f"Saved {output} ({output.stat().st_size/1048576:.1f} MiB)")


if __name__ == "__main__":
    main()
