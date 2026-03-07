import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import '../styles/letter.css';
import { fetchAllLetters, insertLetter, updateLetter, deleteLetter } from '../lib/supabase';

const CARD_COLORS = [
  { bg: '#fce7f3', text: '#9d174d' },
  { bg: '#fdf2f8', text: '#be185d' },
  { bg: '#fff0f6', text: '#9d174d' },
  { bg: '#fdf4ff', text: '#7e22ce' },
  { bg: '#fff1f2', text: '#be123c' },
];
const ICON_OPTIONS = ['💊','✨','💕','🌟','📸','🎁','🤫','💌','🌸','🌺','💗','❤️','🥰','💖','🌙'];
const ROTATIONS  = [-4, -2.5, 2, 3.5, -1.5, 4, -3, 1.8, -4.5, 3.1];


/* ---- Read Modal ---- */
function LetterModal({ letter, onClose, onEdit }) {
  const overlayRef = useRef(null);
  const cardRef    = useRef(null);

  useEffect(() => {
    gsap.from(overlayRef.current, { opacity: 0, duration: 0.25 });
    gsap.from(cardRef.current, { opacity: 0, scale: 0.9, y: 30, duration: 0.4, ease: 'back.out(1.5)' });
  }, []);

  function close() {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.22, onComplete: onClose });
  }

  const isAnh = letter.author === 'Anh';

  return (
    <div className="letter-overlay" ref={overlayRef} onClick={close}>
      <div className="letter-modal" ref={cardRef} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={close}>✕</button>

        <div className="modal-header" style={{ borderBottom: `2px solid ${letter.color}` }}>
          <span className="modal-icon">{letter.icon}</span>
          <div style={{ flex: 1 }}>
            <div className="modal-meta-row">
              <p className="modal-tag" style={{ color: letter.textColor }}>{letter.tag}</p>
              <span className={`author-badge ${isAnh ? 'badge-anh' : 'badge-em'}`}>
                {isAnh ? '💙 Anh' : '🩷 Em'}
              </span>
            </div>
            <h2 className="modal-title">{letter.title}</h2>
          </div>
        </div>

        {letter.pill && (
          <blockquote className="pill-quote" style={{ borderColor: letter.textColor }}>
            <span className="pill-icon">💊</span>
            <p>{letter.pill}</p>
          </blockquote>
        )}

        <div className="modal-body">
          {letter.content.split('\n').map((line, i) =>
            line.trim() ? <p key={i} className="modal-line">{line}</p> : <br key={i} />
          )}
        </div>

        <div className="modal-footer">
          <button className="modal-edit-btn" onClick={() => { onClose(); onEdit(letter); }}>
            ✏️ Sửa thư
          </button>
          <span>with love ❤️</span>
        </div>
      </div>
    </div>
  );
}

/* ---- Edit Letter Form Modal ---- */
function EditLetterModal({ letter, onSave, onClose }) {
  const overlayRef = useRef(null);
  const formRef    = useRef(null);
  const [form, setForm] = useState({
    author:  letter.author,
    icon:    letter.icon   || '💊',
    tag:     letter.tag    || '',
    title:   letter.title  || '',
    pill:    letter.pill   || '',
    content: letter.content || '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    gsap.from(overlayRef.current, { opacity: 0, duration: 0.25 });
    gsap.from(formRef.current, { opacity: 0, scale: 0.92, y: 30, duration: 0.4, ease: 'back.out(1.5)' });
  }, []);

  function close() {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.22, onComplete: onClose });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim() || saving) return;
    setSaving(true);
    const updated = {
      ...letter,
      author:    form.author,
      icon:      form.icon,
      tag:       form.tag.trim() || (form.author === 'Anh' ? 'Từ anh' : 'Từ em'),
      title:     form.title.trim(),
      size:      form.content.length > 150 ? 'large' : form.content.length > 80 ? 'medium' : 'small',
      pill:      form.pill.trim() || null,
      content:   form.content.trim(),
    };
    await onSave(updated);
    close();
  }

  return (
    <div className="letter-overlay" ref={overlayRef} onClick={close}>
      <div className="add-letter-modal" ref={formRef} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={close}>✕</button>
        <h2 className="add-modal-title">✏️ Sửa lá thư</h2>

        <form className="add-letter-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label">Ai đang viết?</label>
            <div className="author-selector">
              {['Anh', 'Em'].map(a => (
                <button key={a} type="button"
                  className={`author-btn ${form.author === a ? (a === 'Anh' ? 'selected-anh' : 'selected-em') : ''}`}
                  onClick={() => setForm(f => ({ ...f, author: a }))}
                >
                  {a === 'Anh' ? '💙' : '🩷'} {a}
                </button>
              ))}
            </div>
          </div>

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

          <div className="form-field">
            <label className="form-label">Nhãn (tag)</label>
            <input className="form-input" placeholder="Ví dụ: Viên thuốc #5, Kỷ niệm..."
              value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} maxLength={40} />
          </div>

          <div className="form-field">
            <label className="form-label">Tiêu đề *</label>
            <input className="form-input" placeholder="Tựa đề lá thư..."
              value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} maxLength={60} required />
          </div>

          <div className="form-field">
            <label className="form-label">Viên thuốc (câu em/anh đã viết — nếu có)</label>
            <input className="form-input" placeholder="Dán câu từ lọ thuốc vào đây..."
              value={form.pill} onChange={e => setForm(f => ({ ...f, pill: e.target.value }))} />
          </div>

          <div className="form-field">
            <label className="form-label">Nội dung / Phản hồi *</label>
            <textarea className="form-textarea" placeholder="Viết điều bạn muốn nói..."
              value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={5} required />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={close}>Hủy</button>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu thay đổi 💾'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---- Add Letter Form Modal ---- */
