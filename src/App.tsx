import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Security from "./pages/Security";
import Reports from "./pages/Reports";
import Maintenance from "./pages/Maintenance";
import Quality from "./pages/Quality";
import Users from "./pages/Users";
import Data from "./pages/Data";
import SystemSettings from "./pages/SystemSettings";
import Alerts from "./pages/Alerts";
import PLCDashboard from "./pages/PLCDashboard";
import EdgeEnergyDashboard from "./pages/EdgeEnergyDashboard";
import DataStreamDashboard from "./pages/DataStreamDashboard";
import TimeSeriesAnalyticsPage from "./pages/TimeSeriesAnalytics";

import './App.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 dakika
      gcTime: 1000 * 60 * 10, // 10 dakika (React Query v5'te cacheTime yerine gcTime)
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Main Module Pages */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/plc-dashboard" element={<PLCDashboard />} />
            <Route path="/edge-energy" element={<EdgeEnergyDashboard />} />
            <Route path="/data-stream" element={<DataStreamDashboard />} />
            <Route path="/time-series" element={<TimeSeriesAnalyticsPage />} />
            
            {/* Profile Pages */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/security" element={<Security />} />
            
            {/* Management Panel Pages */}
            <Route path="/reports" element={<Reports />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/quality" element={<Quality />} />
            <Route path="/users" element={<Users />} />
            <Route path="/data" element={<Data />} />
            <Route path="/system-settings" element={<SystemSettings />} />
            
            {/* HTML file routes for backward compatibility */}
            <Route path="/alerts.html" element={<Alerts />} />
            <Route path="/profile.html" element={<Profile />} />
            <Route path="/settings.html" element={<Settings />} />
            <Route path="/security.html" element={<Security />} />
            <Route path="/reports.html" element={<Reports />} />
            <Route path="/maintenance.html" element={<Maintenance />} />
            <Route path="/quality.html" element={<Quality />} />
            <Route path="/users.html" element={<Users />} />
            <Route path="/data.html" element={<Data />} />
            <Route path="/system-settings.html" element={<SystemSettings />} />
            
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
