// Tests the pure part of Summary.gs in Node: node hosting/analysis/test/summary.test.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const here = dirname(fileURLToPath(import.meta.url));
const code = readFileSync(join(here, '..', 'Summary.gs'), 'utf8');
const ctx = {}; // no SpreadsheetApp: the pure functions must not need it
vm.createContext(ctx);
vm.runInContext(code, ctx, { filename: 'Summary.gs' });
// Results built inside the vm have that realm's Array/Object, so copy them into this realm before deepEqual.
const plain = (x) => JSON.parse(JSON.stringify(x));
const summarise = (r) => plain(ctx.summarise(r));
const summaryTable = (s, now) => plain(ctx.summaryTable(s, now));
const rowsFromValues = (v) => ctx.rowsFromValues(v);
const { normaliseHeader } = ctx;

const J = (o) => JSON.stringify(o);
const allYes2 = J({ q1: 'Yes', q2: 'Yes', q3: 'Yes', q4: 'Yes', q5: 'Yes' });
const mustA = J({ m1: 'Yes', m2: 'Planned', m3: 'No', m4: 'Yes', m5: 'Yes', m6: 'Yes', m7: 'Yes', m8: 'Yes', m9: 'Yes', m10: 'Yes' });

function steps(id, upTo, extra = {}) {
  const out = [];
  for (let s = 1; s <= upTo; s++) out.push({ received_at: `2026-11-2${s}T10:00:00Z`, check_id: id, event: 'step_done', step: String(s), version: '2.8.1', ...extra });
  return out;
}

const rows = [
  // A: finished, ready, score 82, all fields, use case u12
  ...steps('A', 5, { hotel_type: 'Chain', role: 'GM', country: 'Switzerland', use_case: 'u12' }),
  { received_at: '2026-11-26T10:00:00Z', check_id: 'A', event: 'result', step: 'result', verdict: 'ready', score: 82, use_case: 'u12', hotel_type: 'Chain', role: 'GM', country: 'Switzerland', step2: allYes2, must: mustA, answers: '{}' },
  // B: finished twice; the later result (almost, 60) must win. Bad JSON in step2 of the later one.
  ...steps('B', 5, { hotel_type: 'Independent', country: 'France', use_case: 'u12' }),
  { received_at: '2026-11-26T09:00:00Z', check_id: 'B', event: 'result', step: 'result', verdict: 'notready', score: 20, step2: allYes2, must: '{}', answers: '{}' },
  { received_at: '2026-11-26T11:00:00Z', check_id: 'B', event: 'result', step: 'result', verdict: 'almost', score: '60', use_case: 'u7', step2: '{not json', must: J({ m1: 'No' }), answers: '' },
  // C: unfinished, stopped after step 3
  ...steps('C', 3, { hotel_type: 'Chain', country: 'France' }),
  // D: unfinished, only step 1
  ...steps('D', 1),
  // E: stop screen after step 2
  ...steps('E', 2, { role: 'Owner' }),
  { received_at: '2026-11-25T12:00:00Z', check_id: 'E', event: 'result', step: 'stop', verdict: 'stop', score: '', step2: J({ q1: 'Yes' }), must: '{}', answers: '{}' },
  // F: finished, no information, no score; steps arrived out of order (only step 4 recorded)
  { received_at: '2026-11-25T08:00:00Z', check_id: 'F', event: 'step_done', step: '4', use_case: 'u3' },
  { received_at: '2026-11-25T08:30:00Z', check_id: 'F', event: 'result', step: 'result', verdict: 'noinfo', score: null, step2: J({ q1: 'Not sure', q2: 'No' }), must: J({ m1: 'Planned' }), answers: 'null' },
  // junk rows
  { received_at: 'yesterday', check_id: '', event: 'step_done', step: '1' },
  { check_id: 'G', event: '', step: '1' },
  null,
];

const s = summarise(rows);
assert.equal(s.totalRows, rows.length);
assert.equal(s.skippedRows, 3);
assert.equal(s.checks, 6, 'A B C D E F');
assert.equal(s.finished, 3, 'A B F');
assert.equal(s.stopChecks, 1);
assert.equal(s.resultChecks, 4);
assert.equal(s.badJsonCells, 1, 'only the "{not json" cell is broken; "" and "null" read as empty');

