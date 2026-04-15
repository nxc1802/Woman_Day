# 💕 Love Gift Website - Women's Day Special

Một món quà công nghệ tinh tế, lãng mạn dành tặng phái đẹp nhân dịp **8/3, 20/10** hoặc các ngày kỷ niệm. Website được xây dựng với hiệu ứng mượt mà, âm nhạc du dương và hệ thống quản trị nội dung linh hoạt qua Supabase.

[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/gsap/)

---

## 📽️ Video Demo

> [!TIP]
> **Hướng dẫn chèn Video Demo:**
> Vì video của bạn dài và dung lượng lớn, hãy sử dụng link URL để đảm bảo repo gọn nhẹ:
> 1. Upload video lên **YouTube / Vimeo** hoặc kéo thả vào một **GitHub Issue/PR** để lấy link trực tiếp.
> 2. Dán đường dẫn video vào thuộc tính `src` trong đoạn mã dưới đây.

<!-- Bắt đầu đoạn mã Video -->
<div align="center">
  <video src="https://github.com/nxc1802/Woman_Day/releases/download/untagged-894dabf111fb967b151b/Ghi.Man.hinh.2026-04-16.luc.04.08.25.mov" width="100%" controls autoplay muted loop>
    Trình duyệt của bạn không hỗ trợ tag video.
  </video>
  <p><i>Bản demo sinh động về giao diện và hiệu ứng của ứng dụng</i></p>
</div>
<!-- Kết thúc đoạn mã Video -->

---

## ✨ Tính năng nổi bật

- 🔐 **Cửa mật khẩu (Password Gate):** Bảo mật món quà bằng lời giải đố hoặc mật mã riêng tư.
- 🎵 **Trình phát nhạc (Music Player):** Tự động phát nhạc khi vào trang, hỗ trợ danh sách bài hát từ Supabase.
- 📸 **Thư viện ảnh (Photo Gallery):** Hiển thị những khoảnh khắc đáng nhớ theo dạng lưới hoặc album.
- 💌 **Thư tình (Love Letter):** Những lá thư tay được cách điệu nghệ thuật với hiệu ứng chuyển trang.
- 🎁 **Quà tặng bất ngờ (Gift Page):** Hiệu ứng pháo hoa, tuyết rơi và những dòng tin nhắn bay bổng.
- 📷 **Photobooth:** Lưu giữ những khung hình kỷ niệm phong cách Hàn Quốc.
- ⚙️ **Hệ quản trị (Admin Dashboard):** Thay đổi mật khẩu, quản lý ảnh, nhạc và tin nhắn trực tiếp trên web mà không cần sửa code.

---

## 🛠️ Cài đặt & Cấu hình

### 1. Database (Supabase)

Website sử dụng **Supabase** để lưu trữ nội dung động. Hãy tạo một Project mới và chạy SQL sau trong **SQL Editor**:

```sql
-- 1. Bảng mật khẩu truy cập
create table passwords (
  id serial primary key,
  password text not null,
  hint text,
  created_at timestamptz default now()
);

-- 2. Bảng ảnh (Gallery/Solo/Couple)
create table photos (
  id serial primary key,
  src text not null,
  caption text,
  type text default 'solo',
  category text default 'gallery',
  created_at timestamptz default now()
);

-- 3. Bảng nhạc
create table songs (
  id serial primary key,
  title text not null,
  artist text,
  src text not null,
  display_order int default 0,
  created_at timestamptz default now()
);

-- 4. Bảng tin nhắn rơi (Gift Page)
create table gift_messages (
  id serial primary key,
  text text not null,
  display_order int default 0,
  created_at timestamptz default now()
);

-- 5. Bảng lời chúc/Wishlist
create table wishlists (
  id uuid primary key default gen_random_uuid(),
  type text check (type in ('gift', 'event')),
  author text,
  icon text,
  title text,
  description text,
  status text default 'pending',
  created_at timestamptz default now()
);

-- (Tùy chọn) Tắt RLS để đơn giản hóa việc chạy local (Không khuyến khích cho Production)
alter table passwords disable row level security;
alter table photos disable row level security;
alter table songs disable row level security;
alter table gift_messages disable row level security;
alter table wishlists disable row level security;
```

### 2. Biến môi trường (Environment Variables)

Tạo file `.env.local` tại thư mục gốc và điền thông tin từ Supabase (Project Settings > API):

```env
# URL dự án Supabase
VITE_SUPABASE_URL=https://your-project-id.supabase.co

# Key công khai (Anon Key)
VITE_SUPABASE_ANON_KEY=your-anon-key

# Service role key (Chỉ dùng cho các script seed dữ liệu - KHÔNG commmit)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Chạy dự án

```bash
# Cài đặt dependencies
npm install

# Chạy ở chế độ phát triển
npm run dev

# Build sản phẩm
npm run build
```

---

## 🔒 Quản trị hệ thống (Admin Panel)

- Truy cập đường dẫn: `/admin`
- Password mặc định: Cần cấu hình trong file `src/config/passwords.js` hoặc kiểm tra code trong `AdminPage.jsx`.

---

## 🚀 Deployment

Dự án có thể dễ dàng deploy lên **Vercel**, **Netlify** hoặc **GitHub Pages**. Nhớ thêm các biến môi trường vào cấu hình Deployment của nền tảng đó.

---

## 📜 License

Project này được tạo ra với mục đích lan tỏa yêu thương. Bạn có thể tự do sử dụng và tùy chỉnh. Chúc bạn có một ngày kỷ niệm thật ý nghĩa! ❤️
