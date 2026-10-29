# CREDEN — APAAR Based Student Data Management and Verification for AICTE Approved Institutions

> **Authoritative Technical Academic Governance Platform for AICTE Approved Institutions**  
> *Combining a distinctive horizontal floating 3D environment, minimal government aesthetic, persistent relational architecture, intake compliance calculations, duplicate detection, and tamper-evident cryptographic verification.*

---

## 1. Visual Identity & Spatial Experience

CREDEN follows the exact panoramic, floating government control environment art direction:
- **Midnight Black**: `#08090B` (Infinite spatial background)
- **Obsidian**: `#111317` (Reflective architectural floor & structures)
- **Graphite**: `#1A1D22` (Smoked glass backing)
- **Platinum**: `#D4D7DC` (Primary metallic action borders & pedestals)
- **Liquid Silver**: `#9299A3` (Muted labels & metrics)
- **Highlight Silver**: `#F1F3F5` (Readable typography)

### Signature Spatial Features
- **Continuous Horizontal Flight**: The 10 AICTE technical bureaus are arranged along the horizontal X-axis (`-18` to `+18`).
- **Interactive Camera Gliding**: Mouse wheel, trackpad, horizontal drag, or arrow keys glide the perspective camera horizontally through the world with depth parallax.
- **Floating Smoked Glass Pods & Pedestals**: Suspended architectural panels floating over illuminated circular platinum pedestals.
- **Curved Smoked Glass Cockpit HUD**: "CREDEN Overview" foreground console displaying live aggregated metrics and 5-year longitudinal trends.
- **Accessible DOM Overlays**: Clicking any 3D pod seamlessly opens its full interactive DOM workspace without taking the user away from the spatial world.
- **Graceful Accessible 2D Fallback**: 1-click toggle (`Eye` icon in top nav) for reduced motion or non-WebGL environments.

---

## 2. Core Governance Engines

### A. APAAR Validation Engine (`server/services/apaarValidator.ts`)
- **Deterministic 12-Digit Structure Validation**: Enforces Indian UIDAI/APAAR Verhoeff checksum algorithm and non-repetitive sequence constraints.
- **Cross-Institution Duplicate Detection**: Detects collisions in active academic sessions across multiple registered universities.
- **Simulated Authoritative Gateway Adapter**: Interfaces with DigiLocker / NDEAR ABC registry sandbox with verifiable transaction tokens, latencies, and explainable outcome codes.

### B. Admission & Intake Compliance Engine (`server/services/complianceEngine.ts`)
- **Approved Intake Comparison**: Audits actual admitted students against AICTE Approval Process Handbook (APH 2024-25) sanction limits.
- **Supernumerary Quotas**: Enforces specific statutory caps:
  - Tuition Fee Waiver (TFW): Maximum 5% supernumerary
  - Prime Minister's Special Scholarship Scheme (PMSSS)
  - Non-Resident Indian (NRI / OCI): Maximum 15% supernumerary
- **Excess Admission Discrepancy Generation**: Flags over-intake violations (e.g. `+4` excess admissions) and creates actionable compliance cases.

### C. Intelligent Duplicate Record Detection (`server/services/duplicateDetector.ts`)
- **Multi-Category Match Scanner**:
  - Exact APAAR collisions
  - Concurrent active enrolments across different institutions
  - Levenshtein demographic fuzzy similarity matching (name similarity $\ge 85\%$ + identical Date of Birth + identical Gender)
- **Case Dossier**: Provides side-by-side comparative views of Candidate A and Candidate B with an evidence trail and resolution actions (*False Positive*, *Revoke Duplicate*, *Escalate*).

### D. Cryptographic Verification & Certificate Support (`server/services/verificationService.ts`)
- **HMAC-SHA256 Signed Attestation**: Issues verifiable credential tokens containing canonical academic claims.
- **Minimal Disclosure**: Public and employer verifiers access strictly necessary claims (Student Name, Institution, Programme, Attestation Status) while masking sensitive identifiers.
- **Dynamic QR Code**: Printable academic credential certificates featuring real-time verification QR codes.

### E. Tamper-Evident SHA-256 Chained Audit Trail (`server/services/auditService.ts`)
- **Immutable Log Chaining**: Each audit entry is cryptographically bound to the hash of the preceding entry:
  $$\text{integrityHash} = \text{SHA-256}(\text{prevHash} \parallel \text{timestamp} \parallel \text{actor} \parallel \text{action} \parallel \text{targetId})$$
- **Chain Verification**: 1-click verification function inspects the sequential integrity of all blocks to detect tampering.

---

## 3. Pre-Configured Demonstration Personas

CREDEN provides a zero-friction **Persona Switcher** in the top navigation bar:

