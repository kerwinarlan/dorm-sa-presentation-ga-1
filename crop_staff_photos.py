import os
from PIL import Image

staff_dir = '/Users/kerwinarlan/github/dorm-sa-presentation-ga-1/assets/current_staff'
out_dir = '/Users/kerwinarlan/github/dorm-sa-presentation-ga-1/assets/staff_photos'
os.makedirs(out_dir, exist_ok=True)

crops = {
    # Student Assistants
    'student-assistants.png': [
        ('yelsah.png', (250, 70, 720, 480)),
        ('rachel.png', (1200, 70, 1600, 480)),
        ('jose.png', (250, 560, 680, 980)),
        ('ash.png', (780, 560, 1100, 980)),
        ('matt.png', (1200, 560, 1600, 980)),
    ],
    # Dorm Managers
    'maam-len.png': [
        ('maam-len.png', (200, 180, 880, 920))
    ],
    'maam-zay.png': [
        ('maam-zay.png', (180, 180, 880, 920))
    ],
    'maam-gen.png': [
        ('maam-gen.png', (180, 180, 880, 920))
    ],
    # Kuya Staff
    'kuya-staff.png': [
        ('kuya-bagyo.png', (100, 240, 600, 800)),
        ('kuya-dani.png', (720, 360, 1180, 880)),
        ('kuya-emong.png', (1300, 220, 1800, 780))
    ],
    # Ate Staff
    'ate-staff.png': [
        ('ate-rhea.png', (120, 180, 540, 600)),
        ('ate-december.png', (510, 460, 910, 920)),
        ('ate-feny.png', (1020, 500, 1420, 920)),
        ('ate-tere.png', (1400, 280, 1850, 720))
    ],
    # Security Guards 1
    'security-guards-1.png': [
        ('kuya-nard.png', (280, 240, 820, 800)),
        ('kuya-julius.png', (1120, 200, 1640, 780))
    ],
    # Security Guards 2
    'security-guards-2.png': [
        ('ate-jen.png', (320, 240, 820, 820)),
        ('ate-joh.png', (1120, 220, 1620, 780))
    ]
}

for src_file, targets in crops.items():
    src_path = os.path.join(staff_dir, src_file)
    if not os.path.exists(src_path):
        continue
    img = Image.open(src_path)
    for out_name, bbox in targets:
        cropped = img.crop(bbox)
        out_path = os.path.join(out_dir, out_name)
        cropped.save(out_path)
        print(f"Saved {out_name} -> {cropped.size}")

print("Cropping completed!")
