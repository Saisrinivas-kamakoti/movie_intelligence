import React, { useEffect, useState } from "react";
import { BookOpen, ChevronDown, ChevronRight, Play, Sparkles, Users } from "lucide-react";
import DirectorIdeaLab from "@/components/DirectorIdeaLab";
import { cinesignalClient } from "@/lib/cinesignalClient";

const sanitize = (text = "") =>
  text
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const DirectorSuite = ({ metadata }) => {
  const [presets, setPresets] = useState([]);
  const [caseStudies, setCaseStudies] = useState([]);
  const [activePreset, setActivePreset] = useState(null);
  const [presetResult, setPresetResult] = useState(null);
  const [activeCaseStudy, setActiveCaseStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [activeTab, setActiveTab] = useState("ideaLab");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [presetsRes, casesRes] = await Promise.all([
        cinesignalClient.getDirectorPresets(),
        cinesignalClient.getCaseStudies(),
      ]);
      setPresets(presetsRes.presets);
      setCaseStudies(casesRes.case_studies);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const testPreset = async (presetId) => {
    setTesting(true);
    setPresetResult(null);
    try {
      const res = await cinesignalClient.testDirectorPreset(presetId);
      setPresetResult(res);
      setActivePreset(presetId);
      setActiveTab("presets");
    } catch (err) {
      console.error("Test error:", err);
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96"><div className="text-white">Loading director suite...</div></div>;
  }

  return (
    <div data-testid="director-suite-view">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-white tracking-tight">Director Suite</h2>
        <p className="text-slate-500 mt-1">Study winning patterns, test director-style presets, and pressure-test raw ideas before they become expensive.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: "ideaLab", label: "Idea Lab", icon: Sparkles },
          { id: "presets", label: "Director presets", icon: Users },
          { id: "caseStudies", label: "Case studies", icon: BookOpen },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
              activeTab === id
                ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                : "border-slate-800/50 bg-[#111827]/65 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {activeTab === "ideaLab" && <DirectorIdeaLab metadata={metadata} />}

      {activeTab === "presets" && (
        <>
          <div className="mb-10">
            <h3 className="text-white font-bold text-lg flex items-center gap-2 mb-5">
              <Users size={18} className="text-amber-400" /> Director Style Presets
            </h3>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {presets.map((preset) => (
                <div
                  key={preset.id}
                  className={`bg-[#111827]/80 rounded-xl border p-4 transition-all cursor-pointer ${
                    activePreset === preset.id ? "border-amber-500/50 shadow-lg shadow-amber-500/10" : "border-slate-800/40 hover:border-slate-700"
                  }`}
                  onClick={() => testPreset(preset.id)}
                  data-testid={`preset-${preset.id}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-white font-bold text-sm">{preset.director}</div>
                      <div className="text-amber-400/80 text-xs font-medium">{preset.style}</div>
                    </div>
                    <button className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 p-1.5 rounded-lg transition-all" data-testid={`test-${preset.id}`}>
                      <Play size={14} />
                    </button>
                  </div>
                  <p className="text-slate-500 text-xs mb-2 leading-relaxed">{preset.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {preset.concept.genres.map((genre) => (
                      <span key={genre} className="px-2 py-0.5 bg-slate-800/60 rounded text-[10px] text-slate-400">{genre}</span>
                    ))}
                  </div>
                  <div className="mt-2 text-slate-600 text-[10px]">
                    Ref: {preset.reference_movies.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {testing && (
            <div className="mb-8 bg-[#111827]/80 rounded-xl border border-slate-800/40 p-6 text-center">
              <div className="text-white">Running AI analysis...</div>
            </div>
          )}

          {presetResult && !testing && (
            <div className="mb-10 bg-[#111827]/80 rounded-2xl border border-amber-500/20 p-6" data-testid="preset-result">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white font-bold text-lg">{presetResult.director}&apos;s Style Analysis</h3>
                  <p className="text-amber-400/80 text-sm">{presetResult.style}</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black text-amber-400">{presetResult.prediction.overall_score}</div>
                  <div className="text-slate-400 text-xs">{presetResult.prediction.label}</div>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4 mb-4">
                {[
                  { label: "India", value: presetResult.prediction.market_scores?.india_fit, color: "text-orange-400" },
                  { label: "Global", value: presetResult.prediction.market_scores?.global_fit, color: "text-sky-400" },
                  { label: "NN Score", value: presetResult.prediction.neural_network?.nn_score, color: "text-violet-400" },
                  { label: "ROI", value: `${presetResult.prediction.roi_estimate?.estimated_roi_pct}%`, color: "text-emerald-400" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-slate-900/50 rounded-lg p-3">
                    <div className={`text-lg font-black ${color}`}>{value}</div>
                    <div className="text-slate-500 text-[10px] uppercase">{label}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                {(presetResult.prediction.recommendations || []).map((rec, index) => (
                  <div key={index} className="text-slate-300 text-xs bg-slate-900/30 rounded p-2">{sanitize(rec)}</div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === "caseStudies" && (
        <div>
          <h3 className="text-white font-bold text-lg flex items-center gap-2 mb-5">
            <BookOpen size={18} className="text-emerald-400" /> Industry Case Studies
          </h3>

          <div className="space-y-3">
            {caseStudies.map((study, index) => (
              <div key={index} className="bg-[#111827]/80 rounded-xl border border-slate-800/40 overflow-hidden" data-testid={`case-study-${index}`}>
                <button
                  onClick={() => setActiveCaseStudy(activeCaseStudy === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-800/20 transition-all"
                >
                  <div>
                    <div className="text-white font-bold text-sm">{study.title}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{study.genres.join(" + ")} &middot; {study.year} &middot; Budget: {study.budget}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-emerald-400 font-bold text-sm">{study.box_office}</div>
                    {activeCaseStudy === index ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
                  </div>
                </button>

                {activeCaseStudy === index && (
                  <div className="p-5 pt-0 border-t border-slate-800/30">
                    <div className="mb-4">
                      <div className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">Genre Strategy</div>
                      <p className="text-slate-300 text-sm">{study.genre_strategy}</p>
                    </div>

                    <div className="mb-4">
                      <div className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">Key Insights</div>
                      <ul className="space-y-1">
                        {study.key_insights.map((insight, insightIndex) => (
                          <li key={insightIndex} className="text-slate-400 text-xs flex items-start gap-2">
                            <span className="text-emerald-400 mt-0.5">&#8226;</span> {insight}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {study.audience_reach && (
                      <div className="mb-4">
                        <div className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">Audience Reach</div>
                        <div className="grid grid-cols-3 gap-2">
                          {Object.entries(study.audience_reach).map(([region, score]) => (
                            <div key={region} className="bg-slate-900/40 rounded-lg p-2">
                              <div className="text-white font-bold text-sm">{score}%</div>
                              <div className="text-slate-500 text-[10px]">{region}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                      <div className="text-amber-400 text-xs font-semibold mb-1">Key Takeaway</div>
                      <p className="text-amber-200/80 text-sm italic">{study.lesson}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectorSuite;
