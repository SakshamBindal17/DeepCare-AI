import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileAudio,
  Clock,
  AlertTriangle,
  Activity,
  ChevronRight,
} from "lucide-react";
import { getAnalysisHistory } from "../utils/sessionManager";

const History = ({ onSelectAnalysis }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Load history from session
    const loadHistory = () => {
      const data = getAnalysisHistory();
      setHistory(data);
    };

    loadHistory();

    // Refresh every 2 seconds to catch new analyses
    const interval = setInterval(loadHistory, 2000);
    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (level) => {
    switch (level) {
      case "Critical":
        return "bg-red-500 text-white border-red-600";
      case "Moderate":
        return "bg-yellow-500 text-white border-yellow-600";
      case "Low Risk":
        return "bg-green-500 text-white border-green-600";
      default:
        return "bg-gray-500 text-white border-gray-600";
    }
  };

  const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  if (history.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full flex flex-col items-center justify-center text-center p-8"
      >
        <FileAudio
          size={64}
          className="text-muted-foreground opacity-20 mb-4"
        />
        <h2 className="text-2xl font-bold text-foreground mb-2">
          No Analysis History
        </h2>
        <p className="text-muted-foreground max-w-md">
          Upload and analyze your first call recording to see it appear here.
          All analyses from this session will be stored.
        </p>
        <button
          onClick={() => onSelectAnalysis && onSelectAnalysis("call-analysis")}
          className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          Analyze First Call
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Analysis History
          </h1>
          <p className="text-muted-foreground">
            Session history: {history.length} call
            {history.length !== 1 ? "s" : ""} analyzed
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-card/50 backdrop-blur-sm rounded-xl border border-border shadow-sm hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer p-5"
            onClick={() =>
              onSelectAnalysis && onSelectAnalysis("call-analysis", item)
            }
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileAudio size={20} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate text-sm">
                    {item.fileName}
                  </h3>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Clock size={12} className="mr-1" />
                    {formatTimestamp(item.timestamp)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Risk Assessment
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-foreground">
                    {item.riskScore}
                  </span>
                  <span className="text-xs text-muted-foreground">/ 10</span>
                </div>
              </div>

              <div
                className={`px-3 py-1.5 rounded-full border text-xs font-bold ${getRiskColor(
                  item.riskLevel
                )}`}
              >
                {item.riskLevel}
              </div>
            </div>

            {item.riskLevel === "Critical" && (
              <div className="mt-3 flex items-center space-x-1 text-red-600 text-xs">
                <AlertTriangle size={12} />
                <span className="font-medium">
                  Requires immediate attention
                </span>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="text-muted-foreground">View Details</span>
              <ChevronRight size={14} className="text-primary" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default History;
