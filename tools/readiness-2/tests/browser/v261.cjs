// Browser proof for "Do you need AI?" v2.6.1: clean-up inventory v4 (reports/audit-readiness-2/cleanup_inventory_v4.md).
// Each check below reproduced a fault of v2.6 (it failed on commit eebd0d9) and passes after the fix.
//  B1  the hub's detail layer stays open over the tool after the tool's own step or check changed (browser or phone Back,
//      a #use= link, another tab removing the check): the frame closed its layer state without telling the hub.
//  B2  the hub's layer stays open after the tool's frame reloads under it (the new page knows nothing of it).
//  B3  a page whose store was saved by a newer version in another tab (storage event) wrote its own older store over it.
//  B4  a store written by an older page in another tab (v2.5 or earlier: records without qv) turned question 1 round a
//      second time on the checks this tab already held in the v2.6 meaning.
// Desktop 1280 and phone 390. Serve tools/ first:  python3 -m http.server 8815 --bind 127.0.0.1   (R2_BASE for another address)
// Run from tools/:  node readiness-2/tests/browser/v261.cjs
const { chromium } = require('playwright');
const BASE = process.env.R2_BASE || 'http://127.0.0.1:8815/';
const KEY = 'hftp-readiness2-v1';
let pass = 0, fail = 0; const ok = (c, n) => { if (c) pass++; else { fail++; console.log('FAIL  ' + n); } };

async function mk(b, w, touch) {
  const ctx = await b.newContext({ viewport: { width: w, height: touch ? 844 : 900 }, hasTouch: touch, isMobile: touch });
  await ctx.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  const p = await ctx.newPage(); p._errs = [];
  p.on('pageerror', e => p._errs.push(String(e)));
  p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|ERR_FAILED/.test(m.text())) p._errs.push(m.text()); });
  return { ctx, p };
}
const st = f => f.evaluate(() => window.Readiness2.state());
async function toWhere(f) {
  await f.evaluate(() => {
    const R = window.Readiness2;
    R.send('begin'); R.send('hotel', { k: 'type', v: 'independent' }); R.send('next');
    ['q2', 'q3', 'q4', 'q5'].forEach(id => R.send('answer', { id, value: 'y' })); R.send('answer', { id: 'q1', value: 'n' }); R.send('next');
    for (let i = 1; i <= 10; i++) R.send('answer', { id: 'm' + i, value: 'y' });
    R.send('next'); R.send('cat', 'Guest-facing'); R.send('dept', 'gx');
  });
  await f.waitForTimeout(80);
}
async function hubOpen(p) {
  await p.goto(BASE + 'index.html'); await p.click('#hubBar button[data-tool="readiness-2"]');
  const h = await p.waitForSelector('#hubFrame iframe[title="readiness-2"]'); const f = await h.contentFrame();
  await f.waitForFunction(() => window.Readiness2 && window.Readiness2.state().inHub === true, null, { timeout: 15000 });
  return { h, f };
}
const hubOpenLayer = p => p.evaluate(() => !!document.querySelector('#hub-detail[open]'));
const hubDetail = p => p.evaluate(() => window.HFTPHub.state().detail);

