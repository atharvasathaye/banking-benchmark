# banking-benchmark

Competitive analysis of Truist's digital banking product against BofA, Chase, Wells Fargo, PNC, and Fifth Third. Uses two public data sources: the CFPB consumer complaint database and app store ratings.

**Live:** https://atharvasathaye.github.io/banking-benchmark

---

## What this is

A single-page dashboard that answers three questions:

1. How does Truist's complaint rate compare to peers, controlling for institution size?
2. What are customers praising and complaining about in each bank's mobile app?
3. Where should Truist invest, and in what order?

The third layer — opportunity sizing and roadmap sequencing — is the main point. The complaint and review data are inputs into a RICE-scored backlog, not the destination.

---

## Data

**CFPB complaint counts** (pulled August 3, 2026 via public API):

| Institution | Complaints | Per $100B deposits |
|---|---:|---:|
| Bank of America | 183,526 | 9.7 |
| JPMorgan Chase | 172,327 | 7.2 |
| Wells Fargo | 172,130 | 12.8 |
| Truist | 23,978 | 5.9 |
| PNC Bank | 31,937 | 7.6 |
| Fifth Third | 14,949 | 8.9 |

Endpoint used: `GET /data-research/consumer-complaints/search/api/v1/?company=<entity>&size=0`

Deposit figures from FDIC Summary of Deposits, Q1 2026. Normalization formula: `complaints / deposits_billions * 100`.

**App store data:** iOS and Google Play rating distributions, observational, same date. Cross-validated against J.D. Power 2025-2026 Mobile Banking App Satisfaction studies.

---

## Architecture

No build step. Three JS files loaded in sequence:

```
data.js     raw numbers and derived metrics
charts.js   canvas rendering (donut, bar), DOM builders for stacked/matrix charts
app.js      wires data into DOM, manages IntersectionObserver animations
```

All chart rendering is vanilla canvas or DOM — no charting library dependency. The choice was deliberate: the project is a portfolio artifact, so showing the rendering logic is part of the point.

RICE scores are computed at load time in `data.js`:

```js
OPPORTUNITIES.forEach(o => {
  o.rice = Math.round((o.reach * o.impact * (o.confidence / 100)) / o.effort);
});
```

Sorted descending before rendering, so the table and roadmap always reflect the current scoring.

---

## Running locally

```bash
git clone https://github.com/atharvasathaye/banking-benchmark
cd banking-benchmark

# any local server works — file:// will block the Google Fonts request
npx serve .
# or
python -m http.server 8000
```

Open `http://localhost:3000` (or 8000).

---

## File structure

```
banking-benchmark/
├── index.html      markup and section layout
├── style.css       design tokens, component styles, responsive breakpoints
├── data.js         CFPB counts, app store data, RICE opportunity register, roadmap
├── charts.js       drawDonut, buildStackedChart, buildMatrix, animateCounter
├── app.js          render functions, IntersectionObserver setup, DOMContentLoaded init
├── .gitignore
├── LICENSE
└── README.md
```

---

## Updating the data

CFPB counts will drift over time. To refresh:

```bash
curl "https://www.consumerfinance.gov/data-research/consumer-complaints/search/api/v1/?company=TRUIST%20FINANCIAL%20CORPORATION&size=0" \
  | jq '.hits.total.value'
```

Replace the `complaints` field in `data.js` for each bank. The normalization and RICE scoring recalculate automatically.

CFPB entity names that resolve correctly:
- `TRUIST FINANCIAL CORPORATION`
- `BANK OF AMERICA, NATIONAL ASSOCIATION`
- `JPMORGAN CHASE & CO.`
- `WELLS FARGO & COMPANY`
- `PNC Bank N.A.`
- `FIFTH THIRD FINANCIAL CORPORATION`

---

## Limitations

- App store theme clusters are based on keyword frequency in visible reviews, not a full corpus. Directionally consistent with J.D. Power data but not statistically rigorous.
- RICE reach estimates are derived from complaint share applied to Truist's estimated active user base. Treat them as order-of-magnitude, not precise forecasts.
- Complaint counts are all-time totals. Truist's entity only exists post-2020 (BB&T/SunTrust merger), so its raw count is not directly comparable to legacy institutions.

---

## Future work

- Pull date-filtered complaint counts (2022 onward) to normalize the merger timing issue
- Automate CFPB data refresh via GitHub Actions on a weekly schedule
- Add Google Play rating data with a scraper or third-party API
- Break out Truist complaint trends by quarter to show post-merger trajectory

---

## Author

Atharva Sathaye
