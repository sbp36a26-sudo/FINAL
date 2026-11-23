// AI starting point v1.3 (owner): the two systems questions (b1 "Systems that can talk to each other", b2 "Older systems")
// name "the systems you want to connect the tool to" and give examples that fit the department chosen in step 1b.
// Run: node tools/readiness-2/tests/v13.test.mjs (after node tools/readiness-2/build.mjs, which inlines the catalogue).
import { load, catalogue, tester } from './load.mjs';
const { C, L, F, P } = load();
const cat = catalogue();
const { ok, done } = tester('v1.3');
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const rec = o => Object.assign(F.blank(), { step: 'summary' }, o);

const B1Q = 'Has it been confirmed in writing that the tool can read from and write back to the systems you want to connect it to?';
const B2Q = 'Do you know which systems the tool must connect to and, if one of them is old and hard to connect, is there a plan?';
const FALLBACK = 'your PMS (booking system), POS (tills), accounting or HR systems';
// The table the owner asked for, written out by hand (not read from content.js), so a change to either shows here.
const TABLE = {
  rm: 'your PMS (booking system), revenue management system and channel manager',
  res: 'your PMS (booking system), channel manager, booking engine and phone system',
  sm: 'your CRM (guest database), email marketing tool, website and booking engine',
  fo: 'your PMS (booking system), door locks and guest messaging',
  gx: 'your PMS (booking system), guest messaging, CRM (guest database) and review sites',
  fb: 'your POS (tills), table reservations, sales and catering system and PMS (booking system)',
  hk: 'your PMS (booking system and room status), housekeeping app and staff messaging',
  me: 'your building management system (heating, cooling, energy) and maintenance work orders',
  kc: 'your POS (tills), inventory and recipe costing',
  pr: 'your purchasing system, inventory, accounting system and supplier catalogues',
  fa: 'your accounting system, PMS (booking system) and bank feeds',
  hr: 'your payroll, HR records and staff scheduling',
  gm: 'your PMS (booking system), accounting system, reporting dashboards and shared documents',
  it: 'your network and firewall, email system, staff accounts and security cameras',
  lg: 'your energy and utility meters, accounting system, HR records and contract files'
};

// ---------- the map: keyed by the catalogue's department ids, one entry each ----------
ok(eq(Object.keys(C.SYSTEMS).sort(), cat.depts.map(d => d.id).sort()), 'SYSTEMS keys = the inlined catalogue’s 15 department ids');
ok(eq(C.SYSTEMS, TABLE), 'SYSTEMS = the owner’s table, by hand');
ok(C.SYSTEMS_FALLBACK === FALLBACK, 'fallback wording');
Object.entries(C.SYSTEMS).forEach(([k, t]) => ok(/^your /.test(t) && !/\.$/.test(t), 'plain list starting "your", no full stop: ' + k));
ok(/team’s own list, based on the catalogue’s use cases, not a survey/.test(C.SYSTEMS_NOTE) && C.SOURCES.needsNote.endsWith(C.SYSTEMS_NOTE), '"Where this comes from" (step 2) marks the list as the team’s, not a survey');

// ---------- examples per department, and the fallback ----------
cat.depts.forEach(d => {
  const u = d.uses[0], s = L.systemsFor({ cat: d.cat, dept: d.id, use: u.id });
  ok(s.text === TABLE[d.id] && s.line === 'For example: ' + TABLE[d.id] + '.' && !s.fallback && s.dept === d.id, 'examples for ' + d.id);
  ok(L.systemsFor({ cat: d.cat, dept: d.id, use: '' }).text === TABLE[d.id], 'department chosen, use case not yet: still that department ' + d.id);
  ok(L.systemsFor({ cat: d.cat, dept: d.id, use: 'none' }).text === FALLBACK, '"None of these fits" → fallback, even under ' + d.id);
});
for (const r of [undefined, null, {}, F.blank(), { dept: '' }, { dept: 'zz' }, { dept: 'toString' }, { dept: '__proto__' }, { use: 'none' }])
  ok(L.systemsFor(r).text === FALLBACK && L.systemsFor(r).fallback, 'no department → fallback ' + JSON.stringify(r));

