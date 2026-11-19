import parts from '../parts.json';

export { parts };
export type TutorialPart = typeof parts[number];

export function tutorialRoute(url: URL) {
  const page = url.pathname.split('/').at(-1);
  const part = parts.find(item => item.page === page);
  const present = url.searchParams.get('mode') === 'present';
  const id = (present ? url.searchParams.get('chapter') : null) || url.hash.slice(1);
  const chapterPart = parts.find(item => item.ids.includes(id));
  const redirect = chapterPart && chapterPart !== part
    ? new URL('./' + chapterPart.page + url.search + url.hash, url)
    : undefined;
  return { part, present, id: id || part?.ids[0] || '', redirect };
}