function AddLetterModal({ onAdd, onClose }) {
  const overlayRef = useRef(null);
  const formRef    = useRef(null);
  const [form, setForm] = useState({ author: 'Anh', icon: '💊', tag: '', title: '', pill: '', content: '' });

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
    onAdd({
      id: Date.now(),
      author: form.author,
      icon: form.icon,
      tag: form.tag.trim() || (form.author === 'Anh' ? 'Từ anh' : 'Từ em'),
      title: form.title.trim(),
      color: colorPick.bg,
      textColor: colorPick.text,
      rotation: ROTATIONS[Math.floor(Math.random() * ROTATIONS.length)],
      size: form.content.length > 150 ? 'large' : form.content.length > 80 ? 'medium' : 'small',
      pill: form.pill.trim() || null,
      content: form.content.trim(),
    });
    close();
  }

  return (
    <div className="letter-overlay" ref={overlayRef} onClick={close}>
      <div className="add-letter-modal" ref={formRef} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={close}>✕</button>
        <h2 className="add-modal-title">✍️ Thêm lá thư mới</h2>

        <form className="add-letter-form" onSubmit={handleSubmit}>
          {/* Author selector */}
          <div className="form-field">
            <label className="form-label">Ai đang viết?</label>
            <div className="author-selector">
              {['Anh', 'Em'].map(a => (
                <button key={a} type="button"
                  className={`author-btn ${form.author === a ? (a === 'Anh' ? 'selected-anh' : 'selected-em') : ''}`}
                  onClick={() => setForm(f => ({ ...f, author: a }))}
                >
                  {a === 'Anh' ? '💙' : '🩷'} {a}
                </button>
              ))}
            </div>
          </div>

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

          <div className="form-field">
            <label className="form-label">Nhãn (tag)</label>
            <input className="form-input" placeholder="Ví dụ: Viên thuốc #5, Kỷ niệm..."
              value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} maxLength={40} />
          </div>

          <div className="form-field">
            <label className="form-label">Tiêu đề *</label>
            <input className="form-input" placeholder="Tựa đề lá thư..."
              value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} maxLength={60} required />
          </div>

          <div className="form-field">
            <label className="form-label">Viên thuốc (câu em/anh đã viết — nếu có)</label>
            <input className="form-input" placeholder="Dán câu từ lọ thuốc vào đây..."
              value={form.pill} onChange={e => setForm(f => ({ ...f, pill: e.target.value }))} />
          </div>

          <div className="form-field">
            <label className="form-label">Nội dung / Phản hồi *</label>
            <textarea className="form-textarea" placeholder="Viết điều bạn muốn nói..."
              value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={5} required />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={close}>Hủy</button>
            <button type="submit" className="btn-save">Ghim thư ❤️</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---- Main Page ---- */
