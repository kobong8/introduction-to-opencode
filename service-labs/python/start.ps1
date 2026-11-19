param([ValidateRange(1, 65535)][int]$Port = 8000)
$ErrorActionPreference = 'Stop'
$pythonPath = if ($env:OS -eq 'Windows_NT') { '.venv\Scripts\python.exe' } else { './.venv/bin/python' }
Push-Location $PSScriptRoot
try {
    if (-not (Test-Path -LiteralPath $pythonPath)) { throw '먼저 install.ps1을 실행하세요.' }
    Write-Host "브라우저에서 http://127.0.0.1:$Port 를 여세요. 종료는 Ctrl+C입니다."
    & $pythonPath -m uvicorn app:create_app --factory --host 127.0.0.1 --port $Port
    if ($LASTEXITCODE -ne 0) { throw '서버를 시작하지 못했습니다. 설치와 포트를 확인하세요.' }
} finally {
    Pop-Location
}
