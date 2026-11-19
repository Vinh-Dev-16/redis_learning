@echo off
setlocal
cd /d "%~dp0.."
docker compose stop learning-site
if errorlevel 1 echo Khong tim thay website dang chay hoac Docker Desktop chua san sang.
endlocal
