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

const opportunities = [
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

const trackerKey = "civicgig-static-tracker";
const requestsKey = "civicgig-static-requests";

let activeRole = "job-seeker";
let tracker = readStorage(trackerKey, { saved: [], applied: [], interviewing: [], mentorBookings: [], joinedMissions: [] });
let requests = readStorage(requestsKey, defaultRequests);

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function setView(view) {
  document.querySelectorAll(".view").forEach((section) => {
    section.classList.toggle("active", section.id === `view-${view}`);
  });

  document.querySelectorAll("[data-view-link]").forEach((element) => {
    element.classList.toggle("active", element.dataset.viewLink === view && element.classList.contains("nav-link"));
  });

  window.location.hash = view;
}

function setupNavigation() {
  document.querySelectorAll("[data-view-link]").forEach((element) => {
    element.addEventListener("click", () => setView(element.dataset.viewLink));
  });

  const initial = window.location.hash.replace("#", "");
  if (initial && document.getElementById(`view-${initial}`)) setView(initial);
}

function renderRoleSwitcher() {
  const container = document.getElementById("roleSwitcher");
  container.innerHTML = "";

  Object.keys(roles).forEach((role) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `role-chip ${role === activeRole ? "active" : ""}`;
    button.textContent = role.replace("-", " ");
    button.addEventListener("click", () => {
      activeRole = role;
      renderRoleSwitcher();
      renderRoleCopy();
      renderForecast();
    });
    container.append(button);
  });
}

function renderRoleCopy() {
  document.getElementById("roleTitle").textContent = roles[activeRole].title;
  document.getElementById("roleText").textContent = roles[activeRole].description;
}

function getForecastData() {
  const sectors = ["Education", "Healthcare", "Legal", "Retail", "Government Prep", "Civic Projects"];

  const demandBySector = sectors.map((sector) => {
    const live = opportunities.filter((item) => item.sector === sector).length;
    const reqs = requests.filter((item) => item.sector === sector).length;
    const saved = tracker.saved.filter((item) => item.sector === sector).length;
    const applied = tracker.applied.filter((item) => item.sector === sector).length;
    const interviewing = tracker.interviewing.filter((item) => item.sector === sector).length;

    const demandScore = live * 9 + reqs * 14 + saved * 4 + applied * 8 + interviewing * 10;
    const forecastedOpenings = Math.max(3, Math.round(live * 1.3 + reqs * 1.8 + applied * 0.7));
    const fillConfidence = Math.min(96, 48 + live * 4 + reqs * 5 + applied * 6 + interviewing * 7);
    const trend = demandScore >= 65 ? "Surging" : demandScore >= 38 ? "Growing" : "Stable";

    return { sector, demandScore, forecastedOpenings, fillConfidence, trend };
  }).sort((a, b) => b.demandScore - a.demandScore);

  return {
    demandBySector,
    topSector: demandBySector[0]
  };
}

function renderForecast() {
  const forecast = getForecastData();
  const summary = activeRole === "institution"
    ? `Institutions should prioritize ${forecast.topSector.sector.toLowerCase()} talent pipelines over the next 2 weeks.`
    : `Candidates should prioritize ${forecast.topSector.sector.toLowerCase()} roles for the strongest near-term demand.`;

  document.getElementById("forecastSector").textContent = forecast.topSector.sector;
  document.getElementById("forecastOpenings").textContent = forecast.topSector.forecastedOpenings;
  document.getElementById("forecastConfidence").textContent = `${forecast.topSector.fillConfidence}%`;
  document.getElementById("forecastSummary").textContent = summary;

  const table = document.getElementById("forecastTable");
  table.innerHTML = "";

  forecast.demandBySector.forEach((item) => {
    const row = document.createElement("article");
    row.className = "forecast-row";
    row.innerHTML = `
      <div class="forecast-meta">
        <div>
          <strong>${item.sector}</strong>
          <div>${item.trend}</div>
        </div>
        <div>
          <strong>${item.demandScore}</strong>
          <div>Demand score</div>
        </div>
      </div>
      <div class="forecast-bar"><div class="forecast-fill" style="width:${Math.min(100, item.demandScore)}%"></div></div>
      <div class="forecast-meta">
        <span>${item.forecastedOpenings} projected openings</span>
        <span>${item.fillConfidence}% fill confidence</span>
      </div>
    `;
    table.append(row);
  });
}

function populateSectorFilter() {
  const select = document.getElementById("sectorFilter");
  const sectors = ["all", ...new Set(opportunities.map((item) => item.sector))];
  select.innerHTML = "";

  sectors.forEach((sector) => {
    const option = document.createElement("option");
    option.value = sector;
    option.textContent = sector === "all" ? "All sectors" : sector;
    select.append(option);
  });
}

function renderMetrics() {
  document.getElementById("metricGigs").textContent = opportunities.length;
  document.getElementById("metricSaved").textContent = tracker.saved.length + tracker.applied.length;
  document.getElementById("metricMentors").textContent = tracker.mentorBookings.length;
  document.getElementById("metricMissions").textContent = tracker.joinedMissions.length;
}

