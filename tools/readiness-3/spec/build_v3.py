import json, re, collections, datetime, sys
sys.path.insert(0,'../build')
from verdicts import V as REVIEW
exec(open('content_src.py').read())
exec(open('core_src.py').read())
O = json.load(open('originals.json'))
AREA = {'People':'pe','Skills':'sk','Financial investment':'fi','Technology infrastructure':'te','Data':'da','Organisation & governance':'or'}
AREA_NAME = {'pe':'People','sk':'Skills','fi':'Money','te':'Technology','da':'Data','or':'Rules and controls'}
OWNER = {'GM':'GM','Department head':'DH','Finance':'FIN','IT':'IT','Owner':'OWN','Data':'DH','HR':'HR'}
OWNER_NAME = {'GM':'General manager','DH':'Department head','FIN':'Finance','IT':'IT','OWN':'Owner','VEN':'Vendor (ask them)','HR':'HR','STAFF':'Staff who use it'}
ACTIONS = ['keep','fix','rewrite','split','merge','remove','add']
errors = []
def E(m): errors.append(m)
def gate_obj(g):
    if isinstance(g, str):
        if g in GATES:
            d = GATES[g]; return dict(id=g, kind='library', asked=True, text=d['text'], options=[dict(key=k,label=l,effects=e) for k,l,e in d['options']])
        if g in AUTO:
            lib, opt = AUTO[g]; d = GATES[lib]
            eff = [e for k,l,e in d['options'] if k==opt][0]
            return dict(id=g, kind='auto', asked=False, applies=lib+'='+opt, effects=eff)
        E('unknown gate '+g); return None
    g = dict(g); g['kind']='custom'; g['asked']=True
    for o in g['options']:
        if o['effects'].pop('add_auto', False): o['effects']['add'] = ['ACT_LIMITS','ACT_OFF']
    return g
