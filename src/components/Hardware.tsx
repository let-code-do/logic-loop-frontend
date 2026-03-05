import React, { useState, useEffect } from 'react';
import { 
  Router, 
  Wifi, 
  Globe, 
  Cpu, 
  RefreshCw, 
  Plus, 
  Save, 
  Terminal, 
  Activity,
  Database,
  Search
} from 'lucide-react';
import { cn } from '../utils';

export const Hardware: React.FC = () => {
  const [config, setConfig] = useState({
    host: '192.168.1.105',
    port: '502',
    timeout: '5000',
    polling: '100'
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch('/api/hardware')
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setConfig(data);
        }
      })
      .catch(err => console.error('Failed to load hardware settings:', err));
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    fetch('/api/hardware', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    })
    .then(() => {
      setTimeout(() => setIsSaving(false), 500);
    })
    .catch(err => {
      console.error('Failed to save hardware settings:', err);
      setIsSaving(false);
    });
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar: Device List */}
      <aside className="w-72 border-r border-border-dark bg-background-dark flex flex-col shrink-0">
        <div className="p-4 border-b border-border-dark flex justify-between items-center">
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-slate-500">Devices</h3>
            <p className="text-[10px] text-slate-600">4 Active Connections</p>
          </div>
          <button className="text-primary hover:rotate-90 transition-transform duration-500">
            <RefreshCw className="size-4" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          <DeviceItem 
            name="Station A (TCP)" 
            address="192.168.1.105:502" 
            icon={<Router className="size-4" />} 
            status="online" 
            active 
          />
          <DeviceItem 
            name="Warehouse_B (WS)" 
            address="wss://api.internal" 
            icon={<Wifi className="size-4" />} 
            status="online" 
          />
          <DeviceItem 
            name="Gateway (REST)" 
            address="Timeout Error" 
            icon={<Globe className="size-4" />} 
            status="error" 
          />
          <DeviceItem 
            name="Legacy_PLC_04" 
            address="Offline" 
            icon={<Cpu className="size-4" />} 
            status="offline" 
          />
        </div>
        
        <div className="p-4 border-t border-border-dark">
          <button className="w-full flex items-center justify-center gap-2 bg-surface-dark hover:bg-border-dark text-white text-sm font-bold py-2.5 rounded-lg transition-colors">
            <Plus className="size-4" /> Add Device
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-background-dark overflow-hidden">
        <div className="p-6 border-b border-border-dark flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Router className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Station A (TCP)</h1>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-[10px] text-signal-active font-bold">
                  <span className="size-1.5 rounded-full bg-signal-active animate-pulse"></span>
                  CONNECTED
                </span>
                <span className="text-slate-600 text-xs">•</span>
                <span className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">Protocol: TCP/IP Modbus</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-lg border border-border-dark hover:bg-surface-dark text-sm font-semibold transition-colors">
              Discard
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
              {isSaving ? 'Saving...' : 'Save & Connect'}
            </button>
          </div>
        </div>

        <div className="px-6 border-b border-border-dark">
          <div className="flex gap-8">
            <Tab label="Connection Settings" active />
            <Tab label="Queue Monitor" />
            <Tab label="Diagnostic Log" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-7 space-y-6">
              <section className="bg-surface-dark/30 rounded-xl border border-border-dark p-6 space-y-6">
                <h3 className="text-[10px] font-bold uppercase text-slate-500 tracking-widest flex items-center gap-2">
                  <Cpu className="size-3" /> Network Configuration
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <InputField 
                    label="Host IP Address" 
                    value={config.host} 
                    onChange={(v) => setConfig({ ...config, host: v })} 
                  />
                  <InputField 
                    label="Target Port" 
                    value={config.port} 
                    onChange={(v) => setConfig({ ...config, port: v })} 
                  />
                  <InputField 
                    label="Timeout (ms)" 
                    value={config.timeout} 
                    type="number" 
                    onChange={(v) => setConfig({ ...config, timeout: v })} 
                  />
                  <InputField 
                    label="Polling (ms)" 
                    value={config.polling} 
                    type="number" 
                    onChange={(v) => setConfig({ ...config, polling: v })} 
                  />
                </div>
              </section>

              <section className="bg-surface-dark/30 rounded-xl border border-border-dark p-6">
                <h3 className="text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-4">FIFO Queue Monitor</h3>
                <div className="bg-background-dark rounded-lg border border-border-dark overflow-hidden">
                  <table className="w-full text-left text-[10px] font-mono">
                    <thead className="bg-surface-dark text-slate-500">
                      <tr>
                        <th className="px-4 py-2">TIMESTAMP</th>
                        <th className="px-4 py-2">TYPE</th>
                        <th className="px-4 py-2">REGISTER</th>
                        <th className="px-4 py-2">VALUE</th>
                        <th className="px-4 py-2 text-right">CODE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-dark/50 text-slate-400">
                      <QueueRow time="14:02:33.421" type="READ" reg="B0102" val="1042.82" code="200" />
                      <QueueRow time="14:02:33.105" type="WRITE" reg="M0010" val="HIGH" valColor="text-primary" code="200" />
                      <QueueRow time="14:02:32.890" type="READ" reg="B0102" val="1041.15" code="200" />
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            <div className="col-span-12 lg:col-span-5 space-y-6">
              <section className="bg-surface-dark/30 rounded-xl border border-border-dark p-6">
                <h3 className="text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-4">Performance</h3>
                <div className="flex items-center justify-between mb-6">
                  <Stat label="AVG LATENCY" value="12ms" color="text-primary" />
                  <Stat label="PACKET LOSS" value="0.02%" color="text-signal-active" />
                  <Stat label="UPTIME" value="99.8%" />
                </div>
                <div className="h-24 flex items-end gap-1 opacity-50">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-primary/40 rounded-t-sm" 
                      style={{ height: `${Math.random() * 100}%` }}
                    />
                  ))}
                </div>
              </section>

              <section className="bg-surface-dark/30 rounded-xl border border-border-dark p-6 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Diagnostic Log</h3>
                  <button className="text-[8px] text-slate-500 hover:text-white uppercase font-bold tracking-widest border border-border-dark px-2 py-1 rounded">Clear</button>
                </div>
                <div className="h-48 bg-background-dark rounded-lg p-3 font-mono text-[10px] overflow-y-auto custom-scrollbar space-y-1.5 border border-border-dark">
                  <LogLine time="14:02:30" type="INFO" msg="Handshake completed" color="text-signal-active" />
                  <LogLine time="14:02:31" type="INFO" msg="Session ID: 49202" color="text-signal-active" />
                  <LogLine time="14:02:32" type="WARN" msg="Jitter spike: 48ms" color="text-warning-orange" />
                  <LogLine time="14:02:35" type="FAIL" msg="Write failure: Timeout" color="text-signal-error" />
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const DeviceItem: React.FC<{ name: string; address: string; icon: React.ReactNode; status: string; active?: boolean }> = ({ 
  name, address, icon, status, active 
}) => (
  <div className={cn(
    "flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer group",
    active ? "bg-primary/10 border-primary/30" : "hover:bg-surface-dark border-transparent"
  )}>
    <div className="relative text-slate-400 group-hover:text-primary transition-colors">
      {icon}
      <div className={cn(
        "absolute -bottom-1 -right-1 size-2 rounded-full border-2 border-background-dark",
        status === 'online' ? "bg-signal-active" : status === 'error' ? "bg-signal-error" : "bg-slate-600"
      )}></div>
    </div>
    <div className="flex-1 min-w-0">
      <p className={cn("text-sm font-semibold truncate", active ? "text-white" : "text-slate-300")}>{name}</p>
      <p className="text-[10px] text-slate-500 truncate">{address}</p>
    </div>
  </div>
);

