@echo off
cd /d "%~dp0"
echo === PRANA Sanctuary ===
if not exist node_modules (
  echo Installing packages ^(first time only, needs internet^)...
  call npm install
)
set OPEN_BROWSER=1
echo Building site...
call npm run build || goto :fail
echo.
echo Starting server - the address is printed below. Press Ctrl+C to stop.
call npm start
goto :eof
:fail
echo Build failed. See the messages above.
pause
