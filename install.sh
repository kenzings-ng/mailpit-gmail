#!/usr/bin/env bash
# Build the UI and serve it through nginx, proxying to an existing Mailpit.
#
#   ./install.sh [domain] [mailpit_url]
#   ./install.sh mail.local http://127.0.0.1:8025
#
# DRY_RUN=1 only prints the generated nginx config.
set -euo pipefail

DOMAIN="${1:-mail.local}"
MAILPIT="${2:-http://127.0.0.1:8025}"
DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$DIR/dist"
CONF="/etc/nginx/sites-available/$DOMAIN.conf"

render() {
  sed -e "s#__DOMAIN__#$DOMAIN#g" -e "s#__ROOT__#$ROOT#g" -e "s#__MAILPIT__#${MAILPIT%/}#g" "$DIR/nginx.conf.template"
}

if [ "${DRY_RUN:-}" = 1 ]; then render; exit 0; fi

command -v nginx >/dev/null || { echo "nginx is not installed (sudo apt install nginx)"; exit 1; }
command -v npm >/dev/null || { echo "Node.js/npm is required to build"; exit 1; }

curl -fsS -m 5 "${MAILPIT%/}/api/v1/info" >/dev/null \
  || echo "WARNING: cannot reach Mailpit at $MAILPIT — continuing anyway."

(cd "$DIR" && npm ci && npm run build)

# nginx (www-data) must be able to traverse every parent dir of dist/.
if ! sudo -u www-data test -r "$ROOT/index.html" 2>/dev/null; then
  echo "ERROR: nginx cannot read $ROOT (home dir is probably 750)."
  echo "Fix: chmod o+x on each parent dir, or clone this repo under /opt or /var/www."
  exit 1
fi

render | sudo tee "$CONF" >/dev/null
sudo ln -sf "$CONF" "/etc/nginx/sites-enabled/$DOMAIN.conf"
sudo nginx -t
sudo systemctl reload nginx

echo
echo "Done: http://$DOMAIN"
echo "Add to hosts if needed:  127.0.0.1  $DOMAIN"
echo "  Linux/WSL: /etc/hosts   Windows: C:\\Windows\\System32\\drivers\\etc\\hosts (as Administrator)"
