import {test,expect} from '@playwright/test';
test('desktop reading, search, version filters, summaries, copy and history',async({page,context})=>{
 await page.setViewportSize({width:1440,height:1000});
 const external:string[]=[];const errors:string[]=[];
 page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:4173'))external.push(r.url())});page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.locator('section.chapter[id]')).toHaveCount(13);
 await page.screenshot({path:'qa/static/desktop-1440.png',fullPage:false});
 await page.getByRole('navigation').getByText('OpenCode 첫 사용').click();await expect(page).toHaveURL(/#basics/);
 await page.getByLabel('명령어 검색').fill('  /MODELS  ');await expect(page.locator('.command-tool tbody tr')).toHaveCount(1);
 await page.getByLabel('명령어 버전 필터').selectOption('internal');await expect(page.getByText('일치하는 명령어가 없습니다.')).toBeVisible();
 await page.getByRole('button',{name:'필터 초기화'}).click();await expect(page.locator('.command-tool tbody tr')).toHaveCount(5);
 await expect(page.locator('.command-tool tbody tr code')).toHaveText(['opencode','Ctrl+P','/update','/models','/sessions']);
 await expect(page.locator('.command-tool tbody')).toContainText('/update');
 await page.getByLabel('명령어 버전 필터').selectOption('internal');await expect(page.locator('.command-tool tbody')).toContainText('/update');
 const terminal = page.locator('.tui-window');
 await expect(terminal.locator('.tui-layout')).toBeHidden();
 await terminal.getByRole('button',{name:'TUI 펼치기'}).click();
 await expect(terminal.locator('.tui-layout')).toBeVisible();
 await expect(terminal).toContainText('~/projects/demo-guide');
 await terminal.getByLabel('입력',{exact:true}).press('Control+p');
 await terminal.getByRole('combobox',{name:'명령 팔레트'}).fill('모델');
 await terminal.getByRole('combobox',{name:'명령 팔레트'}).press('Enter');
 await expect(terminal.locator('.tui-output')).toContainText('선택된 모델');
 await terminal.getByRole('button',{name:'예시 요청 실행'}).click();
 await expect(terminal.locator('.tui-output')).toContainText('변경된 파일은 0개');
 await expect(terminal.locator('.tui-turn')).toHaveCount(3);
 await expect(terminal.locator('.tui-output')).toContainText('선택된 모델');
 await terminal.getByRole('button',{name:'TUI 접기'}).click();
 await expect(terminal.locator('.tui-layout')).toBeHidden();
 await terminal.getByRole('button',{name:'TUI 펼치기'}).click();
 await expect(terminal.locator('.tui-turn')).toHaveCount(3);
 await terminal.getByRole('button',{name:'Ctrl+P 명령 팔레트'}).click();
 await expect(terminal.getByRole('dialog',{name:'Commands'})).toBeVisible();
 const terminalBox = (await terminal.boundingBox())!;
 const paletteBox = (await terminal.getByRole('dialog',{name:'Commands'}).boundingBox())!;
 expect(paletteBox.x).toBeGreaterThan(terminalBox.x);
 expect(paletteBox.y).toBeGreaterThan(terminalBox.y);
 expect(paletteBox.x + paletteBox.width).toBeLessThan(terminalBox.x + terminalBox.width);
 expect(paletteBox.y + paletteBox.height).toBeLessThan(terminalBox.y + terminalBox.height);
 await page.getByRole('button',{name:'▤ 읽기 모드',exact:true}).click({trial:true});
 await expect(terminal.getByRole('option',{selected:true})).toHaveText(/Switch session/);
 await terminal.getByRole('combobox',{name:'명령 팔레트'}).press('ArrowDown');
 await expect(terminal.getByRole('option',{selected:true})).toHaveText(/Switch model/);
 await page.keyboard.press('Escape');
 await expect(terminal.getByRole('dialog',{name:'Commands'})).toBeHidden();
 await expect(terminal.getByLabel('입력',{exact:true})).toBeFocused();
 await page.getByRole('navigation').getByText('프롬프트 설계').click();await page.locator('#prompts summary').click();
 await context.grantPermissions(['clipboard-read','clipboard-write']);await page.locator('#prompts .code-bar button').first().click();await expect(page.locator('#prompts [role=status]').first()).toHaveText('복사 완료');expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain('목표');
 await page.locator('#prompts .read-button').click();await page.reload();await expect(page.locator('#prompts .read-button')).toHaveText('✓ 읽었어요');
 await page.getByRole('button',{name:'▷ 발표 모드',exact:true}).click();await expect(page).toHaveURL(/mode=present/);await expect(page.locator('.presentation h1')).toHaveText('프롬프트 설계');
 await page.keyboard.press('ArrowRight');await expect(page.locator('.presentation h1')).toHaveText('계획·실행·세션 관리');await page.reload();await expect(page.locator('.presentation h1')).toHaveText('계획·실행·세션 관리');
 await page.screenshot({path:'qa/static/presentation-1440.png'});await page.goBack();await expect(page.locator('.presentation h1')).toHaveText('프롬프트 설계');
 expect(external).toEqual([]);expect(errors).toEqual([]);
});
test('mobile menu, layout, full manuscript without print',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');await expect(page.locator('.hero')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:'qa/static/mobile-390.png',fullPage:false});
 await page.getByLabel('목차 열기').click();await page.getByRole('navigation').getByText('검증과 증거').click();await expect(page).toHaveURL(/#verification/);await expect(page.locator('.sidebar')).not.toHaveClass(/is-open/);
 await page.locator('#verification summary').click();await expect(page.locator('#verification pre').first()).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByRole('button',{name:'전체 원고 펼치기 +'}).click();await expect(page.locator('details[open]')).toHaveCount(11);
 await expect(page.getByRole('button',{name:/인쇄/})).toHaveCount(0);
 await expect(page.locator('#references a')).toHaveCount(20);
 await expect(page.locator('#references')).toContainText('사내 네트워크에서는 아래 외부 링크에 접속하지 못할 수 있습니다.');
 await expect(page.locator('section.chapter:not(#references) a[href^="https://"]')).toHaveCount(0);
});
test('copy fallback and slide boundaries',async({page})=>{
 await page.goto('/#prompts');await page.locator('#prompts summary').click();await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(new Error('denied'))},configurable:true}));await page.locator('#prompts .code-bar button').first().click();await expect(page.locator('#prompts [role=status]').first()).toContainText('원문을 선택해');
 await page.goto('/?mode=present&chapter=why#why');await expect(page.getByRole('button',{name:'← 이전'})).toBeDisabled();await page.keyboard.press('ArrowLeft');await expect(page.locator('.presentation h1')).toHaveText('사내 OpenCode를 쓰는 이유');
 await page.goto('/?mode=present&chapter=conclusion#conclusion');await expect(page.getByRole('button',{name:'다음 →'})).toBeDisabled();await page.keyboard.press('ArrowRight');await expect(page.locator('.presentation h1')).toHaveText('팀의 다음 행동');
});
test('keyboard access, blocked storage and mobile presentation without print',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked')}})});
 await page.setViewportSize({width:390,height:844});await page.goto('/');await expect(page.locator('.hero')).toBeVisible();await page.keyboard.press('Tab');await expect(page.getByText('본문으로 건너뛰기')).toBeFocused();
 await page.getByRole('button',{name:'▷ 발표로 살펴보기'}).click();await page.getByRole('button',{name:'다음 →'}).click();await expect(page.locator('.presentation h1')).toHaveText('OpenCode 첫 사용');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:'qa/static/mobile-presentation-390.png'});
 await expect(page.getByRole('button',{name:/인쇄/})).toHaveCount(0);
});


