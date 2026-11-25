import json
D=json.load(open('usecase_questions_v3.json')); G=json.load(open('golden_cases_v3.json')); S=json.load(open('sweep_v3_summary.json'))['summary']
c=D['counts']
def fmt(d): return ', '.join(f'{k}={v}' for k,v in d.items()) or '—'
rows=['| # | Case | Use case | Step 2 changes | Gates | Must-haves changed | Questions changed | Expected verdict | Score | What it checks |','|---|---|---|---|---|---|---|---|---|---|']
for i,g in enumerate(G,1):
    s2={k:v for k,v in g['step2'].items() if v!='yes'}; qc=g['questions_changed']
    qtxt=(f"all {len(qc)} visible use-case questions = {list(qc.values())[0]}" if len(qc)>3 and len(set(qc.values()))==1 else fmt({k.split('.',1)[1]:v for k,v in qc.items()}))
    mc=g['must_haves_changed']; mtxt=(f"all 11 = {list(mc.values())[0]}" if len(mc)==11 else fmt(mc))
    cont=' (then Continue anyway)' if g['continued_after_soft_stop'] else ''
    note=' Note shown: "'+g['expected_notes'][0]+'"' if g.get('expected_notes') else ''
    rows.append(f"| {i} | {g['name']} | {g['use_case']} | {fmt(s2)}{cont} | {fmt(g['gates'])} | {mtxt} | {qtxt} | **{g['expected_verdict']}** | {g['expected_score'] if g['expected_score'] is not None else '—'} | {g['checks']}{note} |")
t=open('MASTER_PROMPT.src.md').read()
rep={'{{NGOLDEN}}':str(len(G)),'{{SWEEP_RUNS}}':f"{S['runs']:,}",'{{GOLDEN_TABLE}}':'\n'.join(rows),'{{NQ}}':str(c['v3_use_case_questions_total']),'{{NGATEQ}}':str(c['gate_added'])}
for k,v in c['actions'].items(): rep['{{A_'+k+'}}']=str(v)
for k,v in rep.items(): t=t.replace(k,v)
assert '{{' not in t
open('MASTER_PROMPT.md','w').write(t); print(len(t), len(t.split()))
