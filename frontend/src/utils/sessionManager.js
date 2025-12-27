// Session Storage Manager for DeepCare AI
// Data persists across page reloads but clears on browser close

const SESSION_KEYS = {
  ANALYSIS_HISTORY: "deepcare_analysis_history",
  ACTIVE_TAB: "deepcare_active_tab",
  SIDEBAR_STATE: "deepcare_sidebar_open",
};

// Analysis History Management
export const saveAnalysisToSession = (analysisData) => {
  try {
    const history = getAnalysisHistory();
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      fileName: analysisData.fileName,
      riskScore: analysisData.risk_analysis?.score || 0,
      riskLevel: analysisData.risk_analysis?.level || "Unknown",
      data: analysisData,
    };

    history.unshift(newEntry); // Add to beginning
    sessionStorage.setItem(
      SESSION_KEYS.ANALYSIS_HISTORY,
      JSON.stringify(history)
    );
    return newEntry;
  } catch (error) {
    console.error("Error saving analysis to session:", error);
    return null;
  }
};

export const getAnalysisHistory = () => {
  try {
    const stored = sessionStorage.getItem(SESSION_KEYS.ANALYSIS_HISTORY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error getting analysis history:", error);
    return [];
  }
};

export const getAnalysisById = (id) => {
  const history = getAnalysisHistory();
  return history.find((item) => item.id === id);
};

export const clearAnalysisHistory = () => {
  sessionStorage.removeItem(SESSION_KEYS.ANALYSIS_HISTORY);
};

// Active Tab Management
export const setActiveTab = (tabId) => {
  sessionStorage.setItem(SESSION_KEYS.ACTIVE_TAB, tabId);
};

export const getActiveTab = () => {
  return sessionStorage.getItem(SESSION_KEYS.ACTIVE_TAB) || "dashboard";
};

// Sidebar State Management
export const setSidebarState = (isOpen) => {
  sessionStorage.setItem(SESSION_KEYS.SIDEBAR_STATE, isOpen.toString());
};

export const getSidebarState = () => {
  const stored = sessionStorage.getItem(SESSION_KEYS.SIDEBAR_STATE);
  return stored === null ? true : stored === "true";
};

// Get session statistics
export const getSessionStats = () => {
  const history = getAnalysisHistory();
  return {
    totalCalls: history.length,
    criticalCalls: history.filter((h) => h.riskLevel === "Critical").length,
    moderateCalls: history.filter((h) => h.riskLevel === "Moderate").length,
    lowRiskCalls: history.filter((h) => h.riskLevel === "Low Risk").length,
  };
};
