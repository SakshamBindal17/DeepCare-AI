import React from 'react';
import { Play, FileText, AlertTriangle, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = ({ onNavigate }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <motion.h1 variants={item} className="text-2xl font-bold text-foreground">Dashboard Overview</motion.h1>
        <motion.button 
          variants={item}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate('call-analysis')}
          className="px-4 py-2 bg-gradient-to-r from-primary to-purple-600 text-primary-foreground rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all font-medium flex items-center space-x-2"
        >
          <span>Analyze New Call</span>
          <ArrowRight size={16} />
        </motion.button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={item} className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <FileText size={24} />
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
          </div>
          <h3 className="text-2xl font-bold text-foreground">24</h3>
          <p className="text-sm text-muted-foreground">Consultations this week</p>
        </motion.div>

        <motion.div variants={item} className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-lg">
              <AlertTriangle size={24} />
            </div>
            <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">High Priority</span>
          </div>
          <h3 className="text-2xl font-bold text-foreground">3</h3>
          <p className="text-sm text-muted-foreground">Critical Risk Alerts</p>
        </motion.div>

        <motion.div variants={item} className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <CheckCircle size={24} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-foreground">98%</h3>
          <p className="text-sm text-muted-foreground">Transcription Accuracy</p>
        </motion.div>
      </div>

      {/* Recent Activity & Live View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Consultations */}
        <motion.div variants={item} className="lg:col-span-2 bg-card/50 backdrop-blur-sm rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Recent Consultations</h2>
            <button className="text-sm text-primary hover:underline">View All</button>
          </div>
          <div className="divide-y divide-border">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 hover:bg-accent/50 transition-colors flex items-center justify-between group cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 font-medium">
                    PT
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Patient #CAR000{i}</h4>
                    <p className="text-sm text-muted-foreground">Cardiology Follow-up</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock size={14} className="mr-1" />
                    <span>2 hours ago</span>
                  </div>
                  <button className="p-2 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <Play size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions / System Status */}
        <motion.div variants={item} className="bg-card/50 backdrop-blur-sm rounded-xl border border-border shadow-sm p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg border border-transparent hover:border-border transition-colors">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-75"></div>
                </div>
                <span className="text-sm font-medium">Deepgram API</span>
              </div>
              <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">Operational</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg border border-transparent hover:border-border transition-colors">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-75"></div>
                </div>
                <span className="text-sm font-medium">Risk Engine</span>
              </div>
              <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">Operational</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg border border-transparent hover:border-border transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">FAERS Database</span>
              </div>
              <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">Connected</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 text-sm font-medium text-center border border-border rounded-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200">
                Upload Audio
              </button>
              <button className="p-3 text-sm font-medium text-center border border-border rounded-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200">
                View Reports
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
