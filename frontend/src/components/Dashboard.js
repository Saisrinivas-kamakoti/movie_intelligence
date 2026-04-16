import React, { useState, useEffect } from "react";
import axios from "axios";
import { Globe, Target, Trophy, TrendingUp } from "lucide-react";

const Dashboard = ({ API }) => {
  const [regionalData, setRegionalData] = useState([]);
  const [audienceData, setAudienceData] = useState(null);
  const [topMovies, setTopMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const [regionalRes, audienceRes, moviesRes] = await Promise.all([
        axios.get(`${API}/analytics/regional`),
        axios.get(`${API}/analytics/audience`),
        axios.get(`${API}/movies/top?limit=10&metric=combined`)
      ]);
      setRegionalData(regionalRes.data.data);
      setAudienceData(audienceRes.data.segments);
      setTopMovies(moviesRes.data.top_movies);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-96"><div className="text-white">Loading insights...</div></div>;

  return (
    <div className="space-y-6" data-testid="dashboard-view">
      <div>
        <h2 className="text-3xl font-black text-white tracking-tight">Market Intelligence</h2>
        <p className="text-slate-500 mt-1">Regional analysis, audience segments & top performers</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Regions", value: regionalData.length, color: "text-amber-400", icon: Globe },
          { label: "Segments", value: audienceData ? Object.keys(audienceData).length : 0, color: "text-violet-400", icon: Target },
          { label: "Top Score", value: topMovies[0]?.combined_score || 0, color: "text-emerald-400", icon: TrendingUp },
          { label: "Best BO", value: topMovies.length > 0 ? `${Math.max(...topMovies.map(m => m.box_office_cr))}Cr` : "N/A", color: "text-sky-400", icon: Trophy }
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="bg-[#111827]/80 rounded-xl border border-slate-800/40 p-4">
            <Icon size={16} className={`${color} mb-2`} />
            <div className={`text-2xl font-black ${color}`}>{value}</div>
            <div className="text-slate-500 text-[10px] uppercase tracking-wider">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Regional Performance */}
        <div className="bg-[#111827]/80 rounded-2xl border border-slate-800/40 p-5">
          <h3 className="text-white font-bold text-sm flex items-center gap-2 mb-4">
            <Globe size={15} className="text-amber-400" /> Regional Market Performance
          </h3>
          <div className="space-y-3">
            {regionalData.map((region, i) => (
              <div key={i} className="bg-slate-900/40 rounded-lg p-3 border border-slate-800/20">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-white font-semibold text-sm">{region.region}</span>
                  <span className="text-amber-400 font-black text-lg">{region.avg_score}</span>
                </div>
                <div className="w-full bg-slate-800/60 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" style={{ width: `${region.avg_score}%` }} />
                </div>
                <div className="mt-1.5 text-[10px] text-slate-500">
                  Top: {Object.keys(region.genres).slice(0, 3).join(", ")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audience Segments */}
        <div className="bg-[#111827]/80 rounded-2xl border border-slate-800/40 p-5">
          <h3 className="text-white font-bold text-sm flex items-center gap-2 mb-4">
            <Target size={15} className="text-violet-400" /> Audience Preferences
          </h3>
          {audienceData && (
            <div className="space-y-3">
              {Object.entries(audienceData).map(([segment, genres]) => (
                <div key={segment} className="bg-slate-900/40 rounded-lg p-3 border border-slate-800/20">
                  <div className="text-white font-semibold text-sm mb-2 capitalize">{segment}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {genres.map((g, i) => (
                      <span key={i} className="px-2.5 py-1 bg-violet-500/10 border border-violet-500/20 rounded text-violet-300 text-xs font-medium">{g}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Movies Table */}
      <div className="bg-[#111827]/80 rounded-2xl border border-slate-800/40 p-5">
        <h3 className="text-white font-bold text-sm flex items-center gap-2 mb-4">
          <Trophy size={15} className="text-emerald-400" /> Top Performing Movies
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/40">
                {["#", "Title", "Genres", "Language", "Region", "Box Office", "Score"].map(h => (
                  <th key={h} className="text-left text-slate-500 text-[10px] font-semibold p-2.5 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topMovies.map((movie, i) => (
                <tr key={movie.id} className="border-b border-slate-800/20 hover:bg-slate-800/10 transition-colors">
                  <td className="p-2.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i < 3 ? "bg-amber-500 text-black" : "bg-slate-800 text-slate-400"}`}>{i + 1}</div>
                  </td>
                  <td className="p-2.5 text-white font-semibold text-sm">{movie.title}</td>
                  <td className="p-2.5 text-slate-400 text-xs">{movie.genres.slice(0, 2).join(", ")}</td>
                  <td className="p-2.5 text-slate-400 text-xs">{movie.language}</td>
                  <td className="p-2.5 text-slate-400 text-xs">{movie.region}</td>
                  <td className="p-2.5 text-amber-400 font-semibold text-sm">{movie.box_office_cr}Cr</td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/30 rounded text-emerald-400 font-bold text-xs">{movie.combined_score}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
