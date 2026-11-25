// Accessibility checks for "Do you need AI?" v3 (readiness-3), spec §6.8 and §9 UX. axe-core is not in the repo and no dependency is
// added (§1 non-goals), so these are the manual checks, automated where a browser can measure them:
//  A. contrast: every token pair the page uses, computed (WCAG 2.2: text 4.5:1, large text and UI parts 3:1), light and dark;
//  B. contrast as rendered: every visible element with its own text on every screen (cover, 1, 2, stop, 3, 4, 5, the result in each
//     verdict colour, notes, flag, banners, copy box, dialog), against its real composited background, light and dark;
//  C. focus visible: Tab through every screen; each focused control (or its answer label) shows a 3 px outline;
//  D. names and labels: every input, select, textarea and button has a name; every radio group and fieldset is labelled; no
//     duplicate ids; list items sit in lists;
//  E. aria-live: the result is announced; notes that need action are alerts; banners are status regions;
//  F. reduced motion: no transitions or animations under prefers-reduced-motion: reduce;
//  G. print: header, buttons and banners hidden, folds open, no overflow, a PDF prints;
//  H. target size: every control at least 44 px high (360 px wide);  I. the verdict is a word, never colour alone; html lang; title.
// Serve tools/ first:  python3 -m http.server 8861 --bind 127.0.0.1   (R3_BASE for another address)
// Run from tools/:  node readiness-3/tests/browser/a11y.cjs   (R3_A11Y_LOG=1 prints the contrast table)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const BASE = process.env.R3_BASE || 'http://127.0.0.1:8861/';
const URL = BASE + 'readiness-3/index.html';
const ROOT = path.join(__dirname, '..', '..');
const G = JSON.parse(fs.readFileSync(path.join(ROOT, 'spec', 'golden_cases_v3.json'), 'utf8'));
const CSS = fs.readFileSync(path.join(ROOT, 'src', 'style.css'), 'utf8');
let pass = 0, fail = 0; const ok = (c, n) => { if (c) pass++; else { fail++; console.log('FAIL  ' + n); } };
const LOG = process.env.R3_A11Y_LOG === '1';

