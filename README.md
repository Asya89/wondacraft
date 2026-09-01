# Wondacraft — Handmade E-commerce

Production-ready e-commerce website for handmade products (toys, decor). Built with Next.js, PostgreSQL, and Prisma.

**Primary language:** Armenian (hy)  
**Domain target:** [wondacraft.am](https://wondacraft.am)

## Tech Stack

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Backend:** Server Actions, Route Handlers
- **Database:** PostgreSQL + Prisma ORM
- **Validation:** Zod, React Hook Form
- **Auth:** JWT sessions (httpOnly cookies) + bcrypt
- **Local DB:** Docker Compose (PostgreSQL 16)
- **Production DB:** Neon PostgreSQL
- **Deployment:** Vercel
- **Testing:** Vitest

## Requirements

- Node.js 20+
- Docker & Docker Compose
- npm

## Quick Start (Local)

```bash
# 1. Clone and install
git clone <your-repo-url>
cd wondacraft
npm install

# 2. Environment
cp .env.example .env
# Edit .env if needed (defaults work with Docker)

# 3. Start PostgreSQL
docker compose up -d

# 4. Run migrations and seed
npm run db:migrate
npm run db:seed

# 5. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Admin panel:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Default admin (from seed):
- Email: `admin@wondacraft.am`
- Password: `admin123456` (change via `ADMIN_PASSWORD` in `.env` before seeding)

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://wondacraft:wondacraft@localhost:5432/wondacraft` |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (no trailing slash) | `http://localhost:3000` |
| `ADMIN_EMAIL` | Admin email for seed | `admin@wondacraft.am` |
| `ADMIN_PASSWORD` | Admin password for seed | `change-me-in-production` |
| `SESSION_SECRET` | JWT signing secret (min 32 chars) | random string |
| `STORAGE_PROVIDER` | `local` or `s3` | `local` |
| `STORAGE_BUCKET` | S3 bucket (production) | — |
| `STORAGE_REGION` | S3 region | — |
| `STORAGE_ACCESS_KEY` | S3 access key | — |
| `STORAGE_SECRET_KEY` | S3 secret key | — |
| `STORAGE_PUBLIC_URL` | Public CDN URL for uploads | — |
| `TELEGRAM_BOT_TOKEN` | Future: Telegram notifications | — |
| `TELEGRAM_CHAT_ID` | Future: Telegram chat ID | — |

Never commit `.env` files. Use `.env.example` as reference.

## Docker Setup

PostgreSQL runs in Docker for local development:

```bash
docker compose up -d      # Start
docker compose down       # Stop
docker compose down -v    # Stop and remove data volume
```

Connection: `postgresql://wondacraft:wondacraft@localhost:5432/wondacraft`

## Database Commands

```bash
npm run db:generate       # Generate Prisma client
npm run db:migrate        # Run migrations (dev)
npm run db:migrate:deploy # Run migrations (production)
npm run db:seed           # Seed database
npm run db:studio         # Open Prisma Studio
npm run db:reset          # Reset DB and re-seed
```

## Development

```bash
npm run dev          # Dev server
npm run lint         # ESLint
npm run format       # Prettier
npm run build        # Production build
npm run test         # Run tests
npm run generate:images  # Regenerate placeholder images
```

## Project Structure

```
src/
├── app/
│   ├── (shop)/          # Public pages
│   ├── admin/           # Admin panel
│   ├── actions/         # Server actions
│   └── api/             # Route handlers (upload)
├── components/          # UI components
├── lib/                 # Utils, i18n, validations, auth
└── server/services/     # Business logic
prisma/
├── schema.prisma
├── seed.ts
└── migrations/
public/images/           # Static & generated images
```

## Features

### Public Site
- Homepage with hero, categories, featured/new products
- Product catalog with filtering, sorting, pagination, search
- Category pages with hierarchical support
- Product detail pages with image gallery
- Order form (name + phone required, no online payment)
- About & Contact pages
- SEO: metadata, sitemap, robots.txt, JSON-LD

### Admin Panel (`/admin`)
- Secure login with session cookies
- Dashboard with stats and recent orders
- Product CRUD with image upload
- Category CRUD with parent/child hierarchy
- Order management with status updates

### Order Flow
1. Customer clicks **Պատվիրել** on a product
2. Fills name, phone, optional address/comment
3. Server validates input and calculates price from DB
4. Order saved with `paymentMethod: MANUAL`, `paymentStatus: PENDING`
5. Customer sees confirmation with order number
6. Admin contacts customer manually for payment

## Testing

```bash
npm run test
```

Tests cover: product/category retrieval, order creation, price calculation, validation, admin user existence.

## Production Deployment

### Architecture

```
GitHub → Vercel → Next.js
                    ↓
              Neon PostgreSQL
                    ↓
                 Prisma
```

Images in production: configure `STORAGE_PROVIDER=s3` (S3-compatible storage) when ready.

### Step-by-Step

#### 1. GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USER/wondacraft.git
git push -u origin main
```

#### 2. Neon PostgreSQL

1. Create account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string (with `?sslmode=require`)
4. This is your production `DATABASE_URL`

#### 3. Vercel Deployment

1. Import GitHub repo at [vercel.com](https://vercel.com)
2. Add environment variables:
   - `DATABASE_URL` — Neon connection string
   - `NEXT_PUBLIC_SITE_URL` — `https://wondacraft.am`
   - `SESSION_SECRET` — strong random string (32+ chars)
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD` — for initial seed
   - `STORAGE_PROVIDER=local` (or S3 vars for cloud storage)
3. Deploy

#### 4. Run Migrations on Production

```bash
# From local machine with production DATABASE_URL
DATABASE_URL="your-neon-url" npm run db:migrate:deploy
DATABASE_URL="your-neon-url" npm run db:seed
```

Or use Vercel CLI / GitHub Action.

#### 5. Custom Domain (wondacraft.am)

In Vercel project settings → Domains:
- Add `wondacraft.am`
- Add `www.wondacraft.am`

DNS configuration (at your domain registrar):

| Type | Name | Value |
|------|------|-------|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

Or use Vercel nameservers for automatic DNS.

Update `NEXT_PUBLIC_SITE_URL=https://wondacraft.am` in Vercel env vars.

### Database Workflow

**Local:**
```
Docker PostgreSQL → Prisma → Development DB
```

**Production:**
```
Neon PostgreSQL → prisma migrate deploy → Production DB
```

Never use the local Docker database in production.

## Adding Products

1. Log in at `/admin/login`
2. Go to **Products** → **Create Product**
3. Fill details, upload images
4. Mark as Featured/New if desired
5. Save

## Adding Online Payment Later

The schema supports payments without redesign:

- `Order.paymentMethod`: `MANUAL` | `CARD`
- `Order.paymentStatus`: `PENDING` | `PAID` | `FAILED` | `REFUNDED`
- `Order.transactionId` for provider reference
- `Payment` model for payment intents/history

To add a provider later:
1. Create `POST /api/payments/create` — initiate payment
2. Create `POST /api/payments/webhook` — handle provider callbacks
3. Update order `paymentStatus` and `transactionId` on success

## Future Features (Prepared, Not Implemented)

- Shopping cart
- Online card payment
- Reviews & Favorites (models exist)
- Telegram/email notifications (service abstraction ready)
- Multi-language (i18n structure ready)
- S3 cloud storage (storage abstraction ready)

## Troubleshooting

**Database connection failed**
- Ensure Docker is running: `docker compose ps`
- Check `DATABASE_URL` matches docker-compose credentials

**Prisma client out of sync**
```bash
npm run db:generate
```

**Port 5432 already in use**
- Change port in `docker-compose.yml` and update `DATABASE_URL`

**Build fails on Vercel**
- Ensure all env vars are set
- Run `npm run build` locally first

## License

Private — Wondacraft
