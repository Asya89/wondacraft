#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

export PATH="$HOME/.local/bin:$PATH"

echo "=== WondaCraft Deployment Setup ==="
echo ""

# 1. GitHub
if ! gh auth status &>/dev/null; then
  echo "Step 1: GitHub login (browser will open)"
  gh auth login -h github.com -p https -w
fi

echo "GitHub: $(gh auth status 2>&1 | head -1)"
echo ""

# 2. Create repo & push
if ! git remote get-url origin &>/dev/null; then
  echo "Step 2: Creating GitHub repo 'wondacraft'..."
  gh repo create wondacraft --public --source=. --remote=origin --push --description "WondaCraft handmade e-commerce"
else
  echo "Step 2: Pushing to existing remote..."
  git push -u origin main
fi

REPO_URL=$(gh repo view --json url -q .url)
echo "GitHub repo: $REPO_URL"
echo ""

# 3. Vercel login
if ! vercel whoami &>/dev/null; then
  echo "Step 3: Vercel login (browser will open)"
  vercel login
fi

echo "Vercel: $(vercel whoami)"
echo ""

# 4. Link Vercel project
echo "Step 4: Linking Vercel project..."
vercel link --yes 2>/dev/null || vercel link

# 5. Environment variables reminder
echo ""
echo "Step 5: Set these env vars in Vercel (or run interactively):"
echo "  DATABASE_URL       - from Neon (https://neon.tech)"
echo "  NEXT_PUBLIC_SITE_URL - your Vercel/production URL"
echo "  SESSION_SECRET     - random 32+ char string"
echo "  ADMIN_EMAIL        - admin@wondacraft.am"
echo "  ADMIN_PASSWORD     - strong password"
echo "  STORAGE_PROVIDER   - local"
echo ""

read -rp "Do you have Neon DATABASE_URL ready? (y/n) " HAS_DB
if [[ "$HAS_DB" == "y" ]]; then
  read -rp "Paste DATABASE_URL: " DB_URL
  vercel env add DATABASE_URL production <<< "$DB_URL"
  vercel env add DATABASE_URL preview <<< "$DB_URL"
fi

read -rp "Paste SESSION_SECRET (or press Enter to generate): " SECRET
if [[ -z "$SECRET" ]]; then
  SECRET=$(openssl rand -base64 32)
  echo "Generated: $SECRET"
fi
vercel env add SESSION_SECRET production <<< "$SECRET"
vercel env add SESSION_SECRET preview <<< "$SECRET"

vercel env add NEXT_PUBLIC_SITE_URL production <<< "https://wondacraft.vercel.app"
vercel env add ADMIN_EMAIL production <<< "admin@wondacraft.am"
vercel env add STORAGE_PROVIDER production <<< "local"

# 6. Deploy
echo ""
echo "Step 6: Deploying to Vercel..."
vercel --prod

echo ""
echo "=== Done ==="
echo "GitHub:  $REPO_URL"
echo "Vercel:  https://vercel.com/asyas-projects-6a287916"
echo ""
echo "After deploy, run seed on production DB:"
echo "  DATABASE_URL='your-neon-url' npm run db:seed"
