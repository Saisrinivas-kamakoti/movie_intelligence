import React from "react";

const PredictionResults = ({ prediction }) => {
  const getScoreColor = (score) => {
    if (score >= 85) return "text-green-400";
    if (score >= 75) return "text-blue-400";
    if (score >= 65) return "text-yellow-400";
    return "text-orange-400";
  };

  const getScoreGradient = (score) => {
    if (score >= 85) return "from-green-500 to-emerald-500";
    if (score >= 75) return "from-blue-500 to-cyan-500";
    if (score >= 65) return "from-yellow-500 to-amber-500";
    return "from-orange-500 to-red-500";
  };

  return (
    <div className="space-y-6" data-testid="prediction-results">
      {/* Overall Score Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl rounded-2xl border border-slate-700 p-8 shadow-2xl">
        <div className="text-center">
          <div className="mb-4">
            <div className={`text-6xl font-black ${getScoreColor(prediction.overall_score)}`} data-testid="overall-score">
              {prediction.overall_score}
            </div>
            <div className="text-slate-400 text-sm mt-1">Success Score</div>
          </div>
          <div className={`inline-block px-6 py-3 rounded-full bg-gradient-to-r ${getScoreGradient(prediction.overall_score)} text-white font-bold text-lg shadow-lg`} data-testid="prediction-label">
            {prediction.label}
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < (prediction.confidence === "High" ? 3 : prediction.confidence === "Medium" ? 2 : 1)
                      ? "bg-green-400"
                      : "bg-slate-700"
                  }`}
                />
              ))}
            </div>
            <span className="text-slate-300 text-sm">{prediction.confidence} Confidence</span>
          </div>
        </div>
      </div>

      {/* Market Scores */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
        <h3 className="text-white font-bold mb-4 text-lg">Market Fit Analysis</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 rounded-xl p-4">
            <div className="text-2xl font-bold text-orange-400" data-testid="india-fit">{prediction.market_scores.india_fit}</div>
            <div className="text-slate-400 text-sm">India Market Fit</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-400" data-testid="global-fit">{prediction.market_scores.global_fit}</div>
            <div className="text-slate-400 text-sm">Global Market Fit</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4">
            <div className="text-2xl font-bold text-purple-400" data-testid="theatrical-potential">{prediction.market_scores.theatrical_potential}</div>
            <div className="text-slate-400 text-sm">Theatrical Potential</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4">
            <div className="text-2xl font-bold text-pink-400" data-testid="ott-potential">{prediction.market_scores.ott_potential}</div>
            <div className="text-slate-400 text-sm">OTT Potential</div>
          </div>
        </div>
      </div>

      {/* Component Scores */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
        <h3 className="text-white font-bold mb-4 text-lg">Component Analysis</h3>
        <div className="space-y-3">
          {Object.entries(prediction.component_scores).map(([key, value]) => (
            <div key={key}>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 text-sm capitalize">{key.replace(/_/g, " ")}</span>
                <span className="text-white font-semibold">{value}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div
                  className={`h-2 rounded-full bg-gradient-to-r ${getScoreGradient(value)}`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
        <h3 className="text-white font-bold mb-4 text-lg">💡 Strategic Recommendations</h3>
        <ul className="space-y-2" data-testid="recommendations">
          {prediction.recommendations.map((rec, index) => (
            <li key={index} className="text-slate-300 text-sm bg-slate-800/50 rounded-lg p-3">
              {rec}
            </li>
          ))}
        </ul>
      </div>

      {/* Target Audience */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
        <h3 className="text-white font-bold mb-4 text-lg">🎯 Target Audience</h3>
        <div className="flex flex-wrap gap-2">
          {prediction.target_audience.map((audience, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium"
              data-testid={`audience-${index}`}
            >
              {audience}
            </span>
          ))}
        </div>
      </div>

      {/* Similar Successful Movies */}
      {prediction.similar_successful_movies.length > 0 && (
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
          <h3 className="text-white font-bold mb-4 text-lg">🎬 Similar Successful Movies</h3>
          <div className="space-y-3">
            {prediction.similar_successful_movies.map((movie, index) => (
              <div key={index} className="bg-slate-800/50 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <div className="text-white font-semibold">{movie.title}</div>
                  <div className="text-slate-400 text-xs">{movie.genres.join(", ")}</div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold">{movie.score}</div>
                  <div className="text-slate-400 text-xs">{movie.similarity}% match</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Factors */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
        <h3 className="text-white font-bold mb-4 text-lg">⚠️ Risk Assessment</h3>
        <ul className="space-y-2" data-testid="risk-factors">
          {prediction.risk_factors.map((risk, index) => (
            <li key={index} className="text-slate-300 text-sm bg-red-900/10 border border-red-500/20 rounded-lg p-3">
              {risk}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PredictionResults;