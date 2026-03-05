/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header, Footer } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { FlowEditor } from './components/FlowEditor';
import { Variables } from './components/Variables';
import { Hardware } from './components/Hardware';
import { ViewType } from './types';
import { motion, AnimatePresence } from 'motion/react';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'flow':
        return <FlowEditor />;
      case 'variables':
        return <Variables />;
      case 'hardware':
        return <Hardware />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background-dark overflow-hidden select-none">
      <Header activeView={activeView} onViewChange={setActiveView} />
      
      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="h-full w-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default App;

