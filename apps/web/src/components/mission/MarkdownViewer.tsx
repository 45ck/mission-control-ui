import { aw } from '../../theme/tokens';

interface MarkdownViewerProps {
  content: string;
}

/**
 * Lightweight markdown renderer — handles headings, bold, italic, inline code,
 * code blocks, unordered lists, and paragraphs. No external dependencies.
 */
export function MarkdownViewer({ content }: MarkdownViewerProps) {
  const blocks = parseBlocks(content);

  return (
    <div className="space-y-2" style={{ color: aw.text }}>
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}

// ── Block parsing ──────────────────────────────────────────────

type BlockNode =
  | { type: 'h1'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'codeblock'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'p'; text: string };

function parseBlocks(src: string): BlockNode[] {
  const lines = src.split('\n');
  const blocks: BlockNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i]!;

    // Code block
    if (line.trimStart().startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i]!.trimStart().startsWith('```')) {
        codeLines.push(lines[i]!);
        i++;
      }
      i++; // skip closing ```
      blocks.push({ type: 'codeblock', text: codeLines.join('\n') });
      continue;
    }

    // Headings
    if (line.startsWith('### ')) {
      blocks.push({ type: 'h3', text: line.slice(4) });
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      blocks.push({ type: 'h2', text: line.slice(3) });
      i++;
      continue;
    }
    if (line.startsWith('# ')) {
      blocks.push({ type: 'h1', text: line.slice(2) });
      i++;
      continue;
    }

    // Unordered list
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const items: string[] = [];
      while (i < lines.length && (lines[i]!.startsWith('- ') || lines[i]!.startsWith('* '))) {
        items.push(lines[i]!.slice(2));
        i++;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }

    // Table rows — render as-is inside a code-like block for simplicity
    if (line.startsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i]!.startsWith('|')) {
        tableLines.push(lines[i]!);
        i++;
      }
      blocks.push({ type: 'codeblock', text: tableLines.join('\n') });
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Paragraph (collect consecutive non-special lines)
    const pLines: string[] = [];
    while (
      i < lines.length &&
      lines[i]!.trim() !== '' &&
      !lines[i]!.startsWith('#') &&
      !lines[i]!.startsWith('- ') &&
      !lines[i]!.startsWith('* ') &&
      !lines[i]!.startsWith('|') &&
      !lines[i]!.trimStart().startsWith('```')
    ) {
      pLines.push(lines[i]!);
      i++;
    }
    if (pLines.length > 0) {
      blocks.push({ type: 'p', text: pLines.join(' ') });
    }
  }

  return blocks;
}

// ── Block rendering ────────────────────────────────────────────

function Block({ block }: { block: BlockNode }) {
  switch (block.type) {
    case 'h1':
      return (
        <h3
          className="aw-section text-[14px] font-medium"
          style={{
            color: aw.textStrong,
            borderBottom: `1px solid ${aw.lineFaint}`,
            paddingBottom: 4,
          }}
        >
          {inlineRender(block.text)}
        </h3>
      );
    case 'h2':
      return (
        <h4 className="aw-section text-[13px] font-medium" style={{ color: aw.textStrong }}>
          {inlineRender(block.text)}
        </h4>
      );
    case 'h3':
      return (
        <h5 className="aw-micro text-[12px] uppercase" style={{ color: aw.textSoft }}>
          {inlineRender(block.text)}
        </h5>
      );
    case 'codeblock':
      return (
        <pre
          className="overflow-x-auto rounded p-3 text-[11px] leading-relaxed"
          style={{
            backgroundColor: aw.haze,
            color: aw.textStrong,
            border: `1px solid ${aw.lineFaint}`,
          }}
        >
          {block.text}
        </pre>
      );
    case 'ul':
      return (
        <ul className="space-y-0.5 pl-4">
          {block.items.map((item, i) => (
            <li key={i} className="aw-body list-disc text-[12px]" style={{ color: aw.text }}>
              {inlineRender(item)}
            </li>
          ))}
        </ul>
      );
    case 'p':
      return (
        <p className="aw-body text-[12px] leading-relaxed" style={{ color: aw.text }}>
          {inlineRender(block.text)}
        </p>
      );
  }
}

// ── Inline rendering (bold, italic, code) ──────────────────────

function inlineRender(text: string): (string | JSX.Element)[] {
  // Split by inline patterns: **bold**, *italic*, `code`
  const parts: (string | JSX.Element)[] = [];
  // Combined regex: backtick code, bold, italic
  const re = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    const raw = match[0];
    if (raw.startsWith('`')) {
      parts.push(
        <code
          key={match.index}
          className="rounded px-1 py-0.5 text-[11px]"
          style={{ backgroundColor: aw.haze, color: aw.textStrong }}
        >
          {raw.slice(1, -1)}
        </code>,
      );
    } else if (raw.startsWith('**')) {
      parts.push(
        <strong key={match.index} style={{ color: aw.textStrong }}>
          {raw.slice(2, -2)}
        </strong>,
      );
    } else if (raw.startsWith('*')) {
      parts.push(<em key={match.index}>{raw.slice(1, -1)}</em>);
    }
    last = match.index + raw.length;
  }

  if (last < text.length) {
    parts.push(text.slice(last));
  }

  return parts;
}
