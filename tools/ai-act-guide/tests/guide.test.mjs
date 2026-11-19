// Checks the AI Act guide's data and logic against the AI Register's rules.
// Run: node tools/ai-act-guide/tests/guide.test.mjs   (build first if you also want the built-page checks)
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const read = p => readFileSync(join(root, p), 'utf8');
const json = p => JSON.parse(read(p));
const ref = json('../register/data/reference.json');
const labels = json('../register/data/uc-labels.json');
const guide = json('data/guide.json');
const sb = { self: {} };
vm.runInNewContext(read('../register/src/logic.js'), sb);
vm.runInNewContext(read('src/guide.js'), sb);
const L = sb.self.RegLogic, G = sb.self.GuideLogic;
const TODAY = '2026-11-19';
const ctx = G.makeCtx(ref, labels, guide, L, TODAY);

let pass = 0, fail = 0;
function ok(cond, msg) { if (cond) pass++; else { fail++; console.log('FAIL: ' + msg); } }
const hotel = { name: 'Test hotel', country: 'ES', reps: 'yes', size: 'm' };

// 1. Every type and answer resolves to a register use and classifies without error.
for (const t of guide.types) {
  for (const q of t.questions) for (const a of q.answers) {
    const ans = {};
    // answer every visible question: this one with a, the rest with their first answer
    for (const q2 of t.questions) ans[q2.id] = q2 === q ? a.id : q2.answers[0].id;
    if (q.when) ans[q.when.q] = q.when.in[0];
    for (const o of guide.origins) {
      const tool = { id: 'x', type: t.id, origin: o.id, ans, vq: {}, isai: {} };
      try {
        const e = G.evalTool(tool, hotel, ctx);
        ok(!!ctx.uses[e.row.id], `${t.id}.${q.id}.${a.id}: register use ${e.row.id} exists`);
        ok(e.tier !== 'pending' && guide.tiers[e.tier], `${t.id}.${q.id}.${a.id} (${o.id}): settles to a tier, got ${e.tier}`);
        ok(guide.levelMap[e.c.label] && guide.levelMap[e.c.label].tier === e.tier, `${t.id}.${q.id}.${a.id}: tier comes from levelMap[${e.c.label}]`);
      } catch (err) { ok(false, `${t.id}.${q.id}.${a.id} (${o.id}) threw ${err.message}`); }
    }
  }
}

// 2. Tier mapping for each register label.
const expect = { prohibited: 'banned', banif: 'pbanned', high: 'high', highif: 'phigh', transparency: 'transp', transif: 'ptransp', minimal: 'minimal', outside: 'minimal', notai: 'minimal', open: 'unknown' };
for (const [lab, tier] of Object.entries(expect)) ok(guide.levelMap[lab] && guide.levelMap[lab].tier === tier, `levelMap ${lab} -> ${tier}`);
ok(Object.keys(ref.labels).every(l => guide.levelMap[l]), 'every register label has a tier');
ok(guide.tiers.pbanned.name === 'Possibly banned' && guide.tiers.phigh.name === 'Possibly high-risk' && guide.tiers.ptransp.name === 'Possibly transparency' && guide.tiers.unknown.name === 'Not known yet', 'tier names');

// "Not sure" on a type with a ban question gives "Possibly banned"; and never a lower tier than the register for the same row.
const banTypes = [['rms', { price: 'unsure', comp: 'no' }], ['upsell', { mode: 'unsure' }], ['cctv', { mode: 'basic', emo: 'unsure', enrol: 'no', traits: 'no', judge: 'no' }],
  ['cctv', { mode: 'basic', emo: 'no', enrol: 'unsure', traits: 'no', judge: 'no' }], ['cctv', { mode: 'basic', emo: 'no', enrol: 'no', traits: 'unsure', judge: 'no' }],
  ['cv', { rank: 'rank', emo: 'unsure' }], ['staffmon', { mode: 'team', career: 'no', emo: 'unsure' }], ['voice', { mode: 'calls', emo: 'unsure', vprint: 'no', card: 'no' }], ['pms', { feat: 'unsure' }]];
