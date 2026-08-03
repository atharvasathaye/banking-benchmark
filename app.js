/**
 * app.js — Main application: renders all components from data.js
 */

// ─── Utility ─────────────────────────────────────────────────────────────────
function fmt(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K';
  return n.toString();
}

function stars(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

// ─── Render Complaint Cards ───────────────────────────────────────────────────
function renderComplaintCards() {
  const container = document.getElementById('complaint-cards');
  if (!container) return;

  // Sort by complaints descending
  const sorted = [...BANKS].sort((a, b) => b.complaints - a.complaints);
  sorted.forEach(bank => {
    const div = document.createElement('div');
    div.className = `bank-card ${bank.id} fade-in`;
    div.innerHTML = `
      <div class="bank-card-name">${bank.short}</div>
      <div class="bank-card-num" style="color:${bank.color}">${bank.complaints.toLocaleString()}</div>
      <div class="bank-card-sub">total CFPB complaints</div>
      <div style="margin-top:10px;font-size:0.78rem;color:var(--text-muted)">
        <span style="color:${bank.color};font-weight:700">${bank.complaints_normalized}</span>
        <span> per $100B deposits</span>
      </div>
    `;
    container.appendChild(div);
  });
}

// ─── Render Raw Bar Chart ─────────────────────────────────────────────────────
function renderRawChart() {
  const container = document.getElementById('chart-raw');
  if (!container) return;
  const sorted = [...BANKS].sort((a, b) => b.complaints - a.complaints);
  const max = sorted[0].complaints;
  sorted.forEach(bank => {
    const pct = (bank.complaints / max * 100).toFixed(1);
    const row = document.createElement('div');
    row.className = 'bar-row';
    row.innerHTML = `
      <div class="bar-label">${bank.short}</div>
      <div class="bar-track">
        <div class="bar-fill" style="width:0%;background:${bank.color}" data-width="${pct}%"></div>
      </div>
      <div class="bar-value">${bank.complaints.toLocaleString()}</div>
    `;
    container.appendChild(row);
  });
}

// ─── Render Normalized Chart ──────────────────────────────────────────────────
function renderNormalizedChart() {
  const container = document.getElementById('chart-normalized');
  if (!container) return;
  const sorted = [...BANKS].sort((a, b) => b.complaints_normalized - a.complaints_normalized);
  const max = sorted[0].complaints_normalized;
  sorted.forEach(bank => {
    const pct = (bank.complaints_normalized / max * 100).toFixed(1);
    const isTruist = bank.id === 'truist';
    const row = document.createElement('div');
    row.className = 'bar-row';
    row.innerHTML = `
      <div class="bar-label" style="${isTruist ? 'color:var(--truist-color)' : ''}">${bank.short}</div>
      <div class="bar-track">
        <div class="bar-fill" style="width:0%;background:${bank.color}${isTruist ? ';box-shadow:0 0 8px ' + bank.color + '80' : ''}"
             data-width="${pct}%"></div>
      </div>
      <div class="bar-value">${bank.complaints_normalized}</div>
    `;
    container.appendChild(row);
  });
}

// ─── Render Donut Chart ───────────────────────────────────────────────────────
function renderDonut() {
  drawDonut('donut-chart', TRUIST_CATEGORIES);

  const legend = document.getElementById('donut-legend');
  if (!legend) return;
  TRUIST_CATEGORIES.forEach(cat => {
    const item = document.createElement('div');
    item.className = 'legend-item fade-in';
    item.innerHTML = `
      <div class="legend-dot" style="background:${cat.color}"></div>
      <div class="legend-label">${cat.label}</div>
      <div class="legend-pct" style="color:${cat.color}">${cat.pct}%</div>
    `;
    legend.appendChild(item);
  });
}

// ─── Render App Cards ─────────────────────────────────────────────────────────
function renderAppCards() {
  const container = document.getElementById('app-cards');
  if (!container) return;

  // Order: Chase, BofA, Wells, Fifth Third, PNC, Truist
  const order = ['chase', 'bofa', 'wells', 'fifth', 'pnc', 'truist'];
  const sorted = order.map(id => BANKS.find(b => b.id === id)).filter(Boolean);

  sorted.forEach(bank => {
    const a = bank.app;
    const card = document.createElement('div');
    card.className = `app-card fade-in`;
    card.style.borderTopColor = bank.color;
    card.style.borderTopWidth = '3px';
    card.style.borderTopStyle = 'solid';

    const starsStr = '★'.repeat(Math.floor(a.ios_rating)) +
      (a.ios_rating % 1 >= 0.5 ? '½' : '') +
      '☆'.repeat(5 - Math.ceil(a.ios_rating));

    card.innerHTML = `
      <div class="app-card-bank" style="color:${bank.color}">${bank.short}</div>
      <div class="app-card-stars" style="color:${bank.color}">${a.ios_rating}</div>
      <div class="star-visual" title="iOS App Store rating">
        ${Array.from({length:5}, (_, i) => {
          const filled = i < Math.floor(a.ios_rating);
          return `<span class="star" style="color:${filled ? bank.color : 'var(--text-muted)'};font-size:14px">★</span>`;
        }).join('')}
      </div>
      <div class="app-card-reviews">iOS · ${fmt(a.ios_reviews)} ratings</div>
      <div class="app-card-reviews">Android · ${fmt(a.play_reviews)} ratings</div>
      ${a.jdpower ? `<div class="app-card-jdpower">🏆 ${a.jdpower_note}</div>` : ''}
    `;
    container.appendChild(card);
  });
}

// ─── Render RICE Table ────────────────────────────────────────────────────────
function renderRiceTable() {
  const tbody = document.getElementById('rice-tbody');
  if (!tbody) return;

  OPPORTUNITIES.forEach(opp => {
    const tr = document.createElement('tr');
    const badgeCls = opp.priority.toLowerCase();
    tr.innerHTML = `
      <td class="rice-opp">${opp.title}</td>
      <td><span class="source-tag">${opp.source}</span></td>
      <td>${opp.reach.toLocaleString()}</td>
      <td>${opp.impact}/5</td>
      <td>${opp.confidence}%</td>
      <td>${opp.effort}Q</td>
      <td class="rice-score-col"><span class="rice-score">${opp.rice.toLocaleString()}</span></td>
      <td><span class="rice-badge ${badgeCls}">${opp.priority}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

// ─── Render Roadmap ───────────────────────────────────────────────────────────
function renderRoadmap() {
  const container = document.getElementById('roadmap-timeline');
  if (!container) return;

  ROADMAP.forEach(horizon => {
    const section = document.createElement('div');
    section.className = 'roadmap-horizon fade-in';

    const hHeader = document.createElement('div');
    hHeader.className = 'roadmap-h-header';
    hHeader.innerHTML = `
      <div class="roadmap-h-tag">
        <div class="roadmap-h-label">Horizon</div>
        <div class="roadmap-h-period" style="color:${horizon.color}">${horizon.horizon}</div>
      </div>
      <div class="roadmap-dot-line">
        <div class="roadmap-h-theme" style="color:${horizon.color};font-weight:700;font-size:0.95rem">${horizon.theme}</div>
      </div>
    `;

    const items = document.createElement('div');
    items.className = 'roadmap-items';

    horizon.items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'roadmap-item';
      div.innerHTML = `
        <div>
          <div class="roadmap-item-title">${item.title}</div>
          <div class="roadmap-item-desc">${item.desc}</div>
        </div>
        <div class="roadmap-item-meta">
          <div class="roadmap-item-effort">${item.effort}</div>
          <span class="roadmap-item-impact impact-${item.impact}">${item.impact === 'high' ? '⬆ High Impact' : '→ Med Impact'}</span>
        </div>
      `;
      items.appendChild(div);
    });

    section.appendChild(hHeader);
    section.appendChild(items);
    container.appendChild(section);
  });
}

// ─── Intersection Observer for animations ────────────────────────────────────
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Animate bars when visible
        if (entry.target.closest('#chart-raw, #chart-normalized, .stacked-chart')) {
          setTimeout(animateBars, 100);
        }
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in, .bar-fill, .stacked-seg').forEach(el => {
    observer.observe(el);
  });
}

// ─── Animate stacked bars ─────────────────────────────────────────────────────
function animateStackedBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stacked-seg[data-width]').forEach((seg, i) => {
          setTimeout(() => {
            seg.style.width = seg.dataset.width;
          }, i * 60);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const stackedChart = document.getElementById('stacked-chart');
  if (stackedChart) observer.observe(stackedChart);
}

// ─── Active nav link on scroll ────────────────────────────────────────────────
function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px' });

  sections.forEach(s => observer.observe(s));
}

// ─── Hero counters ────────────────────────────────────────────────────────────
function initHeroCounters() {
  const total = BANKS.reduce((s, b) => s + b.complaints, 0);
  const complaintEl = document.querySelector('#stat-complaints .hero-stat-num');
  const reviewEl = document.querySelector('#stat-reviews .hero-stat-num');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (complaintEl) animateCounter(complaintEl, total, 2000);
        if (reviewEl) animateCounter(reviewEl, 2000000, 2000, '');
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const hero = document.querySelector('.hero-stats');
  if (hero) observer.observe(hero);
}

// ─── Animate bar fills on scroll ─────────────────────────────────────────────
function initBarAnimations() {
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.bar-fill[data-width]').forEach((bar, i) => {
          setTimeout(() => { bar.style.width = bar.dataset.width; }, i * 100);
        });
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  ['chart-raw', 'chart-normalized'].forEach(id => {
    const el = document.getElementById(id);
    if (el) barObserver.observe(el);
  });
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Render all sections
  renderComplaintCards();
  renderRawChart();
  renderNormalizedChart();
  renderDonut();
  renderAppCards();
  buildStackedChart('stacked-chart', BANKS);
  buildMatrix('opp-matrix', OPPORTUNITIES);
  renderRiceTable();
  renderRoadmap();

  // Animations
  initScrollAnimations();
  initBarAnimations();
  animateStackedBars();
  initNavHighlight();
  initHeroCounters();
});
