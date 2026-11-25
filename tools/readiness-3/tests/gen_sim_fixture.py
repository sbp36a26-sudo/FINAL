"""Writes tests/fixtures/sim_v3_visible.json from the owner's reference implementation (spec/sim_v3.py), so the JS tests can compare
visibility with sim_v3.visible_questions without Python. For every use case and every combination of its asked gates (each gate
answered with any option, or left unanswered) it records the visible question ids in order. For "None of these fits" it uses the
question-list lines of sim_v3.evaluate (sim has no separate function for it), copied unchanged below.
Run from the repo root:  python3 -I tools/readiness-3/tests/gen_sim_fixture.py   (spec/ is only read)"""
import json, itertools, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
SPEC = os.path.join(HERE, '..', 'spec')
os.chdir(SPEC); sys.path.insert(0, SPEC)
import sim_v3 as S

def none_visible(gates_ans):
    D, GLIB = S.D, S.GLIB
    eff = []
    for gid in D['none_fits']['gates']:
        a = gates_ans.get(gid)
        if a: eff.append([o for o in GLIB[gid]['options'] if o['key']==a][0]['effects'])
    qs = [dict(q, show_if=None, hidden_when=[]) for q in D['none_fits']['questions']]
    for e in eff:
        for gq in e.get('add', []):
            q = dict(D['gate_questions'][gq]); q['id'] = 'none.'+gq; qs.append(q)
        if e.get('hide_area'): qs = [q for q in qs if q['area'] != e['hide_area'] or q['id'].startswith('none.') and '.' in q['id'] and q['id'].split('.')[1].isupper()]
    return [q['id'] for q in qs]

out = {}
for uid, u in S.UC.items():
    ag = S.asked_gates(u)
    rows = []
    for c in itertools.product(*[[o['key'] for o in g['options']] + [None] for g in ag]):
        ga = {g['id']: k for g, k in zip(ag, c) if k is not None}
        rows.append([ga, [q['id'] for q in S.visible_questions(u, ga)]])
    out[uid] = rows
rows = []
gl = S.D['none_fits']['gates']
for c in itertools.product(*[[o['key'] for o in S.GLIB[g]['options']] + [None] for g in gl]):
    ga = {g: k for g, k in zip(gl, c) if k is not None}
    rows.append([ga, none_visible(ga)])
out['none'] = rows
with open(os.path.join(HERE, 'fixtures', 'sim_v3_visible.json'), 'w') as f: json.dump(out, f, separators=(',', ':'))
print('use cases', len(out) - 1, 'combinations', sum(len(v) for v in out.values()))
