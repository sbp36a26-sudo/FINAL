// Browser proof for "Do you need AI?" v2.5.1 (24 Nov 2026), desktop 1280 and phone 390:
// 1. links (v2.6, replacing the v2.5.1 link bridge): inside the hub the readiness-2 detail layer is drawn by the hub on its main page
//    and a source name there opens its url; the catalogue and the register keep plain links and send nothing; standalone, links
//    are ordinary links (a popup fires);
// 2. the result's "Is this an AI problem?" card: five rows (title, answer, meaning), the verdict word, no big empty box;
// 3. screenshots (deviceScaleFactor 2) to reports/readiness-2-screens/v25/ (v251-*.png).
// The real claude.ai sandbox cannot be tested locally.
// Serve tools/ first:  python3 -m http.server 8831 --bind 127.0.0.1   (R2_BASE sets another address)
// Run from tools/ so playwright resolves:  node readiness-2/tests/browser/v251.cjs
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const BASE = process.env.R2_BASE || 'http://127.0.0.1:8831/';
const OUT = process.env.R2_SHOTS || path.join(__dirname, '..', '..', '..', '..', 'reports', 'readiness-2-screens', 'v25');
fs.mkdirSync(OUT, { recursive: true });
let pass = 0, fail = 0; const ok = (c, n) => { if (c) pass++; else { fail++; console.log('FAIL  ' + n); } };

async function mk(b, w, touch) {
  const ctx = await b.newContext({ viewport: { width: w, height: touch ? 844 : 900 }, hasTouch: touch, isMobile: touch, deviceScaleFactor: 2 });
  await ctx.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  // External pages are never loaded: the popup still fires, which is what is tested.
  await ctx.route(u => !/^http:\/\/127\.0\.0\.1/.test(String(u)), r => r.fulfill({ status: 200, contentType: 'text/html', body: '<title>external</title>' }));
  const p = await ctx.newPage(); p._errs = [];
  p.on('pageerror', e => p._errs.push(String(e)));
  p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|ERR_FAILED/.test(m.text())) p._errs.push(m.text()); });
  return { ctx, p };
}
async function fill(f, o) {
  await f.evaluate(o => {
    const R = window.Readiness2;
    R.send('begin'); R.send('hotel', { k: 'type', v: 'independent' }); R.send('hotel', { k: 'name', v: 'Hotel Fixture' }); R.send('next');
    const Q = Object.assign({ q1: 'n', q2: 'y', q3: 'y', q4: 'y', q5: 'y' }, o.Q || {}); /* v2.6: Q1 No goes on */ Object.keys(Q).forEach(id => R.send('answer', { id, value: Q[id] })); R.send('next');
    for (let i = 1; i <= 10; i++) R.send('answer', { id: 'm' + i, value: 'y' });
    R.send('next');
    const use = o.use || 'gx-2', D = { 'gx-2': ['Guest-facing', 'gx'], 'gx-1': ['Guest-facing', 'gx'] }[use];
    R.send('cat', D[0]); R.send('dept', D[1]); R.send('use', use);
    if (o.where) return;
    R.send('next');
    R.state().tailored.forEach(id => R.send('answer', { id, value: 'y' })); R.send('next');
  }, o);
  await f.waitForTimeout(80);
}
/* The hub's side, recorded in the top document: link messages received and top-level anchors clicked. */
const spyHub = p => p.evaluate(() => {
  window.__links = []; window.__clicked = [];
  addEventListener('message', e => { if (e.data && e.data.hub === 'link') window.__links.push(e.data.url); }, true);
  const c = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () { if (this.ownerDocument === document) window.__clicked.push({ href: this.href, target: this.target, rel: this.rel, inDoc: document.body.contains(this) }); return c.call(this); };
});
const hubFrame = async (p, tool) => {
  const h = await p.waitForSelector('#hubFrame iframe[title="' + tool + '"]', { state: 'attached' });
  const f = await h.contentFrame(); await f.waitForLoadState('load'); await p.waitForFunction(t => { const x = document.querySelector('#hubFrame iframe[title="' + t + '"]'); return x && x.contentWindow.location.pathname.includes('/' + t + '/') && x.contentDocument.readyState === 'complete'; }, tool);
  return h.contentFrame();
};

