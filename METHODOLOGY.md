# Methodology

Notes on how the numbers in this project are derived and where the assumptions live.

---

## CFPB complaint counts

**Source:** Consumer Financial Protection Bureau public search API  
**Endpoint:** `GET https://www.consumerfinance.gov/data-research/consumer-complaints/search/api/v1/`  
**Parameters:** `company=<entity name>`, `size=0`, `no_aggs=true`

The `hits.total.value` field in the response is the complaint count. Setting `size=0` returns only the count without fetching any records, which keeps the requests fast and avoids pagination.

**Date filter:** The data in this project uses a `date_received_min` of `2020-01-01`. Truist Financial Corporation did not exist as a CFPB entity before the BB&T / SunTrust merger closed in December 2019. Using an all-time count would compare Truist's ~4 years of history against BofA's ~14 years in the database, which overstates the gap.

**Entity name matching:** CFPB uses exact string matching on company names. The names that resolve correctly are:

```
BANK OF AMERICA, NATIONAL ASSOCIATION
JPMORGAN CHASE & CO.
WELLS FARGO & COMPANY
TRUIST FINANCIAL CORPORATION
PNC Bank N.A.
FIFTH THIRD FINANCIAL CORPORATION
```

A search using a partial name (e.g., "PNC Bank") returns zero results rather than an error, so entity names should be verified against the CFPB complaint search UI before updating.

**Refresh:** Run `node scripts/fetch-cfpb.js --write` to update counts in `data.js`. The script patches only the `complaints` fields and updates the date in the file header comment. All other fields (deposit data, app store data) are managed manually.

---

## Deposit normalization

**Formula:** `complaints / deposits_billions * 100` = complaints per $100B in deposits

**Source:** FDIC Summary of Deposits, most recent annual survey (2025 for this version)

Deposit base is used rather than customer count because it is publicly reported by all institutions at consistent intervals via FDIC filings. Customer count is reported inconsistently and often refers to different definitions (accounts vs. households vs. active users).

The normalization is intentionally simple. A more precise approach would use a rolling average of deposits over the complaint period rather than a single year snapshot, but the directional conclusions do not change materially with that adjustment given the relative stability of deposit share among large banks.

---

## Truist product category breakdown

The `TRUIST_CATEGORIES` breakdown in `data.js` reflects the approximate distribution of Truist's complaints across CFPB product tags. The CFPB assigns one of the following product labels to each complaint:

- Checking or savings account
- Mortgage
- Credit card or prepaid card
- Student loan
- Vehicle loan or lease
- Debt collection
- Other financial service

The percentages are estimated from the CFPB complaint search UI by filtering `company=TRUIST FINANCIAL CORPORATION` and each product category individually, then computing each category's share of the total. This is not automated in the current version of the fetch script.

---

## App store data

**iOS:** Rating distribution and review count from the App Store product page for each bank's primary mobile banking app.

**Google Play:** Same from the Play Store listing.

App Store counts reset on each new app version, which makes raw numbers inconsistent across banks. The rating distributions (percent of 1-star through 5-star reviews) are more comparable because they aggregate across versions in the displayed breakdown.

**J.D. Power notes** are from the 2025 and 2026 J.D. Power U.S. Mobile Banking App Satisfaction studies. Chase ranked #1 among national banks in 2026. Fifth Third ranked #1 among regional banks in 2025.

---

## RICE scoring

RICE = `(Reach * Impact * Confidence) / Effort`

| Field | Definition |
|---|---|
| Reach | Estimated annual Truist customers affected, in users/year |
| Impact | Severity of the problem on a 1-5 scale, weighted toward churn signal |
| Confidence | Qualitative data quality estimate (%), reflecting how directly the evidence supports the claim |
| Effort | Estimated implementation cost in person-quarters |

**Reach estimates** are derived by applying the complaint or review share for a given theme to Truist's estimated active mobile user base (~7M as of 2025 10-K). These are order-of-magnitude estimates, not precise forecasts.

**Impact** is scored based on whether the evidence suggests customers are churning (5), actively frustrated but retained (3-4), or mildly inconvenienced (1-2).

**Confidence** discounts for the gap between observed signal (CFPB complaints, app reviews) and the actual affected population. Complaints and public reviews are a small, self-selected subset of all affected customers.

**Effort** is a rough-order estimate based on the complexity of similar work at peer institutions, not an internal Truist estimate.

RICE scores are computed at load time in `data.js` and are only used for sorting the opportunity register and positioning items on the impact/effort matrix. The absolute numbers are not meaningful in isolation.

---

## Limitations

1. CFPB complaints represent a small fraction of customer dissatisfaction. Most frustrated customers do not file regulatory complaints. The signal is useful for identifying themes and relative severity, not absolute scale.

2. App store reviews are biased toward extreme sentiment. Customers who are mildly satisfied do not typically leave reviews. The 5-star share is inflated by bank-prompted review requests at positive interaction moments.

3. The competitive comparison assumes similar customer demographics and product mix across banks. Truist's footprint is heavily concentrated in the Southeast, which may affect complaint rates in ways unrelated to digital product quality.

4. Deposit normalization controls for scale but not for the complexity of the product portfolio. A bank with a larger mortgage or student loan book will generate more complaints in those categories regardless of digital experience quality.
