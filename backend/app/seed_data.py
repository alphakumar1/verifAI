import io
import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import numpy as np
import cv2

SAMPLE_DIR = Path(__file__).resolve().parent.parent / "sample_data"
SAMPLE_DIR.mkdir(parents=True, exist_ok=True)

def generate_synthetic_passport_image(
    passport_num: str,
    name: str,
    dob: str,
    expiry: str,
    nationality: str = "IND",
    tampered_text: bool = False,
    add_photoshop_exif: bool = False
) -> bytes:
    """
    Generates a realistic synthetic passport graphic card with MRZ line, photo portrait,
    hologram watermark, and optional digital splicing or EXIF artifacts for testing.
    """
    # Create canvas
    width, height = 750, 480
    img = Image.new("RGB", (width, height), color=(248, 246, 240))
    draw = ImageDraw.Draw(img)

    # Decorative header bar (Indian Passport Blue)
    draw.rectangle([(0, 0), (width, 80)], fill=(18, 38, 70))
    
    # Border & guilloche pattern simulation
    draw.rectangle([(10, 10), (width - 10, height - 10)], outline=(180, 190, 205), width=3)
    for y in range(85, height - 90, 12):
        draw.line([(20, y), (width - 20, y)], fill=(238, 240, 245), width=1)

    # Header Text
    draw.text((25, 20), "PASSPORT / PASSEPORT", fill=(255, 215, 0))
    draw.text((25, 45), "REPUBLIC OF INDIA / RÉPUBLIQUE DE L'INDE", fill=(255, 255, 255))
    draw.text((width - 160, 30), "TYPE: P", fill=(220, 230, 245))

    # Face Portrait Frame
    photo_box = [(40, 110), (200, 310)]
    draw.rectangle(photo_box, fill=(210, 225, 240), outline=(100, 120, 150), width=2)
    # Draw simple avatar silhouette
    draw.ellipse([(85, 140), (155, 210)], fill=(130, 150, 175))
    draw.ellipse([(60, 220), (180, 310)], fill=(90, 115, 145))
    draw.text((80, 290), "OFFICIAL", fill=(240, 240, 240))

    # Document Fields (Visual Zone)
    labels_and_vals = [
        ("PASSPORT NO / NO DU PASSEPORT", passport_num),
        ("SURNAME / NOM", name.split(" ")[-1] if " " in name else name),
        ("GIVEN NAME(S) / PRÉNOMS", name.split(" ")[0] if " " in name else ""),
        ("NATIONALITY / NATIONALITÉ", nationality),
        ("DATE OF BIRTH / DATE DE NAISSANCE", dob),
        ("SEX / SEXE", "M"),
        ("DATE OF EXPIRY / DATE D'EXPIRATION", expiry),
        ("PLACE OF ISSUE / LIEU DE DÉLIVRANCE", "NEW DELHI")
    ]

    x_offset = 230
    y_start = 100
    for i, (label, val) in enumerate(labels_and_vals):
        y = y_start + (i * 24)
        draw.text((x_offset, y), label, fill=(120, 130, 145))
        draw.text((x_offset + 260, y), val, fill=(10, 20, 40))

    # If physical tampering simulated: draw a spliced patch over DOB
    if tampered_text:
        patch_box = [(x_offset + 255, y_start + (4 * 24) - 2), (x_offset + 390, y_start + (4 * 24) + 18)]
        draw.rectangle(patch_box, fill=(255, 255, 255), outline=(255, 0, 0), width=1)
        draw.text((x_offset + 260, y_start + (4 * 24)), "01-01-2005", fill=(0, 0, 0)) # Altered DOB text

    # Machine Readable Zone (MRZ TD3) - Bottom Strip
    draw.rectangle([(0, height - 90), (width, height)], fill=(255, 255, 255))
    draw.line([(0, height - 90), (width, height - 90)], fill=(160, 170, 185), width=2)

    # ICAO MRZ Lines
    surname_clean = (name.split(" ")[-1] if " " in name else name).upper().replace(" ", "<")
    given_clean = (name.split(" ")[0] if " " in name else "").upper().replace(" ", "<")
    mrz_line1 = f"P<IND{surname_clean}<<{given_clean}".ljust(44, "<")

    # Format YYMMDD for MRZ
    def to_yymmdd(dt_str):
        parts = dt_str.replace("/", "-").split("-")
        if len(parts) == 3:
            return f"{parts[2][-2:]}{parts[1]}{parts[0]}"
        return "900101"

    dob_mrz = to_yymmdd(dob)
    exp_mrz = to_yymmdd(expiry)
    mrz_line2 = f"{passport_num}<0IND{dob_mrz}5M{exp_mrz}8<<<<<<<<<<<<<<02".ljust(44, "<")

    draw.text((30, height - 75), mrz_line1, fill=(20, 20, 20))
    draw.text((30, height - 45), mrz_line2, fill=(20, 20, 20))

    # Convert to bytes
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=95)
    img_bytes = buf.getvalue()

    # Add ELA noise/splice if tampered
    if tampered_text:
        nparr = np.frombuffer(img_bytes, np.uint8)
        cv_img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        # Paste a noisy block on the DOB area to create strong ELA disparity
        noise = np.random.randint(0, 50, (30, 140, 3), dtype=np.uint8)
        cv_img[180:210, 480:620] = cv2.add(cv_img[180:210, 480:620], noise)
        _, enc = cv2.imencode(".jpg", cv_img, [int(cv2.IMWRITE_JPEG_QUALITY), 95])
        img_bytes = enc.tobytes()

    return img_bytes

def init_seed_samples():
    """
    Creates and saves 3 pre-built demo scenarios for instant judge testing:
    1. sample_authentic.jpg - Pristine authentic passport (Z9876543)
    2. sample_forgery_mismatch.jpg - Scanned passport with modified DOB (Database Forgery demo)
    3. sample_photoshop_tampered.jpg - Physically spliced document with ELA anomalies
    """
    # 1. Authentic Passport
    p1 = generate_synthetic_passport_image(
        passport_num="Z9876543",
        name="RAHUL SHARMA",
        dob="15-08-1992",
        expiry="14-08-2032"
    )
    (SAMPLE_DIR / "sample_authentic.jpg").write_bytes(p1)

    # 2. Database Forgery Mismatch Passport (Scanned DOB is 15-08-1992, but fake scan claims 01-01-2000)
    p2 = generate_synthetic_passport_image(
        passport_num="Z9876543",
        name="RAHUL SHARMA",
        dob="01-01-2000",
        expiry="14-08-2032"
    )
    (SAMPLE_DIR / "sample_forgery_mismatch.jpg").write_bytes(p2)

    # 3. Photoshop Tampered Passport
    p3 = generate_synthetic_passport_image(
        passport_num="T4455667",
        name="VIKRAM SINGH",
        dob="10-12-1988",
        expiry="09-12-2028",
        tampered_text=True,
        add_photoshop_exif=True
    )
    (SAMPLE_DIR / "sample_photoshop_tampered.jpg").write_bytes(p3)

    print("[SUCCESS] Seed sample test images created in:", SAMPLE_DIR)

if __name__ == "__main__":
    init_seed_samples()
