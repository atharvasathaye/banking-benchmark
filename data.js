/**
 * data.js — Real CFPB complaint counts (pulled August 3, 2026 via CFPB API)
 * + App store data + derived analysis data
 */

const BANKS = [
  {
    id: 'bofa',
    name: 'Bank of America',
    short: 'BofA',
    color: '#e74c3c',
    cfpbEntity: 'BANK OF AMERICA, NATIONAL ASSOCIATION',
    complaints: 183526,
    deposits_billions: 1900,   // FDIC Q1 2026, ~$1.9T
    app: {
      ios_rating: 4.9,
      ios_reviews: 6400,        // current version
      ios_cumulative: 4500000,  // lifetime estimate
      play_rating: 4.7,
      play_reviews: 5700000,
      jdpower: false,
      jdpower_note: null
    },
    rating_dist: { five: 72, four: 11, three: 4, two: 3, one: 10 }
  },
  {
    id: 'chase',
    name: 'JPMorgan Chase',
    short: 'Chase',
    color: '#f39c12',
    cfpbEntity: 'JPMORGAN CHASE & CO.',
    complaints: 172327,
    deposits_billions: 2400,   // ~$2.4T
    app: {
      ios_rating: 4.7,
      ios_reviews: 5200000,
      play_rating: 4.4,
      play_reviews: 6200000,
      jdpower: true,
      jdpower_note: '#1 National Bank 2026'
    },
    rating_dist: { five: 68, four: 10, three: 5, two: 3, one: 14 }
  },
  {
    id: 'wells',
    name: 'Wells Fargo',
    short: 'Wells Fargo',
    color: '#e67e22',
    cfpbEntity: 'WELLS FARGO & COMPANY',
    complaints: 172130,
    deposits_billions: 1340,   // ~$1.34T
    app: {
      ios_rating: 4.9,
      ios_reviews: 10000000,
      play_rating: 4.5,
      play_reviews: 3200000,
      jdpower: false,
      jdpower_note: null
    },
    rating_dist: { five: 74, four: 10, three: 4, two: 3, one: 9 }
  },
  {
    id: 'truist',
    name: 'Truist',
    short: 'Truist',
    color: '#5dade2',
    cfpbEntity: 'TRUIST FINANCIAL CORPORATION',
    complaints: 23978,
    deposits_billions: 403,    // ~$403B FDIC 2025
    app: {
      ios_rating: 4.7,
      ios_reviews: 1100000,
      play_rating: 4.5,
      play_reviews: 312000,
      jdpower: false,
      jdpower_note: null
    },
    rating_dist: { five: 64, four: 12, three: 6, two: 4, one: 14 }
  },
  {
    id: 'pnc',
    name: 'PNC Bank',
    short: 'PNC',
    color: '#8e44ad',
    cfpbEntity: 'PNC Bank N.A.',
    complaints: 31937,
    deposits_billions: 420,    // ~$420B
    app: {
      ios_rating: 4.9,
      ios_reviews: 1000000,
      play_rating: 4.7,
      play_reviews: 980000,
      jdpower: false,
      jdpower_note: null
    },
    rating_dist: { five: 75, four: 11, three: 4, two: 2, one: 8 }
  },
  {
    id: 'fifth',
    name: 'Fifth Third',
    short: 'Fifth Third',
    color: '#27ae60',
    cfpbEntity: 'FIFTH THIRD FINANCIAL CORPORATION',
    complaints: 14949,
    deposits_billions: 167,    // ~$167B
    app: {
      ios_rating: 4.8,
      ios_reviews: 642000,
      play_rating: 4.6,
      play_reviews: 423000,
      jdpower: true,
      jdpower_note: '#1 Regional Bank 2025'
    },
    rating_dist: { five: 71, four: 12, three: 5, two: 3, one: 9 }
  }
];

// Compute normalised complaints per $100B deposits
BANKS.forEach(b => {
  b.complaints_normalized = +(b.complaints / b.deposits_billions * 100).toFixed(1);
});

// Truist complaint breakdown by product category (derived from CFPB product tags)
const TRUIST_CATEGORIES = [
  { label: 'Checking / Savings',    pct: 38, color: '#e74c3c' },
  { label: 'Mortgage',              pct: 18, color: '#f39c12' },
  { label: 'Credit Card',           pct: 16, color: '#6c8fff' },
  { label: 'Student Loan',          pct:  7, color: '#b48fff' },
  { label: 'Vehicle Loan',          pct:  8, color: '#3dffa0' },
  { label: 'Debt Collection',       pct:  7, color: '#e67e22' },
  { label: 'Other',                 pct:  6, color: '#555a6e' }
];

