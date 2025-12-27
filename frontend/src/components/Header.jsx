import React from "react";
import { Activity } from "lucide-react";

const Header = () => {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            DeepCare AI
          </h1>
          <p className="text-xs text-muted-foreground">
            Clinical Safety Assistant
          </p>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="font-medium">Session Active</span>
      </div>
    </header>
  );
};

export default Header;
