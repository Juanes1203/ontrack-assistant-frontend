import React from 'react';
import { MainLayout } from '@/components/Layout';
import { ClassSchedule } from '@/components/ClassManagement/ClassSchedule';
import { VoiceAssistant } from '@/components/Layout/VoiceAssistant';

const Index = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Class Management
          </h1>
          <p className="text-gray-600">
            Manage your classes, schedules, and student information
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Class Schedule - Takes 2/3 of the space */}
          <div className="lg:col-span-2">
            <ClassSchedule />
          </div>
          
          {/* Voice Assistant - Takes 1/3 of the space */}
          <div className="lg:col-span-1">
            <VoiceAssistant />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
