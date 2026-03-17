# RealEstate AI

Full-stack real estate management platform built with React, Express, and PostgreSQL.

## Tech Stack

- **Frontend:** React 18 + Vite + TypeScript + TailwindCSS
- **Backend:** Express + TypeScript + Prisma ORM
- **Database:** PostgreSQL 15
- **Payments:** Stripe
- **Deployment:** Docker + GitHub Actions + Cloudflare Pages

## Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### Local Development (without Docker)

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Start both frontend and backend
npm run dev:all
```

- Frontend: http://localhost:4040
- Backend API: http://localhost:4041

### Running with Docker

1. Copy environment variables:

```bash
cp .env.example .env
# Edit .env with your actual values
```

2. Build and start all services:

```bash
docker-compose up --build
```

3. Run database migrations:

```bash
docker-compose exec app sh -c "cd backend && npx prisma migrate deploy"
```

4. Access the application at http://localhost:4041

### Stopping Docker Services

```bash
docker-compose down

# To also remove the database volume:
docker-compose down -v
```

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SMTP_HOST` | SMTP server hostname |
| `SMTP_PORT` | SMTP server port |
| `SMTP_USER` | SMTP authentication username |
| `SMTP_PASS` | SMTP authentication password |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `VITE_VAPID_PUBLIC_KEY` | VAPID public key for push notifications |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `VITE_STRIPE_PRICE_STARTER` | Stripe price ID for Starter plan |
| `VITE_STRIPE_PRICE_PROFESSIONAL` | Stripe price ID for Professional plan |
| `VITE_STRIPE_PRICE_BUSINESS` | Stripe price ID for Business plan |
| `VITE_STRIPE_PRICE_ENTERPRISE` | Stripe price ID for Enterprise plan |
| `STRIPE_SECRET_KEY` | Stripe secret key (server-side only) |

> `VITE_` prefixed variables are embedded at build time and available in the frontend.

## CI/CD Pipeline

The project uses GitHub Actions (`.github/workflows/ci-cd.yml`) with these stages:

1. **Lint & Type Check** — ESLint + TypeScript validation
2. **Test** — Jest test suite with coverage
3. **Build & Push** — Docker image built and pushed to GitHub Container Registry
4. **Deploy** — Frontend deployed to Cloudflare Pages

### Required GitHub Secrets

Set these in your repository's Settings > Secrets and variables > Actions:

- `CLOUDFLARE_API_TOKEN` — Cloudflare API token with Pages edit permission
- `CLOUDFLARE_ACCOUNT_ID` — Your Cloudflare account ID
- `VITE_VAPID_PUBLIC_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_STRIPE_PRICE_STARTER`
- `VITE_STRIPE_PRICE_PROFESSIONAL`
- `VITE_STRIPE_PRICE_BUSINESS`
- `VITE_STRIPE_PRICE_ENTERPRISE`

> `GITHUB_TOKEN` is automatically available for pushing to GitHub Container Registry.

## Project Structure

```
├── src/              # React frontend source
├── backend/          # Express backend source
│   ├── prisma/       # Database schema & migrations
│   └── src/          # Server source code
├── public/           # Static assets
├── dist/             # Built frontend output
├── Dockerfile        # Multi-stage production build
├── docker-compose.yml
└── .github/workflows/ci-cd.yml
```
