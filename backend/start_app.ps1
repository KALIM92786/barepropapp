# Script to start both Backend and Frontend servers

$backendPath = $PSScriptRoot
$frontendPath = Join-Path $PSScriptRoot "frontend"

# Ensure frontend files are organized before starting
if (Test-Path "$PSScriptRoot\fix_frontend.ps1") {
    Write-Host "Organizing frontend files..."
    & "$PSScriptRoot\fix_frontend.ps1"
}

Write-Host "Launching BareProp Backend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; npm run dev"

Write-Host "Launching BareProp Frontend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev"

Write-Host "Application launching in new windows..."