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
eq(catUses.length, 91, 'catalogue has 91 uses');
const rows = labels.uses.filter(u => u.n);
eq(rows.length, 91, 'label file has 91 catalogue rows');
ok(catUses.every((u, i) => rows[i] && rows[i].id === u.id && rows[i].name === u.name), 'label ids and names match the catalogue order (ids are frozen)');
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
ok(rows.every(u => u.a6.includes('highif') === (u.base !== 'high' && hard(u, 'high'))), 'a6 highif = a hard question can make it high-risk');
ok(rows.every(u => u.a6.includes('transp') === (!!u.chat || hard(u, 'transparency'))), 'a6 transp = talks to people or a hard transparency question');
ok(rows.every(u => u.a6.includes('prohib') === hard(u, 'prohibited')), 'a6 prohib = a hard question can make it prohibited');
ok(labels.uses.every(u => u.switches.every(s => ref.switches[s.id])), 'every question id exists in reference.json');
const packsUsed = new Set(['basics', 'literacy', 'ban', 'chat', 'notice', 'hr-user', 'product', 'liability', 'gen']);
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
eq(cls('hr-2').label, 'high', 'recruiting is high-risk');
ok(cls('hr-2').canProhibit, 'recruiting: open emotion question can make it prohibited');
ok(cls('hr-2').alsoTransparency, 'recruiting: the hiring chatbot must also say it is AI');
eq(cls('hr-2', { answers: { emo_staff: 'yes' } }).label, 'prohibited', 'recruiting that reads candidates\' emotions is prohibited');
eq(cls('hr-5').label, 'high', 'seasonal staff matching is high-risk');
eq(cls('res-8').label, 'high', 'call scoring is high-risk');
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
eq(cls('me-5').label, 'highif', 'lift maintenance with the question open');
const lift = cls('me-5', { answers: { safety_part: 'yes' } });
ok(lift.label === 'high' && lift.onlyProduct && lift.dateKey === 'products' && lift.packs.product && !lift.packs['hr-user'], 'lift safety AI: high-risk from 2 Aug 2028, maker\'s duty');
eq(cls('rm-2', { answers: { personal_price: 'yes' } }).label, 'minimal', 'personalised pricing does not change the AI Act label');
ok(cls('rm-2', { answers: { personal_price: 'yes' } }).packs['consumer-price'], 'personalised pricing adds the consumer-law item');
eq(cls('custom').label, 'open', 'a custom tool is unlabelled until answered');
const allNo = {}; U('custom').switches.forEach(s => allNo[s.id] = 'no');
eq(cls('custom', { answers: allNo }).label, 'minimal', 'a custom tool with every answer "no" is minimal');
eq(cls('custom', { answers: Object.assign({}, allNo, { c_staff: 'yes' }) }).label, 'high', 'a custom staff tool is high-risk');
const notai = cls('hk-6', { answers: { rank_staff: 'yes' }, notAI: 'yes' });
ok(notai.label === 'notai' && !notai.packs.literacy && !notai.packs['hr-user'] && notai.packs.labour, 'rules-only software: no AI Act items, other law stays');

// ---- uses found in the market, not in the catalogue ----
const extra = labels.uses.filter(u => u.provisional);
eq(extra.length, 17, '17 market uses added from desk research');
ok(extra.every(u => u.review && u.why && u.dept), 'every market use is marked provisional with a reason');
eq(cls('m-4').label, 'high', 'AI video interviews are high-risk');
eq(cls('m-6').label, 'highif', 'per-attendant dashboards: open question');
eq(cls('m-12').label, 'transparency', 'facial age estimation: notice duty');
ok(cls('m-12').packs.notice && !cls('m-12').packs.chat, 'facial age estimation: notice to people exposed, not a chatbot notice');
const mini = cls('m-17');
ok(mini.label === 'notai' && !mini.packs.literacy, 'sensor minibar is not an AI system');
eq(cls('m-1', { answers: { social_score: 'yes' } }).label, 'prohibited', 'guest scoring from unrelated contexts is prohibited');
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

console.log((fail ? 'FAILED' : 'ok') + ': ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
