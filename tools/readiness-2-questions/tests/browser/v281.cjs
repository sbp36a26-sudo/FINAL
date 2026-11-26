// Browser proof for v2.8.1: every bug of reports/audit-readiness-2-questions/cleanup_inventory_v28.md (H1, M1 to M3, L1 to L9) and the
// council's BUILD NOW items that live in the page (reports/Council - Do you need AI v2.8.md, section a). Each check asserts the
// correct behaviour; before v2.8.1 the bug checks failed (the inventory's repros, turned into this repo test).
// Serve tools/ first:  python3 -m http.server <port> --bind 127.0.0.1, then
//   R2_BASE=http://127.0.0.1:<port>/ node readiness-2-questions/tests/browser/v281.cjs                 (the claude.ai artifact build)
//   R2_BASE=... R2_PAGE=public/index.html node readiness-2-questions/tests/browser/v281.cjs            (the public build)
// The artifact-only cases (window.claude downloads, window.storage) are skipped on the public build, which uses neither.
const { chromium } = require('playwright');
const path = require('path');
const BASE = process.env.R2_BASE || 'http://127.0.0.1:8891/';
const PAGE = process.env.R2_PAGE || 'index.html';
const URL0 = BASE + 'readiness-2-questions/' + PAGE;
const ROOT = path.join(__dirname, '..', '..');
let pass = 0, fail = 0; const ok = (c, n, extra) => { if (c) pass++; else { fail++; console.log('FAIL  ' + n + (extra !== undefined ? '  -> ' + JSON.stringify(extra) : '')); } };
const st = p => p.evaluate(() => window.Readiness2.state());
const wait = ms => new Promise(r => setTimeout(r, ms));
let KEY, FX;

async function fixtures() {
  const { load, data, finished } = await import(path.join(ROOT, 'tests', 'load.mjs'));
  const { F } = load(), D = data(); KEY = F.KEY;
  const one = finished(F, D, 'hr-1', { id: 'fixA01', updated: '2026-11-01T09:00:00.000Z' });
  const a = finished(F, D, 'fo-1', { id: 'fixB01', updated: '2026-11-02T09:00:00.000Z' }), b = finished(F, D, 'hk-1', { id: 'fixB02', updated: '2026-11-03T09:00:00.000Z' }), c = finished(F, D, 'rm-1', { id: 'fixB03', updated: '2026-11-04T09:00:00.000Z' });
  const t1 = finished(F, D, 'hr-1', { id: 'fixT01', updated: '2026-11-05T09:05:00.000Z' }), t2 = finished(F, D, 'hr-1', { id: 'fixT02', updated: '2026-11-05T14:30:00.000Z' });
  FX = {
    one: JSON.stringify({ v: F.V, cur: one.id, checks: { [one.id]: one } }),
    three: JSON.stringify({ v: F.V, cur: c.id, checks: { [a.id]: a, [b.id]: b, [c.id]: c } }),
    twin: JSON.stringify({ v: F.V, cur: t2.id, checks: { [t1.id]: t1, [t2.id]: t2 } }),
    newer: JSON.stringify({ v: F.V + 1, cur: one.id, checks: { [one.id]: one } })
  };
}
async function page(b, opt) {
  opt = opt || {};
  const ctx = opt.ctx || await b.newContext({ viewport: opt.vp || { width: 1280, height: 800 } });
  if (!opt.ctx) {
    if (opt.store) await ctx.addInitScript(([k, v]) => { if (!sessionStorage.getItem('__seeded')) { sessionStorage.setItem('__seeded', '1'); localStorage.setItem(k, v); } }, [KEY, opt.store]);
    if (opt.init) await ctx.addInitScript(opt.init, opt.arg);
  }
  const p = await ctx.newPage(); p._errs = [];
  p.on('pageerror', e => p._errs.push(String(e)));
  await p.goto(URL0); await p.waitForSelector('#app[data-state]');
  return { ctx, p };
}
const blockLS = () => { const mk = () => { throw new DOMException('blocked', 'SecurityError'); }; Object.defineProperty(window, 'localStorage', { get: mk, configurable: true }); Object.defineProperty(window, 'sessionStorage', { get: mk, configurable: true }); };
async function toStep2(p, name) { await p.click('#begin'); await p.selectOption('#h-type', 'independent'); if (name) { await p.fill('#h-name', name); await p.dispatchEvent('#h-name', 'input'); } await p.click('#next'); }

