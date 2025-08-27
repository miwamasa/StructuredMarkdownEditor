import React, { useState, useEffect, useRef } from 'react';
import { ContentBlock, BlockType, Variable, TableData } from './types';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { Toolbar } from './components/Toolbar';
import { VariablesEditor } from './components/VariablesEditor';
import { convertBlocksToMarkdown } from './services/markdownService';
import { DownloadIcon, UploadIcon, HelpIcon } from './components/icons';
import { HelpModal } from './components/HelpModal';

const initialBlocks: ContentBlock[] = [
  { id: crypto.randomUUID(), type: BlockType.Heading1, content: "Welcome to the Structured Markdown Editor" },
  { id: crypto.randomUUID(), type: BlockType.Paragraph, content: "This is a grid-based editor. Add, edit, or remove blocks using the controls. You can also generate content with AI!" },
  { id: crypto.randomUUID(), type: BlockType.Paragraph, content: "Try typing 'a short story about a robot who discovers music' into this block and click the ✨ icon." },
  { id: crypto.randomUUID(), type: BlockType.Paragraph, content: "Use variables like {{product_name}} which is defined below. The release date is {{release_date}}." },
];

const initialVariables: Variable[] = [
  { id: crypto.randomUUID(), key: 'product_name', value: 'Awesome Gadget' },
  { id: crypto.randomUUID(), key: 'release_date', value: '2024-10-26' },
];


function App() {
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialBlocks);
  const [variables, setVariables] = useState<Variable[]>(initialVariables);
  const [markdown, setMarkdown] = useState('');
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const generatedMarkdown = convertBlocksToMarkdown(blocks, variables);
    setMarkdown(generatedMarkdown);
  }, [blocks, variables]);

  const addBlock = (type: BlockType) => {
    let newBlock: ContentBlock;
    if (type === BlockType.Table) {
        const initialTableData: TableData = {
            headers: ['Product', 'Feature', 'Status'],
            rows: [
                ['{{product_name}}', 'AI Integration', 'In Progress'],
                ['{{product_name}}', 'Dark Mode', 'Done'],
            ]
        };
        newBlock = {
            id: crypto.randomUUID(),
            type,
            content: JSON.stringify(initialTableData),
        };
    } else {
        newBlock = {
            id: crypto.randomUUID(),
            type,
            content: '',
        };
    }
    setBlocks([...blocks, newBlock]);
  };

  const handleSaveToJson = () => {
    const data = {
      blocks,
      variables,
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'structured-markdown-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoadFromJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error("File content is not a string.");
        }
        const data = JSON.parse(text);

        if (Array.isArray(data.blocks) && Array.isArray(data.variables)) {
          setBlocks(data.blocks);
          setVariables(data.variables);
        } else {
          throw new Error("Invalid JSON structure. Missing 'blocks' or 'variables' array.");
        }
      } catch (error) {
        console.error("Failed to load or parse JSON file:", error);
        alert(`Error: Could not load data. Please ensure the file is a valid JSON export from this editor.\n\nDetails: ${error instanceof Error ? error.message : String(error)}`);
      }
    };
    reader.onerror = () => {
        alert("Error reading file.");
    }
    reader.readAsText(file);
    event.target.value = '';
  };


  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800">
      <header className="relative p-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <h1 className="text-xl font-bold text-center">Structured Markdown Editor</h1>
        <div className="absolute top-1/2 right-4 -translate-y-1/2 flex items-center gap-2">
            <button 
                onClick={handleSaveToJson} 
                title="Save as JSON" 
                className="p-2 text-slate-600 hover:bg-slate-200 hover:text-slate-800 rounded-md transition-colors"
                aria-label="Save as JSON"
            >
                <DownloadIcon className="w-5 h-5" />
            </button>
            <button 
                onClick={() => fileInputRef.current?.click()} 
                title="Load from JSON" 
                className="p-2 text-slate-600 hover:bg-slate-200 hover:text-slate-800 rounded-md transition-colors"
                aria-label="Load from JSON"
            >
                <UploadIcon className="w-5 h-5" />
            </button>
             <button
                onClick={() => setIsHelpModalOpen(true)}
                title="Help"
                className="p-2 text-slate-600 hover:bg-slate-200 hover:text-slate-800 rounded-md transition-colors"
                aria-label="Open help"
            >
                <HelpIcon className="w-5 h-5" />
            </button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleLoadFromJson}
                accept="application/json"
                className="hidden"
                aria-hidden="true"
            />
        </div>
      </header>

      <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-4">
          <div className="flex-grow p-4 bg-slate-100 rounded-lg overflow-auto">
            <Editor blocks={blocks} setBlocks={setBlocks} />
          </div>
           <div className="p-4 bg-slate-100 rounded-lg">
            <VariablesEditor variables={variables} setVariables={setVariables} />
          </div>
        </div>
        <div className="h-[calc(100vh-150px)] lg:h-auto sticky top-[70px]">
          <Preview markdown={markdown} />
        </div>
      </main>

      <Toolbar onAddBlock={addBlock} />

      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
    </div>
  );
}

export default App;