# Create directories
New-Item -ItemType Directory -Force -Path "frontend/src"
New-Item -ItemType Directory -Force -Path "frontend/src/context"
New-Item -ItemType Directory -Force -Path "frontend/src/components"
New-Item -ItemType Directory -Force -Path "frontend/src/pages"

# Move configuration files
Move-Item -Path "vite.config.js" -Destination "frontend/" -ErrorAction SilentlyContinue
Move-Item -Path "tailwind.config.js" -Destination "frontend/" -ErrorAction SilentlyContinue
Move-Item -Path "postcss.config.js" -Destination "frontend/" -ErrorAction SilentlyContinue
Move-Item -Path "index.html" -Destination "frontend/" -ErrorAction SilentlyContinue

# Move source files
Move-Item -Path "main.jsx" -Destination "frontend/src/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "index.css" -Destination "frontend/src/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "App.jsx" -Destination "frontend/src/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "Login.jsx" -Destination "frontend/src/" -Force -ErrorAction SilentlyContinue

# Move Components and Pages
Move-Item -Path "SocketContext.jsx" -Destination "frontend/src/context/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "Layout.jsx" -Destination "frontend/src/components/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "Dashboard.jsx" -Destination "frontend/src/pages/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "Positions.jsx" -Destination "frontend/src/pages/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "History.jsx" -Destination "frontend/src/pages/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "Analytics.jsx" -Destination "frontend/src/pages/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "Risk.jsx" -Destination "frontend/src/pages/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "Signals.jsx" -Destination "frontend/src/pages/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "Account.jsx" -Destination "frontend/src/pages/" -Force -ErrorAction SilentlyContinue

Write-Host "Frontend files organized."