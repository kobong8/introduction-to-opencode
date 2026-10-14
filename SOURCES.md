# 참고자료와 사실 구분

기존 자료 S01–S14 확인일: 2026-10-01. 추가 자료 S15–S19 확인일: 2026-10-13. 공식 문서는 사내 설치판과 다를 수 있다. 특히 원본 저장소의 dev 브랜치는 안정 릴리스의 기능 목록으로 취급하지 않는다.

| ID | 자료 | URL | 사용 위치 |
|---|---|---|---|
| S01 | OpenCode Enterprise | https://opencode.ai/docs/enterprise/ | 사내 게이트웨이와 승인 환경 |
| S02 | OpenCode Share | https://opencode.ai/docs/share/ | 공개 공유 및 비활성화 |
| S03 | OpenCode TUI | https://opencode.ai/docs/tui/ | 기본 명령, 파일·셸 참조 |
| S04 | OpenCode Agents | https://opencode.ai/docs/agents/ | Plan/Build, primary/subagent |
| S05 | OpenCode Keybinds | https://opencode.ai/docs/keybinds/ | 기본 키와 사용자 설정 |
| S06 | OpenCode Commands | https://opencode.ai/docs/commands/ | 사용자 명령 정의 |
| S07 | OpenCode Agent Skills | https://opencode.ai/docs/skills/ | SKILL.md와 필요 시 로드 |
| S08 | OpenCode Rules | https://opencode.ai/docs/rules/ | AGENTS.md 프로젝트 규칙 |
| S09 | Anthropic: Effective harnesses for long-running agents | https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents | 장기 작업 기록·검증의 참고 사례 |
| S10 | Playwright Assertions | https://playwright.dev/docs/test-assertions | 사용자 흐름 assertion |
| S11 | Trivy Connectivity and Network considerations | https://trivy.dev/docs/latest/advanced/air-gap/ | 내부 미러·오프라인 운용 |
| S12 | OmO 원본 저장소 | https://github.com/code-yeongyu/oh-my-openagent | 이름 변경 및 배포판 확인 |
| S13 | OmO 원본 orchestration 문서, dev | https://github.com/code-yeongyu/oh-my-openagent/blob/dev/docs/guide/orchestration.md | 현재 계획·실행 개념과 경로 |
| S14 | 기존 방식 참고용 보존 문서: mathpal/oh-my-opencode fork | https://github.com/mathpal/oh-my-opencode/blob/dev/docs/guide/orchestration.md | Prometheus/Atlas·.sisyphus 방식의 역사적 참고 |
| S15 | Ponytail 원본 스킬 | https://github.com/DietrichGebert/ponytail/blob/main/skills/ponytail/SKILL.md | 구현 단순화 추천 후보 · 2026-10-13 확인 |
| S16 | Caveman 원본 스킬 | https://github.com/JuliusBrussee/caveman/blob/main/skills/caveman/SKILL.md | 응답 간결화 추천 후보 · 2026-10-13 확인 |
| S17 | Superpowers 원본 저장소 | https://github.com/obra/superpowers | 테스트·디버깅·검증 절차 추천 후보 · 2026-10-13 확인 |
| S18 | SonarQube Server 분석 과정 | https://docs.sonarsource.com/sonarqube-server/discovering/analysis-overview/process-steps | 정적 분석과 사내 서버 운용 · 2026-10-13 확인 |
| S19 | Playwright API testing | https://playwright.dev/docs/api-testing | API 요청·응답 검증 · 2026-10-13 확인 |

S14는 원본 최신 문서가 아닌 fork의 보존 자료다. 현재 기능의 권위 있는 출처로 사용하지 않는다. 기존 이름과 경로는 사내 설치판을 직접 확인해야 한다.

S15–S17은 공개 원본의 용도를 확인한 자료이며 사내 제공·승인 목록이 아니다. 추천 조합과 혼잡 시간 운영 방식은 이 교육을 위한 팀 운영 제안이다. 실제 업무에서는 항상 사내에서 제공하는 모델·스킬·하네스·검증 도구를 사용하고 데이터 전송·저장 위치를 확인한다. 외부 도구를 설치하거나 실제 사내 SonarQube·취약점 분석을 실행한 것은 아니다.

## 사실 구분

- 공식 확인: 기본 OpenCode 기능, 문서의 명령, 원본 dev 문서에 있는 현재 방식.
- 발표자 경험: 14~22시 지연, 특히 15~17시 불안정, 사내 사용 맥락.
- 교육 설계: 작업 템플릿, 역할 책임표, Babylon.js A/B 지시, docs/ai 경로, 웹 구현 구조.
- 미확정: 사내 승인 모델·주소·인증·할당량·정확한 설치 버전·엑셀 보안 절차.

Babylon.js 예제의 성능 개선·토큰 감소 수치는 측정하지 않았으며 자료에 넣지 않는다. 메모리·스킬·하네스의 효과는 실제 팀 과제로 확인한다.

## 발표 전 갱신

1. 사내 OpenCode 버전과 OmO 패키지 버전·배포판을 기록한다.
2. 해당 버전의 도움말과 릴리스 문서에서 실습 명령·저장 경로를 대조한다.
3. 실습에는 확인된 한 가지 흐름만 사용하고 나머지는 비교 참고로 둔다.
4. 사내 운영 시간과 보안 정책은 운영 담당자의 최신 안내로 갱신한다.
