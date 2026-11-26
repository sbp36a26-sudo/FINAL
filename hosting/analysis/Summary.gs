/*
  Summary.gs: the analysis kit for "Can AI solve your problems?"

  Paste this file into the SAME Apps Script project as Code.gs (Extensions > Apps Script > + > Script, name it "Summary").
  It adds a menu "Tool data" > "Refresh summary" to the Sheet. Each refresh rebuilds the sheet "summary" from the sheet "events".

  It only READS "events". It never edits, sorts or removes a row there. The only sheet it writes is "summary", which it clears and
  rewrites each time (so do not type your own notes into "summary": copy it elsewhere first).

  Layout of this file:
    - onOpen / refreshSummary: the only parts that touch the spreadsheet.
    - summarise(rows): a pure function. It takes an array of row objects (one per line of "events", keys = column names) and
      returns plain numbers. No spreadsheet calls, so it can be tested in Node (test/summary.test.mjs).
    - summaryTable(s, now): a pure function that turns those numbers into the rows written to "summary".

  Expected columns of "events" (row 1, written by Code.gs): received_at, check_id, event, step, version, hotel_type, role,
  country, hotel_name, use_case, verdict, score, step2, must, answers. Headers are matched loosely: case, spaces and a trailing
  "json" are ignored, so "step2 json", "Step2" and "step2_json" all count as step2. If Code.gs names a column differently,
  change COLUMN_ALIASES below.
*/

var EVENTS_SHEET = 'events';
var SUMMARY_SHEET = 'summary';

/* Other header spellings that mean the same column. Left: the name used in this file. */
var COLUMN_ALIASES = {
  received_at: ['received', 'timestamp', 'time'],
  check_id: ['check', 'id'],
  hotel_type: ['type'],
  use_case: ['usecase', 'use'],
  step2: ['step_2', 'q', 'questions'],
  must: ['musts', 'must_haves']
};

/* The five step-2 questions and the ten must-haves, as the tool sends them (src/content.js of tools/readiness-2-questions). */
var STEP2_QUESTIONS = [
  ['q1', 'Needs judgement, not fixed rules'],
  ['q2', 'Worth real money or hours'],
  ['q3', 'Past examples to learn from'],
  ['q4', 'Mistakes can be caught'],
  ['q5', 'Success has a number']
];
var MUST_HAVES = [
  ['m1', 'A named owner with time'],
  ['m2', 'Budget for the full first year'],
  ['m3', 'A number to improve, approved'],
  ['m4', 'Systems that can connect'],
  ['m5', 'Personal data known'],
  ['m6', 'A person who checks the AI'],
  ['m7', 'Data you can reach and keep correct'],
  ['m8', 'Staff told, and able to report errors'],
  ['m9', 'Rules for staff on AI tools'],
  ['m10', 'A way to work when the tool is down']
];
var ANSWER_WORDS = ['Yes', 'Planned', 'No', 'Not sure'];
var VERDICT_NAMES = {
  ready: 'Ready to start a pilot',
  almost: 'Almost ready',
  notready: 'Not ready yet',
  noinfo: 'Not enough information yet',
  stop: 'Stopped: not suitable for AI'
};
var SCORE_BANDS = [['0–49', 0, 49.999], ['50–74', 50, 74.999], ['75–100', 75, 100]];
var TOP_USE_CASES = 15;

/* ---------- Spreadsheet part ---------- */

/* Adds the menu each time the Sheet is opened. If Code.gs also has an onOpen, rename this one and call it from there. */
function onOpen() {
  addToolDataMenu();
}

function addToolDataMenu() {
  SpreadsheetApp.getUi().createMenu('Tool data').addItem('Refresh summary', 'refreshSummary').addToUi();
}

/* Reads "events", works out the summary, and rewrites the sheet "summary". */
function refreshSummary() {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var events = book.getSheetByName(EVENTS_SHEET);
  var values = events ? events.getDataRange().getValues() : [];
  var rows = rowsFromValues(values);
  var table = summaryTable(summarise(rows), new Date());

  var out = book.getSheetByName(SUMMARY_SHEET) || book.insertSheet(SUMMARY_SHEET);
  out.clear();
  var width = 1;
  table.forEach(function (r) { if (r.length > width) width = r.length; });
  var padded = table.map(function (r) {
    var line = r.slice();
    while (line.length < width) line.push('');
    return line;
  });
  out.getRange(1, 1, padded.length, width).setValues(padded);
  out.getRange(1, 1).setFontWeight('bold').setFontSize(13);
  padded.forEach(function (r, i) { if (r[0] && r[0].charAt && r[0].charAt(0) === '#') out.getRange(i + 1, 1, 1, width).setFontWeight('bold'); });
  out.autoResizeColumns(1, width);
  if (events === null) SpreadsheetApp.getActiveSpreadsheet().toast('No sheet named "events" was found. The summary is empty.');
}

