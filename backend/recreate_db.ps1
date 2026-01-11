# Recreate Database (Drops and Re-seeds)

# Check for Docker availability
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    $possiblePaths = @(
        "$env:ProgramFiles\Docker\Docker\resources\bin",
        "$env:ProgramFiles\Docker\Docker\resources",
        "$env:ProgramW6432\Docker\Docker\resources\bin",
        "$env:ProgramW6432\Docker\Docker\resources",
        "C:\Program Files\Docker\Docker\resources\bin",
        "C:\Program Files\Docker\Docker\resources"
    )

    # Try to find via Registry (for custom install locations)
    $dockerInstall = Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\Docker Desktop" -ErrorAction SilentlyContinue
    if ($dockerInstall -and $dockerInstall.InstallLocation) {
        $possiblePaths += "$($dockerInstall.InstallLocation)\resources\bin"
        $possiblePaths += "$($dockerInstall.InstallLocation)\resources"
    }

    $found = $false
    foreach ($path in $possiblePaths) {
        if (Test-Path "$path\docker.exe") {
            Write-Host "Docker found at $path. Adding temporarily..." -ForegroundColor Yellow
            $env:Path = "$path;$env:Path"
            $found = $true
            break
        }
    }
    if (-not $found) {
        Write-Error "Docker is not installed or not in the system PATH. Please install Docker Desktop and restart your terminal."
        exit 1
    }
}

Write-Host "Stopping backend service to release DB connections..."
docker compose stop backend

Write-Host "Recreating database (Drop & Seed)..."
docker compose run --rm backend npm run db:setup

if ($LASTEXITCODE -ne 0) {
    Write-Error "Database setup failed!"
    exit 1
}

Write-Host "Restarting backend service..."
docker compose up -d backend

Write-Host "Database recreated successfully!"