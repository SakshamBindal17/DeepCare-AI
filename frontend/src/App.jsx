import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import CallAnalysis from "./components/CallAnalysis";
import History from "./components/History";
import {
  getActiveTab,
  setActiveTab,
  getSidebarState,
  setSidebarState,
} from "./utils/sessionManager";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  // Load session state on mount
  useEffect(() => {
    const savedTab = getActiveTab();
    const savedSidebarState = getSidebarState();
    setActiveView(savedTab);
    setSidebarOpen(savedSidebarState);
  }, []);

  // Save state on change
  const handleViewChange = (view) => {
    setActiveView(view);
    setActiveTab(view);
    setSelectedAnalysis(null); // Clear selected analysis when changing views
  };

  const handleSidebarToggle = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    setSidebarState(newState);
  };

  const handleSelectAnalysis = (view, analysisData) => {
    setActiveView(view);
    setActiveTab(view);
    setSelectedAnalysis(analysisData);
  };

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard onNavigate={handleSelectAnalysis} />;
      case "call-analysis":
        return <CallAnalysis preloadedAnalysis={selectedAnalysis} />;
      case "history":
        return <History onSelectAnalysis={handleSelectAnalysis} />;
      default:
        return <Dashboard onNavigate={handleSelectAnalysis} />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans text-foreground">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={handleSidebarToggle}
        activeView={activeView}
        setActiveView={handleViewChange}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Header />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background/50 p-6 relative">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[100px]" />
          </div>

          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
