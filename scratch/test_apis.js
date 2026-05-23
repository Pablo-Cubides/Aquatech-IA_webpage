import https from 'https';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'Accept': 'application/json' } }, (res) => {
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

async function testOpenAQ() {
  console.log("--- Testing OpenAQ ---");
  try {
    const res = await fetchUrl("https://api.openaq.org/v2/locations?country=CO&city=Bogota&limit=10");
    if (res.status === 200) {
      console.log(`OpenAQ success. Found ${res.data.results?.length} results.`);
      if (res.data.results?.length > 0) {
        console.log(`Latest date for first: ${res.data.results[0].lastUpdated}`);
      }
    } else {
      console.log(`OpenAQ failed: ${res.status}`);
    }
  } catch (e) { console.error("OpenAQ error:", e.message); }
}

async function testWQP() {
  console.log("--- Testing WQP ---");
  try {
    const url = "https://www.waterqualitydata.us/data/Station/search?statecode=US%3A06&mimeType=geojson&zip=no&resultLimit=10";
    const res = await fetchUrl(url);
    if (res.status === 200) {
      console.log(`WQP success. Found ${res.data.features?.length} features.`);
    } else {
      console.log(`WQP failed: ${res.status}`);
    }
  } catch (e) { console.error("WQP error:", e.message); }
}

async function testUSGS() {
  console.log("--- Testing USGS Earthquakes ---");
  try {
    const res = await fetchUrl("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson");
    if (res.status === 200) {
      console.log(`USGS success. Found ${res.data.features?.length} features.`);
    } else {
      console.log(`USGS failed: ${res.status}`);
    }
  } catch (e) { console.error("USGS error:", e.message); }
}

async function testFIRMS() {
  console.log("--- Testing FIRMS ---");
  // FIRMS requires a map key, let's see what the code uses.
  console.log("FIRMS test skipped for now until I check the key.");
}

async function run() {
  await testOpenAQ();
  await testWQP();
  await testUSGS();
  await testFIRMS();
}

run();
