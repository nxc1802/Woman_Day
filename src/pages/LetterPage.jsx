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
const ICON_OPTIONS = ['💊','✨','💕','🌟','📸','🎁','🤫','💌','🌸','🌺','💗','❤️','🥰','💖','🌙'];
const ROTATIONS  = [-4, -2.5, 2, 3.5, -1.5, 4, -3, 1.8, -4.5, 3.1];

/* Content seeded from docs/nhatky.md */
const DEFAULT_LETTERS = [
  {
    id: 1, author: 'Anh', icon: '💊', tag: 'Viên thuốc #1',
    title: 'Không bao giờ xem nhẹ',
    color: '#fce7f3', textColor: '#9d174d', rotation: -3.5, size: 'medium',
    pill: 'Anh có thể nói em khờ nhưng anh không được xem nhẹ tình cảm của em',
    content: `Anh có bao giờ xem nhẹ tình cảm của em đauuuu, anh biết là vợ yêu anh nhất mà hehe, nhưng mà em khờ là đúm :3 quá khờ nên mới bị anh dụ yêu đó`,
  },
  {
    id: 2, author: 'Anh', icon: '💊', tag: 'Viên thuốc #2',
    title: 'Em khiến anh tự tin hơn',
    color: '#fdf2f8', textColor: '#be185d', rotation: 2.8, size: 'medium',
    pill: 'Em biết anh đang nỗ lực nên em luôn tự hào về những điều anh làm',
    content: `Câu này thật sự chạm được vào lòng anh luôn ấy :))) kiểu như có người luôn ủng hộ mọi bước đi của anh vậy`,
  },
  {
    id: 3, author: 'Anh', icon: '💊', tag: 'Viên thuốc #3',
    title: 'Mỗi năm sinh nhật đều có em',
    color: '#fff0f6', textColor: '#9d174d', rotation: -1.8, size: 'large',
    pill: 'Em muốn sinh nhật của những năm tiếp theo đều được đón với iuu',
    content: `Sai rồi, phải là toàn bộ những năm sau này luôn vợ ạ :3 Anh không thích sinh nhật của anh mấy, thật sự thì chưa bao giờ anh tận hưởng sinh nhật như một người đặc biệt trong cuộc đời của anh, nhưng mà khi có em, khi được em trao nhiều tình cảm như này trong dịp sinh nhật của anh thì em truyền được cho anh cảm xúc đó, em cho anh biết rằng sinh nhật đón cùng em rất là vui.

Mặc dù năm nay em không đón trực tiếp cùng anh được, nhưng mà sau này khi ra mắt rồi thì mình phải đón cùng nhau không sót 1 năm nào nhá. Yêu iemmmm 💖`,
  },
  {
    id: 4, author: 'Anh', icon: '💊', tag: 'Viên thuốc #4',
    title: 'Vợ xàm quá trời',
    color: '#fce7f3', textColor: '#be185d', rotation: 4.2, size: 'small',
    pill: 'Chòng iuu ơi cho em xin hai chục ạa, hai chục cún',
    content: `=.= Sao có thể xàm được đến vậy hả nàng, đọc mà sượng luôn á

Hun nàng cả đời luôn còn được chứ nói gì vài ba chục cái hẹ hẹ`,
  },
  {
    id: 5, author: 'Anh', icon: '💊', tag: 'Viên thuốc #5',
    title: 'Em nhớ anh mọi lúc',
    color: '#fdf2f8', textColor: '#9d174d', rotation: -4.5, size: 'large',
    pill: 'Lúc nào em cũmm nhớ anhh',
    content: `Hôm nay em kể cho anh là phải 70% trong số notes là tào lao nhảm nhí =.=, trời ơi mắc công anh làm cái note này để gửi lời yêu thương đến iem cho iem biết rằng anh yêu em đến nhường nào.

À hôm nay đi chơi với group, chị QA và TU hỏi 2 câu:
- "Mi có yêu bé ni không?"
- "M yêu bé ni bằng Nhàn không?"

Anh trả lời là anh rất yêu em (chưa bao giờ anh trả lời như vậy cả), và anh cũng bảo là anh yêu em hơn Nhàn rất nhiều. Cả 2 câu trả lời đều là thật lòng nên em đừng nghi ngờ tình cảm của anh nhé. Yêu emmmm 💖`,
  },
  {
    id: 6, author: 'Anh', icon: '💊', tag: 'Viên thuốc #6',
    title: 'Sinh nhật anh buồn nhất',
    color: '#fff0f6', textColor: '#be185d', rotation: 3.1, size: 'large',
    pill: 'Hong được bực mình với iem, vì em là em biée màa',
    content: `Hôm nay là sinh nhật của anh, thế mà tụi mình cãi nhau vì anh không chịu kiên nhẫn dỗ vợ :(((( anh xin lỗi vợ nhiều.

Sau khi anh bực mình và nói nặng lời với vợ quá trời luôn thì anh đọc được viên thuốc này :)))) như kiểu vợ đoán trước tương lai á haha.

Sau khi hết dỗi nhau xong là vợ up story quá trời luôn, ở cả acc vợ và acc anh nên anh vui lắm ^^

Chúc cho chúng ta được đón sinh nhật năm sau và cả những năm sau nữa cùng nhauuuu 🎂`,
  },
  {
    id: 7, author: 'Anh', icon: '💊', tag: 'Viên thuốc #7',
    title: 'Anh yêu vợ hơn vợ nghĩ',
    color: '#fce7f3', textColor: '#9d174d', rotation: -2.8, size: 'medium',
    pill: 'YÊU DÂUÚ CỤAA EMM',
    content: `Anh cũng yêu vợ, yêu vợ nhiều hơn so với vợ yêu anh luôn ý :3

Đợt chia tay vừa rồi làm anh nhận ra là em yêu anh đến mức mà có thể bị giảm huyết áp :(((( mặc dù anh đã nói rồi nhưng mà anh sẽ viết vào đây lại 1 lần nữa. Đó là: "Từ giờ anh sẽ không để cho em bị như vậy nữa dù cho là vì anh muốn em thay đổi hay như nào đi nữa" 💗`,
  },
  {
    id: 8, author: 'Anh', icon: '💊', tag: 'Viên thuốc #8',
    title: 'Tình yêu siêu bền chặt',
    color: '#fdf2f8', textColor: '#be185d', rotation: 1.5, size: 'medium',
    pill: 'Chúc cho oxaa mỗi ngày lại iuu e nhìu thêm một tíi',
    content: `Ngày nào anh cũng yêu vợ nhiều thêm mò. Với lại dạo này có 1 điều làm anh nhận ra là yêu em là 1 sự lựa chọn đúng đắn của anh. Đó là anh đen bạc quá em ạ =)))) anh nghĩ là năm nay anh sẽ rất là đỏ tình luôn, đỏ tình với vợ yêu có nghĩa là tình yêu của tụi mình sẽ siêu bền chặt hehe.

Chúc cho chúng ta sẽ có 1 mối tình đẹp nhất của nhau và đi đến cuối đời nhía 💕`,
  },
  {
    id: 9, author: 'Em', icon: '💌', tag: '19/02/26 — Em viết',
    title: 'Bọn nó sai rồi',
    color: '#fdf4ff', textColor: '#7e22ce', rotation: -3.2, size: 'large',
    pill: null,
    content: `Em trả lời cho chồng sau 1 vài viên chồng đọc rồi nhá. Kể cho chồng nghe là lúc em làm cái lọ thuốc, mấy đứa bảo em là "làm cái này lmgi cho mất công", rồi là "mấy cái này mấy thằng con trai nó k đọc đâu", "Tặng cái này bọn nó lười đọc với nản lắm, mang hình thức đẹp mắt thì ok" bla bla.

Mấy đứa bảo thế nhma e vẫn làm, vì e suy nghĩ là anh sẽ trân trọng những điều e viết. Tuy là cách a mở cái trang này là ngoài dự đoán của e. E siu vui, vì e biết là àa bọn nó sai r, ny t siêu trân trọng món quà t tặng chứ k như bọn nó bảo thế.

Và e cảm giác là e sẽ làm cho a vài lọ nữa, vì nó là thuốc mà. Cảm giác là cũng nhờ lọ thuốc mà mình hiểu nhau nhiều hơn ý. Iuu chồng, em ngủ 💜`,
  },
  {
    id: 10, author: 'Anh', icon: '💊', tag: 'Viên thuốc #9',
    title: 'Cưới em liền thôi',
    color: '#fff0f6', textColor: '#9d174d', rotation: 4, size: 'large',
    pill: 'Gặp em năm 17 tuổi thì sau này năm 27 tuổi lấy em dzìaa chăm nhaa ❤',
    content: `Thứ nhất, anh không gặp em lúc em 17 tuổi, mà là 16 tuổi, nên đúng ra là mình phải cưới lúc em 26 tuổi cơ.

Thứ hai, anh không thích cưới em dù là năm em 27 hay 26 tuổi, anh muốn cưới em liền cơ =)) ít chi cũng tầm năm 3 đại học, không thì anh muốn em vừa học xong cấp 3.

Anh hứa là anh chỉ cần ổn định tài chính là anh sẽ cưới iem liền, dù em có thích hay không thì anh vẫn sẽ cưới, hehe. Yêu em ❤️`,
  },
  {
    id: 11, author: 'Anh', icon: '💊', tag: 'Viên thuốc #10',
    title: 'Hạnh phúc là có anh',
    color: '#fce7f3', textColor: '#be185d', rotation: -4.8, size: 'large',
    pill: 'Thế nào là hạnh phúc á? Hạnh phúc là những ngày bắt đầu có anhh.',
    content: `Điêu =.= làm như trước khi gặp anh là em không hạnh phúc á.

Nhưng mà anh hứa là anh sẽ làm em hạnh phúc hơn nữa, hơn cả trước đây của em và hơn cả những gì anh từng làm vì anh càng ngày càng yêu em hơn mà hehe.

Giờ nghĩ lại, nếu không được gặp gỡ và yêu thương em :))) thì cuộc sống của anh bây giờ nó nhạt nhẽo biết bao. Chắc chỉ có đi học, đi làm, xong ngủ nghỉ, rồi lặp lại. Không yêu thương thêm được ai mà cũng không có ai yêu thương mình, nhờ gặp được em mà anh mới bị "yếu tiếng trung" và quyết tâm tán đổ em đoá. Cảm ơn vợ đã xuất hiện trong cuộc đời của anh nhaa 💕`,
  },
];

