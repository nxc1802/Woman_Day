/**
 * One-time seed script: inserts all DEFAULT_LETTERS into Supabase.
 * Run: node scripts/seed-letters.mjs
 */

const SUPABASE_URL = 'https://xtxczpjwssuxhcgrlusn.supabase.co';
const SERVICE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0eGN6cGp3c3N1eGhjZ3JsdXNuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjg4NTI1NywiZXhwIjoyMDg4NDYxMjU3fQ.pTzSX0dIUjy-Ld573hOcE1cQW_itjn1p4fHXTYYAxgk';

const DEFAULT_LETTERS = [
  {
    id: 1, author: 'Anh', icon: '💊', tag: 'Viên thuốc #1',
    title: 'Không bao giờ xem nhẹ',
    color: '#fce7f3', text_color: '#9d174d', rotation: -3.5, size: 'medium',
    pill: 'Anh có thể nói em khờ nhưng anh không được xem nhẹ tình cảm của em',
    content: `Anh có bao giờ xem nhẹ tình cảm của em đauuuu, anh biết là vợ yêu anh nhất mà hehe, nhưng mà em khờ là đúm :3 quá khờ nên mới bị anh dụ yêu đó`,
  },
  {
    id: 2, author: 'Anh', icon: '💊', tag: 'Viên thuốc #2',
    title: 'Em khiến anh tự tin hơn',
    color: '#fdf2f8', text_color: '#be185d', rotation: 2.8, size: 'medium',
    pill: 'Em biết anh đang nỗ lực nên em luôn tự hào về những điều anh làm',
    content: `Câu này thật sự chạm được vào lòng anh luôn ấy :))) kiểu như có người luôn ủng hộ mọi bước đi của anh vậy`,
  },
  {
    id: 3, author: 'Anh', icon: '💊', tag: 'Viên thuốc #3',
    title: 'Mỗi năm sinh nhật đều có em',
    color: '#fff0f6', text_color: '#9d174d', rotation: -1.8, size: 'large',
    pill: 'Em muốn sinh nhật của những năm tiếp theo đều được đón với iuu',
    content: `Sai rồi, phải là toàn bộ những năm sau này luôn vợ ạ :3 Anh không thích sinh nhật của anh mấy, thật sự thì chưa bao giờ anh tận hưởng sinh nhật như một người đặc biệt trong cuộc đời của anh, nhưng mà khi có em, khi được em trao nhiều tình cảm như này trong dịp sinh nhật của anh thì em truyền được cho anh cảm xúc đó, em cho anh biết rằng sinh nhật đón cùng em rất là vui.\n\nMặc dù năm nay em không đón trực tiếp cùng anh được, nhưng mà sau này khi ra mắt rồi thì mình phải đón cùng nhau không sót 1 năm nào nhá. Yêu iemmmm 💖`,
  },
  {
    id: 4, author: 'Anh', icon: '💊', tag: 'Viên thuốc #4',
    title: 'Vợ xàm quá trời',
    color: '#fce7f3', text_color: '#be185d', rotation: 4.2, size: 'small',
    pill: 'Chòng iuu ơi cho em xin hai chục ạa, hai chục cún',
    content: `=.= Sao có thể xàm được đến vậy hả nàng, đọc mà sượng luôn á\n\nHun nàng cả đời luôn còn được chứ nói gì vài ba chục cái hẹ hẹ`,
  },
  {
    id: 5, author: 'Anh', icon: '💊', tag: 'Viên thuốc #5',
    title: 'Em nhớ anh mọi lúc',
    color: '#fdf2f8', text_color: '#9d174d', rotation: -4.5, size: 'large',
    pill: 'Lúc nào em cũmm nhớ anhh',
    content: `Hôm nay em kể cho anh là phải 70% trong số notes là tào lao nhảm nhí =.=, trời ơi mắc công anh làm cái note này để gửi lời yêu thương đến iem cho iem biết rằng anh yêu em đến nhường nào.\n\nÀ hôm nay đi chơi với group, chị QA và TU hỏi 2 câu:\n- "Mi có yêu bé ni không?"\n- "M yêu bé ni bằng Nhàn không?"\n\nAnh trả lời là anh rất yêu em (chưa bao giờ anh trả lời như vậy cả), và anh cũng bảo là anh yêu em hơn Nhàn rất nhiều. Cả 2 câu trả lời đều là thật lòng nên em đừng nghi ngờ tình cảm của anh nhé. Yêu emmmm 💖`,
  },
  {
    id: 6, author: 'Anh', icon: '💊', tag: 'Viên thuốc #6',
    title: 'Sinh nhật anh buồn nhất',
    color: '#fff0f6', text_color: '#be185d', rotation: 3.1, size: 'large',
    pill: 'Hong được bực mình với iem, vì em là em biée màa',
    content: `Hôm nay là sinh nhật của anh, thế mà tụi mình cãi nhau vì anh không chịu kiên nhẫn dỗ vợ :(((( anh xin lỗi vợ nhiều.\n\nSau khi anh bực mình và nói nặng lời với vợ quá trời luôn thì anh đọc được viên thuốc này :)))) như kiểu vợ đoán trước tương lai á haha.\n\nSau khi hết dỗi nhau xong là vợ up story quá trời luôn, ở cả acc vợ và acc anh nên anh vui lắm ^^\n\nChúc cho chúng ta được đón sinh nhật năm sau và cả những năm sau nữa cùng nhauuuu 🎂`,
  },
  {
    id: 7, author: 'Anh', icon: '💊', tag: 'Viên thuốc #7',
    title: 'Anh yêu vợ hơn vợ nghĩ',
    color: '#fce7f3', text_color: '#9d174d', rotation: -2.8, size: 'medium',
    pill: 'YÊU DÂUÚ CỤAA EMM',
    content: `Anh cũng yêu vợ, yêu vợ nhiều hơn so với vợ yêu anh luôn ý :3\n\nĐợt chia tay vừa rồi làm anh nhận ra là em yêu anh đến mức mà có thể bị giảm huyết áp :(((( mặc dù anh đã nói rồi nhưng mà anh sẽ viết vào đây lại 1 lần nữa. Đó là: "Từ giờ anh sẽ không để cho em bị như vậy nữa dù cho là vì anh muốn em thay đổi hay như nào đi nữa" 💗`,
  },
  {
    id: 8, author: 'Anh', icon: '💊', tag: 'Viên thuốc #8',
    title: 'Tình yêu siêu bền chặt',
    color: '#fdf2f8', text_color: '#be185d', rotation: 1.5, size: 'medium',
    pill: 'Chúc cho oxaa mỗi ngày lại iuu e nhìu thêm một tíi',
    content: `Ngày nào anh cũng yêu vợ nhiều thêm mò. Với lại dạo này có 1 điều làm anh nhận ra là yêu em là 1 sự lựa chọn đúng đắn của anh. Đó là anh đen bạc quá em ạ =)))) anh nghĩ là năm nay anh sẽ rất là đỏ tình luôn, đỏ tình với vợ yêu có nghĩa là tình yêu của tụi mình sẽ siêu bền chặt hehe.\n\nChúc cho chúng ta sẽ có 1 mối tình đẹp nhất của nhau và đi đến cuối đời nhía 💕`,
  },
  {
    id: 9, author: 'Em', icon: '💌', tag: '19/02/26 — Em viết',
    title: 'Bọn nó sai rồi',
    color: '#fdf4ff', text_color: '#7e22ce', rotation: -3.2, size: 'large',
    pill: null,
    content: `Em trả lời cho chồng sau 1 vài viên chồng đọc rồi nhá. Kể cho chồng nghe là lúc em làm cái lọ thuốc, mấy đứa bảo em là "làm cái này lmgi cho mất công", rồi là "mấy cái này mấy thằng con trai nó k đọc đâu", "Tặng cái này bọn nó lười đọc với nản lắm, mang hình thức đẹp mắt thì ok" bla bla.\n\nMấy đứa bảo thế nhma e vẫn làm, vì e suy nghĩ là anh sẽ trân trọng những điều e viết. Tuy là cách a mở cái trang này là ngoài dự đoán của e. E siu vui, vì e biết là àa bọn nó sai r, ny t siêu trân trọng món quà t tặng chứ k như bọn nó bảo thế.\n\nVà e cảm giác là e sẽ làm cho a vài lọ nữa, vì nó là thuốc mà. Cảm giác là cũng nhờ lọ thuốc mà mình hiểu nhau nhiều hơn ý. Iuu chồng, em ngủ 💜`,
  },
  {
    id: 10, author: 'Anh', icon: '💊', tag: 'Viên thuốc #9',
    title: 'Cưới em liền thôi',
    color: '#fff0f6', text_color: '#9d174d', rotation: 4, size: 'large',
    pill: 'Gặp em năm 17 tuổi thì sau này năm 27 tuổi lấy em dzìaa chăm nhaa ❤',
    content: `Thứ nhất, anh không gặp em lúc em 17 tuổi, mà là 16 tuổi, nên đúng ra là mình phải cưới lúc em 26 tuổi cơ.\n\nThứ hai, anh không thích cưới em dù là năm em 27 hay 26 tuổi, anh muốn cưới em liền cơ =)) ít chi cũng tầm năm 3 đại học, không thì anh muốn em vừa học xong cấp 3.\n\nAnh hứa là anh chỉ cần ổn định tài chính là anh sẽ cưới iem liền, dù em có thích hay không thì anh vẫn sẽ cưới, hehe. Yêu em ❤️`,
  },
  {
    id: 11, author: 'Anh', icon: '💊', tag: 'Viên thuốc #10',
    title: 'Hạnh phúc là có anh',
    color: '#fce7f3', text_color: '#be185d', rotation: -4.8, size: 'large',
    pill: 'Thế nào là hạnh phúc á? Hạnh phúc là những ngày bắt đầu có anhh.',
    content: `Điêu =.= làm như trước khi gặp anh là em không hạnh phúc á.\n\nNhưng mà anh hứa là anh sẽ làm em hạnh phúc hơn nữa, hơn cả trước đây của em và hơn cả những gì anh từng làm vì anh càng ngày càng yêu em hơn mà hehe.\n\nGiờ nghĩ lại, nếu không được gặp gỡ và yêu thương em :))) thì cuộc sống của anh bây giờ nó nhạt nhẽo biết bao. Chắc chỉ có đi học, đi làm, xong ngủ nghỉ, rồi lặp lại. Không yêu thương thêm được ai mà cũng không có ai yêu thương mình, nhờ gặp được em mà anh mới bị "yếu tiếng trung" và quyết tâm tán đổ em đoá. Cảm ơn vợ đã xuất hiện trong cuộc đời của anh nhaa 💕`,
  },
];

const res = await fetch(`${SUPABASE_URL}/rest/v1/custom_letters`, {
  method: 'POST',
  headers: {
    'apikey': SERVICE_KEY,
    'Authorization': `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
  },
  body: JSON.stringify(DEFAULT_LETTERS),
});

const data = await res.json();
if (res.ok) {
  console.log(`✅ Seeded ${data.length} letters successfully.`);
} else {
  console.error('❌ Error:', JSON.stringify(data, null, 2));
}
