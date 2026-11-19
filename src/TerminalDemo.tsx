import { useLayoutEffect, useRef, useState } from 'react';
import './terminal-demo.css';

const example = '이 할 일 목록 앱의 실행 방법을 알려줘. 파일은 변경하지 마.';
const initialMessage = 'README에서 실행 방법을 확인했습니다. 목록 코드는 src/tasks.ts에 있고, 변경된 파일은 0개입니다.';
const demoResults: Record<string, string> = {
  '/update': '업데이트 연습입니다. 실제 업데이트는 사내 설치판에서 지원할 때 사내 안내에 따라 진행하세요.',
  '/models': '선택된 모델: 사내 승인 모델 (예시). 실제 모델 목록은 설치판에서 확인하세요.',
  '/status': '현재 상태: 입력 대기. 선택된 에이전트는 Plan이며, 가상 프로젝트의 예시입니다.',
  '/help': '요청을 입력하고 Enter를 누르세요. Ctrl+P에서 체험용 명령을 찾을 수 있습니다.',
  '/sessions': '세션 목록 (예시): 첫 프로젝트 읽기. 이 체험의 요청 기록은 현재 페이지에 유지됩니다.',
};
const paletteCommands = [
  { group: 'Suggested', label: 'Switch session', detail: '세션 전환', command: '/sessions', hint: 'ctrl+x l' },
  { group: 'Suggested', label: 'Switch model', detail: '모델 선택', command: '/models', hint: 'ctrl+x m' },
  { group: 'System', label: 'Update OpenCode', detail: '업데이트', command: '/update', hint: '/update' },
  { group: 'System', label: 'View status', detail: '현재 상태', command: '/status', hint: '' },
  { group: 'System', label: 'Help', detail: '도움말', command: '/help', hint: '' },
];
const paletteGroups = [...new Set(paletteCommands.map(command => command.group))];

