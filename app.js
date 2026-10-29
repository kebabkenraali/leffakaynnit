'use strict';

const STORAGE_KEY = 'leffakaynnit.v1';
const XLSX_URL = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
const DAY = 86400000;

const DEFAULT_STATE = {
  settings: {
    annualFee: 372.90,
    ticketPrice: 14.45,
    seasonStart: '2026-09-01',
    seasonEnd: '2027-08-31',
  },
  visits: [],
};

const eur = new Intl.NumberFormat('fi-FI', { style: 'currency', currency: 'EUR' });
const fmtDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d}.${m}.${y}`;
};
const $ = (sel) => document.querySelector(sel);

// ---------- Tallennus ----------

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const data = JSON.parse(raw);
    return {
      settings: { ...DEFAULT_STATE.settings, ...data.settings },
      visits: Array.isArray(data.visits) ? data.visits : [],
    };
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    toast('Tallennus epäonnistui – ota varmuuskopio!');
  }
}

let state = load();

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const num = (v) => {
  const n = parseFloat(String(v ?? '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
};

// ---------- Laskenta ----------

/** Käynnit aikajärjestyksessä, jokaiselle järjestysnumero ja kertymät. */
function computeVisits() {
  const fee = state.settings.annualFee;
  const sorted = [...state.visits].sort(
    (a, b) => a.date.localeCompare(b.date) || (a.created ?? 0) - (b.created ?? 0)
  );
  let cumSnacks = 0;
  let cumOther = 0;
  return sorted.map((v, i) => {
    const nro = i + 1;
    cumSnacks += v.snacks || 0;
    cumOther += v.other || 0;
    return {
      ...v,
      nro,
      movieAt: fee / nro, // pelkkä leffa: vuosimaksu jaettuna käyntien määrällä tämän leffan kohdalla
      totalAt: (fee + cumSnacks) / nro, // leffa + herkut keskimäärin tähän mennessä
      cumSnacks,
      cumOther,
    };
  });
}

function computeSummary(rows) {
  const s = state.settings;
  const n = rows.length;
  const snacks = rows.reduce((a, v) => a + (v.snacks || 0), 0);
  const other = rows.reduce((a, v) => a + (v.other || 0), 0);
  const start = Date.parse(s.seasonStart);
  const end = Date.parse(s.seasonEnd) + DAY;
  const now = Date.now();
  const totalDays = Math.max(1, Math.round((end - start) / DAY));
  const elapsed = Math.min(totalDays, Math.max(1, Math.ceil((now - start) / DAY)));
  const projected = n ? Math.round((n / elapsed) * totalDays) : 0;
  return {
    n,
    snacks,
    other,
    movie: n ? s.annualFee / n : null,
    withSnacks: n ? (s.annualFee + snacks) / n : null,
    total: s.annualFee + snacks + other,
    saving: n * s.ticketPrice - s.annualFee,
    breakEven: s.ticketPrice > 0 ? Math.ceil(s.annualFee / s.ticketPrice) : 0,
    daysLeft: Math.max(0, Math.ceil((end - now) / DAY)),
    projected,
    projectedPrice: projected ? s.annualFee / projected : null,
  };
}

// ---------- Näkymät ----------

function render() {
  const rows = computeVisits();
  const sum = computeSummary(rows);
  renderSummary(rows, sum);
  renderList(rows);
  renderDatalists();
  $('#season-label').textContent =
    `${fmtDate(state.settings.seasonStart)} – ${fmtDate(state.settings.seasonEnd)}`;
}

function renderSummary(rows, sum) {
  const s = state.settings;
  $('#h-movie').textContent = sum.movie != null ? eur.format(sum.movie) : '–';
  $('#h-total').textContent = sum.withSnacks != null ? eur.format(sum.withSnacks) : '–';
  $('#h-count').textContent = sum.n;

  const pct = sum.breakEven ? Math.min(100, (sum.n / sum.breakEven) * 100) : 0;
  $('#be-bar').style.width = pct + '%';
  $('#be-label').textContent = `${sum.n} / ${sum.breakEven} käyntiä`;
  $('#be-text').textContent =
    sum.n >= sum.breakEven
      ? `Premium on maksanut itsensä takaisin! Jokainen käynti nyt on puhdasta voittoa sarjalippuun verrattuna.`
      : `Vielä ${sum.breakEven - sum.n} käyntiä, niin Premium on halvempi kuin sarjalippu (${eur.format(s.ticketPrice)}/lippu).`;

  $('#s-snacks').textContent = eur.format(sum.snacks);
  $('#s-snacks-avg').textContent = sum.n ? eur.format(sum.snacks / sum.n) : '–';
  $('#s-total').textContent = eur.format(sum.total);
  const saving = $('#s-saving');
  saving.textContent = (sum.saving >= 0 ? '+' : '') + eur.format(sum.saving);
  saving.className = 'val ' + (sum.saving >= 0 ? 'good' : 'bad');
  $('#s-left').textContent = `${sum.daysLeft} pv`;
  $('#s-proj').textContent = sum.projected
    ? `${sum.projected} kpl · ${eur.format(sum.projectedPrice)}`
    : '–';

  renderChart(rows);
  renderMonths(rows);
}

function renderChart(rows) {
  const el = $('#chart');
  if (rows.length < 2) {
    el.innerHTML = '<p class="muted small">Kaavio näkyy, kun käyntejä on vähintään kaksi.</p>';
    return;
  }
  const W = 320, H = 170, L = 34, R = 8, T = 8, B = 22;
  const ref = state.settings.ticketPrice;
  const yMax = Math.max(ref * 3, rows[rows.length - 1].totalAt * 1.2);
  const n = rows.length;
  const x = (i) => L + ((i - 1) / Math.max(1, n - 1)) * (W - L - R);
  const y = (v) => T + (1 - Math.min(v, yMax * 1.5) / yMax) * (H - T - B);
  const path = (key) => rows.map((r, i) => `${i ? 'L' : 'M'}${x(r.nro).toFixed(1)},${y(r[key]).toFixed(1)}`).join('');

  const ticks = [0, yMax / 3, (2 * yMax) / 3, yMax].map((v) => Math.round(v));
  const grid = ticks
    .map((v) => `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" stroke="var(--border)" stroke-width="0.6"/>
      <text x="${L - 4}" y="${y(v) + 3}" text-anchor="end">${v} €</text>`)
    .join('');
  const xTicks = [1, Math.ceil(n / 2), n]
    .filter((v, i, a) => a.indexOf(v) === i)
    .map((v) => `<text x="${x(v)}" y="${H - 6}" text-anchor="middle">${v}.</text>`)
    .join('');

  el.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Käyntihinnan kehitys">
      <defs><clipPath id="clip"><rect x="${L}" y="${T}" width="${W - L - R}" height="${H - T - B}"/></clipPath></defs>
      ${grid}${xTicks}
      <g clip-path="url(#clip)">
        <line x1="${L}" x2="${W - R}" y1="${y(ref)}" y2="${y(ref)}" stroke="var(--muted)" stroke-dasharray="4 3"/>
        <path d="${path('totalAt')}" fill="none" stroke="var(--accent-2)" stroke-width="2"/>
        <path d="${path('movieAt')}" fill="none" stroke="var(--accent)" stroke-width="2.5"/>
      </g>
    </svg>`;
}

