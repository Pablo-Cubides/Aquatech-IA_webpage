import https from 'https';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function run() {
  console.log("Testing USGS...");
  try {
    const res = await fetchUrl("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson");
    console.log("USGS Status:", res.status);
    console.log("USGS Features length:", res.data?.features?.length || "No features");
  } catch (e) {
    console.error("USGS error:", e);
  }

  console.log("\nTesting Open-Meteo...");
  try {
    const res = await fetchUrl("https://api.open-meteo.com/v1/forecast?latitude=4.711&longitude=-74.0721&current=temperature_2m");
    console.log("Open-Meteo Status:", res.status);
    console.log("Open-Meteo Current Weather:", res.data?.current || "No current weather");
  } catch (e) {
    console.error("Open-Meteo error:", e);
  }
}

run();
