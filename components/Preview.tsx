
import React, { useState, useEffect } from 'react';
import { CopyIcon } from './icons';

interface PreviewProps {
  markdown: string;
}

export const Preview: React.FC<PreviewProps> = ({ markdown }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <div className="bg-slate-800 rounded-lg shadow-inner h-full flex flex-col">
      <div className="flex justify-between items-center p-3 border-b border-slate-700">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Markdown Output</h3>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-sm px-3 py-1 bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-md transition-colors"
        >
          <CopyIcon className="w-4 h-4" />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="p-4 overflow-auto flex-grow">
        <pre className="text-slate-300 text-sm whitespace-pre-wrap break-words">
          {markdown}
        </pre>
      </div>
    </div>
  );
};
