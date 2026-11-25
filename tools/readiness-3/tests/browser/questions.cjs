// Browser test for "Do you need AI?" v3 (readiness-3): spec §3 "Tests (required)" and §9 Question quality / Tailoring, in the real page.
//  1. every use case (99 + None of these fits) × every combination of its asked "How it works" answers (each option, or unanswered),
//     from tests/fixtures/sim_v3_visible.json (written by sim_v3.visible_questions, tests/gen_sim_fixture.py): step 5 is drawn and
//       - the How it works cards come first, in the data's order, each with its exact text and option labels;
//       - the question cards shown equal R3Rules.visible AND sim_v3.visible_questions (same ids, same order);
//       - each question card shows its exact text, "Who answers: <owner>", its weight label ("Must be Yes" for blockers, else
//         Important / Nice to have), the Planned help line, a collapsed "Why we ask" toggle holding its exact why line, and answers
//         Yes / Planned / No / Don't know yet;
//       - an area heading (plain area name) stands before each run of questions of one area.
//  2. all 99 use cases are reachable in the picker: each department lists exactly its use cases, in data order, and each one can be
//     chosen (the "Your choice" panel names it).
//  3. no horizontal scroll on step 5 for any combination (at 1280 and at 360 px).
// Serve tools/ first:  python3 -m http.server 8861 --bind 127.0.0.1   (R3_BASE for another address)
// Run from tools/:  node readiness-3/tests/browser/questions.cjs
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const BASE = process.env.R3_BASE || 'http://127.0.0.1:8861/';
const URL = BASE + 'readiness-3/index.html';
const ROOT = path.join(__dirname, '..', '..');
const D = JSON.parse(fs.readFileSync(path.join(ROOT, 'spec', 'usecase_questions_v3.runtime.json'), 'utf8'));
const SIM = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests', 'fixtures', 'sim_v3_visible.json'), 'utf8'));
let pass = 0, fail = 0; const ok = (c, n) => { if (c) pass++; else { fail++; if (fail < 60) console.log('FAIL  ' + n); } };

/* the expected question objects straight from the JSON (not through the page's rules) */
function qDef(use, id) {
  const key = id.split('.').slice(1).join('.');
  if (use === 'none') return D.none_fits.questions.find(q => q.id === id) || (id.startsWith('none.') && D.gate_questions[key]) || null;
  const u = D.use_cases.find(x => x.id === use);
  return u.questions.find(q => q.id === id) || null;
}
function askedGates(use) {
  if (use === 'none') return D.none_fits.gates.map(g => D.gate_library[g] ? Object.assign({ id: g }, D.gate_library[g]) : { id: g });
  return D.use_cases.find(x => x.id === use).gates.filter(g => g.asked);
}
const WEIGHT = { B: 'Must be Yes', I: D.labels.weights.I, N: D.labels.weights.N };
const PLANNED = 'If your vendor has confirmed it in writing but it isn\'t set up yet, answer Planned.';

