'use strict';

// Calculation tests in the browser (open tests.html).
// The calculation functions (isCounted, computeVisits, computeSummary, monthStats, parseDate,
// todayIso) do not need the DOM, so they are extracted from the app.js source into their own
// sandbox. save()/render() logic is never run, so neither localStorage nor the app's state
// changes while the tests run.

let Calc = null; // calculation functions from the sandbox (loaded below)
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

/** Extracts the calculation functions from the app.js source into a sandbox function.
 *  Returns an object: computeVisits etc. plus setState(state) to set the state. */
async function loadCalcApi() {
  const src = await (await fetch('app.js?v=27')).text();

  const fnSource = (name) => {
    const m = src.match(new RegExp('function ' + name + '\\([\\s\\S]*?\\n\\}'));
    if (!m) throw new Error('Function not found in app.js: ' + name);
    return m[0];
  };
  const constSource = (decl) => {
    const idx = src.indexOf(decl);
    if (idx < 0) throw new Error('Declaration not found in app.js: ' + decl);
    return src.slice(idx, src.indexOf(';', idx) + 1);
  };

  const code = [
    constSource('const DAY ='),
    constSource('const pad ='),
    constSource('const MONTH_NAMES'),
    constSource('const MONTH_NAMES_EN'),
    constSource('const RATING_QUESTIONS'),
    'let state = null;',
    fnSource('todayIso'),
    fnSource('isCounted'),
    fnSource('suspectVisits'),
    fnSource('computeVisits'),
    fnSource('computeSummary'),
    fnSource('monthNames'),
    fnSource('monthStats'),
    fnSource('parseDate'),
    fnSource('levenshtein'),
    fnSource('normalizeTitleKey'),
    fnSource('canonicalTitle'),
    fnSource('legacyRatingToScore'),
    fnSource('answerScore'),
    fnSource('overallRating'),
    fnSource('migrateVisits'),
    'return { computeVisits, computeSummary, monthStats, parseDate, normalizeTitleKey, canonicalTitle, legacyRatingToScore, answerScore, overallRating, migrateVisits, setState: (s) => { state = s; } };',
  ].join('\n');

  return new Function('"use strict";\n' + code)();
}

/** Builds a test state: annual fee, ticket price, season and a list of visits. */
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

// ---------- Tests ----------

