# TRD — OpenCode 팀 활용 가이드 웹

작성일: 2026-10-01 · 대응 문서: PRD.md / CONTENTS.md / SOURCES.md

## 1. 구현 방식

백엔드 없이 정적 사이트로 구현한다. React + TypeScript + Vite를 기본 제안으로 사용하되, 기존 프로젝트가 있으면 기존 스택을 따른다. 사내 정적 호스팅에서 배포할 수 있도록 빌드 결과만으로 동작해야 한다. 설치에 필요한 패키지는 승인된 레지스트리에서 확보한다.

교육용 웹과 OpenCode 자체 웹 인터페이스를 연결하지 않는다. API 키, 사내 모델 URL, 엑셀 원본을 받는 입력란은 만들지 않는다.

## 2. 파일 구조 제안

```text
src/
  app/App.tsx
  content/chapters.ts
  content/commands.ts
  content/sources.ts
  content/glossary.ts
  components/Chapter.tsx
  components/TableOfContents.tsx
  components/CommandTable.tsx
  components/CopyBlock.tsx
  components/Comparison.tsx
  components/WorkflowDiagram.tsx
  components/VersionNotice.tsx
  components/SourceLinks.tsx
  components/PresentationView.tsx
  styles/global.css
  styles/print.css
tests/
  content.test.ts
  command-filter.test.ts
  guide.spec.ts
public/
  downloads/             # 가상 데이터와 공개 교육 템플릿만
```

콘텐츠와 컴포넌트를 분리한다. 한 거대한 TSX 파일에 원고와 모든 동작을 넣지 않는다.

## 3. 콘텐츠 모델

```ts
type EvidenceKind = 'official' | 'internal-experience' | 'example' | 'version-check';
type CommandScope = 'opencode' | 'omo-legacy' | 'omo-current-dev';

interface Source {
  id: string;
  title: string;
  url: string;
  checkedAt: string;
  note?: string;
}
interface Chapter {
  id: string; // 고정: why, basics, harness, omo, prompts, sessions, team, workflow, verification, files, conclusion
  number: number;
  title: string;
  takeaway: string;
  summary: string[];
  evidenceKind: EvidenceKind;
  sourceIds: string[];
  // 본문은 프로젝트에 맞는 typed blocks 또는 로컬 Markdown으로 구현
}
interface CommandEntry {
  command: string;
  description: string;
  scope: CommandScope;
  shortcut?: string;
  caution?: string;
  sourceIds: string[];
}
```

모든 sourceIds가 실재하는지 검사한다. 사용자 경험에는 공식 출처를 대신 붙이지 않고 ‘발표자 제공, 확인일 2026-10-01’을 표시한다. 예시는 ‘교육용’ 배지를 붙인다. 현재 dev 문서는 고정 릴리스와 다르므로 해당 필터에 ‘사내 설치판과 다를 수 있음’을 계속 표시한다.

## 4. 화면과 상태

- 읽기 모드: 일반 문서, 접이식 상세, 고정 목차. IntersectionObserver로 현재 장을 갱신한다.
- 발표 모드: 장당 takeaway·summary·핵심 그림을 렌더링한다. 전체 원고를 슬라이드 안에 넣지 않는다.
- URL: `?mode=present&chapter=harness`와 `#harness` 등으로 상태를 표현한다. 직접 접근·새로고침·뒤로 가기를 처리한다.
- 검색: 로컬 문자열 검색만 사용한다. 명령어·설명에 대해 공백 정리와 대소문자 무시를 적용한다.
- 검색 0건: ‘일치하는 명령어가 없습니다’와 필터 초기화 버튼.
- 발표 방향키: 입력란·선택·편집 영역에 포커스가 있을 때 가로채지 않는다. 시작/끝 장에서 인덱스를 제한한다.
- 복사: `navigator.clipboard.writeText`를 사용하고 실패 시 원문 선택을 안내한다. HTTP 사내 환경에서 성공을 가정하지 않는다.
- P1 진도: localStorage 실패가 페이지를 막지 않게 처리한다. 개인 기록이며 서버 전송은 없다.

## 5. 시각 자료

1. 모델 / 스킬 / 하네스 / 메모리를 구분하는 비교표.
2. 목표 → 계획 → 실행 → 검증 → 기록 → 다음 계획의 순환. 검증 실패는 수정으로 되돌아간다.
3. 사람·조정자·구현자·검증자의 책임표. 에이전트 수가 많을수록 좋은 것으로 표현하지 않는다.
4. 사내 혼잡 시간: 텍스트와 색으로 14~22시, 집중 15~17시를 표시한다. 측정 그래프처럼 숫자 지연시간이나 성공률을 만들지 않는다.

