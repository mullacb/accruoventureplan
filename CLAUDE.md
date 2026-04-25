# Accruo Venture Pitch — repo guide

Static HTML deck for the IVC (INSEAD Venture Competition) Round 2 pitch. Per-page slide files share one design system; a combined view stitches them into a live deck.

## Layout

```
.
├── slides/
│   ├── _design-system.css       ← shared tokens, chrome, .ttbl, .ttbl-bar, .moment-grid, .stat-big-r,
│   │                              .fq-breakout, .acq-signal, mockup CSS (.app, .phone, etc), bio-card
│   ├── _reload.js                ← auto-reload script (linked from every slide)
│   ├── 01-problem.html           ← page 1 · "1.1 The Problem"
│   ├── 02-why-now-market.html    ← page 2 · "1.2 Why now" + "1.3 Market"
│   ├── 03-solution-overview.html ← page 3 · "2.1 What Accruo does"
│   ├── 04-solution-hr.html       ← page 4 · "2.2 For HR teams"
│   ├── 05-solution-individuals.html  ← page 5 · "2.3 For individuals"
│   ├── 06-solution-five-year.html    ← page 6 · "2.4 The five-year product"
│   ├── 07-solution-regulatory.html   ← page 7 · "2.5 Regulatory architecture"
│   ├── 08-solution-competition.html  ← page 8 · "2.6 Competitive landscape"
│   ├── 15-team.html              ← page 15 · "5.1 Founders and advisor"
│   └── Accruo Venture Pitch.html ← combined deck (fetches each slide's .sw block)
├── index.html                    ← root redirect to the combined deck (for GitHub Pages)
├── design-system/                ← latest Accruo brand bundle (gitignored — not needed at runtime)
├── tools/                        ← review_server.py (gitignored)
└── archive/                      ← prior drafts (gitignored)
```

Pages still TBD: `09–11` Business Model, `12–14` Execution. Outline = Problem(2) + Solution(6) + BizModel(3) + Execution(3) + Team(1) = 15.

## Local dev workflow

**One server, on :8090, served from `slides/`.** Always check before starting another:

```bash
# Is something on 8090 already?
lsof -ti:8090
```

- If a python http.server is already running on 8090 from `slides/`, **reuse it**. Do not start a second instance. Do not run `open` again — the user already has a tab open. Edits to any slide file trigger the in-page auto-reload script, which polls `Last-Modified` every 1.5s and refreshes the tab.
- If 8090 is occupied by a different process (other project, other branch), pick **:8091** and tell the user the new URL. Don't kill the existing one.
- If nothing is running, start it once:
  ```bash
  cd /Users/callumbartlett/Documents/Projects/pensionbusinessplan/slides
  python3 -m http.server 8090 >/tmp/pitch-server.log 2>&1 &
  open "http://localhost:8090/Accruo%20Venture%20Pitch.html"
  ```

Auto-reload only works over `http://`, not `file://` (Last-Modified isn't exposed for local files). Always serve via the local http.server.

## Slide conventions

- **Canvas**: A4 portrait, 794×1123 px. Each slide is one `.slide` inside one `.sw` (slide wrapper) inside `.document`.
- **Cream / surf alternation**: page 1 cream, 2 surf, 3 cream, 4 surf, ... Keeps adjacent pages distinguishable.
- **Slide marker** (`.sm`) at the top of each slide: `NN · Section · subtitle` for the dark-backdrop document review.
- **Section intro** (`.section-intro`) only on the first slide of each section (1, 3, 9, 12, 15). Single-digit number in serif gold + section name. No kicker. No blurb.
- **Title pattern**: `<h2 class="t-title">Factual claim. <em>Punchy gold-em phrase.</em></h2>`. The `em` is non-italic, gold-deep, weight 500. Used for the headline insight on every slide.
- **Footer**: `.sf-doc` text-label on the left, `.sf-pg` page number on the right. No SVG mark.
- **Footnotes**: `<sup class="fn">N</sup>` references, `.footnotes` 3-column grid at the bottom of `.si`. Numbering is **continuous across the document**, not per-page.

## Writing style

- **Avoid em dashes** (use commas, periods, semicolons, parentheses).
- **Sentence case** in headings and body. Irish spelling ("organisation", "behaviour").
- **No superlatives, no braggadocio.** Factual claims with a punchy framing beat marketing copy. "Three regulatory choices that shape the product" beats "A revolutionary platform".
- **Bio cards** are capability-framed, not CV-style. No "Owns:" lines, no dollar quantification, no leading with years of experience. Two-row tag system: credentials (deg, muted) and company + thematic skills (co gold, skill green).
- **Pension is the financial product**; health and life cover sit on the platform because they sit in the same buying conversation, not as equal billing. Frame the package context where helpful.

## Components reference

| Class | Use |
|---|---|
| `.t-title em` | Gold-em headline highlight |
| `.stat-big-r` | Right-floated green callout with a big gold figure |
| `.fq-breakout` | Full-bleed green band with a statement and quote |
| `.ttbl` | Alternating-band 3-row table with bullet items in 2 cols |
| `.ttbl-bar` | Compact 3-col grid: row label | Employee | HR; plain text cells |
| `.moment-grid` (default `.three`) | Gold-left-border explanation cards, 2 or 3 cols |
| `.acq-signal` | Green band with deal callouts (slide 08) |
| `.dt` | Market data table |
| `.market-row` | Growth note (cream) + share card (green) split |
| `.journey` | Cross-border story strip (slide 06) |
| `.app` / `.phone` | Product mockups (HR dashboard / iPhone) |
| `.bio-card` | Team slide person card (renamed from .pcard to avoid clash with phone .pcard) |

## Git + GitHub

- Remote: `https://github.com/mullacb/accruoventureplan.git`
- Live site: `https://mullacb.github.io/accruoventureplan/` (auto-deploys from `main` on every push)
- `.gitignore` excludes `archive/`, `design-system/`, `tools/`, Office files (`*.pptx`, `*.docx`, `*.xlsx`, `*.pdf`), system cruft. Keep the repo lean — only files needed to render the slides.

## Commit policy

- Commit when wrapping a unit of work, not after every minor edit.
- Use the system-prompt commit format ending with `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>`.
- Never `--no-verify`. Never amend a published commit. New commit, every time.
- Push to main only when the user says so or it's clearly the next step.

## Source documents

The IVC Word draft and the Accruo Business Plan PowerPoint live in OneDrive at `/Users/callumbartlett/Library/CloudStorage/OneDrive-Personal/Pension Fintech/Round 2/`. **Read-only.** Never edit those files.
