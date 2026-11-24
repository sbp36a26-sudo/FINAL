#!/usr/bin/env python3
"""Reads the owner's workbook and writes excel-rows.json (plain data, nothing reworded).

Run (only when the workbook changes):
    python3 -I tools/readiness-2/data/extract-excel.py
Then: node tools/readiness-2/data/build-questions.mjs

Sheets read: "Use case resources" (one row per use case), "Use case archetypes" (archetype and add-ons),
"Framework matrix" (20 building blocks with the count and share of use cases needing each, and the layer),
and README (the definitions of Light / Moderate / Heavy).
"""
import json, os, warnings
import openpyxl

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', '..', '..', 'research_notes', 'Do you need AI v2', 'AI_Use_Cases_Resources_Needed_per_Use_Case_D4_D6.xlsx')
warnings.simplefilter('ignore')
wb = openpyxl.load_workbook(SRC, data_only=True)

def s(v):
    return '' if v is None else str(v).strip()

res = wb['Use case resources']
head = [s(c) for c in next(res.iter_rows(min_row=1, max_row=1, values_only=True))]
want = ['Department', 'Use case', 'Resource intensity', 'People', 'Skills', 'Financial investment', 'Technology infrastructure', 'Data',
        'Organisation & governance', 'Checklist items to check first', 'Evidence IDs (D6 pack)', 'AI type (catalogue)', 'Hotel use (catalogue)', 'Category']
assert head == want, head
arch = {}
ah = [s(c) for c in next(wb['Use case archetypes'].iter_rows(min_row=1, max_row=1, values_only=True))]
assert ah == ['Department', 'Use case', 'Resource intensity', 'Archetype', 'Add-on: sensitive personal data', 'Add-on: payment data', 'Add-on: hardware spending', 'Add-on: acts without human sign-off'], ah
for r in wb['Use case archetypes'].iter_rows(min_row=2, values_only=True):
    if not s(r[1]):
        continue
    add = [k for k, v in zip(['sens', 'pay', 'hw', 'auto'], r[4:8]) if s(v).lower() == 'yes']
    arch[(s(r[0]), s(r[1]))] = {'arch': '' if s(r[3]) in ('', '—') else s(r[3]), 'add': add}

rows = []
for r in res.iter_rows(min_row=2, values_only=True):
    if not s(r[1]):
        continue
    a = arch[(s(r[0]), s(r[1]))]
    ev = s(r[10])
    rows.append({'dept': s(r[0]), 'name': s(r[1]), 'int': s(r[2]),
                 'r': {'pe': s(r[3]), 'sk': s(r[4]), 'fi': s(r[5]), 'te': s(r[6]), 'da': s(r[7]), 'or': s(r[8])},
                 'chk': [x.strip() for x in s(r[9]).split(',') if x.strip()], 'ev': '' if ev == '—' else ev,
                 'arch': a['arch'], 'add': a['add']})

fm = wb['Framework matrix']
blocks, archetypes, note, total = [], [], '', None
for r in fm.iter_rows(values_only=True):
    c = [s(x) for x in r]
    if c[0].startswith('Resources needed by use-case archetype'):
        note = c[0]
    elif c[0] in ('People', 'Skills', 'Financial investment', 'Technology infrastructure', 'Data', 'Organisation & governance') and c[1]:
        blocks.append({'area': c[0], 'name': c[1], 'codes': [] if c[2] in ('', '—') else [x.strip() for x in c[2].split(',')],
                       'n': int(r[12]), 'share': round(float(r[13]), 4), 'layer': c[14]})
    elif len(c[0]) == 2 and c[0][0] == 'A' and c[0][1].isdigit():
        archetypes.append({'c': c[0], 'n': c[1], 'count': int(r[2]), 'examples': c[3]})
    elif c[0] == 'Total':
        total = int(r[2])

readme = [s(r[0]) for r in wb['README'].iter_rows(values_only=True) if s(r[0])]
intensity = {}
for line in readme:
    for k in ('Light', 'Moderate', 'Heavy'):
        if line.startswith(k + ': '):
            intensity[k] = line[len(k) + 2:]
assert len(intensity) == 3 and len(blocks) == 20 and len(archetypes) == 9 and total == 90, (intensity, len(blocks), len(archetypes), total)

out = {'source': 'research_notes/Do you need AI v2/AI_Use_Cases_Resources_Needed_per_Use_Case_D4_D6.xlsx',
       'note': 'Extracted by tools/readiness-2/data/extract-excel.py. Do not edit by hand.',
       'rows': rows, 'blocks': blocks, 'archetypes': archetypes, 'matrixTotal': total, 'matrixNote': note, 'intensity': intensity, 'readme': readme}
with open(os.path.join(HERE, 'excel-rows.json'), 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=1)
    f.write('\n')
print('wrote excel-rows.json:', len(rows), 'use-case rows,', len(blocks), 'blocks,', len(archetypes), 'archetypes; matrix total', total)