function runTests() {
  test('breakEven: ticket only ceil(fee/ticket)', () => {
    Calc.setState(makeState({ annualFee: 372.9, ticketPrice: 14.45 }));
    const sum = Calc.computeSummary(Calc.computeVisits());
    assert(eq(sum.breakEven, 26), 'got ' + sum.breakEven);
  });  test('Treat goal: 10 snack-free visits → 16 left, no delays', () => {
    const visits = Array.from({ length: 10 }, (_, i) => visit('2026-10-0' + (i % 9 + 1), 'Movie'));
    Calc.setState(makeState({ annualFee: 372.9, ticketPrice: 14.45, visits }));
    const sum = Calc.computeSummary(Calc.computeVisits());
    assert(eq(sum.snackGoalTotal, 26), 'total ' + sum.snackGoalTotal);
    assert(eq(sum.snackGoalLeft, 16), 'left ' + sum.snackGoalLeft);
    assert(eq(sum.snackDelay, 0), 'delay ' + sum.snackDelay);
  });

  test('Treat goal: €40 of snacks delays the goal by 3 visits', () => {
    Calc.setState(makeState({ annualFee: 372.9, ticketPrice: 14.45 }));
    const visits = [
      visit('2026-10-01', 'Movie', 40, 0),
      visit('2026-10-02', 'Movie'),
      visit('2026-10-03', 'Movie'),
      visit('2026-10-04', 'Movie'),
      visit('2026-10-05', 'Movie'),
    ];
    Calc.setState(makeState({ annualFee: 372.9, ticketPrice: 14.45, visits }));
    const sum = Calc.computeSummary(Calc.computeVisits());
    assert(eq(sum.snackGoalTotal, 29), 'total ' + sum.snackGoalTotal);
    assert(eq(sum.snackGoalLeft, 24), 'left ' + sum.snackGoalLeft);
    assert(eq(sum.snackDelay, 3), 'delay ' + sum.snackDelay);
  });

  test('Treat goal: reached → treatBudget = price - fee/n', () => {
    const visits = Array.from({ length: 8 }, (_, i) => visit('2026-10-0' + (i + 1), 'Movie'));
    Calc.setState(makeState({ annualFee: 100, ticketPrice: 14.45, visits }));
    const sum = Calc.computeSummary(Calc.computeVisits());
    assert(eq(sum.snackGoalLeft, -1), 'left ' + sum.snackGoalLeft);
    assert(eqMoney(sum.treatBudget, 14.45 - 100 / 8), 'budget ' + sum.treatBudget);
    assert(eq(sum.movie, 12.5), 'movie ' + sum.movie);
  });

  test('computeVisits: movieAt/totalAt accumulate in date order', () => {
    const visits = [visit('2026-10-02', 'A'), visit('2026-10-01', 'B', 10, 5)];
    Calc.setState(makeState({ annualFee: 100, ticketPrice: 14.45, visits }));
    const rows = Calc.computeVisits();
    assert(eq(rows[0].nro, 1), 'nro ' + rows[0].nro);
    assert(eq(rows[0].movieAt, 100), 'movieAt ' + rows[0].movieAt);
    assert(eq(rows[1].movieAt, 50), 'movieAt ' + rows[1].movieAt);
    assert(eq(rows[1].totalAt, (100 + 10 + 5) / 2), 'totalAt ' + rows[1].totalAt);
  });

  test('monthStats: payment date before season start → calculation starts in the payment month', () => {
    Calc.setState(makeState({ annualFee: 100, ticketPrice: 14.45, feeDate: '2026-08-20', visits: [visit('2026-10-01', 'A')] }));
    const months = Calc.monthStats(Calc.computeVisits());
    assert(eq(months[0].key, '2026-08'), 'first ' + (months[0] && months[0].key));
    assert(eq(months[0].saving, -100), 'first saving ' + (months[0] && months[0].saving));
    assert(eq(months[1].key, '2026-09'), 'in-between month');
    assert(eq(months[1].saving, -100), 'in-between saving');
    assert(eq(months[2].key, '2026-10'), 'third month');
    assert(eq(months[2].saving, 14.45 - 100), 'third saving');
  });

  test('monthStats: without a payment date the season starts in the first month', () => {
    Calc.setState(makeState({ annualFee: 100, ticketPrice: 14.45 }));
    const months = Calc.monthStats(Calc.computeVisits());
    assert(months.length > 0, 'empty months');
    assert(eq(months[0].key, '2026-09'), 'first ' + (months[0] && months[0].key));
  });

  test('No visits: calculations do not crash', () => {
    Calc.setState(makeState({ annualFee: 372.9, ticketPrice: 14.45 }));
    const sum = Calc.computeSummary(Calc.computeVisits());
    assert(eq(sum.n, 0), 'n ' + sum.n);
    assert(sum.movie === null, 'movie ' + sum.movie);
    assert(sum.treatBudget === null, 'budget ' + sum.treatBudget);
    assert(sum.snackGoalTotal !== null, 'goal total');
    assert(sum.snackGoalLeft !== null, 'goal left');
  });

  test('parseDate: Finnish and ISO formats', () => {
    assert(eq(Calc.parseDate('5.10.2026'), '2026-10-05'), 'd m yyyy');
    assert(eq(Calc.parseDate('2026-10-05'), '2026-10-05'), 'iso');
  });

  test('monthPace/extraAvg: visits outside the season do not affect the pace', () => {
    Calc.setState(makeState({ annualFee: 372.9, ticketPrice: 14.45, visits: [visit('2020-01-01', 'Old')] }));
    const sum = Calc.computeSummary(Calc.computeVisits());
    assert(eq(sum.monthPace, 0), 'pace ' + sum.monthPace);
    assert(eq(sum.extraAvg, 0), 'extra ' + sum.extraAvg);
  });

  test('overallRating: perfect answers give 10, reverse questions are inverted', () => {
    const perfect = { liked: 5, time: 5, length: 'right', bored: 1, slept: 1, story: 5 };
    const worst = { liked: 1, time: 1, length: 'long', bored: 5, slept: 5, story: 1 };
    assert(eq(Calc.overallRating(perfect), 10), 'perfect ' + Calc.overallRating(perfect));
    assert(eq(Calc.overallRating(worst), 0.6), 'worst ' + Calc.overallRating(worst));
  });

  test('overallRating: unanswered questions are ignored', () => {
    assert(eq(Calc.overallRating({ liked: 3 }), 5), 'one answer ' + Calc.overallRating({ liked: 3 }));
    assert(eq(Calc.overallRating({}), 0), 'no answers');
  });

  test('legacyRatingToScore: 1–5 stars map to 0–10', () => {
    assert(eq(Calc.legacyRatingToScore(1), 0), '1 star');
    assert(eq(Calc.legacyRatingToScore(3), 5), '3 stars');
    assert(eq(Calc.legacyRatingToScore(5), 10), '5 stars');
  });

  test('migrateVisits: old ratings converted and duplicate titles unified', () => {
    const visits = [
      visit('2026-10-01', 'Star Wars', 0, 0),
      visit('2026-10-02', 'star wars', 0, 0),
      visit('2026-10-03', 'Starwars', 0, 0),
    ];
    visits[0].rating = 4;
    const migrated = Calc.migrateVisits(visits);
    assert(eq(migrated.renamed, 2), 'renamed ' + migrated.renamed);
    assert(migrated.visits.every((v) => v.title === 'Star Wars'), 'titles not unified');
    assert(eq(migrated.visits[0].rating, 7.5), 'rating ' + migrated.visits[0].rating);
  });

  test('migrateVisits: migration is idempotent', () => {
    const visits = [{ title: 'A', rating: 3 }];
    const once = Calc.migrateVisits(visits);
    assert(eq(once.visits[0].rating, 5), 'first ' + once.visits[0].rating);
    const twice = Calc.migrateVisits(once.visits);
    assert(eq(twice.visits[0].rating, 5), 'second ' + twice.visits[0].rating);
  });

  test('canonicalTitle: known spelling wins, different movies stay separate', () => {
    Calc.setState(makeState({ annualFee: 100, ticketPrice: 14.45, visits: [
      visit('2026-10-01', 'Alien'), visit('2026-10-02', 'Star Wars'),
    ] }));
    assert(Calc.canonicalTitle('alien') === 'Alien', 'case difference');
    assert(Calc.canonicalTitle('Star wars') === 'Star Wars', 'spacing difference');
    assert(Calc.canonicalTitle('Aliens') === 'Aliens', 'different movie merged');
    assert(Calc.canonicalTitle('Star Wara') === 'Star Wars', 'typo not fixed');
  });

  test('unique movies: count, once/repeat split and rewatches', () => {
    const visits = [
      visit('2026-10-01', 'A'), visit('2026-10-02', 'A'), visit('2026-10-03', 'A'),
      visit('2026-10-04', 'B'), visit('2026-10-05', 'C'), visit('2026-10-06', 'C'),
    ];
    Calc.setState(makeState({ annualFee: 100, ticketPrice: 14.45, visits }));
    const u = Calc.computeSummary(Calc.computeVisits()).unique;
    assert(eq(u.movies, 3), 'movies ' + u.movies);
    assert(eq(u.once, 1), 'once ' + u.once);
    assert(eq(u.repeat, 2), 'repeat ' + u.repeat);
    assert(eq(u.rewatches, 3), 'rewatches ' + u.rewatches);
    assert(eq(u.top[0].count, 3), 'top ' + u.top[0].count);
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
      <p><strong class="${failures ? 'bad' : 'good'}">${results.length - failures}/${results.length} tests passed${failures ? ` – ${failures} failed` : ''}</strong></p>
      <ul>${results.map((r) => `<li><span class="${r.pass ? 'good' : 'bad'}">${r.pass ? 'PASS' : 'FAILED'}</span> ${r.name}${r.msg ? ` – ${r.msg}` : ''}</li>`).join('')}</ul>`;
    console.log(`Calculation tests: ${results.length - failures}/${results.length} passed`);
  } catch (err) {
    resultsEl.innerHTML = `<p class="bad">Failed to run tests: ${err.message}</p>`;
    console.error(err);
  }
}

main();
