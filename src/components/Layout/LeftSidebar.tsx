import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, GraduationCap, MessageSquare, FileText, Users, BarChart3 } from 'lucide-react';

export const LeftSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { icon: Home, label: 'Inicio', href: '/' },
    { icon: GraduationCap, label: 'Clases', href: '/classes' },
    { icon: BarChart3, label: 'Análisis', href: '/analytics' },
    { icon: MessageSquare, label: 'Feedback', href: '/feedback' },
    { icon: FileText, label: 'Documentos', href: '/documents' },
    { icon: Users, label: 'Estudiantes', href: '/students' },
  ];

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    if (href === '/classes') {
      return location.pathname === '/classes';
    }
    if (href === '/analytics') {
      return location.pathname === '/analytics';
    }
    if (href === '/documents') {
      return location.pathname === '/documents';
    }
    return location.pathname.startsWith(href);
  };

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
            const active = isActive(item.href);
            return (
              <li key={item.label}>
                <button
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    active
                      ? 'text-white bg-white/20'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
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
