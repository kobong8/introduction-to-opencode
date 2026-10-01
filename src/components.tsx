import { useState, type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { filterCommands, sources } from './content';

export function CopyBlock({text,language='text'}:{text:string;language?:string}) {
 const [status,setStatus]=useState('');
 async function copy(){try{await navigator.clipboard.writeText(text);setStatus('복사 완료');}catch{setStatus('복사하지 못했습니다. 아래 원문을 선택해 복사하세요.');}}
 return <div className="code-block"><div className="code-bar"><span>{language==='text'?'PROMPT / 교육용 예제':language}</span><button onClick={copy} aria-label="코드 또는 프롬프트 복사">{status==='복사 완료'?'✓ 복사 완료':'⧉ 복사'}</button></div><pre tabIndex={0}><code>{text}</code></pre><span className="copy-status" role="status">{status}</span></div>;
}
export function Workflow(){return <div className="workflow" aria-label="목표, 계획, 실행, 검증, 기록 후 다음 계획으로 반복"><div className="flow-line">{['목표','계획','실행','검증','기록'].map((s,i)=><div className="flow-step" key={s}><span>0{i+1}</span><strong>{s}</strong>{i<4&&<b aria-hidden="true">→</b>}</div>)}</div><div className="flow-return">↳ 검증 실패 시 수정 후 다시 검증 · 기록을 다음 계획에 반영 ↵</div></div>}
export function Markdown({text}:{text:string}){return <div className="prose"><ReactMarkdown remarkPlugins={[remarkGfm]} components={{
 a:({href,children})=><a href={href} target="_blank" rel="noopener noreferrer">{children} ↗</a>,
 table:({children})=><div className="table-scroll" tabIndex={0}><table>{children}</table></div>,
 pre:({children})=><>{children}</>,
 code:({className,children,node,...props})=>{
 const raw=String(children).replace(/\n$/,'');const lang=className?.replace('language-','');
 if(lang==='mermaid')return <Workflow/>;
 return lang||String(children).includes('\n')?<CopyBlock text={raw} language={lang}/>:<code {...props}>{children}</code>;
 }
 }}>{text}</ReactMarkdown></div>}
export function SourceLinks({ids}:{ids:string[]}){return <div className="source-links"><span>관련 출처</span>{sources.filter(s=>ids.includes(s.id)).map(s=><a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer">{s.title} ↗</a>)}<small>제공 자료 확인일 2026.10.01 · 설치 버전 대조 필요</small></div>}
export function CommandTable(){const [query,setQuery]=useState('');const [scope,setScope]=useState('all');const filtered=filterCommands(query,scope);return <div className="command-tool"><div className="tool-top"><div><span className="eyebrow">QUICK REFERENCE</span><h3>필요한 명령어를 바로 찾으세요.</h3></div><span className="count">{filtered.length}개 명령어</span></div><div className="search-row"><label className="search"><span aria-hidden="true">⌕</span><input aria-label="명령어 검색" placeholder="명령어 또는 기능 검색…" value={query} onChange={e=>setQuery(e.target.value)}/><kbd>/</kbd></label><select aria-label="명령어 버전 필터" value={scope} onChange={e=>setScope(e.target.value)}><option value="all">모든 버전</option><option value="opencode">OpenCode 기본</option><option value="omo-legacy">기존 OmO</option><option value="omo-current-dev">현재 원본 dev</option></select></div><p className="version-note">원본 dev는 사내 설치판과 다를 수 있습니다. 기존 OmO는 호환 이해용입니다.</p><div className="table-scroll"><table><thead><tr><th>명령어</th><th>하는 일</th><th>구분 / 단축키</th></tr></thead><tbody>{filtered.map(c=><tr key={c.command}><td><code>{c.command}</code></td><td>{c.description}</td><td><span className="scope">{c.scope==='opencode'?'OpenCode 기본':c.scope==='omo-legacy'?'기존 OmO':'원본 dev'}</span><small>{c.shortcut}</small></td></tr>)}</tbody></table></div>{!filtered.length&&<div className="empty">일치하는 명령어가 없습니다.<button onClick={()=>{setQuery('');setScope('all')}}>필터 초기화</button></div>}<p className="tool-foot">명령어는 참고용입니다. 이 페이지에서 실행되지 않습니다.</p></div>}
export function Comparison(){return <div className="comparison"><div><span className="eyebrow">A · 결과만 요구</span><h3>“이 기능 만들어줘.”</h3><p>기능의 모양은 있지만,<br/>완료를 판단할 기준이 없습니다.</p><code>장비 색상과 클릭 정보창을 만들어줘.</code></div><div><span className="eyebrow">B · 절차와 검증을 함께</span><h3>“이 조건까지 확인해줘.”</h3><p>스킬 → 계획 → 구현 → 검증 → 기록<br/>다음 작업에도 쓸 수 있는 경험을 남깁니다.</p><code>선택 ID 일치 · 상태 갱신 · 회귀 검증</code></div><small>교육용 지시 비교 · 측정된 성능 비교가 아닙니다. 전체 지시문은 아래 원고에서 복사할 수 있습니다.</small></div>}
export function Badge({children}:{children:ReactNode}){return <span className={`badge ${String(children).includes('사내')||String(children).includes('버전')?'amber':''}`}>{children}</span>}
