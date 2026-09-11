import io
import base64
import numpy as np
import cv2
from PIL import Image, ExifTags
from typing import Dict, Any, List, Tuple

SUSPICIOUS_SOFTWARE_KEYWORDS = [
    "photoshop", "gimp", "canva", "pixlr", "lightroom",
    "photopea", "paint.net", "coreldraw", "snapseed", "picsart",
    "affinity", "illustrator", "editor", "manipulation"
]

def analyze_exif_metadata(image_bytes: bytes) -> Dict[str, Any]:
    """
    Extracts and evaluates EXIF metadata for signatures of image editing tools,
    creation-modification timestamp disparities, and software tags.
    """
    findings = {
        "has_exif": False,
        "suspicious_software_detected": False,
        "detected_software": None,
        "is_tampered_metadata": False,
        "exif_summary": {},
        "alerts": []
    }

    try:
        pil_img = Image.open(io.BytesIO(image_bytes))
        exif_raw = pil_img.getexif()
        
        if not exif_raw:
            findings["alerts"].append("No EXIF metadata present (Typical of stripped web images or screenshots).")
            return findings

        findings["has_exif"] = True
        exif_dict = {}

        for tag_id, value in exif_raw.items():
            tag_name = ExifTags.TAGS.get(tag_id, str(tag_id))
            # Format value to string safely
            if isinstance(value, bytes):
                try:
                    value = value.decode("utf-8", errors="ignore")
                except Exception:
                    value = str(value)
            exif_dict[tag_name] = str(value)

        findings["exif_summary"] = {k: v for k, v in exif_dict.items() if k in [
            "Software", "Make", "Model", "DateTime", "DateTimeOriginal", "Artist", "HostComputer"
        ]}

        # Check for suspicious editing software
        software_field = exif_dict.get("Software", "").lower()
        host_comp = exif_dict.get("HostComputer", "").lower()
        combined_text = f"{software_field} {host_comp}"

        for keyword in SUSPICIOUS_SOFTWARE_KEYWORDS:
            if keyword in combined_text:
                findings["suspicious_software_detected"] = True
                findings["detected_software"] = exif_dict.get("Software") or keyword
                findings["is_tampered_metadata"] = True
                findings["alerts"].append(
                    f"⚠️ Image Editing Software Signature Detected: '{findings['detected_software']}'"
                )
                break

        # Check for timestamp anomalies if available
        dt_mod = exif_dict.get("DateTime")
        dt_orig = exif_dict.get("DateTimeOriginal")
        if dt_mod and dt_orig and dt_mod != dt_orig:
            findings["alerts"].append(f"Noticeable mismatch between Original ({dt_orig}) and Modified ({dt_mod}) timestamps.")

    except Exception as e:
        findings["alerts"].append(f"EXIF parsing error: {str(e)}")

    return findings

def perform_error_level_analysis(
    image_bytes: bytes, 
    quality: int = 90, 
    scale: int = 15,
    threshold: float = 18.5
) -> Dict[str, Any]:
    """
    Performs Error Level Analysis (ELA) on the uploaded document image:
    1. Recompresses the image as JPEG at specified quality in memory.
    2. Computes the pixel-level absolute difference with the original.
    3. Amplifies the difference scale to reveal compression artifacts.
    4. Detects localized high-frequency error spikes (spliced text/altered numbers).
    5. Produces a Jet-colormap heatmap in base64 format for visual forensic inspection.
    """
    try:
        # Load image into OpenCV
        nparr = np.frombuffer(image_bytes, np.uint8)
        orig_img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if orig_img is None:
            raise ValueError("Unable to decode input image for ELA analysis.")

        # Recompress to in-memory JPEG
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), quality]
        _, enc_img = cv2.imencode('.jpg', orig_img, encode_param)
        resaved_img = cv2.imdecode(enc_img, cv2.IMREAD_COLOR)

        # Calculate absolute difference
        diff = cv2.absdiff(orig_img, resaved_img)
        diff_scaled = np.clip(diff * scale, 0, 255).astype(np.uint8)

        # Compute error metrics on grayscale
        diff_gray = cv2.cvtColor(diff_scaled, cv2.COLOR_BGR2GRAY)
        mean_val = float(np.mean(diff_gray))
        max_val = float(np.max(diff_gray))
        std_val = float(np.std(diff_gray))

        # 95th percentile error level
        p95_val = float(np.percentile(diff_gray, 95))

        # Normalized anomaly score (0 - 100%)
        # Normal unmanipulated documents typically have uniform low-to-medium ELA variance
        ela_score = round(min(100.0, (std_val * 1.8 + p95_val * 0.4)), 2)
        is_tampered_ela = ela_score >= threshold

        # Generate Jet colormap forensic heatmap
        heatmap_colored = cv2.applyColorMap(diff_gray, cv2.COLORMAP_JET)
        
        # Blend original with heatmap for context (30% original, 70% heatmap)
        blended = cv2.addWeighted(orig_img, 0.35, heatmap_colored, 0.65, 0)

        # Encode heatmap to base64 JPEG
        _, heatmap_buffer = cv2.imencode('.jpg', blended, [int(cv2.IMWRITE_JPEG_QUALITY), 88])
        heatmap_base64 = base64.b64encode(heatmap_buffer).decode('utf-8')

        return {
            "ela_score": ela_score,
            "threshold": threshold,
            "is_tampered_ela": is_tampered_ela,
            "mean_error": round(mean_val, 2),
            "max_error": round(max_val, 2),
            "std_error": round(std_val, 2),
            "heatmap_base64": f"data:image/jpeg;base64,{heatmap_base64}",
            "status": "TAMPERED_ELA" if is_tampered_ela else "CLEAN_ELA"
        }

    except Exception as e:
        return {
            "ela_score": 0.0,
            "threshold": threshold,
            "is_tampered_ela": False,
            "error": str(e),
            "heatmap_base64": None,
            "status": "ERROR"
        }

def evaluate_document_tampering(image_bytes: bytes) -> Dict[str, Any]:
    """
    Combined tamper screening: EXIF metadata + OpenCV Error Level Analysis.
    """
    exif_res = analyze_exif_metadata(image_bytes)
    ela_res = perform_error_level_analysis(image_bytes)

    reasons = []
    if exif_res.get("is_tampered_metadata"):
        reasons.append(f"EXIF signature indicates editing via {exif_res.get('detected_software')}")
    if ela_res.get("is_tampered_ela"):
        reasons.append(f"High compression variance detected in ELA ({ela_res.get('ela_score')}% > threshold {ela_res.get('threshold')}%)")

    is_overall_tampered = bool(exif_res.get("is_tampered_metadata") or ela_res.get("is_tampered_ela"))

    return {
        "is_tampered": is_overall_tampered,
        "verdict": "PHYSICAL_TAMPERING_DETECTED" if is_overall_tampered else "PHYSICALLY_AUTHENTIC",
        "tampering_reasons": reasons,
        "exif_analysis": exif_res,
        "ela_analysis": ela_res
    }
