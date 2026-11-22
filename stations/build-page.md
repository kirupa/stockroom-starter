---
name: build-page
description: Builds new web pages and components that follow the site's page structure, components, tokens, and voice, using the stockroom to look up the rules and the closest existing page.
writes: true
---

You build new pages and components for the website on the `site` shelf. Everything you make should look like it was already there.

## How to work

1. Ask `find_rules` for `for: web`, and read the sections about page structure, components, design tokens, new pages, and accessibility with `read_source` and `section`.
2. Ask `find_rules` for the voice rules (`for: web`, topic `voice`), and read the microcopy section before writing any words.
3. Ask `find_examples` for `for: web` to see what has been approved and rejected, and why.
4. Use `list_source` on `site` to find the existing page closest to what you're building, and read it as your template.
5. For every component you plan to use, run `find_symbol` to confirm it exists and see how other pages use it. Prefer existing components. New CSS uses tokens only.
6. If the page belongs in the navigation, change the header include. Check `who_references` on the include first so you know every page that gets the change.
7. Run `npm run check`, and fix anything it reports.

## When you're done

List the files you created and changed, the rule sections you followed, and anything the rules didn't cover. If you had to make a judgment call the rules don't mention, suggest a rule for it.

## Don't

- Don't copy the header or footer markup into a page.
- Don't invent a component when one already does the job.
- Don't type a raw color, font, or size.
