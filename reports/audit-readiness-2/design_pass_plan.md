# Do you need AI? Design pass plan

24 Nov 2026. Plan only, no code changed. Basis: `tools/readiness-2/src/`, the screenshots in `reports/readiness-2-screens/`, and the skills in `.claude/skills/` (`impeccable`, `taste-skill`, Emil Kowalski's set). Design only: no wording, question, flow, scoring, data, token, font, print or hook changes.

This is an **Operate** surface in Impeccable (`impeccable/reference/operate.md`): "the tool should disappear into the task". That decides most conflicts below.

One fact shapes every motion item: `render()` replaces `#view.innerHTML` on every answer. CSS entry animations (`@keyframes`, `@starting-style`) inside `#view` would replay on each click, so motion inside `#view` is started from JS at the event, never from CSS on insert.

## Top 10 (most of the gain)

**1. Replace the side stripes with a full border.**
Rule: Impeccable `craft-floor.md`, Refuse: "a bar down one side of a rounded box".
Now: `.verdict` (6px left bar, all result and "Find out first" cards), `.yn-box`, `.yn-unsure`, `.byfield`, `.handover`, `.since`, `.qguard`.
Change: `.verdict{border:1px solid;border-radius:8px}` keeping the existing `border-color` and tint per `.v-*`; `.yn-box,.yn-unsure{border:1px solid; border-left-width:1px}`; `.handover,.since{border-left:1px solid var(--line)}`; `.byfield,.qguard{border-left:0;padding-left:0}`. Add `@media print{.verdict{border-width:0 0 0 4px}}` so print stays as it is.
Risk: low. PDF is drawn by `pdf.js`, not CSS.

**2. Step title must outrank the questions; C-R-I-S-P must not outrank the title.**
Rule: Impeccable `typeset.md` (roles distinguishable at a glance; adjacent sizes too close), `layout.md` (squint test).
Now: `.stephead h2` 1.375rem sits above ten `.qtext` at 1.125rem/600; on step 2 `.crisp` (2rem, accent, tracked .12em) is the biggest thing on screen.
Change: `.stephead h2{font-size:1.75rem;line-height:1.15}` (1.5rem ≤760px); `.crisp{font-size:1.25rem;letter-spacing:.06em;color:var(--ink)}`.
Risk: low.

**3. Drop tracked capitals on the small labels.**
Rule: taste-skill `references/system.md` ("labels 13px at 500, never tracked capitals"); Impeccable craft-floor (eyebrow above a heading).
Now: `.kicker`, `.itemname`, `.yn-head` are uppercase with letter-spacing, on every question.
Change: `text-transform:none;letter-spacing:0;font-weight:600` on all three; `.itemname{color:var(--ink2)}`.
Risk: low; DOM text unchanged.

**4. Focus ring only for keyboard; missing-answer state in its own colour.**
Rule: taste-skill `motion.md` (Focus: 2px ring, drawn at once, no transition), Impeccable `polish.md` (focus in every state).
Now: `.opt:focus-within` and `.filebtn:focus-within` show the ring after a mouse click (double ring on the clicked option in `chat-2-questions.png`, Q5). `.missing` uses the same accent outline as focus, so "you skipped this" looks like "you are here".
Change: `.opt:has(input:focus-visible),.filebtn:has(input:focus-visible){outline:2px solid var(--accent);outline-offset:2px}` and keep `:focus-within` only inside `@supports not selector(:has(a))`. `.missing{outline-color:var(--lo)}`, `.needline{color:var(--lo)}` (as `.fld.missing` already does).
Risk: low.

**5. Phone: answer options in a steady grid.**
Rule: Impeccable `adapt.md`/`layout.md` (responsive is structural), taste-skill SKILL.md checklist (tap-size: targets under 8px apart fail).
Now: `phone-must-haves.png`: five or six `.opt` wrap into ragged rows that differ per question; `.opts{gap:6px}`.
Change: `.opts{gap:8px}`. `@media (max-width:480px){.opts:has(.opt:nth-child(4)){display:grid;grid-template-columns:1fr 1fr}.opts:has(.opt:nth-child(4)) .opt{justify-content:flex-start}}`.
Risk: low; three-option rows and markup unchanged.

**6. Gate hover, add the missing hover, make press felt.**
Rule: Emil `review-animations/STANDARDS.md` (hover behind `(hover:hover) and (pointer:fine)`; press `scale(0.97)`, 100–160ms, strong ease-out), `mobile-native` (sticky hover, tap flash).
Now: `.btn:hover`, `.tile:hover` stick after a tap on phones; `.opt` and `.uc` have no hover at all; `:active` is a 1px drop with no transition.
Change: wrap hover rules in `@media (hover:hover) and (pointer:fine)` and add `.opt:hover{border-color:var(--accent)}`, `.uc:hover{background:var(--line2)}` (not on `.uc.on`). `:root{--ease-out:cubic-bezier(.23,1,.32,1)}`; `.btn:active,.opt:active,.tile:active{transform:scale(.97)}`; add `transform .12s var(--ease-out)` to the existing transition list. `.btn,.opt,.tile,.linkbtn,summary{-webkit-tap-highlight-color:transparent;touch-action:manipulation}`; `.btn,.opt,.tile{user-select:none}`.
Risk: low.

**7. One reading measure inside panels.**
Rule: Impeccable `typeset.md` (45–75ch), craft-floor Verify.
Now: `chat-0-cover.png`: `.panel.intro > p` runs about 95 characters while the `.meta` below stops at 68ch; same in `.aiv`, `.foldbody`.
Change: `.panel > p,.panel li,.foldbody > p{max-width:70ch}`.
Risk: low.

**8. Spacing rhythm instead of one gap.**
Rule: Impeccable `layout.md` ("tight groups, generous separation"; more space above a heading than below).
Now: `.wrap` and `#view` use 18px everywhere; `.qa{padding:16px 0 6px}` separates questions barely more than their own parts. The result page is 13 equal white cards at equal distance.
Change: `.qa{padding:24px 0 10px}`; `.stephead{margin-bottom:6px}`; on the result, `#result + *{margin-top:-6px}` (verdict and "Start with these three" read as one), and `details.panel.fold{background:none;border-width:1px 0 0;border-radius:0;padding:6px 0}` so reference folds become a ruled list, not more cards.
Risk: medium (visual change on the longest page); compare `chat-6-result.png` and `phone-result.png`.

**9. Result page: verdict first, actions after.**
Rule: Impeccable `polish.md` ("make the primary task and current state obvious"), `operate.md` (accent for the primary action only).
Now: six equal buttons (`#actions.toprow`) sit above the verdict; on phone they fill the first screen.
Change: in `vResult()` emit `#actions` after `#result` (same ids, same `data-act`). `.toprow .btn:not(.primary){border-color:transparent;text-decoration:underline;font-weight:500}` so one primary and five quiet actions.
Risk: medium: browser tests that tab or query by position; ids are unchanged.

**10. Draw the small marks; theme the browser's own surfaces.**
Rule: Impeccable craft-floor ("Unicode glyphs standing in for icons"; "Browser surfaces").
Now: `▸` in `details.more > summary::before` sits off the baseline and drifts when rotated (Q1, open); `+`/`−`, `‹`, `✓` are text glyphs.
Change: chevron as CSS: `content:"";width:.45em;height:.45em;border:solid currentColor;border-width:0 2px 2px 0;transform:rotate(-45deg)` and `rotate(45deg)` when open; the same shape for the fold and Back marks; tick as a rotated 2px border box. Add `::selection{background:var(--accent-soft);color:var(--ink)}`, `:root{accent-color:var(--accent);caret-color:var(--accent)}`, `a,.linkbtn{text-underline-offset:.15em}`.
Risk: low. No images, no data URIs.

## Next

**11. Small text floor.** taste `system.md` (small 14, label 13). `.tile span,.uc .ucm,.todo .nm,ul.todo li .meta,.ev .src` 0.8125rem → 0.875rem; `.chip,.keytag,.rc` 0.75rem → 0.8125rem. Risk: chips wrap sooner on phone.

**12. Use-case rows.** `.uc{padding:12px 4px}` leaves the radio against the tint edge when `.uc.on`. → `padding:12px 10px;border-radius:6px`. Low.

**13. Motion, four places only** (Impeccable `animate.md`, operate.md 150–250ms; Emil STANDARDS: transitions and WAAPI, ease-out, under 300ms). All behind `matchMedia('(prefers-reduced-motion: reduce)')`: reduced = opacity only, no movement.
- Step change: in `afterMove()` when the step changed, `view.animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:180,easing:'cubic-bezier(.23,1,.32,1)'})`.
- Fold open: in the existing `toggle` listener, when `open`, the same call on `.morebody`/`.foldbody`, 150ms, 4px.
- Result reveal: same `afterMove()` branch for `result`; `.brow .track i` grows once with `transform:scaleX(0)→1`, `transform-origin:left`, 400ms.
- Toast: `#toast{transition:opacity .2s,transform .2s var(--ease-out),display .2s allow-discrete}` with `@starting-style{opacity:0;transform:translate(-50%,6px)}` (outside `#view`, so safe).
Risk: medium; WAAPI is interruptible and leaves no state.

**14. Progress bar.** `.steps3 span` uses `--line` on `--bg` (about 1.2:1). → `--ctl` for not-done segments (3:1). Low.

**15. Check, do not change: fonts.** The screenshots render in a fallback face, not IBM Plex. Confirm Plex loads inside the hub and report; do not swap fonts.

## Not applied, and why

- **Hero entrance, dealt "moments", photographs, scenes, one section per screen** (taste-skill SKILL.md rules 3, 5–8; `motion.md`): written for company websites. A form wizard has no hero; images are barred by the artifact CSP.
- **Impeccable bolder / overdrive / delight / colorize, a new "visual world"**: the tool must stay in one family with the catalogue, AI Act guide and AI Register. Tokens and fonts stay.
- **Remove the "Step n of 5" kicker** (Impeccable bans eyebrows): removing visible text is a wording change. Softened in item 3 instead; owner may decide.
- **Self-hosted display face / new font pairing** (craft-floor): fonts are fixed by the hub family.
- **Animate the selected answer** (taste "every control answers"): the node is replaced on render, and Emil's frequency rule says a click made 30 times per check gets no animation. Press feedback (item 6) is enough.
- **Card lift, photo zoom, underline draw, stagger, springs, gestures, blur crossfades** (taste `motion.md`, Emil `choreograph`, `gestures`): decoration here; nothing is dragged.
- **Copy rules** (taste `copy*.md`, Impeccable `clarify.md`): wording is out of scope.
- **No accordions** (taste `motion.md`): the folds are an owner decision.
- **Impeccable detector, live mode, hooks; taste gate script**: not installed (they run downloaded or bundled code).

## Builder checklist

- [x] 1 Side stripes → full borders; print rule added; print preview unchanged (print render compared side by side; only the 14px text floor shows)
- [x] 2 `.stephead h2` up, `.crisp` down
- [x] 3 No uppercase/tracking on `.kicker`, `.itemname`, `.yn-head`
- [x] 4 `:focus-visible` rings via `:has()`; `.missing` in `--lo`
- [x] 5 Phone option grid; `.opts` gap 8px (plus line-height 1.25 in the grid so two-line options stay compact)
- [x] 6 Hover gated; `.opt`/`.uc` hover; press scale; tap highlight off (`.uc` hover uses `--bg`, not `--line2`: small grey text on `--line2` fell to 4.4:1 in dark)
- [x] 7 70ch measure in panels
- [x] 8 Question spacing; result folds as ruled list (the tightening sits on `#result + #actions`, since item 9 puts the actions there)
- [x] 9 `#actions` after `#result`; one primary
- [x] 10 CSS-drawn marks; `::selection`, `accent-color`, `caret-color`
- [x] 11–12, 14 Small text floor; `.uc` padding; progress contrast (`--ctl` alone was 2.95:1 on the light page: segments use `--ctl` mixed 15% towards ink in light (3.7:1) and 32% towards the page in dark (3.4:1, 2.5:1 apart from the accent))
- [x] 13 Four motions from JS, reduced-motion path checked (fold motion only when the person opens it, not when a re-render restores an open fold)
- [x] 15 Font loading checked in the hub: Plex Sans and Condensed load standalone and in the hub frame (local serve); not changed
- [x] Every `id`, `data-*`, `data-state` still present; `tests/` green; `pdf.test.mjs` output identical (pdf.js untouched)
- [x] Light and dark, 390 / 1280px (and 320, 640 = 200% zoom), keyboard focus, AA contrast re-measured; 760px not shot separately
- [ ] Beside the sibling tools: still one family (tokens and fonts unchanged; not compared side by side with the catalogue, AI Act guide and Register in this pass)