/* ---------- A: token pairs ---------- */
function tokens(block) { const t = {}; block.replace(/--([a-z0-9-]+):\s*(#[0-9A-Fa-f]{6})/g, (_, k, v) => { t[k] = v; }); return t; }
const light = tokens(CSS.slice(0, CSS.indexOf('@media (prefers-color-scheme: dark)')));
const darkBlock = CSS.slice(CSS.indexOf(':root[data-theme="dark"]'), CSS.indexOf('*{box-sizing'));
const dark = tokens(darkBlock);
function lum(hex) { const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; }
function ratio(a, b) { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
/* [foreground, background, minimum, where it is used] */
const PAIRS = [
  ['ink', 'bg', 4.5, 'body text'], ['ink', 'panel', 4.5, 'text on panels and cards'], ['ink2', 'panel', 4.5, 'sub text, help, why line'], ['ink2', 'bg', 4.5, 'step sub line, gloss'],
  ['ink3', 'panel', 4.5, 'meta, question titles'], ['ink3', 'bg', 4.5, 'progress labels, footer'], ['accent', 'panel', 4.5, 'link buttons, fold titles'], ['accent', 'bg', 4.5, 'links on the page'],
  ['panel', 'accent', 4.5, 'primary button, "Must be Yes" tag'], ['ink2', 'na-s', 4.5, 'tags'], ['ink', 'accent-soft', 4.5, 'chosen answer, info banner and notes'], ['ink', 'md-s', 4.5, 'warning banner, notes'],
  ['ink', 'lo-s', 4.5, 'error banner'], ['ink', 'accent-soft', 4.5, 'sensitive flag (information style, v3.0.1)'], ['panel', 'accent', 4.5, 'sensitive flag icon'], ['ink2', 'hi-s', 4.5, 'verdict kicker (Ready)'], ['ink2', 'md-s', 4.5, 'verdict kicker (Almost ready)'], ['ink2', 'lo-s', 4.5, 'verdict kicker (Not ready)'],
  ['ink2', 'na-s', 4.5, 'verdict kicker (Not enough info)'], ['ink2', 'accent-soft', 4.5, 'verdict kicker (Soft stop)'], ['ink3', 'hi-s', 4.5, 'top 3 owner on panels'],
  ['hi', 'hi-s', 3, 'verdict word Ready (large text)'], ['md', 'md-s', 3, 'verdict word Almost ready (large)'], ['lo', 'lo-s', 3, 'verdict word Not ready (large)'], ['na', 'na-s', 3, 'verdict word Not enough info (large)'], ['accent', 'accent-soft', 3, 'verdict word Soft stop (large)'],
  ['hi', 'hi-s', 4.5, 'verdict word Ready as normal text'], ['md', 'md-s', 4.5, 'verdict word Almost ready as normal text'], ['lo', 'lo-s', 4.5, 'verdict word Not ready as normal text'], ['na', 'na-s', 4.5, 'verdict word Not enough info as normal text'], ['accent', 'accent-soft', 4.5, 'verdict word Soft stop as normal text'],
  ['panel', 'ink', 4.5, 'toast'], ['ctl', 'panel', 3, 'borders of answers, buttons and fields (UI part)'], ['ctl', 'bg', 3, 'field borders on the page'], ['accent', 'bg', 3, 'focus outline on the page'], ['accent', 'panel', 3, 'focus outline on panels'],
  ['accent', 'accent-soft', 3, 'focus outline on a chosen answer'], ['md', 'panel', 3, 'open-question outline (UI part)'], ['md', 'md-s', 3, 'note border'], ['accent', 'accent-soft', 3, 'flag border and icon (information style, v3.0.1)']
];
const table = [];
for (const [scheme, T] of [['light', light], ['dark', dark]]) {
  for (const [f, b, min, use] of PAIRS) {
    const r = ratio(T[f], T[b]); table.push([scheme, f, b, r.toFixed(2), min, use]);
    ok(r >= min, 'A ' + scheme + ' --' + f + ' on --' + b + ' = ' + r.toFixed(2) + ':1 (needs ' + min + ', ' + use + ')');
  }
}
if (LOG) table.forEach(r => console.log(r.join('\t')));

/* a check document for a golden case: every visible question Yes unless changed */
function goldenDoc(g, vis) {
  const mh = {}; for (let i = 1; i <= 11; i++) mh['m' + i] = 'yes'; Object.assign(mh, g.must_haves_changed);
  const qa = {}; (vis || []).forEach(id => { qa[id] = 'yes'; }); Object.assign(qa, g.questions_changed);
  const key = g.use_case === 'none' ? 'none' : g.use_case;
  const cont = g.continued_after_soft_stop ? ['s1', 's2'].filter(k => g.step2[k] === 'no').join(',') : '';
  return { kind: 'hftp-do-you-need-ai', v: 4, rules: '3.0', savedAt: '2026-11-25T00:00:00Z',
    check: { id: 'a11y-' + g.use_case, step: 'result', hotel: { name: 'Hotel Alpenblick', type: 'independent', role: 'gm', country: 'Switzerland' }, step2: g.step2, mh, use: g.use_case, gates: { [key]: g.gates }, qa, cont } };
}
async function openGolden(p, n, step) {
  const g = G[n - 1];
  await p.evaluate(t => window.Readiness3.openText(t), JSON.stringify(goldenDoc(g)));
  const vis = (await p.evaluate(() => window.Readiness3.state())).visible;
  const d = goldenDoc(g, vis); if (step) d.check.step = step;
  await p.evaluate(t => window.Readiness3.openText(t), JSON.stringify(d));
}

/* ---------- B: rendered contrast of every text element ---------- */
async function scanContrast(p) {
  return p.evaluate(() => {
    function rgba(s) { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const v = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return [v[0], v[1], v[2], v.length > 3 ? v[3] : 1]; }
    function over(f, b) { const a = f[3]; return [f[0] * a + b[0] * (1 - a), f[1] * a + b[1] * (1 - a), f[2] * a + b[2] * (1 - a), 1]; }
    function L(c) { const x = c.slice(0, 3).map(v => v / 255).map(v => v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)); return 0.2126 * x[0] + 0.7152 * x[1] + 0.0722 * x[2]; }
    function bgOf(el) {
      const stack = []; for (let e = el; e; e = e.parentElement) { const c = rgba(getComputedStyle(e).backgroundColor); if (c && c[3] > 0) { stack.push(c); if (c[3] >= 1) break; } }
      let b = [255, 255, 255, 1]; if (!stack.length || stack[stack.length - 1][3] < 1) b = rgba(getComputedStyle(document.documentElement).backgroundColor) || b;
      for (let i = stack.length - 1; i >= 0; i--) b = over(stack[i], b); return b;
    }
    const out = [];
    document.querySelectorAll('body *').forEach(el => {
      if (/^(SCRIPT|STYLE|OPTION|TEXTAREA)$/.test(el.tagName)) return;
      if (el.closest('.sr,[hidden]') || el.closest('details:not([open]) > :not(summary)')) return;
      const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()); if (!own) return;
      const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none' || !el.getClientRects().length) return;
      if (el.closest('dialog') && !el.closest('dialog').open) return;
      const fg0 = rgba(cs.color), bg = bgOf(el), fg = over(fg0, bg);
      const r = (Math.max(L(fg), L(bg)) + 0.05) / (Math.min(L(fg), L(bg)) + 0.05);
      const px = parseFloat(cs.fontSize), large = px >= 24 || (px >= 18.66 && +cs.fontWeight >= 700);
      out.push({ text: el.textContent.trim().slice(0, 50), sel: el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ').join('.') : ''), r: Math.round(r * 100) / 100, min: large ? 3 : 4.5 });
    });
    return out;
  });
}

/* ---------- D: names, labels, ids, lists ---------- */
async function scanNames(p) {
  return p.evaluate(() => {
    const bad = [];
    const name = el => { const l = el.getAttribute('aria-labelledby'); if (l) return l.split(' ').map(id => (document.getElementById(id) || {}).textContent || '').join(' ').trim(); if (el.getAttribute('aria-label')) return el.getAttribute('aria-label'); if (el.labels && el.labels.length) return [...el.labels].map(x => x.textContent).join(' ').trim(); return el.tagName === 'BUTTON' || el.tagName === 'SUMMARY' || el.tagName === 'A' ? el.textContent.trim() : ''; };
    document.querySelectorAll('#app input, #app select, #app textarea, #app button, #app summary, #app a, dialog[open] button').forEach(el => { if (!name(el)) bad.push('no name: ' + el.outerHTML.slice(0, 90)); });
    document.querySelectorAll('[role=radiogroup], [role=region], dialog[open]').forEach(el => { if (!name(el)) bad.push('group not labelled: ' + el.outerHTML.slice(0, 90)); });
    document.querySelectorAll('fieldset').forEach(el => { const lg = el.querySelector(':scope > legend'); if (!lg || !lg.textContent.trim()) bad.push('fieldset without legend: ' + (el.id || '')); });
    const seen = {}; document.querySelectorAll('[id]').forEach(el => { if (seen[el.id]) bad.push('duplicate id ' + el.id); seen[el.id] = 1; });
    document.querySelectorAll('li').forEach(el => { const pr = el.parentElement; if (!/^(UL|OL)$/.test(pr.tagName) || (pr.getAttribute('role') && pr.getAttribute('role') !== 'list')) bad.push('li outside a list: ' + (pr.outerHTML.slice(0, 80))); });
    document.querySelectorAll('[aria-labelledby],[aria-controls],[aria-describedby]').forEach(el => ['aria-labelledby', 'aria-controls', 'aria-describedby'].forEach(a => { const v = el.getAttribute(a); if (v) v.split(' ').forEach(id => { if (!document.getElementById(id)) bad.push(a + ' points at a missing id ' + id); }); }));
    return bad;
  });
}

/* ---------- C: focus visible while tabbing ---------- */
async function tabFocus(p, max) {
  const bad = []; let n = 0;
  await p.evaluate(() => { document.activeElement && document.activeElement.blur(); window.scrollTo(0, 0); });
  const seen = new Set();
  for (let i = 0; i < (max || 400); i++) {
    await p.keyboard.press('Tab');
    const f = await p.evaluate(() => {
      const a = document.activeElement; if (!a || a === document.body) return null;
      const cs = getComputedStyle(a), lab = a.closest('label.opt'), ls = lab ? getComputedStyle(lab) : null;
      const visible = s => s && s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 2;
      return { key: a.id || a.name || a.outerHTML.slice(0, 60), ok: visible(cs) || visible(ls), d: cs.outlineStyle + ' ' + cs.outlineWidth };
    });
    if (!f) continue; if (seen.has(f.key)) break; seen.add(f.key); n++;
    if (!f.ok) bad.push(f.key + ' (' + f.d + ')');
  }
  return { n, bad };
}

/* ---------- H: target size ---------- */
async function scanTargets(p) {
  return p.evaluate(() => {
    const bad = [];
    document.querySelectorAll('#app .btn, #app .opt, #app .linkbtn, #app select, #app input[type=text], #app summary, dialog[open] .btn').forEach(el => {
      if (!el.getClientRects().length || el.closest('.sr')) return;
      const r = el.getBoundingClientRect(); if (r.height < 43.5) bad.push(el.textContent.trim().slice(0, 40) + ' ' + Math.round(r.height) + 'px');
    });
    return bad;
  });
}

(async () => {
  const b = await chromium.launch();
  /* the screens: [name, setup] */
  const SCREENS = [
    ['cover', async p => { await p.evaluate(() => window.Readiness3.send('new')); await p.evaluate(() => window.Readiness3.send('goto', 'start')); }],
    ['cover-file-error', async p => { await p.evaluate(() => window.Readiness3.openText('{"kind":"x"}')); }],
    ['1-hotel', async p => { await openGolden(p, 1, 'hotel'); }],
    ['2-step2-unanswered-note', async p => { await p.evaluate(() => window.Readiness3.send('new')); await p.evaluate(() => { window.Readiness3.send('goto', 's2'); window.Readiness3.send('next'); }); }],
    ['stop', async p => { await openGolden(p, 9, 's2'); await p.evaluate(() => window.Readiness3.send('next')); }],
    ['3-must-contradicted', async p => { await openGolden(p, 15, 'must'); }],
    ['4-where', async p => { await openGolden(p, 1, 'where'); }],
    ['5-use-notes-why', async p => { await openGolden(p, 15, 'use'); await p.click('[data-act="why"]'); }],
    ['5-use-notfit', async p => { await openGolden(p, 28, 'use'); }],
    /* v3.0.1: step 5 with How it works open (questions held back, the "how many follow" line), and the use-case search */
    ['5-use-hiw-open', async p => { const d = goldenDoc(G[0]); d.check.gates = {}; d.check.step = 'use'; d.check.id = 'a11y-hiw-open'; await p.evaluate(t => window.Readiness3.openText(t), JSON.stringify(d)); }],
    ['4-where-search', async p => { await openGolden(p, 1, 'where'); await p.fill('#uc-search', 'chat'); }],
    ['result-ready', async p => { await openGolden(p, 1); }],
    ['result-almost-flag', async p => { await openGolden(p, 19); await p.evaluate(() => document.querySelectorAll('details.fold').forEach(d => { d.open = true; })); }],
    ['result-almost-notes', async p => { await openGolden(p, 15); }],
    ['result-not-ready', async p => { await openGolden(p, 2); await p.evaluate(() => document.querySelectorAll('details.fold').forEach(d => { d.open = true; })); }],
    ['result-not-enough', async p => { await openGolden(p, 8); }],
    ['result-copybox', async p => { await openGolden(p, 1); await p.click('#pdf'); await p.waitForSelector('#copybox'); }],
    ['imported-banner', async p => { await p.evaluate(t => window.Readiness3.openText(t), fs.readFileSync(path.join(ROOT, 'tests', 'fixtures', 'v2.7-file.json'), 'utf8')); }],
    ['confirm-dialog', async p => { await openGolden(p, 1, 'must'); await p.click('#new-check'); }]
  ];
  for (const scheme of ['light', 'dark']) {
    for (const size of [[1280, 800], [360, 740]]) {
      const tag = scheme + ' ' + size[0] + 'px';
      const ctx = await b.newContext({ viewport: { width: size[0], height: size[1] }, colorScheme: scheme, reducedMotion: 'no-preference' });
      const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e)));
      await p.goto(URL); await p.waitForFunction(() => window.Readiness3 && window.Readiness3.ready());
      let texts = 0;
      for (const [nm, setup] of SCREENS) {
        await setup(p); await p.waitForTimeout(30);
        const t = tag + ' ' + nm;
        const cs = await scanContrast(p); texts += cs.length;
        const low = cs.filter(x => x.r < x.min);
        ok(cs.length > 3 && !low.length, 'B ' + t + ': ' + cs.length + ' text elements at or above 4.5:1 (3:1 large) ' + low.map(x => x.sel + ' "' + x.text + '" ' + x.r).join(' | '));
        const nb = await scanNames(p); ok(!nb.length, 'D ' + t + ': names, labels, ids, lists ' + nb.join(' | '));
        if (size[0] === 360) { const tb = await scanTargets(p); ok(!tb.length, 'H ' + t + ': targets at least 44 px ' + tb.join(' | ')); }
        const w = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth); ok(w <= 0, 'H ' + t + ': no horizontal scroll (' + w + ')');
        if (scheme === 'light' && nm !== 'confirm-dialog') { const tf = await tabFocus(p); ok(tf.n >= 2 && !tf.bad.length, 'C ' + t + ': focus visible on ' + tf.n + ' controls ' + tf.bad.join(' | ')); }
        if (nm === 'confirm-dialog') { ok(await p.evaluate(() => document.getElementById('confirm').open && document.activeElement && document.activeElement.getAttribute('data-act') === 'new-yes'), 'C ' + t + ': the dialog takes focus'); await p.keyboard.press('Escape'); }
        if (/^result-|^stop$/.test(nm)) {
          const v = await p.evaluate(() => ({ h: document.getElementById('h').textContent.trim(), live: document.getElementById('live').textContent, al: document.getElementById('live').getAttribute('aria-live'), verdict: window.Readiness3.model().verdict }));
          ok(v.h === v.verdict && v.al === 'polite' && v.live.startsWith('Result: ' + v.verdict + '.'), 'E/I ' + t + ': verdict as a word (' + v.h + ') and announced in the aria-live region');
        }
        if (nm === '2-step2-unanswered-note') ok(await p.evaluate(() => document.getElementById('open-note').getAttribute('role') === 'alert'), 'E ' + t + ': the unanswered note is an alert');
        if (nm === 'imported-banner' || nm === 'cover-file-error') ok(await p.evaluate(() => { const e = document.getElementById('imported') || document.getElementById('file-err'); return !!e && /^(status|alert)$/.test(e.getAttribute('role')); }), 'E ' + t + ': banner is a status or alert region');
      }
      console.log(tag + ': ' + texts + ' rendered text elements measured on ' + SCREENS.length + ' screens');
      ok(errs.length === 0, tag + ': no page errors ' + errs.join(' | '));
      await ctx.close();
    }
  }

  /* F: reduced motion */
  for (const rm of ['reduce', 'no-preference']) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: rm });
    const p = await ctx.newPage(); await p.goto(URL); await p.waitForFunction(() => window.Readiness3 && window.Readiness3.ready());
    await openGolden(p, 1, 'must');
    const tr = await p.evaluate(() => [...document.querySelectorAll('.btn,.opt')].map(e => getComputedStyle(e).transitionDuration));
    const anim = await p.evaluate(() => document.getAnimations().length);
    if (rm === 'reduce') ok(tr.length > 5 && tr.every(d => d.split(',').every(x => parseFloat(x) === 0)) && anim === 0, 'F reduced motion: no transitions (' + [...new Set(tr)].join(' ') + '), no animations (' + anim + ')');
    else ok(tr.some(d => parseFloat(d) > 0), 'F no preference: the short colour transitions run (' + [...new Set(tr)].join(' ') + ')');
    await ctx.close();
  }

  /* G: print */
  {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
    const p = await ctx.newPage(); await p.goto(URL); await p.waitForFunction(() => window.Readiness3 && window.Readiness3.ready());
    await openGolden(p, 19);
    await p.emulateMedia({ media: 'print' });
    await p.evaluate(() => window.dispatchEvent(new Event('beforeprint')));
    const pr = await p.evaluate(() => {
      const shown = s => [...document.querySelectorAll(s)].some(e => e.getClientRects().length && getComputedStyle(e).display !== 'none');
      return { hdr: shown('.hdr'), btn: shown('#app button'), nav: shown('.navrow'), folds: [...document.querySelectorAll('details.fold')].every(d => d.open), qa: shown('#all-qa .qarow'), method: shown('#method li'), wide: document.documentElement.scrollWidth > window.innerWidth, bg: getComputedStyle(document.body).backgroundColor };
    });
    ok(!pr.hdr && !pr.btn && !pr.nav, 'G print: header, buttons and navigation hidden');
    ok(pr.folds && pr.qa && pr.method, 'G print: the folds open (every question and answer, how this was worked out)');
    ok(!pr.wide && pr.bg === 'rgb(255, 255, 255)', 'G print: white page, no overflow');
    const pdf = await p.pdf({ format: 'A4', printBackground: true });
    ok(pdf.length > 20000 && /\/Type\s*\/Page\b/.test(pdf.toString('latin1')), 'G print: the browser prints the result to A4 (' + pdf.length + ' bytes)');
    await p.evaluate(() => window.dispatchEvent(new Event('afterprint')));
    ok(await p.evaluate(() => [...document.querySelectorAll('details.fold')].every(d => !d.open)), 'G print: the folds close again after printing');
    await ctx.close();
  }

  /* I: document */
  {
    const ctx = await b.newContext(); const p = await ctx.newPage(); await p.goto(URL); await p.waitForFunction(() => window.Readiness3 && window.Readiness3.ready());
    const d = await p.evaluate(() => ({ lang: document.documentElement.lang, title: document.title, skip: !!document.querySelector('a.skip[href="#view"]'), main: document.querySelectorAll('main').length }));
    ok(d.lang === 'en' && d.title === 'Do you need AI? v3.0' && d.skip && d.main === 1, 'I html lang="en", title, skip link to the questions, one main');
    await ctx.close();
  }
  await b.close();
  console.log('a11y: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
