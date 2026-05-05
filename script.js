console.log("Script loaded");

// ===== CHECK ELEMENTS =====
const mapDiv = document.getElementById('map');
const chartCanvas = document.getElementById('chart');
const alertBox = document.getElementById('alerts');

if (!mapDiv || !chartCanvas || !alertBox) {
  document.body.innerHTML = "<h2 style='color:red'>HTML elements missing</h2>";
}

// ===== MAP =====
var map = L.map('map').setView([22.5, 80], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// ===== LOAD DATA =====
fetch('data/drought.json')
  .then(res => {
    console.log("Fetch response:", res.status);
    return res.json();
  })
  .then(data => {
    console.log("Data loaded:", data);

    // ===== CHART =====
    new Chart(chartCanvas, {
      type: 'line',
      data: {
        labels: data.months,
        datasets: [{
          label: 'SPI',
          data: data.spi
        }]
      }
    });

    // ===== MAP + ALERTS =====
    data.locations.forEach(loc => {
      L.circleMarker([loc.lat, loc.lon]).addTo(map)
        .bindPopup(loc.name);

      let li = document.createElement("li");
      li.innerText = loc.name + " SPI: " + loc.spi;
      alertBox.appendChild(li);
    });

  })
  .catch(err => {
    console.error("ERROR:", err);
    document.body.innerHTML = "<h2 style='color:red'>Error loading JSON</h2>";
  });
