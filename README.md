# WondaCraft — Handmade E-commerce

Handmade products e-commerce site. Armenian UI, admin panel, order flow (no online payment).

**Live:** [wondacraft.vercel.app](https://wondacraft.vercel.app)  
**Domain target:** [wondacraft.am](https://wondacraft.am)

## Tech Stack

- Next.js 16 (App Router), TypeScript, Tailwind CSS
- PostgreSQL (Neon) + Prisma
- Vercel deployment

## One database

There is a **single production database** on Neon. Local dev and the live site use the same data.

- Add a product in admin → it appears on the live site **immediately** (no redeploy)
- Redeploy is only needed when you **change code**

## Work from any computer (no Docker)

```bash
git clone https://github.com/Asya89/wondacraft.git
cd wondacraft
npm install

# Get env vars from Vercel (Neon DATABASE_URL, secrets, etc.)
vercel link
vercel env pull .env.local

# Copy to .env for Prisma CLI (migrate, seed, studio)
cp .env.local .env

npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Admin (local or production — same database):**

| Where | URL |
|-------|-----|
| Local | http://localhost:3000/admin/login |
| Live | https://wondacraft.vercel.app/admin/login |

Default admin: `admin@wondacraft.am` / `admin123456`

## Images (keep in Git)

**Decision:** product, category, maker, and site images live in the repo — not on Vercel’s temporary disk and not on S3 (for now).

| Folder | Role |
|--------|------|
| `_assets/` | Source files you drop in (jpeg/png) |
| `public/images/` | Optimized files the site serves (`/images/...`) |

**Add a new image**

1. Put the file in `_assets/` (or copy into `public/images/...` directly)
2. Run `npm run sync:assets` if it has a mapping in `scripts/sync-assets.ts`
3. In admin, set **Image URL** to e.g. `/images/products/my-item-01.webp`
4. `git add` → `commit` → `push` → deploy

**Why:** free, works from any computer after `git pull`, survives Vercel redeploys.

**Do not rely on** Admin → file upload on production (`public/uploads/`) — those files can disappear after deploy. Use Git images instead until volume grows (then Cloudflare R2).

## Adding products

1. Log in at `/admin/login` (local or live — same result)
2. **Products** → **Create Product**
3. Fill form, save
4. Product is live instantly on [wondacraft.vercel.app](https://wondacraft.vercel.app)
5. For photos: use `/images/...` URLs from git (see **Images** above)

## Database commands

```bash
npm run db:studio          # Visual DB browser (localhost:5555)
npm run db:migrate:deploy  # Apply migrations (usually automatic on Vercel build)
npm run db:seed            # Re-seed admin + sample products
```

View data in Neon: [Vercel → Storage → Neon](https://vercel.com/asyas-projects-6a287916/wondacraft/stores)

## Deploy code changes

```bash
git push          # if Git connected to Vercel
# or
vercel --prod
```

## Environment variables

Set on Vercel (Production). Pull locally with `vercel env pull`.

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Neon PostgreSQL (auto via Vercel Neon integration) |
| `NEXT_PUBLIC_SITE_URL` | Public URL |
| `SESSION_SECRET` | Admin session signing (32+ chars) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Used by seed |
| `STORAGE_PROVIDER` | Keep `local`. Site images are stored in git (`public/images/`). Admin uploads on Vercel are ephemeral — prefer git workflow. |

See `.env.example` for the full list.

## Development

```bash
npm run dev
npm run lint
npm run test
npm run build
npm run sync:assets    # Refresh product images from _assets/
```

## Project structure

```
src/app/(shop)/     Public pages
src/app/admin/      Admin panel
src/server/services Business logic
prisma/             Schema, migrations, seed
public/images/      Product & category images (in git)
```

## License

Private — WondaCraft
