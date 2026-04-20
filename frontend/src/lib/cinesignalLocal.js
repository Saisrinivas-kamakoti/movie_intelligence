const GENRES = [
  "Action", "Drama", "Comedy", "Thriller", "Romance",
  "Horror", "Sci-Fi", "Fantasy", "Crime", "Mystery",
  "Family", "Musical", "Historical", "Biographical", "Social",
];

const TONES = ["Dark", "Light", "Dramatic", "Action-Packed", "Emotional", "Suspenseful", "Humorous"];
const BUDGET_TIERS = ["Low (<30Cr)", "Medium (30-100Cr)", "High (100Cr+)"];
const RELEASE_TYPES = ["Theatrical", "OTT", "Hybrid"];
const LANGUAGES = ["Hindi", "Tamil", "Telugu", "Malayalam", "Kannada", "English", "Bengali", "Marathi", "Punjabi", "Gujarati", "Assamese", "Odia"];
const REGIONS = ["North India", "South India", "Pan-India", "Global"];

const MOVIES = [
  { id: "rrr", title: "RRR", genres: ["Action", "Drama", "Historical"], primary_genre: "Action", language: "Telugu", region: "Pan-India", year: 2022, box_office_cr: 1200, box_office_score: 96, ott_score: 95, combined_score: 95.5 },
  { id: "pathaan", title: "Pathaan", genres: ["Action", "Thriller"], primary_genre: "Action", language: "Hindi", region: "Pan-India", year: 2023, box_office_cr: 1050, box_office_score: 94, ott_score: 88, combined_score: 91 },
  { id: "jawan", title: "Jawan", genres: ["Action", "Thriller", "Drama"], primary_genre: "Action", language: "Hindi", region: "Pan-India", year: 2023, box_office_cr: 1150, box_office_score: 95, ott_score: 92, combined_score: 93.5 },
  { id: "bahubali2", title: "Baahubali 2", genres: ["Action", "Drama", "Fantasy"], primary_genre: "Action", language: "Telugu", region: "Pan-India", year: 2017, box_office_cr: 1810, box_office_score: 99, ott_score: 98, combined_score: 98.5 },
  { id: "kgf2", title: "KGF Chapter 2", genres: ["Action", "Crime", "Drama"], primary_genre: "Action", language: "Kannada", region: "Pan-India", year: 2022, box_office_cr: 1250, box_office_score: 97, ott_score: 90, combined_score: 93.5 },
  { id: "dangal", title: "Dangal", genres: ["Biographical", "Drama", "Social"], primary_genre: "Biographical", language: "Hindi", region: "Pan-India", year: 2016, box_office_cr: 2100, box_office_score: 99, ott_score: 85, combined_score: 92 },
  { id: "andhadhun", title: "Andhadhun", genres: ["Thriller", "Crime", "Mystery"], primary_genre: "Thriller", language: "Hindi", region: "North India", year: 2018, box_office_cr: 95, box_office_score: 71, ott_score: 92, combined_score: 81.5 },
  { id: "kantara", title: "Kantara", genres: ["Action", "Thriller", "Drama"], primary_genre: "Action", language: "Kannada", region: "Pan-India", year: 2022, box_office_cr: 400, box_office_score: 82, ott_score: 88, combined_score: 85 },
  { id: "tumbbad", title: "Tumbbad", genres: ["Horror", "Fantasy", "Thriller"], primary_genre: "Horror", language: "Hindi", region: "Pan-India", year: 2018, box_office_cr: 18, box_office_score: 55, ott_score: 95, combined_score: 75 },
  { id: "vikram", title: "Vikram", genres: ["Action", "Thriller"], primary_genre: "Action", language: "Tamil", region: "South India", year: 2022, box_office_cr: 435, box_office_score: 83, ott_score: 82, combined_score: 82.5 },
  { id: "96", title: "96", genres: ["Romance", "Drama"], primary_genre: "Romance", language: "Tamil", region: "South India", year: 2018, box_office_cr: 45, box_office_score: 63, ott_score: 90, combined_score: 76.5 },
  { id: "article15", title: "Article 15", genres: ["Crime", "Drama", "Social"], primary_genre: "Crime", language: "Hindi", region: "North India", year: 2019, box_office_cr: 65, box_office_score: 66, ott_score: 88, combined_score: 77 },
  { id: "avatar2", title: "Avatar 2", genres: ["Sci-Fi", "Action", "Fantasy"], primary_genre: "Sci-Fi", language: "English", region: "Global", year: 2022, box_office_cr: 2320, box_office_score: 99, ott_score: 92, combined_score: 95.5 },
  { id: "oppenheimer", title: "Oppenheimer", genres: ["Biographical", "Drama", "Historical"], primary_genre: "Biographical", language: "English", region: "Global", year: 2023, box_office_cr: 952, box_office_score: 93, ott_score: 82, combined_score: 87.5 },
  { id: "everything", title: "Everything Everywhere All at Once", genres: ["Sci-Fi", "Comedy", "Drama"], primary_genre: "Sci-Fi", language: "English", region: "Global", year: 2022, box_office_cr: 140, box_office_score: 72, ott_score: 95, combined_score: 83.5 },
];

