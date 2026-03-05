import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Graph, Node as X6Node, Edge as X6Edge, NodeView } from '@antv/x6';
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
  ChevronDown,
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
  Info,
  X as XIcon
} from 'lucide-react';
import { cn } from '../utils.js';
import { NODE_CATEGORIES, type NodeMetadata } from '../constants.js';
import { useEngine } from '../context/EngineContext.js';
import type { VisualizationBridge } from '../ScanLoopManager.js';
import type { LogicNode, LogicEdge } from '../LogicEvaluator.js';

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
const LogicNodeComponent: React.FC<{ node: X6Node }> = ({ node }) => {
  const data = node.getData();
  const selected = node.isNode() && node.getProp('selected');
  const IconComponent = ICON_MAP[data.iconName] || Box;
  const isActive = data.isActive;

  return (
    <div className={cn(
      "px-4 py-3 bg-surface-dark border rounded-lg shadow-xl min-w-[160px] h-full transition-all flex flex-col justify-center",
      selected ? "border-primary ring-2 ring-primary/20" : "border-border-dark",
      isActive && "border-signal-active ring-2 ring-signal-active/20"
    )}>
      <div className="flex items-center gap-2 mb-2 border-b border-border-dark pb-2">
        <IconComponent className={cn("size-4", isActive ? "text-signal-active" : "text-primary")} />
        <span className="text-[10px] font-bold uppercase tracking-tight text-slate-300 truncate">{data.name}</span>
        <span className="ml-auto text-[10px] text-slate-500 bg-black/20 px-1 rounded shrink-0">{data.type}</span>
      </div>
      <div className="text-xs font-semibold text-white truncate">{data.label || data.name}</div>
    </div>
  );
};

