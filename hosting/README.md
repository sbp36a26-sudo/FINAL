# Hosting "Can AI solve your problems?" (public build)

The public page is `tools/readiness-2-questions/public/index.html`, one self-contained file, published by GitHub Pages from this
repository. When someone uses it, each finished step and the result are sent to a Google Apps Script web app that adds one row to
a Google Sheet that only the owner can open. People can tick "Don't send my answers" on the first page (or in the "Data" notice
in the footer); then nothing is sent from that browser.

The claude.ai artifact (`tools/readiness-2-questions/index.html`) sends nothing and is not affected by any of this.

## Files

| File | What it is |
|---|---|
| `hosting/apps-script/Code.gs` | The Apps Script: `doPost` reads the JSON event (sent as text/plain), checks its shape and size (50 KB at most), appends one row to the sheet `events`, answers with a small JSON. Nothing else. |
| `hosting/analysis/` | The team's analysis kit for the Sheet (see its README). |
| `tools/readiness-2-questions/hosting.config.json` | `collectUrl` (the web app address) and `contact` (shown in the data notice; empty shows "Contact: to be added"). |
| `tools/readiness-2-questions/src/collect.js` | The sender in the page (public build only). |
| `.github/workflows/pages.yml` | Uploads `tools/readiness-2-questions/public/` to GitHub Pages on every push to `main` that changes it. |

Sheet `events`, one row per event: `received_at, check_id, event, step, version, at, hotel_type, role, country, hotel_name, use_case,
verdict, score, step2, must, answers`. `event` is `step_done` (step `1` to `5`: that step was finished) or `result` (step `result`, or
`stop` when question 1 stopped the check). A check that has `step_done` rows but no `result` row was not finished. `check_id` is a
random id per check, so the rows of one check belong together. `step2`, `must` and `answers` are JSON text with the answers in words
(Yes, Planned, No, Don't know yet; tool v2.8.1 sent "Not sure" in step 2). No IP address, browser name or cookie is stored by the tool or the script.

## Owner steps (one time)

1. **Sheet.** In Google Drive: New → Google Sheets. Name it, e.g. "Can AI solve your problems? – answers". Do not share it.
2. **Script.** In the Sheet: Extensions → Apps Script. Delete what is in `Code.gs` there, paste the whole of
   `hosting/apps-script/Code.gs`, Save.
3. **Deploy.** Deploy → New deployment → type **Web app**. Execute as: **Me**. Who has access: **Anyone**. Deploy, allow the
   access Google asks for (it is your own script writing to your own Sheet), and copy the **Web app URL** (it ends in `/exec`).
   Opening that address in a browser shows "This address only receives answers from the tool."
4. **Config.** (Done 26 Nov 2026: `collectUrl` is set; `contact` is still empty.) Put the URL in `tools/readiness-2-questions/hosting.config.json` as `collectUrl`. Put a contact (an e-mail address
   the team reads) in `contact`; until then the notice says "Contact: to be added" and the build prints a warning.
5. **Build.** From the repository root: `node tools/readiness-2-questions/build.mjs --public` (and `node tools/readiness-2-questions/build.mjs`
   for the claude.ai file). Commit `tools/readiness-2-questions/public/index.html` and `hosting.config.json`, push to `main`.
6. **Pages.** On GitHub: Settings → Pages → Build and deployment → Source: **GitHub Actions**. The workflow "Pages" then runs on
   the next push (or run it by hand: Actions → Pages → Run workflow). The page is at **https://sbp36a26-sudo.github.io/FINAL/**
   (GitHub shows the exact address under Settings → Pages; the last part follows the repository's name).
7. **Check.** Open the page, go through one check, and see the rows appear in the sheet `events` (the script creates it with
   its header on the first event).

Changing the script later: Deploy → Manage deployments → edit → Version: New version. The URL stays the same.

## What the page tells people (the data notice)

What is sent (the answers, the result, how the hotel is run, role, country, the hotel name only if typed, which step was reached),
by whom (EHL SBP Group 36, a student project for HFTP), why (to improve this tool and for our research on AI in hotels), how long
(kept until 31 January 2027, then removed), that nobody else sees anyone's answers, how to stop it ("Don't send my answers"), and
the contact. The words are in `tools/readiness-2-questions/src/content.js` (`PUB`). **The owner must remove the Sheet's rows by
31 January 2027**, as the notice promises.

## Tests never write to the Sheet

All browser tests answer every request to `script.google.com` themselves (Playwright routes); the collect tests use a fake address.
