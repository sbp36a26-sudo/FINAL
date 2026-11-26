# Analysis kit: "Can AI solve your problems?" tool data

The public tool sends one row per event to the team's Google Sheet, sheet **events** (written by `hosting/apps-script/Code.gs`). This kit adds a sheet **summary** that counts those rows for you. It only reads **events**; it never changes or deletes a row there.

Files:

- `Summary.gs`: the script to paste into the Sheet's Apps Script project.
- `test/summary.test.mjs`: a local check of the counting logic. Run `node hosting/analysis/test/summary.test.mjs` from the repo root.

## Columns it expects

Row 1 of **events** must hold these headers (from Code.gs): `received_at, check_id, event, step, version, hotel_type, role, country, hotel_name, use_case, verdict, score, step2, must, answers`.

Case, spaces and a trailing "json" are ignored, so `step2 json` or `Step2_JSON` both work. Code.gs was not yet in the repo when this kit was written. If its final headers use other names, add them to `COLUMN_ALIASES` at the top of `Summary.gs`. Extra columns (for example `at`) are ignored.

## Set it up (once)

1. Open the Google Sheet that receives the data.
2. **Extensions > Apps Script.** You will see `Code.gs` already there.
3. Click **+** next to "Files", choose **Script**, and name it `Summary`. Apps Script adds `.gs` itself.
4. Delete the empty function in the new file, paste in the whole of `Summary.gs` and click **Save**.
5. If `Code.gs` already has a function called `onOpen`, delete the `onOpen` function in `Summary.gs` and add the line `addToolDataMenu();` inside the existing `onOpen` instead. Two `onOpen` functions in one project clash.
6. Go back to the Sheet and reload the page. A menu **Tool data** appears after a few seconds.
7. Click **Tool data > Refresh summary**. The first time, Google asks for permission:
   - click **Continue**, choose your account;
   - if you see "Google hasn't verified this app", click **Advanced**, then **Go to (project name) (unsafe)**. This is your own script; it is only "unverified" because Google did not review it;
   - click **Allow**. The script only needs access to this spreadsheet.
8. Run **Refresh summary** again after the permission step. The sheet **summary** appears.

You do not need to redeploy the web app: adding `Summary.gs` does not change what `doPost` does. Click **Refresh summary** whenever you want fresh numbers. It rewrites the whole **summary** sheet, so do not type your own notes there.

## What each block means

Definitions used everywhere:

- **Check**: one run of the tool, identified by `check_id`. One person can make several checks.
- **Finished check**: a check that has a `result` event with a verdict other than `stop`. If a check sent several results (the person went back and changed answers), only the **last** one counts.
- **Base**: the line at the top: how many checks, how many finished, and the first and last date an event arrived. Quote it with every figure.

| Block | What it shows |
|---|---|
| Last refreshed | When you last clicked Refresh summary (UTC). |
| Data | Total rows, rows skipped (no `check_id` or `event`), answer cells with broken JSON, distinct checks, finished checks, checks that ended on the "not suitable for AI" stop screen. Broken cells are counted as unanswered; if this number is not 0, ask whoever looks after Code.gs. |
| Funnel | How many checks completed steps 1, 2, 3, 4, 5 and reached the result, as a share of all checks, and how many were lost since the line above (the drop-off). A check that reached a later step also counts for earlier steps, even if one event went missing. Stopped checks count up to the step they reached. |
| Verdicts | The last verdict of each check that has a result: Ready to start a pilot, Almost ready, Not ready yet, Not enough information yet, Stopped: not suitable for AI. Share of checks with a result. |
| Score bands | Finished checks by score: 0–49, 50–74, 75–100. "No score given" are finished checks without a score (for example "Not enough information yet"). The share is of finished checks with a score. |
| Top use cases | The 15 use cases chosen most often (the code the tool sends, for example a catalogue number), one per check, all checks. |
| By hotel type / role / country / tool version | How the checks split, using the latest value each check gave. "(not given)" means the person left it blank. |
| Step 2: the five questions | For q1 to q5 (Needs judgement, Worth real money or hours, Past examples to learn from, Mistakes can be caught, Success has a number): the share of finished checks answering Yes / Planned / No / Don't know yet / Unanswered. Question 1 offers Yes, No and Don't know yet; questions 2 to 5 also offer Planned (since v2.8.2). Checks stopped at the stop screen are not in this base. |
| Step 3: the ten must-haves | The same for m1 to m10. Since v2.8.2 steps 2, 3 and 5 offer Yes, Planned, No and Don't know yet ("Not sure" sent by v2.8.1 is counted as Don't know yet). Unanswered includes blanks and broken cells. |

## Export for the report

1. Click **Tool data > Refresh summary** first.
2. Open the **summary** sheet tab.
3. **File > Download > Comma-separated values (.csv)**. Only the open sheet is exported.
4. Rename the file with the date, for example `tool-summary_2026-12-05.csv`, and keep it with the report sources so every figure can be traced.

For your own cross-tabs, export **events** the same way (open that tab first). Remove the `hotel_name` column before sharing that file outside the team.

## Caveats (read before quoting anything)

- **Self-reported.** Answers are what the person clicked, not checked facts about the hotel.
- **Small samples.** With a few dozen checks, one more answer moves a share by several points. Give counts (n) next to every percentage, and do not compare small groups (for example one country with five checks).
- **Not one person per check.** The same person can run several checks (different use cases, or trying again). Counts are checks, not hotels or people.
- **Opt-outs are invisible.** People who ticked "Don't send my answers", and anyone whose browser blocked the sending, leave no trace. We cannot tell how many there are, so the data is not a sample of all users.
- **Who finds the tool** decides who is in the data (whoever HFTP or the team reached). It is not a representative survey of European hotels.
- **Tool versions.** Question wording and rules change between versions. Check the "By tool version" block before comparing periods.
- **Quote the base.** No figure from this data goes into a deliverable without its base: "n = X checks (Y finished), collected DD Mon to DD Mon YYYY, self-reported, 'Can AI solve your problems?' tool". This follows the project rule that every number carries its source.
