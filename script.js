const stations = [
  {
    name: "Rajiv Chowk",
    status: "Limited",
    reason: "Crowd management due to event",
    alternatives: ["Barakhamba Road", "Patel Chowk"],
    updated: "2026-07-21 11:45 PM"
  },
  {
    name: "Kashmere Gate",
    status: "Open",
    reason: "No disruption reported",
    alternatives: ["Tis Hazari"],
    updated: "2026-07-21 11:45 PM"
  },
  {
    name: "Central Secretariat",
    status: "Closed",
    reason: "Maintenance work",
    alternatives: ["Udyog Bhawan", "Patel Chowk"],
    updated: "2026-07-21 11:45 PM"
  }
];

function searchStation() {
  const input = document.getElementById("stationInput").value.trim().toLowerCase();
  const resultBox = document.getElementById("result");

  const station = stations.find(s => s.name.toLowerCase() === input);

  if (!station) {
    resultBox.classList.remove("hidden");
    document.getElementById("stationName").textContent = "Station not found";
    document.getElementById("stationStatus").textContent = "-";
    document.getElementById("stationReason").textContent = "-";
    document.getElementById("stationAlternatives").textContent = "-";
    document.getElementById("stationUpdated").textContent = "-";
    return;
  }

  resultBox.classList.remove("hidden");
  document.getElementById("stationName").textContent = station.name;
  document.getElementById("stationStatus").innerHTML =
    station.status === "Open"
      ? `<span class="badge-open">${station.status}</span>`
      : station.status === "Closed"
      ? `<span class="badge-closed">${station.status}</span>`
      : `<span class="badge-limited">${station.status}</span>`;
  document.getElementById("stationReason").textContent = station.reason;
  document.getElementById("stationAlternatives").textContent = station.alternatives.join(", ");
  document.getElementById("stationUpdated").textContent = station.updated;
}
