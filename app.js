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
    location: '', // Paikka / oletusteatteri (masterdata)
    cloudFolderHandle: null, // File System Access API handle for cloud folder
    autoCloudSave: false, // Automaattinen pilvitallennus
    autoLocalBackup: false, // Päivittäinen varmuuskopio puhelimen tiedostoihin
    lastLocalBackup: null, // Viimeisin päivä (YYYY-MM-DD) jolloin varmuuskopio tehtiin
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

/** Tila ilman FileSystemDirectoryHandle-oliota, jotka eivät serialisoidu JSON:ksi. */
function snapshot() {
  const { cloudFolderHandle, ...settings } = state.settings;
  return { ...state, settings };
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot()));
  } catch {
    toast('Tallennus epäonnistui – ota varmuuskopio!');
  }
}

// Valitun kansion kahva tallennetaan IndexedDB:hen, jotta se säilyy sovelluksen uudelleenavauksen yli
const DB_NAME = 'leffakaynnit';
const DB_STORE = 'kv';

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(DB_STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbGet(key) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = db.transaction(DB_STORE).objectStore(DB_STORE).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbSet(key, value) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readwrite');
    tx.objectStore(DB_STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function hasCloudWriteAccess(handle) {
  return (await handle.queryPermission({ mode: 'readwrite' })) === 'granted';
}

async function restoreCloudHandle() {
  try {
    const handle = await idbGet('cloudFolder');
    if (handle) state.settings.cloudFolderHandle = handle;
  } catch {
    // Tallennettua kansiota ei ole tai IndexedDB ei ole käytettävissä
  }
}

let state = load();

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const num = (v) => {
  const n = parseFloat(String(v ?? '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
};

// ---------- Laskenta ----------

/** Lasketaanko käynti mukaan: kauden sisällä eikä tulevaisuudessa. */
function isCounted(v) {
  const s = state.settings;
  return v.date >= s.seasonStart && v.date <= s.seasonEnd && v.date <= todayIso();
}

/** Käynnit, joita ei lasketa mukaan (päivä tulevaisuudessa tai kauden ulkopuolella). */
function suspectVisits() {
  return state.visits.filter((v) => !isCounted(v)).sort((a, b) => a.date.localeCompare(b.date));
}

/** Lasketut käynnit aikajärjestyksessä, jokaiselle järjestysnumero ja kertymät. */
function computeVisits() {
  const fee = state.settings.annualFee;
  const sorted = state.visits.filter(isCounted).sort(
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
      totalAt: (fee + cumSnacks + cumOther) / nro, // kaikki kulut (herkut ja muut) keskimäärin tähän mennessä
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
  const daysLeft = Math.max(0, Math.ceil((end - now) / DAY));
  // Ennuste viimeisen 30 päivän tahdista: kauden alun innostus ei vääristä koko vuotta
  const pacePeriod = Math.min(30, elapsed);
  const since = new Date(now - pacePeriod * DAY).toISOString().slice(0, 10);
  const recent = rows.filter((r) => r.date > since).length;
  const projected = n ? Math.round(n + (recent / pacePeriod) * daysLeft) : 0;
  const snackVisits = rows.filter((r) => (r.snacks || 0) > 0).length;

  // Eniten katsottu elokuva
  const byTitle = new Map();
  for (const v of rows) {
    const key = v.title.toLowerCase();
    const m = byTitle.get(key) || { title: v.title, count: 0, snacks: 0 };
    m.count++;
    m.snacks += v.snacks || 0;
    byTitle.set(key, m);
  }
  let mostWatched = null;
  let mostExpensiveWithSnacks = null;
  let maxCount = 0;
  let maxTotalWithSnacks = 0;
  for (const m of byTitle.values()) {
    if (m.count > maxCount) {
      maxCount = m.count;
      mostWatched = { title: m.title, count: m.count };
    }
    const totalWithSnacks = (s.annualFee / n) * m.count + m.snacks; // movie cost + snacks for this title
    if (totalWithSnacks > maxTotalWithSnacks) {
      maxTotalWithSnacks = totalWithSnacks;
      mostExpensiveWithSnacks = { title: m.title, total: totalWithSnacks, count: m.count, snacks: m.snacks };
    }
  }

  // Säästö kahdella tavalla: pelkkä vuosimaksu vs. liput, ja kaikki kulut (herkut + muut) Premiumin kuluiksi
  const total = s.annualFee + snacks + other;
  const ticketsTotal = n * s.ticketPrice;
  const breakEven = s.ticketPrice > 0 ? Math.ceil(s.annualFee / s.ticketPrice) : 0;
  // Kaikki kulut huomioiden: ensimmäinen käynti, jolla säästö menee plussalle.
  // Jos ei vielä saavutettu, arvio nykyisellä herkkujen ja muiden kulujen keskiarvolla.
  const reached = rows.find((r) => r.nro * s.ticketPrice - s.annualFee - r.cumSnacks - r.cumOther >= 0);
  const extraPerVisit = n ? (snacks + other) / n : 0;
  const breakEvenAll = reached
    ? reached.nro
    : s.ticketPrice > extraPerVisit ? Math.max(n + 1, Math.ceil(s.annualFee / (s.ticketPrice - extraPerVisit))) : null;

  return {
    n,
    snacks,
    other,
    movie: n ? s.annualFee / n : null,
    withExtras: n ? total / n : null,
    total,
    ticketsTotal,
    saving: ticketsTotal - s.annualFee,
    savingAll: ticketsTotal - total,
    breakEven,
    breakEvenAll,
    breakEvenAllEstimated: !reached,
    daysLeft,
    projected,
    snackVisits,
    snackAvg: snackVisits ? snacks / snackVisits : null,
    projectedPrice: projected ? s.annualFee / projected : null,
    mostWatched,
    mostExpensiveWithSnacks,
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
  $('#h-total').textContent = sum.withExtras != null ? eur.format(sum.withExtras) : '–';
  $('#h-count').textContent = sum.n;

  const pct = sum.breakEven ? Math.min(100, (sum.n / sum.breakEven) * 100) : 0;
  $('#be-bar').style.width = pct + '%';
  $('#be-label').textContent = `${sum.n} / ${sum.breakEven} käyntiä`;
  $('#be-text').textContent =
    sum.n >= sum.breakEven
      ? `Premium on maksanut itsensä takaisin! Jokainen käynti nyt on puhdasta voittoa sarjalippuun verrattuna.`
      : `Vielä ${sum.breakEven - sum.n} käyntiä, niin Premium on halvempi kuin sarjalippu (${eur.format(s.ticketPrice)}/lippu).`;

  const suspects = suspectVisits();
  const warn = $('#date-warning');
  warn.hidden = !suspects.length;
  warn.innerHTML = suspects.length
    ? `<strong>${suspects.length === 1 ? '1 käynti jää' : `${suspects.length} käyntiä jää`} laskuista pois</strong><br><span class="small">Päivä on tulevaisuudessa tai kauden ulkopuolella: ` +
      suspects.map((v) => `${esc(v.title)} (${fmtDate(v.date)})`).join(', ') +
      '. Korjaa päivä napauttamalla käyntiä Käynnit-sivulla.</span>'
    : '';

  $('#s-snacks').textContent = eur.format(sum.snacks);
  $('#s-snacks-avg').textContent = sum.n ? `${sum.snackVisits} / ${sum.n}` : '–';
  $('#s-snacks-avg-sub').textContent = sum.snackAvg != null ? `keskiostos ${eur.format(sum.snackAvg)}` : '';
  renderSavingsCompare(sum);
  $('#s-left').textContent = `${sum.daysLeft} pv`;
  $('#s-proj').textContent = sum.projected
    ? `${sum.projected} kpl · ${eur.format(sum.projectedPrice)}`
    : '–';

  // Elokuvatilastot
  if (sum.mostWatched) {
    $('#s-most-watched').textContent = sum.mostWatched.title;
    $('#s-most-watched-count').textContent = sum.mostWatched.count;
  } else {
    $('#s-most-watched').textContent = '–';
    $('#s-most-watched-count').textContent = '–';
  }
  if (sum.mostExpensiveWithSnacks) {
    $('#s-most-expensive').textContent = sum.mostExpensiveWithSnacks.title;
    $('#s-most-expensive-total').textContent = eur.format(sum.mostExpensiveWithSnacks.total);
  } else {
    $('#s-most-expensive').textContent = '–';
    $('#s-most-expensive-total').textContent = '–';
  }

  const months = monthStats(rows);
  renderSavingsChart(months, rows.length, sum);
  renderRatings(rows);
  renderMonths(months, rows.length);
}

/** Arvosanat: keskiarvo, jakauma sekä parhaat ja heikoimmat elokuvat (saman elokuvan käynnit keskiarvona). */
function renderRatings(rows) {
  const el = $('#ratings');
  const rated = rows.filter((r) => r.rating > 0);
  if (!rated.length) {
    el.innerHTML = '<p class="muted small">Anna käynnille 1–5 tähteä käynnin lomakkeessa, niin näet täällä keskiarvon ja parhaat elokuvat.</p>';
    return;
  }
  const fmt1 = (v) => v.toFixed(1).replace('.', ',');
  const avg = rated.reduce((a, r) => a + r.rating, 0) / rated.length;
  const dist = [5, 4, 3, 2, 1].map((v) => ({ v, count: rated.filter((r) => r.rating === v).length }));
  const maxCount = Math.max(...dist.map((d) => d.count));

  const byTitle = new Map();
  for (const r of rated) {
    const key = r.title.toLowerCase();
    const m = byTitle.get(key) || { title: r.title, sum: 0, count: 0 };
    m.sum += r.rating;
    m.count++;
    byTitle.set(key, m);
  }
  const films = [...byTitle.values()].map((m) => ({ ...m, avg: m.sum / m.count }));
  const byBest = (a, b) => b.avg - a.avg || a.title.localeCompare(b.title, 'fi');
  const best = [...films].sort(byBest).slice(0, 3);
  // Heikoimmat vasta kun arvioituja elokuvia on tarpeeksi, ettei sama elokuva näy molemmissa listoissa
  const worst = films.length >= 6 ? [...films].sort((a, b) => -byBest(a, b)).slice(0, 3) : [];
  const list = (items) =>
    items
      .map((f) => `<li><span class="stars-small">${stars(Math.round(f.avg))}</span> ${esc(f.title)}${f.count > 1 ? ` <span class="muted">(${f.count}×, ka ${fmt1(f.avg)})</span>` : ''}</li>`)
      .join('');

  el.innerHTML = `
    <div class="rating-summary">
      <div class="rating-avg">★ ${fmt1(avg)}</div>
      <div class="small muted">keskiarvo · ${rated.length} / ${rows.length} käyntiä arvioitu</div>
    </div>
    <div class="dist">
      ${dist
        .map((d) => `<div class="dist-row"><span>${d.v} ★</span>
          <div class="dist-bar"><div style="width:${maxCount ? (d.count / maxCount) * 100 : 0}%"></div></div>
          <span>${d.count}</span></div>`)
        .join('')}
    </div>
    <div class="small"><strong>Parhaat</strong></div>
    <ul class="rating-list">${list(best)}</ul>
    ${worst.length ? `<div class="small"><strong>Heikoimmat</strong></div><ul class="rating-list">${list(worst)}</ul>` : ''}`;
}

/** Vertailu: säästö ja €/käynti ilman herkkuja ja muita kuluja sekä niiden kanssa. */
function renderSavingsCompare(sum) {
  const s = state.settings;
  const el = $('#savings-compare');
  if (!sum.n) {
    el.innerHTML = '<p class="muted small">Lisää käyntejä nähdäksesi säästön.</p>';
    return;
  }
  const money = (v) => eur.format(v);
  const signed = (v) => `<span class="${v >= 0 ? 'good' : 'bad'}">${v >= 0 ? '+' : ''}${eur.format(v)}</span>`;
  const be = (count, estimated) => (count == null ? '–' : `${estimated ? 'n. ' : ''}${count}. käynti`);
  const rowsHtml = [
    ['Premium-kulut yhteensä', money(s.annualFee), money(sum.total)],
    ['Premium €/käynti', money(sum.movie), money(sum.withExtras)],
    ['Sarjalippu €/käynti', money(s.ticketPrice), money(s.ticketPrice)],
    ['Säästö yhteensä', signed(sum.saving), signed(sum.savingAll)],
    ['Säästö / käynti', signed(sum.saving / sum.n), signed(sum.savingAll / sum.n)],
    ['Premium kannattaa alkaen', be(sum.breakEven, false), be(sum.breakEvenAll, sum.breakEvenAllEstimated)],
  ]
    .map(([label, a, b]) => `<tr><td>${label}</td><td>${a}</td><td>${b}</td></tr>`)
    .join('');
  el.innerHTML = `
    <table class="months compare">
      <thead><tr><th></th><th>Pelkkä lippu</th><th>Herkut ja muut mukana</th></tr></thead>
      <tbody>${rowsHtml}</tbody>
    </table>
    <p class="small muted">Pelkkä lippu: vuosimaksu verrattuna sarjalippuihin (${sum.n} × ${money(s.ticketPrice)} = ${money(sum.ticketsTotal)}).
      Herkut ja muut mukana: herkut ${money(sum.snacks)} ja muut kulut ${money(sum.other)} lasketaan Premiumin kuluiksi, sarjalippupuolelle vain liput.</p>`;
}

const MONTH_NAMES =['tammi', 'helmi', 'maalis', 'huhti', 'touko', 'kesä', 'heinä', 'elo', 'syys', 'loka', 'marras', 'joulu'];

/**
 * Kuukausikohtaiset luvut kauden alusta kuluvaan kuukauteen, myös kuukaudet ilman käyntejä.
 * €/käynti ja säästö ovat kuukauden lopun tilanne: vuosimaksu maksetaan kerran, joten
 * se jaetaan kaikilla siihen mennessä kertyneillä käynneillä.
 */
function monthStats(rows) {
  const s = state.settings;
  const today = todayIso().slice(0, 7);
  const end = s.seasonEnd.slice(0, 7) < today ? s.seasonEnd.slice(0, 7) : today;
  const months = [];
  for (let [y, m] = s.seasonStart.split('-').map(Number); `${y}-${pad(m)}` <= end; m === 12 ? (y++, (m = 1)) : m++) {
    const key = `${y}-${pad(m)}`;
    const inMonth = rows.filter((r) => r.date.startsWith(key));
    const upTo = rows.filter((r) => r.date.slice(0, 7) <= key);
    const cumCount = upTo.length;
    const cumExtras = upTo.reduce((a, r) => a + (r.snacks || 0) + (r.other || 0), 0);
    months.push({
      key,
      label: `${MONTH_NAMES[m - 1]} ${String(y).slice(2)}`,
      short: MONTH_NAMES[m - 1].slice(0, 3),
      count: inMonth.length,
      snacks: inMonth.reduce((a, r) => a + (r.snacks || 0), 0),
      movie: cumCount ? s.annualFee / cumCount : null,
      saving: cumCount * s.ticketPrice - s.annualFee,
      savingAll: cumCount * s.ticketPrice - s.annualFee - cumExtras,
    });
  }
  return months;
}

function renderMonths(months, visitCount) {
  const fmt = (v) => (v == null ? '–' : eur.format(v));
  const signed = (v) => `<span class="${v >= 0 ? 'good' : 'bad'}">${v >= 0 ? '+' : ''}${eur.format(v)}</span>`;
  $('#months').innerHTML = visitCount
    ? months
        .map((m) => `<tr><td>${m.label}</td><td>${m.count}</td><td>${eur.format(m.snacks)}</td>
          <td>${fmt(m.movie)}</td><td>${signed(m.saving)}</td><td>${signed(m.savingAll)}</td></tr>`)
        .join('')
    : '<tr><td colspan="6" class="muted">Ei käyntejä</td></tr>';
  renderVisitsChart(months, visitCount);
}

/** Pylväät: käyntien määrä kuukausittain. */
function renderVisitsChart(months, visitCount) {
  const el = $('#visits-chart');
  if (!visitCount) {
    el.innerHTML = '';
    return;
  }
  const W = 320, H = 130, L = 8, R = 8, T = 16, B = 20;
  const yMax = Math.max(1, ...months.map((m) => m.count));
  const y = (v) => T + (1 - v / yMax) * (H - T - B);
  const groupW = (W - L - R) / months.length;
  const barW = Math.min(36, groupW * 0.7);
  const labelEvery = months.length > 8 ? 2 : 1;

  const bars = months
    .map((m, i) => {
      const cx = L + (i + 0.5) * groupW;
      const bar = m.count
        ? `<rect x="${(cx - barW / 2).toFixed(1)}" y="${y(m.count).toFixed(1)}" width="${barW.toFixed(1)}"
            height="${(y(0) - y(m.count)).toFixed(1)}" fill="var(--accent)" rx="2"/>
           <text x="${cx.toFixed(1)}" y="${(y(m.count) - 4).toFixed(1)}" text-anchor="middle" class="bar-value">${m.count}</text>`
        : '';
      const label = i % labelEvery === 0 ? `<text x="${cx.toFixed(1)}" y="${H - 5}" text-anchor="middle">${m.short}</text>` : '';
      return bar + label;
    })
    .join('');

  el.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Käynnit kuukausittain">
      <line x1="${L}" x2="${W - R}" y1="${y(0)}" y2="${y(0)}" stroke="var(--border)"/>
      ${bars}
    </svg>`;
}

/**
 * Viivat: kertynyt säästö sarjalippuihin verrattuna kuukauden lopussa, pelkällä lipulla
 * sekä herkut ja muut kulut mukaan laskettuna. Molemmat alkavat miinukselta (vuosimaksu).
 */
function renderSavingsChart(months, visitCount, sum) {
  const el = $('#savings-chart');
  if (!visitCount) {
    el.innerHTML = '<p class="muted small">Kaavio näkyy, kun käyntejä on lisätty.</p>';
    return;
  }
  const s = state.settings;
  const W = 320, H = 170, L = 44, R = 12, T = 12, B = 22;
  // Ensimmäinen piste on kauden alku: vuosimaksu maksettu, ei vielä käyntejä
  const labels = ['', ...months.map((m) => m.short)];
  const series = [
    { key: 'saving', color: 'var(--accent)', label: 'Pelkkä lippu', now: sum.saving },
    { key: 'savingAll', color: 'var(--accent-2)', label: 'Herkut ja muut mukana', now: sum.savingAll },
  ].map((sr) => ({ ...sr, values: [-s.annualFee, ...months.map((m) => m[sr.key])] }));
  const vals = series.flatMap((sr) => sr.values);
  // Tasaiset akselin arvot (esim. 100 €:n välein), ja tilaa nollaviivan yläpuolelle
  const span = Math.max(...vals, 0) - Math.min(...vals);
  const step = [50, 100, 200, 250, 500, 1000].find((st) => span / st <= 5) || 1000;
  const yMin = Math.floor(Math.min(...vals) / step) * step;
  const yMax = Math.ceil((Math.max(0, ...vals) + step * 0.5) / step) * step;
  const x = (i) => L + (i / (labels.length - 1)) * (W - L - R);
  const y = (v) => T + (1 - (v - yMin) / (yMax - yMin)) * (H - T - B);

  const ticks = [];
  for (let v = yMin; v <= yMax; v += step) if (v !== 0) ticks.push(v);
  const grid = ticks
    .map((v) => `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" stroke="var(--border)" stroke-width="0.6"/>
      <text x="${L - 4}" y="${y(v) + 3}" text-anchor="end">${v} €</text>`)
    .join('');
  const zero = `<line x1="${L}" x2="${W - R}" y1="${y(0)}" y2="${y(0)}" stroke="var(--muted)" stroke-dasharray="4 3"/>
    <text x="${L + 3}" y="${y(0) - 4}" class="small">0 € = Premium maksanut itsensä</text>`;
  const labelEvery = labels.length > 9 ? 2 : 1;
  const xLabels = labels
    .map((l, i) => (l && i % labelEvery === 1 % labelEvery ? `<text x="${x(i)}" y="${H - 6}" text-anchor="middle">${l}</text>` : ''))
    .join('');
  const lines = series
    .map((sr) => {
      const path = sr.values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('');
      const dots = sr.values.map((v, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="2.5" fill="${sr.color}"/>`).join('');
      return `<path d="${path}" fill="none" stroke="${sr.color}" stroke-width="2.5"/>${dots}`;
    })
    .join('');
  const signed = (v) => `<strong class="${v >= 0 ? 'good' : 'bad'}">${v >= 0 ? '+' : ''}${eur.format(v)}</strong>`;

  el.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Kertynyt säästö sarjalippuihin verrattuna">
      ${grid}${zero}${xLabels}${lines}
    </svg>
    <div class="legend small">
      ${series.map((sr) => `<span><i class="dot" style="background:${sr.color}"></i>${sr.label}: ${signed(sr.now)}</span>`).join('')}
    </div>`;
}

function renderList(rows) {
  const q = $('#search').value.trim().toLowerCase();
  const match = (r) => !q || r.title.toLowerCase().includes(q);
  const suspects = suspectVisits().filter(match);
  const shown = rows.filter(match).reverse();
  $('#empty').hidden = state.visits.length > 0;

  // Lasketaan mukaan vain kauden käynnit tähän päivään asti; muut näytetään ylimpänä varoituksella
  const suspectItems = suspects
    .map((r) => {
      const meta = [fmtDate(r.date), r.theater, r.note].filter(Boolean).map(esc).join(' · ');
      return `<li class="visit suspect" data-id="${r.id}">
        <div class="nro">!</div>
        <div class="title">${esc(r.title)}</div>
        <div class="price"><span>ei laskettu</span></div>
        <div class="meta">${meta} · tarkista päivä</div>
      </li>`;
    })
    .join('');

  const items = shown
    .map((r) => {
      const meta = [fmtDate(r.date), r.theater, r.note].filter(Boolean).map(esc).join(' · ');
      const rating = r.rating ? `<span class="stars-small">${stars(r.rating)}</span> ` : '';
      const snack = r.snacks ? ` · <span class="snack">herkut ${eur.format(r.snacks)}</span>` : '';
      const withSnacks = r.snacks || r.other ? `<span>kaikki kulut ${eur.format(r.totalAt)}</span>` : '';
      return `<li class="visit" data-id="${r.id}">
        <div class="nro">${r.nro}</div>
        <div class="title">${esc(r.title)}</div>
        <div class="price"><b>${eur.format(r.movieAt)}</b>${withSnacks}</div>
        <div class="meta">${rating}${meta}${snack}</div>
      </li>`;
    })
    .join('');

  $('#visits').innerHTML = suspectItems + items;
}

function renderDatalists() {
  const uniq = (key) => [...new Set(state.visits.map((v) => v[key]).filter(Boolean))].sort();
  $('#titles').innerHTML = uniq('title').map((t) => `<option value="${esc(t)}">`).join('');
  $('#theaters').innerHTML = uniq('theater').map((t) => `<option value="${esc(t)}">`).join('');
  // Lisää paikat (teatterit) paikka-datalistiin
  $('#locations').innerHTML = uniq('theater').map((t) => `<option value="${esc(t)}">`).join('');
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
  // Uusi käynti: esitäytä teatteri asetuksista (paikka/masterdata) tai viimeisimmän käynnin teatterista
  form.theater.value = visit ? visit.theater || '' : state.settings.location || state.visits.at(-1)?.theater || '';
  form.snacks.value = visit?.snacks ? String(visit.snacks).replace('.', ',') : '';
  form.other.value = visit?.other ? String(visit.other).replace('.', ',') : '';
  form.note.value = visit?.note ?? '';
  setRating(visit?.rating || 0);
  dialog.showModal();
  if (!visit) form.title.focus();
}

function setRating(v) {
  form.rating.value = v || '';
  for (const b of document.querySelectorAll('#rating-stars button')) {
    const n = Number(b.dataset.v);
    b.classList.toggle('on', n <= v);
    b.setAttribute('aria-checked', String(n === v));
  }
}

// Saman tähden napautus uudelleen poistaa arvosanan
$('#rating-stars').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  const v = Number(b.dataset.v);
  setRating(Number(form.rating.value) === v ? 0 : v);
});

const stars = (v) => '★'.repeat(v) + '☆'.repeat(5 - v);

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
    rating: Number(form.rating.value) || 0,
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
  autoSaveToCloud();
  render();
  dialog.close();
  const rows = computeVisits();
  const me = rows.find((r) => r.title === data.title && r.date === data.date);
  if (!me) toast('Tallennettu, mutta ei lasketa: päivä on tulevaisuudessa tai kauden ulkopuolella');
  else toast(id ? 'Tallennettu' : `Käynti #${me.nro} – leffan hinta nyt ${eur.format(computeSummary(rows).movie)}`);
});

$('#delete-visit').addEventListener('click', () => {
  const id = form.id.value;
  if (!id || !confirm('Poistetaanko tämä käynti?')) return;
  state.visits = state.visits.filter((v) => v.id !== id);
  save();
  autoSaveToCloud();
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
  // Säilytä muut asetukset (pilvi, varmuuskopio), vain lomakkeen kentät päivittyvät
  state.settings = {
    ...state.settings,
    annualFee: num(sForm.annualFee.value),
    ticketPrice: num(sForm.ticketPrice.value),
    seasonStart: sForm.seasonStart.value,
    seasonEnd: sForm.seasonEnd.value,
    location: sForm.location.value.trim(),
  };
  save();
  autoSaveToCloud();
  render();
  toast('Asetukset tallennettu');
});

// Kansion valinta
$('#pick-cloud-folder').addEventListener('click', async () => {
  // Tallennettu kansio: riittää vahvistaa lupa, ei tarvitse valita uudelleen
  const saved = state.settings.cloudFolderHandle;
  if (saved && (await saved.requestPermission({ mode: 'readwrite' })) === 'granted') {
    showCloudStatus();
    toast('Kansion lupa vahvistettu');
    return;
  }
  const handle = await pickCloudFolder();
  if (handle) {
    state.settings.cloudFolderHandle = handle;
    showCloudStatus();
    toast('Kansio valittu');
  }
});

function showCloudStatus() {
  const h = state.settings.cloudFolderHandle;
  $('#cloud-folder-status').textContent = h ? `Valittu: ${h.name}` : '';
  $('#auto-cloud-save').disabled = !h;
}

// Automaattinen tallennus paikalliseen kansioon
$('#auto-cloud-save').addEventListener('change', (e) => {
  if (e.target.checked && !state.settings.cloudFolderHandle) {
    e.target.checked = false;
    toast('Valitse ensin kansio');
  }
  state.settings.autoCloudSave = e.target.checked;
  save();
});

// ---------- Varmuuskopio ----------

async function download(name, content, type) {
  // Puhelimessa jakovalikko, josta voi valita "Tallenna OneDriveen"
  const file = new File([content], name, { type });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: name });
      return;
    } catch (err) {
      if (err.name === 'AbortError') return;
    }
  }
  saveFile(name, content, type);
}

