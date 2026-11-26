// Browser proof for the public build's data collection (v2.8.1, owner 26 Nov 2026). The page is built in memory by build.mjs with a
// fake collectUrl (https://collect.test/exec); that address is a Playwright route that records every request (the local "server").
// Proves: the notice and the "Don't send my answers" box on the cover, the footer's Data link and the full notice; one event per
// completed step and one at the result (and at the stop screen); nothing after the opt-out, at once and after a reload; no cookie;
// no other host; the real public/index.html (collectUrl empty) sends nothing at all.
// Serve tools/ first:  python3 -m http.server <port> --bind 127.0.0.1, then R2_BASE=http://127.0.0.1:<port>/ node readiness-2-questions/tests/browser/public.cjs
const { chromium } = require('playwright');
const path = require('path');
const BASE = process.env.R2_BASE || 'http://127.0.0.1:8891/';
const TEST_URL = BASE + 'readiness-2-questions/public/__collect-test.html', REAL_URL = BASE + 'readiness-2-questions/public/index.html';
const COLLECT = 'https://collect.test/exec';
let pass = 0, fail = 0; const ok = (c, n, extra) => { if (c) pass++; else { fail++; console.log('FAIL  ' + n + (extra !== undefined ? '  -> ' + JSON.stringify(extra).slice(0, 600) : '')); } };
const wait = ms => new Promise(r => setTimeout(r, ms));
const st = p => p.evaluate(() => window.Readiness2.state());

async function ctxFor(b, html, vp) {
  const ctx = await b.newContext({ viewport: vp || { width: 1280, height: 800 } });
  const got = [], other = [];
  await ctx.route(COLLECT, async route => { const r = route.request(); got.push({ method: r.method(), type: r.headers()['content-type'] || '', body: JSON.parse(r.postData() || '{}') }); await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }); });
  if (html) await ctx.route(TEST_URL, route => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html }));
  ctx.on('request', r => { const u = r.url(); if (!u.startsWith(BASE) && !u.startsWith('data:') && !u.startsWith('blob:') && u !== COLLECT) other.push(u); });
  return { ctx, got, other };
}
async function open(ctx, url) { const p = await ctx.newPage(); p._errs = []; p.on('pageerror', e => p._errs.push(String(e))); await p.goto(url); await p.waitForSelector('#begin'); return p; }
async function walk(p, o) {
  o = o || {};
  await p.click('#begin'); await p.selectOption('#h-type', 'group'); if (o.name) { await p.fill('#h-name', o.name); await p.dispatchEvent('#h-name', 'input'); }
  await p.selectOption('#h-role', 'gm'); await p.selectOption('#h-country', 'France'); await p.click('#next');
  if (o.stop) { await p.click('label[for="a-q1-y"]'); await p.click('#next'); return; }
  for (const q of ['q1-n', 'q2-y', 'q3-u', 'q4-y', 'q5-y']) await p.click('label[for="a-' + q + '"]');
  await p.click('#next');
  await p.click('label[for="a-m1-y"]'); await p.click('label[for="a-m2-pl"]'); await p.click('label[for="a-m3-n"]'); await p.click('#next');
  await p.click('#cat-administrative'); await p.click('#dept-hr'); await p.click('label[for="u-hr-1"] .ucn'); await p.click('#next');
  const first = await p.getAttribute('fieldset[data-q] input[value="y"]', 'id'); if (first) await p.click('label[for="' + first + '"]');
  await p.click('#next'); await p.waitForSelector('#level-name');
}

