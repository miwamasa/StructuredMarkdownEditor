import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4 p-6 text-slate-700 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="help-modal-title" className="text-2xl font-bold mb-4">How to Use the Editor</h2>
        
        <div className="space-y-4 text-sm text-slate-600 max-h-[70vh] overflow-y-auto pr-2">
          <details className="p-2 border rounded-md" open>
            <summary className="font-semibold cursor-pointer">Adding & Editing Blocks</summary>
            <p className="mt-2 pl-4">
              Use the toolbar at the bottom to add content blocks like headings, paragraphs, lists, and tables. Click inside any block to start typing. For tables, you can edit headers and cells directly.
            </p>
          </details>

          <details className="p-2 border rounded-md">
            <summary className="font-semibold cursor-pointer">AI Assistant ✨</summary>
            <p className="mt-2 pl-4">
              In a paragraph block, type a prompt (e.g., "write a poem about space") and click the magic wand icon (✨) to generate content using AI.
            </p>
          </details>
          
          <details className="p-2 border rounded-md">
            <summary className="font-semibold cursor-pointer">Using Variables {'{{...}}'}</summary>
            <p className="mt-2 pl-4">
              Define key-value pairs in the 'Variables' section. You can then use `{'{{variable_key}}'}` in your content, and it will be replaced with its value in the final Markdown output. You can even perform simple calculations like `{'{{price * 1.1}}'}`.
            </p>
          </details>
          
          <details className="p-2 border rounded-md">
            <summary className="font-semibold cursor-pointer">Managing Blocks & Tables</summary>
            <p className="mt-2 pl-4">
              Hover over a block to see controls. You can change the block type with the dropdown or delete it with the trash icon (🗑️). For tables, you can add rows/columns with the buttons below the table. Hover over a row or a column header to find a trash icon (🗑️) to delete it.
            </p>
          </details>
          
          <details className="p-2 border rounded-md">
            <summary className="font-semibold cursor-pointer">Exporting & Importing</summary>
            <p className="mt-2 pl-4">
              Use the download (📥) and upload (📤) buttons in the header to save your work as a JSON file or load a previous session.
            </p>
          </details>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};