/* ---------- Pure part (no spreadsheet calls below this line) ---------- */

/* Turns a header name into the key used here: lower case, spaces and dashes to "_", a trailing "json" dropped. */
function normaliseHeader(h) {
  var k = String(h == null ? '' : h).trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  k = k.replace(/_?json$/, '');
  for (var name in COLUMN_ALIASES) {
    if (COLUMN_ALIASES[name].indexOf(k) >= 0) return name;
  }
  return k;
}

/* Turns the sheet's values (row 1 = headers) into an array of row objects. Empty lines are skipped. */
function rowsFromValues(values) {
  if (!values || values.length < 2) return [];
  var keys = values[0].map(normaliseHeader);
  var rows = [];
  for (var i = 1; i < values.length; i++) {
    var line = values[i] || [];
    var empty = true;
    var obj = {};
    for (var j = 0; j < keys.length; j++) {
      if (!keys[j]) continue;
      var v = line[j];
      if (v !== '' && v != null) empty = false;
      obj[keys[j]] = v;
    }
    if (!empty) rows.push(obj);
  }
  return rows;
}

/* True for a Date object (checked by type name, so it also works across script contexts). */
function isDate(v) { return Object.prototype.toString.call(v) === '[object Date]'; }

function text(v) { return v == null ? '' : String(v).trim(); }

/* Reads a JSON cell. Returns { ok, value }: an empty cell is ok with {}, a broken one is not ok and gives {}. */
function readJsonCell(v) {
  if (v && typeof v === 'object' && !isDate(v)) return { ok: true, value: v };
  var s = text(v);
  if (!s) return { ok: true, value: {} };
  try {
    var parsed = JSON.parse(s);
    if (parsed === null) return { ok: true, value: {} };
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return { ok: true, value: parsed };
    return { ok: false, value: {} };
  } catch (e) {
    return { ok: false, value: {} };
  }
}

/* A time in milliseconds, or null. Accepts a Date (as Sheets gives it) or text such as an ISO date. */
function timeOf(v) {
  if (isDate(v)) return isNaN(v.getTime()) ? null : v.getTime();
  var s = text(v);
  if (!s) return null;
  var t = Date.parse(s);
  return isNaN(t) ? null : t;
}

/* A score as a number from 0 to 100, or null. */
function scoreOf(v) {
  if (typeof v === 'number') return isFinite(v) ? v : null;
  var s = text(v).replace('%', '');
  if (!s) return null;
  var n = Number(s);
  return isFinite(n) ? n : null;
}

/* The step number 1 to 5 of a step_done event, or 0. */
function stepNumber(v) {
  var n = parseInt(text(v), 10);
  return n >= 1 && n <= 5 ? n : 0;
}

function addCount(map, key) { map[key] = (map[key] || 0) + 1; }

/* Sorts { key: count } into [[key, count], ...], biggest first, then by name. */
function sortedCounts(map) {
  return Object.keys(map).map(function (k) { return [k, map[k]]; })
    .sort(function (a, b) { return b[1] - a[1] || (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0); });
}

