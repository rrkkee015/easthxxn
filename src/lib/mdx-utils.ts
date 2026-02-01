export function extractFirstImage(body: string): string | null {
  const match = /img,\{src:"([^"]+)"/.exec(body);
  return match ? match[1] : null;
}

export function extractToc(body: string): { id: string; text: string; level: number }[] {
  const regex = /\.h([23]),\{id:"([^"]+)",children:("([^"]+)"|\["([^"]+)")/g;
  const toc: { id: string; text: string; level: number }[] = [];
  let match;
  while ((match = regex.exec(body)) !== null) {
    const level = parseInt(match[1]);
    const id = match[2];
    const text = (match[4] ?? match[5]).trim();
    if (id && text) {
      toc.push({ id, text, level });
    }
  }
  return toc;
}
