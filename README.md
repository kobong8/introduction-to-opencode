# OpenCode 팀 활용 가이드

React + TypeScript + Vite로 만든 정적 웹사이트입니다. 방문자는 Python/FastAPI 서버 없이 사용할 수 있습니다. npm은 개발·빌드에만 필요합니다.

사이트: https://kobong8.github.io/introduction-to-opencode/

## GitHub Pages 설정 (처음 한 번)

1. 저장소의 **Settings → Pages**를 엽니다.
2. **Source: Deploy from a branch**를 선택합니다.
3. **Branch: main**, 폴더 **/(root)**를 선택하고 **Save**합니다.
4. 배포가 완료되면 위 사이트 주소를 엽니다.

루트에 빌드된 `index.html`, `assets/`, `favicon.svg`, `.nojekyll`을 포함했습니다. GitHub에서 npm 빌드를 할 필요가 없습니다. `/docs`를 선택하지 마세요.

사용자 정의 `.github/workflows`는 없습니다. branch 방식에서도 GitHub가 관리하는 **pages build and deployment** 작업은 Actions 탭에 표시됩니다. 이는 Pages 자체 배포 과정입니다.

[GitHub 공식 배포 설정 안내](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## 로컬 개발

Node.js 22.12 이상을 설치합니다. Node.js 24에서 검증했습니다.

```sh
npm ci
npm run dev
```

터미널에 표시된 주소(기본 `http://127.0.0.1:5173`)를 엽니다. 원고와 소스 수정이 개발 화면에 반영됩니다.

## 수정 후 수동 배포

저장소 폴더에서 아래 순서로 실행합니다. 진행 중인 수정은 먼저 커밋한 뒤 pull하세요.

```sh
git switch main
git pull --ff-only origin main
npm ci
```

`CONTENTS.md`, `SOURCES.md` 또는 `src/`를 수정한 다음 빌드하고 확인합니다.

```sh
npm run build
npm test
npm run test:e2e
npm run preview
```

브라우저 테스트는 설치된 Microsoft Edge를 사용합니다. 미리보기 주소는 `http://127.0.0.1:4173/introduction-to-opencode/`입니다. `Ctrl+C`로 미리보기를 종료한 후 변경 파일을 확인하고 소스와 배포본을 함께 커밋합니다.

```sh
git status --short
git add CONTENTS.md SOURCES.md src web public scripts package.json package-lock.json vite.config.ts playwright.config.ts tests README.md PRD.md TRD.md CODEX_PROMPT.md QA_REPORT.md .gitignore index.html assets favicon.svg .nojekyll
git commit -m "Update OpenCode guide and static site"
git push origin main
```

GitHub Pages의 배포 완료 후 사이트를 새로고침합니다. **원고나 소스만 수정하고 빌드를 생략하면 배포 화면은 갱신되지 않습니다.** `npm run build`는 `dist/`에 빌드한 뒤 필요한 파일만 루트로 복사합니다.

### 다른 정적 웹서버에 수동 업로드

루트의 `index.html`, `assets/`, `favicon.svg`, `.nojekyll`을 같은 디렉터리에 복사합니다. 상대 경로이므로 도메인 루트와 저장소 하위 경로 모두 지원합니다. 파일을 더블클릭하는 대신 HTTP 서버로 접속하세요.

## 파일 구조

| 경로 | 역할 |
| --- | --- |
| `CONTENTS.md`, `SOURCES.md` | 원고·출처. 빌드 시 JavaScript에 포함 |
| `src/` | 화면·기능·스타일 |
| `web/index.html` | 개발용 HTML 원본 |
| `public/favicon.svg` | 아이콘 원본 |
| `scripts/publish-static.mjs` | 정적 배포본을 루트에 반영 |
| `scripts/preview-static.mjs` | 배포본 로컬 미리보기 |
| `index.html`, `assets/`, `favicon.svg`, `.nojekyll` | 커밋해야 하는 배포본 |
| `dist/` | 임시 빌드 결과, Git 제외 |
| `tests/`, `src/content.test.ts` | 브라우저·원고 테스트 |

루트의 `index.html`과 `assets/`는 자동 생성됩니다. 직접 수정하지 말고 원본을 수정한 뒤 다시 빌드하세요.

## 유지되는 기능

- 11개 장 읽기·발표 모드, 목차, 모바일 메뉴
- 명령어 검색·버전 필터, 프롬프트 복사와 실패 시 대체 동작
- 발표 방향키, URL 직접 접근·새로고침·뒤로가기
- 읽기 진도 저장, 원고 펼치기, 출처 링크
- 큰 글씨, 반응형 화면, 사내 AI·스킬·하네스 추천, 혼잡 시간대 검증 안내

인쇄 기능은 제외했습니다. 진도는 브라우저 localStorage에 저장되며 저장을 막아도 사이트를 사용할 수 있습니다. 원고 API나 외부 모델 호출은 없습니다.

## 배포 문제 확인

- Pages 설정이 `main` / `/(root)`인지 확인합니다.
- 루트 `index.html`이 `/src/main.tsx` 대신 `./assets/…js`를 참조하는지 확인합니다.
- `assets/`와 `.nojekyll`까지 커밋·푸시했는지 확인합니다.
- Actions 탭에서 Pages 배포 성공 여부를 확인한 후 강력 새로고침합니다.
- 원고나 소스를 수정했다면 다시 빌드하고 생성 파일까지 푸시합니다.
