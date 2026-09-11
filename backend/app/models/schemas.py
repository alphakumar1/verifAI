from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class PassportDataSchema(BaseModel):
    passport_number: str = Field(..., description="Unique passport identifier")
    name: str = Field(..., description="Full name of the document holder")
    date_of_birth: str = Field(..., description="Date of birth in DD-MM-YYYY format")
    expiry_date: str = Field(..., description="Document expiry date in DD-MM-YYYY format")
    nationality: str = Field(default="IND", description="ISO Country code or nationality")
    gender: Optional[str] = Field(default="Male", description="Gender of holder")
    extraction_method: Optional[str] = Field(default="ICAO_MRZ_AND_OCR")

class ExifAnalysisSchema(BaseModel):
    has_exif: bool
    suspicious_software_detected: bool
    detected_software: Optional[str] = None
    is_tampered_metadata: bool
    exif_summary: Dict[str, Any] = {}
    alerts: List[str] = []

class ElaAnalysisSchema(BaseModel):
    ela_score: float
    threshold: float
    is_tampered_ela: bool
    mean_error: float
    max_error: float
    std_error: float
    heatmap_base64: Optional[str] = None
    status: str

class TamperingResultSchema(BaseModel):
    is_tampered: bool
    verdict: str
    tampering_reasons: List[str] = []
    exif_analysis: ExifAnalysisSchema
    ela_analysis: ElaAnalysisSchema

class FaceVerificationSchema(BaseModel):
    is_matched: bool
    match_confidence: float
    distance: float
    threshold: float
    doc_face_crop_base64: Optional[str] = None
    live_face_detected: bool
    doc_face_detected: bool
    engine: Optional[str] = None
    status: str
    message: Optional[str] = None

class DocumentVersionSchema(BaseModel):
    version_index: int
    encrypted_data: str
    decrypted_data: Optional[Dict[str, Any]] = None
    timestamp: int
    formatted_date: str
    officer_id: str
    data_hash: str

class ScanResponseSchema(BaseModel):
    status: str # AUTHENTIC_NEW, AUTHENTIC_EXISTING, TAMPERED_PHYSICAL, TAMPERED_BLOCKCHAIN_MISMATCH, VALIDATION_ERROR
    verdict_badge: str # "AUTHENTIC & SECURED", "TAMPERED DATABASE DETECTED", "FORGERY DETECTED"
    passport_number: str
    scanned_data: Dict[str, Any]
    validation_passed: bool
    validation_errors: List[str] = []
    tampering_check: TamperingResultSchema
    face_verification: FaceVerificationSchema
    
    # Blockchain Ledger Details
    is_blockchain_verified: bool
    blockchain_version: Optional[int] = None
    transaction_hash: Optional[str] = None
    block_number: Optional[int] = None
    audit_trail: List[DocumentVersionSchema] = []
    
    # Diff structure for tampering comparison
    has_diff: bool = False
    diff_details: Optional[Dict[str, Any]] = None
    ground_truth_version_1: Optional[Dict[str, Any]] = None
    
    officer_id: str
    scanned_at: str

class SeedRegisterRequest(BaseModel):
    passport_number: str
    name: str
    date_of_birth: str
    expiry_date: str
    nationality: str = "IND"
    gender: str = "Male"
    officer_id: Optional[str] = "MHA_ADMIN_SEED"
