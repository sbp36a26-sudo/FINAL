"""Reference implementation of the v3.0 rules in usecase_questions_v3.json (for golden cases and sweep)."""
import json, itertools, math, collections
D = json.load(open('usecase_questions_v3.json'))
UC = {u['id']: u for u in D['use_cases']}
W = D['scoring']['weights']; F = D['scoring']['factors']
GLIB = D['gate_library']
def gate_effects(u, gates_ans):
    eff = []
    for g in u['gates']:
        if not g['asked']:
            eff.append(g['effects']); continue
        a = gates_ans.get(g['id'])
        if a is None: continue
        eff.append([o for o in g['options'] if o['key']==a][0]['effects'])
    return eff
def visible_questions(u, gates_ans):
    out = []
    for q in u['questions']:
        if q['show_if']:
            gid, opt = q['show_if'].split('=')
            if gates_ans.get(gid) != opt: continue
        if any(gates_ans.get(h.split('=')[0]) == h.split('=')[1] for h in q['hidden_when']): continue
        out.append(q)
    return out
def asked_gates(u): return [g for g in u['gates'] if g['asked']]
def evaluate(uid, step2, gates_ans, mh, qa, continued=False):
    """step2: {s1..s5: yes/no/dk}; gates_ans: {gate_id: key}; mh: {m1..m11: yes/planned/no/dk/na}; qa: {question_id: yes/planned/no/dk}"""
    none = uid == 'none'
    u = None if none else UC[uid]
    if not continued and (step2.get('s1')=='no' or step2.get('s2')=='no'):
        return dict(verdict='Soft stop', score=None, reasons=['s1/s2 No'])
    caps = []; notes = []
    if continued: caps.append('soft stop continued')
    if none:
        eff = []
        for gid in D['none_fits']['gates']:
            a = gates_ans.get(gid)
            if a: eff.append([o for o in GLIB[gid]['options'] if o['key']==a][0]['effects'])
        qs = [dict(q, show_if=None, hidden_when=[]) for q in D['none_fits']['questions']]
        for e in eff:
            for gq in e.get('add', []):
                q = dict(D['gate_questions'][gq]); q['id'] = 'none.'+gq; qs.append(q)
            if e.get('hide_area'): qs = [q for q in qs if q['area'] != e['hide_area'] or q['id'].startswith('none.') and '.' in q['id'] and q['id'].split('.')[1].isupper()]
        caps.append('None fits chosen'); gate_ids = D['none_fits']['gates']; sens = False
    else:
        eff = gate_effects(u, gates_ans); qs = visible_questions(u, gates_ans)
        gate_ids = [g['id'] for g in asked_gates(u)]; sens = u['sensitive']['always']
    contra = set()
    for e in eff:
        contra |= set(e.get('contradicts_na', []))
        if e.get('sensitive_flag'): sens = True
        if e.get('cap_almost'): caps.append('gate cap')
        if e.get('not_fit'): caps.append('not a fit (continued)')
    for gid in gate_ids:
        if gates_ans.get(gid) in (None, 'dk'): caps.append('gate unanswered or dk')
    if sens: caps.append('sensitive')
    for s in ('s3','s4','s5'):
        if step2.get(s) != 'yes': caps.append('step2 '+s)
    items = []
    for m in D['must_haves']:
        a = mh.get(m['id'], 'dk')
        if a == 'na' and not m.get('na'): a = 'dk'          # Doesn't apply is only offered on m2 and m4
        if a == 'na' and m['id'] in contra:                # a later gate answer contradicts it
            a = 'dk'; notes.append(m['contradiction_note'])
        items.append(('B', a, m['id']))
    for q in qs: items.append((q['weight'], qa.get(q['id'], 'dk'), q['id']))
    app = [(w,a,i) for w,a,i in items if a != 'na']
    sw = sum(W[w] for w,a,i in app); sc = sum(W[w]*F[a] for w,a,i in app)
    score = math.floor(100*sc/sw) if sw else 0
    dk = sum(1 for w,a,i in app if a=='dk')/len(app)
    blockers = [(a,i) for w,a,i in app if w=='B']
    if dk > 0.5: v = 'Not enough info'
    elif any(a=='no' for a,i in blockers) or score < 50 or sum(a=='yes' for a,i in blockers) < len(blockers)/2: v = 'Not ready'
    elif all(a=='yes' for a,i in blockers) and score >= 75 and dk < 0.25 and not caps: v = 'Ready'
    else: v = 'Almost ready'
    return dict(verdict=v, score=score, dk=round(dk,3), caps=sorted(set(caps)), notes=notes, blockers_no=[i for a,i in blockers if a=='no'], n_items=len(app))
def all_yes(uid, gates_ans):
    u = UC[uid]
    mh = {m['id']: 'yes' for m in D['must_haves']}
    qa = {q['id']: 'yes' for q in visible_questions(u, gates_ans)}
    return mh, qa
S2_YES = {f's{i}': 'yes' for i in range(1,6)}
