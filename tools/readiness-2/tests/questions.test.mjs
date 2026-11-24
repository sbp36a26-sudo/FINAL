// The tailored questions (data/usecase-questions.json): generated from the owner's workbook, checked for all 99 use cases.
// Run: node tools/readiness-2/tests/questions.test.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { root, data, tester } from './load.mjs';
import { generate, inputs, frame, items, clean, words, forUse, ADDON, peShape, skShape, orShape, MAX_WORDS } from '../data/build-questions.mjs';
import { check } from '../data/check-questions.mjs';
const { ok, done } = tester('questions');
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const J = JSON.parse(readFileSync(join(root, 'data/usecase-questions.json'), 'utf8')), src = inputs(), D = data();

const flags = check(J, src);
ok(flags.length === 0, 'the checker flags nothing: ' + flags.slice(0, 3).join(' | '));
ok(eq(generate(src), J) && eq(generate(inputs()), J), 'deterministic: the generator makes exactly the committed file, twice');
const ids = D.cat.depts.flatMap(d => d.uses.map(u => u.id));
ok(ids.length === 99 && eq(Object.keys(J.uses), ids) && J.nUses === 99, 'one entry per catalogue use case, in catalogue order (99)');
ok(J.nFromWorkbook === 91 && J.nDraft === 8 && src.X.rows.length === 91, '91 from the workbook, 8 from draft rows');
let n = 0;
ids.forEach(id => {
  const u = J.uses[id];
  ok(u.qs.length >= 6 && u.qs.length <= 10, id + ': 6 to 10 questions (' + u.qs.length + ')');
  ok(u.qs.every(q => words(q.q) <= MAX_WORDS), id + ': no question over 30 words');
  ok(u.qs.every(q => /\?$/.test(q.q) && !/;/.test(q.q)), id + ': question marks, no semicolons');
  ok(new Set(u.qs.map(q => q.q.toLowerCase())).size === u.qs.length && new Set(u.qs.map(q => q.id)).size === u.qs.length, id + ': no duplicates');
  ok((u.add || []).every(k => u.qs.some(q => q.id === 'x-' + k && q.q === ADDON[k].q)), id + ': every flagged add-on has its question');
  ok(u.qs.filter(q => q.kind === 'addon').length === (u.add || []).length, id + ': no add-on question without a flag');
  ok(['pe', 'sk', 'fi', 'da'].every(a => u.qs.some(q => q.a === a && q.kind !== 'addon')), id + ': people, skills, money and data are each asked');
  ok(eq(D.tq.uses[id].qs.map(q => [q.id, q.q, q.a]), u.qs.map(q => [q.id, q.q, q.a])), id + ': the page carries these questions');
  n += u.qs.length;
});
ok(n === Object.values(D.tq.uses).reduce((a, u) => a + u.qs.length, 0) && n > 600, n + ' questions in all');
// the workbook's metadata is carried, not retyped
src.X.rows.forEach(r => { const id = ids.find(i => J.uses[i].name === r.name), u = J.uses[id]; ok(u && u.int === r.int && u.arch === r.arch && eq(u.add, r.add) && u.ev === r.ev && !u.draft, r.name.slice(0, 40) + ': intensity, archetype, add-ons and evidence ids from the workbook'); });
ok(eq(J.intensity, src.X.intensity) && Object.keys(J.intensity).join() === 'Light,Moderate,Heavy', 'Light / Moderate / Heavy definitions from the workbook README');
ok(ids.filter(i => J.uses[i].draft).every(i => /^Team draft \d+ Nov 2026/.test(J.uses[i].draftNote)), 'draft rows carry their draft note');
// add-on wording
ok(ADDON.sens.q === 'Has a data protection impact assessment (DPIA) been done for this tool?' && ADDON.sens.na === 'Checked: not required (confirmed in writing)', 'sensitive data: the readiness check\'s neutral DPIA wording and its "not required" answer');
const rcW = readFileSync(join(root, '../readiness-check/src/logic.js'), 'utf8');
ok(rcW.includes("q: 'Has a data protection impact assessment (DPIA) been done for this tool?'") && rcW.includes(ADDON.sens.help), 'that wording is the readiness check\'s (rules v4, G2s)');
ok(/card-data security rules/.test(ADDON.pay.q) && /capital budget/.test(ADDON.hw.q) && /written limits/.test(ADDON.auto.q) && /switch it off/.test(ADDON.auto.q), 'payment, hardware and acts-alone add-ons');
ok(eq(J.uses['hr-2'].add, ['sens']) && eq(J.uses['gx-2'].add, ['auto']) && eq(J.uses['it-4'].add, ['sens', 'hw']) && eq(J.uses['fa-7'].add, ['pay']), 'add-ons as flagged in the archetype sheet');
// frames, by hand
ok(frame('pe', ['Revenue manager owns it and reviews forecasts', 'GM signs off strategy']).q === 'Is it agreed that the revenue manager owns it and reviews forecasts, and the GM signs off strategy?', 'people: a sentence becomes "Is it agreed that …"');
ok(frame('pe', ['Revenue or sales manager']).q === 'Will the revenue or sales manager be in charge of this tool?' && frame('pe', ['Marketing']).q === 'Will marketing be in charge of this tool?', 'people: a role');
ok(frame('pe', ['Revenue team as users']).q === 'Will the revenue team use this tool, and have they been shown how?', 'people: users');
ok(frame('sk', ['Choose a sensible competitive set']).q === 'Can the people involved choose a sensible competitive set?' && frame('sk', ['Pricing strategy', 'judge when to switch autopilot off']).q === 'Do the people involved know enough about pricing strategy, and can they judge when to switch autopilot off?', 'skills: to do, to know');
ok(frame('sk', ['Forecast literacy: read accuracy, spot bad inputs, override with reason']).q === 'Can the people involved read accuracy, spot bad inputs and override with reason?', 'skills: the things to do after a colon');
ok(frame('fi', ['RMS subscription (often per room)', 'onboarding fee']).q === 'Do you know what this will cost your hotel: RMS subscription (often per room), and onboarding fee?' && frame('fi', ['Usually part of the RMS']).kind === 'fi-how', 'money: a cost to know, or a cost that sits elsewhere');
ok(frame('te', ['None']).kind === 'te-none' && frame('te', ['Two-way PMS/CRS link', 'RMS']).q === 'Is this in place, or confirmed as possible: two-way PMS/CRS link and RMS?', 'technology');
ok(frame('da', ['At least one year of clean booking, pickup and cancellation history by segment']).q === 'Is this data ready, digital and up to date: at least one year of clean booking, pickup and cancellation history by segment?', 'data');
ok(frame('or', ['Rules for when staff override forecasts']).q === 'Are there written rules for when staff override forecasts?' && frame('or', ['GDPR consent management']).kind === 'legal' && frame('or', ['Limit what agents can change']).kind === 'or-done', 'organisation: a rule, a legal signpost, a step');
// v2.1, council item 10: the three frame fixes
ok(frame('or', ['Tell guests they are dealing with AI']).q === 'Is it agreed how you will tell guests they are dealing with AI?' && frame('or', ['Tell guests they are dealing with AI']).kind === 'or-done' && frame('or', ['Limit what agents can change']).q === 'Has this been done: limit what agents can change?', 'organisation step: "tell …" is asked as something to agree now; other steps keep "Has this been done"');
ok(frame('or', ['hand-off rules']).q === 'Are there written hand-off rules?' && frame('or', ['agency contract']).q === 'Is there a written agency contract?' && frame('or', ['Human review before sending prices']).q === 'Is this in place and written down: human review before sending prices?' && frame('or', ['Price rules', 'action log']).q === 'Is this in place and written down: price rules and action log?', 'organisation thing: a single written thing reads plainly; the colon frame stays for lists and where "written" would not be English');
ok(frame('fi', ['Subscription', 'possible commission on bookings']).q === 'Do you know what this will cost your hotel: subscription, and possible commission on bookings?' && frame('or', ['Staff monitoring rules and works-council consultation', 'no emotion recognition of staff']).q.includes(', and also no emotion recognition') , 'join word: ", and" when no joined item has an "and" of its own; ", and also" only then');
const allQ = Object.values(J.uses).flatMap(u => u.qs);
ok(allQ.filter(q => /, and also /.test(q.q)).length < 46 && allQ.filter(q => /, and also /.test(q.q)).every(q => /\band\b/.test(q.q.replace(/^[^:]*: /, '').replace(', and also ', ' | '))) && !allQ.some(q => /^Has this been done: tell /.test(q.q)) && !allQ.some(q => !q.edited && /^Is this in place and written down: (hand-off|price|pricing|price-change|audit-trail) rules\?$/.test(q.q)), 'the three frames are gone from the 661 questions where the rule applies (", and also" was in 46)');
ok(eq([peShape('GM signs off strategy'), peShape('Chef'), peShape('incentives for staff')], ['sentence', 'role', 'thing']) && eq([skShape('Read ROAS'), skShape('Call-review skills'), skShape('Prompting'), skShape('audit trail')], ['do', 'have', 'know', 'know']) && orShape('Audit log') === 'thing', 'shape rules');
ok(clean('Tell callers they speak to AI (EU AI Act Art. 50 – see D7)') === 'Tell callers they speak to AI' && clean('GDPR consent management (see D7)') === 'GDPR consent management' && eq(items('Disclose AI to guests (AI Act Art. 50; FADP in CH – see D7); hand-off rules'), ['Tell guests they are dealing with AI', 'hand-off rules']) && eq(items('—'), []), 'legal references and "see D7" never reach a question; "—" is empty');
ok(!Object.values(J.uses).some(u => u.qs.some(q => /see D7|\bArt\.|Annex/.test(q.q + q.act + (q.from || '')))), 'no article number or "see D7" anywhere in the output');
// the three examples of the build notes
const qOf = id => J.uses[id].qs.map(q => q.q);
ok(eq(qOf('gx-2'), [
  'Is it agreed that the guest-service lead monitors conversations, and staff take over hand-offs?',
  'Can the people involved maintain knowledge base and review transcripts?',
  'Do you know what this will cost your hotel: subscription per property or per conversation?',
  'Is this in place, or confirmed as possible: messaging channels plus PMS link for bookings and requests?',
  'Is this data ready, digital and up to date: complete, current hotel FAQ and policies, and also conversation logs?',
  'Is it agreed how you will tell guests they are dealing with AI?',
  'Are there written hand-off rules?',
  'Are there written limits on what the tool may do by itself, and a named person who can switch it off?']), 'gx-2 (guest chat): the eight questions');