test('static Pages subpath loads all assets without an API and preserves presentation links', async ({page, request}) => {
 const failures:string[]=[];
 const api:string[]=[];
 page.on('response', r => { if (r.status() >= 400) failures.push(r.url()); });
 page.on('request', r => { if (new URL(r.url()).pathname.includes('/api/')) api.push(r.url()); });
 await page.goto('/introduction-to-opencode/');
 await expect(page.locator('section.chapter[id]')).toHaveCount(13);
 await expect(page.locator('#harness')).toContainText('Caveman');
 await expect(page.locator('#prompts')).toContainText('사내 AI');
 await expect(page.locator('body')).toContainText('SonarQube');
 await expect(page.locator('body')).toContainText('Playwright');
 await page.goto('/introduction-to-opencode/?mode=present&chapter=prompts#prompts');
 await page.reload();
 await expect(page.locator('.presentation h1')).toHaveText('프롬프트 설계');
 expect(failures).toEqual([]);
 expect(api).toEqual([]);
 expect((await request.get('/introduction-to-opencode/api/documents')).status()).toBe(404);
});


test('presentation cards, chapter navigation and return to reading', async ({page}) => {
 await page.goto('/?mode=present&chapter=why#why');
 await expect(page.locator('.sidebar')).toBeHidden();
 for (const width of [1440, 390]) {
  await page.setViewportSize({width,height:1000});
  for (let i=0;i<11;i++) {
   await page.locator('.deck-pages button').nth(i).click();
   await expect(page.locator('.deck-card')).toHaveCount(3);
   await expect(page.getByRole('progressbar',{name:'발표 진행'})).toHaveAttribute('aria-valuenow',String(i+1));
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
 }
 await expect(page.locator('.presentation a[href^="https://"]')).toHaveCount(0);
 await page.keyboard.press('Escape');
 await expect(page.locator('#conclusion')).toBeVisible();
 await expect(page.locator('body')).not.toHaveClass(/is-presenting/);
 await expect(page).not.toHaveURL(/mode=present/);
});
