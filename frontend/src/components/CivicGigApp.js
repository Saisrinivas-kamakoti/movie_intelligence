import React, { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  Building2,
  GraduationCap,
  HeartHandshake,
  Hospital,
  Landmark,
  MapPin,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Target,
  TrendingUp,
  Users
} from "lucide-react";

const roles = {
  "job-seeker": {
    title: "Find paid work fast while building long-term momentum.",
    description: "Move between contract work, part-time gigs, public exam preparation, and civic proof-of-work without hitting a premium wall."
  },
  institution: {
    title: "Fill urgent staffing gaps with trusted short-term talent.",
    description: "Post needs for schools, hospitals, legal teams, and local operations with faster discovery and cleaner signal."
  },
  mentor: {
    title: "Guide aspirants and professionals inside a practical ecosystem.",
    description: "Support learners with study plans, interviews, policy awareness, and real civic-facing work experience."
  },
  consultant: {
    title: "Build professional credibility through visible talent outcomes.",
    description: "Mentor, shortlist, and shape workforce readiness while strengthening your public professional brand."
  }
};

const seedOpportunities = [
  { id: 1, title: "Contract Science Teacher", sector: "Education", type: "Contract", location: "Lucknow", pay: "Rs. 28,000/month", urgency: "Immediate", summary: "Government school needs science instruction, remedial planning, and exam support." },
  { id: 2, title: "Hospital Admin Coordinator", sector: "Healthcare", type: "Part-time", location: "Pune", pay: "Rs. 240/hour", urgency: "This week", summary: "Coordinate scheduling, patient desk operations, and records movement in a public hospital." },
  { id: 3, title: "Legal Research Associate", sector: "Legal", type: "Contract", location: "Delhi", pay: "Rs. 42,000/month", urgency: "Immediate", summary: "Support documentation, legal drafting, and backlog reduction for public-interest matters." },
  { id: 4, title: "Civil Services Mentor", sector: "Government Prep", type: "Mentorship", location: "Remote", pay: "Rs. 900/session", urgency: "Open", summary: "Guide aspirants on mock interviews, answer writing, and policy understanding." },
  { id: 5, title: "Community Activation Lead", sector: "Civic Projects", type: "Part-time", location: "Hyderabad", pay: "Rs. 220/hour", urgency: "This week", summary: "Run awareness campaigns and citizen participation booths in public spaces." },
  { id: 6, title: "Contract Doctor", sector: "Healthcare", type: "Contract", location: "Jaipur", pay: "Rs. 95,000/month", urgency: "Immediate", summary: "Government hospital support for outpatient care and urgent shift coverage." },
  { id: 7, title: "Retail Floor Associate", sector: "Retail", type: "Part-time", location: "Bengaluru", pay: "Rs. 180/hour", urgency: "Open", summary: "Flexible shifts for workers needing quick income between larger career transitions." },
  { id: 8, title: "Contract Math Teacher", sector: "Education", type: "Contract", location: "Patna", pay: "Rs. 31,000/month", urgency: "This month", summary: "Fill a school vacancy while supporting foundational math readiness." }
];

const defaultRequests = [
  { id: 1, institution: "Lucknow Public School", sector: "Education", role: "Contract Math Teacher", location: "Lucknow", urgency: "Within 24 hours" },
  { id: 2, institution: "CityCare Hospital", sector: "Healthcare", role: "Emergency Shift Nurse", location: "Jaipur", urgency: "This week" },
  { id: 3, institution: "District Legal Cell", sector: "Legal", role: "Case Documentation Associate", location: "Bhopal", urgency: "This week" }
];

const studyTracks = [
  { title: "UPSC Foundation", pace: "12-week roadmap", detail: "Daily current affairs, answer writing, and mock interview rhythm." },
  { title: "SSC + Banking Reset", pace: "8-week sprint", detail: "Quant, reasoning, and speed improvement for return-to-work aspirants." },
  { title: "Public Service Readiness", pace: "Ongoing", detail: "Civic awareness, policy basics, and communication for social impact roles." }
];

