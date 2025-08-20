import React from 'react';
import { LeftSidebar } from './LeftSidebar';
import { TopBar } from './TopBar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#27bd2f' }}>
      <div className="flex h-screen">
        {/* Left Sidebar - Green */}
        <LeftSidebar />
        
        {/* Main Content Area - White with smooth rounded transition */}
        <div className="flex-1 flex flex-col bg-white rounded-l-[3rem] shadow-2xl overflow-hidden">
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
    </div>
  );
};
