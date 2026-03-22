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

export const semantic = {
  success: '#5a8a5a',
  successSoft: '#f0f5f0',
  successMuted: '#4a6b4a',
  warning: '#b8860b',
  warningSoft: '#f5f0e0',
  error: '#c85f49',
  errorSoft: '#f5e8e6',
  info: '#5a7a8a',
  infoSoft: '#e8f0f5',
} as const;

export type SemanticToken = keyof typeof semantic;

export const transitions = {
  fast: { duration: 0.12, ease: 'easeOut' },
  normal: { duration: 0.2, ease: 'easeOut' },
  slow: { duration: 0.35, ease: 'easeInOut' },
  spring: { type: 'spring', stiffness: 300, damping: 24 },
} as const;
