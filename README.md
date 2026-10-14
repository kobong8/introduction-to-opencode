# OpenCode 팀 활용 가이드 — FastAPI

Python FastAPI + Uvicorn으로 실행하는 한국어 교육 웹사이트입니다. 11개 장, 확대된 글씨, 읽기·발표 모드, 검색·버전 필터, 복사, 진도 기능을 제공합니다. 인쇄 버튼과 전용 인쇄 동작은 사용자 요청으로 제거했습니다.

**서버 실행·원고 수정·배포에는 Node.js나 npm이 필요하지 않습니다.** 기존 React 화면은 미리 빌드한 `backend/static/`에 포함했습니다. 화면의 React/TypeScript 코드를 직접 수정할 때만 선택적으로 npm 빌드 도구를 사용합니다.

## 1. 실행 — Windows PowerShell

프로젝트 폴더에서 Python 3.12 이상으로 실행하세요. 처음 한 번:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

서버 시작:

```powershell
.\.venv\Scripts\python.exe run.py
```

**http://127.0.0.1:8000** 을 엽니다. 가상환경 활성화가 필요 없는 명령이므로 PowerShell 실행 정책을 바꿀 필요도 없습니다. 종료는 `Ctrl+C`입니다.

Python이 `python` 명령으로 잡히지 않으면 첫 명령을 `py -3.12 -m venv .venv`로 실행하세요.

## 2. 실행 — Linux/macOS

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python run.py
```

사용할 포트를 변경하거나 Python 코드 변경 시 자동 재시작하려면:

```powershell
.\.venv\Scripts\python.exe run.py --port 8080 --reload
```

## 3. 무엇이 바뀌었나

```text
브라우저 → FastAPI /                 → HTML + 로컬 JavaScript/CSS
         → FastAPI /api/documents    → CONTENTS.md + SOURCES.md
         → 기존 화면                → 검색·발표·복사·진도
```

- FastAPI가 웹페이지와 원고를 같은 주소에서 제공합니다. 별도의 프런트엔드 서버, CORS 설정, DB가 필요하지 않습니다.
- `CONTENTS.md`와 `SOURCES.md`는 요청할 때 읽습니다. **원고를 수정한 뒤 새로고침**하면 반영됩니다. 원고 변경은 서버 재시작이나 npm 빌드가 필요하지 않습니다.
- 서버나 원고 로딩이 실패하면 안내 문구와 다시 시도 버튼을 표시합니다.
- 진도는 기존처럼 브라우저의 `localStorage`에만 저장합니다. 서버로 전송하지 않습니다.
- 외부 폰트·CDN·분석 SDK·모델 호출은 없습니다. 초기 원고 요청은 같은 FastAPI 서버로만 전송합니다.

## 4. 유지된 사용법

- **읽기:** 요약, 접이식 전체 원고, 전체 펼치기/접기, 장별 목차·앵커·현재 장 강조.
- **발표:** 11개 장 요약, 이전/다음, 방향키, URL의 모드·장 상태, 새로고침·뒤로 가기.
- **검색:** 명령어·설명·단축키 검색과 OpenCode 기본 / 기존 OmO / 원본 dev 필터, 결과 없음 안내.
- **복사:** 코드·프롬프트 복사와 성공·실패 안내. 서버 환경이 일반 HTTP이면 브라우저가 클립보드 접근을 제한할 수 있으므로 팀 공개 서버에는 HTTPS를 권장합니다.
- **비교·출처:** A/B 예제, 업무 흐름도, 버전 배지, 공식 출처 링크와 제공 자료 확인일.
- **진도:** 읽음 표시, 새로고침 후 유지, 초기화. **다른 포트·도메인으로 이동하면 브라우저 저장소가 달라 기존 주소의 진도는 자동으로 옮겨지지 않습니다.**
- **모바일:** 390px 화면, 접이식 목차, 확대된 글씨, 표 안쪽 가로 스크롤.

## 교육 내용 보완 (2026-10-13)

- 03장: Ponytail(구현 단순화), Caveman(응답 간결화), Superpowers(테스트·디버깅 절차)와 사내 공통 스킬·하네스의 용도별 추천. 공개 도구는 참고 후보이며, 실제 업무에서는 항상 사내 제공 구성을 사용한다는 원칙을 명시했습니다.
- 05장: 프롬프트 다듬기와 작업지시서 축약에 사내 AI를 권장하고, 조건을 보존하는 복사 템플릿을 추가했습니다.
- 08·09장: 혼잡 시간에 사내 SonarQube·API 테스트·취약점 분석·Playwright E2E를 진행하고, 재현 증거와 우선순위를 다음 작업의 개선 조건으로 연결합니다.
- 추가 출처 S15–S19는 2026-10-13에 원본 자료로 확인했습니다. 사내 제공 여부와 효과를 측정한 자료는 아닙니다.

## 5. 배포

### GitHub Pages와의 차이

**GitHub Pages에서는 FastAPI 서버를 실행할 수 없습니다.** `Deploy from a branch`로 소스를 게시해도 Python 실행과 `/api/documents` 응답은 제공되지 않습니다. 저장소 루트의 `index.html`은 화면 개발용 진입점이며 정적 배포 완성본도 아닙니다. GitHub 저장소는 소스 관리에 그대로 사용할 수 있습니다.

사용자 요청으로 `.github`의 자동 테스트 워크플로도 제거했습니다. 현재 저장소에는 사용자 정의 Actions 워크플로가 없습니다. 다만 Pages의 `Deploy from a branch`를 켜두면 GitHub 자체의 `pages build and deployment` 작업은 별도로 실행될 수 있습니다. 이것까지 중지하려면 저장소 Settings → Pages에서 배포 Branch를 `None`으로 설정하고 저장하세요. 기존 Actions 실행 이력은 파일 삭제 후에도 남을 수 있습니다.

기존 github.io 주소의 정적 사이트는 새 FastAPI 서버로 자동 전환되지 않습니다. 실제 FastAPI 공개 주소는 배포할 서버에 따라 정해야 합니다. 이번 변경으로 GitHub Pages 설정이나 기존 공개 사이트를 삭제하지 않았습니다.

### Python 서버에 배포

필요한 파일은 `backend/` 전체(특히 **backend/static/**), `CONTENTS.md`, `SOURCES.md`, `requirements.txt`, `run.py`입니다. `src/`, `node_modules/`, `dist/`, `package.json`은 서버 실행에 필요하지 않습니다.

서버에서 의존성을 설치하고 아래 명령을 계속 실행합니다:

```bash
python -m pip install -r requirements.txt
python run.py --host 0.0.0.0 --port 8000
```

같은 네트워크의 팀원은 `http://서버IP:8000`으로 접속할 수 있습니다. 운영에서는 호스트의 서비스 관리자와 HTTPS 리버스 프록시를 사용하세요. `--reload`는 개발용입니다. 서버 방화벽과 실제 접속 주소는 해당 운영 환경에 맞게 설정합니다.