// Funnel: step1 A B C D E (F has no step 1 but finished, so counts) = 6
assert.deepEqual(s.funnel.map((f) => f.count), [6, 5, 4, 3, 3, 3]);

// Verdicts: last result per check
const v = Object.fromEntries(s.verdicts);
assert.deepEqual(v, { ready: 1, almost: 1, noinfo: 1, stop: 1 });

// Scores: A 82 (75–100), B 60 (50–74), F none
assert.deepEqual(s.scoreBands, [['0–49', 0], ['50–74', 1], ['75–100', 1]]);
assert.equal(s.noScore, 1);

// Use cases: latest non-empty per check: A u12, B u7 (later), F u3
assert.deepEqual(Object.fromEntries(s.useCases), { u12: 1, u7: 1, u3: 1 });

// Splits
assert.deepEqual(Object.fromEntries(s.hotelType), { Chain: 2, Independent: 1, '(not given)': 3 });
assert.deepEqual(Object.fromEntries(s.country), { France: 2, Switzerland: 1, '(not given)': 3 });
assert.equal(Object.fromEntries(s.role).Owner, 1);

// Step 2 among finished (A all Yes; B bad JSON = unanswered; F q1 Not sure, q2 No)
const q1 = s.step2[0].counts, q2 = s.step2[1].counts, q5 = s.step2[4].counts;
assert.deepEqual(q1, { Yes: 1, Planned: 0, No: 0, "Don't know yet": 1, Unanswered: 1 });
assert.deepEqual(q2, { Yes: 1, Planned: 0, No: 1, "Don't know yet": 0, Unanswered: 1 });
assert.deepEqual(q5, { Yes: 1, Planned: 0, No: 0, "Don't know yet": 0, Unanswered: 2 });
// Must-haves: m1 A Yes, B No, F Planned; m2 A Planned, others unanswered
assert.deepEqual(s.must[0].counts, { Yes: 1, Planned: 1, No: 1, "Don't know yet": 0, Unanswered: 0 });
assert.deepEqual(s.must[1].counts, { Yes: 0, Planned: 1, No: 0, "Don't know yet": 0, Unanswered: 2 });
assert.equal(s.must.length, 10);
assert.equal(s.step2.length, 5);

// Empty data never throws and gives zeros
for (const empty of [[], null, undefined, [null, {}]]) {
  const e = summarise(empty);
  assert.equal(e.checks, 0);
  assert.equal(e.finished, 0);
  const t = summaryTable(e, new Date('2026-11-26T12:00:00Z'));
  assert.ok(t.length > 20);
  assert.equal(t[1][1], '2026-11-26 12:00 UTC');
}

// The table carries the base and the last-refreshed line
const table = summaryTable(s, new Date('2026-11-26T12:00:00Z'));
assert.match(table[2][0], /^Base: 6 checks, 3 finished, events received 2026-11-21 to 2026-11-26$/);
assert.ok(table.some((r) => r[0] === 'Ready to start a pilot' && r[1] === 1 && r[2] === '25%'));

// Sheet values → rows, with loose header names
assert.equal(normaliseHeader('step2 json'), 'step2');
assert.equal(normaliseHeader(' Must_JSON '), 'must');
assert.equal(normaliseHeader('received_at'), 'received_at');
const fromSheet = rowsFromValues([
  ['received_at', 'check_id', 'event', 'step', 'version', 'hotel_type', 'role', 'country', 'hotel_name', 'use_case', 'verdict', 'score', 'step2 json', 'must json', 'answers json'],
  [new Date('2026-11-26T10:00:00Z'), 'X', 'result', 'result', '2.8.1', '', '', '', '', 'u1', 'ready', 90, allYes2, mustA, '{}'],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
]);
assert.equal(fromSheet.length, 1);
const sx = summarise(fromSheet);
assert.equal(sx.finished, 1);
assert.equal(sx.step2[0].counts.Yes, 1);
assert.equal(sx.must[2].counts.No, 1);
assert.equal(sx.firstAt, Date.parse('2026-11-26T10:00:00Z'));
assert.equal(rowsFromValues([]).length, 0);

console.log('summary.test.mjs: all assertions passed');
