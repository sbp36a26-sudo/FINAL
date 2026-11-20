// Rules v4 (20 Nov 2026): one test per item of the build ruling, taken from the audit's repros
// (reports/audit-readiness/1_fact_logic.md, F01–F41) and not from the fixes.
// Run after building: node tools/readiness-check/tests/v4.test.mjs
// To see them fail on the old rules: RC_LOGIC=<path to v3 logic.js> RC_HTML=backup-v3/index.html node tests/v4.test.mjs
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
const here = dirname(fileURLToPath(import.meta.url)), root = join(here, '..');
const htmlPath = process.env.RC_HTML ? resolve(root, process.env.RC_HTML) : join(root, 'index.html');
const html = readFileSync(htmlPath, 'utf8'), team = readFileSync(join(dirname(htmlPath), 'team.html'), 'utf8');
const D = JSON.parse(html.match(/<script type="application\/json" id="d-data">([\s\S]*?)<\/script>/)[1]);
const ctx = { self: {} }; vm.runInNewContext(readFileSync(process.env.RC_LOGIC || join(root, 'src/logic.js'), 'utf8'), ctx);
const fctx = { self: {} }; vm.runInNewContext(readFileSync(join(root, 'src/flow.js'), 'utf8'), fctx);
const L = ctx.self.RCLogic, F = fctx.self.RCFlow, M = L.model(D);
let pass = 0, fail = 0;
const ok = (c, n) => { if (c) pass++; else { fail++; console.log('FAIL  ' + n); } };
const t = (n, f) => { let r = false; try { r = !!f(); } catch (e) { r = false; n += ' [threw: ' + e.message + ']'; } ok(r, n); };
const GOOD = 'Revenue manager, four hours weekly';
const U = id => M.UI[id];
const ind = { type: 'independent', country: 'Portugal' };
function fill(x, h, v, { proof = GOOD, lv = null, gateV = null } = {}) {
  const A = {}, P = {};
  L.selectQuestions(M, x, h).forEach(q => {
    if (q.list) { q.items.forEach((_, i) => A[q.code + '#' + i] = lv || v); return; }
    A[q.code] = q.gate && gateV ? gateV : v;
    if (q.gate && A[q.code] === 'y' && proof) P[q.code] = proof;
  });
  return [A, P];
}
const qsOf = (id, h = ind) => L.selectQuestions(M, U(id), h);
const has = (id, code, h = ind) => qsOf(id, h).find(q => q.code === code);
const setArea = (x, h, A, a, v) => L.selectQuestions(M, x, h).filter(q => q.a === a).forEach(q => { if (q.list) q.items.forEach((_, i) => A[q.code + '#' + i] = v); else A[q.code] = v; });
let A, P, e;

