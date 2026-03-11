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

/* ─── Passwords ────────────────────────────────────────────────────── */
const PW_TABLE = 'passwords';

export async function fetchPasswords() {
  const { data, error } = await supabase
    .from(PW_TABLE).select('*').order('id', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(r => ({ id: r.id, password: r.password, hint: r.hint }));
}

export async function insertPassword(pw) {
  const { data, error } = await supabase
    .from(PW_TABLE)
    .insert({ password: pw.password, hint: pw.hint })
    .select().single();
  if (error) throw error;
  return { id: data.id, password: data.password, hint: data.hint };
}

export async function updatePassword(id, fields) {
  const { error } = await supabase.from(PW_TABLE)
    .update({ password: fields.password, hint: fields.hint })
    .eq('id', id);
  if (error) throw error;
}

export async function deletePassword(id) {
  const { error } = await supabase.from(PW_TABLE).delete().eq('id', id);
  if (error) throw error;
}

/* ─── Photos ───────────────────────────────────────────────────────── */
const PHOTOS_TABLE = 'photos';

export async function fetchPhotos(filters = {}) {
  let q = supabase.from(PHOTOS_TABLE).select('*').order('id', { ascending: true });
  if (filters.type) q = q.eq('type', filters.type);
  if (filters.category) q = q.eq('category', filters.category);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map(r => ({ id: r.id, src: r.src, caption: r.caption, type: r.type, category: r.category }));
}

export async function insertPhoto(photo) {
  const { data, error } = await supabase
    .from(PHOTOS_TABLE)
    .insert({ src: photo.src, caption: photo.caption || '', type: photo.type || 'solo', category: photo.category || 'gallery' })
    .select().single();
  if (error) throw error;
  return { id: data.id, src: data.src, caption: data.caption, type: data.type, category: data.category };
}

export async function deletePhoto(id) {
  const { error } = await supabase.from(PHOTOS_TABLE).delete().eq('id', id);
  if (error) throw error;
}

export async function uploadPhotoFile(file) {
  const ext = file.name.split('.').pop();
  const path = `uploads/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from('photos').upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from('photos').getPublicUrl(path);
  return data.publicUrl;
}

export async function deletePhotoFile(publicUrl) {
  // Extract path from public URL
  const match = publicUrl.match(/\/storage\/v1\/object\/public\/photos\/(.+)/);
  if (!match) return;
  const { error } = await supabase.storage.from('photos').remove([match[1]]);
  if (error) throw error;
}

/* ─── Songs ────────────────────────────────────────────────────────── */
const SONGS_TABLE = 'songs';

export async function fetchSongs() {
  const { data, error } = await supabase
    .from(SONGS_TABLE).select('*').order('display_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(r => ({ id: r.id, title: r.title, artist: r.artist, src: r.src, displayOrder: r.display_order }));
}

export async function insertSong(song) {
  const { data, error } = await supabase
    .from(SONGS_TABLE)
    .insert({ title: song.title, artist: song.artist || '', src: song.src, display_order: song.displayOrder || 0 })
    .select().single();
  if (error) throw error;
  return { id: data.id, title: data.title, artist: data.artist, src: data.src, displayOrder: data.display_order };
}

export async function deleteSong(id) {
  const { error } = await supabase.from(SONGS_TABLE).delete().eq('id', id);
  if (error) throw error;
}

export async function uploadSongFile(file) {
  const ext = file.name.split('.').pop();
  const path = `uploads/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from('music').upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from('music').getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteSongFile(publicUrl) {
  const match = publicUrl.match(/\/storage\/v1\/object\/public\/music\/(.+)/);
  if (!match) return;
  const { error } = await supabase.storage.from('music').remove([match[1]]);
  if (error) throw error;
}

/* ─── Gift Messages ─────────────────────────────────────────────────── */
const MSG_TABLE = 'gift_messages';

const mapMessage = row => ({
  id:           row.id,
  text:         row.text,
  displayOrder: row.display_order,
});

export async function fetchGiftMessages() {
  const { data, error } = await supabase
    .from(MSG_TABLE).select('*').order('display_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapMessage);
}

export async function insertGiftMessage(msg) {
  const { data, error } = await supabase
    .from(MSG_TABLE)
    .insert({ text: msg.text, display_order: msg.displayOrder ?? 0 })
    .select().single();
  if (error) throw error;
  return mapMessage(data);
}

export async function updateGiftMessage(id, fields) {
  const update = {};
  if (fields.text         !== undefined) update.text          = fields.text;
  if (fields.displayOrder !== undefined) update.display_order = fields.displayOrder;
  const { error } = await supabase.from(MSG_TABLE).update(update).eq('id', id);
  if (error) throw error;
}

export async function deleteGiftMessage(id) {
  const { error } = await supabase.from(MSG_TABLE).delete().eq('id', id);
  if (error) throw error;
}
