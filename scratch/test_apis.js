// Node.js has global fetch

async function testOpenAQ() {
  console.log("Testing OpenAQ V3...");
  const apiKey = "ff461a6ba7bfb03ec32824a55f45c2309041c11d79ae76f7a14fd6cf43fc9c22";
  const url = "https://api.openaq.org/v3/locations?countries_id=138&limit=5&order_by=id&sort_order=desc";
  console.log(`Fetching: ${url}`);
  try {
    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "X-API-Key": apiKey
      }
    });
    console.log(`Status: ${response.status}`);
    const data = await response.json();
    console.log(`Results count: ${data.results?.length || 0}`);
    if (data.results && data.results.length > 0) {
      console.log("First result name:", data.results[0].name);
      console.log("First result datetimeLast:", data.results[0].datetimeLast);
    }
  } catch (err) {
    console.error("OpenAQ test failed:", err);
  }
}

async function testUSGS() {
  console.log("\nTesting USGS Earthquakes...");
  const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";
  console.log(`Fetching: ${url}`);
  try {
    const response = await fetch(url);
    console.log(`Status: ${response.status}`);
    const data = await response.json();
    console.log(`Features count: ${data.features?.length || 0}`);
    if (data.features && data.features.length > 0) {
      console.log("First feature coords:", data.features[0].geometry.coordinates);
      console.log("First feature title:", data.features[0].properties.title);
    }
  } catch (err) {
    console.error("USGS test failed:", err);
  }
}

async function testFIRMS() {
  console.log("\nTesting NASA FIRMS...");
  const key = "c8a2f0ccc9a212690853fd7035ca6f03";
  const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${key}/VIIRS_SNPP_NRT/world/2`;
  console.log(`Fetching (this might be slow or return lots of data): ${url}`);
  try {
    const response = await fetch(url);
    console.log(`Status: ${response.status}`);
    const text = await response.text();
    console.log(`CSV size: ${text.length} chars`);
    const lines = text.trim().split("\n");
    console.log(`Lines count: ${lines.length}`);
    if (lines.length > 1) {
      console.log("Header:", lines[0]);
      console.log("First line:", lines[1]);
    }
  } catch (err) {
    console.error("FIRMS test failed:", err);
  }
}

async function run() {
  await testOpenAQ();
  await testUSGS();
  await testFIRMS();
}

run();