// ---- Step 0: a check saved by the v3 build opens and re-evaluates ----
const fx = JSON.parse(readFileSync(join(here, 'fixtures/check-v3.json'), 'utf8'));
const st3 = JSON.parse(readFileSync(join(here, 'fixtures/storage-v3.json'), 'utf8'));
t('fixture: file saved by the v3 build has the unchanged format (kind, v: 3)', () => fx.kind === 'hftp-readiness-check' && fx.v === 3 && fx.rules === 'v3 (19 Nov 2026)');
t('fixture: file opens with the same answers, notes and history', () => { const m = F.migrate(JSON.parse(JSON.stringify(fx.check)), u => !!M.UI[u]); return m && JSON.stringify(m.A) === JSON.stringify(fx.check.A) && JSON.stringify(m.P) === JSON.stringify(fx.check.P) && JSON.stringify(m.snaps) === JSON.stringify(fx.check.snaps) && m.step === 'result' && m.sharedAt === fx.check.sharedAt; });
t('fixture: browser record (hftp-readiness-mychecks-v1) opens the same way', () => { const mine = JSON.parse(st3.localStorage['hftp-readiness-mychecks-v1']), id = JSON.parse(st3.localStorage['hftp-readiness-current-v1']); const m = F.migrate(mine[id], u => !!M.UI[u]); return m && m.useId === 'hr-2' && JSON.stringify(m.A) === JSON.stringify(fx.check.A) && m.snaps.length === 1; });
t('fixture: re-evaluates under the current rules without error; level key is one of stop/open/pilot', () => { const c = fx.check, ev = L.evaluate(M, U(c.useId), c.hotel, c.A, c.P, c.Who, c.stage); return ['stop', 'open', 'pilot'].includes(ev.level) && ev.counts.gates >= 10; });
t('fixture: its v3 snapshot is not compared with a v4 one (labelled, not compared)', () => { const c = fx.check, ev = L.evaluate(M, U(c.useId), c.hotel, c.A, c.P, c.Who, c.stage); return L.compare(c.snaps[0], L.snapshot(ev, '2026-11-21T10:00:00Z')) === null && L.RULES === 'v4 (20 Nov 2026)'; });
t('fixture (F01): stored "no personal data" on a recruiting tool is kept but asked again', () => { const c = fx.check, ev = L.evaluate(M, U(c.useId), c.hotel, c.A, c.P, c.Who, c.stage), g = ev.gates.find(g => g.q.code === 'D5a'); return c.A.D5a === 'none' && !g.met && !g.known && /no longer offered/.test(g.s.flag); });
t('fixture: shared-copy document of the v3 build still evaluates (team page)', () => { const docs = JSON.parse(st3.localStorage['hftp-readiness-checks-v1']), d = Object.values(docs)[0]; const ev = L.evaluate(M, U(d.useId), { type: d.type, country: d.country }, d.answers, {}, d.who, d.stage); return d.v === 3 && d.rules === 'v3 (19 Nov 2026)' && !!ev.level; });
t('level keys unchanged', () => Object.keys(L.LEVELS).join() === 'stop,open,pilot');
t('rules version is v4 (20 Nov 2026)', () => L.RULES === 'v4 (20 Nov 2026)');

