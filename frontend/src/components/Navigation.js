import React from "react";

const Navigation = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: "simulator", label: "Interactive Simulator", icon: "🎬" },
    { id: "analytics", label: "Genre Analytics", icon: "📊" },
    { id: "dashboard", label: "Market Insights", icon: "🌍" }
  ];

  return (
    <nav className="border-b border-slate-800 bg-slate-900/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`px-6 py-4 font-medium transition-all relative ${
                activeView === item.id
                  ? "text-blue-400 bg-slate-900/50"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/30"
              }`}
              data-testid={`nav-${item.id}`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
              {activeView === item.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600" />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;