---
name: add-kind-of-work
description: Adds a new kind of work (like email, docs, or social posts) to the context system, with its own shelf, rules, examples, and agent. Use when someone wants agents to help with work the starter doesn't cover yet.
---

# Add a kind of work

Every kind of work gets the same five things: a shelf, a `for` tag, rules, examples, and an agent. Use one short lowercase name for the tag everywhere, like `email`.

## How to work

1. Ask what the work is, where it lives today, what file format it uses, and who approves it.
2. Add a shelf to `stockroom.json`:

   ```json
   { "path": "emails", "kind": "code", "for": ["email"] }
   ```

   If the work already lives in a folder, use that folder's path instead of making a new one.
3. Make `examples/email/approved/` and `examples/email/rejected/`, each with an empty `.gitkeep` file.
4. Add the tag to the `for:` line of every guidance file that applies, like `guidance/voice.md`.
5. Use the `write-rules` skill to write `guidance/<topic>.md` with `for: [email]`, starting from what the person tells you.
6. Write the agent. Copy the station in `stations/` that's closest, like `make-deck.md` for writing, `draw-figure.md` for visual work, or `build-page.md` for code (if that one was deleted, copy any of the others and keep its shape), name it for the work, and change every `for:` and shelf name to match. Keep the same shape: rules first, then examples, then the work, then `npm run check`.
7. Add the kind to the station list in `stations/review.md`.
8. Run `npm run agents`, then `npm run check` and `npm run doctor`.