| Role | Name & Title | Responsibility | Demo Credentials |
| :--- | :--- | :--- | :--- |
| **AICTE Administrator** | Dr. Rajiv V. (National Director) | National oversight, intake policy, multi-institution dispute adjudication | `aicte.admin@aicte-india.org` / `CredenSecure#2024` |
| **Institution Administrator** | Prof. S. K. Raman (DTU Dean) | Manage DTU courses, approved intake, operators, batch submissions | `admin@dtu.ac.in` / `CredenSecure#2024` |
| **Data Entry Operator** | Meera Joshi (DTU Academic Officer) | Smart bulk upload assistant, row error correction, batch tracking | `operator@dtu.ac.in` / `CredenSecure#2024` |
| **Verification Officer** | S. Chandrasekhar (AICTE Verification) | Investigate duplicates, resolve concurrent admissions, hearing decisions | `officer@aicte.gov.in` / `CredenSecure#2024` |
| **National Auditor** | R. K. Mukherjee (CAG Audit) | Read-only inspection of immutable audit trail & cryptographic integrity | `auditor@cag.gov.in` / `CredenSecure#2024` |
| **Authorized Verifier** | Vikramaditya Roy (TCS Screening) | Query student claims via reference or QR code with minimal disclosure | `hr@tcs.com` / `CredenSecure#2024` |
| **Student** | Aarav Sharma | Self-service view of registered APAAR profile & verifiable certificate | `student@aicte.gov.in` / `CredenSecure#2024` |

---

## 4. Reproducible 11-Step SIH Demonstration Sequence

The interactive **SIH Demonstration Banner** at the bottom of the screen guides evaluators through the complete problem statement workflow:

1. **Sign in as Institution Administrator**: Switch to DTU Admin to view institutional courses and sanction limits.
2. **Upload Synthetic Student Batch**: Open the 7-step Bulk Upload Assistant; load sample CSV; preview schema & column mapping.
3. **Inspect APAAR Validation Engine**: Review deterministic syntax checks, Verhoeff checksums, and the DigiLocker sandbox response.
4. **Identify Intake Discrepancy Alert**: Detect `+4` excess admissions alert in B.Tech CSE exceeding the 120-seat sanction limit.
5. **Submit Error Correction**: Select student Kabir Verma (`0000-0000-0000`) and apply a valid APAAR ID to resolve the syntax error.
6. **Sign in as Verification Officer**: Switch to AICTE Central Verification Officer.
7. **Review Evidence & Resolve Duplicate**: Inspect Case `DUP-2024-0042` (Priya Sharma concurrent enrolment at DTU & COEP); apply binding resolution.
8. **Inspect Updated Dashboard Metrics**: View live recalculation of national KPI metrics and capacity utilization in the Overview HUD.
9. **Verify Permitted Record Claim (QR Code)**: Query credential token in Verification Portal with minimal disclosure; view cryptographic signature.
10. **Review Tamper-Evident Audit Trail**: Run 1-click **Verify Cryptographic Chain** to validate SHA-256 block integrity across all logged events.
11. **Export AICTE Report**: Download complete student enrolment report with audit trail logging.

---

## 5. Local Setup & Windows Development

### Prerequisites
- **Node.js**: v18.0.0 or higher (Tested on Node v24.21.0)
- **npm**: v9.0.0 or higher (Tested on npm 11.19.0)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Initialize Database & Push Schema
```bash
npx prisma generate
npx prisma db push
```

### Step 3: Seed Synthetic Demonstration Dataset
```bash
npx tsx server/seed.ts
```

### Step 4: Run Automated Verification Tests
```bash
npm test
```
*Executes all 9 Vitest integration tests covering APAAR syntax validation, cryptographic HMAC-SHA256 signing, tamper detection, intake compliance calculation, duplicate detection, and audit hash-chain integrity.*

### Step 5: Start Development Environment
```bash
# Terminal 1: Backend API (Port 5000)
npm run dev:server

# Terminal 2: Frontend Vite Client (Port 3000)
npm run dev:client
```
Access the application in your browser at: **`http://localhost:3000`**

### Step 6: Production Build & Run
```bash
npm run build
npm start
```
*Builds both the Vite client bundle and the TypeScript server, serving the complete single-port production portal at `http://localhost:5000`.*

---

## 6. Docker Deployment

```bash
# Build and start container
docker-compose up -d --build

# Inspect logs
docker-compose logs -f
```

---

## 7. Compliance & Standards
- **AICTE Approval Process Handbook (APH 2024-25)**: Automated intake and category quota monitoring.
- **Verhoeff Checksum Standard**: Indian national ID structural validation.
- **DPDP Act 2023**: Minimal claim disclosure; masked APAAR storage in public views; immutable audit logging.
- **W3C Verifiable Credentials Compatibility**: Signed HMAC-SHA256 canonical claims with verifiable QR output.