const mentors = [
  { id: 1, name: "Asha Menon", focus: "Civil services interviews", slots: "6 slots this week" },
  { id: 2, name: "Dr. Rohan Verma", focus: "Healthcare staffing and admin readiness", slots: "4 slots this week" },
  { id: 3, name: "Neha Iyer", focus: "Career branding and transition strategy", slots: "5 slots this week" }
];

const missions = [
  { id: 1, title: "School Attendance Outreach", city: "Lucknow", impact: "Education", detail: "Support local campaigns that reconnect students to schools." },
  { id: 2, title: "Hospital Help Desk Drive", city: "Pune", impact: "Healthcare", detail: "Assist with patient navigation and information support." },
  { id: 3, title: "Legal Awareness Camp", city: "Bhopal", impact: "Justice", detail: "Help citizens understand basic rights and documentation needs." }
];

const feed = [
  { title: "412 candidates explored urgent roles today", tag: "Platform signal" },
  { title: "Healthcare staffing requests rose 18% this week", tag: "Demand insight" },
  { title: "Mentor circles added interview prep sessions for UPSC aspirants", tag: "Prep update" }
];

const readStorage = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const CivicGigApp = () => {
  const [activeRole, setActiveRole] = useState("job-seeker");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [tracker, setTracker] = useState({ saved: [], applied: [], interviewing: [], mentorBookings: [], joinedMissions: [] });
  const [requests, setRequests] = useState(defaultRequests);
  const [requestMessage, setRequestMessage] = useState("");

  useEffect(() => {
    setTracker(readStorage("civicgig-tracker", { saved: [], applied: [], interviewing: [], mentorBookings: [], joinedMissions: [] }));
    setRequests(readStorage("civicgig-requests", defaultRequests));
  }, []);

  useEffect(() => {
    localStorage.setItem("civicgig-tracker", JSON.stringify(tracker));
  }, [tracker]);

  useEffect(() => {
    localStorage.setItem("civicgig-requests", JSON.stringify(requests));
  }, [requests]);

  const sectors = useMemo(() => ["all", ...new Set(seedOpportunities.map((item) => item.sector))], []);

  const filteredOpportunities = useMemo(() => {
    return seedOpportunities.filter((item) => {
      const sectorMatch = sectorFilter === "all" || item.sector === sectorFilter;
      const typeMatch = typeFilter === "all" || item.type === typeFilter;
      const searchMatch =
        !search ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase()) ||
        item.sector.toLowerCase().includes(search.toLowerCase());

      return sectorMatch && typeMatch && searchMatch;
    });
  }, [sectorFilter, typeFilter, search]);

  const forecastEngine = useMemo(() => {
    const sectorsToTrack = ["Education", "Healthcare", "Legal", "Retail", "Government Prep", "Civic Projects"];

    const demandBySector = sectorsToTrack.map((sector) => {
      const liveOpportunities = seedOpportunities.filter((item) => item.sector === sector).length;
      const staffingRequests = requests.filter((item) => item.sector === sector).length;
      const savedInterest = tracker.saved.filter((item) => item.sector === sector).length;
      const appliedInterest = tracker.applied.filter((item) => item.sector === sector).length;
      const interviewSignal = tracker.interviewing.filter((item) => item.sector === sector).length;
      const missionSignal = tracker.joinedMissions.filter((item) => item.impact === sector || (sector === "Civic Projects" && item.impact === "Justice")).length;

      const demandScore =
        liveOpportunities * 9 +
        staffingRequests * 14 +
        savedInterest * 4 +
        appliedInterest * 8 +
        interviewSignal * 10 +
        missionSignal * 6;

      const forecastedOpenings = Math.max(3, Math.round(liveOpportunities * 1.3 + staffingRequests * 1.8 + appliedInterest * 0.7));
      const fillConfidence = Math.min(96, 48 + liveOpportunities * 4 + staffingRequests * 5 + appliedInterest * 6 + interviewSignal * 7);
      const trend = demandScore >= 65 ? "Surging" : demandScore >= 38 ? "Growing" : "Stable";

      return {
        sector,
        demandScore,
        forecastedOpenings,
        fillConfidence,
        trend
      };
    }).sort((a, b) => b.demandScore - a.demandScore);

    const topSector = demandBySector[0];
    const forecastSummary = activeRole === "institution"
      ? `Institutions should prioritize ${topSector.sector.toLowerCase()} talent pipelines over the next 2 weeks.`
      : `Candidates should prioritize ${topSector.sector.toLowerCase()} roles for the strongest near-term demand.`;

    const smartActions = [
      {
        title: "Demand Spike Forecast",
        text: `${topSector.sector} is projected to lead near-term activity with ${topSector.forecastedOpenings} likely openings and ${topSector.fillConfidence}% fill confidence.`
      },
      {
        title: "Readiness Recommendation",
        text: tracker.mentorBookings.length < 1
          ? "Mentor booking probability suggests users who engage with Prep Lab may convert faster into interviews."
          : "Mentor engagement is active. Prioritize interview readiness and institution matching for better conversion."
      },
      {
        title: "Supply Risk",
        text: requests.length > tracker.applied.length + tracker.interviewing.length
          ? "Institution demand is rising faster than current candidate pipeline. Add more fast-response talent onboarding."
          : "Current candidate pipeline is keeping pace with demand. Focus on fit scoring and faster shortlisting."
      }
    ];

    return { demandBySector, topSector, forecastSummary, smartActions };
  }, [activeRole, requests, tracker]);

  const profileScore = 72 + tracker.applied.length * 4 + tracker.joinedMissions.length * 3 + tracker.mentorBookings.length * 2;

  const saveOpportunity = (job) => {
    setTracker((current) => {
      if (current.saved.find((item) => item.id === job.id)) return current;
      return { ...current, saved: [job, ...current.saved] };
    });
  };

  const applyOpportunity = (job) => {
    setTracker((current) => {
      const nextSaved = current.saved.filter((item) => item.id !== job.id);
      const nextApplied = current.applied.find((item) => item.id === job.id) ? current.applied : [job, ...current.applied];
      return { ...current, saved: nextSaved, applied: nextApplied };
    });
  };

  const shortlistForInterview = (job) => {
    setTracker((current) => {
      if (current.interviewing.find((item) => item.id === job.id)) return current;
      return {
        ...current,
        applied: current.applied.filter((item) => item.id !== job.id),
        interviewing: [job, ...current.interviewing]
      };
    });
  };

  const bookMentor = (mentor) => {
    setTracker((current) => {
      if (current.mentorBookings.find((item) => item.id === mentor.id)) return current;
      return { ...current, mentorBookings: [mentor, ...current.mentorBookings] };
    });
  };

  const joinMission = (mission) => {
    setTracker((current) => {
      if (current.joinedMissions.find((item) => item.id === mission.id)) return current;
      return { ...current, joinedMissions: [mission, ...current.joinedMissions] };
    });
  };

  const clearTracker = () => {
    setTracker({ saved: [], applied: [], interviewing: [], mentorBookings: [], joinedMissions: [] });
  };

  const handleRequestSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const entry = {
      id: Date.now(),
      institution: formData.get("institutionName"),
      sector: formData.get("institutionSector"),
      role: formData.get("institutionRole"),
      location: formData.get("institutionLocation"),
      urgency: formData.get("institutionUrgency")
    };

    setRequests((current) => [entry, ...current]);
    setRequestMessage("Staffing request saved locally. Your institution board now reflects the new urgent need.");
    event.currentTarget.reset();
  };

  const renderTrackerList = (items, actionLabel, actionFn) => {
    if (!items.length) {
      return <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-4 text-sm text-slate-400">Nothing here yet.</div>;
    }

    return items.map((item) => (
      <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-semibold text-white">{item.title}</div>
            <div className="mt-1 text-xs text-slate-400">{item.sector} - {item.location}</div>
          </div>
          {actionFn && (
            <button onClick={() => actionFn(item)} className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-slate-950 transition hover:bg-amber-400">
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-[#0c111d] text-white">
      <div className="mx-auto grid min-h-screen max-w-[1500px] lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border-r border-white/10 bg-[radial-gradient(circle_at_top,#16314d,transparent_45%),#0a0f18] p-6">
          <div className="sticky top-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-lg font-black text-slate-950">CG</div>
              <div>
                <div className="font-black tracking-tight">CivicGig India</div>
                <div className="text-xs uppercase tracking-[0.25em] text-slate-500">Workforce mobility</div>
              </div>
            </div>

            <nav className="space-y-2 rounded-3xl border border-white/10 bg-white/[0.03] p-4 text-sm">
              {["Overview", "AI Forecasting", "Opportunity Hub", "Institution Desk", "Prep Lab", "Civic Missions", "Community"].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`} className="block rounded-2xl px-3 py-2 text-slate-300 transition hover:bg-white/[0.06] hover:text-white">
                  {item}
                </a>
              ))}
            </nav>

            <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5">
              <div className="text-xs uppercase tracking-[0.25em] text-emerald-300">Core Thesis</div>
              <p className="mt-3 text-sm leading-6 text-emerald-50">
                People should be able to earn quickly, prepare for government pathways, and contribute to society in one connected app.
              </p>
            </div>
          </div>
        </aside>

        <main className="px-5 py-6 sm:px-8 lg:px-10">
          <section id="overview" className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(17,37,58,0.96),rgba(14,87,80,0.72))] p-8 shadow-2xl shadow-cyan-950/30">
              <div className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">Civic Workforce Platform</div>
              <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight md:text-5xl">{roles[activeRole].title}</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200">{roles[activeRole].description}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                {Object.keys(roles).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setActiveRole(role)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeRole === role ? "bg-white text-slate-950" : "bg-white/10 text-slate-200 hover:bg-white/16"}`}
                  >
                    {role.replace("-", " ")}
                  </button>
                ))}
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-4">
                {[
                  { label: "Active gigs", value: seedOpportunities.length, icon: Briefcase },
                  { label: "Saved applications", value: tracker.saved.length + tracker.applied.length, icon: Target },
                  { label: "Mentor bookings", value: tracker.mentorBookings.length, icon: GraduationCap },
                  { label: "Missions joined", value: tracker.joinedMissions.length, icon: HeartHandshake }
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
                    <Icon size={18} className="text-cyan-300" />
                    <div className="mt-3 text-3xl font-black">{value}</div>
                    <div className="text-xs uppercase tracking-[0.25em] text-slate-400">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              {[
                { icon: Building2, title: "Institution-first operations", text: "Schools, hospitals, legal teams, malls, and public institutions can raise urgent staffing needs." },
                { icon: Landmark, title: "Government prep layer", text: "Exam readiness, civic understanding, and mentorship live inside the same platform." },
                { icon: ShieldCheck, title: "Civic proof-of-work", text: "Campaign participation and social contribution strengthen trust and profile visibility." }
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                  <Icon size={18} className="text-amber-400" />
                  <h3 className="mt-3 text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="ai-forecasting" className="mt-8 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[32px] border border-cyan-400/15 bg-[linear-gradient(135deg,rgba(8,24,38,0.98),rgba(14,58,66,0.78))] p-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">
                <TrendingUp size={15} />
                AI + ML Forecast Engine
              </div>
              <h2 className="mt-3 text-3xl font-black">Dynamic demand forecasting for talent and staffing</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                This layer reads live opportunity supply, institution demand, application movement, and civic engagement
                to estimate which sectors will spike next and where platform response should focus.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4">
                  <div className="text-xs uppercase tracking-[0.25em] text-slate-400">Top forecast sector</div>
                  <div className="mt-2 text-2xl font-black text-cyan-300">{forecastEngine.topSector.sector}</div>
                  <div className="mt-2 text-sm text-slate-300">{forecastEngine.topSector.trend}</div>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4">
                  <div className="text-xs uppercase tracking-[0.25em] text-slate-400">Projected openings</div>
                  <div className="mt-2 text-2xl font-black text-emerald-300">{forecastEngine.topSector.forecastedOpenings}</div>
                  <div className="mt-2 text-sm text-slate-300">Next two weeks</div>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4">
                  <div className="text-xs uppercase tracking-[0.25em] text-slate-400">Fill confidence</div>
                  <div className="mt-2 text-2xl font-black text-amber-300">{forecastEngine.topSector.fillConfidence}%</div>
                  <div className="mt-2 text-sm text-slate-300">Estimated response quality</div>
                </div>
              </div>

              <div className="mt-6 rounded-[24px] border border-cyan-400/15 bg-cyan-400/10 p-5 text-sm leading-7 text-cyan-50">
                {forecastEngine.forecastSummary}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[32px] border border-white/10 bg-[#101827] p-6">
                <div className="text-xs font-bold uppercase tracking-[0.35em] text-amber-300">Sector Forecast Table</div>
                <div className="mt-5 space-y-4">
                  {forecastEngine.demandBySector.map((sector) => (
                    <div key={sector.sector} className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold">{sector.sector}</div>
                          <div className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-500">{sector.trend}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-black text-white">{sector.demandScore}</div>
                          <div className="text-xs text-slate-400">demand score</div>
                        </div>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-white/10">
                        <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-300" style={{ width: `${Math.min(100, sector.demandScore)}%` }} />
                      </div>
                      <div className="mt-3 flex justify-between text-xs text-slate-400">
                        <span>{sector.forecastedOpenings} projected openings</span>
                        <span>{sector.fillConfidence}% fill confidence</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[32px] border border-white/10 bg-[#111623] p-6">
                <div className="text-xs font-bold uppercase tracking-[0.35em] text-emerald-300">Model Recommendations</div>
                <div className="mt-5 space-y-4">
                  {forecastEngine.smartActions.map((action) => (
                    <div key={action.title} className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
                      <div className="font-semibold">{action.title}</div>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{action.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="opportunity-hub" className="mt-8 rounded-[32px] border border-white/10 bg-[#101827] p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.35em] text-amber-300">Opportunity Hub</div>
                <h2 className="mt-2 text-3xl font-black">Discover gigs and track your movement</h2>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <select value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white">
                  {sectors.map((sector) => <option key={sector} value={sector}>{sector === "all" ? "All sectors" : sector}</option>)}
                </select>
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white">
                  <option value="all">All work types</option>
                  <option value="Contract">Contract</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Mentorship">Mentorship</option>
                </select>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Teacher, hospital, Delhi..." className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-500" />
              </div>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
              <div className="grid gap-4 md:grid-cols-2">
                {filteredOpportunities.map((job) => (
                  <article key={job.id} className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold">{job.title}</h3>
                        <p className="mt-1 text-sm text-slate-400">{job.summary}</p>
                      </div>
                      <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-300">{job.urgency}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
                      <span className="rounded-full bg-white/[0.06] px-3 py-1">{job.sector}</span>
                      <span className="rounded-full bg-white/[0.06] px-3 py-1">{job.type}</span>
                      <span className="rounded-full bg-white/[0.06] px-3 py-1">{job.location}</span>
                    </div>
                    <div className="mt-5 flex items-center justify-between">
                      <div className="text-sm font-semibold text-emerald-300">{job.pay}</div>
                      <div className="flex gap-2">
                        <button onClick={() => saveOpportunity(job)} className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/[0.06]">Save</button>
                        <button onClick={() => applyOpportunity(job)} className="rounded-full bg-cyan-400 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300">Apply</button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">Tracker</div>
                    <h3 className="mt-2 text-xl font-bold">Your local workflow</h3>
                  </div>
                  <button onClick={clearTracker} className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/[0.06]">Clear</button>
                </div>

                <div className="mt-5 space-y-5">
                  <div>
                    <div className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-slate-500">Saved</div>
                    <div className="space-y-3">{renderTrackerList(tracker.saved, "Apply", applyOpportunity)}</div>
                  </div>
                  <div>
                    <div className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-slate-500">Applied</div>
                    <div className="space-y-3">{renderTrackerList(tracker.applied, "Interview", shortlistForInterview)}</div>
                  </div>
                  <div>
                    <div className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-slate-500">Interviewing</div>
                    <div className="space-y-3">{renderTrackerList(tracker.interviewing)}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="institution-desk" className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.95fr]">
            <div className="rounded-[32px] border border-white/10 bg-[#111623] p-6">
              <div className="text-xs font-bold uppercase tracking-[0.35em] text-emerald-300">Institution Desk</div>
              <h2 className="mt-2 text-3xl font-black">Urgent workforce demand board</h2>
              <div className="mt-6 space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-semibold">{request.role}</div>
                        <div className="mt-1 text-sm text-slate-400">{request.institution} - {request.location}</div>
                      </div>
                      <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">{request.urgency}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
                      <span className="rounded-full bg-white/[0.06] px-3 py-1">{request.sector}</span>
                      <span className="rounded-full bg-white/[0.06] px-3 py-1">Fast response ready</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,30,48,0.98),rgba(10,16,24,0.96))] p-6">
              <div className="text-xs font-bold uppercase tracking-[0.35em] text-amber-300">Create Request</div>
              <h2 className="mt-2 text-3xl font-black">Post a staffing need</h2>
              <form onSubmit={handleRequestSubmit} className="mt-6 grid gap-4">
                <input name="institutionName" placeholder="Institution name" required className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-500" />
                <select name="institutionSector" required className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white">
                  <option value="">Choose sector</option>
                  <option value="Education">Education</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Legal">Legal</option>
                  <option value="Retail">Retail</option>
                  <option value="Civic Projects">Civic Projects</option>
                </select>
                <input name="institutionRole" placeholder="Role needed" required className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-500" />
                <div className="grid gap-4 md:grid-cols-2">
                  <input name="institutionLocation" placeholder="Location" required className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-500" />
                  <select name="institutionUrgency" required className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white">
                    <option>Within 24 hours</option>
                    <option>This week</option>
                    <option>This month</option>
                  </select>
                </div>
                <button className="rounded-2xl bg-amber-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300">Save staffing request</button>
                {requestMessage && <p className="text-sm text-emerald-300">{requestMessage}</p>}
              </form>
            </div>
          </section>

          <section id="prep-lab" className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[32px] border border-white/10 bg-[#101725] p-6">
              <div className="text-xs font-bold uppercase tracking-[0.35em] text-violet-300">Prep Lab</div>
              <h2 className="mt-2 text-3xl font-black">Study while you stay economically active</h2>
              <div className="mt-6 space-y-4">
                {studyTracks.map((track) => (
                  <div key={track.title} className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold">{track.title}</div>
                      <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs font-semibold text-violet-300">{track.pace}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">{track.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-[#121a29] p-6">
              <div className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">Mentorship Circles</div>
              <h2 className="mt-2 text-3xl font-black">Book practical support</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {mentors.map((mentor) => (
                  <div key={mentor.id} className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-400/15 text-cyan-300">
                        <Users size={18} />
                      </div>
                      <div>
                        <div className="font-semibold">{mentor.name}</div>
                        <div className="text-xs text-slate-500">{mentor.slots}</div>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-400">{mentor.focus}</p>
                    <button onClick={() => bookMentor(mentor)} className="mt-4 w-full rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300">
                      Book mentor
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="civic-missions" className="mt-8 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
            <div className="rounded-[32px] border border-white/10 bg-[#0f1624] p-6">
              <div className="text-xs font-bold uppercase tracking-[0.35em] text-emerald-300">Civic Missions</div>
              <h2 className="mt-2 text-3xl font-black">Contribute in ways that strengthen your profile</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {missions.map((mission) => (
                  <div key={mission.id} className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold">{mission.title}</div>
                      <Sparkles size={16} className="text-emerald-300" />
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                      <MapPin size={13} />
                      {mission.city}
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{mission.detail}</p>
                    <button onClick={() => joinMission(mission)} className="mt-4 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-300 transition hover:bg-emerald-500/20">
                      Join mission
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-[#121a29] p-6">
              <div className="text-xs font-bold uppercase tracking-[0.35em] text-amber-300">Impact Ledger</div>
              <h2 className="mt-2 text-3xl font-black">Your civic record</h2>
              <div className="mt-6 space-y-4">
                {!tracker.joinedMissions.length && (
                  <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm text-slate-400">
                    Join a mission to start building visible civic proof-of-work.
                  </div>
                )}
                {tracker.joinedMissions.map((mission) => (
                  <div key={mission.id} className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                    <div className="font-semibold">{mission.title}</div>
                    <div className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-500">{mission.impact} - {mission.city}</div>
                    <p className="mt-3 text-sm text-slate-400">Contribution recorded locally. This can later become a verified profile signal for institutions and mentors.</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="community" className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.85fr]">
            <div className="rounded-[32px] border border-white/10 bg-[#101827] p-6">
              <div className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">Community Board</div>
              <h2 className="mt-2 text-3xl font-black">Platform signals</h2>
              <div className="mt-6 space-y-4">
                {feed.map((item) => (
                  <div key={item.title} className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                    <div className="text-xs uppercase tracking-[0.25em] text-slate-500">{item.tag}</div>
                    <div className="mt-2 text-lg font-semibold">{item.title}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,26,41,0.98),rgba(10,15,24,0.98))] p-6">
              <div className="text-xs font-bold uppercase tracking-[0.35em] text-amber-300">Profile Snapshot</div>
              <h2 className="mt-2 text-3xl font-black">Momentum inside the app</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
                  <div className="text-sm text-slate-400">Profile score</div>
                  <div className="mt-2 text-6xl font-black text-amber-300">{profileScore}</div>
                  <p className="mt-3 text-sm leading-6 text-slate-400">Grows with applications, mission joins, and mentor engagement.</p>
                </div>
                <div className="grid gap-4">
                  {[
                    { label: "Applications", value: tracker.applied.length + tracker.interviewing.length, icon: Briefcase, tone: "text-cyan-300" },
                    { label: "Mentor bookings", value: tracker.mentorBookings.length, icon: GraduationCap, tone: "text-violet-300" },
                    { label: "Mission joins", value: tracker.joinedMissions.length, icon: HeartHandshake, tone: "text-emerald-300" }
                  ].map(({ label, value, icon: Icon, tone }) => (
                    <div key={label} className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                      <div className="flex items-center gap-3">
                        <Icon size={18} className={tone} />
                        <div className="text-sm text-slate-400">{label}</div>
                      </div>
                      <div className={`mt-3 text-3xl font-black ${tone}`}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Hospital size={16} className="text-emerald-300" /> Healthcare</div>
                  <div className="text-sm text-slate-400">Fast staffing and admin coordination roles.</div>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Stethoscope size={16} className="text-cyan-300" /> Education</div>
                  <div className="text-sm text-slate-400">Contract teachers, remedial support, and exam-linked mentoring.</div>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Landmark size={16} className="text-amber-300" /> Civic Work</div>
                  <div className="text-sm text-slate-400">Campaigns and legal or public-service awareness projects.</div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default CivicGigApp;
