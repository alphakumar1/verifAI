# 🛡️ AI-Based Fake Identity & Document Screening System
### Problem Statement ID: 26188 | Ministry of Home Affairs (MHA)
**Theme:** Blockchain & Cybersecurity | **Architecture:** 3-Tier Multi-Layer Defense

---

## 🌟 Executive Summary & Pitch

In modern border control, immigration, and national security checkpoints, forged documents and unauthorized central database manipulations pose severe national security risks. 

This system provides an end-to-end, hardware-accelerated screening terminal that combines:
1. **Multi-Module AI Forensic Engine** (OCR, ICAO Doc 9303 MRZ parsing, EXIF inspection, OpenCV Error Level Analysis, Biometric Face Verification).
2. **Cybersecurity Cryptography Layer** (AES-256 Fernet payload encryption with SHA-256 tamper-evident integrity hashes).
3. **Immutable Blockchain Ledger** (Solidity Smart Contract on Ethereum/Hardhat providing tamper-proof audit trails).

---

## 🏛️ The 3-Tier Architecture & The "Magic Logic"

```
                                  ┌─────────────────────────────────────────────────────┐
                                  │   BORDER SCREENING TERMINAL (APPLE LIGHT MODE)      │
                                  │       • macOS / iPadOS Enterprise Design System     │
                                  │       • Segmented Control & Clean Dual Ingestion    │
                                  │       • 3-Second High-Clarity Diff View & Ledger    │
                                  └──────────────────────────┬──────────────────────────┘
                                                             │
                                                             ▼
                                  ┌─────────────────────────────────────────────────────┐
                                  │               FASTAPI GATEWAY / ENGINE              │
                                  └──────────┬───────────────────────────────┬──────────┘
                                             │                               │
                      ┌──────────────────────┴───────┐       ┌───────────────┴──────────────────────┐
                      ▼                              ▼       ▼                                      ▼
            ┌───────────────────┐          ┌───────────────────┐ ┌───────────────────┐    ┌───────────────────┐
            │   AI MODULE 1     │          │    AI MODULE 2    │ │    AI MODULE 3    │    │    AI MODULE 4    │
            │ EasyOCR + MRZ TD3 │          │  Regex Validation │ │  EXIF & OpenCV    │    │  Biometric Face   │
            │  (ICAO Doc 9303)  │          │   & Date Logic    │ │    ELA Heatmap    │    │   Cosine Match    │
            └───────────────────┘          └───────────────────┘ └───────────────────┘    └───────────────────┘
                                                             │
                                                             ▼
                                  ┌─────────────────────────────────────────────────────┐
                                  │       CYBERSECURITY & CRYPTOGRAPHY LAYER            │
                                  │       • AES-256 Fernet Payload Symmetric Cipher     │
                                  │       • SHA-256 Payload Fingerprint & Integrity     │
                                  └──────────────────────────┬──────────────────────────┘
                                                             │
                                                             ▼
                                  ┌─────────────────────────────────────────────────────┐
                                  │           BLOCKCHAIN IMMUTABLE AUDIT LEDGER         │
                                  │       • Solidity Smart Contract (DocumentLedger.sol)│
                                  │       • getHistory(passportNumber) Verification     │
                                  └─────────────────────────────────────────────────────┘
```

### 🔮 The "Magic Logic" Flow:
1. **Physical Tamper Screening:** The uploaded document is inspected for editing software signatures (Photoshop, Canva, GIMP) and subjected to **Error Level Analysis (ELA)** to catch spliced visual zones.
2. **OCR & Validation:** Optical character recognition extracts passport number, full name, DOB, and expiry date via ICAO 9303 MRZ decoding.
3. **Blockchain Truth Comparison:**
   - **No Record on Chain:** Encrypts data with AES-256, writes to smart contract as **Version 1 (Genesis)**, and awards **"Authentic & Secured"** status.
   - **Record Exists on Chain:** Retrieves all historical versions from the blockchain, decrypts Version 1, and performs field-by-field canonical comparison against the scanned document.
   - **Match:** Awards **"Authentic (Verified against Immutable Ledger)"**.
   - **Mismatch (e.g. Altered DOB in Database or Document):** Immediately triggers **"🚨 TAMPERED DATABASE RECORD / FORGERY DETECTED"** and renders the **Apple-grade Side-by-Side Diff View** proving the forgery!

---

## 📂 Project Structure

