async function testGBIF() {
  console.log("Testing GBIF occurrence search...");
  // Query occurrences in Colombia (CO) with mediaType = StillImage
  const url = "https://api.gbif.org/v1/occurrence/search?country=CO&mediaType=StillImage&limit=5";
  console.log(`Fetching: ${url}`);
  try {
    const response = await fetch(url);
    console.log(`Status: ${response.status}`);
    const data = await response.json();
    console.log(`Results count: ${data.results?.length || 0}`);
    if (data.results && data.results.length > 0) {
      data.results.forEach((item, index) => {
        console.log(`\nItem ${index}:`, item.scientificName);
        console.log("Media array:", JSON.stringify(item.media, null, 2));
      });
    }
  } catch (err) {
    console.error("GBIF test failed:", err);
  }
}

testGBIF();
