# Digital Banking Benchmark & Complaint Intelligence Dashboard

**Truist competitive analysis vs BofA, Chase, Wells Fargo, PNC, and Fifth Third**

🔗 **[Live Demo](https://atharvasathaye.github.io/banking-benchmark)**

---

## What This Is

A three-layer competitive intelligence dashboard built as a product analyst portfolio project targeting Truist's Senior Product Analyst role. It benchmarks Truist's digital banking experience against its direct competitive set using two real, public data sources.

### Data Sources

| Source | Volume | Last Updated |
|--------|--------|-------------|
| CFPB Consumer Complaint Database (public API) | **598,847 complaints** across 6 banks | August 3, 2026 |
| iOS App Store + Google Play ratings | **2M+ ratings** across 6 bank apps | August 2026 |

### Three Analytical Layers

1. **Complaint Benchmark** — Raw CFPB complaint volumes + normalized per $100B deposits to strip out institution size. Truist complaint distribution by product category.

2. **App Store Voice-of-Customer** — Rating distributions, 1-star share analysis, and review theme clusters (auth friction, mobile deposit holds, Zelle disputes, AI assistant gap, etc.)

3. **Prioritization & Roadmap** — 12 opportunities scored with a modified RICE framework, plotted on an impact/effort matrix, and sequenced into a 3-horizon delivery plan.

---

## CFPB Complaint Counts (Verified, August 2026)

| Institution | Total Complaints | Normalized (per $100B deposits) |
|---|---:|---:|
| Bank of America | 183,526 | 9.7 |
| JPMorgan Chase | 172,327 | 7.2 |
| Wells Fargo | 172,130 | 12.8 |
| **Truist** | **23,978** | **5.9** |
| PNC Bank | 31,937 | 7.6 |
| Fifth Third | 14,949 | 8.9 |

*Counts pulled via `GET https://www.consumerfinance.gov/data-research/consumer-complaints/search/api/v1/?company=<entity>&size=0`*

---

## Key Findings

- **Truist's 38% checking/savings complaint share** is the highest in the peer set — direct signal of core digital banking friction post-merger
- **Auth/login friction** appears at 3× the rate in Truist 1-star reviews vs Chase
- **BofA's Erica** handles 2B+ interactions/year; Truist has no comparable AI assistant
- **Fifth Third won J.D. Power #1 Regional Bank** 2025 by investing in exactly the friction Truist's data flags

---

## Roadmap Summary

| Horizon | Focus | Top Initiative |
|---|---|---|
| H1 · Q3–Q4 2026 | Eliminate friction | Auth fix, mobile deposit holds, Zelle dispute UX |
| H2 · Q1–Q2 2027 | Intelligent banking layer | Proactive alerts, spending insights hub, RTP expansion |
| H3 · H2 2027+ | Differentiated AI | AI financial assistant (Erica competitor), credit dashboard |

---

## Tech Stack

Pure HTML / Vanilla CSS / Vanilla JS — no frameworks, no build step. Designed to run as a static site on GitHub Pages.

```
index.html   — Structure and layout
style.css    — Design system (dark mode, glassmorphism, animations)
data.js      — Real data layer (CFPB counts, app store data, RICE scores)
charts.js    — Canvas-based chart utilities (donut, bars, matrix)
app.js       — Renders all components and wires animations
```

---

## Running Locally

```bash
git clone https://github.com/atharvasathaye/banking-benchmark
cd banking-benchmark
# Open index.html in any browser — no server needed
```

Or with a local server:
```bash
npx serve .
```

---

## Context

Built to demonstrate domain knowledge for Truist's **Senior Product Analyst – Agile** role (Charlotte, NC · posted July 30, 2026). Maps directly to JD responsibilities 1–3 and 8:

- ✅ Monitor digital trends
- ✅ Fact-driven market analysis with actionable recommendations
- ✅ Benchmark Truist products against direct/indirect competitive set
- ✅ Support development of digital roadmaps reflecting client needs

---

*Data: CFPB Public Database (CC0 license) · App Store data: publicly observable ratings · Analysis: original*
