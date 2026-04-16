import React, { useState } from "react";
import axios from "axios";
import { Slider } from "@/components/ui/slider";
import { Plus, Trash2, ArrowUpDown, Download, BarChart3 } from "lucide-react";

const StudioPitch = ({ API, metadata }) => {
  const emptyRow = () => ({
    id: Date.now(),
    genres: [],
    tone: "Dramatic",
    budget_tier: "Medium (30-100Cr)",
    release_type: "Theatrical",
    language: "Hindi",
    star_power: 5,
    novelty_factor: 5,
    family_appeal: 5
  });

  const [concepts, setConcepts] = useState([emptyRow()]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const addConcept = () => {
    if (concepts.length < 5) setConcepts([...concepts, emptyRow()]);
  };

  const removeConcept = (id) => {
    if (concepts.length > 1) setConcepts(concepts.filter(c => c.id !== id));
  };

  const updateConcept = (id, field, value) => {
    setConcepts(concepts.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const toggleGenre = (id, genre) => {
    setConcepts(concepts.map(c => {
      if (c.id !== id) return c;
      const genres = c.genres.includes(genre) ? c.genres.filter(g => g !== genre) : [...c.genres, genre].slice(0, 3);
      return { ...c, genres };
    }));
  };

  const handleCompare = async () => {
    const valid = concepts.filter(c => c.genres.length > 0);
    if (valid.length === 0) return;
    setLoading(true);
    try {
      const response = await axios.post(`${API}/compare`, {
        concepts: valid.map(({ id, ...rest }) => rest)
      });
      setResults(response.data);
    } catch (err) {
      console.error("Comparison error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async (concept) => {
    try {
      const { id, ...conceptData } = concept;
      const response = await axios.post(`${API}/export/pitch-deck`, conceptData, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `CineSignal_Pitch_${concept.genres.join("_")}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("PDF export error:", err);
    }
  };

  return (
    <div data-testid="studio-pitch-view">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-white tracking-tight">Studio Pitch & Comparison</h2>
        <p className="text-slate-500 mt-1">Compare multiple concepts side-by-side, export PDF pitch decks</p>
      </div>

      {/* Concept Builder */}
      <div className="space-y-4 mb-6">
        {concepts.map((concept, index) => (
          <div key={concept.id} className="bg-[#111827]/80 rounded-xl border border-slate-800/50 p-5" data-testid={`concept-row-${index}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold text-sm">Concept {index + 1}</h3>
              <div className="flex gap-2">
                {concept.genres.length > 0 && (
                  <button onClick={() => handleExportPDF(concept)} className="text-amber-400 hover:text-amber-300 text-xs flex items-center gap-1" data-testid={`export-concept-${index}`}>
                    <Download size={12} /> PDF
                  </button>
                )}
                {concepts.length > 1 && (
                  <button onClick={() => removeConcept(concept.id)} className="text-red-400 hover:text-red-300">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Genre pills */}
            <div className="flex flex-wrap gap-1 mb-3">
              {metadata.genres.map(genre => (
                <button
                  key={genre}
                  onClick={() => toggleGenre(concept.id, genre)}
                  className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${
                    concept.genres.includes(genre)
                      ? "bg-amber-500/90 text-black"
                      : "bg-slate-800/60 text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>

            {/* Quick settings */}
            <div className="grid grid-cols-4 gap-2 text-xs">
              <select value={concept.tone} onChange={e => updateConcept(concept.id, "tone", e.target.value)} className="bg-slate-800/80 text-white border border-slate-700/40 rounded px-2 py-1.5 text-xs">
                {metadata.tones.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={concept.budget_tier} onChange={e => updateConcept(concept.id, "budget_tier", e.target.value)} className="bg-slate-800/80 text-white border border-slate-700/40 rounded px-2 py-1.5 text-xs">
                {metadata.budget_tiers.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={concept.release_type} onChange={e => updateConcept(concept.id, "release_type", e.target.value)} className="bg-slate-800/80 text-white border border-slate-700/40 rounded px-2 py-1.5 text-xs">
                {metadata.release_types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={concept.language} onChange={e => updateConcept(concept.id, "language", e.target.value)} className="bg-slate-800/80 text-white border border-slate-700/40 rounded px-2 py-1.5 text-xs">
                {metadata.languages.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-3">
              {["star_power", "novelty_factor", "family_appeal"].map(key => (
                <div key={key}>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-500 text-[10px] capitalize">{key.replace(/_/g, " ")}</span>
                    <span className="text-white text-xs font-bold">{concept[key]}</span>
                  </div>
                  <Slider value={[concept[key]]} onValueChange={v => updateConcept(concept.id, key, v[0])} min={1} max={10} step={1} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-8">
        {concepts.length < 5 && (
          <button onClick={addConcept} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 border border-slate-700/50" data-testid="add-concept">
            <Plus size={14} /> Add Concept
          </button>
        )}
        <button
          onClick={handleCompare}
          disabled={loading || concepts.every(c => c.genres.length === 0)}
          className="bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold px-6 py-2.5 rounded-lg text-sm flex items-center gap-2 disabled:opacity-40 shadow-lg shadow-amber-500/20"
          data-testid="compare-button"
        >
          <ArrowUpDown size={14} /> {loading ? "Comparing..." : "Compare Concepts"}
        </button>
      </div>

      {/* Comparison Results */}
      {results && (
        <div className="space-y-4" data-testid="comparison-results">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <BarChart3 size={18} className="text-amber-400" /> Comparison Results
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left text-slate-500 text-xs font-semibold p-3 uppercase tracking-wider">Rank</th>
                  <th className="text-left text-slate-500 text-xs font-semibold p-3 uppercase tracking-wider">Genres</th>
                  <th className="text-left text-slate-500 text-xs font-semibold p-3 uppercase tracking-wider">Score</th>
                  <th className="text-left text-slate-500 text-xs font-semibold p-3 uppercase tracking-wider">NN Score</th>
                  <th className="text-left text-slate-500 text-xs font-semibold p-3 uppercase tracking-wider">India</th>
                  <th className="text-left text-slate-500 text-xs font-semibold p-3 uppercase tracking-wider">Global</th>
                  <th className="text-left text-slate-500 text-xs font-semibold p-3 uppercase tracking-wider">ROI</th>
                  <th className="text-left text-slate-500 text-xs font-semibold p-3 uppercase tracking-wider">Label</th>
                </tr>
              </thead>
              <tbody>
                {results.comparisons.map((r, i) => (
                  <tr key={i} className={`border-b border-slate-800/30 ${i === 0 ? "bg-amber-500/5" : ""}`}>
                    <td className="p-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-amber-500 text-black" : "bg-slate-800 text-slate-400"}`}>
                        {r.rank}
                      </div>
                    </td>
                    <td className="p-3 text-white text-sm font-medium">{r.concept.genres.join(" + ")}</td>
                    <td className="p-3 text-amber-400 font-black text-lg">{r.prediction.overall_score}</td>
                    <td className="p-3 text-violet-400 font-bold">{r.prediction.neural_network?.nn_score || "-"}</td>
                    <td className="p-3 text-orange-400 font-semibold">{r.prediction.market_scores?.india_fit}</td>
                    <td className="p-3 text-sky-400 font-semibold">{r.prediction.market_scores?.global_fit}</td>
                    <td className="p-3 text-emerald-400 font-semibold">{r.prediction.roi_estimate?.estimated_roi_pct}%</td>
                    <td className="p-3 text-slate-300 text-xs">{r.prediction.label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudioPitch;
