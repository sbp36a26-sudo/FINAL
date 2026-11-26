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
    if (p.event === 'result') mailResult_(p);
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

/* Sends one plain-text email to the owner of this script for each finished check. A failed email never stops the row
   being stored. Gmail allows about 100 of these a day on a free account. */
var VERDICTS = { ready: 'Ready', almost: 'Almost ready', notready: 'Not ready yet', noinfo: 'Not enough information yet',
  stop: 'Stopped: not suitable for AI' };
function mailResult_(p) {
  try {
    var to = Session.getEffectiveUser().getEmail();
    if (!to) return;
    function line(label, v) { return label + ': ' + (v == null || v === '' ? '-' : String(v).slice(0, 120)); }
    function pairs(v) {
      if (!v || typeof v !== 'object') return '-';
      var out = [];
      for (var k in v) if (Object.prototype.hasOwnProperty.call(v, k) && typeof v[k] === 'string') out.push(String(k).slice(0, 40) + ' = ' + v[k].slice(0, 20));
      return out.length ? out.join('\n') : '-';
    }
    var verdict = VERDICTS[p.verdict] || p.verdict;
    var body = [
      'A check was finished in "Can AI solve your problems?".', '',
      line('Verdict', verdict), line('Score', typeof p.score === 'number' ? p.score + '%' : ''),
      line('Use case', p.use_case), line('Hotel type', p.hotel_type), line('Role', p.role),
      line('Country', p.country), line('Hotel name', p.hotel_name), line('Check id', p.check_id),
      line('Tool version', p.version), '',
      'Step 2 answers:', pairs(p.step2), '', 'Must-haves:', pairs(p.must), '', 'Tailored questions:', pairs(p.answers), '',
      'All rows are in the Sheet, tab "events".'
    ].join('\n');
    MailApp.sendEmail(to, 'Tool result: ' + verdict + (p.use_case ? ' (' + String(p.use_case).slice(0, 20) + ')' : ''), body);
  } catch (err) { /* the row is already stored */ }
}

/* Run this once from the editor to give the script permission to send email, and to see a sample. */
function testEmail() {
  mailResult_({ event: 'result', check_id: 'test', verdict: 'almost', score: 60, use_case: 'test', hotel_type: 'test',
    role: 'test', country: 'test', hotel_name: 'Test email, no real check', version: 'test', step2: {}, must: {}, answers: {} });
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
