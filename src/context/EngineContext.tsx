import React, { createContext, useContext, useMemo } from 'react';
import { ScanLoopManager } from '../ScanLoopManager.js';
import { IOState } from '../IOState.js';
import { ExternalIO } from '../ExternalIO.js';
import { Logger } from '../Logger.js';
import { DeviceMemory } from '../DeviceMemory.js';

interface EngineContextType {
  scanLoop: ScanLoopManager;
  ioState: IOState;
  externalIO: ExternalIO;
  logger: Logger;
}

const EngineContext = createContext<EngineContextType | null>(null);

export const EngineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const engine = useMemo(() => {
    const ioState = new IOState();
    const externalIO = new ExternalIO();
    const scanLoop = new ScanLoopManager();
    const logger = new Logger();

    // Initialize with some test memory
    ioState.inputs['START_PB'] = new DeviceMemory('System', 'Node_01', 'Input', 'START_PB', 'B', 0, 1);
    ioState.inputs['STOP_PB'] = new DeviceMemory('System', 'Node_01', 'Input', 'STOP_PB', 'B', 1, 1);
    ioState.outputs['MOTOR_01'] = new DeviceMemory('System', 'Node_01', 'Output', 'MOTOR_01', 'B', 0, 1);
    ioState.internal['M100'] = new DeviceMemory('System', 'Node_01', 'Internal', 'M100', 'B', 100, 1);

    return { scanLoop, ioState, externalIO, logger };
  }, []);

  return (
    <EngineContext.Provider value={engine}>
      {children}
    </EngineContext.Provider>
  );
};

export const useEngine = () => {
  const context = useContext(EngineContext);
  if (!context) {
    throw new Error('useEngine must be used within an EngineProvider');
  }
  return context;
};
