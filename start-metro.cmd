@echo off
setlocal
set "ROOT=%~dp0"
set "NODE_DIR=%ROOT%.tools\node-v24.21.0-win-x64"
if not exist "%NODE_DIR%\node.exe" (
  echo Thieu Node.js portable trong .tools.
  exit /b 1
)
curl.exe -fsS --max-time 2 http://127.0.0.1:8081/status 2>nul | findstr /C:"packager-status:running" >nul
if not errorlevel 1 (
  echo Metro dang chay tai http://127.0.0.1:8081
  exit /b 0
)
set "PATH=%NODE_DIR%;%PATH%"
cd /d "%ROOT%"
"%NODE_DIR%\node.exe" "%ROOT%node_modules\react-native\cli.js" start
exit /b %ERRORLEVEL%
