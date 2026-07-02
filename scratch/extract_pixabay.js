const https = require('https');
https.get('https://pixabay.com/sound-effects/horror-avoid-horror-268576/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/https:\/\/[^"']*?\.mp3/g);
    if(match) {
      console.log('FOUND:', match);
    } else {
      console.log('NOT FOUND');
    }
  });
}).on('error', err => console.error(err));