(async () => {
  const b = await chromium.launch({ args: ['--disable-features=LocalNetworkAccessChecks,PrivateNetworkAccessRespectPreflightResults'] });

  for (const [w, touch, tag] of [[1280, false, 'desktop'], [390, true, 'phone']]) {
    // ---------- 1. inside the hub (v2.6: changed expectation, the link bridge is gone) ----------
    // readiness-2: the hub draws the detail layer on its main page, where a source name is a real link (tests/browser/v26.cjs
    // proves the layer in full). The catalogue and the register keep plain links: no message is sent, the browser opens them.
    {
      const { ctx, p } = await mk(b, w, touch);
      await p.goto(BASE + 'index.html'); await spyHub(p);
      await p.click('#hubBar button[data-tool="readiness-2"]');
      const f = await hubFrame(p, 'readiness-2');
      await f.waitForFunction(() => window.Readiness2 && window.Readiness2.state().inHub === true, null, { timeout: 15000 });
      await fill(f, { where: true, use: 'gx-2' });
      await f.click('[data-act="detail"][data-detail="gx-2"]'); await p.waitForSelector('#hub-detail[open] #hub-detail-srcs');
      ok(!(await f.evaluate(() => document.querySelector('#detail').open)), tag + ' hub/readiness-2: the frame does not draw its own layer');
      const types = await p.$$eval('#hub-detail-srcs li', l => l.map(x => x.getAttribute('data-src')));
      ok(types.includes('c') && types.includes('h') && types.includes('r'), tag + ': gx-2 shows company, hotel and study sources');
      const sel = '#hub-detail-srcs li a', href = await p.$eval(sel, a => a.href);
      const [pop] = await Promise.all([ctx.waitForEvent('page', { timeout: 5000 }).catch(() => null), p.click(sel)]);
      ok(pop && pop.url() === href, tag + ' hub/readiness-2: the source name on the main page opens its url (' + (pop && pop.url()) + ')');
      if (pop) await pop.close().catch(() => {});
      ok((await p.evaluate(() => window.__links.length)) === 0, tag + ' hub/readiness-2: no { hub: "link" } message');
      if (!touch) await p.screenshot({ path: path.join(OUT, 'v251-detail-gx2-hub-desktop.png') });
      await p.keyboard.press('Escape'); await p.waitForFunction(() => !document.querySelector('#hub-detail[open]'));
      // the catalogue in the hub: a plain link, nothing sent to the hub
      await p.click('#hubBar button[data-tool="use-case-catalogue"]');
      const cf = await hubFrame(p, 'use-case-catalogue');
      await cf.waitForFunction(() => window.Catalogue); await cf.evaluate(() => window.Catalogue.go('rm')); await cf.waitForTimeout(300);
      await cf.waitForSelector('#d-rm .usrc a[target="_blank"]', { state: 'attached' });
      await cf.$eval('#d-rm .usrc a[target="_blank"]', a => a.scrollIntoView());
      const ch = await cf.$eval('#d-rm .usrc a[target="_blank"]', a => a.href);
      const [cpop] = await Promise.all([ctx.waitForEvent('page', { timeout: 5000 }).catch(() => null), cf.click('#d-rm .usrc a[target="_blank"]')]);
      ok(cpop && cpop.url() === ch && (await p.evaluate(() => window.__links.length)) === 0, tag + ' hub/catalogue: a plain link (opens locally), no message to the hub (' + ch + ')');
      if (cpop) await cpop.close().catch(() => {});
      // the AI Register in the hub (the watch list's law links)
      await p.click('#hubBar button[data-tool="register"]');
      const rf = await hubFrame(p, 'register');
      await rf.waitForFunction(() => window.HotelAIRegister); await rf.waitForTimeout(400);
      await rf.click('#tab-watch'); await rf.waitForSelector('.wcard a[target="_blank"]');
      const rh = await rf.$eval('.wcard a[target="_blank"]', a => a.href);
      const [rpop] = await Promise.all([ctx.waitForEvent('page', { timeout: 5000 }).catch(() => null), rf.click('.wcard a[target="_blank"]')]);
      ok(rpop && rpop.url() === rh && (await p.evaluate(() => window.__links.length)) === 0, tag + ' hub/register: a plain link (opens locally), no message to the hub (' + rh + ')');
      if (rpop) await rpop.close().catch(() => {});
      ok(!(await p.$('#hub-link')), tag + ' hub: no link panel');
      ok(!p._errs.length, tag + ' hub: no page errors ' + JSON.stringify(p._errs.slice(0, 3)));
      await ctx.close();
    }
    // ---------- 2. standalone: ordinary links ----------
    {
      const { ctx, p } = await mk(b, w, touch);
      await p.goto(BASE + 'readiness-2/index.html'); await p.waitForFunction(() => window.Readiness2);
      ok((await p.evaluate(() => window.Readiness2.state().inHub)) === false, tag + ' standalone: not in the hub');
      await fill(p, { where: true, use: 'gx-1' });
      await p.click('[data-act="detail"][data-detail="gx-1"]'); await p.waitForSelector('#detail[open] #detail-srcs');
      const types = await p.$$eval('#detail-srcs li', l => l.map(x => x.getAttribute('data-src')));
      ok(types.includes('l') && types.includes('r') && types.includes('c'), tag + ': gx-1 shows company, link and study sources');
      const texts = await p.$$eval('#detail-srcs li', l => l.map(x => { const c = x.cloneNode(true); const a = c.querySelector('.srcaddr'); if (a) a.remove(); return c.textContent; }));
      ok(await p.$$eval('#detail-srcs li', l => l.every(x => !x.querySelector('a') || (x.querySelector('.srcurl') && x.querySelector('.srcurl').textContent === x.querySelector('a').href))), tag + ': each linked source also shows its address, selectable, with Copy address');
      ok(texts.every(t => !/https?:\/\//.test(t)) && texts.every(t => !/^\s*[SP]\d+\b/.test(t)), tag + ': no URL as text outside the address line, no bare study key');
      if (!touch) await p.screenshot({ path: path.join(OUT, 'v251-detail-gx1-desktop.png') });
      else await p.screenshot({ path: path.join(OUT, 'v251-detail-gx1-phone.png') });
      const sel = '#detail-srcs li[data-src="l"] a', href = await p.$eval(sel, a => a.href);
      const [pop] = await Promise.all([ctx.waitForEvent('page', { timeout: 5000 }).catch(() => null), p.click(sel)]);
      ok(pop && pop.url() === href, tag + ' standalone: an ordinary link opens a new tab (' + (pop && pop.url()) + ')');
      await ctx.close();
    }
    // ---------- 3. the "Is this an AI problem?" card ----------
    for (const [name, Q, head] of [['notsure', { q1: 'u', q4: 'u' }, 'Find out first.'], ['no', { q4: 'n', q5: 'n' }, 'A rule-based tool or a person is the better choice.'] /* v2.6: Q4 before Q5 */]) {
      const { ctx, p } = await mk(b, w, touch);
      await p.goto(BASE + 'readiness-2/index.html'); await p.waitForFunction(() => window.Readiness2);
      await fill(p, { Q, use: 'gx-2' });
      ok((await p.evaluate(() => window.Readiness2.state().step)) === 'result', tag + ' ' + name + ': on the result');
      const rows = await p.$$eval('#ai-rows li', l => l.map(x => ({ q: x.getAttribute('data-q'), a: x.getAttribute('data-a'), t: x.textContent.replace(/\s+/g, ' ').trim() })));
      ok(rows.length === 5 && rows.map(r => r.t.split(/Yes|No|Not sure/)[0].trim()).join('|') === 'Complex judgement|Return|Information to learn from|Some mistakes are acceptable|Proof', tag + ' ' + name + ': five rows with titles ' + JSON.stringify(rows.map(r => r.t.slice(0, 24))));
      ok((await p.$eval('#ai-head', e => e.textContent)) === head, tag + ' ' + name + ': the verdict word ' + head);
      if (name === 'notsure') ok(/To find out: yes if/.test(rows[0].t) && /Ask the vendor or IT\./.test(rows[0].t) && /Ask the department head\./.test(rows[3].t) && /^Return ?Yes ?Met:/.test(rows[1].t), tag + ': Not sure rows say what to find out and whom to ask');
      else ok(/A rule-based tool or a person is the better choice\./.test(rows[3].t) && /Define success first\./.test(rows[4].t), tag + ': No rows give the consequence (v2.6: Q4 No = a rule-based tool or a person)');
      const g = await p.evaluate(() => { const a = document.getElementById('sum-ai').getBoundingClientRect(), w = document.getElementById('sum-where').getBoundingClientRect(), last = document.querySelector('#ai-rows li:last-child').getBoundingClientRect();
        return { aw: a.width, ww: w.width, stacked: w.top >= a.bottom - 1, slack: a.bottom - last.bottom, noH: document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1 }; });
      ok(g.stacked && Math.abs(g.aw - g.ww) < 2 && g.slack < 60 && g.noH, tag + ' ' + name + ': the card is full width above "Where it sits", sized to content (slack ' + Math.round(g.slack) + 'px), no sideways scroll');
      const el = await p.$('.sumgrid'); await el.scrollIntoViewIfNeeded();
      await el.screenshot({ path: path.join(OUT, 'v251-ai-card-' + name + '-' + tag + '.png') });
      ok(!p._errs.length, tag + ' ' + name + ': no page errors ' + JSON.stringify(p._errs.slice(0, 3)));
      await ctx.close();
    }
  }
  await b.close();
  console.log('v251 browser: ' + pass + ' passed, ' + fail + ' failed');
  if (fail) process.exit(1);
})();
