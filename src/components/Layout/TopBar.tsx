import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { Input } from '@/components/ui/input';

export const TopBar: React.FC = () => {
  return (
    <div className="bg-white px-6 py-4 rounded-tl-[3rem]">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search Classes"
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
              style={{ 
                '--tw-ring-color': '#27bd2f',
                '--tw-border-opacity': '1',
                'border-color': 'rgb(39 189 47 / var(--tw-border-opacity))'
              } as React.CSSProperties}
            />
          </div>
        </div>

        {/* User Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <Bell className="w-5 h-5" />
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <span className="text-gray-700 font-medium">John Doe</span>
          </div>
        </div>
      </div>
    </div>
  );
};