// ---------- b1 / b2 wording, the examples line, the PMS gloss only where PMS is shown ----------
ok(L.ITEM.b1.check === B1Q && L.ITEM.b2.check === B2Q, 'b1 and b2 self-check wording');
ok(C.NEEDS.every(x => Array.isArray(x.also) && Array.isArray(x.ev)), 'every step 2 item keeps its also/evidence lists');
ok(C.NEEDS.filter(x => x.ex).map(x => x.id).join() === 'b1,b2' && C.FACTORS.every(x => !x.ex), 'only b1 and b2 carry examples');
const KC = rec({ cat: 'Operational', dept: 'kc', use: 'kc-1' }), HR = rec({ cat: 'Administrative', dept: 'hr', use: 'hr-1' }), NONE = rec({ cat: 'Operational', dept: '', use: 'none' }), FO = rec({ cat: 'Guest-facing', dept: 'fo', use: 'fo-1' });
ok(L.itemText('b1', KC).ex === 'For example: your POS (tills), inventory and recipe costing.' && L.itemText('b2', KC).ex === L.itemText('b1', KC).ex, 'Kitchen: b1 and b2 examples line');
ok(L.itemText('b1', HR).ex === 'For example: your payroll, HR records and staff scheduling.', 'HR: examples line');
ok(L.itemText('b1', NONE).ex === 'For example: ' + FALLBACK + '.', 'None of these fits: fallback examples line');
ok(L.itemText('b1', KC).gloss === '' && L.itemText('b1', HR).gloss === '' && L.itemText('b1', { dept: 'me' }).gloss === '', 'no PMS gloss where PMS is not among the examples (kc, hr, me)');
ok(/^PMS: /.test(L.itemText('b1', NONE).gloss) && /^PMS: /.test(L.itemText('b1', FO).gloss) && /^PMS: /.test(L.itemText('b1', { dept: 'fa' }).gloss), 'PMS gloss where PMS is among the examples (fallback, fo, fa)');
Object.keys(TABLE).forEach(k => ok(!!L.itemText('b1', { dept: k }).gloss === /\bPMS\b/.test(TABLE[k]), 'gloss iff PMS shown: ' + k));
ok(L.itemText('b2', NONE).gloss === '' && L.itemText('b5', KC).gloss === L.ITEM.b5.gloss, 'b2 has no gloss of its own (b1 sits above it); other glosses unchanged');
ok(L.itemText('b3', KC).ex === '' && L.itemText('c1', KC).ex === '', 'no examples line on other items');
ok(/your hotel systems/.test(L.ITEM.b1.plain) && /hotel system the tool needs/.test(L.ITEM.b1.good), 'b1 plain and "what good looks like": hotel systems wording');

// ---------- actions: summary, copy text and PDF share L.action ----------
ok(L.action('b1', 'n', '', KC).text === 'Ask the vendor to confirm in writing that the tool reads from and writes back to the systems you want to connect it to (for example your POS (tills), inventory and recipe costing), and see it work on your own systems.', 'b1 action, Kitchen, by hand');
ok(L.action('b2', 'p', '', HR).text === 'Find out which systems the tool must connect to (for example your payroll, HR records and staff scheduling) and whether other software can connect to them; if one cannot, ask the vendor for an interface or an upgrade date.', 'b2 action, HR, by hand');
ok(L.action('b1', 'n', '', NONE).text.includes('(for example ' + FALLBACK + ')'), 'b1 action, None of these fits: fallback');
ok(L.action('b1', 'k', '', KC).text === 'Find out: “' + B1Q + '” For example: your POS (tills), inventory and recipe costing.', 'Don’t know yet: the question plus the examples line');
ok(L.action('b2', 'pl', '2027-03-01', HR).text.startsWith('Finish: Find out which systems') && L.action('b2', 'pl', '2027-03-01', HR).text.endsWith('upgrade date (planned by 1 Mar 2027).'), 'Planned: Finish … (planned by …)');
ok(L.action('b1', 'n').text.includes(FALLBACK) && !/\{ex\}/.test(JSON.stringify([L.action('b1', 'n'), L.action('b2', 'k'), L.action('b2', 'pl', '2027-01-01')])), 'no record → fallback; the {ex} slot is never shown');
ok(eq(L.actions({ b1: 'n', b2: 'n' }, {}, null, KC).filter(a => a.id === 'b1' || a.id === 'b2').map(a => a.text.includes('recipe costing')), [true, true]), 'actions() passes the record on');

// ---------- PDF: the item block carries the examples line; actions use the department ----------
{
  const A = Object.fromEntries(L.NEED_IDS.concat(L.FACTOR_IDS).map(id => [id, 'n']));
  for (const [r, txt, tag] of [[KC, TABLE.kc, 'Kitchen'], [HR, TABLE.hr, 'HR'], [NONE, FALLBACK, 'None of these fits']]) {
    const m = P.model(Object.assign({}, r, { Q: { q1: 'y', q2: 'y', q3: 'y', q4: 'y', q5: 'y' }, A }), cat, { today: '2026-11-23' });
    const it = id => m.blocks.find(b => b.k === 'item' && b.id === id);
    ok(it('b1').check === B1Q && it('b1').ex === 'For example: ' + txt + '.' && it('b2').check === B2Q && it('b2').ex === it('b1').ex, 'PDF ' + tag + ': b1/b2 question and examples line');
    ok(it('b1').action.includes('(for example ' + txt + ')') && it('b2').action.includes('(for example ' + txt + ')'), 'PDF ' + tag + ': b1/b2 actions with the examples');
    ok(m.blocks.filter(b => b.k === 'num').some(b => b.t.includes('(for example ' + txt + ')')), 'PDF ' + tag + ': "Start with these three" (b1 first) with the examples');
    ok(it('b3').ex === '', 'PDF ' + tag + ': no examples line on b3');
  }
}

