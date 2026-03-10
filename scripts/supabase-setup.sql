-- ============================================================
-- SUPABASE SETUP — Admin Page tables & storage
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Passwords table
CREATE TABLE IF NOT EXISTS public.passwords (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  password    TEXT NOT NULL,
  hint        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed current passwords
INSERT INTO public.passwords (password, hint) VALUES
  ('05102025',        'Ngày mình quen nhau 🥺'),
  ('18022004',        'Ngày sinh nhật của anh 💕'),
  ('06022009',        'Ngày sinh nhật của em 🌸'),
  ('lethianhhong',    'Họ và tên của em... viết liền, không dấu 🌺'),
  ('nguyenxuancuong', 'Họ và tên của anh... viết liền, không dấu 🌺'),
  ('19092025',        'Ngày đầu tiên mình nhắn tin cho nhau 💕'),
  ('baobinh',         'Cung hoàng đạo của chúng ta... viết liền, không dấu 🌺'),
  ('thangchonggia',   'Em gọi anh là gì mà anh chấm 9đ nhưng em gọi với bạn bè em thì anh chấm 10đ... viết liền, không dấu 🌺'),
  ('2',               'Mỗi ngày uống ít nhất bao nhiêu bình nước? 💦');

-- 2. Photos table
CREATE TABLE IF NOT EXISTS public.photos (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  src         TEXT NOT NULL,
  caption     TEXT NOT NULL DEFAULT '',
  type        TEXT NOT NULL DEFAULT 'solo' CHECK (type IN ('solo', 'couple')),
  category    TEXT NOT NULL DEFAULT 'gallery' CHECK (category IN ('gallery', 'photobooth')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Songs table
CREATE TABLE IF NOT EXISTS public.songs (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title           TEXT NOT NULL,
  artist          TEXT NOT NULL DEFAULT '',
  src             TEXT NOT NULL,
  display_order   INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed current songs
INSERT INTO public.songs (title, artist, src, display_order) VALUES
  ('Chiếc Khăn Gió Ấm', 'Khánh Phương x meChill', '/assets/music/Chiếc Khăn Gió Ấm (Lofi Lyrics) - Khánh Phương x meChill _ gửi cho em đêm lung linh Hot  Tiktok - meChill.mp3', 0),
  ('Hôn Lễ Của Em',      'Hiền Hồ',                '/assets/music/HÔN LỄ CỦA EM - HIỀN HỒ  Solo Version  Sáng tác Trọng Nhân - Hiền Hồ Official.mp3', 1),
  ('Thằng Điên',         'JustaTee x Phương Ly',   '/assets/music/THẰNG ĐIÊN  JUSTATEE x PHƯƠNG LY  OFFICIAL MV - JustaTeeMusic.mp3', 2),
  ('Ai Đưa Em Về',       'TIA ft. Lê Thiện Hiếu',  '/assets/music/TIA - Ai Đưa Em Về  Official M_V  Ft. Lê Thiện Hiếu (Low Cortisol Song) - TIA.mp3', 3);

-- 4. RLS Policies

-- Passwords: anon can read, service_role can all
ALTER TABLE public.passwords ENABLE ROW LEVEL SECURITY;
CREATE POLICY "passwords_anon_read"  ON public.passwords FOR SELECT TO anon USING (true);
CREATE POLICY "passwords_anon_write" ON public.passwords FOR ALL    TO anon USING (true) WITH CHECK (true);

-- Photos: anon can read + write
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "photos_anon_read"  ON public.photos FOR SELECT TO anon USING (true);
CREATE POLICY "photos_anon_write" ON public.photos FOR ALL    TO anon USING (true) WITH CHECK (true);

-- Songs: anon can read + write
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "songs_anon_read"  ON public.songs FOR SELECT TO anon USING (true);
CREATE POLICY "songs_anon_write" ON public.songs FOR ALL    TO anon USING (true) WITH CHECK (true);

-- 5. Storage buckets (run these separately if needed)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('music', 'music', true);
-- Note: You may need to create these via the Supabase Dashboard → Storage → New Bucket
