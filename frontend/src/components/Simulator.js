import React, { useState } from "react";
import axios from "axios";
import { Slider } from "@/components/ui/slider";
import { Zap, TrendingUp, Target, AlertTriangle, DollarSign, Film } from "lucide-react";
import PredictionResults from "@/components/PredictionResults";
import FeedbackPanel from "@/components/FeedbackPanel";

const Simulator = ({ metadata, API }) => {
  const [formData, setFormData] = useState({
    genres: [],
    tone: "Dramatic",
    budget_tier: "Medium (30-100Cr)",
    release_type: "Theatrical",
    language: "Hindi",
    star_power: 5,
    novelty_factor: 5,
    family_appeal: 5
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleGenreToggle = (genre) => {
    setFormData(prev => {
      const genres = prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre].slice(0, 3);
      return { ...prev, genres };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.genres.length === 0) {
      setError("Please select at least one genre");
      return;
    }
    setLoading(true);
    setError(null);
    setShowFeedback(false);
    try {
      const response = await axios.post(`${API}/simulate`, formData);
      setPrediction(response.data);
      setShowFeedback(true);
    } catch (err) {
      setError(err.response?.data?.detail || "Simulation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await axios.post(`${API}/export/pitch-deck`, formData, {
        responseType: "blob"
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "CineSignal_PitchDeck.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("PDF export error:", err);
    }
  };

  return (
    <div data-testid="simulator-view">
      {/* Hero */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-white tracking-tight">Test Your Film Concept</h2>
        <p className="text-slate-500 mt-1">AI-powered predictions with Heuristic + Neural Network dual engine</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Input Form - 2 cols */}
        <div className="lg:col-span-2 bg-[#111827]/80 backdrop-blur-xl rounded-2xl border border-slate-800/50 p-6" data-testid="simulator-form">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Genres */}
            <div>
              <label className="text-white text-sm font-semibold mb-2.5 block">Genres <span className="text-slate-500 font-normal">(Max 3)</span></label>
              <div className="grid grid-cols-3 gap-1.5">
                {metadata.genres.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => handleGenreToggle(genre)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      formData.genres.includes(genre)
                        ? "bg-amber-500/90 text-black shadow-lg shadow-amber-500/30"
                        : "bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                    }`}
                    data-testid={`genre-${genre}`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Dropdowns Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white text-xs font-semibold mb-1.5 block">Tone</label>
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                  className="w-full bg-slate-800/80 text-white border border-slate-700/50 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  data-testid="tone-select"
                >
                  {metadata.tones.map((tone) => (<option key={tone} value={tone}>{tone}</option>))}
                </select>
              </div>
              <div>
                <label className="text-white text-xs font-semibold mb-1.5 block">Budget</label>
                <select
                  value={formData.budget_tier}
                  onChange={(e) => setFormData({ ...formData, budget_tier: e.target.value })}
                  className="w-full bg-slate-800/80 text-white border border-slate-700/50 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  data-testid="budget-select"
                >
                  {metadata.budget_tiers.map((t) => (<option key={t} value={t}>{t}</option>))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white text-xs font-semibold mb-1.5 block">Release</label>
                <select
                  value={formData.release_type}
                  onChange={(e) => setFormData({ ...formData, release_type: e.target.value })}
                  className="w-full bg-slate-800/80 text-white border border-slate-700/50 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  data-testid="release-select"
                >
                  {metadata.release_types.map((t) => (<option key={t} value={t}>{t}</option>))}
                </select>
              </div>
              <div>
                <label className="text-white text-xs font-semibold mb-1.5 block">Language</label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full bg-slate-800/80 text-white border border-slate-700/50 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  data-testid="language-select"
                >
                  {metadata.languages.map((l) => (<option key={l} value={l}>{l}</option>))}
                </select>
              </div>
            </div>

            {/* Sliders */}
            {[
              { key: "star_power", label: "Star Power", color: "text-amber-400", icon: Zap },
              { key: "novelty_factor", label: "Novelty Factor", color: "text-violet-400", icon: TrendingUp },
              { key: "family_appeal", label: "Family Appeal", color: "text-emerald-400", icon: Target }
            ].map(({ key, label, color, icon: Icon }) => (
              <div key={key}>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-white text-xs font-semibold flex items-center gap-1.5">
                    <Icon size={13} className={color} /> {label}
                  </label>
                  <span className={`${color} font-bold text-sm`} data-testid={`${key}-value`}>{formData[key]}/10</span>
                </div>
                <Slider
                  value={[formData[key]]}
                  onValueChange={(v) => setFormData({ ...formData, [key]: v[0] })}
                  min={1} max={10} step={1}
                  className="w-full"
                  data-testid={`${key}-slider`}
                />
              </div>
            ))}

            {error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-red-400 text-xs flex items-center gap-2" data-testid="error-message">
                <AlertTriangle size={14} /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-black font-bold py-3.5 rounded-xl shadow-lg shadow-amber-500/30 transition-all disabled:opacity-50 text-sm"
              data-testid="simulate-button"
            >
              {loading ? "Analyzing..." : "Predict Success"}
            </button>

            {prediction && (
              <button
                type="button"
                onClick={handleExportPDF}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-xl border border-slate-700/50 transition-all flex items-center justify-center gap-2 text-sm"
                data-testid="export-pdf-button"
              >
                <DollarSign size={14} /> Export Pitch Deck (PDF)
              </button>
            )}
          </form>
        </div>

        {/* Results - 3 cols */}
        <div className="lg:col-span-3">
          {prediction ? (
            <>
              <PredictionResults prediction={prediction} />
              {showFeedback && (
                <FeedbackPanel
                  API={API}
                  concept={formData}
                  prediction={prediction}
                  onClose={() => setShowFeedback(false)}
                />
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-96 bg-[#111827]/40 rounded-2xl border border-dashed border-slate-800/50">
              <div className="text-center">
                <Film size={48} className="text-slate-700 mx-auto mb-4" />
                <p className="text-slate-600 text-sm">Select genres and configure your concept to see predictions</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Simulator;
