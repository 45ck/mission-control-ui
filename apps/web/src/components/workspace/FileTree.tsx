import { useState } from 'react';
import { FileCode, FileJson, FileText, Folder, FolderOpen } from 'lucide-react';
import type { FileTreeNode } from '../../data/code-files';
import { aw } from '../../theme/tokens';

function getFileIcon(name: string) {
  if (name.endsWith('.ts') || name.endsWith('.tsx')) return FileCode;
  if (name.endsWith('.json')) return FileJson;
  return FileText;
}

function buildDefaults(nodes: FileTreeNode[], depth: number): Record<string, boolean> {
  let result: Record<string, boolean> = {};
  for (const node of nodes) {
    if (node.type === 'directory') {
      if (depth < 2) result[node.path] = true;
      if (node.children) {
        result = { ...result, ...buildDefaults(node.children, depth + 1) };
      }
    }
  }
  return result;
}

function FileTreeItem({
  node,
  depth,
  activeFile,
  expanded,
  onToggle,
  onFileSelect,
}: {
  node: FileTreeNode;
  depth: number;
  activeFile: string;
  expanded: Record<string, boolean>;
  onToggle: (path: string) => void;
  onFileSelect: (path: string) => void;
}) {
  const isDir = node.type === 'directory';
  const isOpen = expanded[node.path] ?? false;
  const isActive = !isDir && node.path === activeFile;
  const Icon = isDir ? (isOpen ? FolderOpen : Folder) : getFileIcon(node.name);

  return (
    <>
      <button
        className="aw-focus-ring flex w-full items-center gap-1.5 py-0.5 cursor-pointer"
        style={{
          paddingLeft: depth * 12,
          backgroundColor: isActive ? aw.haze : 'transparent',
          borderLeft: isActive ? `3px solid ${aw.accent}` : '3px solid transparent',
        }}
        onClick={() => (isDir ? onToggle(node.path) : onFileSelect(node.path))}
      >
        <Icon size={14} style={{ color: aw.textSoft }} />
        <span className="aw-micro" style={{ color: isActive ? aw.textStrong : aw.text }}>
          {node.name}
        </span>
      </button>
      {isDir &&
        isOpen &&
        node.children?.map((child) => (
          <FileTreeItem
            key={child.path}
            node={child}
            depth={depth + 1}
            activeFile={activeFile}
            expanded={expanded}
            onToggle={onToggle}
            onFileSelect={onFileSelect}
          />
        ))}
    </>
  );
}

export function FileTree({
  tree,
  activeFile,
  onFileSelect,
}: {
  tree: FileTreeNode[];
  activeFile: string;
  onFileSelect: (path: string) => void;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    tree.reduce((acc, node) => ({ ...acc, ...buildDefaults([node], 0) }), {}),
  );

  const handleToggle = (path: string) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <div className="flex flex-col overflow-y-auto py-1">
      {tree.map((node) => (
        <FileTreeItem
          key={node.path}
          node={node}
          depth={0}
          activeFile={activeFile}
          expanded={expanded}
          onToggle={handleToggle}
          onFileSelect={onFileSelect}
        />
      ))}
    </div>
  );
}
