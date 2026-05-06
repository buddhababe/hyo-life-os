# Notification Setup

Hyo Life OS v1 can ask the browser for notification permission while the app is open. It does not yet send reliable background reminders after the browser is closed. That requires Web Push or a native reminder/calendar fallback.

## Recommended v1 Setup

Use the app notification button for lightweight open-browser nudges, and use the operating system for mission-critical reminders.

1. Deploy or open the app over HTTPS.
2. Install the site as a PWA from the browser menu.
3. Click the `알림` button in the app header and allow notifications.
4. Keep the app open when testing notifications.
5. Put essential reminders in Windows Clock, Microsoft To Do, Google Calendar, or another trusted native reminder app.

## Windows Notes

Check these settings if notifications do not appear:

- Windows Settings -> System -> Notifications: notifications are on.
- Focus Assist / Do Not Disturb: off during test time.
- Browser notification permission: allowed for the Hyo Life OS URL.
- Browser background behavior: allowed if the browser offers background app settings.
- PWA installed app: pinned to Start/taskbar if you want a more app-like launch path.

## Browser Notes

Chrome and Edge generally support installed PWA notifications well on Windows. Firefox can show site notifications, but PWA install behavior differs. Safari/iOS push behavior is stricter: on iPhone and iPad, install the PWA to the Home Screen before relying on push-style notification permission.

For local development on `http://127.0.0.1:5183/`, permission prompts may work because localhost-like origins are treated specially by browsers. For real use, prefer the HTTPS GitHub Pages URL.

## Current Limit

The static app has no server that can wake the service worker and send reminders later. This means:

- The app can confirm permission.
- The app can show a test notification while open.
- The app cannot promise timed background reminders by itself.

## v2 Path

Add Web Push only after the privacy model is explicit:

- Store push subscriptions on a small backend such as Cloudflare Worker, Supabase Edge Function, or another minimal service.
- Send scheduled reminders from a cron job.
- Keep reminder payloads generic and privacy-preserving.
- Let the app opt in per device.
- Keep native calendar/reminder fallback for high-stakes reminders.
