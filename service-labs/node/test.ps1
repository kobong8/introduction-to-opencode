$ErrorActionPreference = 'Stop'
Push-Location $PSScriptRoot
try {
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw 'Node.js를 찾을 수 없습니다. 승인된 Node.js 설치 안내를 확인하세요.' }
    node --no-warnings -e "require('node:sqlite').DatabaseSync"
    if ($LASTEXITCODE -ne 0) { throw 'SQLite를 지원하는 Node.js 22.13 이상이 필요합니다.' }
    node --test test.mjs
    if ($LASTEXITCODE -ne 0) { throw '테스트에 실패했습니다. 위 출력에서 실패한 항목을 확인하세요.' }
} finally {
    Pop-Location
}
