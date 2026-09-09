export const emojiSrc = (e: string) =>
  'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/' +
  Array.from(e)
    .map(c => c.codePointAt(0)!)
    .filter(cp => cp !== 0xfe0f)
    .map(cp => cp.toString(16))
    .join('-') +
  '.svg';

