# Working in this repository

This repository is a **Context Environment**: everything agents need to build and fix the website, make slide decks, and draw figures that look like they came from the same team. It's cataloged by [stockroom](https://github.com/kirupa/stockroom), a small context system that agents ask through an MCP server named `stockroom`.

## The shelves

| Shelf | What's on it | Kind of work |
|---|---|---|
| `site` | The website: pages, includes, styles, scripts, and design tokens in `site/css/tokens.css` | `web` |
| `decks` | Slide decks as Markdown | `slides` |
| `figures` | Finished SVG figures | `illustration` |
| `icons` | Icons shared by everything | `web`, `slides`, `illustration` |
| `guidance` | The rules, one Markdown file per topic, split into sections | each file says |
| `examples` | Approved and rejected work, with the reason in a Markdown file of the same name | by folder |

## Ask the stockroom before you read

- Ask small, precise questions instead of reading whole files. `search_source` finds text, `find_symbol` finds where a class, id, token, function, or color is defined and used, and `read_source` reads a few lines or one guidance section.
- Start creative work with `find_rules` and `find_examples` for that kind of work.
- Run `who_references` before changing anything shared.
- Use the values the stockroom gives you, like token names, paths, and line numbers. Don't guess them.
- Keep the `sha256` from `read_source`. Run `npx stockroom verify <path> <sha256>` before editing a file you read a while ago.
- If the stockroom says something isn't in the index, say so instead of guessing.

## Skills

The skills in `.claude/skills/` walk a person through building this context system: `set-up-context-system`, `write-rules`, `add-example`, `test-context-system`, and `add-kind-of-work`. `npm run doctor` lists what's missing for each kind of work and names the skill that fixes it.

## Before you finish

Run `npm run check`. It rebuilds the index, fails on broken references, names that are used but never defined, and figure colors outside the palette, and checks that the generated agent files match `stations/`.

## Agents

There's one agent for each kind of work: `fix-web`, `build-page`, `make-deck`, `draw-figure`, and `review`. Their instructions live in `stations/`. The files in `.github/agents/` and `.claude/agents/` are generated from them by `npm run agents`, so edit `stations/` instead.

## When a person rejects something

Every critique should become a rule:

1. Save the rejected work in `examples/<kind of work>/rejected/`, with a Markdown file of the same name whose front matter has `verdict: rejected` and a `note:` saying why.
2. Add or update the rule in the matching `guidance/` file, under a heading that names it.
3. If a script could catch it, add a check.