use_cases = []; counts = collections.Counter(); allq = []
for uid, ov in O.items():
    if uid not in UC: E('missing uc '+uid); continue
    src = UC[uid]; oq = {q['qid']: q for q in ov['qs']}
    gates = [gate_obj(g) for g in src['gates']]
    gate_ids = {g['id'] for g in gates}
    lib_by_auto = {AUTO[g['id']][0] for g in gates if g['kind']=='auto'}
    asked = [g for g in gates if g['asked']]
    if not 1 <= len(asked) <= 2: E(f'{uid}: {len(asked)} asked gates')
    qs = []; orig_rows = []; seen = set(); nnew = 0
    for row in src['rows']:
        qid, act = row[0], row[1]
        if act not in ACTIONS: E(f'{uid} {qid} bad action {act}')
        show_if = row[6] if len(row) > 6 else None
        if act == 'add':
            nnew += 1; area, owner = qid[1:].split(':')
            nid = f'{uid}.n{nnew}'
            qs.append(dict(id=nid, area=area, owner=owner, weight=row[2], text=row[3], why=row[4], show_if=show_if, source=dict(type='new', reason=row[5])))
            counts['add'] += 1; continue
        if qid not in oq: E(f'{uid} {qid} not in originals'); continue
        if qid in seen: E(f'{uid} {qid} twice')
        seen.add(qid); o = oq[qid]; counts[act] += 1
        area = AREA[o['area']]; owner = OWNER.get(o['owner'], 'GM')
        rec = dict(qid=qid, area=o['area'], owner=o['owner'], current=o['current'], suggested=o['suggested'], action=act, reason=row[5], new_ids=[], new_text=None, weight=None, merged_into=None)
        if act in ('keep','fix','rewrite'):
            nid = f'{uid}.{qid}'
            qs.append(dict(id=nid, area=area, owner=owner, weight=row[2], text=row[3], why=row[4], show_if=show_if, source=dict(type='original', qid=qid, action=act)))
            rec.update(new_ids=[nid], new_text=row[3], weight=row[2])
        elif act == 'split':
            ids = []
            for i,(w,t,y) in enumerate(zip(row[2], row[3], row[4])):
                nid = f'{uid}.{qid}{"abc"[i]}'; ids.append(nid)
                qs.append(dict(id=nid, area=area, owner=owner, weight=w, text=t, why=y, show_if=show_if, source=dict(type='original', qid=qid, action='split')))
            rec.update(new_ids=ids, new_text=' | '.join(row[3]), weight='/'.join(row[2]))
        elif act == 'merge':
            rec['merged_into'] = row[2]
        orig_rows.append(rec)
    missing = set(oq) - seen
    if missing: E(f'{uid} originals not accounted: {missing}')
    # merge targets
    for r in orig_rows:
        t = r['merged_into']
        if not t: continue
        if t.startswith('gate:'):
            gid = t[5:]
            ok = gid in gate_ids or gid in lib_by_auto or any(g['kind']=='custom' and any('add' in o['effects'] for o in g['options']) for g in gates)
            if not ok: E(f'{uid} merge target {t} not present')
            r['new_ids'] = [f'{uid}.ACT_LIMITS', f'{uid}.ACT_OFF'] if 'ACT' in gid else [f'{uid}.GUEST_STAFF']
        elif t.startswith('mh:'):
            if t[3:] not in {m['id'] for m in MUSTHAVES}: E(f'{uid} bad mh {t}')
            r['new_ids'] = [t[3:]]
        else:
            tgt = [q['id'] for q in qs if q['source'].get('qid') == t]
            if not tgt: E(f'{uid} merge target {t} has no question')
            r['new_ids'] = tgt
    # gate-added questions
    for g in gates:
        opts = [dict(key=g['applies'].split('=')[1], effects=g['effects'])] if g['kind']=='auto' else g['options']
        for o in opts:
            for gq in o['effects'].get('add', []):
                if gq in SUPPRESS.get(uid, []): continue
                a, ow, w, t, y = GATE_QUESTIONS[gq]
                cond = None if g['kind']=='auto' else f"{g['id']}={o['key']}"
                if any(q['id']==f'{uid}.{gq}' for q in qs): continue
                qs.append(dict(id=f'{uid}.{gq}', area=a, owner=ow, weight=w, text=t, why=y, show_if=cond, source=dict(type='gate', gate=g['id'])))
    # area hiding
    for g in gates:
        if g['kind'] == 'auto': continue
        for o in g['options']:
            ha = o['effects'].get('hide_area')
            if ha:
                for q in qs:
                    if q['area']==ha and q['source']['type']!='gate': q.setdefault('hidden_when', []).append(f"{g['id']}={o['key']}")
    # show_if validation
    valid = set()
    for g in gates:
        if g['kind']=='auto': continue
        for o in g['options']: valid.add(f"{g['id']}={o['key']}")
    for q in qs:
        if q['show_if'] and q['show_if'] not in valid: E(f"{uid} {q['id']} show_if {q['show_if']} invalid")
        q.setdefault('hidden_when', [])
    cond_sens = [f"{g['id']}={o['key']}" for g in gates if g['kind']!='auto' for o in g['options'] if o['effects'].get('sensitive_flag')]
    auto_sens = any(g['kind']=='auto' and g['effects'].get('sensitive_flag') for g in gates)
    always = [q for q in qs if not q['show_if'] and not q['hidden_when']]
    if not any(q['weight']=='B' for q in always): E(f'{uid} no always-shown blocker')
    dept = DEPT_RENAME.get(ov['dept'], ov['dept'])
    TREAT={'G':'polish','F':'fixes applied','W':'full rewrite'}
    use_cases.append(dict(id=uid, review_verdict={'G':'Good','F':'Needs fixes','W':'Wrong'}[REVIEW[uid][0]], treatment=TREAT[REVIEW[uid][0]], department=dept, title=src['title'] or ov['title'], old_title=ov['title'] if src['title'] else None,
        sensitive=dict(always=bool(src['sens'] or auto_sens), when=cond_sens), gates=gates, questions=qs, original_questions=orig_rows, note=src['note'] or None))
    allq += [(uid, q) for q in qs]
