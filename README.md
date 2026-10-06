# mailpit-gmail

Gmail-style web UI for an existing [Mailpit](https://mailpit.axllent.org/) instance.
Static React build served by nginx, which proxies `/api` (incl. the `/api/events`
websocket) and `/view` to Mailpit. Mailpit itself is not modified; its own UI on
`:8025` keeps working.

> **Internal use only.** UI derived from
> [princegoswami/gmail_clone](https://gitlab.com/princegoswami/gmail_clone), which has
> no license. Gmail name/logo belong to Google. Do not publish this repo.

## Requirements

- Mailpit running and reachable (recommended: latest; **≥ v1.20 needed for Compose/Reply/Forward** — older versions have no send API)
- nginx, Node.js 18+ (build only)

## Install

```bash
git clone https://github.com/<owner>/mailpit-gmail.git
cd mailpit-gmail
./install.sh mail.local http://127.0.0.1:8025   # [domain] [mailpit url]
```

Then map the domain to `127.0.0.1` in your hosts file (on WSL, the **Windows** hosts file,
edited as Administrator) and open `http://mail.local`.

`DRY_RUN=1 ./install.sh ...` prints the generated nginx config without touching anything.

If the script says nginx cannot read `dist/`, your home dir is not traversable by
`www-data` — clone under `/opt` or `/var/www` instead.

## Update

```bash
git pull && npm ci && npm run build   # nginx serves dist/ directly, no reload needed
```

## Develop

```bash
npm install
MAILPIT_URL=http://localhost:8025 npx vite   # dev server with proxy, see vite.config.js
```

## What works

Real (Mailpit API): inbox list, live updates, search (Mailpit syntax: `from:`, `subject:`,
`is:unread`, …), pagination, select / delete / mark read-unread, message view (sandboxed
HTML iframe), attachments, print, open in new window, prev/next, Labels (= Mailpit tags),
Compose / Reply / Forward, light / dark / system theme.

Visual only: Starred, Snoozed, Sent, Drafts, Promotions/Social tabs, Chat/Meet rail,
Gemini, add-on rail.
