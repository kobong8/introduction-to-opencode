import manuscript from '../CONTENTS.md?raw';
import references from '../SOURCES.md?raw';
import { parseGuide, searchCommands } from './parse-content';

const guide = parseGuide(manuscript, references);
export const { chapters, sources, appendix, commands } = guide;
export function filterCommands(query: string, scope: string) {
  return searchCommands(commands, query, scope);
}
