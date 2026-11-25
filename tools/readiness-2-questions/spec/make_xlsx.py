import json, openpyxl
from openpyxl.styles import Font, Alignment, PatternFill
D = json.load(open('usecase_questions_only.json'))
wb = openpyxl.Workbook(); wb.remove(wb.active)
def sheet(name, head, rows, widths):
    ws = wb.create_sheet(name); ws.append(head)
    for c in ws[1]: c.font = Font(bold=True, color='FFFFFF'); c.fill = PatternFill('solid', fgColor='1F4E78')
    for r in rows: ws.append(r)
    for i,w in enumerate(widths): ws.column_dimensions[openpyxl.utils.get_column_letter(i+1)].width = w
    for row in ws.iter_rows(min_row=2):
        for c in row: c.alignment = Alignment(wrap_text=True, vertical='top')
    ws.freeze_panes = 'A2'; ws.auto_filter.ref = ws.dimensions
sheet('Summary', ['Item','Value'], [[k, json.dumps(v)] for k,v in D['counts'].items()] + [[k, json.dumps(v, ensure_ascii=False)] for k,v in D['fixed_texts'].items()], [34, 110])
sheet('Use cases', ['ID','Department','Name','Old name','Sensitive flag','Questions'], [[u['id'],u['department'],u['name'],u['old_name'] or '','yes' if u['sensitive'] else 'no',len(u['questions'])] for u in D['use_cases']], [8,26,60,40,12,10])
sheet('Questions', ['Use case','Order','Question ID','Question','Why it matters','Area','Who answers','Origin','Old ID','Carry old answer from'],
      [[u['id'],i+1,q['id'],q['text'],q['why'],q['area'],q['who_answers'],q['origin'],q['old_id'] or '',q['carry_answer_from'] or ''] for u in D['use_cases'] for i,q in enumerate(u['questions'])], [8,6,18,60,50,20,16,26,8,12])
sheet('Original 661', ['Use case','Old ID','Old wording (workbook suggested)','Status','Now asked as','Reason'],
      [[u['id'],r['old_id'],r['old_wording'],r['status'],', '.join(r['now']),r['reason']] for u in D['use_cases'] for r in u['original_questions']], [8,8,60,10,24,60])
wb.save('usecase_questions_only.xlsx'); print('xlsx ok')
