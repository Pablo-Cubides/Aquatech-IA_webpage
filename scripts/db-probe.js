require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

const c = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function probe() {
  console.log('Probing database...');
  try {
    await c.connect();
    const res = await c.query('SELECT 1');
    console.log('✅ Connection Successful! Circuit breaker is CLOSED.');
    await c.end();
    process.exit(0);
  } catch (e) {
    console.log('❌ Connection Failed:', e.message);
    process.exit(1);
  }
}

probe();