```
sih prototype/
├── blockchain/                      # Layer 1: Solidity Smart Contract
│   ├── contracts/
│   │   └── DocumentLedger.sol       # Multi-version immutable document ledger
│   ├── scripts/
│   │   └── deploy.js                # Auto-deployment and config exporter
│   ├── test/
│   │   └── DocumentLedger.test.js   # Hardhat automated test suite
│   ├── hardhat.config.js            # Network & compiler configuration
│   └── package.json
│
├── backend/                         # Layer 2 & 3: AI Engine + Crypto + API
│   ├── app/
│   │   ├── main.py                  # FastAPI server & screening endpoints
│   │   ├── config.py                # System settings & thresholds
│   │   ├── crypto_utils.py          # AES-256 Fernet & SHA-256 utilities
│   │   ├── blockchain_client.py     # Web3.py smart contract connector
│   │   ├── seed_data.py             # Synthetic test passport generator
│   │   ├── models/
│   │   │   └── schemas.py           # Pydantic data schemas
│   │   └── modules/
│   │       ├── ocr_engine.py        # EasyOCR & ICAO MRZ TD3 parser
│   │       ├── validator.py         # Format regex & chronological date validator
│   │       ├── tampering_detector.py# EXIF metadata & OpenCV ELA Heatmap generator
│   │       └── face_verifier.py     # Portrait crop & Biometric Face Matcher
│   ├── sample_data/                 # Pre-generated sample test images
│   └── requirements.txt
│
├── frontend/                        # Apple-Grade React Dashboard
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Real-time telemetry status & officer badge
│   │   │   ├── DemoPresets.jsx      # 1-Click instant test scenarios for judges
│   │   │   ├── DocumentScanner.jsx  # Passport dropzone & live webcam capture
│   │   │   ├── ScanRadarAnimation.jsx# Laser scan radar overlay with telemetry
│   │   │   ├── VerificationResult.jsx# Green authentic pass card with Tx Hash
│   │   │   ├── TamperingDiffView.jsx# Red Side-by-Side Forgery Diff View
│   │   │   ├── ElaViewerModal.jsx   # Jet-colormap ELA forensic heatmap inspector
│   │   │   └── BlockchainLedgerAudit.jsx # Immutable version timeline drawer
│   │   ├── App.jsx                  # Main application orchestrator
│   │   └── index.css                # Glassmorphism & Apple UI tokens
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

---

## ⚡ Quick Start & Run Instructions (Step-by-Step)

### Terminal 1: Start Blockchain Node & Deploy Contract

```bash
# Navigate to blockchain directory
cd blockchain

# Start local Hardhat Ethereum Node (Port 8545)
npx.cmd hardhat node

# In a separate terminal or after node starts, deploy the contract:
npx.cmd hardhat run scripts/deploy.js --network localhost
```

---

### Terminal 2: Start FastAPI Backend Engine

```bash
# Navigate to backend directory
cd backend

# Start the high-performance FastAPI server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
*Swagger API Documentation is live at:* `http://127.0.0.1:8000/docs`

---

### Terminal 3: Start Apple-Grade React Dashboard

```bash
# Navigate to frontend directory
cd frontend

# Launch Vite dev server
npm.cmd run dev
```
*Open your browser at:* `http://localhost:5173`

---

## 🧪 1-Click Evaluation Scenarios for Judges

The terminal includes 3 pre-configured demo presets at the top for instant presentation:

| Scenario | Trigger | Outcome |
| :--- | :--- | :--- |
| **✨ Authentic Passport** | Click *Authentic Passport* | Passes all 4 AI modules, verifies against Blockchain Version 1 -> **Green Authentic Card** with Transaction Hash & Confetti. |
| **🚨 Altered DOB Forgery** | Click *Database Forgery* | AI scans document claiming DOB is `01-01-2000`, but Blockchain Ledger Version 1 proves original truth was `15-08-1992` -> Triggers **Red Side-by-Side Diff View**! |
| **⚠️ Photoshop Spliced Image** | Click *Photoshop Splicing* | OpenCV Error Level Analysis catches high compression variance (24.8% > 18.5%) -> Opens **Interactive ELA Heatmap Modal**. |

---

## 🔒 Cybersecurity Specifications

- **Payload Cipher:** AES-256 Symmetric Authenticated Encryption (`cryptography.fernet`).
- **Integrity Digest:** SHA-256 canonical digest stored in smart contract `dataHash`.
- **Zero Centralized Vulnerability:** Even if an attacker compromises the central SQL database, any altered field fails the immutable blockchain cross-check.
- **Biometrics:** Normalized facial embeddings with anti-spoofing liveness indicators.

---

### 🇮🇳 Developed for Smart India Hackathon (Problem Statement 26188 - Ministry of Home Affairs)
# verifAI
