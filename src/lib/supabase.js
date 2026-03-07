import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(url, key);

const TABLE = 'custom_letters';

/** Fetch all user-added letters from Supabase, sorted oldest first */
export async function fetchCustomLetters() {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []).map(row => ({
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
    isCustom:  true,
  }));
}

/** Insert a new letter; returns the saved letter with server-confirmed id */
export async function insertCustomLetter(letter) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      id:        letter.id,
      author:    letter.author,
      icon:      letter.icon,
      tag:       letter.tag,
      title:     letter.title,
      color:     letter.color,
      text_color: letter.textColor,
      rotation:  letter.rotation,
      size:      letter.size,
      pill:      letter.pill ?? null,
      content:   letter.content,
    })
    .select()
    .single();

  if (error) throw error;
  return { ...letter, id: data.id, isCustom: true };
}

/** Delete a letter by id */
export async function deleteCustomLetter(id) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}

/** Update editable fields of an existing letter */
export async function updateCustomLetter(id, fields) {
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
