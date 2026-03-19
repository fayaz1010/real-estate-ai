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

Automated daily PostgreSQL backups run inside Docker via a cron-based `db_backup` container using Alpine Linux with `bash` and `postgresql-client`.

### Configuration

1. Copy the example environment file and set your values:

```bash
cp .env.example .env
```

2. Set these variables in your `.env` file:

| Variable | Description | Example |
|---|---|---|
| `DB_BACKUP_DB_NAME` | Database name to back up | `realestate` |
| `DB_BACKUP_DB_USER` | PostgreSQL username | `postgres` |
| `DB_BACKUP_DB_PASSWORD` | PostgreSQL password | *(your password)* |
| `DB_BACKUP_PATH` | Host path for backup storage | `./db_backups` |

3. Start all services including the backup container:

```bash
docker-compose up --build
```

The `db_backup` service depends on the `db` service and will wait for the database to be healthy before starting.

### Backup Schedule

Backups run daily at **3:00 AM UTC** by default. To change the schedule, edit the cron expression in `docker-compose.yml` under the `db_backup` service:

```yaml
# Format: minute hour day month weekday
# Example: every 6 hours
"0 */6 * * * DB_HOST=db /scripts/backup_db.sh ..."
```

Backup files are stored in the `db_backups/` directory with the format `real-estate-ai-backup-YYYY-MM-DD-HH-MM-SS.sql.gz`.

### Manual Backup

```bash
docker-compose exec db_backup /scripts/backup_db.sh realestate postgres postgres /backups
```

### Restoring a Backup

```bash
# Decompress and restore
gunzip -c db_backups/real-estate-ai-backup-2026-03-20-03-00-00.sql.gz \
  | docker-compose exec -T db psql -U postgres -d realestate
```

### Backup Logs

Logs are written to `scripts/backup.log` inside the backup container. To view:

```bash
docker-compose exec db_backup cat /scripts/backup.log
```

### Error Handling

The backup script exits with a non-zero exit code if `pg_dump` fails, the database is unreachable, or the backup file is empty. The `db_backup` service will reflect this exit code.

## SSL/HTTPS Configuration

The production deployment uses Nginx as a reverse proxy with SSL termination via Let's Encrypt certificates managed by Certbot.

### Architecture

```
Client → Nginx (port 443, SSL) → Express app (port 4041, internal)
         ↓ (port 80 redirects to 443)
```

### Installing Certbot

#### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install -y certbot
# If using Nginx directly (non-Docker):
sudo apt install -y python3-certbot-nginx
```

#### Linux (RHEL/CentOS/Fedora)

```bash
sudo dnf install -y certbot
# If using Nginx directly (non-Docker):
sudo dnf install -y python3-certbot-nginx
```

#### Windows

1. Install via [Certbot for Windows](https://dl.eff.org/certbot-beta-installer-win_amd64.exe) (official EFF installer).
2. Or use `winget`:

```powershell
winget install --id EFF.Certbot
```

3. After installation, `certbot` is available in your terminal. For Docker-based deployments (recommended), Certbot runs inside the container — no host installation needed.

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

2. Obtain the initial certificate:

**Docker (recommended for both Linux and Windows):**

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

**Standalone (Linux only, without Docker):**

```bash
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com \
  --email your-email@example.com --agree-tos --no-eff-email
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

**Linux standalone auto-renewal** (if not using Docker):

```bash
# Certbot installs a systemd timer or cron job automatically.
# Verify with:
sudo systemctl list-timers | grep certbot
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

### Express Backend Configuration

The Express backend is configured to work behind the Nginx proxy:

- **`trust proxy`** is set to `1` so Express correctly resolves client IPs from the `X-Forwarded-For` header (required for rate limiting and secure cookies).
- **Helmet** provides base security headers. CSP, HSTS, and XSS protection are toggled via environment variables (see below).
- **Cookie parser** is enabled for the CSRF double-submit cookie pattern.

### Security Environment Variables

All security toggles in the backend `.env`:

| Variable | Default | Effect |
|---|---|---|
| `SECURITY_CSRF_ENABLED` | `true` | Enables CSRF double-submit cookie validation on POST/PUT/PATCH/DELETE |
| `SECURITY_CSP_ENABLED` | `true` | Enables Content-Security-Policy header |
| `SECURITY_HSTS_ENABLED` | `true` | Enables HSTS header in both Nginx and Express (max-age=1 year, includeSubDomains, preload) |
| `SECURITY_XSS_ENABLED` | `true` | Enables X-XSS-Protection header |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Global rate limit window (15 minutes) |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Max requests per window globally |

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

### Rate Limiting

Authentication endpoints have stricter rate limits to prevent brute-force attacks:

| Endpoint | Window | Max Requests |
|---|---|---|
| `POST /api/auth/login` | 15 minutes | 10 |
| `POST /api/auth/register` | 15 minutes | 10 |
| `POST /api/auth/forgot-password` | 15 minutes | 10 |
| `POST /api/auth/reset-password` | 15 minutes | 10 |
| Other auth endpoints | 15 minutes | 50 |
| Global (all routes) | 15 minutes | 100 |

### Troubleshooting

- **Certificate not found:** Ensure you ran `certbot certonly` first and that `NGINX_HOST` matches the domain used during certificate issuance.
- **ACME challenge fails:** Verify port 80 is open and reachable from the internet. Check that DNS points to your server.
- **SSL Labs score below A:** Verify that `ssl_protocols` only lists TLSv1.2 and TLSv1.3 and that `ssl_ciphers` uses the configured strong suite.
- **Mixed content warnings:** Ensure all API calls and asset URLs use HTTPS. Check `CORS_ORIGIN` uses `https://`.
- **HSTS not working:** Verify `SECURITY_HSTS_ENABLED=true` in `.env` and restart the nginx container.
- **CSRF errors on POST requests:** Ensure the frontend reads the `_csrf_token` cookie and sends it in the `x-csrf-token` request header.
- **Rate limit hit on login:** Wait 15 minutes or adjust `strictAuthRateLimiter` values in `auth.routes.ts`.
- **Certbot on Windows:** Use Docker-based Certbot (recommended). Native Windows Certbot has limited plugin support.

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