const DIRECTOR_PRESETS = [
  {
    id: "rajamouli_epic",
    director: "S.S. Rajamouli",
    style: "Epic Visual Storytelling",
    concept: { genres: ["Action", "Drama", "Historical"], tone: "Dramatic", budget_tier: "High (100Cr+)", release_type: "Theatrical", language: "Telugu", star_power: 9, novelty_factor: 9, family_appeal: 8 },
    reference_movies: ["Baahubali 2", "RRR"],
    description: "Grand visual spectacles with deep emotional storytelling and pan-India scale.",
  },
  {
    id: "hirani_heartfelt",
    director: "Rajkumar Hirani",
    style: "Heartfelt Social Comedy",
    concept: { genres: ["Comedy", "Drama", "Social"], tone: "Humorous", budget_tier: "Medium (30-100Cr)", release_type: "Theatrical", language: "Hindi", star_power: 8, novelty_factor: 7, family_appeal: 9 },
    reference_movies: ["3 Idiots", "PK"],
    description: "Social commentary wrapped in emotional, family-friendly comedy.",
  },
  {
    id: "nolan_cerebral",
    director: "Christopher Nolan",
    style: "Cerebral Spectacle",
    concept: { genres: ["Sci-Fi", "Thriller", "Drama"], tone: "Dark", budget_tier: "High (100Cr+)", release_type: "Theatrical", language: "English", star_power: 9, novelty_factor: 10, family_appeal: 5 },
    reference_movies: ["Interstellar", "Inception", "Oppenheimer"],
    description: "High-concept spectacle supported by precision, scale, and intellectual hooks.",
  },
  {
    id: "sriram_thriller",
    director: "Sriram Raghavan",
    style: "Neo-Noir Thriller",
    concept: { genres: ["Thriller", "Crime", "Mystery"], tone: "Suspenseful", budget_tier: "Medium (30-100Cr)", release_type: "Hybrid", language: "Hindi", star_power: 7, novelty_factor: 9, family_appeal: 4 },
    reference_movies: ["Andhadhun", "Badlapur"],
    description: "Twisty narrative design with dark humor and high replay value.",
  },
];

const CASE_STUDIES = [
  {
    title: "RRR - The Pan-India Revolution",
    year: 2022,
    genres: ["Action", "Drama", "Historical"],
    budget: "550 Crore",
    box_office: "1200 Crore",
    genre_strategy: "Action as spine, drama as heart, historical framing as mythic scale.",
    key_insights: [
      "Two-star synergy widened theatrical pull.",
      "Emotion clarified the spectacle.",
      "Music became a separate marketing engine.",
    ],
    audience_reach: { "North India": 85, "South India": 95, Global: 78 },
    lesson: "Universal emotion wrapped in cultural specificity can travel.",
  },
  {
    title: "Tumbbad - The Sleeper Hit",
    year: 2018,
    genres: ["Horror", "Fantasy", "Thriller"],
    budget: "15 Crore",
    box_office: "18 Crore theatrical, strong OTT afterlife",
    genre_strategy: "Folk horror hook, fantasy world-building, thriller momentum.",
    key_insights: [
      "Originality outlived the opening weekend.",
      "Mythic texture boosted discovery on streaming.",
      "Word of mouth rewarded craft and novelty.",
    ],
    audience_reach: { India: 70, "OTT Global": 95, "Youth Viewers": 88 },
    lesson: "Streaming can turn riskier world-building into long-tail success.",
  },
];

