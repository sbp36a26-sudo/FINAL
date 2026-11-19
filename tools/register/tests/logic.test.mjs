// Checks the register's data and logic. Run: node tools/register/tests/logic.test.mjs
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const json = p => JSON.parse(readFileSync(join(root, p), 'utf8'));
const ref = json('data/reference.json');
const labels = json('data/uc-labels.json');
const radar = json('data/radar.json');
const ctx = { self: {} };
vm.runInNewContext(readFileSync(join(root, 'src/logic.js'), 'utf8'), ctx);
const L = ctx.self.RegLogic;

const catHtml = readFileSync(join(root, '../use-case-catalogue/index.html'), 'utf8');
const cat = JSON.parse(catHtml.match(/<script id="data" type="application\/json">([\s\S]*?)<\/script>/)[1]);

let pass = 0, fail = 0;
const ok = (cond, name) => { if (cond) pass++; else { fail++; console.log('FAIL  ' + name); } };
const eq = (a, b, name) => ok(a === b, name + '  (got ' + JSON.stringify(a) + ', expected ' + JSON.stringify(b) + ')');
const U = id => labels.uses.find(u => u.id === id);
const cls = (id, tool) => L.classify(U(id), tool || {}, ref);
const ids = list => list.map(i => i.id);

// ---- data integrity ----
const catUses = [];
cat.depts.forEach(d => d.uses.forEach((u, i) => catUses.push({ id: d.id + '-' + (i + 1), name: u.n })));
eq(catUses.length, 95, 'catalogue has 95 uses (91 in the booklet + 4 added 19 Nov 2026)');
const catRows = labels.uses.filter(u => u.n);
const rows = labels.uses.filter(u => u.n && u.n <= 91); // the booklet's 91; rows 92+ were added after it
eq(rows.length, 91, 'label file has 91 catalogue rows');
ok(catUses.every((u, i) => catRows[i] && catRows[i].id === u.id && catRows[i].name === u.name), 'label ids and names match the catalogue order (ids are frozen)');
ok(catRows.every(u => (u.n <= 91) === !/^(fo-6|fo-7|hr-6|kc-6)$/.test(u.id)), 'booklet numbers 1-91 unchanged; new rows numbered 92-95');
const a6 = k => rows.filter(u => u.a6.includes(k)).length;
const T = labels.meta.bookletTotals;
eq(a6('high'), T.high, 'booklet A6: high-risk uses');
eq(a6('highif'), T.highif, 'booklet A6: "high-risk if" uses');
eq(a6('transp'), T.transp, 'booklet A6: transparency uses');
eq(a6('prohib'), T.prohib, 'booklet A6: uses that can become prohibited');
eq(rows.filter(u => u.staff).length, T.staff, 'booklet A6: staff exposures');
// the a6 flags must agree with what the logic derives from base + hard switches
const hard = (u, eff) => u.switches.some(s => !s.soft && ref.switches[s.id] && ref.switches[s.id].yes === eff);
ok(rows.every(u => u.a6.includes('high') === (u.base === 'high')), 'a6 high = base high');
ok(rows.filter(u => !u.diff).every(u => u.a6.includes('highif') === (u.base !== 'high' && hard(u, 'high'))), 'a6 highif = a hard question can make it high-risk (rows that follow the booklet)');
ok(rows.filter(u => !u.diff).every(u => u.a6.includes('transp') === (!!u.chat || hard(u, 'transparency'))), 'a6 transp = talks to people or a hard transparency question (rows that follow the booklet)');
ok(rows.filter(u => !u.diff).every(u => u.a6.includes('prohib') === hard(u, 'prohibited')), 'a6 prohib = a hard question can make it prohibited (rows that follow the booklet)');
ok(rows.filter(u => u.diff).every(u => u.diff.booklet && u.diff.law), 'every row that differs from the booklet says how');
ok(labels.uses.every(u => u.switches.every(s => ref.switches[s.id])), 'every question id exists in reference.json');
const packsUsed = new Set(['basics', 'literacy', 'ban', 'chat', 'notice', 'hr-user', 'product', 'liability', 'gen', 'brandmandate']);
labels.uses.forEach(u => u.packs.forEach(p => packsUsed.add(p)));
Object.values(ref.switches).forEach(s => (s.packs || []).forEach(p => packsUsed.add(p)));
const packsDefined = new Set(ref.items.map(i => i.pack));
ok([...packsUsed].every(p => packsDefined.has(p)), 'every pack in use has at least one item: ' + [...packsUsed].filter(p => !packsDefined.has(p)).join(','));
ok([...packsDefined].every(p => packsUsed.has(p)), 'every item belongs to a pack in use: ' + [...packsDefined].filter(p => !packsUsed.has(p)).join(','));
eq(new Set(ref.items.map(i => i.id)).size, ref.items.length, 'item ids are unique');
eq(ref.dates.highrisk, '2027-12-02', 'high-risk date is 2 Dec 2027');
eq(ref.dates.products, '2028-08-02', 'regulated-products date is 2 Aug 2028');
ok(!JSON.stringify(ref.items).includes('2026-08-02'), 'no item carries a hard-coded August 2026 date');
ok(radar.entries.every(e => e.id && e.title && e.source && e.basis), 'every watch-list entry has a title, source and basis');
const useIds = new Set(labels.uses.map(u => u.id));
ok(radar.entries.every(e => (e.affects.uses || []).every(id => useIds.has(id))), 'watch-list entries point at existing use ids');

