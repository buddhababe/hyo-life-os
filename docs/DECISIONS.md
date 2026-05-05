# Decision Record

This file records why the project is shaped this way.

## 1. Keep The App Web-First

Decision: deploy as a static PWA before building native apps.

Reason:

- Works anywhere through HTTPS.
- Installs to mobile/desktop as a PWA.
- Cheap to host on GitHub Pages.
- Keeps the first privacy model simple.

Tradeoff:

- Reliable background reminders need Web Push or native calendar backup.
- Cross-device sync requires export/import until a secure cloud layer exists.

## 2. Local-First Privacy Model

Decision: store personal entries in browser storage and support encrypted JSON export/import.

Reason:

- Public repo and public URL should expose only app code.
- Personal records should not be committed.
- Multi-device use is possible through encrypted backups.

Tradeoff:

- Each browser has its own local state.
- Lost browser storage can lose data if backups are not made.

## 3. PIN Is A Local App Lock

Decision: require 4-digit PIN setup on first launch.

Reason:

- It blocks casual access on the same device.
- It removes the useless "skip this time" path.

Tradeoff:

- It is not server-side authentication.
- It does not replace device security or encrypted backups.

## 4. Five-Stage Console

Decision: structure the UI as:

```text
Radar -> Vision -> Strategy -> Today -> Evolve
```

Reason:

- The app should operate like a life command system, not a simple habit tracker.
- External signals need a home.
- Vision and strategy should guide daily execution.
- Execution must feed back into system changes.

## 5. Dual Core Method

Decision: use two main engines:

- Science-based self-improvement.
- Saju/Buddhist gaeun and mindfulness.

Reason:

- The science engine gives measurable behavior change.
- The gaeun engine converts symbolic interpretation into environment design and risk management.
- Buddhist logging reduces overheat, attachment, anger, and confusion before big decisions.

Tradeoff:

- Saju/Buddhist content should be framed as guidance and risk design, not certainty.

## 6. Side Modules Stay Side Modules

Decision: Mandarat, Ikigai, Napoleon Hill, and Transurfing are support modules, not the main behavior engine.

Reason:

- They help meaning, visualization, and belief reinforcement.
- They should not replace measurable behavior loops.

## 7. Method Radar Does Not Auto-Change The System

Decision: new papers, tools, or frameworks become update candidates.

Reason:

- Latest is not always better.
- A personal operating system should not thrash every time a new idea appears.
- Updates need evidence scoring and review.

Adoption rule:

- Adopt only after weekly or monthly review.
- Use one-week experiments before changing core rules.

## 8. Public Repo Handoff

Decision: put `AGENTS.md`, `docs/HANDOFF.md`, and `docs/DECISIONS.md` in GitHub.

Reason:

- Any LLM or developer can continue from the same instructions.
- Boundaries and privacy rules remain visible.
- The repo itself carries the operating memory needed for development.

Tradeoff:

- These files must stay free of private raw case notes.
