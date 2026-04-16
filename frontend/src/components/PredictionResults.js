import React from "react";
import { Brain, TrendingUp, IndianRupee, ShieldAlert } from "lucide-react";

const PredictionResults = ({ prediction }) => {
  const getScoreColor = (score) => {
    if (score >= 85) return "text-emerald-400";
    if (score >= 75) return "text-amber-400";
    if (score >= 65) return "text-sky-400";
    return "text-orange-400";
  };

  const getScoreBg = (score) => {
    if (score >= 85) return "from-emerald-500/20 to-emerald-900/10 border-emerald-500/30";
    if (score >= 75) return "from-amber-500/20 to-amber-900/10 border-amber-500/30";
    if (score >= 65) return "from-sky-500/20 to-sky-900/10 border-sky-500/30";
    return "from-orange-500/20 to-orange-900/10 border-orange-500/30";
  };

  const nn = prediction.neural_network || {};
  const roi = prediction.roi_estimate || {};

  return (
    <div className="space-y-4" data-testid="prediction-results">
      {/* Score Card */}
      <div className={`bg-gradient-to-br ${getScoreBg(prediction.overall_score)} rounded-2xl border p-6`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Heuristic Model</div>
            <div className={`text-5xl font-black ${getScoreColor(prediction.overall_score)}`} data-testid="overall-score">
              {prediction.overall_score}
            </div>
            <div className="text-white font-semibold mt-1" data-testid="prediction-label">{prediction.label}</div>
          </div>
          {/* NN Score */}
          <div className="text-right bg-slate-900/60 rounded-xl p-4 border border-slate-700/40">
            <div className="flex items-center gap-1.5 mb-1">
              <Brain size={13} className="text-violet-400" />
              <span className="text-slate-400 text-xs uppercase tracking-wider">Neural Net</span>
            </div>
            <div className="text-3xl font-black text-violet-400" data-testid="nn-score">{nn.nn_score || "N/A"}</div>
            <div className="text-slate-500 text-xs mt-0.5">{nn.confidence || ""} confidence</div>
          </div>
        </div>
      </div>

      {/* Market Scores Grid */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "India Fit", value: prediction.market_scores?.india_fit, color: "text-orange-400" },
          { label: "Global Fit", value: prediction.market_scores?.global_fit, color: "text-sky-400" },
          { label: "Theatrical", value: prediction.market_scores?.theatrical_potential, color: "text-violet-400" },
          { label: "OTT", value: prediction.market_scores?.ott_potential, color: "text-pink-400" }
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-[#111827]/80 rounded-xl p-3 border border-slate-800/40">
            <div className={`text-xl font-black ${color}`}>{value}</div>
            <div className="text-slate-500 text-[10px] uppercase tracking-wider">{label}</div>
          </div>
        ))}
      </div>

      {/* ROI Estimate */}
      {roi.estimated_roi_pct !== undefined && (
        <div className="bg-[#111827]/80 rounded-2xl border border-slate-800/40 p-5">
          <h3 className="text-white font-bold text-sm flex items-center gap-2 mb-3">
            <IndianRupee size={15} className="text-emerald-400" /> ROI Estimate
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-900/50 rounded-lg p-3">
              <div className="text-lg font-black text-emerald-400" data-testid="roi-pct">{roi.estimated_roi_pct}%</div>
              <div className="text-slate-500 text-[10px]">Est. ROI</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-3">
              <div className="text-lg font-black text-amber-400">{roi.estimated_total_revenue_cr}Cr</div>
              <div className="text-slate-500 text-[10px]">Est. Revenue</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-3">
              <div className={`text-lg font-black ${roi.risk_level === "Low" ? "text-emerald-400" : roi.risk_level === "Medium" ? "text-amber-400" : "text-red-400"}`}>
                {roi.risk_level}
              </div>
              <div className="text-slate-500 text-[10px]">Risk Level</div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="text-slate-400">Theatrical: <span className="text-white font-semibold">{roi.estimated_theatrical_cr}Cr</span></div>
            <div className="text-slate-400">OTT Value: <span className="text-white font-semibold">{roi.estimated_ott_value_cr}Cr</span></div>
            <div className="text-slate-400">Budget: <span className="text-white font-semibold">{roi.estimated_budget_cr}Cr</span></div>
            <div className="text-slate-400">Breakeven: <span className="text-white font-semibold">{roi.breakeven_point_cr}Cr</span></div>
          </div>
        </div>
      )}

      {/* Component Analysis */}
      <div className="bg-[#111827]/80 rounded-2xl border border-slate-800/40 p-5">
        <h3 className="text-white font-bold text-sm mb-3">Component Breakdown</h3>
        <div className="space-y-2">
          {Object.entries(prediction.component_scores || {}).map(([key, value]) => (
            <div key={key}>
              <div className="flex justify-between mb-0.5">
                <span className="text-slate-400 text-xs capitalize">{key.replace(/_/g, " ")}</span>
                <span className="text-white font-semibold text-xs">{value}</span>
              </div>
              <div className="w-full bg-slate-800/80 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all ${value >= 80 ? "bg-emerald-500" : value >= 65 ? "bg-amber-500" : "bg-orange-500"}`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-[#111827]/80 rounded-2xl border border-slate-800/40 p-5">
        <h3 className="text-white font-bold text-sm flex items-center gap-2 mb-3">
          <TrendingUp size={14} className="text-amber-400" /> Recommendations
        </h3>
        <ul className="space-y-1.5" data-testid="recommendations">
          {(prediction.recommendations || []).map((rec, i) => (
            <li key={i} className="text-slate-300 text-xs bg-slate-900/40 rounded-lg p-2.5 border border-slate-800/30">{rec}</li>
          ))}
        </ul>
      </div>

      {/* Target Audience & Risk */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#111827]/80 rounded-2xl border border-slate-800/40 p-5">
          <h3 className="text-white font-bold text-sm mb-3">Target Audience</h3>
          <div className="flex flex-wrap gap-1.5">
            {(prediction.target_audience || []).map((a, i) => (
              <span key={i} className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-300 text-xs font-medium" data-testid={`audience-${i}`}>{a}</span>
            ))}
          </div>
        </div>
        <div className="bg-[#111827]/80 rounded-2xl border border-slate-800/40 p-5">
          <h3 className="text-white font-bold text-sm flex items-center gap-2 mb-3">
            <ShieldAlert size={14} className="text-red-400" /> Risk Factors
          </h3>
          <ul className="space-y-1.5" data-testid="risk-factors">
            {(prediction.risk_factors || []).map((r, i) => (
              <li key={i} className="text-slate-400 text-xs bg-red-900/10 border border-red-500/10 rounded-lg p-2">{r}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Similar Movies */}
      {prediction.similar_successful_movies?.length > 0 && (
        <div className="bg-[#111827]/80 rounded-2xl border border-slate-800/40 p-5">
          <h3 className="text-white font-bold text-sm mb-3">Similar Successful Movies</h3>
          <div className="space-y-2">
            {prediction.similar_successful_movies.map((m, i) => (
              <div key={i} className="bg-slate-900/40 rounded-lg p-3 flex justify-between items-center border border-slate-800/20">
                <div>
                  <div className="text-white font-semibold text-sm">{m.title}</div>
                  <div className="text-slate-500 text-xs">{m.genres.join(", ")}</div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-bold text-sm">{m.score}</div>
                  <div className="text-slate-500 text-[10px]">{m.similarity}% match</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionResults;
