import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { Input } from '@/components/ui/input';

export const TopBar: React.FC = () => {
  return (
    <div className="bg-white px-6 py-4 rounded-tl-[3rem]">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-md ml-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar Clases"
              className="pl-10 bg-gray-100 border-gray-300 focus:bg-white focus:border-gray-400 placeholder:text-gray-700"
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
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" 
                alt="User Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