(async () => {
  const b = await chromium.launch();
  for (const size of [[1280, 800], [360, 740]]) {
    const tag = size[0] + 'px';
    const ctx = await b.newContext({ viewport: { width: size[0], height: size[1] } });
    const p = await ctx.newPage(); const errs = [];
    p.on('pageerror', e => errs.push(String(e)));
    await p.goto(URL); await p.waitForFunction(() => window.Readiness3 && window.Readiness3.ready());
    let combos = 0, questions = 0;
    for (const use of Object.keys(SIM)) {
      const gates = askedGates(use);
      /* draw every combination in the page and read what is on screen */
      const shown = await p.evaluate(([use, rows]) => {
        const R = window.Readiness3, D3 = JSON.parse(document.getElementById('r3-data').textContent);
        return rows.map(([ga]) => {
          const check = { id: 'verbatim-test', step: 'use', hotel: {}, step2: {}, mh: {}, use: use, gates: { [use]: ga }, qa: {}, cont: '' };
          R.openText(JSON.stringify({ kind: 'hftp-do-you-need-ai', v: 4, rules: '3.0', savedAt: '2026-11-25T00:00:00Z', check }));
          const st = R.state(), view = document.getElementById('view');
          const cards = [...view.querySelectorAll('fieldset.card')].map(c => {
            const inp = c.querySelector('input[type=radio]'), why = c.querySelector('p.why'), wb = c.querySelector('[data-act="why"]');
            return { kind: inp && inp.getAttribute('data-kind'), id: inp && inp.getAttribute('data-id'),
              text: (c.querySelector('.qtext') || {}).textContent, tags: [...c.querySelectorAll('.tag')].map(t => t.textContent),
              opts: [...c.querySelectorAll('label.opt')].map(l => l.textContent), help: [...c.querySelectorAll('p.help')].map(x => x.textContent),
              why: why ? why.textContent : null, whyHidden: why ? why.hidden : null, whyBtn: wb ? [wb.textContent, wb.getAttribute('aria-expanded'), wb.getAttribute('aria-controls') === (why && why.id)] : null };
          });
          /* area headings: the heading right before each question card */
          const heads = [...view.querySelectorAll('fieldset.card')].map(c => { let e = c.previousElementSibling; while (e && e.tagName === 'FIELDSET') e = e.previousElementSibling; return e && e.classList.contains('areahead') ? e.textContent : null; });
          return { step: st.step, visible: st.visible, cards, heads, hiw: !!document.getElementById('hiw-h'), wide: document.documentElement.scrollWidth > window.innerWidth };
        });
      }, [use, SIM[use]]);
      SIM[use].forEach(([ga, simIds], i) => {
        combos++;
        const s = shown[i], t = tag + ' ' + use + ' ' + JSON.stringify(ga);
        ok(s.step === 'use' && s.hiw, t + ': step 5 with How it works');
        ok(!s.wide, t + ': no horizontal scroll');
        const gc = s.cards.filter(c => c.kind === 'gate'), qc = s.cards.filter(c => c.kind === 'q');
        ok(s.cards.slice(0, gc.length).every(c => c.kind === 'gate'), t + ': How it works cards come first');
        ok(JSON.stringify(gc.map(c => c.id)) === JSON.stringify(gates.map(g => g.id)), t + ': How it works cards ' + gc.map(c => c.id) + ' = ' + gates.map(g => g.id));
        gc.forEach(c => { const g = gates.find(x => x.id === c.id); ok(g && c.text === g.text && JSON.stringify(c.opts) === JSON.stringify(g.options.map(o => o.label)), t + ': gate ' + c.id + ' verbatim'); });
        const ids = qc.map(c => c.id);
        ok(JSON.stringify(ids) === JSON.stringify(simIds), t + ': shown = sim_v3.visible_questions\n   shown ' + ids + '\n   sim   ' + simIds);
        ok(JSON.stringify(s.visible) === JSON.stringify(simIds), t + ': R3Rules.visible = sim_v3.visible_questions');
        let prevArea = null;
        qc.forEach((c, k) => {
          questions++;
          const q = qDef(use, c.id), tt = t + ' ' + c.id;
          if (!q) { ok(false, tt + ': not in the JSON list of ' + use); return; }
          ok(c.text === q.text, tt + ': text verbatim');
          ok(c.tags.length === 2 && c.tags[0] === 'Who answers: ' + D.labels.owners[q.owner] && c.tags[1] === WEIGHT[q.weight], tt + ': tags ' + JSON.stringify(c.tags));
          ok(JSON.stringify(c.opts) === JSON.stringify(D.answers.check.map(o => o.label)), tt + ': answers Yes / Planned / No / Don\'t know yet');
          ok(c.help.length === 1 && c.help[0] === PLANNED, tt + ': Planned help line');
          ok(c.why === q.why && c.whyHidden === true && c.whyBtn && c.whyBtn[0] === 'Why we ask' && c.whyBtn[1] === 'false' && c.whyBtn[2], tt + ': why line verbatim behind a collapsed "Why we ask"');
          const head = s.heads[s.cards.indexOf(c)];
          if (q.area !== prevArea) ok(head === D.labels.areas[q.area], tt + ': area heading ' + head + ' = ' + D.labels.areas[q.area]);
          else ok(head === null || head === D.labels.areas[q.area], tt + ': same area run');
          prevArea = q.area;
        });
      });
    }
    ok(combos === 1636, tag + ': ' + combos + ' combinations (expected 1636)');
    console.log(tag + ': ' + combos + ' use case × How it works combinations drawn, ' + questions + ' question cards checked');

    /* 2: every use case reachable in the picker */
    await p.evaluate(() => window.Readiness3.send('new'));
    await p.evaluate(() => window.Readiness3.send('goto', 'where'));
    const depts = [...new Set(D.use_cases.map(u => u.department))];
    const optDepts = await p.$$eval('#dept option', os => os.map(o => o.value).filter(Boolean));
    ok(JSON.stringify(optDepts.slice().sort()) === JSON.stringify(depts.slice().sort()) && optDepts.length === 15, tag + ': 15 departments in the picker');
    let reached = 0;
    for (const dpt of optDepts) {
      await p.selectOption('#dept', dpt);
      const radios = await p.$$eval('input[name="n-use"]', is => is.map(i => i.value));
      const want = D.use_cases.filter(u => u.department === dpt).map(u => u.id);
      ok(JSON.stringify(radios) === JSON.stringify(want), tag + ' ' + dpt + ': lists its use cases in data order');
      for (const id of radios) {
        await p.check('#r-use-' + id.replace(/[^A-Za-z0-9_-]/g, '_'));
        const u = D.use_cases.find(x => x.id === id);
        if ((await p.textContent('#about-h')).trim() === 'Your choice: ' + u.title && (await p.evaluate(() => window.Readiness3.state().use)) === id) reached++;
        else ok(false, tag + ' ' + id + ': could not be chosen');
      }
    }
    ok(reached === 99, tag + ': all 99 use cases reachable in the picker (' + reached + ')');
    ok(errs.length === 0, tag + ': no page errors ' + errs.join(' | '));
    await ctx.close();
  }
  await b.close();
  console.log('questions: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
