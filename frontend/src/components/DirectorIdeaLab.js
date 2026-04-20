import React, { useMemo, useState } from "react";
import { BookOpen, MapPin, Sparkles, Wand2 } from "lucide-react";
import { cinesignalLocal } from "@/lib/cinesignalLocal";

const sanitize = (text = "") =>
  text
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const DirectorIdeaLab = ({ metadata }) => {
  const [formData, setFormData] = useState({
    mode: "analyze",
    concept_text: "",
    target_genre: metadata?.genres?.[0] || "Action",
    preferred_language: metadata?.languages?.[0] || "Hindi",
    release_type: metadata?.release_types?.[0] || "Theatrical",
    budget_tier: metadata?.budget_tiers?.[1] || "Medium (30-100Cr)",
    star_power: 5,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const characterCount = useMemo(() => formData.concept_text.length, [formData.concept_text]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await cinesignalLocal.analyzeDirectorIdea(formData);
      setResult(response);
    } catch (err) {
      setError(err.response?.data?.detail || "The idea lab could not analyze this concept right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid xl:grid-cols-[0.95fr,1.05fr] gap-6" data-testid="director-idea-lab">
      <div className="bg-[#111827]/80 rounded-2xl border border-slate-800/40 p-6">
        <div className="mb-6">
          <h3 className="text-white text-xl font-black">Director Idea Lab</h3>
          <p className="text-slate-500 text-sm mt-1">
            Analyze a story concept or ask the system to generate story directions in a chosen genre.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-semibold text-slate-400">
              Mode
              <select
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                className="mt-1.5 w-full bg-slate-800/80 text-white border border-slate-700/50 rounded-lg px-3 py-2.5 text-sm"
              >
                <option value="analyze">Analyze concept</option>
                <option value="generate">Suggest story directions</option>
              </select>
            </label>

            <label className="text-xs font-semibold text-slate-400">
              Target genre
              <select
                value={formData.target_genre}
                onChange={(e) => setFormData({ ...formData, target_genre: e.target.value })}
                className="mt-1.5 w-full bg-slate-800/80 text-white border border-slate-700/50 rounded-lg px-3 py-2.5 text-sm"
              >
                {metadata.genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="text-xs font-semibold text-slate-400 block">
            {formData.mode === "analyze" ? "Concept or story idea" : "What kind of story do you want?"}
            <textarea
              value={formData.concept_text}
              onChange={(e) => setFormData({ ...formData, concept_text: e.target.value })}
              rows={8}
              placeholder={
                formData.mode === "analyze"
                  ? "Write the core idea in 100-500+ characters. Mention the protagonist, conflict, setting, or emotional hook."
                  : "Describe the kind of story, tone, culture, or audience you want the system to generate directions for."
              }
              className="mt-1.5 w-full bg-slate-900/70 text-white border border-slate-700/50 rounded-xl px-4 py-3 text-sm resize-none leading-6"
            />
            <span className="mt-1.5 block text-[11px] text-slate-500">{characterCount} characters</span>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-semibold text-slate-400">
              Language
              <select
                value={formData.preferred_language}
                onChange={(e) => setFormData({ ...formData, preferred_language: e.target.value })}
                className="mt-1.5 w-full bg-slate-800/80 text-white border border-slate-700/50 rounded-lg px-3 py-2.5 text-sm"
              >
                {metadata.languages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs font-semibold text-slate-400">
              Release path
              <select
                value={formData.release_type}
                onChange={(e) => setFormData({ ...formData, release_type: e.target.value })}
                className="mt-1.5 w-full bg-slate-800/80 text-white border border-slate-700/50 rounded-lg px-3 py-2.5 text-sm"
              >
                {metadata.release_types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-semibold text-slate-400">
              Budget lane
              <select
                value={formData.budget_tier}
                onChange={(e) => setFormData({ ...formData, budget_tier: e.target.value })}
                className="mt-1.5 w-full bg-slate-800/80 text-white border border-slate-700/50 rounded-lg px-3 py-2.5 text-sm"
              >
                {metadata.budget_tiers.map((tier) => (
                  <option key={tier} value={tier}>
                    {tier}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs font-semibold text-slate-400">
              Assumed star power
              <input
                type="number"
                min="1"
                max="10"
                value={formData.star_power}
                onChange={(e) => setFormData({ ...formData, star_power: Number(e.target.value) || 5 })}
                className="mt-1.5 w-full bg-slate-800/80 text-white border border-slate-700/50 rounded-lg px-3 py-2.5 text-sm"
              />
            </label>
          </div>

          {error && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl p-3">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-violet-500/20 disabled:opacity-60"
          >
            {loading ? "Thinking through the concept..." : formData.mode === "analyze" ? "Analyze concept" : "Generate directions"}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {!result ? (
          <div className="bg-[#111827]/50 rounded-2xl border border-dashed border-slate-800/50 min-h-[560px] flex items-center justify-center p-8 text-center">
            <div>
              <Wand2 size={42} className="text-violet-400 mx-auto mb-4" />
              <h4 className="text-white text-lg font-bold mb-2">Turn instinct into a studio conversation</h4>
              <p className="text-slate-500 text-sm max-w-md">
                You will get story improvement moves, budget discipline advice, inspirations, location ideas, pitch packaging, and director KPIs.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-[#111827]/80 rounded-2xl border border-slate-800/40 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.24em] text-violet-400 mb-2">Parsed concept</div>
                  <div className="text-white text-lg font-bold">{result.parsed_concept.summary}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {result.parsed_concept.genres.map((genre) => (
                      <span key={genre} className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-200 text-xs font-semibold">
                        {genre}
                      </span>
                    ))}
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
                      Tone: {result.parsed_concept.tone}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black text-amber-400">{result.prediction.overall_score}</div>
                  <div className="text-slate-500 text-xs">{result.prediction.label}</div>
                </div>
              </div>
              <p className="text-slate-400 text-sm mt-4">{sanitize(result.parsed_concept.market_positioning)}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-[#111827]/80 rounded-2xl border border-slate-800/40 p-5">
                <div className="text-white font-bold mb-3 flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-400" /> Improvement moves
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  {result.development_notes.improvement_moves.map((item, index) => (
                    <li key={index} className="bg-slate-900/40 rounded-xl p-3 border border-slate-800/30">{sanitize(item)}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#111827]/80 rounded-2xl border border-slate-800/40 p-5">
                <div className="text-white font-bold mb-3">Budget adjustments</div>
                <ul className="space-y-2 text-sm text-slate-300">
                  {result.development_notes.budget_adjustments.map((item, index) => (
                    <li key={index} className="bg-slate-900/40 rounded-xl p-3 border border-slate-800/30">{sanitize(item)}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-[#111827]/80 rounded-2xl border border-slate-800/40 p-5">
                <div className="text-white font-bold mb-3 flex items-center gap-2">
                  <BookOpen size={16} className="text-emerald-400" /> Inspiration map
                </div>
                <div className="space-y-3 text-sm">
                  {[
                    ["Books", result.inspiration_map.books],
                    ["Folklores", result.inspiration_map.folklores],
                    ["Cultures", result.inspiration_map.cultures],
                    ["Film references", result.inspiration_map.film_references],
                  ].map(([label, items]) => (
                    <div key={label}>
                      <div className="text-slate-400 text-xs uppercase tracking-[0.2em] mb-1.5">{label}</div>
                      <div className="flex flex-wrap gap-2">
                        {items.map((item) => (
                          <span key={item} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-200 text-xs">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#111827]/80 rounded-2xl border border-slate-800/40 p-5">
                <div className="text-white font-bold mb-3 flex items-center gap-2">
                  <MapPin size={16} className="text-sky-400" /> Shoot locations
                </div>
                <div className="space-y-3">
                  {result.locations.map((location) => (
                    <div key={location.place} className="bg-slate-900/40 rounded-xl p-3 border border-slate-800/30">
                      <div className="text-white font-semibold text-sm">{location.place}</div>
                      <div className="text-slate-400 text-xs mt-1">{location.fit}</div>
                      <div className="text-sky-300 text-xs mt-2">{location.budget}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-[#111827]/80 rounded-2xl border border-slate-800/40 p-5">
                <div className="text-white font-bold mb-3">Pitch packaging</div>
                <div className="space-y-3 text-sm text-slate-300">
                  <div className="bg-slate-900/40 rounded-xl p-3 border border-slate-800/30">
                    <div className="text-slate-500 text-xs uppercase tracking-[0.2em] mb-1">Greenlight hook</div>
                    {sanitize(result.development_notes.pitch_packaging.greenlight_hook)}
                  </div>
                  <div className="bg-slate-900/40 rounded-xl p-3 border border-slate-800/30">
                    <div className="text-slate-500 text-xs uppercase tracking-[0.2em] mb-1">Positioning</div>
                    {sanitize(result.development_notes.pitch_packaging.positioning_guidance)}
                  </div>
                  <div className="bg-slate-900/40 rounded-xl p-3 border border-slate-800/30">
                    <div className="text-slate-500 text-xs uppercase tracking-[0.2em] mb-1">Window recommendation</div>
                    {result.development_notes.pitch_packaging.window_recommendation}
                  </div>
                </div>
              </div>

              <div className="bg-[#111827]/80 rounded-2xl border border-slate-800/40 p-5">
                <div className="text-white font-bold mb-3">Director KPIs</div>
                <div className="space-y-2">
                  {result.director_kpis.map((kpi) => (
                    <div key={kpi.name} className="bg-slate-900/40 rounded-xl p-3 border border-slate-800/30">
                      <div className="text-white text-sm font-semibold">{kpi.name}</div>
                      <div className="text-slate-400 text-xs mt-1">{sanitize(kpi.why_it_matters)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {result.story_directions && (
              <div className="bg-[#111827]/80 rounded-2xl border border-slate-800/40 p-5">
                <div className="text-white font-bold mb-3">Suggested story directions</div>
                <div className="grid lg:grid-cols-2 gap-3">
                  {result.story_directions.map((direction) => (
                    <div key={direction.title} className="bg-slate-900/40 rounded-xl p-4 border border-slate-800/30">
                      <div className="text-violet-300 font-semibold text-sm">{direction.title}</div>
                      <div className="text-white text-sm mt-2 leading-6">{sanitize(direction.logline)}</div>
                      <div className="text-slate-400 text-xs mt-3">{sanitize(direction.language_note)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DirectorIdeaLab;
