import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarkdownViewer } from './MarkdownViewer.js';

describe('MarkdownViewer', () => {
  it('renders an h1 heading as h3 element (intentional downscale)', () => {
    render(<MarkdownViewer content="# Main Heading" />);
    const el = screen.getByText('Main Heading');
    expect(el).toBeInTheDocument();
    expect(el.tagName).toBe('H3');
  });

  it('renders an h2 heading as h4 element (intentional downscale)', () => {
    render(<MarkdownViewer content="## Section Heading" />);
    const el = screen.getByText('Section Heading');
    expect(el).toBeInTheDocument();
    expect(el.tagName).toBe('H4');
  });

  it('renders an h3 heading as h5 element (intentional downscale)', () => {
    render(<MarkdownViewer content="### Subsection" />);
    const el = screen.getByText('Subsection');
    expect(el).toBeInTheDocument();
    expect(el.tagName).toBe('H5');
  });

  it('renders bold text with <strong>', () => {
    render(<MarkdownViewer content="This is **bold** text" />);
    const strong = screen.getByText('bold');
    expect(strong.tagName).toBe('STRONG');
  });

  it('renders italic text with <em>', () => {
    render(<MarkdownViewer content="This is *italic* text" />);
    const em = screen.getByText('italic');
    expect(em.tagName).toBe('EM');
  });

  it('renders inline code with <code>', () => {
    render(<MarkdownViewer content="Use `console.log` here" />);
    const code = screen.getByText('console.log');
    expect(code.tagName).toBe('CODE');
  });

  it('renders code blocks with <pre>', () => {
    const content = '```\nconst x = 1;\nconst y = 2;\n```';
    const { container } = render(<MarkdownViewer content={content} />);
    const pre = container.querySelector('pre');
    expect(pre).not.toBeNull();
    expect(pre!.textContent).toContain('const x = 1;');
    expect(pre!.textContent).toContain('const y = 2;');
  });

  it('renders unordered lists', () => {
    const content = '- First item\n- Second item\n- Third item';
    render(<MarkdownViewer content={content} />);
    expect(screen.getByText('First item')).toBeInTheDocument();
    expect(screen.getByText('Second item')).toBeInTheDocument();
    expect(screen.getByText('Third item')).toBeInTheDocument();
  });

  it('renders tables as code blocks', () => {
    const content = '| A | B |\n|---|---|\n| 1 | 2 |';
    render(<MarkdownViewer content={content} />);
    expect(screen.getByText(/\| A \| B \|/)).toBeInTheDocument();
  });

  it('renders paragraphs for plain text', () => {
    render(<MarkdownViewer content="Just a paragraph of text." />);
    expect(screen.getByText('Just a paragraph of text.')).toBeInTheDocument();
  });

  it('renders empty content without crashing', () => {
    const { container } = render(<MarkdownViewer content="" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('handles mixed content with multiple block types', () => {
    const content = [
      '# Title',
      '',
      'A paragraph.',
      '',
      '- Item one',
      '- Item two',
      '',
      '```',
      'code block',
      '```',
    ].join('\n');

    render(<MarkdownViewer content={content} />);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('A paragraph.')).toBeInTheDocument();
    expect(screen.getByText('Item one')).toBeInTheDocument();
    expect(screen.getByText('code block')).toBeInTheDocument();
  });

  it('supports * bullet syntax alongside -', () => {
    const content = '* Alpha\n* Beta';
    render(<MarkdownViewer content={content} />);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });
});
