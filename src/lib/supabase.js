import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(url, key);

const TABLE = 'custom_letters';

const mapRow = row => ({
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

/** Fetch all letters from Supabase, sorted by original insert order */
export async function fetchAllLetters() {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('id', { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

/** Insert a new letter; returns the saved letter */
export async function insertLetter(letter) {
  const { data, error } = await supabase
    .from(TABLE)
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
  return mapRow(data);
}

/** Update editable fields of a letter */
export async function updateLetter(id, fields) {
  const { error } = await supabase
    .from(TABLE)
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

/** Delete a letter by id */
export async function deleteLetter(id) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}
