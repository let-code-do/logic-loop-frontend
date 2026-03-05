import React, { useState, useEffect } from 'react';
import { 
  RefreshCw,
  Plus, 
  Download, 
  Upload, 
  Filter, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  Edit2,
  Copy
} from 'lucide-react';
import { cn } from '../utils.js';
import type { Variable } from '../types.js';

const mockVariables: Variable[] = [
  { id: '1', name: 'Main_Motor_Run', address: 'B0102', type: 'BIT', value: true, description: 'Main drive motor activation signal' },
  { id: '2', name: 'Temp_Zone_01', address: 'W4050', type: 'WORD', value: 1240.5, description: 'Heater zone 1 thermocouple input' },
  { id: '3', name: 'Safety_Gate_Closed', address: 'B0103', type: 'BIT', value: false, description: 'Proximity switch for safety fence' },
  { id: '4', name: 'Cycle_Count', address: 'D200', type: 'DWORD', value: 45902, description: 'Total cycles since last reset' },
  { id: '5', name: 'Estop_Status', address: 'B0104', type: 'BIT', value: true, description: 'Emergency stop circuit status' },
  { id: '6', name: 'Tank_Level_High', address: 'B0200', type: 'BIT', value: false, description: 'Float switch 2 input' },
];

export const Variables: React.FC = () => {
  const [variables, setVariables] = useState<Variable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/variables')
      .then(res => res.json())
      .then(data => {
        setVariables(data.map((v: any) => ({ ...v, value: JSON.parse(v.value) })));
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load variables:', err);
        setVariables(mockVariables);
        setLoading(false);
      });
  }, []);

  const saveVariables = (newVars: Variable[]) => {
    setVariables(newVars);
    fetch('/api/variables', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newVars),
    }).catch(err => console.error('Failed to save variables:', err));
  };

  const handleAddVariable = () => {
    const newVar: Variable = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New_Variable',
      address: 'B0000',
      type: 'BIT',
      value: false,
      description: 'New variable description'
    };
    saveVariables([...variables, newVar]);
  };

  const handleDeleteVariable = (id: string) => {
    saveVariables(variables.filter(v => v.id !== id));
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar: Groups */}
      <aside className="w-64 border-r border-border-dark bg-background-dark/50 flex flex-col shrink-0">
        <div className="p-4 flex items-center justify-between border-b border-border-dark">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Memory Groups</h3>
          <button className="text-primary hover:bg-primary/10 p-1 rounded"><Plus className="size-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          <GroupItem label="Inputs (I)" count={124} active />
          <GroupItem label="Outputs (O)" count={86} />
          <GroupItem label="Internal (M)" count={2410} />
          <GroupItem label="Timers (T)" count={12} />
          <GroupItem label="Counters (C)" count={8} />
        </div>
      </aside>

      {/* Main Table */}
      <main className="flex-1 flex flex-col bg-background-dark overflow-hidden">
        <div className="p-6 border-b border-border-dark">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Variable Manager</h1>
              <p className="text-slate-500 text-sm">Manage memory addresses and tags</p>
            </div>
            <button 
              onClick={handleAddVariable}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg shadow-primary/10 transition-all"
            >
              <Plus className="size-4" /> Add Variable
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 bg-surface-dark text-slate-300 text-xs font-bold rounded border border-border-dark hover:bg-border-dark transition-colors">
                <Download className="size-3" /> Import
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-surface-dark text-slate-300 text-xs font-bold rounded border border-border-dark hover:bg-border-dark transition-colors">
                <Upload className="size-3" /> Export
              </button>
              <div className="h-6 w-px bg-border-dark mx-2" />
              <button className="p-2 text-slate-500 hover:text-slate-300"><Filter className="size-4" /></button>
              <button className="p-2 text-slate-500 hover:text-slate-300"><Trash2 className="size-4" /></button>
            </div>
            <div className="text-xs text-slate-500 italic">12 rows selected</div>
          </div>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="sticky top-0 bg-background-dark z-10 border-b border-border-dark">
              <tr>
                <th className="py-3 px-6 w-10"><input type="checkbox" className="rounded bg-surface-dark border-border-dark text-primary focus:ring-primary" /></th>
                <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Name</th>
                <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Address</th>
                <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Data Type</th>
                <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Value</th>
                <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Description</th>
                <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark/50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center text-slate-500 text-sm">
                    <div className="flex flex-col items-center gap-4">
                      <RefreshCw className="size-8 animate-spin text-primary/40" />
                      LOADING MEMORY MAP...
                    </div>
                  </td>
                </tr>
              ) : variables.map((v) => (
                <tr key={v.id} className="hover:bg-primary/5 transition-colors group">
                  <td className="py-3 px-6"><input type="checkbox" className="rounded bg-surface-dark border-border-dark text-primary focus:ring-primary" /></td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{v.name}</span>
                      <Copy className="size-3 text-slate-600 opacity-0 group-hover:opacity-100 cursor-pointer" />
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-400">{v.address}</td>
                  <td className="py-3 px-4">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded uppercase",
                      v.type === 'BIT' ? "bg-primary/10 text-primary" : "bg-warning-orange/10 text-warning-orange"
                    )}>
                      {v.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {typeof v.value === 'boolean' ? (
                      <div className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold inline-block",
                        v.value ? "bg-signal-active/20 text-signal-active border border-signal-active/30" : "bg-slate-700/50 text-slate-400"
                      )}>
                        {v.value ? 'TRUE' : 'FALSE'}
                      </div>
                    ) : (
                      <span className="text-sm text-slate-100">{v.value}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-500 max-w-xs truncate">{v.description}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 hover:text-primary transition-colors"><Edit2 className="size-4" /></button>
                      <button 
                        onClick={() => handleDeleteVariable(v.id)}
                        className="p-1 hover:text-signal-error transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                      <button className="p-1 hover:text-slate-300 transition-colors"><MoreVertical className="size-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="p-4 border-t border-border-dark flex items-center justify-between bg-background-dark/80">
          <div className="text-xs text-slate-500">Showing 1-25 of 124 variables</div>
          <div className="flex items-center gap-2">
            <button className="p-1 rounded hover:bg-surface-dark text-slate-500"><ChevronLeft className="size-4" /></button>
            <button className="px-3 py-1 bg-primary text-white font-bold rounded text-xs">1</button>
            <button className="px-3 py-1 bg-surface-dark border border-border-dark rounded text-slate-400 hover:text-white text-xs font-bold transition-colors">2</button>
            <button className="px-3 py-1 bg-surface-dark border border-border-dark rounded text-slate-400 hover:text-white text-xs font-bold transition-colors">3</button>
            <button className="p-1 rounded hover:bg-surface-dark text-slate-500"><ChevronRight className="size-4" /></button>
          </div>
        </footer>
      </main>
    </div>
  );
};

const GroupItem: React.FC<{ label: string; count: number; active?: boolean }> = ({ label, count, active }) => (
  <button className={cn(
    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all",
    active 
      ? "bg-primary/10 text-primary" 
      : "text-slate-400 hover:bg-surface-dark hover:text-slate-200"
  )}>
    <span>{label}</span>
    <span className={cn(
      "text-[10px] px-1.5 py-0.5 rounded",
      active ? "bg-primary/20 text-primary" : "bg-surface-dark text-slate-500"
    )}>{count}</span>
  </button>
);
