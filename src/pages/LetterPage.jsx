import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import '../styles/letter.css';

const CARD_COLORS = [
  { bg: '#fce7f3', text: '#9d174d' },
  { bg: '#fdf2f8', text: '#be185d' },
  { bg: '#fff0f6', text: '#9d174d' },
  { bg: '#fdf4ff', text: '#7e22ce' },
  { bg: '#fff1f2', text: '#be123c' },
];
const ICON_OPTIONS = ['✨','💕','🌟','📸','🎁','🤫','💌','🌸','🌺','💗','❤️','🥰','💖','🌙','☕'];
const ROTATIONS = [-4, -2.5, 2, 3.5, -1.5, 4, -3, 1.8, -4.5, 3.1];

const DEFAULT_LETTERS = [
  {
    id: 1, icon: '✨', tag: 'Ngày đầu tiên', title: 'Lần Đầu Gặp Em',
    color: '#fce7f3', textColor: '#9d174d', rotation: -3.5, size: 'medium',
    content: `Anh vẫn còn nhớ rất rõ cái khoảnh khắc đó. Một buổi chiều bình thường, bỗng nhiên mọi thứ xung quanh như chậm lại khi anh nhìn thấy em.

Có điều gì đó trong ánh mắt em, trong nụ cười em, khiến anh không thể nhìn đi chỗ khác được. Anh chẳng biết giải thích thế nào, chỉ biết rằng — khoảnh khắc đó, mọi thứ đã thay đổi.

Cảm ơn em đã xuất hiện trong cuộc đời anh. 🌸`,
  },
  {
    id: 2, icon: '💕', tag: 'Từ trái tim anh', title: 'Tại Sao Anh Yêu Em',
    color: '#fdf2f8', textColor: '#be185d', rotation: 2.8, size: 'large',
    content: `Có hàng nghìn lý do tại sao anh yêu em, nhưng để bắt đầu:

❤️ Nụ cười của em có thể làm sáng lên bất kỳ căn phòng nào
💕 Cách em quan tâm đến mọi người xung quanh
✨ Sự mạnh mẽ và dịu dàng trong em cùng lúc
🌸 Giọng cười của em — anh có thể nghe mãi không chán
💗 Cách em nhìn thế giới — đơn giản, thuần khiết và đẹp đẽ

Nhưng trên hết, anh yêu em vì em chính là em — không ai giống em cả.`,
  },
  {
    id: 3, icon: '🌟', tag: 'Lời hứa', title: 'Những Điều Anh Hứa',
    color: '#fff0f6', textColor: '#9d174d', rotation: -1.8, size: 'small',
    content: `Anh hứa sẽ luôn ở đây, dù trời mưa hay nắng.
Anh hứa sẽ là người đầu tiên em gọi khi cần.
Anh hứa sẽ không bao giờ để em cảm thấy cô đơn.
Anh hứa sẽ cố gắng mỗi ngày để xứng đáng với em.

Và anh hứa — dù thời gian có trôi, tình cảm của anh chỉ lớn hơn, không bao giờ nhỏ đi. 💕`,
  },
  {
    id: 4, icon: '📸', tag: 'Kỷ niệm', title: 'Kỷ Niệm Đẹp Nhất',
    color: '#fce7f3', textColor: '#be185d', rotation: 4.2, size: 'medium',
    content: `Có những khoảnh khắc anh sẽ giữ mãi trong lòng:

🌸 Lần đầu tiên em cười thật sự với anh
☕ Những buổi chiều bên nhau, không nói gì nhưng vẫn thấy ấm
🌙 Đêm muộn mình nhắn tin, không muốn ngủ vì sợ mất khoảnh khắc đó
🎵 Bài hát em hát — dù chỉ một mình — anh vẫn nghe thấy

Mỗi kỷ niệm nhỏ đó, với anh, đều là châu báu.`,
  },
  {
    id: 5, icon: '🎁', tag: 'Ngày 8/3', title: 'Lời Chúc Ngày Của Em',
    color: '#fdf2f8', textColor: '#9d174d', rotation: -4.5, size: 'large',
    content: `Happy Women's Day, tình yêu của anh.

Hôm nay — và mọi ngày — anh muốn em biết rằng em là người phụ nữ tuyệt vời nhất mà anh từng gặp. Không phải vì ngày 8/3 bắt buộc anh phải nói điều này. Mà vì đó là sự thật.

Em mạnh mẽ theo cách riêng của em.
Em đẹp — theo mọi nghĩa của từ đó.
Em xứng đáng được yêu thương mỗi ngày, không chỉ hôm nay.

Chúc em luôn rạng rỡ, luôn hạnh phúc, và luôn biết rằng anh ở đây. 🌸❤️`,
  },
  {
    id: 6, icon: '🤫', tag: 'Bí mật', title: 'Điều Em Không Biết',
    color: '#fff0f6', textColor: '#be185d', rotation: 3.1, size: 'small',
    content: `Có những điều anh chưa bao giờ nói thẳng:

Mỗi lần em nhắn tin trước, anh hạnh phúc cả ngày.
Anh hay nhìn lại ảnh của em khi buồn — và nó luôn hiệu quả.
Giọng em có một thứ gì đó rất bình yên mà anh không biết tả.

Em không biết đâu — nhưng em quan trọng với anh hơn em nghĩ rất nhiều. 💕`,
  },
];