function renderMonths(rows) {
  const byMonth = new Map();
  for (const r of rows) {
    const key = r.date.slice(0, 7);
    const m = byMonth.get(key) || { count: 0, snacks: 0, last: r };
    m.count++;
    m.snacks += r.snacks || 0;
    m.last = r;
    byMonth.set(key, m);
  }
  const months = ['tammi', 'helmi', 'maalis', 'huhti', 'touko', 'kesä', 'heinä', 'elo', 'syys', 'loka', 'marras', 'joulu'];
  $('#months').innerHTML = [...byMonth.entries()]
    .map(([key, m]) => {
      const [y, mo] = key.split('-').map(Number);
      return `<tr><td>${months[mo - 1]} ${String(y).slice(2)}</td><td>${m.count}</td>
        <td>${eur.format(m.snacks)}</td><td>${eur.format(m.last.movieAt)}</td></tr>`;
    })
    .join('') || '<tr><td colspan="4" class="muted">Ei käyntejä</td></tr>';
}

function renderList(rows) {
  const q = $('#search').value.trim().toLowerCase();
  const shown = rows.filter((r) => !q || r.title.toLowerCase().includes(q)).reverse();
  $('#empty').hidden = rows.length > 0;
  $('#visits').innerHTML = shown
    .map((r) => {
      const meta = [fmtDate(r.date), r.theater, r.note].filter(Boolean).map(esc).join(' · ');
      const snack = r.snacks ? ` · <span class="snack">herkut ${eur.format(r.snacks)}</span>` : '';
      return `<li class="visit" data-id="${r.id}">
        <div class="nro">${r.nro}</div>
        <div class="title">${esc(r.title)}</div>
        <div class="price"><b>${eur.format(r.movieAt)}</b><span>+ herkut ${eur.format(r.totalAt)}</span></div>
        <div class="meta">${meta}${snack}</div>
      </li>`;
    })
    .join('');
}

function renderDatalists() {
  const uniq = (key) => [...new Set(state.visits.map((v) => v[key]).filter(Boolean))].sort();
  $('#titles').innerHTML = uniq('title').map((t) => `<option value="${esc(t)}">`).join('');
  $('#theaters').innerHTML = uniq('theater').map((t) => `<option value="${esc(t)}">`).join('');
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.hidden = true), 2600);
}

