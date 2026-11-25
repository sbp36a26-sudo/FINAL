import json, openpyxl
from openpyxl.styles import Font, Alignment, PatternFill
D = json.load(open('usecase_questions_v3.json'))
G = json.load(open('golden_cases_v3.json'))
L = D['labels']
def eff_txt(e):
    p = []
    if e.get('add'): p.append('adds ' + ', '.join(e['add']))
    if e.get('sensitive_flag'): p.append('raises sensitive flag')
    if e.get('cap_almost'): p.append('caps at Almost ready')
    if e.get('action'): p.append('action: ' + e['action'])
    if e.get('contradicts_na'): p.append('a Doesn\'t apply answer on ' + ', '.join(e['contradicts_na']) + ' becomes Don\'t know yet, with a note')
    if e.get('hide_area'): p.append('hides ' + L['areas'][e['hide_area']] + ' questions')
    if e.get('not_fit'): p.append('not-a-fit message: ' + e['not_fit'])
    return '; '.join(p) or 'no change'
def gate_lines(u):
    out = []
    for g in u['gates']:
        if g['asked']:
            out.append(f"- **{g['id']}** ({g['kind']}): {g['text']}")
            for o in g['options']: out.append(f"  - {o['label']} → {eff_txt(o['effects'])}")
        else:
            out.append(f"- **{g['id']}** (automatic, not asked): applies {g['applies']} → {eff_txt(g['effects'])}")
    return out
md = [f"# Do you need AI? v3.0 — use-case questions (readable copy)", '',
      f"Generated from `usecase_questions_v3.json` ({D['generated']}). The JSON is the single source of truth; this file is for reading.", '',
      f"Fixed disclaimer (landing and result): \"{D['texts']['disclaimer']}\"", '',
      f"Sensitive-area flag: \"{D['texts']['sensitive_flag']}\"", '', '## Counts', '']
c = D['counts']
md += [f"- Use cases: {c['use_cases']}", f"- Original v2.6.1 questions: {c['original_questions']} (all accounted for: {c['original_accounted']})",
       '- Actions on the originals: ' + ', '.join(f"{k} {v}" for k,v in c['actions'].items() if k!='add') + f"; new questions added: {c['actions']['add']}",
       f"- v3 use-case questions (including split parts and gate-added): {c['v3_use_case_questions_total']} (gate-added {c['gate_added']})",
       f"- Weights: blocker {c['weights'].get('B')}, important {c['weights'].get('I')}, nice to have {c['weights'].get('N')}",
       f"- Sensitive: always {c['sensitive_always']}, depending on a gate answer {c['sensitive_conditional']}", '',
       '## Scoring rules', '', f"- Weights {D['scoring']['weights']}; answer factors {D['scoring']['factors']}; Doesn't apply excluded.", f"- Score: {D['scoring']['score']}"]
md += ['- ' + v for v in D['scoring']['verdict_order']]
md += ['', '## Step 2 (five questions; not scored)', '']
for s in D['step2']: md.append(f"- **{s['id']} {s['title']}**: {s['text']} (No → {s['no_effect'].replace('_',' ')})")
md += ['', '## Must-haves (all blockers)', '']
for m in D['must_haves']: md.append(f"- **{m['id']} {m['title']}**: {m['text']}" + (f" — also offers Doesn't apply ({m['na_help']}) Contradicted by {m['na_contradicted_by']}." if m['na'] else ''))
md += ['', '## Gate library', '']
for k,g in D['gate_library'].items():
    md.append(f"- **{k}**: {g['text']}")
    for o in g['options']: md.append(f"  - {o['label']} → {eff_txt(o['effects'])}")
md += ['', 'Gate-added questions:', '']
for k,q in D['gate_questions'].items(): md.append(f"- **{k}** [{q['weight']}] {q['text']} — why: {q['why']}")
dept = None
for u in D['use_cases']:
    if u['department'] != dept:
        dept = u['department']; md += ['', f"# {dept}"]
    md += ['', f"## {u['id']} — {u['title']}", '']
    if u.get('old_title'): md.append(f"Renamed from: {u['old_title']}  ")
    md.append(f"Review verdict: **{u['review_verdict']}** → treatment: **{u['treatment']}**  ")
    s = u['sensitive']; md.append(f"Sensitive flag: **{'always' if s['always'] else ('when ' + ', '.join(s['when']) if s['when'] else 'no')}**")
    md += ['', '**Gates ("How it works")**', ''] + gate_lines(u)
    md += ['', '**v3 questions** (B blocker, I important, N nice to have)', '', '| ID | W | Area | Who answers | Question | Why it matters | Shown when |', '|---|---|---|---|---|---|---|']
    for q in u['questions']:
        cond = q['show_if'] or ''
        if q['hidden_when']: cond = (cond + '; ' if cond else '') + 'hidden when ' + ', '.join(q['hidden_when'])
        md.append(f"| {q['id'].split('.',1)[1]} | {q['weight']} | {L['areas'][q['area']]} | {L['owners'][q['owner']]} | {q['text']} | {q['why']} | {cond or 'always'} |")
    md += ['', '**What happened to each original question**', '', '| Old ID | Action | Original (workbook suggested wording) | Now | Reason |', '|---|---|---|---|---|']
    for r in u['original_questions']:
        now = ', '.join(x.split('.',1)[-1] for x in r['new_ids']) if r['new_ids'] else '—'
        md.append(f"| {r['qid']} | {r['action']} | {r['suggested']} | {now} | {r['reason']} |")
