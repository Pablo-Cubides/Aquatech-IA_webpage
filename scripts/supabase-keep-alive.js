const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.SUPABASE_ANON_KEY;
const supabaseKey = serviceRoleKey || anonKey;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "⚠️ Supabase keep-alive skipped: missing SUPABASE_URL or SUPABASE key.",
  );
  console.warn(
    "   Provide SUPABASE_SERVICE_ROLE_KEY (preferred) or SUPABASE_ANON_KEY.",
  );
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function keepAlive() {
  console.log("Running Supabase Keep-Alive...");
  try {
    if (serviceRoleKey) {
      const { error } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1,
      });
      if (!error) {
        console.log("✅ Supabase keep-alive success (Auth admin ping)");
        return;
      }
      console.warn(
        `⚠️ Auth admin ping failed: ${error.message}. Trying REST fallback...`,
      );
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: "GET",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`REST fallback failed with status ${response.status}`);
    }

    console.log("✅ Supabase keep-alive success (REST ping)");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ Supabase keep-alive failed:", message);
    process.exit(1);
  }
}

keepAlive();
