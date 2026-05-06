# Hyo Life OS Status

## Current Boundary

- Active project folder: `hyo-life-os/`
- Do not edit: `life-os/`
- Do not rely on UUID-folder implementation plans as app source of truth; they may belong to another workflow.
- LLM handoff docs are now part of the repo: `AGENTS.md`, `docs/HANDOFF.md`, `docs/DECISIONS.md`.

## Current URL

```text
http://127.0.0.1:5183/
```

## Verified

- Manifest parses as JSON.
- Service worker cache is isolated as `hyo-life-os-v1-10`.
- localStorage key is isolated as `hyo-life-os-state-v1`.
- Sensitive public terms verifier passes.
- Headless Edge smoke screenshot reaches required first-launch PIN setup.

## Implemented v4 Console

- Isolated from `life-os/`.
- Rebuilt navigation as `Radar -> Vision -> Strategy -> Today -> Evolve`.
- Radar tab with world signals, method monitor, idea sandbox, and skill forge.
- Static Method Update Inbox fed by `data/method-updates.json`.
- Vision tab with The Slide, Ikigai, importance reduction, and operating doctrine.
- Strategy tab with Grand Plan, WOOP, Mandarat, weighted gaeun priorities, and residence/career/person criteria.
- Today tab with Morning Gate, TOP 3, core habits, Flow Matrix, Buddhist log, journal, and cold coach.
- Evolve tab with weekly feedback, daewoon timeline, science principles, backups, security, and goal update center.
- TOP 3 with if-then execution intention.
- Core 3 Habit Engine.
- Guardrail checklist.
- 60-second Journal / 1-question fallback.
- Weekly Feedback Engine.
- Weekly trend bars.
- Browser notification permission button.
- Encrypted backup/import for multi-device use.
- Local app lock for public URL use.
- Morning focus lock for forcing the 60-second check-in before strategy/evolve surfaces.
- Visible lock hint and user guide explaining why Strategy/Evolve are gated.
- Refined Transurfing importance-reduction doctrine.
- Grand Plan editor and weekly update prompt brief.
- Live Method Monitor architecture added for external research/tool updates.
- Local notification setup guide for Windows/browser behavior.
- GitHub Pages workflow for public access.
- Verification and serve scripts.
- Security notes and deployment checklist.
- GitHub handoff instructions for future LLM/developer continuation.
- Mandarat / Ikigai / Napoleon Hill side modules.
- Saju and Buddhist dashboard.
- ChatGPT Markdown export.
- JSON backup/import.

## Next Safe Steps

1. Deploy as HTTPS PWA.
2. Add Web Push backend only after deployment.
3. Add scheduled methodology monitor digest via GitHub Actions.
4. Add visual monthly review and streak recovery mode.
5. Add optional cloud sync later only if the security model is explicit.
