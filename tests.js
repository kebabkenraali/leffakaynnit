'use strict';

// Laskentatestit selaimessa (aukaise tests.html).
// Laskentafunktiot (isCounted, computeVisits, computeSummary, monthStats, parseDate,
// todayIso) eivät tarvitse DOM:ia, joten ne poimitaan app.js-lähteestä omaan
// hiekkalaatikkoonsa. save()/render()-logiikkaa ei ajeta lainkaan, joten
// selaimen localStorage eikä sovelluksen tila muutu testien aikana.

let Calc = null; // laskentafunktiot hiekkalaatikosta (ladattu alhaalla)
const eq = (a, b, eps = 1e-9) => (typeof a === 'number' && typeof b === 'number'
  ? Math.abs(a - b) < eps
  : a === b);

const testResults = [];

function test(name, fn) {
  try {
    fn();
    testResults.push({ name, pass: true, msg: '' });
  } catch (err) {
    testResults.push({ name, pass: false, msg: err.stack || err.message });
  }
}

const assert = (cond, msg = 'assertion failed') => {
  if (!cond) throw new Error(msg);
};
const eqMoney = (a, b) => eq(a, b);

/** Poimii laskentafunktiot app.js-lähteestä hiekkalaatikkofunktioksi.
 *  Palauttaa objektin: computeVisit jne. + setState(state) tilan asettamiseksi. */
async function loadCalcApi() {
  const src = await (await fetch('app.js?v=20')).text();

  const fnSource = (name) => {
    const m = src.match(new RegExp('function ' + name + '\\([\\s\\S]*?\\n\\}'));
    if (!m) throw new Error('app.js:stä ei löytynyt funktiota: ' + name);
    return m[0];
  };
  const constSource = (decl) => {
    const idx = src.indexOf(decl);
    if (idx < 0) throw new Error('app.js:stä ei löytynyt määrittelyä: ' + decl);
    return src.slice(idx, src.indexOf(';', idx) + 1);
  };

  const code = [
    constSource('const DAY ='),
    constSource('const pad ='),
    constSource('const MONTH_NAMES'),
    'let state = null;',
    fnSource('todayIso'),
    fnSource('isCounted'),
    fnSource('suspectVisits'),
    fnSource('computeVisits'),
    fnSource('computeSummary'),
    fnSource('monthStats'),
    fnSource('parseDate'),
    'return { computeVisits, computeSummary, monthStats, parseDate, setState: (s) => { state = s; } };',
  ].join('\n');

  return new Function('"use strict";\n' + code)();
}

/** Rakentaa testitilan: vuosimaksu, lipun hinta, kausi ja käyntilista. */
function makeState({ annualFee, ticketPrice, visits = [], seasonStart = '2026-09-01', seasonEnd = '2027-08-31', feeDate = '', snackBudget = 0 }) {
  return {
    settings: { annualFee, ticketPrice, seasonStart, seasonEnd, feeDate, snackBudget },
    visits,
  };
}

let visitCounter = 0;
const visit = (date, title, snacks = 0, other = 0) => ({
  id: 'test' + ++visitCounter,
  created: Date.now(),
  date,
  title,
  snacks,
  other,
  theater: '',
  note: '',
  rating: 0,
});

// ---------- Testit ----------

