import React from "react";
import { Film, BarChart3, Globe, Briefcase, Users, FolderOpen } from "lucide-react";

const Navigation = ({ activeView, setActiveView, isLoggedIn }) => {
  const navItems = [
    { id: "simulator", label: "Simulator", icon: Film },
    { id: "analytics", label: "Genre Analytics", icon: BarChart3 },
    { id: "dashboard", label: "Market Insights", icon: Globe },
    { id: "studio", label: "Studio Pitch", icon: Briefcase },
    { id: "directors", label: "Director Suite", icon: Users },
    { id: "workspace", label: isLoggedIn ? "My Workspace" : "Workspace", icon: FolderOpen },
  ];

  return (
    <nav className="border-b border-slate-800/40 bg-[#0d1224]/50 backdrop-blur-sm">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all relative whitespace-nowrap ${
                  activeView === item.id
                    ? "text-amber-400"
                    : "text-slate-500 hover:text-slate-300"
                }`}
                data-testid={`nav-${item.id}`}
              >
                <Icon size={16} />
                {item.label}
                {activeView === item.id && (
                  <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
