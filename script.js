let stations = [];
let disruptions = [];
let activeLine = "All";

const stationInput = document.getElementById("stationInput");
const searchBtn = document.getElementById("searchBtn");
const suggestions = document.getElementById("suggestions");
const resultCard = document.getElementById("resultCard");
const stationList = document.getElementById("stationList");
const stationCount = document.getElementById("stationCount");
const lineFilters = document.getElementById("lineFilters");
const resetFiltersBtn = document.getElementById("resetFiltersBtn");

const stationTotal = document.getElementById("stationTotal");
const lineTotal = document.getElementById("lineTotal");
const interchangeTotal = document.getElementById("interchangeTotal");
const openTotal = document.getElementById("openTotal");

const resultName = document.getElementById("resultName");
const resultMeta = document.getElementById("resultMeta");
const statusBadge = document.getElementById("statusBadge");
const resultLines = document.getElementById("resultLines");
const resultColors = document.getElementById("resultColors");
const resultInterchange = document.getElementById("resultInterchange");
const resultCoordinates = document.getElementById("resultCoordinates");
const resultType = document.getElementById("resultType");
const resultAlternatives = document.getElementById("resultAlternatives");
const resultReason = document.getElementById("resultReason");
const resultUpdated = document.getElementById("resultUpdated");

function clean(value) {
  return String(value || "").trim().toLowerCase();
}

function uniq(arr) {
  return [...new Set(arr)];
}

function getDisruption(name) {
  return disruptions.find(d => clean(d.stationName) === clean(name));
}

function getStatus(station) {
  return getDisruption(station.name)?.status || "Open";
}

function setBadge(status) {
  statusBadge.textContent = status;
  statusBadge.className = `badge ${clean(status)}`;
}

function colorFromLine(line) {
  const map = {
    "Red Line": "#ef4444",
    "Yellow Line": "#facc15",
    "Blue Line": "#3b82f6",
    "Green Line": "#22c55e",
    "Violet Line": "#8b5cf6",
    "Pink Line": "#ec4899",
    "Magenta Line": "#d946ef",
    "Grey Line": "#64748b",
    "Airport Express": "#fb923c"
  };
  return map[line] || "#38bdf8";
}

function lineClass(line) {
  return clean(line).replace(/s+/g, "-");
}

function showMessage(title, badge = "Closed") {
  resultCard.classList.remove("hidden");
  resultName.textContent = title;
  resultMeta.textContent = "-";
  setBadge(badge);
  [resultLines, resultColors, resultInterchange, resultCoordinates, resultType, resultAlternatives, resultReason, resultUpdated].forEach(el => {
    el.textContent = "-";
  });
}

async function loadStations() {
  const res = await fetch("./stations.json");
  stations = await res.json();
}

async function loadDisruptions() {
  const res = await fetch("./disruptions.json");
  disruptions = await res.json();
}

function renderStats() {
  const allLines = uniq(stations.flatMap(s => s.lines));
  stationTotal.textContent = stations.length;
  lineTotal.textContent = allLines.length;
  interchangeTotal.textContent = stations.filter(s => s.interchange).length;
  openTotal.textContent = stations.filter(s => getStatus(s) === "Open").length;
}

function renderLineFilters() {
  const lines = ["All", ...uniq(stations.flatMap(s => s.lines)).sort()];
  lineFilters.innerHTML = lines.map(line => `
    <button class="line-chip ${line === "All" ? "active" : ""}" data-line="${line}">
      ${line}
    </button>
  `).join("");

  lineFilters.querySelectorAll(".line-chip").forEach(btn => {
    btn.addEventListener("click", () => applyFilter(btn.dataset.line));
  });
}

function renderSuggestions(query) {
  const q = clean(query);
  if (!q) {
    suggestions.classList.add("hidden");
    suggestions.innerHTML = "";
    return;
  }

  const matches = stations.filter(s => clean(s.name).includes(q)).slice(0, 7);
  if (!matches.length) {
    suggestions.classList.add("hidden");
    suggestions.innerHTML = "";
    return;
  }

  suggestions.innerHTML = matches.map(s => `
    <div class="suggestion-item" data-name="${s.name}">
      <strong>${s.name}</strong>
      <span>${s.lines.join(" • ")}</span>
    </div>
  `).join("");

  suggestions.classList.remove("hidden");
}

