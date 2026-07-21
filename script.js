import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let stations = [];
let disruptions = [];

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

async function loadDisruptions() {
  const { data, error } = await supabase
    .from("disruptions")
    .select("*")
    .order("lastUpdated", { ascending: false });

  if (error) {
    console.error("Error loading disruptions:", error);
    disruptions = [];
    return;
  }

  disruptions = data || [];
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
    showMessage("Station not found.", "Cl
