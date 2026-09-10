"""Blur PII and annotate the Upgrade and Manage Payment console screenshot."""
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
    lx0 = max(0, min(box[0], im.width - tw))
    d.rectangle((lx0, ly0, lx0 + tw, ly0 + th), fill=(200, 40, 40))
    d.text((lx0 + 4, ly0 + 3), text, fill=(255, 255, 255), font=font)


im = Image.open(asset("image-887a4d46-fbf8-4d13-b73b-9d406f27296c.png")).convert("RGB")

# Blur Name / Email / Address value column in Account details
mosaic(im, (440, 500, 1000, 680), block=8)

# Menu path callouts
callout(im, (10, 55, 285, 95), "1. Billing & Cost Management")
callout(im, (15, 165, 120, 195), "2. Billing")
callout(im, (12, 355, 275, 395), "3. Upgrade and Manage Payment")

# After upgrade: Pay As You Go
callout(im, (450, 330, 620, 365), "Plan type: Pay As You Go")

out = os.path.join(OUT, "signup-04-upgrade-payg.png")
im.save(out, optimize=True)
print("saved", out, im.size)

for name in os.listdir(OUT):
    if name.startswith("_"):
        os.remove(os.path.join(OUT, name))
print("cleaned")