// ---- labels ----
eq(cls('rm-1').label, 'minimal', 'demand forecasting is minimal');
eq(cls('hr-2').labelUnder, 'high', 'recruiting is high-risk underneath');
eq(cls('hr-2').label, 'banif', 'recruiting shows "Could be banned" while the staff-emotion question is open (precedence rule 1)');
eq(cls('hr-2', { answers: { emo_staff: 'no' } }).label, 'high', 'recruiting is high-risk once the ban question is answered no');
ok(cls('hr-2').canProhibit, 'recruiting: open emotion question can make it prohibited');
ok(cls('hr-2', { answers: { c_chat: 'yes' } }).alsoTransparency && !cls('hr-2', { answers: { c_chat: 'no' } }).alsoTransparency, 'recruiting: a hiring chatbot must also say it is AI; screening without chat need not (c_chat question)');
eq(cls('hr-2', { answers: { emo_staff: 'yes' } }).label, 'prohibited', 'recruiting that reads candidates\' emotions is prohibited');
eq(cls('hr-5').label, 'high', 'seasonal staff matching is high-risk');
eq(cls('res-8').labelUnder, 'high', 'call scoring is high-risk underneath');
eq(cls('hr-1').label, 'highif', 'rota tool with open questions shows "High-risk if"');
eq(cls('hr-1', { answers: { rank_staff: 'no', hours_leave: 'no' } }).label, 'minimal', 'rota by availability is minimal');
eq(cls('hr-1', { answers: { rank_staff: 'unsure', hours_leave: 'no' } }).label, 'highif', '"not sure" keeps the label open');
const rota = cls('hr-1', { answers: { rank_staff: 'yes', hours_leave: 'no' } });
eq(rota.label, 'high', 'rota that ranks staff is high-risk');
ok(rota.areas.employment && rota.packs['hr-user'] && rota.packs.labour, 'rota that ranks staff: employment duties and labour law');
eq(rota.dateKey, 'highrisk', 'rota that ranks staff: date is the high-risk date');
eq(cls('res-1').label, 'highif', 'voice agent with open questions shows "High-risk if"');
ok(cls('res-1').alsoTransparency && cls('res-1').packs.chat, 'voice agent: the AI notice applies whatever the answers');
eq(cls('res-1', { answers: { emo_guest: 'no', voiceprint: 'no', card_data: 'no' } }).label, 'transparency', 'plain voice agent is transparency');
const emo = cls('res-1', { answers: { emo_guest: 'yes', voiceprint: 'no' } });
ok(emo.label === 'high' && emo.packs.notice && emo.areas.biometric, 'voice agent reading emotions: high-risk plus notice');
eq(cls('sm-4').label, 'transif', 'AI imagery with the question open shows "Transparency if"');
eq(cls('sm-4', { answers: { ai_image: 'yes' } }).label, 'transparency', 'misleading AI imagery is transparency');
eq(cls('sm-4', { answers: { ai_image: 'no' } }).label, 'minimal', 'AI imagery that cannot mislead is minimal');
eq(cls('fo-3').label, 'outside', 'face check-in is outside the high-risk list');
eq(cls('gm-2').label, 'minimal', 'general assistant: the soft question does not make the label conditional');
const rep = cls('gm-2', { answers: { repurpose_hr: 'yes' } });
ok(rep.label === 'high' && rep.role === 'maker' && rep.route === 'repurpose', 'general assistant used to rank applicants: high-risk and maker (repurpose)');
eq(cls('it-2', { answers: { emo_staff: 'yes' } }).label, 'prohibited', 'service desk reading staff emotions is prohibited');
ok(cls('it-2', { answers: { emo_staff: 'yes' } }).reasons[0].research, 'that reason is marked as added from research');
eq(cls('me-5').label, 'minimal', 'lift predictive maintenance is minimal (Art. 6(1a))');
ok(!!U('me-5').diff, 'lift maintenance is marked as differing from the booklet');
const lift = cls('me-5', { answers: { safety_part: 'yes' } });
ok(lift.label === 'high' && lift.onlyProduct && lift.dateKey === 'products' && lift.packs.product && !lift.packs['hr-user'], 'lift safety AI: high-risk from 2 Aug 2028, maker\'s duty');
eq(cls('rm-2', { answers: { personal_price: 'yes' } }).labelUnder, 'minimal', 'personalised pricing does not change the AI Act label');
ok(cls('rm-2', { answers: { personal_price: 'yes' } }).packs['consumer-price'], 'personalised pricing adds the consumer-law item');
eq(cls('custom').labelUnder, 'open', 'a custom tool is unlabelled until answered');
const allNo = {}; U('custom').switches.forEach(s => allNo[s.id] = 'no');
eq(cls('custom', { answers: allNo }).label, 'minimal', 'a custom tool with every answer "no" is minimal');
eq(cls('custom', { answers: Object.assign({}, allNo, { c_staff: 'yes' }) }).label, 'high', 'a custom staff tool is high-risk');
const notai = cls('hk-6', { answers: { rank_staff: 'no' }, notAI: 'yes', notAIConfirmed: 'yes' });
ok(notai.label === 'notai' && !notai.packs.literacy && !notai.packs['hr-user'] && notai.packs.labour, 'rules-only software (vendor-confirmed, no high-risk answer): no AI Act items, other law stays');

