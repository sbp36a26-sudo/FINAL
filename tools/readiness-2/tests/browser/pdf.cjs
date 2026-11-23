// Do you need AI? (formerly Readiness 2.0) v1.1 PDF proof; v1.2: file names start with Do-you-need-AI_ (owner B1) (Playwright): standalone and inside the hub (local link fallback, and a fake downloads capability for the hub's save path), 1280 and 390 px; summary and stop screen. Serve tools/ with: python3 -m http.server 8809 --bind 127.0.0.1; PDFs and screenshots go to OUT (env R2_PDF_OUT, default ./pdf-out).
const { chromium } = require('playwright');
const fs = require('fs');
const OUT = process.env.R2_PDF_OUT || __dirname + '/pdf-out', BASE = process.env.R2_BASE || 'http://127.0.0.1:8809/';
fs.mkdirSync(OUT, { recursive: true });
let pass = 0, fail = 0;
const ok = (c, n) => { if (c) pass++; else { fail++; console.log('FAIL  ' + n); } };
const HOTEL = 'Hôtel “Les Mélèzes” › Zürich';
const PLAN = {
  Q: { q1: 'y', q2: 'y', q3: 'n', q4: 'n', q5: 'u' },
  A2: { b1: 'y', b3: 'pl', b5: 'n', b8: 'y', b9: 'p', b2: 'k', b4: 'y', b6: 'y', b7: 'n', b10: 'y' },
  A3: { c1: 'y', c2: 'p', c3: 'n', c4: 'k', c5: 'y', c6: 'pl', c7: 'y', c8: 'y', c9: 'n' }
};
const initProfile = `try { localStorage.setItem('hftp-hotel-profile-v1', JSON.stringify({ name: ${JSON.stringify(HOTEL)} })); } catch (e) {}`;
// Top page only: a fake artifact downloads capability, so the hub path { hub:'download' } → save() can be proved.
const fakeCap = `if (window.top === window && location.pathname.endsWith('/index.html') && location.search.includes('cap=1')) {
  window.__saved = [];
  window.claude = { use: n => n === 'downloads' ? Promise.resolve({ save: o => new Promise(res => { const r = new FileReader(); r.onload = () => { window.__saved.push({ filename: o.filename, b64: String(r.result).split(',')[1] }); res(); }; r.readAsDataURL(o.data); }) }) : Promise.reject({ code: 'unavailable' }) };
}`;

async function walkTo(f, tag) {
  await f.evaluate(P => {
    const R = window.Readiness2;
    if (R.state().step !== 'start') { R.send('restart'); R.send('restart-yes'); }
    R.send('begin'); for (const [id, value] of Object.entries(P.Q)) R.send('answer', { id, value });
    R.send('next'); R.send('cat', 'Guest-facing'); R.send('dept', 'fo'); R.send('use', 'fo-1'); R.send('next');
    for (const [id, value] of Object.entries(P.A2)) R.send('answer', { id, value });
    R.send('by', { id: 'b3', date: '2027-02-03' }); R.send('next');
    for (const [id, value] of Object.entries(P.A3)) R.send('answer', { id, value }); R.send('next');
  }, PLAN);
  ok((await f.evaluate(() => window.Readiness2.state().step)) === 'summary', tag + ': on the summary');
}
async function observeDl(f) { await f.evaluate(() => { window.__dl = []; const app = document.getElementById('app'); new MutationObserver(rs => rs.forEach((r, i) => { window.__dl.push(r.oldValue); })).observe(app, { attributes: true, attributeOldValue: true, attributeFilter: ['data-dl'] }); window.__dlNow = () => window.__dl.concat([app.getAttribute('data-dl')]); }); }