function renderTrackerList(elementId, items, actionLabel, actionFn) {
  const container = document.getElementById(elementId);
  container.innerHTML = "";

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "Nothing here yet.";
    container.append(empty);
    return;
  }

  items.forEach((item) => {
    const article = document.createElement("article");
    article.innerHTML = `
      <div>
        <strong>${item.title}</strong>
        <div>${item.sector} - ${item.location}</div>
      </div>
    `;

    if (actionFn) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = actionLabel;
      button.addEventListener("click", () => actionFn(item));
      article.append(button);
    }

    container.append(article);
  });
}

function renderTracker() {
  renderTrackerList("savedList", tracker.saved, "Apply", applyToOpportunity);
  renderTrackerList("appliedList", tracker.applied, "Interview", shortlistOpportunity);
  renderTrackerList("interviewList", tracker.interviewing);
  renderMetrics();
}

function saveOpportunity(job) {
  if (!tracker.saved.find((item) => item.id === job.id)) {
    tracker.saved.unshift(job);
    persistAndRefresh();
  }
}

function applyToOpportunity(job) {
  tracker.saved = tracker.saved.filter((item) => item.id !== job.id);
  if (!tracker.applied.find((item) => item.id === job.id)) {
    tracker.applied.unshift(job);
  }
  persistAndRefresh();
}

function shortlistOpportunity(job) {
  tracker.applied = tracker.applied.filter((item) => item.id !== job.id);
  if (!tracker.interviewing.find((item) => item.id === job.id)) {
    tracker.interviewing.unshift(job);
  }
  persistAndRefresh();
}

function persistAndRefresh() {
  writeStorage(trackerKey, tracker);
  renderTracker();
  renderForecast();
}

function renderOpportunities() {
  const sectorValue = document.getElementById("sectorFilter").value;
  const typeValue = document.getElementById("typeFilter").value;
  const searchValue = document.getElementById("searchInput").value.trim().toLowerCase();
  const container = document.getElementById("opportunityGrid");
  container.innerHTML = "";

  const filtered = opportunities.filter((item) => {
    const sectorMatch = sectorValue === "all" || item.sector === sectorValue;
    const typeMatch = typeValue === "all" || item.type === typeValue;
    const searchMatch =
      !searchValue ||
      item.title.toLowerCase().includes(searchValue) ||
      item.location.toLowerCase().includes(searchValue) ||
      item.sector.toLowerCase().includes(searchValue);

    return sectorMatch && typeMatch && searchMatch;
  });

  filtered.forEach((job) => {
    const article = document.createElement("article");
    article.className = "opportunity-card";
    article.innerHTML = `
      <div class="opportunity-meta">
        <span class="tag">${job.urgency}</span>
      </div>
      <h3>${job.title}</h3>
      <p>${job.summary}</p>
      <div class="tag-row">
        <span class="tag">${job.sector}</span>
        <span class="tag">${job.type}</span>
        <span class="tag">${job.location}</span>
      </div>
      <div class="opportunity-footer">
        <strong>${job.pay}</strong>
        <div class="opportunity-actions"></div>
      </div>
    `;

    const actions = article.querySelector(".opportunity-actions");
    const saveButton = document.createElement("button");
    saveButton.className = "button button-secondary";
    saveButton.textContent = "Save";
    saveButton.addEventListener("click", () => saveOpportunity(job));

    const applyButton = document.createElement("button");
    applyButton.className = "button button-primary";
    applyButton.textContent = "Apply";
    applyButton.addEventListener("click", () => applyToOpportunity(job));

    actions.append(saveButton, applyButton);
    container.append(article);
  });
}

function renderRequests() {
  const board = document.getElementById("requestBoard");
  board.innerHTML = "";

  requests.forEach((request) => {
    const card = document.createElement("article");
    card.className = "request-card";
    card.innerHTML = `
      <strong>${request.role}</strong>
      <div>${request.institution} - ${request.location}</div>
      <div class="tag-row">
        <span class="tag">${request.sector}</span>
        <span class="tag">${request.urgency}</span>
      </div>
    `;
    board.append(card);
  });
}

function setupFilters() {
  ["sectorFilter", "typeFilter", "searchInput"].forEach((id) => {
    document.getElementById(id).addEventListener(id === "searchInput" ? "input" : "change", renderOpportunities);
  });
}

function setupRequestForm() {
  const form = document.getElementById("requestForm");
  const message = document.getElementById("requestMessage");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    requests.unshift({
      id: Date.now(),
      institution: data.get("institutionName"),
      sector: data.get("institutionSector"),
      role: data.get("institutionRole"),
      location: data.get("institutionLocation"),
      urgency: data.get("institutionUrgency")
    });

    writeStorage(requestsKey, requests);
    renderRequests();
    renderForecast();
    form.reset();
    message.textContent = "Staffing request saved locally. The demand board and forecast have been updated.";
  });
}

function setupTrackerClear() {
  document.getElementById("clearTracker").addEventListener("click", () => {
    tracker = { saved: [], applied: [], interviewing: [], mentorBookings: [], joinedMissions: [] };
    persistAndRefresh();
  });
}

function init() {
  setupNavigation();
  renderRoleSwitcher();
  renderRoleCopy();
  populateSectorFilter();
  setupFilters();
  setupRequestForm();
  setupTrackerClear();
  renderOpportunities();
  renderRequests();
  renderTracker();
  renderForecast();
}

init();
