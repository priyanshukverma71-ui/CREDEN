# CREDEN Feature Parity Checklist (Alpha $\to$ Six)

**Status Legend:**
- [x] **Complete / Verified:** Fully integrated, tested, and aligned with CREDEN Six liquid glass design system.
- [/] **In Progress:** Partially implemented, undergoing integration.
- [ ] **Pending:** Ready for implementation.

---

## 1. Authentication & Demo Personas

- [x] **Alpha 1-Click Demo Login Personas** on `/login`:
  - AICTE Administrator (`admin@aicte-india.org` / `aicte.admin@creden.gov.in`) $\to$ Full national oversight
  - Institution Administrator (`admin@coep.ac.in` / `admin@dtu.ac.in`) $\to$ Institutional intake and roster oversight
  - Student (`student@aicte.gov.in` / `student.aarav@creden.demo`) $\to$ Aarav Sharma identity portal
  - Authorized Verifier (`verifier@infosys.com` / `hr@tcs.com`) $\to$ Third-party employer portal
- [x] **In-App Role Switcher** in Spatial Top Capsule with instant state switching across all 7 personas.
- [x] **Session persistence** with `localStorage` tokens.

---

## 2. Navigation & Layout Architecture

- [x] **Liquid-Glass Spatial Environment** with 3D Circular Carousel.
- [x] **VisionOS Spatial Top Capsule** (Address bar, back/forward, quick search, notifications, persona).
- [x] **VisionOS Spatial Bottom Dock** (Direct module launcher).
- [x] **Stable Liquid-Glass Workspace Windows** (Clean, blur-free typography, Esc to close).
- [x] **URL Sync & Direct Deep Linking** (Query param / hash syncing with active workspace).

---

## 3. Institution Oversight (`/institutions`)

- [x] **Institutions Directory Table** with search and State / Type filters.
- [x] **Institution Detail View (`/institutions/:id`)**:
  - Institutional KPI metrics (Total Students, Intake Capacity, Utilization Rate %, Validation Score %).
  - Programme-level approved intake vs. enrolled seats (B.Tech CSE, ECE, Mech) with status (`NORMAL`, `EXCEEDED`).
  - Recent Ingestion Batches table with valid count, issues count, and review status.
  - Active Discrepancy Queue with 1-click issue adjudication.

---

## 4. Student Data Registry (`/students`)

- [x] **Student Directory** with search, filters (Institution, Validation Status, Programme).
- [x] **Student Profile Modal / View**:
  - Personal info, masked APAAR ID, academic credits, CGPA, Enrolment status.
  - Verhoeff checksum validity badge.
- [x] **Edit Student Details Workflow** with mandatory regulatory reason logging.
- [x] **CSV Directory Export**.

---

## 5. Bulk Data Ingestion & Pre-Validation (`/submissions`)

- [x] **Session & Standard selection** (APH 2024-25 §4).
- [x] **Official CSV Template Download** (`/api/v1/upload/template`).
- [x] **Drag-and-drop CSV Upload** & column mapping wizard.
- [x] **Pre-Validation Simulation Engine**:
  - Real-time row-by-row Verhoeff checksum checking.
  - Duplicate APAAR within-batch and across-institution check.
  - Approved intake breach warnings.
  - Actionable error highlights before committing to database.

---

## 6. APAAR Validation & Anomaly Review (`/validation`)

- [x] **Anomaly counters** (Total Anomalies, Critical Violations, Warnings, Resolved).
- [x] **Severity & Rule filters** (`RULE_A`, `RULE_B`, `RULE_C`, `RULE_D`).
- [x] **Interactive Issue Review Dialog**:
  - Evidence inspection and risk score (e.g. 92/100).
  - Adjudication actions: *Approve Override*, *Reject Record*, *Request Clarification*.
  - Persistent resolution notes logging.

---

## 7. Admission Monitoring & Policy Simulator (`/admissions`)

- [x] **Approved Intake Capacity vs. Actual Enrolment** tracking.
- [x] **Interactive Policy Simulator**:
  - Dual threshold sliders: Warning Threshold (70%-98%) and Excess Threshold (95%-115%).
  - Live "Run Simulation" trigger calling `/api/v1/reports/simulate-policy`.
  - Impact analysis display showing evaluated programmes, near-capacity count, excess breach count, and regulatory narrative.

---

## 8. Third-Party Controlled Verification (`/verification`)

- [x] **Multi-mode Verification**: Query by APAAR ID, Student Roll Number, or Digital Certificate ID.
- [x] **Zero-Knowledge Credential Card**:
  - Masked ID, institution name, programme, academic year, validation score (98%).
  - Tamper-evident SHA-256 seal status.
  - QR code attestation preview & printable verification report slip.

---

## 9. National Analytics & Forecasting (`/analytics`)

- [x] **Year-over-Year Progression** (2024-25 vs 2025-26 with +15.3% expansion).
- [x] **Supernumerary & Special Quotas Breakdown** (TFW, EWS, PMSSS, NRI, Foreign Nationals).
- [x] **Simulated 5-Year Academic Enrolment Projections** (ARIMA model historical actuals + projected trajectory).
- [x] **Data Quality Index**.

---

## 10. Statutory Reports (`/reports`)

- [x] **Standard AICTE Report Downloads**:
  - `REP-01`: *National AICTE Intake Compliance Summary AY 2025-26*.
  - `REP-02`: *State-wise APAAR Validation Matrix*.
  - `REP-03`: *Supernumerary Quotas & Special Categories Audit*.
- [x] **Custom Report Generator Modal** with domain selection and format export (PDF, CSV, JSON).

---

## 11. Audit Logs & Security (`/audit-logs`)

- [x] **Cryptographically Chained Audit Ledger** with actor, action, resource, IP address, and timestamp.
- [x] **Search & Filters** by actor and action type.
- [x] **SHA-256 Chain Verification Action** proving 0 tampering.

---

## 12. Standout Innovation — CREDEN TrustGraph™

- [x] **Interactive 3D Entity Relationship Graph** (Institutions $\leftrightarrow$ Submissions $\leftrightarrow$ Students $\leftrightarrow$ Issues).
- [x] **Explainable Duplicate Conflict Radar**.
- [x] **Transparent Data Quality Score Breakdown**.
- [x] **Immutable Record Provenance Timeline**.

---

## 13. Backend & API Services

- [x] **Unified `/api/v1` API Endpoints & Client** supporting all Alpha contracts with resilient fallbacks.
- [x] **Policy Simulation Endpoint** (`/api/v1/reports/simulate-policy`).
- [x] **Template Download Endpoint** (`/api/v1/upload/template`).
- [x] **Demo Accounts & Reset Endpoints** (`/api/v1/demo/accounts`, `/api/v1/demo/reset`).
