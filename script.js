import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let stations = [];
let disruptions = [
  {
    stationName: "Rajiv Chowk",
    status: "Limited",
    reason: "Crowd management due to a special event.",
    alternatives: ["Barakhamba Road", "Patel Chowk"],
    lastUpdated: "2026-07-22 12:05 AM"
  },
  {
    stationName: "Central Secretariat",
    status: "Closed",
    reason: "Temporary maintenance work.",
    alternatives: ["Udyog Bhawan", "Patel Chowk"],
    lastUpdated: "2026-07-22 12:05 AM"
  },
  {
    stationName: "Kashmere Gate",
    status: "Open",
    reason: "No disruption reported.",
    alternatives: ["Tis Hazari"],
    lastUpdated: "2026-07-22 12:05 AM"
  }
];

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

function clean(value) {
  return String(value || "").trim().toLowerCase();
}

function setBadge(status) {
  statusBadge.textContent = status;
  statusBadge.className = `badge ${clean(status)}`;
}

function showMessage(title, badge = "Closed") {
  resultCard.classList.remove("hidden");
  resultName.textContent = title;
  setBadge(badge);
  resultLines.textContent = "-";
  resultInterchange.textContent = "-";
  resultCoordinates.textContent = "-";
  resultReason.textContent = "-";
  resultAlternatives.textContent = "-";
  resultUpdated.textContent = "-";
}

async function loadStations() {
  const res = await fetch("./stations.json");
  stations = await res.json();
}

async function loadDisruptionsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from("disruptions")
      .select("*")
      .order("lastUpdated", { ascending: false });

    if (error) throw error;
    if (data && data.length) disruptions = data;
  } catch (err) {
    console.warn("Using local fallback disruptions data.", err);
  }
}

function renderStation(station) {
  const disruption = disruptions.find(d => clean(d.stationName) === clean(station.name));
  const status = disruption?.status || "Open";

  resultCard.classList.remove("hidden");
  resultName.textContent = station.name;
  setBadge(status);

  resultLines.textContent = Array.isArray(station.lines)
    ? station.lines.join(", ")
    : station.lines || "-";

  resultInterchange.textContent = station.interchange || "No";
  resultCoordinates.textContent = station.coordinates
    ? `${station.coordinates.lat}, ${station.coordinates.lng}`
    : "-";

  resultReason.textContent = disruption?.reason || "No disruption reported.";
  resultAlternatives.textContent =
    disruption?.alternatives?.length
      ? disruption.alternatives.join(", ")
      : station.alternatives?.length
        ? station.alternatives.join(", ")
        : "No alternatives listed.";

  resultUpdated.textContent = disruption?.lastUpdated || "Not updated yet";
}

function searchStation() {
  const query = clean(stationInput.value);

  if (!query) {
    showMessage("Please enter a station name.", "Closed");
    return;
  }

  const station = stations.find(
    s => clean(s.name) === query || clean(s.name).includes(query)
  );

  if (!station) {
    showMessage("Station not found.", "Closed");
    return;
  }

  renderStation(station);
}

async function initRealtime() {
  try {
    await supabase.realtime.setAuth();

    supabase
      .channel("disruptions-table")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "disruptions" },
        async () => {
          await loadDisruptionsFromSupabase();
          if (clean(stationInput.value)) searchStation();
        }
      )
      .subscribe();
  } catch (err) {
    console.warn("Realtime not connected, using fallback data only.", err);
  }
}

searchBtn.addEventListener("click", searchStation);
stationInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchStation();
});

(async function start() {
  await loadStations();
  await loadDisruptionsFromSupabase();
  await initRealtime();
})();
