import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ADMIN_PASSWORD } from '../config/passwords';
import {
    fetchPasswords, insertPassword, updatePassword, deletePassword,
    fetchPhotos, insertPhoto, deletePhoto, uploadPhotoFile, deletePhotoFile,
    fetchSongs, insertSong, deleteSong, uploadSongFile, deleteSongFile,
    fetchGiftMessages, insertGiftMessage, updateGiftMessage, deleteGiftMessage,
} from '../lib/supabase';
import { invalidatePasswords, invalidatePhotos, invalidateSongs, invalidateMessages } from '../lib/prefetch';
import '../styles/admin.css';

/* ============================================================
   Toast helper
   ============================================================ */
function useToast() {
    const [toast, setToast] = useState(null);
    const show = useCallback((msg, isError = false) => {
        setToast({ msg, isError });
        setTimeout(() => setToast(null), 3000);
    }, []);
    const el = toast ? (
        <div className={`admin-toast ${toast.isError ? 'error' : ''}`}>{toast.msg}</div>
    ) : null;
    return [show, el];
}

/* ============================================================
   Password Tab
   ============================================================ */
function PasswordTab({ showToast }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null); // null | 'add' | { id, password, hint }

    const load = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchPasswords();
            setItems(data);
        } catch { showToast('❌ Không tải được passwords', true); }
        finally { setLoading(false); }
    }, [showToast]);

    useEffect(() => { load(); }, [load]);

    async function handleSave(form) {
        try {
            if (modal === 'add') {
                await insertPassword(form);
                showToast('✅ Đã thêm password mới');
            } else {
                await updatePassword(modal.id, form);
                showToast('✅ Đã cập nhật password');
            }
            invalidatePasswords();
            setModal(null);
            load();
        } catch { showToast('❌ Lỗi khi lưu', true); }
    }

    async function handleDelete(id) {
        if (!confirm('Xóa password này?')) return;
        try {
            await deletePassword(id);
            invalidatePasswords();
            showToast('🗑️ Đã xóa');
            load();
        } catch { showToast('❌ Lỗi khi xóa', true); }
    }

    return (
        <div className="admin-section">
            <div className="admin-section-header">
                <h2>🔐 Passwords ({items.length})</h2>
                <button className="admin-add-btn" onClick={() => setModal('add')}>+ Thêm</button>
            </div>

            {loading ? (
                <div className="admin-loading">Đang tải</div>
            ) : items.length === 0 ? (
                <div className="admin-empty">
                    <div className="empty-icon">🔑</div>
                    <p>Chưa có password nào</p>
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table className="admin-table">
                        <thead>
                            <tr><th>#</th><th>Password</th><th>Gợi ý</th><th></th></tr>
                        </thead>
                        <tbody>
                            {items.map((item, i) => (
                                <tr key={item.id}>
                                    <td style={{ color: 'var(--text-muted)', width: 40 }}>{i + 1}</td>
                                    <td><span className="pw-text">{item.password}</span></td>
                                    <td><span className="hint-text">{item.hint}</span></td>
                                    <td>
                                        <div className="admin-actions">
                                            <button className="admin-edit-btn" onClick={() => setModal(item)}>✏️</button>
                                            <button className="admin-del-btn" onClick={() => handleDelete(item.id)}>🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {modal && (
                <PasswordModal
                    initial={modal === 'add' ? null : modal}
                    onSave={handleSave}
                    onClose={() => setModal(null)}
                />
            )}
        </div>
    );
}

function PasswordModal({ initial, onSave, onClose }) {
    const [password, setPassword] = useState(initial?.password || '');
    const [hint, setHint] = useState(initial?.hint || '');

    function handleSubmit(e) {
        e.preventDefault();
        if (!password.trim() || !hint.trim()) return;
        onSave({ password: password.trim(), hint: hint.trim() });
    }

    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <form className="admin-modal" onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
                <h3>{initial ? '✏️ Sửa Password' : '➕ Thêm Password'}</h3>
                <label>Password</label>
                <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Nhập mật khẩu..." autoFocus />
                <label>Gợi ý</label>
                <input value={hint} onChange={e => setHint(e.target.value)} placeholder="Nhập gợi ý..." />
                <div className="admin-modal-btns">
                    <button type="button" className="btn-cancel" onClick={onClose}>Hủy</button>
                    <button type="submit" className="admin-add-btn">Lưu</button>
                </div>
            </form>
        </div>
    );
}

/* ============================================================
   Photos Tab  — three sub-sections by usage area
   ============================================================ */

const PHOTO_SECTIONS = [
    {
        key:      'solo',
        label:    '🌸 Ảnh cá nhân',
        desc:     'Dùng cho: Thư viện (solo), Ảnh bìa nhạc, Ảnh rơi Gift',
        type:     'solo',
        category: 'gallery',
        filter:   p => p.type === 'solo' && p.category === 'gallery',
    },
    {
        key:      'couple',
        label:    '💕 Ảnh đôi',
        desc:     'Dùng cho: Thư viện (couple)',
        type:     'couple',
        category: 'gallery',
        filter:   p => p.type === 'couple' && p.category === 'gallery',
    },
    {
        key:      'photobooth',
        label:    '📷 Photobooth',
        desc:     'Dùng cho: Trang Photobooth — mỗi ảnh là 1 strip 4 frame',
        type:     'couple',
        category: 'photobooth',
        filter:   p => p.category === 'photobooth',
    },
];

function PhotosTab({ showToast }) {
    const [photoSection, setPhotoSection] = useState('solo');
    const [allItems, setAllItems]         = useState([]);
    const [loading, setLoading]           = useState(true);
    const [uploading, setUploading]       = useState(false);
    const [modal, setModal]               = useState(false);
    const fileRef                         = useRef(null);

    const section = PHOTO_SECTIONS.find(s => s.key === photoSection);
    const items   = allItems.filter(section.filter);

    const load = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchPhotos();
            setAllItems(data);
        } catch { showToast('❌ Không tải được photos', true); }
        finally { setLoading(false); }
    }, [showToast]);

    useEffect(() => { load(); }, [load]);

    async function handleUpload(files, caption) {
        setUploading(true);
        try {
            for (const file of files) {
                const url = await uploadPhotoFile(file);
                await insertPhoto({ src: url, caption: caption || file.name, type: section.type, category: section.category });
            }
            invalidatePhotos();
            showToast(`✅ Đã upload ${files.length} ảnh vào "${section.label}"`);
            load();
        } catch (err) {
            showToast('❌ Lỗi upload: ' + err.message, true);
        }
        setUploading(false);
        setModal(false);
    }

    async function handleDelete(item) {
        if (!confirm('Xóa ảnh này?')) return;
        try {
            await deletePhoto(item.id);
            try { await deletePhotoFile(item.src); } catch { }
            setAllItems(prev => prev.filter(p => p.id !== item.id));
            invalidatePhotos();
            showToast('🗑️ Đã xóa ảnh');
        } catch { showToast('❌ Lỗi khi xóa', true); }
    }

    const counts = {};
    PHOTO_SECTIONS.forEach(s => { counts[s.key] = allItems.filter(s.filter).length; });

    return (
        <div className="admin-section">
            <div className="admin-section-header">
                <h2>📸 Photos ({allItems.length} tổng)</h2>
            </div>

            {/* Photo section sub-tabs */}
            <div className="admin-photo-subtabs">
                {PHOTO_SECTIONS.map(s => (
                    <button
                        key={s.key}
                        className={`admin-photo-subtab ${photoSection === s.key ? 'active' : ''}`}
                        onClick={() => setPhotoSection(s.key)}
                    >
                        {s.label}
                        <span className="subtab-count">{counts[s.key]}</span>
                    </button>
                ))}
            </div>

            {/* Section info + upload */}
            <div className="photo-section-info">
                <span className="photo-section-desc">{section.desc}</span>
                <button
                    className="admin-add-btn"
                    onClick={() => { fileRef.current = null; setModal(true); }}
                >
                    + Upload ảnh
                </button>
            </div>

            {loading ? (
                <div className="admin-loading">Đang tải</div>
            ) : items.length === 0 ? (
                <div className="admin-empty">
                    <div className="empty-icon">🖼️</div>
                    <p>Chưa có ảnh trong mục "{section.label}"</p>
                </div>
            ) : (
                <div className="admin-photo-grid">
                    {items.map(item => (
                        <div key={item.id} className="admin-photo-card">
                            <img src={item.src} alt={item.caption} loading="lazy" />
                            <div className="photo-overlay">
                                <span className="photo-caption">{item.caption}</span>
                            </div>
                            <button className="admin-photo-del" onClick={() => handleDelete(item)}>✕</button>
                        </div>
                    ))}
                </div>
            )}

            {modal && (
                <PhotoUploadModal
                    sectionLabel={section.label}
                    initialFiles={fileRef.current}
                    onUpload={handleUpload}
                    onClose={() => setModal(false)}
                    uploading={uploading}
                />
            )}
        </div>
    );
}

