param([string]$DeviceId)

$ErrorActionPreference = 'Stop'
$nodeDir = Join-Path $PSScriptRoot '.tools\node-v24.21.0-win-x64'
$sdkDir = if ($env:ANDROID_HOME) { $env:ANDROID_HOME } else { Join-Path $env:LOCALAPPDATA 'Android\Sdk' }
$jdkDir = if ($env:JAVA_HOME) { $env:JAVA_HOME } else { 'C:\Program Files\Android\Android Studio\jbr' }
foreach ($required in @((Join-Path $nodeDir 'npm.cmd'), (Join-Path $sdkDir 'platform-tools\adb.exe'), (Join-Path $jdkDir 'bin\java.exe'))) {
    if (-not (Test-Path $required)) { throw "Thiếu công cụ: $required" }
}
$env:ANDROID_HOME = $sdkDir
$env:JAVA_HOME = $jdkDir
$env:PATH = "$nodeDir;$jdkDir\bin;$sdkDir\platform-tools;$sdkDir\emulator;$env:PATH"
if ($DeviceId) {
    & (Join-Path $nodeDir 'npm.cmd') run android -- --no-packager --device $DeviceId
} else {
    & (Join-Path $nodeDir 'npm.cmd') run android -- --no-packager
}
