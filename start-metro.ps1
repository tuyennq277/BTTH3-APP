$ErrorActionPreference = 'Stop'
$nodeDir = Join-Path $PSScriptRoot '.tools\node-v24.21.0-win-x64'
if (-not (Test-Path (Join-Path $nodeDir 'npm.cmd'))) {
    throw 'Node.js portable chưa có trong .tools. Hãy cài Node.js 24 LTS.'
}
$env:PATH = "$nodeDir;$env:PATH"
& (Join-Path $nodeDir 'npm.cmd') start
