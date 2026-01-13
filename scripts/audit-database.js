require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

const c = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await c.connect();
  console.log('=== DATABASE AUDIT ===\n');
  
  // List all tables
  const tables = await c.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name
  `);
  console.log('📋 Tables in database:');
  tables.rows.forEach(r => console.log('  - ' + r.table_name));
  console.log('');
  
  // Check users
  const users = await c.query('SELECT id, name, email, role, image FROM users');
  console.log('👥 Users (' + users.rowCount + '):');
  users.rows.forEach(u => console.log('  - ' + u.email + ' (' + u.role + ')'));
  console.log('');
  
  // Check blog categories
  const categories = await c.query('SELECT * FROM "BlogCategory"');
  console.log('📁 Blog Categories (' + categories.rowCount + '):');
  categories.rows.forEach(cat => console.log('  - ' + cat.name + ' (slug: ' + cat.slug + ')'));
  console.log('');
  
  // Check blog posts
  const posts = await c.query('SELECT id, title, "createdAt" FROM "BlogPost" ORDER BY "createdAt" DESC LIMIT 10');
  console.log('📝 Blog Posts (latest 10, total check):');
  const totalPosts = await c.query('SELECT COUNT(*) as count FROM "BlogPost"');
  console.log('  Total posts: ' + totalPosts.rows[0].count);
  posts.rows.forEach(p => console.log('  - ' + p.title));
  console.log('');
  
  // Check accounts (OAuth)
  const accounts = await c.query('SELECT id, provider, "userId" FROM accounts');
  console.log('🔐 OAuth Accounts (' + accounts.rowCount + '):');
  accounts.rows.forEach(a => console.log('  - Provider: ' + a.provider + ', User: ' + a.userId));
  console.log('');

  // Check for any potentially foreign tables or unexpected data
  console.log('=== WARNINGS ===');
  
  // Check if there are any tables that might be from another project
  const unexpectedTables = tables.rows.filter(t => {
    const knownTables = [
      'accounts', 'sessions', 'users', 'verificationtokens',
      'BlogCategory', 'BlogPost', 'BlogFile', 'Tool', 'ToolUsage',
      'Payment', 'CreditLog', 'EmailEvent', 'Content', 'AdminLog',
      'AppSetting', 'Announcement', 'CoachConversation', 'CoachMessage',
      'SpartanProfile', '_prisma_migrations'
    ];
    return !knownTables.includes(t.table_name);
  });
  
  if (unexpectedTables.length > 0) {
    console.log('⚠️ Unexpected tables found:');
    unexpectedTables.forEach(t => console.log('  - ' + t.table_name));
  } else {
    console.log('✅ No unexpected tables found.');
  }
  
  await c.end();
}

main().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
