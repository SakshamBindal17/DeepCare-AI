import React, { useState, useEffect } from "react";
import {
  FileAudio,
  FileText,
  AlertTriangle,
  ArrowRight,
  Clock,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { getSessionStats, getAnalysisHistory } from "../utils/sessionManager";

const Dashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    totalCalls: 0,
    criticalCalls: 0,
    moderateCalls: 0,
    lowRiskCalls: 0,
  });
  const [recentCalls, setRecentCalls] = useState([]);

  useEffect(() => {
    // Load session statistics
    const loadStats = () => {
      const sessionStats = getSessionStats();
      setStats(sessionStats);

      const history = getAnalysisHistory();
      setRecentCalls(history.slice(0, 5)); // Show last 5
    };

    loadStats();

    // Refresh every 2 seconds
    const interval = setInterval(loadStats, 2000);
    return () => clearInterval(interval);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const getRiskColor = (level) => {
    switch (level) {
      case "Critical":
        return "text-red-600 bg-red-50 border-red-200";
      case "Moderate":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Low Risk":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    return `${Math.floor(diffMins / 60)} hours ago`;
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <motion.h1
          variants={item}
          className="text-2xl font-bold text-foreground"
        >
          Dashboard Overview
        </motion.h1>
        <motion.button
          variants={item}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate("call-analysis")}
          className="px-4 py-2 bg-gradient-to-r from-primary to-purple-600 text-primary-foreground rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all font-medium flex items-center space-x-2"
        >
          <span>Analyze New Call</span>
          <ArrowRight size={16} />
        </motion.button>
      </div>

      {/* Session Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          variants={item}
          className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <FileAudio size={24} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            {stats.totalCalls}
          </h3>
          <p className="text-sm text-muted-foreground">Calls Analyzed</p>
        </motion.div>

        <motion.div
          variants={item}
          className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-lg">
              <AlertTriangle size={24} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            {stats.criticalCalls}
          </h3>
          <p className="text-sm text-muted-foreground">Critical Alerts</p>
        </motion.div>

        <motion.div
          variants={item}
          className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
              <FileText size={24} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            {stats.moderateCalls}
          </h3>
          <p className="text-sm text-muted-foreground">Moderate Risk</p>
        </motion.div>

        <motion.div
          variants={item}
          className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <FileText size={24} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            {stats.lowRiskCalls}
          </h3>
          <p className="text-sm text-muted-foreground">Low Risk</p>
        </motion.div>
      </div>

      {/* Recent Analyses */}
      <motion.div
        variants={item}
        className="bg-card/50 backdrop-blur-sm rounded-xl border border-border shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Recent Analysis
          </h2>
          <button
            onClick={() => onNavigate("history")}
            className="text-sm text-primary hover:underline"
          >
            View All
          </button>
        </div>

        {recentCalls.length === 0 ? (
          <div className="p-12 text-center">
            <FileAudio
              size={48}
              className="mx-auto text-muted-foreground opacity-20 mb-4"
            />
            <p className="text-muted-foreground mb-4">
              No calls analyzed yet this session
            </p>
            <button
              onClick={() => onNavigate("call-analysis")}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Analyze Your First Call
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentCalls.map((call) => (
              <div
                key={call.id}
                onClick={() => {
                  onNavigate("call-analysis", call);
                }}
                className="p-4 hover:bg-accent/50 transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <FileAudio size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">
                      {call.fileName}
                    </h4>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Clock size={12} className="mr-1" />
                      {formatTimestamp(call.timestamp)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 flex-shrink-0">
                  <div className="text-right mr-2">
                    <div className="text-lg font-bold text-foreground">
                      {call.riskScore}
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded-full border ${getRiskColor(
                        call.riskLevel
                      )}`}
                    >
                      {call.riskLevel}
                    </div>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-muted-foreground group-hover:text-primary transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
