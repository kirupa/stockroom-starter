---
for: [web]
summary: How pages are built, which components exist, and what every new page and fix has to pass.
---

# Building pages

<!-- Starter rules. Replace them with how your site actually works. -->

Pages live on the `site` shelf. Shared pieces live in `site/includes`, and every color, font, and size comes from `site/css/tokens.css`.

## Page structure

1. `<!DOCTYPE html>`, `lang="en"`, and a viewport meta tag.
2. A `<title>` written as "Page name | Site name" and a one-sentence meta description.
3. `/css/tokens.css` first, then `/css/site.css`.
4. A `.page` wrapper that holds the header include, a single `<main id="main">`, and the footer include.

Never copy the header or footer markup into a page. Change the include, and every page gets it.

## Components

Use the components that already exist before writing new CSS:

- `.button` is the main action on a screen.
- `.card` holds one item in a list or grid.
- `.site-nav` is the main navigation in the header include.

State classes start with `is-`, like `is-open`. JavaScript adds and removes them. Never style a state with an inline style.

## Design tokens

- Text is `--ink`, secondary text is `--muted`, and headings are `--heading`.
- The background is `--surface`.
- The one accent is `--primary`, with `--primary-ink` for text on top of it.
- Spacing is a multiple of `--space`.

If no token fits, ask before adding one, because the decks and figures use the same tokens.

## New pages

A new page needs all of these before it ships:

- The page structure above.
- A link from the header include if it belongs in the main navigation.
- Copy that follows the voice rules.
- Every image has `width`, `height`, and alt text.
- It works in both themes and at 320px wide without sideways scrolling.

## Fixing bugs

Find out how many pages a problem touches before changing anything:

- For a broken image, check which pages reference the file, and whether it was renamed.
- For a style that isn't applying, check that the class is defined and spelled the same way everywhere.
- For anything in an include, remember the change lands on every page.

Change the smallest thing that fixes it.

## Accessibility

- Every page has exactly one `<h1>`.
- Focus is always visible. Don't remove the focus ring.
- Every control has a label, and status messages use `role="status"`.
