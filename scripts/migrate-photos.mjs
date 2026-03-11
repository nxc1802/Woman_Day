/**
 * One-time migration script: upload all local photos to Supabase Storage
 * and insert corresponding rows in the `photos` table.
 *
 * Usage:
 *   node scripts/migrate-photos.mjs
 *
 * Requirements:
 *   - @supabase/supabase-js must be in node_modules (it is, via the project)
 *   - Run from the project root (Woman Day/)
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname, basename } from 'path';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Missing env vars. Run with: node --env-file=.env.local scripts/migrate-photos.mjs');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

/* ── Folder → DB metadata mapping ──────────────────────────────────────── */
const SOURCES = [
  {
    dir:      'public/assets/images/Anh_Hong',
    type:     'solo',
    category: 'gallery',
    label:    '🌸 Ảnh cá nhân (Anh_Hong)',
  },
  {
    dir:      'public/assets/images/Chung_minh',
    type:     'couple',
    category: 'gallery',
    label:    '💕 Ảnh đôi (Chung_minh)',
  },
  {
    dir:      'public/assets/images/photobooth',
    type:     'couple',
    category: 'photobooth',
    label:    '📸 Photobooth strips',
  },
];

/* ── MIME helper ────────────────────────────────────────────────────────── */
function mime(filename) {
  const ext = extname(filename).toLowerCase();
  if (['.jpg', '.jpeg'].includes(ext)) return 'image/jpeg';
  if (ext === '.png')  return 'image/png';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.gif')  return 'image/gif';
  return 'application/octet-stream';
}

/* ── Check already-uploaded paths to avoid duplicates ──────────────────── */
async function fetchExistingPaths() {
  const { data, error } = await supabase.from('photos').select('src');
  if (error) { console.error('Could not fetch existing photos:', error.message); return new Set(); }
  return new Set((data ?? []).map(r => r.src));
}

/* ── Upload one file ────────────────────────────────────────────────────── */
async function uploadOne(filePath, storagePath, contentType) {
  const buffer = readFileSync(filePath);
  const { error } = await supabase.storage
    .from('photos')
    .upload(storagePath, buffer, { contentType, upsert: false });
  if (error) {
    if (error.message?.includes('already exists') || error.statusCode === '409') {
      // Already in storage — get its public URL anyway
    } else {
      throw error;
    }
  }
  const { data: urlData } = supabase.storage.from('photos').getPublicUrl(storagePath);
  return urlData.publicUrl;
}

/* ── Main ───────────────────────────────────────────────────────────────── */
async function run() {
  console.log('🚀 Starting photo migration...\n');

  const existing = await fetchExistingPaths();
  console.log(`ℹ️  Already in DB: ${existing.size} photos\n`);

  let uploaded = 0;
  let skipped  = 0;
  let errors   = 0;

  for (const source of SOURCES) {
    console.log(`\n${source.label}`);
    console.log('─'.repeat(50));

    let files;
    try {
      files = readdirSync(source.dir).filter(f => {
        const ext = extname(f).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext) &&
               statSync(join(source.dir, f)).isFile();
      });
    } catch {
      console.warn(`  ⚠️  Directory not found: ${source.dir}`);
      continue;
    }

    console.log(`  Found ${files.length} files`);

    for (const filename of files) {
      const filePath    = join(source.dir, filename);
      const storagePath = `${source.category}/${source.type}/${filename}`;
      const contentType = mime(filename);

      try {
        const publicUrl = await uploadOne(filePath, storagePath, contentType);

        // Skip if already in DB
        if (existing.has(publicUrl)) {
          process.stdout.write('.');
          skipped++;
          continue;
        }

        // Insert DB record
        const { error: dbErr } = await supabase.from('photos').insert({
          src:      publicUrl,
          caption:  basename(filename, extname(filename)),
          type:     source.type,
          category: source.category,
        });

        if (dbErr) {
          console.error(`\n  ❌ DB insert failed for ${filename}: ${dbErr.message}`);
          errors++;
        } else {
          process.stdout.write('✓');
          uploaded++;
        }
      } catch (err) {
        console.error(`\n  ❌ Upload failed for ${filename}: ${err.message}`);
        errors++;
      }
    }
    console.log('');
  }

  console.log('\n' + '═'.repeat(50));
  console.log(`✅ Uploaded & inserted : ${uploaded}`);
  console.log(`⏭️  Skipped (duplicate) : ${skipped}`);
  console.log(`❌ Errors              : ${errors}`);
  console.log('═'.repeat(50));
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
