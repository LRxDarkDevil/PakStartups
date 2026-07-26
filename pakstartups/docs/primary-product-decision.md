# Primary Product Decision: Startup Directory

**Date:** July 26, 2026  
**Status:** Approved  
**Author:** PakStartups Core Engineering & Product Team  
**Branding Directive:** Hallmark Design System  

---

## Executive Summary & Core Decision

PakStartups has selected the **Startup Directory** as its **primary MVP product** above the fold. 

While PakStartups offers complementary ecosystem services—Co-Founder Matchmaking, B2B Marketplace, and Knowledge Hub—the Startup Directory serves as the central hook, search interface, and highest-demand feature for Pakistan's tech ecosystem.

---

## Product Specs & Target Audience

### Primary Product
- **Name:** PakStartups Startup Directory
- **Core Value Proposition:** Single source of truth for discovering, filtering, and tracking verified Pakistani tech startups across verticals (Fintech, Agritech, SaaS, E-commerce, Logistics, Healthtech).

### Target Audience
1. **Founders & Building Teams:** Seeking visibility, talent leads, investor connections, and B2B clients.
2. **Investors & Angels:** Scouting deal flow across pre-seed to series A startups in Pakistan.
3. **Ecosystem Partners & Talent:** Discovering high-growth teams for employment, vendor partnerships, or mentorship.

### Core Job-to-be-Done (JTBD)
> *"When I am exploring or investing in Pakistan's tech scene, I want a fast, searchable directory of verified local startups so I can quickly identify leading projects, understand their growth metrics, and connect with their founders."*

---

## Success Metrics & Analytics Baseline

| Metric | Target / Benchmark | PostHog Event Name |
| :--- | :--- | :--- |
| **Homepage Primary CTA Click Rate** | > 25% of unique visitors | `homepage_explore_directory_click` |
| **Search Bar Conversions** | > 30% homepage visitors perform a directory search | `homepage_search_execute` |
| **Startup Profile Detail Clicks** | > 2.5 profile views per directory session | `directory_startup_card_click` |
| **Directory Submission Conversion** | > 5% of founder visitors start submission | `homepage_submit_startup_click` |
| **Return Visitor Retention** | > 35% 30-day return rate | PostHog Cohorts |

---

## Homepage Hierarchy & Navigation Enforcement

1. **Above the Fold:** 
   - Primary Hero CTA: `Explore Startup Directory` (`/startups`) with high-contrast Hallmark theme.
   - Immediate Search Input: Pre-indexed keyword search directly targeting startup listings.
   - Visual Focus: Live startup metric highlights and verified badge cards.

2. **Secondary Destinations (Visually De-emphasized):**
   - Co-Founder Matchmaking (`/match`)
   - B2B Marketplace (`/b2b`)
   - Knowledge Hub (`/knowledge`)

---

## Hallmark Branding Standard
- All components adopt the Hallmark design language: clean emerald gradients (`#0f5238`, `#d5fde2`), crisp typography, subtle micro-interactions, and accessible high-contrast layout grids.