function PhotoUploadModal({ sectionLabel, initialFiles, onUpload, onClose, uploading }) {
    const [files, setFiles]     = useState(initialFiles || []);
    const [caption, setCaption] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        if (files.length === 0) return;
        onUpload(files, caption);
    }

    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <form className="admin-modal" onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
                <h3>📸 Upload → {sectionLabel}</h3>

                <label>Chọn ảnh</label>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={e => setFiles(Array.from(e.target.files))}
                    style={{ display: 'block', background: 'none', border: 'none', padding: '0.5rem 0' }}
                />
                {files.length > 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{files.length} file đã chọn</p>}

                <label>Caption (tùy chọn)</label>
                <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Mô tả ảnh..." />

                <div className="admin-modal-btns">
                    <button type="button" className="btn-cancel" onClick={onClose}>Hủy</button>
                    <button type="submit" className="admin-add-btn" disabled={uploading || files.length === 0}>
                        {uploading ? 'Đang upload...' : `Upload ${files.length} ảnh`}
                    </button>
                </div>
            </form>
        </div>
    );
}

/* ============================================================
   Messages Tab  — Gift page falling text
   ============================================================ */
function MessagesTab({ showToast }) {
    const [items, setItems]       = useState([]);
    const [loading, setLoading]   = useState(true);
    const [tableReady, setReady]  = useState(true);
    const [modal, setModal]       = useState(null); // null | 'add' | { id, text, displayOrder }

    const load = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchGiftMessages();
            setReady(true);
            setItems(data);
        } catch (err) {
            // Table doesn't exist yet → show setup instructions instead of error toast
            if (err?.code === 'PGRST205' || err?.message?.includes('gift_messages')) {
                setReady(false);
            } else {
                showToast('❌ Không tải được messages', true);
            }
        }
        finally { setLoading(false); }
    }, [showToast]);

    useEffect(() => { load(); }, [load]);

    async function handleSave(form) {
        try {
            if (modal === 'add') {
                await insertGiftMessage({ text: form.text, displayOrder: items.length + 1 });
                showToast('✅ Đã thêm tin nhắn');
            } else {
                await updateGiftMessage(modal.id, { text: form.text, displayOrder: modal.displayOrder });
                showToast('✅ Đã cập nhật');
            }
            invalidateMessages();
            setModal(null);
            load();
        } catch { showToast('❌ Lỗi khi lưu', true); }
    }

    async function handleDelete(item) {
        if (!confirm(`Xóa "${item.text}"?`)) return;
        try {
            await deleteGiftMessage(item.id);
            invalidateMessages();
            showToast('🗑️ Đã xóa');
            load();
        } catch { showToast('❌ Lỗi khi xóa', true); }
    }

    return (
        <div className="admin-section">
            <div className="admin-section-header">
                <h2>💬 Gift Messages ({items.length})</h2>
                <button className="admin-add-btn" onClick={() => setModal('add')}>+ Thêm</button>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                Các dòng chữ rơi trên trang <strong>My Gift</strong>. Chỉnh sửa thoải mái ✨
            </p>

            {loading ? (
                <div className="admin-loading">Đang tải</div>
            ) : !tableReady ? (
                <div className="admin-empty" style={{ textAlign: 'left' }}>
                    <div className="empty-icon">⚠️</div>
                    <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Bảng <code>gift_messages</code> chưa được tạo</p>
                    <p style={{ marginBottom: '1rem' }}>Vào <a href="https://supabase.com/dashboard/project/xtxczpjwssuxhcgrlusn/sql" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--rose-light)' }}>Supabase SQL Editor</a> và chạy lệnh sau:</p>
                    <pre className="admin-sql-block">{`create table gift_messages (
  id            serial primary key,
  text          text not null,
  display_order int  not null default 0,
  created_at    timestamptz default now()
);
alter table gift_messages enable row level security;
create policy "Public read"   on gift_messages for select using (true);
create policy "Public insert" on gift_messages for insert with check (true);
create policy "Public update" on gift_messages for update using (true) with check (true);
create policy "Public delete" on gift_messages for delete using (true);`}</pre>
                    <button className="admin-add-btn" style={{ marginTop: '1rem' }} onClick={load}>
                        🔄 Thử lại
                    </button>
                </div>
            ) : items.length === 0 ? (
                <div className="admin-empty">
                    <div className="empty-icon">💬</div>
                    <p>Chưa có tin nhắn nào.</p>
                </div>
            ) : (
                <div className="admin-msg-list">
                    {items.map((item, i) => (
                        <div key={item.id} className="admin-msg-item">
                            <span className="admin-msg-num">{i + 1}</span>
                            <span className="admin-msg-text">{item.text}</span>
                            <div className="admin-actions">
                                <button className="admin-edit-btn" onClick={() => setModal(item)}>✏️</button>
                                <button className="admin-del-btn" onClick={() => handleDelete(item)}>🗑️</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {modal && (
                <MessageModal
                    initial={modal !== 'add' ? modal : null}
                    onSave={handleSave}
                    onClose={() => setModal(null)}
                />
            )}
        </div>
    );
}

function MessageModal({ initial, onSave, onClose }) {
    const [text, setText] = useState(initial?.text ?? '');

    function handleSubmit(e) {
        e.preventDefault();
        if (!text.trim()) return;
        onSave({ text: text.trim() });
    }

    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <form className="admin-modal" onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
                <h3>{initial ? '✏️ Sửa tin nhắn' : '💬 Thêm tin nhắn'}</h3>
                <label>Nội dung</label>
                <input
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="VD: I Love You ❤️"
                    autoFocus
                />
                <div className="admin-modal-btns">
                    <button type="button" className="btn-cancel" onClick={onClose}>Hủy</button>
                    <button type="submit" className="admin-add-btn" disabled={!text.trim()}>
                        {initial ? 'Lưu' : 'Thêm'}
                    </button>
                </div>
            </form>
        </div>
    );
}

/* ============================================================
   Music Tab
   ============================================================ */
function MusicTab({ showToast }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [uploading, setUploading] = useState(false);

    const load = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchSongs();
            setItems(data);
        } catch { showToast('❌ Không tải được songs', true); }
        finally { setLoading(false); }
    }, [showToast]);

    useEffect(() => { load(); }, [load]);

    async function handleAdd(form, file) {
        setUploading(true);
        try {
            let src = form.src;
            if (file) {
                src = await uploadSongFile(file);
            }
            await insertSong({ title: form.title, artist: form.artist, src, displayOrder: items.length });
            invalidateSongs();
            showToast('✅ Đã thêm bài hát');
            setModal(false);
            load();
        } catch (err) {
            showToast('❌ Lỗi: ' + err.message, true);
        }
        setUploading(false);
    }

    async function handleDelete(item) {
        if (!confirm(`Xóa "${item.title}"?`)) return;
        try {
            await deleteSong(item.id);
            try { await deleteSongFile(item.src); } catch { }
            invalidateSongs();
            showToast('🗑️ Đã xóa bài hát');
            load();
        } catch { showToast('❌ Lỗi khi xóa', true); }
    }

    return (
        <div className="admin-section">
            <div className="admin-section-header">
                <h2>🎵 Music ({items.length})</h2>
                <button className="admin-add-btn" onClick={() => setModal(true)}>+ Thêm bài hát</button>
            </div>

            {loading ? (
                <div className="admin-loading">Đang tải</div>
            ) : items.length === 0 ? (
                <div className="admin-empty">
                    <div className="empty-icon">🎵</div>
                    <p>Chưa có bài hát nào trong database.<br />Bài hát static (trong thư mục public) vẫn hoạt động bình thường.</p>
                </div>
            ) : (
                <div>
                    {items.map((item, i) => (
                        <div key={item.id} className="admin-song-item">
                            <span className="admin-song-num">{i + 1}</span>
                            <div className="admin-song-info">
                                <div className="admin-song-title">{item.title}</div>
                                <div className="admin-song-artist">{item.artist}</div>
                                <div className="admin-song-src">{item.src}</div>
                            </div>
                            <div className="admin-actions">
                                <button className="admin-del-btn" onClick={() => handleDelete(item)}>🗑️</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {modal && (
                <SongModal
                    onSave={handleAdd}
                    onClose={() => setModal(false)}
                    uploading={uploading}
                />
            )}
        </div>
    );
}

function SongModal({ onSave, onClose, uploading }) {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [src, setSrc] = useState('');
    const [file, setFile] = useState(null);
    const [mode, setMode] = useState('upload'); // 'upload' | 'url'

    function handleSubmit(e) {
        e.preventDefault();
        if (!title.trim()) return;
        if (mode === 'upload' && !file) return;
        if (mode === 'url' && !src.trim()) return;
        onSave({ title: title.trim(), artist: artist.trim(), src: src.trim() }, mode === 'upload' ? file : null);
    }

    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <form className="admin-modal" onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
                <h3>🎵 Thêm Bài Hát</h3>

                <label>Tên bài hát</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="VD: Chiếc Khăn Gió Ấm" autoFocus />

                <label>Nghệ sĩ</label>
                <input value={artist} onChange={e => setArtist(e.target.value)} placeholder="VD: Khánh Phương" />

                <label>Nguồn nhạc</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <button type="button" className={`admin-tab ${mode === 'upload' ? 'active' : ''}`} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setMode('upload')}>Upload file</button>
                    <button type="button" className={`admin-tab ${mode === 'url' ? 'active' : ''}`} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setMode('url')}>Nhập URL</button>
                </div>

                {mode === 'upload' ? (
                    <input type="file" accept="audio/*" onChange={e => setFile(e.target.files[0])} style={{ display: 'block', background: 'none', border: 'none', padding: '0.5rem 0' }} />
                ) : (
                    <input value={src} onChange={e => setSrc(e.target.value)} placeholder="/assets/music/song.mp3 hoặc URL" />
                )}

                <div className="admin-modal-btns">
                    <button type="button" className="btn-cancel" onClick={onClose}>Hủy</button>
                    <button type="submit" className="admin-add-btn" disabled={uploading}>
                        {uploading ? 'Đang upload...' : 'Thêm'}
                    </button>
                </div>
            </form>
        </div>
    );
}

/* ============================================================
   Main Admin Page
   ============================================================ */
export default function AdminPage() {
    const [authed, setAuthed] = useState(false);
    const [pw, setPw] = useState('');
    const [error, setError] = useState(false);
    const [tab, setTab] = useState('passwords');
    const [showToast, toastEl] = useToast();

    // Check if already authed this session
    useEffect(() => {
        if (sessionStorage.getItem('admin_authed') === 'true') setAuthed(true);
    }, []);

    function handleLogin(e) {
        e.preventDefault();
        if (pw.trim().toLowerCase() === ADMIN_PASSWORD.toLowerCase()) {
            sessionStorage.setItem('admin_authed', 'true');
            setAuthed(true);
        } else {
            setError(true);
            setPw('');
            setTimeout(() => setError(false), 3000);
        }
    }

    function handleLogout() {
        sessionStorage.removeItem('admin_authed');
        setAuthed(false);
    }

    if (!authed) {
        return (
            <div className="admin-page">
                <div className="orb orb-1" /><div className="orb orb-2" />
                <Link to="/home" className="back-btn">← Back</Link>
                <div className="admin-gate">
                    <h1>⚙️ Admin Panel</h1>
                    <p>Nhập master password để quản lý website</p>
                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            value={pw}
                            onChange={e => setPw(e.target.value)}
                            placeholder="Master password..."
                            autoComplete="off"
                            autoFocus
                        />
                        <br />
                        <button type="submit" className="btn-pink">Đăng nhập</button>
                    </form>
                    {error && <p className="gate-error">❌ Sai master password</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="orb orb-1" /><div className="orb orb-2" />

            <div className="admin-dashboard">
                <div className="admin-top-bar">
                    <h1>⚙️ Admin Dashboard</h1>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <Link to="/home" className="admin-logout" style={{ textDecoration: 'none' }}>🏠 Home</Link>
                        <button className="admin-logout" onClick={handleLogout}>🚪 Đăng xuất</button>
                    </div>
                </div>

                <div className="admin-tabs">
                    {[
                        ['passwords', '🔐 Passwords'],
                        ['photos',    '📸 Photos'],
                        ['music',     '🎵 Music'],
                        ['messages',  '💬 Messages'],
                    ].map(([key, label]) => (
                        <button
                            key={key}
                            className={`admin-tab ${tab === key ? 'active' : ''}`}
                            onClick={() => setTab(key)}
                        >{label}</button>
                    ))}
                </div>

                {tab === 'passwords' && <PasswordTab showToast={showToast} />}
                {tab === 'photos'    && <PhotosTab showToast={showToast} />}
                {tab === 'music'     && <MusicTab showToast={showToast} />}
                {tab === 'messages'  && <MessagesTab showToast={showToast} />}
            </div>

            {toastEl}
        </div>
    );
}
