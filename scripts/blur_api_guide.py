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
    """Outline a UI control; put the text label outside so the button stays readable."""
    d = ImageDraw.Draw(im)
    d.rectangle(box, outline=(200, 40, 40), width=3)
    try:
        font = ImageFont.truetype("arial.ttf", 17)
    except Exception:
        font = ImageFont.load_default()
    tw = int(font.getlength(text)) + 14
    th = 24
    if tag_above:
        ly0 = max(0, box[1] - th - 6)
    else:
        ly0 = min(im.height - th, box[3] + 6)
    lx0 = max(0, min(box[0], im.width - tw))
    d.rectangle((lx0, ly0, lx0 + tw, ly0 + th), fill=(200, 40, 40))
    d.text((lx0 + 5, ly0 + 3), text, fill=(255, 255, 255), font=font)


# --- 1) Tokens and keys ---
im = Image.open(asset("image-a09ba6bb-f861-4a3d-9512-5cae7cb43b57.png")).convert("RGB")
# Fully obscure display name
solid(im, (150, 45, 420, 95), (200, 200, 200))
mosaic(im, (150, 45, 420, 95), block=6)
# Tokens and keys tab (active underline)
callout(im, (375, 103, 505, 133), "Tokens and keys")
# Add API key only (not Delete)
callout(im, (155, 188, 265, 218), "1. Add API key")
im.save(os.path.join(OUT, "api-01-tokens-and-keys.png"), optimize=True)
print("api-01")

# --- 2) Add API key dialog ---
im = Image.open(asset("image-45f39f63-d1a8-464e-b87c-9c971d9c05ac.png")).convert("RGB")
callout(im, (32, 208, 275, 238), "2. Generate API key pair")
# Left download tile — keep title readable
callout(im, (38, 370, 505, 560), "3. Download private key (click this card)")
# Outline Add; put the caption to the LEFT so the disabled Add label stays readable
d = ImageDraw.Draw(im)
add_box = (908, 704, 985, 732)
d.rectangle(add_box, outline=(200, 40, 40), width=3)
try:
    font = ImageFont.truetype("arial.ttf", 16)
except Exception:
    font = ImageFont.load_default()
cap = "4. Add (after .pem download)"
tw = int(font.getlength(cap)) + 12
lx0 = max(40, 900 - tw)
d.rectangle((lx0, 704, lx0 + tw, 726), fill=(200, 40, 40))
d.text((lx0 + 4, 706), cap, fill=(255, 255, 255), font=font)
im.save(os.path.join(OUT, "api-02-add-api-key.png"), optimize=True)
print("api-02")

# --- 3) Configuration file preview (source with visible Copy) ---
im = Image.open(asset("image-fb5fd5ae-2986-4111-acfd-c9e80fb50c45.png")).convert("RGB")
# Blur secrets only; keep UI chrome / Copy / Close / region readable
# Coords from grid overlay on this 1024x563 asset
mosaic(im, (50, 95, 500, 125), block=9)  # fingerprint hex
mosaic(im, (90, 155, 980, 178), block=9)  # user=
mosaic(im, (150, 178, 500, 200), block=9)  # fingerprint=
mosaic(im, (110, 200, 980, 222), block=9)  # tenancy=
mosaic(im, (230, 225, 755, 255), block=9)  # single-line preview secrets
callout(im, (40, 80, 520, 135), "Fingerprint — copy this")
callout(im, (40, 145, 720, 230), "user= / tenancy= / region=")
callout(im, (760, 215, 835, 250), "Copy")
callout(im, (920, 515, 995, 548), "Close")
im.save(os.path.join(OUT, "api-03-config-preview.png"), optimize=True)
print("api-03")

for name in os.listdir(OUT):
    if name.startswith("_"):
        os.remove(os.path.join(OUT, name))
print("done")
