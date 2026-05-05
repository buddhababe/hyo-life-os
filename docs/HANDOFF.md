# Handoff Guide

This guide lets another computer or another LLM continue work without losing the project shape.

## Fast Start

Clone the repository:

```powershell
git clone https://github.com/buddhababe/hyo-life-os.git
cd hyo-life-os
```

Read:

```text
AGENTS.md
README.md
STATUS.md
LIVE_METHOD_MONITOR.md
docs/DECISIONS.md
```

Run locally:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\serve.ps1
```

Open:

```text
http://127.0.0.1:5183/
```

## Current Product Shape

Hyo Life OS is a static offline-first PWA with five surfaces:

1. `Radar`: external signals, method monitor, idea sandbox, skill forge.
2. `Vision`: identity slide, Ikigai, importance reduction, operating doctrine.
3. `Strategy`: Grand Plan, WOOP, Mandarat, gaeun priorities.
4. `Today`: Morning Gate, TOP 3, habits, Flow Matrix, Buddhist log, journal.
5. `Evolve`: weekly review, daewoon timeline, backup/security/settings.

## Working Agreement

- Keep `hyo-life-os/` isolated.
- Do not edit `life-os/`.
- Do not move private case-file content into this public repository.
- Keep deployable app text neutral and privacy-preserving.
- If a feature needs private context, make it user-entered or backup-imported, not hardcoded.

## Before Any Commit

Run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\verify.ps1
git diff --check
git status --short --branch
```

Expected:

- Required PWA files exist.
- Manifest parses.
- Service worker caches security modules.
- Core app surfaces exist.
- Sensitive public terms are absent.

## Deploy Flow

```powershell
git add .
git commit -m "Short clear message"
git push origin main
```

GitHub Pages deploys automatically.

Public URL:

```text
https://buddhababe.github.io/hyo-life-os/
```

After deploy, check:

```powershell
$r = Invoke-WebRequest -UseBasicParsing "https://buddhababe.github.io/hyo-life-os/sw.js?cb=$(Get-Date -Format yyyyMMddHHmmss)"
$r.Content.Contains("hyo-life-os-v1-8")
```

Update the cache version in `sw.js` when deploy-impacting assets change.

## Data Model Notes

- App state key: `hyo-life-os-state-v1`
- App lock key: `hyo-life-os-lock-v1`
- Current state version inside stored JSON: `2`
- Existing users may have older localStorage state. Normalize rather than erase.

## Good Next Tasks

1. Add a static method update inbox fed by a JSON file.
2. Add a scheduled GitHub Actions digest for research/tool changes.
3. Add better mobile Evolve layout.
4. Add a monthly review screen.
5. Add streak recovery mode.
6. Add Web Push only after the privacy model is explicit.

## Bad Next Tasks

- Hardcoding private personal case notes into `js/data.js`.
- Adding cloud sync without a written security model.
- Replacing the app with a heavy framework without a strong reason.
- Adding automatic method changes without review.