extra = set(UC) - set(O)
if extra: E(f'extra uc {extra}')
# ---- text checks
BANNED = [r'\bAI Act\b', r'\bArticle\b', r'\bArt\.', r'high-risk', r'\bDPIA\b', r'\bGDPR\b', r'\bprohibited\b', r'\bCE[- ]mark', r'works council', r'\bPCI\b', r'\bFADP\b', r'\bconsent\b', r'legal basis', r'\blaws?\b', r'\bAnnex\b', r'\bregulation\b', r'\bcompliance\b', r'\bEU\b']
ACRO_OK = {'AI','ID','IT','GM','F&B','PMS','RFID','PIN','VIP','Wi-Fi','HR','ChatGPT','WhatsApp'}
GLOSSARY = {'AI':'artificial intelligence','ID':'identity document','IT':'information technology team','GM':'general manager','F&B':'food and beverage','PMS':'property management system (your main booking system)','RFID':'radio-frequency identification (radio tags)','PIN':'personal identification number','VIP':'very important guest','HR':'human resources'}
def words(t): return len(re.findall(r"[A-Za-z0-9'’&-]+", t))
texts = []
for uid,q in allq: texts.append((f"{uid}:{q['id']}", q['text'], True))
for u in use_cases:
    for g in u['gates']:
        if g['asked']:
            texts.append((u['id']+':gate', g['text'], True))
            for o in g['options']: texts.append((u['id']+':opt', o['label'], False))
for s in STEP2: texts.append((s['id'], s['text'], True))
for m in MUSTHAVES: texts.append((m['id'], m['text'], True))
for g,d in GATES.items(): texts.append((g, d['text'], True))
for k,v in GATE_QUESTIONS.items(): texts.append((k, v[3], True))
for q in NONE_FITS['questions']: texts.append(('none', q[3], True))
longq = [(i,t,words(t)) for i,t,isq in texts if isq and words(t) > 20]
for i,t,n in longq: E(f'too long {n}w {i}: {t}')
acro = collections.Counter()
for i,t,_ in texts:
    for tok in re.findall(r"\b[A-Z][A-Z&]{1,}\b|Wi-Fi", t):
        acro[tok]+=1
        if tok not in ACRO_OK: E(f'acronym {tok} in {i}: {t}')
for i,t,isq in texts:
    if isq and t.count('?') != 1: E(f'not one question mark {i}: {t}')
    if isq and re.search(r'\band\b.*\band\b.*\band\b', t): pass
data = dict(
 version='3.0.0', schema_version=1, generated=datetime.date.today().isoformat(),
 source_of_truth='This file is the single source of truth for every question shown by the Do you need AI? tool v3.0. Use all wording verbatim.',
 texts=dict(disclaimer=DISCLAIMER, sensitive_flag=SENS_FLAG, dont_know=DK_LABEL, doesnt_apply="Doesn't apply"),
 glossary=GLOSSARY,
 labels=dict(areas=AREA_NAME, owners=OWNER_NAME, weights={'B':'Blocker','I':'Important','N':'Nice to have'}),
 answers={k:[dict(key=a,label=b) for a,b in v] for k,v in ANSWERS.items()},
 scoring=dict(
   weights={'B':3,'I':2,'N':1}, factors={'yes':1,'planned':0.5,'no':0,'dk':0}, na_excluded=True,
   scored=['must_haves (all weight B)','visible use-case questions'], not_scored=['step2','gates'],
   score='floor(100 * sum(weight*factor) / sum(weight)) over visible, applicable (not Doesn\'t apply) scored questions',
   verdict_order=[
     "1 Soft stop: s1 or s2 answered No -> short result with alternatives; 'Continue anyway' resumes and caps the final verdict at Almost ready.",
     "2 Not enough info: Don't know yet on more than 50% of visible applicable scored questions.",
     "3 Not ready: any blocker answered No, OR score < 50, OR fewer than half of visible applicable blockers answered Yes.",
     "4 Ready: every visible blocker Yes or Doesn't apply, score >= 75, Don't know yet < 25%, s3-s5 all Yes, a listed use case chosen, every asked gate answered (not Don't know yet), no sensitive flag, no cap.",
     "5 Almost ready: everything else."],
   caps=['sensitive flag (static or from a gate answer)','any gate answered Don\'t know yet','gate option with cap_almost','s3, s4 or s5 answered No or Don\'t know yet','soft stop continued','None fits chosen'],
   result_order=['verdict','one-sentence main reason','sensitive flag text if raised','top 3 actions with owner','details by area','score % last']),
 step2=STEP2, must_haves=MUSTHAVES,
 gate_library={k:dict(text=v['text'], options=[dict(key=a,label=b,effects=c) for a,b,c in v['options']]) for k,v in GATES.items()},
 auto_gates={k:dict(applies=f'{a}={b}') for k,(a,b) in AUTO.items()},
 gate_questions={k:dict(area=a,owner=o,weight=w,text=t,why=y) for k,(a,o,w,t,y) in GATE_QUESTIONS.items()},
 use_cases=use_cases,
 none_fits=dict(title=NONE_FITS['title'], gates=NONE_FITS['gates'], note=NONE_FITS['note'],
   questions=[dict(id=f'none.q{i+1}', area=a, owner=o, weight=w, text=t, why=y) for i,(a,o,w,t,y) in enumerate(NONE_FITS['questions'])]))
