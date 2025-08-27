import React, { useState } from 'react';
import { ContentBlock, BlockType, TableData } from '../types';
import { generateContent } from '../services/geminiService';
import { TrashIcon, MagicWandIcon } from './icons';

interface BlockProps {
  block: ContentBlock;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id:string) => void;
  onChangeType: (id: string, newType: BlockType) => void;
  onGenerateAI: (id: string, prompt: string) => void;
  isGenerating: boolean;
}

const Block: React.FC<BlockProps> = ({ block, onUpdate, onDelete, onChangeType, onGenerateAI, isGenerating }) => {
  if (block.type === BlockType.Table) {
    let tableData: TableData;
    try {
      tableData = JSON.parse(block.content);
    } catch (e) {
      tableData = { headers: ['Error'], rows: [['Invalid table data']] };
    }

    const handleTableChange = (rowIndex: number, colIndex: number, value: string) => {
      const newRows = tableData.rows.map((row, rIdx) => 
        rIdx === rowIndex ? row.map((cell, cIdx) => cIdx === colIndex ? value : cell) : row
      );
      onUpdate(block.id, JSON.stringify({ ...tableData, rows: newRows }));
    };

    const handleHeaderChange = (colIndex: number, value: string) => {
        const newHeaders = tableData.headers.map((h, cIdx) => cIdx === colIndex ? value : h);
        onUpdate(block.id, JSON.stringify({ ...tableData, headers: newHeaders }));
    };

    const addRow = () => {
      if(tableData.headers.length === 0) return;
      const newRow = Array(tableData.headers.length).fill('');
      onUpdate(block.id, JSON.stringify({ ...tableData, rows: [...tableData.rows, newRow] }));
    };

    const addColumn = () => {
        const newHeaders = [...tableData.headers, `Header ${tableData.headers.length + 1}`];
        const newRows = tableData.rows.map(row => [...row, '']);
        onUpdate(block.id, JSON.stringify({ headers: newHeaders, rows: newRows }));
    };

    const deleteRow = (rowIndex: number) => {
      const newRows = tableData.rows.filter((_, i) => i !== rowIndex);
      onUpdate(block.id, JSON.stringify({ ...tableData, rows: newRows }));
    };

    const deleteColumn = (colIndex: number) => {
      if (tableData.headers.length <= 1) return; // Don't allow deleting the last column
      const newHeaders = tableData.headers.filter((_, i) => i !== colIndex);
      const newRows = tableData.rows.map(row => row.filter((_, i) => i !== colIndex));
      onUpdate(block.id, JSON.stringify({ headers: newHeaders, rows: newRows }));
    };

    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 group relative">
        <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr className="bg-slate-50">
                        {tableData.headers.map((header, colIndex) => (
                            <th key={colIndex} className="border border-slate-300 p-0 font-semibold text-slate-700 group/col relative">
                                <input type="text" value={header} onChange={e => handleHeaderChange(colIndex, e.target.value)} className="w-full p-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-slate-100"/>
                                <button
                                    onClick={() => deleteColumn(colIndex)}
                                    className="absolute top-1/2 right-1 -translate-y-1/2 text-slate-400 hover:text-red-600 opacity-0 group-hover/col:opacity-100 transition-opacity p-1 rounded-full hover:bg-red-50"
                                    title="Delete column"
                                    aria-label="Delete column"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </th>
                        ))}
                        <th className="p-1 w-8 border border-slate-300 bg-slate-50"></th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="group/row">
                            {row.map((cell, colIndex) => (
                                <td key={colIndex} className="border border-slate-300 p-0">
                                    <textarea value={cell} onChange={e => handleTableChange(rowIndex, colIndex, e.target.value)} className="w-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent resize-none" rows={1}/>
                                </td>
                            ))}
                             <td className="p-1 align-middle text-center border border-slate-300">
                                <button onClick={() => deleteRow(rowIndex)} className="text-slate-400 hover:text-red-600 opacity-0 group-hover/row:opacity-100 transition-opacity" title="Delete row" aria-label="Delete row">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="mt-2 flex gap-2">
            <button onClick={addRow} className="text-sm px-3 py-1 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-md transition-colors">Add Row</button>
            <button onClick={addColumn} className="text-sm px-3 py-1 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-md transition-colors">Add Column</button>
        </div>
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <select
            value={block.type}
            onChange={(e) => onChangeType(block.id, e.target.value as BlockType)}
            className="text-sm p-1 border rounded-md bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={BlockType.Heading1}>H1</option>
            <option value={BlockType.Heading2}>H2</option>
            <option value={BlockType.Heading3}>H3</option>
            <option value={BlockType.Paragraph}>P</option>
            <option value={BlockType.UnorderedList}>List</option>
            <option value={BlockType.Code}>Code</option>
            <option value={BlockType.Table}>Table</option>
          </select>
          <button
            onClick={() => onDelete(block.id)}
            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md"
            title="Delete block"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  const getPlaceholder = () => {
    switch (block.type) {
      case BlockType.Heading1: return "Heading 1";
      case BlockType.Heading2: return "Heading 2";
      case BlockType.Heading3: return "Heading 3";
      case BlockType.Paragraph: return "Type your text, or a prompt for AI...";
      case BlockType.UnorderedList: return "Enter list items, one per line";
      case BlockType.Code: return "Enter your code snippet";
      default: return "Type something...";
    }
  };

  const baseClasses = "w-full p-2 bg-transparent focus:outline-none resize-none";
  const typeClasses = {
    [BlockType.Heading1]: "text-4xl font-bold",
    [BlockType.Heading2]: "text-3xl font-semibold",
    [BlockType.Heading3]: "text-2xl font-medium",
    [BlockType.Paragraph]: "text-base",
    [BlockType.UnorderedList]: "text-base leading-relaxed",
    [BlockType.Code]: "font-mono text-sm bg-slate-100 rounded-md p-4",
    [BlockType.Table]: "",
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 group relative">
      <div className="flex items-start gap-2">
        <textarea
          value={block.content}
          onChange={(e) => onUpdate(block.id, e.target.value)}
          placeholder={getPlaceholder()}
          className={`${baseClasses} ${typeClasses[block.type]}`}
          rows={block.type === BlockType.Code || block.type === BlockType.UnorderedList ? 5 : 1}
          autoFocus
        />
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {block.type === BlockType.Paragraph && (
            <button
              onClick={() => onGenerateAI(block.id, block.content)}
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md disabled:opacity-50 disabled:cursor-wait"
              title="Generate with AI"
              disabled={isGenerating}
            >
              <MagicWandIcon className="w-5 h-5" />
            </button>
          )}
          <select
            value={block.type}
            onChange={(e) => onChangeType(block.id, e.target.value as BlockType)}
            className="text-sm p-1 border rounded-md bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={BlockType.Heading1}>H1</option>
            <option value={BlockType.Heading2}>H2</option>
            <option value={BlockType.Heading3}>H3</option>
            <option value={BlockType.Paragraph}>P</option>
            <option value={BlockType.UnorderedList}>List</option>
            <option value={BlockType.Code}>Code</option>
            <option value={BlockType.Table}>Table</option>
          </select>
          <button
            onClick={() => onDelete(block.id)}
            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md"
            title="Delete block"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};


interface EditorProps {
    blocks: ContentBlock[];
    setBlocks: React.Dispatch<React.SetStateAction<ContentBlock[]>>;
}

export const Editor: React.FC<EditorProps> = ({ blocks, setBlocks }) => {
  const [generatingBlockId, setGeneratingBlockId] = useState<string | null>(null);

  const updateBlock = (id: string, content: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b));
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const changeBlockType = (id: string, newType: BlockType) => {
    setBlocks(blocks.map(b => {
      if (b.id !== id) return b;
      if (b.type === BlockType.Table && newType !== BlockType.Table) {
        return { ...b, type: newType, content: 'Table content converted to text.' };
      }
       if (b.type !== BlockType.Table && newType === BlockType.Table) {
        const initialTableData: TableData = {
          headers: ['Header 1', 'Header 2'],
          rows: [['Cell 1', 'Cell 2']],
        };
        return { ...b, type: newType, content: JSON.stringify(initialTableData) };
      }
      return { ...b, type: newType };
    }));
  };

  const handleGenerateAI = async (id: string, prompt: string) => {
    setGeneratingBlockId(id);
    try {
      const newContent = await generateContent(prompt);
      updateBlock(id, newContent);
    } catch (error) {
      console.error("AI generation failed", error);
    } finally {
      setGeneratingBlockId(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {blocks.length > 0 ? (
        blocks.map(block => (
          <Block
            key={block.id}
            block={block}
            onUpdate={updateBlock}
            onDelete={deleteBlock}
            onChangeType={changeBlockType}
            onGenerateAI={handleGenerateAI}
            isGenerating={generatingBlockId === block.id}
          />
        ))
      ) : (
        <div className="text-center py-16 px-8 bg-white rounded-lg border-2 border-dashed border-slate-300">
            <h3 className="text-lg font-medium text-slate-700">Your document is empty.</h3>
            <p className="mt-1 text-sm text-slate-500">
              Click on the buttons below to add content blocks.
            </p>
        </div>
      )}
    </div>
  );
};