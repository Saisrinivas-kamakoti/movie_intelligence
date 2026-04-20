import { cinesignalLocal } from "@/lib/cinesignalLocal";

const trimTrailingSlash = (value = "") => value.replace(/\/+$/, "");

const apiBase = trimTrailingSlash(process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || "");
const requestedMode = (process.env.REACT_APP_DATA_MODE || "").toLowerCase();

const supportsRemote = Boolean(apiBase) && requestedMode !== "local";

const buildUrl = (path) => `${apiBase}${path}`;

const requestJson = async (path, options = {}) => {
  const response = await fetch(buildUrl(path), {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed for ${path}`);
  }

  return response.json();
};

const fallback = async (remoteCall, localCall) => {
  if (!supportsRemote) {
    return localCall();
  }

  try {
    return await remoteCall();
  } catch (error) {
    console.warn("Remote CineSignal request failed, falling back to local runtime.", error);
    return localCall();
  }
};

export const cinesignalClient = {
  getRuntimeProfile() {
    return {
      mode: supportsRemote ? "hybrid" : "local",
      backendBase: supportsRemote ? apiBase : "Browser runtime",
      persistence: supportsRemote ? "API + browser cache fallback" : "Browser local storage",
      authMode: supportsRemote ? "Backend-capable" : "Local browser account",
    };
  },

  getMetadata() {
    return fallback(
      () => requestJson("/api/metadata"),
      () => cinesignalLocal.getMetadata()
    );
  },

  getStats() {
    return fallback(
      async () => {
        const stats = await requestJson("/api/stats");
        return { ...stats, database_mode: stats.database_mode || "remote" };
      },
      async () => {
        const stats = await cinesignalLocal.getStats();
        return { ...stats, database_mode: "local-browser" };
      }
    );
  },

  simulateConcept(concept) {
    return fallback(
      () => requestJson("/api/predict", { method: "POST", body: JSON.stringify(concept) }),
      () => cinesignalLocal.simulateConcept(concept)
    );
  },

  compareConcepts(concepts) {
    return fallback(
      () => requestJson("/api/compare", { method: "POST", body: JSON.stringify({ concepts }) }),
      () => cinesignalLocal.compareConcepts(concepts)
    );
  },

  analyzeDirectorIdea(input) {
    return fallback(
      () => requestJson("/api/directors/idea-lab", { method: "POST", body: JSON.stringify(input) }),
      () => cinesignalLocal.analyzeDirectorIdea(input)
    );
  },

  exportPitchDeck(concept, prediction) {
    return cinesignalLocal.exportPitchDeck(concept, prediction);
  },

  getGenrePerformance() {
    return fallback(
      () => requestJson("/api/analytics/genres"),
      () => cinesignalLocal.getGenrePerformance()
    );
  },

  getTrends(limit) {
    return fallback(
      () => requestJson(`/api/analytics/trends?limit=${limit}`),
      () => cinesignalLocal.getTrends(limit)
    );
  },

  getGenreCombinations() {
    return fallback(
      () => requestJson("/api/analytics/combinations"),
      () => cinesignalLocal.getGenreCombinations()
    );
  },

  getRegionalAnalysis() {
    return fallback(
      () => requestJson("/api/dashboard/regional"),
      () => cinesignalLocal.getRegionalAnalysis()
    );
  },

  getAudienceInsights() {
    return fallback(
      () => requestJson("/api/dashboard/audiences"),
      () => cinesignalLocal.getAudienceInsights()
    );
  },

  getTopMovies(limit) {
    return fallback(
      () => requestJson(`/api/dashboard/top-movies?limit=${limit}`),
      () => cinesignalLocal.getTopMovies(limit)
    );
  },

  getDirectorPresets() {
    return fallback(
      () => requestJson("/api/directors/presets"),
      () => cinesignalLocal.getDirectorPresets()
    );
  },

  getCaseStudies() {
    return fallback(
      () => requestJson("/api/directors/case-studies"),
      () => cinesignalLocal.getCaseStudies()
    );
  },

  testDirectorPreset(presetId) {
    return fallback(
      () => requestJson(`/api/directors/presets/${presetId}/test`, { method: "POST" }),
      () => cinesignalLocal.testDirectorPreset(presetId)
    );
  },

  submitFeedback(payload) {
    return fallback(
      () => requestJson("/api/feedback", { method: "POST", body: JSON.stringify(payload) }),
      () => cinesignalLocal.submitFeedback(payload)
    );
  },

  getCurrentUser() {
    return cinesignalLocal.getCurrentUser();
  },

  login(payload) {
    return cinesignalLocal.login(payload);
  },

  register(payload) {
    return cinesignalLocal.register(payload);
  },

  logout() {
    return cinesignalLocal.logout();
  },

  processOAuthCallback() {
    return null;
  },

  getSimulations() {
    return cinesignalLocal.getSimulations();
  },

  saveSimulation(payload) {
    return cinesignalLocal.saveSimulation(payload);
  },

  deleteSimulation(simId) {
    return cinesignalLocal.deleteSimulation(simId);
  },

  getComparisons() {
    return cinesignalLocal.getComparisons();
  },

  deleteComparison(compId) {
    return cinesignalLocal.deleteComparison(compId);
  },

  getNotes() {
    return cinesignalLocal.getNotes();
  },

  createNote(payload) {
    return cinesignalLocal.createNote(payload);
  },

  deleteNote(noteId) {
    return cinesignalLocal.deleteNote(noteId);
  },
};