blob = json.dumps(data, ensure_ascii=False)
scan = blob.replace(json.dumps(DISCLAIMER)[1:-1], '').replace(json.dumps(SENS_FLAG)[1:-1], '')
# do not scan the original_questions block (it quotes v2.6 wording by design)
scan_obj = json.loads(json.dumps(data)); [u.pop('original_questions') for u in scan_obj['use_cases']]
for s in scan_obj['step2']+scan_obj['must_haves']: s.pop('replaces', None)
for u in scan_obj['use_cases']:
    u.pop('old_title', None); u.pop('note', None)
    for q in u['questions']: q['source'].pop('reason', None)
scan = json.dumps(scan_obj, ensure_ascii=False).replace(DISCLAIMER,'').replace(SENS_FLAG,'')
for pat in BANNED:
    for m in re.finditer(pat, scan, re.I if pat not in (r'\bEU\b',r'\bPCI\b',r'\bGDPR\b',r'\bDPIA\b',r'\bFADP\b') else 0):
        E(f'banned {pat}: ...{scan[max(0,m.start()-80):m.end()+40]}...')
counts_orig = sum(len(v['qs']) for v in O.values())
nq = len(allq); nsplit_children = sum(1 for _,q in allq if q['source'].get('action')=='split')
data['counts'] = dict(use_cases=len(use_cases), original_questions=counts_orig, original_accounted=sum(counts[a] for a in ACTIONS if a!='add'),
   actions={a:counts[a] for a in ACTIONS}, v3_use_case_questions_total=nq, from_split=nsplit_children,
   gate_added=sum(1 for _,q in allq if q['source']['type']=='gate'),
   weights=dict(collections.Counter(q['weight'] for _,q in allq)),
   sensitive_always=sum(u['sensitive']['always'] for u in use_cases), sensitive_conditional=sum(1 for u in use_cases if not u['sensitive']['always'] and u['sensitive']['when']),
   asked_gates=sum(1 for u in use_cases for g in u['gates'] if g['asked']), acronyms=dict(acro))
json.dump(data, open('usecase_questions_v3.json','w'), indent=1, ensure_ascii=False)
rt = json.loads(json.dumps(data))
for u in rt['use_cases']:
    u.pop('original_questions'); u.pop('review_verdict'); u.pop('treatment'); u.pop('old_title', None); u.pop('note', None)
for x in rt['step2']+rt['must_haves']: x.pop('replaces', None)
rt['none_fits'].pop('note', None)
for u in rt['use_cases']:
    for q in u['questions']: q['source'].pop('reason', None)
json.dump(rt, open('usecase_questions_v3.runtime.json','w'), separators=(',',':'), ensure_ascii=False)
print('\n'.join(errors[:80])); print('ERRORS', len(errors)); print(json.dumps(data['counts'], indent=0))
