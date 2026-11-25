// v3 question data (P1): both spec JSON files validate against spec/usecase_questions_v3.schema.json (the full file exactly, the
// runtime file with only original_questions lifted), the runtime file is the full file without its change-log fields, the page
// inlines exactly the runtime file, the validator really rejects bad data, counts and glossary.
// Run: node tools/readiness-3/tests/data3.test.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { root, load, tester } from './load.mjs';
import { validate } from '../lib/schema.mjs';
import { loadV3, runtimeSchema, strip } from '../lib/data3.mjs';
const { ok, done } = tester('data3');
const { R3D } = load();
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const clone = x => JSON.parse(JSON.stringify(x));

let v3; try { v3 = loadV3(); ok(true, 'loadV3'); } catch (e) { ok(false, 'loadV3: ' + e.message); process.exit(1); }
const { full, runtime, schema } = v3;
ok(validate(schema, full).length === 0, 'the full JSON validates against the schema as given');
ok(validate(runtimeSchema(schema), runtime).length === 0, 'the runtime JSON validates against the schema (original_questions not required)');
ok(validate(schema, runtime).length === 99 && validate(schema, runtime).every(e => /original_questions/.test(e.message)), 'against the unchanged schema the runtime file misses only original_questions (99 use cases)');
ok(eq(strip(full), runtime), 'runtime = full JSON without its change-log fields');

/* The validator rejects what the schema forbids (so a passing build means something). */
const bad = [
  ['question text without a question mark', d => { d.use_cases[0].questions[0].text = 'This is not a question at all.'; }],
  ['unknown weight', d => { d.use_cases[0].questions[0].weight = 'X'; }],
  ['unknown owner', d => { d.use_cases[3].questions[1].owner = 'CEO'; }],
  ['missing why', d => { delete d.use_cases[5].questions[2].why; }],
  ['unknown effect key', d => { d.use_cases[0].gates[0].options[0].effects.surprise = true; }],
  ['asked gate without options', d => { delete d.use_cases[0].gates[0].options; }],
  ['auto gate without effects', d => { const g = d.use_cases.flatMap(u => u.gates).find(g => g.kind === 'auto'); delete g.effects; }],
  ['98 use cases', d => { d.use_cases.pop(); }],
  ['changed disclaimer', d => { d.texts.disclaimer += ' '; }],
  ['wrong version', d => { d.version = '3.0.1'; }],
  ['bad show_if', d => { const q = d.use_cases.flatMap(u => u.questions).find(q => q.show_if); q.show_if = 'G_ACT=Acts'; }],
  ['question id pattern', d => { d.use_cases[0].questions[0].id = 'rm1.pe1'; }],
  ['10 must-haves', d => { d.must_haves.pop(); }],
  ['hide_area on a non-money, non-technology area', d => { const o = d.use_cases.flatMap(u => u.gates).flatMap(g => g.options || []).find(o => o.effects.hide_area); o.effects.hide_area = 'pe'; }],
];
bad.forEach(([name, f]) => { const d = clone(full); f(d); ok(validate(schema, d).length > 0, 'the validator rejects: ' + name); });
let threw = false; try { validate({ type: 'object', oneOf: [] }, {}); } catch (e) { threw = /unsupported keyword "oneOf"/.test(e.message); }
ok(threw, 'an unsupported schema keyword fails loudly');

