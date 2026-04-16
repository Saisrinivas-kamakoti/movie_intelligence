import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import PredictionResults from "@/components/PredictionResults";

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

  const handleGenreToggle = (genre) => {
    setFormData(prev => {
      const genres = prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre].slice(0, 3); // Max 3 genres
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

    try {
      const response = await axios.post(`${API}/simulate`, formData);
      setPrediction(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Simulation failed. Please try again.");
      console.error("Simulation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Input Form */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-8" data-testid="simulator-form">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Test Your Film Concept</h2>
          <p className="text-slate-400 text-sm">Input your film concept details and get AI-powered predictions</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Genres */}
          <div>
            <Label className="text-white mb-3 block">Select Genres (Max 3)</Label>
            <div className="grid grid-cols-3 gap-2">
              {metadata.genres.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => handleGenreToggle(genre)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    formData.genres.includes(genre)
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                  data-testid={`genre-${genre}`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Tone */}
          <div>
            <Label className="text-white mb-2 block">Tone</Label>
            <select
              value={formData.tone}
              onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
              className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="tone-select"
            >
              {metadata.tones.map((tone) => (
                <option key={tone} value={tone}>{tone}</option>
              ))}
            </select>
          </div>

          {/* Budget Tier */}
          <div>
            <Label className="text-white mb-2 block">Budget Tier</Label>
            <select
              value={formData.budget_tier}
              onChange={(e) => setFormData({ ...formData, budget_tier: e.target.value })}
              className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="budget-select"
            >
              {metadata.budget_tiers.map((tier) => (
                <option key={tier} value={tier}>{tier}</option>
              ))}
            </select>
          </div>

          {/* Release Type */}
          <div>
            <Label className="text-white mb-2 block">Release Strategy</Label>
            <select
              value={formData.release_type}
              onChange={(e) => setFormData({ ...formData, release_type: e.target.value })}
              className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="release-select"
            >
              {metadata.release_types.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Language */}
          <div>
            <Label className="text-white mb-2 block">Language</Label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="language-select"
            >
              {metadata.languages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          {/* Star Power Slider */}
          <div>
            <div className="flex justify-between mb-2">
              <Label className="text-white">Star Power</Label>
              <span className="text-blue-400 font-bold" data-testid="star-power-value">{formData.star_power}/10</span>
            </div>
            <Slider
              value={[formData.star_power]}
              onValueChange={(value) => setFormData({ ...formData, star_power: value[0] })}
              min={1}
              max={10}
              step={1}
              className="w-full"
              data-testid="star-power-slider"
            />
          </div>

          {/* Novelty Factor Slider */}
          <div>
            <div className="flex justify-between mb-2">
              <Label className="text-white">Novelty Factor</Label>
              <span className="text-purple-400 font-bold" data-testid="novelty-value">{formData.novelty_factor}/10</span>
            </div>
            <Slider
              value={[formData.novelty_factor]}
              onValueChange={(value) => setFormData({ ...formData, novelty_factor: value[0] })}
              min={1}
              max={10}
              step={1}
              className="w-full"
              data-testid="novelty-slider"
            />
          </div>

          {/* Family Appeal Slider */}
          <div>
            <div className="flex justify-between mb-2">
              <Label className="text-white">Family Appeal</Label>
              <span className="text-green-400 font-bold" data-testid="family-value">{formData.family_appeal}/10</span>
            </div>
            <Slider
              value={[formData.family_appeal]}
              onValueChange={(value) => setFormData({ ...formData, family_appeal: value[0] })}
              min={1}
              max={10}
              step={1}
              className="w-full"
              data-testid="family-slider"
            />
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-300 text-sm" data-testid="error-message">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-6 rounded-xl shadow-lg shadow-blue-500/50 transition-all"
            data-testid="simulate-button"
          >
            {loading ? "Analyzing Concept..." : "🎯 Predict Success"}
          </Button>
        </form>
      </div>

      {/* Results */}
      {prediction && (
        <PredictionResults prediction={prediction} />
      )}
    </div>
  );
};

export default Simulator;