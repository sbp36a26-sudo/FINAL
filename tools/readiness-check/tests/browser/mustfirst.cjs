// Browser proof: must-haves first (20 Nov 2026). Server: python3 -m http.server 8806 --bind 127.0.0.1 in tools/.
// node tests/browser/mustfirst.cjs   (SP = folder for screenshots; PORT default 8806; needs backup-v4/ for the old-build comparison)
const { chromium } = require('playwright'); const fs = require('fs');
const PORT = process.env.PORT || 8806, HOST = 'http://127.0.0.1:' + PORT;
const BASE = HOST + '/readiness-check/index.html', OLD = HOST + '/readiness-check/backup-v4/index.html';
const SP = process.env.SP || require('os').tmpdir() + '/rc-mustfirst'; fs.mkdirSync(SP, { recursive: true });
const FX = '/home/user/final/tools/readiness-check/tests/fixtures/';
let pass = 0, fail = 0; const ok = (c, n) => { if (c) pass++; else { fail++; console.log('FAIL  ' + n); } };
const GOOD = 'Revenue manager, four hours weekly';
const ext = new Set();
async function mk(b, w, touch, init) {
  const ctx = await b.newContext({ viewport: { width: w, height: w > 500 ? 900 : 844 }, hasTouch: touch, isMobile: touch, acceptDownloads: true });
  await ctx.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  if (init) await ctx.addInitScript(init.fn, init.arg);
  const p = await ctx.newPage(); p._errs = [];
  p.on('pageerror', e => p._errs.push(String(e)));
  p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|ERR_FAILED/.test(m.text())) p._errs.push(m.text()); });
  p.on('request', r => { const u = r.url(); if (!u.startsWith(HOST) && !u.startsWith('data:') && !u.startsWith('blob:')) ext.add(new URL(u).host); });
  return { ctx, p };
}
const noH = p => p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
const S = p => p.evaluate(() => ReadinessCheck.state());
const visible = p => p.evaluate(() => [...document.querySelectorAll('fieldset.qa')].map(f => ({ code: f.id.slice(3), gate: f.classList.contains('must'), area: (f.querySelector('.areatag') || {}).textContent || '', items: f.querySelectorAll('.item').length, missing: f.classList.contains('missing') })));
// plan(code, gate, list, i) -> value | [value, note] | null
async function answerScreen(p, plan, only) {
  for (const q of await visible(p)) {
    if (only && !only(q)) continue;
    if (q.items) { for (let k = 0; k < q.items; k++) { const v = plan(q.code, false, true, k); if (v) await p.evaluate(id => document.getElementById(id).click(), `q-${q.code}_${k}-${v}`); } continue; }
    let v = plan(q.code, q.gate, false); if (!v) continue; const note = Array.isArray(v) ? v[1] : null; v = Array.isArray(v) ? v[0] : v;
    if (!(await p.$(`#q-${q.code}-${v}`))) v = 'k';
    await p.evaluate(id => document.getElementById(id).click(), `q-${q.code}-${v}`);
    if (note) await p.fill('#pf-' + q.code, note);
  }
}
async function start(p, base, id, stage, type, country) {
  await p.goto(base); await p.selectOption('#h-type', type); if (country) await p.selectOption('#h-country', country);
  await p.click(`[data-act=pick][data-id="${id}"]`); await p.check('#stage-' + stage, { force: true }); await p.click('#go-prep'); await p.click('#begin-top');
}
const resultOf = p => p.evaluate(() => ({ verdict: document.getElementById('vsent').textContent, count: document.getElementById('count').textContent, first: [...document.querySelectorAll('.first li')].map(l => l.textContent),
  plan: [...document.querySelectorAll('#plan .agroup')].map(g => g.dataset.group + ':' + g.querySelectorAll('li, .gap').length), level: document.getElementById('verdict').dataset.level,
  areas: [...document.querySelectorAll('.brow')].map(r => r.querySelector('.lbl').textContent + '=' + r.querySelector('.word').textContent + '/' + r.querySelector('.ans').textContent),
  summary: document.querySelector('.sumtext').textContent }));
