# Product Requirements Document (PRD): PakStartups Platform

**Version:** 2.0 (Revised)  
**Date:** July 26, 2026  
**Status:** Approved Product Specification  
**Owner:** PakStartups Product & Engineering Lead (Muhammad Taha)  

---

## 1. Executive Summary & Problem Statement

PakStartups is building the primary digital discovery and growth platform for Pakistan's startup ecosystem.

### Quantified Pain Points
- **Network Fragmentation:** 82% of Pakistani founders report spending > 15 hours per week searching across unstructured WhatsApp groups and social feeds for technical talent, legal advice, and investment leads.
- **High Vendor Friction:** SECP registration, tax setup, and incorporation services vary wildly in quality, charging early-stage startups 3x to 5x standard market rates without transparency.
- **Data Opaque Ecosystem:** Investors and talent lack a single source of truth for verified local startups, metrics, and founding team profiles.

---

## 2. Market Sizing (TAM / SAM / SOM)

- **TAM (Total Addressable Market):** ~3,500 technology and tech-enabled startups across Pakistan (Lahore, Karachi, Islamabad, Faisalabad, Peshawar, Rawalpindi).
- **SAM (Serviceable Addressable Market):** ~1,200 active pre-seed, seed, and growth-stage ventures seeking talent, B2B services, or capital.
- **SOM (Serviceable Obtainable Market - 90 Days):** 350+ verified startups listed on PakStartups directory with active founder profiles.

---

## 3. Product Vision & MVP Focus

### Phase 1 MVP Focus (Primary Product)
- **Startup Directory & Discovery Engine:** High-performance searchable directory with URL-backed parameter state, verified badges, and Hallmark UI styling.
- **Immediate Hero Search:** Centered search box routing visitors directly into filtered directory views.

### Phase 2 Focus (Managed Services & AI)
- **Admin-Facilitated Co-Founder Matchmaking:** Structured request intake with consent-aware AI recommendation scoring.
- **Managed B2B Intake Pipeline:** Direct request intake routing to private admin triage and Discord webhook alerts.

---

## 4. 90-Day Execution Roadmap

```
+-----------------------------------------------------------------------------------+
| Days 1-30: Core Directory & Hero Discovery Engine                                 |
| - Tasks: ORB-6K747, ORB-5NX88, ORB-6J892, ORB-04E85                                |
| - Output: Clean immediate search hero, URL parameter state, verified directory.   |
+-----------------------------------------------------------------------------------+
| Days 31-60: Managed Matchmaking & B2B Request Workflows                            |
| - Tasks: ORB-2C47S, ORB-XA8RM, ORB-2HMGI, ORB-LUUWA, ORB-QBSQW                     |
| - Output: Structured request intake, AI match API, admin triage pipeline.          |
+-----------------------------------------------------------------------------------+
| Days 61-90: Strategic Partners, Discord Community & Revenue Layer                 |
| - Tasks: ORB-BVMJB, ORB-B0JCW, ORB-8P8WG, ORB-7ZNCR, ORB-YURK0, ORB-IYDP2          |
| - Output: Discord-first community, partner showcase, server-side contact pipeline.|
+-----------------------------------------------------------------------------------+
```

---

## 5. Success Metrics & Instrumentation

| Metric | Target | PostHog Event |
| :--- | :--- | :--- |
| **Directory Search Conversion** | > 30% of homepage visitors | `homepage_search_execute` |
| **Co-Founder Request Submissions** | > 50 structured requests / month | `cofounder_request_submitted` |
| **B2B Request Intakes** | > 35 managed B2B requests / month | `b2b_request_submitted` |
| **Discord Community Growth** | > 1,500 active Discord members | Discord Analytics |