nf = D['none_fits']
md += ['', '# None of these fits', '', nf['note'], '', 'Gates asked: ' + ', '.join(nf['gates']), '']
for q in nf['questions']: md.append(f"- [{q['weight']}] {q['text']} — why: {q['why']}")
open('usecase_questions_v3.md','w').write('\n'.join(md) + '\n')
# ---- xlsx
wb = openpyxl.Workbook(); H = Font(bold=True, color='FFFFFF'); FILL = PatternFill('solid', fgColor='1F4E78')
def sheet(name, head, rows, widths):
    ws = wb.create_sheet(name); ws.append(head)
    for cl in ws[1]: cl.font = H; cl.fill = FILL
    for r in rows: ws.append(r)
    for i,w in enumerate(widths): ws.column_dimensions[openpyxl.utils.get_column_letter(i+1)].width = w
    for row in ws.iter_rows(min_row=2):
        for cl in row: cl.alignment = Alignment(wrap_text=True, vertical='top')
    ws.freeze_panes = 'A2'; ws.auto_filter.ref = ws.dimensions
wb.remove(wb.active)
sheet('Summary', ['Item','Value'], [[k, json.dumps(v) if isinstance(v,(dict,list)) else v] for k,v in c.items()] + [['Disclaimer', D['texts']['disclaimer']], ['Sensitive flag', D['texts']['sensitive_flag']]], [32, 100])
sheet('Use cases', ['ID','Department','Title','Old title','Review verdict','Treatment','Sensitive','Gates asked','Automatic rules','No. of v3 questions','Blockers'],
      [[u['id'],u['department'],u['title'],u.get('old_title') or '',u['review_verdict'],u['treatment'],'always' if u['sensitive']['always'] else ', '.join(u['sensitive']['when']) or 'no',
        '\n'.join(f"{g['id']}: {g['text']}" for g in u['gates'] if g['asked']), ', '.join(g['id'] for g in u['gates'] if not g['asked']), len(u['questions']), sum(q['weight']=='B' for q in u['questions'])] for u in D['use_cases']], [8,22,40,30,12,14,22,60,18,10,9])
sheet('v3 questions', ['Use case','Question ID','Weight','Area','Who answers','Question','Why it matters','Shown only when','Hidden when','Source','Old ID'],
      [[u['id'],q['id'],q['weight'],L['areas'][q['area']],L['owners'][q['owner']],q['text'],q['why'],q['show_if'] or '',', '.join(q['hidden_when']),q['source']['type'] + ('/'+q['source'].get('action','') if q['source'].get('action') else ''),q['source'].get('qid','')] for u in D['use_cases'] for q in u['questions']], [8,16,7,12,16,60,50,18,16,14,8])
sheet('Original to v3 (661)', ['Use case','Old ID','Area','Who answered','Original current wording','Workbook suggested wording','Action','New question ID(s)','New wording','Weight','Merged into','Reason'],
      [[u['id'],r['qid'],r['area'],r['owner'],r['current'],r['suggested'],r['action'],', '.join(r['new_ids']),r['new_text'] or '',r['weight'] or '',r['merged_into'] or '',r['reason']] for u in D['use_cases'] for r in u['original_questions']], [8,8,14,12,45,45,9,22,45,7,14,40])
sheet('Gates', ['Use case','Gate','Kind','Question','Options and effects'],
      [[u['id'],g['id'],g['kind'],g.get('text', 'automatic: '+g.get('applies','')),'\n'.join(f"{o['label']} → {eff_txt(o['effects'])}" for o in g['options']) if g['asked'] else eff_txt(g['effects'])] for u in D['use_cases'] for g in u['gates']], [8,16,9,50,80])
sheet('Step 2 and must-haves', ['ID','Title','Question','No / Doesn\'t apply rule'],
      [[s['id'],s['title'],s['text'],s['no_effect']] for s in D['step2']] + [[m['id'],m['title'],m['text'],('blocker; offers Doesn\'t apply: '+m['na_help']+' Contradicted by '+m['na_contradicted_by']) if m['na'] else 'blocker'] for m in D['must_haves']], [6,30,80,30])
sheet('Golden cases', ['#','Name','Use case','Step 2','Gates','Must-haves changed','Questions changed','Expected verdict','Expected score','Caps','What it checks'],
      [[i+1,g['name'],g['use_case'],json.dumps(g['step2']),json.dumps(g['gates']),json.dumps(g['must_haves_changed']),json.dumps(g['questions_changed']),g['expected_verdict'],g['expected_score'],', '.join(g['expected_caps']),g['checks']] for i,g in enumerate(G)], [4,30,8,30,30,25,40,15,8,25,50])
wb.save('usecase_questions_v3.xlsx'); print('ok', len(md))
