import React, { useState } from 'react';
import { Play, Pause, Square, Download, Clock, AlertCircle, CheckCircle2, Search } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { cn } from '../utils';
import { BuildExportModal } from './BuildExportModal';
import { Project } from '../types';

const mockProjects: Project[] = [
  {
    id: '1',
    name: "Normal Startup",
    status: "running",
    duration: "05:00.00",
    lastRun: "2024-03-04 10:00"
  },
  {
    id: '2',
    name: "Emergency Shutdown",
    status: "error",
    duration: "00:45.12",
    lastRun: "2024-03-04 11:30"
  },
  {
    id: '3',
    name: "Full Load Cycle",
    status: "stopped",
    duration: "12:00.00",
    lastRun: "2024-03-03 15:45"
  },
  {
    id: '4',
    name: "Cooling Sequence",
    status: "stopped",
    duration: "08:20.00",
    lastRun: "2024-03-03 09:15"
  }
];

interface LogData {
  time: string;
  type: string;
  msg: string;
  color?: string;
  active?: boolean;
}

const generateMockTimelineData = (seed: string) => {
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return Array.from({ length: 50 }, (_, i) => ({
    time: i,
    bit: (Math.sin((i + hash) / 2) > 0) ? 1 : 0,
    analog: 10 + Math.sin((i + hash) / 5) * 5 + Math.cos((i * hash) / 10) * 2,
  }));
};

const getProjectLogs = (project: Project): LogData[] => {
  const logs: LogData[] = [
    { time: "03:12.01", type: "INFO", msg: `Initializing ${project.name}...` },
    { time: "03:13.45", type: "INFO", msg: "Buffer synchronization complete." },
  ];

  if (project.status === 'error') {
    logs.push({ time: "03:14.10", type: "WARN", msg: "Critical deviation detected in IN_04.", color: "text-warning-orange" });
    logs.push({ time: "03:14.22", type: "ERROR", msg: "Process halted: Emergency shutdown triggered.", color: "text-signal-error" });
  } else if (project.status === 'running') {
    logs.push({ time: "03:14.10", type: "INFO", msg: "Optimal operating temperature reached.", color: "text-signal-active" });
    logs.push({ time: "03:14.22", type: "EXEC", msg: "Injection Point 094 reached", active: true });
  } else {
    logs.push({ time: "03:14.10", type: "INFO", msg: "Sequence completed successfully.", color: "text-slate-400" });
    logs.push({ time: "03:14.22", type: "IDLE", msg: "System in standby mode." });
  }
  return logs;
};

