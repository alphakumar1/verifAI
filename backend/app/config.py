import os
from pathlib import Path

class Settings:
    PROJECT_NAME: str = "MHA AI-Based Fake Identity & Document Screening System"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Blockchain Settings
    RPC_URL: str = os.getenv("RPC_URL", "http://127.0.0.1:8545")
    CHAIN_ID: int = int(os.getenv("CHAIN_ID", "31337"))
    CONTRACT_ADDRESS: str = os.getenv("CONTRACT_ADDRESS", "")
    DEFAULT_OFFICER_ID: str = "MHA_IMMIGRATION_OFFICER_042"
    
    # Cybersecurity & Cryptography
    AES_SECRET_KEY: str = os.getenv("AES_SECRET_KEY", "")
    
    # AI Thresholds
    ELA_TAMPER_THRESHOLD: float = float(os.getenv("ELA_TAMPER_THRESHOLD", "18.5"))
    FACE_MATCH_THRESHOLD: float = float(os.getenv("FACE_MATCH_THRESHOLD", "0.65"))
    
    # Paths
    BASE_DIR: Path = Path(__file__).resolve().parent.parent
    SAMPLE_DATA_DIR: Path = BASE_DIR / "sample_data"

settings = Settings()
