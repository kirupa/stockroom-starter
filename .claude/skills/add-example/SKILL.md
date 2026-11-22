---
name: add-example
description: Saves approved or rejected work as an example with the reason next to it, so agents can learn what good and bad look like. Use when someone approves or rejects a page, deck, or figure, or asks to add an example.
---

# Add an example

Examples live in `examples/<kind of work>/<approved or rejected>/`. Every example has a Markdown file with the same name next to it (a sidecar) that says why it was approved or rejected. Agents find them with `find_examples`.

## How to work

1. Ask which kind of work this is (`web`, `slides`, `illustration`, or another kind in `stockroom.json`) and whether it was approved or rejected, if the person hasn't said.
2. Ask why, in their words. The reason is the most important part of the example. Agents learn more from "the arrow starts at the caption's corner" than from the file itself.
3. Copy the work into the folder with a name that says what it is, like `examples/illustration/rejected/order-flow-v1.svg`. For a web page, save the HTML, or a screenshot plus the HTML.
4. Write the sidecar next to it:

   ```markdown
   ---
   verdict: rejected
   note: One or two sentences naming exactly what was wrong (or right).
   ---
   Who decided, when, and anything else worth remembering.
   ```

   If you don't know who decided or when, leave that line out instead of guessing.

5. Check it with `find_examples` for that kind of work. The new example and its note should be in the answer. (The MCP server picks up new files on its own. If you're using the command line, run `npm run build` first.) Agents read the `note:` plus everything below the front matter as the reason, so keep both about the work.
6. For an approval, check that the work follows the rules for its kind (`find_rules`). If it breaks one, ask the person which is right, the rule or the example. Don't change either yourself.
7. For a rejection, check whether the reason is already a rule (`find_rules` with a topic from the reason). If it is, name the rule in the sidecar, like "Breaks Arrows > Callout arrows." If it isn't, ask whether it should become one, and use the `write-rules` skill if so.
8. If the work is finished and should be reused, like a figure that's live on a page, also put a copy on its shelf (`figures/`, `decks/`, or `site/`), and fix any relative links in that copy so they point at the shelves.
9. Run `npm run doctor`, and commit.

## Good examples

- Keep both sides. One approved and one rejected example of the same thing teaches more than three approved ones.
- Save the real work, not a recreation of it. It's fine if an example links to files that aren't on the shelves, like icons from an older version. The stockroom's checks skip broken links inside examples, because examples are a record of past work.
- Keep each note specific. "Off brand" doesn't help an agent. "Uses #3b82f6, which isn't in the palette" does.
