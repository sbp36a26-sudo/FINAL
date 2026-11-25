import json, itertools, collections, csv
from sim_v3 import *
rows = []; problems = []; dead = []; visible_ever = collections.defaultdict(set)
for uid, u in UC.items():
    ag = asked_gates(u)
    combos = [dict(zip([g['id'] for g in ag], c)) for c in itertools.product(*[[o['key'] for o in g['options']] for g in ag])]
    for ga in combos:
        mh, qa = all_yes(uid, ga)
        base = evaluate(uid, S2_YES, ga, mh, qa)
        exp = 'Ready' if not base['caps'] else 'Almost ready'
        if base['verdict'] != exp: problems.append((uid, ga, 'all-yes', base))
        rows.append([uid, json.dumps(ga), 'ALL', 'yes', base['verdict'], base['score'], ';'.join(base['caps'])])
        for q in visible_questions(u, ga):
            visible_ever[uid].add(q['id'])
            for ans in ('planned','no','dk'):
                r = evaluate(uid, S2_YES, ga, mh, dict(qa, **{q['id']: ans}))
                rows.append([uid, json.dumps(ga), q['id'], ans, r['verdict'], r['score'], ';'.join(r['caps'])])
                if q['weight']=='B' and ans=='no' and r['verdict']!='Not ready': problems.append((uid, ga, q['id'], 'blocker No not Not ready', r))
                if q['weight']=='B' and ans in ('planned','dk') and r['verdict']=='Ready': problems.append((uid, ga, q['id'], 'blocker planned/dk still Ready', r))
                if q['weight']!='B' and ans=='no' and r['verdict']=='Not ready': problems.append((uid, ga, q['id'], 'single non-blocker No gives Not ready', r))
        for m in D['must_haves']:
            for ans in ('planned','no','dk','na'):
                r = evaluate(uid, S2_YES, ga, dict(mh, **{m['id']: ans}), qa)
                rows.append([uid, json.dumps(ga), m['id'], ans, r['verdict'], r['score'], ';'.join(r['caps'])])
                if ans=='no' and r['verdict']!='Not ready': problems.append((uid, ga, m['id'], 'must-have No not Not ready', r))
                if ans=='na':
                    contradicted = any(g.get('id') in ga and m['id'] in [x for o in g.get('options',[]) if ga.get(g['id'])==o['key'] for x in o['effects'].get('contradicts_na',[])] for g in u['gates'])
                    if m.get('na') and not contradicted and r['verdict']!=base['verdict']: problems.append((uid, ga, m['id'], 'accepted Doesn\'t apply changed the verdict', r))
                    if (not m.get('na') or contradicted) and r['verdict']=='Ready': problems.append((uid, ga, m['id'], 'rejected Doesn\'t apply still Ready', r))
                    if contradicted and not r['notes']: problems.append((uid, ga, m['id'], 'contradiction without note', r))
    for q in u['questions']:
        if q['id'] not in visible_ever[uid]: dead.append((uid, q['id']))
    # each blocker flips Ready->Not ready in at least one combo
# None fits
ga = {g: GLIB[g]['options'][0]['key'] for g in D['none_fits']['gates']}
r = evaluate('none', S2_YES, ga, {m['id']:'yes' for m in D['must_haves']}, {q['id']:'yes' for q in D['none_fits']['questions']})
rows.append(['none', json.dumps(ga), 'ALL', 'yes', r['verdict'], r['score'], ';'.join(r['caps'])])
with open('sweep_v3_runs.csv','w',newline='') as f:
    w = csv.writer(f); w.writerow(['use_case','gates','item','answer','verdict','score','caps']); w.writerows(rows)
summary = dict(runs=len(rows), problems=len(problems), dead_questions=len(dead), verdicts=dict(collections.Counter(r[4] for r in rows)))
json.dump(dict(summary=summary, problems=[str(p) for p in problems[:200]], dead=dead), open('sweep_v3_summary.json','w'), indent=1)
print(summary); print(problems[:5]); print(dead[:10])
