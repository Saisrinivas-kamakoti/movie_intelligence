import React, { useState, useEffect } from "react";
import "@/App.css";
import axios from "axios";
import Simulator from "@/components/Simulator";
import Dashboard from "@/components/Dashboard";
import Analytics from "@/components/Analytics";
import StudioPitch from "@/components/StudioPitch";
import DirectorSuite from "@/components/DirectorSuite";
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
    <div className="min-h-screen bg-[#0a0e1a]">
      {/* Header */}
      <header className="border-b border-slate-800/60 bg-[#0d1224]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20">
                <span className="text-white font-bold text-lg" data-testid="brand-logo">CS</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">CineSignal</h1>
                <p className="text-[11px] text-slate-500 tracking-wider uppercase">Film Demand Intelligence</p>
              </div>
            </div>
            {platformStats && (
              <div className="hidden md:flex items-center gap-8 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-black text-amber-400" data-testid="stat-movies">{platformStats.total_movies}</div>
                  <div className="text-slate-500 text-[10px] uppercase tracking-wider">Movies</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-emerald-400" data-testid="stat-score">{platformStats.avg_score}</div>
                  <div className="text-slate-500 text-[10px] uppercase tracking-wider">Avg Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-violet-400" data-testid="stat-models">{platformStats.ml_models?.length || 2}</div>
                  <div className="text-slate-500 text-[10px] uppercase tracking-wider">ML Models</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <Navigation activeView={activeView} setActiveView={setActiveView} />

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {activeView === "simulator" && metadata && (
          <Simulator metadata={metadata} API={API} />
        )}
        {activeView === "analytics" && (
          <Analytics API={API} />
        )}
        {activeView === "dashboard" && (
          <Dashboard API={API} />
        )}
        {activeView === "studio" && metadata && (
          <StudioPitch API={API} metadata={metadata} />
        )}
        {activeView === "directors" && (
          <DirectorSuite API={API} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/40 mt-20 py-8 bg-[#080b14]">
        <div className="max-w-[1400px] mx-auto px-6 text-center text-slate-600 text-xs">
          <p>CineSignal v2.0 &middot; AI-powered film demand intelligence for directors, studios, and OTT platforms</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
