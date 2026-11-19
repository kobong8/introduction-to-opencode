import { TerminalDemo } from './TerminalDemo';
import React, { useEffect, useState } from 'react';
import { Presentation } from './Presentation';
import { appendix, chapters, sources } from './content';
import { Badge, CommandTable, Comparison, Markdown, Workflow } from './components';

import { parts, tutorialRoute, type TutorialPart } from './tutorial-route';

function ServiceDownloads() {
 return <div className="lab-downloads">
   <a className="primary" href="./assets/todo-python.zip" download>Python 실습 ZIP</a>
   <a className="secondary" href="./assets/todo-node.zip" download>Node.js 실습 ZIP</a>
 </div>;
}

export default function App() {
 const route = tutorialRoute(new URL(location.href));
 useEffect(() => {
  const forwardChapterLink = () => {
   const { redirect } = tutorialRoute(new URL(location.href));
   if (redirect) location.replace(redirect.href);
  };
  forwardChapterLink();
  window.addEventListener('hashchange', forwardChapterLink);
  return () => window.removeEventListener('hashchange', forwardChapterLink);
 }, []);
 if (route.redirect) return <main role="status">해당 파트를 여는 중입니다.</main>;
 return route.part ? <PartPage part={route.part}/> : <TutorialHome/>;
}

function TutorialHome() {
 return <main className="tutorial-home">
   <header className="tutorial-home-heading">
     <p className="eyebrow">OpenCode 입문 튜토리얼</p>
     <h1>OpenCode 처음부터,<br/>내 서비스까지.</h1>
     <p>모의 터미널로 첫 요청을 해 보고, 내 컴퓨터에서 할 일 앱을 켜고 바꿔 봅니다.</p>
   </header>
   <nav className="tutorial-parts" aria-label="학습 파트">{parts.map((part,index)=>
     <a href={`./${part.page}`} key={part.page}>
       <span>PART {String(index+1).padStart(2,'0')}</span>
       <strong>{part.title}</strong>
       <small>{part.text}</small>
     </a>)}</nav>
 </main>;
}

