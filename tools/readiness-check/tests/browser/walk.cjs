// Browser proof for readiness check v4. node walk.cjs  (server on 8805 serving tools/)
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const SP = process.env.SP, OUT = SP + '/v4', BASE = 'http://127.0.0.1:8805/readiness-check/';
const FX = '/home/user/final/tools/readiness-check/tests/fixtures/';
let pass = 0, fail = 0; const fails = [];
const ok = (c, n) => { if (c) pass++; else { fail++; fails.push(n); console.log('FAIL  ' + n); } };
const ext = new Set();
async function mk(b, w, h, touch, init) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch, acceptDownloads: true });
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
  await ctx.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  if (init) await ctx.addInitScript(init.fn, init.arg);
  const p = await ctx.newPage(); p._errs = [];
  p.on('pageerror', e => p._errs.push(String(e)));
  p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|ERR_FAILED/.test(m.text())) p._errs.push(m.text()); });
  p.on('request', r => { const u = r.url(); if (!u.startsWith('http://127.0.0.1:8805') && !u.startsWith('data:') && !u.startsWith('blob:')) ext.add(new URL(u).host); });
  return { ctx, p };
}
const noH = p => p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
const small = p => p.evaluate(() => [...document.querySelectorAll('button, label.opt, label.chk, select, input[type=text], input[type=search], input[type=date], summary, label.btn')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 43.5; }).map(e => (e.id || e.textContent.trim().slice(0, 30)) + ':' + Math.round(e.getBoundingClientRect().height)));
const answerAll = async (p, plan) => { // plan(code, isGate, isList) -> value | [value, note]
  for (let i = 0; i < 6; i++) {
    const qs = await p.evaluate(() => [...document.querySelectorAll('fieldset.qa')].map(f => ({ code: f.id.slice(3), gate: f.classList.contains('must'), items: f.querySelectorAll('.item').length })));
    for (const q of qs) {
      if (q.items) { for (let k = 0; k < q.items; k++) { const v = plan(q.code, false, true, k); if (v) await p.evaluate(id => document.getElementById(id).click(), `q-${q.code}_${k}-${v}`); } continue; }
      let v = plan(q.code, q.gate, false); if (!v) continue; const note = Array.isArray(v) ? v[1] : null; v = Array.isArray(v) ? v[0] : v;
      if (!(await p.$(`#q-${q.code}-${v}`))) v = 'k';
      await p.evaluate(id => document.getElementById(id).click(), `q-${q.code}-${v}`);
      if (note) { await p.fill('#pf-' + q.code, note); }
    }
    await p.click('[data-act=next]');
  }
  await p.waitForSelector('#view[data-state=result]');
};
const startTool = async (p, id, stage, type = 'independent', country) => {
  await p.selectOption('#h-type', type); if (country) await p.selectOption('#h-country', country);
  await p.click(`[data-act=pick][data-id="${id}"]`); await p.check('#stage-' + stage, { force: true }); await p.click('#go-prep'); await p.click('#begin-top');
};
(async () => {
  const b = await chromium.launch();
  for (const [w, h, touch] of [[1280, 900, false], [390, 844, true]]) {
    const T = n => `[${w}] ${n}`; const { ctx, p } = await mk(b, w, h, touch);
    const shot = (n, full) => p.screenshot({ path: `${OUT}/${w}_${n}.png`, fullPage: !!full });
    await p.goto(BASE + 'index.html');
    // --- start ---
    ok(await p.evaluate(() => /Is your hotel ready to adopt this AI tool\? Not about how AI assistants find your hotel\./.test(document.getElementById('hdr').innerText)), T('start: owner\'s header sentence is visible'));
    ok(!(await p.$eval('#go-prep', e => e.disabled)), T('start: Next is enabled with nothing filled in'));
    await shot('01_start');
    await p.click('#go-prep');
    ok(await p.evaluate(() => ReadinessCheck.state().step === 'start' && document.activeElement.id === 'h-type' && document.querySelectorAll('.needline').length === 3 && document.getElementById('go-hint').textContent === 'Still needed: how the hotel is run · a tool · where you are with it'), T('start: Next with missing fields points to the first one, lists what is missing'));
    ok(await p.evaluate(() => { const r = document.getElementById('box-type').getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; }), T('start: the first missing field is scrolled into view'));
    await shot('02_start_missing');
    await p.selectOption('#h-type', 'independent');
    ok(await p.evaluate(() => document.getElementById('go-hint').textContent === 'Still needed: a tool · where you are with it' && document.querySelectorAll('.needline').length === 2), T('start: hint lists only what is still missing'));
    ok(await p.evaluate(() => /\(optional\)/.test(document.querySelector('label[for], #h-role').closest('label').innerText) && /Country \(optional\)/.test(document.getElementById('h-country').closest('label').innerText)), T('start: role and country labelled optional'));
    ok(await p.evaluate(() => { const o = [...document.getElementById('h-country').options].map(o => o.textContent); return ['Bulgaria', 'Estonia', 'Latvia', 'Lithuania', 'Romania', 'Slovakia', 'Slovenia', 'Other (outside the EU)'].every(c => o.includes(c)) && document.querySelector('#h-country option[value=Other]') !== null; }), T('start: seven added countries; "Other (outside the EU)" keeps value Other'));
    // --- search ---
    const search = async q => { await p.fill('#q', q); return p.evaluate(() => ({ first: (document.querySelector('.pick') || {}).dataset ? document.querySelector('.pick').dataset.id : null, n: document.querySelectorAll('.pick').length, count: document.getElementById('pickcount').textContent })); };
    let r = await search('chatbot'); ok(r.first === 'gx-2' && /^98 tools · \d+ match/.test(r.count), T('search "chatbot": chat assistant first, count shown (' + r.count + ')')); await shot('03_search_chatbot');
    r = await search('telephone'); ok(r.n > 0 && r.first === 'res-1', T('search "telephone": ' + r.n + ' results, voice agent first'));
    r = await search('check in'); ok(r.n > 0 && /^fo-/.test(r.first), T('search "check in": ' + r.n + ' results, first ' + r.first));
    r = await search('staff schedule'); ok(r.first === 'hr-1', T('search "staff schedule": staff scheduling first'));
    r = await search('zzzz'); ok(r.n === 0 && r.count === '98 tools · 0 match', T('search with no match says so'));
    ok(!(await p.$('.legend')), T('start: legend above the list removed'));
    if (touch) ok(await p.evaluate(() => { const l = document.getElementById('picklist'); return getComputedStyle(l).overflowY === 'visible'; }), T('phone: tool list grows with the page (no scroll box)'));
    await p.fill('#q', 'chatbot'); await p.click('[data-act=pick][data-id="gx-2"]');
    ok(await p.evaluate(() => document.activeElement.id === 'picked' && (() => { const r = document.getElementById('box-stage').getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; })()), T('after pick: focus on the Selected card, stage question in view'));
    await p.check('#stage-explore', { force: true }); await p.fill('#h-name', 'Ξενοδοχείο Łódź');
    ok(/cannot print/.test(await p.textContent('#name-warn')), T('start: hotel name with characters the PDF cannot print is flagged next to the field'));
    await p.fill('#h-name', 'Hotel Test'); ok((await p.textContent('#name-warn')) === '', T('start: printable name, no warning'));
    ok(await noH(p), T('start: no horizontal scroll')); if (touch) { const s = await small(p); ok(!s.length, T('start: touch targets ≥ 44 px ' + s.join(','))); }
    await shot('04_start_filled', true);
    await p.click('#go-prep');
    // --- prep ---
    ok(await p.evaluate(() => ReadinessCheck.state().step === 'prep' && document.querySelectorAll('#view details[open]').length === 0 && document.querySelectorAll('[data-act=begin]').length === 2), T('prep: lists collapsed, Start now at top and bottom'));
    const screens = await p.evaluate(() => document.documentElement.scrollHeight / innerHeight);
    ok(screens <= 2.0, T('prep: at most 2 screens with lists closed (' + screens.toFixed(2) + ')'));
    ok(await p.evaluate(() => /30 questions, 8 of them must-haves\. You will probably need to ask colleagues or the vendor\./.test(document.getElementById('view').innerText) && !/15 minutes/.test(document.body.innerText) && /One must-have at No means “Not ready yet”/.test(document.body.innerText)), T('prep: counts instead of a time, ruled sentence on must-haves'));
    await p.click('[data-act=copy-prep][data-who=fin]'); const clip = await p.evaluate(() => navigator.clipboard.readText()).catch(() => '');
    ok(/Please reply to each line/.test(clip) || clip === '', T('prep: copy text says "Please reply to each line"'));
    ok(await noH(p), T('prep: no horizontal scroll')); if (touch) { const s = await small(p); ok(!s.length, T('prep: touch targets ≥ 44 px ' + s.join(','))); }
    await shot('05_prep', true);
    await p.click('#begin-top');
    // --- step 1 ---
    const y = await p.evaluate(() => Math.round(document.querySelector('.opts').getBoundingClientRect().top));
    ok(touch ? y < 420 : y < 420, T('step 1: first answer buttons at y = ' + y + ' (< 420)'));
    await p.check('#q-P1-y', { force: true });
    ok(await p.evaluate(() => /AI readiness check · AI chat and messaging assistant · Step 1 of 6/.test(document.getElementById('hdr').innerText.replace(/\s+/g, ' ')) && /Your checks \(1\)/.test(document.getElementById('home').innerText)), T('step: one-line header with tool, step and "Your checks (1)"'));
    ok(await p.evaluate(() => { const h = document.getElementById('nh-P1'); const c = getComputedStyle(h).color; const m = c.match(/\d+/g).map(Number); return !h.classList.contains('bad') && !(m[0] > 140 && m[1] < 90) && [...document.querySelectorAll('.warnline')].filter(e => e.offsetParent).length === 0; }), T('note: no red text before typing'));
    ok(await p.evaluate(() => /Where is this written down\? One line, for your own report\./.test(document.querySelector('.proof label').innerText) && /Add at least two words, for example:/.test(document.getElementById('nh-P1').innerText)), T('note: ruled prompt and hint'));
    ok((await p.textContent('#stepfoot')) === '1 of 6 answered · 1 Yes needs a note', T('step footer counts the Yes and says a note is needed: ' + await p.textContent('#stepfoot')));
    await shot('06_step1_yes');
    await p.fill('#pf-P1', 'me'); await p.focus('#q-P5-k'); 
    ok(await p.evaluate(() => document.getElementById('nh-P1').classList.contains('bad')), T('note: hint turns red only after leaving the field with too little'));
    await p.fill('#pf-P1', 'Guest relations manager, 3 hours a week');
    ok((await p.textContent('#nh-P1')) === 'Note added.' && (await p.textContent('#stepfoot')) === '1 of 6 answered', T('note: accepted note clears the hint and the footer'));
    await p.check('#q-P5-k', { force: true });
    ok(await p.evaluate(() => ReadinessCheck.record().Who.P5 === 'vendor' && document.getElementById('who-P5').value === 'vendor'), T('F17: "Don\'t know yet" on a vendor question saves "The vendor" at once'));
    ok(await p.evaluate(() => getComputedStyle(document.querySelector('.opt.on')).backgroundColor !== 'rgb(21, 24, 29)' && getComputedStyle(document.querySelector('.opt:not(.on)')).borderTopColor === 'rgb(138, 143, 153)'), T('V3: selected answer is the accent colour, unselected border #8A8F99'));
    ok(await p.evaluate(() => { const f = document.getElementById('fs-P1'); const bold = [...f.querySelectorAll('legend .qtext, .yesline, .proof label, b, strong')].filter(e => +getComputedStyle(e).fontWeight >= 600); return bold.length === 1 && getComputedStyle(f.querySelector('.qtext')).fontSize === '18px'; }), T('V4: the question is 18 px and the only bold text on its card'));
    ok(await p.evaluate(() => !/proof/i.test(document.body.innerText) && !/Tick/.test(document.body.innerText) && /What this tool needs: people/.test(document.body.innerText)), T('step: no "proof", no "Tick"; neutral list lead-in'));
    ok(await noH(p), T('step: no horizontal scroll')); if (touch) { const s = await small(p); ok(!s.length, T('step: touch targets ≥ 44 px ' + s.join(','))); }
    if (touch) ok(await p.evaluate(() => { const n = document.querySelector('.navrow .btn.primary').getBoundingClientRect(), bk = document.querySelector('.navrow .back').getBoundingClientRect(); return n.width > innerWidth - 40 && bk.bottom <= n.top; }), T('phone: Next is full width with Back above it'));
    await shot('07_step1', true);
    // realistic chatbot path: three must-haves Yes (one without note), one No, rest don't know
    const plan = (code, gate, list, k) => list ? (k === 0 ? 'y' : 'k') : code === 'P1' ? ['y', 'Guest relations manager, 3 hours a week'] : code === 'F1' ? ['y', 'Line in the 2027 budget approved by owner'] : code === 'F2' ? 'y' : code === 'O1' ? 'n' : code === 'P4' ? 'p' : code === 'X1' ? 'y' : 'k';
    await answerAll(p, plan);
    // --- result (stop) ---
    const res = () => p.evaluate(() => ({ level: document.getElementById('verdict').dataset.level, v: document.getElementById('vsent').innerText, c: document.getElementById('count').innerText, first: [...document.querySelectorAll('.first li')].map(l => l.innerText), prim: [...document.querySelectorAll('#view .btn.primary')].map(b => b.innerText), vs: document.querySelectorAll('.vsent').length, cs: document.querySelectorAll('#count').length,
      fold: (() => { const r = document.getElementById('primary').getBoundingClientRect(), v = document.getElementById('vsent').getBoundingClientRect(), c = document.getElementById('count').getBoundingClientRect(); return v.top >= 0 && c.top >= 0 && r.bottom <= innerHeight; })(), newTop: !!document.querySelector('#verdict #new'), text: document.getElementById('view').innerText }));
    let R = await res();
    ok(R.level === 'stop' && R.v === 'Not ready yet. 1 thing to settle before you sign.' && R.vs === 1 && R.cs === 1, T('result (stop): one verdict sentence: ' + R.v));
    ok(R.c === '2 of 8 must-haves done · 1 not in place · 1 needs a note · 4 to find out', T('result: one count line: ' + R.c));
    ok(R.first.length === 3 && /^Owner or head office: /.test(R.first[0]) && /^You: Add a note/.test(R.first[1]) && R.first.every(t => /^[A-Z][^:]+: /.test(t)), T('result: three named tasks: ' + R.first.map(t => t.slice(0, 28)).join(' | ')));
    ok(R.prim.length === 1 && R.prim[0] === 'Send the questions to the people who know', T('result (stop): exactly one primary button, "Send the questions…"'));
    ok(R.fold, T('result: verdict sentence, count line and primary button on the first screen'));
    ok(R.newTop, T('result: "Start a new check" is in the top action row'));
    ok(!/proof/i.test(R.text) && !/\d\s?%/.test(R.text.replace(/How this result was worked out[\s\S]*$/, '')), T('result: no "proof"; no % on the page with rows closed'));
    await shot('08_result_stop'); await shot('08_result_stop_full', true);
    ok(await noH(p), T('result: no horizontal scroll')); if (touch) { const s = await small(p); ok(!s.length, T('result: touch targets ≥ 44 px ' + s.join(','))); }
    const gap = await p.evaluate(() => { const k = [...document.getElementById('view').children]; return Math.round(k[1].getBoundingClientRect().top - k[0].getBoundingClientRect().bottom); });
    ok(gap === 18, T('V1: measured gap between panels is ' + gap + ' px'));
    await p.click('#primary');
    ok(await p.evaluate(() => { const a = document.activeElement, r = document.getElementById('send').getBoundingClientRect(); return a.dataset.act === 'copy-find' && r.top < innerHeight && r.bottom > 0; }), T('result: the primary button opens the copy-by-person list'));
    ok(await p.evaluate(() => { const t = [...document.querySelectorAll('[data-act=copy-find]')].map(b => b.innerText); return t.some(x => /^Copy for IT \(/.test(x)) && !t.some(x => /Copy for it/.test(x)); }), T('J18: "Copy for IT" (role names keep their capitals)'));
    await p.click('[data-act=copy-find][data-who=it]'); const clip2 = await p.evaluate(() => navigator.clipboard.readText()).catch(() => '');
    ok(clip2 === '' || (/For: IT/.test(clip2) && /Please reply to each line/.test(clip2)), T('copy for IT text'));
    ok(await p.evaluate(() => { const g = [...document.querySelectorAll('.agroup')].map(a => a.dataset.group); const note = document.querySelector('.agroup[data-group=note]'); return g.join() === 'must,note,vendor,find,close' && /Add a note to confirm/.test(note.innerText) && /Yes, note missing/.test(note.querySelector('.chip').innerText) && /before signing/.test(document.querySelector('.agroup[data-group=vendor] h3').innerText); }), T('action plan: groups in order; "Yes, note missing" under "Add a note to confirm"'));
    ok(await p.evaluate(() => /\d+ open items in \d+ questions/.test(document.querySelector('#plan .sub').innerText)), T('F14: "N open items in M questions"'));
    // inline note on the result
    await p.fill('#plan #pf-F2', 'Reply time 9 hours, measured in October'); await p.click('#note-save'); R = await res();
    ok(R.c === '3 of 8 must-haves done (was 2) · 1 not in place · 4 to find out', T('result: note added on the result, count line shows the change: ' + R.c));
    // rows: areas in words, legal, method
    await p.click('details[data-row=areas] > summary'); 
    ok(await p.evaluate(() => { const t = document.querySelector('details[data-row=areas]').innerText; return /(Strong|Gaps to close|Weak|Too little to say)/.test(t) && /\d of \d+ answered/.test(t) && !/%/.test(t); }), T('J21: areas in words with "x of y answered", no percentages'));
    await shot('09_result_areas');
    await p.click('details[data-row=areas] > summary');
    await p.click('details[data-row=method] > summary');
    ok(await p.evaluate(() => { const t = document.querySelector('details[data-row=method]').innerText; return /Changed in rules v4/.test(t) && document.querySelectorAll('details[data-row=method] ul.tight li').length >= 12 && /reworded after an internal wording review on 18 Nov 2026\. Not yet reviewed by outside experts or tested with hotels\./.test(t) && /Rules v4 \(20 Nov 2026\)/.test(t); }), T('method: "Changed in rules v4" list, ruled review sentence, rules v4'));
    await p.click('details[data-row=method] > summary');
    await p.click('details[data-row=legal] > summary');
    ok(await p.evaluate(() => { const t = document.querySelector('details[data-row=legal]').innerText; return /Provisional label/.test(t) && !/to verify|Art\.|Annex/.test(t); }), T('legal row: provisional line, no article numbers'));
    await p.click('details[data-row=legal] > summary');
    // stable ids
    ok(await p.evaluate(() => ['share-btn', 'new', 'o-ask', 'o-cost', 'o-by', 'n-when', 'n-date', 'share', 'primary'].every(i => document.getElementById(i))), T('result: stable ids still exist'));
    // --- review of open items ---
    await p.click('[data-act=review]');
    ok(await p.evaluate(() => /^1 thing is|^\d+ things are/.test(document.querySelector('#view h2').innerText) && /still holding the verdict back\. \d+ smaller gaps? (is|are) below\./.test(document.querySelector('#view h2').innerText) && document.querySelectorAll('#view section h3')[0].innerText === 'Must-haves'), T('review: heading and must-haves first: ' + await p.textContent('#view h2')));
    const before = await p.evaluate(() => document.querySelectorAll('#view .qa').length);
    await p.check('#q-O1-y', { force: true }); await p.fill('#pf-O1', 'One-page plan approved by the owner on 12 Nov'); await p.click('#q-P4-y', { force: true });
    ok(await p.evaluate(b4 => document.querySelectorAll('#view .qa').length === b4 && !!document.getElementById('undo-P4') && /Now: Yes/.test(document.getElementById('fs-P4').innerText), before), T('review: an answered question stays in place, greyed, with Undo'));
    await shot('10_review');
    await p.click('#undo-P4');
    ok(await p.evaluate(() => ReadinessCheck.record().A.P4 === 'p' && !document.getElementById('undo-P4') && !!document.getElementById('q-P4-p')), T('review: Undo restores the earlier answer'));
    ok(await noH(p), T('review: no horizontal scroll')); if (touch) { const s = await small(p); ok(!s.length, T('review: touch targets ≥ 44 px ' + s.join(','))); }
    await p.click('[data-act=to-result]'); R = await res();
    ok(R.level === 'open' && /^Not enough information yet\. 4 must-haves to find out\.$/.test(R.v) && R.prim.join() === 'Send the questions to the people who know', T('result (open): ' + R.v + ' → primary "Send the questions…"'));
    ok(await p.evaluate(() => /Since \d+ Nov 2026/.test(document.querySelector('.banner').innerText)), T('return: "Since …" banner'));
    await shot('11_result_open');
    // --- make it the top verdict: answer everything Yes with notes ---
    await p.click('[data-act=edit]');
    await answerAll(p, (code, gate, list) => list ? 'y' : gate ? ['y', 'Written down and filed on 12 Nov'] : code === 'T2' ? 'y' : code === 'G1' ? 'p' : 'y');
    R = await res();
    ok(R.level === 'pilot' && R.v === 'No blocker found: you can start a pilot. All 8 must-haves are in place (your own answers, not checked). 1 smaller gap to close during the pilot.' && R.prim.join() === 'Download the report for your owner (PDF)', T('result (top verdict): sentence and primary "Download the report for your owner (PDF)": ' + R.v));
    ok(/You answered Yes to every must-have and added a note\. Nobody has checked the notes\./.test(R.text) && R.fold && R.newTop, T('result (top verdict): honest summary line; first screen holds verdict, count, button'));
    await shot('12_result_pilot'); await shot('12_result_pilot_full', true);
    // --- PDF ---
    const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 30000 }), p.click('#primary')]);
    const pdfPath = `${OUT}/${w}_report.pdf`; await dl.saveAs(pdfPath);
    ok(/^AI-readiness-check_hotel-test_ai-chat-and-messaging-assistant_\d{4}-\d\d-\d\d\.pdf$/.test(dl.suggestedFilename()), T('PDF: file name uses the tool\'s short name: ' + dl.suggestedFilename()));
    // --- save as file, share + withdraw (local mode) ---
    const [dj] = await Promise.all([p.waitForEvent('download'), p.click('[data-act=file]')]); const saved = JSON.parse(fs.readFileSync(await dj.path(), 'utf8'));
    ok(saved.kind === 'hftp-readiness-check' && saved.v === 3 && saved.rules === 'v4 (20 Nov 2026)' && saved.check.rv === 2, T('save as file: format unchanged (kind, v: 3), rules v4'));
    await p.click('details[data-row=share] > summary');
    ok(await p.evaluate(() => { const t = document.getElementById('share').innerText; return /Student prototype: a shared copy goes to the project team \(EHL SBP Group 36\)\. A deletion date and a contact address are not set yet; you can withdraw your copy at any time with the button below\./.test(t) && /No hotel name unless you tick the box/.test(t) && /linked to the account you opened the hub with/.test(t) && /who you named for open questions/.test(t) && !/to be confirmed|Anonymous/.test(document.body.innerText); }), T('share: owner\'s line, full list of what is sent, no placeholders'));
    await shot('13_share');
    await p.click('#share-btn'); await p.waitForFunction(() => ReadinessCheck.state().share === 'shared');
    ok(await p.evaluate(() => { const d = JSON.parse(localStorage.getItem('hftp-readiness-checks-v1')); const k = Object.keys(d)[0]; return d[k].v === 3 && d[k].rules === 'v4 (20 Nov 2026)' && d[k].level === 'pilot' && !('hotelName' in d[k]) && document.getElementById('share').open && !!document.getElementById('unshare'); }), T('share (local mode): copy written, shape unchanged, panel stays open with Withdraw'));
    await p.click('#unshare'); await p.waitForFunction(() => ReadinessCheck.state().share === 'none');
    ok(await p.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('hftp-readiness-checks-v1'))).length === 0), T('withdraw (local mode): copy removed'));
    await p.click('#share-btn'); await p.waitForFunction(() => ReadinessCheck.state().share === 'shared');
    // --- new check from the top row ---
    await p.evaluate(() => scrollTo(0, 0)); await p.click('#new');
    ok(await p.evaluate(() => { const c = document.querySelector('.confirmline'); return c && /Start a new check\? This one stays in “Your checks”\./.test(c.innerText) && getComputedStyle(c).display !== 'inline' && c.getBoundingClientRect().top >= document.querySelector('#verdict .btnrow').getBoundingClientRect().bottom - 1; }), T('new check: confirmation on its own line'));
    await shot('14_new_confirm'); await p.click('#new-yes');
    ok(await p.evaluate(() => ReadinessCheck.state().step === 'start' && !!document.getElementById('mychecks') && /Your checks \(1\)/.test(document.getElementById('hdr').innerText) && !ReadinessCheck.state().useId), T('new check from the top row → start, earlier check listed under "Your checks"'));
    ok(await p.evaluate(() => document.querySelectorAll('#view .btn.primary').length === 1), T('start with "Your checks": one primary button'));
    await shot('15_your_checks');
    // --- return visit ---
    await p.reload();
    ok(await p.evaluate(() => /No blocker found/.test(document.querySelector('.mycheck .chip').innerText) && /8 of 8 must-haves done/.test(document.querySelector('.mycheck').innerText)), T('return visit: "Your checks" shows the check with its verdict'));
    await p.click('[data-act=open-result]');
    ok(await p.evaluate(() => ReadinessCheck.state().step === 'result' && document.getElementById('verdict').dataset.level === 'pilot'), T('return visit: See result opens it'));
    await p.click('#home'); ok(await p.evaluate(() => ReadinessCheck.state().step === 'start'), T('header link "Your checks" leads to the list from the result'));
    await p.goBack(); ok(await p.evaluate(() => ReadinessCheck.state().step === 'result'), T('Back returns to the result'));
    // --- team page (this browser's shared copy) ---
    await p.goto(BASE + 'team.html'); await p.waitForSelector('#view[data-state=ready]');
    ok(await p.evaluate(() => { const t = document.body.innerText; return /No hotel name · /.test(t) && /made with rules v4 \(20 Nov 2026\)/.test(t) && /No blocker found: you can start a pilot/.test(t) && /In place/.test(t) && !/Anonymous|proof|Ready to pilot/i.test(t) && /Part of a group|Independent hotel/.test(t); }), T('team page: v4 wording, rules version of the copy shown'));
    ok(await noH(p), T('team: no horizontal scroll'));
    await shot('16_team', true);
    ok(p._errs.length === 0, T('no console errors: ' + p._errs.join(' | ')));
    await ctx.close();

    // --- stage "already in use" + Swiss hotel + high-risk tool ---
    { const { ctx, p } = await mk(b, w, h, touch); await p.goto(BASE + 'index.html'); await startTool(p, 'hr-2', 'live', 'independent', 'Switzerland');
      await answerAll(p, (code, gate, list) => list ? 'y' : code === 'XL' ? ['none', 'Our lawyer checked on 3 Nov, no EU candidates'] : code === 'G2s' ? ['none', 'Adviser confirmed by email on 5 Nov'] : code === 'XG' ? 'none' : gate ? ['y', 'Written down and filed on 12 Nov'] : 'y');
      const t = await p.evaluate(() => ({ v: document.getElementById('vsent').innerText, all: document.getElementById('view').innerText, d5: !!document.getElementById('q-D5a-none') }));
      ok(t.v.startsWith('No blocker found for continued use. All 12 must-haves are in place') && !/before you sign|before signing|Run a time-limited pilot|start a pilot/.test(t.all), T('stage "already in use": own verdict name, never "before you sign" or "run a pilot": ' + t.v.slice(0, 60)));
      await p.click('details[data-row=legal] > summary');
      ok(await p.evaluate(() => { const d = document.querySelector('details[data-row=legal]'), t = d.innerText; return /High-risk/.test(t) && /applies from 2 Dec 2027/.test(t) && /If the EU AI Act applies to you/.test(t) && d.querySelectorAll('ul.tight')[0].children.length === 8 && /Show \d+ more/.test(t) && /The EU AI Act reaches hotels outside the EU only in some cases\. Ask your legal adviser whether it applies to you\./.test(t) && !/to verify|BGE|Ordinance|Art\.|Annex|for example a group/.test(t); }), T('legal (hr-2, Switzerland): date on the label line, first eight then "Show N more", neutral country sentence, no unverified notes'));
      await p.click('details[data-row=legal-more] > summary'); await p.screenshot({ path: `${OUT}/${w}_17_legal_hr2_ch.png`, fullPage: true });
      ok(await p.evaluate(() => document.querySelectorAll('details[data-row=legal] ul.tight li').length >= 13), T('legal: every high-risk item can be shown'));
      ok(!t.d5, T('F01: "uses no personal data" not offered on the recruiting tool'));
      ok(p._errs.length === 0, T('hr-2 run: no console errors ' + p._errs.join('|'))); await ctx.close(); }

    // --- a check saved by the OLD build: browser record, then the JSON file ---
    { const st3 = JSON.parse(fs.readFileSync(FX + 'storage-v3.json', 'utf8')).localStorage;
      const { ctx, p } = await mk(b, w, h, touch, { fn: ls => { if (!sessionStorage.getItem('seeded')) { for (const k in ls) if (ls[k] != null) localStorage.setItem(k, ls[k]); sessionStorage.setItem('seeded', '1'); } }, arg: st3 });
      await p.goto(BASE + 'index.html'); const old = JSON.parse(st3['hftp-readiness-mychecks-v1']), id = JSON.parse(st3['hftp-readiness-current-v1']);
      const s = await p.evaluate(() => ({ st: ReadinessCheck.state(), rec: ReadinessCheck.record(), banner: (document.querySelector('.banner') || {}).innerText || '', v: document.getElementById('vsent').innerText, c: document.getElementById('count').innerText }));
      ok(s.st.step === 'result' && s.st.id === id && JSON.stringify(s.rec.A) === JSON.stringify(old[id].A) && JSON.stringify(s.rec.P) === JSON.stringify(old[id].P) && s.rec.hotel.name === 'Hotel Fixture', T('old build record: opens on the result with the same answers and notes'));
      ok(s.rec.snaps.length === 2 && s.rec.snaps[0].rules === 'v3 (19 Nov 2026)' && JSON.stringify(s.rec.snaps[0]) === JSON.stringify(old[id].snaps[0]) && s.rec.snaps[1].rules === 'v4 (20 Nov 2026)', T('old build record: v3 history kept untouched, new v4 result added'));
      ok(/worked out with earlier rules, so the two are not compared/.test(s.banner) && !/\(was/.test(s.c), T('old build record: labelled "earlier rules", not compared: ' + s.c));
      await p.click('details.inner > summary'); ok(/\(worked out with earlier rules\)/.test(await p.evaluate(() => document.querySelector('.banner').innerText)), T('old build record: earlier result labelled in the history'));
      await p.click('details[data-row=must] > summary');
      ok(await p.evaluate(() => /This answer is no longer offered for this tool\. Please answer again\./.test(document.querySelector('details[data-row=must]').innerText)), T('old build record: stored "no personal data" on the recruiting tool is asked again, with the ruled line'));
      await p.screenshot({ path: `${OUT}/${w}_18_old_record.png`, fullPage: true });
      ok(s.st.share === 'shared', T('old build record: still marked as shared'));
      await p.click('details[data-row=share] > summary'); await p.click('#unshare'); await p.waitForFunction(() => ReadinessCheck.state().share === 'none');
      ok(await p.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('hftp-readiness-checks-v1'))).length === 0), T('old build record: withdrawing its shared copy works'));
      ok(p._errs.length === 0, T('old build record: no console errors ' + p._errs.join('|'))); await ctx.close();
      // team page with the old shared copy
      const t = await mk(b, w, h, touch, { fn: ls => { for (const k in ls) if (ls[k] != null) localStorage.setItem(k, ls[k]); }, arg: st3 });
      await t.p.goto(BASE + 'team.html'); await t.p.waitForSelector('#view[data-state=ready]');
      ok(await t.p.evaluate(() => /made with rules v3 \(19 Nov 2026\) \(earlier rules\); recomputed here with rules v4 \(20 Nov 2026\)/.test(document.getElementById('made-with').innerText) && /earlier rules/.test(document.querySelector('.sub-row').innerText)), T('team page: copy shared by the old build shows the rules it was made with'));
      await t.p.screenshot({ path: `${OUT}/${w}_19_team_old_copy.png`, fullPage: true });
      ok(t.p._errs.length === 0, T('team page (old copy): no console errors ' + t.p._errs.join('|'))); await t.ctx.close();
      // JSON file saved by the old build
      const f = await mk(b, w, h, touch); await f.p.goto(BASE + 'index.html'); await f.p.setInputFiles('#loadfile', FX + 'check-v3.json'); await f.p.waitForSelector('#view[data-state=result]');
      const fr = await f.p.evaluate(() => ReadinessCheck.record()); const fx = JSON.parse(fs.readFileSync(FX + 'check-v3.json', 'utf8')).check;
      ok(JSON.stringify(fr.A) === JSON.stringify(fx.A) && JSON.stringify(fr.P) === JSON.stringify(fx.P) && fr.id === fx.id && fr.snaps[0].rules === 'v3 (19 Nov 2026)', T('old build file: opens with the same answers, notes and history'));
      ok(f.p._errs.length === 0, T('old build file: no console errors ' + f.p._errs.join('|'))); await f.ctx.close(); }

    // --- inside a fake hub frame: message shapes, one db:set, one db:delete ---
    { const { ctx, p } = await mk(b, w, h, touch);
      await ctx.route('**/__hub.html', r => r.fulfill({ contentType: 'text/html', body: `<!doctype html><body style="margin:0"><iframe id="f" src="/readiness-check/index.html" style="width:100vw;height:100vh;border:0"></iframe><script>window.msgs=[];addEventListener('message',e=>{const m=e.data;if(!m||!m.hub)return;msgs.push(JSON.parse(JSON.stringify(m,(k,v)=>v instanceof Blob?'[blob]':v)));const s=e.source;if(m.hub==='ping')s.postMessage({hub:'pong',downloads:false},location.origin);if(m.hub==='db')s.postMessage({hub:'db-result',id:m.id,ok:true,docs:[]},location.origin);});</script>` }));
      await p.goto('http://127.0.0.1:8805/__hub.html'); const fr = p.frameLocator('#f'); const f = p.frames()[1]; await f.waitForSelector('#go-prep');
      await f.selectOption('#h-type', 'independent'); await f.click('[data-act=pick][data-id="rm-2"]'); await f.check('#stage-choose', { force: true }); await f.click('#go-prep'); await f.click('#begin-top'); for (let i = 0; i < 6; i++) await f.click('[data-act=next]');
      await f.click('details[data-row=share] > summary'); await f.dblclick('#share-btn'); await f.waitForFunction(() => ReadinessCheck.state().share === 'shared');
      await f.click('#unshare'); await f.waitForFunction(() => ReadinessCheck.state().share === 'none');
      const msgs = await p.evaluate(() => window.msgs); const sets = msgs.filter(m => m.hub === 'db' && m.op === 'set'), dels = msgs.filter(m => m.hub === 'db' && m.op === 'delete');
      ok(sets.length === 1 && dels.length === 1 && sets[0].col === 'readiness' && sets[0].doc === dels[0].doc && sets[0].data.v === 3 && ['useId', 'useName', 'stage', 'role', 'type', 'country', 'answers', 'who', 'level', 'met', 'gates', 'known', 'asked', 'open', 'snaps', 'sharedAt', 'named', 'proofGiven', 'rules'].every(k => k in sets[0].data), T('hub frame: one db:set despite a double click, one db:delete, message and document shapes unchanged'));
      ok(msgs.some(m => m.hub === 'ping') && msgs.some(m => m.hub === 'db' && m.op === 'probe'), T('hub frame: ping and probe sent as before'));
      await ctx.close(); }
  }
  await b.close();
  console.log('external hosts requested: ' + JSON.stringify([...ext]));
  console.log((fail ? 'FAILED' : 'ok') + ': ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
