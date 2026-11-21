@echo off
cd /d "%~dp0"
echo Starting My Learning Command Center...
start "My Learning Command Center" http://localhost:8771
node server.js
pause
