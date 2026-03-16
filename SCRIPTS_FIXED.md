# ✅ Scripts Fixed & Working!

## 🎉 Issue Resolved

The PowerShell script had encoding issues with special characters (emojis and parentheses). 
All scripts have been fixed and are now working perfectly!

---

## 🚀 How to Run Both Servers

### Method 1: PowerShell Script (Working!)
```powershell
.\start-dev.ps1
```

### Method 2: npm Script
```bash
npm run dev:all
```

### Method 3: Batch File
```cmd
start-dev.bat
```
Or double-click `start-dev.bat`

---

## ✅ What Happens

When you run `.\start-dev.ps1`:

1. **Two new terminal windows open**:
   - Terminal 1: Backend Server (Port 4041)
   - Terminal 2: Frontend Server (Port 4040)

2. **Both servers start automatically**

3. **You can access**:
   - Frontend: http://localhost:4040
   - Backend: http://localhost:4041
   - API: http://localhost:4041/api

---

## 🛑 How to Stop

### Option 1: Stop Script
```powershell
.\stop-dev.ps1
```

### Option 2: Manual
Press `Ctrl+C` in each terminal window

---

## 🧪 Verify It's Working

```powershell
# Test backend
Invoke-RestMethod -Uri "http://localhost:4041/health"

# Test API
Invoke-RestMethod -Uri "http://localhost:4041/api"
```

Then open browser: http://localhost:4040

---

## 📝 Files Available

✅ `start-dev.ps1` - Start both servers (FIXED)
✅ `start-dev.bat` - Batch alternative
✅ `stop-dev.ps1` - Stop all servers (FIXED)
✅ `package.json` - npm scripts configured

---

## 🎊 Ready to Code!

Just run:
```powershell
.\start-dev.ps1
```

Your full-stack Real Estate Platform is now running! 🚀