// ---- A1 item 1 (F03) ----
t('1 F03: rm-2 all Yes with notes, Skills all "Doesn\'t apply" → pilot, not stuck at open', () => { [A, P] = fill(U('rm-2'), ind, 'y'); setArea(U('rm-2'), ind, A, 'sk', 'na'); e = L.evaluate(M, U('rm-2'), ind, A, P); return e.level === 'pilot' && e.area.sk.word === "Doesn't apply"; });
t('1 F03: an area with one blank or "Don\'t know" and no known answer still counts as no known answer', () => { [A, P] = fill(U('rm-2'), ind, 'y'); setArea(U('rm-2'), ind, A, 'sk', 'na'); const q = qsOf('rm-2').find(q => q.a === 'sk' && !q.list); A[q.code] = 'k'; e = L.evaluate(M, U('rm-2'), ind, A, P); return e.level === 'open' && e.actions.some(a => a.q.code === q.code); });
// ---- item 2 (F04, F30) ----
t('2 F04: pr-5 all Yes with notes, the one Skills item "Not yet" → not stop; the item is a gap', () => { [A, P] = fill(U('pr-5'), ind, 'y'); setArea(U('pr-5'), ind, A, 'sk', 'n'); e = L.evaluate(M, U('pr-5'), ind, A, P); return e.area.sk.asked === 1 && e.level !== 'stop' && e.actions.some(a => a.group === 'close' && a.q.a === 'sk'); });
t('2: an area below 40% with two known answers still holds the verdict back', () => { [A, P] = fill(U('rm-2'), ind, 'y'); setArea(U('rm-2'), ind, A, 'sk', 'n'); e = L.evaluate(M, U('rm-2'), ind, A, P); return e.area.sk.known >= 2 && e.level === 'stop' && e.area.sk.word === 'Weak'; });
// ---- item 3 (F02) ----
t('3 F02: rm-2 all NA / unknown, D5a = D5b = way out → Data is not 100% and not "Strongest"', () => { [A, P] = fill(U('rm-2'), ind, 'na', { gateV: 'k' }); A.D5a = 'none'; A.D5b = 'none'; e = L.evaluate(M, U('rm-2'), ind, A, P); return e.area.da.pct === null && !/Strongest: [^.]*Data/.test(L.summary(e, 'choose').join(' ')) && e.gates.find(g => g.q.code === 'D5a').met; });
t('3: the way out scores {state yes, pts null}', () => { const s = L.score(has('rm-2', 'D5a'), { D5a: 'none' }, {}); return s.state === 'yes' && s.pts === null; });
// ---- item 4 (F01) ----
t('4 F01: hr-2 all Yes, D5a = D5b = XG = way out → not pilot', () => { [A, P] = fill(U('hr-2'), ind, 'y'); A.D5a = A.D5b = A.XG = 'none'; e = L.evaluate(M, U('hr-2'), ind, A, P); return e.level !== 'pilot'; });
t('4: way out not offered on D5a/D5b for sensitive-data, chat-labelled or high-risk tools', () => ['hr-2', 'fo-1', 'gx-2', 'res-8', 'res-1'].every(id => !has(id, 'D5a').none && !has(id, 'D5b').none));
t('4: elsewhere it reads "This tool uses no personal data (guests, staff, job candidates, callers)"', () => has('rm-2', 'D5a').none === 'This tool uses no personal data (guests, staff, job candidates, callers)' && has('rm-2', 'D5b').none === has('rm-2', 'D5a').none);
t('4: staff-representatives way out unchanged and still met', () => { [A, P] = fill(U('hr-2'), ind, 'y'); A.XG = 'none'; delete P.XG; e = L.evaluate(M, U('hr-2'), ind, A, P); return e.gates.find(g => g.q.code === 'XG').met && has('hr-2', 'XG').none === 'We have no staff representatives'; });
// ---- item 5 (F12, J11) ----
t('5 F12: rm-2 all Yes, no notes → open, "8 must-haves need a note to confirm", nothing under "Before anything else"', () => { [A, P] = fill(U('rm-2'), ind, 'y', { proof: '' }); e = L.evaluate(M, U('rm-2'), ind, A, P); return e.level === 'open' && L.summary(e, 'choose').join(' ').includes('8 must-haves need a note to confirm') && e.actions.filter(a => a.group === 'must').length === 0 && e.actions.filter(a => a.group === 'note').length === 8 && e.counts.note === 8 && e.counts.met === 0; });
t('5: a Yes without a note keeps its 2 points and its answer', () => { const s = L.score(has('rm-2', 'P1'), { P1: 'y' }, {}); return s.state === 'unconf' && s.ans === 'y' && s.pts === 2; });
t('5: Partly on a must-have stays not met (stop)', () => { [A, P] = fill(U('rm-2'), ind, 'y'); A.P1 = 'p'; e = L.evaluate(M, U('rm-2'), ind, A, P); return e.level === 'stop' && e.unmet.length === 1; });
t('5: the note rule is unchanged (2 words, 8 characters)', () => !L.proofOk('x') && !L.proofOk('aaaaaaaaa') && !L.proofOk('a b') && L.proofOk('aaaa bbbb'));
// ---- item 6 (F05) ----
const rpe = has('fo-4', 'R-pe');
t('6 F05: fo-4 people list "in place, don\'t know" → 2 of 2 points but still to find out', () => { const AA = {}; rpe.items.forEach((_, i) => AA['R-pe#' + i] = i === 0 ? 'y' : 'k'); const s = L.score(rpe, AA, {}); return s.pts === 2 && s.done === false; });
const five = { code: 'R-x', list: true, items: ['a', 'b', 'c', 'd', 'e'] }, set5 = v => Object.fromEntries(v.split(',').map((x, i) => ['R-x#' + i, x]));
t('6: five items y,n,n,n,n → 0.4 points; y,y,y,y,n → 1.6', () => L.score(five, set5('y,n,n,n,n'), {}).pts === 0.4 && L.score(five, set5('y,y,y,y,n'), {}).pts === 1.6);
t('6: "Don\'t know" and "Doesn\'t apply" items are left out of the points', () => L.score(five, set5('y,k,na,na,n'), {}).pts === 1 && L.score(five, set5('na,na,na,na,na'), {}).pts === null && L.score(five, set5('na,na,na,na,na'), {}).done === true);
// ---- item 7 (F13, F14) ----
t('7 F13: all "Don\'t know" → 0 of N answered, N to find out', () => { [A, P] = fill(U('rm-2'), ind, 'k'); e = L.evaluate(M, U('rm-2'), ind, A, P); return e.counts.answered === 0 && e.counts.find === e.counts.asked && e.counts.asked === 22; });
t('7 F13: "Doesn\'t apply" counts as answered, in the headline and in the areas alike', () => { [A, P] = fill(U('rm-2'), ind, 'y'); setArea(U('rm-2'), ind, A, 'sk', 'na'); e = L.evaluate(M, U('rm-2'), ind, A, P); const sum = L.AK.reduce((n, a) => n + e.area[a].answered, 0); return e.counts.answered === 22 && sum === 22; });
t('7 F14: open items and the questions they sit in are both counted', () => { [A, P] = fill(U('rm-2'), ind, 'y'); qsOf('rm-2').filter(q => q.list).forEach(q => { A[q.code + '#0'] = 'n'; A[q.code + '#1'] = 'k'; }); e = L.evaluate(M, U('rm-2'), ind, A, P); return e.counts.open === e.actions.length && e.counts.openQs < e.counts.open && e.counts.openQs === new Set(e.actions.map(a => a.q.code)).size; });
// ---- item 8 (F17) ----
t('8 F17: rm-2, looking at options, P5 "Don\'t know", box untouched → under "Confirm with the vendor", with its vendor question', () => { [A, P] = fill(U('rm-2'), ind, 'y'); A.P5 = 'k'; e = L.evaluate(M, U('rm-2'), ind, A, P, {}, 'explore'); const a = e.actions.find(a => a.q.code === 'P5'); return a.group === 'vendor' && a.who === 'vendor' && L.vendorQs(M, U('rm-2'), e).some(q => /overrule or switch off/.test(q)); });
t('8: once a vendor is being signed, the same question goes to its usual person', () => { [A, P] = fill(U('rm-2'), ind, 'y'); A.P5 = 'k'; e = L.evaluate(M, U('rm-2'), ind, A, P, {}, 'sign'); return e.actions.find(a => a.q.code === 'P5').who === 'dept'; });
// ---- item 9 (F06, F33) ----
const ch = { type: 'independent', country: 'Switzerland' }, de = { type: 'independent', country: 'Germany' };
t('9 F06: hr-2 in Switzerland, "EU AI Act does not apply to us" with a note → must-have met', () => { [A, P] = fill(U('hr-2'), ch, 'y'); A.XL = 'none'; P.XL = 'Our lawyer checked on 3 Nov'; e = L.evaluate(M, U('hr-2'), ch, A, P); const g = e.gates.find(g => g.q.code === 'XL'); return g.q.gate && g.met && has('hr-2', 'XL', ch).none === 'We have checked: the EU AI Act does not apply to us'; });
t('9: without the note it is not confirmed (no stop, no met)', () => { [A, P] = fill(U('hr-2'), ch, 'y'); A.XL = 'none'; delete P.XL; e = L.evaluate(M, U('hr-2'), ch, A, P); const g = e.gates.find(g => g.q.code === 'XL'); return !g.met && g.unconf && e.level === 'open'; });
t('9: Germany → way out not offered; United Kingdom and Other → offered', () => !has('hr-2', 'XL', de).none && !!has('hr-2', 'XL', { country: 'United Kingdom' }).none && !!has('hr-2', 'XL', { country: 'Other' }).none);
t('9: XL stays a must-have in every country', () => ['Switzerland', 'United Kingdom', 'Other', 'Germany', ''].every(c => has('hr-2', 'XL', { country: c }).gate));
t('9: item list headed "If the EU AI Act applies to you" outside the EU only', () => L.legal(M, U('hr-2'), ch).itemsHead === 'If the EU AI Act applies to you' && !L.legal(M, U('hr-2'), de).itemsHead);
// ---- item 10 (F11 rule part) ----
t('10 F11: hr-2, everything else met, "Can staff overrule the tool" = No → stop', () => { [A, P] = fill(U('hr-2'), ind, 'y'); A.P5 = 'n'; e = L.evaluate(M, U('hr-2'), ind, A, P); return e.level === 'stop' && e.unmet.some(g => g.q.code === 'P5'); });
t('10: P5 and G3 are must-haves for every high-risk label, with the team\'s reason line', () => M.USES.filter(u => u.label && u.label.base === 'high').every(u => ['P5', 'G3'].every(c => { const q = has(u.id, c); return q && q.gate && q.reasons.includes('The team treats human control as a must-have for high-risk uses.') && q.yes && q.ask; })));
t('10: not extended to sensitive-data tools that are not high-risk (B7)', () => { const q = has('fo-1', 'G3'); return !q || !q.gate; });
// ---- item 11 (F19) ----
t('11 F19: rm-9 and fa-7 have the two-way link as a must-have', () => has('rm-9', 'T1').gate && has('fa-7', 'T1').gate);
t('11: only tools whose technology needs are "None" are exempt', () => M.USES.every(u => { const q = has(u.id, 'T1'); return !q || q.gate === !/^\s*none\b/i.test(u.r.te || ''); }) && !has('sm-4', 'T1').gate);
// ---- item 12 (F18) ----
t('12 F18: gx-1, gx-3, fo-2, fo-6, fo-8 do not get the guest question; the chatbot gx-2 does', () => ['gx-1', 'gx-3', 'fo-2', 'fo-6', 'fo-8'].every(id => !has(id, 'X2a')) && !!has('gx-2', 'X2a') && !!has('gx-2', 'X2b'));
t('12: no chat-labelled tool loses the guest question', () => M.USES.filter(u => u.label && u.label.chat).every(u => !!has(u.id, 'X2a')));
// ---- item 13 ----
t('13: "Changed in rules v4" has a plain line for each of the 12 rule changes', () => Array.isArray(L.CHANGES) && L.CHANGES.length >= 12 && L.CHANGES.every(s => s.length > 40));
t('13: README rules section names the same version', () => /Rules v4/.test(readFileSync(join(root, 'README.md'), 'utf8')) && /Changed in rules v4/.test(readFileSync(join(root, 'README.md'), 'utf8')));

