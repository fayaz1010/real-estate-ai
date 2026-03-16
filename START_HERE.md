# 🚀 Real Estate Platform - Quick Start Guide

## ⚡ Quick Start (Run Both Servers)

### Option 1: Using npm script (Recommended)
```bash
npm run dev:all
```

### Option 2: Using PowerShell script
```powershell
.\start-dev.ps1
```

### Option 3: Using Batch script
```cmd
start-dev.bat
```

### Option 4: Manual (Two terminals)
**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

---

## 🛑 Stop Servers

### Stop all servers at once:
```powershell
.\stop-dev.ps1
```

### Or press `Ctrl+C` in each terminal window

---

## 🌐 Access Your Application

Once both servers are running:

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:4040 |
| **Backend API** | http://localhost:4041/api |
| **Health Check** | http://localhost:4041/health |

---

## 📦 Available Scripts

### Frontend & Backend Together
```bash
npm run dev:all          # Start both servers
```

### Frontend Only
```bash
npm run dev              # Start frontend dev server
npm run build            # Build for production
npm run preview          # Preview production build
```

### Backend Only
```bash
npm run dev:backend      # Start backend dev server
npm run build:backend    # Build backend for production
```

### Other Commands
```bash
npm run lint             # Run ESLint
npm run test             # Run tests
npm run type-check       # TypeScript type checking
```

---

## 🧪 Test the Setup

### Test Backend API
```powershell
# Health check
Invoke-RestMethod -Uri "http://localhost:4041/health"

# API info
Invoke-RestMethod -Uri "http://localhost:4041/api"

# Register a test user
$body = @{
    email = "test@example.com"
    password = "password123"
    firstName = "John"
    lastName = "Doe"
    role = "TENANT"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:4041/api/auth/register" `
  -Method Post -Body $body -ContentType "application/json"
```

### Test Frontend
Open browser: http://localhost:4040

---

## 📁 Project Structure

```
RealEstateAI/
├── src/                    # Frontend source code
│   ├── modules/
│   │   ├── auth/          # Authentication module
│   │   ├── properties/    # Property listings module
│   │   ├── inspections/   # Inspection booking module
│   │   └── applications/  # Application management module
│   ├── store/             # Redux store
│   └── App.tsx            # Main app component
│
├── backend/               # Backend source code
│   ├── src/
│   │   ├── modules/       # API modules
│   │   ├── middleware/    # Express middleware
│   │   ├── config/        # Configuration
│   │   └── index.ts       # Server entry point
│   └── prisma/
│       └── schema.prisma  # Database schema
│
├── start-dev.ps1          # Start both servers (PowerShell)
├── start-dev.bat          # Start both servers (Batch)
├── stop-dev.ps1           # Stop all servers
└── package.json           # Frontend dependencies
```

---

## 🔧 Configuration

### Ports
- Frontend: **4040**
- Backend: **4041**
- Database: **5433** (PostgreSQL)

### Environment Files
- Frontend: `.env` (VITE_API_URL)
- Backend: `backend/.env` (DATABASE_URL, JWT secrets, etc.)

---

## 📚 API Documentation

### Auth Endpoints
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get profile (protected)
- PATCH `/api/auth/profile` - Update profile (protected)

### Properties Endpoints
- GET `/api/properties` - List properties
- POST `/api/properties` - Create property (protected)
- GET `/api/properties/:id` - Get property details
- PATCH `/api/properties/:id` - Update property (protected)

### Inspections Endpoints
- POST `/api/inspections` - Book inspection (protected)
- GET `/api/inspections/my-inspections` - User's inspections (protected)
- PATCH `/api/inspections/:id` - Update inspection (protected)

### Applications Endpoints
- POST `/api/applications` - Create application (protected)
- GET `/api/applications/my-applications` - User's applications (protected)
- PATCH `/api/applications/:id` - Update application (protected)
- POST `/api/applications/:id/submit` - Submit application (protected)

---

## 🐛 Troubleshooting

### Port Already in Use
```powershell
# Check what's using the port
Get-NetTCPConnection -LocalPort 4040
Get-NetTCPConnection -LocalPort 4041

# Stop the process
.\stop-dev.ps1
```

### Database Connection Error
```bash
# Check PostgreSQL is running on port 5433
# Update backend/.env if needed
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/realestate_db"
```

### Frontend Can't Connect to Backend
```bash
# Verify .env file exists with correct URL
cat .env
# Should contain: VITE_API_URL=http://localhost:4041/api
```

---

## ✅ You're Ready!

Run `npm run dev:all` and start building! 🚀

**Frontend**: http://localhost:4040
**Backend**: http://localhost:4041/api