const TimerNodeComponent: React.FC<{ node: X6Node }> = ({ node }) => {
  const data = node.getData();
  const selected = node.isNode() && node.getProp('selected');
  const isActive = data.isActive;

  return (
    <div className={cn(
      "px-4 py-3 bg-surface-dark border rounded-lg shadow-xl min-w-[200px] h-full transition-all flex flex-col justify-center",
      selected ? "border-primary ring-2 ring-primary/20" : "border-border-dark",
      isActive && "border-signal-active ring-2 ring-signal-active/20"
    )}>
      <div className="flex items-center gap-2 mb-2 border-b border-border-dark pb-2">
        <Timer className={cn("size-4", isActive ? "text-signal-active" : "text-primary")} />
        <span className="text-[10px] font-bold uppercase tracking-tight text-slate-300">{data.name}</span>
        <span className="ml-auto text-[10px] text-slate-500 bg-black/20 px-1 rounded">{data.type}</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500">
          <span>Preset</span>
          <span className="text-primary">{data.preset || 5000} ms</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-300"
            style={{ width: `${Math.min(100, ((data.acc || 0) / (data.preset || 5000)) * 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono">
          <span className="text-slate-500">ACC</span>
          <span className="text-slate-300">{Math.floor(data.acc || 0)} ms</span>
        </div>
      </div>
    </div>
  );
};

const BlockNodeComponent: React.FC<{ node: X6Node }> = ({ node }) => {
  const data = node.getData();
  const selected = node.isNode() && node.getProp('selected');
  const IconComponent = ICON_MAP[data.iconName] || Box;

  return (
    <div className={cn(
      "bg-surface-dark border rounded-lg shadow-xl min-w-[220px] h-full transition-all flex flex-col overflow-hidden",
      selected ? "border-primary ring-2 ring-primary/20" : "border-border-dark"
    )}>
      <div className="bg-primary/10 px-4 py-2 border-b border-border-dark flex items-center gap-2">
        <IconComponent className="size-4 text-primary" />
        <span className="text-[10px] font-bold uppercase tracking-tight text-white truncate">{data.name}</span>
      </div>
      <div className="flex-1 p-3 flex flex-col justify-center items-center gap-2">
        <div className="text-xs  text-slate-400 bg-black/40 px-3 py-1 rounded border border-border-dark">
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
  component: LogicNodeComponent,
  ports: {
    groups: {
      in: {
        position: 'left',
        markup: [
          {
            tagName: 'rect',
            selector: 'portBody'
          }
        ],
        attrs: {
          portBody: {
            width: 10,
            height: 10,
            x: -5,
            y: -5,
            magnet: true,
            stroke: '#22c55e',
            strokeWidth: 2,
            fill: '#0f1923',
            'port-group': 'in',
            style: { cursor: 'crosshair' }
          }
        }
      },
      out: {
        position: 'right',
        attrs: {
          circle: {
            r: 5,
            magnet: true,
            stroke: '#FF9500',
            strokeWidth: 2,
            fill: '#0f1923',
            'port-group': 'out',
            style: { cursor: 'crosshair' }
          }
        }
      },
      error: {
        position: { name: 'absolute', args: { x: '100%', y: '100%' } }, // 오른쪽 하단
        attrs: {
          circle: {
            r: 5,
            magnet: true,
            stroke: '#FF3B30',
            strokeWidth: 2,
            'port-group': 'error',
            fill: '#0f1923'
          }
        }
      }
    },
    items: [{ group: 'in', id: 'in' }, { group: 'out', id: 'out' }],
  },
});

register({
  shape: 'timer-node',
  width: 220,
  height: 120,
  component: TimerNodeComponent,
  ports: {
    groups: {
      in: {
        position: 'left',
        markup: [
          {
            tagName: 'rect',
            selector: 'portBody'
          }
        ],
        attrs: {
          portBody: {
            width: 10,
            height: 10,
            x: -5,
            y: -5,
            magnet: true,
            stroke: '#22c55e',
            strokeWidth: 2,
            fill: '#0f1923',
            'port-group': 'in',
            style: { cursor: 'crosshair' }
          }
        }
      },
      out: {
        position: 'right',
        attrs: {
          circle: {
            r: 5,
            magnet: true,
            stroke: '#FF9500',
            strokeWidth: 2,
            fill: '#0f1923',
            'port-group': 'out',
            style: { cursor: 'crosshair' }
          }
        }
      },
      error: {
        position: { name: 'absolute', args: { x: '100%', y: '100%' } }, // 오른쪽 하단
        attrs: {
          circle: {
            r: 5,
            magnet: true,
            stroke: '#FF3B30',
            strokeWidth: 2,
            'port-group': 'error',
            fill: '#0f1923'
          }
        }
      }
    },
    items: [{ group: 'in', id: 'in' }, { group: 'out', id: 'out' }],
  },
});

register({
  shape: 'block-node',
  width: 240,
  height: 140,
  component: BlockNodeComponent,
  ports: {
    groups: {
      in: {
        position: 'left',
        markup: [
          {
            tagName: 'rect',
            selector: 'portBody'
          }
        ],
        attrs: {
          portBody: {
            width: 10,
            height: 10,
            x: -5,
            y: -5,
            magnet: true,
            stroke: '#22c55e',
            strokeWidth: 2,
            fill: '#0f1923',
            'port-group': 'in',
            style: { cursor: 'crosshair' }
          }
        }
      },
      out: {
        position: 'right',
        attrs: {
          circle: {
            r: 5,
            magnet: true,
            stroke: '#FF9500',
            strokeWidth: 2,
            fill: '#0f1923',
            'port-group': 'out',
            style: { cursor: 'crosshair' }
          }
        }
      },
      error: {
        position: { name: 'absolute', args: { x: '100%', y: '100%' } }, // 오른쪽 하단
        attrs: {
          circle: {
            r: 5,
            magnet: true,
            stroke: '#FF3B30',
            strokeWidth: 2,
            'port-group': 'error',
            fill: '#0f1923'
          }
        }
      }
    },
    items: [
      { group: 'in', id: 'in-1' },
      { group: 'in', id: 'in-2' },
      { group: 'out', id: 'out-1' },
      { group: 'out', id: 'out-2' },
    ],
  },
});

interface Tab {
  id: string;
  name: string;
  graphData: any;
}

export const FlowEditor: React.FC = () => {
  const { scanLoop, ioState, externalIO, logger } = useEngine();
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);
  const [selectedNode, setSelectedNode] = useState<X6Node | null>(null);
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', name: 'Main Logic', graphData: null }
  ]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [activeRightTab, setActiveRightTab] = useState<'properties' | 'debug'>('properties');
  const [debugLogs, setDebugLogs] = useState<any[]>([
    { id: 1, type: 'SCAN', time: '14:22:10.001', message: 'Scan loop initiated.' }
  ]);
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
      if (editingData.label) {
        selectedNode.setProp('label', editingData.label);
      }
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const graph: Graph = new Graph({
      container: containerRef.current,
      grid: { size: 10, visible: true, type: 'dot', args: { color: '#333333', thickness: 1 } },
      background: { color: '#0f1923' },
      panning: {
        enabled: true,
        modifiers: 'space',
      },
      mousewheel: { enabled: true, modifiers: ['ctrl', 'meta'] },
      connecting: {
        router: {
          name: 'manhattan',
          args: {
            padding: 10,
          },
        },
        connector: { name: 'rounded', args: { radius: 10 } },
        anchor: 'center',
        connectionPoint: 'anchor',
        allowBlank: false,
        allowLoop: false,
        allowNode: false,
        allowEdge: false,
        allowMulti: true,
        highlight: true,
        snap: { radius: 30 },
        validateMagnet({ magnet }: any) {
          const group = magnet.getAttribute('port-group');
          return group === 'out' || group === 'error';
        },
        validateConnection({ sourceMagnet, targetMagnet }: any) {
          const sourceGroup = sourceMagnet?.getAttribute('port-group');
          const targetGroup = targetMagnet?.getAttribute('port-group');
          return (sourceGroup === 'out' || sourceGroup === 'error') && targetGroup === 'in';
        },
        createEdge() {
          return this.createEdge({
            shape: 'edge',
            attrs: {
              line: {
                stroke: '#007fff',
                strokeWidth: 3,
                targetMarker: {
                  name: 'block',
                  width: 12,
                  height: 8,
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
              stroke: '#22c55e',
              strokeWidth: 4,
              strokeDasharray: '2,2',
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

    graph.use(new Selection({ enabled: true, rubberband: true, multiple: true, showNodeSelectionBox: true, showEdgeSelectionBox: true }));
    graph.use(new Snapline({ enabled: true }));

    graphRef.current = graph;

    graph.on('node:selected', ({ node }: { node: X6Node }) => setSelectedNode(node));
    graph.on('node:unselected', () => setSelectedNode(null));

    graph.on('edge:connected', ({ edge }: { edge: X6Edge }) => {
      if (isRunning) {
        edge.attr('line/strokeDasharray', 5);
        edge.attr('line/style/animation', 'ant-line 30s infinite linear');
      }
    });

    graph.on('edge:dblclick', ({ edge }: { edge: X6Edge }) => {
      edge.remove()
    })

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
        category: 'Contact',
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
        label: 'TIMER_01',
        preset: 5000,
        acc: 0,
        type: '타이머',
        category: 'Timer',
        operation: 'IN true 유지 시간 ≥ PT → Q true',
        description: 'On Delay 타이머. 설정 시간 후 출력'
      },
    });

    graph.addEdge({
      id: 'e1-2',
      source: { cell: '1', port: 'out' },
      target: { cell: '2', port: 'in' },
      attrs: { line: { stroke: '#007fff', strokeWidth: 2 } },
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete') {
        const cells = graph.getSelectedCells()
        graph.removeCells(cells)
      }
    };
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      graph.dispose();
    };
  }, []);

  const handleTabChange = (tabId: string) => {
    if (!graphRef.current || tabId === activeTabId) return;
    const currentData = graphRef.current.toJSON();
    setTabs(prev => prev.map(tab => tab.id === activeTabId ? { ...tab, graphData: currentData } : tab));
    const targetTab = tabs.find(t => t.id === tabId);
    if (targetTab) {
      graphRef.current.fromJSON(targetTab.graphData || { nodes: [], edges: [] });
      setActiveTabId(tabId);
      setSelectedNode(null);
    }
  };

  const addTab = () => {
    const newId = Date.now().toString();
    const newTab: Tab = { id: newId, name: `New Flow ${tabs.length + 1}`, graphData: null };
    if (graphRef.current) {
      const currentData = graphRef.current.toJSON();
      setTabs(prev => [...prev.map(tab => tab.id === activeTabId ? { ...tab, graphData: currentData } : tab), newTab]);
    } else {
      setTabs(prev => [...prev, newTab]);
    }
    setActiveTabId(newId);
    graphRef.current?.fromJSON({ nodes: [], edges: [] });
    setSelectedNode(null);
  };

  const renameTab = (id: string, newName: string) => {
    setTabs(prev => prev.map(tab => tab.id === id ? { ...tab, name: newName } : tab));
    setEditingTabId(null);
  };

  const deleteTab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) {
      const nextTab = newTabs[0];
      if (nextTab) {
        setActiveTabId(nextTab.id);
        graphRef.current?.fromJSON(nextTab.graphData || { nodes: [], edges: [] });
      }
    }
  };

  // Integration with Simulation Engine
  const bridge = useRef<VisualizationBridge>({
    sendDiff: (diff) => {
      if (!graphRef.current) return;
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;

      Object.entries(diff).forEach(([addr, data]) => {
        const newLog = {
          id: Math.random(),
          type: 'DIFF',
          time: timeStr,
          message: `Memory address ${addr} changed.`,
          addr,
          data: `Value: ${data[0]}`
        };
        setDebugLogs(prev => [newLog, ...prev].slice(0, 50));
      });

      graphRef.current.getNodes().forEach(node => {
        const nodeData = node.getData();
        const address = nodeData.label;
        if (!address) return;

        let isActive = false;
        let acc = nodeData.acc;

        const devIn = ioState.inputs[address];
        const devOut = ioState.outputs[address];
        const devInt = ioState.internal[address];

        if (devIn) isActive = devIn.readBit(0) === 1;
        else if (devOut) isActive = devOut.readBit(0) === 1;
        else if (devInt) isActive = devInt.readBit(0) === 1;

        if (nodeData.category === 'Timer' && devInt) {
          acc = devInt.readWord(0);
        }

        if (nodeData.isActive !== isActive || nodeData.acc !== acc) {
          node.setData({ ...nodeData, isActive, acc }, { overwrite: true });
        }
      });
    },
    getGraph: () => {
      if (!graphRef.current) return { nodes: [], edges: [] };
      const json = graphRef.current.toJSON();
      const nodes: LogicNode[] = json.cells
        .filter((c: any) => c.shape !== 'edge' && !c.shape.includes('edge'))
        .map((n: any) => ({
          id: n.id,
          type: n.data.category?.toLowerCase() || 'contact',
          data: n.data
        }));
      const edges: LogicEdge[] = json.cells
        .filter((c: any) => c.shape === 'edge' || c.shape.includes('edge'))
        .map((e: any) => ({
          id: e.id,
          source: typeof e.source === 'string' ? e.source : e.source.cell,
          target: typeof e.target === 'string' ? e.target : e.target.cell
        }));
      return { nodes, edges };
    }
  });

  const handleStartStop = () => {
    if (isRunning) {
      scanLoop.stop();
      setIsRunning(false);
    } else {
      scanLoop.start([], ioState, externalIO, bridge.current);
      setIsRunning(true);
    }
  };

  useEffect(() => {
    if (!graphRef.current) return;
    const edges = graphRef.current.getEdges();
    edges.forEach((edge: X6Edge) => {
      if (isRunning) {
        edge.attr('line/strokeDasharray', 5);
        edge.attr('line/style/animation', 'ant-line 30s infinite linear');
      } else {
        edge.attr('line/strokeDasharray', 0);
        edge.attr('line/style/animation', 'none');
      }
    });

    if (isRunning) {
      const interval = setInterval(() => {
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
        const newLog = {
          id: Math.random(),
          type: 'SCAN',
          time: timeStr,
          message: `Scan loop initiated.`
        };
        setDebugLogs(prev => [newLog, ...prev].slice(0, 50));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const onDragStart = (event: React.DragEvent, nodeMetadata: NodeMetadata) => {
    event.dataTransfer.setData('application/x6', JSON.stringify(nodeMetadata));
    const el = event.currentTarget as HTMLElement
    const rect = el.getBoundingClientRect()
    event.dataTransfer.setDragImage(el, rect.width / 2, rect.height / 2)
  };

  const onDrop = (event: React.DragEvent) => {
    if (!graphRef.current) return;
    const rawData = event.dataTransfer.getData('application/x6');
    console.log(rawData);
    if (!rawData) return;
    const metadata: NodeMetadata = JSON.parse(rawData);
    const point = graphRef.current.clientToLocal(event.clientX, event.clientY);
    const newNode = graphRef.current.addNode({
      shape: metadata.shape,
      x: point.x,
      y: point.y,
      ports: metadata.ports,
      data: { ...metadata, label: metadata.name, preset: metadata.category === 'Timer' ? 5000 : undefined, acc: metadata.category === 'Timer' ? 0 : undefined },
    });
    if (newNode) {
      const size = newNode.size();
      newNode.position(point.x - size.width / 2, point.y - size.height / 2);
      graphRef.current.resetSelection(newNode);
    }
  };

  const onDoubleClick = (metadata: NodeMetadata) => {
    if (!graphRef.current) return;
    const { x, y } = (graphRef.current.getGraphArea() as any).center();
    const newNode = graphRef.current.addNode({
      shape: metadata.shape,
      x: x - 100,
      y: y - 40,
      data: { ...metadata, label: metadata.name, preset: metadata.category === 'Timer' ? 5000 : undefined, acc: metadata.category === 'Timer' ? 0 : undefined },
    });
    if (newNode) { graphRef.current.resetSelection(newNode); }
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
    setTooltipPos({ top: rect.top, left: rect.right + 8 });
  };

  return (
    <div className="flex h-full overflow-hidden relative">
      {hoveredNode && (
        <div className="fixed z-[9999] w-72 p-4 bg-surface-dark border border-primary/40 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] pointer-events-none backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200" style={{ top: `${tooltipPos.top}px`, left: `${tooltipPos.left}px` }}>
          <div className="flex items-center gap-2 mb-3 border-b border-border-dark pb-2">
            <hoveredNode.icon className="size-4 text-primary" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">{hoveredNode.name}</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-[10px]"><span className="text-slate-500 uppercase font-bold">Type</span><span className="text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded">{hoveredNode.type}</span></div>
            <div><div className="text-[10px] text-slate-500 uppercase font-bold mb-1.5 flex items-center gap-1.5"><Activity className="size-3" /> Internal Operation</div><div className="text-xs text-slate-300 leading-relaxed bg-black/40 p-2.5 rounded-lg border border-border-dark/50 font-mono">{hoveredNode.operation}</div></div>
            <div><div className="text-[10px] text-slate-500 uppercase font-bold mb-1.5 flex items-center gap-1.5"><Info className="size-3" /> Purpose</div><div className="text-xs text-slate-400 italic leading-relaxed px-1">{hoveredNode.description}</div></div>
          </div>
          <div className="absolute top-4 -left-1.5 size-3 bg-surface-dark border-l border-t border-primary/40 rotate-[-45deg]" />
        </div>
      )}

      <aside className="w-72 border-r border-border-dark bg-background-dark flex flex-col shrink-0 relative z-40">
        <div className="p-4 border-b border-border-dark flex flex-col gap-3">
          <div className="flex gap-1.5">
            <button onClick={handleStartStop} className={cn("flex-1 flex items-center justify-center gap-1.5 py-2 rounded text-[10px] font-bold transition-all", isRunning ? "bg-signal-active text-white animate-pulse" : "bg-signal-active/80 text-white hover:brightness-110")}><Play className="size-3" /> {isRunning ? 'RUNNING' : 'RUN'}</button>
            <button onClick={() => { if (isRunning) handleStartStop(); }} className={cn("flex-1 flex items-center justify-center gap-1.5 py-2 rounded border text-[10px] font-bold transition-all", !isRunning ? "bg-surface-dark text-primary border-primary" : "bg-surface-dark text-slate-300 border-border-dark hover:bg-slate-700")}><Square className="size-3" /> STOP</button>
            <button onClick={onSave} disabled={isSaving} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary text-white rounded text-[10px] font-bold hover:brightness-110 transition-all disabled:opacity-50">{isSaving ? <RefreshCw className="size-3 animate-spin" /> : <CloudUpload className="size-3" />}{isSaving ? '...' : 'DEPLOY'}</button>
          </div>
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" /><input type="text" placeholder="Search nodes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-surface-dark border-none rounded-lg text-sm focus:ring-1 focus:ring-primary text-white" /></div>
        </div>
        <div className="p-4 flex-1 overflow-y-auto space-y-6 custom-scrollbar">
          {NODE_CATEGORIES.map((category: any, idx: number) => {
            const filteredItems = category.items.filter((item: any) => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.type.toLowerCase().includes(searchQuery.toLowerCase()));
            if (filteredItems.length === 0) return null;
            return <NodeCategory key={idx} title={category.title} onDragStart={onDragStart} onDoubleClick={onDoubleClick} onMouseEnter={handleNodeMouseEnter} onMouseLeave={() => setHoveredNode(null)} items={filteredItems} />;
          })}
        </div>
      </aside>

      <section className="flex-1 flex flex-col bg-background-dark relative z-10">
        <div className="flex border-b border-border-dark bg-background-dark px-4 overflow-x-auto items-center">
          {tabs.map(tab => (
            <div key={tab.id} className={cn("relative flex items-center gap-2 px-6 py-3 border-b-2 text-sm font-bold whitespace-nowrap transition-all group/tab", activeTabId === tab.id ? "border-primary text-primary bg-primary/5" : "border-transparent text-slate-500 hover:text-slate-300")}>
              {editingTabId === tab.id ? <input autoFocus className="bg-surface-dark border border-primary rounded px-1 py-0.5 text-xs focus:outline-none" defaultValue={tab.name} onBlur={(e) => renameTab(tab.id, e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') renameTab(tab.id, (e.target as HTMLInputElement).value); if (e.key === 'Escape') setEditingTabId(null); }} /> : <>
                <span onClick={() => handleTabChange(tab.id)} onDoubleClick={() => setEditingTabId(tab.id)} className="cursor-pointer">{tab.name}</span>
                {tabs.length > 1 && <button onClick={(e) => deleteTab(e, tab.id)} className="absolute top-1 right-1 opacity-0 group-hover/tab:opacity-100 p-0.5 hover:bg-signal-error/20 rounded transition-all"><XIcon className="size-3 text-signal-error" /></button>}
              </>}
            </div>
          ))}
          <button onClick={addTab} className="p-2 text-slate-500 hover:text-primary transition-colors ml-2" title="Add new flow"><Plus className="size-4" /></button>
        </div>
        <div ref={containerRef} className="flex-1 relative" onDragOver={(e) => e.preventDefault()} onDrop={onDrop} />
      </section>

      <aside className="w-80 border-l border-border-dark bg-background-dark flex flex-col shrink-0">
        <div className="flex border-b border-border-dark">
          <button onClick={() => setActiveRightTab('properties')} className={cn("flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all", activeRightTab === 'properties' ? "text-primary border-b-2 border-primary bg-primary/5" : "text-slate-500 hover:text-slate-300 border-b-2 border-transparent")}>Properties</button>
          <button onClick={() => setActiveRightTab('debug')} className={cn("flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all", activeRightTab === 'debug' ? "text-primary border-b-2 border-primary bg-primary/5" : "text-slate-500 hover:text-slate-300 border-b-2 border-transparent")}>Debug</button>
        </div>
        <div className="flex-1 relative flex flex-col min-h-0">
          {activeRightTab === 'debug' ? (
            <div className="flex-1 flex flex-col bg-background-dark overflow-hidden">
              <div className="flex-1 overflow-y-auto custom-scrollbar text-[10px] p-4 space-y-2">
                {debugLogs.map((log) => (
                  <div key={log.id}>
                    {log.type === 'DIFF' ? <div className="flex flex-col gap-1 px-2 py-1 rounded bg-emerald-500/5 hover:bg-emerald-500/10 border-l-2 border-emerald-500 cursor-pointer transition-colors"><div className="flex gap-2"><span className="text-slate-500 shrink-0">{log.time}</span><span className="text-emerald-500 font-bold w-12 shrink-0 uppercase">[DIFF]</span><span className="text-emerald-400">Memory address <span className="bg-emerald-500/20 px-1 rounded">{log.addr}</span> changed.</span></div><div className="text-[9px] text-slate-500 pl-14 whitespace-pre-wrap">{log.data}</div></div> : <div className={cn("flex gap-2 px-2 py-1 rounded hover:bg-primary/5 group cursor-default", log.type === 'WARN' && "bg-amber-500/5 border-l-2 border-amber-500", log.type === 'FAIL' && "bg-red-500/5 border-l-2 border-red-500")}>
                      <span className="text-slate-500 shrink-0 select-none">{log.time}</span>
                      <span className={cn("font-bold w-12 shrink-0 uppercase", log.type === 'SCAN' && "text-blue-400", log.type === 'WARN' && "text-amber-500", log.type === 'FAIL' && "text-red-500")}>[{log.type}]</span>
                      <span className={cn("text-slate-400", log.type === 'WARN' && "text-amber-400", log.type === 'FAIL' && "text-red-400")}>{log.message}</span>
                    </div>}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar pb-32">
              {selectedNode ? <>
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
                      <div className="text-slate-300 leading-relaxed bg-black/20 p-2 rounded">
                        {selectedNode.getData().operation}
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-border-dark pb-1">
                    General Settings
                  </h4>
                  <div className="space-y-4">
                    <PropertyField
                      label="Display Label"
                      value={editingData?.label || editingData?.name || ''}
                      onChange={(val) => handlePropertyChange('label', val)}
                    />
                    <PropertyField label="Node ID" value={selectedNode.id} readOnly />
                  </div>
                </section>
                <section>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-border-dark pb-1">
                    Port Configuration
                  </h4>
                  <div className="space-y-4">
                    {/* Input Ports List */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Input Ports</label>
                      <div className="space-y-1">
                        {selectedNode.getPortsByGroup('in').map((port, idx) => (
                          <div
                            key={idx}
                            className="group/port flex items-center justify-between bg-surface-dark px-3 py-2 rounded border border-border-dark/50 hover:border-primary/50 transition-colors"
                          >
                            <span className="text-xs text-slate-300 bg-black/20 px-2 rounded">{port.id}</span>
                            <span className="ml-auto text-xs text-slate-500 bg-black/20 px-2 rounded shrink-0">{port.tooltip}</span>
                            {!port.isReadOnly &&
                              <button
                                onClick={() => {
                                  if (selectedNode.getPortsByGroup('in').length > 1) {
                                    selectedNode.removePort(port.id!);
                                    setEditingData({ ...selectedNode.getData() });
                                  }
                                }}
                                className="opacity-0 group-hover/port:opacity-100 text-slate-500 hover:text-signal-error transition-all"
                              >
                                <XIcon className="size-3" />
                              </button>
                            }
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            selectedNode.addPort({ group: 'in', id: `In-${Date.now()}` });
                            setEditingData({ ...selectedNode.getData() });
                          }}
                          className="w-full py-1.5 border border-dashed border-border-dark hover:border-primary/50 hover:bg-primary/5 rounded flex items-center justify-center text-slate-500 hover:text-primary transition-all"
                        >
                          <Plus className="size-3 mr-1" /> Add Input
                        </button>
                      </div>
                    </div>

                    {/* Output Ports List */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Output Ports</label>
                      <div className="space-y-1">
                        {selectedNode.getPortsByGroup('out').map((port, idx) => (
                          <div
                            key={port.id}
                            className="group/port flex items-center justify-between bg-surface-dark px-3 py-2 rounded border border-border-dark/50 hover:border-primary/50 transition-colors"
                          >
                            <span className="text-xs text-slate-300">OUT_{idx + 1}</span>
                            <button
                              onClick={() => {
                                if (selectedNode.getPortsByGroup('out').length > 1) {
                                  selectedNode.removePort(port.id!);
                                  setEditingData({ ...selectedNode.getData() });
                                }
                              }}
                              className="opacity-0 group-hover/port:opacity-100 text-slate-500 hover:text-signal-error transition-all"
                            >
                              <XIcon className="size-3" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            selectedNode.addPort({ group: 'out', id: `out-${Date.now()}` });
                            setEditingData({ ...selectedNode.getData() });
                          }}
                          className="w-full py-1.5 border border-dashed border-border-dark hover:border-primary/50 hover:bg-primary/5 rounded flex items-center justify-center text-slate-500 hover:text-primary transition-all"
                        >
                          <Plus className="size-3 mr-1" /> Add Output
                        </button>
                      </div>
                    </div>

                    {/* Error Port Toggle */}
                    <div className="flex items-center justify-between pt-2 border-t border-border-dark/30">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Error Port</label>
                      <button
                        onClick={() => {
                          const hasError = selectedNode.hasPort('Error');
                          if (hasError) {
                            selectedNode.removePort('Error');
                          } else {
                            selectedNode.addPort({
                              group: 'error',
                              id: 'Error',
                              position: { name: 'absolute', args: { x: '100%', y: '100%' } }, // 오른쪽 하단
                              attrs: {
                                circle: {
                                  r: 5,
                                  magnet: true,
                                  stroke: '#FF3B30',
                                  strokeWidth: 2,
                                  'port-group': 'error',
                                  fill: '#0f1923'
                                }
                              }
                            });
                          }
                          setEditingData({ ...selectedNode.getData() });
                        }}
                        className={cn(
                          "px-2 py-1 rounded text-[10px] font-bold transition-all",
                          selectedNode.hasPort('Error')
                            ? "bg-signal-error/20 text-signal-error border border-signal-error/50"
                            : "bg-surface-dark text-slate-500 border border-border-dark"
                        )}
                      >
                        {selectedNode.hasPort('Error') ? 'ENABLED' : 'DISABLED'}
                      </button>
                    </div>
                  </div>
                </section>
                {(selectedNode.shape === 'timer-node' || selectedNode.getData().category === 'Timer') && (
                  <section>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-border-dark pb-1">
                      Timer Parameters
                    </h4>
                    <div className="space-y-4">
                      <PropertyField
                        label="Preset Value (ms)"
                        value={(editingData?.preset || 5000).toString()}
                        onChange={(val) => handlePropertyChange('preset', val)}
                      />
                      <div className="p-3 bg-black/20 rounded border border-border-dark">
                        <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Accumulated (ACC)
                        </div>
                        <div className="text-xl text-primary font-bold">
                          {Math.floor(editingData?.acc || 0)} ms
                        </div>
                      </div>
                    </div>
                  </section>
                )}
              </> : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <Settings className="size-12 text-slate-700 mb-4" />
                  <p className="text-sm text-slate-500">Select a node to view and edit its properties</p>
                </div>
              )}
            </div>
          )}

          {selectedNode && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-background-dark border-t border-border-dark flex items-center gap-2">
              <button
                onClick={applyChanges}
                className="flex-1 py-2.5 bg-primary text-white rounded font-bold text-sm shadow-lg shadow-primary/10 hover:brightness-110 transition-all"
              >
                Apply Changes
              </button>
              <button
                onClick={() => {
                  if (selectedNode) {
                    graphRef.current?.removeCell(selectedNode);
                    setSelectedNode(null);
                  }
                }}
                className="p-2.5 bg-signal-error/10 text-signal-error rounded border border-signal-error/20 hover:bg-signal-error hover:text-white transition-all group"
                title="Delete Node"
              >
                <Trash2 className="size-4" />
              </button>
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
}> = ({ title, items, onDragStart, onDoubleClick, onMouseEnter, onMouseLeave }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3 cursor-pointer hover:text-slate-300 transition-colors"
      >
        {isOpen ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
        {title}
      </div>
      {isOpen && (
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
              <span className="text-sm font-medium text-slate-300 group-hover:text-white truncate">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

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