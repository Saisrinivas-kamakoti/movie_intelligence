import React, { useState, useEffect } from "react";
import "@/App.css";
import axios from "axios";
import Simulator from "@/components/Simulator";
import Dashboard from "@/components/Dashboard";
import Analytics from "@/components/Analytics";
import Navigation from "@/components/Navigation";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [activeView, setActiveView] = useState("simulator");
  const [platformStats, setPlatformStats] = useState(null);
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    fetchPlatformData();
  }, []);

  const fetchPlatformData = async () => {
    try {
      const [statsRes, metaRes] = await Promise.all([
        axios.get(`${API}/stats`),
        axios.get(`${API}/metadata`)
      ]);
      setPlatformStats(statsRes.data);
      setMetadata(metaRes.data);
    } catch (error) {
      console.error("Error fetching platform data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CS</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">CineSignal</h1>
                <p className="text-xs text-slate-400">Film Demand Intelligence Platform</p>
              </div>
            </div>
            {platformStats && (
              <div className="hidden md:flex items-center gap-6 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{platformStats.total_movies}</div>
                  <div className="text-slate-400 text-xs">Movies Analyzed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{platformStats.avg_score}</div>
                  <div className="text-slate-400 text-xs">Avg Success Score</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <Navigation activeView={activeView} setActiveView={setActiveView} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeView === "simulator" && metadata && (
          <Simulator metadata={metadata} API={API} />
        )}
        {activeView === "analytics" && (
          <Analytics API={API} />
        )}
        {activeView === "dashboard" && (
          <Dashboard API={API} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-400 text-sm">
          <p>© 2024 CineSignal. AI-powered film demand intelligence for directors, studios, and OTT platforms.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;