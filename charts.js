/**
 * charts.js — Canvas-based chart rendering utilities
 */

/**
 * Draw a donut chart on a canvas element
 */
function drawDonut(canvasId, segments) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const outerR = 120;
  const innerR = 72;

  let startAngle = -Math.PI / 2;
  const total = segments.reduce((s, seg) => s + seg.pct, 0);

  segments.forEach(seg => {
    const sweep = (seg.pct / total) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outerR, startAngle, startAngle + sweep);
    ctx.closePath();
    ctx.fillStyle = seg.color;
    ctx.fill();
    startAngle += sweep;
  });

  // Punch hole
  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, 2 * Math.PI);
  ctx.fillStyle = '#181b22';
  ctx.fill();

  // Center text
  ctx.fillStyle = '#f0f2f8';
  ctx.font = 'bold 22px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('23,978', cx, cy - 10);
  ctx.fillStyle = '#8b90a7';
  ctx.font = '11px Inter, sans-serif';
  ctx.fillText('complaints', cx, cy + 12);
}

/**
 * Animate a counter from 0 to target
 */
function animateCounter(el, target, duration = 1800, prefix = '', suffix = '') {
  const start = performance.now();
  const isLarge = target >= 100000;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);

    if (isLarge) {
      el.textContent = prefix + current.toLocaleString() + suffix;
    } else {
      el.textContent = prefix + current + suffix;
    }

    if (progress < 1) requestAnimationFrame(update);
    else {
      if (isLarge) el.textContent = prefix + target.toLocaleString() + suffix;
      else el.textContent = prefix + target + suffix;
    }
  }
  requestAnimationFrame(update);
}

/**
 * Build a bar chart row
 */
function buildBarRow(label, value, maxValue, colorClass, displayValue) {
  const pct = Math.max(2, (value / maxValue) * 100);
  const row = document.createElement('div');
  row.className = 'bar-row';
  row.innerHTML = `
    <div class="bar-label">${label}</div>
    <div class="bar-track">
      <div class="bar-fill ${colorClass}" style="width:0%" data-width="${pct}%"
           style="background:${colorClass}"></div>
    </div>
    <div class="bar-value">${displayValue}</div>
  `;
  return row;
}

/**
 * Animate all bar fills
 */
function animateBars() {
  document.querySelectorAll('.bar-fill[data-width]').forEach((bar, i) => {
    setTimeout(() => {
      bar.style.width = bar.dataset.width;
    }, i * 80);
  });
}

/**
 * Stacked rating distribution chart
 */
function buildStackedChart(containerId, banks) {
  const container = document.getElementById(containerId);
  if (!container) return;

  banks.forEach(bank => {
    const row = document.createElement('div');
    row.className = 'stacked-row';

    const label = document.createElement('div');
    label.className = 'stacked-label';
    label.textContent = bank.short;

    const bars = document.createElement('div');
    bars.className = 'stacked-bars';

    const d = bank.rating_dist;
    const segs = [
      { cls: 'seg-five',  pct: d.five,  label: '5★' },
      { cls: 'seg-four',  pct: d.four,  label: '4★' },
      { cls: 'seg-three', pct: d.three, label: '3★' },
      { cls: 'seg-two',   pct: d.two,   label: '2★' },
      { cls: 'seg-one',   pct: d.one,   label: '1★' }
    ];

    segs.forEach(seg => {
      const el = document.createElement('div');
      el.className = `stacked-seg ${seg.cls}`;
      el.style.width = '0%';
      el.dataset.width = seg.pct + '%';
      el.title = `${seg.label}: ${seg.pct}%`;
      if (seg.pct >= 8) el.textContent = seg.pct + '%';
      bars.appendChild(el);
    });

    row.appendChild(label);
    row.appendChild(bars);
    container.appendChild(row);
  });

  // Legend
  const legend = document.createElement('div');
  legend.className = 'stacked-legend';
  [
    { cls: 'seg-five',  label: '5 Stars' },
    { cls: 'seg-four',  label: '4 Stars' },
    { cls: 'seg-three', label: '3 Stars' },
    { cls: 'seg-two',   label: '2 Stars' },
    { cls: 'seg-one',   label: '1 Star' }
  ].forEach(item => {
    const div = document.createElement('div');
    div.className = 'legend-seg';
    div.innerHTML = `<div class="legend-swatch ${item.cls}"></div>${item.label}`;
    legend.appendChild(div);
  });
  container.appendChild(legend);
}

/**
 * Build opportunity matrix
 */
function buildMatrix(containerId, opportunities) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Quadrant labels
  const quadrants = [
    { cls: 'matrix-quadrant', style: 'top:10px;left:10px;color:#3dffa0', text: 'Quick Wins' },
    { cls: 'matrix-quadrant', style: 'top:10px;right:10px;color:#6c8fff;text-align:right', text: 'Strategic Bets' },
    { cls: 'matrix-quadrant', style: 'bottom:10px;left:10px;color:#555a6e', text: 'Table Stakes' },
    { cls: 'matrix-quadrant', style: 'bottom:10px;right:10px;color:#555a6e;text-align:right', text: 'Deprioritize' }
  ];
  quadrants.forEach(q => {
    const div = document.createElement('div');
    div.className = q.cls;
    div.setAttribute('style', q.style);
    div.textContent = q.text;
    container.appendChild(div);
  });

  // Divider lines
  const hLine = document.createElement('div');
  hLine.style.cssText = 'position:absolute;top:50%;left:0;right:0;height:1px;background:rgba(255,255,255,0.08);';
  const vLine = document.createElement('div');
  vLine.style.cssText = 'position:absolute;left:50%;top:0;bottom:0;width:1px;background:rgba(255,255,255,0.08);';
  container.appendChild(hLine);
  container.appendChild(vLine);

  const priorityColors = { P0: '#ff5f6d', P1: '#ffc94d', P2: '#6c8fff' };

  opportunities.forEach(opp => {
    const dot = document.createElement('div');
    dot.className = 'matrix-dot';
    // x = effort (0=easy=left, 100=hard=right)
    // y = impact (0=low=bottom, 100=high=top)
    const left = (opp.x / 100) * 100;
    const top = (100 - opp.y) / 100 * 100;
    dot.style.left = left + '%';
    dot.style.top = top + '%';
    dot.style.background = priorityColors[opp.priority] || '#6c8fff';
    dot.style.color = priorityColors[opp.priority] || '#6c8fff';
    dot.title = `${opp.title}\nRICE: ${opp.rice.toLocaleString()}\nPriority: ${opp.priority}`;

    const lbl = document.createElement('div');
    lbl.className = 'matrix-dot-label';
    lbl.textContent = opp.title;
    dot.appendChild(lbl);

    // Size by RICE
    const maxRice = Math.max(...opportunities.map(o => o.rice));
    const size = 10 + (opp.rice / maxRice) * 16;
    dot.style.width = size + 'px';
    dot.style.height = size + 'px';

    container.appendChild(dot);
  });
}
