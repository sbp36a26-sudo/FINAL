// "Do you need AI?" v2.5.1 (24 Nov 2026), two owner-reported problems in the published hub:
//  1. "None of the sources open": every catalogue source of all 99 use cases renders with a readable name, its note and exactly one
//     link per URL (no URL printed as text, no bare source key). (v2.5.1 sent links through the hub; v2.6 replaced that with the hub-drawn layer.)
//  2. The result's "Is this an AI problem?" card explains every one of the five answers (title, answer, what it means), on the page
//     and in the PDF, from the questions' own words.
// Run: node tools/readiness-2/tests/v251.test.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { load, data, tester, finished, root } from './load.mjs';
import { BANNED } from '../build.mjs';
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
  /* v2.8.0: every bundled source of every listed use case, rendered through R2Logic.sourcesBox (the page, step 5 and the result) */
  const USES = D.cat.depts.flatMap(d => d.uses);
  Object.keys(D.detail).forEach(id => {
    const dd = L.detailData(D, USES.find(u => u.id === id), null, TQ), h = L.sourcesBox(dd, id), items = h.split('<li').slice(1);
    if (items.length !== dd.srcs.length) bad.push(id + ': ' + items.length + ' rows for ' + dd.srcs.length + ' sources');
    dd.srcs.forEach((x, j) => {
      n++; types[x.type] = (types[x.type] || 0) + 1; const li = items[j] || '', fail = why => bad.push(id + ' #' + (j + 1) + ' (' + x.type + '): ' + why);
      const hrefs = [...li.matchAll(/href="([^"]*)"/g)].map(m => unesc(m[1]));
      if (x.url) { nUrl++; if (hrefs.length !== 1 || hrefs[0] !== x.url) fail('expected one link to ' + x.url + ', got ' + JSON.stringify(hrefs)); if (!/target="_blank" rel="noopener"/.test(li)) fail('the link does not open in a new tab'); }
      /* v2.8.2 (owner): every source in one format (R2Logic.srcFmt): organisation, title, year, then one short link; no "Copy address",
         no hidden URL span, no full address printed (was: the audited text word for word, the note, a Hotel tag) */
      const f = L.srcFmt(x), text = unesc(('<li' + li.split('</li>')[0]).replace(/<a\b[\s\S]*?<\/a>/g, '').replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
      if (!f.text) fail('no readable text');
      if (text !== f.text.replace(/\s+/g, ' ').trim()) fail('the text is not org, title, year: ' + JSON.stringify(text) + ' vs ' + JSON.stringify(f.text));
      if (/https?:\/\//.test(text)) fail('a URL printed as text');
      if (/srcaddr|srcurl|copy-src|Copy address/.test(li)) fail('an address line or "Copy address" is left');
      if (x.url && !li.includes('>' + f.label.replace(/&/g, '&amp;') + '</a>')) fail('the link label is not the short link ' + f.label);
      if (x.url && f.label.length > 60) fail('the link label is long: ' + f.label);
      if (/Credible \(7\+\)|Below 7|Not scored|>Partial<|class="badge/.test(li)) fail('a credibility label is shown (owner 26 Nov 2026: none)');
    });
  });
  // Edge cases the renderer must survive (nothing in today's catalogue, but a later edit must not print a URL or a key).
  // v2.8.2 (owner): the full address sits in href (and the link's title); the shown label is the short link
  ok(L.sourceItem(['l', 'https://example.com/x']).url === 'https://example.com/x' && !/https?:/.test(L.sourceRow(['l', 'https://example.com/x']).replace(/href="[^"]*"/, '').replace(/title="[^"]*"/, '')), 'a link with only a URL shows a link, not the URL');
  ok(L.sourceItem(['r', 'S99', 'note'], {}).name === 'S99' && L.sourceItem(['r', 'S99', 'note'], {}).url === '', 'an unknown study key does not throw and gives no link');
  ok(!/href/.test(L.sourceRow(['c', 'Vendor', 'note', 'javascript:alert(1)'])), 'a non-http(s) URL is never a link');
  // v2.6: the name is the link (no data-ext marker); the layer renders from L.detailData through R2Logic.sourceRowItem (tests/v26.test.mjs)
  // v2.8.2 (owner): one format: the organisation, the title, then one short link (was: the name is the link)
  ok(/^<li data-src="c"><b>A<\/b>, B, n\.d\. <a href="https:\/\/a\.com\/" target="_blank" rel="noopener" title="https:\/\/a\.com\/">a\.com<\/a><\/li>$/.test(L.sourceRow(['c', 'A', 'b', 'https://a.com/'])), 'source links: org, title, then one short link "a.com" (v2.8.2)');
  ok(!bad.length, 'every source of all 98 use cases: one link per URL with a short label, org, title and year in one format (v2.8.2) (' + n + ' sources, ' + nUrl + ' with a URL; ' + JSON.stringify(types) + ')' + (bad.length ? '\n  ' + bad.slice(0, 8).join('\n  ') : ''));
  ok(['c', 'h', 'r', 'l', 'v'].every(t => types[t] > 0), 'all five source types are covered (v2.8.0: v = sources_v2)');
  // v2.8.2 (owner): the page data carries no review score or fit
  ok(Object.values(D.detail).every(x => x.srcs.every(s => ['k', 't', 'n', 'o', 'u'].every(k => k in s) && !('s' in s) && !('f' in s))), 'the bundle carries one shape for every entry, without score or fit (v2.8.2)');
  ok(/L\.sourcesBox\(x, id\)/.test(app) && !/s\[3\] \? ' <a href/.test(app), 'the detail layer renders through R2Logic.sourcesBox (v2.8.0)');
}

// ---------- 1b. v2.6: the link bridge is gone (changed expectation: inside the hub the hub draws the layer, tests/v26.test.mjs) ----------
ok(!/hub: 'link'/.test(app) && !/e\.defaultPrevented\) return;\s*var a = e\.target/.test(app), 'links: no click interception, no { hub: \'link\' } (v2.6)');

// ---------- 2. the "Is this an AI problem?" card ----------
const cases = {
  allYes: { q1: 'n', q2: 'y', q3: 'y', q4: 'y', q5: 'y' }, // v2.6: Q1 No is the answer that goes on ("allYes" keeps its name)
  notSure: { q1: 'u', q2: 'y', q3: 'y', q4: 'u', q5: 'y' },
  withNo: { q1: 'n', q2: 'y', q3: 'y', q4: 'n', q5: 'n' },
  mixed: { q1: 'n', q2: 'n', q3: 'u', q4: 'y', q5: 'n' }
};
for (const [tag, Q] of Object.entries(cases)) {
  const r = finished(F, D, 'gx-2', { Q }), m = L.resultModel(r, env);
  ok(m.answers.length === 5 && m.answers.map(a => a.title).join('|') === 'Needs judgement|Return|Information to learn from|Safety net|Proof', tag + ': five rows with the five titles (v2.8.0 B10: Needs judgement)');
  m.answers.forEach(a => {
    const q = C.QUESTIONS.find(x => x.id === a.id), ans = Q[a.id];
    ok(a.a === { y: 'Yes', n: 'No', u: 'Don’t know yet' }[ans] && a.state === ans, tag + ' ' + a.id + ': the answer word'); // v2.8.2 (owner): Not sure renamed
    // v2.6: the answer that goes on is No for question 1 (its No-if test), Yes for the others
    const goes = a.id === 'q1' ? 'n' : 'y', test = a.id === 'q1' ? q.noIf : q.yesIf;
    if (ans === goes) ok(a.line.startsWith('Met: ') && a.line.toLowerCase().includes(test.slice(1, 30).toLowerCase()) && a.good === true, tag + ' ' + a.id + ': the answer that goes on explains its test');
    /* v2.8.2 (owner): "Define success first." etc. is said once: the row drops the outcome when it is the card's headline */
    const full = q.outcome + (q.add ? ' ' + q.add : ''), want = m.ai.head && full.indexOf(m.ai.head) === 0 ? full.slice(m.ai.head.length).trim() : full;
    if (ans && ans !== 'u' && ans !== goes) ok(a.line === want && a.good === false, tag + ' ' + a.id + ': the other answer gives the defined consequence');
    if (ans === 'u') ok(a.line.startsWith('To find out: yes if ') && a.line.includes('; no if ') && a.ask === 'Ask ' + q.who + '.' && a.ifNo, tag + ' ' + a.id + ': Not sure says what to find out, whom to ask and what a No would mean');
    ok(!/—/.test([a.line, a.ask, a.ifNo].join(' ')), tag + ' ' + a.id + ': no em dash');
  });
  /* v2.7: the Result PDF has no five-answers card; the Answers PDF lists each answer with its word (the meaning stays on the screen). */
  const pt = P.model(r, env).blocks.map(b => [b.t, b.a, b.m].filter(Boolean).join(' ')).join('\n'), at = P.model(r, env, 'answers').blocks.filter(b => b.k === 'item').slice(0, 5);
  ok(!P.model(r, env).blocks.some(b => b.t === m.ai.head) && m.answers.every((a, i) => at[i].name === a.title && at[i].check === a.q && at[i].val === a.a + (a.state ? ' (' + a.cond + ')' : '') && at[i].answer === 'Your answer: ' + a.a), tag + ': the Answers PDF carries each of the five answers as given; the Result PDF has no five-answers card');
}
{
  const m = L.resultModel(finished(F, D, 'gx-2', { Q: cases.withNo }), env);
  // v2.8.2 (owner): the outcome is said once: here it is the card's headline, so the row does not repeat it
  ok(m.ai.head === 'A rule-based tool or a person is the better choice.' && !m.answers[3].line.includes(m.ai.head), 'Q4 No (v2.6): a rule-based tool or a person (was: assistant only), said once as the headline');
  const mu = L.resultModel(finished(F, D, 'gx-2', { Q: cases.notSure }), env);
  ok(mu.answers[0].ifNo === 'If question 1 turns out to be Yes, this is not suitable for AI: rules or ordinary automation will do it.', 'Q1 Not sure keeps the Q1 sentence (v2.6: Yes is the stop answer)');
  ok(mu.ai.head === 'Find out first.' && L.resultModel(finished(F, D, 'gx-2', { Q: cases.allYes }), env).ai.head === 'Worth exploring with AI.', 'the verdict words stay');
}
ok(/function aiCard\(m\)/.test(app) && /id="ai-rows"/.test(app) && /id="ai-head"/.test(app), 'the card: verdict word (#ai-head) and the five rows (#ai-rows)');
ok(/#sum-ai\{grid-column:1\/-1\}/.test(css) && /\.sumgrid\{grid-template-columns:1fr;align-items:start\}/.test(css), 'layout: the AI card is full width, the cards size to content');
ok(/m: 'Your answer: ' \+ a\.a \+ '\. ' \+ L\.aiMeaningText\(a\)/.test(pdfSrc) && /if \(b\.m\)/.test(pdfSrc), 'PDF: each answer carries the answer given and its meaning line (v2.8.0 B5: the pill is the condition)');
done();
