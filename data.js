/*
 * Real complaint counts from CFPB API, pulled August 3, 2026.
 * Endpoint: /data-research/consumer-complaints/search/api/v1/?company=<name>&size=0
 *
 * App store data is observational (iOS + Play store pages, same date).
 * Deposit figures from FDIC Summary of Deposits, Q1 2026.
 */

const BANKS = [
  {
    id: 'bofa',
    name: 'Bank of America',
    short: 'BofA',
    color: '#e74c3c',
    cfpbEntity: 'BANK OF AMERICA, NATIONAL ASSOCIATION',
    complaints: 183526,
    deposits_billions: 1900,
    app: {
      ios_rating: 4.9,
      ios_reviews: 6400,
      ios_cumulative: 4500000,
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
    deposits_billions: 2400,
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
    deposits_billions: 1340,
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
    deposits_billions: 403,
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
    deposits_billions: 420,
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
    deposits_billions: 167,
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

// complaints / deposits_billions * 100 = rate per $100B deposits
BANKS.forEach(b => {
  b.complaints_normalized = +(b.complaints / b.deposits_billions * 100).toFixed(1);
});

// Derived from CFPB product tags on Truist's complaint records
const TRUIST_CATEGORIES = [
  { label: 'Checking / Savings',  pct: 38, color: '#e74c3c' },
  { label: 'Mortgage',            pct: 18, color: '#f39c12' },
  { label: 'Credit Card',         pct: 16, color: '#6c8fff' },
  { label: 'Vehicle Loan',        pct:  8, color: '#3dffa0' },
  { label: 'Student Loan',        pct:  7, color: '#b48fff' },
  { label: 'Debt Collection',     pct:  7, color: '#e67e22' },
  { label: 'Other',               pct:  6, color: '#555a6e' }
];

// x = implementation effort (0 easy, 100 hard)
// y = customer impact (0 low, 100 high)
const OPPORTUNITIES = [
  {
    title: 'Auth and Login Friction',
    source: 'CFPB + App Store',
    reach: 420000, impact: 5, confidence: 90, effort: 1.5,
    priority: 'P0', x: 25, y: 80
  },
  {
    title: 'Mobile Deposit Hold Reduction',
    source: 'CFPB + App Store',
    reach: 310000, impact: 4, confidence: 85, effort: 2,
    priority: 'P0', x: 35, y: 72
  },
  {
    title: 'Zelle Dispute Resolution UX',
    source: 'CFPB',
    reach: 280000, impact: 4, confidence: 80, effort: 2.5,
    priority: 'P0', x: 42, y: 68
  },
  {
    title: 'Proactive Account Alerts',
    source: 'App Store',
    reach: 380000, impact: 3, confidence: 75, effort: 1,
    priority: 'P1', x: 18, y: 56
  },
  {
    title: 'Spending Insights Hub',
    source: 'App Store',
    reach: 450000, impact: 4, confidence: 70, effort: 3,
    priority: 'P1', x: 52, y: 74
  },
  {
    title: 'AI Financial Assistant',
    source: 'App Store',
    reach: 600000, impact: 5, confidence: 65, effort: 5,
    priority: 'P1', x: 75, y: 88
  },
  {
    title: 'Mortgage Servicing Portal',
    source: 'CFPB',
    reach: 140000, impact: 3, confidence: 80, effort: 3,
    priority: 'P1', x: 55, y: 48
  },
  {
    title: 'ATM/Branch Locator Upgrade',
    source: 'App Store',
    reach: 200000, impact: 2, confidence: 85, effort: 0.5,
    priority: 'P2', x: 10, y: 35
  },
  {
    title: 'Real-Time Payment Expansion',
    source: 'App Store',
    reach: 300000, impact: 4, confidence: 60, effort: 4,
    priority: 'P1', x: 68, y: 64
  },
  {
    title: 'Credit Score Dashboard',
    source: 'App Store',
    reach: 480000, impact: 3, confidence: 72, effort: 2,
    priority: 'P2', x: 30, y: 50
  },
  {
    title: 'Accessibility / Screen Reader Parity',
    source: 'CFPB',
    reach: 95000, impact: 3, confidence: 90, effort: 1,
    priority: 'P2', x: 15, y: 40
  },
  {
    title: 'Student Loan Self-Service',
    source: 'CFPB',
    reach: 110000, impact: 3, confidence: 78, effort: 2.5,
    priority: 'P2', x: 44, y: 42
  }
];

OPPORTUNITIES.forEach(o => {
  o.rice = Math.round((o.reach * o.impact * (o.confidence / 100)) / o.effort);
});

OPPORTUNITIES.sort((a, b) => b.rice - a.rice);

const ROADMAP = [
  {
    horizon: 'H1 / Q3-Q4 2026',
    theme: 'Remove friction driving complaints',
    color: '#ff5f6d',
    items: [
      {
        title: 'Auth and Login Friction',
        desc: 'Fix Face ID loop, streamline MFA onboarding, implement persistent session tokens. Target: 40% reduction in auth-related 1-star reviews.',
        effort: '1.5 person-quarters',
        impact: 'high'
      },
      {
        title: 'Mobile Deposit Hold Reduction',
        desc: 'Risk-tiered instant availability for verified accounts. Model after Chase: instant access to $500 for qualifying direct-deposit customers.',
        effort: '2 person-quarters',
        impact: 'high'
      },
      {
        title: 'Zelle Dispute Resolution UX',
        desc: 'In-app dispute wizard with real-time status tracking. Necessary for CFPB compliance and targets the 2026 guidance on P2P fraud liability.',
        effort: '2.5 person-quarters',
        impact: 'high'
      }
    ]
  },
  {
    horizon: 'H2 / Q1-Q2 2027',
    theme: 'Build the proactive banking layer',
    color: '#ffc94d',
    items: [
      {
        title: 'Proactive Account Alerts',
        desc: 'Replace static rule-based alerts with ML-based spend anomaly detection and low-balance forecasting. Fifth Third\'s version drove 28% engagement lift.',
        effort: '1 person-quarter',
        impact: 'med'
      },
      {
        title: 'Spending Insights Hub',
        desc: 'Single in-app destination for categories, trends, and peer benchmarks. Truist already holds the wealth data; the gap is surfacing it in everyday banking context.',
        effort: '3 person-quarters',
        impact: 'high'
      },
      {
        title: 'Real-Time Payment Expansion',
        desc: 'Extend RTP to business accounts and raise per-transaction limits. Customers explicitly compare Truist unfavorably to Chase in reviews.',
        effort: '4 person-quarters',
        impact: 'high'
      }
    ]
  },
  {
    horizon: 'H3 / H2 2027+',
    theme: 'Differentiated AI and self-service',
    color: '#6c8fff',
    items: [
      {
        title: 'AI Financial Assistant',
        desc: 'Conversational interface for balance queries, spend analysis, product recommendations, and dispute initiation. BofA\'s Erica processes 2B+ interactions/year.',
        effort: '5 person-quarters',
        impact: 'high'
      },
      {
        title: 'Credit Score Dashboard',
        desc: 'Embedded credit monitoring with score change alerts and factor explanations. Reduces inbound servicing calls and drives product cross-sell.',
        effort: '2 person-quarters',
        impact: 'med'
      },
      {
        title: 'Mortgage Servicing Portal',
        desc: 'Full self-service mortgage portal: payoff quotes, escrow management, PMI removal tracking. Mortgage accounts for 18% of Truist\'s CFPB complaint volume.',
        effort: '3 person-quarters',
        impact: 'med'
      }
    ]
  }
];
