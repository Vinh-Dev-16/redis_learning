@echo off
setlocal
cd /d "%~dp0.."
docker info >nul 2>&1
if errorlevel 1 (
  echo Docker Desktop chua san sang. Hay mo Docker Desktop, cho Engine khoi dong roi chay lai launcher.
  pause
  exit /b 1
)
docker compose up -d --build
if errorlevel 1 (
  echo Khong the khoi dong website. Kiem tra Docker Desktop va thu lai.
  pause
  exit /b 1
)
start "" "http://localhost:4173"
endlocal
