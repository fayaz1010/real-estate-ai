# Database Setup Options

## ❌ Current Issue
PostgreSQL is not running on your system at `localhost:5432`

## ✅ Solution Options

### Option 1: Install & Start PostgreSQL (Recommended for Production)

#### Windows Installation:
1. **Download PostgreSQL**: https://www.postgresql.org/download/windows/
2. **Install** with default settings (username: `postgres`, password: `postgres`)
3. **Start PostgreSQL Service**:
   ```powershell
   # Start PostgreSQL service
   Start-Service postgresql-x64-16  # or your version
   
   # Or use pgAdmin to start the server
   ```

4. **Create Database**:
   ```powershell
   # Using psql command line
   psql -U postgres
   CREATE DATABASE realestate_db;
   \q
   ```

5. **Run Prisma Migration**:
   ```bash
   cd backend
   npx prisma db push
   npm run dev
   ```

---

### Option 2: Use SQLite (Quick Testing - No Installation)

**Pros**: No database server needed, works immediately
**Cons**: Limited features, not for production

#### Steps:
1. Update `backend/prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = "file:./dev.db"
   }
   ```

2. Update `backend/.env`:
   ```
   DATABASE_URL="file:./dev.db"
   ```

3. Run:
   ```bash
   cd backend
   npx prisma db push
   npm run dev
   ```

---

### Option 3: Use Docker PostgreSQL (Easiest)

If you have Docker installed:

```bash
# Run PostgreSQL in Docker
docker run --name realestate-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=realestate_db \
  -p 5432:5432 \
  -d postgres:16

# Then run migrations
cd backend
npx prisma db push
npm run dev
```

---

### Option 4: Use Cloud Database (Supabase - Free)

1. Go to https://supabase.com
2. Create free account
3. Create new project
4. Get connection string from Settings > Database
5. Update `backend/.env`:
   ```
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT].supabase.co:5432/postgres"
   ```
6. Run:
   ```bash
   cd backend
   npx prisma db push
   npm run dev
   ```

---

## 🚀 Quick Start (SQLite - Recommended for Now)

**Want to test immediately? Use SQLite:**

I can convert your schema to SQLite right now so you can run the backend immediately without installing PostgreSQL.

**Shall I convert to SQLite for quick testing?** (You can switch to PostgreSQL later)
