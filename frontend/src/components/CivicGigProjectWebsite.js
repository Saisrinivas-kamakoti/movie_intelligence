import React from "react";
import { BrowserRouter, Link, NavLink, Route, Routes } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Briefcase,
  Building2,
  CheckCircle2,
  GraduationCap,
  HeartHandshake,
  LayoutDashboard,
  LineChart,
  MapPinned,
  ShieldCheck,
  Sparkles,
  Target,
  Users
} from "lucide-react";
import CivicGigApp from "@/components/CivicGigApp";

const pillars = [
  {
    icon: Briefcase,
    title: "Earn Immediately",
    text: "Give users fast access to part-time and contract work across education, healthcare, legal, retail, and civic projects."
  },
  {
    icon: GraduationCap,
    title: "Prepare Continuously",
    text: "Blend government exam prep, mentorship, and skill readiness into the same platform instead of treating them as separate journeys."
  },
  {
    icon: HeartHandshake,
    title: "Contribute Publicly",
    text: "Let civic missions and community work become visible profile signals that increase credibility with institutions and mentors."
  }
];

const modules = [
  {
    icon: LayoutDashboard,
    title: "Overview Dashboard",
    text: "Role-based entry points for job seekers, institutions, mentors, and consultants with live platform stats."
  },
  {
    icon: Briefcase,
    title: "Opportunity Hub",
    text: "Search and filter urgent roles, save jobs, apply quickly, and track progress from saved to interviewing."
  },
  {
    icon: Building2,
    title: "Institution Desk",
    text: "Post urgent workforce needs for schools, hospitals, legal teams, retail spaces, and public-service operations."
  },
  {
    icon: GraduationCap,
    title: "Prep Lab",
    text: "Offer study tracks, mentor circles, and readiness programs for government pathways and career transitions."
  },
  {
    icon: HeartHandshake,
    title: "Civic Missions",
    text: "Turn awareness drives, community help, and legal-health campaigns into measurable civic proof-of-work."
  },
  {
    icon: Users,
    title: "Community Board",
    text: "Surface platform updates, demand shifts, success stories, and profile momentum in a visible ecosystem."
  }
];

const aiFeatures = [
  "Forecast sector-wise demand spikes using opportunity flow, staffing requests, and application movement",
  "Estimate projected openings and fill confidence over the next 1 to 2 weeks",
  "Recommend where candidates should focus to improve conversion and response speed",
  "Warn institutions when demand is outpacing the available candidate pipeline",
  "Track whether mentorship and prep engagement improve interview readiness"
];

const dashboardCards = [
  {
    icon: BarChart3,
    title: "Workforce Demand Dashboard",
    text: "Sector demand scores, projected openings, and fill confidence trends."
  },
  {
    icon: LineChart,
    title: "Job Seeker Progress Dashboard",
    text: "Applications, interviews, mentor bookings, and profile growth signals."
  },
  {
    icon: LayoutDashboard,
    title: "Institution Staffing Dashboard",
    text: "Urgent role demand, likely fulfillment confidence, and shortage alerts."
  },
  {
    icon: Target,
    title: "Civic + Prep Dashboard",
    text: "Mission participation, prep engagement, and readiness indicators."
  }
];

const phases = [
  {
    phase: "Phase 1",
    title: "Interactive MVP",
    bullets: [
      "Role-based website and product preview",
      "Opportunity Hub and Institution Desk",
      "Prep Lab and Civic Missions",
      "Heuristic AI/ML forecasting layer"
    ]
  },
  {
    phase: "Phase 2",
    title: "Operational Platform",
    bullets: [
      "Backend APIs and persistence",
      "Authentication and profile state",
      "Institution workflows and analytics endpoints",
      "Admin and reporting support"
    ]
  },
  {
    phase: "Phase 3",
    title: "Intelligence Layer",
    bullets: [
      "Time-series demand forecasting",
      "Candidate-role matching engine",
      "Mentor recommendation system",
      "Portfolio dashboards in Tableau"
    ]
  }
];

const users = [
  ["Job Seekers", "Need immediate income plus long-term mobility."],
  ["Institutions", "Need urgent staffing for essential roles."],
  ["Mentors", "Support readiness and public-sector preparation."],
  ["Consultants", "Shape talent outcomes and build credibility."]
];

