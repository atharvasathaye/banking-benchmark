# Banking Benchmark

Competitive analysis of Truist's digital banking product against Bank of America, JPMorgan Chase, Wells Fargo, PNC, and Fifth Third. Uses two public data sources: the CFPB consumer complaint database and mobile app store ratings.

**Live Demo:** https://atharvasathaye.github.io/banking-benchmark

## Overview

A single-page analytical dashboard addressing three key objectives:

1. Comparing Truist's complaint rate to peer institutions while controlling for deposit size.
2. Categorizing mobile app feedback and sentiment across competitors.
3. Establishing a prioritized product roadmap using a RICE-scored backlog.

The primary objective is opportunity sizing and roadmap sequencing. The complaint and review data serve as quantitative inputs into the RICE framework.

## Data Sources

**CFPB Complaint Data** (retrieved August 3, 2026 via public API):

| Institution | Complaints | Per $100B deposits |
|---|---:|---:|
| Bank of America | 183,526 | 9.7 |
| JPMorgan Chase | 172,327 | 7.2 |
| Wells Fargo | 172,130 | 12.8 |
| Truist | 23,978 | 5.9 |
| PNC Bank | 31,937 | 7.6 |
| Fifth Third | 14,949 | 8.9 |

- **Endpoint**: `GET /data-research/consumer-complaints/search/api/v1/?company=<entity>&size=0`
- **Normalization**: FDIC Summary of Deposits (Q1 2026). Formula: `complaints / deposits_billions * 100`.

**App Store Data**: iOS and Google Play rating distributions cross-validated against J.D. Power Mobile Banking App Satisfaction studies.

## Architecture

No external build pipeline. Three JavaScript modules loaded sequentially:

```
data.js     Raw datasets and derived metrics.
charts.js   Canvas chart rendering routines (donut, bar) and DOM builders.
app.js      DOM state management and IntersectionObserver animations.
```

All chart visualization is implemented using native HTML5 Canvas and DOM manipulation without third-party charting library dependencies.

RICE scores are evaluated dynamically at client load time in `data.js`:

```js
OPPORTUNITIES.forEach(o => {
  o.rice = Math.round((o.reach * o.impact * (o.confidence / 100)) / o.effort);
});
```

Arrays are sorted in descending order prior to rendering to keep the matrix and backlog synchronized.

## Local Execution

```bash
git clone https://github.com/atharvasathaye/banking-benchmark
cd banking-benchmark
npx serve .
```

Access the local server at `http://localhost:3000`.

## Repository Structure

```
banking-benchmark/
├── index.html          Main application markup and layout structure
├── style.css           Design system tokens, component styles, and media queries
├── data.js             CFPB data, app store metrics, and RICE scoring engine
├── charts.js           Canvas chart renderers and element generators
├── app.js              Application initialization and DOM bindings
├── scripts/
│   └── fetch-cfpb.js   Node.js script to update CFPB metrics directly from API
├── package.json        Project metadata
├── METHODOLOGY.md      Scoring framework, data definitions, and constraints
├── .gitignore
├── LICENSE
└── README.md
```

## Data Maintenance

To refresh CFPB complaint metrics:

```bash
# Dry run to verify API response
node scripts/fetch-cfpb.js

# Update data.js with active API metrics
node scripts/fetch-cfpb.js --write
```

The updater utilizes the standard Node.js `https` package without third-party dependencies. It updates complaint totals in `data.js` while maintaining manual deposit and app rating parameters.

Target CFPB entity identifiers:
- `TRUIST FINANCIAL CORPORATION`
- `BANK OF AMERICA, NATIONAL ASSOCIATION`
- `JPMORGAN CHASE & CO.`
- `WELLS FARGO & COMPANY`
- `PNC Bank N.A.`
- `FIFTH THIRD FINANCIAL CORPORATION`

## Technical Limitations

- App store sentiment clusters rely on keyword frequency sampling across visible reviews.
- RICE reach estimations use total active user ratios and provide order-of-magnitude comparisons.
- Complaint totals reflect post-2020 data to account for the BB&T and SunTrust merger timeline.

## Future Engineering Roadmap

- Implement historical date filtering (2022 onward) to refine post-merger comparisons.
- Automate weekly data ingestion workflows via GitHub Actions.
- Expand Play Store scraper pipeline for real-time rating tracking.
- Quarterly breakdown of complaint volume for trend trajectory analysis.

## Author
Atharva Sathaye
