param([ValidateRange(1, 65535)][int]$Port = 3000)
$ErrorActionPreference = 'Stop'
Push-Location $PSScriptRoot
try {
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw 'Node.js를 찾을 수 없습니다. 승인된 Node.js 설치 안내를 확인하세요.' }
    node --no-warnings -e "require('node:sqlite').DatabaseSync"
    if ($LASTEXITCODE -ne 0) { throw 'SQLite를 지원하는 Node.js 22.13 이상이 필요합니다.' }
    Write-Host "브라우저에서 http://127.0.0.1:$Port 를 여세요. 종료는 Ctrl+C입니다."
    node server.mjs $Port
    if ($LASTEXITCODE -ne 0) { throw '서버를 시작하지 못했습니다. 설치와 포트를 확인하세요.' }
} finally {
    Pop-Location
}
