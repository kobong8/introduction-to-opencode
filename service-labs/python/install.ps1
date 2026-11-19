$ErrorActionPreference = 'Stop'
$pythonPath = if ($env:OS -eq 'Windows_NT') { '.venv\Scripts\python.exe' } else { './.venv/bin/python' }
Push-Location $PSScriptRoot
try {
    if (-not (Test-Path -LiteralPath $pythonPath)) {
        if (Get-Command py -ErrorAction SilentlyContinue) {
            py -3 -c "import sys; sys.exit(sys.version_info < (3, 10))"
            if ($LASTEXITCODE -eq 0) {
                py -3 -m venv .venv
            } else {
                throw 'Python 3.10 이상이 필요합니다. 승인된 설치 안내를 확인하세요.'
            }
        } elseif (Get-Command python -ErrorAction SilentlyContinue) {
            python -c "import sys; sys.exit(sys.version_info < (3, 10))"
            if ($LASTEXITCODE -ne 0) { throw 'Python 3.10 이상이 필요합니다.' }
            python -m venv .venv
        } else {
            throw 'Python을 찾을 수 없습니다. 승인된 Python 설치 안내를 확인하세요.'
        }
        if ($LASTEXITCODE -ne 0) { throw '가상환경을 만들지 못했습니다.' }
    }
    & $pythonPath -m pip install -r requirements.txt
    if ($LASTEXITCODE -ne 0) { throw '설치에 실패했습니다. 승인된 패키지 저장소와 연결 상태를 확인하세요.' }
    Write-Host '설치 완료. 다음으로 start.ps1을 실행하세요.'
} finally {
    Pop-Location
}
