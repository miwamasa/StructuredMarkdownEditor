import React from 'react';
import { Variable } from '../types';
import { PlusIcon, TrashIcon } from './icons';

interface VariablesEditorProps {
  variables: Variable[];
  setVariables: React.Dispatch<React.SetStateAction<Variable[]>>;
}

export const VariablesEditor: React.FC<VariablesEditorProps> = ({ variables, setVariables }) => {
  const addVariable = () => {
    setVariables([...variables, { id: crypto.randomUUID(), key: '', value: '' }]);
  };

  const updateVariable = (id: string, field: 'key' | 'value', text: string) => {
    setVariables(variables.map(v => v.id === id ? { ...v, [field]: text } : v));
  };

  const deleteVariable = (id: string) => {
    setVariables(variables.filter(v => v.id !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
      <h3 className="text-lg font-medium text-slate-700 mb-3">Variables</h3>
      <div className="flex flex-col gap-2">
        {variables.length > 0 && (
            <div className="grid grid-cols-[1fr_2fr_auto] gap-2 items-center text-sm font-medium text-slate-500 px-2">
                <span>Key</span>
                <span>Value</span>
            </div>
        )}
        {variables.map(variable => (
          <div key={variable.id} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-center">
            <input
              type="text"
              placeholder="variable_key"
              value={variable.key}
              onChange={e => updateVariable(variable.id, 'key', e.target.value)}
              className="p-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Variable key"
            />
            <input
              type="text"
              placeholder="Variable value"
              value={variable.value}
              onChange={e => updateVariable(variable.id, 'value', e.target.value)}
              className="p-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Variable value"
            />
            <button
              onClick={() => deleteVariable(variable.id)}
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md"
              title="Delete variable"
              aria-label="Delete variable"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addVariable}
        className="mt-4 flex items-center gap-2 px-3 py-2 bg-slate-600 text-white border border-transparent rounded-md shadow-sm hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 text-sm"
      >
        <PlusIcon className="w-4 h-4" />
        Add Variable
      </button>
    </div>
  );
};