// ---- uses found in the market, not in the catalogue ----
const extra = labels.uses.filter(u => u.provisional);
eq(extra.length, 7, '7 market uses stay outside the catalogue (10 moved into it on 19 Nov 2026)');
eq(labels.uses.filter(u => u.n > 91).map(u => u.id).join(), 'fo-6,fo-7,kc-6,hr-6', 'four market uses added to the catalogue as rows 92-95');
ok(Object.entries(labels.meta.moved).every(([o, n]) => !labels.uses.some(u => u.id === o) && labels.uses.some(u => u.id === n)), 'every moved market row points to a catalogue row');
ok(extra.every(u => u.review && u.why && u.dept), 'every market use is marked provisional with a reason');
eq(cls('hr-2', { answers: { emo_staff: 'no' } }).label, 'high', 'AI recruiting, incl. AI video interviews, is high-risk');
eq(cls('hk-6').label, 'highif', 'cleaning workload incl. per-attendant reports: open question');
eq(cls('m-12').label, 'highif', 'facial age estimation: "High-risk if" while the contested age question is open (our reading)');
eq(cls('m-12', { answers: { age_core: 'no' } }).label, 'minimal', 'facial age estimation, purely ancillary: minimal, notice kept');
ok(cls('m-12').packs.notice && !cls('m-12').packs.chat, 'facial age estimation: notice to people exposed, not a chatbot notice');
const mini = cls('m-17');
ok(mini.label === 'notai' && !mini.packs.literacy, 'sensor minibar is not an AI system');
eq(cls('fo-6', { answers: { social_score: 'yes' } }).label, 'prohibited', 'guest scoring from unrelated contexts is prohibited');
eq(cls('m-13', { answers: { bio_categorise: 'yes' } }).label, 'transparency', 'spa skin analysis: notice duty');