function renderResult(station) {
  const disruption = getDisruption(station.name);
  const status = getStatus(station);

  resultCard.classList.remove("hidden");
  resultName.textContent = station.name;
  resultMeta.textContent = `${station.type || "Station"} • ${station.lines.join(", ")}`;
  setBadge(status);

  resultLines.textContent = station.lines.join(", ");
  resultColors.textContent = station.lines.map(l => `${l}: ${colorFromLine(l)}`).join(" | ");
  resultInterchange.textContent = station.interchange ? "Yes" : "No";
  resultCoordinates.textContent = station.coordinates ? `${station.coordinates.lat}, ${station.coordinates.lng}` : "-";
  resultType.textContent = station.type || "Station";
  resultAlternatives.textContent = disruption?.alternatives?.length
    ? disruption.alternatives.join(", ")
    : (station.alternatives?.length ? station.alternatives.join(", ") : "No alternatives listed.");
  resultReason.textContent = disruption?.reason || "No disruption reported.";
  resultUpdated.textContent = disruption?.lastUpdated || "Not updated yet";
}

function searchStation() {
  const query = clean(stationInput.value);
  if (!query) {
    showMessage("Please enter a station name.", "Closed");
    return;
  }

  const station = stations.find(s => clean(s.name) === query || clean(s.name).includes(query));
  if (!station) {
    showMessage("Station not found.", "Closed");
    return;
  }
  renderResult(station);
}

function applyFilter(line) {
  activeLine = line;
  document.querySelectorAll(".line-chip").forEach(chip => {
    chip.classList.toggle("active", chip.dataset.line === line);
  });
  renderStationList();
}

function renderStationList() {
  const filtered = activeLine === "All"
    ? stations
    : stations.filter(s => s.lines.includes(activeLine));

  stationCount.textContent = `${filtered.length} station${filtered.length === 1 ? "" : "s"} shown`;

  stationList.innerHTML = filtered.map(station => {
    const status = getStatus(station);
    return `
      <article class="station-card" data-name="${station.name}">
        <h3>${station.name}</h3>
        <p class="station-meta">${station.lines.join(", ")}</p>
        <p class="station-meta">Type: ${station.type || "Station"} • Interchange: ${station.interchange ? "Yes" : "No"}</p>
        <p class="station-meta">Status: ${status}</p>
      </article>
    `;
  }).join("");

  stationList.querySelectorAll(".station-card").forEach(card => {
    card.addEventListener("click", () => {
      const station = stations.find(s => s.name === card.dataset.name);
      if (station) renderResult(station);
    });
  });
}

searchBtn.addEventListener("click", searchStation);
stationInput.addEventListener("keydown", e => {
  if (e.key === "Enter") searchStation();
});
stationInput.addEventListener("input", e => renderSuggestions(e.target.value));

suggestions.addEventListener("click", e => {
  const item = e.target.closest(".suggestion-item");
  if (!item) return;
  stationInput.value = item.dataset.name;
  suggestions.classList.add("hidden");
  searchStation();
});

document.addEventListener("click", e => {
  if (!suggestions.contains(e.target) && e.target !== stationInput) {
    suggestions.classList.add("hidden");
  }
});

resetFiltersBtn.addEventListener("click", () => {
  activeLine = "All";
  document.querySelectorAll(".line-chip").forEach(chip => chip.classList.remove("active"));
  const all = [...document.querySelectorAll(".line-chip")].find(ch => ch.dataset.line === "All");
  if (all) all.classList.add("active");
  renderStationList();
});

(async function init() {
  await loadStations();
  await loadDisruptions();
  renderStats();
  renderLineFilters();
  renderStationList();
  stationCount.textContent = `${stations.length} stations loaded`;
})();