for (const [type, ans] of banTypes) {
  const e = G.evalTool({ id: 'b', type, origin: 'vendor', ans, vq: {}, isai: {} }, hotel, ctx);
  ok(e.tier === 'pbanned', `${type} ${JSON.stringify(ans)}: Possibly banned, got ${e.tier}`);
  ok(e.items.some(i => i.kind === 'open'), `${type}: "Not sure" becomes a find-out item`);
}
// Level equals what the register gives for the same row and answers (one source of rules).
for (const t of guide.types) {
  const ans = {}; t.questions.forEach(q => { ans[q.id] = 'unsure'; if (!q.answers.some(a => a.id === 'unsure')) ans[q.id] = q.answers[0].id; });
  const tool = { id: 'u', type: t.id, origin: 'vendor', ans, vq: {}, isai: {} };
  const e = G.evalTool(tool, hotel, ctx), m = G.toRegister(tool, ctx);
  ok(L.classify(m.row, m.reg, ref).label === e.c.label, `${t.id}: label equals RegLogic.classify`);
}

// Rule 2: emotion question only where faces or voices are involved.
const emoTypes = guide.types.filter(t => t.questions.some(q => q.id === 'emo')).map(t => t.id).sort();
ok(JSON.stringify(emoTypes) === JSON.stringify(['cctv', 'cv', 'other', 'staffmon', 'voice']), 'emotion question on cctv, cv, other, staffmon, voice only: ' + emoTypes);
const cctv = guide.types.find(t => t.id === 'cctv');
const cctvSets = new Set(cctv.questions.flatMap(q => q.answers.flatMap(a => Object.keys(a.set))));
ok(cctvSets.has('face_enrol') && cctvSets.has('sensitive_traits'), 'CCTV asks face_enrol and sensitive_traits');
const chat = G.evalTool({ id: 'c', type: 'chatbot', origin: 'vendor', ans: { mode: 'talks', card: 'no' }, vq: {}, isai: {} }, hotel, ctx);
ok(chat.tier === 'transp' && chat.stillOpen.length === 0, 'text chatbot: Transparency, nothing open (no emotion question)');

