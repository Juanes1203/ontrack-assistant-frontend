import React from 'react';
import { Home, GraduationCap, MessageSquare, FileText, Users } from 'lucide-react';

export const LeftSidebar: React.FC = () => {
  const navigationItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: GraduationCap, label: 'Classes', href: '/classes', active: true },
    { icon: MessageSquare, label: 'Feedback', href: '/feedback' },
    { icon: FileText, label: 'Documents', href: '/documents' },
    { icon: Users, label: 'Students', href: '/students' },
  ];

  return (
    <div className="w-64 text-white flex flex-col" style={{ backgroundColor: '#27bd2f' }}>
      {/* Logo Section */}
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="font-bold text-xl" style={{ color: '#27bd2f' }}>OT</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">OT Assistant</h1>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    item.active
                      ? 'text-white bg-white/20'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-6">
        <div className="text-center">
          <h3 className="font-bold text-lg mb-1">OnTrack</h3>
          <p className="text-white/80 text-sm">Your Learning Partner</p>
        </div>
      </div>
    </div>
  );
};
