"""Regenerate API key guide screenshots with accurate blur + annotations."""
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


def solid(im: Image.Image, box, color=(210, 210, 210)) -> None:
    ImageDraw.Draw(im).rectangle(box, fill=color)


def callout(im: Image.Image, box, text: str, tag_above: bool = True) -> None:
    d = ImageDraw.Draw(im)
    d.rectangle(box, outline=(200, 40, 40), width=3)
    try:
        font = ImageFont.truetype("arial.ttf", 16)
    except Exception:
        font = ImageFont.load_default()
    tw = int(font.getlength(text)) + 12
    th = 22
    if tag_above:
        ly0 = max(0, box[1] - th - 4)
    else:
        ly0 = min(im.height - th, box[3] + 4)
    # Center label over the outline when it fits; otherwise clamp to image
    box_mid = (box[0] + box[2]) // 2
    lx0 = max(0, min(box_mid - tw // 2, im.width - tw))
    d.rectangle((lx0, ly0, lx0 + tw, ly0 + th), fill=(200, 40, 40))
    d.text((lx0 + 4, ly0 + 2), text, fill=(255, 255, 255), font=font)


# --- 1) Tokens and keys ---
im = Image.open(asset("image-a09ba6bb-f861-4a3d-9512-5cae7cb43b57.png")).convert("RGB")
solid(im, (150, 45, 420, 95), (200, 200, 200))
mosaic(im, (150, 45, 420, 95), block=6)
# Active-tab underline is x=359..414; keep box on Tokens only (not Saved passwords)
callout(im, (356, 107, 415, 127), "Tokens and keys")
callout(im, (155, 188, 262, 216), "1. Add API key")
im.save(os.path.join(OUT, "api-01-tokens-and-keys.png"), optimize=True)
print("api-01")

# --- 2) Add API key dialog ---
im = Image.open(asset("image-45f39f63-d1a8-464e-b87c-9c971d9c05ac.png")).convert("RGB")
callout(im, (14, 196, 216, 226), "2. Generate API key pair")
callout(im, (38, 370, 505, 560), "3. Download private key (click this card)")
# Disabled Add button fill is approx x=913..982, y=677..723
d = ImageDraw.Draw(im)
add_box = (912, 676, 986, 724)
d.rectangle(add_box, outline=(200, 40, 40), width=3)
try:
    font = ImageFont.truetype("arial.ttf", 15)
except Exception:
    font = ImageFont.load_default()
cap = "4. Add (after .pem download)"
tw = int(font.getlength(cap)) + 12
box_mid = (add_box[0] + add_box[2]) // 2
lx0 = max(40, min(box_mid - tw // 2, im.width - tw))
ly0 = add_box[1] - 26
d.rectangle((lx0, ly0, lx0 + tw, ly0 + 22), fill=(200, 40, 40))
d.text((lx0 + 4, ly0 + 2), cap, fill=(255, 255, 255), font=font)
im.save(os.path.join(OUT, "api-02-add-api-key.png"), optimize=True)
print("api-02")

# --- 3) Configuration file preview ---
im = Image.open(asset("image-fb5fd5ae-2986-4111-acfd-c9e80fb50c45.png")).convert("RGB")
# Secrets only
mosaic(im, (55, 100, 500, 128), block=9)
mosaic(im, (85, 158, 980, 180), block=9)
mosaic(im, (145, 180, 500, 202), block=9)
mosaic(im, (105, 202, 980, 224), block=9)
mosaic(im, (230, 226, 755, 256), block=9)
# Config text starts ~x=25; start at left edge so values are fully enclosed
callout(im, (0, 82, 545, 142), "Fingerprint — copy this")
callout(im, (0, 145, 765, 252), "user= / tenancy= / region=")
callout(im, (768, 218, 840, 252), "Copy")
# Close button border is x=965..1003, y=527..551
callout(im, (962, 524, 1006, 554), "Close")
im.save(os.path.join(OUT, "api-03-config-preview.png"), optimize=True)
print("api-03")

print("done")