// ---------- Navigointi ----------

function showView(name) {
  document.querySelectorAll('.view').forEach((v) => v.classList.toggle('active', v.id === 'view-' + name));
  document.querySelectorAll('.tabs button').forEach((b) => b.classList.toggle('active', b.dataset.view === name));
  window.scrollTo(0, 0);
}
document.querySelectorAll('.tabs button').forEach((b) => b.addEventListener('click', () => showView(b.dataset.view)));

// ---------- Käynnin lisäys / muokkaus ----------

const dialog = $('#visit-dialog');
const form = $('#visit-form');

function todayIso() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function openVisit(visit) {
  form.reset();
  $('#dialog-title').textContent = visit ? 'Muokkaa käyntiä' : 'Uusi käynti';
  $('#delete-visit').hidden = !visit;
  form.id.value = visit?.id ?? '';
  form.date.value = visit?.date ?? todayIso();
  form.title.value = visit?.title ?? '';
  form.theater.value = visit?.theater ?? (state.visits.at(-1)?.theater || '');
  form.snacks.value = visit?.snacks ? String(visit.snacks).replace('.', ',') : '';
  form.other.value = visit?.other ? String(visit.other).replace('.', ',') : '';
  form.note.value = visit?.note ?? '';
  dialog.showModal();
  if (!visit) form.title.focus();
}

$('#fab').addEventListener('click', () => openVisit(null));
$('#cancel-visit').addEventListener('click', () => dialog.close());
$('#visits').addEventListener('click', (e) => {
  const li = e.target.closest('.visit');
  if (li) openVisit(state.visits.find((v) => v.id === li.dataset.id));
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = {
    date: form.date.value,
    title: form.title.value.trim(),
    theater: form.theater.value.trim(),
    snacks: num(form.snacks.value),
    other: num(form.other.value),
    note: form.note.value.trim(),
  };
  if (!data.date || !data.title) return;
  const id = form.id.value;
  if (id) {
    const v = state.visits.find((x) => x.id === id);
    Object.assign(v, data);
  } else {
    state.visits.push({ id: uid(), created: Date.now(), ...data });
  }
  save();
  render();
  dialog.close();
  const rows = computeVisits();
  const me = rows.find((r) => r.title === data.title && r.date === data.date);
  toast(id ? 'Tallennettu' : `Käynti #${me?.nro} – leffan hinta nyt ${eur.format(computeSummary(rows).movie)}`);
});

$('#delete-visit').addEventListener('click', () => {
  const id = form.id.value;
  if (!id || !confirm('Poistetaanko tämä käynti?')) return;
  state.visits = state.visits.filter((v) => v.id !== id);
  save();
  render();
  dialog.close();
  toast('Käynti poistettu');
});

$('#search').addEventListener('input', () => renderList(computeVisits()));

// ---------- Asetukset ----------

const sForm = $('#settings-form');
function fillSettings() {
  for (const [k, v] of Object.entries(state.settings)) if (sForm[k]) sForm[k].value = v;
}
sForm.addEventListener('submit', (e) => {
  e.preventDefault();
  state.settings = {
    annualFee: num(sForm.annualFee.value),
    ticketPrice: num(sForm.ticketPrice.value),
    seasonStart: sForm.seasonStart.value,
    seasonEnd: sForm.seasonEnd.value,
  };
  save();
  render();
  toast('Asetukset tallennettu');
});

// ---------- Varmuuskopio ----------

function download(name, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

$('#export-json').addEventListener('click', () => {
  download(`leffakaynnit-${todayIso()}.json`, JSON.stringify(state, null, 2), 'application/json');
});

$('#import-json').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (!Array.isArray(data.visits)) throw new Error();
    if (!confirm(`Palautetaanko ${data.visits.length} käyntiä? Nykyiset tiedot korvataan.`)) return;
    state = { settings: { ...DEFAULT_STATE.settings, ...data.settings }, visits: data.visits };
    save();
    fillSettings();
    render();
    toast('Varmuuskopio palautettu');
  } catch {
    toast('Tiedosto ei ole kelvollinen varmuuskopio');
  }
});

