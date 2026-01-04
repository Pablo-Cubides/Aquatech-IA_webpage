const { createClient } = require('@supabase/supabase-js');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: Missing environment variables SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function keepAlive() {
  console.log('Running Supabase Keep-Alive...');
  try {
    // Solicitud mínima a la API de Auth
    // listUsers({ page: 1, perPage: 1 }) no devuelve datos sensibles por defecto y genera actividad
    const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
    
    if (error) throw error;
    
    console.log('✅ Supabase keep-alive success (Users fetch test passed)');
  } catch (error) {
    console.error('❌ Supabase keep-alive failed:', error.message);
    process.exit(1);
  }
}

keepAlive();
