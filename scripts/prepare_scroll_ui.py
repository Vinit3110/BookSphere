"""Slice the user-supplied scroll frame into three animated button layers."""
from pathlib import Path
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/ui/scroll'
OUT.mkdir(parents=True,exist_ok=True)
source=Image.open(ROOT/'Images/Weathered Treasure Map Scroll Frame.png').convert('RGBA')
source=source.crop((0,12,1774,855))
for name,box in {
    'roll':(0,0,350,843),
    'paper':(350,0,1450,843),
    'edge':(1450,0,1774,843),
}.items():
    part=source.crop(box)
    part=part.resize((round(part.width*256/part.height),256),Image.Resampling.LANCZOS)
    part.save(OUT/(name+'.png'))
    part.save(OUT/(name+'.webp'),quality=85,method=6)
print('Exported 3 transparent scroll layers with PNG fallbacks.')