도표는 로컬 SVG 또는 HTML/CSS로 구현하고 텍스트 설명을 함께 제공한다. 원고의 Mermaid는 의미를 전달하는 명세이며 그대로 실행할 의무는 없다.

## 6. 보안·오프라인·접근성

- 시스템 폰트 또는 배포물에 포함된 승인 폰트 사용. 외부 폰트·아이콘 CDN·분석·오류 수집 SDK 금지.
- 렌더링에 필요한 모든 자산은 로컬. 외부 출처 링크에는 새 창 이동과 `rel="noopener noreferrer"` 적용.
- 외부 링크 클릭 전에는 외부 통신하지 않는다. 브라우저 네트워크 로그로 확인한다.
- 사용자 입력 HTML을 실행하지 않는다. Markdown을 쓸 경우 raw HTML을 끄고 링크 프로토콜을 제한한다.
- 콘텐츠 검색·복사만 제공한다. 외부 URL을 서버가 가져오는 기능은 없다.
- 호스팅 담당자가 CSP를 적용할 수 있도록 예시를 README에 기록한다. 개발 서버 요구와 운영 CSP는 분리한다.
- 의미 있는 heading 구조, skip link, `aria-current`, 복사 상태 `aria-live`, 포커스 표시, 충분한 대비, reduced-motion 준수.
- 인쇄에서는 목차 고정·복사 버튼·접힌 UI를 제거하고, 상세 원고와 출처 URL을 출력한다.

## 7. 검증 계획

| 검증 | 방법 | 통과 조건 |
|---|---|---|
| 콘텐츠 정합성 | 단위 테스트 | 11개 장의 ID 고유, 출처 ID 유효, 버전 범주 누락 없음 |
| 검색·필터 | 단위 테스트 | 명령어·설명 검색, 범주 결합, 0건 상태 정확 |
| 사용자 흐름 | Playwright | 목차 이동, 모드 전환, URL 재개, 방향키, 복사 상태 |
| 모바일 | Playwright 390px | 화면 전체 가로 넘침 없음, 표 영역만 스크롤 가능 |
| 키보드 | 수동 + Playwright | 목차·필터·복사 접근, 포커스 유지, 입력 시 방향키 충돌 없음 |
| 인쇄 | 브라우저 PDF 미리보기 | 상세 원고·출처 포함, 잘림 없음 |
| 외부 통신 | 요청 로그 | 초기 로딩·검색·복사·모드 전환 중 외부 origin 요청 0건 |
| 품질 | 타입 검사·빌드 | 오류 0건, 콘솔 예외 없음 |

실제 실행한 명령, 결과, 스크린샷 경로를 QA_REPORT.md에 기록한다. 실행하지 못한 검사는 ‘미실행’과 이유를 쓴다. ‘예상 통과’를 실제 통과로 기록하지 않는다.

Trivy는 보안 검증 도구의 교육 예시이자 선택 검사다. 교육 웹의 정상 작동을 대신 증명하지 않는다. 설치되지 않았거나 DB가 없으면 미실행으로 보고한다. 사내 실행 시 외부 DB 다운로드가 승인되는지 확인하고 내부 미러·오프라인 DB 운용을 검토한다. 모든 코드 외부 전송·악성 행위를 탐지한다고 설명하지 않는다.

## 8. 구현 순서

1. 원고·출처·버전 배지·사내 미입력값을 콘텐츠 데이터로 옮긴다.
2. 읽기 모드, 목차, 비교표, 복사 블록을 구현한다.
3. 발표 모드, URL 상태, 검색·필터를 구현한다.
4. 모바일·접근성·인쇄 스타일을 완성한다.
5. 타입 검사·빌드·필수 테스트와 시각 QA를 수행한다.
6. README에 실행·빌드·사내 정적 호스팅 방법과 미입력 항목을 남긴다.

기본 예시 명령은 프로젝트에 실제로 등록한 스크립트만 문서화한다. `npm run dev`, `npm run build`, `npm run typecheck`, `npm run test`, `npm run test:e2e`를 제공한다면 package.json에서도 동일하게 동작해야 한다.

## 9. 구현 산출물

동작하는 소스, 정적 빌드 결과, README.md, QA_REPORT.md, 공식 출처와 확인일, 사내 담당자 보충 목록. 배포 URL이나 인증 설정은 요청되지 않았으므로 임의로 만들지 않는다.

## 10. 참고

Playwright assertions 및 Trivy 네트워크 운용의 공식 문서는 SOURCES.md의 S10·S11을 참고한다. 나머지 구현 구조는 이 교육 웹을 위한 설계 제안이다.
