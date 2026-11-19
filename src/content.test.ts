import { describe,it,expect } from 'vitest';
import manuscript from '../CONTENTS.md?raw';
import references from '../SOURCES.md?raw';
import { parseGuide, searchCommands } from './parse-content';
const {chapters,sources,commands}=parseGuide(manuscript,references);
const filterCommands=(query:string,scope:string)=>searchCommands(commands,query,scope);
describe('provided manuscript',()=>{
 it('keeps all 11 chapters and their summaries',()=>{expect(chapters).toHaveLength(11);expect(new Set(chapters.map(c=>c.id)).size).toBe(11);for(const c of chapters){expect(c.summary).toHaveLength(3);expect(c.body.length).toBeGreaterThan(400)}});
 it('keeps sources separate from the manuscript',()=>{expect(sources).toHaveLength(20);expect(chapters.every(chapter=>!/\[S\d{2}/.test(chapter.body))).toBe(true);expect(sources.find(s=>s.id==='S15')?.checkedAt).toBe('2026-10-13');expect(sources.find(s=>s.id==='S03')?.checkedAt).toBe('2026-10-01')});
 it('preserves safety and version context',()=>{expect(chapters[0].body).toContain('설치와 초기 설정');expect(chapters[0].body).not.toContain('사내 활용 경험');expect(chapters[5].body).toContain('.sisyphus/plans');expect(chapters[5].body).toContain('.omo/plans');expect(chapters[9].body).toContain('사내에서 사용이 허용된 프로그램')});
});
describe('command search',()=>{
 it('finds command, description and shortcut with normalized input',()=>{expect(filterCommands('  /MODELS  ','all')[0].command).toBe('/models');expect(filterCommands('이전 세션','opencode')[0].command).toBe('/sessions');expect(filterCommands('팔레트','opencode').map(c=>c.command)).toContain('Ctrl+P')});
 it('combines scope and text',()=>{expect(commands.map(c=>c.command)).toEqual(['opencode','Ctrl+P','/update','/models','/sessions']);expect(filterCommands('/update','internal')[0]?.command).toBe('/update');expect(filterCommands('/update','opencode')).toHaveLength(0);expect(filterCommands('ulw','all')).toHaveLength(0);expect(filterCommands('/ulw','opencode')).toHaveLength(0);expect(filterCommands('missing command','all')).toHaveLength(0)});
});