async function run(b, w, touch, inHub, viaCap) {
  const tag = (inHub ? (viaCap ? 'hub+save' : 'hub') : 'standalone') + '-' + w;
  const ctx = await b.newContext({ viewport: { width: w, height: touch ? 844 : 900 }, hasTouch: touch, isMobile: touch, acceptDownloads: true });
  await ctx.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await ctx.addInitScript(initProfile); await ctx.addInitScript(fakeCap);
  const p = await ctx.newPage(), errs = [], ext = [];
  p.on('pageerror', e => errs.push(String(e)));
  p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|ERR_FAILED/.test(m.text())) errs.push(m.text()); });
  p.on('request', r => { if (!r.url().startsWith(BASE) && !/^(blob|data):/.test(r.url()) && !/fonts\.(googleapis|gstatic)/.test(r.url())) ext.push(r.url()); });
  let f;
  if (inHub) {
    await p.goto(BASE + 'index.html' + (viaCap ? '?cap=1' : ''));
    await p.evaluate(() => window.HFTPHub.send({ type: 'select', tool: 'readiness-2' }));
    await p.waitForFunction(() => [...document.querySelectorAll('iframe')].some(x => x.contentWindow && x.contentWindow.Readiness2));
    f = p.frames().find(x => x.url().includes('readiness-2/index.html'));
    await f.waitForFunction(() => document.getElementById('app').getAttribute('data-bridge') !== 'pending', null, { timeout: 15000 });
    ok((await f.evaluate(() => window.Readiness2.state().bridge)) === (viaCap ? 'yes' : 'no'), tag + ': bridge answered ' + (await f.evaluate(() => window.Readiness2.state().bridge)));
  } else {
    await p.goto(BASE + 'readiness-2/index.html');
    f = p.mainFrame();
    ok((await f.evaluate(() => window.Readiness2.state().bridge)) === 'none', tag + ': bridge none outside the hub');
  }
  await walkTo(f, tag);

  // summary buttons: primary stays "Check one tool in detail"; the PDF button sits next to the other actions
  const ids = await f.$$eval('#handover .btnrow > *', els => els.map(e => e.id + ':' + e.className));
  ok(ids[0] === 'check-one:btn primary' && ids[1] === 'pdf:btn' && ids.includes('copy:btn'), tag + ': summary buttons ' + ids.join(' '));
  ok((await f.textContent('#pdf')) === 'Download the assessment (PDF)', tag + ': summary button label');
  // the PDF says what the summary shows
  const m = await f.evaluate(() => window.Readiness2.pdfModel());
  const lead = t => { const i = m.blocks.findIndex(b => b.k === 'h' && b.t === t); return m.blocks[i + 1].t; };
  ok(lead('3. What you need') === (await f.textContent('#count-needs')) && lead('4. What makes it succeed') === (await f.textContent('#count-success')), tag + ': counts = summary screen');
  const ovT = await f.textContent('#overall');
  ok(m.blocks.some(b => b.k === 'lead' && b.t === ovT), tag + ': overall = summary screen');
  ok(lead('1. Is this an AI problem?') === (await f.textContent('#verdict-head')), tag + ': verdict = summary screen');
  const first3 = await f.$$eval('#first3 li', ls => ls.map(l => l.childNodes[0].textContent));
  ok(JSON.stringify(m.blocks.filter(b => b.k === 'num').map(b => b.t)) === JSON.stringify(first3), tag + ': the three = summary screen');
  ok(m.blocks.some(b => b.t === 'Hotel: ' + HOTEL), tag + ': hotel name from the shared profile');

  // download from the summary; double click → one download
  await observeDl(f);
  const extBefore = ext.length;
  let name, file;
  if (viaCap) {
    await f.click('#pdf'); await f.click('#pdf', { force: true }).catch(() => {});
    await p.waitForFunction(() => window.__saved && window.__saved.length >= 1, null, { timeout: 15000 });
    await p.waitForTimeout(600);
    const saved = await p.evaluate(() => window.__saved);
    ok(saved.length === 1, tag + ': one save for two clicks (' + saved.length + ')');
    name = saved[0].filename; file = OUT + '/' + tag + '-summary.pdf'; fs.writeFileSync(file, Buffer.from(saved[0].b64, 'base64'));
  } else {
    const dls = []; p.on('download', d => dls.push(d));
    const wait = p.waitForEvent('download', { timeout: 15000 });
    await f.click('#pdf'); await f.click('#pdf', { force: true, timeout: 1500 }).catch(() => {});
    const d = await wait; await p.waitForTimeout(800);
    ok(dls.length <= 1, tag + ': one download for two clicks (' + dls.length + ')');
    name = d.suggestedFilename(); file = OUT + '/' + tag + '-summary.pdf'; await d.saveAs(file);
  }
  const today = new Date().toISOString().slice(0, 10);
  ok(name === 'Do-you-need-AI_Hotel-Les-Melezes-Zurich_' + today + '.pdf', tag + ': file name ' + name);
  ok(fs.readFileSync(file).slice(0, 5).toString() === '%PDF-', tag + ': a PDF file');
  await f.waitForFunction(() => window.Readiness2.state().download === 'idle');
  const seen = await f.evaluate(() => window.__dlNow());
  ok(seen[0] === 'idle' && seen[1] === 'making' && seen.includes('saving') && seen[seen.length - 1] === 'idle', tag + ': download states ' + seen.join('>'));
  ok(!(await f.isDisabled('#pdf')) && (await f.textContent('#pdf')) === 'Download the assessment (PDF)', tag + ': button back to ready');
  ok(ext.length === extBefore, tag + ': no external request for the PDF ' + ext.slice(extBefore).join(' '));
  ok(await f.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), tag + ': no horizontal scroll on the summary');
  await p.screenshot({ path: OUT + '/' + tag + '-summary.png', fullPage: !inHub });

  // stop screen
  await f.evaluate(() => { const R = window.Readiness2; R.send('restart'); R.send('restart-yes'); R.send('begin'); R.send('answer', { id: 'q1', value: 'n' }); R.send('answer', { id: 'q3', value: 'u' }); R.send('next'); });
  ok((await f.evaluate(() => window.Readiness2.state().step)) === 'stop', tag + ': on the stop screen');
  const sb = await f.$$eval('#stopcard .btnrow > *', els => els.map(e => e.id + ':' + e.className + ':' + e.textContent));
  ok(sb.length === 3 && sb[0].startsWith('change:btn primary') && sb[2] === 'pdf:btn:Download (PDF)', tag + ': stop buttons ' + sb.join(' | '));
  if (viaCap) {
    await f.click('#pdf'); await p.waitForFunction(() => window.__saved.length >= 2, null, { timeout: 15000 });
    const s2 = (await p.evaluate(() => window.__saved))[1]; name = s2.filename; file = OUT + '/' + tag + '-stop.pdf'; fs.writeFileSync(file, Buffer.from(s2.b64, 'base64'));
  } else {
    const wait = p.waitForEvent('download', { timeout: 15000 }); await f.click('#pdf'); const d = await wait;
    name = d.suggestedFilename(); file = OUT + '/' + tag + '-stop.pdf'; await d.saveAs(file);
  }
  ok(/^Do-you-need-AI_Hotel-Les-Melezes-Zurich_\d{4}-\d{2}-\d{2}\.pdf$/.test(name), tag + ': stop file name ' + name);
  ok((await f.evaluate(() => window.Readiness2.state().step)) === 'stop', tag + ': still on the stop screen after the download');
  ok(await f.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), tag + ': no horizontal scroll on the stop screen');
  const small = await f.$$eval('#stopcard .btnrow > *', els => els.filter(e => e.getBoundingClientRect().height < 43.5).length);
  ok(small === 0, tag + ': 44 px targets on the stop screen');
  await p.screenshot({ path: OUT + '/' + tag + '-stop.png', fullPage: !inHub });
  ok(errs.length === 0, tag + ': no console errors ' + errs.join(' | '));
  await ctx.close();
}

(async () => {
  const b = await chromium.launch();
  for (const [w, touch] of [[1280, false], [390, true]]) {
    await run(b, w, touch, false, false);
    await run(b, w, touch, true, false);
    await run(b, w, touch, true, true);
  }
  await b.close();
  console.log(pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
