export const aw = {
  shell: '#d8ddde',
  paperTop: '#f7f8f8',
  paperBottom: '#eceeef',
  haze: '#eef1f1',
  map: '#dadedf',
  mapSoft: '#e5e8e8',
  lineFaint: '#dcdfdf',
  line: '#bec4c6',
  lineDark: '#a4abae',
  lineInk: '#8c9396',
  textStrong: '#5a6266',
  text: '#6e767a',
  textSoft: '#93999c',
  plate: '#63696d',
  plateDark: '#4f5559',
  accent: '#d56f5f',
  accentStrong: '#c85f49',
  accentSoft: '#ebbab0',
  inverse: '#f8f8f8',
} as const;

export type AwToken = keyof typeof aw;
