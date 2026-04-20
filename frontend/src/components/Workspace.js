import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";
import { Save, Trash2, FileText, Layers, StickyNote, Plus, X } from "lucide-react";
import { cinesignalLocal } from "@/lib/cinesignalLocal";

const Workspace = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("simulations");
  const [simulations, setSimulations] = useState([]);
  const [comparisons, setComparisons] = useState([]);
  const [notes, setNotes] = useState([]);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkspace();
  }, [user]);

  const fetchWorkspace = async () => {
    try {
      const [simsRes, compsRes, notesRes] = await Promise.all([
        cinesignalLocal.getSimulations(),
        cinesignalLocal.getComparisons(),
        cinesignalLocal.getNotes(),
      ]);
      setSimulations(simsRes);
      setComparisons(compsRes);
      setNotes(notesRes);
    } catch (err) {
      console.error("Workspace error:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteSimulation = async (simId) => {
    try {
      await cinesignalLocal.deleteSimulation(simId);
      setSimulations(simulations.filter(s => s.sim_id !== simId));
    } catch (err) { console.error(err); }
  };

  const deleteComparison = async (compId) => {
    try {
      await cinesignalLocal.deleteComparison(compId);
      setComparisons(comparisons.filter(c => c.comp_id !== compId));
    } catch (err) { console.error(err); }
  };

  const createNote = async () => {
    if (!noteTitle.trim()) return;
    try {
      await cinesignalLocal.createNote({ title: noteTitle, content: noteContent, category: "general" });
      setNoteTitle(""); setNoteContent(""); setShowNoteForm(false);
      fetchWorkspace();
    } catch (err) { console.error(err); }
  };

  const deleteNote = async (noteId) => {
    try {
      await cinesignalLocal.deleteNote(noteId);
      setNotes(notes.filter(n => n.note_id !== noteId));
    } catch (err) { console.error(err); }
  };

  const tabs = [
    { id: "simulations", label: "Simulations", icon: FileText, count: simulations.length },
    { id: "comparisons", label: "Comparisons", icon: Layers, count: comparisons.length },
    { id: "notes", label: "Notes", icon: StickyNote, count: notes.length }
  ];

  return (
    <div data-testid="workspace-view">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Your Workspace</h2>
          <p className="text-slate-500 mt-1">{user ? `Welcome back, ${user.name || user.email}` : "Local browser workspace for this Netlify deployment"}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === id ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" : "text-slate-500 hover:text-slate-300 bg-slate-800/40"
            }`}
            data-testid={`workspace-tab-${id}`}
          >
            <Icon size={14} /> {label} <span className="text-xs opacity-60">({count})</span>
          </button>
        ))}
      </div>

      {loading ? <div className="text-white">Loading...</div> : (
        <>
          {/* Simulations */}
          {activeTab === "simulations" && (
            <div className="space-y-3">
              {simulations.length === 0 ? (
                <div className="text-center py-12 text-slate-500">No saved simulations yet. Run a simulation and save it!</div>
              ) : simulations.map(sim => (
                <div key={sim.sim_id} className="bg-[#111827]/80 rounded-xl border border-slate-800/40 p-4 flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold text-sm">{sim.title}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{sim.concept?.genres?.join(" + ")} &middot; Score: {sim.prediction?.overall_score}</div>
                    {sim.notes && <div className="text-slate-600 text-xs mt-1 italic">{sim.notes}</div>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-amber-400 font-black text-lg">{sim.prediction?.overall_score}</span>
                    <button onClick={() => deleteSimulation(sim.sim_id)} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comparisons */}
          {activeTab === "comparisons" && (
            <div className="space-y-3">
              {comparisons.length === 0 ? (
                <div className="text-center py-12 text-slate-500">No saved comparisons yet.</div>
              ) : comparisons.map(comp => (
                <div key={comp.comp_id} className="bg-[#111827]/80 rounded-xl border border-slate-800/40 p-4 flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold text-sm">{comp.title}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{comp.concepts?.length || 0} concepts compared</div>
                  </div>
                  <button onClick={() => deleteComparison(comp.comp_id)} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          )}

          {/* Notes */}
          {activeTab === "notes" && (
            <div>
              <button
                onClick={() => setShowNoteForm(!showNoteForm)}
                className="mb-4 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 px-4 py-2 rounded-lg text-sm flex items-center gap-2 border border-amber-500/20"
                data-testid="add-note-button"
              >
                {showNoteForm ? <X size={14} /> : <Plus size={14} />} {showNoteForm ? "Cancel" : "New Note"}
              </button>

              {showNoteForm && (
                <div className="bg-[#111827]/80 rounded-xl border border-amber-500/20 p-4 mb-4">
                  <input
                    value={noteTitle}
                    onChange={e => setNoteTitle(e.target.value)}
                    placeholder="Note title..."
                    className="w-full bg-slate-800/80 text-white border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    data-testid="note-title-input"
                  />
                  <textarea
                    value={noteContent}
                    onChange={e => setNoteContent(e.target.value)}
                    placeholder="Write your note..."
                    rows={4}
                    className="w-full bg-slate-800/80 text-white border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                    data-testid="note-content-input"
                  />
                  <button onClick={createNote} className="bg-amber-500 text-black font-semibold px-4 py-2 rounded-lg text-sm" data-testid="save-note-button">Save Note</button>
                </div>
              )}

              <div className="space-y-3">
                {notes.length === 0 && !showNoteForm ? (
                  <div className="text-center py-12 text-slate-500">No notes yet. Create your first note!</div>
                ) : notes.map(note => (
                  <div key={note.note_id} className="bg-[#111827]/80 rounded-xl border border-slate-800/40 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-white font-semibold text-sm">{note.title}</div>
                        <div className="text-slate-400 text-xs mt-1 whitespace-pre-wrap">{note.content}</div>
                        <div className="text-slate-600 text-[10px] mt-2">{new Date(note.created_at).toLocaleDateString()}</div>
                      </div>
                      <button onClick={() => deleteNote(note.note_id)} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Workspace;
