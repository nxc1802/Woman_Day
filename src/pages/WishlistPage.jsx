import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import '../styles/wishlist.css';
import { insertWishlistItem, updateWishlistItem, deleteWishlistItem, toggleWishlistStatus } from '../lib/supabase';
import { useAppData } from '../contexts/AppDataContext';

const ICON_OPTIONS_GIFT  = ['🎁','💝','👗','💄','📚','🎮','💍','🌹','🎀','👠','🧸','🪞','💐','🍰','☕'];
const ICON_OPTIONS_EVENT = ['🎡','🎢','🎪','🎭','🍜','🏖️','🎬','🌙','🎆','🎵','🏔️','🌸','🎑','🚗','🍣'];

/* ── Starfield background ── */
function StarsBg() {
  const stars = Array.from({ length: 35 }, (_, i) => ({
    id: i,
    left:  `${Math.random() * 100}%`,
    top:   `${Math.random() * 100}%`,
    size:  `${0.15 + Math.random() * 0.4}rem`,
    dur:   `${2 + Math.random() * 4}s`,
    delay: `${Math.random() * 5}s`,
  }));
  const shoots = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    top:   `${10 + Math.random() * 30}%`,
    delay: `${i * 3.5 + Math.random() * 2}s`,
    dur:   `${0.7 + Math.random() * 0.5}s`,
  }));
  return (
    <div className="wish-stars-bg">
      {stars.map(s => (
        <span key={s.id} className="wish-star" style={{
          left: s.left, top: s.top, fontSize: s.size,
          animationDuration: s.dur, animationDelay: s.delay,
        }}>✦</span>
      ))}
      {shoots.map(s => (
        <div key={s.id} className="wish-shoot" style={{
          top: s.top, animationDelay: s.delay, animationDuration: s.dur,
        }} />
      ))}
    </div>
  );
}

