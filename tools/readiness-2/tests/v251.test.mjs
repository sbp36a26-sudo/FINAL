// "Do you need AI?" v2.5.1 (24 Nov 2026), two owner-reported problems in the published hub:
//  1. "None of the sources open": every catalogue source of all 99 use cases renders with a readable name, its note and exactly one
//     link per URL (no URL printed as text, no bare source key); the link goes through the hub ({ hub: 'link', url }) inside the hub.
//  2. The result's "Is this an AI problem?" card explains every one of the five answers (title, answer, what it means), on the page
//     and in the PDF, from the questions' own words.
// Run: node tools/readiness-2/tests/v251.test.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { load, data, tester, finished, root } from './load.mjs';
const { C, L, F, P } = load();
const D = data(), TQ = D.tq;
const { ok, done } = tester('v251');
const rd = p => readFileSync(join(root, p), 'utf8');
const app = rd('src/app.js'), css = rd('src/style.css'), pdfSrc = rd('src/pdf.js');
const env = { cat: D.cat, TQ, ex: D.ex, today: '2026-11-24' };

// ---------- 1a. sources: all 99 use cases, every type ----------
{
  const catHtml = readFileSync(join(root, '../use-case-catalogue/index.html'), 'utf8');
  const X = JSON.parse(catHtml.match(/<script id="data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
  const urlOf = s => s[0] === 'r' ? (X.src[s[1]] || [])[1] || '' : s[0] === 'l' ? s[2] || '' : s[3] || '';
  const strip = h => h.replace(/<a\b[^>]*>/g, '').replace(/<[^>]+>/g, ' ');
  const unesc = h => h.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  let n = 0, nUrl = 0, bad = [], types = {};
  X.depts.forEach(d => d.uses.forEach((u, i) => {
    const id = d.id + '-' + (i + 1), bundled = D.detail[id].srcs;
    (u.srcs || []).forEach((raw, j) => {
      n++; types[raw[0]] = (types[raw[0]] || 0) + 1;
      const url = urlOf(raw);
      for (const [tag, s] of [['bundled', bundled[j]], ['raw catalogue shape', raw]]) {
        const h = L.sourceRow(s, X.src), hrefs = [...h.matchAll(/href="([^"]*)"/g)].map(m => unesc(m[1]));
        // 24 Nov 2026: the address line (selectable, with Copy address) is the one place a URL may stand as text
        const addr = (h.match(/<span class="srcurl">([^<]*)<\/span>/) || [])[1];
        if (url && unesc(addr || '') !== url) fail('the address line does not show the link');
        const text = unesc(strip(h.replace(/<span class="srcaddr">[\s\S]*?<\/button><\/span>/, '')));
        const fail = why => bad.push(id + ' #' + (j + 1) + ' (' + raw[0] + ', ' + tag + '): ' + why);
        if (url) { if (hrefs.length !== 1 || hrefs[0] !== url) fail('expected one link to ' + url + ', got ' + JSON.stringify(hrefs)); }
        else if (hrefs.length) fail('a link where the catalogue has no URL');
        if (/https?:\/\//.test(text)) fail('a URL printed as text');
        const it = L.sourceItem(s, X.src);
        if (!it.name.trim() || (raw[0] === 'r' && it.name === raw[1])) fail('no readable name: ' + it.name); // a company may be called "M3"; a study never shows its bare key
        if (raw[0] === 'r' && it.name !== X.src[raw[1]][0]) fail('a study is named by its citation, not its key');
        if ((raw[0] === 'c' || raw[0] === 'h' || raw[0] === 'r') && raw[2] && !text.includes(raw[2])) fail('the note is missing');
        if (raw[0] === 'h' && !/<span class="tag">Hotel<\/span>/.test(h)) fail('no Hotel tag');
        if (url && !/target="_blank" rel="noopener"/.test(h)) fail('the link does not open in a new tab');
      }
      if (url) nUrl++;
    });
  }));
  ok(!bad.length, 'every source of all 99 use cases: one link per catalogue URL, no URL as text, a readable name and its note (' + n + ' sources, ' + nUrl + ' with a URL; ' + JSON.stringify(types) + ')' + (bad.length ? '\n  ' + bad.slice(0, 8).join('\n  ') : ''));
  ok(['c', 'h', 'r', 'l'].every(t => types[t] > 0), 'all four source types are covered');
  ok(Object.values(D.detail).every(x => x.srcs.every(s => s.length === 4)), 'the bundle carries one shape for every type: [type, name, note, url]');
  // Edge cases the renderer must survive (nothing in today's catalogue, but a later edit must not print a URL or a key).
  ok(L.sourceItem(['l', 'https://example.com/x']).url === 'https://example.com/x' && !/https?:/.test(L.sourceRow(['l', 'https://example.com/x']).replace(/<span class="srcaddr">[\s\S]*?<\/button><\/span>/, '').replace(/href="[^"]*"/, '')), 'a link with only a URL shows a link, not the URL');
  ok(L.sourceItem(['r', 'S99', 'note'], {}).name === 'S99' && L.sourceItem(['r', 'S99', 'note'], {}).url === '', 'an unknown study key does not throw and gives no link');
  ok(!/href/.test(L.sourceRow(['c', 'Vendor', 'note', 'javascript:alert(1)'])), 'a non-http(s) URL is never a link');
  ok(/data-ext="source"/.test(L.sourceRow(['c', 'A', 'b', 'https://a.com/'])), 'source links are marked data-ext="source"');
  ok(/L\.sourceRow\(s\)/.test(app) && !/s\[3\] \? ' <a href/.test(app), 'the detail layer renders through R2Logic.sourceRow');
}

// ---------- 1b. the link bridge in the page ----------
ok(/document\.addEventListener\('click', function \(e\) \{\s*if \(!host\.pong \|\| e\.defaultPrevented\) return;/.test(app), 'links: intercepted only once the hub answered the ping (standalone keeps ordinary links)');
ok(/postMessage\(\{ hub: 'link', url: u\.href \}, location\.origin\)/.test(app), 'links: { hub: \'link\', url } to the hub, same origin');
ok(/u\.protocol !== 'http:' && u\.protocol !== 'https:'\) \|\| u\.origin === location\.origin\) return;/.test(app), 'links: only external http(s) links');

// ---------- 2. the "Is this an AI problem?" card ----------
const cases = {
  allYes: { q1: 'y', q2: 'y', q3: 'y', q4: 'y', q5: 'y' },
  notSure: { q1: 'u', q2: 'y', q3: 'y', q4: 'u', q5: 'y' },
  withNo: { q1: 'y', q2: 'y', q3: 'y', q4: 'n', q5: 'n' },
  mixed: { q1: 'y', q2: 'n', q3: 'u', q4: 'y', q5: 'n' }
};
for (const [tag, Q] of Object.entries(cases)) {
  const r = finished(F, D, 'gx-2', { Q }), m = L.resultModel(r, env);
  ok(m.answers.length === 5 && m.answers.map(a => a.title).join('|') === 'Complex judgement|Return|Information ready|Safety net|Proof', tag + ': five rows with the five titles');
  m.answers.forEach(a => {
    const q = C.QUESTIONS.find(x => x.id === a.id), ans = Q[a.id];
    ok(a.a === { y: 'Yes', n: 'No', u: 'Not sure' }[ans] && a.state === ans, tag + ' ' + a.id + ': the answer word');
    if (ans === 'y') ok(a.line.startsWith('Met: ') && a.line.toLowerCase().includes(q.yesIf.slice(1, 30).toLowerCase()), tag + ' ' + a.id + ': Yes explains the Yes-if test');
    if (ans === 'n') ok(a.line === q.outcome + (q.add ? ' ' + q.add : ''), tag + ' ' + a.id + ': No gives the defined consequence');
    if (ans === 'u') ok(a.line.startsWith('To find out: yes if ') && a.line.includes('; no if ') && a.ask === 'Ask ' + q.who + '.' && a.ifNo, tag + ' ' + a.id + ': Not sure says what to find out, whom to ask and what a No would mean');
    ok(!/—/.test([a.line, a.ask, a.ifNo].join(' ')), tag + ' ' + a.id + ': no em dash');
  });
  const pt = P.model(r, env).blocks.map(b => [b.t, b.a, b.m].filter(Boolean).join(' ')).join('\n');
  ok(m.answers.every(a => pt.includes(L.aiMeaningText(a))) && pt.includes(m.ai.head), tag + ': the PDF carries the verdict word and every answer\'s meaning');
}
{
  const m = L.resultModel(finished(F, D, 'gx-2', { Q: cases.withNo }), env);
  ok(m.answers[3].line.startsWith('AI as an assistant only'), 'Q4 No = assistant only');
  const mu = L.resultModel(finished(F, D, 'gx-2', { Q: cases.notSure }), env);
  ok(mu.answers[0].ifNo === 'If question 1 turns out to be No, this is not suitable for AI: rules or ordinary automation will do it.', 'Q1 Not sure keeps the existing Q1 sentence');
  ok(mu.ai.head === 'Find out first.' && L.resultModel(finished(F, D, 'gx-2', { Q: cases.allYes }), env).ai.head === 'Worth exploring with AI.', 'the verdict words stay');
}
ok(/function aiCard\(m\)/.test(app) && /id="ai-rows"/.test(app) && /id="ai-head"/.test(app), 'the card: verdict word (#ai-head) and the five rows (#ai-rows)');
ok(/#sum-ai\{grid-column:1\/-1\}/.test(css) && /\.sumgrid\{grid-template-columns:1fr;align-items:start\}/.test(css), 'layout: the AI card is full width, the cards size to content');
ok(/m: L\.aiMeaningText\(a\)/.test(pdfSrc) && /if \(b\.m\)/.test(pdfSrc), 'PDF: each answer carries its meaning line');
done();
