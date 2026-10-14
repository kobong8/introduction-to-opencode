import { chapters } from './content';
import { Badge, SourceLinks } from './components';
import './presentation.css';

type Slide = { cards: [string, string, string][]; detail: string; takeaway: string };
const slides: Slide[] = [
 {cards:[['작업 환경','코드에서 테스트까지','프로젝트를 읽고 구현과 검증을 한 흐름으로 진행합니다.'],['집중할 것','작업의 완성도','개인 토큰 잔량에 대한 부담을 줄이고 완료 조건에 집중합니다.'],['활용 경험','혼잡 시간도 유용하게','응답이 늦어지면 테스트와 다음 작업 준비를 진행합니다.']],detail:'발표자의 활용 경험상 14–22시에는 지연이 있었고, 특히 15–17시에 불안정했습니다. 실제 상태에 맞춰 작업을 작게 나누세요.',takeaway:'사내에서 제공하는 환경으로 시작하고, 결과의 품질에 집중하세요.'},
 {cards:[['맥락 전달','필요한 파일부터','@파일경로로 참고할 파일을 지정하고 원하는 결과를 설명합니다.'],['작업 시작','계획하고 구현하기','Tab으로 기본 에이전트를 전환하고, /models에서 모델을 확인합니다.'],['이어가기','세션과 명령 찾기','/sessions로 대화를 이어가고, Ctrl+P로 명령 목록을 엽니다.']],detail:'첫 요청은 “실행·테스트 방법과 프로젝트 구조를 확인해줘”처럼 작게 시작하세요. 명령과 단축키는 사내 설치 버전에 맞춰 확인합니다.',takeaway:'파일 지정 → 계획 → 실행 → 세션 관리부터 익히세요.'},
 {cards:[['SKILL','반복 작업의 절차','Ponytail은 구현 단순화, Caveman은 간결한 응답, Superpowers는 테스트·디버깅 절차에 참고합니다.'],['HARNESS','실행과 검증 관리','계획·위임·권한·테스트·재개를 연결해 작업이 끝날 때까지 관리합니다.'],['MEMORY','경험을 다음 작업으로','AGENTS.md와 진행 기록에 팀 규칙, 오류 원인, 다시 확인할 조건을 남깁니다.']],detail:'“이 기능 만들어줘”에 완료 조건과 검증 방법을 더해 보세요. 예: 선택한 장비 ID와 정보창 ID가 일치하는지 테스트하기.',takeaway:'스킬과 도구는 항상 사내 제공 구성을 사용하고, 실제 과제로 효과를 확인하세요.'},
 {cards:[['확장','Oh My OpenCode','OpenCode에 계획·탐색·위임·검증 흐름을 더하는 프로젝트입니다.'],['활용','복잡한 작업 나누기','여러 파일에 걸친 구현은 범위와 완료 조건을 정리한 뒤 맡깁니다.'],['판단','작업 규모에 맞추기','간단한 수정은 직접 처리하고, 위임할 때는 결과를 합치는 시간도 고려합니다.']],detail:'원본 프로젝트의 이름과 명령은 버전에 따라 달라질 수 있습니다. 실습에는 사내에 설치된 버전의 안내를 사용하세요.',takeaway:'복잡한 작업일수록 무엇을 나누고 어떻게 합칠지 먼저 정하세요.'},
 {cards:[['정리','사내 AI로 다듬기','아이디어와 긴 작업지시서를 읽기 쉬운 요청으로 정리합니다.'],['조건','완료 기준 남기기','목표·범위·제약·완료 조건·검증 방법을 빠뜨리지 않습니다.'],['전달','원문과 비교하기','줄인 문장에 숫자, 제외 사항, 파일 경로가 정확히 남아 있는지 확인합니다.']],detail:'요청 예: “중복 설명은 줄이되 목표와 제약, 완료 조건, 검증 방법은 유지해서 작업 지시로 정리해줘.”',takeaway:'짧은 지시문에도 업무 정보가 들어갑니다. 항상 사내 AI를 활용하세요.'},
 {cards:[['PLAN','무엇을 할지 정하기','참조 파일과 작업 범위, 완료 조건, 검증 방법을 계획에 남깁니다.'],['EXECUTE','순서대로 실행하기','의존 관계를 확인하고, 위임한 결과를 통합해 진행 상태를 기록합니다.'],['RESUME','기록과 코드 대조하기','세션을 다시 열고 실제 변경과 마지막 테스트 결과를 확인한 뒤 이어갑니다.']],detail:'계획 파일과 대화 세션은 서로 다른 기록입니다. 저장 경로를 명시하고, 재개할 때 완료·미완료·막힌 항목을 구분하세요.',takeaway:'기억에 의존하지 않고 계획·코드·검증 기록을 맞춰 이어가세요.'},
 {cards:[['탐색','관련 코드 찾기','수정할 위치와 의존 관계를 읽고 구현에 필요한 맥락을 정리합니다.'],['구현','범위를 나눠 맡기기','독립 작업은 병렬로 진행하고, 같은 파일의 수정은 겹치지 않게 합니다.'],['검증','결과 합치고 확인하기','작업별 결과를 통합한 뒤 전체 기능과 완료 조건을 다시 확인합니다.']],detail:'목록 필터와 독립된 도움말은 함께 작업할 수 있습니다. 공통 데이터 구조를 바꾼다면 그 형식부터 합의해야 합니다.',takeaway:'역할마다 입력·수정 범위·완료 조건·결과 형식을 정하세요.'},
 {cards:[['점검','현재 결과 테스트','사내 SonarQube, API 테스트, 취약점 분석, Playwright E2E를 활용합니다.'],['기록','문제 재현하기','실패한 조건과 로그를 남기고 영향과 우선순위를 정리합니다.'],['다음 계획','개선 조건 만들기','바꿀 내용과 완료 조건, 다시 실행할 검증을 다음 작업에 반영합니다.']],detail:'AI가 혼잡할 때는 모델 호출 없이 가능한 검증부터 진행하세요. 테스트 대상 버전을 고정하고 공유 테스트 서버의 부하도 고려합니다.',takeaway:'기다리는 시간을 검증과 다음 작업의 개선에 활용하세요.'},
 {cards:[['로직·API','기대 결과 확인','단위 테스트와 API 테스트로 경계값, 정상·오류 응답, 접근 권한을 확인합니다.'],['사용자 흐름','직접 동작 확인','Playwright로 클릭·입력·화면 이동을 검증하고 필요한 실행 기록을 남깁니다.'],['품질·보안','분석 결과 검토','사내 SonarQube와 취약점 분석 도구의 검사 범위와 발견 항목을 확인합니다.']],detail:'완료 보고에는 실행 명령, 통과·실패·미실행 결과, 로그 위치와 남은 문제를 포함하세요. 캡처와 실제 검증 결과를 함께 봅니다.',takeaway:'완료는 설명이 아니라 실제 검증 결과로 판단하세요.'},
 {cards:[['프로그램','허용된 도구 연결','AI가 사내에서 허용된 프로그램과 기능을 활용하도록 구성합니다.'],['자료','필요한 범위 읽기','접근 가능한 파일에서 필요한 시트와 열을 지정해 읽고 정리합니다.'],['결과','원본과 비교하기','정리된 행 수·항목·수치를 확인하고, 수정은 사본에서 진행합니다.']],detail:'작업 지시에 대상 파일·시트·읽을 항목·결과 형식을 적으세요. 프로그램 연결과 자료 활용은 사내에서 허용된 권한과 범위를 따릅니다.',takeaway:'사내에서 허용된 프로그램을 AI가 활용해 사내 자료를 읽도록 하세요.'},
 {cards:[['시작','작은 과제 하나','목표와 완료 조건을 적고 관련 팀 규칙과 스킬을 확인합니다.'],['실행','맡기고 검증하기','준비한 계획을 실행하고 실제 테스트 결과로 완료를 판단합니다.'],['축적','다음 작업에 남기기','오류와 해결 방법, 남은 작업을 기록하고 다음 세션에서 참고합니다.']],detail:'중복 설명과 불필요한 로그는 줄이되, 결과를 확인하는 데 필요한 분석과 테스트는 충분히 진행하세요.',takeaway:'일을 설계하고, 맡기고, 검증하세요. 팀의 경험은 다음 작업의 출발점입니다.'},
];

