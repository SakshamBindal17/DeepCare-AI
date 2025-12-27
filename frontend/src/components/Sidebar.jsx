import React from "react";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Settings,
  Activity,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ isOpen, toggleSidebar, activeView, setActiveView }) => {
  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "call-analysis", icon: MessageSquare, label: "Call Analysis" },
    { id: "history", icon: FileText, label: "History" },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 256 : 80 }}
      className="bg-card border-r border-border flex flex-col z-20 shadow-xl"
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center space-x-2 overflow-hidden whitespace-nowrap"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                DeepCare
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`
              w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden
              ${
                activeView === item.id
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }
              ${!isOpen && "justify-center"}
            `}
          >
            <item.icon
              size={20}
              className={`relative z-10 ${
                activeView === item.id ? "animate-pulse" : ""
              }`}
            />
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="font-medium whitespace-nowrap relative z-10"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Hover Effect Background */}
            {activeView !== item.id && (
              <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className={`flex items-center ${!isOpen && "justify-center"}`}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-background">
            DR
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="ml-3 overflow-hidden whitespace-nowrap"
              >
                <p className="text-sm font-medium text-foreground">Dr. Smith</p>
                <p className="text-xs text-muted-foreground">Cardiology</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
