/**
 * ============================================================
 *  PASSWORD CONFIG — chỉnh sửa tại đây
 * ============================================================
 *
 *  Mỗi lần mở website mới (tab/session mới), hệ thống tự
 *  chọn ngẫu nhiên 1 cặp { password, hint } từ danh sách bên dưới.
 *
 *  Cách thêm / sửa:
 *    { password: 'mật_khẩu', hint: 'gợi ý hiển thị cho người nhập' }
 *
 *  Lưu ý:
 *    - password không phân biệt HOA/thường khi so sánh
 *    - Phải có ít nhất 1 phần tử trong mảng
 * ============================================================
 */

export const PASSWORDS = [
  {
    password: '05102025',
    hint: 'Ngày mình quen nhau 🥺',
  },
  {
    password: 'iloveyou',
    hint: 'Ba từ anh hay nói nhất 💕',
  },
  {
    password: '08032025',
    hint: 'Ngày đặc biệt của em 🌸',
  },
  {
    password: 'honganhoi',
    hint: 'Tên của em... viết liền, không dấu 🌺',
  },
  {
    password: 'chongvavo',
    hint: 'Cách em hay gọi anh :3',
  },
];