/*
  summarise(rows) → plain numbers. rows: one object per line of "events".
  One check = one check_id (rows without a check_id are counted as skipped).
  A check is "finished" when it has a "result" event whose verdict is not "stop". For each check, the LAST result event
  (latest received_at, else the later row) is the one used for verdict, score and answers.
*/
function summarise(rows) {
  rows = Array.isArray(rows) ? rows : [];
  var checks = {}, order = [];
  var s = {
    totalRows: rows.length, skippedRows: 0, badJsonCells: 0, firstAt: null, lastAt: null,
    checks: 0, funnel: [], resultChecks: 0, stopChecks: 0, finished: 0,
    verdicts: {}, scoreBands: [], scoreCount: 0, noScore: 0,
    useCases: [], hotelType: [], role: [], country: [], versions: [],
    step2: [], must: []
  };

  rows.forEach(function (r, i) {
    r = r || {};
    var id = text(r.check_id);
    var ev = text(r.event).toLowerCase();
    if (!id || !ev) { s.skippedRows++; return; }
    var t = timeOf(r.received_at);
    if (t !== null) {
      if (s.firstAt === null || t < s.firstAt) s.firstAt = t;
      if (s.lastAt === null || t > s.lastAt) s.lastAt = t;
    }
    var c = checks[id];
    if (!c) { c = checks[id] = { maxStep: 0, result: null, resultKey: null, info: {} }; order.push(id); }
    var key = [t === null ? -Infinity : t, i];

    if (ev === 'step_done') {
      var n = stepNumber(r.step);
      if (n > c.maxStep) c.maxStep = n;
    } else if (ev === 'result') {
      if (!c.resultKey || key[0] > c.resultKey[0] || (key[0] === c.resultKey[0] && key[1] > c.resultKey[1])) {
        c.result = r; c.resultKey = key;
      }
    }
    /* Profile fields: keep the latest non-empty value seen for the check. */
    ['hotel_type', 'role', 'country', 'use_case', 'version'].forEach(function (f) {
      var v = text(r[f]);
      if (v && (!c.info[f] || key[0] > c.info[f].k[0] || (key[0] === c.info[f].k[0] && key[1] > c.info[f].k[1]))) c.info[f] = { v: v, k: key };
    });
    /* Count broken JSON cells on every row, so the owner can see if the sending is faulty. */
    ['step2', 'must', 'answers'].forEach(function (f) { if (!readJsonCell(r[f]).ok) s.badJsonCells++; });
  });

  s.checks = order.length;

  /* Funnel: a check that reached a later point also counts for every step before it. */
  var reached = [0, 0, 0, 0, 0, 0]; // index 1..5 = completed that step
  var bands = SCORE_BANDS.map(function () { return 0; });
  var verdicts = {}, useCases = {}, hotelType = {}, role = {}, country = {}, versions = {};
  var q = {}, m = {};
  STEP2_QUESTIONS.forEach(function (x) { q[x[0]] = { Yes: 0, Planned: 0, No: 0, 'Not sure': 0, Unanswered: 0 }; });
  MUST_HAVES.forEach(function (x) { m[x[0]] = { Yes: 0, Planned: 0, No: 0, 'Not sure': 0, Unanswered: 0 }; });

  order.forEach(function (id) {
    var c = checks[id];
    var verdict = c.result ? text(c.result.verdict).toLowerCase() : '';
    var isStop = !!c.result && (verdict === 'stop' || text(c.result.step).toLowerCase() === 'stop');
    var isFinished = !!c.result && !isStop;
    var top = c.maxStep;
    if (isFinished) top = 5;
    for (var k = 1; k <= top; k++) reached[k]++;
    if (c.result) s.resultChecks++;
    if (isStop) s.stopChecks++;

    addCount(hotelType, c.info.hotel_type ? c.info.hotel_type.v : '(not given)');
    addCount(role, c.info.role ? c.info.role.v : '(not given)');
    addCount(country, c.info.country ? c.info.country.v : '(not given)');
    addCount(versions, c.info.version ? c.info.version.v : '(not given)');
    if (c.info.use_case) addCount(useCases, c.info.use_case.v);

    if (c.result) addCount(verdicts, isStop ? 'stop' : (verdict || '(blank)'));
    if (!isFinished) return;
    s.finished++;

    var sc = scoreOf(c.result.score);
    if (sc === null) s.noScore++;
    else {
      s.scoreCount++;
      for (var b = 0; b < SCORE_BANDS.length; b++) {
        if (sc >= SCORE_BANDS[b][1] && (sc <= SCORE_BANDS[b][2] || b === SCORE_BANDS.length - 1)) { bands[b]++; break; }
      }
    }
    var a2 = readJsonCell(c.result.step2).value, am = readJsonCell(c.result.must).value;
    STEP2_QUESTIONS.forEach(function (x) { tally(q[x[0]], a2[x[0]]); });
    MUST_HAVES.forEach(function (x) { tally(m[x[0]], am[x[0]]); });
  });

  function tally(box, v) {
    var w = text(v);
    if (w.toLowerCase() === 'planned, not done yet') w = 'Planned';
    if (ANSWER_WORDS.indexOf(w) >= 0) box[w]++;
    else box.Unanswered++;
  }

  for (var k = 1; k <= 5; k++) s.funnel.push({ label: 'Completed step ' + k, count: reached[k] });
  s.funnel.push({ label: 'Reached the result', count: s.finished });
  s.verdicts = sortedCounts(verdicts);
  s.scoreBands = SCORE_BANDS.map(function (b, i) { return [b[0], bands[i]]; });
  s.useCases = sortedCounts(useCases);
  s.hotelType = sortedCounts(hotelType);
  s.role = sortedCounts(role);
  s.country = sortedCounts(country);
  s.versions = sortedCounts(versions);
  s.step2 = STEP2_QUESTIONS.map(function (x) { return { id: x[0], name: x[1], counts: q[x[0]] }; });
  s.must = MUST_HAVES.map(function (x) { return { id: x[0], name: x[1], counts: m[x[0]] }; });
  return s;
}

