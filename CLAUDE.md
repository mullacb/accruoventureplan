# Accruo Venture Pitch — repo guide

Static HTML deck for the IVC (INSEAD Venture Competition) Round 2 pitch. Per-page slide files share one design system; a combined view stitches them into a live deck. Hosted on GitHub Pages, edited locally with auto-reload.

## Layout

```
.
├── slides/
│   ├── _design-system.css        ← shared tokens, chrome, .ttbl, .ttbl-bar, .moment-grid, .stat-big-r,
│   │                                .fq-breakout, .acq-signal, mockup CSS (.app, .phone, etc), bio-card
│   ├── _reload.js                ← auto-reload (linked from every slide; watches the page + the CSS)
│   ├── 01-problem.html           ← page 1 · "1.1 The Problem"
│   ├── 02-why-now-market.html    ← page 2 · "1.2 Why now" + "1.3 Market"
│   ├── 03-solution-overview.html ← page 3 · "2.1 What Accruo does"
│   ├── 04-solution-hr.html       ← page 4 · "2.2 For HR teams"
│   ├── 05-solution-individuals.html  ← page 5 · "2.3 For individuals"
│   ├── 06-solution-five-year.html    ← page 6 · "2.4 The five-year product"
│   ├── 07-solution-regulatory.html   ← page 7 · "2.5 Regulatory architecture"
│   ├── 08-solution-competition.html  ← page 8 · "2.6 Competitive landscape"
│   ├── 15-team.html              ← page 15 · "5.1 Founders and advisor"
│   ├── _temp/                    ← scratch HTML for brainstorms/comparisons (gitignored, delete after use)
│   └── Accruo Venture Pitch.html ← combined deck (fetches each slide's .sw block, watches all + CSS)
├── index.html                    ← root redirect to the combined deck (for GitHub Pages)
├── .nojekyll                     ← REQUIRED for Pages to serve files starting with _
├── design-system/                ← latest Accruo brand bundle (gitignored, source of design variants)
├── tools/                        ← review_server.py (gitignored)
└── archive/                      ← prior drafts (gitignored)
```

Pages still TBD: `09–11` Business Model, `12–14` Execution. Outline = Problem(2) + Solution(6) + BizModel(3) + Execution(3) + Team(1) = 15.

---

## Editing and serving — the local dev loop

### 1 · Make sure the server is running

One server, on port 8090, served from `slides/`. **Always check before launching another:**

```bash
lsof -ti:8090
```

- **If something is on :8090** and it's serving from `slides/` (i.e., from a previous session), **reuse it**. Don't kill it. Don't start a second one.
- **If something else is on :8090** (different project, different branch), pick a different port (e.g., :8091) and tell the user the new URL.
- **If nothing**: start it once.

```bash
cd /Users/callumbartlett/Documents/Projects/pensionbusinessplan/slides
python3 -m http.server 8090 >/tmp/pitch-server.log 2>&1 &
```

Then open the combined view **once per session**:

```bash
open "http://localhost:8090/Accruo%20Venture%20Pitch.html"
```

After that, never run `open` again. Auto-reload handles it.

### 2 · Edit

