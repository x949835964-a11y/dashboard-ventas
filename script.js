/* Dashboard de ventas — Mercado Andino
 * Datos de ejemplo generados en el navegador + Chart.js
 */
(function () {
  'use strict';

  /* ---------- Utilidades ---------- */
  const DAY = 86400000;
  const pad = n => String(n).padStart(2, '0');
  const dayKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const startOfDay = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const endOfDay = d => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const parseInput = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const daysBetween = (a, b) => Math.round((startOfDay(b) - startOfDay(a)) / DAY) + 1;

  const money = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const money0 = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 0 });
  const intF = new Intl.NumberFormat('es-PE');
  const fmtMoney = v => money.format(v);
  const compactMoney = v => v >= 1e6 ? 'S/ ' + (v / 1e6).toFixed(1) + ' M' : v >= 1000 ? 'S/ ' + (v / 1000).toFixed(v >= 10000 ? 0 : 1) + ' mil' : 'S/ ' + Math.round(v);
  const dShort = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short' });
  const dLong = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });
  const fmtShort = d => dShort.format(d).replace('.', '');
  const fmtLong = d => dLong.format(d).replace('.', '');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  const rnd = mulberry32(20261019);
  const pick = arr => arr[Math.floor(rnd() * arr.length)];
  function weighted(items) {
    const total = items.reduce((s, i) => s + i.w, 0);
    let r = rnd() * total;
    for (const it of items) { r -= it.w; if (r <= 0) return it; }
    return items[items.length - 1];
  }

  /* ---------- Catálogo y datos de ejemplo ---------- */
  const CATS = [
    { name: 'Electrónica', color: '--c1' },
    { name: 'Hogar', color: '--c2' },
    { name: 'Moda', color: '--c3' },
    { name: 'Deportes', color: '--c4' },
    { name: 'Belleza', color: '--c5' }
  ];
  const CATALOG = [
    { name: 'Audífonos inalámbricos', cat: 'Electrónica', price: 189, w: 10 },
    { name: 'Smartwatch deportivo', cat: 'Electrónica', price: 459, w: 6 },
    { name: 'Parlante Bluetooth', cat: 'Electrónica', price: 239, w: 7 },
    { name: 'Teclado mecánico', cat: 'Electrónica', price: 329, w: 4 },
    { name: 'Freidora de aire 5 L', cat: 'Hogar', price: 399, w: 7 },
    { name: 'Cafetera de goteo', cat: 'Hogar', price: 179, w: 5 },
    { name: 'Juego de sábanas 2 plz', cat: 'Hogar', price: 149, w: 6 },
    { name: 'Lámpara LED de escritorio', cat: 'Hogar', price: 89, w: 6 },
    { name: 'Chompa de alpaca', cat: 'Moda', price: 199, w: 8 },
    { name: 'Zapatillas urbanas', cat: 'Moda', price: 279, w: 8 },
    { name: 'Casaca impermeable', cat: 'Moda', price: 219, w: 5 },
    { name: 'Mat de yoga', cat: 'Deportes', price: 79, w: 7 },
    { name: 'Mancuernas 10 kg (par)', cat: 'Deportes', price: 159, w: 4 },
    { name: 'Bicicleta estacionaria', cat: 'Deportes', price: 1290, w: 1.5 },
    { name: 'Set de cuidado facial', cat: 'Belleza', price: 129, w: 6 },
    { name: 'Perfume 100 ml', cat: 'Belleza', price: 259, w: 4 },
    { name: 'Secadora de cabello', cat: 'Belleza', price: 169, w: 4 }
  ];
  const FIRST = ['Lucía', 'Carlos', 'Andrea', 'Jorge', 'Valeria', 'Miguel', 'Rosa', 'Luis', 'Camila', 'Renzo', 'Fiorella', 'José', 'Ximena', 'Diego', 'María', 'Kevin', 'Sofía', 'Martín', 'Alessandra', 'Bruno', 'Gabriela', 'Piero', 'Daniela', 'Óscar'];
  const LAST = ['Quispe', 'Mamani', 'Flores', 'Huamán', 'Rojas', 'Chávez', 'Vargas', 'Torres', 'Ramos', 'Castillo', 'Díaz', 'Paredes', 'Gutiérrez', 'Sánchez', 'Cárdenas', 'Mendoza', 'Salazar', 'Ccori', 'Ticona', 'Espinoza'];
  const PAY = [{ v: 'Tarjeta', w: 42 }, { v: 'Yape', w: 30 }, { v: 'Plin', w: 14 }, { v: 'Transferencia', w: 9 }, { v: 'Contraentrega', w: 5 }];
  const HOUR_W = (() => {
    const w = [0.4, 0.25, 0.15, 0.1, 0.1, 0.2, 0.5, 0.9, 1.3, 1.6, 1.8, 1.9, 2.0, 1.9, 1.8, 1.7, 1.7, 1.8, 2.1, 2.4, 2.5, 2.2, 1.6, 0.9];
    const s = w.reduce((a, b) => a + b, 0); return w.map(x => x / s);
  })();
  const DOW_F = [1.12, 0.92, 0.95, 0.97, 1.0, 1.08, 1.15]; // dom..sáb

  const NOW = new Date();
  const TODAY = startOfDay(NOW);
  const HISTORY_DAYS = 150;
  const DATA_START = addDays(TODAY, -(HISTORY_DAYS - 1));

  const DAYS = [];   // { date, key, sessions: [24] }
  const ORDERS = []; // { id, ts, customer, product, cat, qty, unit, total, pay, status }

  (function generate() {
    let seq = 48210;
    for (let i = 0; i < HISTORY_DAYS; i++) {
      const date = addDays(DATA_START, i);
      const isToday = i === HISTORY_DAYS - 1;
      const dom = date.getDate();
      const quincena = [1, 15, 16, 30, 31].includes(dom) ? 1.18 : 1; // días de pago
      const base = 2150 * DOW_F[date.getDay()] * (1 + i * 0.0018) * quincena * (0.9 + rnd() * 0.2);
      const conv = (0.026 + rnd() * 0.009) * (quincena > 1 ? 1.12 : 1);
      const sessions = new Array(24).fill(0);
      for (let h = 0; h < 24; h++) {
        if (isToday && h > NOW.getHours()) break;
        let s = base * HOUR_W[h] * (0.85 + rnd() * 0.3);
        if (isToday && h === NOW.getHours()) s *= NOW.getMinutes() / 60;
        sessions[h] = Math.round(s);
        const expected = sessions[h] * conv;
        const n = Math.floor(expected) + (rnd() < expected % 1 ? 1 : 0);
        for (let k = 0; k < n; k++) {
          const maxMin = (isToday && h === NOW.getHours()) ? Math.max(0, NOW.getMinutes()) : 59;
          const ts = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, Math.floor(rnd() * (maxMin + 1)), Math.floor(rnd() * 60));
          const p = weighted(CATALOG);
          const r = rnd();
          const qty = p.price > 800 ? 1 : r < 0.8 ? 1 : r < 0.95 ? 2 : 3;
          const age = (NOW - ts) / DAY;
          const sr = rnd();
          const status = age < 2 && sr < 0.22 ? 'Pendiente' : sr < 0.04 ? 'Reembolsado' : 'Completado';
          ORDERS.push({
            ts, product: p.name, cat: p.cat, qty, unit: p.price, total: p.price * qty,
            customer: pick(FIRST) + ' ' + pick(LAST),
            pay: weighted(PAY.map(x => ({ ...x }))).v,
            status
          });
        }
      }
      DAYS.push({ date, key: dayKey(date), sessions });
    }
    ORDERS.sort((a, b) => a.ts - b.ts);
    ORDERS.forEach(o => { o.id = 'MA-' + (seq++); });
  })();

  /* ---------- Estado ---------- */
  const state = { range: '7d', q: '', page: 1, pageSize: 10, sortKey: 'ts', sortDir: -1 };
  const $ = id => document.getElementById(id);
  const dFrom = $('dFrom'), dTo = $('dTo');
  dFrom.min = dTo.min = dayKey(DATA_START);
  dFrom.max = dTo.max = dayKey(TODAY);
  dFrom.value = dayKey(addDays(TODAY, -29));
  dTo.value = dayKey(TODAY);

  try { const saved = localStorage.getItem('ma-range'); if (saved && ['today', '7d', 'month', 'custom'].includes(saved)) state.range = saved; } catch (e) {}

  function getRange() {
    switch (state.range) {
      case 'today': return { start: TODAY, end: NOW };
      case 'month': return { start: new Date(NOW.getFullYear(), NOW.getMonth(), 1), end: NOW };
      case 'custom': {
        if (!dFrom.value || !dTo.value) return null;
        const s = parseInput(dFrom.value);
        let e = endOfDay(parseInput(dTo.value));
        if (s > e) return null;
        if (e > NOW) e = NOW;
        return { start: s < DATA_START ? DATA_START : s, end: e };
      }
      default: return { start: addDays(TODAY, -6), end: NOW };
    }
  }

  function inRange(r) { return ORDERS.filter(o => o.ts >= r.start && o.ts <= r.end); }
  function sessionsIn(r) {
    let s = 0;
    for (const d of DAYS) {
      if (d.date > r.end || endOfDay(d.date) < r.start) continue;
      for (let h = 0; h < 24; h++) {
        const t = new Date(d.date.getFullYear(), d.date.getMonth(), d.date.getDate(), h);
        if (t >= startOfDay(r.start) && t >= new Date(r.start.getFullYear(), r.start.getMonth(), r.start.getDate(), r.start.getHours()) && t <= r.end) s += d.sessions[h];
      }
    }
    return s;
  }
  function metrics(orders, r) {
    const valid = orders.filter(o => o.status !== 'Reembolsado');
    const sales = valid.reduce((s, o) => s + o.total, 0);
    const sessions = sessionsIn(r);
    return { sales, count: valid.length, ticket: valid.length ? sales / valid.length : 0, conv: sessions ? valid.length / sessions : 0, sessions, valid };
  }

  /* ---------- Tema para Chart.js ---------- */
  function tok(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
  function alpha(hex, a) {
    const h = hex.replace('#', '');
    if (h.length !== 6) return hex;
    const n = parseInt(h, 16);
    return `rgba(${n >> 16 & 255}, ${n >> 8 & 255}, ${n & 255}, ${a})`;
  }

  let trendChart, catChart, topChart;
  const hasChart = typeof window.Chart !== 'undefined';
  if (hasChart) {
    Chart.defaults.font.family = '"Manrope", "Segoe UI", system-ui, sans-serif';
    Chart.defaults.font.size = 12;
    if (reduceMotion) Chart.defaults.animation = false;
  }

  function tooltipStyle() {
    return {
      backgroundColor: tok('--surface'), titleColor: tok('--fg'), bodyColor: tok('--fg'),
      borderColor: tok('--line'), borderWidth: 1, padding: 10, cornerRadius: 8, boxPadding: 4,
      titleFont: { weight: '700' }, bodyFont: { family: '"IBM Plex Mono", monospace', size: 12 }
    };
  }

  /* ---------- Render ---------- */
  function setDelta(el, cur, prev, kind) {
    el.classList.remove('up', 'down');
    if (prev == null || !isFinite(prev) || prev === 0) { el.textContent = 'sin comparación'; return; }
    let txt, diff;
    if (kind === 'pp') {
      diff = (cur - prev) * 100;
      txt = (diff >= 0 ? '+' : '−') + Math.abs(diff).toFixed(2) + ' pp';
    } else {
      diff = (cur - prev) / prev * 100;
      txt = (diff >= 0 ? '▲ ' : '▼ ') + Math.abs(diff).toFixed(1) + '%';
    }
    if (Math.abs(diff) >= 0.05) el.classList.add(diff > 0 ? 'up' : 'down');
    el.textContent = txt;
  }

  let currentRows = [];

  function render() {
    const r = getRange();
    const err = $('dErr');
    if (!r) {
      err.hidden = false;
      err.textContent = 'La fecha "Desde" debe ser anterior o igual a "Hasta".';
      return;
    }
    err.hidden = true;

    const nDays = daysBetween(r.start, r.end);
    const prev = { start: addDays(r.start, -nDays), end: addDays(r.end, -nDays) };
    const hasPrev = prev.start >= DATA_START;

    const orders = inRange(r);
    const m = metrics(orders, r);
    const pm = hasPrev ? metrics(inRange(prev), prev) : null;

    // Nota de rango
    const label = nDays === 1 ? fmtLong(r.start) : `${fmtShort(r.start)} – ${fmtLong(r.end)}`;
    const plabel = hasPrev ? (nDays === 1 ? fmtLong(prev.start) : `${fmtShort(prev.start)} – ${fmtLong(prev.end)}`) : 'sin datos previos';
    $('rangeNote').innerHTML = `Mostrando <b>${esc(label)}</b> · comparado con ${esc(plabel)}`;

    // KPIs
    $('kSales').textContent = fmtMoney(m.sales);
    $('kOrders').textContent = intF.format(m.count);
    $('kTicket').textContent = fmtMoney(m.ticket);
    $('kConv').textContent = (m.conv * 100).toFixed(2) + '%';
    $('convSub').textContent = `${intF.format(m.sessions)} sesiones`;
    setDelta($('dSales'), m.sales, pm && pm.sales);
    setDelta($('dOrders'), m.count, pm && pm.count);
    setDelta($('dTicket'), m.ticket, pm && pm.ticket);
    setDelta($('dConv'), m.conv, pm && pm.conv, 'pp');

    renderTrend(r, prev, hasPrev, nDays, m.valid);
    renderCats(m.valid, m.sales);
    renderTop(m.valid);

    currentRows = orders;
    renderTable();
  }

  function renderTrend(r, prev, hasPrev, nDays, valid) {
    let labels = [], cur = [], old = [];
    const prevValid = hasPrev ? inRange(prev).filter(o => o.status !== 'Reembolsado') : [];
    if (nDays === 1) {
      $('trendSub').textContent = 'Ventas por hora';
      const lastH = r.end.getHours();
      for (let h = 0; h <= lastH; h++) { labels.push(pad(h) + ':00'); cur.push(0); old.push(hasPrev ? 0 : null); }
      valid.forEach(o => { cur[o.ts.getHours()] += o.total; });
      prevValid.forEach(o => { const h = o.ts.getHours(); if (h <= lastH) old[h] += o.total; });
    } else {
      $('trendSub').textContent = 'Ventas por día';
      const idx = {};
      for (let i = 0; i < nDays; i++) {
        const d = addDays(startOfDay(r.start), i);
        idx[dayKey(d)] = i; labels.push(fmtShort(d)); cur.push(0); old.push(hasPrev ? 0 : null);
      }
      valid.forEach(o => { const i = idx[dayKey(o.ts)]; if (i != null) cur[i] += o.total; });
      prevValid.forEach(o => { const i = idx[dayKey(addDays(o.ts, nDays))]; if (i != null) old[i] += o.total; });
    }
    if (!hasChart) return;
    const c1 = tok('--c1'), muted = tok('--muted'), line = tok('--line');
    const fillFn = ctx => {
      const { chart } = ctx; const { chartArea } = chart;
      if (!chartArea) return alpha(c1, 0.15);
      const g = chart.ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
      g.addColorStop(0, alpha(c1, 0.32)); g.addColorStop(1, alpha(c1, 0));
      return g;
    };
    const datasets = [
      { label: 'Periodo actual', data: cur, borderColor: c1, backgroundColor: fillFn, fill: true, tension: 0.35, borderWidth: 2.2, pointRadius: labels.length <= 10 ? 3 : 0, pointBackgroundColor: c1, pointHoverRadius: 5 },
      { label: 'Periodo anterior', data: old, borderColor: muted, borderDash: [4, 4], fill: false, tension: 0.35, borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 3 }
    ];
    const options = {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: { ...tooltipStyle(), callbacks: { label: c => ` ${c.dataset.label}: ${c.parsed.y == null ? '—' : fmtMoney(c.parsed.y)}` } }
      },
      scales: {
        x: { grid: { display: false }, border: { color: line }, ticks: { color: muted, maxRotation: 0, autoSkip: true, maxTicksLimit: 8 } },
        y: { beginAtZero: true, grid: { color: line }, border: { display: false }, ticks: { color: muted, maxTicksLimit: 6, callback: v => compactMoney(v) } }
      }
    };
    if (!trendChart) trendChart = new Chart($('cTrend'), { type: 'line', data: { labels, datasets }, options });
    else { trendChart.data.labels = labels; trendChart.data.datasets = datasets; trendChart.options = options; trendChart.update(); }
  }

  function renderCats(valid, total) {
    const sums = CATS.map(c => ({ ...c, v: 0, col: tok(c.color) }));
    valid.forEach(o => { sums.find(s => s.name === o.cat).v += o.total; });
    sums.sort((a, b) => b.v - a.v);
    $('donutTotal').textContent = compactMoney(total);
    $('catList').innerHTML = sums.map(s => `<li><span class="dot" style="background:${s.col}"></span><span>${esc(s.name)}</span><span class="v">${money0.format(s.v)}</span><span class="p">${total ? (s.v / total * 100).toFixed(1) : '0.0'}%</span></li>`).join('');
    if (!hasChart) return;
    const data = { labels: sums.map(s => s.name), datasets: [{ data: sums.map(s => s.v), backgroundColor: sums.map(s => s.col), borderColor: tok('--surface'), borderWidth: 3, hoverOffset: 6 }] };
    const options = {
      responsive: true, maintainAspectRatio: false, cutout: '70%',
      plugins: { legend: { display: false }, tooltip: { ...tooltipStyle(), callbacks: { label: c => ` ${fmtMoney(c.parsed)} (${total ? (c.parsed / total * 100).toFixed(1) : 0}%)` } } }
    };
    if (!catChart) catChart = new Chart($('cCats'), { type: 'doughnut', data, options });
    else { catChart.data = data; catChart.options = options; catChart.update(); }
  }

  function renderTop(valid) {
    const map = new Map();
    valid.forEach(o => {
      const e = map.get(o.product) || { name: o.product, cat: o.cat, v: 0, u: 0 };
      e.v += o.total; e.u += o.qty; map.set(o.product, e);
    });
    const top = [...map.values()].sort((a, b) => b.v - a.v).slice(0, 7);
    if (!hasChart) return;
    const colOf = cat => tok(CATS.find(c => c.name === cat).color);
    const muted = tok('--muted'), line = tok('--line'), fg = tok('--fg');
    const data = { labels: top.map(t => t.name), datasets: [{ data: top.map(t => t.v), backgroundColor: top.map(t => colOf(t.cat)), borderRadius: 6, barThickness: 'flex', maxBarThickness: 26 }] };
    const options = {
      indexAxis: 'y', responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { ...tooltipStyle(), callbacks: { title: c => c[0].label, label: c => ` ${fmtMoney(c.parsed.x)} · ${intF.format(top[c.dataIndex].u)} uds. · ${top[c.dataIndex].cat}` } }
      },
      scales: {
        x: { beginAtZero: true, grid: { color: line }, border: { display: false }, ticks: { color: muted, maxTicksLimit: 5, callback: v => compactMoney(v) } },
        y: { grid: { display: false }, border: { color: line }, ticks: { color: fg, font: { weight: '600' }, callback: function (v) { const l = this.getLabelForValue(v); return l.length > 22 ? l.slice(0, 21) + '…' : l; } } }
      }
    };
    if (!topChart) topChart = new Chart($('cTop'), { type: 'bar', data, options });
    else { topChart.data = data; topChart.options = options; topChart.update(); }
  }

  /* ---------- Tabla ---------- */
  function filteredRows() {
    const q = state.q.trim().toLowerCase();
    let rows = q ? currentRows.filter(o => (o.id + ' ' + o.customer + ' ' + o.product + ' ' + o.cat + ' ' + o.pay + ' ' + o.status).toLowerCase().includes(q)) : currentRows.slice();
    const k = state.sortKey, dir = state.sortDir;
    rows.sort((a, b) => (a[k] - b[k]) * dir);
    return rows;
  }

  const timeF = new Intl.DateTimeFormat('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false });
  const STATUS_CLS = { Completado: 'ok', Pendiente: 'pend', Reembolsado: 'ref' };

  function renderTable() {
    const rows = filteredRows();
    const pages = Math.max(1, Math.ceil(rows.length / state.pageSize));
    if (state.page > pages) state.page = pages;
    const from = (state.page - 1) * state.pageSize;
    const slice = rows.slice(from, from + state.pageSize);
    const tb = $('tbody');
    if (!slice.length) {
      tb.innerHTML = `<tr><td colspan="7" class="empty">${state.q ? 'Ninguna transacción coincide con la búsqueda.' : 'No hay transacciones en este rango de fechas.'}</td></tr>`;
    } else {
      tb.innerHTML = slice.map(o => `<tr>
        <td class="id">${o.id}</td>
        <td class="dt">${fmtShort(o.ts)} · ${timeF.format(o.ts)}</td>
        <td>${esc(o.customer)}</td>
        <td>${esc(o.product)}${o.qty > 1 ? ` <span class="num">×${o.qty}</span>` : ''}<span class="sub">${esc(o.cat)}</span></td>
        <td>${esc(o.pay)}</td>
        <td><span class="pill ${STATUS_CLS[o.status]}">${o.status}</span></td>
        <td class="r">${fmtMoney(o.total)}</td>
      </tr>`).join('');
    }
    $('txSub').textContent = `${intF.format(rows.length)} transacciones en el rango${state.q ? ' (filtradas)' : ''}`;
    $('pageInfo').textContent = rows.length ? `${intF.format(from + 1)}–${intF.format(from + slice.length)} de ${intF.format(rows.length)}` : '0 resultados';
    $('pageNum').textContent = `${state.page} / ${pages}`;
    $('prev').disabled = state.page <= 1;
    $('next').disabled = state.page >= pages;
    $('btnCsv').disabled = rows.length === 0;
    document.querySelectorAll('th button[data-sort]').forEach(b => {
      const active = b.dataset.sort === state.sortKey;
      b.dataset.active = active;
      $('arr-' + b.dataset.sort).textContent = active ? (state.sortDir < 0 ? '↓' : '↑') : '↕';
    });
  }

  /* ---------- Exportar CSV ---------- */
  function toCSV(rows) {
    const head = ['Pedido', 'Fecha', 'Hora', 'Cliente', 'Producto', 'Categoría', 'Cantidad', 'Precio unitario (PEN)', 'Método de pago', 'Estado', 'Total (PEN)'];
    const q = v => { const s = String(v); return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
    const lines = [head.join(',')];
    rows.forEach(o => lines.push([o.id, dayKey(o.ts), timeF.format(o.ts), o.customer, o.product, o.cat, o.qty, o.unit.toFixed(2), o.pay, o.status, o.total.toFixed(2)].map(q).join(',')));
    return '﻿' + lines.join('\r\n');
  }

  let toastT;
  function toast(msg) {
    const t = $('toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2800);
  }

  $('btnCsv').addEventListener('click', () => {
    const rows = filteredRows();
    if (!rows.length) return;
    const r = getRange();
    const filename = `ventas_${dayKey(r.start)}_a_${dayKey(r.end)}.csv`;
    const csv = toCSV(rows);
    try {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast(`Exportadas ${intF.format(rows.length)} filas a ${filename}`);
    } catch (e) { toast('No se pudo exportar el archivo en esta vista.'); }
  });

  /* ---------- Eventos ---------- */
  const segBtns = document.querySelectorAll('.seg button');
  function setRange(v) {
    state.range = v; state.page = 1;
    segBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.range === v)));
    $('customBox').hidden = v !== 'custom';
    try { localStorage.setItem('ma-range', v); } catch (e) {}
    render();
  }
  segBtns.forEach(b => b.addEventListener('click', () => setRange(b.dataset.range)));
  [dFrom, dTo].forEach(i => i.addEventListener('change', () => { state.page = 1; render(); }));

  let qT;
  $('q').addEventListener('input', e => { clearTimeout(qT); qT = setTimeout(() => { state.q = e.target.value; state.page = 1; renderTable(); }, 150); });
  $('prev').addEventListener('click', () => { state.page--; renderTable(); $('tableScroll').scrollTop = 0; });
  $('next').addEventListener('click', () => { state.page++; renderTable(); $('tableScroll').scrollTop = 0; });
  document.querySelectorAll('th button[data-sort]').forEach(b => b.addEventListener('click', () => {
    const k = b.dataset.sort;
    if (state.sortKey === k) state.sortDir *= -1; else { state.sortKey = k; state.sortDir = -1; }
    state.page = 1; renderTable();
  }));

  // Redibujar gráficos cuando cambia el tema
  const rerender = () => render();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', rerender);
  new MutationObserver(rerender).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  setRange(state.range);
})();