/* ---- Read Modal ---- */
function LetterModal({ letter, onClose }) {
  const overlayRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.from(overlayRef.current, { opacity: 0, duration: 0.25 });
    gsap.from(cardRef.current, { opacity: 0, scale: 0.9, y: 30, duration: 0.4, ease: 'back.out(1.5)' });
  }, []);

  function close() {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.22, onComplete: onClose });
  }

  return (
    <div className="letter-overlay" ref={overlayRef} onClick={close}>
      <div className="letter-modal" ref={cardRef} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={close}>✕</button>
        <div className="modal-header" style={{ borderBottom: `2px solid ${letter.color}` }}>
          <span className="modal-icon">{letter.icon}</span>
          <div>
            <p className="modal-tag" style={{ color: letter.textColor }}>{letter.tag}</p>
            <h2 className="modal-title">{letter.title}</h2>
          </div>
        </div>
        <div className="modal-body">
          {letter.content.split('\n').map((line, i) =>
            line.trim() ? <p key={i} className="modal-line">{line}</p> : <br key={i} />
          )}
        </div>
        <div className="modal-footer">
          <span>with love ❤️</span>
        </div>
      </div>
    </div>
  );
}

/* ---- Add Letter Form Modal ---- */
function AddLetterModal({ onAdd, onClose }) {
  const overlayRef = useRef(null);
  const formRef = useRef(null);
  const [form, setForm] = useState({
    icon: '💕',
    tag: '',
    title: '',
    content: '',
  });

  useEffect(() => {
    gsap.from(overlayRef.current, { opacity: 0, duration: 0.25 });
    gsap.from(formRef.current, { opacity: 0, scale: 0.92, y: 30, duration: 0.4, ease: 'back.out(1.5)' });
  }, []);

  function close() {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.22, onComplete: onClose });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    const colorPick = CARD_COLORS[Math.floor(Math.random() * CARD_COLORS.length)];
    const newLetter = {
      id: Date.now(),
      icon: form.icon,
      tag: form.tag.trim() || 'Tâm sự',
      title: form.title.trim(),
      color: colorPick.bg,
      textColor: colorPick.text,
      rotation: ROTATIONS[Math.floor(Math.random() * ROTATIONS.length)],
      size: form.content.length > 150 ? 'large' : form.content.length > 80 ? 'medium' : 'small',
      content: form.content.trim(),
    };
    onAdd(newLetter);
    close();
  }

  return (
    <div className="letter-overlay" ref={overlayRef} onClick={close}>
      <div className="add-letter-modal" ref={formRef} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={close}>✕</button>
        <h2 className="add-modal-title">✍️ Thêm lá thư mới</h2>

        <form className="add-letter-form" onSubmit={handleSubmit}>
          {/* Icon picker */}
          <div className="form-field">
            <label className="form-label">Icon</label>
            <div className="icon-picker">
              {ICON_OPTIONS.map(icon => (
                <button key={icon} type="button"
                  className={`icon-btn ${form.icon === icon ? 'selected' : ''}`}
                  onClick={() => setForm(f => ({ ...f, icon }))}
                >{icon}</button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Nhãn nhỏ (tag)</label>
              <input
                className="form-input"
                placeholder="Ví dụ: Kỷ niệm, Lời hứa..."
                value={form.tag}
                onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}
                maxLength={30}
              />
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">Tiêu đề *</label>
            <input
              className="form-input"
              placeholder="Tựa đề lá thư..."
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              maxLength={60}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">Nội dung *</label>
            <textarea
              className="form-textarea"
              placeholder="Viết điều bạn muốn nói..."
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              rows={6}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={close}>Hủy</button>
            <button type="submit" className="btn-pink btn-save">Ghim thư ❤️</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---- Main Page ---- */
export default function LetterPage() {
  const [letters, setLetters] = useState(DEFAULT_LETTERS);
  const [openLetter, setOpenLetter] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  function handleAdd(newLetter) {
    setLetters(prev => [...prev, newLetter]);
  }

  return (
    <div className="letter-page">
      <div className="orb orb-1" /><div className="orb orb-2" />
      <div className="board-bg" />
      <Link to="/home" className="back-btn">← Back</Link>

      <div className="board-header">
        <h1 className="page-title">Love Letters</h1>
        <p className="page-subtitle">Click any note to read ✉️</p>
      </div>

      <div className="letters-board">
        {letters.map(letter => (
          <div
            key={letter.id}
            className={`letter-card card-${letter.size}`}
            style={{ '--rot': `${letter.rotation}deg`, '--card-color': letter.color }}
            onClick={() => setOpenLetter(letter)}
          >
            <div className="card-pin" />
            <div className="card-inner">
              <div className="card-tag-row">
                <span className="card-icon-badge">{letter.icon}</span>
                <span className="card-tag" style={{ color: letter.textColor }}>{letter.tag}</span>
              </div>
              <h3 className="card-heading">{letter.title}</h3>
              <p className="card-preview">{letter.content.slice(0, 80)}...</p>
              <span className="card-read-more" style={{ color: letter.textColor }}>
                Đọc thêm →
              </span>
            </div>
            <div className="card-shine" />
          </div>
        ))}

        {/* Add card button */}
        <div className="add-letter-card" onClick={() => setShowAddForm(true)}>
          <div className="add-card-pin" />
          <span className="add-card-icon">+</span>
          <p className="add-card-text">Thêm lá thư mới</p>
        </div>
      </div>

      {openLetter && (
        <LetterModal letter={openLetter} onClose={() => setOpenLetter(null)} />
      )}
      {showAddForm && (
        <AddLetterModal onAdd={handleAdd} onClose={() => setShowAddForm(false)} />
      )}
    </div>
  );
}