/* A share as a whole percent, as text, or "–" when the base is 0. */
function pct(n, base) { return base ? Math.round((n / base) * 100) + '%' : '–'; }

function dateText(ms) {
  if (ms === null || ms === undefined) return '–';
  return new Date(ms).toISOString().slice(0, 10);
}

/* Turns the numbers from summarise() into the rows of the sheet "summary". Lines starting with "#" are block titles. */
function summaryTable(s, now) {
  var t = [];
  var base = 'Base: ' + s.checks + ' checks, ' + s.finished + ' finished, events received ' + dateText(s.firstAt) + ' to ' + dateText(s.lastAt);
  t.push(['Can AI solve your problems? Summary of the tool data']);
  t.push(['Last refreshed', isDate(now) ? now.toISOString().replace('T', ' ').slice(0, 16) + ' UTC' : text(now)]);
  t.push([base]);
  t.push(['Self-reported answers. One person may run several checks; people who opted out are not here. Quote no figure without its base.']);
  t.push([]);

  t.push(['# Data']);
  t.push(['Rows in "events"', s.totalRows]);
  t.push(['Rows skipped (no check_id or event)', s.skippedRows]);
  t.push(['Answer cells that could not be read (bad JSON)', s.badJsonCells]);
  t.push(['Distinct checks', s.checks]);
  t.push(['Finished checks (reached the result)', s.finished]);
  t.push(['Stopped at the "not suitable for AI" screen', s.stopChecks]);
  t.push([]);

  t.push(['# Funnel', 'Checks', 'Share of all checks', 'Lost since the line above']);
  var prev = s.checks;
  t.push(['Started (any event)', s.checks, pct(s.checks, s.checks), '']);
  s.funnel.forEach(function (f) {
    t.push([f.label, f.count, pct(f.count, s.checks), prev - f.count]);
    prev = f.count;
  });
  t.push(['Note: a check that stopped at the "not suitable for AI" screen counts as lost after the step it reached.']);
  t.push([]);

  var vBase = s.resultChecks;
  t.push(['# Verdicts (last result of each check)', 'Checks', 'Share of checks with a result']);
  if (!s.verdicts.length) t.push(['(no results yet)']);
  s.verdicts.forEach(function (v) { t.push([VERDICT_NAMES[v[0]] || v[0], v[1], pct(v[1], vBase)]); });
  t.push([]);

  t.push(['# Score bands (finished checks)', 'Checks', 'Share of finished checks with a score']);
  s.scoreBands.forEach(function (b) { t.push([b[0], b[1], pct(b[1], s.scoreCount)]); });
  t.push(['No score given (for example "Not enough information yet")', s.noScore, '']);
  t.push([]);

  t.push(['# Top use cases chosen (all checks)', 'Checks', 'Share of all checks']);
  if (!s.useCases.length) t.push(['(none chosen yet)']);
  s.useCases.slice(0, TOP_USE_CASES).forEach(function (u) { t.push([u[0], u[1], pct(u[1], s.checks)]); });
  if (s.useCases.length > TOP_USE_CASES) t.push(['(' + (s.useCases.length - TOP_USE_CASES) + ' more use cases not shown)']);
  t.push([]);

  [['# By hotel type', s.hotelType], ['# By role', s.role], ['# By country', s.country], ['# By tool version', s.versions]].forEach(function (blk) {
    t.push([blk[0] + ' (all checks)', 'Checks', 'Share of all checks']);
    if (!blk[1].length) t.push(['(no checks yet)']);
    blk[1].forEach(function (x) { t.push([x[0], x[1], pct(x[1], s.checks)]); });
    t.push([]);
  });

  var head = ['Yes', 'Planned', 'No', 'Not sure', 'Unanswered'];
  t.push(['# Step 2: the five questions (finished checks, n = ' + s.finished + ')'].concat(head));
  s.step2.forEach(function (x) {
    t.push([x.id + ' ' + x.name].concat(head.map(function (h) { return pct(x.counts[h], s.finished); })));
  });
  t.push([]);
  t.push(['# Step 3: the ten must-haves (finished checks, n = ' + s.finished + ')'].concat(head));
  s.must.forEach(function (x) {
    t.push([x.id + ' ' + x.name].concat(head.map(function (h) { return pct(x.counts[h], s.finished); })));
  });
  return t;
}
