---
for: [slides]
summary: How our slide decks are structured, written, and styled.
---

# Slide decks

<!-- Starter rules. Replace them with how your team actually presents. -->

Decks are for talking, not reading. If a slide makes sense without the speaker, it probably wanted to be an email.

## File format

- A deck is one Markdown file on the `decks` shelf, named for its topic, like `decks/q3-launch.md`.
- Front matter has a one-line `summary` of who the deck is for.
- Slides are separated by a line with only `---` on it.
- Speaker notes go in an HTML comment at the end of each slide: `<!-- what to say -->`. Tools like Marp show these as presenter notes.

## Structure

- Open with the one thing the audience should remember.
- One idea per slide. If a slide title needs the word "and," it's probably two slides.
- End with what happens next, not "Questions?"
- Most decks are 8 to 15 slides.

## Punch slides

- A punch slide is one short sentence, set large, with nothing else on the slide.
- Size the text so the sentence fills the slide in two or three evenly filled lines. Never leave a short word alone on its own line.

## Bullet slides

- Three bullets at most, each one line long.
- Bullets are phrases, and they start with the important word.

## Type and color

- Titles use `--font-display` in `--heading`. Body text uses `--font-body` in `--ink` on `--surface`.
- Use `--primary` for one thing per slide, the thing you're pointing at.
- Dark decks use the dark theme values from the tokens, never a separate palette.

## Images on slides

- Use a figure from the `figures` shelf before asking for a new one.
- A figure gets the whole slide. Don't shrink it to fit next to bullets.
