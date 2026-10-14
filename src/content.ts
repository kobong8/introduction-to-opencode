import { parseGuide, searchCommands } from './parse-content';

// Resolve against the document, so a reverse proxy can also serve a URL prefix.
const response = await fetch(new URL('./api/documents', document.baseURI), {
  cache: 'no-store',
  signal: AbortSignal.timeout(15000),
});
if (!response.ok) throw new Error(`Guide request failed (${response.status})`);
const documents: { manuscript: string; references: string } = await response.json();
const guide = parseGuide(documents.manuscript, documents.references);
export const { chapters, sources, appendix, commands } = guide;
export function filterCommands(query:string,scope:string) {
  return searchCommands(commands,query,scope);
}
