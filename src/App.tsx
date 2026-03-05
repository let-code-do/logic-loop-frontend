import React, { useState } from 'react';
import { Header, Footer } from './components/Layout.js';
import { Dashboard } from './components/Dashboard.js';
import { FlowEditor } from './components/FlowEditor.js';
import { Variables } from './components/Variables.js';
import { Hardware } from './components/Hardware.js';
import { EngineProvider } from './context/EngineContext.js';
import type { ViewType } from './types.js';

function App() {
  const [activeView, setActiveView] = useState<ViewType>('flow');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard />;
      case 'flow': return <FlowEditor />;
      case 'variables': return <Variables />;
      case 'hardware': return <Hardware />;
      default: return <FlowEditor />;
    }
  };

  return (
    <EngineProvider>
      <div className="flex flex-col h-screen overflow-hidden bg-background-dark text-slate-300">
        <Header activeView={activeView} onViewChange={setActiveView} />
        <main className="flex-1 overflow-hidden">
          {renderView()}
        </main>
        <Footer />
      </div>
    </EngineProvider>
  );
}

export default App;
