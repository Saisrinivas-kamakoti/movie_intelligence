import React, { useState, useEffect } from "react";
import "@/App.css";
import axios from "axios";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/components/AuthContext";
import AuthCallback from "@/components/AuthCallback";
import LoginPage from "@/components/LoginPage";
import Simulator from "@/components/Simulator";
import Dashboard from "@/components/Dashboard";
import Analytics from "@/components/Analytics";
import StudioPitch from "@/components/StudioPitch";
import DirectorSuite from "@/components/DirectorSuite";
import Workspace from "@/components/Workspace";
import Navigation from "@/components/Navigation";
import { LogIn, LogOut, User } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MainApp = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const [activeView, setActiveView] = useState("simulator");
  const [platformStats, setPlatformStats] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const navigate = useNavigate();

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

            <div className="flex items-center gap-6">
              {platformStats && (
                <div className="hidden md:flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="text-xl font-black text-amber-400" data-testid="stat-movies">{platformStats.total_movies}</div>
                    <div className="text-slate-500 text-[10px] uppercase tracking-wider">Movies</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-black text-emerald-400" data-testid="stat-score">{platformStats.avg_score}</div>
                    <div className="text-slate-500 text-[10px] uppercase tracking-wider">Avg Score</div>
                  </div>
                </div>
              )}

              {/* Auth */}
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2">
                    {user.picture ? (
                      <img src={user.picture} alt="" className="w-6 h-6 rounded-full" />
                    ) : (
                      <User size={14} className="text-slate-400" />
                    )}
                    <span className="text-white text-xs font-medium hidden sm:inline" data-testid="user-name">{user.name || user.email}</span>
                  </div>
                  <button onClick={logout} className="text-slate-500 hover:text-red-400 transition-all" data-testid="logout-button" title="Logout">
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <button onClick={() => navigate("/login")} className="flex items-center gap-1.5 bg-amber-500/10 text-amber-400 px-3 py-2 rounded-lg text-xs font-medium border border-amber-500/20 hover:bg-amber-500/20 transition-all" data-testid="login-button">
                  <LogIn size={14} /> Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <Navigation activeView={activeView} setActiveView={setActiveView} isLoggedIn={!!user} />

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {activeView === "simulator" && metadata && <Simulator metadata={metadata} API={API} user={user} />}
        {activeView === "analytics" && <Analytics API={API} />}
        {activeView === "dashboard" && <Dashboard API={API} />}
        {activeView === "studio" && metadata && <StudioPitch API={API} metadata={metadata} />}
        {activeView === "directors" && <DirectorSuite API={API} />}
        {activeView === "workspace" && <Workspace />}
      </main>

      <footer className="border-t border-slate-800/40 mt-20 py-8 bg-[#080b14]">
        <div className="max-w-[1400px] mx-auto px-6 text-center text-slate-600 text-xs">
          <p>CineSignal v2.0 &middot; 700+ movies &middot; 12 languages &middot; Dual ML engines &middot; Built for studios &amp; directors</p>
        </div>
      </footer>
    </div>
  );
};

function AppRouter() {
  const location = useLocation();

  // CRITICAL: Check URL fragment for session_id SYNCHRONOUSLY during render
  if (location.hash?.includes("session_id=")) {
    return <AuthCallback />;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/*" element={<MainApp />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
