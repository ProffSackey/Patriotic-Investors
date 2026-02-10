const fs = require('fs').promises;
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function parseDotEnv(envPath) {
  const content = require('fs').readFileSync(envPath, 'utf8');
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
  try {
    const repoRoot = path.join(__dirname, '..');
    const envPath = path.join(repoRoot, '.env.local');
    const adminsPath = path.join(repoRoot, 'data', 'admins.json');

    // Parse .env.local
    const env = parseDotEnv(envPath);
    const url = env.NEXT_PUBLIC_SUPABASE_URL;
    const key = env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
      process.exit(1);
    }

    // Read admins from JSON file
    const raw = await fs.readFile(adminsPath, 'utf8');
    const admins = JSON.parse(raw);

    console.log(`Found ${admins.length} admins in data/admins.json`);

    // Create Supabase client
    const supabase = createClient(url, key);

    // Insert or upsert admins into Supabase (omit id to let Supabase generate UUID)
    for (const admin of admins) {
      const { error } = await supabase.from('admins').upsert([
        {
          username: admin.username,
          first_name: admin.username.split('-')[1] || 'Admin',
          last_name: admin.username.split('-')[1] || 'User',
          email: admin.email,
          password: admin.password,
          role: admin.role,
          permissions: admin.permissions || [],
          created_at: admin.createdAt,
          updated_at: new Date().toISOString(),
        }
      ], { onConflict: 'email' });

      if (error) {
        console.error(`Error upserting admin ${admin.email}:`, error.message || error);
        process.exit(1);
      }

      console.log(`✓ Migrated admin: ${admin.email} (role: ${admin.role})`);
    }

    console.log(`\n✓ All ${admins.length} admin(s) migrated to Supabase successfully!`);
  } catch (err) {
    console.error('Migration error:', err.message || err);
    process.exit(1);
  }
}

main();
