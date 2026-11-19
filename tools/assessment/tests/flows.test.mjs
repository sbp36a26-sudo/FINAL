// Save machine and browser-draft format. Run: node tools/assessment/tests/flows.test.mjs
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
require('../flows.js'); // also sets globalThis.AIFlows (the repo is "type": "module", so module.exports is not used)
const F = globalThis.AIFlows;

let n = 0;
function t(name, fn) { fn(); n++; console.log('ok', n, name); }
const STATES = Object.keys(F.SAVE);
const EVENTS = ['edit', 'insync', 'block', 'save', 'wrote', 'behind', 'retry', 'fail'];

t('six states', () => assert.deepEqual(STATES.sort(), ['blocked', 'error', 'pending', 'retrying', 'saved', 'saving']));
t('every transition in the table lands on a known state', () => {
  for (const s of STATES) for (const e of Object.keys(F.SAVE[s])) assert.ok(STATES.includes(F.saveNext(s, e)), s + ' + ' + e);
});
t('happy path: edit, save, wrote', () => {
  let s = 'saved'; for (const [e, want] of [['edit', 'pending'], ['edit', 'pending'], ['save', 'saving'], ['wrote', 'saved']]) { s = F.saveNext(s, e); assert.equal(s, want); }
});
t('editing during a save stays "saving", then "behind" means another save is due', () => {
  assert.equal(F.saveNext('saving', 'edit'), 'saving');
  assert.equal(F.saveNext('saving', 'behind'), 'pending');
  assert.equal(F.saveNext('pending', 'save'), 'saving');
});
t('one retry, then fail or save', () => {
  assert.equal(F.saveNext('saving', 'retry'), 'retrying');
  assert.equal(F.saveNext('retrying', 'save'), 'saving');
  assert.equal(F.saveNext('saving', 'fail'), 'error');
  assert.equal(F.saveNext('retrying', 'fail'), 'error');
  assert.equal(F.saveNext('retrying', 'retry'), null, 'no second retry');
});
t('read-only: a flush blocks; nothing in flight can be blocked', () => {
  for (const s of ['saved', 'pending', 'blocked', 'error']) assert.equal(F.saveNext(s, 'block'), 'blocked');
  assert.equal(F.saveNext('saving', 'block'), null);
});
t('error and blocked recover on the next edit or save', () => {
  assert.equal(F.saveNext('error', 'edit'), 'pending'); assert.equal(F.saveNext('error', 'save'), 'saving');
  assert.equal(F.saveNext('blocked', 'edit'), 'pending'); assert.equal(F.saveNext('blocked', 'insync'), 'saved');
});
t('impossible transitions are rejected (null), e.g. "wrote" without a save', () => {
  for (const s of ['saved', 'pending', 'blocked', 'error', 'retrying']) { assert.equal(F.saveNext(s, 'wrote'), null); assert.equal(F.saveNext(s, 'behind'), null); }
  for (const s of ['saved', 'pending', 'blocked', 'error']) { assert.equal(F.saveNext(s, 'retry'), null); assert.equal(F.saveNext(s, 'fail'), null); }
  assert.equal(F.saveNext('saving', 'save'), null, 'no second write while one is in flight');
  assert.equal(F.saveNext('nope', 'edit'), null); assert.equal(F.saveNext('saved', 'nope'), null);
  assert.equal(F.saveNext('saved', 'toString'), null, 'prototype names are not events');
});
t('every state can reach "saved" (no dead ends)', () => {
  for (const s0 of STATES) {
    const seen = new Set([s0]), todo = [s0];
    while (todo.length) { const s = todo.pop(); for (const e of EVENTS) { const nx = F.saveNext(s, e); if (nx && !seen.has(nx)) { seen.add(nx); todo.push(nx); } } }
    assert.ok(seen.has('saved'), s0);
  }
});

const A = { id: '20261119-ABCD', info: { company: 'X' }, scores: {}, findings: {}, quotes: [] };
t('draft v1 round trip', () => {
  const d = F.makeDraft(A, 123);
  assert.deepEqual(F.parseDraft(JSON.stringify(d), A.id), { v: 1, at: 123, a: A });
});
t('draft written by the old version ({at, a}, no v) is migrated to v1', () => {
  assert.deepEqual(F.parseDraft(JSON.stringify({ at: 5, a: A }), A.id), { v: 1, at: 5, a: A });
});
t('malformed drafts are null, never thrown', () => {
  for (const raw of ['', '{', 'null', '[]', '"x"', JSON.stringify({ at: 'x', a: A }), JSON.stringify({ at: 1 }), JSON.stringify({ at: 1, a: [] }),
    JSON.stringify({ at: 1, a: { id: A.id } }), JSON.stringify({ v: 2, at: 1, a: A }), JSON.stringify({ at: 1, a: Object.assign({}, A, { id: 'OTHER' }) })])
    assert.equal(F.parseDraft(raw, A.id), null, raw);
});
console.log(n + ' flow tests passed');
