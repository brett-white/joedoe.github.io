# JoeDoe — Reskin Style Guide

This build reskins the live joedoe.co copy with the new visual system from the Figma redesign (`JoeDoe-Website`, frames `joedoe-home-redesign` and `joedoe-partners-redesign`). All copy is pulled from the current live site, not the Figma AI draft.

## Files

- `index.html` — Home page
- `partners/index.html` — Partners & Investors page
- `styles.css` — shared design tokens + components (read this first — every color decision below is a CSS custom property with a comment explaining its use)

## Color system: what changed and why

The Figma file had one registered variable (`JoeDoe Yellow: #FFEE66`, unused in the actual layers) and otherwise applied raw hex values ad hoc. Pulling every hex out of the generated code surfaced two problems worth fixing rather than reproducing:

**1. Six accent colors were in rotation with no clear meaning** — indigo, rose, yellow, teal, and amber all appeared as eyebrow-label/badge/icon colors, seemingly picked per-section rather than by rule. This build cuts it to a deliberate four, each with one job:

| Color | Hex | Reserved for |
|---|---|---|
| Indigo | `#4F46E5` | Product / primary actions — buttons, links, Solution & How It Works sections |
| Rose | `#F43F5E` (decorative) / `#E11D48` (text) | Attention — Problem section, gradient CTA |
| Yellow | `#FFD028` | The JoeDoe card itself + "Most Popular" badge only — signature color, not general decoration |
| Teal | `#0D9488` (decorative) / `#0F766E` (text) | Data & metrics only — the comparison table's JoeDoe column, TAM/SAM/SOM stat cards |

Amber (`#F59E0B`, used once for the roadmap's "Post-Seed" tag) is cut entirely. The roadmap shows status through fill (solid indigo dot = "Now," outline = future) instead of a fourth arbitrary hue — same information, one fewer color to explain.

**2. Several combinations failed WCAG AA contrast** — verified with a computed contrast check, then confirmed with an automated `axe-core` audit (both pages: **0 violations** against WCAG 2 A/AA):

| Usage | Original | Ratio | Fix | New ratio |
|---|---|---|---|---|
| Small eyebrow labels (11px) | Rose `#F43F5E` on white | 3.67:1 (fail) | `#E11D48` on white | 4.70:1 |
| "JoeDoe" column header | Teal `#0D9488` on white | 3.74:1 (fail) | `#0F766E` on white | 5.47:1 |
| Roadmap "Post-Seed" tag | Amber `#F59E0B` on white | 2.15:1 (fail) | Cut — see above | — |
| Footnotes/captions | `#94A3B8` on white | 2.56:1 (fail) | `#5B6B82` on white | 5.43:1 |
| Comparison table header (2 cols) | `#64748B` on `#F4F4F6` | 4.33:1 (fail) | `#475569` | 6.90:1 |
| Footer column labels + copyright | `#64748B` on navy `#0B0F19` | 4.02:1 (fail) | `#94A3B8` | 7.47:1 |

The large decorative uses of rose and teal (36–44px numerals, gradients) were already fine at their size (WCAG allows 3:1 for large text) and are untouched — only the small-text and failing combinations changed.

## Copy: reconciled against the live site

Figma's AI pass drifted from the real copy in a few places. Everywhere it did, this build uses the verbatim live-site text instead:

- Footer legal line: live site is `© 2026 JoeDoe. Patent pending.` — the Figma draft had `Please pending.`
- Hero tag: live site shows `Now in Closed Beta · Patent Pending` — the draft invented `HOW JD IS CLOSING THE GAP`
- Card caption: live site is `Issued as a virtual card — add it to Apple Wallet or Google Wallet in seconds.` — the draft had an unrelated, slightly garbled line
- Three-step section: live copy is `Employee Taps / JoeDoe Decides / One Clean Approval` and closes with `Agentic Finance: JoeDoe is not a card wrapper — it's an intelligent decision engine built to never say no.` — the draft substituted different labels and a different closing line
- Comparison table row/column labels (`Transaction`, `Administration`, `User privacy`) and cell values (`Never declines`, `Zero (automated)`, `High (privacy protected)`) — the draft paraphrased these
- Security section: live copy specifies `AES-256 + TLS 1.2+`, not `1.3+`
- Footer "Company" column: live site lists only Partners & Investors and Contact — the draft added an invented "Careers" link, which is removed here
- Market Opportunity footnote citations on the Partners page are reproduced as they appear live (`Straits Research, 2024`; `SBA, 2025`; `ezCater, 2024`; `Compt Benchmark, 2024`) rather than the different citation text in the draft

## Assets

**Card artwork and logo are the real exported vectors from the Figma file**, not recreations. The Figma CDN's asset URLs aren't reachable directly, so these were pulled via the Figma plugin API (`node.exportAsync({format: "SVG"})`) against the specific nodes and inlined directly:

- **Logo** (nav + footer, both pages) — node `5:39` in the `JoeDoe Brand` library, the `joedoe-logo-wide` component. Inlined as `<svg class="logo-mark">`, colored via CSS `currentColor`. Confirmed identical (same path geometry, different export scale) to the wordmark already checked into `assets/joedoe-wordmark-wide.svg`.
- **Hero card** (both pages) — node `11:58`, `card-stack`. The JoeDoe wordmark, the contactless/wifi glyph, the masked card number, the back-card shadow, and the ring frame are the original vector paths.

**The mascot animation is the site's existing Rive asset, not the Figma export's static keyframes.** The Figma file's `joedoe-icon-animation` node (`5:161`) ships a hand-authored CSS blink loop reconstructed from Figma's motion data — but this repo already has a real, actively-maintained animation (`assets/joedoe-wink.riv`, played back via `wink-icon.js` and the Rive canvas runtime), so the card SVG here keeps the Figma ring frame but omits the eye/mouth paths, and `.wink-icon--card` in `styles.css` positions the live Rive canvas inside that ring instead. The Rive character's own colors are baked into the `.riv` file and aren't recolored by this palette change — only the white plate behind it is CSS.

Icons elsewhere on the page (problem/solution cards, security, comparison-table checkmarks, etc.) are a hand-built inline sprite, since those aren't backed by a single exportable node the way the logo and card are — same intent, but recreated rather than pulled 1:1.

The Partners & Investors hero uses the same card + Rive mascot as Home (matching this repo's existing hero-card treatment on both pages) rather than a separate rails/HRIS/capital diagram.

## What's still open

- Mobile nav is a working dropdown (tap the menu icon under 900px), but hasn't been checked against any different real breakpoints if you have them.
- "Talk to sales" as the pricing CTA is carried over as-is from the live site — it may read mismatched against a $5–$12 self-serve price if you want to revisit it.
- CTAs currently point to `#waitlist` / `mailto:hello@joedoe.co` / `mailto:partners@joedoe.co`, matching the live site's current behavior — wire these to a real signup flow when this goes further than review.