// ---- A2 ----
const COUNTRIES = ['Germany', 'France', 'Spain', 'Sweden', 'Switzerland', 'United Kingdom', 'Portugal', 'Other', ''];
const legalAll = []; M.USES.forEach(u => COUNTRIES.forEach(c => { const l = L.legal(M, u, { country: c }); if (l) legalAll.push([l.name, l.short, l.why, l.country, l.labour, l.itemsHead, ...l.items.map(i => i.text), ...l.could.map(i => i.q)].join(' | ')); }));
t('15 F08/F34/F35: legal() output for all tools × countries has no "to verify", "Art.", "Annex", or the Spanish authority line', () => legalAll.length > 800 && legalAll.every(s => !/to verify|Art\.|Annex|AEPD|Spanish data protection authority|Ordinance 3|BGE/i.test(s)));
t('15: no Swiss or UK labour note', () => !L.legal(M, U('hr-2'), ch).labour && !L.legal(M, U('hr-2'), { country: 'United Kingdom' }).labour && /works council/.test(L.legal(M, U('hr-2'), de).labour));
t('16 F07: fo-1, DPIA "Checked: not required" with a note → met', () => { [A, P] = fill(U('fo-1'), ind, 'y'); A.G2s = 'none'; P.G2s = 'Our adviser confirmed by email on 5 Nov'; e = L.evaluate(M, U('fo-1'), ind, A, P); const g = e.gates.find(g => g.q.code === 'G2s'); return g.met && g.q.none === 'Checked: not required (confirmed in writing)'; });
t('16: DPIA help and reason as ruled; no "the GDPR requires", no "a DPIA is needed"', () => { const q = has('fo-1', 'G2s'); return q.help === 'A DPIA (data protection impact assessment) is a written assessment that data protection law requires before processing that is likely to put people at high risk. Your data protection contact decides whether this tool needs one.' && q.reasons.some(r => /ask your data protection contact whether/.test(r)) && !/GDPR requires|a DPIA is needed/.test(html + team); });
t('17 F21/F20: hr-2 shows every high-risk item (13 or more) and the date they apply from', () => { const l = L.legal(M, U('hr-2'), de); return l.items.length >= 13 && l.applies === '2027-12-02' && l.items.some(i => /legacy tool/.test(i.text)); });
t('18 F22: Swiss, UK and other non-EU hotels get the neutral sentence, no example', () => ['Switzerland', 'United Kingdom', 'Other'].every(c => { const s = L.legal(M, U('gx-2'), { country: c }).country; return s.includes('The EU AI Act reaches hotels outside the EU only in some cases. Ask your legal adviser whether it applies to you.') && !/for example a group/.test(s); }));
t('21 F29: summary sentences', () => { [A, P] = fill(U('rm-2'), ind, 'k'); e = L.evaluate(M, U('rm-2'), ind, A, P); const s = L.summary(e, 'choose').join(' '); return s.includes('8 must-haves are not known yet.') && !/more must-have/.test(s); });
t('21: top level says who answered and that nobody checked', () => { [A, P] = fill(U('rm-2'), ind, 'y'); e = L.evaluate(M, U('rm-2'), ind, A, P); return L.summary(e, 'choose')[0] === 'You answered Yes to every must-have and added a note. Nobody has checked the notes.'; });
t('21: thin area sentence names the area; lists use commas and one "and"', () => { [A, P] = fill(U('rm-2'), ind, 'y'); setArea(U('rm-2'), ind, A, 'sk', 'k'); e = L.evaluate(M, U('rm-2'), ind, A, P); return L.summary(e, 'choose').join(' ').includes('Answer at least one question in Skills.') && L.joinAnd(['A', 'B', 'C']) === 'A, B and C'; });
t('21 F11d: stage "already in use" never says "before you sign" or "Run a time-limited pilot"', () => ['y', 'n', 'k'].every(v => { [A, P] = fill(U('rm-2'), ind, v); e = L.evaluate(M, U('rm-2'), ind, A, P, {}, 'live'); const s = L.verdict(e, 'live') + ' ' + L.summary(e, 'live').join(' ') + ' ' + e.steps.join(' '); return !/before you sign|Run a time-limited pilot|start a pilot/.test(s); }));
t('27 F32: vendor question names the provider under the EU AI Act', () => L.vendorQs(M, U('rm-2'), null).includes('Who counts as the provider of this tool under the EU AI Act, you or a third party, and does the contract say so?') && !L.vendorQs(M, U('rm-2'), null).some(q => /Who is the maker/.test(q)));
t('27 F31: "usually paid for" carries its source', () => /\(team's D6 resource sheet, not a price quote\)\.$/.test(has('rm-2', 'F1').note));
t('27 F40: data protection contact help for hotels without an officer', () => /often an outside adviser/.test(has('rm-2', 'D5b').help));
t('25 F27: tick-list lead-ins are neutral; nothing says "Tick"', () => M.USES.every(u => qsOf(u.id).filter(q => q.list).every(q => /^What this tool needs: (people|skills|systems|data|written agreements)$/.test(q.q))));
t('26 F28: no "(often missing)" tick item, no unsourced step subtitle', () => M.USES.every(u => qsOf(u.id).filter(q => q.list).every(q => q.items.every(i => !/often missing/.test(i)))) && D.rdy.areas.every(a => !/most hotels are not there yet|integration is the bottleneck/.test(a.one)));
// Strings that must be gone from both built pages (ruling section E).
['expert review', '; to verify', '[To verify', 'to be confirmed', '15 minutes', 'Copy for it', 'Anonymous', 'a DPIA is needed', 'GDPR requires', 'Ready to pilot'].forEach(w => t('built pages: zero hits for "' + w + '"', () => !html.includes(w) && !team.includes(w)));
t('14 F10: the wording-review sentence is the ruled one, in the page and the footer', () => (html.match(/reworded after an internal wording review on 18 Nov 2026\. Not yet reviewed by outside experts or tested with hotels\./g) || []).length >= 2);

// ---- A3 ----
t('33 J3: "chatbot" returns the chat assistant first', () => L.search(M, 'chatbot')[0].id === 'gx-2');
t('33: "rota" returns staff scheduling first', () => L.search(M, 'rota')[0].id === 'hr-1');
t('33: "telephone", "checkin", "check in" and "staff schedule" return results', () => L.search(M, 'telephone').length > 0 && L.search(M, 'telephone')[0].id === 'res-1' && L.search(M, 'checkin').length > 0 && L.search(M, 'check in').length > 0 && L.search(M, 'staff schedule')[0].id === 'hr-1');
t('33: empty search lists all 98; nonsense lists none; department filter holds', () => L.search(M, '').length === 98 && L.search(M, 'zzzz').length === 0 && L.search(M, 'pricing', 'rm').every(u => u.dept === 'rm'));
t('34 J17: verdict sentences', () => {
  [A, P] = fill(U('rm-2'), ind, 'y'); A.P1 = 'n'; A.F1 = 'n'; const s1 = L.verdict(L.evaluate(M, U('rm-2'), ind, A, P, {}, 'choose'), 'choose');
  [A, P] = fill(U('rm-2'), ind, 'y'); A.P1 = 'k'; delete P.F1; const s2 = L.verdict(L.evaluate(M, U('rm-2'), ind, A, P, {}, 'choose'), 'choose');
  [A, P] = fill(U('rm-2'), ind, 'y'); A.F3 = 'n'; const s3 = L.verdict(L.evaluate(M, U('rm-2'), ind, A, P, {}, 'choose'), 'choose');
  return s1 === 'Not ready yet. 2 things to settle before you sign.' && s2 === 'Not enough information yet. 1 must-have to find out, 1 to confirm with a note.' && s3 === L.LEVELS.pilot.name + '. All 8 must-haves are in place (your own answers, not checked). 1 smaller gap to close during the pilot.';
});
t('34: one count line, with the earlier figure on a return visit', () => { [A, P] = fill(U('rm-2'), ind, 'y'); A.P1 = 'k'; delete P.F1; e = L.evaluate(M, U('rm-2'), ind, A, P); return L.countLine(e) === '6 of 8 must-haves done · 1 needs a note · 1 to find out' && L.countLine(e, 2).startsWith('6 of 8 must-haves done (was 2)'); });
t('34: "Do these first" holds at most three, unmet before unconfirmed before unknown, each with a person', () => { [A, P] = fill(U('rm-2'), ind, 'y'); A.P1 = 'k'; delete P.F1; A.F2 = 'n'; A.O1 = 'n'; e = L.evaluate(M, U('rm-2'), ind, A, P); const f = L.first3(e); return f.length === 3 && f[0].group === 'must' && f[1].group === 'must' && f[2].group === 'note' && f.every(i => i.person && i.text); });
t('34 B1: the top verdict name is one constant; "already in use" has its own', () => L.levelName('pilot', 'choose') === L.LEVELS.pilot.name && L.levelName('pilot', 'live') === 'No blocker found for continued use' && L.levelName('stop', 'live') === 'Not ready yet');
t('35 J21: areas in words', () => { [A, P] = fill(U('rm-2'), ind, 'y'); e = L.evaluate(M, U('rm-2'), ind, A, P); const ok1 = L.AK.every(a => e.area[a].word === 'Strong'); setArea(U('rm-2'), ind, A, 'te', 'k'); e = L.evaluate(M, U('rm-2'), ind, A, P); return ok1 && e.area.te.word === 'Too little to say' && !/%/.test(L.summary(e, 'choose').join(' ') + L.verdict(e, 'choose') + L.countLine(e)); });
t('36 J18: tick-list actions read as instructions; a must-have is listed once; groups sorted by person', () => { [A, P] = fill(U('gx-2'), ind, 'k'); qsOf('gx-2').filter(q => q.list).forEach(q => { A[q.code + '#0'] = 'n'; }); A.P1 = 'n'; e = L.evaluate(M, U('gx-2'), ind, A, P, {}, 'sign'); const keys = e.actions.filter(a => a.must).map(a => a.q.code); const find = e.actions.filter(a => a.group === 'find').map(a => a.who); return e.actions.filter(a => a.q.list).every(a => /^(Put in place|Find out whether (this is|these are) in place): /.test(a.text)) && new Set(keys).size === keys.length && find.join() === find.slice().sort((a, b) => Object.keys(L.WHO).indexOf(a) - Object.keys(L.WHO).indexOf(b)).join(); });

console.log((fail ? 'FAILED' : 'ok') + ': ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
