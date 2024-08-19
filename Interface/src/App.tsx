import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from './components/theme-provider';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TagManagement from './features/TagManagement';
import RealTimeMonitoring from './features/RealTimeMonitoring';
import ProcessControl from './features/ProcessControl';
import FailureSimulation from './features/FailureSimulation';
import TagGrouping from './features/TagGrouping';
import { usePageTitle } from './hooks/usePageTitle';

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  usePageTitle();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="flex flex-col flex-grow">
        <main className="flex-grow p-4 md:p-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<TagManagement />} />
            <Route path="/monitoring" element={<RealTimeMonitoring />} />
            <Route path="/control" element={<ProcessControl />} />
            <Route path="/simulation" element={<FailureSimulation />} />
            <Route path="/grouping" element={<TagGrouping />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;