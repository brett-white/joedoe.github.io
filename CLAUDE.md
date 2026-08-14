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

There is no templating layer: the header nav and footer markup are duplicated by hand in both HTML files, including an inline copy of the wordmark SVG in each (rather than referencing the file in `assets/`). When editing the logo, nav links, or footer, update both `index.html` and `partners/index.html` to keep them in sync. Note `partners/index.html` sits one directory deeper, so its relative asset/link paths (`styles.css`, `assets/`, `../index.html`, etc.) are prefixed with `../` where `index.html`'s are not.

### Brand system (`styles.css`)

CSS custom properties defined on `:root` are the source of truth for brand color — `--navy` (#000066) and `--yellow` (#ffee66) are the two-color semantic system (navy = employer spend, yellow = personal spend); don't hardcode hex values in new markup, use the variables. Font is Roboto, loaded from Google Fonts in the `<head>` of each page (not self-hosted).

### Navigation model

Both pages share one nav structure but link to each other for cross-page sections, e.g. `partners/index.html` links back to `../index.html#pricing`. When renaming or removing a section `id` in one file, check the other file for cross-page anchor links pointing at it (`grep -rn 'href="\.\./index.html#' partners/index.html` / `grep -rn 'href="partners/' index.html`).
