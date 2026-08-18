from PIL import Image, ImageDraw, ImageEnhance, ImageOps
import os

img_path = r"C:\Users\rjik\.gemini\antigravity\brain\b986d81e-12c6-4b19-aaa0-a6b0f183b4d9\.user_uploaded\media_1787002573277.jpg"
img = Image.open(img_path).convert("RGBA")
w, h = img.size

# Exact circle center and radius
cx = w * 0.505
cy = h * 0.499
r = w * 0.286  # tighter radius to cleanly exclude any background artifacts

crop_box = (int(cx - r), int(cy - r), int(cx + r), int(cy + r))
cropped = img.crop(crop_box)
cw, ch = cropped.size

# Create high-res anti-aliased circular mask
scale = 4
large_mask = Image.new("L", (cw * scale, ch * scale), 0)
draw = ImageDraw.Draw(large_mask)
draw.ellipse((0, 0, cw * scale, ch * scale), fill=255)
mask = large_mask.resize((cw, ch), Image.Resampling.LANCZOS)

# Create crisp output badge with clean white circular background and subtle border
badge = Image.new("RGBA", (cw, ch), (255, 255, 255, 0))
badge.paste(cropped, (0, 0), mask=mask)

# Save to public and images
out_paths = [
    r"C:\Users\rjik\.gemini\antigravity\scratch\imaco-academy\public\nisir-logo.png",
    r"C:\Users\rjik\.gemini\antigravity\scratch\imaco-academy\public\images\nisir-logo.png",
    r"C:\Users\rjik\.gemini\antigravity\scratch\imaco-academy\public\logo.png",
    r"C:\Users\rjik\.gemini\antigravity\scratch\imaco-academy\public\favicon.ico",
    r"C:\Users\rjik\.gemini\antigravity\brain\b986d81e-12c6-4b19-aaa0-a6b0f183b4d9\extracted_nisir_logo.png"
]

for p in out_paths:
    if p.endswith('.ico'):
        badge.resize((64, 64), Image.Resampling.LANCZOS).save(p, format='ICO')
    else:
        badge.save(p, "PNG")

print("Crisply extracted clean logo to all paths! Size:", badge.size)