function runTests() {
  test('breakEven: pelkkä lippu ceil(fee/ticket)', () => {
    Calc.setState(makeState({ annualFee: 372.9, ticketPrice: 14.45 }));
    const sum = Calc.computeSummary(Calc.computeVisits());
    assert(eq(sum.breakEven, 26), 'tuli ' + sum.breakEven);
  });  test('Herkkutavoite: 10 herkkuvapaata käyntiä → jäljellä 16, ei viivästyksiä', () => {
    const visits = Array.from({ length: 10 }, (_, i) => visit('2026-10-0' + (i % 9 + 1), 'Leffa'));
    Calc.setState(makeState({ annualFee: 372.9, ticketPrice: 14.45, visits }));
    const sum = Calc.computeSummary(Calc.computeVisits());
    assert(eq(sum.snackGoalTotal, 26), 'total ' + sum.snackGoalTotal);
    assert(eq(sum.snackGoalLeft, 16), 'left ' + sum.snackGoalLeft);
    assert(eq(sum.snackDelay, 0), 'delay ' + sum.snackDelay);
  });

  test('Herkkutavoite: 40 € herkkuja siirtää tavoitetta 3 käynnillä', () => {
    Calc.setState(makeState({ annualFee: 372.9, ticketPrice: 14.45 }));
    const visits = [
      visit('2026-10-01', 'Leffa', 40, 0),
      visit('2026-10-02', 'Leffa'),
      visit('2026-10-03', 'Leffa'),
      visit('2026-10-04', 'Leffa'),
      visit('2026-10-05', 'Leffa'),
    ];
    Calc.setState(makeState({ annualFee: 372.9, ticketPrice: 14.45, visits }));
    const sum = Calc.computeSummary(Calc.computeVisits());
    assert(eq(sum.snackGoalTotal, 29), 'total ' + sum.snackGoalTotal);
    assert(eq(sum.snackGoalLeft, 24), 'left ' + sum.snackGoalLeft);
    assert(eq(sum.snackDelay, 3), 'delay ' + sum.snackDelay);
  });

  test('Herkkutavoite: saavutettu → treatBudget = price - fee/n', () => {
    const visits = Array.from({ length: 8 }, (_, i) => visit('2026-10-0' + (i + 1), 'Leffa'));
    Calc.setState(makeState({ annualFee: 100, ticketPrice: 14.45, visits }));
    const sum = Calc.computeSummary(Calc.computeVisits());
    assert(eq(sum.snackGoalLeft, -1), 'left ' + sum.snackGoalLeft);
    assert(eqMoney(sum.treatBudget, 14.45 - 100 / 8), 'budget ' + sum.treatBudget);
    assert(eq(sum.movie, 12.5), 'movie ' + sum.movie);
  });

  test('computeVisits: movieAt/totalAt kertyvät aikajärjestyksessä', () => {
    const visits = [visit('2026-10-02', 'A'), visit('2026-10-01', 'B', 10, 5)];
    Calc.setState(makeState({ annualFee: 100, ticketPrice: 14.45, visits }));
    const rows = Calc.computeVisits();
    assert(eq(rows[0].nro, 1), 'nro ' + rows[0].nro);
    assert(eq(rows[0].movieAt, 100), 'movieAt ' + rows[0].movieAt);
    assert(eq(rows[1].movieAt, 50), 'movieAt ' + rows[1].movieAt);
    assert(eq(rows[1].totalAt, (100 + 10 + 5) / 2), 'totalAt ' + rows[1].totalAt);
  });

  test('monthStats: maksupäivä edellä kauden alkua → laskenta alkaa maksukuukaudesta', () => {
    Calc.setState(makeState({ annualFee: 100, ticketPrice: 14.45, feeDate: '2026-08-20', visits: [visit('2026-10-01', 'A')] }));
    const months = Calc.monthStats(Calc.computeVisits());
    assert(eq(months[0].key, '2026-08'), 'ensimmäinen ' + (months[0] && months[0].key));
    assert(eq(months[0].saving, -100), 'apo saving ' + (months[0] && months[0].saving));
    assert(eq(months[1].key, '2026-09'), 'väl kuukausi');
    assert(eq(months[1].saving, -100), 'väl saving');
    assert(eq(months[2].key, '2026-10'), 'yyi kuukausi');
    assert(eq(months[2].saving, 14.45 - 100), 'yyi saving');
  });

  test('monthStats: ilman maksupäivää kausi alkaa suoraan ensimmäisestä kuukaudesta', () => {
    Calc.setState(makeState({ annualFee: 100, ticketPrice: 14.45 }));
    const months = Calc.monthStats(Calc.computeVisits());
    assert(months.length > 0, 'tyhjät kuukaudet');
    assert(eq(months[0].key, '2026-09'), 'ensimmäinen ' + (months[0] && months[0].key));
  });

  test('Ei käyntejä: laskut eivät kaadu', () => {
    Calc.setState(makeState({ annualFee: 372.9, ticketPrice: 14.45 }));
    const sum = Calc.computeSummary(Calc.computeVisits());
    assert(eq(sum.n, 0), 'n ' + sum.n);
    assert(sum.movie === null, 'movie ' + sum.movie);
    assert(sum.treatBudget === null, 'budget ' + sum.treatBudget);
    assert(sum.snackGoalTotal !== null, 'goal total');
    assert(sum.snackGoalLeft !== null, 'goal left');
  });

  test('parseDate: suomalainen ja ISO-muoto', () => {
    assert(eq(Calc.parseDate('5.10.2026'), '2026-10-05'), 'd m yyyy');
    assert(eq(Calc.parseDate('2026-10-05'), '2026-10-05'), 'iso');
  });

  test('monthPace/extraAvg: kauden ulkopuoliset käynnit eivät vaikuta tahtiin', () => {
    Calc.setState(makeState({ annualFee: 372.9, ticketPrice: 14.45, visits: [visit('2020-01-01', 'Vanha')] }));
    const sum = Calc.computeSummary(Calc.computeVisits());
    assert(eq(sum.monthPace, 0), 'pace ' + sum.monthPace);
    assert(eq(sum.extraAvg, 0), 'extra ' + sum.extraAvg);
  });

  return testResults;
}

async function main() {
  const resultsEl = document.querySelector('#results');
  try {
    Calc = await loadCalcApi();
    const results = runTests();
    const failures = results.filter((r) => !r.pass).length;
    resultsEl.innerHTML = `
      <p><strong class="${failures ? 'bad' : 'good'}">${results.length - failures}/${results.length} testiä läpi${failures ? ` – ${failures} epäonnistui` : ''}</strong></p>
      <ul>${results.map((r) => `<li><span class="${r.pass ? 'good' : 'bad'}">${r.pass ? 'OK' : 'EPÄONNISTUI'}</span> ${r.name}${r.msg ? ` – ${r.msg}` : ''}</li>`).join('')}</ul>`;
    console.log(`Laskentatestit: ${results.length - failures}/${results.length} läpi`);
  } catch (err) {
    resultsEl.innerHTML = `<p class="bad">Testien ajaminen epäonnistui: ${err.message}</p>`;
    console.error(err);
  }
}

main();
