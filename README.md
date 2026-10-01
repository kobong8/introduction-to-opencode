# OpenCode 팀 활용 가이드

폴더의 `CONTENTS.md`, `SOURCES.md`, `PRD.md`, `TRD.md`를 바탕으로 만든 한국어 정적 교육 웹사이트입니다. React + TypeScript + Vite를 사용합니다.

## 실행

Node.js 22.12 이상을 권장합니다. 검증 환경은 Windows, Node.js 24.20.0, npm 11.19.0입니다.

```powershell
npm.cmd ci
npm.cmd run dev
```

표시되는 로컬 주소(기본 `http://127.0.0.1:5173`)를 엽니다. macOS/Linux에서는 `npm.cmd` 대신 `npm`을 사용합니다.

```powershell
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
npm.cmd run preview
npm.cmd run test:e2e
```

브라우저 테스트는 설치된 Microsoft Edge를 headless 모드로 사용합니다. 다른 환경에서는 `playwright.config.ts`의 `channel`을 환경에 맞추거나 Playwright Chromium을 설치해 사용하세요. 설치하지 않은 브라우저가 있다고 가정하지 않습니다.

## 사용 방법

- **읽기 모드:** 11개 장의 핵심 요약과 펼쳐 보는 전체 원고. 상단에서 전체 원고를 펼칠 수 있습니다.
- **발표 모드:** 장별 요약, 방향키 ← →, 이전/다음 버튼. URL에 모드와 장이 남으므로 새로고침과 공유가 가능합니다.
- **명령어:** 02장에서 명령어·기능·단축키를 검색하고 OpenCode 기본 / 기존 OmO / 현재 원본 dev로 필터링합니다.
- **복사:** 원고의 코드·프롬프트를 복사합니다. 클립보드 권한이 없으면 원문을 선택해 복사하도록 안내합니다.
- **인쇄:** 상단 인쇄 버튼으로 전체 원고와 출처 URL을 출력합니다. 발표 중에도 전체 읽기 문서로 전환한 뒤 인쇄합니다.
- **진도:** 읽은 장은 해당 브라우저에만 저장합니다. 저장이 막혀 있어도 사이트는 작동합니다.

## 콘텐츠 수정

`CONTENTS.md`가 전체 원고의 원본입니다. `## 01. 제목 {#why}` 형식의 11개 장, `### 발표 요약`, 부록 구조를 유지하세요. `SOURCES.md`의 S01–S14 표를 출처 데이터로 사용합니다. 수정 후 콘텐츠 테스트를 실행하세요.

- `src/content.ts`: 원고 변환, 짧은 제목, 버전별 추가 명령어, 출처 연결
- `src/components.tsx`: Markdown, 복사, 비교 예제, 명령어 검색, 흐름도
- `src/main.tsx`: 읽기·발표 화면, 목차, URL, 읽기 진도
- `src/styles.css`: 반응형 화면과 인쇄 스타일
- `tests/guide.spec.ts`: 실제 브라우저 사용자 흐름 검증

문서에 표시된 2026-10-01 확인일은 제공된 자료의 확인일입니다. 이번 구현에서 외부 제품 문서를 새로 검증한 날짜를 의미하지 않습니다. dev 문서를 사내 설치 버전으로 확정하지 않습니다. 각 장의 요약 배지는 대표 성격을 표시하며, 원고 내 공식 출처·교육용 예제·발표자 경험·설치판 주의 문구를 함께 보존했습니다.

## 배포

`npm.cmd run build`로 생성되는 **dist 폴더 전체**를 사내 정적 서버에 올립니다. JS가 사용하는 문서와 자산은 빌드에 포함되며 백엔드가 필요하지 않습니다. `dist/index.html`을 더블클릭하는 대신 HTTP 정적 서버에서 제공합니다. 상대 경로 빌드를 사용해 하위 경로에도 배치할 수 있습니다. 이번 작업에서 외부 배포나 사내 인증 연결은 수행하지 않았습니다.

운영 서버의 CSP 헤더 예시:

```text
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'
```

