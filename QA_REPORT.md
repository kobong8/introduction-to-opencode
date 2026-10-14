## 2026-10-14 정적 GitHub Pages 배포 전환

- 배포 대상: main / (root). 루트에 완성된 HTML·JS·CSS·아이콘·.nojekyll 포함.
- FastAPI 및 원고 API 제거. 원고는 빌드 시 포함. 사용자 정의 Actions workflow 없음.
- npm run build 성공, 원고 단위 테스트 5개 통과, Edge 브라우저 테스트 5개 통과.
- 읽기·발표·검색·필터·복사·진도·모바일·차단된 저장소·발표 링크 새로고침 검증.
- /introduction-to-opencode/에서 자산 오류와 API 요청 없이 로딩되는지 검증.
- 390px 모바일 화면 검토. 로고 깨짐과 가로 넘침 없음. 인쇄 기능 없음.
- npm run dev에서도 13개 섹션 로딩 확인.
- 아래는 이전 구현 시점의 검증 기록입니다. 현재 배포 절차는 README.md를 따릅니다.

# 검증 보고서

## 워크플로 제거 (2026-10-14)

사용자 요청으로 `.github/workflows/python-checks.yml`과 비어 있는 `.github` 디렉터리를 제거했습니다. 앱 코드는 변경하지 않았으므로 기존 기능 테스트를 반복하지 않았습니다. README의 자동 CI 안내를 직접 실행하는 테스트 안내로 갱신했습니다. 아래 CI 관련 설명은 변경 이전의 이력입니다. Pages 설정은 원격에서 변경하지 않았으므로 GitHub가 관리하는 Pages 배포 작업은 별도로 남을 수 있습니다.

## 최신 변경 — 인쇄 제거·사내 AI·스킬 추천·혼잡 시간 운영 (2026-10-14 검증)

- 인쇄 버튼, `window.print`, beforeprint/afterprint 처리, 전용 인쇄 CSS를 제거했습니다. 브라우저 자체의 인쇄 메뉴는 브라우저 기본 기능입니다.
- 03장에 Ponytail·Caveman·Superpowers·사내 공통 규칙·OmO 구성의 용도별 추천을 추가했습니다. 공개 프로젝트는 참고 후보이며 실제 업무에서는 항상 사내 제공 모델·스킬·하네스·검증 도구를 사용하도록 명시했습니다.
- 05장에 사내 AI를 통한 프롬프트 다듬기와 작업지시서 축약, 조건 보존 템플릿을 추가했습니다.
- 08·09장에 혼잡 시간의 사내 SonarQube·API 테스트·취약점 분석·Playwright E2E와 다음 작업으로 넘길 개선 기록을 추가했습니다. 모델 호출 없는 검증 우선, 공유 테스트 서버 부하, 사내 데이터 전송·저장 위치를 함께 설명합니다.
- S15–S19는 2026-10-13에 공개 원본을 확인했고, 기존 S01–S14의 확인일은 유지했습니다. 화면에 해당 장의 출처 확인일을 구분해 표시합니다.

검증: `npm.cmd run build`(타입 검사 포함) 통과, `npm.cmd run test` 5개 통과. Edge를 사용하는 `.venv\\Scripts\\python.exe -m pytest` **19개 통과, 10.42초**. 기존 Starlette TestClient의 httpx 폐기 예정 경고 1건 외 실패 없음.

인쇄 UI 부재, 인쇄 전 이벤트로 원고가 자동으로 열리지 않는 점, 새 안내·출처·발표 요약과 나머지 기존 동작을 검증했습니다. `qa/fastapi/recommendations-1440.png`, `busy-time-presentation-1440.png`, `mobile-390.png`를 직접 확인했습니다. 출력된 과거 PDF와 인쇄 캡처는 이전 검증 이력이며 이번 테스트에서는 생성하지 않습니다.

SonarQube·외부 스킬은 교육 내용으로 소개했으며 설치하거나 사내 분석을 실행하지 않았습니다. 원격 push·배포도 수행하지 않았습니다. 아래 보고서는 과거 단계별 검증 이력입니다.

## 현재 버전 — FastAPI 전환 (2026-10-13)

실행 환경: Windows, Python 3.12.7, FastAPI 0.143.0, Uvicorn 0.54.0, pytest 9.1.1, Python Playwright 1.63.0, 설치된 Microsoft Edge.

### 실제 실행 결과

| 검사 | 실행 | 결과 |
|---|---|---|
| 화면 번들 생성·타입 검사 | `npm.cmd run build` | 통과, `backend/static/`에 290개 모듈 빌드 |
| 기존 원고·검색 파서 | `npm.cmd run test` | 5개 통과 |
| Python 서버·배포 패키지·브라우저 | `$env:PLAYWRIGHT_CHANNEL='msedge'; .\.venv\Scripts\python.exe -m pytest` | **18개 통과**, 13.70초 |
| Python 의존성 | `.\.venv\Scripts\python.exe -m pip check` | 충돌 없음 |
| 실제 실행 | `.\.venv\Scripts\python.exe run.py` | 127.0.0.1:8000, `/` HTTP 200, `/healthz` 정상 |
| 변경 형식 | `git diff --check` | 오류 없음 |