function PartPage({ part }: { part: TutorialPart }) {
 const partChapters = chapters.filter(chapter => part.ids.includes(chapter.id));
 function initial() {
  const { present, id } = tutorialRoute(new URL(location.href));
  return { present, id: part.ids.includes(id) ? id : part.ids[0] };
 }
 const [state,setState]=useState(initial);const [menu,setMenu]=useState(false);const [read,setRead]=useState<string[]>(()=>{try{return JSON.parse(localStorage.getItem('opencode-read')||'[]')}catch{return []}});
 const [allOpen,setAllOpen]=useState(false); const index=Math.max(0,partChapters.findIndex(c=>c.id===state.id));const current=partChapters[index];
 const partRead=partChapters.filter(chapter=>read.includes(chapter.id)).length;
 function navigate(id:string,present=state.present){const u=new URL(location.href);u.search='';if(present){u.searchParams.set('mode','present');u.searchParams.set('chapter',id)}u.hash=id;history.pushState({},'',u);setState({present,id});setMenu(false);if(!present)setTimeout(()=>document.getElementById(id)?.scrollIntoView({behavior:'instant',block:'start'}),0);else window.scrollTo(0,0)}
 function move(delta:number){navigate(partChapters[Math.min(partChapters.length-1,Math.max(0,index+delta))].id,true)}
 function toggleRead(id:string){setRead(prev=>{const next=prev.includes(id)?prev.filter(x=>x!==id):[...prev,id];try{localStorage.setItem('opencode-read',JSON.stringify(next))}catch{}return next})}
 useEffect(()=>{const pop=()=>setState(initial());window.addEventListener('popstate',pop);window.addEventListener('hashchange',pop);return()=>{window.removeEventListener('popstate',pop);window.removeEventListener('hashchange',pop)}},[]);
 useEffect(()=>{if(!state.present){const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting)setState(s=>({...s,id:entry.target.id}))},{rootMargin:'-15% 0px -65% 0px'});document.querySelectorAll('section.chapter').forEach(el=>observer.observe(el));return()=>observer.disconnect()}},[state.present]);
 useEffect(()=>{function key(e:KeyboardEvent){if((e.target as HTMLElement).closest('input,textarea,select,[contenteditable="true"]'))return;if(state.present&&['ArrowRight','ArrowLeft'].includes(e.key)){e.preventDefault();move(e.key==='ArrowRight'?1:-1)}if(e.key==='Escape'){setMenu(false);if(state.present)navigate(current.id,false)}}window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[state.present,index]);
 useEffect(()=>{if(!state.present&&location.hash)setTimeout(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView(),100)},[]);
 useEffect(()=>{document.body.classList.toggle('is-presenting',state.present);return()=>document.body.classList.remove('is-presenting')},[state.present]);
 return <><a className="skip-link" href="#main">본문으로 건너뛰기</a><aside className={`sidebar ${menu?'is-open':''}`}><a className="brand" href="./" aria-label="OpenCode 튜토리얼 홈"><span className="brand-icon">⌘</span><span>opencode<span className="brand-sub">TEAM PLAYBOOK</span></span></a><div className="sidebar-caption">{part.title}</div><div className="nav-title">CONTENTS <span>{partChapters.length} CHAPTERS</span></div><nav aria-label="장별 목차">{partChapters.map((c,i)=><React.Fragment key={c.id}><a href={`#${c.id}`} aria-current={state.id===c.id?'location':undefined} onClick={e=>{e.preventDefault();navigate(c.id)}}><span>{String(i+1).padStart(2,'0')}</span>{c.label}{read.includes(c.id)&&<b className="read-dot" aria-label="읽음">✓</b>}</a></React.Fragment>)}</nav><div className="sidebar-bottom"><div className="progress-label"><span>나의 읽기 진도</span><strong>{partRead} / {partChapters.length}</strong></div><div className="progress"><i style={{width:`${partRead/partChapters.length*100}%`}}/></div><button className="reset" onClick={()=>{setRead([]);try{localStorage.removeItem('opencode-read')}catch{}}}>진도 초기화</button></div></aside>{menu&&<button className="scrim" aria-label="목차 닫기" onClick={()=>setMenu(false)}/>}
 <div className="page"><header className="topbar"><div className="breadcrumb"><button className="menu-toggle" aria-label="목차 열기" aria-expanded={menu} onClick={()=>setMenu(!menu)}>☰</button><span>팀 러닝 라이브러리</span><span>/</span><strong>{part.title}</strong></div><div className="top-actions"><a className="part-home-link" href="./">파트 목록</a><div className="mode-switch"><button className={!state.present?'active':''} onClick={()=>navigate(current.id,false)}>▤ 읽기 모드</button><button className={state.present?'active':''} onClick={()=>navigate(current.id,true)}>▷ 발표 모드</button></div></div></header>
 <main id="main" className={state.present?'present-main':''}>{!state.present?<><section className="part-intro">
  <h1>{part.title}</h1><p>{part.text}</p>
 </section><div className="guide-heading"><div><span className="eyebrow">LEARN → PRACTICE → REPEAT</span><h2>작은 작업부터, 끝까지.</h2></div><button className="text-button" onClick={()=>setAllOpen(!allOpen)}>{allOpen?'전체 원고 접기 −':'전체 원고 펼치기 +'}</button></div>
 {partChapters.map((c,i)=><section className="chapter" id={c.id} key={c.id}><div className="chapter-heading"><span className="chapter-number">{String(i+1).padStart(2,'0')}</span><div><div className="chapter-kicker">CHAPTER {String(i+1).padStart(2,'0')} <Badge>{c.evidence}</Badge></div><h2>{c.label}</h2></div><a className="anchor-link" href={`#${c.id}`} aria-label={`${c.label} 영구 링크`}>#</a></div><p className="takeaway">{c.summary[0]}</p><ul className="summary-list">{c.summary.slice(1).map(s=><li key={s}>{s}</li>)}</ul>{c.id==='basics'&&<><div className="notice"><span>ⓘ</span><div><strong>설치는 사내 설치 링크에서</strong><p>담당 부서에서 안내한 사내 OpenCode 설치 링크를 참고해 지원 버전, 인증, 사내 모델 연결을 설정하세요.</p><p>첫 작업은 승인된 프로젝트에서 변경 없이 질문하는 것부터 시작하세요. 결과를 확인한 뒤 작은 변경을 맡기고, 변경 내역과 테스트를 직접 확인합니다.</p></div></div><TerminalDemo/><CommandTable/></>}{c.id==='harness'&&<><Comparison/><div className="notice"><span>ⓘ</span><div><strong>사내 제공 스킬 추천</strong><p>Ponytail: 구현 단순화 · Caveman: 응답 간결화 · Superpowers: 테스트·디버깅 절차</p><p>데이터 전송이 발생할 수 있으므로 사내에서 제공하는 모델·스킬·하네스만 사용하세요. 개인 제작본이나 외부 배포본은 업무에 설치하거나 연결하지 않습니다. 아래 원고에서 추천 용도와 적용 기준을 확인할 수 있습니다.</p><small>활용 제안 · 사내 제공 여부는 담당자에게 확인하세요</small></div></div></>}{c.id==='workflow'&&<><Workflow/><div className="notice"><span>↻</span><div><strong>혼잡 시간에는 검증하고, 다음 개선을 준비하세요.</strong><p>사내 SonarQube · API 테스트 · 취약점 분석 · Playwright E2E로 결과를 점검합니다.</p><p>발견 사항과 재현 증거를 모아 우선순위, 다음 작업의 완료 조건, 재검증 방법을 정리하세요.</p><small>사내 제공 도구와 승인된 대상만 사용 · 공유 서버 부하를 고려하고 모델 호출 없는 검증부터 진행</small></div></div></>}{c.id==='prompts'&&<div className="notice"><span>ⓘ</span><div><strong>프롬프트 다듬기와 작업지시서 축약은 사내 AI에서</strong><p>짧은 지시문에도 업무 데이터가 포함될 수 있습니다. 항상 사내에서 제공하는 AI를 사용하고, 줄인 뒤에도 제약·완료 조건·검증 방법이 남아 있는지 확인하세요.</p></div></div>}{c.id==='files'&&<div className="notice"><span>▤</span><div><strong>사내에서 허용된 프로그램으로 자료 읽기</strong><p>AI가 사내에서 허용된 프로그램을 활용해 필요한 자료를 읽고 정리하도록 합니다. 자료 접근과 활용은 허용된 권한과 범위 안에서 진행합니다.</p></div></div>}{c.id==='service-start'&&<ServiceDownloads/>}{c.id.startsWith('service-')?<Markdown text={c.body}/>:<details open={allOpen||undefined} key={`${c.id}-${allOpen}`}><summary>설명과 예제 열기 <span>단계별 따라 하기</span></summary><Markdown text={c.body}/></details>}<button className={`read-button ${read.includes(c.id)?'done':''}`} onClick={()=>toggleRead(c.id)}>{read.includes(c.id)?'✓ 읽었어요':'○ 이 장을 읽었어요'}</button></section>)}
 {part.ids.includes('appendix')&&<section className="chapter appendix" id="appendix"><span className="eyebrow">KEEP IT HANDY</span><h2>용어와 팀 공통 템플릿</h2><Markdown text={appendix}/></section>}{part.ids.includes('references')&&<section className="chapter" id="references"><span className="eyebrow">REFERENCES</span><h2>출처 및 참고자료</h2><div className="notice"><div><strong>사내 네트워크에서 열람할 때</strong><p>사내 네트워크에서는 아래 외부 링크에 접속하지 못할 수 있습니다. 링크는 참고용이며, 설치와 사용은 담당 부서의 사내 안내를 따르세요.</p></div></div><p>기존 자료 확인일: 2026.10.01 · 추천·검증 자료 확인일: 2026.10.13. 원본 dev 문서는 안정 릴리스와 다를 수 있습니다.</p><div className="references">{sources.map(s=><a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer"><div><strong>{s.title} ↗</strong><small>{s.note}</small></div></a>)}</div><div className="notice"><div><strong>실습 전 확인할 사내 안내</strong><p>OpenCode 버전, OmO 버전·배포판, 승인 모델 ID, 설치 안내, 보안 지침, 할당량, 최신 혼잡 상태, 지원 담당자, 엑셀 실습 방법.</p></div></div></section>}<footer>opencode <span>TEAM PLAYBOOK · 2026</span><p>일을 설계하고, 맡기고, 검증하세요.</p></footer></>:<Presentation chapters={partChapters} index={index} navigate={navigate}/>}</main></div></>;
}