export function Presentation({index, navigate}:{index:number;navigate:(id:string,present?:boolean)=>void}) {
 const chapter=chapters[index]; const slide=slides[index];
 return <section className="presentation" aria-label="발표 슬라이드">
  <div className="slide-top"><span className="eyebrow">OPENCODE · TEAM PLAYBOOK</span><Badge>{chapter.evidence}</Badge></div>
  <div className="deck-heading"><span className="deck-number">{String(index+1).padStart(2,'0')}</span><div><h1>{chapter.label}</h1><p className="deck-subtitle">{chapter.summary[0]}</p></div></div>
  <div className="deck-cards">{slide.cards.map(([label,title,body])=><article className="deck-card" key={label}><span>{label}</span><h2>{title}</h2><p>{body}</p></article>)}</div>
  <div className="deck-detail"><strong>실무에 적용하기</strong><p>{slide.detail}</p></div>
  <div className="deck-takeaway"><span>기억할 한 가지</span><p>{slide.takeaway}</p></div>
  <details className="deck-sources"><summary>참고자료 보기</summary><SourceLinks ids={chapter.sourceIds}/></details>
  <div className="slide-controls"><button disabled={index===0} onClick={()=>navigate(chapters[index-1].id,true)}>← 이전</button><nav className="deck-pages" aria-label="슬라이드 바로 이동">{chapters.map((c,i)=><button key={c.id} aria-label={`${i+1}장 ${c.label}`} aria-current={i===index?'step':undefined} onClick={()=>navigate(c.id,true)}>{i+1}</button>)}</nav><button disabled={index===chapters.length-1} onClick={()=>navigate(chapters[index+1].id,true)}>다음 →</button></div>
  <div className="deck-position"><span>{String(index+1).padStart(2,'0')} / {chapters.length}</span><span>← → 이동 · Esc 읽기 모드</span></div>
  <div className="deck-progress" role="progressbar" aria-label="발표 진행" aria-valuemin={1} aria-valuemax={chapters.length} aria-valuenow={index+1}><i style={{width:`${(index+1)/chapters.length*100}%`}}/></div>
 </section>;
}
