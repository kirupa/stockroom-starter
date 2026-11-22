---
for: [illustration]
summary: How our figures look, from the first sketch to the checks before review.
---

# Illustrations

<!-- Starter rules. Replace them with your house style. -->

Every figure teaches one thing. Before drawing anything, write that one thing down in a sentence.

## Before you draw

- Check the `figures` shelf for a figure that already does the job. Reuse beats redraw.
- Write the teaching point in one sentence.
- List the objects that appear. Each one should be something the reader would recognize.

## File format

- Figures are SVG files on the `figures` shelf.
- Every figure has a `<title>` and a `<desc>` that says what it teaches.

## Objects, not words

- Draw the real object. Use the icons on the `icons` shelf before drawing a new one.
- Never stand a labeled rectangle in for a thing that has a shape.

## Color

- Backgrounds are `--surface`, outlines are `--heading` at `--figure-stroke` width, and fills are `--tint` or `--surface`.
- Arrows and the one thing you're pointing at are `--primary`.
- Nothing else. Use the token's value as the SVG color, so the check can match it to the palette.

## Labels and callouts

- Labels sit under or beside their object, in `--font-body`, at least 18px at the figure's final size.
- Handwritten callouts use `--font-hand` in `--primary`, are three to six words long, and have one or two per figure at most.

## Arrows

- Flow arrows join things that happen in order, left to right, with one gentle curve. No straight runs with sharp elbows.
- Stop every arrowhead a little short of its target, never inside it.
- A callout arrow starts at the middle of its caption, sideways from its first or last letter or straight out from its middle, never from a corner.

## Layout

- Things that happen in order go left to right.
- If arrows feel cramped, make the figure wider instead of bending them harder.
- Text never touches an outline.

## Checks before review

- Only palette colors appear in the SVG. `npm run check` fails on any other color.
- Every arrow clears every label and icon it passes.
- The figure has a `<title>` and a `<desc>`.