### Docker (선택)

```bash
docker build -t opencode-guide .
docker run --rm -p 8000:8000 opencode-guide
```

이미지에도 Python 실행 파일과 완성된 화면만 포함되며 Node.js 빌드는 없습니다. Docker 실행은 이번 환경에서 별도로 검증하지 않았습니다.

## 6. 테스트 — npm 없이 실행

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements-dev.txt
.\.venv\Scripts\python.exe -m playwright install chromium
.\.venv\Scripts\python.exe -m pytest
```

설치된 Edge를 사용하려면 Chromium 설치 대신:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'msedge'
.\.venv\Scripts\python.exe -m pytest
```

API만 검사할 때는 `.\.venv\Scripts\python.exe -m pytest -m "not browser"`를 실행합니다. 테스트가 임시 포트에 별도의 FastAPI 서버를 자동으로 띄웁니다. 화면 증거는 `qa/fastapi/`에 생성됩니다. 자동 Actions 워크플로는 제거했으며 테스트는 필요할 때 직접 실행합니다.

## 7. 화면 개발 — 필요할 때만 npm 사용

React 화면 소스도 유지했으므로 기존 디자인과 동작을 계속 수정할 수 있습니다. Node.js 22.12 이상을 사용합니다.

```powershell
npm.cmd ci
npm.cmd run build
```

이 명령은 `backend/static/`를 갱신합니다. **화면 소스와 backend/static을 함께 커밋**해야 Python 서버와 CI에서 최신 화면을 사용합니다. 기존 `dist/`는 사용하지 않습니다. 본문 원고만 바꿀 때에는 이 과정이 필요 없습니다.

화면 개발용 실시간 미리보기는 FastAPI를 8000 포트에서 실행한 상태로 `npm.cmd run dev`를 별도 터미널에서 실행합니다. Vite가 `/api` 요청을 FastAPI로 전달합니다. `npm.cmd run preview`도 API를 위해 FastAPI 서버가 필요합니다. Python만 사용하는 기본 실행·배포 미리보기는 `python run.py`입니다.

선택 개발 검사: `npm.cmd run typecheck`, `npm.cmd run test`. 기존 JavaScript 브라우저 테스트도 남겼으며 `npm.cmd run test:e2e`가 `.venv`의 FastAPI를 4173 포트에 띄웁니다. 기본 검증 경로는 Python pytest입니다.

## 주요 파일

| 경로 | 역할 |
|---|---|
| `run.py` | Python 실행 진입점 |
| `backend/main.py` | FastAPI 라우트·원고 API·정적 파일 |
| `backend/static/` | 서버에 포함된 완성 화면 |
| `CONTENTS.md`, `SOURCES.md` | 전체 원고·출처의 원본 |
| `src/App.tsx` | 기존 읽기·발표 화면 |
| `src/content.ts` | 서버 원고 로딩 |
| `src/parse-content.ts` | 원고 변환·명령어 검색 |
| `tests/python/` | API와 실제 브라우저 회귀 검증 |

원고의 11개 장과 `### 발표 요약` 형식은 유지하세요. 문서 확인일은 제공 자료 기준이며 설치 버전과 최신 제품 문서를 자동 확인한 날짜가 아닙니다. 사내 모델·버전·할당량·지원 담당자·엑셀 실습 방법은 계속 담당자 입력이 필요합니다.

공식 참고: [FastAPI 정적 파일](https://fastapi.tiangolo.com/tutorial/static-files/), [서버 실행](https://fastapi.tiangolo.com/deployment/manually/), [GitHub Pages의 서버 언어 제한](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).