진도 표시의 inline style 때문에 위 예시의 style-src에 unsafe-inline이 포함됩니다. 개발 서버는 HMR WebSocket을 쓰므로 운영 CSP를 그대로 적용하지 마세요. 사이트는 외부 폰트·CDN·분석 SDK·API 호출을 사용하지 않습니다. 외부 출처는 클릭할 때 새 탭으로 열립니다. 의존성 설치 과정의 레지스트리 통신과 사이트 방문자의 런타임 통신은 별개입니다.

## GitHub Pages (github.io) 배포

GitHub Pages에 배포할 수 있습니다. `.github/workflows/deploy-pages.yml`에 자동 빌드·배포 설정을 추가했습니다. 이 파일을 GitHub에 올리기 전까지 실제 배포가 일어나지는 않습니다.

1. GitHub 저장소는 `kobong8/introduction-to-opencode`를 사용합니다.
2. 현재 프로젝트를 저장소의 **루트**에 올립니다. `.github`, `src`, `public`, `package.json`, `package-lock.json`, `index.html`, `vite.config.ts`, `tsconfig.json`, `CONTENTS.md`, `SOURCES.md`를 포함해야 합니다. `node_modules`와 `dist`는 `.gitignore`로 제외됩니다.
3. 저장소의 **Settings → Pages → Build and deployment → Source**에서 **GitHub Actions**를 선택합니다.
4. **Actions → Deploy to GitHub Pages → Run workflow**로 실행합니다. 이후 `main`에 push하면 자동 배포됩니다. 기본 브랜치 이름이 다르면 workflow의 `branches: [main]`도 바꾸세요.
5. Actions 작업이 성공하면 `https://kobong8.github.io/introduction-to-opencode/`를 엽니다. 팀원들은 링크만 열면 되며 Node.js를 설치할 필요가 없습니다.

Git 저장소가 없는 새 작업 폴더에서 처음 올릴 때는 아래 명령을 사용할 수 있습니다. 이미 연결한 폴더에서는 변경 내용을 commit한 뒤 `git push`만 실행하면 됩니다. Git 인증 요청이 나오면 본인 계정으로 로그인하세요.

```powershell
git init
git add .
git commit -m "Add OpenCode team guide"
git branch -M main
git remote add origin https://github.com/kobong8/introduction-to-opencode.git
git push -u origin main
```

소스 전체를 저장소 루트에 올리는 방식입니다. GitHub에 `index.html`만 올리거나 저장소의 소스 파일을 그대로 Pages 브랜치 배포 대상으로 지정하면 빌드된 React 페이지가 제공되지 않습니다. 준비된 Actions가 `npm ci`, 테스트, `npm run build`를 실행하고 **dist만** Pages로 배포합니다.

이 프로젝트는 `base: './'`로 빌드하고 앵커·쿼리로 화면 상태를 관리하므로 저장소 하위 경로에서 사용할 수 있습니다. 저장소명이 바뀌어도 base 값을 다시 고칠 필요가 없습니다. 로컬 미리보기와 배포 URL은 별개이며, `127.0.0.1` 주소는 다른 팀원의 컴퓨터에서 사용할 수 없습니다.

일반적인 GitHub Pages는 공개 웹사이트입니다. 현재 원고에 포함된 사내 운영 경험의 공개 가능 여부는 게시 전에 확인하세요. GitHub의 접근 제한 가능 여부는 조직 플랜과 Pages 설정에 따라 달라집니다.

공식 절차: [Vite GitHub Pages 배포 가이드](https://vite.dev/guide/static-deploy.html#github-pages).

## 사내 담당자 입력 필요

OpenCode 버전, OmO 버전과 배포판, 승인 모델 ID, 설치 안내 링크, 보안 지침 링크, 할당량, 최신 혼잡 시간, 지원 담당자, 엑셀 실습 방법. 인증값은 이 정적 사이트에 넣지 마세요.

## 검증 결과

타입 검사·프로덕션 빌드, 콘텐츠·검색 단위 테스트 5개, Edge 브라우저 흐름을 실행했습니다. 1440px·390px 스크린샷과 인쇄 PDF는 `qa/`에 있습니다. 상세 결과와 제한 사항은 [QA_REPORT.md](QA_REPORT.md)를 확인하세요.