const STORAGE_KEYS = {
  authUser: "cinesignal-auth-user",
  feedback: "cinesignal-feedback",
  notes: "cinesignal-notes",
  simulations: "cinesignal-simulations",
  comparisons: "cinesignal-comparisons",
};

const genreBaseScores = {
  Action: 82, Drama: 80, Thriller: 78, Comedy: 75, Romance: 72,
  Horror: 70, "Sci-Fi": 68, Fantasy: 66, Crime: 76, Mystery: 74,
  Family: 73, Musical: 67, Historical: 72, Biographical: 74, Social: 78,
};

const toneBaseScores = {
  Dramatic: 75, "Action-Packed": 78, Emotional: 72, Dark: 68,
  Light: 70, Suspenseful: 76, Humorous: 74,
};

const budgetBaseScores = {
  "Low (<30Cr)": 70,
  "Medium (30-100Cr)": 75,
  "High (100Cr+)": 80,
};

const releaseBaseScores = {
  Theatrical: 75,
  OTT: 78,
  Hybrid: 80,
};

const readStorage = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

const wait = (value) => new Promise((resolve) => setTimeout(() => resolve(value), 120));

const average = (values) => (values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0);

const findSimilarMovies = (genres) =>
  MOVIES
    .map((movie) => {
      const overlap = movie.genres.filter((genre) => genres.includes(genre)).length;
      return overlap
        ? { title: movie.title, genres: movie.genres, score: movie.combined_score, box_office: movie.box_office_cr, similarity: Math.round((overlap / Math.max(genres.length, movie.genres.length)) * 100) }
        : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.similarity - a.similarity || b.score - a.score)
    .slice(0, 5);

const identifyAudience = (genres, tone, familyAppeal) => {
  const groups = new Set();
  if (genres.some((genre) => ["Action", "Thriller"].includes(genre))) groups.add("Youth (18-35)");
  if (genres.some((genre) => ["Drama", "Social", "Biographical"].includes(genre))) groups.add("Families");
  if (familyAppeal >= 7) groups.add("Families");
  if (tone === "Suspenseful" || tone === "Dark") groups.add("Streaming-First");
  if (genres.some((genre) => ["Action", "Crime", "Sci-Fi"].includes(genre))) groups.add("Metros");
  if (genres.some((genre) => ["Drama", "Family", "Social"].includes(genre))) groups.add("Tier-2 Cities");
  return Array.from(groups).slice(0, 4);
};

const identifyRisks = (concept, overallScore) => {
  const risks = [];
  if (overallScore < 65) risks.push("Overall market appeal is still below a safe commercial threshold.");
  if (concept.star_power < 5 && concept.budget_tier === "High (100Cr+)") risks.push("High budget with limited star power increases recovery risk.");
  if (concept.novelty_factor < 5) risks.push("Low novelty may make the concept feel familiar in a crowded slate.");
  if (concept.genres.length > 2) risks.push("The genre blend may need a clearer hierarchy to avoid tonal confusion.");
  return risks.length ? risks.slice(0, 3) : ["No major structural risks detected in the current concept setup."];
};

const getSuccessLabel = (score) => {
  if (score >= 85) return "Blockbuster Potential";
  if (score >= 75) return "Strong Commercial Viability";
  if (score >= 65) return "Moderate Success Likely";
  if (score >= 55) return "Niche Appeal";
  return "High Risk";
};

const calculateConceptPrediction = (concept) => {
  const genres = concept.genres || [];
  const genreScore = average(genres.map((genre) => genreBaseScores[genre] || 62)) || 60;
  const toneScore = Math.min(100, (toneBaseScores[concept.tone] || 70) + (concept.tone === "Action-Packed" && genres.includes("Action") ? 8 : 0) + (concept.tone === "Suspenseful" && genres.includes("Thriller") ? 8 : 0));
  const budgetScore = Math.min(100, (budgetBaseScores[concept.budget_tier] || 70) + (concept.budget_tier === "Low (<30Cr)" && genres.some((genre) => ["Drama", "Thriller", "Horror"].includes(genre)) ? 6 : 0));
  const releaseScore = Math.min(100, (releaseBaseScores[concept.release_type] || 75) + (concept.release_type === "OTT" && genres.some((genre) => ["Thriller", "Drama", "Mystery", "Horror"].includes(genre)) ? 8 : 0));
  const starScore = concept.star_power * 10;
  const noveltyScore = concept.novelty_factor * 10;
  const familyScore = concept.family_appeal * 10;

  const overallScore = (genreScore * 0.25) + (toneScore * 0.1) + (budgetScore * 0.1) + (releaseScore * 0.1) + (starScore * 0.15) + (noveltyScore * 0.15) + (familyScore * 0.15);
  const indiaFit = Math.min(100, 68 + genres.filter((genre) => ["Action", "Drama", "Social", "Comedy", "Biographical", "Romance"].includes(genre)).length * 5 + (["Hindi", "Tamil", "Telugu"].includes(concept.language) ? 10 : 4));
  const globalFit = Math.min(100, 64 + genres.filter((genre) => ["Action", "Sci-Fi", "Thriller", "Fantasy", "Horror"].includes(genre)).length * 6 + (concept.language === "English" ? 15 : 5));
  const theatricalPotential = Math.min(100, overallScore * 0.72 + concept.star_power * 2.5 + (genres.some((genre) => ["Action", "Fantasy", "Historical"].includes(genre)) ? 8 : 0));
  const ottPotential = Math.min(100, overallScore * 0.8 + concept.novelty_factor * 2 + (genres.some((genre) => ["Thriller", "Drama", "Mystery", "Horror"].includes(genre)) ? 9 : 0));
  const confidence = genres.length >= 2 && concept.novelty_factor >= 6 ? "High" : concept.genres.length ? "Medium" : "Low";
  const estimatedBudgetCr = concept.budget_tier === "High (100Cr+)" ? 150 : concept.budget_tier === "Low (<30Cr)" ? 18 : 60;
  const estimatedTheatricalCr = Math.round(estimatedBudgetCr * (theatricalPotential / 40));
  const estimatedOttValueCr = Math.round(estimatedBudgetCr * (ottPotential / 150));
  const estimatedTotalRevenueCr = estimatedTheatricalCr + estimatedOttValueCr;
  const estimatedRoiPct = Math.round(((estimatedTotalRevenueCr - estimatedBudgetCr) / estimatedBudgetCr) * 100);
  const recommendations = [];
  if (indiaFit > globalFit + 10) recommendations.push("Prioritize India-first marketing and local emotional cues in the pitch.");
  else if (globalFit > indiaFit + 10) recommendations.push("Package the idea for export with a cleaner universal hook and premium visual promise.");
  else recommendations.push("This concept can be positioned as a balanced pan-India and streaming crossover play.");
  if (concept.release_type === "OTT") recommendations.push("Strengthen retention with sharper act breaks, reveals, and stronger episodic momentum.");
  if (concept.release_type === "Theatrical") recommendations.push("Protect two or three trailer-worthy cinematic spikes that justify a big-screen window.");
  if (concept.novelty_factor < 6) recommendations.push("Sharpen what feels new about the premise so the market hook is clearer.");
  if (concept.genres.length === 1) recommendations.push("A complementary support genre may broaden appeal without breaking tonal clarity.");
  if (["Tamil", "Telugu", "Malayalam", "Kannada"].includes(concept.language)) recommendations.push("Plan dubbed marketing materials for pan-India scale.");

  return {
    overall_score: Math.round(overallScore * 10) / 10,
    label: getSuccessLabel(overallScore),
    confidence,
    market_scores: {
      india_fit: Math.round(indiaFit * 10) / 10,
      global_fit: Math.round(globalFit * 10) / 10,
      theatrical_potential: Math.round(theatricalPotential * 10) / 10,
      ott_potential: Math.round(ottPotential * 10) / 10,
    },
    component_scores: {
      genre_resonance: Math.round(genreScore * 10) / 10,
      tone_fit: Math.round(toneScore * 10) / 10,
      budget_efficiency: Math.round(budgetScore * 10) / 10,
      release_strategy: Math.round(releaseScore * 10) / 10,
      star_appeal: starScore,
      novelty_factor: noveltyScore,
      family_appeal: familyScore,
    },
    recommendations: recommendations.slice(0, 5),
    similar_successful_movies: findSimilarMovies(genres),
    target_audience: identifyAudience(genres, concept.tone, concept.family_appeal),
    risk_factors: identifyRisks(concept, overallScore),
    neural_network: {
      nn_score: Math.round(((overallScore * 0.92) + (concept.novelty_factor * 3) + (concept.star_power * 2)) * 10) / 10,
      confidence,
    },
    roi_estimate: {
      estimated_budget_cr: estimatedBudgetCr,
      estimated_theatrical_cr: estimatedTheatricalCr,
      estimated_ott_value_cr: estimatedOttValueCr,
      estimated_total_revenue_cr: estimatedTotalRevenueCr,
      estimated_roi_pct: estimatedRoiPct,
      breakeven_point_cr: Math.round(estimatedBudgetCr * 2.2),
      risk_level: overallScore >= 78 ? "Low" : overallScore >= 65 ? "Medium" : "High",
    },
  };
};

const computeGenrePerformance = () => {
  return GENRES.map((genre) => {
    const subset = MOVIES.filter((movie) => movie.genres.includes(genre));
    return {
      genre,
      box_office: Math.round(average(subset.map((movie) => movie.box_office_score)) * 10) / 10 || 0,
      ott: Math.round(average(subset.map((movie) => movie.ott_score)) * 10) / 10 || 0,
      combined: Math.round(average(subset.map((movie) => movie.combined_score)) * 10) / 10 || 0,
      count: subset.length,
    };
  }).sort((a, b) => b.combined - a.combined);
};

const computeTrends = (years = 8) => {
  const currentYear = Math.max(...MOVIES.map((movie) => movie.year));
  const start = currentYear - years + 1;
  const results = [];
  for (let year = start; year <= currentYear; year += 1) {
    const yearMovies = MOVIES.filter((movie) => movie.year === year);
    if (yearMovies.length) results.push({ year, avg_score: Math.round(average(yearMovies.map((movie) => movie.combined_score)) * 10) / 10, count: yearMovies.length });
  }
  return results;
};

const computeRegional = () =>
  REGIONS.map((region) => {
    const regionMovies = MOVIES.filter((movie) => movie.region === region);
    const genres = {};
    regionMovies.forEach((movie) => {
      genres[movie.primary_genre] = genres[movie.primary_genre] || [];
      genres[movie.primary_genre].push(movie.combined_score);
    });
    const averagedGenres = Object.fromEntries(Object.entries(genres).map(([genre, scores]) => [genre, Math.round(average(scores) * 10) / 10]));
    return { region, genres: averagedGenres, avg_score: Math.round(average(regionMovies.map((movie) => movie.combined_score)) * 10) / 10 };
  }).filter((region) => Object.keys(region.genres).length);

const audienceSegments = {
  metros: ["Action", "Thriller", "Sci-Fi"],
  tier2: ["Drama", "Social", "Family"],
  youth: ["Action", "Romance", "Comedy"],
  families: ["Drama", "Comedy", "Family"],
  streaming_first: ["Thriller", "Mystery", "Horror"],
};

const computeGenreCombinations = () => {
  const map = new Map();
  MOVIES.forEach((movie) => {
    if (movie.genres.length < 2) return;
    const key = movie.genres.slice(0, 2).sort().join("|");
    const current = map.get(key) || { scores: [], count: 0 };
    current.scores.push(movie.combined_score);
    current.count += 1;
    map.set(key, current);
  });
  return Array.from(map.entries()).map(([key, value]) => ({
    genres: key.split("|"),
    avg_score: Math.round(average(value.scores) * 10) / 10,
    count: value.count,
  })).sort((a, b) => b.avg_score - a.avg_score);
};

const analyzeDirectorIdea = (payload) => {
  const genreText = `${payload.target_genre || ""} ${payload.concept_text || ""}`.toLowerCase();
  const guessedGenres = GENRES.filter((genre) => genreText.includes(genre.toLowerCase())).slice(0, 3);
  const concept = {
    genres: guessedGenres.length ? guessedGenres : [payload.target_genre || "Drama", "Thriller"].slice(0, 2),
    tone: genreText.includes("funny") ? "Humorous" : genreText.includes("dark") ? "Dark" : genreText.includes("mystery") ? "Suspenseful" : "Dramatic",
    budget_tier: payload.budget_tier,
    release_type: payload.release_type,
    language: payload.preferred_language,
    star_power: payload.star_power,
    novelty_factor: Math.max(5, Math.min(9, 5 + ["myth", "future", "ritual", "parallel", "folk"].filter((token) => genreText.includes(token)).length)),
    family_appeal: genreText.includes("family") ? 8 : 6,
  };
  const prediction = calculateConceptPrediction(concept);
  return {
    mode: payload.mode,
    parsed_concept: {
      summary: (payload.concept_text || `${payload.target_genre} idea`).slice(0, 220),
      genres: concept.genres,
      tone: concept.tone,
      market_positioning: prediction.market_scores.india_fit >= prediction.market_scores.global_fit ? "India-first market shape with strong local resonance." : "International crossover positioning with premium packaging potential.",
    },
    prediction,
    development_notes: {
      strengths: [
        `The current story spine leans toward ${concept.genres[0]}, which already has visible demand in the model.`,
        `The concept currently maps to ${prediction.label.toLowerCase()} with ${prediction.confidence.toLowerCase()} confidence.`,
      ],
      improvement_moves: [
        "Clarify the protagonist, core conflict, and emotional payoff in one sentence.",
        "Keep only one primary genre and one support genre active in the pitch.",
        prediction.market_scores.ott_potential > prediction.market_scores.theatrical_potential ? "Strengthen reveal design and retention turns for streaming audiences." : "Design two major theatrical moments that sell scale in trailers.",
      ],
      budget_adjustments: [
        `This concept currently fits best in the ${concept.budget_tier} lane.`,
        concept.budget_tier === "High (100Cr+)" ? "Consolidate spectacle into fewer premium set pieces instead of constant spending." : "Lean on writing, casting precision, and location texture before spending on scale.",
        concept.release_type === "OTT" ? "Prioritize performance and mood over oversized action beats." : "Reserve spend for interval moments, songs, or action peaks that help opening weekend.",
      ],
      mix_pattern_score: {
        signal: concept.genres.length > 2 ? "Potentially rich but needs tonal control" : "Clean commercial mix",
        score: prediction.overall_score,
        reason: `The blend of ${concept.genres.join(" + ")} maps to ${prediction.label.toLowerCase()} in the predictor.`,
      },
      pitch_packaging: {
        greenlight_hook: `${concept.genres.join(" + ")} concept with ${prediction.label.toLowerCase()} and clear ${concept.release_type.toLowerCase()} positioning.`,
        positioning_guidance: "Lead with audience promise, genre hierarchy, and budget discipline.",
        risk_flags: prediction.risk_factors,
        window_recommendation: prediction.market_scores.ott_potential > prediction.market_scores.theatrical_potential ? "OTT-first" : "Theatrical-first",
      },
    },
    inspiration_map: {
      books: concept.genres.includes("Thriller") ? ["Gone Girl", "The Devotion of Suspect X"] : ["The Namesake", "The Hero With a Thousand Faces"],
      folklores: concept.genres.includes("Horror") ? ["Andhra spirit folklore", "Temple-town legends"] : ["Rayalaseema ballads", "Regional family oral histories"],
      cultures: ["Festival rituals", "Small-town aspirations", "Regional identity politics"],
      film_references: findSimilarMovies(concept.genres).map((movie) => movie.title).slice(0, 4),
    },
    locations: [
      { place: "Madanapalle and Chittoor belt", fit: "Grounded emotional texture and lower shooting overhead.", budget: "Cost-effective regional identity." },
      { place: "Hyderabad production corridors", fit: "Practical access to crews, set builds, and urban drama environments.", budget: "Efficient for controlled schedules." },
    ],
    director_kpis: [
      { name: "Hook clarity", why_it_matters: "Studios want the trailer promise to be obvious in one line." },
      { name: "Genre discipline", why_it_matters: "New directors are judged on how cleanly they control tone and audience expectation." },
      { name: "Character payoff", why_it_matters: "Emotional payoff matters more than idea complexity in audience recall." },
      { name: "Budget-to-screen value", why_it_matters: "Every major spend should show up visibly on screen." },
      { name: "Audience retention", why_it_matters: "Dead middle sections hurt both theatrical word of mouth and OTT completion." },
      { name: "Cultural specificity", why_it_matters: "Authentic detail increases originality and market differentiation." },
    ],
    story_directions: payload.mode === "generate" ? [
      { title: `${payload.target_genre} direction 1`, logline: "A tightly framed character-driven concept built around a culturally rooted conflict with commercial stakes.", language_note: `Could be developed in ${payload.preferred_language} with local specificity.` },
      { title: `${payload.target_genre} direction 2`, logline: "A market-friendly variation with a stronger emotional hook and cleaner release positioning.", language_note: `Useful if you want a more studio-friendly version in ${payload.preferred_language}.` },
    ] : undefined,
  };
};

const createPitchBrief = (concept, prediction) => {
  const lines = [
    "CineSignal Pitch Brief",
    "",
    `Genres: ${concept.genres.join(" + ")}`,
    `Tone: ${concept.tone}`,
    `Budget: ${concept.budget_tier}`,
    `Release: ${concept.release_type}`,
    `Language: ${concept.language}`,
    "",
    `Overall Score: ${prediction.overall_score}`,
    `Label: ${prediction.label}`,
    `India Fit: ${prediction.market_scores.india_fit}`,
    `Global Fit: ${prediction.market_scores.global_fit}`,
    `OTT Potential: ${prediction.market_scores.ott_potential}`,
    "",
    "Recommendations:",
    ...prediction.recommendations.map((item) => `- ${item}`),
  ];
  return new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
};

export const cinesignalLocal = {
  getMetadata: async () => wait({
    genres: GENRES,
    tones: TONES,
    budget_tiers: BUDGET_TIERS,
    release_types: RELEASE_TYPES,
    languages: LANGUAGES,
    regions: REGIONS,
    director_lab_modes: ["analyze", "generate"],
  }),

  getStats: async () => wait({
    total_movies: MOVIES.length,
    avg_score: Math.round(average(MOVIES.map((movie) => movie.combined_score)) * 10) / 10,
    database_mode: "browser-local",
    features: ["simulator", "analytics", "director_presets", "idea_lab", "comparison", "workspace"],
  }),

  simulateConcept: async (concept) => wait(calculateConceptPrediction(concept)),
  getGenrePerformance: async () => wait({ data: computeGenrePerformance() }),
  getTrends: async (years = 8) => wait({ data: computeTrends(years) }),
  getGenreCombinations: async () => wait({ patterns: computeGenreCombinations() }),
  getRegionalAnalysis: async () => wait({ data: computeRegional() }),
  getAudienceInsights: async () => wait({ segments: audienceSegments }),
  getTopMovies: async (limit = 10) => wait({ top_movies: [...MOVIES].sort((a, b) => b.combined_score - a.combined_score).slice(0, limit) }),
  getDirectorPresets: async () => wait({ presets: DIRECTOR_PRESETS }),
  testDirectorPreset: async (presetId) => {
    const preset = DIRECTOR_PRESETS.find((item) => item.id === presetId);
    const prediction = calculateConceptPrediction(preset.concept);
    return wait({
      director: preset.director,
      style: preset.style,
      concept: preset.concept,
      prediction,
      reference_movies: preset.reference_movies,
      description: preset.description,
    });
  },
  getCaseStudies: async () => wait({ case_studies: CASE_STUDIES }),
  compareConcepts: async (concepts) => {
    const comparisons = concepts.map((concept) => ({ concept, prediction: calculateConceptPrediction(concept) }))
      .sort((a, b) => b.prediction.overall_score - a.prediction.overall_score)
      .map((item, index) => ({ ...item, rank: index + 1 }));
    return wait({ comparisons });
  },
  analyzeDirectorIdea: async (payload) => wait(analyzeDirectorIdea(payload)),
  submitFeedback: async ({ concept, prediction, rating, comments }) => {
    const existing = readStorage(STORAGE_KEYS.feedback, []);
    existing.unshift({ id: `fb-${Date.now()}`, concept, prediction, rating, comments, created_at: new Date().toISOString() });
    writeStorage(STORAGE_KEYS.feedback, existing.slice(0, 100));
    return wait({ ok: true });
  },
  exportPitchDeck: async (concept, prediction) => wait(createPitchBrief(concept, prediction)),
  getCurrentUser: async () => wait(readStorage(STORAGE_KEYS.authUser, null)),
  register: async ({ email, name }) => {
    const user = { user_id: `local-${Date.now()}`, email, name, auth_type: "local" };
    writeStorage(STORAGE_KEYS.authUser, user);
    return wait(user);
  },
  login: async ({ email }) => {
    const existing = readStorage(STORAGE_KEYS.authUser, null);
    const user = existing?.email === email ? existing : { user_id: `local-${Date.now()}`, email, name: email.split("@")[0], auth_type: "local" };
    writeStorage(STORAGE_KEYS.authUser, user);
    return wait(user);
  },
  logout: async () => {
    window.localStorage.removeItem(STORAGE_KEYS.authUser);
    return wait(true);
  },
  saveSimulation: async ({ title, concept, prediction, notes }) => {
    const existing = readStorage(STORAGE_KEYS.simulations, []);
    existing.unshift({ sim_id: `sim-${Date.now()}`, title, concept, prediction, notes: notes || "", created_at: new Date().toISOString() });
    writeStorage(STORAGE_KEYS.simulations, existing.slice(0, 50));
    return wait({ ok: true });
  },
  getSimulations: async () => wait(readStorage(STORAGE_KEYS.simulations, [])),
  deleteSimulation: async (simId) => {
    const next = readStorage(STORAGE_KEYS.simulations, []).filter((item) => item.sim_id !== simId);
    writeStorage(STORAGE_KEYS.simulations, next);
    return wait({ ok: true });
  },
  saveComparison: async ({ title, concepts, notes }) => {
    const existing = readStorage(STORAGE_KEYS.comparisons, []);
    existing.unshift({ comp_id: `comp-${Date.now()}`, title, concepts, notes: notes || "", created_at: new Date().toISOString() });
    writeStorage(STORAGE_KEYS.comparisons, existing.slice(0, 50));
    return wait({ ok: true });
  },
  getComparisons: async () => wait(readStorage(STORAGE_KEYS.comparisons, [])),
  deleteComparison: async (compId) => {
    const next = readStorage(STORAGE_KEYS.comparisons, []).filter((item) => item.comp_id !== compId);
    writeStorage(STORAGE_KEYS.comparisons, next);
    return wait({ ok: true });
  },
  getNotes: async () => wait(readStorage(STORAGE_KEYS.notes, [])),
  createNote: async ({ title, content, category }) => {
    const existing = readStorage(STORAGE_KEYS.notes, []);
    existing.unshift({ note_id: `note-${Date.now()}`, title, content, category, created_at: new Date().toISOString() });
    writeStorage(STORAGE_KEYS.notes, existing.slice(0, 100));
    return wait({ ok: true });
  },
  deleteNote: async (noteId) => {
    const next = readStorage(STORAGE_KEYS.notes, []).filter((item) => item.note_id !== noteId);
    writeStorage(STORAGE_KEYS.notes, next);
    return wait({ ok: true });
  },
};
