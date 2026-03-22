import { X } from 'lucide-react';
import type { CodeFile } from '../../data/code-files';
import { aw, semantic } from '../../theme/tokens';

interface Span {
  text: string;
  color: string;
  italic?: boolean;
}

const KEYWORDS = new Set([
  'const',
  'let',
  'function',
  'return',
  'import',
  'export',
  'if',
  'else',
  'async',
  'await',
  'type',
  'interface',
]);

function highlightLine(line: string, _language: string): Span[] {
  if (line.trimStart().startsWith('//')) {
    return [{ text: line, color: aw.textSoft, italic: true }];
  }
  const spans: Span[] = [];
  let remaining = line;
  const strRe = /^(["'`])(?:[^\\]|\\.)*?\1/;
  const upperRe = /^[A-Z][A-Za-z0-9]*/;
  const wordRe = /^[a-zA-Z_$][a-zA-Z0-9_$]*/;
  while (remaining.length > 0) {
    const strMatch = strRe.exec(remaining);
    if (strMatch) {
      spans.push({ text: strMatch[0], color: semantic.success });
      remaining = remaining.slice(strMatch[0].length);
      continue;
    }
    const upperMatch = upperRe.exec(remaining);
    if (upperMatch) {
      spans.push({ text: upperMatch[0], color: semantic.info });
      remaining = remaining.slice(upperMatch[0].length);
      continue;
    }
    const wordMatch = wordRe.exec(remaining);
    if (wordMatch) {
      const color = KEYWORDS.has(wordMatch[0]) ? aw.accent : aw.inverse;
      spans.push({ text: wordMatch[0], color });
      remaining = remaining.slice(wordMatch[0].length);
      continue;
    }
    spans.push({ text: remaining.charAt(0), color: aw.inverse });
    remaining = remaining.slice(1);
  }
  return spans;
}

function CodeTabBar({
  openFiles,
  activeFile,
  onTabSelect,
  onTabClose,
}: {
  openFiles: string[];
  activeFile: string;
  onTabSelect: (path: string) => void;
  onTabClose: (path: string) => void;
}) {
  return (
    <div className="flex overflow-x-auto" style={{ borderBottom: `1px solid ${aw.lineDark}` }}>
      {openFiles.map((filePath) => {
        const name = filePath.split('/').pop() ?? filePath;
        const isActive = filePath === activeFile;
        return (
          <button
            key={filePath}
            className="aw-focus-ring flex shrink-0 items-center gap-1.5 px-3 py-1.5"
            style={{
              backgroundColor: isActive ? aw.plate : 'transparent',
              color: isActive ? aw.inverse : aw.textSoft,
            }}
            onClick={() => onTabSelect(filePath)}
          >
            <span className="aw-micro font-mono">{name}</span>
            <span
              role="button"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(filePath);
              }}
            >
              <X size={10} />
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function CodeViewer({
  files,
  activeFile,
  openFiles,
  onTabClose,
  onTabSelect,
}: {
  files: CodeFile[];
  activeFile: string;
  openFiles: string[];
  onTabClose: (path: string) => void;
  onTabSelect: (path: string) => void;
}) {
  const file = files.find((f) => f.path === activeFile);
  const lines = file?.content.split('\n') ?? [];

  return (
    <div className="flex h-full flex-col">
      <CodeTabBar
        openFiles={openFiles}
        activeFile={activeFile}
        onTabSelect={onTabSelect}
        onTabClose={onTabClose}
      />
      <div
        className="flex-1 overflow-auto font-mono text-[13px] leading-5"
        style={{ backgroundColor: aw.plateDark }}
      >
        {lines.map((line, i) => {
          const lineNum = i + 1;
          const isAdded = file?.diff?.added.includes(lineNum);
          const isRemoved = file?.diff?.removed.includes(lineNum);
          const borderColor = isAdded
            ? semantic.success
            : isRemoved
              ? semantic.error
              : 'transparent';
          return (
            <div key={i} className="flex" style={{ borderLeft: `3px solid ${borderColor}` }}>
              <span
                className="shrink-0 select-none text-right pr-2"
                style={{ width: 40, color: aw.textSoft }}
              >
                {lineNum}
              </span>
              <span className="whitespace-pre">
                {highlightLine(line, file?.language ?? '').map((span, j) => (
                  <span
                    key={j}
                    style={{ color: span.color, fontStyle: span.italic ? 'italic' : undefined }}
                  >
                    {span.text}
                  </span>
                ))}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
