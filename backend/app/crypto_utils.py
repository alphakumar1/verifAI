import os
import json
import hashlib
from pathlib import Path
from typing import Dict, Any, Union
from cryptography.fernet import Fernet, InvalidToken

KEY_FILE_PATH = Path(__file__).resolve().parent / "secret.key"

def get_or_create_key() -> bytes:
    """
    Retrieves the AES-256 / Fernet key from environment or local secret.key file.
    Generates and persists a new cryptographically secure 256-bit key if none exists.
    """
    env_key = os.getenv("AES_SECRET_KEY")
    if env_key:
        return env_key.encode("utf-8")
    
    if KEY_FILE_PATH.exists():
        with open(KEY_FILE_PATH, "rb") as key_file:
            return key_file.read().strip()
    
    # Generate new high-entropy 256-bit symmetric key
    new_key = Fernet.generate_key()
    with open(KEY_FILE_PATH, "wb") as key_file:
        key_file.write(new_key)
    return new_key

_FERNET_KEY = get_or_create_key()
_FERNET_CIPHER = Fernet(_FERNET_KEY)

def encrypt_data(data: Union[Dict[str, Any], str], custom_key: bytes = None) -> str:
    """
    Encrypts a JSON dictionary or raw string using AES symmetric encryption (Fernet).
    Returns a secure URL-safe base64 encoded ciphertext string.
    """
    if isinstance(data, dict):
        # Canonical JSON string with sorted keys to ensure deterministic representation
        json_str = json.dumps(data, sort_keys=True, ensure_ascii=False)
    else:
        json_str = str(data)
    
    cipher = Fernet(custom_key) if custom_key else _FERNET_CIPHER
    encrypted_bytes = cipher.encrypt(json_str.encode("utf-8"))
    return encrypted_bytes.decode("utf-8")

def decrypt_data(encrypted_string: str, custom_key: bytes = None) -> Dict[str, Any]:
    """
    Decrypts an AES-Fernet encrypted ciphertext string and reconstructs the JSON dictionary.
    Raises ValueError if decryption fails or token is tampered.
    """
    cipher = Fernet(custom_key) if custom_key else _FERNET_CIPHER
    try:
        decrypted_bytes = cipher.decrypt(encrypted_string.encode("utf-8"))
        decrypted_str = decrypted_bytes.decode("utf-8")
        try:
            return json.loads(decrypted_str)
        except json.JSONDecodeError:
            return {"raw_data": decrypted_str}
    except InvalidToken:
        raise ValueError("Cryptographic Decryption Failed: Invalid key or tampered ciphertext token!")

def compute_sha256_hash(data: Union[Dict[str, Any], str, bytes]) -> str:
    """
    Generates a SHA-256 cryptographic digest for integrity verification.
    """
    if isinstance(data, dict):
        content = json.dumps(data, sort_keys=True, ensure_ascii=False).encode("utf-8")
    elif isinstance(data, str):
        content = data.encode("utf-8")
    else:
        content = data
    return hashlib.sha256(content).hexdigest()
