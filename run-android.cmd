@echo off
setlocal
set "ROOT=%~dp0"
set "NODE_DIR=%ROOT%.tools\node-v24.21.0-win-x64"
if not defined ANDROID_HOME set "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"
if not defined JAVA_HOME set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
if not exist "%NODE_DIR%\node.exe" (
  echo Thieu Node.js portable trong .tools.
  exit /b 1
)
if not exist "%ANDROID_HOME%\platform-tools\adb.exe" (
  echo Thieu Android SDK platform-tools tai %ANDROID_HOME%.
  exit /b 1
)
if not exist "%JAVA_HOME%\bin\java.exe" (
  echo Thieu Java tai %JAVA_HOME%.
  exit /b 1
)
set "PATH=%NODE_DIR%;%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\emulator;%PATH%"
cd /d "%ROOT%"
if "%~1"=="" (
  "%NODE_DIR%\node.exe" "%ROOT%node_modules\react-native\cli.js" run-android --no-packager
) else (
  "%NODE_DIR%\node.exe" "%ROOT%node_modules\react-native\cli.js" run-android --no-packager --device "%~1"
)
exit /b %ERRORLEVEL%
