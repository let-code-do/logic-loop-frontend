import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Graph, Node as X6Node, Edge as X6Edge } from '@antv/x6';
import { register } from '@antv/x6-react-shape';
import { Selection } from '@antv/x6-plugin-selection';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Transform } from '@antv/x6-plugin-transform';
import { 
  RefreshCw,
  Search, 
  Play, 
  Square, 
  CloudUpload, 
  Plus, 
  Settings, 
  Activity,
  Box,
  Timer,
  ToggleLeft,
  ToggleRight,
  Zap,
  Trash2,
  Copy,
  ArrowUpRight,
  ArrowDownRight,
  Equal,
  ChevronRight,
  ChevronLeft,
  ChevronRightSquare,
  ChevronLeftSquare,
  Binary,
  Hash,
  Circle,
  CircleOff,
  Lock,
  Unlock,
  Calculator,
  ArrowRightLeft,
  Minus,
  X,
  Divide,
  Percent,
  Columns,
  Info
} from 'lucide-react';
import { cn } from '../utils';
import { NODE_CATEGORIES, NodeMetadata } from '../constants';

// Icon mapping for serialization
const ICON_MAP: Record<string, React.ElementType> = {
  ToggleRight,
  ToggleLeft,
  Box,
  Activity,
  Zap,
  Timer,
  RefreshCw,
  Search,
  Play,
  Square,
  CloudUpload,
  Plus,
  Settings,
  Trash2,
  Copy,
  ArrowUpRight,
  ArrowDownRight,
  Equal,
  ChevronRight,
  ChevronLeft,
  ChevronRightSquare,
  ChevronLeftSquare,
  Binary,
  Hash,
  Circle,
  CircleOff,
  Lock,
  Unlock,
  Calculator,
  ArrowRightLeft,
  Minus,
  X,
  Divide,
  Percent,
  Columns
};

// Custom Node Components for X6
const LogicNode: React.FC<{ node: X6Node }> = ({ node }) => {
  const data = node.getData();
  const selected = node.isNode() && node.getProp('selected');
  const IconComponent = ICON_MAP[data.iconName] || Box;
  
  return (
    <div className={cn(
      "px-4 py-3 bg-surface-dark border rounded-lg shadow-xl h-full flex flex-col justify-center",
      selected ? "border-primary ring-2 ring-primary/20" : "border-border-dark"
    )}>
      <div className="flex items-center gap-2 mb-2 border-b border-border-dark pb-2">
        <IconComponent className="size-4 text-primary" />
        <span className="text-[10px] font-bold uppercase tracking-tight text-slate-300 truncate">{data.name}</span>
        <span className="ml-auto text-[8px] font-mono text-slate-500 bg-black/20 px-1 rounded shrink-0">{data.type}</span>
      </div>
      <div className="text-xs font-semibold text-white truncate">{data.label || data.name}</div>
    </div>
  );
};

const TimerNode: React.FC<{ node: X6Node }> = ({ node }) => {
  const data = node.getData();
  const selected = node.isNode() && node.getProp('selected');
  
  return (
    <div className={cn(
      "px-4 py-3 bg-surface-dark border rounded-lg shadow-xl h-full flex flex-col justify-center",
      selected ? "border-primary ring-2 ring-primary/20" : "border-border-dark"
    )}>
      <div className="flex items-center gap-2 mb-2 border-b border-border-dark pb-2">
        <Timer className="size-4 text-primary" />
        <span className="text-[10px] font-bold uppercase tracking-tight text-slate-300">{data.name}</span>
        <span className="ml-auto text-[8px] font-mono text-slate-500 bg-black/20 px-1 rounded">{data.type}</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500">
          <span>Preset</span>
          <span className="text-primary">{data.preset || 5000} ms</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-primary h-full w-[45%]"></div>
        </div>
        <div className="flex justify-between text-[10px] font-mono">
          <span className="text-slate-500">ACC</span>
          <span className="text-slate-300">{data.acc || 0} ms</span>
        </div>
      </div>
    </div>
  );
};

