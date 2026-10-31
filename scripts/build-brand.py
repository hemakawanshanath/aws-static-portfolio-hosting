"""Render the portfolio's geometric identity and social card (requires Pillow)."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets' / 'brand'
DARK, GREEN, PALE, WHITE = '#07120a', '#97bc62', '#dcebc5', '#f7faf3'

def monogram(size):
    im = Image.new('RGB', (256, 256), DARK)
    d = ImageDraw.Draw(im)
    d.line([(72,56),(72,200)], fill=GREEN, width=20)
    d.line([(184,56),(184,200)], fill=GREEN, width=20)
    d.line([(72,128),(184,128)], fill=GREEN, width=20)
    return im.resize((size,size), Image.Resampling.LANCZOS)

monogram(32).save(OUT / 'favicon.png')
monogram(180).save(OUT / 'apple-touch-icon.png')
im = Image.new('RGB', (1200,630), DARK)
d = ImageDraw.Draw(im)
font_dir = Path('C:/Windows/Fonts')
def font(size, bold=False):
    return ImageFont.truetype(str(font_dir / ('arialbd.ttf' if bold else 'arial.ttf')),size)

# A branching path joins the initial and the three interests.
d.rounded_rectangle((855,32,1168,598), radius=38, fill='#2c5f2d')
d.arc((920,-135,1380,325),0,360,fill='#527d3f',width=2)
d.arc((780,280,1270,770),0,360,fill='#527d3f',width=2)
im.paste(monogram(134),(944,126))
d.line([(1011,280),(1011,338),(919,338),(919,490)], fill=GREEN,width=2)
for y,label in [(354,'CLOUD'),(420,'DEVOPS'),(486,'EXPLORING')]:
    d.line([(919,y),(952,y)],fill=GREEN,width=2)
    d.ellipse((914,y-5,924,y+5),fill=PALE)
    d.text((970,y-8),label,fill=WHITE,font=font(16,True))
d.text((64,57),'HEMAKA / PERSONAL PORTFOLIO',fill=GREEN,font=font(18,True))
d.line((64,111,791,111),fill='#2c5f2d',width=2)
d.text((60,160),'Hemaka',fill=WHITE,font=font(72,True))
d.text((60,241),'Wanshanath.',fill=PALE,font=font(72,True))
d.text((64,351),'Information Systems undergraduate',fill=WHITE,font=font(25))
d.text((64,393),'University of Colombo School of Computing',fill='#a8b8a4',font=font(20))
d.rounded_rectangle((64,492,508,543),radius=25,fill=GREEN)
d.text((85,506),'Learning. Building. Exploring.',fill='#17331b',font=font(23,True))
d.text((64,577),'COLOMBO, SRI LANKA',fill='#a8b8a4',font=font(15))
im.save(OUT / 'social-preview.png', optimize=True)
print('Rendered favicon, touch icon and 1200x630 sharing card.')
