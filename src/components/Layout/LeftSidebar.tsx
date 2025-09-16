import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, GraduationCap, MessageSquare, FileText, Users, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import logoSuperior from '../../assets/LogoSuperiorR.png';
import logoInferior from '../../assets/LogoInferior.png';

interface LeftSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { icon: Home, label: 'Inicio', href: '/' },
    { icon: GraduationCap, label: 'Clases', href: '/classes' },
    { icon: BarChart3, label: 'Análisis', href: '/analytics' },
    { icon: MessageSquare, label: 'Feedback', href: '/feedback' },
    { icon: FileText, label: 'Centro de Conocimiento', href: '/documents' },
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
    if (href === '/feedback') {
      return location.pathname === '/feedback';
    }
    if (href === '/documents') {
      return location.pathname === '/documents';
    }
    if (href === '/students') {
      return location.pathname === '/students';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div 
      className={`relative text-white flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-68'
      }`} 
      style={{ backgroundColor: '#27bd2f', border: 'none', outline: 'none' }}
    >

      
      {/* Toggle Button - Elegant and non-intrusive */}
      <button
        onClick={onToggle}
        className="absolute -right-2.5 top-20 w-5 h-5 bg-white/85 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-md border border-white/30 hover:border-white/50 z-10 group"
        style={{ color: '#27bd2f' }}
        title={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
      >
        <div className="relative">
          {isCollapsed ? (
            <ChevronRight className="w-2.5 h-2.5 transition-all duration-200 group-hover:text-green-600" />
          ) : (
            <ChevronLeft className="w-2.5 h-2.5 transition-all duration-200 group-hover:text-green-600" />
          )}
        </div>
        
        {/* Subtle inner glow on hover */}
        <div className="absolute inset-0 rounded-full bg-green-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
      </button>

      {/* Logo Section */}
      <div className={`pt-1 pb-4 transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-6'}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className={`${isCollapsed ? 'w-12 h-12' : 'w-48 h-48'} flex items-center justify-center flex-shrink-0 transition-all duration-300`}>
            <img 
              src={logoSuperior} 
              alt="Logo Superior" 
              className="w-full h-full object-contain"
            />
          </div>

        </div>
      </div>

      {/* Navigation Menu */}
      <nav className={`flex-1 transition-all duration-300 ${isCollapsed ? 'px-2 pt-4' : 'p-4 pt-4'}`}>
        <ul className="space-y-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <li key={item.label}>
                <button
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full flex items-center transition-all duration-200 rounded-lg group relative ${
                    isCollapsed 
                      ? 'justify-center px-2 py-3' 
                      : 'space-x-3 px-4 py-3'
                  }                   ${
                    active
                      ? 'text-white bg-white/20'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="text-sm font-semibold whitespace-nowrap overflow-hidden">
                      {item.label}
                    </span>
                  )}
                  
                  {/* Hover Tooltip for Collapsed State */}
                  {isCollapsed && (
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-20 whitespace-nowrap shadow-lg">
                      {item.label}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -ml-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className={`pt-4 pb-4 transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-6'}`}>
        <div className={`text-center ${isCollapsed ? 'space-y-2' : ''}`}>
          {!isCollapsed && (
            <>
              <div className="mb-2">
                <img 
                  src={logoInferior} 
                  alt="Logo Inferior" 
                  className="h-6 mx-auto object-contain"
                />
              </div>
              <p className="text-white/80 text-sm">Your Learning Partner</p>
            </>
          )}
          {isCollapsed && (
            <div className="w-6 h-6 flex items-center justify-center">
              <img 
                src={logoInferior} 
                alt="Logo Inferior" 
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
