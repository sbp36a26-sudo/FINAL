---
name: llm-council
description: >
  Run an "LLM Council" on a decision: five advisors (Contrarian, Assumption-Ripper, Expansionist,
  Outsider, Executor) each answer, then review each other's answers blind, then a Chairman gives one
  final verdict with clear next steps. Use when the user says "run an LLM council", "council this",
  "/llm-council", or asks to stress-test a decision, plan, choice or idea from several angles.
argument-hint: "[the decision or question]"
---

# LLM Council

Run a council on the decision the user gives (the skill's arguments, or the question in their message). If no decision is given, ask for it in one line and stop.

## Before starting

Gather the context the advisors need: the decision itself, the options on the table, constraints (time, money, people, rules), and anything already decided. Pull it from the conversation and, where relevant, the project files (for this repo: `docs/PROJECT_CONTEXT.md`, `CLAUDE.md`, the `reports/` folder). Do not invent facts. If something material is unknown, list it as an open question rather than guessing.

Write the context into a short brief (under 200 words). Every advisor gets the same brief.

## Step 1: Five advisors answer

Each advisor answers independently, staying strictly in role. Run them as five parallel subagents when the decision is substantial; for a small decision, write the five answers yourself one after the other without letting a later one reuse an earlier one's points.

1. **Contrarian:** only what will fail. Failure modes, weak points, what goes wrong first, how bad it gets.
2. **Assumption-Ripper:** names every assumption the user is making (stated or hidden) and challenges each: is it true, how do we know, what if it is false?
3. **Expansionist:** the upside being missed. Bigger versions of the idea, second uses, opportunities next to it, what success could unlock.
4. **Outsider:** knows nothing about the user's industry. Asks the obvious, naive questions an insider no longer asks, and points out jargon or logic that would not make sense to a newcomer.
5. **Executor:** only cares about what to do Monday morning. Concrete first steps, owners, order, what to stop doing. No theory.

Each answer: at most 250 words, plain language, ending with that advisor's single most important point in one sentence.

## Step 2: Blind peer review

Strip the names. Label the five answers A to E in a shuffled order (not the order above), so reviewers judge ideas, not roles.

Each advisor then reviews the four answers that are not its own, still in its own role:
- the strongest point in the other answers, and why;
- the weakest or most wrong point, and why;
- anything all of them missed.

At most 150 words per review. Run as parallel subagents when Step 1 did; pass each one only the anonymised answers A–E, never the role names.

## Step 3: Chairman's verdict

A Chairman (you, or one more subagent given everything above) reads all answers and all reviews and writes:

1. **Verdict:** go / go with changes / wait / no-go, in one sentence, with the reason.
2. **Where the council agreed:** the points several advisors or reviewers backed.
3. **Where it disagreed, and the ruling:** each real disagreement, which side wins and why.
4. **Risks to watch:** the top three, each with the early warning sign.
5. **Next steps:** numbered, concrete, with who and by when where known. Start with what to do Monday morning.
6. **Open questions:** what is still unknown and would change the verdict.

## Output to the user

Show the Chairman's verdict first. Then, collapsed or short, the five advisors' one-line key points and the two or three most useful review comments. Do not paste every answer in full unless the user asks. Keep the user's own working rules (for this project: sources next to every figure, plain words, no filler).

If the user asks for it to be kept, save the full council (brief, answers, reviews, verdict) to `reports/Council - <short title>.md`.
