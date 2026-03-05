import React from 'react';
import { 
  LayoutDashboard, 
  Share2, 
  Database, 
  Cpu, 
  Search, 
  Bell, 
  User,
  Activity,
  Zap
} from 'lucide-react';
import { cn } from '../utils';
import { ViewType } from '../types';

interface HeaderProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeView, onViewChange }) => {
  return (
    <header className="h-14 flex items-center justify-between border-b border-border-dark bg-background-dark px-6 shrink-0 z-50">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 text-primary">
          <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Share2 className="size-5" />
          </div>
          <h1 className="text-white text-xl font-bold tracking-tight">LogicLoop</h1>
        </div>
        
        <nav className="flex items-center gap-1">
          <NavButton 
            active={activeView === 'dashboard'} 
            onClick={() => onViewChange('dashboard')}
            icon={<LayoutDashboard className="size-4" />}
            label="Dashboard"
          />
          <NavButton 
            active={activeView === 'flow'} 
            onClick={() => onViewChange('flow')}
            icon={<Share2 className="size-4" />}
            label="Flow Editor"
          />
          <NavButton 
            active={activeView === 'variables'} 
            onClick={() => onViewChange('variables')}
            icon={<Database className="size-4" />}
            label="Variables"
          />
          <NavButton 
            active={activeView === 'hardware'} 
            onClick={() => onViewChange('hardware')}
            icon={<Cpu className="size-4" />}
            label="Hardware"
          />
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-white bg-surface-dark rounded-lg transition-colors relative">
          <Bell className="size-5" />
          <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-background-dark"></span>
        </button>
        
        <div className="size-9 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 cursor-pointer hover:bg-primary/30 transition-colors">
          <User className="size-5 text-primary" />
        </div>
      </div>
    </header>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ 
  active, onClick, icon, label 
}) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
      active 
        ? "text-primary bg-primary/10" 
        : "text-slate-400 hover:text-slate-200 hover:bg-surface-dark"
    )}
  >
    {icon}
    {label}
  </button>
);

export const Footer: React.FC = () => {
  return (
    <footer className="h-8 border-t border-border-dark bg-background-dark flex items-center justify-between px-6 text-[10px] font-medium tracking-wider uppercase text-slate-500 shrink-0">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-signal-active">
          <div className="size-2 rounded-full bg-signal-active animate-pulse"></div>
          PLC CONNECTED: NODE_01
        </div>
        <div className="flex items-center gap-2">
          <Activity className="size-3" />
          CYCLE TIME: 12MS
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Zap className="size-3" />
          SIMULATION ENGINE: ACTIVE
        </div>
        <div className="text-slate-400">
          BUFFER: 98%
        </div>
        <div className="text-slate-600">
          LOGICLOOP V2.4.0-STABLE
        </div>
      </div>
    </footer>
  );
};
