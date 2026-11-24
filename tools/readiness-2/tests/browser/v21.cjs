// Browser proof for "Do you need AI?" v2.1 (24 Nov 2026): one block per High / Medium fault of the clean-up audit, the Low
// ones that need a browser, and each item of the council's BUILD NOW list; at 1280 and 390 px, standalone and inside the hub.
// Serve tools/ first:  python3 -m http.server 8817 --bind 127.0.0.1   (R2_BASE sets another address)
// Screenshots go to R2_SHOTS (default ./shots). Run:  node tools/readiness-2/tests/browser/v21.cjs
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const OUT = process.env.R2_SHOTS || path.join(__dirname, 'shots'), BASE = process.env.R2_BASE || 'http://127.0.0.1:8817/';
const FIX = process.env.R2_FIX || path.join(__dirname, '..', 'fixtures');
fs.mkdirSync(OUT, { recursive: true });
let pass = 0, fail = 0; const fails = [];
const ok = (c, n) => { if (c) pass++; else { fail++; fails.push(n); console.log('FAIL  ' + n); } };
const KEY = 'hftp-readiness2-v1', TEAM = 'hftp-readiness-checks-v1', TOOL = BASE + 'readiness-2/index.html';
async function mk(b, w, touch, opt) {
  opt = opt || {};
  const ctx = opt.ctx || await b.newContext({ viewport: { width: w, height: touch ? 844 : 900 }, hasTouch: touch, isMobile: touch, acceptDownloads: true });
  if (!opt.ctx) { await ctx.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {}); await ctx.route(/fonts\.(googleapis|gstatic)/, r => r.abort()); if (opt.init) await ctx.addInitScript(opt.init); }
  const p = await ctx.newPage(); p._errs = [];
  p.on('pageerror', e => p._errs.push(String(e)));
  p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|ERR_FAILED/.test(m.text())) p._errs.push(m.text()); });
  return { ctx, p };
}
const SEL = '#app button, #app label.opt, #app .tile, #app summary, #app a.btn, #app input[type=date], #app label.uc, #app select, #app input[type=text], #app label.filebtn, #app label.chk';
const noH = f => f.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
const small = f => f.evaluate(sel => [...document.querySelectorAll(sel)].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 43.5; }).map(e => (e.id || e.textContent.trim().slice(0, 30)) + ':' + Math.round(e.getBoundingClientRect().height)), SEL);
async function check(f, tag) { ok(await noH(f), tag + ': no horizontal scroll'); const s = await small(f); ok(s.length === 0, tag + ': 44 px targets ' + s.join(', ')); }
const state = f => f.evaluate(() => window.Readiness2.state());
const text = (f, sel) => f.evaluate(s => { const e = document.querySelector(s); return e ? e.textContent : null; }, sel);
const teamIds = f => f.evaluate(k => Object.keys(JSON.parse(localStorage.getItem(k) || '{}')), TEAM);
async function shot(p, name, f) {
  if (f && f !== p) { const h = await f.evaluate(() => document.documentElement.scrollHeight); const vp = p.viewportSize(); await p.setViewportSize({ width: vp.width, height: Math.min(h + 120, 7000) }); await p.screenshot({ path: `${OUT}/${name}.png` }); await p.setViewportSize(vp); }
  else await p.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
}
const DEPT_AREA = { rm: 'Commercial', res: 'Commercial', sm: 'Commercial', fo: 'Guest-facing', gx: 'Guest-facing', fb: 'Guest-facing', hk: 'Operational', me: 'Operational', kc: 'Operational', pr: 'Operational', fa: 'Administrative', hr: 'Administrative', gm: 'Administrative', it: 'Administrative', lg: 'Administrative' };
/* Walk one check to its end through the page's own events (the same ones the controls send). plan: { use, Q, must, tail, name, stopAt } */
async function fill(f, plan) {
  return f.evaluate(({ plan, area }) => {
    const R = window.Readiness2, s = (e, a) => R.send(e, a);
    if (R.state().step === 'start') s('begin');
    if (R.state().step === 'hotel') { s('hotel', { k: 'type', v: 'independent' }); s('hotel', { k: 'name', v: plan.name || 'Hotel Alpenblick' }); s('hotel', { k: 'role', v: 'gm' }); s('hotel', { k: 'country', v: 'France' }); s('next'); }
    ['q1', 'q2', 'q3', 'q4', 'q5'].forEach((q, i) => s('answer', { id: q, value: (plan.Q && plan.Q[i]) || 'y' })); s('next');
    if (R.state().step !== 'must') return R.state().step;
    ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10'].forEach((m, i) => s('answer', { id: m, value: (plan.must && plan.must[i]) || 'y' }));
    if (plan.stopAt === 'must') return 'must';
    s('next');
    if (plan.use === 'none') { s('use', 'none'); s('next'); return R.state().step; }
    const d = plan.use.split('-')[0]; s('cat', area[d]); s('dept', d); s('use', plan.use);
    if (plan.stopAt === 'where') return 'where';
    s('next');
    R.state().tailored.forEach((t, i) => s('answer', { id: t, value: (plan.tail && plan.tail[i]) || 'y' }));
    if (plan.stopAt === 'tailored') return 'tailored';
    s('next'); return R.state().step;
  }, { plan, area: DEPT_AREA });
}
async function hubFrame(p, tool) { await p.waitForSelector(`#hubFrame iframe[title="${tool}"]`); const h = await p.$(`#hubFrame iframe[title="${tool}"]`); const f = await h.contentFrame(); await f.waitForFunction(() => window.Readiness2 || window.Register || window.ReadinessTeam || document.readyState === 'complete'); return f; }
async function openHubTool(p) { await p.goto(BASE + 'index.html'); await p.click('#hubBar button[data-tool="readiness-2"]'); const f = await hubFrame(p, 'readiness-2'); await f.waitForFunction(() => window.Readiness2 && window.Readiness2.state().inHub === true, null, { timeout: 15000 }); return f; }
const share = async f => { await f.evaluate(() => { const d = document.querySelector('details[data-fold="share"]'); if (!d.open) d.querySelector('summary').click(); }); await f.click('#share-btn'); await f.waitForFunction(() => window.Readiness2.state().sharedAt && window.Readiness2.state().share === 'shared', null, { timeout: 15000 }); };
/* In-app Back goes through the browser's history (popstate is asynchronous): one step at a time, as a person would. */
async function backTo(f, step) { for (let i = 0; i < 9; i++) { if ((await state(f)).step === step) { await f.waitForTimeout(120); if ((await state(f)).step === step) return true; } await f.evaluate(() => window.Readiness2.send('back')); await f.waitForTimeout(140); } return (await state(f)).step === step; }
const allText = f => f.evaluate(() => { document.querySelectorAll('#view details').forEach(d => { d.open = true; }); return document.querySelector('#app').textContent; });