const BlockNode: React.FC<{ node: X6Node }> = ({ node }) => {
  const data = node.getData();
  const selected = node.isNode() && node.getProp('selected');
  const IconComponent = ICON_MAP[data.iconName] || Box;
  
  return (
    <div className={cn(
      "bg-surface-dark border rounded-lg shadow-xl h-full flex flex-col",
      selected ? "border-primary ring-2 ring-primary/20" : "border-border-dark"
    )}>
      <div className="bg-primary/10 px-4 py-2 border-b border-border-dark flex items-center gap-2">
        <IconComponent className="size-4 text-primary" />
        <span className="text-[10px] font-bold uppercase tracking-tight text-white truncate">{data.name}</span>
      </div>
      <div className="flex-1 p-3 flex flex-col justify-center items-center gap-2">
        <div className="text-xs font-mono text-slate-400 bg-black/40 px-3 py-1 rounded border border-border-dark">
          {data.type}
        </div>
        <div className="text-sm font-bold text-white">{data.label || data.name}</div>
      </div>
      <div className="bg-black/20 px-4 py-1.5 border-t border-border-dark flex justify-between items-center">
        <span className="text-[8px] font-bold text-slate-500 uppercase">Function Block</span>
        <Activity className="size-3 text-slate-600" />
      </div>
    </div>
  );
};

// Register custom nodes
register({
  shape: 'logic-node',
  width: 180,
  height: 80,
  component: LogicNode,
  ports: {
    groups: {
      in: { 
        position: 'left', 
        attrs: { 
          circle: { 
            r: 10, 
            magnet: true, 
            stroke: '#007fff', 
            strokeWidth: 2, 
            fill: '#0f1923', 
            'port-group': 'in',
            style: { 
              cursor: 'crosshair',
              pointerEvents: 'auto'
            }
          } 
        } 
      },
      out: { 
        position: 'right', 
        attrs: { 
          circle: { 
            r: 10, 
            magnet: true, 
            stroke: '#38bdf8', 
            strokeWidth: 3, 
            fill: '#0f1923', 
            'port-group': 'out',
            style: { 
              cursor: 'crosshair',
              pointerEvents: 'auto'
            }
          } 
        } 
      },
    },
    items: [{ group: 'in', id: 'in' }, { group: 'out', id: 'out' }],
  },
});

register({
  shape: 'timer-node',
  width: 220,
  height: 120,
  component: TimerNode,
  ports: {
    groups: {
      in: { 
        position: 'left', 
        attrs: { 
          circle: { 
            r: 10, 
            magnet: true, 
            stroke: '#007fff', 
            strokeWidth: 2, 
            fill: '#0f1923', 
            'port-group': 'in',
            style: { 
              cursor: 'crosshair',
              pointerEvents: 'auto'
            }
          } 
        } 
      },
      out: { 
        position: 'right', 
        attrs: { 
          circle: { 
            r: 10, 
            magnet: true, 
            stroke: '#38bdf8', 
            strokeWidth: 3, 
            fill: '#0f1923', 
            'port-group': 'out',
            style: { 
              cursor: 'crosshair',
              pointerEvents: 'auto'
            }
          } 
        } 
      },
    },
    items: [{ group: 'in', id: 'in' }, { group: 'out', id: 'out' }],
  },
});

register({
  shape: 'block-node',
  width: 240,
  height: 140,
  component: BlockNode,
  ports: {
    groups: {
      in: { 
        position: 'left', 
        attrs: { 
          circle: { 
            r: 10, 
            magnet: true, 
            stroke: '#007fff', 
            strokeWidth: 2, 
            fill: '#0f1923', 
            'port-group': 'in',
            style: { 
              cursor: 'crosshair',
              pointerEvents: 'auto'
            }
          } 
        } 
      },
      out: { 
        position: 'right', 
        attrs: { 
          circle: { 
            r: 10, 
            magnet: true, 
            stroke: '#38bdf8', 
            strokeWidth: 3, 
            fill: '#0f1923', 
            'port-group': 'out',
            style: { 
              cursor: 'crosshair',
              pointerEvents: 'auto'
            }
          } 
        } 
      },
    },
    items: [
      { group: 'in', id: 'in-1' },
      { group: 'in', id: 'in-2' },
      { group: 'out', id: 'out-1' },
      { group: 'out', id: 'out-2' },
    ],
  },
});

