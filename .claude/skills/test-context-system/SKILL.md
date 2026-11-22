---
name: test-context-system
description: Tests whether the context system is ready, by running the checks and then trying each kind of work the way an agent would. Use when someone asks to test, verify, or audit the context system, or after setup or a big change to the rules.
---

# Test the context system

A context system is ready when an agent asking its usual questions gets back small, correct, current answers for every kind of work. Test it in three passes, and finish with a scorecard.

The stockroom tools below are the MCP tools (`find_rules`, `read_source`, and so on). If you only have a shell, `npx --no-install stockroom help` lists the matching commands.

## Pass 1: the checks

1. Run `npm run check`. Every problem it reports is a real mistake: a broken reference, a name used but never defined, an off-palette figure color, or agent files out of date.
2. Run `npm run doctor`. The kinds of work it lists are the ones to test in Pass 2. The doctor looks for gaps, not mistakes, so a kind can be all `[x]` in the doctor and still have problems from `npm run check`. Those count against the checks column on the scorecard. For each kind, every `[ ]` is something missing and every `[~]` is something to improve. A kind with any `[ ]` is not ready, whatever Pass 2 finds.

## Pass 2: ask the questions an agent asks

For each kind of work the doctor listed:

1. Call `find_rules` with that kind in `for`. Check that every heading names one topic, and that nothing in the list belongs to a different kind of work. (The doctor already flags two files with the same heading. Look for subtler overlaps too, like two sections that answer the same question in different words.)
2. Call `read_source` with `section` on the three sections an agent for this kind would need most. Each one should be short enough to read in one go, and every rule in it should be something you could check.
3. Call `find_examples` for that kind, then again with `verdict: approved` and `verdict: rejected`. There should be at least one of each, and every note should say exactly what was right or wrong. The doctor counts them, but only you can judge whether a note is useful.
4. For `web`, call `who_references` on each file in `site/includes` and on each stylesheet. Every page on the `site` shelf should be in each list. A page that's missing doesn't use that file. Then call `follow_references` on two pages and check that nothing comes back `MISSING`.

Then check that the stockroom notices changes:

1. Commit or stash any work in progress first. Then pick a page or rule file on a shelf, and change one word. Remember the old word and the new word.
2. Call `search_source` for the new word, and then for the old word.
3. If your stockroom tools come from the MCP server in this repository's configs, which run `serve --watch`, the new word should be found and the old word should be gone. If you're using the command line instead, the answer should refuse and name the changed file. When the index is stale, every tool refuses, even for files that didn't change, so nobody gets a mix of old and new answers.
4. Undo the change by changing the word back, then confirm `git status` shows no changes. Don't leave a backup copy on a shelf, because the stockroom will catalog it.

## Pass 3: a trial run

Ask the person to pick one small, real task for each kind of work, like "fix this typo," "draft a three-slide deck about X," or "sketch a figure of X." Run each one with its agent from `stations/`, and then audit what the agent did:

- Did it start with `find_rules` and `find_examples`?
- Did it read sections and line ranges instead of whole files?
- Did it use token names instead of raw values?
- Did it run `npm run check` before finishing?
- Does the result follow the rules? Use the `review` agent to check.

Anything an agent got wrong because a rule was missing or unclear goes to the `write-rules` skill. Anything it got wrong despite a clear rule goes into its station in `stations/`, followed by `npm run agents`.

If the person wants to skip this pass, mark it as skipped on the scorecard rather than ready.

## The scorecard

Finish with a table that has one row per kind of work and these columns: checks, rules, examples, and trial run. Mark each cell **ready**, **not ready**, or **skipped**, and end the row with the one next step that would help most.

- The checks column is ready only when `npm run check` reports nothing for that kind's shelves.
- A kind is never ready while its shelf is empty, even if every check passes. Passing checks on an empty shelf only means there's nothing to break yet.
- Examples aren't ready without at least one approved and one rejected example, each with a useful note.
- Rules aren't ready while the doctor still shows the starter rules for that kind.
