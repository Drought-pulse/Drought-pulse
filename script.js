
// ===== MAP =====
var map = L.map('map').setView([22.5, 80], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// ===== LOAD DATA =====
fetch('data/drought.json')
  .then(res => {
    if (!res.ok) {
      throw new Error("JSON not found");
    }
    return res.json();
  })
  .then(data => {

    // ===== CHART =====
    new Chart(document.getElementById('chart'), {
      type: 'line',
      data: {
        labels: data.months,
        datasets: [{
          label: 'SPI',
          data: data.spi,
          borderWidth: 2
        }]
      }
    });

    // ===== ALERTS =====
    const alertBox = document.getElementById("alerts");

    data.locations.forEach(loc => {
      let alert = "Normal";

      if (loc.spi < -1) alert = "Severe Drought";
      else if (loc.spi < -0.5) alert = "Moderate Drought";

      L.circleMarker([loc.lat, loc.lon]).addTo(map)
        .bindPopup(loc.name + " - " + alert);

      if (alert !== "Normal") {
        let li = document.createElement("li");
        li.innerText = loc.name + ": " + alert;
        alertBox.appendChild(li);
      }
    });

  })
  .catch(err => {
    console.error("ERROR:", err);
    document.body.innerHTML = "<h2 style='color:red'>Error loading data. Check JSON path.</h2>";
  });
