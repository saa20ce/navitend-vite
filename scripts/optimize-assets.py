"""Run with Pillow, fonttools and brotli installed; originals stay untouched."""
from pathlib import Path

from PIL import Image
from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "public/assets"


def webp(name, width):
    source = ASSETS / f"{name}.png"
    target = ASSETS / f"{name}.webp"
    with Image.open(source) as image:
        image.thumbnail((width, width * 4), Image.Resampling.LANCZOS)
        image.save(target, "WEBP", quality=85, method=6)
    print(f"{target.name}: {source.stat().st_size:,} -> {target.stat().st_size:,} bytes")


for name in ("Hero", "Hero2", "Hero3"):
    webp(name, 1000)
    webp(f"{name}Mob", 360)

for number in (1, 2, 4, 5, 6):
    webp(f"doctor{number}", 280)

# Keep Latin, Cyrillic, punctuation, currency and mathematical symbols, including
# text entered in contact forms. Do not subset to only the current page's text.
unicodes = set()
for start, end in ((0x0000, 0x024F), (0x0400, 0x052F), (0x1C80, 0x1C8F),
                   (0x2000, 0x206F), (0x20A0, 0x20CF), (0x2100, 0x22FF),
                   (0x2DE0, 0x2DFF), (0xA640, 0xA69F), (0xFEFF, 0xFEFF),
                   (0xFFFD, 0xFFFD)):
    unicodes.update(range(start, end + 1))

for weight in ("regular", "semibold", "black"):
    source = ROOT / f"public/fonts/lato-{weight}.woff2"
    target = source.with_name(f"lato-{weight}-latin-cyrillic.woff2")
    font = TTFont(source)
    options = subset.Options()
    options.flavor = "woff2"
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=unicodes)
    subsetter.subset(font)
    font.save(target)
    print(f"{target.name}: {source.stat().st_size:,} -> {target.stat().st_size:,} bytes")
