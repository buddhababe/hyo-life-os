# Live Method Monitor

## Decision

Hyo Life OS should stay web-first as a PWA, then add a small external monitoring layer.

The core app records your life and runs locally. The monitor watches the outside world and proposes method updates. The app should not silently rewrite your system just because something new appeared.

## Why This Shape

- Static PWA is best for everywhere access, low cost, and privacy.
- External monitoring needs network, scheduled jobs, and sometimes API keys, so it should live outside the static app.
- Push notifications need a server-side sender. A static site can request notification permission, but reliable background reminders require Web Push or a native wrapper.
- Methodology updates must be reviewed before adoption. Latest is not always better.

## Architecture

```text
sources -> monitor worker -> evidence scoring -> update queue -> human/AI review -> app method version
```

## Recommended Stack

### App Layer

- `hyo-life-os/` deployed as HTTPS PWA.
- Storage: browser `localStorage` for v1, later IndexedDB if entries grow.
- Data portability: encrypted JSON backup/import.
- UI role: daily command center, weekly review, goal editor, method update inbox.

### Monitor Layer

Choose one:

- Cloudflare Worker Cron: best lightweight web-native option.
- GitHub Actions scheduled workflow: simplest if the app already lives on GitHub.
- Supabase Edge Function + database: best when update history and push subscriptions need persistence.

### Notification Layer

- Desktop/Android: PWA Web Push via service worker.
- iPhone/iPad: install the PWA to Home Screen first, then request push permission.
- If reminders must be absolutely reliable, add native calendar reminders as a backup.

## Source Classes

### Science Core

Update cadence: monthly scan, quarterly adoption review.

Topics:

- goal setting
- implementation intentions
- WOOP/MCII
- behavior design
- self-determination theory
- mindfulness and self-regulation
- sleep, exercise, learning science

Sources:

- PubMed / NCBI E-utilities
- OpenAlex
- Semantic Scholar
- arXiv only for preprints and early signals

### Tools And AI

Update cadence: weekly.

Topics:

- AI coding agents
- spaced repetition tools
- personal knowledge management
- finance/legal research tooling
- PWA/browser notification changes

Sources:

- official product changelogs
- official browser/platform docs
- high-signal engineering blogs

### Personal Strategy

Update cadence: weekly review, monthly deeper review.

Inputs:

- daily score
- sleep/study/exercise trend
- journal text
- Buddhist greed/anger/delusion log
- resource leverage and operating conditions
- current Grand Plan

## Evidence Scoring

Each candidate update gets a score from 0 to 100.

- Evidence quality: 0-30
- Relevance to your Life OS: 0-25
- Replication or source reliability: 0-20
- Cost/risk/friction: 0-15
- Timeliness: 0-10

Adoption rules:

- 80+: propose for next weekly review.
- 60-79: park in watchlist.
- below 60: ignore unless repeatedly confirmed.
- preprints: never auto-adopt; watch only.

## Update Cadence

- Daily: no external research. Just execute.
- Weekly: monitor summary + personal metrics review.
- Monthly: methodology review and app settings update.
- Quarterly: strategic framework review.
- Immediately: only for safety, legal, platform, or security changes.

## Method Update Template

```md
# Method Update Candidate

## Claim

## Source

## Evidence Level

## What Changes In Life OS

## Risk / Cost

## Adopt, Watch, Or Reject
```

## First Implementation Milestones

1. Add a static `method_updates.json` that the PWA can display.
2. Add a GitHub Actions scheduled workflow that creates a weekly Markdown digest.
3. Add manual approval: accepted updates are pasted into the app or merged into seed data.
4. Add Web Push only after the app is deployed over HTTPS.
5. Add persistent cloud storage only after the privacy model is explicit.

## Principle

The system should evolve, but your daily behavior should not become unstable. The monitor watches the world; the Life OS changes only after review.
