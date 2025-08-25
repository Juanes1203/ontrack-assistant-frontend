import React, { useState, useEffect } from 'react';
import { LeftSidebar } from './LeftSidebar';
import { TopBar } from './TopBar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    // Get initial state from localStorage, default to expanded
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [showShortcutHint, setShowShortcutHint] = useState(false);

  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
  };

  // Update localStorage when state changes
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  // Keyboard shortcut support (Ctrl/Cmd + B)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault();
        toggleSidebar();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarCollapsed]);

  // Show shortcut hint on first visit
  useEffect(() => {
    const hasSeenHint = localStorage.getItem('sidebar-shortcut-hint');
    if (!hasSeenHint) {
      setShowShortcutHint(true);
      setTimeout(() => setShowShortcutHint(false), 5000);
      localStorage.setItem('sidebar-shortcut-hint', 'true');
    }
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#27bd2f' }}>
      <div className="flex h-screen">
        {/* Left Sidebar - Green */}
        <LeftSidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggle={toggleSidebar} 
        />
        
        {/* Main Content Area - White with smooth rounded transition */}
        <div className={`flex-1 flex flex-col bg-white rounded-l-[3rem] overflow-hidden transition-all duration-300 ${
          isSidebarCollapsed ? 'ml-0' : ''
        }`}>
          {/* Top Bar */}
          <TopBar />
          
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
      
      {/* Keyboard Shortcut Hint */}
      {showShortcutHint && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-3 rounded-lg text-sm shadow-lg transform transition-all duration-300 animate-in slide-in-from-bottom-2">
          <div className="flex items-center space-x-2">
            <span>💡 Atajo de teclado:</span>
            <kbd className="bg-gray-700 px-2 py-1 rounded text-xs font-mono">⌘</kbd> + <kbd className="bg-gray-700 px-2 py-1 rounded text-xs font-mono">B</kbd>
          </div>
          <p className="text-gray-300 text-xs mt-1">para alternar el sidebar</p>
        </div>
      )}
    </div>
  );
};
