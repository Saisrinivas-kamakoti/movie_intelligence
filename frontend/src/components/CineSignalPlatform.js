import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/components/AuthContext";
import Navigation from "@/components/Navigation";
import Simulator from "@/components/Simulator";
import Analytics from "@/components/Analytics";
import Dashboard from "@/components/Dashboard";
import StudioPitch from "@/components/StudioPitch";
import DirectorSuite from "@/components/DirectorSuite";
import Workspace from "@/components/Workspace";
import LoginPage from "@/components/LoginPage";
import AuthCallback from "@/components/AuthCallback";
import { Film, LogIn, LogOut, Sparkles, Radar, Clapperboard, Database } from "lucide-react";
import { cinesignalClient } from "@/lib/cinesignalClient";

const MainShell = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useAuth();
  const [activeView, setActiveView] = useState("simulator");
  const [metadata, setMetadata] = useState(null);
  const [stats, setStats] = useState(null);
  const [runtime, setRuntime] = useState(cinesignalClient.getRuntimeProfile());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAppData = async () => {
      try {
        const [metadataRes, statsRes] = await Promise.all([
          cinesignalClient.getMetadata(),
          cinesignalClient.getStats(),
        ]);
        setMetadata(metadataRes);
        setStats(statsRes);
        setRuntime(cinesignalClient.getRuntimeProfile());
      } catch (err) {
        setError(err.message || "Unable to load app metadata.");
      } finally {
        setLoading(false);
      }
    };

    loadAppData();
  }, []);

  const activeViewLabel = useMemo(() => {
    const labels = {
      simulator: "Film concept simulator",
      analytics: "Genre and trend analytics",
      dashboard: "Regional and audience market signals",
      studio: "Studio comparison and pitch builder",
      directors: "Director suite and freeform idea lab",
      workspace: "Saved simulations, notes, and comparisons",
    };
    return labels[activeView] || "Film demand intelligence";
  }, [activeView]);

  if (location.pathname === "/login") {
    return <LoginPage />;
  }

  if (location.hash?.includes("session_id=")) {
    return <AuthCallback />;
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 mx-auto mb-5 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Film size={30} />
          </div>
          <div className="text-xl font-bold">Loading CineSignal...</div>
        </div>
      </div>
    );
  }

  if (!metadata) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-white flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <div className="text-2xl font-black mb-3">CineSignal could not start</div>
          <p className="text-slate-400 mb-5">{error || "CineSignal could not load its runtime metadata. Try refreshing the site."}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-amber-500 text-black font-bold px-5 py-3 rounded-xl"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (activeView) {
      case "analytics":
        return <Analytics />;
      case "dashboard":
        return <Dashboard />;
      case "studio":
        return <StudioPitch metadata={metadata} />;
      case "directors":
        return <DirectorSuite metadata={metadata} />;
      case "workspace":
        return <Workspace />;
      case "simulator":
      default:
        return <Simulator metadata={metadata} user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_24%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_28%),radial-gradient(circle_at_50%_20%,rgba(236,72,153,0.08),transparent_24%),linear-gradient(180deg,#0a0e1a_0%,#09111e_100%)] pointer-events-none" />
      <div className="relative">
        <header className="border-b border-slate-800/50 bg-[#0d1224]/70 backdrop-blur-xl">
          <div className="max-w-[1400px] mx-auto px-4 py-5 sm:px-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Film size={26} />
              </div>
              <div>
                <div className="text-2xl font-black tracking-tight studio-display">CineSignal</div>
                <div className="text-slate-400 text-sm mt-1 max-w-2xl">
                  Decision intelligence for studios, OTT platforms, producers, and new directors building commercially clear stories.
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="px-4 py-2.5 rounded-xl bg-[#111827]/85 border border-slate-800/50">
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Live view</div>
                <div className="text-sm font-semibold text-white">{activeViewLabel}</div>
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-[#111827]/85 border border-slate-800/50">
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Coverage</div>
                <div className="text-sm font-semibold text-amber-400">{stats?.total_movies || 0}+ titles</div>
              </div>
              {user ? (
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/50 text-sm font-semibold"
                >
                  <LogOut size={16} /> Sign out
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black text-sm font-bold shadow-lg shadow-amber-500/20"
                >
                  <LogIn size={16} /> Sign in
                </button>
              )}
            </div>
          </div>

          <div className="max-w-[1400px] mx-auto px-4 pb-6 sm:px-6">
            <div className="grid gap-4 xl:grid-cols-[1.25fr,0.75fr]">
              <div className="rounded-3xl border border-slate-800/50 bg-[#111827]/65 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.45)]">
                <div className="text-[11px] uppercase tracking-[0.24em] text-amber-400 mb-3">Studio-ready predictor</div>
                <h1 className="studio-display text-4xl lg:text-5xl font-black leading-tight tracking-tight max-w-4xl">
                  Forecast genre fit, OTT potential, regional demand, and pitch clarity before the script turns expensive.
                </h1>
                <p className="text-slate-400 mt-4 max-w-3xl leading-7">
                  Build concepts, compare greenlight shapes, test director-style presets, and use the new idea lab to improve story concepts with budget, inspiration, and location guidance.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "Forecast engine", value: "Genre + ROI + OTT fit", icon: Radar, tone: "text-amber-300" },
                    { label: "Director lab", value: "Concept coaching + inspiration", icon: Clapperboard, tone: "text-fuchsia-300" },
                    { label: "Data runtime", value: runtime.mode === "local" ? "Netlify browser mode" : "Hybrid API mode", icon: Database, tone: "text-emerald-300" },
                  ].map(({ label, value, icon: Icon, tone }) => (
                    <div key={label} className="rounded-2xl border border-slate-800/60 bg-slate-950/35 p-4">
                      <Icon size={16} className={tone} />
                      <div className="mt-3 text-[11px] uppercase tracking-[0.22em] text-slate-500">{label}</div>
                      <div className="mt-2 text-sm font-semibold text-white">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800/50 bg-[#111827]/65 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.45)]">
                <div className="flex items-center gap-2 text-violet-300 text-sm font-semibold mb-4">
                  <Sparkles size={16} /> Deployment profile
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Backend</span>
                    <span className="text-white font-semibold">{runtime.backendBase}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Database mode</span>
                    <span className="text-emerald-400 font-semibold">{stats?.database_mode || "runtime"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Auth</span>
                    <span className="text-white font-semibold">{user ? runtime.authMode : "Guest mode available"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Persistence</span>
                    <span className="text-white font-semibold">{runtime.persistence}</span>
                  </div>
                  <div className="text-slate-400 leading-6 pt-2 border-t border-slate-800/60">
                    This release is optimized for Netlify, but the runtime is now wrapped in a client layer so a real API can be added later without replacing the full UI.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <Navigation activeView={activeView} setActiveView={setActiveView} isLoggedIn={Boolean(user)} />

        <main className="max-w-[1400px] mx-auto px-4 py-8 sm:px-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

const CineSignalPlatform = () => (
  <BrowserRouter>
    <AuthProvider>
      <MainShell />
    </AuthProvider>
  </BrowserRouter>
);

export default CineSignalPlatform;
