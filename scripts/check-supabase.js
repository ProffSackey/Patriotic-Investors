const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function parseDotEnv(envPath) {
  const content = fs.readFileSync(envPath, 'utf8');
  const lines = content.split(/\r?\n/);
  const out = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim();
    out[key] = val;
  }
  return out;
}

async function main() {
  const repoRoot = path.join(__dirname, '..');
  const envPath = path.join(repoRoot, '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('.env.local not found in repo root.');
    process.exit(1);
  }

  const env = parseDotEnv(envPath);

  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  if (!url || !key) {
    console.error('Missing Supabase URL or key in .env.local. Expected NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY).');
    process.exit(1);
  }

  const supabase = createClient(url, key);

  try {
    // Try simple RPC: select up to 20 users with non-sensitive fields
    const { data, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name')
      .limit(20);

    if (error) {
      console.error('Supabase query error:', error.message || error);
      process.exit(1);
    }

    if (!data || data.length === 0) {
      console.log('No rows returned from `users` table (0 rows found).');
      process.exit(0);
    }

    console.log(`Found ${data.length} user(s) (showing up to 20):`);
    for (const u of data) {
      console.log(`- id=${u.id}, email=${u.email}, name=${u.first_name || ''} ${u.last_name || ''}`);
    }
  } catch (err) {
    console.error('Error connecting to Supabase:', err.message || err);
    process.exit(1);
  }
}

main();