(async () => {
  const b = await chromium.launch({ args: ['--disable-features=LocalNetworkAccessChecks,PrivateNetworkAccessRespectPreflightResults'] });
  for (const [w, touch, wtag] of [[1280, false, 'desktop'], [390, true, 'phone']]) {
    // =================================================================================================================
    // The four result cases (H2, council items 1, 2, 3, 4, 6, 7; B2, B5, M6), standalone and in the hub, with screenshots
    // =================================================================================================================
    const CASES = [
      { key: 'must-no', plan: { use: 'gx-2', must: ['y', 'y', 'y', 'y', 'y', 'y', 'y', 'y', 'n', 'y'] }, level: 'notready', head: 'Not ready yet', score: /^Score: 94%$/, reason: 'Because 1 must-have is missing: Rules for staff on AI tools. A missing must-have outweighs the score.' },
      { key: 'dont-know', plan: { use: 'none', must: ['y', 'y', 'y', 'y', 'k', 'k', 'k', 'k', 'k', 'k'] }, level: 'noinfo', head: 'Not enough information yet', score: /^No score yet: you answered 4 of 10 questions\.$/, reason: 'Because more than half the questions are still “Don’t know yet” (6 of 10).' },
      { key: 'hr-high-risk', plan: { use: 'hr-2' }, level: 'almost', head: 'Almost ready', score: /^Score: 100%$/, reason: 'Because this use has legal items to check first (the “EU AI Act” part of this result lists them). This tool cannot check them, so it does not give the top verdict for this use.' },
      { key: 'none-fits', plan: { use: 'none' }, level: 'ready', head: 'Ready to start a pilot', score: /^Score: 100%$/, reason: 'Because every must-have is Yes, the score is 75% or more, and fewer than a quarter of the questions are “Don’t know yet”.' }
    ];
    for (const where of ['alone', 'hub']) {
      for (const c of CASES) {
        const tag = wtag + ' ' + where + ' ' + c.key, { ctx, p } = await mk(b, w, touch);
        let f = p; if (where === 'hub') f = await openHubTool(p); else await p.goto(TOOL);
        ok(await fill(f, c.plan) === 'result', tag + ': walked to the result');
        const s = await state(f), m = await f.evaluate(() => window.Readiness2.resultModel());
        ok(s.level === c.level && (await text(f, '#level-name')) === c.head, tag + ': headline "' + c.head + '" (got ' + await text(f, '#level-name') + ')');
        ok(c.score.test(await text(f, '#score')) && (await text(f, '#score')) === m.scoreHead, tag + ': the score reads ' + await text(f, '#score'));
        ok((await text(f, '#reason')) === c.reason, tag + ': the reason under the verdict: ' + await text(f, '#reason'));
        const order = await f.evaluate(() => ['level-name', 'reason', 'score', 'level-line', 'must-line'].map(id => Math.round(document.getElementById(id).getBoundingClientRect().top)));
        ok(order.every((y, i) => i === 0 || y >= order[i - 1]), tag + ': verdict, reason, score, line, must-haves in this order ' + order);
        const view = await allText(f);
        ok(!/\d+% ready/.test(view) && !/readiness score/i.test(view), tag + ': "% ready" is nowhere on the result, folds open');
        ok(!/[A-Z]{3}-\d{3}-\d{2}/.test(view) && !/evidence pack/i.test(view), tag + ': no evidence id or pack name on the result');
        ok((await text(f, '#areas h2')) === 'What is in place, by area' && (await f.$$eval('#areas .brow .pct', e => e.map(x => x.textContent))).every(t => /^\d+ of \d+$/.test(t)) && !/%/.test(await text(f, '#areas .bars')), tag + ': areas as counts, no percentage');
        const clipped = await f.evaluate(() => [...document.querySelectorAll('#areas .brow .pct, #areas .brow .word, #score, #reason')].filter(e => e.scrollWidth > e.clientWidth + 1).map(e => e.textContent));
        ok(clipped.length === 0, tag + ': nothing is cut off in the head or the area rows ' + clipped.join(' | '));
        const pdf = await f.evaluate(() => window.Readiness2.pdfModel().blocks.map(x => x.t || '').join('\n')), sum = await f.evaluate(() => window.Readiness2.summaryText());
        const one = c.head + ' · ' + m.scoreHead;
        ok(pdf.includes(one) && sum.includes(one) && pdf.includes(c.reason) && sum.includes(c.reason), tag + ': the PDF and the copy text read the same string: ' + one);
        ok((await text(f, '#mychecks .mycheck .meta')).includes(one.replace(/\.$/, '')), tag + ': "Your checks" reads the same string');
        if (c.key === 'hr-high-risk') {
          ok((await text(f, '#law')) === 'This score does not cover the law. This use has legal items to check first (see “EU AI Act” below). Do not start a pilot before a named person has checked them.', tag + ': item 7: the law line');
          ok((await text(f, '#legal-label')) === 'High-risk' && (await f.$$('#legal-items li')).length >= 10 && (await f.getAttribute('#reason', 'data-held')) === 'legal', tag + ': B5: high-risk label and its items are there; the top verdict is held');
          ok((await text(f, '#level-line')) === 'Your answers would otherwise allow a start. Settle what is named above before you sign anything.', tag + ': the line under a held verdict');
        } else ok(!(await f.$('#law')), tag + ': no law line');
        if (c.key === 'none-fits') ok((await text(f, '#level-line')) === 'Every must-have is in place. No use case was chosen, so nothing else was checked.' && /must-haves only/.test(await text(f, '#must-only')), tag + ': M6: no "this use case" in the line');
        if (c.key === 'dont-know') ok(!(await f.evaluate(() => /%/.test(document.querySelector('#result').textContent))) && (await f.getAttribute('#result', 'data-pct')) === '', tag + ': item 2: no percentage in the head');
        if (c.key === 'must-no') ok((await text(f, '#score-sub')).startsWith('34 of 36 points on the 18 questions you answered. Your own answers; nobody checked them.'), tag + ': item 1: points and counts next to the score');
        ok((await f.$$eval('#method li', e => e.map(x => x.textContent))).filter(t => /^Team judgement: /.test(t)).length === 3, tag + ': the three team judgements are listed under "How this was worked out"');
        await f.evaluate(() => { document.querySelectorAll('#view details').forEach(d => { d.open = false; }); window.scrollTo(0, 0); });
        await check(f, tag);
        if (where === 'alone') await shot(p, (w === 1280 ? '' : 'phone-') + 'v21-' + c.key);
        else if (w === 1280) await shot(p, 'hub-v21-' + c.key, f);
        ok(p._errs.length === 0, tag + ': no console errors ' + p._errs.join('|'));
        await ctx.close();
      }
    }

    // =================================================================================================================
    // Council items 1, 5, 9, 8 on the steps; B6; L13
    // =================================================================================================================
    {
      const { ctx, p } = await mk(b, w, touch); await p.goto(TOOL);
      ok((await text(p, '#get-score')) === 'A verdict and a score: one of four verdicts, and the share of points from your own answers, with how both were worked out.', wtag + ': item 1: cover bullet');
      ok((await p.getAttribute('#cover-range', 'data-min')) === '6' && (await p.getAttribute('#cover-range', 'data-max')) === '9' && /^Six to nine questions/.test(await text(p, '#cover-range')), wtag + ': L13: the cover\'s range is the data\'s (six to nine)');
      ok(await p.evaluate(() => { const D = JSON.parse(document.getElementById('r2-data').textContent), n = Object.values(D.tq.uses).map(u => u.qs.length); return Math.min(...n) === 6 && Math.max(...n) === 9; }), wtag + ': L13: min and max in the page data');
      ok(!/every AI project/.test(await text(p, '#view')), wtag + ': item 5: the cover no longer says "every AI project needs"');
      await fill(p, { use: 'gx-2', Q: ['y', 'y', 'n', 'y', 'y'], stopAt: 'must' });
      ok((await text(p, '#must-intro')).startsWith('Ten things to have in place before an AI project starts. Think of the project you have in mind. Under each one you can see how many of the 90 use cases in the team’s analysis need it.'), wtag + ': item 5: step 3 intro');
      await p.click('details[data-fold="src-must"] > summary');
      ok(/The analysis covers 90 of the catalogue’s 99 use cases: 8 were added to the catalogue later \(their questions are drafts\), and “AI use policies and governance” is a document, not a tool/.test(await text(p, '.sources')) && /the team’s earlier readiness check/.test(await text(p, '.sources')), wtag + ': L13 + L8: the sources note says why 90 is not 99');
      await check(p, wtag + ' must');
      await p.evaluate(() => { const R = window.Readiness2; R.send('next'); R.send('cat', 'Guest-facing'); R.send('dept', 'gx'); R.send('use', 'gx-2'); R.send('next'); });
      ok((await text(p, '#tail-today')) === 'Answer for today. If something can only exist once the tool is running (for example its conversation logs), choose “Planned, not done yet”.', wtag + ': item 9: step 5 intro');
      const qs = await p.$$eval('#view fieldset.qa .qtext', e => e.map(x => x.textContent));
      ok(qs.includes('Is it agreed how you will tell guests they are dealing with AI?') && qs.includes('Are there written rules for when the tool passes a guest to a staff member?') /* v2.2: the team's plain wording */ && !qs.some(q => /^Has this been done: tell|, and also .*\?$/.test(q) && !/ and .*, and also /.test(q)), wtag + ': item 10: the reworded questions are on the page');
      const t5 = await allText(p);
      ok(/Based on \d+ entr(y|ies) in the team’s research record \(not yet published\)\./.test(t5) && !/[A-Z]{3}-\d{3}-\d{2}/.test(t5) && !/evidence pack/i.test(t5), wtag + ': item 8 / M8: step 5 with every fold open shows a plain evidence line, no ids');
      await check(p, wtag + ' tailored');
      // M8 over all 99 use cases, through the page's own function
      const bad = await p.evaluate(() => { const D = JSON.parse(document.getElementById('r2-data').textContent), out = []; Object.keys(D.tq.uses).forEach(id => D.tq.uses[id].qs.forEach(q => { const t = window.R2Logic.tailWhy(D.tq, id, q).join(' '); if (/[A-Z]{3}-\d{3}-\d{2}/.test(t)) out.push(id); })); return out; });
      ok(bad.length === 0, wtag + ': M8: no evidence id in any "Why this matters" fold of the 99 use cases ' + bad.slice(0, 3));
      // B6: the No on question 3 holds the top verdict
      await p.evaluate(() => { const R = window.Readiness2; R.state().tailored.forEach(t => R.send('answer', { id: t, value: 'y' })); R.send('next'); });
      let s = await state(p);
      ok(s.step === 'result' && s.level === 'almost' && s.held.join() === 'carried' && (await text(p, '#reason')) === 'Because you answered No in step 2 to “Information ready” (Fix the data first). The top verdict is held back until that is settled.', wtag + ': B6: a No carried from step 2 blocks the top verdict, with the reason shown');
      ok((await text(p, '#ai-head')) === 'Fix the data first.' && (await text(p, '#level-name')) === 'Almost ready', wtag + ': B6: "Fix the data first." no longer stands beside "Ready to start a pilot"');
      // print: the folds open for printing and close again
      await p.evaluate(() => window.dispatchEvent(new Event('beforeprint')));
      ok(await p.evaluate(() => [...document.querySelectorAll('#view details.fold')].every(d => d.open) && document.querySelectorAll('#view details.fold').length >= 4), wtag + ': print: every fold of the result is open while printing');
      await p.emulateMedia({ media: 'print' });
      ok(await p.evaluate(() => ['#vendor-list', '#legal-items', '#method', '#answers .arow'].every(sel => { const e = document.querySelector(sel); return e && e.getBoundingClientRect().height > 0; })), wtag + ': print: vendor questions, AI Act items, the answers and the working-out are laid out for print');
      await p.emulateMedia({ media: 'screen' }); await p.evaluate(() => window.dispatchEvent(new Event('afterprint'))); await p.waitForTimeout(50);
      ok(await p.evaluate(() => [...document.querySelectorAll('#view details.fold')].every(d => !d.open)), wtag + ': print: and closed again afterwards');
      ok(p._errs.length === 0, wtag + ': steps: no console errors ' + p._errs.join('|')); await ctx.close();
    }

    // =================================================================================================================
    // H1: a shared copy can be withdrawn from any step, from the stop screen, from "Your checks", and on removal
    // =================================================================================================================
    for (const where of ['alone', 'hub']) {
      const tag = wtag + ' ' + where, { ctx, p } = await mk(b, w, touch);
      let f = p; if (where === 'hub') f = await openHubTool(p); else await p.goto(TOOL);
      await fill(f, { use: 'gx-2' }); await share(f);
      let s = await state(f); const id = s.id;
      ok((await teamIds(f)).join() === id && s.level === 'ready' && s.pct === 100, tag + ' H1: shared on the result (the team holds "Ready, 100%")');
      ok(await f.isVisible('#unshare') && (await f.$$('#unshare')).length === 1, tag + ' H1: one withdraw button on the result');
      // change answers from the start → Q1 No → stop
      await f.click('#edit'); s = await state(f); ok(s.step === 'q' && await f.isVisible('#shared-line') && await f.isVisible('#unshare'), tag + ' H1: on step 2 the shared line and its withdraw button are there');
      await check(f, tag + ' H1 step 2');
      await f.click('label[for="a-q1-n"]'); await f.click('#next'); s = await state(f);
      ok(s.step === 'stop' && /The team still has your earlier result \(shared \d+ \w+ \d{4}\)\. Withdraw it, or change your answers and send an updated copy from the result\./.test(await text(f, '#shared-line')) && await f.isVisible('#unshare'), tag + ' H1: the stop screen says the team still has the earlier result and offers to withdraw it');
      await check(f, tag + ' H1 stop'); if (w === 1280 && where === 'alone') await shot(p, 'v21-stop-shared');
      await f.click('#unshare'); await f.waitForFunction(() => !window.Readiness2.state().sharedAt);
      ok((await teamIds(f)).length === 0 && !(await f.$('#shared-line')) && /Shared copy withdrawn/.test(await text(f, '#toast')), tag + ' H1: withdrawn from the stop screen: the team store is empty, sharedAt is null');
      // from every other step
      await f.click('#change'); await f.click('label[for="a-q1-y"]'); await f.evaluate(() => { const R = window.Readiness2; R.send('next'); R.send('next'); R.send('next'); R.send('next'); }); await share(f);
      for (const n of ['tailored', 'where', 'must', 'hotel']) {
        await backTo(f, n);
        ok((await state(f)).step === n && await f.isVisible('#unshare'), tag + ' H1: withdraw button on step "' + n + '"');
      }
      await backTo(f, 'start');
      ok((await state(f)).step === 'start' && await f.isVisible('#unshare-' + id) && /shared with the team \d+ \w+ \d{4}/.test(await text(f, '.mycheck[data-check="' + id + '"] .meta')), tag + ' H1: on the cover the check\'s row shows "shared with the team" and a withdraw button');
      await check(f, tag + ' H1 cover');
      // remove a shared check with the new button: no copy left
      await f.click('.mycheck[data-check="' + id + '"] [data-act="remove"]');
      ok(await f.isVisible('#rm-withdraw') && (await text(f, '#rm-withdraw')) === 'Withdraw the shared copy and remove' && (await text(f, '#rm-yes')) === 'Remove from this browser only' && !/from its result page/.test(await text(f, '#mychecks')), tag + ' H1: the remove dialog has a real button; the dead-end sentence is gone');
      await check(f, tag + ' H1 remove dialog'); if (w === 1280 && where === 'alone') await shot(p, 'v21-remove-shared');
      await f.dblclick('#rm-withdraw'); await f.waitForFunction(i => !window.Readiness2.store().checks[i], id);
      ok((await teamIds(f)).length === 0 && (await state(f)).checks.length === 0 && /Shared copy withdrawn and check removed/.test(await text(f, '#toast')), tag + ' H1: "Withdraw the shared copy and remove" leaves 0 copies with the team (double-click: once)');
      // another check's copy, withdrawn from the list while a different check is open
      await fill(f, { use: 'rm-1' }); await share(f); const id2 = (await state(f)).id;
      await f.evaluate(() => { const R = window.Readiness2; for (let i = 0; i < 6 && R.state().step !== 'result'; i++) R.send('next'); });
      await f.click('#new-check'); await fill(f, { use: 'gx-1', stopAt: 'must' }); await backTo(f, 'start');
      await f.click('#unshare-' + id2); await f.waitForFunction(i => !window.Readiness2.store().checks[i].sharedAt, id2);
      ok((await teamIds(f)).length === 0 && (await state(f)).id !== id2, tag + ' H1: a copy of another check is withdrawn from "Your checks" without opening it');
      ok(p._errs.length === 0, tag + ' H1: no console errors ' + p._errs.join('|')); await ctx.close();
    }

    // =================================================================================================================
    // M2: a share that finishes while another check is open is still recorded against its own check
    // =================================================================================================================
    {
      const { ctx, p } = await mk(b, w, touch); await p.goto(TOOL);
      await fill(p, { use: 'rm-1' }); const first = (await state(p)).id; await p.click('#new-check'); await fill(p, { use: 'gx-2' }); const second = (await state(p)).id;
      await p.evaluate(() => { const S = window.RCStore, save = S.save; S.save = function (id, doc) { return new Promise(res => setTimeout(res, 1500)).then(() => save(id, doc)); }; });
      await p.evaluate(() => { document.querySelector('details[data-fold="share"] summary').click(); }); await p.click('#share-btn');
      ok((await state(p)).share === 'sending', wtag + ' M2: sending (slowed to 1.5 s)');
      await p.click('.mycheck[data-check="' + first + '"] [data-act="open"]'); ok((await state(p)).id === first, wtag + ' M2: another check is opened before the share finishes');
      await p.waitForFunction(i => window.Readiness2.store().checks[i].sharedAt, second, { timeout: 8000 });
      ok((await teamIds(p)).join() === second, wtag + ' M2: the copy reached the team store');
      ok(await p.isVisible('#unshare-' + second) && /shared with the team/.test(await text(p, '.mycheck[data-check="' + second + '"] .meta')), wtag + ' M2: the check knows: its row shows it as shared, with a withdraw button');
      await p.click('.mycheck[data-check="' + second + '"] [data-act="open"]'); const s = await state(p);
      ok(s.id === second && s.sharedAt && s.share === 'shared' && await p.isVisible('#unshare') && (await text(p, '#share-btn')) === 'Send updated copy', wtag + ' M2: back on the check: sharedAt set, "Send updated copy" and the withdraw button are there');
      await p.reload(); ok((await state(p)).sharedAt, wtag + ' M2: and it was saved');
      ok(p._errs.length === 0, wtag + ' M2: no console errors ' + p._errs.join('|')); await ctx.close();
    }

    // =================================================================================================================
    // M1: "Since last time" never compares two use cases; v2.0 history is marked
    // =================================================================================================================
    {
      const { ctx, p } = await mk(b, w, touch); await p.goto(TOOL);
      await fill(p, { use: 'rm-1' }); ok((await state(p)).pct === 100 && !(await p.$('#since')), wtag + ' M1: rm-1 at 100%, first visit: no panel');
      await backTo(p, 'where'); await p.evaluate(() => { const R = window.Readiness2; R.send('use', 'rm-2'); R.send('next'); R.state().tailored.forEach(t => R.send('answer', { id: t, value: 'n' })); R.send('next'); });
      let s = await state(p); ok(s.step === 'result' && s.use === 'rm-2' && s.snaps === 2 && !(await p.$('#since')), wtag + ' M1: switched to rm-2 with No answers: no "Since last time" (it compared 100% with 55%)');
      await backTo(p, 'where'); await p.evaluate(() => { const R = window.Readiness2; R.send('use', 'rm-1'); R.send('next'); R.state().tailored.forEach((t, i) => R.send('answer', { id: t, value: i ? 'y' : 'p' })); R.send('next'); });
      s = await state(p); const since = await text(p, '#since');
      ok(s.use === 'rm-1' && s.snaps === 3 && /Since last time/.test(since) && /Score: 100% → 96%\./.test(since) && !/55|rm-2/.test(since), wtag + ' M1: back on rm-1 with one answer changed: the two rm-1 results are compared: ' + (since || '').replace(/\s+/g, ' ').slice(0, 120));
      await share(p); const doc = await p.evaluate(k => Object.values(JSON.parse(localStorage.getItem(k)))[0], TEAM);
      ok(doc.snaps.length === 2 && doc.snaps.every(x => x.rules === 'v2.1 (24 Nov 2026)') && doc.kind === 'dyn' && doc.v === 2 && doc.rules === 'v2.1 (24 Nov 2026)' && /^Because /.test(doc.reason), wtag + ' M1: only the rm-1 history goes to the team; the copy keeps its shape (kind dyn, v 2)');
      await ctx.close();
    }
    {
      // records saved by the v2.0 build
      const fixture = fs.readFileSync(path.join(FIX, 'v2.0-store.json'), 'utf8'), other = JSON.parse(fs.readFileSync(path.join(FIX, 'v2.0-other-keys.json'), 'utf8'));
      const { ctx, p } = await mk(b, w, touch, { init: `if (!localStorage.getItem('fx-done')) { localStorage.setItem('fx-done', '1'); localStorage.setItem(${JSON.stringify(KEY)}, ${JSON.stringify(fixture)}); localStorage.setItem(${JSON.stringify(TEAM)}, ${JSON.stringify(other[TEAM])}); }` });
      await p.goto(TOOL); let s = await state(p);
      ok(s.checks.length === 5 && s.storage === 'ok' && !s.notice && !s.corrupt, wtag + ' v2.0 store: opens, five checks listed, no warning');
      const rm1 = Object.values(JSON.parse(fixture).checks).find(c => c.use === 'rm-1').id;
      const all = JSON.parse(fixture).checks, stopId = Object.values(all).find(c => c.step === 'stop').id, mustId = Object.values(all).find(c => c.step === 'must').id;
      ok(s.id === stopId && s.step === 'stop', wtag + ' v2.0 store: the check that was open (stopped at question 1) is open again, on the stop screen');
      await p.click('#change'); await backTo(p, 'start');
      await p.click('.mycheck[data-check="' + rm1 + '"] [data-act="open"]');
      s = await state(p); const since = (await text(p, '#since') || '').replace(/\s+/g, ' ');
      ok(s.step === 'result' && s.use === 'rm-1' && s.A.m8 === 'n' && s.By.m3 === '2027-03-01' && s.T.te1 === 'na' && s.sharedAt, wtag + ' v2.0 check: opens on its result with its answers, date and share state');
      ok(s.level === 'notready' && /^Score: \d+%$/.test(await text(p, '#score')) && /^Because 1 must-have is missing: Staff told, and able to report errors\./.test(await text(p, '#reason')), wtag + ' v2.0 check: worked out with rules v2.1: ' + await text(p, '#score'));
      ok(/Your earlier result \(24 Nov 2026\)/.test(since) && /It was worked out with earlier rules \(v2 \(24 Nov 2026\)\), so it is not compared line by line with today’s\./.test(since) && !/→/.test(since), wtag + ' v2.0 history: marked "worked out with earlier rules", not compared line by line: ' + since.slice(0, 140));
      ok(await p.isVisible('#unshare') && /out of date/.test(await text(p, '#share summary')) === false, wtag + ' v2.0 share: still shared, can be withdrawn');
      await check(p, wtag + ' v2.0 result'); if (w === 1280) await shot(p, 'v21-from-v2.0');
      // the stopped and the unfinished checks of the fixture
      await p.click('.mycheck[data-check="' + mustId + '"] [data-act="open"]'); s = await state(p); ok(s.step === 'must' && s.A.m2 === 'p' && s.Q.q2 === 'n', wtag + ' v2.0 unfinished check: back on step 3 with its answers');
      // the v2.0 file opens in a fresh browser as "not shared" (L11)
      const o = await mk(b, w, touch); await o.p.goto(TOOL);
      await o.p.setInputFiles('#file-open', path.join(FIX, 'v2.0-file.json')); await o.p.waitForFunction(() => window.Readiness2.state().step === 'result');
      s = await state(o.p); ok(s.use === 'rm-1' && !s.sharedAt && s.share === 'idle' && !/shared \d/.test(await text(o.p, '#share summary')) && s.By.m3 === '2027-03-01', wtag + ' L11 / v2.0 file: opens with every answer and reads "not shared" in a browser that never shared');
      const fd = await o.p.evaluate(() => window.Readiness2.fileDoc()); ok(fd.check.sharedAt === null && fd.check.sharedSig === null && fd.kind === 'hftp-do-you-need-ai' && fd.v === 2 && fd.rules === 'v2.1 (24 Nov 2026)', wtag + ' L11: a file saved now carries no share fields');
      // the team page: the v2.0 copy is listed and marked, and a copy with an unknown use case is listed too (M7)
      await p.evaluate(k => { const o2 = JSON.parse(localStorage.getItem(k)), a = Object.values(o2)[0]; o2.gone1 = Object.assign({}, a, { useId: 'zz-9', useName: 'A use case that was removed', sharedAt: '2026-11-24T08:00:00.000Z' }); localStorage.setItem(k, JSON.stringify(o2)); }, TEAM);
      const t = await mk(b, w, touch, { ctx }); await t.p.goto(BASE + 'readiness-check/team.html'); await t.p.waitForFunction(() => window.ReadinessTeam && window.ReadinessTeam.state().phase !== 'loading');
      const ts = await t.p.evaluate(() => window.ReadinessTeam.state()), tv = (await t.p.textContent('#view')).replace(/\s+/g, ' ');
      ok(ts.count === 2 && ts.old === 0 && /2 shared .*· 1 whose use case is no longer in the catalogue/.test(tv) && !/old v2 format/.test(tv), wtag + ' M7b: a copy with an unknown use id is listed and counted as "no longer in the catalogue", not as "old v2 format"');
      ok(/A use case that was removed \(no longer in the catalogue\)/.test(tv) && (await t.p.$$('.sub-row[data-gone="1"]')).length === 1, wtag + ' M7b: its row says so, with the level the hotel saw');
      const card = (await t.p.textContent('#flowcard')).replace(/\s+/g, ' ');
      ok(/Do you need AI\? \(rules v2\.1 \(24 Nov 2026\)\)/.test(card) && /shown as “Score: n%” with the points and the number of questions answered next to it, never as “% ready”/.test(card) && /No score is shown under “Not enough information yet”/.test(card) && /Don't know yet 0 \(team judgement\)/.test(card), wtag + ' M7a: the rules card describes the new score honestly');
      ok(/Earlier Readiness check \(rules v4/.test(card) && /No 0–100 score\./.test(card) && card.indexOf('Do you need AI? (rules') < card.indexOf('Earlier Readiness check (rules'), wtag + ' M7a: and the old checks, under their own heading ("No 0–100 score" now only there)');
      await t.p.click('.sub-row:not([data-gone])'); const dv = (await t.p.textContent('#view')).replace(/\s+/g, ' ');
      ok(/made with rules v2 \(24 Nov 2026\) \(earlier rules\); recomputed here with rules v2\.1/.test(dv) && /^Score: \d+%$/.test(await t.p.textContent('#dyn-score')) && /^Because 1 must-have is missing/.test(await t.p.textContent('#dyn-reason')) && /The hotel saw \(rules v2 \(24 Nov 2026\)\): Not ready yet, Score: \d+%\./.test(dv), wtag + ' M7: a v2.0 copy is recomputed with rules v2.1 and says what the hotel saw');
      ok(/Research record entries behind this use case’s questions \(team only, not shown to hotels\): [A-Z]{3}-\d{3}-\d{2}/.test(dv) && /0 \/ 2 \(don’t know yet\)/.test(dv) && !/\d+% ready/.test(dv), wtag + ' item 8: the ids are on the Team tab only; "Don\'t know yet" shows as 0 / 2');
      await t.p.click('.sub-row[data-gone="1"]'); ok(/is no longer in the catalogue, so the copy cannot be recomputed\. What the hotel saw when it shared: Not ready yet, Score: \d+%/.test((await t.p.textContent('#gone')).replace(/\s+/g, ' ')) && await t.p.isVisible('#del'), wtag + ' M7b: its detail shows what the hotel saw and can be deleted');
      ok(await noH(t.p), wtag + ' team: no horizontal scroll'); if (w === 1280) await shot(t.p, 'v21-team');
      ok(t.p._errs.length === 0 && p._errs.length === 0 && o.p._errs.length === 0, wtag + ' v2.0 / team: no console errors ' + t.p._errs.concat(p._errs, o.p._errs).join('|'));
      await o.ctx.close(); await ctx.close();
    }

    // =================================================================================================================
    // M3: two tabs of one browser
    // =================================================================================================================
    {
      const { ctx, p: A } = await mk(b, w, touch); await A.goto(TOOL); await fill(A, { use: 'rm-1', stopAt: 'tailored' });
      const idA = (await state(A)).id; const { p: B } = await mk(b, w, touch, { ctx }); await B.goto(TOOL);
      ok((await state(B)).id === idA && (await state(B)).step === 'tailored', wtag + ' M3: a second tab opens the same check');
      await B.click('#new-top'); await A.waitForTimeout(250);
      let sa = await state(A); ok(sa.id === idA && sa.step === 'tailored' && sa.use === 'rm-1' && !sa.elsewhere && !(await A.$('#elsewhere')), wtag + ' M3: tab B starts a new check → tab A stays on step 5 of rm-1, without a message');
      await fill(B, { use: 'gx-2', stopAt: 'must' }); const idB = (await state(B)).id; await A.waitForTimeout(250);
      sa = await state(A); let sb = await state(B);
      ok(sa.id === idA && sa.step === 'tailored' && sb.id === idB && sb.step === 'must', wtag + ' M3: B walks to step 3 and A does not follow');
      ok(sa.checks.slice().sort().join() === [idA, idB].sort().join() && sb.checks.slice().sort().join() === [idA, idB].sort().join(), wtag + ' M3: both checks are listed in both tabs');
      await A.evaluate(() => window.Readiness2.send('answer', { id: window.Readiness2.state().tailored[0], value: 'y' })); await B.waitForTimeout(250);
      ok((await B.evaluate(i => window.Readiness2.store().checks[i].T, idA)).pe1 === 'y' && (await state(B)).id === idB, wtag + ' M3: A\'s answer reaches B\'s copy of that check; B stays on its own');
      await A.reload(); await B.reload(); ok((await state(A)).id === idA && (await state(B)).id === idB, wtag + ' M3: after a reload each tab is still on its own check');
      // the same check changed in the other tab
      await backTo(B, 'start');
      await B.click('.mycheck[data-check="' + idA + '"] [data-act="open"]'); await B.evaluate(() => window.Readiness2.send('answer', { id: 'sk1', value: 'n' })); await A.waitForTimeout(250);
      sa = await state(A); ok(sa.elsewhere === 'changed' && sa.T.sk1 !== 'n' && /This check was changed in another tab\./.test(await text(A, '#elsewhere')) && await A.isVisible('#adopt'), wtag + ' M3: the open check was changed in another tab: A says so and keeps its own answers');
      await check(A, wtag + ' M3 line'); if (w === 1280) await shot(A, 'v21-other-tab');
      await A.click('#adopt'); sa = await state(A); ok(sa.T.sk1 === 'n' && !sa.elsewhere && !(await A.$('#elsewhere')) && sa.id === idA, wtag + ' M3: "Load the other tab\'s version" takes it over');
      ok(A._errs.length === 0 && B._errs.length === 0, wtag + ' M3: no console errors ' + A._errs.concat(B._errs).join('|')); await ctx.close();
    }

    // =================================================================================================================
    // M4 + L10: Back never goes dead
    // =================================================================================================================
    {
      const { ctx, p } = await mk(b, w, touch); await p.goto('about:blank'); await p.goto(TOOL);
      // real clicks, so every step is a real history entry
      await p.click('#begin'); await p.selectOption('#h-type', 'independent'); await p.click('#next');
      for (const q of ['q1', 'q2', 'q3', 'q4', 'q5']) await p.click(`label[for="a-${q}-y"]`); await p.click('#next');
      for (let i = 1; i <= 10; i++) await p.click(`label[for="a-m${i}-y"]`); await p.click('#next');
      await p.click('#cat-commercial'); await p.click('#dept-rm'); await p.click('label[for="u-rm-1"] .ucn'); await p.click('#next');
      for (const t of (await state(p)).tailored) await p.click(`label[for="a-${t}-y"]`); await p.click('#next');
      ok((await state(p)).step === 'result', wtag + ' M4: a finished check (seven history entries)');
      // L10: Change answers from the start → Q1 No → stop; Back shows q, then hotel, never stop again
      await p.click('#edit'); await p.click('label[for="a-q1-n"]'); await p.click('#next'); ok((await state(p)).step === 'stop', wtag + ' L10: stop reached through "Change answers from the start"');
      const seen = [];
      for (let i = 0; i < 3; i++) { await p.goBack(); await p.waitForTimeout(350); if (!/readiness-2/.test(p.url())) { seen.push('left'); break; } seen.push((await state(p)).step); }
      ok(seen.join() === 'q,hotel,start', wtag + ' L10: Back from stop shows q, hotel, the cover; never the stop screen again (was q, stop ×4, q): ' + seen.join(' → '));
      await p.goForward(); await p.waitForTimeout(250); await p.goForward(); await p.waitForTimeout(350);
      ok((await state(p)).step === 'q', wtag + ' L10: Forward comes back to the questions');
      await p.click('label[for="a-q1-y"]'); await p.click('#next'); await p.evaluate(() => { const R = window.Readiness2; R.send('next'); R.send('next'); R.send('next'); });
      ok((await state(p)).step === 'result', wtag + ' M4: back on the result');
      // M4: Start a new check, then one browser Back leaves the tool
      await p.click('#new-check'); ok((await state(p)).step === 'start', wtag + ' M4: Start a new check → cover');
      await p.goBack(); await p.waitForTimeout(900);
      ok(p.url() === 'about:blank', wtag + ' M4: one browser Back leaves the tool (it took seven presses): ' + p.url());
      await p.goForward(); await p.waitForTimeout(600);
      ok(/readiness-2/.test(p.url()) && (await state(p)).step === 'start', wtag + ' M4: Forward returns to the tool, on the new check\'s cover');
      // in-app Back and browser Back still agree on a fresh check
      await p.click('#begin'); await p.click('#next'); await p.click('#back'); ok((await state(p)).step === 'hotel', wtag + ' M4: in-app Back still works');
      await p.goBack(); await p.waitForTimeout(300); ok((await state(p)).step === 'start', wtag + ' M4: browser Back on the new check goes to its cover');
      ok(p._errs.length === 0, wtag + ' M4: no console errors ' + p._errs.join('|')); await ctx.close();
    }
    {
      // inside the hub: Back returns to the previous hub tab
      const { ctx, p } = await mk(b, w, touch); const f = await openHubTool(p);
      await f.click('#begin'); await f.selectOption('#h-type', 'independent'); await f.click('#next');
      for (const q of ['q1', 'q2', 'q3', 'q4', 'q5']) await f.click(`label[for="a-${q}-y"]`); await f.click('#next');
      ok((await state(f)).step === 'must', wtag + ' hub M4: three steps in');
      await f.click('#new-top'); ok((await state(f)).step === 'start', wtag + ' hub M4: Start a new check');
      await p.goBack(); await p.waitForTimeout(900);
      const tool = await p.evaluate(() => window.HFTPHub ? window.HFTPHub.state().tool : 'left');
      ok(tool !== 'readiness-2', wtag + ' hub M4: one browser Back returns to the previous hub tab (' + tool + '), not a dead press');
      ok(p._errs.length === 0, wtag + ' hub M4: no console errors ' + p._errs.join('|')); await ctx.close();
    }

    // =================================================================================================================
    // M5: questions changed since the check was answered; a use case that left the catalogue
    // =================================================================================================================
    {
      const { ctx, p } = await mk(b, w, touch); await p.goto(TOOL); await fill(p, { use: 'rm-1' });
      const sig = (await state(p)).tqSig; ok(/^[0-9a-f]{10}$/.test(sig), wtag + ' M5: the check carries the signature of its questions');
      await p.evaluate(k => { const s = JSON.parse(localStorage.getItem(k)); s.checks[s.cur].tqSig = 'ffffffffff'; localStorage.setItem(k, JSON.stringify(s)); }, KEY);
      await p.reload(); let s = await state(p);
      ok(s.step === 'tailored' && Object.keys(s.T).length === 0 && s.notice === 'questionsChanged' && (await text(p, '#questions-changed')) === 'The questions for this use case changed since you answered. Please answer step 5 again.' && Object.keys(s.A).length === 10, wtag + ' M5: a finished check whose questions changed reopens on step 5 with the notice (it stayed on the result, silently)');
      await check(p, wtag + ' M5 notice'); if (w === 1280) await shot(p, 'v21-questions-changed');
      await p.evaluate(() => { const R = window.Readiness2; R.state().tailored.forEach(t => R.send('answer', { id: t, value: 'y' })); R.send('next'); });
      ok((await state(p)).step === 'result' && (await state(p)).tqSig === sig, wtag + ' M5: answered again → result, with today\'s signature');
      // a file with an unknown use id opens on step 4 with the notice
      const doc = await p.evaluate(() => window.Readiness2.fileDoc()); doc.check.use = 'rm-77'; doc.check.id = 'gonefile1';
      const fp = path.join(OUT, wtag + '-gone-use.json'); fs.writeFileSync(fp, JSON.stringify(doc));
      await p.setInputFiles('#file-open', fp); await p.waitForFunction(() => window.Readiness2.state().id === 'gonefile1');
      s = await state(p); ok(s.step === 'where' && s.use === '' && s.notice === 'useChanged' && (await text(p, '#use-changed')) === 'The catalogue changed: please pick your use case again.', wtag + ' M5: a file whose use case is no longer in the catalogue opens on step 4 with the notice (it was silent)');
      // the same from storage
      await p.evaluate(k => { const st = JSON.parse(localStorage.getItem(k)); st.checks[st.cur].use = 'rm-78'; st.checks[st.cur].step = 'result'; localStorage.setItem(k, JSON.stringify(st)); }, KEY);
      await p.reload(); s = await state(p); ok(s.step === 'where' && s.notice === 'useChanged' && await p.isVisible('#use-changed'), wtag + ' M5: and from storage');
      ok(p._errs.length === 0, wtag + ' M5: no console errors ' + p._errs.join('|')); await ctx.close();
    }

    // =================================================================================================================
    // Low: L1, L2, L3, L4, L5, L6, L7, L8, L9, L12
    // =================================================================================================================
    {
      const { ctx, p } = await mk(b, w, touch); await p.goto(TOOL);
      // L2: an optional field can be emptied
      await p.click('#begin'); await p.selectOption('#h-type', 'independent'); await p.fill('#h-name', 'Hotel Secret'); await p.selectOption('#h-country', 'France');
      ok((await p.evaluate(() => JSON.parse(localStorage.getItem('hftp-hotel-profile-v1')))).name === 'Hotel Secret', wtag + ' L2: the profile has the name');
      await p.fill('#h-name', ''); await p.selectOption('#h-country', ''); await p.reload();
      let s = await state(p), prof = await p.evaluate(() => JSON.parse(localStorage.getItem('hftp-hotel-profile-v1')));
      ok(s.hotel.name === '' && s.hotel.country === '' && s.hotel.type === 'independent' && !prof.name && !prof.country && prof.type === 'independent', wtag + ' L2: name and country cleared, reload → both stay empty (they came back); the type is kept');
      // L3: a use case the person chose is not "You came here for"
      await fill(p, { use: 'rm-1', stopAt: 'tailored' }); await backTo(p, 'start');
      ok((await state(p)).step === 'start' && (await state(p)).use === 'rm-1' && !(await p.$('#preselected')), wtag + ' L3: self-chosen use case, back on the cover: no "You came here for…" line');
      // L5: "by when" cannot lie in the past; a past date saved earlier is shown as overdue
      await p.evaluate(() => { const R = window.Readiness2; R.send('begin'); R.send('next'); R.send('next'); R.send('answer', { id: 'm1', value: 'pl' }); });
      const today = await p.evaluate(() => window.R2Logic.localIso());
      ok((await p.getAttribute('#by-m1', 'min')) === today, wtag + ' L5: the date field has min = today');
      ok(await p.evaluate(() => window.Readiness2.send('by', { id: 'm1', date: '2001-01-01' })) === false && !(await state(p)).By.m1, wtag + ' L5: 2001-01-01 is refused');
      ok(await p.evaluate(t => window.Readiness2.send('by', { id: 'm1', date: t }), today) === true, wtag + ' L5: today is accepted');
      await p.evaluate(k => { const st = JSON.parse(localStorage.getItem(k)); st.checks[st.cur].By.m1 = '2001-01-01'; localStorage.setItem(k, JSON.stringify(st)); }, KEY); await p.reload();
      ok(await p.isVisible('#overdue-m1') && /This date has passed \(overdue\)/.test(await text(p, '#overdue-m1')), wtag + ' L5: a past date saved earlier is said to be overdue on the step');
      await p.evaluate(() => { const R = window.Readiness2; R.send('next'); R.send('next'); R.send('next'); });
      ok((await state(p)).step === 'result' && /\(was planned by 1 Jan 2001, overdue\)\./.test(await text(p, '#first')) && !/\(planned by 1 Jan 2001\)/.test(await text(p, '#view')), wtag + ' L5: and on the result: "was planned by 1 Jan 2001, overdue"');
      // L1: double-click "Save as file" → one download
      let n = 0; const onDl = () => { n++; }; p.on('download', onDl);
      await p.dblclick('#save-file'); await p.waitForFunction(() => window.Readiness2.state().download === 'idle'); await p.waitForTimeout(400);
      ok(n === 1, wtag + ' L1: double-click on "Save as file" saves one file (it saved two): ' + n);
      n = 0; await p.dblclick('#pdf'); await p.waitForFunction(() => window.Readiness2.state().download === 'idle'); await p.waitForTimeout(400); ok(n === 1, wtag + ' L1: and the PDF still one: ' + n); p.off('download', onDl);
      // L7: one title
      ok(await p.evaluate(() => window.Readiness2.pdfModel().blocks[0].t) === 'Do you need AI? Result', wtag + ' L7: the result PDF is titled like the screen');
      await p.click('#edit'); await p.click('label[for="a-q1-n"]'); await p.click('#next');
      const st = await p.evaluate(() => window.Readiness2.pdfModel().blocks[0].t); ok(st === 'Do you need AI? Not suitable for AI' && !/score/i.test(st), wtag + ' L7: the stop PDF has no "score" in its title: ' + st);
      // L8: a file from the earlier Readiness check
      const oldFile = path.join(OUT, wtag + '-old-readiness-check.json'); fs.writeFileSync(oldFile, JSON.stringify({ kind: 'hftp-readiness-check', v: 3, rules: 'v4', savedAt: '2026-11-20T10:00:00.000Z', check: { id: 'x1', useId: 'gx-2' } }));
      await p.click('#change'); await backTo(p, 'start');
      await p.setInputFiles('#file-open', oldFile); await p.waitForSelector('#old-file');
      ok(/This file is from the earlier Readiness check\. It cannot be opened here\./.test(await text(p, '#old-file')) && (await p.getAttribute('#old-file a', 'href')) === '../readiness-check/index.html' && /earlier Readiness check/.test(await text(p, '#toast')) && !/not a check saved from this page/.test(await text(p, '#toast')), wtag + ' L8: an old readiness-check file gets its own message and a link to the page that opens it');
      await check(p, wtag + ' L8');
      const old = await mk(b, w, touch, { ctx }); await old.p.goto(BASE + 'readiness-check/index.html');
      ok(/This check was replaced by “Do you need AI\?” on 24 Nov 2026\./.test(await old.p.textContent('#replaced')) && (await old.p.getAttribute('#replaced a', 'href')) === '../readiness-2/index.html' && await noH(old.p), wtag + ' L8: the old page says it was replaced and links to the new tool');
      await old.p.close();
      ok(p._errs.length === 0, wtag + ' low: no console errors ' + p._errs.join('|')); await ctx.close();
    }
    {
      // L9: old links do not fill the list
      const { ctx, p } = await mk(b, w, touch);
      for (const u of ['fo-1', 'fo-2', 'fo-3']) { await p.goto(TOOL + '#use=' + u); await p.waitForFunction(x => window.Readiness2 && window.Readiness2.state().use === x, u); }
      let s = await state(p); ok(s.use === 'fo-3' && s.from === 'link' && s.checks.length === 0 && Object.keys(await p.evaluate(() => window.Readiness2.store().checks)).length === 1 && /You came here for: /.test(await text(p, '#preselected')), wtag + ' L9: three old links leave one unlisted check (there were five rows); the cover says "You came here for"');
      await p.click('#begin'); await p.selectOption('#h-type', 'independent'); await p.click('#next'); await p.click('label[for="a-q1-y"]');
      ok((await state(p)).checks.length === 1, wtag + ' L9: once a question is answered it is listed');
      await ctx.close();
    }
    {
      // L4: more than 50 checks
      const { ctx, p } = await mk(b, w, touch); await p.goto(TOOL); await fill(p, { use: 'rm-1' });
      await p.evaluate(k => { const st = JSON.parse(localStorage.getItem(k)), base = st.checks[st.cur]; for (let i = 0; i < 51; i++) { const c = JSON.parse(JSON.stringify(base)); c.id = 'many' + i; c.updated = new Date(Date.now() + 1000 * (i + 1)).toISOString(); st.checks[c.id] = c; } base.step = 'q'; base.updated = '2026-01-01T00:00:00.000Z'; localStorage.setItem(k, JSON.stringify(st)); }, KEY);
      const cur = (await state(p)).id; await p.reload(); let s = await state(p);
      ok(s.id === cur && s.step === 'q' && s.checks.length === 50, wtag + ' L4: 52 checks, reload → the open check is still open, 50 kept (the open one was dropped)');
      await p.click('#new-top'); s = await state(p);
      ok(s.id === cur && /This browser keeps at most 50 checks\. Remove one you no longer need first\./.test(await text(p, '#toast')), wtag + ' L4: a 51st check is refused, with a message');
      await ctx.close();
    }
    {
      // L6: storage blocked
      const { ctx, p } = await mk(b, w, touch, { init: "Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } });" });
      await p.goto(TOOL); let s = await state(p);
      ok(s.storage === 'blocked' && (await text(p, '#no-keep')) === 'This browser is not keeping checks. Save a file to keep one.' && !/is kept here until you remove it/.test(await text(p, '#view')), wtag + ' L6: blocked storage: "Your checks" does not say "kept here until you remove it"');
      await fill(p, { use: 'gx-2' }); await p.evaluate(() => { document.querySelector('details[data-fold="share"] summary').click(); });
      await p.waitForFunction(() => window.Readiness2.state().shareStore === 'local');
      await p.evaluate(() => window.Readiness2.send('share', { named: false }));
      ok(!/keeps a test copy in this browser only/.test(await text(p, '#share')), wtag + ' L6: nor does the share panel promise "a test copy in this browser"');
      await ctx.close();
    }
    {
      // L12: corrupt saved data
      const { ctx, p } = await mk(b, w, touch, { init: `if (!sessionStorage.getItem('fx')) { sessionStorage.setItem('fx', '1'); localStorage.setItem(${JSON.stringify(KEY)}, '{"v":2,"cur":"abc","checks":{"abc":{"id":"abc","Q":{"q1":"y"'); }` });
      await p.goto(TOOL); let s = await state(p);
      ok(s.corrupt === true && s.step === 'start' && /The checks saved in this browser could not be read, so this page started fresh\. The unreadable data was set aside, not deleted\./.test(await text(p, '#corrupt')), wtag + ' L12: corrupt saved data: the page says so (it was silent)');
      ok((await p.evaluate(() => localStorage.getItem('hftp-readiness2-v1-corrupt'))) === '{"v":2,"cur":"abc","checks":{"abc":{"id":"abc","Q":{"q1":"y"', wtag + ' L12: the raw text is still in storage, under its own key');
      await check(p, wtag + ' L12');
      await p.click('#corrupt-ok'); ok(!(await p.$('#corrupt')), wtag + ' L12: one-time: OK takes the line away');
      await p.click('#begin'); await p.reload(); ok(!(await state(p)).corrupt && (await p.evaluate(() => !!localStorage.getItem('hftp-readiness2-v1-corrupt'))), wtag + ' L12: after the first save the line is gone for good; the set-aside text stays');
      await ctx.close();
    }
  }
  await b.close();
  console.log('v2.1 browser checks: ' + pass + ' passed, ' + fail + ' failed');
  if (fail) { fails.forEach(x => console.log('  ' + x)); process.exit(1); }
})().catch(e => { console.error(e); process.exit(1); });