ok(qOf('hr-2').length === 7 && qOf('hr-2')[0] === 'Is it agreed that the HR manager reviews every decision?' && qOf('hr-2')[6] === ADDON.sens.q && J.uses['hr-2'].qs[5].edited === true, 'hr-2 (AI recruiting): seven questions, the DPIA add-on last, one hand edit');
ok(qOf('fo-8').length === 6 && J.uses['fo-8'].draft && qOf('fo-8')[0] === 'Is it agreed that the front-office or housekeeping supervisor owns the found-items log?', 'fo-8 (a draft use case): six questions from the draft row');
// overrides: few, each with a reason, each matching a question
const ov = JSON.parse(readFileSync(join(root, 'data/overrides.json'), 'utf8')).edits, edited = Object.values(J.uses).flatMap(u => u.qs.filter(q => q.edited)).length;
ok(Object.keys(ov).length === edited && edited <= 20 && Object.values(ov).every(o => o.reason && o.reason.length > 20 && /\?$/.test(o.q)), edited + ' hand edits, all through overrides.json, each with a reason');
let threw = false; try { generate({ ...src, overrides: { edits: { 'rm-1.zz9': { q: 'X?', reason: 'x' } } } }); } catch (e) { threw = /no such question/.test(e.message); } ok(threw, 'an override that matches no question is refused');
threw = false; try { generate({ ...src, cat: { depts: [{ id: 'zz', name: 'New', cat: 'Commercial', uses: [{ n: 'Brand new use', task: '' }] }] } }); } catch (e) { threw = true; } ok(threw, 'a catalogue use case with neither a workbook row nor a draft row stops the generator');
ok(forUse({ id: 'x', arch: 'A8', add: [], r: { pe: 'Chef', sk: 'Prompting', fi: 'Subscription', te: 'Staff app', da: 'Menus', or: '—' } }).length === 6, 'an empty organisation cell gets the question for the type of tool, so there are still six');
done();
