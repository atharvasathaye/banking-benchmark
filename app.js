function fmt(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K';
  return n.toString();
}

function renderComplaintCards() {
  const container = document.getElementById('complaint-cards');
  if (!container) return;

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

function renderBarChart(containerId, banks, valueKey, labelFn) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const sorted = [...banks].sort((a, b) => b[valueKey] - a[valueKey]);
  const max = sorted[0][valueKey];

  sorted.forEach(bank => {
    const pct = (bank[valueKey] / max * 100).toFixed(1);
    const isTruist = bank.id === 'truist';
    const row = document.createElement('div');
    row.className = 'bar-row';
    row.innerHTML = `
      <div class="bar-label" style="${isTruist ? 'color:var(--truist-color)' : ''}">${bank.short}</div>
      <div class="bar-track">
        <div class="bar-fill" data-width="${pct}%"
             style="width:0%;background:${bank.color}${isTruist ? ';box-shadow:0 0 8px ' + bank.color + '80' : ''}">
        </div>
      </div>
      <div class="bar-value">${labelFn(bank)}</div>
    `;
    container.appendChild(row);
  });
}

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

function renderAppCards() {
  const container = document.getElementById('app-cards');
  if (!container) return;

  const order = ['chase', 'bofa', 'wells', 'fifth', 'pnc', 'truist'];
  const ordered = order.map(id => BANKS.find(b => b.id === id)).filter(Boolean);

  ordered.forEach(bank => {
    const a = bank.app;
    const card = document.createElement('div');
    card.className = 'app-card fade-in';
    card.style.cssText = `border-top: 3px solid ${bank.color}`;

    card.innerHTML = `
      <div class="app-card-bank" style="color:${bank.color}">${bank.short}</div>
      <div class="app-card-stars" style="color:${bank.color}">${a.ios_rating}</div>
      <div class="star-visual">
        ${Array.from({ length: 5 }, (_, i) => `
          <span class="star" style="color:${i < Math.floor(a.ios_rating) ? bank.color : 'var(--text-muted)'}">*</span>
        `).join('')}
      </div>
      <div class="app-card-reviews">iOS: ${fmt(a.ios_reviews)} ratings</div>
      <div class="app-card-reviews">Android: ${fmt(a.play_reviews)} ratings</div>
      ${a.jdpower ? `<div class="app-card-jdpower">${a.jdpower_note}</div>` : ''}
    `;
    container.appendChild(card);
  });
}

function renderRiceTable() {
  const tbody = document.getElementById('rice-tbody');
  if (!tbody) return;

  OPPORTUNITIES.forEach(opp => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="rice-opp">${opp.title}</td>
      <td><span class="source-tag">${opp.source}</span></td>
      <td>${opp.reach.toLocaleString()}</td>
      <td>${opp.impact}/5</td>
      <td>${opp.confidence}%</td>
      <td>${opp.effort}Q</td>
      <td class="rice-score-col"><span class="rice-score">${opp.rice.toLocaleString()}</span></td>
      <td><span class="rice-badge ${opp.priority.toLowerCase()}">${opp.priority}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function renderRoadmap() {
  const container = document.getElementById('roadmap-timeline');
  if (!container) return;

  ROADMAP.forEach(horizon => {
    const section = document.createElement('div');
    section.className = 'roadmap-horizon fade-in';

    const header = document.createElement('div');
    header.className = 'roadmap-h-header';
    header.innerHTML = `
      <div class="roadmap-h-tag">
        <div class="roadmap-h-label">Horizon</div>
        <div class="roadmap-h-period" style="color:${horizon.color}">${horizon.horizon}</div>
      </div>
      <div class="roadmap-dot-line">
        <div class="roadmap-h-theme" style="color:${horizon.color}">${horizon.theme}</div>
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
          <span class="roadmap-item-impact impact-${item.impact}">
            ${item.impact === 'high' ? 'High Impact' : 'Medium Impact'}
          </span>
        </div>
      `;
      items.appendChild(div);
    });

    section.appendChild(header);
    section.appendChild(items);
    container.appendChild(section);
  });
}

function initBarAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.bar-fill[data-width]').forEach((bar, i) => {
        setTimeout(() => { bar.style.width = bar.dataset.width; }, i * 100);
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  ['chart-raw', 'chart-normalized'].forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}

function initStackedBarAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.stacked-seg[data-width]').forEach((seg, i) => {
        setTimeout(() => { seg.style.width = seg.dataset.width; }, i * 60);
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  const chart = document.getElementById('stacked-chart');
  if (chart) observer.observe(chart);
}

function initFadeAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    });
  }, { rootMargin: '-50% 0px -50% 0px' });

  sections.forEach(s => observer.observe(s));
}

function initHeroCounters() {
  const total = BANKS.reduce((sum, b) => sum + b.complaints, 0);
  const complaintEl = document.querySelector('#stat-complaints .hero-stat-num');
  const reviewEl    = document.querySelector('#stat-reviews .hero-stat-num');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      if (complaintEl) animateCounter(complaintEl, total, 2000);
      if (reviewEl)    animateCounter(reviewEl, 2000000, 2000);
      observer.disconnect();
    });
  }, { threshold: 0.5 });

  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) observer.observe(statsEl);
}

document.addEventListener('DOMContentLoaded', () => {
  renderComplaintCards();
  renderBarChart('chart-raw', BANKS, 'complaints', b => b.complaints.toLocaleString());
  renderBarChart('chart-normalized', BANKS, 'complaints_normalized', b => b.complaints_normalized);
  renderDonut();
  renderAppCards();
  buildStackedChart('stacked-chart', BANKS);
  buildMatrix('opp-matrix', OPPORTUNITIES);
  renderRiceTable();
  renderRoadmap();

  initFadeAnimations();
  initBarAnimations();
  initStackedBarAnimations();
  initNavHighlight();
  initHeroCounters();
});
