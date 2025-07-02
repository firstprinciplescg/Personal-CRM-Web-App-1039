import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import ContactDetail from './pages/ContactDetail';
import Interactions from './pages/Interactions';
import Analytics from './pages/Analytics';
import { ContactProvider } from './context/ContactContext';
import './index.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ContactProvider>
      <Router>
        <div className="flex h-screen bg-gray-50">
          <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-1 overflow-x-hidden overflow-y-auto">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/contacts/:id" element={<ContactDetail />} />
                  <Route path="/interactions" element={<Interactions />} />
                  <Route path="/analytics" element={<Analytics />} />
                </Routes>
              </AnimatePresence>
            </main>
          </div>
        </div>
      </Router>
    </ContactProvider>
  );
}

export default App;