// Browser test for "Do you need AI?" v3 (readiness-3): spec §3 "Tests (required)" and §9 Question quality / Tailoring, in the real page.
//  1. every use case (99 + None of these fits) × every combination of its asked "How it works" answers (each option, or unanswered),
//     from tests/fixtures/sim_v3_visible.json (written by sim_v3.visible_questions, tests/gen_sim_fixture.py): step 5 is drawn and
//       - the How it works cards come first, in the data's order, each with its exact text and option labels;
//       - once every How it works question has an answer, the question cards shown equal R3Rules.visible AND
//         sim_v3.visible_questions (same ids, same order); before that (council v3.0, BUILD NOW 1, v3.0.1) no question card is drawn,
//         R3Rules.visible still equals sim_v3 (scoring unchanged), and the line #gates-first names how many questions will follow:
//         the smallest and largest count over every way the open How it works questions can still be answered (from sim_v3);
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
const D_title = id => (D.use_cases.find(u => u.id === id) || {}).title + ' ' + (D.use_cases.find(u => u.id === id) || {}).department;
const PLANNED = 'If your vendor has confirmed it in writing but it isn\'t set up yet, answer Planned.';

(async () => {
  const b = await chromium.launch();
  for (const size of [[1280, 800], [360, 740]]) {
    const tag = size[0] + 'px', p0 = pass, f0 = fail;
    const ctx = await b.newContext({ viewport: { width: size[0], height: size[1] } });
    const p = await ctx.newPage(); const errs = [];
    p.on('pageerror', e => errs.push(String(e)));
    await p.goto(URL); await p.waitForFunction(() => window.Readiness3 && window.Readiness3.ready());
    let combos = 0, questions = 0, hidden = 0;
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
          const gf = document.getElementById('gates-first');
          return { step: st.step, visible: st.visible, cards, heads, hiw: !!document.getElementById('hiw-h'), wide: document.documentElement.scrollWidth > window.innerWidth,
            gf: gf ? { min: +gf.getAttribute('data-min'), max: +gf.getAttribute('data-max'), text: gf.textContent } : null };
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
        const ids = qc.map(c => c.id), allAnswered = gates.every(g => ga[g.id] != null);
        ok(JSON.stringify(s.visible) === JSON.stringify(simIds), t + ': R3Rules.visible = sim_v3.visible_questions');
        if (allAnswered) {
          ok(!s.gf, t + ': no "answer the questions above" line once every How it works question is answered');
          ok(JSON.stringify(ids) === JSON.stringify(simIds), t + ': shown = sim_v3.visible_questions\n   shown ' + ids + '\n   sim   ' + simIds);
        } else {
          hidden++;
          /* completions: the sim rows that keep the answers given and answer every open How it works question */
          const lens = SIM[use].filter(([g2]) => gates.every(g => g2[g.id] != null && (ga[g.id] == null || g2[g.id] === ga[g.id]))).map(([, sIds]) => sIds.length);
          const lo = Math.min(...lens), hi = Math.max(...lens), want = lo === hi ? 'to see the ' + lo + (lo === 1 ? ' question' : ' questions') + ' for this use case.' : 'to see the ' + lo + ' to ' + hi + ' questions for this use case.';
          ok(qc.length === 0, t + ': no question cards before the How it works answers (' + qc.length + ')');
          ok(s.gf && s.gf.min === lo && s.gf.max === hi && s.gf.text.includes(want) && s.gf.text.includes('count as Don\'t know yet.'), t + ': the line says how many questions follow (' + lo + '-' + hi + '): ' + (s.gf && s.gf.text));
        }
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
    console.log(tag + ': ' + combos + ' use case × How it works combinations drawn (' + hidden + ' with How it works open: questions held back), ' + questions + ' question cards checked');

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
    /* council v3.0, BUILD NOW 7: search over the 99 titles */
    await p.fill('#uc-search', 'chat');
    const found = await p.$$eval('input[name="n-use"]', is => is.map(i => i.value));
    ok(found.includes('gx-2') && !(await p.$('#dept')) && found.every(id => /chat/i.test(D_title(id))), tag + ': search "chat" finds gx-2 (' + found.join(' ') + '), the department list is hidden');
    const sz = await p.$eval('label[for="r-use-gx-2"]', l => l.getBoundingClientRect().height);
    ok(sz >= 44, tag + ': search results are 44 px targets (' + sz + ')');
    await p.check('#r-use-gx-2');
    ok((await p.evaluate(() => window.Readiness3.state().use)) === 'gx-2' && (await p.inputValue('#uc-search')) === 'chat', tag + ': a search result can be chosen; the search stays');
    await p.fill('#uc-search', 'zzzz nothing');
    ok((await p.textContent('#uc-count')).startsWith('No use case matches'), tag + ': no match says so');
    await p.fill('#uc-search', '');
    ok(!!(await p.$('#dept')) && (await p.$$('#uc-count')).length === 0 && (await p.$eval('#dept', s => s.value)) === D.use_cases.find(u => u.id === 'gx-2').department, tag + ': empty search shows the department list again, on the chosen use case\'s department');
    /* keyboard: type into the search, Tab to the results */
    await p.focus('#uc-search'); await p.keyboard.type('pricing');
    await p.keyboard.press('Tab');
    const kf = await p.evaluate(() => document.activeElement && document.activeElement.name);
    ok(kf === 'n-use', tag + ': keyboard: Tab from the search reaches the results (' + kf + ')');
    ok(errs.length === 0, tag + ': no page errors ' + errs.join(' | '));
    await ctx.close();
    console.log('questions ' + tag + ': ' + (pass - p0) + ' passed, ' + (fail - f0) + ' failed');
  }
  await b.close();
  console.log('questions: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
