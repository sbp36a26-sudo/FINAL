"""Writes tests/fixtures/sim_v3_random.json: 1,200 random checks (fixed seed) scored by the owner's reference spec/sim_v3.py, so the JS
rules can be compared on mixed answers the sweep does not reach (several answers changed at once, step 2 answers, partly answered
gates, Doesn't apply anywhere, None of these fits with any gate answers, Continue anyway after a soft stop).
"continued" is only set together with a soft stop (s1 or s2 No): rules3.js caps "Continue anyway" only when there is a stop to
continue from (judgement call, see the report). Run from the repo root:  python3 -I tools/readiness-3/tests/gen_sim_random.py"""
import json, os, random, sys
HERE = os.path.dirname(os.path.abspath(__file__))
SPEC = os.path.join(HERE, '..', 'spec')
os.chdir(SPEC); sys.path.insert(0, SPEC)
import sim_v3 as S

rnd = random.Random(20261125)
uids = list(S.UC) + ['none'] * 8
out = []
for n in range(1200):
    uid = rnd.choice(uids)
    if uid == 'none':
        gates = [(g, [o['key'] for o in S.GLIB[g]['options']]) for g in S.D['none_fits']['gates']]
        qids = [q['id'] for q in S.D['none_fits']['questions']] + ['none.' + k for k in S.D['gate_questions']]
    else:
        u = S.UC[uid]
        gates = [(g['id'], [o['key'] for o in g['options']]) for g in S.asked_gates(u)]
        qids = [q['id'] for q in u['questions']]
    ga = {g: rnd.choice(keys) for g, keys in gates if rnd.random() < 0.9}
    step2 = {f's{i}': rnd.choices(['yes', 'no', 'dk'], [0.85, 0.08, 0.07])[0] for i in range(1, 6)}
    mh = {m['id']: rnd.choices(['yes', 'planned', 'no', 'dk', 'na'], [0.7, 0.1, 0.05, 0.08, 0.07])[0] for m in S.D['must_haves'] if rnd.random() < 0.97}
    qa = {q: rnd.choices(['yes', 'planned', 'no', 'dk'], [0.75, 0.1, 0.07, 0.08])[0] for q in qids if rnd.random() < 0.95}
    cont = (step2['s1'] == 'no' or step2['s2'] == 'no') and rnd.random() < 0.6
    r = S.evaluate(uid, step2, ga, mh, qa, cont)
    out.append(dict(use=uid, step2=step2, gates=ga, mh=mh, qa=qa, continued=cont, verdict=r['verdict'], score=r['score'], caps=r.get('caps', []), notes=r.get('notes', [])))
with open(os.path.join(HERE, 'fixtures', 'sim_v3_random.json'), 'w') as f: json.dump(out, f, separators=(',', ':'))
from collections import Counter
print(len(out), Counter(o['verdict'] for o in out))
