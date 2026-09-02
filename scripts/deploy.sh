#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

export PATH="$HOME/.local/bin:$PATH"

echo "=== WondaCraft Deploy ==="
echo ""

if ! vercel whoami &>/dev/null; then
  echo "Vercel login (browser will open)"
  vercel login
fi

echo "Vercel: $(vercel whoami)"
vercel link --yes 2>/dev/null || vercel link

echo ""
echo "Pulling env vars (Neon DATABASE_URL, etc.)..."
vercel env pull .env.local --yes
cp .env.local .env

echo ""
echo "Deploying..."
vercel --prod

echo ""
echo "=== Done ==="
echo "Live: https://wondacraft.vercel.app"
echo "Admin: https://wondacraft.vercel.app/admin/login"
