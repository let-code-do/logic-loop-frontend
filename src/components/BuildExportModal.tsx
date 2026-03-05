import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, FileJson, FileCode, CheckCircle2, Loader2, Monitor } from 'lucide-react';
import { cn } from '../utils';

interface BuildExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BuildExportModal: React.FC<BuildExportModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = React.useState<'select' | 'building' | 'complete'>('select');
  const [progress, setProgress] = React.useState(0);
  const [selectedType, setSelectedType] = React.useState<'json' | 'cpp' | 'electron'>('json');

  const handleBuild = () => {
    setStep('building');
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => setStep('complete'), 500);
      }
      setProgress(p);
    }, 200);
  };

  const reset = () => {
    setStep('select');
    setProgress(0);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-surface-dark border border-border-dark w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-border-dark flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">Build & Export</h2>
                <p className="text-sm text-slate-500 mt-1">Compile logic and export to target hardware</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              {step === 'select' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-3">
                    <ExportOption 
                      icon={<FileJson className="size-5" />}
                      title="JSON Schema"
                      desc="Logic definition"
                      active={selectedType === 'json'}
                      onClick={() => setSelectedType('json')}
                    />
                    <ExportOption 
                      icon={<FileCode className="size-5" />}
                      title="C++ Source"
                      desc="Embedded target"
                      active={selectedType === 'cpp'}
                      onClick={() => setSelectedType('cpp')}
                    />
                    <ExportOption 
                      icon={<Monitor className="size-5" />}
                      title="Electron App"
                      desc="Desktop executable"
                      active={selectedType === 'electron'}
                      onClick={() => setSelectedType('electron')}
                    />
                  </div>

                  <div className="bg-background-dark/50 border border-border-dark rounded-xl p-4">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Build Configuration</h4>
                    <div className="space-y-2">
                      {selectedType === 'electron' ? (
                        <>
                          <ConfigItem label="Target OS" value="Windows (x64)" />
                          <ConfigItem label="Package Format" value=".exe (Portable)" />
                          <ConfigItem label="Electron Version" value="v31.0.0" />
                        </>
                      ) : (
                        <>
                          <ConfigItem label="Optimization Level" value="O3 (Aggressive)" />
                          <ConfigItem label="Target Architecture" value="ARM Cortex-M4" />
                          <ConfigItem label="Include Debug Symbols" value="No" />
                        </>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={handleBuild}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="size-5" />
                    START BUILD PROCESS
                  </button>
                </div>
              )}

              {step === 'building' && (
                <div className="py-12 flex flex-col items-center text-center">
                  <div className="relative size-24 mb-8">
                    <svg className="size-full -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="44"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-border-dark"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="44"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray={276.46}
                        strokeDashoffset={276.46 * (1 - progress / 100)}
                        className="text-primary transition-all duration-300"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="size-8 text-primary animate-spin" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {selectedType === 'electron' ? 'Packaging Electron App...' : 'Compiling Logic...'}
                  </h3>
                  <p className="text-sm text-slate-500 mb-8 max-w-xs">
                    {selectedType === 'electron' 
                      ? 'Bundling resources and generating standalone executable for Windows x64.' 
                      : 'Optimizing flow nodes and generating target machine code for ARM Cortex-M4.'}
                  </p>
                  <div className="w-full bg-background-dark h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    Progress: {Math.floor(progress)}%
                  </div>
                </div>
              )}

              {step === 'complete' && (
                <div className="py-12 flex flex-col items-center text-center">
                  <div className="size-20 bg-signal-active/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="size-10 text-signal-active" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Build Successful</h3>
                  <p className="text-sm text-slate-500 mb-10 max-w-xs">
                    The build artifacts have been generated and are ready for deployment.
                  </p>
                  <div className="flex gap-3 w-full">
                    <button 
                      onClick={reset}
                      className="flex-1 bg-surface-dark border border-border-dark hover:bg-white/5 text-white py-3 rounded-xl font-bold transition-all"
                    >
                      CLOSE
                    </button>
                    <button 
                      className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="size-4" />
                      {selectedType === 'electron' ? 'DOWNLOAD .EXE' : 'DOWNLOAD .BIN'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ExportOption: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  desc: string; 
  active?: boolean;
  onClick?: () => void;
}> = ({ 
  icon, title, desc, active, onClick 
}) => (
  <div 
    onClick={onClick}
    className={cn(
      "p-4 rounded-xl border transition-all cursor-pointer group",
      active 
        ? "bg-primary/10 border-primary/40" 
        : "bg-background-dark/30 border-border-dark hover:border-primary/30"
    )}
  >
    <div className={cn("mb-3", active ? "text-primary" : "text-slate-500 group-hover:text-primary")}>
      {icon}
    </div>
    <h4 className={cn("text-sm font-bold", active ? "text-white" : "text-slate-400")}>{title}</h4>
    <p className="text-[11px] text-slate-500 mt-0.5">{desc}</p>
  </div>
);

const ConfigItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center text-[11px]">
    <span className="text-slate-500">{label}</span>
    <span className="text-slate-300 font-mono">{value}</span>
  </div>
);
