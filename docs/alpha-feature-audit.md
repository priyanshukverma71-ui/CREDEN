# CREDEN Alpha — Comprehensive Feature Audit

**Audit Date:** October 29, 2026  
**Reference Application:** https://creden-alpha.vercel.app/  
**Target Application:** CREDEN Six (https://creden-six.vercel.app/)  
**Auditor:** Full-Stack Architect & Smart India Hackathon Technical Mentor

---

## 1. Executive Summary

CREDEN Alpha represents a specialized AICTE-aligned academic governance, student identity verification, and intake compliance platform. Built around the core mission of **The Unified Academic Trust Operating System**, it operationalizes statutory AICTE Approval Process Handbook (APH 2024-25 §4) standards, APAAR ID (Automated Permanent Academic Account Registry) Verhoeff validation, cross-institutional concurrent enrollment detection, and privacy-preserving credential attestation.

This audit catalogues every accessible page, component, user role, data contract, workflow, and user interaction discovered in CREDEN Alpha to ensure 100% feature parity in CREDEN Six.

---

## 2. User Roles & Permission Model

Alpha implements a 4-tier Role-Based Access Control (RBAC) model with pre-configured demo personas:

| Role ID | Role Title | Demo Account | Scoped Capabilities |
| :--- | :--- | :--- | :--- |
| `AICTE_ADMIN` | National AICTE Administrator | `aicte.admin@creden.gov.in` (`admin@aicte-india.org`) | Full national telemetry, cross-institution duplicate review, intake sanction enforcement, policy simulation, statutory reporting. |
| `INSTITUTION_ADMIN` | Institution Administrator (e.g., COEP Tech Univ / DTU) | `admin@coep.ac.in` | Institutional profile management, batch student data ingestion, intake quota utilization, local discrepancy review. |
| `STUDENT` | Student Portal | `student.aarav@creden.demo` (`aarav.sharma@student.creden.in`) | Self-identity card, masked APAAR ID status, academic credits, CGPA record, verifiable credential QR. |
| `VERIFIER` | Authorized Third-Party Verifier (Employer / BGV) | `verifier@infosys.demo` (`verifier@infosys.com`) | Zero-knowledge credential verification by APAAR or Student ID, tamper validation, verification report export. |

---

## 3. Route & Page Inventory

### 3.1 Public Routes

#### 1. Landing Page (`/`)
- **Purpose:** Public portal entry, problem statement presentation, high-level architecture overview, and demo persona preview.
- **Components:**
  - Hero banner with headline: *"CREDEN — The Unified Academic Trust Operating System"*.
  - Mode toggle: 3D High Performance vs. Lite GPU Mode.
  - Six Core Challenge Cards:
    1. *Inconsistent Data Submissions* (Unstandardized CSV/XLSX formats).
    2. *Missing & Malformed Identifiers* (Non-Verhoeff compliant APAAR IDs).
    3. *Duplicate & Concurrent Enrolments* (Students registered in multiple colleges simultaneously).
    4. *Approved Intake Breaches* (Colleges admitting beyond AICTE sanctioned caps).
    5. *Limited Real-Time Visibility* (Lag in annual regulatory reporting).
    6. *Third-Party Verification Friction* (Slow, manual employer credential checks).
  - Eight Capability Cards:
    1. *Explainable Duplicate Detection* (Fuzzy string distance + SHA-256 HMAC match).
    2. *Approved Intake Monitoring* (Real-time seat count vs. APH §4 caps).
    3. *Data Quality Scoring* (Composite index based on completeness, uniqueness, and validity).
    4. *Controlled Verification Portal* (Zero-knowledge privacy-preserving attestation).
    5. *Multi-Format Bulk Ingestion* (CSV/XLSX with Verhoeff pre-validation).
    6. *HMAC Identifier Fingerprinting* (Salted hashes preventing raw APAAR exposure in logs).
    7. *Interactive Policy Simulator* (What-if scenario modeling for warning & excess thresholds).
    8. *REST Integration Gateway* (Versioned `/api/v1` OpenAPI 3.0 endpoints).
  - 4-Persona Demo Selector: Instant preview of dashboard views tailored to AICTE Admin, Institution Admin, Student, and Verifier.
  - Architecture breakdown: Data Flow from Institution $\to$ CREDEN Engine $\to$ DigiLocker/ABC Gateway $\to$ Regulators.

#### 2. Authentication Page (`/login`)
- **Purpose:** Secure access with standard credentials or 1-click Demo Persona entry.
- **Components:**
  - Email and password input form.
  - Quick 1-click Demo Persona buttons (AICTE Admin, Institution Admin, Student, Verifier).
  - Security reassurance: *"Authorized access only under AICTE Governance Framework"*.

---

### 3.2 Authenticated Dashboard Shell (`/dashboard/*`)

All authenticated routes share a layout containing:
- Collapsible sidebar navigation.
- Header with search, persona switcher dropdown, notification centre popover, and demo reset action.
- Breadcrumb trail and contextual action buttons.

#### 3. Overview Dashboard (`/dashboard`)
- **Purpose:** Executive governance cockpit displaying national or institutional operational metrics.
- **Role Scoping:**
  - *AICTE Admin:* Total institutions (6+), total students (1,522+), monthly submissions, national APAAR pass rate (98.4%), duplicate flags (2), over-intake breaches (2).
  - *Institution Admin:* Total enrolled students, sanctioned capacity, APAAR pass rate, pending anomaly flags.
  - *Student:* CGPA, credits earned vs. required, Identity Trust Score (98/100).
  - *Verifier:* Candidates screened, verified authentic, tamper alerts, active requests.

#### 4. Institutions Directory & Detail (`/institutions`, `/institutions/:id`)
- **Purpose:** Comprehensive oversight of AICTE-approved technical institutions.
- **Directory Features:**
  - Search by institution name, code, or city.
  - Filters: State (Maharashtra, Delhi, Karnataka, Tamil Nadu, etc.), Institution Type (State Technical University, Central University, Autonomous College).
  - Metric cards: Approved Intake, Enrolled, Utilization %, Validation Score %, Flagged Records count.
- **Detail View (`/institutions/:id`):**
  - Institutional profile: Code, address, approved year, accreditation (NAAC A++, NBA).
  - Programme-Level Intake Breakdown Table:
    - B.Tech CSE: 120 Approved, 128 Enrolled $\to$ `EXCEEDED` (+8 breach).
    - B.Tech ECE: 90 Approved, 84 Enrolled $\to$ `NORMAL`.
    - B.Tech Mechanical: 90 Approved, 72 Enrolled $\to$ `NORMAL`.
  - Ingestion Batches History: Batch ID, academic year, total records, valid count, issue count, review status.
  - Active Discrepancy Queue: Severity, rule code (e.g. `RULE_B`), description, review button.

#### 5. Students Registry & Profile (`/students`, `/students/:id`)
- **Purpose:** Central student record repository and identity verification.
- **Directory Features:**
  - Search by student name, masked APAAR ID (`XXXXXXXX1012`), roll number, institution.
  - Filters: Institution, Academic Year, Validation Status (`VALID`, `CROSS_INSTITUTION_FLAG`, `FLAGGED`, `PENDING_REVIEW`), Programme.
  - Action buttons: View Profile, Edit Details, Flag for Investigation, Export CSV.
- **Detail View (`/students/:id`):**
  - Personal Information: Name, Gender, DOB, Category (General, OBC, SC, ST), Email.
  - APAAR ID Verification: Masked ID, Verhoeff Checksum Status (Valid), Fingerprint HMAC.
  - Academic Record: Programme, Institution, Academic Year, Enrolment Status (`ACTIVE`), Validation Score (`98/100`).
  - Edit Student Dialog: Modify fields with mandatory audit reason logging.

#### 6. Student Data Submission / Bulk Upload (`/students/upload`)
- **Purpose:** Institution batch student data ingestion.
- **Workflow Steps:**
  1. *Session & Regulatory Quota:* Academic session selection (2025-2026), standard reference (APH 2024-25 §4).
  2. *Upload & Parse:* Drag-and-drop CSV or XLSX file upload; Download official CSV template (`/api/v1/upload/template`).
  3. *Column Mapping:* Map CSV headers (Student Name, APAAR ID, Gender, Category, Programme, etc.).
  4. *Pre-Validation Simulation Engine:*
     - Real-time Verhoeff checksum calculation.
     - Within-batch duplicate check.
     - Sanctioned intake quota breach check.
     - Row-level issue breakdown table with error highlights.
  5. *Commit & Ledger Ingestion:* Commit validated records to database with cryptographic audit logging.

#### 7. APAAR Validation & Anomaly Detection (`/validation`)
- **Purpose:** Regulatory review queue for flagged students, checksum failures, and duplicate enrolments.
- **Features:**
  - Anomaly summary counters: Total Anomalies, Critical Violations, Warnings, Resolved Cases.
  - Filter by Severity: `VIOLATION`, `NEEDS_REVIEW`, `DISCREPANCY`.
  - Filter by Rule:
    - `RULE_A`: Duplicate APAAR Fingerprint Match Within Batch.
    - `RULE_B`: Approved Sanctioned Intake Capacity Exceeded.
    - `RULE_C`: Dual / Concurrent Enrolment Across Institutions.
    - `RULE_D`: Malformed APAAR ID / Checksum Failure.
  - Interactive Review Workflow:
    - Adjudication modal: Inspect evidence, detected values, risk score (e.g. 92/100).
    - Review Actions: *Approve Override*, *Reject Record*, *Request Clarification*.
    - Mandatory resolution notes field with persistent state update.

#### 8. Admission Monitoring & Policy Simulator (`/admissions`)
- **Purpose:** Intake quota enforcement and regulator what-if modeling.
- **Features:**
  - Real-time sanctioned capacity vs. actual enrolled monitoring across institutions and programmes.
  - **Interactive Policy Simulator:**
    - Dual range sliders:
      - Warning Threshold (e.g., 80% to 95%).
      - Excess Breach Threshold (e.g., 100% to 105%).
    - "Run Simulation" trigger executing `/api/v1/reports/simulate-policy`.
    - Live impact report: Programmes evaluated, normal count, near-capacity count, excess breach count, and regulatory narrative summary.

#### 9. Third-Party Controlled Verification Portal (`/verification`)
- **Purpose:** Privacy-preserving zero-knowledge credential verification for employers and external entities.
- **Features:**
  - Multi-mode lookup: Verify by APAAR ID, Student Roll Number, or Digital Certificate ID.
  - Instant cryptographic attestation:
    - Student Name, Masked APAAR ID (`XXXXXXXX1012`), Institution Name, Programme, Academic Year, Validation Score (98%).
    - Tamper-Evident SHA-256 seal status: `VERIFIED AUTHENTIC`.
    - Verification timestamp.
  - QR Code generator & scanner preview.
  - Download Official Attestation Verification Slip.

#### 10. National Analytics & Forecasting (`/analytics`)
- **Purpose:** High-level educational intelligence, longitudinal trends, and demographic breakdown.
- **Visualizations:**
  - Year-over-Year Progression: 2024-25 vs 2025-26 enrolment expansion (+15.3% annual growth).
  - Supernumerary Quota Bar Chart: Tuition Fee Waiver (TFW: 54), EWS Supernumerary (38), PMSSS J&K (24), NRI (18), Foreign Nationals (12).
  - Simulated 5-Year Enrolment Projections (ARIMA Model): Historical actuals (2023-2025) and projected trajectory (2026-2028).
  - Data Quality Score: Average validation score (96.4%), fully verified proportion (97.1%), flagged records (38).

#### 11. Statutory Reports & Downloads (`/reports`)
- **Purpose:** AICTE compliance audit summaries and export engine.
- **Features:**
  - Available reports:
    - `REP-01`: *National AICTE Intake Compliance Summary AY 2025-26* (`GENERATED`).
    - `REP-02`: *State-wise APAAR Validation Matrix* (`GENERATED`).
    - Custom reports: Supernumerary Quota Distribution, Data Quality Audit.
  - Generate Custom Report modal with date range, format selection (PDF, CSV, JSON).
  - 1-click download actions.

#### 12. Audit Logs & Provenance Ledger (`/audit-logs`)
- **Purpose:** Immutable compliance record for regulatory scrutiny.
- **Features:**
  - Event entries featuring:
    - Log ID (`AUD-001`).
    - Action (`COMPLIANCE_ALERT_GENERATED`, `STUDENT_CREDENTIAL_VERIFIED`, `BATCH_INGESTION_COMPLETED`, etc.).
    - Actor Email & Role (`SYSTEM_BOT`, `AICTE_ADMIN`, `INSTITUTION_ADMIN`, `VERIFIER`).
    - Resource Type & ID (`INSTITUTION`, `ENROLMENT`, `VERIFICATION`, `VALIDATION`).
    - Outcome (`SUCCESS`, `WARNING`, `ERROR`).
    - Event Details narrative.
    - Client IP address and ISO timestamp.
  - Search and filter by actor, action type, and outcome.

#### 13. System Settings (`/settings`)
- **Purpose:** Governance parameters and gateway configuration.
- **Features:**
  - Regulatory standard version: AICTE Approval Process Handbook (APH 2024-25 §4).
  - Algorithm parameters: Verhoeff base-10 permutation check, Levenshtein name tolerance (0.85).
  - HMAC salt key rotation indicator.
  - External gateway toggle (DigiLocker, Academic Bank of Credits - ABC, NDEAR).

#### 14. Help & Governance Support (`/help`)
- **Purpose:** Operational documentation for institutional registrars and verifiers.
- **Features:**
  - AICTE regulatory guidelines and intake sanction rules.
  - APAAR ID generation and Verhoeff checksum troubleshooting.
  - Ingestion CSV template formatting rules.
  - Regulatory escalation contacts.

---

## 4. API Endpoints Catalog in Alpha

Alpha implements a RESTful service (`/api/v1`) with mock fallbacks:

| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/api/v1/auth/login` | `POST` | Authenticate with email/password; returns JWT and user profile. |
| `/api/v1/auth/demo-login` | `POST` | 1-click persona authentication (`AICTE_ADMIN`, `INSTITUTION_ADMIN`, etc.). |
| `/api/v1/auth/me` | `GET` | Retrieve authenticated user profile and permissions. |
| `/api/v1/auth/logout` | `POST` | Terminate session and clear tokens. |
| `/api/v1/dashboard/overview` | `GET` | Aggregated role-tailored metrics and KPI summaries. |
| `/api/v1/institutions` | `GET` | Search and filter technical institutions. |
| `/api/v1/institutions/:id` | `GET` | Detailed institutional profile, programmes, and issues. |
| `/api/v1/students` | `GET` | Filtered list of registered student records. |
| `/api/v1/students/:id` | `GET` | Comprehensive student profile and verification status. |
| `/api/v1/students/:id` | `PATCH` | Update student attributes with audit justification. |
| `/api/v1/students/bulk-upload` | `POST` | Multipart ingestion of batch CSV/XLSX enrolment records. |
| `/api/v1/upload/template` | `GET` | Download standard AICTE CSV template. |
| `/api/v1/validation/issues` | `GET` | Active compliance, checksum, and duplicate issues. |
| `/api/v1/validation/issues/:id/review` | `POST` | Submit reviewer determination (Approve/Reject/Clarify). |
| `/api/v1/verification/verify` | `GET` | Privacy-preserving public credential attestation lookup. |
| `/api/v1/verification/requests` | `POST` | Create verifiable credential request. |
| `/api/v1/reports` | `GET` | National statistics, supernumerary counts, and ARIMA forecast. |
| `/api/v1/reports/simulate-policy` | `POST` | What-if simulation against warning and excess thresholds. |
| `/api/v1/audit-logs` | `GET` | Filtered audit event records. |
| `/api/v1/demo/accounts` | `GET` | List available demo accounts and credentials. |
| `/api/v1/demo/reset` | `POST` | Re-seed synthetic dataset to default state. |
