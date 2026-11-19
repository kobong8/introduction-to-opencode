$ErrorActionPreference = 'Stop'
Push-Location $PSScriptRoot
try {
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw 'Node.js를 찾을 수 없습니다. 승인된 Node.js 설치 안내를 확인하세요.' }
    node --no-warnings -e "require('node:sqlite').DatabaseSync"
    if ($LASTEXITCODE -ne 0) { throw 'SQLite를 지원하는 Node.js 22.13 이상이 필요합니다.' }
    Write-Host '준비 완료. 이 예제는 Node.js 내장 기능을 사용합니다. 다음으로 start.ps1을 실행하세요.'
} finally {
    Pop-Location
}