$('#export-csv').addEventListener('click', () => {
  const dec = (v) => v.toFixed(2).replace('.', ',');
  const lines = [['Käynti nro', 'Päivä', 'Elokuva', 'Teatteri', 'Herkut €', 'Muut kulut €', 'Premium €/käynti', 'Leffa+herkut €/käynti', 'Muistiinpano']];
  for (const r of computeVisits()) {
    lines.push([r.nro, fmtDate(r.date), r.title, r.theater || '', dec(r.snacks || 0), dec(r.other || 0), dec(r.movieAt), dec(r.totalAt), r.note || '']);
  }
  const csv = lines.map((l) => l.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\r\n');
  download(`leffakaynnit-${todayIso()}.csv`, '﻿' + csv, 'text/csv');
});

$('#clear-all').addEventListener('click', () => {
  if (!state.visits.length || !confirm('Poistetaanko KAIKKI käynnit? Tätä ei voi perua.')) return;
  state.visits = [];
  save();
  render();
  toast('Kaikki käynnit poistettu');
});

// ---------- Excel-tuonti ----------

function loadXlsx() {
  if (window.XLSX) return Promise.resolve(window.XLSX);
  return new Promise((resolve, reject) => {
    const s = Object.assign(document.createElement('script'), { src: XLSX_URL });
    s.onload = () => resolve(window.XLSX);
    s.onerror = () => reject(new Error('Excel-lukijan lataus epäonnistui (tarvitaan verkkoyhteys)'));
    document.head.append(s);
  });
}

const pad = (n) => String(n).padStart(2, '0');

/** Muuntaa Excelin päivämäärän (sarjanumero tai teksti) muotoon YYYY-MM-DD. */
function parseDate(v) {
  if (v == null || v === '') return null;
  if (typeof v === 'number') {
    const d = new Date(Date.UTC(1899, 11, 30) + Math.round(v) * DAY);
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
  }
  const s = String(v).trim();
  let m;
  if ((m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/))) return `${m[1]}-${pad(m[2])}-${pad(m[3])}`;
  if ((m = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})/))) return `${m[3]}-${pad(m[2])}-${pad(m[1])}`;
  if ((m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/))) return `${m[3]}-${pad(m[1])}-${pad(m[2])}`; // US m/d/y
  return null;
}

function rowsFromWorkbook(XLSX, wb) {
  for (const name of wb.SheetNames) {
    const grid = XLSX.utils.sheet_to_json(wb.Sheets[name], { header: 1, raw: true, defval: '' });
    const hi = grid.findIndex((row) => row.some((c) => /elokuva/i.test(String(c))));
    if (hi < 0) continue;
    const head = grid[hi].map((c) => String(c).toLowerCase());
    const col = (re) => head.findIndex((h) => re.test(h));
    const c = {
      date: col(/päivä|pvm|date/),
      title: col(/elokuva/),
      snacks: col(/herku|karkk/),
      other: col(/muut/),
      theater: col(/teatteri|sali/),
      note: col(/muist|huom/),
    };
    if (c.date < 0) continue;
    const out = [];
    for (const row of grid.slice(hi + 1)) {
      const title = String(row[c.title] ?? '').trim();
      const date = parseDate(row[c.date]);
      if (!title || !date) continue;
      out.push({
        date,
        title,
        snacks: c.snacks >= 0 ? num(row[c.snacks]) : 0,
        other: c.other >= 0 ? num(row[c.other]) : 0,
        theater: c.theater >= 0 ? String(row[c.theater]).trim() : '',
        note: c.note >= 0 ? String(row[c.note]).trim() : '',
      });
    }
    return { sheet: name, rows: out };
  }
  return null;
}

$('#xlsx-file').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  const result = $('#import-result');
  result.textContent = 'Luetaan…';
  try {
    const XLSX = await loadXlsx();
    const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
    const found = rowsFromWorkbook(XLSX, wb);
    if (!found || !found.rows.length) throw new Error('Taulukosta ei löytynyt käyntejä (sarakkeet Päivä ja Elokuva).');

    let replace = false;
    if (state.visits.length) {
      replace = confirm(
        `Löytyi ${found.rows.length} käyntiä. OK = korvaa nykyiset ${state.visits.length} käyntiä, Peruuta = lisää vain uudet.`
      );
    }
    const key = (v) => v.date + '|' + v.title.toLowerCase();
    const existing = new Set(replace ? [] : state.visits.map(key));
    const base = replace ? [] : state.visits;
    const now = Date.now();
    const added = found.rows
      .filter((v) => !existing.has(key(v)))
      .map((v, i) => ({ id: uid(), created: now + i, ...v }));
    state.visits = [...base, ...added];
    save();
    render();

    const { seasonStart, seasonEnd } = state.settings;
    const outside = added.filter((v) => v.date < seasonStart || v.date > seasonEnd);
    result.innerHTML =
      `Tuotiin ${added.length} käyntiä välilehdeltä “${esc(found.sheet)}”.` +
      (outside.length
        ? `<br><span class="bad">Huom: ${outside.length} käynnin päivä on kauden ulkopuolella – tarkista: ` +
          outside.map((v) => `${esc(v.title)} (${fmtDate(v.date)})`).join(', ') + '</span>'
        : '');
  } catch (err) {
    result.innerHTML = `<span class="bad">${esc(err.message)}</span>`;
  }
});

// ---------- Käynnistys ----------

fillSettings();
render();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
navigator.storage?.persist?.().catch(() => {});