/* ---- Read Modal ---- */
function LetterModal({ letter, onClose }) {
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
          <span>with love ❤️</span>
        </div>
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
  const [letters, setLetters] = useState(DEFAULT_LETTERS);
  const [openLetter, setOpenLetter]   = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterAuthor, setFilterAuthor] = useState('all');

  const filtered = filterAuthor === 'all' ? letters : letters.filter(l => l.author === filterAuthor);

  function handleAdd(newLetter) { setLetters(prev => [...prev, newLetter]); }

  return (
    <div className="letter-page">
      <div className="orb orb-1" /><div className="orb orb-2" />
      <div className="board-bg" />
      <Link to="/home" className="back-btn">← Back</Link>

      <div className="board-header">
        <h1 className="page-title">Lọ Thuốc Tình Yêu 💊</h1>
        <p className="page-subtitle">Những viên thuốc & cảm xúc của hai đứa mình</p>

        {/* Filter tabs */}
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
        {filtered.map(letter => (
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
          </div>
        ))}

        {/* Add card */}
        <div className="add-letter-card" onClick={() => setShowAddForm(true)}>
          <div className="add-card-pin" />
          <span className="add-card-icon">+</span>
          <p className="add-card-text">Thêm lá thư mới</p>
        </div>
      </div>

      {openLetter  && <LetterModal letter={openLetter}  onClose={() => setOpenLetter(null)} />}
      {showAddForm && <AddLetterModal onAdd={handleAdd} onClose={() => setShowAddForm(false)} />}
    </div>
  );
}
