from PIL import Image
import os

img_path = '/Users/kerwinarlan/github/dorm-sa-presentation-ga-1/assets/spiderman-comic-collage.png'
out_dir = '/Users/kerwinarlan/github/dorm-sa-presentation-ga-1/assets/memes'

img = Image.open(img_path)
# Crop swinging panel (left side)
crop1 = img.crop((0, 0, 800, 1000))
crop1.save(os.path.join(out_dir, 'spiderman-swing-panel.png'))

# Crop thwip panel (middle/right side)
crop2 = img.crop((900, 0, 1800, 1000))
crop2.save(os.path.join(out_dir, 'spiderman-thwip-panel.png'))

print("Created spiderman-swing-panel.png and spiderman-thwip-panel.png!")
