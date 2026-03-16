# 🎯 How to Run Both Servers

## ⚡ FASTEST WAY - One Command

```bash
npm run dev:all
```

This will:
1. ✅ Start Backend on port 4041
2. ✅ Start Frontend on port 4040
3. ✅ Open both in separate terminal windows

---

## 🚀 All Available Methods

### Method 1: npm script (Recommended)
```bash
npm run dev:all
```

### Method 2: PowerShell script
```powershell
.\start-dev.ps1
```

### Method 3: Batch file (Double-click)
```
Double-click: start-dev.bat
```

### Method 4: Manual (Two terminals)
**Terminal 1:**
```bash
cd backend
npm run dev
```

**Terminal 2:**
```bash
npm run dev
```

---

## 🛑 How to Stop

### Stop all servers:
```powershell
.\stop-dev.ps1
```

### Or manually:
Press `Ctrl+C` in each terminal window

---

## 📍 URLs After Starting

| Service | URL |
|---------|-----|
| Frontend | http://localhost:4040 |
| Backend | http://localhost:4041 |
| API | http://localhost:4041/api |
| Health | http://localhost:4041/health |

---

## ✅ What You Get

When you run `npm run dev:all`:

1. **Backend Terminal** opens with:
   - Express server on port 4041
   - Database connected (PostgreSQL:5433)
   - All API endpoints active

2. **Frontend Terminal** opens with:
   - Vite dev server on port 4040
   - Hot module replacement enabled
   - Browser auto-opens

---

## 🧪 Quick Test

After starting, test in PowerShell:

```powershell
# Test backend
Invoke-RestMethod -Uri "http://localhost:4041/health"

# Test API
Invoke-RestMethod -Uri "http://localhost:4041/api"
```

Then open browser: http://localhost:4040

---

## 📝 Files Created

✅ `start-dev.ps1` - PowerShell script to start both
✅ `start-dev.bat` - Batch script to start both
✅ `stop-dev.ps1` - PowerShell script to stop all
✅ `package.json` - Updated with dev:all script

---

## 🎊 You're Ready!

Just run:
```bash
npm run dev:all
```

And start coding! 🚀