const Tab: React.FC<{ label: string; active?: boolean }> = ({ label, active }) => (
  <button className={cn(
    "py-4 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all",
    active ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-300"
  )}>
    {label}
  </button>
);

const InputField: React.FC<{ label: string; value: string; type?: string; onChange?: (v: string) => void }> = ({ 
  label, value, type = 'text', onChange 
}) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-slate-500 uppercase">{label}</label>
    <input 
      type={type} 
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full bg-surface-dark border-border-dark rounded-lg px-4 py-2 text-sm text-white focus:ring-1 focus:ring-primary focus:border-primary transition-all"
    />
  </div>
);

const QueueRow: React.FC<{ time: string; type: string; reg: string; val: string; valColor?: string; code: string }> = ({ 
  time, type, reg, val, valColor = "text-slate-200", code 
}) => (
  <tr className="hover:bg-primary/5 transition-colors">
    <td className="px-4 py-2 text-slate-500">{time}</td>
    <td className="px-4 py-2">
      <span className={cn(
        "px-1.5 py-0.5 rounded text-[8px] font-bold",
        type === 'READ' ? "bg-signal-active/10 text-signal-active" : "bg-primary/10 text-primary"
      )}>{type}</span>
    </td>
    <td className="px-4 py-2">{reg}</td>
    <td className={cn("px-4 py-2", valColor)}>{val}</td>
    <td className="px-4 py-2 text-right text-signal-active">{code}</td>
  </tr>
);

const Stat: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color = "text-white" }) => (
  <div>
    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">{label}</p>
    <p className={cn("text-xl font-bold", color)}>{value}</p>
  </div>
);

const LogLine: React.FC<{ time: string; type: string; msg: string; color: string }> = ({ time, type, msg, color }) => (
  <div className="flex gap-2">
    <span className="text-slate-600">[{time}]</span>
    <span className={cn("font-bold", color)}>{type}</span>
    <span className="text-slate-500">{msg}</span>
  </div>
);
