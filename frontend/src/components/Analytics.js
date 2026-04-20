import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";
import { cinesignalClient } from "@/lib/cinesignalClient";

const Analytics = () => {
  const [genreData, setGenreData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [combinationData, setCombinationData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAnalytics(); }, []);

  const fetchAnalytics = async () => {
    try {
      const [genreRes, trendRes, comboRes] = await Promise.all([
        cinesignalClient.getGenrePerformance(),
        cinesignalClient.getTrends(8),
        cinesignalClient.getGenreCombinations(),
      ]);
      setGenreData(genreRes.data);
      setTrendData(trendRes.data);
      setCombinationData(comboRes.patterns.slice(0, 12));
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-96"><div className="text-white">Loading analytics...</div></div>;

  const chartTooltipStyle = { backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "12px" };

  return (
    <div className="space-y-6" data-testid="analytics-view">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="text-3xl font-black text-white tracking-tight">Genre Performance Analytics</h2>
        <p className="text-slate-500 mt-1 max-w-2xl">A studio-facing read on which genres are holding theatrical weight, which ones overperform on OTT, and where blended concepts become commercially clearer.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Highest theatrical genre", value: genreData[0]?.genre || "Action", hint: `${genreData[0]?.box_office || 0} score`, tone: "text-amber-300" },
          { label: "Best OTT pull", value: [...genreData].sort((a, b) => b.ott - a.ott)[0]?.genre || "Thriller", hint: `${[...genreData].sort((a, b) => b.ott - a.ott)[0]?.ott || 0} OTT score`, tone: "text-fuchsia-300" },
          { label: "Cleanest blend", value: combinationData[0]?.genres?.join(" + ") || "Action + Drama", hint: `${combinationData[0]?.avg_score || 0} combined score`, tone: "text-emerald-300" },
          { label: "Trend signal", value: trendData[trendData.length - 1]?.year || "-", hint: `${trendData[trendData.length - 1]?.avg_score || 0} avg score`, tone: "text-sky-300" },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-800/50 bg-[#111827]/75 p-4 shadow-[0_20px_60px_rgba(2,6,23,0.3)]">
            <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">{card.label}</div>
            <div className={`mt-3 text-xl font-black ${card.tone}`}>{card.value}</div>
            <div className="mt-1 text-xs text-slate-500">{card.hint}</div>
          </div>
        ))}
      </div>

      {/* Genre Performance Bar Chart */}
      <div className="bg-[#111827]/80 rounded-2xl border border-slate-800/40 p-6">
        <h3 className="text-white font-bold mb-5">Genre Success Scores</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={genreData} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="genre" stroke="#64748b" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={chartTooltipStyle} labelStyle={{ color: "#fff" }} />
            <Legend wrapperStyle={{ fontSize: "12px", color: "#94a3b8" }} />
            <Bar dataKey="box_office" fill="#f59e0b" name="Box Office" radius={[3, 3, 0, 0]} />
            <Bar dataKey="ott" fill="#8b5cf6" name="OTT" radius={[3, 3, 0, 0]} />
            <Bar dataKey="combined" fill="#10b981" name="Combined" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Trend Line */}
      <div className="bg-[#111827]/80 rounded-2xl border border-slate-800/40 p-6">
        <h3 className="text-white font-bold mb-5">Success Trend Over Years</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={chartTooltipStyle} labelStyle={{ color: "#fff" }} />
            <Area type="monotone" dataKey="avg_score" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={2} name="Avg Score" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Top Genre Combinations */}
      <div className="bg-[#111827]/80 rounded-2xl border border-slate-800/40 p-6">
        <h3 className="text-white font-bold mb-5">Top Genre Combinations</h3>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {combinationData.map((combo, i) => (
            <div key={i} className="bg-slate-900/50 rounded-lg p-3 flex items-center justify-between border border-slate-800/20">
              <div className="flex items-center gap-2.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i < 3 ? "bg-amber-500 text-black" : "bg-slate-700 text-slate-300"}`}>{i + 1}</div>
                <div>
                  <div className="text-white font-semibold text-xs">{combo.genres.join(" + ")}</div>
                  <div className="text-slate-500 text-[10px]">{combo.count} movies</div>
                </div>
              </div>
              <div className="text-emerald-400 font-black text-sm">{combo.avg_score}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Genre Stats Grid */}
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {genreData.slice(0, 10).map((g, i) => (
          <div key={i} className="bg-[#111827]/80 rounded-xl border border-slate-800/40 p-4">
            <div className="text-white font-bold text-sm mb-2">{g.genre}</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">BO:</span><span className="text-amber-400 font-semibold">{g.box_office}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">OTT:</span><span className="text-violet-400 font-semibold">{g.ott}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">All:</span><span className="text-emerald-400 font-semibold">{g.combined}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