// ---------- Pilvitallennus (File System Access API) ----------

/** Avaa kansiovalikon (esim. OneDrive-synkronointikansio tietokoneella) */
async function pickCloudFolder() {
  if (!('showDirectoryPicker' in window)) {
    toast('Selaimesi ei tue kansiovalintaa (tarvitaan Chrome/Edge 86+)');
    return null;
  }
  try {
    const handle = await window.showDirectoryPicker({ mode: 'readwrite', startIn: 'documents' });
    await idbSet('cloudFolder', handle);
    return handle;
  } catch (err) {
    if (err.name !== 'AbortError') {
      toast('Kansion valinta epäonnistui: ' + err.message);
    }
    return null;
  }
}

/** Tallenna tiedosto valittuun kansioon */
async function saveToCloudFolder(handle, fileName, content, type) {
  if (!handle) return false;
  if (!(await hasCloudWriteAccess(handle))) {
    toast('Vahvista kansion lupa painamalla Asetuksissa "Valitse kansio"');
    return false;
  }
  try {
    const fileHandle = await handle.getFileHandle(fileName, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
    return true;
  } catch (err) {
    toast('Tallennus kansioon epäonnistui: ' + err.message);
    return false;
  }
}

let cloudTimer = null;

/** Tallennus viivästetään hieman, jotta peräkkäiset muutokset lähtevät yhtenä kertana. */
function autoSaveToCloud() {
  clearTimeout(cloudTimer);
  cloudTimer = setTimeout(async () => {
    if (state.settings.autoCloudSave) await saveToFolderNow();
    runLocalBackup();
  }, 1500);
}

/** Lataa varmuuskopion tiedostoksi (puhelimen Lataukset-kansio, ei välimuisti). */
function saveFile(name, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Kerran päivässä muutoksen jälkeen, jos asetus on päällä. Ei jaa tiedostoa, vain tallentaa. */
function runLocalBackup() {
  const today = todayIso();
  if (!state.settings.autoLocalBackup || !state.visits.length || state.settings.lastLocalBackup === today) return;
  saveFile(`leffakaynnit-${today}.json`, JSON.stringify(snapshot(), null, 2), 'application/json');
  saveFile(`leffakaynnit-${today}.csv`, generateCSV(), 'text/csv');
  state.settings.lastLocalBackup = today;
  save();
  toast('Varmuuskopio tallennettu puhelimeen');
}

$('#auto-local-backup').addEventListener('change', (e) => {
  state.settings.autoLocalBackup = e.target.checked;
  save();
  if (e.target.checked) runLocalBackup();
});

/** Muistutus, jos varmuuskopio on yli viikon vanha. */
function remindBackup() {
  const last = state.settings.lastLocalBackup;
  if (!state.visits.length || (last && daysBetween(last, todayIso()) < 7)) return;
  toast('Muista varmuuskopio: Asetukset → Lataa varmuuskopio');
}

function daysBetween(a, b) {
  return Math.round((Date.parse(b) - Date.parse(a)) / DAY);
}

async function saveToFolderNow() {
  const h = state.settings.cloudFolderHandle;
  // Tyhjää tilaa ei tallenneta, ettei se korvaa aiempaa varmuuskopiota
  if (!h || !state.visits.length) return;
  const stamp = todayIso();
  await Promise.all([
    saveToCloudFolder(h, `leffakaynnit-${stamp}.json`, JSON.stringify(snapshot(), null, 2), 'application/json'),
    saveToCloudFolder(h, `leffakaynnit-${stamp}.csv`, generateCSV(), 'text/csv'),
  ]);
}

function generateCSV() {
  const dec = (v) => v.toFixed(2).replace('.', ',');
  const lines = [['Käynti nro', 'Päivä', 'Elokuva', 'Teatteri', 'Herkut €', 'Muut kulut €', 'Premium €/käynti', 'Kaikki kulut €/käynti', 'Arvosana', 'Muistiinpano']];
  for (const r of computeVisits()) {
    lines.push([r.nro, fmtDate(r.date), r.title, r.theater || '', dec(r.snacks || 0), dec(r.other || 0), dec(r.movieAt), dec(r.totalAt), r.rating || '', r.note || '']);
  }
  // Laskemattomat käynnit mukaan ilman järjestysnumeroa ja hintoja, jotta mitään ei katoa
  for (const r of suspectVisits()) {
    lines.push(['', fmtDate(r.date), r.title, r.theater || '', dec(r.snacks || 0), dec(r.other || 0), '', '', r.rating || '', [r.note, 'ei laskettu: tarkista päivä'].filter(Boolean).join(' · ')]);
  }
  return '﻿' + lines.map((l) => l.map((c) => `\"${String(c).replace(/\"/g, '\"\"')}\"`).join(';')).join('\r\n');
}

$('#export-json').addEventListener('click', () => {
  download(`leffakaynnit-${todayIso()}.json`, JSON.stringify(snapshot(), null, 2), 'application/json');
});

$('#import-json').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  await restoreBackup(await file.text());
});