pytest에서 Starlette TestClient의 httpx 사용에 대한 폐기 예정 경고 1건이 나왔습니다. 테스트 실패는 없으며 운영 서버 경고가 아닙니다.

### 기능 보존 검증

- API가 기존 `CONTENTS.md`와 `SOURCES.md` 전체 내용을 그대로 반환하며 11개 장과 14개 출처 유지.
- 실제 Python 서버를 임시 포트에 띄워 테스트. 기존 Vite 서버를 재사용하지 않음.
- 읽기·발표 전환, 11개 슬라이드 이동, 방향키와 양 끝 경계, URL·새로고침·뒤로 가기.
- 목차·모바일 메뉴·앵커, 검색·버전 필터·0건 초기화, A/B 비교·흐름도·출처.
- 클립보드 실제 복사와 실패 안내, 읽음 유지·초기화, localStorage 차단 환경.
- 1440px 데스크톱과 390px 모바일, 가로 넘침 없음, 키보드 건너뛰기 링크.
- 전체 원고 펼치기, 인쇄 미디어와 PDF 생성, 발표 중 인쇄 버튼 전환.
- API 실패 안내와 다시 시도 성공, API에서 바뀐 원고가 화면에 반영됨.
- 원고 파일을 바꾸면 서버 재시작·프런트엔드 빌드 없이 다음 요청에 반영됨.
- `src`, `node_modules`, `dist`, `package.json`이 없는 임시 배포 폴더를 구성하고 PATH를 비운 별도 Python 프로세스에서 웹페이지와 원고 API 정상 응답 확인.
- 브라우저 테스트 전체에서 외부 origin 요청 0건, JavaScript 예외 0건.
- 공개 대상 외 경로(`.git`, 소스, requirements, 정적 파일 경로 이탈 등)는 404 응답.

### 화면 증거

`qa/fastapi/desktop-1440.png`, `mobile-390.png`, `presentation-1440.png`, `mobile-presentation-390.png`, `print-preview.png`, `guide-print.pdf`, `server.log`에 생성했습니다. 데스크톱·모바일 캡처를 직접 확인해 확대된 글씨와 기존 레이아웃이 유지됨을 확인했습니다. 이 디렉터리는 재생성 가능한 검증 결과이므로 Git에서 제외합니다.

### 배포 상태와 제한

- 화면 실행과 원고 수정에는 Python만 필요. React 화면 코드 변경 시에는 선택적으로 npm 빌드 후 `backend/static/`도 함께 갱신해야 합니다.
- `.github/workflows/deploy-pages.yml`을 `.github/workflows/python-checks.yml`로 교체. npm 설치·Pages 배포 단계가 없으며 Python API·브라우저 검증을 수행하도록 구성했습니다.
- GitHub Pages는 Python 서버를 호스팅하지 않으므로 실제 FastAPI 배포에는 Python 서버가 필요합니다. 기존 공개 Pages 설정은 변경하지 않았습니다.
- 이번 변경은 로컬에서 완료했으며 Git commit·push, 원격 Actions, 외부 서버 배포는 수행하지 않았습니다.
- Docker는 설치되어 있지 않아 Dockerfile 빌드·실행 미검증. CI의 Linux Chromium 실행도 원격에서는 아직 미검증입니다.
- 새 포트·도메인의 브라우저 진도 저장소는 기존 주소와 분리됩니다. 같은 출처에서는 기존 저장 키를 그대로 사용합니다.
- 인쇄 PDF 생성과 상세 원고 표시를 검증했으며, 모든 PDF 페이지의 시각 검수와 실제 프린터 출력은 수행하지 않았습니다.

아래는 FastAPI 전환 전 정적 사이트의 검증 이력입니다. 현재 실행·배포 명령은 README와 위 결과를 따릅니다.

검증일: 2026-10-01. Windows / Node.js 24.20.0 / npm 11.19.0 / 설치된 Microsoft Edge (Playwright headless).

## 글씨 확대 후 추가 검증

- 본문 14→18px, 모바일 본문 13→17px, 목차 14px, 버튼 14–16px, 표 16px, 코드 15px로 확대했습니다. 화면용 스타일은 `src/typography.css`에 분리했고 인쇄 크기는 유지했습니다.
- `npm.cmd run build`: 타입 검사와 빌드 통과, 289개 모듈.
- 최종 빌드 미리보기 대상 `npm.cmd run test:e2e`: 4개 통과, 7.0초. 390px 가로 넘침 없음, 1440px·390px 스크린샷 갱신.
- GitHub Pages Actions 배포 설정을 추가했습니다. 실제 GitHub 저장소 생성·push·원격 Actions 실행·공개 배포는 수행하지 않았습니다. 로컬 빌드 및 브라우저 검증 결과와 원격 배포 여부는 구분합니다.

## 최종 결과

