# Agent Instructions

This repository is the source of truth for `Hyo Life OS`.

## Read First

1. `README.md`
2. `STATUS.md`
3. `LIVE_METHOD_MONITOR.md`
4. `docs/HANDOFF.md`
5. `docs/DECISIONS.md`

## Project Boundary

- Work only inside this repository.
- Do not edit sibling folders, especially `life-os/`.
- Treat UUID-named folders outside this repository as reference material only. Do not copy private context into deployable files.
- Keep the app deployable as a static GitHub Pages PWA.

## Privacy Rules

- Do not put private identity/status details, account emails, tokens, or raw personal case notes into public app files.
- Do not add highly specific public-support status labels or institution details to deployable files.
- Keep personal user-entered data in browser storage, not in the repository.
- The 4-digit PIN is only a local app lock. Do not describe it as strong server-side security.

## Product Direction

Build this as a serious Life OS, not a simple habit checklist.

The main loop is:

```text
Radar -> Vision -> Strategy -> Today -> Evolve
```

Core engines:

- Science-based self-improvement: goals, if-then plans, behavior design, feedback loops.
- Saju/Buddhist gaeun engine: Water/Metal reinforcement, Fire/Dry-Earth risk management, mindfulness logs.
- Method radar: external research and tool updates become review candidates, not automatic rule changes.

## Engineering Rules

- Prefer small, understandable vanilla HTML/CSS/JS changes.
- Keep the PWA offline-friendly.
- Preserve localStorage data compatibility whenever possible.
- Use `scripts/verify.ps1` before every commit.
- Keep service worker cache names bumped after deploy-impacting asset changes.
- Avoid touching unrelated files.

## Verification

Run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\verify.ps1
```

Optional smoke test:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\serve.ps1
```

Then open:

```text
http://127.0.0.1:5183/
```

## Deployment

- GitHub repo: `buddhababe/hyo-life-os`
- Branch: `main`
- Public URL: `https://buddhababe.github.io/hyo-life-os/`
- Pushing to `main` triggers the GitHub Pages workflow.

After deploy, verify:

- `index.html` loads from the public URL.
- `sw.js` exposes the latest cache name.
- First launch requires PIN setup.
- There is no "skip this time" login bypass.

## Commit Style

Use concise commits:

```text
Improve V4 console handoff docs
Add weekly method digest scaffold
Fix mobile Evolve layout
```

## When Unsure

Choose privacy and system stability over feature speed.
