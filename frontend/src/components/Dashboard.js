import React, { useState, useEffect } from "react";
import axios from "axios";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from "recharts";

const Dashboard = ({ API }) => {
  const [regionalData, setRegionalData] = useState([]);
  const [audienceData, setAudienceData] = useState(null);
  const [topMovies, setTopMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-white text-xl">Loading market insights...</div>
      </div>
    );
  }

  const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="space-y-8" data-testid="dashboard-view">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Market Intelligence Dashboard</h2>
        <p className="text-slate-400">Regional analysis, audience insights, and top performers</p>
      </div>

      {/* Regional Performance */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
          <h3 className="text-xl font-bold text-white mb-6">🌍 Regional Market Performance</h3>
          <div className="space-y-4">
            {regionalData.map((region, index) => (
              <div key={index} className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-semibold">{region.region}</span>
                  <span className="text-blue-400 font-bold text-xl">{region.avg_score}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                    style={{ width: `${region.avg_score}%` }}
                  />
                </div>
                <div className="mt-2 text-xs text-slate-400">
                  Top genres: {Object.keys(region.genres).slice(0, 3).join(", ")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audience Segments */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
          <h3 className="text-xl font-bold text-white mb-6">🎯 Audience Segment Preferences</h3>
          {audienceData && (
            <div className="space-y-4">
              {Object.entries(audienceData).map(([segment, genres], index) => (
                <div key={segment} className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-white font-semibold mb-2 capitalize">{segment}</div>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre, gIndex) => (
                      <span
                        key={gIndex}
                        className="px-3 py-1 bg-gradient-to-r from-blue-600/30 to-purple-600/30 border border-blue-500/30 rounded-full text-blue-300 text-xs font-medium"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Performing Movies */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
        <h3 className="text-xl font-bold text-white mb-6">🏆 Top Performing Movies</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-400 font-semibold p-3">Rank</th>
                <th className="text-left text-slate-400 font-semibold p-3">Title</th>
                <th className="text-left text-slate-400 font-semibold p-3">Genres</th>
                <th className="text-left text-slate-400 font-semibold p-3">Region</th>
                <th className="text-left text-slate-400 font-semibold p-3">Box Office</th>
                <th className="text-left text-slate-400 font-semibold p-3">Score</th>
              </tr>
            </thead>
            <tbody>
              {topMovies.map((movie, index) => (
                <tr key={movie.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                  <td className="p-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                  </td>
                  <td className="p-3 text-white font-semibold">{movie.title}</td>
                  <td className="p-3 text-slate-300 text-sm">{movie.genres.slice(0, 2).join(", ")}</td>
                  <td className="p-3 text-slate-300 text-sm">{movie.region}</td>
                  <td className="p-3 text-blue-400 font-semibold">₹{movie.box_office_cr}Cr</td>
                  <td className="p-3">
                    <span className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-green-400 font-bold text-sm">
                      {movie.combined_score}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 border border-blue-500/30 rounded-xl p-6">
          <div className="text-3xl font-black text-blue-400">{regionalData.length}</div>
          <div className="text-slate-300 text-sm mt-1">Market Regions</div>
        </div>
        <div className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 border border-purple-500/30 rounded-xl p-6">
          <div className="text-3xl font-black text-purple-400">{audienceData ? Object.keys(audienceData).length : 0}</div>
          <div className="text-slate-300 text-sm mt-1">Audience Segments</div>
        </div>
        <div className="bg-gradient-to-br from-green-600/20 to-green-900/20 border border-green-500/30 rounded-xl p-6">
          <div className="text-3xl font-black text-green-400">{topMovies.length > 0 ? topMovies[0].combined_score : 0}</div>
          <div className="text-slate-300 text-sm mt-1">Top Score</div>
        </div>
        <div className="bg-gradient-to-br from-orange-600/20 to-orange-900/20 border border-orange-500/30 rounded-xl p-6">
          <div className="text-3xl font-black text-orange-400">
            {topMovies.length > 0 ? `₹${Math.max(...topMovies.map(m => m.box_office_cr))}Cr` : "N/A"}
          </div>
          <div className="text-slate-300 text-sm mt-1">Highest Box Office</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;