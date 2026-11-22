# stockroom-starter

A starting point for your own context system. Clone it, put your work on the shelves, write down your rules, and your agents can build and fix your website, make slide decks, and draw figures that all look like they came from the same team.

It's built on [stockroom](https://github.com/kirupa/stockroom), and it goes with the kirupa.com article [Building Your Own Context System](https://www.kirupa.com/ai_fundamentals/building_your_own_context_system.htm), which explains how every piece works and why.

## What's inside

| Path | What it is |
|---|---|
| `stockroom.json` | The shelves, and the kind of work each one is for |
| `site/`, `decks/`, `figures/`, `icons/` | Empty shelves for your work, plus a tiny starter page and a set of design tokens |
| `guidance/` | Starter rules for voice, web pages, slide decks, and illustrations, written in small sections agents can read one at a time |
| `examples/` | Folders for approved and rejected web pages, slides, and figures |
| `stations/` | Instructions for five agents: `fix-web`, `build-page`, `make-deck`, `draw-figure`, and `review` |
| `.github/agents/`, `.claude/agents/` | Those five agents for GitHub Copilot and Claude Code, generated from `stations/` |
| `.vscode/mcp.json`, `.mcp.json` | The stockroom MCP server for VS Code and Claude Code |
| `.githooks/` | Rebuild the index after every pull, merge, checkout, and rebase |
| `.github/workflows/` | A check on every pull request, and setup steps for Copilot cloud agent |
| `AGENTS.md`, `CLAUDE.md` | How any agent should work in this repository |

## Get started

You need Node.js 22.13 or newer. Click **Use this template** on GitHub, or:

```bash
gh repo create my-context --template kirupa/stockroom-starter --private --clone
cd my-context
npm install
npm run setup
npm run check
```

`npm run setup` turns on the Git hooks and builds the index for the first time. `npm run check` rebuilds the index and fails if it finds a broken reference, a class, id, or token that's used but never defined, a figure color outside the palette, or agent files that don't match `stations/`. On a fresh copy, it should say "No problems found."

## Fill the shelves

The order matters more than you'd think:

1. **Write your rules first.** Replace the starter rules in `guidance/` with how your team actually works. Keep one topic per heading, because agents read one section at a time. The `for:` line at the top of each file says which kinds of work it applies to.
2. **Add your design tokens.** Put your real colors, fonts, and sizes in `site/css/tokens.css`. The web pages, decks, and figures all use these, and the figure check compares SVG colors against their values.
3. **Add examples with their reasons.** Put approved and rejected work in `examples/<web|slides|illustration>/<approved|rejected>/`. Next to each one, add a Markdown file with the same name:

   ```markdown
   ---
   verdict: rejected
   note: The callout arrow starts from the corner of its caption, and the boxes stand in for real objects.
   ---
   Sent back on November 3. Both problems are now rules in guidance/illustrations.md.
   ```

4. **Move your work in.** Put your site in `site/`, your decks in `decks/`, your figures in `figures/`, and your icons in `icons/`. If your work already lives somewhere else, change the `path` of each shelf in `stockroom.json` instead.
5. **Run `npm run check`.** Fix what it finds, or decide it's fine and leave it for later.

## Connect your agent

The stockroom runs as an MCP server with `npx stockroom serve --watch`. With `--watch`, the server builds the index itself and keeps it current while you work.

- **VS Code with GitHub Copilot:** open the folder. VS Code reads `.vscode/mcp.json`, and the agents in `.github/agents/` appear in the agents dropdown in Copilot Chat.
- **GitHub Copilot CLI:** run `copilot` in the folder and pick an agent with `/agent`. Each agent file starts the stockroom server on its own.
- **Copilot cloud agent:** assign an issue to Copilot and choose an agent. `.github/workflows/copilot-setup-steps.yml` installs stockroom and builds the index before Copilot starts.
- **Claude Code:** run `claude` in the folder and approve the `stockroom` server from `.mcp.json`. The agents in `.claude/agents/` are available right away.
- **Anything else that speaks MCP:** run `npx stockroom serve --watch` from this folder.

## Use the agents

Ask for an agent by name, or describe the work and let your tool pick one:

| Agent | Try asking |
|---|---|
| `fix-web` | "The logo on the About page is broken. Fix it." |
| `build-page` | "Add a Pricing page with three plans and link it from the navigation." |
| `make-deck` | "Make a 10-slide deck introducing our new onboarding flow to the sales team." |
| `draw-figure` | "Draw a figure that shows how a support ticket goes from the inbox to a fix." |
| `review` | "Review the figure in figures/ticket-flow.svg." |

Every agent starts by asking the stockroom for the rules and examples for its kind of work, reads only the sections it needs, and runs `npm run check` before it finishes.

## Change an agent

Edit its file in `stations/` and run `npm run agents`. That regenerates the Copilot and Claude Code versions, so the two never drift apart. CI fails if you forget.

## Add a new kind of work

Say you want agents to write release emails too:

1. Add a shelf to `stockroom.json`: `{ "path": "emails", "kind": "code", "for": ["email"] }`.
2. Add `guidance/emails.md` with `for: [email]` at the top, and add `email` to the `for:` line in `guidance/voice.md`.
3. Make `examples/email/approved/` and `examples/email/rejected/`.
4. Copy a station, like `stations/make-deck.md`, to `stations/write-email.md`, and change it to ask for `for: email`.
5. Run `npm run agents` and `npm run check`.

## Keep it current

An out-of-date index is worse than none, because agents trust it. This repository keeps it current in four places:

- `stockroom serve --watch` rebuilds when a file changes, and rebuilds on the spot if a question arrives first.
- The Git hooks rebuild after every pull, merge, checkout, and rebase.
- Every tool call checks the shelves first, and refuses to answer from an index that doesn't match them.
- CI runs `npm run check` on every pull request.

## When a person rejects something

Turn the critique into a rule, so no agent makes that mistake again. Save the rejected work in `examples/` with its reason, add the rule to the right `guidance/` file under a heading that names it, and, if a script could catch it, add a check. The `review` agent suggests the wording when it notices feedback that no rule covers yet.

## License

MIT. Replace this README with your own once you've made the repository yours.