const navItems = [
  { to: "/", label: "Home" },
  { to: "/product", label: "Product" },
  { to: "/ai-ml", label: "AI / ML" },
  { to: "/dashboards", label: "Dashboards" },
  { to: "/roadmap", label: "Roadmap" },
  { to: "/app-preview", label: "App Preview" }
];

const pageShell = "mx-auto max-w-[1400px] px-6 py-16";

function SiteLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0b1020] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b1020]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-400 font-black text-slate-950">
              CG
            </div>
            <div>
              <div className="font-black tracking-tight">CivicGig India</div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Project website</div>
            </div>
          </Link>

          <nav className="hidden gap-2 lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm transition ${
                    isActive ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/[0.05] hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-white/10 bg-[#0b1020]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-6 py-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>CivicGig India project website preview</p>
          <div className="flex gap-4">
            <Link to="/product" className="transition hover:text-white">Product</Link>
            <Link to="/ai-ml" className="transition hover:text-white">AI / ML</Link>
            <Link to="/app-preview" className="transition hover:text-white">App Preview</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HeroPage() {
  return (
    <SiteLayout>
      <section className="overflow-hidden">
        <div className="mx-auto grid max-w-[1400px] gap-8 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
              <Sparkles size={14} />
              Workforce + Civic Mobility Platform
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-6xl">
              A multi-page project website for a platform where people can earn, prepare, and contribute.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              CivicGig India is positioned as a workforce platform, civic engine, prep layer, and AI-driven intelligence product.
              This website preview separates the vision into clear product, ML, dashboard, roadmap, and app preview pages.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/product" className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300">
                Explore Product
                <ArrowRight size={16} />
              </Link>
              <Link to="/app-preview" className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.05]">
                Open App Preview
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(18,36,60,0.96),rgba(14,82,80,0.72))] p-6 shadow-2xl shadow-cyan-950/25">
              <div className="text-xs uppercase tracking-[0.3em] text-cyan-300">Project Positioning</div>
              <div className="mt-4 text-2xl font-black">Not just another job board</div>
              <p className="mt-3 text-sm leading-7 text-slate-200">
                This is a structured project website for a product that combines workforce access, public-service readiness, civic contribution, and forecasting.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: "Primary users", value: "4" },
                { label: "Core modules", value: "6" },
                { label: "Forecast layer", value: "AI/ML" }
              ].map((item) => (
                <div key={item.label} className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                  <div className="text-3xl font-black text-emerald-300">{item.value}</div>
                  <div className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-500">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={pageShell}>
        <div className="mb-8 max-w-3xl">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-amber-300">Vision</div>
          <h2 className="mt-3 text-4xl font-black">Solve unemployment and workforce gaps from both sides</h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {pillars.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
              <Icon size={20} className="text-cyan-300" />
              <h3 className="mt-4 text-2xl font-black">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{text}</p>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

function ProductPage() {
  return (
    <SiteLayout>
      <section className={pageShell}>
        <div className="mb-8 max-w-3xl">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">Product Modules</div>
          <h1 className="mt-3 text-5xl font-black">The website should already feel like a product</h1>
          <p className="mt-4 text-base leading-8 text-slate-300">
            These are the core modules that shape the initial CivicGig experience for job seekers, institutions, mentors, and consultants.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {modules.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-[30px] border border-white/10 bg-[#111827] p-6">
              <Icon size={20} className="text-amber-300" />
              <h3 className="mt-4 text-xl font-black">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{text}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[34px] border border-white/10 bg-[#111827] p-7">
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">Primary Users</div>
            <div className="mt-5 space-y-4">
              {users.map(([title, text]) => (
                <div key={title} className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                  <div className="font-semibold">{title}</div>
                  <div className="mt-2 text-sm text-slate-400">{text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[34px] border border-white/10 bg-[linear-gradient(135deg,rgba(22,28,45,0.96),rgba(35,22,62,0.72))] p-7">
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-amber-300">What V1 Must Deliver</div>
            <div className="mt-5 space-y-4">
              {[
                "Role-based dashboarding from the first screen",
                "Searchable opportunity marketplace",
                "Urgent institution staffing requests",
                "Prep and mentorship experiences",
                "Civic participation and impact logging",
                "AI-guided demand and readiness signals"
              ].map((item) => (
                <div key={item} className="flex gap-3 rounded-[22px] border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">
                  <CheckCircle2 size={16} className="mt-1 shrink-0 text-emerald-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function AIMLPage() {
  return (
    <SiteLayout>
      <section className={pageShell}>
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <div className="rounded-[34px] border border-cyan-400/20 bg-[linear-gradient(135deg,rgba(8,23,37,0.98),rgba(10,67,72,0.82))] p-7">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
              <BrainCircuit size={15} />
              AI / ML Layer
            </div>
            <h1 className="mt-4 text-5xl font-black">Forecast demand and make the platform adaptive</h1>
            <p className="mt-4 text-sm leading-8 text-slate-200">
              The AI/ML layer should read opportunities, staffing requests, applications, mentor engagement, and civic activity
              to predict demand spikes, supply risks, and the next best actions for both candidates and institutions.
            </p>
          </div>

          <div className="rounded-[34px] border border-white/10 bg-[#101827] p-7">
            <div className="space-y-4">
              {aiFeatures.map((item) => (
                <div key={item} className="flex gap-3 rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                  <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-300" />
                  <p className="text-sm leading-7 text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {[
            { title: "Input Signals", text: "Opportunities, requests, saves, applies, interviews, mentor bookings, and mission joins." },
            { title: "Forecast Outputs", text: "Demand score, projected openings, fill confidence, readiness probability, and shortage alerts." },
            { title: "Model Evolution", text: "Start with heuristic scoring, then move into time-series forecasting and matching models." }
          ].map((card) => (
            <article key={card.title} className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
              <h3 className="text-2xl font-black">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{card.text}</p>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

function DashboardsPage() {
  return (
    <SiteLayout>
      <section className={pageShell}>
        <div className="mb-8 max-w-3xl">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-violet-300">Analytics + Dashboards</div>
          <h1 className="mt-3 text-5xl font-black">Planned intelligence dashboards</h1>
          <p className="mt-4 text-base leading-8 text-slate-300">
            These dashboards support both the product itself and the portfolio story around Tableau, forecasting, ETL thinking, and product analytics.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {dashboardCards.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
              <Icon size={20} className="text-violet-300" />
              <h3 className="mt-4 text-xl font-black">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{text}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-[34px] border border-white/10 bg-[#111827] p-7">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">Portfolio Alignment</div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              "Financial KPI dashboarding can map to workforce, demand, and institutional performance views.",
              "ETL pipeline automation thinking fits the data ingestion and validation backbone of the platform.",
              "Sales and demand forecasting maps directly to sector demand prediction and fill-confidence modeling."
            ].map((item) => (
              <div key={item} className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function RoadmapPage() {
  return (
    <SiteLayout>
      <section className={pageShell}>
        <div className="mb-8 max-w-3xl">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">Roadmap</div>
          <h1 className="mt-3 text-5xl font-black">Three-phase rollout plan</h1>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {phases.map((phase) => (
            <article key={phase.phase} className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
              <div className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">{phase.phase}</div>
              <h3 className="mt-3 text-2xl font-black">{phase.title}</h3>
              <div className="mt-5 space-y-3">
                {phase.bullets.map((bullet) => (
                  <div key={bullet} className="flex gap-3 text-sm text-slate-300">
                    <CheckCircle2 size={16} className="mt-1 shrink-0 text-emerald-300" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-[36px] border border-cyan-400/20 bg-[linear-gradient(135deg,rgba(9,28,40,0.98),rgba(17,61,61,0.78))] p-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
              <MapPinned size={14} />
              Project Direction
            </div>
            <h2 className="mt-5 text-4xl font-black">Start with a strong website and evolve into a live intelligence product.</h2>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function AppPreviewPage() {
  return (
    <div className="bg-[#0b1020]">
      <div className="border-b border-white/10 bg-[#0b1020] px-6 py-4">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">Interactive Product Preview</div>
            <h1 className="mt-2 text-3xl font-black text-white">CivicGig App Preview</h1>
          </div>
          <Link to="/" className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.05]">
            Back to website
          </Link>
        </div>
      </div>
      <CivicGigApp />
    </div>
  );
}

const CivicGigProjectWebsite = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HeroPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/ai-ml" element={<AIMLPage />} />
        <Route path="/dashboards" element={<DashboardsPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/app-preview" element={<AppPreviewPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default CivicGigProjectWebsite;
