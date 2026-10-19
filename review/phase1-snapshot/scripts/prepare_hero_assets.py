"""Crop existing supplied illustrations for the landing-page composition.
No new artwork is drawn or upscaled. Run from the repository root.
"""
from pathlib import Path
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets' / 'slices' / 'hero'
OUT.mkdir(parents=True, exist_ok=True)

def export(image, name):
    image.save(OUT / (name + '.png'))
    image.save(OUT / (name + '.webp'), quality=90, method=6)

def largest_sprig(image):
    # Discard detached fragments clipped from neighboring ornaments. A small
    # dilation groups leaves belonging to the same vine before component search.
    mask = image.getchannel('A').point(lambda a: 255 if a > 50 else 0).filter(ImageFilter.MaxFilter(7))
    pixels = mask.load()
    seen = set()
    components = []
    for y in range(image.height):
        for x in range(image.width):
            if not pixels[x,y] or (x,y) in seen: continue
            stack=[(x,y)]; seen.add((x,y)); component=[]
            while stack:
                px,py=stack.pop(); component.append((px,py))
                for nx,ny in ((px-1,py),(px+1,py),(px,py-1),(px,py+1)):
                    if 0 <= nx < image.width and 0 <= ny < image.height and pixels[nx,ny] and (nx,ny) not in seen:
                        seen.add((nx,ny));stack.append((nx,ny))
            components.append(component)
    keep=Image.new('L',image.size)
    for x,y in max(components,key=len): keep.putpixel((x,y),255)
    keep=keep.filter(ImageFilter.MaxFilter(5))
    result=Image.new('RGBA',image.size)
    result.paste(image,(0,0),keep)
    return result

vines = Image.open(ROOT / 'assets/sheets/vines.png').convert('RGBA')
# The supplied sheet has a nearly transparent brown matte (alpha 1–3).
# Clear that matte, retaining the actual watercolor edges above alpha 20.
alpha = vines.getchannel('A').point(lambda a: 0 if a < 20 else a)
vines.putalpha(alpha)
export(largest_sprig(vines.crop((0, 155, 175, 1020))), 'vine-left')
export(largest_sprig(vines.crop((1360, 230, 1536, 1010))), 'vine-right')
stickers = Image.open(ROOT / 'assets/sheets/stickers.png').convert('RGBA')
export(stickers.crop((240, 26, 618, 180)), 'quote-banner')
export(stickers.crop((340, 183, 618, 404)), 'mochi')
export(stickers.crop((175, 152, 238, 229)), 'leaf-sprig')
export(stickers.crop((0, 0, 113, 252)), 'corner-sprig')
nook = Image.open(ROOT / 'assets/hero/nook.png').convert('RGB')
nook.resize((960, 640), Image.Resampling.LANCZOS).save(ROOT / 'assets/hero/nook-mobile.webp', quality=82, method=6)
export(nook.crop((0, 0, 120, 200)), 'lantern')
# A genuine patch of the painting's paper keeps the extended left edge warm.
export(nook.crop((240, 350, 440, 550)), 'paper-grain')
print('Prepared 8 hero slices and a phone-sized painting from the supplied artwork.')
