import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(url, key);

/* ─── Letters ─────────────────────────────────────────────────────── */
const LETTERS_TABLE = 'custom_letters';

const mapLetter = row => ({
  id:        row.id,
  author:    row.author,
  icon:      row.icon,
  tag:       row.tag,
  title:     row.title,
  color:     row.color,
  textColor: row.text_color,
  rotation:  row.rotation,
  size:      row.size,
  pill:      row.pill,
  content:   row.content,
});

export async function fetchAllLetters() {
  const { data, error } = await supabase
    .from(LETTERS_TABLE).select('*').order('id', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapLetter);
}

export async function insertLetter(letter) {
  const { data, error } = await supabase
    .from(LETTERS_TABLE)
    .insert({ id: letter.id, author: letter.author, icon: letter.icon, tag: letter.tag, title: letter.title, color: letter.color, text_color: letter.textColor, rotation: letter.rotation, size: letter.size, pill: letter.pill ?? null, content: letter.content })
    .select().single();
  if (error) throw error;
  return mapLetter(data);
}

export async function updateLetter(id, fields) {
  const { error } = await supabase.from(LETTERS_TABLE)
    .update({ author: fields.author, icon: fields.icon, tag: fields.tag, title: fields.title, text_color: fields.textColor, size: fields.size, pill: fields.pill ?? null, content: fields.content })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteLetter(id) {
  const { error } = await supabase.from(LETTERS_TABLE).delete().eq('id', id);
  if (error) throw error;
}

/* ─── Wishlist ─────────────────────────────────────────────────────── */
const WISH_TABLE = 'wishlists';

const mapWish = row => ({
  id:          row.id,
  type:        row.type,        // 'gift' | 'event'
  author:      row.author,
  icon:        row.icon,
  title:       row.title,
  description: row.description,
  status:      row.status,      // 'pending' | 'done'
});

export async function fetchAllWishlist() {
  const { data, error } = await supabase
    .from(WISH_TABLE).select('*').order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapWish);
}

export async function insertWishItem(item) {
  const { data, error } = await supabase
    .from(WISH_TABLE)
    .insert({ id: item.id, type: item.type, author: item.author, icon: item.icon, title: item.title, description: item.description ?? null, status: 'pending' })
    .select().single();
  if (error) throw error;
  return mapWish(data);
}

export async function toggleWishItem(id, status) {
  const { error } = await supabase.from(WISH_TABLE).update({ status }).eq('id', id);
  if (error) throw error;
}

export async function updateWishItem(id, fields) {
  const { error } = await supabase.from(WISH_TABLE)
    .update({ author: fields.author, icon: fields.icon, title: fields.title, description: fields.description ?? null })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteWishItem(id) {
  const { error } = await supabase.from(WISH_TABLE).delete().eq('id', id);
  if (error) throw error;
}
