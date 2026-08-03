function drawDonut(canvasId, segments) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const outerR = 120;
  const innerR = 72;

  let angle = -Math.PI / 2;
  const total = segments.reduce((sum, s) => sum + s.pct, 0);

  segments.forEach(seg => {
    const sweep = (seg.pct / total) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outerR, angle, angle + sweep);
    ctx.closePath();
    ctx.fillStyle = seg.color;
    ctx.fill();
    angle += sweep;
  });

  // knock out the center to form a donut
  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, 2 * Math.PI);
  ctx.fillStyle = '#181b22';
  ctx.fill();

  ctx.fillStyle = '#f0f2f8';
  ctx.font = 'bold 22px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('23,978', cx, cy - 10);
  ctx.fillStyle = '#8b90a7';
  ctx.font = '11px Inter, sans-serif';
  ctx.fillText('complaints', cx, cy + 12);
}

function animateCounter(el, target, duration) {
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const t = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const current = Math.floor(eased * target);

    el.textContent = current.toLocaleString();
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString();
  }

  requestAnimationFrame(tick);
}

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

    const segments = [
      { cls: 'seg-five',  pct: bank.rating_dist.five,  label: '5*' },
      { cls: 'seg-four',  pct: bank.rating_dist.four,  label: '4*' },
      { cls: 'seg-three', pct: bank.rating_dist.three, label: '3*' },
      { cls: 'seg-two',   pct: bank.rating_dist.two,   label: '2*' },
      { cls: 'seg-one',   pct: bank.rating_dist.one,   label: '1*' }
    ];

    segments.forEach(seg => {
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

  const legend = document.createElement('div');
  legend.className = 'stacked-legend';

  [
    { cls: 'seg-five',  label: '5 Stars' },
    { cls: 'seg-four',  label: '4 Stars' },
    { cls: 'seg-three', label: '3 Stars' },
    { cls: 'seg-two',   label: '2 Stars' },
    { cls: 'seg-one',   label: '1 Star'  }
  ].forEach(item => {
    const div = document.createElement('div');
    div.className = 'legend-seg';
    div.innerHTML = `<div class="legend-swatch ${item.cls}"></div>${item.label}`;
    legend.appendChild(div);
  });

  container.appendChild(legend);
}

function buildMatrix(containerId, opportunities) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const quadrants = [
    { style: 'top:10px;left:10px;color:#3dffa0',               text: 'Quick Wins' },
    { style: 'top:10px;right:10px;color:#6c8fff;text-align:right', text: 'Strategic Bets' },
    { style: 'bottom:10px;left:10px;color:#555a6e',             text: 'Table Stakes' },
    { style: 'bottom:10px;right:10px;color:#555a6e;text-align:right', text: 'Deprioritize' }
  ];

  quadrants.forEach(q => {
    const div = document.createElement('div');
    div.className = 'matrix-quadrant';
    div.setAttribute('style', q.style);
    div.textContent = q.text;
    container.appendChild(div);
  });

  const hLine = document.createElement('div');
  hLine.style.cssText = 'position:absolute;top:50%;left:0;right:0;height:1px;background:rgba(255,255,255,0.08);';
  const vLine = document.createElement('div');
  vLine.style.cssText = 'position:absolute;left:50%;top:0;bottom:0;width:1px;background:rgba(255,255,255,0.08);';
  container.appendChild(hLine);
  container.appendChild(vLine);

  const priorityColors = { P0: '#ff5f6d', P1: '#ffc94d', P2: '#6c8fff' };
  const maxRice = Math.max(...opportunities.map(o => o.rice));

  opportunities.forEach(opp => {
    const dot = document.createElement('div');
    dot.className = 'matrix-dot';
    dot.style.left  = opp.x + '%';
    dot.style.top   = (100 - opp.y) + '%';
    dot.style.background = priorityColors[opp.priority] || '#6c8fff';
    dot.style.color      = priorityColors[opp.priority] || '#6c8fff';
    dot.title = `${opp.title} / RICE: ${opp.rice.toLocaleString()} / ${opp.priority}`;

    const size = 10 + (opp.rice / maxRice) * 16;
    dot.style.width  = size + 'px';
    dot.style.height = size + 'px';

    const lbl = document.createElement('div');
    lbl.className = 'matrix-dot-label';
    lbl.textContent = opp.title;
    dot.appendChild(lbl);

    container.appendChild(dot);
  });
}
