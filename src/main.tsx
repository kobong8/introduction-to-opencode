import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import './typography.css';

const root = createRoot(document.getElementById('root')!);
root.render(<main style={{padding:'48px 24px'}} role="status">가이드를 불러오는 중입니다…</main>);
import('./App').then(({default:App}) => {
  root.render(<React.StrictMode><App/></React.StrictMode>);
}).catch(() => {
  root.render(<main style={{padding:'48px 24px'}}>
    <h1>가이드를 불러오지 못했습니다.</h1>
    <p role="alert">페이지를 새로고침한 뒤 다시 시도하세요.</p>
    <button className="primary" onClick={()=>location.reload()}>다시 시도</button>
  </main>);
});
