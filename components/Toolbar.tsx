import React from 'react';
import { BlockType } from '../types';
import { Heading1Icon, ParagraphIcon, ListIcon, CodeIcon, TableIcon } from './icons';

interface ToolbarProps {
  onAddBlock: (type: BlockType) => void;
}

const ToolButton: React.FC<{ onClick: () => void; children: React.ReactNode, title: string }> = ({ onClick, children, title }) => (
  <button
    onClick={onClick}
    title={title}
    className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-md shadow-sm hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
  >
    {children}
  </button>
);

export const Toolbar: React.FC<ToolbarProps> = ({ onAddBlock }) => {
  return (
    <div className="p-4 bg-slate-100/80 backdrop-blur-sm border-t border-slate-200 sticky bottom-0 flex justify-center items-center gap-3">
      <ToolButton onClick={() => onAddBlock(BlockType.Heading1)} title="Add Heading 1">
        <Heading1Icon className="w-5 h-5" />
        <span className="hidden sm:inline">Heading</span>
      </ToolButton>
      <ToolButton onClick={() => onAddBlock(BlockType.Paragraph)} title="Add Paragraph">
        <ParagraphIcon className="w-5 h-5" />
        <span className="hidden sm:inline">Paragraph</span>
      </ToolButton>
      <ToolButton onClick={() => onAddBlock(BlockType.UnorderedList)} title="Add List">
        <ListIcon className="w-5 h-5" />
        <span className="hidden sm:inline">List</span>
      </ToolButton>
       <ToolButton onClick={() => onAddBlock(BlockType.Table)} title="Add Table">
        <TableIcon className="w-5 h-5" />
        <span className="hidden sm:inline">Table</span>
      </ToolButton>
      <ToolButton onClick={() => onAddBlock(BlockType.Code)} title="Add Code Block">
        <CodeIcon className="w-5 h-5" />
        <span className="hidden sm:inline">Code</span>
      </ToolButton>
    </div>
  );
};
