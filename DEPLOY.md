# Deploy Hyo Life OS

## Recommended Public Setup

Use a static host:

- GitHub Pages
- Cloudflare Pages
- Netlify

The app has no backend and no external API. It can be public because personal data is stored only in each browser.

Best shape:

```text
HTTPS website -> install as PWA -> optional Web Push backend later
```

Do not start with a native app unless push reliability or OS integration becomes more important than speed of iteration.

## Privacy Rules Before Deploy

Run the verifier before publishing:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\verify.ps1
```

Expected result: no sensitive terms in deployable app code.

## GitHub Pages Shape

Put the contents of `hyo-life-os/` in a repo or publish this folder as the Pages root.

Important files:

- `index.html`
- `manifest.json`
- `sw.js`
- `css/style.css`
- `js/*.js`
- `assets/icon.svg`
- `.nojekyll`
- `.github/workflows/pages.yml`

If this folder is used as a standalone repository, the included GitHub Actions workflow can deploy it to GitHub Pages automatically after pushing to `main`.

## One-Command Deploy After GitHub Login

If GitHub CLI is authenticated:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\deploy-github-pages.ps1
```

Expected public URL:

```text
https://buddhababe.github.io/hyo-life-os/
```

If `gh auth status` says reauthentication is required, run this in your own terminal first:

```powershell
gh auth login -h github.com
```

Then rerun the deploy script.

## Data Sync Model

v1 does not use cloud sync.

For multi-device use:

1. On device A, open Export tab.
2. Enter a long passphrase.
3. Click `암호화 다운로드`.
4. Move the encrypted JSON to device B.
5. Open the deployed app on device B.
6. Enter the same passphrase.
7. Click `암호화 가져오기`.

The passphrase is not stored by the app. If it is lost, encrypted backups cannot be restored.

## Device Lock

After opening the deployed app on a device, set a local app lock in the Export tab.

- The lock is device-local.
- The passphrase itself is not stored.
- A PBKDF2 hash is stored in localStorage.
- This protects casual access on the same device; it is not a substitute for OS-level device security.

## Notifications

The current static app can request browser notification permission while it is open. Reliable background reminders need Web Push.

Detailed local setup notes:

```text
docs/NOTIFICATIONS.md
```

For Web Push:

- The app must be served over HTTPS.
- A service worker must handle push events.
- A server, worker, or scheduled job must store push subscriptions and send messages.
- On iPhone/iPad, the PWA should be added to the Home Screen before push permission is useful.

Recommended v2:

- Cloudflare Worker Cron or Supabase Edge Function for reminder sending.
- Browser notification permission inside the app.
- Native calendar/reminder fallback for mission-critical alerts.

## External Monitoring

The live methodology monitor should not run inside the static app.

Recommended v2:

- GitHub Actions schedule or Cloudflare Worker Cron scans sources weekly.
- Sources include PubMed/NCBI E-utilities, OpenAlex, official browser docs, and official tool changelogs.
- Output is a weekly Markdown or JSON digest.
- The app displays update candidates, but adoption is manual through weekly/monthly review.
