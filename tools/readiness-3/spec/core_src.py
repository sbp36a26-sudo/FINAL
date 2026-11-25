# Core content for v3: answer scales, step 2, must-haves, gate library, "None fits" fallback, fixed texts.
DISCLAIMER = "This check does not cover legal requirements. Check those with your adviser before you start."
SENS_FLAG = "This area involves people's personal data or jobs and has extra rules. Ask an adviser before a pilot."
DK_LABEL = "Don't know yet"
ANSWERS = {
 'step2': [('yes','Yes'),('no','No'),('dk',DK_LABEL)],
 'check': [('yes','Yes'),('planned','Planned'),('no','No'),('dk',DK_LABEL)],
 'check_da': [('yes','Yes'),('planned','Planned'),('no','No'),('dk',DK_LABEL),('na',"Doesn't apply")],
}
STEP2 = [
 dict(id='s1', title='Needs judgement', text="Does each case need judgement that fixed \"if this, then that\" rules can't handle?",
      no_effect='soft_stop', no_message='Fixed rules or a simple automation may do this job more cheaply than AI.',
      replaces="Step 2 Q1 (polarity flipped: Yes now means towards AI; a No is a soft stop, not a hard stop)."),
 dict(id='s2', title='Worth it', text='Does this task happen often, or cost real staff hours or money?',
      no_effect='soft_stop', no_message='The gain may be too small to justify a new tool.',
      replaces="Step 2 Q2 (a No now gives a soft stop instead of a full plan)."),
 dict(id='s3', title='Has what it needs', text='Does the tool have what it needs to work from: past examples or current facts (rates, menus, policies)?',
      no_effect='hold', replaces='Step 2 Q3 (rewritten: chat and writing tools need current facts, not past examples).'),
 dict(id='s4', title='Safety net', text='If the AI gets one wrong, will a person catch it, or is the harm small?',
      no_effect='hold', replaces='Step 2 Q4 (rewritten from "is it acceptable", which invited Yes).'),
 dict(id='s5', title='Proof', text='Do you know which number should improve, and what it is today?',
      no_effect='hold', replaces='Step 2 Q5 (plain wording).'),
]
MUSTHAVES = [
 dict(id='m1', title='A named owner with time', text='Is one named person in charge of the tool, with time set aside for it?', na=False),
 dict(id='m2', title='Budget for the first year', text='Is money approved for the full first year, including set-up and staff time?', na=True, na_help="Choose Doesn't apply if the tool is free or already paid for, so no new budget is needed.",
      na_contradicted_by='G_PAID=no', contradiction_note="You said no new budget is needed, but you also said this tool needs new money. Must-have 2 now counts as Don't know yet."),
 dict(id='m3', title='A number to improve, approved', text='Has the person who decides on spending approved the number this tool should improve?', na=False),
 dict(id='m4', title='Systems that can connect', text='Can other software read data from, and send data back to, the systems you want to connect it to?', na=True, na_help="Choose Doesn't apply if it is a ready-made tool that needs no connection to your hotel systems.",
      na_contradicted_by='G_LINK=yes', contradiction_note="You said no connections are needed, but you also said this tool must connect to your hotel systems. Must-have 4 now counts as Don't know yet."),
 dict(id='m5', title='Personal data known', text='Do you know which guest or staff personal data the tool would use?', na=False,
      replaces='Must-have 5 "data protection contact involved" (legal role removed; practical check kept).'),
 dict(id='m6', title='A person who checks the AI', text="Is a person named to check the tool's results regularly?", na=False),
 dict(id='m7', title='Data you can keep correct', text='Is the data the tool uses held in one system that someone keeps correct?', na=False),
 dict(id='m8', title='Staff told, and able to report errors', text='Do staff know the tool is coming, and whom to tell when it gets something wrong?', na=False),
 dict(id='m9', title='Rules on what not to type', text='Are there written rules on what staff must never type into AI tools?', na=False),
 dict(id='m10', title='A way to work when it is down', text='Can the work carry on if the tool stops working for a day?', na=False),
 dict(id='m11', title='Staff shown how it works', text='Have the staff who use or check the tool been shown what it does and when not to trust it?', na=False,
      replaces='New must-have: staff training (no legal citation).'),
]
# Library gates. Effects: add (question ids from GATE_QUESTIONS), sensitive_flag, cap_almost, action, contradicts_na (must-have ids whose Doesn't apply answer becomes Don't know yet, with a note), hide_area.
GATES = {
 'G_ACT': dict(text='When the tool has a result, what happens next?', options=[
    ('suggests','It suggests, and a person decides',{}),
    ('acts','It acts by itself, within set limits',{'add':['ACT_LIMITS','ACT_OFF']}),
    ('dk',DK_LABEL,{'cap_almost':True,'action':'Ask the vendor what the tool can do without a person approving it.'})]),
 'G_GUEST': dict(text="Who sees the tool's answers first?", options=[
    ('staff','Our staff',{}),
    ('guests','Guests, directly',{'add':['GUEST_FACTS','GUEST_STAFF']}),
    ('dk',DK_LABEL,{'cap_almost':True,'action':'Decide whether guests will see the tool\'s answers directly.'})]),
 'G_PEOPLE': dict(text='Does the tool score, rank or choose between individual people?', options=[
    ('yes','Yes',{'sensitive_flag':True,'add':['PEOPLE_DECIDE','PEOPLE_EXPLAIN']}),
    ('no','No',{}),
    ('dk',DK_LABEL,{'sensitive_flag':True,'cap_almost':True,'action':'Ask the vendor whether the tool scores or ranks individual people.'})]),
 'G_LINK': dict(text='Does the tool need to connect to your hotel systems, such as booking, till or accounting?', options=[
    ('yes','Yes',{'contradicts_na':['m4']}),
    ('no','No, it works on its own',{'hide_area':'te'}),
    ('dk',DK_LABEL,{'cap_almost':True,'action':'Ask the vendor which hotel systems the tool must connect to.'})]),
 'G_PAID': dict(text='Is the tool already paid for or free, so no new spending is needed?', options=[
    ('yes','Yes, no new spending',{'hide_area':'fi'}),
    ('no','No, it needs new money',{'contradicts_na':['m2']}),
    ('dk',DK_LABEL,{'cap_almost':True,'action':'Check whether you already pay for this tool, or what it would cost.'})]),
}
AUTO = {'AUTO_ACT':('G_ACT','acts'), 'AUTO_GUEST':('G_GUEST','guests'), 'AUTO_PEOPLE':('G_PEOPLE','yes')}
GATE_QUESTIONS = {
 'ACT_LIMITS': ('or','GM','B','Are the tool\'s limits written down, such as the biggest change it may make alone?','A tool that acts alone needs clear limits before it starts.'),
 'ACT_OFF': ('or','GM','B','Can one named person switch the tool off at any time?','When it goes wrong, someone must be able to stop it at once.'),
 'GUEST_FACTS': ('da','DH','B','Has a person checked the facts the tool gives guests, such as prices and opening times?','Guests act on what the tool tells them.'),
 'GUEST_STAFF': ('pe','DH','B','Can guests reach a staff member at any time while using the tool?','Guests with problems must never be stuck with a machine.'),
 'PEOPLE_DECIDE': ('pe','HR','B','Does a person make every final decision about a person?','Decisions about people must stay with people.'),
 'PEOPLE_EXPLAIN': ('pe','HR','I','Can a person explain why the tool scored or ranked someone?','People accept decisions they can understand and question.'),
}
SUPPRESS = {'hr-2':['PEOPLE_DECIDE'], 'hr-5':['PEOPLE_DECIDE'], 'fo-6':[]}
NONE_FITS = dict(title='None of these fits', gates=['G_ACT','G_GUEST','G_PEOPLE','G_LINK','G_PAID'], questions=[
 ('pe','GM','I','Has the department that will use the tool agreed to try it?','Tools pushed on a team without its agreement go unused.'),
 ('sk','DH','I','Can the people using it tell when its result is wrong?','Someone must catch mistakes before they matter.'),
 ('fi','FIN','N','Do you know the monthly cost and any set-up fee?','Hidden set-up fees often double the first-year cost.'),
 ('te','IT','B','Can the tool get the data it needs from your systems without retyping?','Retyping data removes most of the time saved.'),
 ('da','DH','B','Is the information the tool works from written down and current?','The tool repeats whatever it is given, right or wrong.'),
 ('or','GM','I','Is it written down what the tool may and may not be used for?','A clear purpose stops the tool drifting into risky uses.'),
], note='Asks all five library gates (exception to the 1-2 gate rule) because the use case is unknown.')
DEPT_RENAME = {'Legal, Compliance & ESG': 'Sustainability & Governance'}
