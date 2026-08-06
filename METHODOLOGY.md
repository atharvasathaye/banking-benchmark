# Methodology

Documentation of quantitative formulas, data collection methods, and scoring assumptions.

## CFPB Complaint Metrics

**Source:** Consumer Financial Protection Bureau Public API  
**Endpoint:** `GET https://www.consumerfinance.gov/data-research/consumer-complaints/search/api/v1/`  
**Parameters:** `company=<entity name>`, `size=0`, `no_aggs=true`

The `hits.total.value` field returns total matching complaints. Setting `size=0` retrieves only the count without paginating individual records.

**Date Filtering:** Metrics utilize a `date_received_min` parameter set to `2020-01-01`. Truist Financial Corporation was established following the BB&T and SunTrust merger in December 2019. Utilizing unconstrained historical counts would compare approximately 4 years of Truist data against 14 years of legacy institution data.

**Entity Matching:** The CFPB API requires exact string matching for company names:

```
BANK OF AMERICA, NATIONAL ASSOCIATION
JPMORGAN CHASE & CO.
WELLS FARGO & COMPANY
TRUIST FINANCIAL CORPORATION
PNC Bank N.A.
FIFTH THIRD FINANCIAL CORPORATION
```

Partial matches return zero results. Entity names must be validated against the CFPB directory before updating configuration files.

**Ingestion:** Execute `node scripts/fetch-cfpb.js --write` to update complaint metrics in `data.js`. The script updates complaint values and updates header timestamps. Deposit and app store data are maintained manually.

## Deposit Normalization

**Formula:** `(complaints / deposits_billions) * 100` = Complaints per $100 billion in deposits.

**Source:** FDIC Summary of Deposits annual survey (2025 reporting period).

Deposit totals are used instead of account counts due to standard FDIC reporting requirements across financial institutions. Account definitions vary across quarterly SEC filings.

## Truist Product Category Distribution

The `TRUIST_CATEGORIES` object in `data.js` categorizes complaints across standard CFPB classification tags:

- Checking or savings account
- Mortgage
- Credit card or prepaid card
- Student loan
- Vehicle loan or lease
- Debt collection
- Other financial service

Percentages are calculated by querying `company=TRUIST FINANCIAL CORPORATION` filtered by each product classification.

## App Store Metrics

**iOS:** Rating distributions and review counts retrieved from Apple App Store product pages.

**Google Play:** Rating distributions retrieved from Google Play Store listings.

App Store review totals reset on application version updates. Rating percentage distributions (1-star through 5-star ratios) provide a normalized benchmark across release cycles.

**J.D. Power Benchmarks:** Industry context derived from 2025 and 2026 J.D. Power U.S. Mobile Banking App Satisfaction studies.

## RICE Scoring Model

$$\text{RICE Score} = \frac{\text{Reach} \times \text{Impact} \times \text{Confidence}}{\text{Effort}}$$

| Field | Definition |
|---|---|
| Reach | Estimated annual Truist customers impacted (users/year) |
| Impact | Problem severity score (1-5 scale), weighted by customer retention risk |
| Confidence | Qualitative data confidence percentage (%) based on evidence quality |
| Effort | Implementation cost estimate measured in engineer-quarters |

**Reach Calculations:** Calculated by mapping complaint and review category proportions to Truist's active mobile user base (~7 million active users based on SEC Form 10-K filings).

**Impact Scoring:** Evaluated based on churn indicators (score 5), high-friction operational issues (scores 3-4), or low-friction usability issues (scores 1-2).

**Confidence Adjustments:** Discounts applied to account for selection bias in voluntary feedback channels (CFPB filings and app store reviews).

**Effort Estimation:** Order-of-magnitude engineering effort based on comparable enterprise implementations.

RICE scores are evaluated dynamically in `data.js` to rank items in the opportunity matrix and roadmap.

## Methodology Constraints

1. **Selection Bias:** CFPB complaints represent a self-selected subset of overall customer friction. Metrics indicate relative severity rather than total operational volume.
2. **Review Distribution Skew:** App store reviews skew toward polarized sentiment. 5-star ratings frequently reflect in-app prompt timing.
3. **Geographic Distribution:** Truist's branch footprint is concentrated in the Southeastern United States, which may introduce regional variance compared to national institutions.
4. **Portfolio Complexity:** Deposit normalization controls for asset size but does not adjust for product mix differences (e.g., mortgage volume vs. consumer deposit volume).

## Author
Atharva Sathaye
