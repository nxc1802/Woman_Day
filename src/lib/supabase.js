import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(url, key);

/* ── Row mappers (exported so AppDataContext can use them for Realtime) ── */

export const mapLetterRow = row => ({
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

export const mapWishRow = row => ({
  id:          row.id,
  type:        row.type,
  author:      row.author,
  icon:        row.icon,
  title:       row.title,
  description: row.description,
  status:      row.status,
});

/* ── Letters ── */

export async function fetchAllLetters() {
  const { data, error } = await supabase
    .from('custom_letters')
    .select('*')
    .order('id', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapLetterRow);
}

export async function insertLetter(letter) {
  const { data, error } = await supabase
    .from('custom_letters')
    .insert({
      id:         letter.id,
      author:     letter.author,
      icon:       letter.icon,
      tag:        letter.tag,
      title:      letter.title,
      color:      letter.color,
      text_color: letter.textColor,
      rotation:   letter.rotation,
      size:       letter.size,
      pill:       letter.pill ?? null,
      content:    letter.content,
    })
    .select()
    .single();
  if (error) throw error;
  return mapLetterRow(data);
}

export async function updateLetter(id, fields) {
  const { error } = await supabase
    .from('custom_letters')
    .update({
      author:     fields.author,
      icon:       fields.icon,
      tag:        fields.tag,
      title:      fields.title,
      text_color: fields.textColor,
      size:       fields.size,
      pill:       fields.pill ?? null,
      content:    fields.content,
    })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteLetter(id) {
  const { error } = await supabase.from('custom_letters').delete().eq('id', id);
  if (error) throw error;
}

/* ── Wishlists ── */

export async function fetchAllWishlists() {
  const { data, error } = await supabase
    .from('wishlists')
    .select('*')
    .order('id', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapWishRow);
}

export async function insertWishlistItem(item) {
  const { data, error } = await supabase
    .from('wishlists')
    .insert({
      id:          item.id,
      type:        item.type,
      author:      item.author,
      icon:        item.icon,
      title:       item.title,
      description: item.description ?? null,
      status:      item.status ?? 'pending',
    })
    .select()
    .single();
  if (error) throw error;
  return mapWishRow(data);
}

export async function updateWishlistItem(id, fields) {
  const { error } = await supabase
    .from('wishlists')
    .update({
      author:      fields.author,
      icon:        fields.icon,
      title:       fields.title,
      description: fields.description ?? null,
      status:      fields.status,
    })
    .eq('id', id);
  if (error) throw error;
}

export async function toggleWishlistStatus(id, newStatus) {
  const { error } = await supabase
    .from('wishlists')
    .update({ status: newStatus })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteWishlistItem(id) {
  const { error } = await supabase.from('wishlists').delete().eq('id', id);
  if (error) throw error;
}
