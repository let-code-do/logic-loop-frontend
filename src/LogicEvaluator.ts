import { IOState } from './IOState.js';

export interface LogicNode {
  id: string;
  type: string;
  data: {
    label?: string;
    address?: string;
    category?: string;
    preset?: number;
    acc?: number;
    [key: string]: any;
  };
}

export interface LogicEdge {
  id: string;
  source: string;
  target: string;
}

export class LogicEvaluator {
  /**
   * Evaluates React Flow based logic nodes and edges.
   * Handles Timers and special coils periodically within the scan loop.
   */
  static evaluate(ioState: IOState, dt: number, nodes: LogicNode[] = [], edges: LogicEdge[] = []) {
    const nodeResults: Record<string, boolean> = {};

    // 1. Initialize results for root nodes (contacts)
    for (const node of nodes) {
        const category = node.data.category?.toLowerCase();
        const address = node.data.label || '';

        if (category === 'contact') {
            const device = ioState.inputs[address] || ioState.internal[address] || ioState.outputs[address];
            let value = device ? device.readBit(0) === 1 : false;

            // Handle NC contact
            if (node.data.name === 'NC Contact') {
                value = !value;
            }

            nodeResults[node.id] = value;
        }
    }

    // 2. Simple logic propagation
    const maxIterations = 5;
    for (let i = 0; i < maxIterations; i++) {
        let changed = false;
        for (const edge of edges) {
            const sourceResult = nodeResults[edge.source];
            if (sourceResult !== undefined) {
                const targetNode = nodes.find(n => n.id === edge.target);
                if (!targetNode) continue;

                const category = targetNode.data.category?.toLowerCase();

                if (category === 'timer') {
                    // Timer logic
                    const preset = targetNode.data.preset || 5000;
                    let acc = targetNode.data.acc || 0;
                    let done = false;

                    if (sourceResult) {
                        acc += dt;
                        if (acc >= preset) {
                            acc = preset;
                            done = true;
                        }
                    } else {
                        acc = 0;
                        done = false;
                    }

                    // Store updated state
                    if (targetNode.data.acc !== acc) {
                        targetNode.data.acc = acc;
                        // Also update internal memory if mapped
                        const address = targetNode.data.label;
                        if (address && ioState.internal[address]) {
                            ioState.internal[address].writeWord(0, Math.floor(acc));
                        }
                    }

                    if (nodeResults[targetNode.id] !== done) {
                        nodeResults[targetNode.id] = done;
                        changed = true;
                    }
                } else if (category === 'output') {
                    // Coil logic
                    const address = targetNode.data.label || '';
                    const device = ioState.outputs[address] || ioState.internal[address];

                    let value = sourceResult;
                    if (targetNode.data.name === 'Inverted Coil') {
                        value = !value;
                    }

                    if (device) {
                        device.writeBit(0, value ? 1 : 0);
                    }

                    if (nodeResults[targetNode.id] !== value) {
                        nodeResults[targetNode.id] = value;
                        changed = true;
                    }
                } else {
                    // Other nodes
                    if (nodeResults[targetNode.id] !== sourceResult) {
                        nodeResults[targetNode.id] = sourceResult;
                        changed = true;
                    }
                }
            }
        }
        if (!changed) break;
    }
  }
}
