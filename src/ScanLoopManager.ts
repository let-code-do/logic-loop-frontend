import { Rung } from './Rung.js';
import { IOState } from './IOState.js';
import { ExternalIO } from './ExternalIO.js';
import { LogicEvaluator, type LogicNode, type LogicEdge } from './LogicEvaluator.js';

export interface VisualizationBridge {
  sendDiff(diff: Record<string, Uint8Array>): void;
  getGraph?(): { nodes: LogicNode[], edges: LogicEdge[] };
}

export class ScanLoopManager {
  fixedScanTime: number = 20; // ms
  private lastTimestamp: number = 0;
  private isRunning: boolean = false;

  private rungs: Rung[] = [];
  private ioState: IOState | null = null;
  private externalIO: ExternalIO | null = null;
  private bridge: VisualizationBridge | null = null;

  start(rungs: Rung[], ioState: IOState, externalIO: ExternalIO, bridge?: VisualizationBridge) {
    this.rungs = rungs;
    this.ioState = ioState;
    this.externalIO = externalIO;
    this.bridge = bridge || null;
    this.isRunning = true;
    this.lastTimestamp = performance.now();
    this.runLoop();
  }

  stop() {
    this.isRunning = false;
  }

  private runLoop() {
    if (!this.isRunning) return;

    const now = performance.now();
    const deltaTime = now - this.lastTimestamp;
    this.lastTimestamp = now;

    this.executeScan(deltaTime);

    const processTime = performance.now() - now;
    const delay = Math.max(0, this.fixedScanTime - processTime);
    setTimeout(() => this.runLoop(), delay);
  }

  private executeScan(dt: number) {
    if (!this.ioState || !this.externalIO) return;

    // 1. Update Input Latch (max 10 requests)
    this.ioState.updateInputLatch(this.externalIO.getQueue(10));

    // 2. Evaluate Rungs
    for (const rung of this.rungs) {
      rung.evaluate(this.ioState);
    }

    // 3. Logic Evaluator (Timers/React Flow Logic)
    let nodes: LogicNode[] = [];
    let edges: LogicEdge[] = [];
    if (this.bridge?.getGraph) {
        const graph = this.bridge.getGraph();
        nodes = graph.nodes;
        edges = graph.edges;
    }
    LogicEvaluator.evaluate(this.ioState, dt, nodes, edges);

    // 4. Update Output Latch
    this.ioState.updateOutputLatch(this.externalIO);

    // 5. Send Changes to Visualization
    if (this.bridge) {
      const diff = this.ioState.getChanges();
      if (Object.keys(diff).length > 0) {
        this.bridge.sendDiff(diff);
      }
    }
  }

  /**
   * For backward compatibility and explicit manual triggers
   */
  runRungs(rungs: Rung[], ioState: IOState, externalIO: ExternalIO, dt: number = 20) {
    ioState.updateInputLatch(externalIO.getQueue(10));
    for (const rung of rungs) {
      rung.evaluate(ioState);
    }
    LogicEvaluator.evaluate(ioState, dt, [], []);
    ioState.updateOutputLatch(externalIO);
  }
}
