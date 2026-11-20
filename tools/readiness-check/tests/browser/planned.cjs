// Browser proof: "Planned, not done yet" and the honesty line (20 Nov 2026).
// Server: (cd tools && python3 -m http.server 8807 --bind 127.0.0.1). Run: node planned.cjs  (SP = screenshot folder)
const { chromium } = require('playwright'); const fs = require('fs'); const { execFileSync } = require('child_process');
const PORT = process.env.PORT || 8807, HOST = 'http://127.0.0.1:' + PORT;
const BASE = HOST + '/readiness-check/index.html', TEAM = HOST + '/readiness-check/team.html';
const SP = process.env.SP || require('os').tmpdir() + '/rc-planned'; fs.mkdirSync(SP, { recursive: true });
let pass = 0, fail = 0; const ok = (c, n) => { if (c) pass++; else { fail++; console.log('FAIL  ' + n); } };
const GOOD = 'Revenue manager, four hours weekly';
const HONEST = "Nobody checks your answers. A Yes that isn't true only hides a problem you will meet after signing.";
const ext = new Set();
async function mk(b, w, touch) {
  const ctx = await b.newContext({ viewport: { width: w, height: w > 500 ? 900 : 844 }, hasTouch: touch, isMobile: touch, acceptDownloads: true });
  await ctx.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  const p = await ctx.newPage(); p._errs = [];
  p.on('pageerror', e => p._errs.push(String(e)));
  p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|ERR_FAILED/.test(m.text())) p._errs.push(m.text()); });
  p.on('request', r => { const u = r.url(); if (!u.startsWith(HOST) && !u.startsWith('data:') && !u.startsWith('blob:')) ext.add(new URL(u).host); });
  return { ctx, p };
}
const noH = p => p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
const S = p => p.evaluate(() => ReadinessCheck.state());
const click = (p, id) => p.evaluate(i => document.getElementById(i).click(), id);
async function answerScreen(p, plan) {
  const qs = await p.evaluate(() => [...document.querySelectorAll('fieldset.qa')].map(f => ({ code: f.id.slice(3), gate: f.classList.contains('must'), items: f.querySelectorAll('.item').length })));
  for (const q of qs) {
    if (q.items) { for (let k = 0; k < q.items; k++) await click(p, `q-${q.code}_${k}-y`); continue; }
    let v = plan(q.code, q.gate); const extra = Array.isArray(v) ? v[1] : null; v = Array.isArray(v) ? v[0] : v;
    if (!(await p.$(`#q-${q.code}-${v}`))) v = 'k';
    await click(p, `q-${q.code}-${v}`);
    if (extra && v === 'y') await p.fill('#pf-' + q.code, extra);
    if (extra && v === 'pl') { await p.fill('#by-' + q.code, extra); await p.evaluate(c => document.getElementById('by-' + c).dispatchEvent(new Event('change', { bubbles: true })), q.code); }
  }
}
(async () => {
  const b = await chromium.launch();
  for (const [w, touch] of [[1280, false], [390, true]]) {
    const T = n => `[${w}] ${n}`;
    const { ctx, p } = await mk(b, w, touch);
    // ---- start screen: honesty line ----
    await p.goto(BASE);
    ok(await p.evaluate(h => { const e = document.getElementById('honest'); return e && e.textContent === h && e.classList.contains('meta') && e.closest('#hdr'); }, HONEST), T('start screen: honesty line, exact text, small (meta) in the intro'));
    ok(await noH(p), T('start screen: no horizontal scroll'));
    await p.screenshot({ path: `${SP}/${w}_start_top.png` });
    await p.selectOption('#h-type', 'independent'); await p.selectOption('#h-country', 'Portugal');
    await p.click('[data-act=pick][data-id="gx-2"]'); await p.check('#stage-choose', { force: true }); await p.click('#go-prep'); await p.click('#begin-top');
    let s = await S(p);
    ok(s.step === 'must', T('on the must-haves step'));
    ok(await p.evaluate(h => document.querySelector('.stephead .meta').textContent.endsWith(' ' + h) && !document.getElementById('honest'), HONEST), T('must-haves intro ends with the honesty line; the start-screen line is not repeated'));
    ok(await p.evaluate(h => document.body.innerText.split(h).length - 1 === 1, HONEST), T('honesty line shown once on the step, not on every question'));
    const codes = await p.evaluate(() => [...document.querySelectorAll('fieldset.qa.must')].map(f => f.id.slice(3)));
    const order = await p.evaluate(c => [...document.querySelectorAll('#fs-' + c + ' .opts label')].map(l => l.textContent.replace(/^✓ /, '')), codes[0]);
    ok(JSON.stringify(order.slice(0, 5)) === JSON.stringify(['Yes', 'Planned, not done yet', 'Partly', 'No', "Don't know yet"]), T('answer order Yes · Planned, not done yet · Partly · No · Don\'t know yet (' + order.join(' · ') + ')'));
    ok(await p.evaluate(() => [...document.querySelectorAll('fieldset.qa.must')].every(f => f.querySelector('input[value=pl]'))), T('Planned offered on every must-have'));
    // Next with nothing answered is still blocked.
    await p.click('#next'); s = await S(p);
    ok(s.step === 'must' && s.mustMissing, T('Next with nothing answered: stays, points to the first must-have'));
    const [c1, c2] = codes;
    const plan = (c, gate) => c === c1 ? ['pl', '2026-12-15'] : c === c2 ? ['pl', '2027-01-31'] : gate ? ['y', GOOD] : 'y';
    await answerScreen(p, plan);
    ok(await p.evaluate(c => { const f = document.getElementById('by-' + c); return f && f.type === 'date' && f.value === '2026-12-15' && /By when\? \(optional\)/.test(document.querySelector('label[for="by-' + c + '"]').textContent); }, c1), T('Planned shows the optional "By when?" date field, value kept after re-render'));
    ok(await p.evaluate(c => !document.getElementById('pf-' + c), c1), T('Planned asks no note'));
    const heights = await p.evaluate(c => [...document.querySelectorAll('#fs-' + c + ' .opts label')].map(l => l.getBoundingClientRect().height), c1);
    if (touch) ok(heights.every(h => h >= 44), T('answer targets at least 44 px (' + heights.map(Math.round).join(',') + ')'));
    ok(await noH(p), T('must-haves step with Planned: no horizontal scroll'));
    const rec0 = await p.evaluate(() => ReadinessCheck.record());
    ok(rec0.A[c1] === 'pl' && rec0.By[c1] === '2026-12-15' && rec0.By[c2] === '2027-01-31', T('stored: A = "pl", By = the two dates'));
    await p.evaluate(c => document.getElementById('fs-' + c).scrollIntoView({ block: 'start' }), c1);
    await p.screenshot({ path: `${SP}/${w}_must_planned.png` });
    // Changing away from Planned drops the date; back to Planned has an empty date field.
    await click(p, `q-${c2}-p`); let r1 = await p.evaluate(() => ReadinessCheck.record());
    ok(r1.A[c2] === 'p' && !(c2 in r1.By) && !(await p.$('#by-' + c2)), T('changing Planned to Partly removes the date and the field'));
    await click(p, `q-${c2}-pl`); await p.fill('#by-' + c2, '2027-01-31'); await p.evaluate(c => document.getElementById('by-' + c).dispatchEvent(new Event('change', { bubbles: true })), c2);
    // Planned counts as an answer: Next goes on.
    await p.click('#next'); s = await S(p);
    ok(s.step !== 'must' && !s.mustMissing, T('Planned counts as an answer: Next leaves the must-haves step (now ' + s.step + ')'));
    for (let i = 0; i < 8 && (await S(p)).step !== 'result'; i++) { await answerScreen(p, plan); await p.click('#next'); }
    await p.waitForSelector('#view[data-state=result]');
    const N = codes.length;
    const res = await p.evaluate(() => ({ v: document.getElementById('vsent').textContent, c: document.getElementById('count').textContent, top: document.getElementById('verdict').innerText, level: document.getElementById('verdict').dataset.level,
      first: [...document.querySelectorAll('.first li')].map(l => l.textContent), plan: [...document.querySelectorAll('#plan .agroup[data-group=must] li')].map(l => l.innerText), mustHead: (document.querySelector('#plan .agroup[data-group=must] p.meta') || {}).textContent,
      chips: [...document.querySelectorAll('[data-row=must] .chip')].map(c => c.textContent), mustRow: document.querySelector('[data-row=must] summary').textContent, mustBody: document.querySelector('[data-row=must] .foldbody').textContent, method: document.querySelector('[data-row=method] .foldbody').textContent }));
    ok(res.level === 'stop', T('verdict level stop'));
    ok(res.v === 'Not ready yet. 2 things are planned: finish them before you sign.', T('verdict sentence: ' + res.v));
    ok(res.c === (N - 2) + ' of ' + N + ' must-haves done · 2 planned', T('count line: ' + res.c));
    ok(!/not in place/i.test(res.top) && !/not in place/i.test(res.plan.join(' ') + res.mustHead + res.mustBody), T('no "not in place" in the result top, the must-have plan group or the must-haves list'));
    ok(res.plan.length === 2 && res.plan.some(t => /Finish: .*\(planned by 15 Dec 2026\)/.test(t)) && res.plan.some(t => /Finish: .*\(planned by 31 Jan 2027\)/.test(t)), T('action plan: "Finish: … (planned by …)" ×2'));
    ok(res.plan.every(t => /Planned: finish before you sign/.test(t)), T('action plan items say "Planned: finish before you sign"'));
    ok(res.first.filter(t => /Finish: /.test(t)).length === 2, T('"Do these first" leads with the two Finish items'));
    ok(res.chips.filter(c => c === 'Planned').length === 2 && /2 planned/.test(res.mustRow) && /Planned: finish before you sign \(you planned it by 15 Dec 2026\)/.test(res.mustBody), T('must-haves list: two "Planned" chips with "Planned: finish before you sign (you planned it by …)"'));
    ok(res.method.includes('“Planned, not done yet” counts like Partly: 1 point, and on a must-have it holds the verdict back until it is done.') && /New answer “Planned, not done yet”/.test(res.method), T('"How this was worked out": the Planned line and the CHANGES entry'));
    ok(await noH(p), T('result: no horizontal scroll'));
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.screenshot({ path: `${SP}/${w}_result_top.png` });
    // PDF
    const dlP = p.waitForEvent('download', { timeout: 30000 }); await p.click('[data-act=pdf]'); const dl = await dlP;
    const pdfPath = `${SP}/${w}_report.pdf`; await dl.saveAs(pdfPath);
    const txt = execFileSync('pdftotext', ['-layout', pdfPath, '-']).toString().replace(/\s+/g, ' ');
    ok(txt.includes('Not ready yet. 2 things are planned: finish them before you sign.') && txt.includes((N - 2) + ' of ' + N + ' must-haves done | 2 planned'), T('PDF: same verdict and count line'));
    ok(/Finish: .*\(planned by 15 Dec 2026\)/.test(txt) && /\[planned: finish before you sign, by 15 Dec 2026\]/.test(txt), T('PDF: Finish item with date and the must-have status'));
    ok(txt.includes('"Planned, not done yet" counts like Partly: 1 point, and on a must-have it holds the verdict back until it is done.'), T('PDF: the Planned line under "How this was worked out"'));
    ok(!/not in place/i.test(txt), T('PDF: no "not in place" anywhere (only planned must-haves open)'));
    // Save as file: dates in the JSON
    const dlJ = p.waitForEvent('download'); await p.click('[data-act=file]'); const dj = await dlJ; const jp = `${SP}/${w}_check.json`; await dj.saveAs(jp);
    const fj = JSON.parse(fs.readFileSync(jp, 'utf8'));
    ok(fj.kind === 'hftp-readiness-check' && fj.v === 3 && fj.check.By[c1] === '2026-12-15' && fj.check.A[c1] === 'pl', T('saved file: format unchanged (v 3), dates and Planned answers in it'));
    // Share (outside the hub: a test copy in this browser) → payload has plain date strings
    await p.click('[data-row=share] summary'); await p.click('#share-btn');
    await p.waitForFunction(() => ReadinessCheck.state().sharedAt);
    const shared = await p.evaluate(() => JSON.parse(localStorage.getItem('hftp-readiness-checks-v1')));
    const doc = Object.values(shared)[0];
    ok(doc && doc.by && doc.by[c1] === '2026-12-15' && doc.by[c2] === '2027-01-31' && Object.keys(doc.by).length === 2 && doc.answers[c1] === 'pl', T('share payload: by = { code: "YYYY-MM-DD" } for the two Planned answers'));
    // Reload
    await p.reload(); await p.waitForSelector('#view[data-state=result]');
    const after = await p.evaluate(() => ({ v: document.getElementById('vsent').textContent, c: document.getElementById('count').textContent, rec: ReadinessCheck.record(), plan: document.getElementById('plan').innerText }));
    ok(after.v === res.v && after.c === res.c && after.rec.By[c1] === '2026-12-15' && /planned by 31 Jan 2027/.test(after.plan), T('reload: same result, dates kept'));
    // Team page (same browser: reads the test copy)
    const tp = await ctx.newPage(); const terrs = []; tp.on('pageerror', e => terrs.push(String(e))); tp.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|ERR_FAILED/.test(m.text())) terrs.push(m.text()); });
    await tp.goto(TEAM); await tp.waitForFunction(() => window.ReadinessTeam && ReadinessTeam.state().phase === 'ready');
    const tt = await tp.evaluate(() => document.getElementById('view').innerText);
    ok(tt.includes('Not ready yet. 2 things are planned: finish them before you sign.') && tt.includes('2 planned') && /Planned: finish before you sign/.test(tt) && /by 15 Dec 2026/.test(tt) && /Finish: .*\(planned by 31 Jan 2027\)/.test(tt), T('team page: verdict, count, Planned status with its date, Finish item'));
    ok(!/Not in place/.test(tt.split('Every answer and its points')[0].split('Must-haves')[2] || ''), T('team page: no "Not in place" in the must-haves table'));
    ok(await tp.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), T('team page: no horizontal scroll'));
    ok(!terrs.length, T('team page: no console errors ' + terrs.join(' | ')));
    await tp.close();
    // Update open items: the Planned must-haves are open; Planned → Yes counts as now done
    await p.click('[data-act=review]'); await p.waitForSelector('#view[data-state=review]');
    ok(await p.evaluate(([a, c]) => !!document.querySelector('#fs-' + a + ' input[value=pl]:checked') && !!document.querySelector('#fs-' + c + ' input[value=pl]:checked') && /2 things are still holding the verdict back/.test(document.querySelector('#view h2').textContent), [c1, c2]), T('update open items: both Planned must-haves listed as open'));
    ok(await p.evaluate(c => !!document.getElementById('by-' + c) && document.getElementById('by-' + c).value === '2026-12-15', c1), T('update open items: the date field shows the saved date'));
    await click(p, `q-${c1}-y`); await p.fill('#pf-' + c1, GOOD);
    ok(await p.evaluate(c => !(c in ReadinessCheck.record().By), c1), T('Planned → Yes drops the date'));
    await p.click('[data-act=to-result]'); await p.waitForSelector('#view[data-state=result]');
    const r2 = await p.evaluate(() => ({ v: document.getElementById('vsent').textContent, c: document.getElementById('count').textContent, banner: (document.querySelector('.banner') || {}).textContent || '' }));
    ok(r2.v === 'Not ready yet. 1 thing is planned: finish it before you sign.' && r2.c === (N - 1) + ' of ' + N + ' must-haves done (was ' + (N - 2) + ') · 1 planned', T('after Planned → Yes: ' + r2.v + ' / ' + r2.c));
    ok(/1 must-have now done/.test(r2.banner), T('"since last time": the Planned → Yes must-have counts as now done'));
    // Mixed case on screen: one more must-have to No
    await p.click('[data-act=review]'); await p.waitForSelector('#view[data-state=review]');
    await p.click('[data-act=edit]'); await p.waitForSelector('#view[data-state=must]');
    await click(p, `q-${codes[2]}-n`); await p.click('#next');
    await p.evaluate(() => ReadinessCheck.send('result')); // not a FLOW event from an area step: use the review route instead
    if ((await S(p)).step !== 'result') { for (let i = 0; i < 8 && (await S(p)).step !== 'result'; i++) await p.click('#next'); }
    const r3 = await p.evaluate(() => ({ v: document.getElementById('vsent').textContent, c: document.getElementById('count').textContent }));
    ok(r3.v === 'Not ready yet. 1 thing to settle and 1 planned thing to finish before you sign.' && r3.c === (N - 2) + ' of ' + N + ' must-haves done (was ' + (N - 1) + ') · 1 planned · 1 not in place', T('mixed: ' + r3.v + ' / ' + r3.c));
    ok(!p._errs.length, T('no console errors ' + p._errs.join(' | ')));
    await ctx.close();
  }
  ok([...ext].every(h => /cdnjs|fonts\.(googleapis|gstatic)/.test(h)), 'no new network requests: only the fonts and PDF library the page already used (' + [...ext].join(', ') + ')');
  await b.close();
  console.log((fail ? 'FAILED' : 'ok') + ': ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
