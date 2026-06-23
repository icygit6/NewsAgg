"""Generate raster brand assets (PWA icons, Apple touch icon, Open Graph image)
from the NewsAgg brand: a cyan -> pink gradient tile with a bold white "N",
matching the in-app logo and favicon.svg.

Run from the client/ dir with any Python that has Pillow:
    python scripts/generate-brand-assets.py
Outputs into client/public/. Re-run if the brand colours change.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

CYAN = (6, 182, 212)   # #06b6d4
PINK = (236, 72, 153)  # #ec4899
INK = (10, 15, 30)     # #0a0f1e (app dark background)
SLATE = (148, 163, 184)

PUBLIC = Path(__file__).resolve().parent.parent / "public"
FONT = r"C:\Windows\Fonts\segoeuib.ttf"  # Segoe UI Bold


def hgrad(w, h, c1, c2):
    """Horizontal (90deg) gradient, RGB."""
    row = Image.new("RGB", (w, 1))
    for x in range(w):
        t = x / max(1, w - 1)
        row.putpixel((x, 0), tuple(round(c1[i] + (c2[i] - c1[i]) * t) for i in range(3)))
    return row.resize((w, h))


def tile(size, radius_frac, font_frac):
    """A gradient square (optionally rounded) with a centered white N."""
    img = hgrad(size, size, CYAN, PINK).convert("RGBA")
    if radius_frac > 0:
        mask = Image.new("L", (size, size), 0)
        ImageDraw.Draw(mask).rounded_rectangle(
            [0, 0, size - 1, size - 1], radius=int(size * radius_frac), fill=255
        )
        img.putalpha(mask)
    d = ImageDraw.Draw(img)
    f = ImageFont.truetype(FONT, int(size * font_frac))
    d.text((size / 2, size / 2 - size * 0.02), "N", font=f, fill="white", anchor="mm")
    return img


def save(img, name):
    path = PUBLIC / name
    img.save(path)
    print("wrote", path.relative_to(PUBLIC.parent))


# PWA icons (rounded) + maskable/apple (full-bleed, platform applies its mask).
save(tile(192, 0.22, 0.58), "icon-192.png")
save(tile(512, 0.22, 0.58), "icon-512.png")
save(tile(512, 0.0, 0.46), "icon-maskable.png")   # generous safe-zone padding
save(tile(180, 0.0, 0.56), "apple-touch-icon.png")

# Open Graph / Twitter card: 1200x630 dark canvas, centered brand lockup.
og = Image.new("RGB", (1200, 630), INK)
logo = tile(180, 0.24, 0.58)
og.paste(logo, (510, 120), logo)
d = ImageDraw.Draw(og)
d.text((600, 372), "NewsAgg", font=ImageFont.truetype(FONT, 84), fill="white", anchor="mm")
d.text(
    (600, 452),
    "Breaking news, personalized — with sentiment analytics",
    font=ImageFont.truetype(FONT, 32),
    fill=SLATE,
    anchor="mm",
)
og.save(PUBLIC / "og-image.png")
print("wrote", (PUBLIC / "og-image.png").relative_to(PUBLIC.parent))
