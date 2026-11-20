// Same script against the v3 build (backup-v3) and the v4 build. Counting as in audit 2: a drop-down choice = 2 clicks;
// fields = form controls set (drop-downs, radio groups, typed fields); words = words on screen over the screens passed.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const out = {};
  for (const ver of ['backup-v3/', '']) {
    for (const path of ['fastest', 'chatbot']) {
      const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } }); await ctx.route(/fonts\./, r => r.abort()); const p = await ctx.newPage();
      let clicks = 0, fields = 0, words = 0, screens = 0, firstQ = null;
      const count = async () => { words += await p.evaluate(() => document.body.innerText.trim().split(/\s+/).length); screens++; };
      const click = async s => { await p.click(s); clicks++; };
      const sel = async (s, v) => { await p.selectOption(s, v); clicks += 2; fields++; };
      const radio = async id => { await p.evaluate(i => document.getElementById(i).click(), id); clicks++; fields++; };
      await p.goto('http://127.0.0.1:8805/readiness-check/' + ver + 'index.html'); await count();
      await sel('#h-type', 'independent');
      if (path === 'chatbot') { await p.fill('#q', 'chatbot'); fields++; await click('[data-act=pick][data-id="gx-2"]'); } else await click('.pick');
      await p.evaluate(() => document.querySelector('input[name=stage][value=explore]').click()); clicks++; fields++;
      await click('#go-prep'); await count(); await click('[data-act=begin]');
      firstQ = { clicks, words };
      for (let i = 0; i < 6; i++) {
        await count();
        if (path === 'chatbot') {
          const qs = await p.evaluate(() => [...document.querySelectorAll('fieldset.qa')].map(f => ({ code: (f.id || '').slice(3) || (f.querySelector('input').name.slice(2).split('#')[0]), items: f.querySelectorAll('.item').length })));
          for (const q of qs) {
            if (q.items) { for (let k = 0; k < q.items; k++) await radio(`q-${q.code}_${k}-k`); continue; }
            const yes = { P1: 'Guest relations manager, 3 hours a week', F1: 'Line in the 2027 budget approved by owner', F2: 'Reply time 9 hours, measured in October' }[q.code];
            if (yes) { await radio(`q-${q.code}-y`); await p.fill('#pf-' + q.code, yes); fields++; } else await radio(`q-${q.code}-k`);
          }
        }
        await click('[data-act=next]');
      }
      await count();
      const res = await p.evaluate(() => (document.querySelector('#vsent') || document.querySelector('.chip.big')).innerText + ' | ' + (document.querySelector('#count') || document.querySelector('.tally')).innerText);
      const resWords = await p.evaluate(() => document.body.innerText.trim().split(/\s+/).length);
      out[(ver ? 'v3' : 'v4') + ' ' + path] = { clicks, fields, words, screens, toFirstQuestion: firstQ, resultWords: resWords, result: res };
      await ctx.close();
    }
  }
  console.log(JSON.stringify(out, null, 1)); await b.close();
})();
