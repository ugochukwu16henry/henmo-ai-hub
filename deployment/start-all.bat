@echo off
echo Starting HenMo AI Development Environment...

echo.
echo Starting API Server (Port 4000)...
start "API Server" cmd /k "cd apps\api && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Marketing Website (Port 3000)...
start "Marketing Website" cmd /k "cd apps\web && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Dashboard App (Port 3001)...
start "Dashboard App" cmd /k "cd apps\hub\hub && npm run dev -- -p 3001"

echo.
echo All services starting...
echo.
echo URLs:
echo Marketing Website: http://localhost:3000
echo Dashboard App: http://localhost:3001  
echo API Server: http://localhost:4000
echo.
echo Press any key to exit...
pause > nul