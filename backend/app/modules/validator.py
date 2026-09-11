import re
from datetime import datetime
from typing import Dict, Any, List, Tuple

ICAO_WEIGHTS = [7, 3, 1]

def calculate_mrz_checksum(data_str: str) -> int:
    """
    Calculates ICAO Doc 9303 check digit with 7-3-1 weight pattern.
    < = 0, 0-9 = 0-9, A-Z = 10-35
    """
    total = 0
    clean_str = data_str.upper().replace("<", "0")
    for i, char in enumerate(clean_str):
        if char.isdigit():
            val = int(char)
        elif 'A' <= char <= 'Z':
            val = ord(char) - ord('A') + 10
        else:
            val = 0
        weight = ICAO_WEIGHTS[i % 3]
        total += val * weight
    return total % 10

def parse_date_flexibly(date_str: str) -> datetime:
    """
    Parses date strings across various standard formats (DD/MM/YYYY, YYYY-MM-DD, DD-MM-YYYY, YYMMDD).
    """
    if not date_str:
        return None
    
    clean = date_str.strip().replace(".", "-").replace("/", "-")
    formats = [
        "%d-%m-%Y", "%Y-%m-%d", "%d-%m-%y", "%Y/%m/%d",
        "%d %b %Y", "%d %B %Y", "%y%m%d"
    ]
    for fmt in formats:
        try:
            return datetime.strptime(clean, fmt)
        except ValueError:
            continue
    return None

def validate_passport_data(data: Dict[str, Any]) -> Tuple[bool, List[str], Dict[str, Any]]:
    """
    Validates passport fields extracted from OCR:
    1. Passport number format (ICAO alphanumeric pattern)
    2. Date of Birth logic (valid past date, age > 0)
    3. Expiry Date logic (expiry > DOB)
    4. Mandatory fields presence
    """
    errors = []
    metadata = {}
    
    passport_number = str(data.get("passport_number", "")).strip().upper()
    name = str(data.get("name", "")).strip()
    dob_str = str(data.get("date_of_birth", "")).strip()
    expiry_str = str(data.get("expiry_date", "")).strip()
    nationality = str(data.get("nationality", "IND")).strip().upper()

    # 1. Passport Number Format Check
    # Matches international standard (1 letter + 7-8 digits) or generic 8-9 char alphanumeric
    passport_regex = r"^[A-Z][0-9]{7,8}$|^[A-Z0-9]{8,9}$"
    if not passport_number:
        errors.append("Passport Number is missing.")
    elif not re.match(passport_regex, passport_number):
        errors.append(f"Passport Number '{passport_number}' does not match standard ICAO format (e.g. A1234567).")
    else:
        metadata["passport_format_valid"] = True

    # 2. Name Check
    if not name or len(name) < 2:
        errors.append("Full Name is invalid or missing.")
    elif re.search(r"[0-9!@#$%^&*()_+=\[\]{};:\"\\|,.<>?]", name):
        errors.append("Full Name contains invalid numerical or special characters.")

    # 3. Date of Birth Validation
    dob_dt = parse_date_flexibly(dob_str)
    if not dob_str:
        errors.append("Date of Birth is missing.")
    elif not dob_dt:
        errors.append(f"Date of Birth '{dob_str}' cannot be parsed into a valid date.")
    else:
        now = datetime.now()
        if dob_dt > now:
            errors.append(f"Date of Birth '{dob_str}' is in the future.")
        age = (now - dob_dt).days // 365
        if age > 120 or age < 0:
            errors.append(f"Calculated age ({age} years) is outside biologically plausible range.")
        metadata["calculated_age"] = age

    # 4. Expiry Date Validation
    exp_dt = parse_date_flexibly(expiry_str)
    if not expiry_str:
        errors.append("Expiry Date is missing.")
    elif not exp_dt:
        errors.append(f"Expiry Date '{expiry_str}' cannot be parsed into a valid date.")
    else:
        if dob_dt and exp_dt <= dob_dt:
            errors.append(f"Expiry Date ({expiry_str}) cannot be on or before Date of Birth ({dob_str}).")
        is_expired = exp_dt < datetime.now()
        metadata["is_expired"] = is_expired

    is_valid = len(errors) == 0
    return is_valid, errors, metadata