// Old six-step build: answer every step with the same plan and read the result.
async function oldResult(b, id, stage, type, country, plan) {
  const { ctx, p } = await mk(b, 1280, false);
  await start(p, OLD, id, stage, type, country);
  for (let i = 0; i < 6; i++) { await answerScreen(p, plan); await p.click('[data-act=next]'); }
  await p.waitForSelector('#view[data-state=result]'); const r = await resultOf(p); const errs = p._errs; await ctx.close(); return { r, errs };
}
const TOOLS = [
  { id: 'gx-2', label: 'chatbot', stage: 'choose', type: 'independent', country: 'Portugal',
    plan: (c, gate, list, i) => list ? (i % 3 === 0 ? 'n' : 'y') : gate ? (c === 'F2' ? 'p' : c === 'D5a' ? 'k' : ['y', GOOD]) : (c.charCodeAt(c.length - 1) % 3 === 0 ? 'p' : c.charCodeAt(0) % 2 ? 'y' : 'k') },
  { id: 'hr-2', label: 'high-risk HR', stage: 'sign', type: 'managed', country: 'Switzerland',
    plan: (c, gate, list) => list ? 'y' : gate ? (c === 'XL' ? 'k' : c === 'G3' ? 'n' : ['y', GOOD]) : 'p' },
  { id: 'sm-1', label: 'light', stage: 'explore', type: 'group', country: 'France',
    plan: (c, gate, list) => list ? 'y' : gate ? ['y', GOOD] : 'y' }
];
(async () => {
  const b = await chromium.launch();
  const before = {};
  for (const t of TOOLS) { const o = await oldResult(b, t.id, t.stage, t.type, t.country, t.plan); before[t.id] = o.r; ok(!o.errs.length, 'old build ran without errors for ' + t.label); }
  for (const [w, touch] of [[1280, false], [390, true]]) {
    const T = n => `[${w}] ${n}`;
    for (const t of TOOLS) {
      const { ctx, p } = await mk(b, w, touch);
      await start(p, BASE, t.id, t.stage, t.type, t.country);
      let s = await S(p);
      const steps = s.steps, N = steps.length, model = await p.evaluate(() => null);
      ok(s.step === 'must' && s.stepNo === 1 && steps[0] === 'must', T(t.label + ': the first question step is the must-haves (step 1 of ' + N + ')'));
      ok(await p.evaluate(n => new RegExp('Step 1 of ' + n).test(document.getElementById('hdr').innerText) && document.querySelector('.stephead h2').textContent === 'Must-haves' &&
        /^Start with the must-haves\. These decide the verdict, so they come first\. Every one needs an answer; if you do not know yet, choose “Don't know yet” and it goes on your list to find out\. Nobody checks your answers\. A Yes that isn't true only hides a problem you will meet after signing\.$/.test(document.querySelector('.stephead .meta').textContent), N), T(t.label + ': header "Step 1 of ' + N + '", title and intro'));
      let qs = await visible(p);
      ok(qs.length >= 6 && qs.every(q => q.gate && q.area && !q.items), T(t.label + ': ' + qs.length + ' must-haves, every one with an area tag (' + qs.map(q => q.code + '·' + q.area).join(', ') + ')'));
      const AREAS = ['People', 'Skills', 'Financial investment', 'Technology infrastructure', 'Data', 'Organisation & governance'];
      ok(qs.every((q, i) => !i || AREAS.indexOf(qs[i - 1].area) <= AREAS.indexOf(q.area)), T(t.label + ': must-haves in area order'));
      ok(await p.evaluate(() => [...document.querySelectorAll('fieldset.qa.must')].every(f => f.querySelector('.yesline'))), T(t.label + ': each must-have keeps "What counts as Yes"'));
      if (t.id === 'hr-2') ok(['XL', 'XG', 'G2s', 'P5', 'G3', 'D5a', 'D5b'].every(c => qs.some(q => q.code === c)), T('high-risk HR: conditional must-haves XL, XG, G2s, P5, G3, D5a, D5b on step 1'));
      ok(await noH(p), T(t.label + ': must-haves step, no horizontal scroll'));
      if (t.id === 'gx-2') await p.screenshot({ path: `${SP}/${w}_must_step.png`, fullPage: true });
      // Next with nothing answered: blocked, first must-have outlined with the line, focused, in view.
      await p.click('#next');
      s = await S(p);
      ok(s.step === 'must' && s.mustMissing && s.mustOpen === qs[0].code, T(t.label + ': Next with no answers does not move on'));
      ok(await p.evaluate(c => { const f = document.getElementById('fs-' + c), r = f.getBoundingClientRect(); return f.classList.contains('missing') && /Answer this to continue \(“Don't know yet” is fine\)\./.test(f.textContent) && f.contains(document.activeElement) && r.top < innerHeight && r.bottom > 0 && document.querySelectorAll('fieldset.missing').length === 1; }, qs[0].code), T(t.label + ': first unanswered must-have outlined, "Answer this to continue", focused and in view'));
      ok(!(await p.$eval('#next', e => e.disabled)), T(t.label + ': Next stays enabled'));
      if (t.id === 'gx-2') await p.screenshot({ path: `${SP}/${w}_must_blocked.png` });
      // Answer all but the last: still blocked, now at the last one.
      const last = qs[qs.length - 1].code;
      await answerScreen(p, t.plan, q => q.code !== last);
      await p.click('#next'); s = await S(p);
      ok(s.step === 'must' && s.mustOpen === last && await p.evaluate(c => document.getElementById('fs-' + c).classList.contains('missing'), last), T(t.label + ': one must-have left: still blocked, it is the one outlined'));
      await p.evaluate(c => document.getElementById('q-' + c + '-k').click(), last); // "Don't know yet" is fine
      ok(await p.evaluate(() => document.querySelectorAll('fieldset.missing').length === 0), T(t.label + ': outline gone once every must-have has an answer'));
      await p.click('#next'); s = await S(p);
      ok(s.step === steps[1] && s.stepNo === 2, T(t.label + ': "Don\'t know yet" on the last must-have lets Next go on to step 2 (' + s.step + ')'));
      // Back to the must-haves, give the last one the plan's answer (so both builds get the same answers), on again.
      await p.click('[data-act=back]'); ok((await S(p)).step === 'must', T(t.label + ': Back from step 2 returns to the must-haves'));
      await answerScreen(p, t.plan, q => q.code === last); await p.click('#next');
      // Area steps: no must-have asked twice; every question once.
      const seen = qs.map(q => q.code), mustCodes = qs.map(q => q.code);
      let repeat = false, mustOnArea = false, headers = [];
      for (let k = 1; k < N; k++) {
        s = await S(p); const vq = await visible(p);
        headers.push(await p.evaluate(() => document.querySelector('.stephead h2').textContent + ' | ' + document.getElementById('hdr').innerText.replace(/\s+/g, ' ')));
        if (vq.some(q => q.gate || q.area)) mustOnArea = true;
        vq.forEach(q => { if (seen.includes(q.code)) repeat = true; seen.push(q.code); });
        ok(new RegExp('Step ' + (k + 1) + ' of ' + N).test(headers[headers.length - 1]), T(t.label + ': header ' + headers[headers.length - 1].split('|')[1].trim()));
        if (k === 2) { // Back / forward, and reload mid-flow
          await p.click('[data-act=back]'); const s1 = await S(p); await p.click('#next'); const s2 = await S(p);
          ok(s1.step === steps[1] && s2.step === steps[2], T(t.label + ': Back then Next on area steps'));
          await p.goBack(); const s3 = await S(p); await p.goForward(); const s4 = await S(p);
          ok(s3.step === steps[1] && s4.step === steps[2], T(t.label + ': browser Back/forward'));
          await p.reload(); const s5 = await S(p);
          ok(s5.step === steps[2] && JSON.stringify(s5.steps) === JSON.stringify(steps), T(t.label + ': reload mid-flow stays on the same area step'));
        }
        await answerScreen(p, t.plan);
        ok(await noH(p), T(t.label + ': step ' + (k + 1) + ', no horizontal scroll'));
        await p.click('#next');
      }
      await p.waitForSelector('#view[data-state=result]');
      ok(!repeat && !mustOnArea, T(t.label + ': no must-have repeated on the area steps'));
      const all = await p.evaluate(() => { const st = ReadinessCheck.record(); return Object.keys(st.A).map(k => k.split('#')[0]); });
      ok([...new Set(all)].every(c => seen.includes(c)), T(t.label + ': every answered question was on exactly one step'));
      if (t.id === 'sm-1') ok(!headers.some(h => /^Financial investment/.test(h)) && N === 6, T('light tool: Financial investment (only must-haves) skipped, 6 steps'));
      const now = await resultOf(p), old = before[t.id];
      ok(JSON.stringify(now) === JSON.stringify(old), T(t.label + ': result identical to the six-step build (' + now.verdict + ' / ' + now.count + ')'));
      if (JSON.stringify(now) !== JSON.stringify(old)) console.log(JSON.stringify(now), '\n', JSON.stringify(old));
      await p.click('.more [data-act=edit]'); ok((await S(p)).step === 'must', T(t.label + ': "Go through all questions" opens the must-haves'));
      await p.evaluate(() => ReadinessCheck.send('home')); await p.click('[data-act=open-result]');
      ok(await p.evaluate(() => /The must-haves were asked first \(step 1\), then each area without them\./.test(document.querySelector('details[data-row=method]').textContent) && /From the must-haves \(step 1\)/.test(document.querySelector('.more').textContent)), T(t.label + ': "How this result was worked out" names the order; "More" says from the must-haves'));
      ok(await noH(p), T(t.label + ': result, no horizontal scroll'));
      if (t.id === 'gx-2') {
        // PDF
        const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 30000 }), p.click('.links [data-act=pdf], #primary[data-act=pdf]')]);
        const buf = fs.readFileSync(await dl.path()).toString('latin1'); fs.copyFileSync(await dl.path(), SP + '/' + w + '_report.pdf');
        ok(buf.startsWith('%PDF') && /The must-haves were asked first \\\(step 1\\\), then each area without them/.test(buf), T('PDF made and "How this was worked out" has the order line'));
        // Review: must-haves keep their area tag; edit → must
        await p.click('[data-act=review]');
        ok(await p.evaluate(() => [...document.querySelectorAll('fieldset.qa.must')].every(f => f.querySelector('.areatag'))), T('review: open must-haves show their area'));
        // Share locally, then the team page lists the check
        await p.click('[data-act=to-result]'); await p.click('details[data-row=share] summary'); await p.click('#share-btn');
        await p.waitForFunction(() => ReadinessCheck.state().share === 'shared');
        const tp = await ctx.newPage(); tp._errs = []; tp.on('pageerror', e => tp._errs.push(String(e)));
        await tp.goto(HOST + '/readiness-check/team.html'); await tp.waitForFunction(() => window.ReadinessTeam && ['ready', 'empty', 'error'].includes(ReadinessTeam.state().phase));
        const ts = await tp.evaluate(() => ReadinessTeam.state());
        ok(ts.phase === 'ready' && ts.count >= 1 && !tp._errs.length, T('team page lists the shared check, no errors'));
        ok(await tp.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), T('team page, no horizontal scroll'));
        await tp.close();
      }
      ok(!p._errs.length, T(t.label + ': no console errors' + (p._errs.length ? ' ' + p._errs.join(' | ') : '')));
      await ctx.close();
    }
    // --- checks saved by the six-step build (fixture written by backup-v4) ---
    const s4 = JSON.parse(fs.readFileSync(FX + 'storage-v4.json', 'utf8'));
    const seed = (o, cur) => { localStorage.clear(); Object.keys(o).forEach(k => { if (o[k] != null) localStorage.setItem(k, o[k]); }); if (cur) localStorage.setItem('hftp-readiness-current-v1', JSON.stringify(cur)); };
    for (const [who, expectStep] of [['B', 'must'], ['A', 3]]) {
      const { ctx, p } = await mk(b, w, touch);
      await p.goto(HOST + '/readiness-check/backup-v4/team.html'); // same origin, any page: write storage, then open the check page
      await p.evaluate(([o, cur]) => { localStorage.clear(); Object.keys(o).forEach(k => { if (o[k] != null) localStorage.setItem(k, o[k]); }); localStorage.setItem('hftp-readiness-current-v1', JSON.stringify(cur)); }, [s4.storage, s4.seenInV4[who].id]);
      await p.goto(BASE); const s = await S(p);
      ok(s.id === s4.seenInV4[who].id && s.step === expectStep, T('saved by the six-step build: check ' + who + ' (saved at area step ' + s4.seenInV4[who].step + ') reopens at ' + expectStep));
      if (who === 'A') {
        ok(await p.evaluate(n => document.querySelector('.stephead h2').textContent === 'Technology infrastructure' && new RegExp('Step ' + n + ' of ').test(document.getElementById('hdr').innerText), s.stepNo), T('check A: same area (Technology infrastructure), shown as step ' + s.stepNo + ' of ' + s.steps.length));
        await p.click('#home'); await p.click(`[data-act=open-result][data-id="${s4.seenInV4.A.id}"]`);
        const r = await resultOf(p);
        ok(r.verdict === s4.seenInV4.A.result.verdict && r.count === s4.seenInV4.A.result.count, T('check A: same verdict and count line as the six-step build showed'));
      } else {
        ok(await p.evaluate(() => document.querySelectorAll('fieldset.qa.must').length > 0 && !document.querySelector('fieldset.missing')), T('check B: must-haves step, no outline until Next is pressed'));
        await p.click('#next'); ok((await S(p)).step === 'must', T('check B: Next blocked until its must-haves have answers'));
      }
      // Open a file saved by the six-step build
      await p.click('#home').catch(() => {}); if ((await S(p)).step !== 'start') await p.evaluate(() => ReadinessCheck.send('home'));
      await p.setInputFiles('#loadfile', FX + 'check-v4.json'); await p.waitForFunction(() => ReadinessCheck.state().step === 'result' || document.querySelector('[data-confirm=file]'));
      if (await p.$('#file-yes')) await p.click('#file-yes');
      ok((await S(p)).step === 'result', T('file saved by the six-step build opens at the result (' + who + ')'));
      ok(!p._errs.length, T('saved checks: no console errors ' + p._errs.join(' | ')));
      await ctx.close();
    }
  }
  ok([...ext].every(h => /cdnjs|fonts\.googleapis|fonts\.gstatic/.test(h)), 'no unexpected external requests: ' + [...ext].join(', '));
  await b.close();
  console.log((fail ? 'FAILED' : 'ok') + ': ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
