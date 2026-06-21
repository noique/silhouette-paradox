#!/usr/bin/env bash
#
# Deploy / update "Silhouette Paradox" on the Contabo VPS.
# Run ON THE SERVER:
#     cd /opt/silhouette-paradox && ./deploy.sh
#
# Equivalent of a Vercel deploy: sync source -> install -> build -> restart.
# The app is a pure front-end (no DB, no runtime env vars required).
#
# Per-server config (your domain) lives in an UNTRACKED .env.deploy so we never
# dirty a tracked file. Create it once:
#     echo 'NEXT_PUBLIC_SITE_URL=https://your-domain' > /opt/silhouette-paradox/.env.deploy
set -euo pipefail

APP_DIR="/opt/silhouette-paradox"
PORT="3002"

cd "$APP_DIR"

# --- Node version gate (Next.js 16 needs >= 20.9.0) -------------------------
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
NODE_MINOR="$(node -p 'process.versions.node.split(".")[1]')"
if [ "$NODE_MAJOR" -lt 20 ] || { [ "$NODE_MAJOR" -eq 20 ] && [ "$NODE_MINOR" -lt 9 ]; }; then
  echo "FATAL: Node $(node -v) is too old. Next.js 16 requires >= 20.9.0 (see DEPLOY.md §一)."
  exit 1
fi

# --- Per-server build-time config (domain, etc.) ----------------------------
if [ -f .env.deploy ]; then
  set -a; . ./.env.deploy; set +a
fi
if [ -z "${NEXT_PUBLIC_SITE_URL:-}" ]; then
  echo "WARNING: NEXT_PUBLIC_SITE_URL not set — OG/canonical URLs will use a local placeholder."
  echo "         Fix: echo 'NEXT_PUBLIC_SITE_URL=https://your-domain' > ${APP_DIR}/.env.deploy"
fi

echo "==> [1/6] Sync source to origin (idempotent — the server is a deploy target, not an edit surface)"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
git fetch origin
git reset --hard "origin/${BRANCH}"

echo "==> [2/6] Install dependencies (devDeps included — required to build)"
npm ci

echo "==> [3/6] Build (standalone output)"
npm run build

echo "==> [4/6] Copy static assets into the standalone bundle"
# next build does NOT copy these into .next/standalone — skipping = broken CSS/JS/images.
rm -rf .next/standalone/public .next/standalone/.next/static
cp -r public        .next/standalone/
cp -r .next/static  .next/standalone/.next/
# fail loudly if the copy did not land
{ [ -d .next/standalone/.next/static ] && [ -n "$(ls -A .next/standalone/.next/static)" ]; } \
  || { echo "    FAILED — .next/static not copied into standalone"; exit 1; }
[ -d .next/standalone/public ] || { echo "    FAILED — public/ not copied into standalone"; exit 1; }

echo "==> [5/6] (Re)start under PM2  (a brief ~1s 502 blip during redeploy is expected)"
pm2 startOrReload ecosystem.config.cjs --update-env
pm2 save

echo "==> [6/6] Health check (loopback)"
# Wait for the new process to bind (reload/port handoff timing varies).
for _ in $(seq 1 15); do
  curl -fsS -o /dev/null "http://127.0.0.1:${PORT}/" && break || sleep 1
done
# 1) page shell
curl -fsS -o /dev/null -w "    page    HTTP %{http_code}\n" "http://127.0.0.1:${PORT}/" \
  || { echo "    FAILED — see: pm2 logs silhouette-paradox --lines 50"; exit 1; }
# 2) a real hashed CSS asset — proves step 4 actually served (the #1 failure mode)
CSS_FILE="$(find .next/standalone/.next/static -name '*.css' 2>/dev/null | head -1 || true)"
if [ -n "$CSS_FILE" ]; then
  CSS_URL="/_next/static/${CSS_FILE#.next/standalone/.next/static/}"
  curl -fsS -o /dev/null -w "    css     HTTP %{http_code}\n" "http://127.0.0.1:${PORT}${CSS_URL}" \
    || { echo "    FAILED — static assets not served (step 4 copy broken)"; exit 1; }
fi
# 3) OG image (non-fatal — nice to confirm)
curl -fsS -o /dev/null -w "    og:img  HTTP %{http_code}\n" "http://127.0.0.1:${PORT}/opengraph-image" || true

echo "==> OK. OpenResty should reverse-proxy your domain → 127.0.0.1:${PORT}"