export const Dashboard: React.FC = () => {
  const [isBuildModalOpen, setIsBuildModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(mockProjects[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [simulationTime, setSimulationTime] = useState(0); // in seconds
  const [simulationPace, setSimulationPace] = useState(1.0);

  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const timelineData = generateMockTimelineData(selectedProject.id);
  const projectLogs = getProjectLogs(selectedProject);

  // Simulation loop
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (selectedProject.status === 'running') {
      interval = setInterval(() => {
        setSimulationTime(prev => prev + (0.1 * simulationPace));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [selectedProject.status, simulationPace]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const handleRun = () => {
    setProjects(prev => prev.map(p =>
      p.id === selectedProjectId ? { ...p, status: 'running' } : p
    ));
  };

  const handleStop = () => {
    setProjects(prev => prev.map(p =>
      p.id === selectedProjectId ? { ...p, status: 'stopped' } : p
    ));
    setSimulationTime(0);
  };

  const handleStep = () => {
    if (selectedProject.status !== 'running') {
      setSimulationTime(prev => prev + 1);
    }
  };

  const displayDuration = selectedProject.status === 'running' ? formatTime(simulationTime) : selectedProject.duration;

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar: Project List */}
      <aside className="w-80 border-r border-border-dark bg-background-dark/50 flex flex-col shrink-0">
        <div className="p-4 border-b border-border-dark space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xs tracking-widest text-slate-500 uppercase">Projects</h3>
            <button className="text-primary hover:bg-primary/10 p-1 rounded transition-colors">
              <Download className="size-4" />
            </button>
          </div>

          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-dark border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary text-white placeholder:text-slate-500 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectItem
                key={project.id}
                project={project}
                active={selectedProjectId === project.id}
                onClick={() => setSelectedProjectId(project.id)}
              />
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs italic">
              No projects found matching "{searchQuery}"
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border-dark">
          <button
            onClick={() => setIsBuildModalOpen(true)}
            className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
          >
            <Download className="size-4" />
            BUILD & EXPORT
          </button>
        </div>
      </aside>

      <BuildExportModal
        isOpen={isBuildModalOpen}
        onClose={() => setIsBuildModalOpen(false)}
      />

      {/* Main Content: Timeline & Charts */}
      <main className="flex-1 flex flex-col bg-background-dark overflow-hidden">
        {/* Playback Controls */}
        <div className="p-4 flex items-center justify-between border-b border-border-dark bg-surface-dark/30">
          <div className="flex items-center gap-6">
            <div className="flex items-center bg-background-dark rounded-xl p-1 border border-border-dark shadow-lg">
              <button
                onClick={handleStop}
                className={cn(
                  "p-2 transition-colors",
                  selectedProject.status === 'stopped' ? "text-primary" : "text-slate-400 hover:text-primary"
                )}
              >
                <Square className="size-5" />
              </button>
              <button
                onClick={handleRun}
                className={cn(
                  "p-3 rounded-lg shadow-lg transition-all",
                  selectedProject.status === 'running'
                    ? "bg-signal-active text-white animate-pulse"
                    : "bg-primary text-white hover:bg-primary/90"
                )}
              >
                <Play className="size-6" />
              </button>
              <button className="p-2 text-slate-400 hover:text-primary transition-colors"><Pause className="size-5" /></button>
              <button
                onClick={handleStep}
                className="p-2 text-slate-400 hover:text-primary transition-colors"
              >
                <Clock className="size-5" />
              </button>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Simulation Pace</span>
              <div className="flex gap-2 mt-1">
                {['0.5x', '1.0x', '2.0x', 'Max'].map(pace => {
                  const paceValue = pace === 'Max' ? 5.0 : parseFloat(pace);
                  return (
                    <button
                      key={pace}
                      onClick={() => setSimulationPace(paceValue)}
                      className={cn(
                        "px-2 py-0.5 text-xs rounded border transition-all",
                        simulationPace === paceValue
                          ? "bg-primary text-white border-primary"
                          : "bg-surface-dark text-slate-400 border-border-dark hover:bg-primary/10"
                      )}
                    >
                      {pace}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-3xl font-mono text-primary font-bold">{displayDuration}</div>
            <div className="text-[10px] text-slate-500 font-mono uppercase">Scenario: {selectedProject.name}</div>
          </div>
        </div>

        {/* Timeline View Area */}
        <div className="flex-1 overflow-auto custom-scrollbar relative timeline-grid">
          <div className="h-8 border-b border-border-dark flex sticky top-0 bg-background-dark z-10">
            <div className="w-48 shrink-0 border-r border-border-dark flex items-center px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Channel / Tag</div>
            <div className="flex-1 flex font-mono text-[10px] text-slate-500">
              {['00:00', '01:00', '02:00', '03:00', '04:00', '05:00'].map(t => (
                <div key={t} className={cn("w-40 border-r border-border-dark/50 flex items-center justify-center", t === '03:00' && "text-primary font-bold bg-primary/5")}>{t}</div>
              ))}
            </div>
          </div>
          {/* Playhead */}
          <div className="absolute top-0 bottom-0 left-[648px] w-0.5 bg-primary z-20 shadow-[0_0_8px_rgba(13,166,242,0.8)]">
            <div className="absolute -top-1 -left-1.5 w-3.5 h-3.5 bg-primary rounded-full ring-4 ring-primary/20"></div>
          </div>

          <div className="divide-y divide-border-dark">
            <div className="flex min-h-[60px] group hover:bg-white/5">
              <div className="w-48 shrink-0 border-r border-border-dark p-3 bg-background-dark/80">
                <span className="text-xs font-bold block">Bit B0102</span>
                <span className="text-[9px] text-accent-purple font-medium uppercase px-1 rounded bg-accent-purple/10 border border-accent-purple/20 inline-block mt-1">Write Sequence</span>
              </div>
              <div className="flex-1 relative p-2">
                <div className="absolute left-10 top-1/2 -translate-y-1/2 h-8 w-24 bg-accent-purple/30 border border-accent-purple rounded flex items-center justify-center cursor-move text-[10px] font-mono">SET TO 1</div>
              </div>
            </div>
            <div className="flex min-h-[60px] group hover:bg-white/5">
              <div className="w-48 shrink-0 border-r border-border-dark p-3 bg-background-dark/80">
                <span className="text-xs font-bold block">Analog IN_04</span>
                <span className="text-[9px] text-primary font-medium uppercase px-1 rounded bg-primary/10 border border-primary/20 inline-block mt-1">Read Expect</span>
              </div>
              <div className="flex-1 relative p-2">
                <svg className="absolute inset-0 h-full w-full opacity-30 pointer-events-none" preserveAspectRatio="none">
                  <path d="M0,60 L100,60 L200,20 L400,20 L600,70 L1000,70" fill="none" stroke="#0da6f2" strokeDasharray="4" strokeWidth="2"></path>
                </svg>
                <div className="absolute left-[580px] top-4 px-2 py-1 bg-primary/20 border border-primary/40 rounded text-[9px] text-primary font-bold">TARGET: 14.2 PSI</div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Feedback Section */}
        <div className="h-48 border-t border-border-dark flex bg-surface-dark/10">
          <div className="w-1/3 border-r border-border-dark p-4">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Deviation Monitor</h4>
            <div className="space-y-3">
              <ProgressStat
                label="Sync Tolerance"
                value={selectedProject.status === 'error' ? 45 : 95}
                color={selectedProject.status === 'error' ? "bg-signal-error" : "bg-signal-active"}
                subValue={selectedProject.status === 'error' ? "±0.85s" : "±0.02s"}
              />
              <ProgressStat
                label="Value Accuracy"
                value={selectedProject.status === 'error' ? 62 : 92}
                color={selectedProject.status === 'error' ? "bg-signal-error" : "bg-warning-orange"}
                subValue={selectedProject.status === 'error' ? "62.1%" : "92.4%"}
              />
            </div>
          </div>
          <div className="flex-1 p-4 overflow-hidden flex flex-col">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Live Log Stream</h4>
            <div className="flex-1 font-mono text-[11px] space-y-1 overflow-y-auto custom-scrollbar text-slate-400">
                {projectLogs.map((log, idx) => (
                  <LogEntry key={idx} {...log} />
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const ProjectItem: React.FC<{
  project: Project;
  active?: boolean;
  onClick: () => void;
}> = ({
  project, active, onClick
}) => (
    <div
      onClick={onClick}
      className={cn(
        "p-3 rounded-lg border transition-all cursor-pointer group",
        active
          ? "bg-primary/10 border-primary/30"
          : "hover:bg-surface-dark border-transparent"
      )}
    >
      <div className="flex justify-between items-start mb-1">
        <span className={cn("font-semibold text-sm", active ? "text-white" : "text-slate-300 group-hover:text-white")}>
          {project.name}
        </span>
        <StatusBadge status={project.status} />
      </div>
      <p className="text-xs text-slate-500">Duration: {project.duration}</p>
      {active && (
        <div className="mt-2 h-1 w-full bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-primary w-2/3"></div>
        </div>
      )}
    </div>
  );

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles = {
    running: "bg-signal-active/20 text-signal-active border-signal-active/30",
    error: "bg-signal-error/20 text-signal-error border-signal-error/30",
    stopped: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  }[status] || "";

  return (
    <span className={cn("text-[10px] px-1.5 py-0.5 rounded border uppercase font-bold", styles)}>
      {status}
    </span>
  );
};

const ChartSection: React.FC<{ title: string; type: 'bit' | 'analog'; data: any[] }> = ({ title, type, data }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between px-2">
      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{title}</h4>
      <span className="text-[10px] font-mono text-primary">LIVE</span>
    </div>
    <div className="h-40 bg-surface-dark/10 border border-border-dark rounded-xl p-4 timeline-grid">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'bit' ? (
          <LineChart data={data}>
            <Line
              type="stepAfter"
              dataKey="bit"
              stroke="#007fff"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <CartesianGrid strokeDasharray="3 3" stroke="#333333" vertical={false} />
            <XAxis hide />
            <YAxis hide domain={[0, 1.2]} />
          </LineChart>
        ) : (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorAnalog" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#007fff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#007fff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="analog"
              stroke="#007fff"
              fillOpacity={1}
              fill="url(#colorAnalog)"
              isAnimationActive={false}
            />
            <CartesianGrid strokeDasharray="3 3" stroke="#333333" vertical={false} />
            <XAxis hide />
            <YAxis hide domain={[0, 20]} />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  </div>
);

const ProgressStat: React.FC<{ label: string; value: number; color: string; subValue: string }> = ({
  label, value, color, subValue
}) => (
  <div>
    <div className="flex justify-between text-[11px] mb-1">
      <span className="text-slate-400">{label}</span>
      <span className={cn("font-bold", color.replace('bg-', 'text-'))}>{subValue}</span>
    </div>
    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
      <div className={cn("h-full transition-all duration-500", color)} style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

const LogEntry: React.FC<{ time: string; type: string; msg: string; color?: string; active?: boolean }> = ({
  time, type, msg, color = "text-primary", active
}) => (
  <p className={cn("px-1 rounded", active && "bg-primary/20 animate-pulse text-white")}>
    <span className="text-slate-600">[{time}]</span>{" "}
    <span className={cn("font-bold", !active && color)}>{type}:</span>{" "}
    <span className={active ? "text-white" : "text-slate-400"}>{msg}</span>
  </p>
);
