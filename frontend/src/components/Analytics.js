import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

const Analytics = ({ API }) => {
  const [genreData, setGenreData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [combinationData, setCombinationData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [genreRes, trendRes, comboRes] = await Promise.all([
        axios.get(`${API}/analytics/genre-performance`),
        axios.get(`${API}/analytics/trends?years=5`),
        axios.get(`${API}/analytics/genre-combinations`)
      ]);

      setGenreData(genreRes.data.data);
      setTrendData(trendRes.data.data);
      setCombinationData(comboRes.data.patterns.slice(0, 10)); // Top 10
      setLoading(false);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-white text-xl">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8" data-testid="analytics-view">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Genre Performance Analytics</h2>
        <p className="text-slate-400">Comprehensive analysis of genre performance across markets</p>
      </div>

      {/* Genre Performance Chart */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
        <h3 className="text-xl font-bold text-white mb-6">Genre Success Scores</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={genreData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="genre" stroke="#94a3b8" angle={-45} textAnchor="end" height={100} />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
              labelStyle={{ color: "#fff" }}
            />
            <Legend wrapperStyle={{ color: "#94a3b8" }} />
            <Bar dataKey="box_office" fill="#3b82f6" name="Box Office" />
            <Bar dataKey="ott" fill="#8b5cf6" name="OTT" />
            <Bar dataKey="combined" fill="#10b981" name="Combined" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Trend Analysis */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
        <h3 className="text-xl font-bold text-white mb-6">Success Trend Over Years</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="year" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
              labelStyle={{ color: "#fff" }}
            />
            <Legend wrapperStyle={{ color: "#94a3b8" }} />
            <Line type="monotone" dataKey="avg_score" stroke="#3b82f6" strokeWidth={3} name="Average Success Score" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Genre Combinations */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
        <h3 className="text-xl font-bold text-white mb-6">🎯 Top Genre Combinations</h3>
        <div className="space-y-3">
          {combinationData.map((combo, index) => (
            <div key={index} className="bg-slate-800/50 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div>
                  <div className="text-white font-semibold">{combo.genres.join(" + ")}</div>
                  <div className="text-slate-400 text-sm">{combo.count} movies analyzed</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">{combo.avg_score}</div>
                <div className="text-slate-400 text-xs">Avg Score</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Genre Stats Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {genreData.slice(0, 6).map((genre, index) => (
          <div key={index} className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="text-lg font-bold text-white mb-2">{genre.genre}</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Box Office:</span>
                <span className="text-blue-400 font-semibold">{genre.box_office}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">OTT:</span>
                <span className="text-purple-400 font-semibold">{genre.ott}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Combined:</span>
                <span className="text-green-400 font-semibold">{genre.combined}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Movies:</span>
                <span className="text-slate-300 font-semibold">{genre.count}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;