(async () => {
  const b = await chromium.launch({ args: ['--disable-features=LocalNetworkAccessChecks,PrivateNetworkAccessRespectPreflightResults'] });
  for (const [w, touch, wt] of [[1280, false, 'desktop'], [390, true, 'phone']]) {
    // ---------- B1: browser (phone) Back while the hub draws the layer ----------
    {
      const { ctx, p } = await mk(b, w, touch); const { f } = await hubOpen(p);
      await toWhere(f);
      await f.click('#dt-gx-2'); await p.waitForSelector('#hub-detail[open]');
      ok((await hubDetail(p)) && (await hubDetail(p)).id === 'gx-2', wt + ' B1: the hub draws the layer');
      await p.evaluate(() => history.back()); await p.waitForTimeout(500);
      const s = await st(f);
      ok(s.step === 'must' && s.detail === null, wt + ' B1: Back moved the tool to step 3 and the tool dropped its layer (' + s.step + ')');
      ok(!(await hubOpenLayer(p)) && (await hubDetail(p)) === null, wt + ' B1: Back also closes the layer the hub drew (it no longer stands over step 3)');
      ok((await p.evaluate(() => document.activeElement && document.activeElement.tagName)) === 'IFRAME' && (await f.evaluate(() => document.activeElement && document.activeElement.id)) === 'view', wt + ' B1: focus is in the tool, on the new step');
      if (await hubOpenLayer(p)) { await p.click('#hub-detail-close'); await p.waitForTimeout(150); } // v2.6: the stale layer blocks the tool until Esc
      // a #use= link (a hash change in the frame) while the layer is open: a new check, the layer closes
      await p.evaluate(() => history.forward()); await p.waitForTimeout(500);
      ok((await st(f)).step === 'where', wt + ' B1: Forward back on step 4');
      await f.click('#dt-gx-4'); await p.waitForSelector('#hub-detail[open]');
      await f.evaluate(() => { location.hash = '#use=hr-2'; }); await p.waitForTimeout(400);
      const s2 = await st(f);
      ok(s2.use === 'hr-2' && s2.step === 'start' && s2.detail === null, wt + ' B1: #use=hr-2 started a new check (' + s2.use + ', ' + s2.step + ')');
      ok(!(await hubOpenLayer(p)) && (await hubDetail(p)) === null, wt + ' B1: a #use= link also closes the layer the hub drew');
      if (await hubOpenLayer(p)) { await p.click('#hub-detail-close'); await p.waitForTimeout(150); }
      // after it closed, the layer opens again normally
      await f.evaluate(() => { const R = window.Readiness2; R.send('begin'); R.send('hotel', { k: 'type', v: 'independent' }); R.send('next'); ['q2', 'q3', 'q4', 'q5'].forEach(id => R.send('answer', { id, value: 'y' })); R.send('answer', { id: 'q1', value: 'n' }); R.send('next'); for (let i = 1; i <= 10; i++) R.send('answer', { id: 'm' + i, value: 'y' }); R.send('next'); });
      await f.waitForTimeout(100);
      await f.click('#dt-hr-2'); await p.waitForSelector('#hub-detail[open]');
      ok((await hubDetail(p)).id === 'hr-2', wt + ' B1: the layer opens again afterwards');
      await p.keyboard.press('Escape'); await p.waitForFunction(() => !document.querySelector('#hub-detail[open]'));
      await f.waitForFunction(() => window.Readiness2.state().detail === null);
      ok((await f.evaluate(() => document.activeElement && document.activeElement.id)) === 'dt-hr-2', wt + ' B1: Esc still returns focus to the opener');
      ok(!p._errs.length, wt + ' B1: no page errors ' + p._errs.join(' | '));
      await ctx.close();
    }
    // ---------- B1: another tab removes the open check while the hub draws the layer ----------
    {
      const { ctx, p } = await mk(b, w, touch); const { f } = await hubOpen(p);
      await toWhere(f);
      const id = (await st(f)).id;
      await f.click('#dt-gx-2'); await p.waitForSelector('#hub-detail[open]');
      const p2 = await ctx.newPage(); await p2.goto(BASE + 'readiness-2/index.html'); await p2.waitForFunction(() => window.Readiness2);
      await p2.evaluate(id => { const s = JSON.parse(localStorage.getItem('hftp-readiness2-v1')); delete s.checks[id]; s.cur = Object.keys(s.checks)[0] || ''; localStorage.setItem('hftp-readiness2-v1', JSON.stringify(s)); }, id);
      await p.waitForTimeout(400);
      ok((await st(f)).elsewhere === 'removed' && (await st(f)).detail === null, wt + ' B1: the tool heard that another tab removed its check and dropped its layer');
      ok(!(await hubOpenLayer(p)), wt + ' B1: ... and the hub\'s layer closed with it');
      await ctx.close();
    }
    // ---------- B2: the frame reloads under the hub's layer ----------
    {
      const { ctx, p } = await mk(b, w, touch); const { h, f } = await hubOpen(p);
      await toWhere(f);
      await f.click('#dt-gx-2'); await p.waitForSelector('#hub-detail[open]');
      await f.evaluate(() => location.reload()); await p.waitForTimeout(300);
      const f2 = await h.contentFrame(); await f2.waitForFunction(() => window.Readiness2 && window.Readiness2.state().inHub === true, null, { timeout: 15000 });
      ok((await st(f2)).detail === null, wt + ' B2: the reloaded tool has no layer');
      ok(!(await hubOpenLayer(p)) && (await hubDetail(p)) === null, wt + ' B2: the hub closed its layer when the frame reloaded');
      if (await hubOpenLayer(p)) { await p.click('#hub-detail-close'); await p.waitForTimeout(150); }
      await f2.click('#dt-gx-2'); await p.waitForSelector('#hub-detail[open]');
      ok((await hubDetail(p)).id === 'gx-2', wt + ' B2: the layer opens again after the reload');
      ok(!p._errs.length, wt + ' B2: no page errors ' + p._errs.join(' | '));
      await ctx.close();
    }
    // ---------- G2 (guard, held on v2.6 too): two frames; messages from the other frame change nothing ----------
    {
      const { ctx, p } = await mk(b, w, touch);
      await p.goto(BASE + 'index.html'); await p.click('#hubBar button[data-tool="register"]');
      const rh = await p.waitForSelector('#hubFrame iframe[title="register"]'); const rf = await rh.contentFrame(); await rf.waitForLoadState('load');
      await p.click('#hubBar button[data-tool="readiness-2"]');
      const h = await p.waitForSelector('#hubFrame iframe[title="readiness-2"]'); const f = await h.contentFrame();
      await f.waitForFunction(() => window.Readiness2 && window.Readiness2.state().inHub === true, null, { timeout: 15000 });
      await toWhere(f); await f.click('#dt-gx-2'); await p.waitForSelector('#hub-detail[open]');
      await rf.evaluate(() => { const T = { title: 'Other', kicker: '', catName: '', draft: '', draftText: '', does: '', how: '', level: '', task: '', foot: '', srcs: [] };
        [{ hub: 'detail-close' }, { hub: 'ping' }, { hub: 'detail', id: 'zz-1', data: T }].forEach(m => window.parent.postMessage(m, location.origin)); });
      await p.waitForTimeout(400);
      ok((await hubOpenLayer(p)) && (await hubDetail(p)).id === 'gx-2' && (await p.textContent('#hub-detail-title')) !== 'Other', wt + ' G2: detail-close, ping and detail from the hidden register frame leave the layer as it is');
      ok((await st(f)).detail === 'gx-2', wt + ' G2: the tool still holds its layer');
      await p.click('#hub-detail-close'); await p.waitForFunction(() => !document.querySelector('#hub-detail[open]'));
      ok(!p._errs.length, wt + ' G2: no page errors ' + p._errs.join(' | '));
      await ctx.close();
    }
  }
  // ---------- B3: a newer version saved the store in another tab ----------
  {
    const { ctx, p } = await mk(b, 1280, false); await p.goto(BASE + 'readiness-2/index.html'); await p.waitForFunction(() => window.Readiness2);
    await p.evaluate(() => { const R = window.Readiness2; R.send('begin'); R.send('hotel', { k: 'type', v: 'independent' }); R.send('next'); });
    const mine = (await st(p)).id;
    const p2 = await ctx.newPage(); await p2.goto(BASE + 'readiness-2/index.html'); await p2.waitForFunction(() => window.Readiness2);
    await p2.evaluate(([k, id]) => { const s = JSON.parse(localStorage.getItem(k)); s.v = 4; s.future = 'kept'; s.checks[id].qv = 3; localStorage.setItem(k, JSON.stringify(s)); }, [KEY, mine]);
    await p.waitForTimeout(300);
    await p.click('label[for="a-q2-y"]'); await p.waitForTimeout(200);
    const saved = await p.evaluate(k => JSON.parse(localStorage.getItem(k)), KEY);
    ok(saved.v === 4 && saved.future === 'kept', 'B3: a store saved by a newer version in another tab is not written over (v ' + saved.v + ')');
    ok((await st(p)).storage === 'newer' && await p.isVisible('#not-saved'), 'B3: the page says its changes are not kept');
    ok(!p._errs.length, 'B3: no page errors ' + p._errs.join(' | '));
    await ctx.close();
  }
  // ---------- B4: an older page (v2.5) in another tab writes the store back without qv ----------
  {
    const { ctx, p } = await mk(b, 1280, false); await p.goto(BASE + 'readiness-2/index.html'); await p.waitForFunction(() => window.Readiness2);
    // check Y: question 1 No (each case needs judgement: goes on); then a second check X stays open in this tab
    await p.evaluate(() => { const R = window.Readiness2; R.send('begin'); R.send('hotel', { k: 'type', v: 'independent' }); R.send('next'); ['q2', 'q3', 'q4', 'q5'].forEach(id => R.send('answer', { id, value: 'y' })); R.send('answer', { id: 'q1', value: 'n' }); });
    const y = (await st(p)).id;
    await p.evaluate(() => { const R = window.Readiness2; R.send('new'); R.send('begin'); R.send('hotel', { k: 'type', v: 'group' }); R.send('next'); R.send('answer', { id: 'q2', value: 'y' }); });
    // what a v2.5 page in another tab writes after it merged this store: version 2, every record without qv and Qnew
    const p2 = await ctx.newPage(); await p2.goto(BASE + 'readiness-2/index.html'); await p2.waitForFunction(() => window.Readiness2);
    await p2.evaluate(k => { const s = JSON.parse(localStorage.getItem(k)); s.v = 2; Object.keys(s.checks).forEach(id => { delete s.checks[id].qv; delete s.checks[id].Qnew; }); localStorage.setItem(k, JSON.stringify(s)); }, KEY);
    await p.waitForTimeout(300);
    const yRec = await p.evaluate(id => window.Readiness2.store().checks[id], y);
    ok(yRec && yRec.Q.q1 === 'n' && yRec.Q.q3 === 'y' && yRec.Q.q4 === 'y', 'B4: an older page writing the store does not turn this tab\'s other check round again (' + JSON.stringify(yRec && yRec.Q) + ')');
    await p.click('label[for="a-q3-y"]'); await p.waitForTimeout(200);
    const saved = await p.evaluate(([k, id]) => JSON.parse(localStorage.getItem(k)).checks[id], [KEY, y]);
    ok(saved && saved.Q.q1 === 'n' && saved.qv === 2, 'B4: ... and its next save keeps question 1 as answered (' + JSON.stringify(saved && saved.Q) + ')');
    // a check that only the older page knows is read in the old meaning (turned round once)
    await p2.evaluate(k => { const s = JSON.parse(localStorage.getItem(k)); s.v = 2; s.checks.oldtab0001 = { id: 'oldtab0001', step: 'q', hotel: { type: 'independent' }, Q: { q1: 'y', q2: 'y', q3: 'y' }, A: {}, updated: '2026-11-24T10:00:00Z' }; Object.keys(s.checks).forEach(id => { delete s.checks[id].qv; }); localStorage.setItem(k, JSON.stringify(s)); }, KEY);
    await p.waitForTimeout(300);
    const o = await p.evaluate(() => window.Readiness2.store().checks.oldtab0001);
    ok(o && o.Q.q1 === 'n' && !o.Q.q3 && o.qv === 2, 'B4: a check made in the older tab is read in its own (old) meaning, once (' + JSON.stringify(o && o.Q) + ')');
    ok(!p._errs.length, 'B4: no page errors ' + p._errs.join(' | '));
    await ctx.close();
  }
  await b.close();
  console.log('v2.6.1 browser: ' + pass + ' passed, ' + fail + ' failed');
  if (fail) process.exit(1);
})();
