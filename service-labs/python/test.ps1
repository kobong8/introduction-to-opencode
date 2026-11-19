$ErrorActionPreference = 'Stop'
$pythonPath = if ($env:OS -eq 'Windows_NT') { '.venv\Scripts\python.exe' } else { './.venv/bin/python' }
Push-Location $PSScriptRoot
try {
    if (-not (Test-Path -LiteralPath $pythonPath)) { throw '먼저 install.ps1을 실행하세요.' }
    & $pythonPath -m unittest -v
    if ($LASTEXITCODE -ne 0) { throw '테스트에 실패했습니다. 위 출력에서 실패한 항목을 확인하세요.' }
} finally {
    Pop-Location
}