// RICE opportunity register
const OPPORTUNITIES = [
  {
    title: 'Auth & Login Friction Fix',
    source: 'CFPB + App Store',
    reach: 420000,
    impact: 5,
    confidence: 90,
    effort: 1.5,
    priority: 'P0',
    x: 25,  // matrix x (effort 0=easy, 100=hard)
    y: 80   // matrix y (impact 0=low, 100=high)
  },
  {
    title: 'Mobile Deposit Hold Reduction',
    source: 'CFPB + App Store',
    reach: 310000,
    impact: 4,
    confidence: 85,
    effort: 2,
    priority: 'P0',
    x: 35, y: 72
  },
  {
    title: 'Zelle Dispute Resolution UX',
    source: 'CFPB',
    reach: 280000,
    impact: 4,
    confidence: 80,
    effort: 2.5,
    priority: 'P0',
    x: 42, y: 68
  },
  {
    title: 'Proactive Account Alerts Rebuild',
    source: 'App Store',
    reach: 380000,
    impact: 3,
    confidence: 75,
    effort: 1,
    priority: 'P1',
    x: 18, y: 56
  },
  {
    title: 'Unified Spending Insights Hub',
    source: 'App Store',
    reach: 450000,
    impact: 4,
    confidence: 70,
    effort: 3,
    priority: 'P1',
    x: 52, y: 74
  },
  {
    title: 'AI-Powered Financial Assistant',
    source: 'App Store',
    reach: 600000,
    impact: 5,
    confidence: 65,
    effort: 5,
    priority: 'P1',
    x: 75, y: 88
  },
  {
    title: 'Mortgage Servicing Portal Redesign',
    source: 'CFPB',
    reach: 140000,
    impact: 3,
    confidence: 80,
    effort: 3,
    priority: 'P1',
    x: 55, y: 48
  },
  {
    title: 'ATM/Branch Locator Upgrade',
    source: 'App Store',
    reach: 200000,
    impact: 2,
    confidence: 85,
    effort: 0.5,
    priority: 'P2',
    x: 10, y: 35
  },
  {
    title: 'Real-Time Payment Expansion (RTP)',
    source: 'App Store',
    reach: 300000,
    impact: 4,
    confidence: 60,
    effort: 4,
    priority: 'P1',
    x: 68, y: 64
  },
  {
    title: 'Credit Score & Monitoring Dashboard',
    source: 'App Store',
    reach: 480000,
    impact: 3,
    confidence: 72,
    effort: 2,
    priority: 'P2',
    x: 30, y: 50
  },
  {
    title: 'Accessibility & Screen Reader Parity',
    source: 'CFPB',
    reach: 95000,
    impact: 3,
    confidence: 90,
    effort: 1,
    priority: 'P2',
    x: 15, y: 40
  },
  {
    title: 'Student Loan Servicing Self-Service',
    source: 'CFPB',
    reach: 110000,
    impact: 3,
    confidence: 78,
    effort: 2.5,
    priority: 'P2',
    x: 44, y: 42
  }
];

// Compute RICE scores
OPPORTUNITIES.forEach(o => {
  o.rice = Math.round((o.reach * o.impact * (o.confidence / 100)) / o.effort);
});

// Sort by RICE score
OPPORTUNITIES.sort((a, b) => b.rice - a.rice);

// Roadmap
const ROADMAP = [
  {
    horizon: 'H1 · Q3–Q4 2026',
    theme: 'Eliminate the friction bleeding complaints',
    color: '#ff5f6d',
    items: [
      {
        title: 'Auth & Login Friction Fix',
        desc: 'Eliminate Face ID loop bug, streamline MFA onboarding, implement persistent session tokens. Target: reduce auth-related 1-star reviews by 40%.',
        effort: '1.5 person-quarters',
        impact: 'high',
        rice: null
      },
      {
        title: 'Mobile Deposit Hold Reduction',
        desc: 'Implement risk-tiered instant availability for verified accounts. Mirror Chase\'s approach: instant access to $500 for qualifying direct-deposit customers.',
        effort: '2 person-quarters',
        impact: 'high',
        rice: null
      },
      {
        title: 'Zelle Dispute Resolution UX',
        desc: 'In-app dispute wizard with real-time status tracking. Required for CFPB compliance. Reduce complaint resolution time from ~45 days to <7 days for eligible cases.',
        effort: '2.5 person-quarters',
        impact: 'high',
        rice: null
      }
    ]
  },
  {
    horizon: 'H2 · Q1–Q2 2027',
    theme: 'Build the intelligent banking layer',
    color: '#ffc94d',
    items: [
      {
        title: 'Proactive Account Alerts Rebuild',
        desc: 'Replace rule-based alerts with ML-predicted spend anomalies, upcoming bill warnings, low balance forecasting. Fifth Third\'s approach increased engagement 28%.',
        effort: '1 person-quarter',
        impact: 'med',
        rice: null
      },
      {
        title: 'Unified Spending Insights Hub',
        desc: 'Surface spending categories, trends, and peer benchmarks in a single in-app destination. BofA\'s Life Plan and Chase\'s My Finance are the bar. Truist has the wealth data — surface it.',
        effort: '3 person-quarters',
        impact: 'high',
        rice: null
      },
      {
        title: 'Real-Time Payment Expansion',
        desc: 'Expand RTP to business accounts and increase per-transaction limits. Growing review theme — customers explicitly compare unfavorably to Chase.',
        effort: '4 person-quarters',
        impact: 'high',
        rice: null
      }
    ]
  },
  {
    horizon: 'H3 · H2 2027 +',
    theme: 'Leapfrog with differentiated AI',
    color: '#6c8fff',
    items: [
      {
        title: 'AI-Powered Financial Assistant',
        desc: 'Conversational AI for balance queries, spend analysis, product recommendations, and dispute initiation. BofA\'s Erica now handles 2B+ interactions/year. This is Truist\'s biggest whitespace.',
        effort: '5 person-quarters',
        impact: 'high',
        rice: null
      },
      {
        title: 'Credit Score & Monitoring Dashboard',
        desc: 'Embed credit monitoring with score change alerts, factor explanations, and product nudges. Drives cross-sell while reducing inbound servicing calls.',
        effort: '2 person-quarters',
        impact: 'med',
        rice: null
      },
      {
        title: 'Mortgage Servicing Portal Redesign',
        desc: 'Full self-service mortgage portal: payoff quotes, escrow management, PMI removal tracking. CFPB complaints in mortgage account for 18% of Truist\'s volume.',
        effort: '3 person-quarters',
        impact: 'med',
        rice: null
      }
    ]
  }
];
