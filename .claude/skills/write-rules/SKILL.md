---
name: write-rules
description: Writes or rewrites the rules in guidance/ from a person's existing style guides, brand docs, design systems, feedback, or answers to questions. Use when someone asks to add rules, replace the starter rules, import a style guide, or turn feedback into a rule.
---

# Write rules

Rules live in `guidance/`, one Markdown file per topic. Agents read them one section at a time through `find_rules` and `read_source`, so the shape of each file matters as much as what it says.

## The shape every guidance file needs

```markdown
---
for: [web, slides]
summary: One sentence about what this file covers.
---

# Topic

One or two sentences on what these rules are for.

## One rule topic per heading

- Each bullet is one rule someone could check.
- Name the exact token, component, or file: "`--primary`", not "the brand blue".
```

- `for:` lists every kind of work the file applies to. A file without it applies to everything.
- Keep each section under about 30 lines. `npm run doctor` flags anything over 40. Split longer ones under smaller headings.
- Write headings an agent would search for, like "Callout arrows" or "Page structure", not "Misc" or "Other notes".
- Write rules as checkable statements. "Buttons say what happens next" can be checked. "Buttons should be nice" can't.

## How to work

1. Gather the source material: files the person points you at, text they paste, or their answers to your questions. A long style guide usually covers several topics. Split it into one guidance file per topic (voice, web pages, slides, illustrations, and so on), each with its own `for:` line. When the source points at another document ("see the arrows guide"), point at the guidance file that now holds it instead.
2. Use `find_rules` to see what already exists, so you change the right section instead of adding a second one.
3. Draft the rules. Only write what the source material actually says. When something is unclear or missing, don't fill it in. Collect it in a short list of open questions instead.
4. Show the person the draft and the open questions, and change what they correct. If they aren't around, save the draft and put the open questions in your final summary. Don't answer them yourself.
5. Save the files. If you replaced the starter rules, delete the `<!-- Starter rules. ... -->` comment at the top.
6. If a rule names a token, component, or file, confirm it exists with `find_symbol` or `list_source`.
7. Compare the rules with the approved examples (`find_examples` with `verdict: approved`). If an approved example breaks a new rule, don't pick a winner. Add it to the open questions.
8. Check whether any station in `stations/` names a heading you renamed or removed (`search_source` with `path: stations` and the old heading). Update the station, and run `npm run agents`.
9. Run `npm run check` and `npm run doctor`.

## Turning feedback into a rule

When a person rejects work and says why:

1. Find the section the feedback belongs in with `find_rules` and a topic.
2. Add the rule there in one line, in the person's own words where you can.
3. If a script could catch it (a color, a size, a missing attribute), say so, and suggest the check.
4. Use the `add-example` skill to save the rejected work with its reason.

## Don't

- Don't copy whole documents in unchanged. Break them into sections with headings.
- Don't invent rules the person never gave you.
