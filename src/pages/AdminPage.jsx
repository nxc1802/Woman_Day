import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ADMIN_PASSWORD } from '../config/passwords';
import {
    fetchPasswords, insertPassword, updatePassword, deletePassword,
    fetchPhotos, insertPhoto, deletePhoto, uploadPhotoFile, deletePhotoFile,
    fetchSongs, insertSong, deleteSong, uploadSongFile, deleteSongFile,
} from '../lib/supabase';
import { invalidatePasswords, invalidatePhotos, invalidateSongs } from '../lib/prefetch';
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
   Photos Tab
   ============================================================ */
function PhotosTab({ showToast }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [modal, setModal] = useState(false);
    const fileRef = useRef(null);
    const [dragOver, setDragOver] = useState(false);

    const load = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchPhotos();
            setItems(data);
        } catch { showToast('❌ Không tải được photos', true); }
        finally { setLoading(false); }
    }, [showToast]);

    useEffect(() => { load(); }, [load]);

    async function handleUpload(files, type, category, caption) {
        setUploading(true);
        try {
            for (const file of files) {
                const url = await uploadPhotoFile(file);
                await insertPhoto({ src: url, caption: caption || file.name, type, category });
            }
            invalidatePhotos();
            showToast(`✅ Đã upload ${files.length} ảnh`);
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
            // Try to delete from storage too (ignore errors for static files)
            try { await deletePhotoFile(item.src); } catch { }
            invalidatePhotos();
            showToast('🗑️ Đã xóa ảnh');
            load();
        } catch { showToast('❌ Lỗi khi xóa', true); }
    }

    function handleDrop(e) {
        e.preventDefault();
        setDragOver(false);
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        if (files.length) {
            fileRef.current = files;
            setModal(true);
        }
    }

    return (
        <div className="admin-section">
            <div className="admin-section-header">
                <h2>📸 Photos ({items.length})</h2>
                <button className="admin-add-btn" onClick={() => { fileRef.current = null; setModal(true); }}>+ Upload</button>
            </div>

            <div
                className={`admin-upload-area ${dragOver ? 'dragging' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => { fileRef.current = null; setModal(true); }}
            >
                <div className="upload-icon">📁</div>
                <p>{uploading ? 'Đang upload...' : 'Kéo ảnh vào đây hoặc click để upload'}</p>
            </div>

            {loading ? (
                <div className="admin-loading">Đang tải</div>
            ) : items.length === 0 ? (
                <div className="admin-empty">
                    <div className="empty-icon">🖼️</div>
                    <p>Chưa có ảnh nào trong database.<br />Ảnh static (trong thư mục public) vẫn hoạt động bình thường.</p>
                </div>
            ) : (
                <div className="admin-photo-grid">
                    {items.map(item => (
                        <div key={item.id} className="admin-photo-card">
                            <img src={item.src} alt={item.caption} loading="lazy" />
                            <div className="photo-overlay">
                                <span className="photo-caption">{item.caption}</span>
                                <span className="photo-badge">{item.type} • {item.category}</span>
                            </div>
                            <button className="admin-photo-del" onClick={() => handleDelete(item)}>✕</button>
                        </div>
                    ))}
                </div>
            )}

            {modal && (
                <PhotoUploadModal
                    initialFiles={fileRef.current}
                    onUpload={handleUpload}
                    onClose={() => setModal(false)}
                    uploading={uploading}
                />
            )}
        </div>
    );
}

function PhotoUploadModal({ initialFiles, onUpload, onClose, uploading }) {
    const [files, setFiles] = useState(initialFiles || []);
    const [type, setType] = useState('solo');
    const [category, setCategory] = useState('gallery');
    const [caption, setCaption] = useState('');
    const inputRef = useRef(null);

    function handleFileChange(e) {
        setFiles(Array.from(e.target.files));
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (files.length === 0) return;
        onUpload(files, type, category, caption);
    }

    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <form className="admin-modal" onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
                <h3>📸 Upload Ảnh</h3>

                <label>Chọn ảnh</label>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    style={{ display: 'block', background: 'none', border: 'none', padding: '0.5rem 0' }}
                />
                {files.length > 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{files.length} file đã chọn</p>}

                <label>Loại ảnh</label>
                <select value={type} onChange={e => setType(e.target.value)}>
                    <option value="solo">Solo (Ảnh cá nhân)</option>
                    <option value="couple">Couple (Ảnh đôi)</option>
                </select>

                <label>Danh mục</label>
                <select value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="gallery">Gallery (Thư viện ảnh)</option>
                    <option value="photobooth">Photobooth (Ảnh booth)</option>
                </select>

                <label>Caption</label>
                <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Mô tả ảnh (tùy chọn)..." />

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
                        ['photos', '📸 Photos'],
                        ['music', '🎵 Music'],
                    ].map(([key, label]) => (
                        <button
                            key={key}
                            className={`admin-tab ${tab === key ? 'active' : ''}`}
                            onClick={() => setTab(key)}
                        >{label}</button>
                    ))}
                </div>

                {tab === 'passwords' && <PasswordTab showToast={showToast} />}
                {tab === 'photos' && <PhotosTab showToast={showToast} />}
                {tab === 'music' && <MusicTab showToast={showToast} />}
            </div>

            {toastEl}
        </div>
    );
}
