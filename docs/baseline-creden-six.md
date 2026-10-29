# CREDEN Six — Baseline Architecture & System State

**Audit Date:** October 29, 2026  
**Application Repository:** CREDEN Six (`https://creden-six.vercel.app/`)  
**Stack:** React 18, TypeScript, Vite, Tailwind CSS, Three.js / @react-three/fiber, Express, Prisma (SQLite)

---

## 1. System Overview & Strengths

CREDEN Six is an advanced spatial academic trust operating system. It features:
1. **Liquid Glass 3D Spatial Environment:**
   - Navigable Three.js circular carousel displaying 11 distinct colourful 3D application symbols.
   - Soft spatial atmosphere with white-to-ice-blue gradient, subtle studio illumination, ethereal lavender & mint ambient halos, and soft ground plane shadows.
   - Non-WebGL and reduced-motion fallbacks.
2. **VisionOS Light Enterprise Shell:**
   - Spatial Top Capsule with navigation history, brand mark, quick search, notification popover, and role switcher.
   - Spatial Bottom Dock with instant 1-click application launcher.
   - Rock-solid liquid glass workspace windows with blur-free typography, accessible contrast, and zero perspective distortion.
3. **Standout Feature — CREDEN TrustGraph™:**
   - Interactive 3D entity relationship graph connecting institutions, students, submissions, and anomalies.
   - Explainable duplicate detection radar, transparent rule-based data quality scoring, and immutable record provenance timeline.
4. **Backend Infrastructure:**
   - Node/Express backend (`server/`) with Prisma ORM and SQLite database.
   - REST endpoints for students, institutions, uploads, duplicates, compliance, audit, and trustgraph.

---

## 2. Non-Negotiable Preservation Commitments

To maintain system integrity and prevent regressions:
- **Do NOT overwrite the liquid-glass design system** or revert to dark washed-out templates.
- **Do NOT remove the 3D Circular Spatial Carousel** or CREDEN TrustGraph™.
- **Preserve all existing routes and backend contracts** while expanding them to support Alpha's `/api/v1` namespace.
- **Preserve test coverage and build stability** across Vite and TypeScript compiler.

---

## 3. Gap Analysis Against CREDEN Alpha

While CREDEN Six has superior 3D navigation and TrustGraph capabilities, several deep operational features from Alpha need full integration:

| Feature Area | CREDEN Six Baseline | CREDEN Alpha Capabilities | Integration Priority |
| :--- | :--- | :--- | :--- |
| **API Namespace** | Mixed `/api/*` endpoints | Versioned `/api/v1/*` REST API with standardized mock fallbacks | **High** — Unify under `/api/v1` |
| **Demo Personas on Login** | Form login with demo role toggling | Dedicated 1-click Demo Persona buttons on `/login` for all 4 primary roles | **High** — Direct login convenience |
| **Institution Detail & Programmes** | General list & metrics | Detail view (`/institutions/:id`) with programme-level intake breakdown (Approved vs. Enrolled), status badges (EXCEEDED/NORMAL), and batch history | **High** — Deep institutional oversight |
| **Interactive Policy Simulator** | Basic metrics | Interactive simulation sliders (Warning % & Excess %) testing intake threshold adjustments with real-time impact projection | **High** — Standout regulatory tool |
| **Supernumerary Quotas & ARIMA Forecast** | General charts | Detailed supernumerary breakdown (TFW, EWS, PMSSS, NRI, Foreign) and 5-year ARIMA historical/projected enrollment expansion | **High** — Statutory analytics |
| **Pre-Validation Simulation in Upload** | Standard CSV parser | Step-by-step wizard: template download, column mapping, row-by-row Verhoeff validation, duplicate pre-check, and intake breach check | **High** — Data ingestion integrity |
| **Issue Review Workflow** | General list | Interactive review dialog with determinations (Approve Override, Reject, Request Clarification) and persistent audit notes | **High** — Human-in-the-loop governance |
| **Controlled Verifier Attestation** | Basic QR display | Zero-knowledge minimal disclosure lookup (by APAAR ID or Roll No) with tamper-evident seal and verifiable attestation printout | **High** — Third-party verification |
