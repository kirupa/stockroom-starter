---
name: set-up-context-system
description: First-time setup for this context system. Use when someone has just copied the stockroom-starter, or asks to set up, configure, or move their work into the stockroom. Interviews them about their kinds of work, points the shelves at their files, and ends with a readiness checklist.
---

# Set up the context system

You're helping a person turn this starter into their own context system. Work in this order, and confirm each step with them before moving on.

## 1. Check the basics

1. Run `node --version`. stockroom needs 22.13 or newer.
2. If `node_modules` doesn't exist, run `npm install`.
3. Run `npm run setup`. It turns on the Git hooks and builds the index.
4. Call the stockroom's `list_source` MCP tool with no arguments. A list of shelves means the MCP server is connected. If you don't have a `list_source` tool at all, it isn't connected: tell the person which config their tool reads (`.vscode/mcp.json` for VS Code, `.mcp.json` for Claude Code, or the agent files in `.github/agents/` for GitHub Copilot CLI), and stop until it works. Running `npx stockroom ls` in a shell doesn't count, because it works without the server.

## 2. Ask about their work

Ask these one at a time, and wait for each answer. If the person gave you the answers up front, use them. If they aren't around to answer, pick the safest choice, never invent an answer, and list every open question in your final summary.

1. Which kinds of work should agents help with? The starter covers `web`, `slides`, and `illustration`. They can drop any of these or add others, like `email` or `docs`.
2. For each kind, where does the work live today? It might be a folder in this repository, a folder somewhere else on their machine, or nowhere yet. If it's somewhere else, ask whether this repository will become its new home, or whether it's a copy for agents to read.
3. Do they have written rules already, like a style guide, a brand guide, a design system, or a README? Ask for the paths or ask them to paste them in.
4. Where are their colors, fonts, and sizes defined? A CSS file, a design tool export, or nowhere?

## 3. Lay out the shelves

- If their work is already in a folder in this repository, change that shelf's `path` in `stockroom.json` instead of moving files.
- If it lives somewhere else, offer to copy it onto the matching shelf (`site`, `decks`, `figures`, or `icons`). Their real work replaces the starter's placeholder files on that shelf (on `site`, that's `index.html`, the two includes, and both stylesheets). Don't move or delete their originals.
- For a kind of work they don't want, take it out everywhere:
  1. Remove its shelf from `stockroom.json`, and remove it from every other shelf's `for` list (the `icons` shelf lists all three).
  2. Remove it from every `for:` line in `guidance/`. Delete any guidance file whose `for:` list is now empty.
  3. Delete its shelf folder and `examples/<kind>/`.
  4. Delete its station in `stations/`, and remove it from the list of kinds in `stations/review.md` and the shelf table in `AGENTS.md`.
  5. Run `npm run agents`.
- For a kind of work that isn't in the starter, use the `add-kind-of-work` skill.
- Copy their design tokens into `site/css/tokens.css` as CSS custom properties. Keep the names they already use. The starter rules mention the starter's token names. If the person is about to replace the rules with the `write-rules` skill, leave that to the next step. Otherwise, update the token names in `guidance/`, and `npm run doctor` will list any the rules still mention that don't exist.
- Never put secrets on a shelf. stockroom skips any file that looks like it contains one, and tells agents a person needs to look at it.

## 4. Check the result

1. Run `npm run check`. Anything it finds in their copied work is a real bug in their work, not a setup mistake. If this repository is the work's new home, fix the clear-cut bugs (like a link to a renamed image) and list them. If the shelf is a copy, list them instead, so the person can fix the original. Either way, list anything that needs a decision, like a missing font file.
2. Run `npm run doctor`, and show the person the checklist.
3. Point them at the next step. If the doctor says the starter rules are still in use, that's the `write-rules` skill. If examples are missing, that's the `add-example` skill.

## Don't

- Don't invent rules or examples to fill the checklist. Empty is honest. Invented rules are worse than none, because agents trust them.
- Don't delete or rewrite the person's original files.
