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
| `NGINX_HOST` | Domain name for Nginx SSL (default: `localhost`) |
| `SECURITY_HSTS_ENABLED` | Enable HSTS header in Nginx and Express (default: `true`) |

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

## Database Backup Automation

Automated daily PostgreSQL backups run inside Docker via a cron-based container.

### Configuration

Set these variables in your `.env` file:

| Variable | Description | Example |
|---|---|---|
| `DB_BACKUP_NAME` | Database name to back up | `realestate` |
| `DB_BACKUP_USER` | PostgreSQL username | `postgres` |
| `DB_BACKUP_PASSWORD` | PostgreSQL password | *(your password)* |
| `DB_BACKUP_PATH` | Host path for backup storage | `/opt/realestateai/backups` |

### Backup Schedule

Backups run daily at **3:00 AM UTC** by default. To change the schedule, edit the cron expression in `docker-compose.yml` under the `db-backup` service:

```yaml
# Format: minute hour day month weekday
# Example: every 6 hours
"0 */6 * * * DB_HOST=db /scripts/backup_db.sh ..."
```

### Manual Backup

```bash
docker-compose exec db-backup /scripts/backup_db.sh realestate postgres postgres /backups
```

### Restoring a Backup

```bash
# Decompress and restore
gunzip -c /opt/realestateai/backups/real_estate_ai_backup_2026-03-19_03-00-00.sql.gz \
  | docker-compose exec -T db psql -U postgres -d realestate
```

### Backup Logs

Logs are written to `scripts/backup.log` inside the backup container. To view:

```bash
docker-compose exec db-backup cat /scripts/backup.log
```

## SSL/HTTPS Configuration

The production deployment uses Nginx as a reverse proxy with SSL termination via Let's Encrypt certificates managed by Certbot.

### Architecture

```
Client → Nginx (port 443, SSL) → Express app (port 4041, internal)
         ↓ (port 80 redirects to 443)
```

### SSL Certificate Files

Certificates are managed by Certbot and stored in a Docker volume (`certbot_conf`). The live certificate symlinks are at:

- **Certificate:** `/etc/letsencrypt/live/<your-domain>/fullchain.pem`
- **Private key:** `/etc/letsencrypt/live/<your-domain>/privkey.pem`
- **Chain:** `/etc/letsencrypt/live/<your-domain>/chain.pem`

### Initial Certificate Setup

1. Set your domain in `.env`:

```bash
NGINX_HOST=yourdomain.com
SECURITY_HSTS_ENABLED=true
```

2. Obtain the initial certificate (run from the project root):

```bash
# Start nginx temporarily to serve the ACME challenge
docker-compose up -d nginx

# Request the certificate
docker-compose run --rm certbot certonly \
  --webroot --webroot-path=/var/www/certbot \
  -d yourdomain.com -d www.yourdomain.com \
  --email your-email@example.com --agree-tos --no-eff-email

# Restart nginx to pick up the new certificate
docker-compose restart nginx
```

3. Start all services:

```bash
docker-compose up -d
```

### Certificate Renewal

The `certbot` container automatically checks for renewal every 12 hours. Certificates are renewed 30 days before expiry.

To manually trigger a renewal:

```bash
docker-compose run --rm certbot renew
docker-compose exec nginx nginx -s reload
```

### Nginx Configuration

The SSL configuration in `nginx/nginx.conf` includes:

- **TLS 1.2 and 1.3 only** — older protocols (SSLv3, TLSv1, TLSv1.1) are disabled
- **Strong cipher suites** — ECDHE + AES-GCM/CHACHA20 ciphers
- **OCSP Stapling** — enabled for faster TLS handshakes
- **HTTP to HTTPS redirect** — all port 80 traffic redirects to 443
- **HSTS** — toggled via `SECURITY_HSTS_ENABLED` env var (max-age=31536000, includeSubDomains, preload)
- **Security headers:**
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: geolocation=(), microphone=(), camera=()`

### HSTS Toggle

HSTS is controlled by the `SECURITY_HSTS_ENABLED` environment variable:

| Value | Effect |
|---|---|
| `true` (default) | Adds `Strict-Transport-Security` header in both Nginx and Express |
| `false` | HSTS header is omitted |

Set in `.env` and restart:

```bash
SECURITY_HSTS_ENABLED=false
docker-compose restart nginx
```

### Troubleshooting

- **Certificate not found:** Ensure you ran `certbot certonly` first and that `NGINX_HOST` matches the domain used during certificate issuance.
- **ACME challenge fails:** Verify port 80 is open and reachable from the internet. Check that DNS points to your server.
- **SSL Labs score below A:** Verify that `ssl_protocols` only lists TLSv1.2 and TLSv1.3 and that `ssl_ciphers` uses the configured strong suite.
- **Mixed content warnings:** Ensure all API calls and asset URLs use HTTPS. Check `CORS_ORIGIN` uses `https://`.
- **HSTS not working:** Verify `SECURITY_HSTS_ENABLED=true` in `.env` and restart the nginx container.

### Testing SSL

After deployment, verify the configuration:

1. Check HTTPS access: `curl -I https://yourdomain.com`
2. Check HTTP redirect: `curl -I http://yourdomain.com` (should return 301)
3. Run SSL Labs test: `https://www.ssllabs.com/ssltest/analyze.html?d=yourdomain.com`
4. Target: **A+** rating (requires HSTS with preload)

## Project Structure

```
├── src/              # React frontend source
├── backend/          # Express backend source
│   ├── prisma/       # Database schema & migrations
│   └── src/          # Server source code
├── nginx/            # Nginx reverse proxy with SSL
│   ├── nginx.conf    # Nginx configuration template
│   ├── Dockerfile    # Nginx Docker image
│   └── docker-entrypoint.sh  # HSTS toggle wiring
├── public/           # Static assets
├── dist/             # Built frontend output
├── Dockerfile        # Multi-stage production build
├── docker-compose.yml
└── .github/workflows/ci-cd.yml
```