// ---- role ----
eq(cls('gx-2').role, 'user', 'vendor chatbot: user');
const built = cls('gx-2', { origin: 'built' });
ok(built.role === 'maker' && built.packs.liability, 'group-built chatbot: maker, product liability item');
eq(cls('gx-2', { origin: 'branded' }).role, 'user', 'branding a non-high-risk tool does not make the group its maker');
eq(cls('hr-2', { origin: 'branded' }).role, 'maker', 'branding a high-risk tool makes the group its maker');
eq(cls('hr-1', { origin: 'branded' }).routePending, 'brand', 'branded rota tool: maker only if it turns out high-risk');

// ---- items ----
const hotelDE = { country: 'DE' };
const it1 = L.items(U('gx-2'), {}, hotelDE, ref);
ok(ids(it1).includes('C1') && !ids(it1).includes('C1m') && ids(it1).includes('L1'), 'vendor chatbot: notice check and literacy');
ok(ids(L.items(U('gx-2'), { origin: 'built' }, hotelDE, ref)).includes('C1m'), 'group-built chatbot: the group owes the notice');
const itRota = L.items(U('hr-1'), { answers: { rank_staff: 'yes', hours_leave: 'no' } }, hotelDE, ref);
ok(['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'LB1'].every(i => ids(itRota).includes(i)), 'high-risk rota: the user duties and the labour item');
ok(itRota.filter(i => i.id.startsWith('H')).every(i => i.when === '2027-12-02'), 'high-risk user duties are dated 2 Dec 2027');
ok(itRota.find(i => i.id === 'LB1').note.includes('Germany'), 'labour item carries the German note');
ok(itRota[0].when === null && itRota[itRota.length - 1].when !== null, 'items are sorted: now first, dated last');
const itCam = L.items(U('it-4'), { answers: { face_distance: 'yes', crowd_mood: 'no', emo_staff: 'no', sensitive_traits: 'no' } }, hotelDE, ref);
ok(ids(itCam).includes('H1') && !ids(itCam).includes('H4'), 'biometric tool: no worker-information duty');
const itBan = L.items(U('res-8'), { answers: { emo_staff: 'yes' } }, hotelDE, ref);
eq(itBan[0].id, 'B1', 'a banned feature puts the stop item first');
ok(L.items(U('rm-1'), { owner: 'Ana' }, hotelDE, ref).find(i => i.id === 'R1').done, 'naming a responsible person ticks R1');
const vq = L.vendorQuestions(U('hr-1'), rota, ref).map(q => q.id);
ok(vq.includes(5) && !vq.includes(3) && !vq.includes(7), 'vendor questions are tailored to the tool');
const vqAll = {}; L.vendorQuestions(U('rm-1'), cls('rm-1'), ref).forEach(q => vqAll[q.id] = true);
ok(L.items(U('rm-1'), { vq: vqAll }, hotelDE, ref).find(i => i.id === 'R2').done, 'ticking every vendor question ticks R2');

// ---- watch list ----
const W = id => radar.entries.find(e => e.id === id);
ok(L.radarHitsTool(W('w-highrisk-guidelines'), U('hr-1'), cls('hr-1'), ref), 'final guidelines affect the rota tool (draft guidance)');
ok(!L.radarHitsTool(W('w-highrisk-guidelines'), U('rm-1'), cls('rm-1'), ref), 'final guidelines do not flag a plain minimal tool');
ok(L.radarHitsTool(W('w-liability'), U('gx-2'), built, ref) && !L.radarHitsTool(W('w-liability'), U('gx-2'), cls('gx-2'), ref), 'product liability affects group-built tools only');
ok(!L.radarHitsTool(W('w-marking'), U('sm-4'), cls('sm-4'), ref) && L.radarHitsTool(W('w-marking'), U('sm-4'), cls('sm-4', { origin: 'built' }), ref), 'marking deadline: only a group-built generator');
ok(L.radarHitsHotel(W('w-swiss'), { country: 'CH' }) && !L.radarHitsHotel(W('w-swiss'), { country: 'DE' }), 'Swiss bill applies to Swiss hotels');

// ---- law-based changes (deep-dive research, 17 Nov 2026) ----
const reg = k => rows.filter(u => { const c = cls(u.id); return k === 'highif' ? c.labelUnder === 'highif' : k === 'prohib' ? c.canProhibitHard || c.label === 'prohibited' : c.labelUnder === k; }).length;
eq(reg('high'), 3, 'register: high-risk catalogue uses');
eq(reg('highif'), 12, 'register: "high-risk if" catalogue uses (booklet 13, minus the 2 maintenance uses, plus job-ad targeting on sm-5)');
eq(cls('res-2').label, 'transif', 'email handling: "Transparency if" until the auto-reply question is answered (Art. 50(1), law)');
eq(cls('sm-5').label, 'highif', 'ad tools: "High-risk if" until the job-ads question is answered (Annex III 4(a), law)');
eq(reg('prohib'), 6, 'register: catalogue uses that can become prohibited (booklet 5, plus IT service desk; video analytics now 2 bans)');
eq(cls('hr-4').labelUnder, 'highif', 'attrition: per-person score question open');
eq(cls('hr-4', { answers: { rank_staff: 'yes' } }).labelUnder, 'high', 'attrition scores on named staff are high-risk');
eq(cls('hr-3', { answers: { rank_staff: 'yes', career_decide: 'no', coach_emo: 'no' } }).label, 'high', 'training scores reported to managers are high-risk');
ok(cls('it-2').canProhibit, 'IT service desk: staff emotion question can make it prohibited');
eq(cls('it-4', { answers: { face_enrol: 'yes' } }).label, 'prohibited', 'face database from CCTV footage is prohibited');
eq(cls('fo-6', { answers: { crime_profile: 'yes' } }).label, 'prohibited', 'predicting offences from a guest profile is prohibited');
eq(cls('rm-7', { answers: { exploit_price: 'yes' } }).label, 'prohibited', 'manipulative upselling causing significant harm is prohibited');
const itG = L.items(U('gx-2'), {}, hotelDE, ref).find(i => i.id === 'C1');
ok(itG.kind === 'maker' && /maker/.test(itG.note), 'vendor chatbot notice is the maker\'s duty, the hotel checks');
ok(ids(itRota).includes('H8'), 'high-risk user duties include cooperating with authorities');
eq(ref.items.find(i => i.id === 'H7').kind, 'practice', 'CE confirmation from the vendor is good practice, not a duty');

// ---- review of 19 Nov 2026: precedence rules (one test per rule and per reproduced bug) ----
const itemIds = (id, tool) => L.items(U(id), tool || {}, hotelDE, ref).map(i => i.id);
// Rule 1: an open ban question beats any lower label
const cctv = cls('it-4', { answers: { emo_staff: 'unsure', face_enrol: 'unsure' } });
eq(cctv.label, 'banif', 'CCTV with ban questions "Not sure" shows "Could be banned", not Minimal');
eq(cctv.openBan.length, 3, 'CCTV: every open ban question is counted (two "Not sure" plus one unanswered), not "one"');
eq(cls('fo-6').label, 'banif', 'guest risk screening warns it could be banned while the scoring questions are open');
eq(cls('it-4', { answers: { emo_staff: 'no', face_enrol: 'no', sensitive_traits: 'no' } }).label, 'highif', 'CCTV with every ban question answered no falls back to "High-risk if" (face recognition still open)');
// Rule 2: "not AI" never overrides a ban or high-risk answer or an open question
eq(cls('custom', { answers: { emo_staff: 'yes' }, notAI: 'yes', notAIConfirmed: 'yes' }).label, 'prohibited', '"rules only" cannot turn a banned tool into "Not an AI system"');
eq(cls('hk-6', { answers: { rank_staff: 'yes' }, notAI: 'yes', notAIConfirmed: 'yes' }).notAIBlocked, 'blocked', '"rules only" is blocked by a high-risk answer');
eq(cls('hk-6', { answers: { rank_staff: 'no' }, notAI: 'yes' }).notAIBlocked, 'needs-confirmation', '"rules only" on a tool that can be high-risk needs the vendor\'s written confirmation');
eq(cls('hk-4', { notAI: 'yes' }).label, 'notai', '"rules only" applies freely to a tool with no ban or high-risk question');
// Rule 3: prohibited means stop
const banned = cls('hr-2', { answers: { emo_staff: 'yes' } });
ok(Object.keys(banned.packs).sort().join() === ['ban', 'basics', 'labour', 'literacy'].sort().join(), 'prohibited: only stop, literacy, basics and labour items');
ok(banned.packsIfOff['hr-user'] && banned.packsIfOff.dpia && !banned.packsIfOff.ban, 'prohibited: the other duties are kept for "if you switch it off"');
ok(!itemIds('hr-2', { answers: { emo_staff: 'yes' } }).includes('H1'), 'prohibited: high-risk user duties are hidden');
// Rule 4: maker status adds duties, never removes user duties
const mk = itemIds('hr-2', { answers: { emo_staff: 'no' }, origin: 'built' });
ok(['M1', 'M2', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H8'].every(i => mk.includes(i)), 'group-built high-risk tool: maker items and all user duties');
ok(!mk.includes('H7') && !mk.includes('R2'), 'group-built tool: no "ask the vendor" items');
const ownBot = itemIds('gx-2', { origin: 'built', answers: { card_data: 'no' } });
ok(ownBot.includes('C1m') && !ownBot.includes('C1'), 'group-built chatbot: the group owes the AI notice; no "check the vendor" item');
// Rule 5: repurpose route
const rp = itemIds('gm-2', { answers: { repurpose_hr: 'yes' } });
ok(rp.includes('M1r') && !rp.includes('M1') && !rp.includes('M2') && !rp.includes('Y1'), 'repurposed chatbot: "you may be treated as provider", no product liability or QMS standard');
// Rule 6: brand-mandated route changes the output
ok(itemIds('rm-2', { decided: 'brand' }).includes('BR1') && !itemIds('rm-2', {}).includes('BR1'), 'brand-mandated tool: agreement item added');
// Rule 7: "Not sure" always adds an item
ok(itemIds('it-4', { answers: { emo_staff: 'unsure' } }).includes('Q-emo_staff'), '"Not sure" adds a "find out" item');
ok(!itemIds('it-4', { answers: { emo_staff: 'no' } }).includes('Q-emo_staff'), 'answering removes the "find out" item');
// Rule 8: "rests on" shows the basis of what set the label
const rb = L.labelBasis(U('hr-4'), cls('hr-4', { answers: { rank_staff: 'yes', career_decide: 'no', emo_staff: 'no' } }), ref);
ok(rb.from === 'answer' && rb.basis === ref.switches.rank_staff.basis, '"rests on" follows the answer that set the label');
eq(L.labelBasis(U('rm-1'), cls('rm-1'), ref).from, 'default', '"rests on" falls back to the use case default');
ok(!/VIP guests is allowed/.test(JSON.stringify(ref)), 'no "recognising VIP guests is allowed"');
ok(ref.items.every(i => !/All checked/.test(i.text)), 'no "All checked" wording in items');

// ---- phase 2: legal content ----
const credit = L.items(U('custom'), { answers: { c_credit: 'yes' } }, hotelDE, ref).map(i => i.id);
ok(credit.includes('FR1'), 'creditworthiness scoring adds the fundamental rights impact assessment (Art. 27)');
ok(['H9', 'H10', 'H11'].every(i => itemIds('hr-2', { answers: { emo_staff: 'no' } }).includes(i)), 'high-risk user duties include Art. 26(4), 26(5) and 26(9)');
ok(itemIds('gx-2', { origin: 'built', answers: { card_data: 'no' } }).includes('G1'), 'group-built chatbot: Art. 50(2) marking of generated text');
ok(L.maybeLegacy({ since: '2026-03-01' }, cls('hr-2', { answers: { emo_staff: 'no' } }), ref) && !L.maybeLegacy({ since: '2028-01-01' }, cls('hr-2', { answers: { emo_staff: 'no' } }), ref), 'legacy note for high-risk tools in use before 2 Dec 2027');
ok(/specific social or economic situation/.test(ref.switches.exploit_price.q) && /political opinions/.test(ref.switches.sensitive_traits.q), 'Art. 5 wording: economic situation; political opinions');
ok(ref.switches.rank_staff.basis === 'law' && U('me-5').basis === 'reading', 'bases: staff ranking is law text; predictive maintenance is our reading');
ok(['social_score', 'crime_profile', 'face_enrol', 'exploit_price'].every(id => U('custom').switches.some(s => s.id === id)), 'custom tool triage asks the ban questions');
ok(!radar.entries.some(e => e.id === 'w-ai-at-work'), 'unsourced watch entry removed');
ok(radar.entries.filter(e => e.status !== 'proposal').every(e => (e.links && e.links.length) || e.verify || e.countries || (e.affects && e.affects.countries)), 'watch entries carry a source link or a "to verify" mark');

console.log((fail ? 'FAILED' : 'ok') + ': ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
