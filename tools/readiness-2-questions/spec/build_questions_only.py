import json, re, collections, sys
sys.path.insert(0, '.')
from flatten_rules import *
D = json.load(open('../master_prompt/usecase_questions_v3.json'))
AREA = {'pe':'People','sk':'Skills','fi':'Financial investment','te':'Technology infrastructure','da':'Data','or':'Organisation & governance'}
OWN = {'GM':'GM','DH':'Department head','FIN':'Finance','IT':'IT','OWN':'Owner','VEN':'IT','HR':'Department head','STAFF':'Department head'}
errors = []; out = []; status = collections.Counter(); per_uc = {}
BANNED = [r'\bAI Act\b', r'\bArticle\b', r'\bArt\.', r'\bAnnex\b', r'high-risk', r'\bDPIA\b', r'\bGDPR\b', r'\bFADP\b', r'\bprohibited\b', r'\bCE[- ]mark', r'works council', r'\bPCI\b', r'\bconsent\b', r'legal basis', r'\blaws?\b', r'\bregulation\b', r'\bcompliance\b', r'\blegal\b']
for u in D['use_cases']:
    uid = u['id']; xauto_orig = any(r['qid']=='x-auto' for r in u['original_questions'])
    chosen = []; dropped = {}
    for q in u['questions']:
        sid = q['id'].split('.',1)[1]
        if q['id'] in TRIM: dropped[q['id']] = TRIM[q['id']]; continue
        if not q['show_if']: chosen.append(q); continue
        if sid == 'ACT_OFF' and (uid in XAUTO_BOTH or uid in XAUTO_OFF_ONLY): chosen.append(q); continue
        if sid == 'ACT_LIMITS' and uid in XAUTO_BOTH: chosen.append(q); continue
        if q['id'] in INCLUDE_COND: chosen.append(q); continue
        dropped[q['id']] = DROP_REASON.get(q['id'], GENERIC_ACT_REASON if sid.startswith('ACT_') else 'Depends on a gate answer; left out because this upgrade has no gates.')
    for i,(a,o,t,y) in enumerate(EXTRA.get(uid, []), 1):
        chosen.append(dict(id=f'{uid}.x{i}', area=a, owner=o, text=t, why=y, source=dict(type='new_questions_only')))
    qs = []
    for q in chosen:
        src = q['source']; carry = None; origin = src['type']
        if src['type'] == 'original':
            if src['action'] in ('keep','fix','split'): carry = src['qid']
            origin = 'original:' + src['action']
        elif src['type'] == 'gate':
            origin = 'v3 gate question, asked here as a plain question'
            if xauto_orig and q['id'].split('.',1)[1] in ('ACT_LIMITS','ACT_OFF'): carry = 'x-auto'
        elif src['type'] == 'new': origin = 'new (v3)'
        else: origin = 'new (questions-only)'
        txt, why = OVERRIDE.get(q['id'], (q['text'], q['why']))
        qs.append(dict(id=q['id'], text=txt, why=why, area=AREA[q['area']], who_answers=OWN[q['owner']], origin=origin, old_id=src.get('qid'), carry_answer_from=carry))
    n = len(qs); per_uc[uid] = n
    if not 6 <= n <= 12: errors.append(f'{uid}: {n} questions')
    if len({q['text'] for q in qs}) != n: errors.append(f'{uid}: duplicate text')
    # every original accounted for
    in_list = {q['old_id'] for q in qs if q['old_id']}
    origs = []
    for r in u['original_questions']:
        new_here = [q['id'] for q in qs if q['old_id']==r['qid'] or (r['qid']=='x-auto' and q['carry_answer_from']=='x-auto')]
        if new_here: st = 'in list'; why = r['reason']
        elif r['action'] == 'remove': st = 'removed'; why = r['reason']
        elif r['action'] == 'merge':
            t = r['merged_into']; st = 'merged'
            why = (f'Covered by must-have {t[4:]}.' if t.startswith('mh:') else f'Merged into {t}.' if not t.startswith('gate:') else 'Covered by a gate question that is not used in this upgrade. ' + GENERIC_ACT_REASON)
        else:
            st = 'dropped'; why = '; '.join(dropped.get(i, '') for i in r['new_ids'] if i in dropped) or 'Dropped.'
        status[st] += 1
        origs.append(dict(old_id=r['qid'], old_wording=r['suggested'], status=st, now=new_here, reason=why))
    sens = u['sensitive']['always'] or uid in SENSITIVE_EXTRA
    out.append(dict(id=uid, department=u['department'], name=u['title'], old_name=u.get('old_title'), sensitive=sens, questions=qs, original_questions=origs))
    for q in qs:
        if len(q['text'].split()) > 20: errors.append(f"{q['id']} too long")
        if q['text'].count('?') != 1: errors.append(f"{q['id']} question mark")
        for p in BANNED:
            if re.search(p, q['text'] + ' ' + q['why'], re.I): errors.append(f"{q['id']} banned {p}")
tot = sum(per_uc.values())
counts = dict(use_cases=len(out), questions=tot, min=min(per_uc.values()), max=max(per_uc.values()), per_count=dict(sorted(collections.Counter(per_uc.values()).items())),
              originals=sum(len(u['original_questions']) for u in out), original_status=dict(status),
              origins=dict(collections.Counter(q['origin'] for u in out for q in u['questions'])),
              sensitive=sum(1 for u in out if u['sensitive']), duplicate_texts_across_use_cases=None, carried_answers=sum(1 for u in out for q in u['questions'] if q['carry_answer_from']))
dup = collections.Counter(q['text'] for u in out for q in u['questions']); counts['duplicate_texts_across_use_cases'] = sum(1 for t,n in dup.items() if n>1)
unused = set(OVERRIDE) - {q['id'] for u in out for q in u['questions']}
if unused: errors.append(f'unused overrides {unused}')
data = dict(version='2.7.0-questions', based_on='usecase_questions_v3.json (Do you need AI? v3 spec), flattened: no gates, no weights',
            note='Use every question text verbatim. Answers stay Yes / Planned / No / Don\'t know yet. Scoring and verdict rules are unchanged from v2.6.1.',
            fixed_texts=dict(
              disclaimer="This check does not cover legal requirements. Check those with your adviser before you start.",
              sensitive_flag="This area involves people's personal data or jobs and has extra rules. Ask an adviser before a pilot.",
              sensitive_hold_reason="Held back: this area involves people's personal data or jobs. Ask an adviser before a pilot.",
              must_have_5=dict(title='Personal data known', text='Do you know which guest or staff personal data the tool would use?')),
            counts=counts, use_cases=out)
json.dump(data, open('usecase_questions_only.json','w'), indent=1, ensure_ascii=False)
print('ERRORS', errors)
for t,n in dup.items():
    if n>1: print('DUP', n, t); print(json.dumps(counts, indent=1))
