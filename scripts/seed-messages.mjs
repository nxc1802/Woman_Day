/**
 * One-time seeding script: insert default gift messages into the gift_messages table.
 * IMPORTANT: Run this ONLY after creating the table via the Supabase SQL Editor.
 *
 * SQL to run first:
 *   (see scripts/create-gift-messages.sql)
 *
 * Usage:
 *   node scripts/seed-messages.mjs
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Missing env vars. Run with: node --env-file=.env.local scripts/seed-messages.mjs');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const DEFAULT_MESSAGES = [
  { text: 'I Love You ❤️',            display_order: 1 },
  { text: 'You Are My World 🌍',        display_order: 2 },
  { text: 'Forever With You 💕',        display_order: 3 },
  { text: 'My Beautiful Girl 🌸',       display_order: 4 },
  { text: "Happy Women's Day 🌺",       display_order: 5 },
  { text: "You're Everything ✨",        display_order: 6 },
  { text: 'My Sunshine ☀️',             display_order: 7 },
  { text: 'Always & Forever 💗',        display_order: 8 },
  { text: 'You Amaze Me 💖',            display_order: 9 },
  { text: 'My Heart is Yours ❤️',       display_order: 10 },
  { text: 'Beyond Words 🥰',            display_order: 11 },
  { text: '8/3 💌',                     display_order: 12 },
  { text: 'So in Love 💓',              display_order: 13 },
  { text: 'Endlessly Yours 💞',         display_order: 14 },
];

async function run() {
  console.log('🌸 Seeding gift_messages...');

  // Check if already seeded
  const { data: existing, error: checkErr } = await supabase
    .from('gift_messages').select('id').limit(1);

  if (checkErr) {
    console.error('❌ Could not access gift_messages table:', checkErr.message);
    console.error('   → Make sure you have run scripts/create-gift-messages.sql first!');
    process.exit(1);
  }

  if (existing && existing.length > 0) {
    console.log('⏭️  Table already has data, skipping seed.');
    process.exit(0);
  }

  const { error } = await supabase.from('gift_messages').insert(DEFAULT_MESSAGES);
  if (error) {
    console.error('❌ Insert failed:', error.message);
    process.exit(1);
  }

  console.log(`✅ Inserted ${DEFAULT_MESSAGES.length} messages`);
}

run().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