(async () => {
  const { buildPage } = await import(path.join(__dirname, '..', '..', 'build.mjs'));
  const html = buildPage({ pub: true, config: { collectUrl: COLLECT, contact: '' } }).html;
  const htmlC = buildPage({ pub: true, config: { collectUrl: COLLECT, contact: 'team@example.org' } }).html;
  const b = await chromium.launch();
  /* v2.8.1: never let a test reach the owner's collect address (public build): every request to Apps Script is answered here */
  { const nc = b.newContext.bind(b); b.newContext = async o => { const c = await nc(o); await c.route(/^https:\/\/script\.google(usercontent)?\.com\//, r => r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })); return c; }; }

  // ---------- 1. the notice, one event per step and at the result ----------
  { const { ctx, got, other } = await ctxFor(b, html); const p = await open(ctx, TEST_URL);
    ok(!!(await p.$('#data-notice')) && !(await p.isChecked('#no-send')) && (await p.textContent('#data-notice')).includes('EHL SBP Group 36, a student project for HFTP'), 'cover: the notice and an unticked "Don\'t send my answers"');
    ok((await p.textContent('label[for="no-send"]')).trim() === 'Don’t send my answers', 'the box\'s words');
    ok((await p.textContent('#foot-data')).includes('Data') && (await p.textContent('#foot-data')).includes('Contact: to be added') && !(await p.textContent('#foot-keep')).includes('stay in this browser'), 'footer: Data link, contact placeholder, no "stay in this browser" claim');
    ok(!/answers stay in this browser/i.test(await p.evaluate(() => document.body.innerText)), 'no "answers stay in this browser" anywhere in the public page');
    await walk(p, {});
    await wait(400);
    const ev = got.map(g => g.body.event + ':' + g.body.step);
    ok(JSON.stringify(ev) === JSON.stringify(['step_done:1', 'step_done:2', 'step_done:3', 'step_done:4', 'step_done:5', 'result:result']), 'one event per completed step, then the result', ev);
    ok(got.every(g => g.method === 'POST' && /^text\/plain/.test(g.type)), 'POST as text/plain');
    const r = got[got.length - 1].body, s = await st(p);
    ok(r.check_id === s.id && got.every(g => g.body.check_id === s.id) && r.verdict === s.level && r.score === s.pct && r.version === '2.8.1' && r.use_case === 'hr-1', 'the result event: check id, verdict, score, version, use case', r);
    ok(r.hotel_type === 'group' && r.role === 'gm' && r.country === 'France' && r.hotel_name === '' && r.step2.q3 === 'Not sure' && r.must.m2 === 'Planned' && r.must.m3 === 'No' && Object.values(r.answers).includes('Yes'), 'profile without a name (none typed), step 2, must-haves, step-5 answers', r);
    ok(got[0].body.step2 && Object.keys(got[0].body.step2).length === 0 && got[1].body.step2.q1 === 'No', 'events carry the answers given so far');
    ok(other.length === 0 && (await ctx.cookies()).length === 0 && !p._errs.length, 'no other host, no cookie, no page error', { other, errs: p._errs });
    await ctx.close(); }

  // ---------- 2. the stop screen, a typed name ----------
  { const { ctx, got } = await ctxFor(b, html); const p = await open(ctx, TEST_URL);
    await walk(p, { stop: true, name: 'Hotel Beta' }); await wait(400);
    const ev = got.map(g => g.body.event + ':' + g.body.step + ':' + g.body.verdict);
    ok(JSON.stringify(ev) === JSON.stringify(['step_done:1:', 'step_done:2:', 'result:stop:stop']) && got[2].body.hotel_name === 'Hotel Beta' && got[2].body.score === null, 'stop: steps 1 and 2, then the result "stop"; the typed name is sent', ev);
    await ctx.close(); }

  // ---------- 3. opt-out: on the cover, at once, after a reload; from the Data notice ----------
  { const { ctx, got } = await ctxFor(b, html, { width: 360, height: 740 }); const p = await open(ctx, TEST_URL);
    await p.click('label[for="no-send"]'); ok(await p.isChecked('#no-send') && !!(await p.$('#no-send-on')) && (await st(p)).noSend, 'ticked: the line "Your answers are not sent" and state().noSend');
    await walk(p, {}); await wait(400);
    ok(got.length === 0, 'opted out: nothing sent over a whole check', got.length);
    await p.reload(); await p.waitForSelector('#app[data-state]');
    await p.evaluate(() => window.Readiness2.send('new', { same: true })); await p.waitForSelector('#no-send');
    ok(await p.isChecked('#no-send'), 'remembered in this browser after a reload');
    await p.click('#begin'); await p.click('#next'); await wait(300);
    ok(got.length === 0, 'still nothing after the reload');
    /* untick from the footer's Data notice on step 2: sending starts again at once */
    await p.click('#foot-data-btn'); await p.waitForSelector('#datanote[open]');
    ok((await st(p)).dataOpen && (await p.textContent('#datanote')).includes('Kept until 31 January 2027, then removed.') && (await p.textContent('#data-contact')).includes('Contact: to be added'), 'the Data notice opens from the footer: how long, the contact placeholder');
    await p.click('label[for="no-send-2"]'); ok(!(await p.isChecked('#no-send-2')), 'unticked in the notice');
    await p.keyboard.press('Escape'); await wait(200);
    ok(!(await st(p)).dataOpen && (await p.evaluate(() => document.activeElement && document.activeElement.id)) === 'foot-data-btn', 'Esc closes the notice; focus back on "Data"');
    for (const q of ['q1-n', 'q2-y', 'q3-y', 'q4-y', 'q5-y']) await p.click('label[for="a-' + q + '"]');
    await p.click('#next'); await wait(400);
    ok(got.length === 1 && got[0].body.event === 'step_done' && got[0].body.step === '2', 'unticked: the next completed step is sent at once', got.map(g => g.body.step));
    /* ticked inside the notice: stops at once */
    await p.click('#foot-data-btn'); await p.click('label[for="no-send-2"]'); await p.click('#data-close'); await p.click('#next'); await wait(400);
    ok(got.length === 1, 'ticked in the notice: nothing more');
    await ctx.close(); }

  // ---------- 4. the contact, when the owner fills it ----------
  { const { ctx } = await ctxFor(b, htmlC); const p = await open(ctx, TEST_URL);
    await p.click('#data-more'); await p.waitForSelector('#datanote[open]');
    ok((await p.textContent('#data-contact')).trim() === 'Contact: team@example.org' && (await p.textContent('#foot-data')).includes('Contact: team@example.org'), 'contact from hosting.config.json, in the notice and the footer');
    await p.click('#data-close'); ok((await p.evaluate(() => document.activeElement.id)) === 'data-more', 'Close: focus back on the cover link');
    await ctx.close(); }

  // ---------- 5. the real public/index.html: requests go only to hosting.config.json's collectUrl (answered here, never sent) ----------
  { const { ctx, other } = await ctxFor(b, null); const cfg = JSON.parse(require('fs').readFileSync(path.join(__dirname, '..', '..', 'hosting.config.json'), 'utf8'));
    const toCfg = []; ctx.on('request', r => { if (cfg.collectUrl && r.url() === cfg.collectUrl) toCfg.push(r.postData()); });
    const p = await open(ctx, REAL_URL);
    const s0 = await st(p);
    await walk(p, {}); await wait(400);
    const foreign = other.filter(u => u !== cfg.collectUrl);
    ok(s0.build === 'public' && s0.collectOn === !!cfg.collectUrl && foreign.length === 0 && toCfg.length === (cfg.collectUrl ? 6 : 0), 'public/index.html: ' + (cfg.collectUrl ? '6 events to the configured address (intercepted by the test)' : 'collectUrl empty, nothing sent') + ', no other host', { foreign, n: toCfg.length });
    const s = await st(p); ok(s.downloadRoute === 'link' && s.storage === 'ok', 'public build: ordinary downloads, localStorage');
    await ctx.close(); }

  // ---------- 6. the claude.ai build: no notice, no sending ----------
  { const { ctx, got, other } = await ctxFor(b, null); const p = await open(ctx, BASE + 'readiness-2-questions/index.html');
    ok(!(await p.$('#data-notice')) && !(await p.$('#foot-data')) && (await p.textContent('#foot-keep')).includes('Your answers stay in this browser.') && (await st(p)).build === 'artifact', 'artifact build: no notice, no Data link, its own wording');
    await walk(p, {}); await wait(300);
    ok(got.length === 0 && other.length === 0, 'artifact build: nothing sent');
    await ctx.close(); }

  await b.close();
  console.log('public (browser): ' + pass + ' passed, ' + fail + ' failed');
  if (fail) process.exit(1);
})();
