import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import TimeSeriesAnalytics from '@/components/TimeSeriesAnalytics';
import BackToHomeButton from '@/components/BackToHomeButton';

const TimeSeriesAnalyticsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <BackToHomeButton />
            </div>
            <TimeSeriesAnalytics />
          </div>
        </main>
      </div>
    </div>
  );
};

export default TimeSeriesAnalyticsPage; 