export const FlowEditor: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);
  const [selectedNode, setSelectedNode] = useState<X6Node | null>(null);
  const [activeTab, setActiveTab] = useState('Main Logic');
  const [isSaving, setIsSaving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingData, setEditingData] = useState<any>(null);
  const [hoveredNode, setHoveredNode] = useState<NodeMetadata | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (selectedNode) {
      setEditingData({ ...selectedNode.getData() });
    } else {
      setEditingData(null);
    }
  }, [selectedNode]);

  const handlePropertyChange = (key: string, value: string) => {
    setEditingData((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  const applyChanges = () => {
    if (selectedNode && editingData) {
      selectedNode.setData(editingData);
      // Force update for label if it changed
      if (editingData.label) {
        selectedNode.setProp('label', editingData.label);
      }
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const graph = new Graph({
      container: containerRef.current,
      autoResize: true,
      grid: { size: 10, visible: true, type: 'dot', args: { color: '#333333', thickness: 1 } },
      background: { color: '#0f1923' },
      panning: true,
      mousewheel: { enabled: true, modifiers: ['ctrl', 'meta'] },
      interacting: {
        magnetConnectable: true,
        nodeMovable: true,
        edgeMovable: true,
      },
      connecting: {
        snap: { radius: 20 },
        allowBlank: true,
        allowLoop: false,
        allowNode: false,
        allowEdge: false,
        allowMulti: true,
        highlight: true,
        connector: 'rounded',
        router: 'manhattan',
        validateMagnet({ magnet }) {
          return magnet.getAttribute('port-group') === 'out';
        },
        validateConnection({ sourceMagnet, targetMagnet }) {
          if (!sourceMagnet || !targetMagnet) return false;
          return sourceMagnet.getAttribute('port-group') === 'out' && 
                 targetMagnet.getAttribute('port-group') === 'in';
        },
        createEdge() {
          return graph.createEdge({
            shape: 'edge',
            attrs: {
              line: {
                stroke: '#007fff',
                strokeWidth: 2,
                targetMarker: {
                  name: 'block',
                  width: 10,
                  height: 7,
                },
              },
            },
            zIndex: 0,
          });
        },
      },
      highlighting: {
        magnetAvailable: {
          name: 'stroke',
          args: {
            attrs: {
              fill: 'rgba(0, 127, 255, 0.1)',
              stroke: '#007fff',
              strokeWidth: 4,
              strokeDasharray: '5,5',
            },
          },
        },
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            attrs: {
              fill: 'rgba(34, 197, 94, 0.2)',
              stroke: '#22c55e',
              strokeWidth: 6,
            },
          },
        },
      },
    });

    // Plugins
    graph.use(new Selection({ 
      enabled: true, 
      multiple: true, 
      rubberband: false, // Disable rubberband to avoid interference with edge dragging
      showNodeSelectionBox: true 
    }));
    graph.use(new Snapline({ enabled: true }));
    // Disable resizing and rotating as per user request
    // graph.use(new Transform({ resizing: false, rotating: false })); 

    graphRef.current = graph;

    // Events
    graph.on('node:selected', ({ node }) => setSelectedNode(node));
    graph.on('node:unselected', () => setSelectedNode(null));
    
    // Apply animation to new edges if running
    graph.on('edge:connected', ({ edge }) => {
      if (isRunning) {
        edge.attr('line/strokeDasharray', 5);
        edge.attr('line/style/animation', 'ant-line 30s infinite linear');
      }
    });

    // Initial Data
    graph.addNode({
      id: '1',
      shape: 'logic-node',
      x: 100,
      y: 100,
      data: { 
        name: 'NO Contact', 
        label: 'START_PB', 
        iconName: 'ToggleRight', 
        type: '접점',
        operation: '대상 비트가 true이면 통과',
        description: 'A접점. 가장 기본 조건'
      },
    });

    graph.addNode({
      id: '2',
      shape: 'timer-node',
      x: 400,
      y: 100,
      data: { 
        name: 'TON (On Delay)', 
        preset: 5000, 
        acc: 2250,
        type: '타이머',
        operation: 'IN true 유지 시간 ≥ PT → Q true',
        description: 'On Delay 타이머. 설정 시간 후 출력'
      },
    });

    graph.addEdge({
      source: { cell: '1', port: 'out' },
      target: { cell: '2', port: 'in' },
      attrs: { line: { stroke: '#007fff', strokeWidth: 2 } },
    });

    return () => {
      graph.dispose();
    };
  }, []);

  // Simulation effect
  useEffect(() => {
    if (!graphRef.current) return;
    const edges = graphRef.current.getEdges();
    edges.forEach(edge => {
      if (isRunning) {
        edge.attr('line/strokeDasharray', 5);
        edge.attr('line/style/animation', 'ant-line 30s infinite linear');
      } else {
        edge.attr('line/strokeDasharray', 0);
        edge.attr('line/style/animation', 'none');
      }
    });
  }, [isRunning]);

  const onDragStart = (event: React.DragEvent, nodeMetadata: NodeMetadata) => {
    event.dataTransfer.setData('application/x6', JSON.stringify(nodeMetadata));
  };

  const onDrop = (event: React.DragEvent) => {
    if (!graphRef.current) return;
    const rawData = event.dataTransfer.getData('application/x6');
    if (!rawData) return;

    const metadata: NodeMetadata = JSON.parse(rawData);
    const point = graphRef.current.clientToLocal(event.clientX, event.clientY);

    const newNode = graphRef.current.addNode({
      shape: metadata.shape,
      x: point.x,
      y: point.y,
      data: {
        ...metadata,
        label: metadata.name,
        preset: metadata.category === 'Timer' ? 5000 : undefined,
        acc: metadata.category === 'Timer' ? 0 : undefined,
      },
    });

    if (newNode) {
      graphRef.current.resetSelection(newNode);
    }
  };

  const onDoubleClick = (metadata: NodeMetadata) => {
    if (!graphRef.current) return;
    const { x, y } = graphRef.current.getGraphArea().center();
    const newNode = graphRef.current.addNode({
      shape: metadata.shape,
      x: x - 100,
      y: y - 40,
      data: {
        ...metadata,
        label: metadata.name,
        preset: metadata.category === 'Timer' ? 5000 : undefined,
        acc: metadata.category === 'Timer' ? 0 : undefined,
      },
    });

    if (newNode) {
      graphRef.current.resetSelection(newNode);
    }
  };

  const onSave = () => {
    if (!graphRef.current) return;
    setIsSaving(true);
    const data = graphRef.current.toJSON();
    fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 'main', name: 'Main Logic', data }),
    }).then(() => setTimeout(() => setIsSaving(false), 500));
  };

  const handleNodeMouseEnter = (e: React.MouseEvent, node: NodeMetadata) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredNode(node);
    setTooltipPos({ 
      top: rect.top, 
      left: rect.right + 8 
    });
  };

  const handleNodeMouseLeave = () => {
    setHoveredNode(null);
  };

  return (
    <div className="flex h-full overflow-hidden relative">
      {/* Global Tooltip */}
      {hoveredNode && (
        <div 
          className="fixed z-[9999] w-72 p-4 bg-surface-dark border border-primary/40 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] pointer-events-none backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200"
          style={{ 
            top: `${tooltipPos.top}px`, 
            left: `${tooltipPos.left}px` 
          }}
        >
          <div className="flex items-center gap-2 mb-3 border-b border-border-dark pb-2">
            <hoveredNode.icon className="size-4 text-primary" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">{hoveredNode.name}</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-500 uppercase font-bold">Type</span>
              <span className="text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded">{hoveredNode.type}</span>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold mb-1.5 flex items-center gap-1.5">
                <Activity className="size-3" /> Internal Operation
              </div>
              <div className="text-xs text-slate-300 leading-relaxed bg-black/40 p-2.5 rounded-lg border border-border-dark/50 font-mono">
                {hoveredNode.operation}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold mb-1.5 flex items-center gap-1.5">
                <Info className="size-3" /> Purpose
              </div>
              <div className="text-xs text-slate-400 italic leading-relaxed px-1">
                {hoveredNode.description}
              </div>
            </div>
          </div>
          {/* Arrow indicator */}
          <div className="absolute top-4 -left-1.5 size-3 bg-surface-dark border-l border-t border-primary/40 rotate-[-45deg]" />
        </div>
      )}

      <aside className="w-72 border-r border-border-dark bg-background-dark flex flex-col shrink-0 relative z-40">
        <div className="p-4 border-b border-border-dark flex flex-col gap-3">
          <div className="flex gap-1.5">
            <button 
              onClick={() => setIsRunning(true)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 rounded text-[10px] font-bold transition-all",
                isRunning ? "bg-signal-active text-white animate-pulse" : "bg-signal-active/80 text-white hover:brightness-110"
              )}
            >
              <Play className="size-3" /> RUN
            </button>
            <button 
              onClick={() => setIsRunning(false)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 rounded border text-[10px] font-bold transition-all",
                !isRunning ? "bg-surface-dark text-primary border-primary" : "bg-surface-dark text-slate-300 border-border-dark hover:bg-slate-700"
              )}
            >
              <Square className="size-3" /> STOP
            </button>
            <button 
              onClick={onSave}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary text-white rounded text-[10px] font-bold hover:brightness-110 transition-all disabled:opacity-50"
            >
              {isSaving ? <RefreshCw className="size-3 animate-spin" /> : <CloudUpload className="size-3" />}
              {isSaving ? '...' : 'DEPLOY'}
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search nodes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-dark border-none rounded-lg text-sm focus:ring-1 focus:ring-primary text-white"
            />
          </div>
        </div>
        <div className="p-4 flex-1 overflow-y-auto space-y-6 custom-scrollbar">
          {NODE_CATEGORIES.map((category, idx) => {
            const filteredItems = category.items.filter(item => 
              item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.type.toLowerCase().includes(searchQuery.toLowerCase())
            );
            
            if (filteredItems.length === 0) return null;

            return (
              <NodeCategory 
                key={idx}
                title={category.title} 
                onDragStart={onDragStart}
                onDoubleClick={onDoubleClick}
                onMouseEnter={handleNodeMouseEnter}
                onMouseLeave={handleNodeMouseLeave}
                items={filteredItems} 
              />
            );
          })}
        </div>
      </aside>

      <section className="flex-1 flex flex-col bg-background-dark relative z-10">
        <div className="flex border-b border-border-dark bg-background-dark px-4 overflow-x-auto">
          {['Main Logic', 'Motor Control', 'Safety System'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-bold whitespace-nowrap transition-all",
                activeTab === tab ? "border-primary text-primary bg-primary/5" : "border-transparent text-slate-500 hover:text-slate-300"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div 
          ref={containerRef} 
          className="flex-1 relative" 
          onDragOver={(e) => e.preventDefault()} 
          onDrop={onDrop}
        />
      </section>

      <aside className="w-80 border-l border-border-dark bg-background-dark flex flex-col shrink-0">
        <div className="flex border-b border-border-dark">
          <button className="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-primary border-b-2 border-primary bg-primary/5">Properties</button>
          <button className="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-300">Debug</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {selectedNode ? (
            <>
              <section className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="size-4 text-primary" />
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Node Information</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500 uppercase font-bold">Type</span>
                    <span className="text-slate-300">{selectedNode.getData().type}</span>
                  </div>
                  <div className="text-[10px]">
                    <div className="text-slate-500 uppercase font-bold mb-1">Internal Operation</div>
                    <div className="text-slate-300 leading-relaxed bg-black/20 p-2 rounded">{selectedNode.getData().operation}</div>
                  </div>
                  <div className="text-[10px]">
                    <div className="text-slate-500 uppercase font-bold mb-1">Description</div>
                    <div className="text-slate-400 italic leading-relaxed">{selectedNode.getData().description}</div>
                  </div>
                </div>
              </section>

              <section>
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-border-dark pb-1">General Settings</h4>
                <div className="space-y-4">
                  <PropertyField 
                    label="Display Label" 
                    value={editingData?.label || editingData?.name || ''} 
                    onChange={(val) => handlePropertyChange('label', val)}
                  />
                  <PropertyField label="Node ID" value={selectedNode.id} readOnly />
                </div>
              </section>
              {(selectedNode.shape === 'timer-node' || selectedNode.getData().category === 'Timer') && (
                <section>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-border-dark pb-1">Timer Parameters</h4>
                  <div className="space-y-4">
                    <PropertyField 
                      label="Preset Value (ms)" 
                      value={(editingData?.preset || 5000).toString()} 
                      onChange={(val) => handlePropertyChange('preset', val)}
                    />
                    <div className="p-3 bg-black/20 rounded border border-border-dark">
                      <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Accumulated (ACC)</div>
                      <div className="text-xl font-mono text-primary font-bold">{editingData?.acc || 0} ms</div>
                    </div>
                  </div>
                </section>
              )}
              <div className="pt-4 flex flex-col gap-2">
                <button 
                  onClick={applyChanges}
                  className="w-full py-2.5 bg-primary text-white rounded font-bold text-sm shadow-lg shadow-primary/10 hover:brightness-110 transition-all"
                >
                  Apply Changes
                </button>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-surface-dark text-slate-400 rounded border border-border-dark text-xs font-bold flex items-center justify-center gap-2 hover:text-white transition-colors">
                    <Copy className="size-3" /> Duplicate
                  </button>
                  <button 
                    onClick={() => {
                      if (selectedNode) {
                        graphRef.current?.removeCell(selectedNode);
                        setSelectedNode(null);
                      }
                    }}
                    className="flex-1 py-2 bg-surface-dark text-slate-400 rounded border border-border-dark text-xs font-bold flex items-center justify-center gap-2 hover:text-signal-error transition-colors"
                  >
                    <Trash2 className="size-3" /> Delete
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <Settings className="size-12 text-slate-700 mb-4" />
              <p className="text-sm text-slate-500">Select a node to view and edit its properties</p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

const NodeCategory: React.FC<{ 
  title: string; 
  items: NodeMetadata[]; 
  onDragStart: (e: React.DragEvent, metadata: NodeMetadata) => void;
  onDoubleClick: (metadata: NodeMetadata) => void;
  onMouseEnter: (e: React.MouseEvent, metadata: NodeMetadata) => void;
  onMouseLeave: () => void;
}> = ({ title, items, onDragStart, onDoubleClick, onMouseEnter, onMouseLeave }) => (
  <div>
    <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3">
      <Box className="size-3" />
      {title}
    </div>
    <div className="grid grid-cols-1 gap-2">
      {items.map((item, i) => (
        <div 
          key={i}
          draggable
          onDragStart={(e) => onDragStart(e, item)}
          onDoubleClick={() => onDoubleClick(item)}
          onMouseEnter={(e) => onMouseEnter(e, item)}
          onMouseLeave={onMouseLeave}
          className="flex items-center gap-3 p-3 bg-surface-dark/40 border border-border-dark rounded-lg cursor-grab hover:border-primary transition-all group active:cursor-grabbing select-none"
        >
          <item.icon className="size-4 text-primary shrink-0" />
          <span className="text-sm font-medium text-slate-300 group-hover:text-white truncate">{item.name}</span>
        </div>
      ))}
    </div>
  </div>
);

const PropertyField: React.FC<{ 
  label: string; 
  value: string; 
  readOnly?: boolean;
  onChange?: (value: string) => void;
}> = ({ label, value, readOnly, onChange }) => (
  <div>
    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">{label}</label>
    <input 
      type="text" 
      value={value} 
      readOnly={readOnly}
      onChange={(e) => onChange?.(e.target.value)}
      className={cn(
        "w-full bg-surface-dark border-none rounded p-2 text-sm font-medium transition-shadow",
        readOnly ? "text-slate-500 cursor-not-allowed" : "text-white focus:ring-1 focus:ring-primary"
      )}
    />
  </div>
);
