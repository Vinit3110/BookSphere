"""Prepare generated textures and crop existing paintings for book spreads.
All source originals are retained; this only crops and creates delivery files.
"""
from pathlib import Path
from PIL import Image, ImageFilter, ImageChops

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/craft'

def save(image, name, width=None, quality=86):
    if width and image.width > width:
        image = image.resize((width, round(image.height * width / image.width)), Image.Resampling.LANCZOS)
    image.save(OUT / (name + '.png'))
    image.save(OUT / (name + '.webp'), quality=quality, method=6)

def isolate(image, largest=False, trim_edge=False):
    """Remove disconnected scraps from neighboring sticker-sheet cells."""
    mask=image.getchannel('A').point(lambda a:255 if a>40 else 0).filter(ImageFilter.MaxFilter(5))
    px=mask.load(); seen=set(); components=[]
    for y in range(image.height):
        for x in range(image.width):
            if not px[x,y] or (x,y) in seen: continue
            group=[];stack=[(x,y)];seen.add((x,y))
            while stack:
                ax,ay=stack.pop();group.append((ax,ay))
                for nx,ny in ((ax-1,ay),(ax+1,ay),(ax,ay-1),(ax,ay+1)):
                    if 0<=nx<image.width and 0<=ny<image.height and px[nx,ny] and (nx,ny) not in seen:
                        seen.add((nx,ny));stack.append((nx,ny))
            components.append(group)
    retained=[max(components,key=len)] if largest else [c for c in components if len(c)>300]
    if trim_edge:
        retained=[c for c in retained if not (len(c)<2000 and min(y for x,y in c)>image.height*.74 and max(x for x,y in c)>image.width*.95)]
    keep=Image.new('L',image.size)
    for component in retained:
        for x,y in component:keep.putpixel((x,y),255)
    keep=keep.filter(ImageFilter.MaxFilter(3))
    image.putalpha(ImageChops.multiply(image.getchannel('A'),keep))
    return image

plaque = Image.open(OUT / 'walnut-plaque-original.png').convert('RGBA')
box = plaque.getchannel('A').point(lambda a: 255 if a > 12 else 0).getbbox()
save(plaque.crop(box), 'walnut-plaque', width=1024, quality=90)
closing = Image.open(OUT / 'closing-library-original.png').convert('RGB')
save(closing, 'closing-library', width=1536, quality=84)
save(closing, 'closing-library-mobile', width=900, quality=82)
ritual=Image.open(OUT / 'ritual-book-original.png').convert('RGBA')
save(ritual, 'ritual-book', width=560, quality=86)

frame = Image.open(ROOT / 'assets/frames/page-frame.png').convert('RGB')
for name, box in {
    'page-lantern': (0, 0, 440, 520),
    'page-shelf': (1096, 0, 1536, 540),
    'page-books': (0, 590, 500, 1024),
    'page-globe': (1080, 540, 1536, 1024),
}.items():
    save(frame.crop(box), name, width=440)

stickers = Image.open(ROOT / 'assets/sheets/stickers.png').convert('RGBA')
save(isolate(stickers.crop((20, 191, 320, 404)),largest=True), 'open-book-clean')
dna = Image.open(ROOT / 'assets/sheets/dna.png').convert('RGBA')
save(isolate(dna.crop((0, 28, 305, 408)),trim_edge=True), 'reader-clean')
save(dna.crop((326, 16, 612, 180)), 'globe-clean')
print('Prepared wooden plaque, closing scene, four page corners and three clean illustrations.')