/* ── Wish Card ── */
function WishCard({ item, onOpen, onToggle, longPressHandlers, isConfirming }) {
  return (
    <div
      className={`wish-card wish-${item.type} ${item.status === 'done' ? 'wish-done' : ''} ${isConfirming ? 'delete-mode' : ''}`}
      {...longPressHandlers}
      onClick={() => onOpen(item)}
    >
      <div className="wish-card-glow" />

      {/* Status toggle */}
      <button
        className={`wish-status-btn ${item.status === 'done' ? 'done' : ''}`}
        onClick={e => { e.stopPropagation(); onToggle(item); }}
        title={item.status === 'done' ? 'Đánh dấu chưa xong' : 'Đánh dấu đã xong'}
      >
        {item.status === 'done' ? '✓' : '○'}
      </button>

      <div className="wish-card-icon">{item.icon || (item.type === 'gift' ? '🎁' : '🌟')}</div>
      <div className="wish-card-body">
        <h3 className={`wish-card-title ${item.status === 'done' ? 'done-title' : ''}`}>{item.title}</h3>
        {item.description && (
          <p className="wish-card-desc">{item.description.slice(0, 65)}{item.description.length > 65 ? '...' : ''}</p>
        )}
        <div className="wish-card-footer">
          <span className={`wish-author-badge ${item.author === 'Anh' ? 'badge-anh' : 'badge-em'}`}>
            {item.author === 'Anh' ? '💙' : '🩷'} {item.author}
          </span>
          {item.status === 'done' && <span className="wish-done-badge">✨ Đã thực hiện</span>}
        </div>
      </div>

      {/* Delete confirm overlay */}
      {isConfirming && (
        <div className="wish-delete-overlay" onClick={e => e.stopPropagation()}>
          <p className="delete-overlay-text">Xoá ước mơ này?</p>
          <div className="delete-overlay-actions">
            <button className="delete-overlay-cancel" onClick={e => { e.stopPropagation(); longPressHandlers.onCancelDelete(); }}>Huỷ</button>
            <button className="delete-overlay-confirm" onClick={e => { e.stopPropagation(); longPressHandlers.onConfirmDelete(item.id); }}>Xoá 🗑️</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Detail / Read Modal ── */
function WishModal({ item, onClose, onEdit }) {
  const overlayRef = useRef(null);
  const cardRef    = useRef(null);

  useEffect(() => {
    gsap.from(overlayRef.current, { opacity: 0, duration: 0.25 });
    gsap.from(cardRef.current, { opacity: 0, scale: 0.9, y: 30, duration: 0.4, ease: 'back.out(1.5)' });
  }, []);

  function close() {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, onComplete: onClose });
  }

  return (
    <div className="wish-overlay" ref={overlayRef} onClick={close}>
      <div className="wish-modal" ref={cardRef} onClick={e => e.stopPropagation()}>
        <button className="wish-modal-close" onClick={close}>✕</button>

        <div className={`wish-modal-header ${item.type === 'gift' ? 'header-gift' : 'header-event'}`}>
          <span className="wish-modal-icon">{item.icon || (item.type === 'gift' ? '🎁' : '🌟')}</span>
          <div>
            <p className="wish-modal-type">{item.type === 'gift' ? '🎁 Quà tặng' : '🌟 Sự kiện'}</p>
            <h2 className={`wish-modal-title ${item.status === 'done' ? 'done-title' : ''}`}>{item.title}</h2>
          </div>
          <span className={`wish-author-badge ${item.author === 'Anh' ? 'badge-anh' : 'badge-em'}`}>
            {item.author === 'Anh' ? '💙 Anh' : '🩷 Em'}
          </span>
        </div>

        {item.description && (
          <div className="wish-modal-body">
            {item.description.split('\n').map((line, i) =>
              line.trim() ? <p key={i} className="wish-modal-line">{line}</p> : <br key={i} />
            )}
          </div>
        )}

        {item.status === 'done' && (
          <div className="wish-done-banner">✨ Đã thực hiện rồi!</div>
        )}

        <div className="wish-modal-footer">
          <button className="wish-edit-btn" onClick={() => { onClose(); onEdit(item); }}>✏️ Sửa</button>
          <span className="wish-modal-love">with love ❤️</span>
        </div>
      </div>
    </div>
  );
}

/* ── Shared Form ── */
function WishForm({ initial, activeTab, onSave, onClose, isEdit }) {
  const overlayRef = useRef(null);
  const formRef    = useRef(null);
  const [form, setForm] = useState(initial || {
    type: activeTab, author: 'Anh', icon: '', title: '', description: '',
  });
  const [saving, setSaving] = useState(false);
  const icons = form.type === 'gift' ? ICON_OPTIONS_GIFT : ICON_OPTIONS_EVENT;

  useEffect(() => {
    gsap.from(overlayRef.current, { opacity: 0, duration: 0.25 });
    gsap.from(formRef.current, { opacity: 0, scale: 0.92, y: 30, duration: 0.4, ease: 'back.out(1.5)' });
  }, []);

  function close() {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, onComplete: onClose });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || saving) return;
    setSaving(true);
    await onSave({ ...form, title: form.title.trim(), description: form.description.trim() });
    close();
  }

  return (
    <div className="wish-overlay" ref={overlayRef} onClick={close}>
      <div className="wish-form-modal" ref={formRef} onClick={e => e.stopPropagation()}>
        <button className="wish-modal-close" onClick={close}>✕</button>
        <h2 className="wish-form-title">
          {isEdit ? '✏️ Sửa ước mơ' : (form.type === 'gift' ? '🎁 Thêm quà tặng' : '🌟 Thêm sự kiện')}
        </h2>

        <form className="wish-form" onSubmit={handleSubmit}>
          {/* Type selector — only in add mode */}
          {!isEdit && (
            <div className="form-field">
              <label className="form-label">Loại</label>
              <div className="wish-type-selector">
                {[{ v: 'gift', label: '🎁 Quà tặng' }, { v: 'event', label: '🌟 Sự kiện' }].map(({ v, label }) => (
                  <button key={v} type="button"
                    className={`wish-type-btn ${form.type === v ? 'selected' : ''}`}
                    onClick={() => setForm(f => ({ ...f, type: v, icon: '' }))}
                  >{label}</button>
                ))}
              </div>
            </div>
          )}

          {/* Author */}
          <div className="form-field">
            <label className="form-label">Ai muốn?</label>
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

          {/* Icon */}
          <div className="form-field">
            <label className="form-label">Icon</label>
            <div className="icon-picker">
              {icons.map(icon => (
                <button key={icon} type="button"
                  className={`icon-btn ${form.icon === icon ? 'selected' : ''}`}
                  onClick={() => setForm(f => ({ ...f, icon }))}
                >{icon}</button>
              ))}
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">Tên / tiêu đề *</label>
            <input className="form-input" placeholder={form.type === 'gift' ? 'Món quà bạn muốn...' : 'Sự kiện bạn muốn làm...'}
              value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} maxLength={80} required />
          </div>

          <div className="form-field">
            <label className="form-label">Mô tả thêm (không bắt buộc)</label>
            <textarea className="form-textarea" placeholder="Kể thêm chi tiết..."
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={close}>Hủy</button>
            <button type="submit" className="btn-save wish-btn-save" disabled={saving}>
              {saving ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi 💾' : 'Thêm vào 🌙'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function WishlistPage() {
  const { wishlists, setWishlists, wishlistsReady } = useAppData();

  const [activeTab,      setActiveTab]      = useState('gift');
  const [filterAuthor,   setFilterAuthor]   = useState('all');
  const [openItem,       setOpenItem]       = useState(null);
  const [editingItem,    setEditingItem]    = useState(null);
  const [showAddForm,    setShowAddForm]    = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const longPressTimer = useRef(null);
  const didLongPress   = useRef(false);
  const headerRef = useRef(null);
  const gridRef   = useRef(null);

  useEffect(() => {
    if (!wishlistsReady) return;
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, { opacity: 0, y: -30, duration: 0.7, ease: 'power3.out' });
      if (gridRef.current?.children.length) {
        gsap.from(gridRef.current.children, {
          opacity: 0, y: 40, scale: 0.9, stagger: 0.1, duration: 0.55, ease: 'back.out(1.4)', delay: 0.2,
        });
      }
    });
    return () => ctx.revert();
  }, [wishlistsReady]);

  const filtered = wishlists
    .filter(w => w.type === activeTab)
    .filter(w => filterAuthor === 'all' || w.author === filterAuthor);

  /* ── Long press handlers ── */
  function startLongPress(item) {
    didLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      setDeleteConfirmId(item.id);
    }, 650);
  }
  function cancelLongPress() { clearTimeout(longPressTimer.current); }
  function handleCardClick(item) {
    if (didLongPress.current) { didLongPress.current = false; return; }
    if (deleteConfirmId !== null) { setDeleteConfirmId(null); return; }
    setOpenItem(item);
  }

  /* ── CRUD ── */
  async function handleAdd(form) {
    const newItem = {
      id:          Date.now(),
      type:        form.type,
      author:      form.author,
      icon:        form.icon || (form.type === 'gift' ? '🎁' : '🌟'),
      title:       form.title,
      description: form.description || null,
      status:      'pending',
    };
    try {
      const saved = await insertWishlistItem(newItem);
      setWishlists(prev => [...prev, saved]);
    } catch (err) { console.error(err); }
  }

  async function handleEditSave(form) {
    const updated = { ...editingItem, ...form };
    try {
      await updateWishlistItem(updated.id, updated);
      setWishlists(prev => prev.map(w => w.id === updated.id ? updated : w));
    } catch (err) { console.error(err); }
  }

  async function handleToggle(item) {
    const newStatus = item.status === 'done' ? 'pending' : 'done';
    try {
      await toggleWishlistStatus(item.id, newStatus);
      setWishlists(prev => prev.map(w => w.id === item.id ? { ...w, status: newStatus } : w));
    } catch (err) { console.error(err); }
  }

  async function confirmDelete(id) {
    setDeleteConfirmId(null);
    try {
      await deleteWishlistItem(id);
      setWishlists(prev => prev.filter(w => w.id !== id));
    } catch (err) { console.error(err); }
  }

  return (
    <div className="wish-page">
      <div className="orb orb-1" /><div className="orb orb-2" />
      <StarsBg />
      <Link to="/home" className="back-btn">← Back</Link>

      <div className="wish-header" ref={headerRef}>
        <h1 className="page-title wish-title">Danh Sách Ước Mơ 🌙</h1>
        <p className="page-subtitle wish-subtitle">Những điều mình muốn làm và nhận cùng nhau</p>

        {/* Tab switcher */}
        <div className="wish-tabs">
          <button className={`wish-tab ${activeTab === 'gift' ? 'active-gift' : ''}`} onClick={() => setActiveTab('gift')}>
            🎁 Quà tặng
            <span className="wish-tab-count">{wishlists.filter(w => w.type === 'gift').length}</span>
          </button>
          <button className={`wish-tab ${activeTab === 'event' ? 'active-event' : ''}`} onClick={() => setActiveTab('event')}>
            🌟 Sự kiện
            <span className="wish-tab-count">{wishlists.filter(w => w.type === 'event').length}</span>
          </button>
        </div>

        {/* Author filter */}
        <div className="author-filter wish-author-filter">
          {['all', 'Anh', 'Em'].map(f => (
            <button key={f} className={`filter-tab ${filterAuthor === f ? 'active' : ''}`}
              onClick={() => setFilterAuthor(f)}>
              {f === 'all' ? '🌸 Tất cả' : f === 'Anh' ? '💙 Anh muốn' : '🩷 Em muốn'}
            </button>
          ))}
        </div>
      </div>

      <div className="wish-grid" ref={gridRef}>
        {!wishlistsReady && (
          <div className="letters-loading">Đang tải ước mơ... 🌙</div>
        )}

        {filtered.map(item => (
          <WishCard
            key={item.id}
            item={item}
            onOpen={handleCardClick}
            onToggle={handleToggle}
            isConfirming={deleteConfirmId === item.id}
            longPressHandlers={{
              onMouseDown:      () => startLongPress(item),
              onMouseUp:        cancelLongPress,
              onMouseLeave:     cancelLongPress,
              onTouchStart:     () => startLongPress(item),
              onTouchEnd:       cancelLongPress,
              onTouchMove:      cancelLongPress,
              onCancelDelete:   () => setDeleteConfirmId(null),
              onConfirmDelete:  confirmDelete,
            }}
          />
        ))}

        {/* Add card */}
        <div className="wish-add-card" onClick={() => setShowAddForm(true)}>
          <span className="add-card-icon">+</span>
          <p className="add-card-text">
            {activeTab === 'gift' ? 'Thêm quà mong muốn' : 'Thêm sự kiện muốn làm'}
          </p>
        </div>
      </div>

      {openItem    && <WishModal item={openItem} onClose={() => setOpenItem(null)} onEdit={item => { setOpenItem(null); setEditingItem(item); }} />}
      {showAddForm && <WishForm activeTab={activeTab} onSave={handleAdd} onClose={() => setShowAddForm(false)} />}
      {editingItem && <WishForm initial={editingItem} activeTab={activeTab} onSave={handleEditSave} onClose={() => setEditingItem(null)} isEdit />}
    </div>
  );
}
