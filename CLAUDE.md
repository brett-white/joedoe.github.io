# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static marketing site for JoeDoe (a corporate stipend/spend-management fintech product). Plain HTML/CSS, no build step, no framework, no package manager. Intended to be served as-is via GitHub Pages (the repo is named `joedoe.github.io`).

## Commands

There is no build, lint, or test tooling in this repo — it's static HTML/CSS served directly.

To preview locally, serve the directory root with any static file server, e.g.:

```
python3 -m http.server 8080
```

Then open `http://localhost:8080/index.html` or `http://localhost:8080/partners/`.

There are no automated tests. Verify changes by opening the page in a browser and checking that internal anchors (`href="#section-id"`) still resolve to an existing `id` on the target page, and that asset paths under `assets/` are correct.

## Architecture

- `index.html` — the product-facing homepage (problem/solution narrative, how the Never-Decline Engine works, pricing, security).
- `partners/index.html` — a separate page for the partners/investors audience (BaaS & rails partners, HRIS integrators, strategic investors; market sizing; roadmap).
- `styles.css` — single shared stylesheet for both pages.
- `assets/` — brand SVGs (icon, stacked logo, stacked wordmark, wide wordmark).

There is no templating layer: the header nav and footer markup are duplicated by hand in both HTML files, including an inline copy of the wordmark SVG in each (rather than referencing the file in `assets/`). When editing the logo, nav links, or footer, update both `index.html` and `partners/index.html` to keep them in sync. Note `partners/index.html` sits one directory deeper, so its relative asset paths (`styles.css`, `assets/`, `wink-icon.js`, etc.) are prefixed with `../` where `index.html`'s are not. Links to whole pages (the homepage, the partners page) use root-absolute paths (`/`, `/partners/`) instead, so they resolve the same from either file and never expose `index.html` in the URL.

### Brand system (`styles.css`)

CSS custom properties defined on `:root` are the source of truth for brand color — each color has one deliberate job, don't hardcode hex values in new markup, use the variables:

- `--brand-indigo` (#4F46E5) — product / primary actions: buttons, links, the Solution & How It Works sections.
- `--brand-rose-*` (#F43F5E soft / #E11D48 text) — attention: the Problem section, the gradient CTA banner. Two variants exist because the soft value fails WCAG AA at small text sizes; use `-text` for any small/body text and `-soft` only for large decorative use (36px+, gradients).
- `--brand-yellow` (#FFD028) — reserved for the JoeDoe card artwork and the "Most Popular" pricing badge only, not general decoration.
- `--brand-teal-*` (#0D9488 soft / #0F766E text) — data & metrics only: the comparison table's JoeDoe column, TAM/SAM/SOM stat cards. Same soft/text split as rose, for the same contrast reason.
- `--navy-900` / `--navy-800` — the dark security section and footer.

Fonts are Outfit (`--font-display`, headings), Inter (`--font-body`, copy), and JetBrains Mono (`--font-mono`, eyebrow labels/tags) — loaded from Google Fonts in the `<head>` of each page (not self-hosted). See [STYLE-GUIDE.md](STYLE-GUIDE.md) for the full contrast audit and rationale behind each color's scope.

The animated mascot (hero card, both pages) renders via `wink-icon.js` against the Rive runtime and `assets/joedoe-wink.riv` — not a static image. It's positioned with `.wink-icon--card` inside the ring frame drawn into the card SVG. When editing the hero card markup, keep the ring frame's inner-circle geometry (center/radius in the SVG) in sync with `.wink-icon--card`'s left/top/width/height percentages in `styles.css`, or the animation will drift out of the frame.

### Navigation model

Both pages share one nav structure but link to each other for cross-page sections, e.g. `partners/index.html` links back to `/#pricing`. When renaming or removing a section `id` in one file, check the other file for cross-page anchor links pointing at it (`grep -rn 'href="/#' partners/index.html` / `grep -rn 'href="partners/' index.html`).
