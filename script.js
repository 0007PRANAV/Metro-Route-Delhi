let stationData = [];
let disruptionData = [];

const stationInput = document.getElementById("stationInput");
const searchBtn = document.getElementById("searchBtn");
const resultCard = document.getElementById("resultCard");

const resultName = document.getElementById("resultName");
const statusBadge = document.getElementById("statusBadge");
const resultLines = document.getElementById("resultLines");
const resultInterchange = document.getElementById("resultInterchange");
const resultCoordinates = document.getElementById("resultCoordinates");
const resultReason = document.getElementById("resultReason");
const resultAlternatives = document.getElementById("resultAlternatives");
const resultUpdated = document.getElementById("resultUpdated");

async function loadData() {
  try {
    const [stationsRes, disruptionsRes] = await Promise.all([
      fetch("stations.json"),
      fetch("disruptions.json")
    ]);

    stationData = await stationsRes.json();
    disruptionData = await disruptionsRes.json();
  } catch (error) {
    console.error("Failed to load data files:", error);
    showError("Could not load station data.");
  }
}

function normalize(text) {
  return text.trim().toLowerCase();
}

function showError(message) {
  resultCard.classList.remove("hidden");
  resultName.textContent = message;
  statusBadge.textContent = "Error";
  statusBadge.className = "badge closed";
  resultLines.textContent = "-";
  resultInterchange.textContent = "-";
  resultCoordinates.textContent = "-";
  resultReason.textContent = "-";
  resultAlternatives.textContent = "-";
  resultUpdated.textContent = "-";
}

function searchStation() {
  const query = normalize(stationInput.value);

  if (!query) {
    showError("Please enter a station name.");
    return;
  }

  const station = stationData.find(
    item => normalize(item.name) === query || normalize(item.name).includes(query)
  );

  if (!station) {
    showError("Station not found.");
    return;
  }

  const disruption = disruptionData.find(
    item => normalize(item.stationName) === normalize(station.name)
  );

  const status = disruption?.status || "Open";
  const reason = disruption?.reason || "No disruption reported.";
  const alternatives = disruption?.alternatives?.length
    ? disruption.alternatives.join(", ")
    : station.alternatives?.length
      ? station.alternatives.join(", ")
      : "No alternatives listed.";
  const updated = disruption?.lastUpdated || "Not updated yet";

  resultCard.classList.remove("hidden");
  resultName.textContent = station.name;
  statusBadge.textContent = status;
  statusBadge.className = `badge ${status.toLowerCase()}`;

  resultLines.textContent = Array.isArray(station.lines)
    ? station.lines.join(", ")
    : station.lines || "-";

  resultInterchange.textContent = station.interchange || "No";
  resultCoordinates.textContent = station.coordinates
    ? `${station.coordinates.lat}, ${station.coordinates.lng}`
    : "-";
  resultReason.textContent = reason;
  resultAlternatives.textContent = alternatives;
  resultUpdated.textContent = updated;
}

searchBtn.addEventListener("click", searchStation);
stationInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchStation();
});

loadData();