const ARTIFACT_ONLY = new Set(['H1', 'L1', 'L2', 'M2', 'M3', 'L3', 'B3']);
const CASES = {
  /* H1: a save() that gives no promise, throws, or rejects with an object: the DOWNLOAD machine returns to idle, the buttons work again. */
  async H1(b) {
    for (const mode of ['undefined', 'throws', 'rejects']) {
      const { ctx, p } = await page(b, { store: FX.one, init: m => { window.claude = { use: () => Promise.resolve({ save: () => { if (m === 'throws') throw new Error('x'); if (m === 'rejects') return Promise.reject({}); return undefined; } }) }; }, arg: mode });
      await p.click('#pdf'); await wait(2000);
      const s = await st(p), dis = await p.$eval('#pdf', e => e.disabled), bl = !!(await p.$('#dl-blocked'));
      ok(s.download === 'idle' && !dis && bl && !p._errs.length, 'H1 save() ' + mode + ': back to idle, #pdf enabled, the blocked line shown, no page error', { download: s.download, dis, bl, errs: p._errs.slice(0, 1) });
      await ctx.close();
    }
  },
  /* M1: "A different hotel" stays blank after a reload and after opening another check and coming back. */
  async M1(b) {
    const { ctx, p } = await page(b);
    await toStep2(p, 'Alpha Hotel'); await p.click('label[for="a-q1-n"]');
    const first = (await st(p)).id;
    await p.click('#new-top'); await p.click('#new-other');
    const s1 = await st(p);
    await p.reload(); await p.waitForSelector('#app[data-state]');
    const s2 = await st(p);
    ok(s1.hotel.name === '' && s2.hotel.name === '' && s2.hotel.type === '', 'M1 "A different hotel" stays blank after reload', { before: s1.hotel, after: s2.hotel });
    await p.click('#begin'); await p.selectOption('#h-type', 'group'); await p.click('#next'); await p.click('label[for="a-q1-n"]'); // listed now
    await p.evaluate(() => window.Readiness2.send('back')); await wait(200); await p.evaluate(() => window.Readiness2.send('back')); await wait(200);
    const me = (await st(p)).id;
    await p.click('[data-act="open"][data-id="' + first + '"]'); await p.evaluate(() => window.Readiness2.send('back')); await wait(200); await p.evaluate(() => window.Readiness2.send('back')); await wait(200);
    await p.click('[data-act="open"][data-id="' + me + '"]');
    const s3 = await st(p);
    ok(s3.id === me && s3.hotel.name === '' && s3.hotel.type === 'group', 'M1 and after Open of another check and back (a type chosen later does not bring the old name back)', s3.hotel);
    await ctx.close();
  },
  /* M2: localStorage blocked, window.storage holds a store of a newer version: shown as newer, never written over. */
  async M2(b) {
    const { ctx, p } = await page(b, { init: v => {
      Object.defineProperty(window, 'localStorage', { get: () => { throw new DOMException('blocked', 'SecurityError'); }, configurable: true });
      window.__ws = { 'hftp-readiness2q-v1': v }; window.__sets = 0;
      window.storage = { get: k => Promise.resolve(window.__ws[k] == null ? null : { value: window.__ws[k] }), set: (k, x) => { window.__sets++; window.__ws[k] = x; return Promise.resolve(); } };
    }, arg: FX.newer });
    await wait(500);
    const s = await st(p);
    await p.evaluate(() => window.Readiness2.send('edit')); await wait(300);
    const after = await p.evaluate(() => ({ sets: window.__sets, v: JSON.parse(window.__ws['hftp-readiness2q-v1']).v, line: (document.getElementById('not-saved') || {}).textContent || '' }));
    ok(s.storage === 'newer' && after.v === 5 && after.sets === 0 && /newer version/.test(after.line), 'M2 a newer store from window.storage: storage newer, never written over, the NEWER line', { storage: s.storage, after });
    await ctx.close();
  },
  /* M3: window.storage only, two tabs: both checks survive. */
  async M3(b) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
    const shared = {};
    await ctx.exposeBinding('__wsGet', (src, k) => shared[k] == null ? null : shared[k]);
    await ctx.exposeBinding('__wsSet', (src, k, v) => { shared[k] = v; });
    await ctx.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', { get: () => { throw new DOMException('blocked', 'SecurityError'); }, configurable: true });
      window.storage = { get: k => window.__wsGet(k).then(v => v == null ? null : { value: v }), set: (k, v) => window.__wsSet(k, v) };
    });
    const A = (await page(b, { ctx })).p, B = (await page(b, { ctx })).p;
    for (const [p, n] of [[A, 'Tab A hotel'], [B, 'Tab B hotel']]) { await toStep2(p, n); await p.click('label[for="a-q1-n"]'); }
    await A.click('label[for="a-q2-y"]'); await wait(200); await B.click('label[for="a-q2-y"]'); await wait(400);
    const C = (await page(b, { ctx })).p; await wait(600);
    const n1 = (await st(C)).checks.length;
    /* a removal in one tab is not undone by the other tab's next save */
    await A.evaluate(() => window.Readiness2.send('back')); await wait(200); await A.evaluate(() => window.Readiness2.send('back')); await wait(200);
    const sa = await st(A), rm = sa.checks.find(id => id !== sa.id); // tab B's check, removed in tab A
    if (rm) { await A.evaluate(id => { window.Readiness2.send('remove', id); }, rm); await A.click('#rm-yes'); await wait(300); }
    await A.evaluate(() => window.Readiness2.send('begin')); await wait(300); // tab A saves again
    const D2 = (await page(b, { ctx })).p; await wait(600);
    const n2 = (await st(D2)).checks.length;
    ok(n1 === 2 && !!rm && n2 === 1, 'M3 window.storage only, two tabs: both checks survive (2), and a removal stays removed (1)', { n1, n2, rm });
    await ctx.close();
  },
  /* L1: the "download blocked" line goes when a later download works. */
  async L1(b) {
    const { ctx, p } = await page(b, { store: FX.one, init: () => { window.__mode = 'null'; window.claude = { use: () => Promise.resolve(window.__mode === 'null' ? null : { save: () => Promise.resolve() }) }; } });
    await p.click('#pdf'); await p.waitForSelector('#dl-blocked'); await wait(300);
    await p.evaluate(() => { window.__mode = 'ok'; }); await p.click('#pdf'); await wait(1500);
    ok(!(await p.$('#dl-blocked')), 'L1 after a download that worked, the blocked line is gone');
    await ctx.close();
  },
  /* L2: window.claude without use(): the capability route, the blocked line, never "Download started". */
  async L2(b) {
    const { ctx, p } = await page(b, { store: FX.one, init: () => { window.claude = {}; } });
    await p.click('#pdf'); await wait(1200);
    const s = await st(p), toast = await p.textContent('#toast');
    ok(s.downloadRoute === 'capability' && !!(await p.$('#dl-blocked')) && !/Download started/.test(toast), 'L2 window.claude without use(): capability route, blocked line, no "Download started"', { route: s.downloadRoute, toast });
    await ctx.close();
  },
  /* L3: localStorage blocked + window.storage present: the cover does not claim nothing is kept, and the state does not flip. */
  async L3(b) {
    const { ctx, p } = await page(b, { init: () => {
      Object.defineProperty(window, 'localStorage', { get: () => { throw new DOMException('blocked', 'SecurityError'); }, configurable: true });
      window.__ws = {}; window.storage = { get: k => Promise.resolve(window.__ws[k] == null ? null : { value: window.__ws[k] }), set: (k, v) => { window.__ws[k] = v; return Promise.resolve(); } };
    } });
    await wait(400);
    const s0 = await st(p), warn0 = !!(await p.$('#not-saved'));
    await p.click('#begin'); await wait(200); const s1 = await st(p);
    ok(s0.storage === 'ok' && s1.storage === 'ok' && !warn0, 'L3 storage ok before and after the first save, no "not keeping" line', { cover: s0.storage, warn0, afterBegin: s1.storage });
    await ctx.close();
  },
  /* L4: Cancel on "same or different hotel" and Keep on a removal give focus back to the button that opened them. */
  async L4(b) {
    let { ctx, p } = await page(b);
    await p.click('#begin'); await p.selectOption('#h-type', 'independent');
    await p.focus('#new-top'); await p.keyboard.press('Enter'); await p.waitForSelector('#new-cancel');
    await p.focus('#new-cancel'); await p.keyboard.press('Enter'); await wait(200);
    const a = await p.evaluate(() => document.activeElement && (document.activeElement.id || document.activeElement.tagName));
    ok(a === 'new-top', 'L4 Cancel returns focus to "Start a new check"', { activeElement: a });
    await ctx.close();
    ({ ctx, p } = await page(b, { store: FX.three }));
    const btn = '[data-act="remove"][data-id="fixB01"]';
    await p.focus(btn); await p.keyboard.press('Enter'); await p.waitForSelector('#rm-no');
    await p.focus('#rm-no'); await p.keyboard.press('Enter'); await wait(200);
    const a2 = await p.evaluate(() => { const e = document.activeElement; return e ? (e.getAttribute('data-act') + ':' + e.getAttribute('data-id')) : ''; });
    ok(a2 === 'remove:fixB01', 'L4 Keep returns focus to the row\'s Remove button', { activeElement: a2 });
    await ctx.close();
  },
  /* L5: a save in another tab leaves this tab's open question alone. */
  async L5(b) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
    await ctx.addInitScript(([k, v]) => { if (!localStorage.getItem('__seeded')) { localStorage.setItem('__seeded', '1'); localStorage.setItem(k, v); } }, [KEY, FX.three]);
    const A = (await page(b, { ctx })).p, B = (await page(b, { ctx })).p;
    await A.click('#new-check'); await A.waitForSelector('[data-confirm="new"]');
    await B.click('#edit'); await B.click('label[for="a-q2-u"]'); await wait(500);
    ok(!!(await A.$('[data-confirm="new"]')), 'L5 the other tab\'s save leaves the "same or different hotel?" question open');
    await ctx.close();
  },
  /* L6: opening, or reloading on the result, keeps a check's date; a changed answer re-dates it. */
  async L6(b) {
    const { ctx, p } = await page(b, { store: FX.three });
    await p.click('[data-act="open"][data-id="fixB01"]'); await wait(300);
    await p.reload(); await p.waitForSelector('#app[data-state]'); await wait(200);
    let s = await p.evaluate(() => window.Readiness2.store());
    ok(s.checks.fixB01.updated.slice(0, 10) === '2026-11-02' && s.checks.fixB03.updated.slice(0, 10) === '2026-11-04', 'L6 Open and reload keep the dates', [s.checks.fixB01.updated, s.checks.fixB03.updated]);
    await p.click('#edit'); await p.click('label[for="a-q2-u"]'); await wait(200);
    s = await p.evaluate(() => window.Readiness2.store());
    ok(s.checks.fixB01.updated.slice(0, 10) !== '2026-11-02', 'L6 a changed answer re-dates the check', s.checks.fixB01.updated);
    await ctx.close();
  },
  /* L7: browser Back from the printable page returns to the result, print view off. */
  async L7(b) {
    const { ctx, p } = await page(b, { store: FX.one });
    await p.click('#back'); await p.click('#next'); await p.waitForSelector('#print-open');
    await p.click('#print-open'); const s0 = await st(p);
    await p.goBack(); await wait(500);
    const s1 = await st(p);
    ok(s0.print && s1.step === 'result' && s1.print === false, 'L7 Back from the printable page: the result, print off', { before: [s0.step, s0.print], after: [s1.step, s1.print] });
    await p.click('#print-open'); await p.click('#print-off'); await wait(300); const s2 = await st(p);
    await p.goBack(); await wait(500); const s3 = await st(p);
    ok(!s2.print && s3.step === 'tailored', '"Back to the page" closes the print view, and the next Back goes on to step 5', [s2.step, s2.print, s3.step]);
    await ctx.close();
  },
  /* L8: a check with Q1 Yes on step 2 says the stop once, and "Not finished: step 2" until the stop screen is reached. */
  async L8(b) {
    const { ctx, p } = await page(b);
    await toStep2(p, 'Gamma'); await p.click('label[for="a-q1-y"]');
    await p.click('#new-top'); await p.click('#new-same'); await wait(200);
    const line = await p.$eval('#mychecks .mycheck', e => e.textContent);
    ok((line.match(/[Ss]topped at step 2/g) || []).length === 0 && /Not suitable for AI/.test(line) && /Not finished: step 2/.test(line), 'L8 step 2 with Q1 Yes: "Not suitable for AI · …", status "Not finished: step 2"', line);
    await ctx.close();
  },
  /* L9: two checks for the same hotel, use case and day never share a name. */
  async L9(b) {
    const { ctx, p } = await page(b, { store: FX.twin });
    const names = await p.$$eval('#mychecks .checkname', e => e.map(x => x.textContent));
    ok(names.length === 2 && new Set(names).size === 2, 'L9 two checks of one day never share a name', names);
    await ctx.close();
  },
  // ---------- council BUILD NOW (section a) ----------
  /* 1: one name: the tab title and the file names */
  async B1(b) {
    const { ctx, p } = await page(b, { store: FX.one });
    const t = await p.title(), n = await p.evaluate(() => [window.Readiness2.pdfName('result'), window.Readiness2.pdfName('answers'), window.Readiness2.pdfName('file').replace(/\.pdf$/, '.json')]);
    ok(t === 'Can AI solve your problems?' && n.every(x => /^Can-AI-solve-your-problems_Hotel-Test_\d{4}-\d{2}-\d{2}(_result\.pdf|_answers\.pdf|\.json)$/.test(x)), 'BUILD NOW 1: title and file names', { t, n });
    await ctx.close();
  },
  /* 2: storage blocked: the banner and a Copy saved check button on every step */
  async B2(b) {
    const { ctx, p } = await page(b, { init: blockLS, vp: { width: 360, height: 740 } });
    const seen = [];
    const look = async tag => { const s = await st(p); seen.push(tag + ':' + s.storage + ':' + !!(await p.$('#not-saved')) + ':' + !!(await p.$('#copy-saved'))); };
    await look('cover');
    await p.click('#begin'); await look('1'); await p.selectOption('#h-type', 'independent'); await p.click('#next'); await look('2');
    for (const q of ['q1-n', 'q2-y', 'q3-y', 'q4-y', 'q5-y']) await p.click('label[for="a-' + q + '"]');
    await p.click('#next'); await look('3'); await p.click('#next'); await look('4');
    await p.click('#cat-administrative'); await p.click('#dept-hr'); await p.click('label[for="u-hr-1"] .ucn'); await p.click('#next'); await look('5');
    await p.click('#copy-saved'); await wait(200);
    const line = await p.textContent('#not-saved');
    ok(seen.every(x => /:blocked:true:true$/.test(x)) && /Copy saved check below, or Save as file on the result page/.test(line), 'BUILD NOW 2: banner and #copy-saved on the cover and steps 1 to 5', seen);
    const cover = await p.evaluate(() => { window.Readiness2.send('new', { same: true }); return document.getElementById('cover-count') && document.getElementById('cover-count').textContent; });
    ok(cover && !/stop and come back/.test(cover), 'BUILD NOW 6: storage blocked: no "You can stop and come back"', cover);
    await ctx.close();
  },
  /* 3: the public flag: window.storage present but never used (public build only; on the artifact build it is used) */
  async B3(b) {
    const { ctx, p } = await page(b, { init: () => { window.__wsCalls = 0; window.storage = { get: () => { window.__wsCalls++; return Promise.resolve(null); }, set: () => { window.__wsCalls++; return Promise.resolve(); } }; } });
    await toStep2(p, 'X'); await p.click('label[for="a-q1-n"]'); await wait(300);
    const calls = await p.evaluate(() => window.__wsCalls);
    ok(calls > 0, 'artifact build: window.storage is used when present (' + calls + ' calls)');
    await ctx.close();
  },
  async B3pub(b) {
    const { ctx, p } = await page(b, { init: () => { window.__wsCalls = 0; window.storage = { get: () => { window.__wsCalls++; return Promise.resolve(null); }, set: () => { window.__wsCalls++; return Promise.resolve(); } }; window.claude = { use: () => { window.__wsCalls++; return Promise.resolve(null); } }; } });
    await toStep2(p, 'X'); await p.click('label[for="a-q1-n"]'); await wait(300);
    const calls = await p.evaluate(() => window.__wsCalls), s = await st(p);
    ok(calls === 0 && s.downloadRoute === 'link', 'BUILD NOW 3: public build: window.storage and window.claude are never used', { calls, route: s.downloadRoute });
    await ctx.close();
  },
  /* 4: the blob-link toast (plain browser tab) */
  async B4(b) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, acceptDownloads: true });
    await ctx.addInitScript(([k, v]) => { if (!sessionStorage.getItem('__seeded')) { sessionStorage.setItem('__seeded', '1'); localStorage.setItem(k, v); } }, [KEY, FX.one]);
    const { p } = await page(b, { ctx });
    const dl = p.waitForEvent('download'); await p.click('#pdf'); await dl; await wait(200);
    const t = await p.textContent('#toast');
    ok(/^Download started: Can-AI-solve-your-problems_.*_result\.pdf\. If no file appears, use Copy plan or Open printable page below\.$/.test(t.trim()), 'BUILD NOW 4: the blob-link toast', t);
    await ctx.close();
  },
  /* 5: an h1 on every step and on the stop screen; 6: the cover's question count */
  async B5(b) {
    const { ctx, p } = await page(b);
    const h1 = async () => p.$$eval('h1', e => e.map(x => x.textContent.trim()));
    const out = [];
    const cover = await p.textContent('#cover-count');
    out.push(['cover', await h1()]);
    await p.click('#begin'); out.push(['1', await h1()]); await p.selectOption('#h-type', 'independent'); await p.click('#next'); out.push(['2', await h1()]);
    for (const q of ['q1-n', 'q2-y', 'q3-y', 'q4-y', 'q5-y']) await p.click('label[for="a-' + q + '"]');
    await p.click('#next'); out.push(['3', await h1()]); await p.click('#next'); out.push(['4', await h1()]);
    await p.click('#cat-administrative'); await p.click('#dept-hr'); await p.click('label[for="u-hr-1"] .ucn'); await p.click('#next'); out.push(['5', await h1()]);
    await p.click('#next'); out.push(['result', await h1()]);
    await p.click('#edit'); await p.click('label[for="a-q1-y"]'); await p.click('#next'); out.push(['stop', await h1()]);
    ok(out.every(x => x[1].length === 1), 'BUILD NOW 5: exactly one h1 on the cover, steps 1 to 5, the result and the stop screen', out);
    ok(/^In all, 21 to 27 questions, depending on the use case\. You can stop and come back\.$/.test(cover.trim()), 'BUILD NOW 6: the cover\'s count', cover);
    await ctx.close();
  }
};

(async () => {
  await fixtures();
  const b = await chromium.launch();
  /* v2.8.1: never let a test reach the owner's collect address (public build): every request to Apps Script is answered here */
  { const nc = b.newContext.bind(b); b.newContext = async o => { const c = await nc(o); await c.route(/^https:\/\/script\.google(usercontent)?\.com\//, r => r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })); return c; }; }
  const pg = await b.newPage(); await pg.goto(URL0); await pg.waitForSelector('#app[data-state]');
  const isPublic = await pg.evaluate(() => !!window.R2_PUBLIC); await pg.close();
  const only = process.argv[2];
  for (const [id, fn] of Object.entries(CASES)) {
    if (only && only !== id) continue;
    if (isPublic && ARTIFACT_ONLY.has(id)) continue;
    if (!isPublic && id === 'B3pub') continue;
    try { await fn(b); } catch (e) { ok(false, id + ': script error: ' + String(e).split('\n').slice(0, 3).join(' | ')); }
  }
  await b.close();
  console.log('v281 browser (' + (isPublic ? 'public' : 'artifact') + ' build): ' + pass + ' passed, ' + fail + ' failed');
  if (fail) process.exit(1);
})();
