import { useRef, useState } from 'react';
import { commands } from './content';
import './terminal-demo.css';

const example = '이 할 일 목록 앱의 실행 방법을 알려줘. 파일은 변경하지 마.';
const initialMessage = 'README에서 실행 방법을 확인했습니다. 목록 코드는 src/tasks.ts에 있고, 변경된 파일은 0개입니다.';
const demoResults: Record<string, string> = {
  '/update': '업데이트 연습입니다. 실제 업데이트는 사내 설치판에서 지원할 때 사내 안내에 따라 진행하세요.',
  '/models': '선택된 모델: 사내 승인 모델 (예시). 실제 모델 목록은 설치판에서 확인하세요.',
  '/sessions': '세션 목록 (예시): 첫 프로젝트 읽기. 이 체험에서는 세션을 저장하지 않습니다.',
};
const paletteCommands = commands.filter(command => command.command.startsWith('/'));

export function TerminalDemo() {
  const [input, setInput] = useState('');
  const [request, setRequest] = useState(example);
  const [turns, setTurns] = useState(1);
  const [message, setMessage] = useState(initialMessage);
  const [status, setStatus] = useState('입력 대기');
  const [palette, setPalette] = useState(false);
  const [query, setQuery] = useState('');
  const inputField = useRef<HTMLInputElement>(null);
  const searchField = useRef<HTMLInputElement>(null);
  const filtered = paletteCommands.filter(command =>
    `${command.command} ${command.description}`.toLowerCase().includes(query.trim().toLowerCase()));

  function openPalette() {
    setQuery('');
    setPalette(true);
    requestAnimationFrame(() => searchField.current?.focus());
  }

  function closePalette() {
    setPalette(false);
    inputField.current?.focus();
  }

  function run(value: string) {
    if (!value) return;
    if (value.toLowerCase() === 'ctrl+p') {
      setInput('');
      openPalette();
      return;
    }
    setRequest(value);
    setTurns(count => count + 1);
    setInput('');
    setStatus('예시 응답 표시');
    setMessage(Object.hasOwn(demoResults, value) ? demoResults[value] :
      value === 'opencode' ? 'OpenCode 화면이 열렸습니다 (예시). 아래 입력창에 요청을 적어 보세요.' :
      value.startsWith('/') ? '이 체험에서 제공하는 명령은 팔레트에서 볼 수 있습니다.' :
      '예시 응답: README에서 실행 절차와 테스트 위치를 찾았습니다. 변경된 파일은 0개입니다.');
    closePalette();
  }

  return <section className="tui-demo" aria-labelledby="tui-heading">
    <h3 id="tui-heading">OpenCode 화면 살펴보기</h3>
    <p>왼쪽에서 요청과 결과를 확인하고 아래에 다음 요청을 입력하세요. 세션 정보와 현재 경로는 오른쪽 패널에 있습니다. 결과와 상태는 가상 프로젝트의 예시입니다.</p>
    <div className="tui-window" onKeyDown={event => {
      if (event.ctrlKey && event.key.toLowerCase() === 'p') {
        event.preventDefault();
        openPalette();
      }
      if (event.key === 'Escape' && palette) closePalette();
    }}>
      <div className="tui-bar"><span aria-hidden="true">›_</span><strong>OC │ 할 일 목록 살펴보기</strong><span>모의 TUI</span></div>
      <div className="tui-layout">
        <div className="tui-conversation">
          <div className="tui-output" aria-live="polite">
            <div className="tui-request"><span>요청</span><p>{request}</p></div>
            {message === initialMessage && <div className="tui-tool"><span>Read</span> README.md <span>✓</span></div>}
            <div className="tui-response"><strong>결과</strong><p>{message}</p></div>
          </div>
      {palette && <form className="tui-palette" onSubmit={event => {
        event.preventDefault();
        if (filtered[0]) run(filtered[0].command);
      }}>
        <label htmlFor="tui-search">명령 팔레트</label>
        <input id="tui-search" ref={searchField} placeholder="기능 이름으로 검색" value={query} onChange={event => setQuery(event.target.value)}/>
        <div className="tui-buttons">
          {filtered.map(command => <button type="button" key={command.command} onClick={() => run(command.command)}><code>{command.command}</code> {command.description}</button>)}
          {!filtered.length && <span>일치하는 체험 명령이 없습니다.</span>}
          <button type="button" onClick={closePalette}>닫기</button>
        </div>
      </form>}
      <form className="tui-input" onSubmit={event => { event.preventDefault(); run(input.trim()); }}>
        <label htmlFor="tui-prompt">입력</label>
        <input id="tui-prompt" ref={inputField} value={input} maxLength={240} autoComplete="off"
          placeholder="요청을 입력하고 Enter" onChange={event => setInput(event.target.value)}/>
        <button type="submit">전송</button>
        <div className="tui-agent"><strong>Plan</strong> 사내 승인 모델 (예시)</div>
      </form>
      <div className="tui-footer">
        <span role="status">현재 상태 · {status}</span>
        <div className="tui-buttons">
          <button type="button" onClick={openPalette}><kbd>Ctrl+P</kbd> 명령 팔레트</button>
          <button type="button" onClick={() => run(example)}>예시 요청 실행</button>
        </div>
      </div>
        </div>
        <aside className="tui-context" aria-label="세션 정보">
          <strong className="tui-session-title">할 일 목록 살펴보기</strong>
          <dl>
            <dt>Context</dt><dd>요청 {turns}개 · 모의 세션</dd>
            <dt>LSP</dt><dd>언어 서버 상태가 표시되는 영역</dd>
          </dl>
          <div className="tui-location">
            <span>현재 경로</span><code>~/projects/demo-guide</code>
            <span className="tui-indicator">OpenCode 체험</span>
          </div>
        </aside>
      </div>
    </div>
  </section>;
}