| 검사 | 실행 | 결과 |
|---|---|---|
| 타입 검사 | `npm.cmd run typecheck` | 통과, 오류 0건 |
| 정적 빌드 | `npm.cmd run build` | 통과, 288개 모듈, dist 생성 |
| 콘텐츠·검색 | `npm.cmd run test` | 5개 테스트 통과 |
| 개발 서버 브라우저 테스트 | `npm.cmd run test:e2e` | 4개 테스트 통과, 11.7초 |
| 최종 빌드 브라우저 테스트 | `npm.cmd run preview -- --port 4173` 실행 후 `npm.cmd run test:e2e` | 4개 테스트 통과, 8.2초 |
| 의존성 검사 | 수정 버전 설치 시 npm audit | 취약점 0건 |

## 실제 확인한 사용자 흐름

- 11개 장의 고유 ID, 각 장의 요약 3개, 본문과 모든 출처 ID 확인.
- 명령어·설명·단축키 검색, 대소문자·앞뒤 공백 처리, 버전 결합 필터.
- OpenCode 기본 / 기존 OmO / 원본 dev 구분, 검색 0건과 초기화.
- 1440×1000 데스크톱과 390×844 모바일 화면.
- 목차 앵커 이동, 모바일 메뉴 열기·선택 후 닫기, 현재 장 표시.
- 읽기 ↔ 발표, 다음·이전, 방향키, 첫 장·마지막 장 경계.
- 발표 URL 새로고침과 뒤로 가기.
- 클립보드 실제 복사 및 읽어온 문자열 확인, 권한 실패를 강제로 발생시켜 원문 선택 안내 확인.
- 읽음 기록의 새로고침 후 유지, localStorage 접근이 차단된 환경의 정상 작동.
- 키보드 Tab으로 본문 건너뛰기 링크 접근.
- 모바일 본문·펼친 코드·발표에서 문서 전체 가로 넘침 없음.
- 전체 원고 펼치기 및 발표 모드 인쇄 버튼이 읽기 원고로 전환한 뒤 11개 상세 원고를 여는 동작.
- 인쇄 CSS에서 목차 숨김, 상세 원고 표시, A4 PDF 파일 생성.
- 초기 로드·검색·복사·모드 전환·재로딩 과정에서 **외부 origin 요청 0건, 페이지 JavaScript 예외 0건**. 출처를 실제 클릭한 이후의 외부 사이트 요청은 검사 대상에서 제외.

## 시각 증거

- [데스크톱](qa/desktop-1440.png)
- [모바일](qa/mobile-390.png)
- [발표 화면](qa/presentation-1440.png)
- [모바일 발표](qa/mobile-presentation-390.png)
- [인쇄 미디어 화면](qa/print-preview.png)
- [브라우저 생성 PDF](qa/guide-print.pdf)

데스크톱·모바일·발표 스크린샷과 인쇄 미디어 화면을 직접 확인했습니다. PDF 생성과 상세 원고 렌더링은 확인했지만, PDF 모든 페이지의 페이지 나눔을 별도 PDF 렌더러로 시각 검수하지는 않았습니다. 네이티브 인쇄 대화상자에서 실제 프린터 출력은 미실행입니다.

## 수정한 문제

1. 최초 Vitest가 Playwright 파일까지 수집해 실패했습니다. 단위 테스트 대상을 `src`로 제한하고 재실행해 5개 모두 통과했습니다.
2. 최초 의존성 감사에서 Vitest 계열 moderate 2건이 보고되었습니다. Vitest 4.1.11로 갱신한 후 설치 감사 0건, 단위 테스트 재통과를 확인했습니다.
3. 최초 샌드박스 실행은 패키지 네트워크 및 esbuild의 상위 디렉터리 접근 제한으로 중단됐습니다. 승인된 실행으로 설치·빌드·브라우저 검증을 완료했습니다. 최종 소스의 빌드 오류는 없습니다.

## 남은 사내 입력과 범위

- 입력 필요: OpenCode 버전, OmO 버전·배포판, 승인 모델 ID, 설치 안내·보안 지침 링크, 할당량, 최신 혼잡 상태, 지원 담당자, 엑셀 실습 방법.
- 외부 제품 문서 최신 내용은 이번 구현에서 재확인하지 않았습니다. 제공 원고와 출처 목록의 확인일·버전 제한을 화면에 유지했습니다.
- 사내 배포, 인증, OpenCode 실행, 모델 호출, 실제 파일 업로드·처리는 범위에 포함하지 않았습니다.
- Trivy 검사, 다른 브라우저/운영체제, 스크린리더 정식 감사는 미실행입니다.
- 일반 HTTP 사내 호스팅은 클립보드 기능이 제한될 수 있으며, 실패 안내 경로를 테스트했습니다.

## 검증 재실행

```powershell
npm.cmd ci
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
npm.cmd run test:e2e
```

기본 브라우저 테스트는 4173 포트에서 개발 서버를 시작합니다. 같은 포트에 최종 빌드 미리보기 서버가 실행 중이면 이를 재사용합니다. 보고서의 최종 브라우저 테스트는 해당 미리보기 서버를 사용했습니다.