// ---------- no PMS-only sentence anywhere the hotel looks ----------
// Every user-visible string of the page's content and of the summary/PDF for each department and the fallback.
// A sentence naming the PMS must also name another system (so the PMS is one example among others), or be the PMS gloss.
// One exception, documented in the CHANGELOG: the readiness check's own T2 question, quoted word for word under
// "The readiness check also asks" in b2's fold (the readiness check is not changed here).
{
  const T2 = C.NEEDS.find(x => x.id === 'b2').also.find(a => a[0] === 'T2')[1];
  const strings = [];
  const walk = (v, key) => { if (typeof v === 'string') { if (!['id', 'rc', 'who'].includes(key)) strings.push(v); } else if (Array.isArray(v)) v.forEach(x => walk(x, key)); else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => walk(x, k)); };
  walk(Object.fromEntries(Object.entries(C).filter(([k]) => !['SYSTEMS', 'SYSTEMS_FALLBACK'].includes(k))));
  const A = Object.fromEntries(L.NEED_IDS.concat(L.FACTOR_IDS).map(id => [id, 'k']));
  for (const r of [...cat.depts.map(d => rec({ cat: d.cat, dept: d.id, use: d.uses[0].id })), NONE]) {
    for (const id of ['b1', 'b2']) { const w = L.itemText(id, r); strings.push(w.plain, w.good, w.check, w.ex, w.gloss); ['n', 'p', 'k', 'pl'].forEach(v => strings.push(L.action(id, v, '2027-01-01', r).text)); }
    P.model(Object.assign({}, r, { A, Q: { q1: 'y', q2: 'y', q3: 'y', q4: 'y', q5: 'y' } }), cat, { today: '2026-11-23' }).blocks.forEach(b => [b.t, b.check, b.ex, b.action, b.sub].forEach(x => x && strings.push(x)));
  }
  const OTHER = /POS|accounting|finance|channel manager|door locks|guest messaging|revenue management|bank feeds|housekeeping app|reporting dashboards|HR systems|CRM|table reservations/;
  const bad = [];
  strings.filter(s => s && s !== T2).forEach(s => s.split(/(?<=[.?!])\s+(?=[A-Z“])/).forEach(sen => {
    if (/\bPMS\b|booking system/.test(sen) && !OTHER.test(sen) && !/^PMS: the property management system/.test(sen) && !/^(reservations|the booking system that holds)/.test(sen)) bad.push(sen);
  }));
  ok(bad.length === 0, 'no PMS-only sentence in content, b1/b2 texts, actions or the PDF: ' + JSON.stringify([...new Set(bad)].slice(0, 3)));
  ok(/\(PMS\)/.test(T2), 'the T2 quote is the only PMS-only text left (readiness check wording, quoted)');
}

// ---------- step 1a: "Why this matters" fold, a one-line reason first (owner, v1.3) ----------
{
  const { readFileSync } = await import('node:fs');
  const app = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
  C.QUESTIONS.forEach(q => {
    const n = (q.whyShort || '').trim().split(/\s+/).filter(Boolean).length;
    ok(n > 0 && n <= 25 && /[.]$/.test(q.whyShort) && (q.whyShort.match(/[.?!](\s|$)/g) || []).length === 1, 'one-sentence short reason, at most 25 words: ' + q.id + ' (' + n + ')');
    ok(q.why && q.why !== q.whyShort && q.yes && q.no, 'longer why and the Yes/No examples kept: ' + q.id);
    ok(typeof q.short === 'string' && q.short.length < 40, 'the to-find-out label `short` is unchanged in kind: ' + q.id);
  });
  ok(/fold\('why-' \+ q\.id, 'Why this matters', '<p class="whyshort"[^]*?esc\(q\.whyShort\)[^]*?esc\(q\.why\)[^]*?Yes, for example[^]*?No, for example/.test(app), 'fold label "Why this matters": short line first, then why, then the examples');
  ok(!/Why we ask, and an example/.test(app), 'old fold label gone');
}

done();