/* The page inlines exactly the runtime file. */
const html = readFileSync(join(root, 'index.html'), 'utf8');
const m = html.match(/<script type="application\/json" id="r3-data">([\s\S]*?)<\/script>/);
ok(m && eq(JSON.parse(m[1]), runtime), 'index.html inlines spec/usecase_questions_v3.runtime.json unchanged');
ok(!/"original_questions":\[|"review_verdict"|"treatment"/.test(m ? m[1] : 'x'), 'no change-log fields in the page');

/* Counts (from the data, checked against its own counts block and the spec). */
const X = R3D.index(runtime);
const nq = runtime.use_cases.reduce((a, u) => a + u.questions.length, 0);
ok(runtime.use_cases.length === 99 && X.DEPTS.length === 15 && Object.keys(X.UC).length === 99, '99 use cases in 15 departments');
ok(nq === 794 && nq === runtime.counts.v3_use_case_questions_total, '794 use-case questions');
ok(runtime.use_cases.reduce((a, u) => a + u.questions.filter(q => q.source.type === 'gate').length, 0) === runtime.counts.gate_added && runtime.counts.gate_added === 122, '122 gate-added questions');
ok(runtime.must_haves.length === 11 && runtime.step2.length === 5, '11 must-haves, 5 step-2 questions');
ok(eq(runtime.must_haves.filter(m => m.na).map(m => m.id), ['m2', 'm4']), 'only m2 and m4 offer Doesn\'t apply');
ok(eq(runtime.use_cases.filter(u => u.sensitive.always).map(u => u.id).sort(), ['hr-2', 'hr-4', 'hr-5', 'hr-6', 'res-8', 'it-4', 'fo-3', 'fo-6', 'gx-4', 'sm-3'].sort()), 'sensitive always: the 10 use cases of §4');
ok(runtime.use_cases.filter(u => !u.sensitive.always && u.sensitive.when.length).length === 13 && runtime.counts.sensitive_conditional === 13, 'sensitive only when a gate answer is given: 13 more use cases');
ok(runtime.use_cases.every(u => eq(u.sensitive.when.slice().sort(), u.gates.filter(g => g.asked).flatMap(g => g.options.filter(o => o.effects.sensitive_flag).map(o => g.id + '=' + o.key)).sort())), 'sensitive.when lists exactly the gate answers whose effects raise the flag');
const wc = runtime.counts.weights, cw = { B: 0, I: 0, N: 0 }; runtime.use_cases.forEach(u => u.questions.forEach(q => cw[q.weight]++));
ok(eq(cw, { B: wc.B, I: wc.I, N: wc.N }), 'weights B/I/N as counted in the data: ' + JSON.stringify(cw));
ok(runtime.use_cases.reduce((a, u) => a + u.gates.filter(g => g.asked).length, 0) === runtime.counts.asked_gates, 'asked gates: ' + runtime.counts.asked_gates);
/* every original accounted for, in the full file */
const orig = full.use_cases.flatMap(u => u.original_questions);
ok(orig.length === 661 && full.counts.original_accounted === 661, '661/661 originals accounted for');
const act = {}; orig.forEach(o => { act[o.action] = (act[o.action] || 0) + 1; });
ok(eq(['keep', 'fix', 'rewrite', 'split', 'merge', 'remove'].map(k => act[k]), [395, 105, 28, 44, 65, 24]), 'actions keep 395, fix 105, rewrite 28, split 44, merge 65, remove 24');
ok(runtime.use_cases.reduce((a, u) => a + u.questions.filter(q => q.source.type === 'new').length, 0) === 56, '56 new questions');

/* Question text rules of §9 (checked, never changed): 20 words or fewer, exactly one question mark. */
const texts = runtime.use_cases.flatMap(u => u.questions.map(q => q.text).concat(u.gates.filter(g => g.asked).map(g => g.text)))
  .concat(runtime.none_fits.questions.map(q => q.text), runtime.must_haves.map(m => m.text), runtime.step2.map(s => s.text), Object.values(runtime.gate_questions).map(q => q.text));
ok(texts.every(t => t.split(/\s+/).filter(Boolean).length <= 20 && (t.match(/\?/g) || []).length === 1), 'every question: 20 words or fewer, one question mark (' + texts.length + ')');
/* Gate-added questions in use cases carry the gate question's text verbatim. */
let gq = 0, gqOk = 0; runtime.use_cases.forEach(u => u.questions.filter(q => q.source.type === 'gate').forEach(q => { gq++; const k = q.id.split('.')[1], G = runtime.gate_questions[k]; if (G && G.text === q.text && G.weight === q.weight && G.why === q.why) gqOk++; }));
ok(gq === gqOk, 'gate-added questions equal gate_questions (' + gqOk + '/' + gq + ')');

/* Glossary: every all-capitals acronym in a question has an entry; R3Data.acronyms finds them in order, case-sensitive, word-bounded. */
const caps = new Set(); texts.forEach(t => (t.match(/\b[A-Z][A-Z&]+\b/g) || []).forEach(a => caps.add(a)));
ok([...caps].every(a => runtime.glossary[a]), 'every acronym in a question is in the glossary: ' + [...caps].join(' '));
ok(eq(R3D.acronyms(runtime, 'Does the PMS send data to the AI tool and IT?').map(x => x.abbr), ['PMS', 'AI', 'IT']), 'acronyms in order of first appearance');
ok(eq(R3D.acronyms(runtime, ['Is it an ITEM?', 'it is']).length, 0), 'no match inside words or in lower case');
ok(eq(R3D.acronyms(runtime, 'The F&B team').map(x => x.full), ['food and beverage']), 'F&B spelled out from the glossary');
ok(runtime.labels.owners.VEN === 'Vendor (ask them)' && runtime.labels.areas.or === 'Rules and controls' && runtime.labels.weights.B === 'Blocker', 'labels from the data');
ok(!('label' in R3D) && !('S2' in R3D.index(runtime)), 'v3.0.1 clean-up D6: R3Data.label and the unused S2 index are gone');
done();