- **Read the file first** (always — don't edit blind).
- **For copy changes**: when the user asks you to revise wording, propose 2-3 options inline in chat with a recommendation, let them pick, then `Edit` the file. Don't pre-emptively rewrite without showing options first; they want to pick the phrasing.
- **For shared style** (typography, palette, common components): edit `slides/_design-system.css`. Every slide picks it up on next reload.
- **For slide-specific style**: inline `style="..."` attributes or a per-slide `<style>` block **inside the `.sw` div** (not in `<head>` — the combined deck only stitches `.sw` content, so styles in `<head>` are dropped on the way in). Don't pollute `_design-system.css` with one-off tweaks.
- **Edit tool > Write** for surgical changes. Use Write for new files or full rewrites.
- The user prefers Irish spelling ("organise", "behaviour", "customise"), avoidance of em dashes, and sentence case throughout. See **Writing style** below.

### 3 · Auto-reload mechanics

- `_reload.js` polls `Last-Modified` every 1.5s on **the current page AND `_design-system.css`** and calls `location.reload()` on any change.
- The combined view (`Accruo Venture Pitch.html`) has its own watcher that polls **all 9 slide files plus the CSS**. Edit any slide → the deck reloads.
- Auto-reload **only works over `http://`**. `file://` strips `Last-Modified` from fetch responses, so the watcher silently never fires. Always serve via the local http.server.
- If a tab feels stuck after an edit (rare), hard-refresh once (Cmd+Shift+R).

### 4 · Screenshot before reporting any layout change

For any change that re-formats the page (CSS, grid/flex layout, padding, new components, restructured markup, content reorder that shifts heights), capture before + after PNGs via headless Chrome and view both with the `Read` tool before reporting back. CSS placement bugs only surface visually — reading code won't catch them.

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=2 \
  --screenshot=/tmp/slideNN-after.png \
  --window-size=820,1180 \
  "http://localhost:8090/NN-slide-name.html"
```

`--force-device-scale-factor=2` is required, otherwise the PNG is too small to read type and spacing. The per-page URL is faster than the combined deck for evaluating one slide. Skip the screenshot step for pure single-word copy edits where text length doesn't change.

Evaluate the after shot against intent: (1) nothing overflows the slide, (2) the change matches what was proposed, (3) hierarchy reads as intended, (4) no element landed in an unexpected grid cell or stacking order. If any of those fail, fix and re-screenshot before reporting.

### 5 · When wrapping a unit, commit

See **Commit policy** below.

---

## Scratch files for brainstorms and comparisons

When the user asks for layout brainstorms, format options, side-by-side comparisons, or anything that is **exploration rather than a real slide**, the file goes in `slides/_temp/`. Conventions:

- **Location**: `slides/_temp/<descriptive-name>.html`. Never write a brainstorm at `slides/01-foo-brainstorm.html`. The `_temp/` subdir is gitignored, so it won't pollute the repo or the deployed Pages site.
- **CSS and reload script**: scratch files reference the design system one level up: `<link rel="stylesheet" href="../_design-system.css">` and `<script src="../_reload.js"></script>`.
- **URL on the dev server**: `http://localhost:8090/_temp/<file>.html`. The http server serves the whole `slides/` dir, so the `_temp/` subpath just works.
- **Lifecycle**: a brainstorm file is short-lived. Once the user picks a variant and it's wired into the real slide, **delete the brainstorm file**. Don't let stale exploration HTML accumulate. If the user moves on without explicitly saying "delete it", offer to clean up.
- **Don't modify production slides while iterating**. Brainstorm in `_temp/`, then make the actual change to the real slide in one focused edit.

---

## Where to find variations

When the user says "find the other version", "look in my archive", or "use the styling from somewhere else", check these in order:

1. **`design-system/project/problem-compact-variants.html`** — the bundle's master variants for the Problem layout. Bridge sentence variants, `.ttbl-bar` styling, `.fq-breakout` spacing — this is the source of truth when the user says "the other version".
2. **`design-system/project/business-plan-templates.html`** — the full IVC plan template (~1700 lines). Section opener variants, market table layouts, team grids.
3. **`design-system/project/colors_and_type.css`** — canonical brand tokens (palette, fonts, type scale). The values in `slides/_design-system.css` mirror these but are inlined for self-containment.
4. **`archive/`** — prior drafts: `problem-2pages-v1/v2/v3.html`, `Problem Section.html`, etc. Useful for tracing how a layout evolved.
5. **OneDrive** — `Library/CloudStorage/OneDrive-Personal/Pension Fintech/Round 2/`:
   - `IVC Business Plan Draft.docx` — full Word draft (read-only)
   - `Final Documents/Accruo Business Plan.pptx` — final PPT (read-only)
   - `working/` — markdown drafts (team.md, etc), if any

---

## Slide conventions

- **Canvas**: A4 portrait, 794×1123 px. Each slide is one `.slide` inside one `.sw` (slide wrapper) inside `.document`.
- **Cream / surf alternation**: page 1 cream, 2 surf, 3 cream, 4 surf, ... Adjacent pages should be visually distinguishable.
- **Slide marker** (`.sm`) at the top of each slide: `NN · Section · subtitle`. Visible on the dark backdrop in the local review surface; not part of the printed slide.
- **Section intro** (`.section-intro`) only on the first slide of each section (1, 3, 9, 12, 15). Single-digit number in serif gold + section name. No kicker. No blurb.
- **Title pattern**: `<h2 class="t-title">Factual claim. <em>Punchy gold-em phrase.</em></h2>`. The `em` is non-italic, gold-deep, weight 500. Used for the headline insight on every slide.
- **Footer**: `.sf-doc` text-label on the left ("Accruo · Subtitle"), `.sf-pg` page number on the right. No SVG mark.
- **Footnotes**: `<sup class="fn">N</sup>` references, `.footnotes` 3-column grid at the bottom of `.si`. Numbering is **continuous across the document**, not per-page.

## Writing style

- **Avoid em dashes** (use commas, periods, semicolons, parentheses).
- **Sentence case** in headings and body. Irish spelling ("organisation", "behaviour", "customise").
- **No superlatives, no braggadocio.** Factual claims with a punchy framing beat marketing copy. *"Three regulatory choices that shape the product"* beats *"A revolutionary platform"*.
- **Bio cards** are capability-framed, not CV-style. No "Owns:" lines, no dollar quantification, no leading with years of experience. Two-row tag system: credentials (deg, muted) and company + thematic skills (co gold, skill green).
- **Pension is the financial product**; health and life cover sit on the platform because they sit in the same buying conversation, not as equal billing. Frame the package context where helpful.

## Components reference

| Class | Use |
|---|---|
| `.t-title em` | Gold-em headline highlight |
| `.stat-big-r` | Right-floated green callout with a big gold figure |
| `.fq-breakout` | Full-bleed green band with a statement and quote |
| `.ttbl` | Alternating-band 3-row table with bullet items in 2 cols |
| `.ttbl-bar` | Compact 3-col grid: row label \| Employee \| HR; plain-text cells with middot separators |
| `.moment-grid` (default `.three`) | Gold-left-border explanation cards, 2 or 3 cols |
| `.acq-signal` | Green band with deal callouts (slide 08) |
| `.dt` | Market data table |
| `.market-row` | Growth note (cream) + share card (green) split |
| `.journey` | Cross-border story strip (slide 06) |
| `.app` / `.phone` | Product mockups (HR dashboard / iPhone) |
| `.bio-card` | Team slide person card (renamed from .pcard to avoid clash with phone .pcard) |

---

## Git + GitHub Pages

- **Remote**: `https://github.com/mullacb/accruoventureplan.git`
- **Live site**: `https://mullacb.github.io/accruoventureplan/` — auto-deploys from `main` on every push (~30-60s).
- **`.nojekyll`** at the repo root is **required**. Without it, GitHub Pages runs Jekyll, which silently excludes any file or folder starting with `_` — that means `_design-system.css` and `_reload.js` would 404 in production. Don't delete `.nojekyll`. If you're tempted to add a new file starting with `_`, it'll work fine because of `.nojekyll`.
- **`.gitignore`** excludes `archive/`, `design-system/`, `tools/`, Office files (`*.pptx`, `*.docx`, `*.xlsx`, `*.pdf`), and system cruft. Keep the repo lean — only files needed to render the slides.

## Branching heuristic

Default to **main**. Branch only when the change calls for it.

- **Stay on main**: small copy edits, single-slide tweaks, shared CSS adjustments, bug fixes, anything that ships same-session.
- **Branch off main**: new slides being built across multiple sessions, structural changes affecting many slides at once, experimental design exploration, anything you'd want reviewed before going live on the deck.

When in doubt, ask the user. Be conscious of when a change is risky enough to warrant a branch.

## Commit policy

- Commit when wrapping a unit of work, not after every minor edit. Bundle related changes.
- Use the system-prompt commit format ending with `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>`.
- Never `--no-verify`. Never amend a published commit. New commit, every time.
- Push to main only when the user says so, or when it's clearly the next step (e.g., when the change is meant to go live on the Pages site).

## Source documents

The IVC Word draft and the Accruo Business Plan PowerPoint live in OneDrive at `/Users/callumbartlett/Library/CloudStorage/OneDrive-Personal/Pension Fintech/Round 2/`. **Read-only.** Never edit those files.

## Claude memory

This project also has Claude Code memory at `~/.claude/projects/-Users-callumbartlett-Documents-Projects-pensionbusinessplan/memory/`. The index is at `MEMORY.md`. Read it at session start for user preferences (writing style, refresh-don't-reopen, server conventions) that complement this guide.
