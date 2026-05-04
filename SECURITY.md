# Security Notes

Hyo Life OS is designed for static public hosting with local-only personal data.

## What Is Protected

- App seed data avoids direct sensitive public-support labels.
- User-entered data stays in browser `localStorage`.
- Encrypted backups use PBKDF2-SHA256 and AES-GCM.
- Local app lock stores a PBKDF2 hash, not the passphrase.

## What Is Not Protected

- Anyone with access to an unlocked device/browser profile can read local app data.
- A public deployment makes the app code public.
- The local app lock is not a replacement for Windows, phone, or browser profile security.
- If the encrypted-backup passphrase is lost, the backup cannot be restored.

## Before Public Deployment

Run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\verify.ps1
```

The verification must report no sensitive public-support terms.