export function TerminalDemo() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([{ request: example, message: initialMessage }]);
  const [expanded, setExpanded] = useState(true);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState('');
  const inputField = useRef<HTMLInputElement>(null);
  const searchField = useRef<HTMLInputElement>(null);
  const output = useRef<HTMLDivElement>(null);
  const filtered = paletteCommands.filter(command =>
    `${command.command} ${command.label} ${command.detail}`.toLowerCase().includes(query.trim().toLowerCase()));

  useLayoutEffect(() => {
    if (expanded && output.current) output.current.scrollTop = output.current.scrollHeight;
  }, [history.length, expanded]);

  useLayoutEffect(() => {
    if (paletteOpen) searchField.current?.focus();
  }, [paletteOpen]);

  function openPalette() {
    setQuery('');
    setActive(0);
    setPaletteOpen(true);
  }

  function closePalette() {
    setPaletteOpen(false);
    requestAnimationFrame(() => inputField.current?.focus({ preventScroll: true }));
  }

  function run(value: string) {
    if (!value) return;
    if (value.toLowerCase() === 'ctrl+p') {
      setInput('');
      openPalette();
      return;
    }
    const message = Object.hasOwn(demoResults, value) ? demoResults[value] :
      value === 'opencode' ? 'OpenCode 화면이 열렸습니다 (예시). 아래 입력창에 요청을 적어 보세요.' :
      value.startsWith('/') ? '이 체험에서 제공하는 명령은 팔레트에서 볼 수 있습니다.' :
      '예시 응답: README에서 실행 절차와 테스트 위치를 찾았습니다. 변경된 파일은 0개입니다.';
    setHistory(previous => [...previous, { request: value, message }]);
    setInput('');
    closePalette();
  }

  return <section className="tui-demo" aria-labelledby="tui-heading">
    <h3 id="tui-heading">OpenCode 화면 살펴보기</h3>
    <p>왼쪽에서 요청과 결과를 확인하고 아래에 다음 요청을 입력하세요. 세션 정보와 현재 경로는 오른쪽 패널에 있습니다. 결과와 상태는 가상 프로젝트의 예시입니다.</p>
    <div className="tui-window" onKeyDown={event => {
      if (expanded && event.ctrlKey && event.key.toLowerCase() === 'p') {
        event.preventDefault();
        openPalette();
      }
      if (paletteOpen && event.key === 'Escape') {
        event.preventDefault();
        closePalette();
      }
    }}>
      <div className="tui-bar" inert={paletteOpen}>
        <span aria-hidden="true">›_</span>
        <strong>OC │ 할 일 목록 살펴보기</strong>
        <button type="button" aria-controls="tui-panel" aria-expanded={expanded}
          onClick={() => setExpanded(open => !open)}>
          {expanded ? 'TUI 접기' : 'TUI 펼치기'}
        </button>
      </div>
      {paletteOpen && <div className="tui-palette-layer" onClick={event => {
        if (event.target === event.currentTarget) closePalette();
      }}>
      <dialog open className="tui-palette" aria-labelledby="tui-palette-title">
        <form onSubmit={event => {
          event.preventDefault();
          if (filtered[active]) run(filtered[active].command);
        }} onKeyDown={event => {
          if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
          if (!filtered.length) return;
          event.preventDefault();
          const index = (active + (event.key === 'ArrowDown' ? 1 : -1) + filtered.length) % filtered.length;
          setActive(index);
          document.getElementById(`tui-option-${index}`)?.scrollIntoView({ block: 'nearest' });
        }}>
          <div className="tui-palette-title">
            <strong id="tui-palette-title">Commands</strong>
            <button type="button" aria-label="명령 팔레트 닫기" onClick={closePalette}>esc</button>
          </div>
          <input id="tui-search" ref={searchField} placeholder="Search" autoComplete="off" value={query}
            role="combobox" aria-label="명령 팔레트" aria-controls="tui-options" aria-expanded="true"
            aria-activedescendant={filtered.length ? `tui-option-${active}` : undefined}
            onChange={event => { setQuery(event.target.value); setActive(0); }}/>
          <div className="tui-options" id="tui-options" role="listbox" aria-label="체험 명령">
            {paletteGroups.map(group => {
              const items = filtered.filter(command => command.group === group);
              if (!items.length) return null;
              return <div key={group} role="group" aria-label={group}>
                <div className="tui-palette-group" aria-hidden="true">{group}</div>
                {items.map(command => {
                  const index = filtered.indexOf(command);
                  return <button type="button" key={command.command} role="option" tabIndex={-1}
                    id={`tui-option-${index}`} aria-selected={index === active}
                    onMouseMove={() => setActive(index)} onClick={() => run(command.command)}>
                    {command.label}<span>{command.hint}</span>
                  </button>;
                })}
              </div>;
            })}
          </div>
          {!filtered.length && <p className="tui-empty" role="status">일치하는 체험 명령이 없습니다.</p>}
        </form>
      </dialog>
      </div>}
      <div className="tui-layout" id="tui-panel" hidden={!expanded} inert={paletteOpen}>
        <div className="tui-conversation">
          <div className="tui-output" role="log" aria-label="요청 및 결과 기록" tabIndex={0} ref={output}>
            {history.map(({ request, message }, index) => <div className="tui-turn" key={index}>
              <div className="tui-request"><span>요청</span><p>{request}</p></div>
              {index === 0 && <div className="tui-tool"><span>Read</span> README.md <span>✓</span></div>}
              <div className="tui-response"><strong>결과</strong><p>{message}</p></div>
            </div>)}
          </div>
          <form className="tui-input" onSubmit={event => { event.preventDefault(); run(input.trim()); }}>
            <label htmlFor="tui-prompt">입력</label>
            <input id="tui-prompt" ref={inputField} value={input} maxLength={240} autoComplete="off"
              placeholder="요청을 입력하고 Enter" onChange={event => setInput(event.target.value)}/>
            <button type="submit">전송</button>
            <div className="tui-agent"><strong>Plan</strong> 사내 승인 모델 (예시)</div>
          </form>
          <div className="tui-footer">
            <span role="status">현재 상태 · {history.length > 1 ? '예시 응답 표시' : '입력 대기'}</span>
            <div className="tui-buttons">
              <button type="button" onClick={openPalette}><kbd>Ctrl+P</kbd> 명령 팔레트</button>
              <button type="button" onClick={() => run(example)}>예시 요청 실행</button>
            </div>
          </div>
        </div>
        <aside className="tui-context" aria-label="세션 정보">
          <strong className="tui-session-title">할 일 목록 살펴보기</strong>
          <dl>
            <dt>Context</dt><dd>요청 {history.length}개 · 모의 세션</dd>
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
