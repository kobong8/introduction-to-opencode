export type Scope = 'opencode'|'internal';
export type Command = {command:string;description:string;shortcut:string;scope:Scope};

export const labels = ['사내 OpenCode를 쓰는 이유','OpenCode 첫 사용','스킬·하네스·메모리','Oh My OpenCode','프롬프트 설계','계획·실행·세션 관리','나만의 에이전트 팀','다음 일을 설계하는 법','검증과 증거','보안 엑셀 파일','팀의 다음 행동'];
export const evidence = ['시작 안내','공식 기능','교육 예제','버전 확인 필요','교육 예제','버전 확인 필요','교육 예제','교육 예제','교육 예제','사내 확인 필요','교육 예제'];
export function parseGuide(manuscript:string,references:string) {
const sources = [...references.matchAll(/^\| (S\d+) \| (.+?) \| (https:\/\/\S+) \| (.+?) \|$/gm)].map(m => ({id:m[1],title:m[2],url:m[3],note:m[4],checkedAt:m[4].match(/\d{4}-\d{2}-\d{2}/)?.[0]??'2026-10-01'}));
const parts = manuscript.split(/^## (?=\d{2}\.)/m).slice(1);
const chapters = parts.map((part, i) => {
  const heading = part.match(/^(\d+)\. (.*?) \{#(.*?)\}/)!;
  const text = part.slice(heading[0].length).split(/^## 부록 A/m)[0].trim().replace(/\n---\s*$/, '');
  const summaryBlock = text.match(/### 발표 요약\s+([\s\S]*?)(?=\n### )/)![1];
  const summary = summaryBlock.trim().split('\n').map(s=>s.replace(/^- /,'')).filter(Boolean);
  const body = text.replace(/### 발표 요약\s+[\s\S]*?(?=\n### )/,'').trim();
  return { id:heading[3],number:i+1,title:heading[2],label:labels[i],summary,body,evidence:evidence[i] };
});
const appendix = '## 부록 A' + manuscript.split('## 부록 A')[1];
const commands:Command[] = [...chapters[1].body.matchAll(/^\| `(.+?)` \| (.+?) \| (.+?) \|$/gm)].map(m=>({command:m[1],description:m[2],shortcut:m[3],scope:m[1]==='/update'?'internal':'opencode'}));
return {sources,chapters,appendix,commands};
}
export function searchCommands(commands:Command[],query:string,scope:string){ const q=query.trim().toLocaleLowerCase().replace(/\s+/g,' ');return commands.filter(c=>(scope==='all'||c.scope===scope)&&`${c.command} ${c.description} ${c.shortcut}`.toLocaleLowerCase().includes(q)); }
