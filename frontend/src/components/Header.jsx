import React from 'react';
import { Bell, Search, Mic } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center flex-1">
        <div className="relative w-96">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search size={18} />
          </span>
          <input 
            type="text" 
            placeholder="Search patients, transcripts, or reports..." 
            className="w-full pl-10 pr-4 py-2 rounded-full bg-accent/50 border-none focus:ring-2 focus:ring-primary/20 focus:outline-none text-sm"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium animate-pulse">
          <Mic size={16} />
          <span>Recording Active</span>
        </button>

        <button className="relative p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-card"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