export default function LetterPage() {
  const [letters, setLetters]                 = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [openLetter, setOpenLetter]           = useState(null);
  const [editingLetter, setEditingLetter]     = useState(null);
  const [showAddForm, setShowAddForm]         = useState(false);
  const [filterAuthor, setFilterAuthor]       = useState('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const longPressTimer = useRef(null);
  const didLongPress   = useRef(false);

  useEffect(() => {
    fetchAllLetters()
      .then(setLetters)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filterAuthor === 'all' ? letters : letters.filter(l => l.author === filterAuthor);

  async function handleAdd(newLetter) {
    try {
      const saved = await insertLetter(newLetter);
      setLetters(prev => [...prev, saved]);
    } catch (err) {
      console.error('Failed to save letter:', err);
    }
  }

  async function handleEditSave(updated) {
    try {
      await updateLetter(updated.id, updated);
      setLetters(prev => prev.map(l => l.id === updated.id ? updated : l));
    } catch (err) {
      console.error('Failed to update letter:', err);
    }
  }

  async function confirmDelete(id) {
    setDeleteConfirmId(null);
    try {
      await deleteLetter(id);
      setLetters(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      console.error('Failed to delete letter:', err);
    }
  }

  function startLongPress(letter) {
    didLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      setDeleteConfirmId(letter.id);
    }, 650);
  }

  function cancelLongPress() {
    clearTimeout(longPressTimer.current);
  }

  function handleCardClick(letter) {
    if (didLongPress.current) {
      didLongPress.current = false;
      return;
    }
    if (deleteConfirmId !== null) {
      setDeleteConfirmId(null);
      return;
    }
    setOpenLetter(letter);
  }

  return (
    <div className="letter-page">
      <div className="orb orb-1" /><div className="orb orb-2" />
      <div className="board-bg" />
      <Link to="/home" className="back-btn">← Back</Link>

      <div className="board-header">
        <h1 className="page-title">Lọ Thuốc Tình Yêu 💊</h1>
        <p className="page-subtitle">Những viên thuốc & cảm xúc của hai đứa mình</p>

        <div className="author-filter">
          {['all', 'Anh', 'Em'].map(f => (
            <button key={f} className={`filter-tab ${filterAuthor === f ? 'active' : ''}`}
              onClick={() => setFilterAuthor(f)}>
              {f === 'all' ? '🌸 Tất cả' : f === 'Anh' ? '💙 Anh viết' : '🩷 Em viết'}
            </button>
          ))}
        </div>
      </div>

      <div className="letters-board">
        {loading && (
          <div className="letters-loading">Đang tải thư... 💌</div>
        )}
        {filtered.map(letter => (
          <div
            key={letter.id}
            className={`letter-card card-${letter.size} ${deleteConfirmId === letter.id ? 'delete-mode' : ''}`}
            style={{ '--rot': `${letter.rotation}deg`, '--card-color': letter.color }}
            onMouseDown={() => startLongPress(letter)}
            onMouseUp={cancelLongPress}
            onMouseLeave={cancelLongPress}
            onTouchStart={() => startLongPress(letter)}
            onTouchEnd={cancelLongPress}
            onTouchMove={cancelLongPress}
            onClick={() => handleCardClick(letter)}
          >
            <div className="card-pin" />

            <div className="card-inner">
              <div className="card-tag-row">
                <span className="card-icon-badge">{letter.icon}</span>
                <span className="card-tag" style={{ color: letter.textColor }}>{letter.tag}</span>
                <span className={`author-badge-sm ${letter.author === 'Anh' ? 'badge-anh' : 'badge-em'}`}>
                  {letter.author === 'Anh' ? '💙' : '🩷'} {letter.author}
                </span>
              </div>
              <h3 className="card-heading">{letter.title}</h3>
              {letter.pill && (
                <p className="card-pill-preview">❝ {letter.pill.slice(0, 55)}{letter.pill.length > 55 ? '...' : ''} ❞</p>
              )}
              <p className="card-preview">{letter.content.slice(0, 70)}...</p>
              <span className="card-read-more" style={{ color: letter.textColor }}>Đọc thêm →</span>
            </div>
            <div className="card-shine" />

            {/* Delete confirm overlay — appears after long press */}
            {deleteConfirmId === letter.id && (
              <div className="card-delete-overlay" onClick={e => e.stopPropagation()}>
                <p className="delete-overlay-text">Xoá lá thư này?</p>
                <div className="delete-overlay-actions">
                  <button className="delete-overlay-cancel" onClick={e => { e.stopPropagation(); setDeleteConfirmId(null); }}>Huỷ</button>
                  <button className="delete-overlay-confirm" onClick={e => { e.stopPropagation(); confirmDelete(letter.id); }}>Xoá 🗑️</button>
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="add-letter-card" onClick={() => setShowAddForm(true)}>
          <div className="add-card-pin" />
          <span className="add-card-icon">+</span>
          <p className="add-card-text">Thêm lá thư mới</p>
        </div>
      </div>

      {openLetter    && <LetterModal letter={openLetter} onClose={() => setOpenLetter(null)} onEdit={setEditingLetter} />}
      {showAddForm   && <AddLetterModal onAdd={handleAdd} onClose={() => setShowAddForm(false)} />}
      {editingLetter && <EditLetterModal letter={editingLetter} onSave={handleEditSave} onClose={() => setEditingLetter(null)} />}
    </div>
  );
}
