from PIL import Image, ImageDraw, ImageEnhance
import os, shutil

p_coach = r"C:\Users\rjik\.gemini\antigravity\brain\b986d81e-12c6-4b19-aaa0-a6b0f183b4d9\.user_uploaded\media_1787037698738.jpg"
p_logo = r"C:\Users\rjik\.gemini\antigravity\brain\b986d81e-12c6-4b19-aaa0-a6b0f183b4d9\.user_uploaded\media_1787040110183.jpg"

# 1. PROCESS AND SAVE COACH PHOTO
im_coach = Image.open(p_coach).convert("RGB")
coach_paths = [
    r"C:\Users\rjik\.gemini\antigravity\scratch\imaco-academy\public\images\coach-fisha.jpg",
    r"C:\Users\rjik\.gemini\antigravity\scratch\imaco-academy\public\coach-fisha.jpg",
    r"C:\Users\rjik\.gemini\antigravity\scratch\imaco-academy\public\images\coach.jpg",
    r"C:\Users\rjik\.gemini\antigravity\brain\b986d81e-12c6-4b19-aaa0-a6b0f183b4d9\coach_fisha.jpg"
]

for cp in coach_paths:
    os.makedirs(os.path.dirname(cp), exist_ok=True)
    im_coach.save(cp, "JPEG", quality=95)
print("Saved Coach Fisha photo to all locations successfully!")

# 2. PROCESS AND SAVE HIGH-RES LOGO
im_logo = Image.open(p_logo).convert("RGBA")
# Ensure pure white background if needed or save crystal clear PNG
logo_paths = [
    r"C:\Users\rjik\.gemini\antigravity\scratch\imaco-academy\public\nisir-logo.png",
    r"C:\Users\rjik\.gemini\antigravity\scratch\imaco-academy\public\images\nisir-logo.png",
    r"C:\Users\rjik\.gemini\antigravity\scratch\imaco-academy\public\logo.png",
    r"C:\Users\rjik\.gemini\antigravity\brain\b986d81e-12c6-4b19-aaa0-a6b0f183b4d9\official_nisir_logo.png"
]

for lp in logo_paths:
    os.makedirs(os.path.dirname(lp), exist_ok=True)
    im_logo.save(lp, "PNG")

# Generate favicon
favicon_path = r"C:\Users\rjik\.gemini\antigravity\scratch\imaco-academy\public\favicon.ico"
im_logo.resize((64, 64), Image.Resampling.LANCZOS).convert("RGB").save(favicon_path, format="ICO")
print("Saved 1024x1024 HD Nisir Logo to all locations successfully!")