/** Palauttaa varmuuskopion JSON-tekstistä. Korvaa nykyisen tilan käyttäjän vahvistuksella. */
async function restoreBackup(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = null;
  }
  if (!data || !Array.isArray(data.visits)) return toast('Tiedosto ei ole kelvollinen varmuuskopio');
  if (!confirm(`Palautetaanko ${data.visits.length} käyntiä? Nykyiset tiedot korvataan.`)) return;
  state = {
    settings: { ...DEFAULT_STATE.settings, ...data.settings, cloudFolderHandle: state.settings.cloudFolderHandle },
    visits: data.visits,
  };
  save();
  fillSettings();
  render();
  showCloudStatus();
  toast('Varmuuskopio palautettu');
}

$('#export-csv').addEventListener('click', () => {
  download(`leffakaynnit-${todayIso()}.csv`, generateCSV(), 'text/csv');
});

$('#clear-all').addEventListener('click', () => {
  if (!state.visits.length || !confirm('Poistetaanko KAIKKI käynnit? Tätä ei voi perua.')) return;
  state.visits = [];
  save();
  autoSaveToCloud();
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
    // Ääkköset pois, jotta "Paiva" ja "Päivä" tunnistetaan samoin
    const head = grid[hi].map((c) => String(c).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''));
    const col = (re) => head.findIndex((h) => re.test(h));
    const c = {
      date: col(/paiva|pvm|date/),
      title: col(/elokuva/),
      snacks: col(/herku|karkk/),
      other: col(/muut/),
      theater: col(/teatteri|sali/),
      note: col(/muist|huom/),
      rating: col(/arvosana|arvio|tahdet|rating/),
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
        rating: c.rating >= 0 ? Math.min(5, Math.max(0, Math.round(num(row[c.rating])))) : 0,
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
    autoSaveToCloud();
    render();

    const { seasonStart, seasonEnd } = state.settings;
    const today = todayIso();
    const outside = added.filter((v) => v.date < seasonStart || v.date > seasonEnd || v.date > today);
    result.innerHTML =
      `Tuotiin ${added.length} käyntiä välilehdeltä “${esc(found.sheet)}”.` +
      (outside.length
        ? `<br><span class="bad">Huom: ${outside.length} käynnin päivä on kauden ulkopuolella tai tulevaisuudessa – tarkista: ` +
          outside.map((v) => `${esc(v.title)} (${fmtDate(v.date)})`).join(', ') + '</span>'
        : '');
  } catch (err) {
    result.innerHTML = `<span class="bad">${esc(err.message)}</span>`;
  }
});

// ---------- Käynnistys ----------

fillSettings();
$('#auto-cloud-save').checked = state.settings.autoCloudSave;
$('#auto-local-backup').checked = state.settings.autoLocalBackup;
render();
remindBackup();

// Palauta tallennettu kansio IndexedDB:stä
restoreCloudHandle().then(() => {
  showCloudStatus();
  if (!state.settings.cloudFolderHandle && state.settings.autoCloudSave) {
    state.settings.autoCloudSave = false;
    $('#auto-cloud-save').checked = false;
    save();
  }
});

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
navigator.storage?.persist?.().catch(() => {});
