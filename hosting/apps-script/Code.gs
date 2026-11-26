/* "Can AI solve your problems?": receives one event per POST from the public tool and adds one row to the sheet "events".
   Paste this into the Sheet's Apps Script (Extensions > Apps Script), then Deploy > New deployment > Web app,
   Execute as: Me, Who has access: Anyone. Only the tool's events come in; nobody else can open or read the Sheet.
   The tool sends JSON as text/plain (see tools/readiness-2-questions/src/collect.js). Nothing else is stored:
   no IP address, no browser name, no cookie. */

var SHEET_NAME = 'events';
var MAX_BYTES = 50000;
var COLUMNS = ['received_at', 'check_id', 'event', 'step', 'version', 'at', 'hotel_type', 'role', 'country', 'hotel_name',
  'use_case', 'verdict', 'score', 'step2', 'must', 'answers'];
var EVENTS = { step_done: true, result: true };

function doPost(e) {
  try {
    var body = e && e.postData && typeof e.postData.contents === 'string' ? e.postData.contents : '';
    if (!body || body.length > MAX_BYTES) return reply_(false, 'empty or too large');
    var p = JSON.parse(body);
    var row = toRow_(p);
    if (!row) return reply_(false, 'not an event from the tool');
    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try { sheet_().appendRow(row); } finally { lock.releaseLock(); }
    return reply_(true, 'ok');
  } catch (err) {
    return reply_(false, 'could not read the event');
  }
}

/* A quick check in a browser: opening the web app address shows this line. */
function doGet() {
  return ContentService.createTextOutput('This address only receives answers from the tool.');
}

/* Turns one event into one row, or null when it is not a valid event. Text is cut to a sane length; the three answer
   objects are kept as JSON text. A value starting with = + - @ is stored as plain text so the Sheet never runs it. */
function toRow_(p) {
  if (!p || typeof p !== 'object' || !EVENTS[p.event] || typeof p.check_id !== 'string' || !p.check_id) return null;
  function txt(v, n) {
    var s = typeof v === 'string' ? v.slice(0, n) : (typeof v === 'number' && isFinite(v) ? String(v) : '');
    return /^[=+\-@]/.test(s) ? "'" + s : s;
  }
  function obj(v) {
    if (!v || typeof v !== 'object' || Array.isArray(v)) return '{}';
    var out = {}, n = 0;
    for (var k in v) {
      if (n >= 60) break;
      if (Object.prototype.hasOwnProperty.call(v, k) && typeof v[k] === 'string') { out[String(k).slice(0, 40)] = v[k].slice(0, 20); n++; }
    }
    return JSON.stringify(out);
  }
  return [
    new Date(), txt(p.check_id, 60), txt(p.event, 20), txt(p.step, 20), txt(p.version, 20), txt(p.at, 40),
    txt(p.hotel_type, 40), txt(p.role, 40), txt(p.country, 60), txt(p.hotel_name, 120),
    txt(p.use_case, 20), txt(p.verdict, 40), typeof p.score === 'number' && isFinite(p.score) ? p.score : '',
    obj(p.step2), obj(p.must), obj(p.answers)
  ];
}

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) { sh.appendRow(COLUMNS); sh.setFrozenRows(1); }
  return sh;
}

function reply_(ok, msg) {
  return ContentService.createTextOutput(JSON.stringify({ ok: ok, msg: msg })).setMimeType(ContentService.MimeType.JSON);
}