// Rule 3: maker/user follows the register.
const branded = G.evalTool({ id: 'br', type: 'chatbot', origin: 'branded', ans: { mode: 'talks', card: 'no' }, vq: {}, isai: {} }, hotel, ctx);
ok(branded.role === 'user' && !/possibly provider/i.test(branded.roleText), 'branded non-high-risk chatbot: user, no "possibly provider"');
const brandedCv = G.evalTool({ id: 'bc', type: 'cv', origin: 'branded', ans: { rank: 'rank', emo: 'no' }, vq: {}, isai: {} }, hotel, ctx);
ok(brandedCv.role === 'maker', 'branded high-risk CV tool: maker (Art. 25(1))');
const groupBot = G.evalTool({ id: 'gb', type: 'chatbot', origin: 'built-group', ans: { mode: 'talks', card: 'no' }, vq: {}, isai: {} }, hotel, ctx);
ok(groupBot.role === 'maker' && groupBot.items.some(i => i.id === 'G1') && groupBot.items.some(i => i.id === 'C1m'), 'group-built chatbot: maker, Art. 50(2) marking item G1 and C1m from RegLogic');
ok(!/not settled|unverified/i.test(JSON.stringify(groupBot.items.filter(i => i.id === 'G1'))), 'G1 wording does not say "not settled"');
ok(guide.origins.some(o => /group's or brand's name/.test(o.name)) && guide.origins.some(o => /hotel's name/.test(o.name)), 'in-house origins: hotel name and group/brand name');

// Barcelona GM case.
const gm = { hotel: { name: 'Hotel Mirador', country: 'ES', size: 's', model: 'owned', group: 'no', reps: 'yes' }, done: {}, tools: [
  { id: 'a', type: 'chatbot', name: 'WhatsApp chatbot', vendor: 'ChatCo', origin: 'vendor', ans: { mode: 'talks', card: 'no' }, vq: {}, isai: {} },
  { id: 'b', type: 'rms', name: 'Pricing', vendor: 'RevCo', origin: 'vendor', ans: { price: 'demand', comp: 'no' }, vq: {}, isai: {} },
  { id: 'c', type: 'reviews', name: 'Review replies', vendor: 'RevuCo', origin: 'vendor', ans: { mode: 'text' }, vq: {}, isai: {} },
  { id: 'd', type: 'assistant', name: 'ChatGPT at reception', vendor: '', origin: 'shadow', ans: { mode: 'drafts', paste: 'no' }, vq: {}, isai: {} },
  { id: 'e', type: 'cctv', name: 'CCTV', vendor: 'CamCo', origin: 'vendor', ans: { mode: 'unsure', emo: 'unsure', enrol: 'no', traits: 'no', judge: 'no' }, vq: {}, isai: {} },
  { id: 'f', type: 'rota', name: 'Rota', vendor: 'ShiftCo', origin: 'vendor', ans: { mode: 'unsure' }, vq: {}, isai: {} }] };
const ev = G.evalAll(gm, ctx), byName = Object.fromEntries(ev.map(e => [e.name, e]));
ok(byName['CCTV'].tier === 'pbanned', 'GM: CCTV Possibly banned');
ok(byName['Rota'].tier === 'phigh', 'GM: Rota Possibly high-risk');
ok(byName['WhatsApp chatbot'].tier === 'transp', 'GM: chatbot Transparency');
['Pricing', 'Review replies', 'ChatGPT at reception'].forEach(n => ok(byName[n].tier === 'minimal', 'GM: ' + n + ' Minimal'));
const rows = G.plan(gm, ev, ctx), v = G.verdict(gm, ev, rows, ctx), lines = G.verdictLines(v);
ok(/^Do this month: /.test(lines[0]) && /CCTV/.test(lines[0]) && /Rota/.test(lines[0]) && /WhatsApp chatbot/.test(lines[0]), 'verdict line 1: Do this month with CCTV, Rota, chatbot');
ok(lines.some(l => /^Can wait until 2 Dec 2027: .*Rota/.test(l)), 'verdict: Can wait until 2 Dec 2027 for Rota');
ok(/^Nothing to do beyond briefing staff: Pricing · Review replies · ChatGPT at reception\.$/.test(lines[lines.length - 1]), 'verdict: nothing beyond briefing for the three minimal tools');
const stillAll = ev.flatMap(e => G.stillOpenLines(e));
ok(stillAll.length > 0 && stillAll.every(l => /^Still open: ask the vendor/.test(l)), 'Still open lines name a vendor question');
ok(!stillAll.some(l => /Nothing/.test(l)), 'no "Still open: Nothing"');
ok(G.stillOpenLines(byName['Rota']).length === 2, 'Rota: two still-open questions');
const tl = G.tiles(ev, ctx);
ok(!tl.some(t => t.tier === 'banned') && tl.some(t => t.tier === 'pbanned' && t.n === 1), 'tiles: "1 Possibly banned", never "1 Banned"');
ok(tl.some(t => t.tier === 'phigh' && t.n === 1) && !tl.some(t => t.tier === 'high'), 'tiles: possibly high-risk apart from high-risk');
['Pricing', 'Review replies', 'ChatGPT at reception'].forEach(n => ok(!byName[n].vendorShown, 'GM: no supplier questions for Minimal ' + n));
ok(byName['CCTV'].vendorShown && byName['Rota'].vendorShown && byName['WhatsApp chatbot'].vendorShown, 'GM: supplier questions for CCTV, Rota, chatbot');
ok(!rows.some(r => /RevCo|RevuCo/.test(r.text)), 'no vendor follow-up rows for Minimal tools');
const askAnyway = JSON.parse(JSON.stringify(gm)); askAnyway.tools[1].askAnyway = true;
ok(G.evalAll(askAnyway, ctx)[1].vendorShown, '"Ask anyway" shows questions for a Minimal tool');

// Plan rules.
ok(!rows.some(r => /legal/i.test(r.law)), 'no plan row labelled "legal"');
ok(rows.every(r => ['Yes, AI Act', 'Yes, other law', "Vendor's duty, you check", 'No, good practice', 'No, contract or industry standard', 'Find out first', 'EU rule, for reference', 'Yes, national law'].includes(r.law)), 'Required-by-law column values');
ok(rows.filter(r => r.id === 'L1').length === 1 && rows.filter(r => r.id === 'R1').length === 1, 'AI literacy and responsible person once');
const r2 = rows.filter(r => r.id === 'R2'); ok(r2.length === new Set(r2.map(r => r.key)).size && r2.length === 3, 'vendor item once per vendor (3 vendors with questions)');
ok(rows.some(r => r.id === 'LB1' && r.tools.includes('Rota') && !r.when), 'labour item LB1 for the rota applies now');
ok(rows.find(r => r.id === 'LB1').note.indexOf(guide.staffReps.yes) === 0, 'works-council answer feeds the labour item');
const noReps = JSON.parse(JSON.stringify(gm)); noReps.hotel.reps = 'unsure';
ok(G.plan(noReps, G.evalAll(noReps, ctx), ctx).some(r => r.id === 'REPS'), 'works council "Not sure" becomes a find-out item');
ok(rows.filter(r => r.kind === 'open').length === byName['CCTV'].c.unsure.length + byName['Rota'].c.unsure.length, 'every Not sure answer is a find-out row');
// Red flag adds a follow-up.
const rf = JSON.parse(JSON.stringify(gm)); rf.tools[4].vq = { 0: { status: 'red', date: TODAY } };
ok(G.plan(rf, G.evalAll(rf, ctx), ctx).some(r => /^RF/.test(r.id)), 'red flag adds a follow-up row');
// No duplicate citations; no Art. 50(3) when emotion reading is answered no.
const cvNo = G.evalTool({ id: 'cv', type: 'cv', origin: 'vendor', ans: { rank: 'rank', emo: 'no' }, vq: {}, isai: {} }, hotel, ctx);
ok(!JSON.stringify([cvNo.reason, cvNo.basis, cvNo.items.map(i => i.ref)]).includes('50(3)'), 'CV with emotion "no": no Art. 50(3)');
ok(!/Art\. 50\(1\), \(5\)/.test(read('data/guide.json')), 'no "Art. 50(1), (5)" in the guide data');

// Owner summary, verdict wording, and templates.
const owner = G.ownerSummary(gm, ev, rows, ctx);
ok(/DECISIONS NEEDED FROM THE OWNER\n(- .+\n?)+$/.test(owner), 'owner summary ends with "Decisions needed from the owner"');
ok(owner.includes(ref.meta.banner), 'owner summary carries the banner');
const email = G.vendorEmail('CamCo', [byName['CCTV']], 'Hotel Mirador', ctx);
ok(/Hotel Mirador/.test(email) && /Please reply by \[date\]/.test(email) && !/14 days/.test(email), 'supplier email: hotel name, no arbitrary deadline');
ok(guide.templates.draftMark === 'Draft wording, check with your adviser.', 'templates marked as draft');
ok(Object.keys(guide.templates).filter(k => guide.templates[k].text || guide.templates[k].intro).sort().join() === 'chatNotice,supplierEmail', 'only the chatbot notice and supplier email have wording');
ok(!/20 real guest|within 2 weeks|within 1 month/.test(JSON.stringify(guide)), 'no arbitrary numbers in the guide data');

// Honest box and the built page.
ok(/C\/2026\/6005/.test(guide.honest.guidelines) && /to verify/i.test(guide.honest.guidelines) && /C\(2026\) 7702/.test(guide.honest.guidelines), 'Art. 50 guidelines reference marked "to verify" with both references');
if (existsSync(join(root, 'index.html'))) {
  const page = read('index.html');
  ok(page.includes('Student prototype (EHL SBP Group 36). Not reviewed by a lawyer. Not legal advice.'), 'banner text in the built page');
  ok(page.includes('Rules as of 19 Nov 2026'), '"Rules as of 19 Nov 2026" in the built page');
  const own = page.replace(read('../assessment/lib/jspdf.umd.min.js').replace(/<\/script/gi, '<\\/script'), ''); // the bundled jsPDF library carries unused URL strings
  ok(!/<script[^>]+src=|<link[^>]+href=|@import|url\(\s*['"]?https?:/i.test(own), 'no external scripts, stylesheets or fonts in the built page');
  ok(page.includes(read('../register/src/logic.js').slice(0, 200)), 'built page carries the register logic unchanged');
} else console.log('(index.html not built: page checks skipped)');

console.log(`${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
