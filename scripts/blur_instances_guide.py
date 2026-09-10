"""Blur IPs and annotate the Compute → Instances guide screenshot."""
from PIL import Image, ImageDraw, ImageFont
import os

ASSETS = r"C:\Users\Johji\.cursor\projects\d-dancefloor-MinorWire\assets"
OUT = r"D:\dancefloor\jittee\public\minorwire\guide"


def asset(suffix: str) -> str:
    for name in os.listdir(ASSETS):
        if name.endswith(suffix):
            return os.path.join(ASSETS, name)
    raise FileNotFoundError(suffix)


def mosaic(im: Image.Image, box, block: int = 10) -> None:
    x0, y0, x1, y1 = [int(v) for v in box]
    x0, y0 = max(0, x0), max(0, y0)
    x1, y1 = min(im.width, x1), min(im.height, y1)
    if x1 <= x0 or y1 <= y0:
        return
    crop = im.crop((x0, y0, x1, y1))
    small = crop.resize(
        (max(1, (x1 - x0) // block), max(1, (y1 - y0) // block)),
        Image.Resampling.BILINEAR,
    )
    im.paste(small.resize((x1 - x0, y1 - y0), Image.Resampling.NEAREST), (x0, y0))


def callout(im: Image.Image, box, text: str, tag_above: bool = True) -> None:
    d = ImageDraw.Draw(im)
    d.rectangle(box, outline=(200, 40, 40), width=3)
    try:
        font = ImageFont.truetype("arial.ttf", 16)
    except Exception:
        font = ImageFont.load_default()
    tw = int(font.getlength(text)) + 12
    th = 24
    ly0 = max(0, box[1] - th - 4) if tag_above else min(im.height - th, box[3] + 4)
    box_mid = (box[0] + box[2]) // 2
    lx0 = max(0, min(box_mid - tw // 2, im.width - tw))
    d.rectangle((lx0, ly0, lx0 + tw, ly0 + th), fill=(200, 40, 40))
    d.text((lx0 + 4, ly0 + 3), text, fill=(255, 255, 255), font=font)


im = Image.open(asset("image-e1f95ed3-20df-4da9-9a50-1425cfb47437.png")).convert("RGB")

# Blur public / private IP values
mosaic(im, (615, 408, 775, 435), block=8)
mosaic(im, (780, 408, 900, 435), block=8)

# Sidebar: Compute → Instances
callout(im, (8, 228, 250, 262), "1. Compute → Instances")
# Instance row: name / Running / IPs / shape
callout(im, (270, 360, 1010, 450), "2. Running · Always Free · Public IP")

out = os.path.join(OUT, "verify-01-instances.png")
im.save(out, optimize=True)
print("saved", out, im.size)

for name in ("inst-nav.png", "inst-row.png", "inst-grid.png", "inst-nav-g.png", "inst-table.png", "inst-p1.png", "inst-p2.png"):
    path = os.path.join(OUT, name)
    if os.path.exists(path):
        os.remove(path)
print("cleaned")
