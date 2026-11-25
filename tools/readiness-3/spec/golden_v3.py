import json
from sim_v3 import *
MH = {m['id']:'yes' for m in D['must_haves']}
def Y(uid, ga): return {q['id']:'yes' for q in visible_questions(UC[uid], ga)}
def case(name, uid, ga, s2=None, mh=None, qa=None, cont=False, why=''):
    s2 = dict(S2_YES, **(s2 or {}))
    base_q = Y(uid, ga) if uid!='none' else {q['id']:'yes' for q in D['none_fits']['questions']}
    q = dict(base_q, **(qa or {}))
    m = dict(MH, **(mh or {}))
    r = evaluate(uid, s2, ga, m, q, cont)
    return dict(name=name, use_case=uid, step2=s2, gates=ga, must_haves_changed=mh or {}, questions_changed=qa or {}, other_answers='Yes', continued_after_soft_stop=cont,
                expected_verdict=r['verdict'], expected_score=r['score'], expected_caps=r.get('caps',[]), expected_notes=r.get('notes',[]), checks=why)
allq = lambda uid, ga, a: {q['id']:a for q in visible_questions(UC[uid], ga)}
G = []
G.append(case('All Yes, suggests only','rm-1',{'G_ACT':'suggests'},why='Clean Ready path.'))
G.append(case('One tailored blocker No','rm-1',{'G_ACT':'suggests'},qa={'rm-1.te1':'no'},why='Any blocker No gives Not ready (fixes L1: tailored questions could not block).'))
G.append(case('Acts by itself, switch-off No','rm-1',{'G_ACT':'acts'},qa={'rm-1.ACT_OFF':'no'},why='Gate-added blocker shows and blocks.'))
G.append(case('Acts by itself, all Yes','rm-1',{'G_ACT':'acts'},why='Gate-added blockers answered Yes keep Ready.'))
G.append(case('Nice-to-have No only','rm-1',{'G_ACT':'suggests'},qa={'rm-1.fi1':'no'},why='A single nice-to-have No does not block.'))
G.append(case('One blocker Planned','rm-1',{'G_ACT':'suggests'},qa={'rm-1.da1':'planned'},why='Planned blocker caps at Almost ready.'))
G.append(case('All tailored questions No','rm-1',{'G_ACT':'suggests'},qa=allq('rm-1',{'G_ACT':'suggests'},'no'),why='Fixes v2.6 bug where all tailored No still gave Almost ready.'))
G.append(case('Everything Don\'t know yet','rm-1',{'G_ACT':'suggests'},mh={m:'dk' for m in MH},qa=allq('rm-1',{'G_ACT':'suggests'},'dk'),why='More than 50% Don\'t know yet.'))
G.append(case('Step 2 Q1 No','rm-1',{'G_ACT':'suggests'},s2={'s1':'no'},why='Q1 No (rules would do) is a soft stop, not a hard stop.'))
G.append(case('Step 2 Q1 No, continue anyway','rm-1',{'G_ACT':'suggests'},s2={'s1':'no'},cont=True,why='Continuing after a soft stop caps at Almost ready.'))
G.append(case('Step 2 Q1 Yes means towards AI','gx-3',{'G_PAID':'no'},s2={'s1':'yes'},why='Polarity flip: Yes no longer ends the check.'))
G.append(case('Step 2 Q2 No','gx-3',{'G_PAID':'no'},s2={'s2':'no'},why='"Probably not worth it" soft stop, no full plan.'))
G.append(case('Step 2 Q3 Don\'t know yet','gx-3',{'G_PAID':'no'},s2={'s3':'dk'},why='Step 2 uncertainty holds Ready back.'))
G.append(case('Free ChatGPT-style writing tool','sm-1',{'G_PAID':'yes','G_LINK':'no'},mh={'m2':'na','m4':'na'},why='Must-haves 2 and 4 at Doesn\'t apply are excluded, not failed; fi and te questions hidden.'))
G.append(case('Doesn\'t apply contradicted by a gate','sm-1',{'G_PAID':'no','G_LINK':'yes'},mh={'m2':'na'},why='Must-have 2 Doesn\'t apply, then the gate says new money is needed: m2 counts as Don\'t know yet and the contradiction note shows.'))
G.append(case('Connections Doesn\'t apply contradicted','sm-1',{'G_PAID':'yes','G_LINK':'yes'},mh={'m2':'na','m4':'na'},why='m4 Doesn\'t apply but the gate says it must connect: m4 becomes Don\'t know yet with a note; m2 stays excluded.'))
G.append(case('Doesn\'t apply with no matching gate','gx-3',{'G_PAID':'yes'},mh={'m4':'na'},why='m4 Doesn\'t apply is accepted when no gate contradicts it.'))
G.append(case('Must-have 11 (staff shown) No','sm-1',{'G_PAID':'no','G_LINK':'yes'},mh={'m11':'no'},why='New staff-training must-have is a blocker.'))
G.append(case('Shift planning per person','hr-1',{'G_LINK':'yes','hr1-person':'yes'},why='Per-person allocation raises the sensitive flag and holds at Almost ready.'))
G.append(case('Shift planning by demand only','hr-1',{'G_LINK':'yes','hr1-person':'no'},why='Plain demand-based rota is not sensitive and can be Ready.'))
G.append(case('Shift planning, final decision No','hr-1',{'G_LINK':'yes','hr1-person':'yes'},qa={'hr-1.n1':'no'},why='Use-case-specific human-decision blocker blocks.'))
G.append(case('Recruiting, all Yes','hr-2',{'hr2-mode':'screen'},why='Hiring is always sensitive: Almost ready with adviser action.'))
G.append(case('Guest chat, staff hand-over No','gx-2',{'G_ACT':'suggests'},qa={'gx-2.GUEST_STAFF':'no'},why='Guest-facing blocker from the automatic guest rule blocks (replaces the old disclosure blocker test).'))
G.append(case('Gate answered Don\'t know yet','gx-2',{'G_ACT':'dk'},why='Unknown gate caps at Almost ready with a vendor action.'))
G.append(case('Face check searches stored faces','fo-3',{'fo3-match':'no'},why='Gate option with cap.'))
G.append(case('Card payments on voice line, check No','res-1',{'G_ACT':'suggests','res1-pay':'yes'},qa={'res-1.n1':'no'},why='Conditional blocker shown only when payments are taken.'))
G.append(case('Linen forecasting only','hk-3',{'hk3-type':'forecast'},why='Tag-tracking questions hidden; Ready possible without them.'))
G.append(case('Group platform for a single hotel','gm-4',{'gm4-group':'one'},why='Not-a-fit redirect; continuing caps at Almost ready.'))
G.append(case('Personalised prices per guest','rm-2',{'G_ACT':'acts','rm2-personal':'yes'},why='Conditional sensitive flag.'))
G.append(case('Many Planned, no No','rm-1',{'G_ACT':'suggests'},mh={m:'planned' for m in MH},why='Fewer than half of blockers Yes gives Not ready even with no No.'))
G.append(case('Camera video, face recognition','it-4',{'it4-face':'yes','it4-staff':'no'},why='Sensitive always; face recognition adds adviser action.'))
G.append(case('None fits, all Yes','none',{'G_ACT':'suggests','G_GUEST':'staff','G_PEOPLE':'no','G_LINK':'yes','G_PAID':'no'},why='None fits is capped at Almost ready.'))
G.append(case('Kiosk avatar, all Yes','fo-7',{'fo7-camera':'no'},why='Automatic guest and acts-by-itself blockers always shown.'))
json.dump(G, open('golden_cases_v3.json','w'), indent=1)
for g in G: print(f"{g['name'][:45]:45} {g['use_case']:6} {g['expected_verdict']:16} {g['expected_score']} {g['expected_caps']}")
