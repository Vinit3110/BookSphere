"""Export the supplied transparent illustration sheets as reusable assets.

Run from the repository root: python scripts/slice_assets.py
The hand-tuned boxes deliberately retain the generous painted margins around
each illustration; this prevents the watercolor edges being clipped.
"""
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "Images"
OUT = ROOT / "assets" / "slices"

# Names, source sheet, and crop box (left, top, right, bottom).  Covers are
# intentionally exported at their supplied resolution—no artificial sharpening.
CROPS = {
    "library": [
        ("shelf-open-book", (0, 0, 295, 92)),
        ("stack-1", (2, 89, 90, 151)), ("stack-2", (90, 89, 178, 151)),
        ("stack-3", (178, 89, 270, 151)), ("open-book", (260, 70, 385, 151)),
        ("corner-vine", (430, 0, 612, 270)),
        ("cover-dune", (8, 192, 78, 284)), ("cover-atomic-habits", (82, 192, 152, 284)),
        ("cover-the-night-circus", (156, 192, 226, 284)), ("cover-before-the-coffee-gets-cold", (230, 192, 300, 284)),
        ("cover-a-court-of-thorns-and-roses", (304, 192, 374, 284)), ("cover-circe", (378, 192, 448, 284)),
        ("cover-the-seven-husbands-of-evelyn-hugo", (8, 285, 78, 405)), ("cover-project-hail-mary", (82, 285, 152, 405)),
        ("cover-the-very-secret-society-of-irregular-witches", (156, 285, 226, 405)), ("cover-the-midnight-library", (230, 285, 300, 405)),
        ("cover-psalm-for-the-wild-built", (304, 285, 374, 405)), ("cover-people-we-meet-on-vacation", (378, 285, 448, 405)),
    ],
    "stickers": [
        ("banner-parchment", (300, 22, 615, 128)), ("book-stack-plants", (420, 0, 618, 155)),
        ("open-book-stack", (0, 135, 300, 300)), ("cat-sleeping-books", (335, 190, 618, 398)),
        ("corner-sprig", (0, 0, 230, 160)),
    ],
    "dna": [
        ("girl-reading", (0, 55, 300, 405)), ("globe-book", (280, 0, 610, 175)),
        ("moon", (395, 225, 520, 330)), ("sparkle-1", (390, 190, 470, 270)),
        ("sprig", (500, 215, 612, 405)),
    ],
}

SHEETS = {
    "library": "Vintage_Storybook_Reading_Asset_Sheet-removebg-preview.png",
    "stickers": "Cozy_Watercolor_Library_Sticker_Set.png",
    "dna": "Your_Reading_DNA__Whimsical_Bookish_Illustrations-removebg-preview.png",
}

def save_pair(image: Image.Image, base: Path) -> None:
    base.parent.mkdir(parents=True, exist_ok=True)
    image.save(base.with_suffix(".png"))
    image.save(base.with_suffix(".webp"), "WEBP", quality=90, method=6)

def main() -> None:
    # The opaque full-screen paintings are served as WebP with their source PNG
    # retained as a compatibility fallback in assets/.
    for relative in ("hero/nook.png", "frames/page-frame.png"):
        png = ROOT / "assets" / relative
        if png.exists():
            Image.open(png).convert("RGB").save(png.with_suffix(".webp"), "WEBP", quality=84, method=6)
    contact = []
    for sheet, entries in CROPS.items():
        source = Image.open(SOURCE / SHEETS[sheet]).convert("RGBA")
        for name, box in entries:
            crop = source.crop(box)
            dest = OUT / sheet / name
            save_pair(crop, dest)
            preview = crop.copy()
            preview.thumbnail((150, 110))
            contact.append((name, preview))

    # A review-friendly contact sheet records precisely what was wired.
    cols, cell_w, cell_h = 4, 180, 145
    rows = (len(contact) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * cell_w, rows * cell_h), "#f7ecd4")
    draw = ImageDraw.Draw(sheet)
    for i, (name, art) in enumerate(contact):
        x, y = (i % cols) * cell_w, (i // cols) * cell_h
        sheet.paste(art, (x + (cell_w-art.width)//2, y + 4), art)
        draw.text((x + 6, y + 118), name[:27], fill="#3a2a1a")
    (ROOT / "assets").mkdir(exist_ok=True)
    sheet.save(ROOT / "assets" / "contact-sheet.png")

if __name__ == "__main__":
    main()
