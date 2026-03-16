# Stop Development Servers
# PowerShell Script

Write-Host "Stopping Development Servers..." -ForegroundColor Yellow
Write-Host ""

# Stop processes running on port 4040 (Frontend)
$frontend = Get-NetTCPConnection -LocalPort 4040 -ErrorAction SilentlyContinue
if ($frontend) {
    $frontendPid = $frontend.OwningProcess
    Write-Host "Stopping Frontend on Port 4040, PID: $frontendPid..." -ForegroundColor Cyan
    Stop-Process -Id $frontendPid -Force -ErrorAction SilentlyContinue
    Write-Host "Frontend stopped" -ForegroundColor Green
} else {
    Write-Host "No process found on port 4040" -ForegroundColor Gray
}

# Stop processes running on port 4041 (Backend)
$backend = Get-NetTCPConnection -LocalPort 4041 -ErrorAction SilentlyContinue
if ($backend) {
    $backendPid = $backend.OwningProcess
    Write-Host "Stopping Backend on Port 4041, PID: $backendPid..." -ForegroundColor Cyan
    Stop-Process -Id $backendPid -Force -ErrorAction SilentlyContinue
    Write-Host "Backend stopped" -ForegroundColor Green
} else {
    Write-Host "No process found on port 4041" -ForegroundColor Gray
}

Write-Host ""
Write-Host "All servers stopped!" -ForegroundColor Green
