Dưới đây là **Frontend Documentation hoàn chỉnh** cho website quà tặng bạn gái của bạn. Mình thiết kế theo hướng **romantic – smooth animation – dễ deploy (GitHub Pages / Vercel)** và **không cần backend**.

---

# 🌸 Love Gift Website – Frontend Documentation

## 1. Overview

**Love Gift Website** là một trang web cá nhân dùng để tặng quà cho bạn gái.
Trang web gồm một **Password Gate** và **4 trải nghiệm cảm xúc** sau khi mở khóa.

### Flow

```
Password Page
      ↓
    Home
 ┌────┼────┬────┐
Music Letter Image Gift
```

---

# 2. Tech Stack

| Technology        | Purpose       |
| ----------------- | ------------- |
| HTML5             | Layout        |
| CSS3 / Tailwind   | Styling       |
| JavaScript        | Logic         |
| GSAP / AOS        | Animation     |
| Howler.js         | Music Player  |
| Three.js / Canvas | Snow effect   |
| Swiper.js         | Image gallery |

### CDN

```html
GSAP
https://cdn.jsdelivr.net/npm/gsap@3

Swiper
https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js

Howler
https://cdn.jsdelivr.net/npm/howler

AOS
https://cdn.jsdelivr.net/npm/aos@2.3.4
```

---

# 3. Project Structure

```
love-gift-website
│
├── index.html
├── home.html
│
├── pages
│   ├── music.html
│   ├── letter.html
│   ├── gallery.html
│   └── gift.html
│
├── assets
│   ├── images
│   │   ├── gf1.jpg
│   │   ├── gf2.jpg
│   │   └── ...
│   │
│   ├── music
│   │   ├── song1.mp3
│   │   └── song2.mp3
│
│   └── fonts
│
├── css
│   └── style.css
│
└── js
    ├── password.js
    ├── music.js
    ├── gallery.js
    └── snow.js
```

---

# 4. Page 1 — Password Page

## index.html

Trang mở đầu yêu cầu nhập mật khẩu.

### UI

```
❤️ Love Website ❤️

[ Enter Password ]

      Unlock
```

### Example

```html
<div class="lock-screen">
  <h1>For My Love ❤️</h1>

  <input type="password" id="password">

  <button onclick="checkPassword()">Unlock</button>
</div>
```

### password.js

```javascript
function checkPassword() {

  const password = document.getElementById("password").value

  if(password === "iloveyou"){

      window.location.href = "home.html"

  }else{

      alert("Wrong password 💔")

  }
}
```

---

# 5. Page 2 — Home Menu

## home.html

Sau khi unlock sẽ hiển thị **4 lựa chọn**.

### UI Concept

```
✨ Choose an experience ✨

🎵 Music
💌 Letter
📸 Gallery
🎁 Gift
```

### Layout

```html
<div class="menu">

<a href="pages/music.html">Music</a>

<a href="pages/letter.html">Letter</a>

<a href="pages/gallery.html">Gallery</a>

<a href="pages/gift.html">Gift</a>

</div>
```

### Animation

Hover effect:

```css
.menu a{

transform: scale(1);
transition:0.4s;

}

.menu a:hover{

transform: scale(1.1);
}
```

---

# 6. Feature 1 — Music Page

## Concept

Một **playlist các bài hát** với:

* thumbnail = ảnh người yêu
* click để phát nhạc
* animation glow

---

## UI

```
🎵 Our Songs

[photo] Song 1
[photo] Song 2
[photo] Song 3
```

---

## music.html

```html
<div class="song">

<img src="../assets/images/gf1.jpg">

<h3>Perfect - Ed Sheeran</h3>

<button onclick="playSong(1)">Play</button>

</div>
```

---

## music.js

```javascript
let songs = [

new Howl({ src: ['../assets/music/song1.mp3'] }),

new Howl({ src: ['../assets/music/song2.mp3'] })

]

function playSong(id){

songs[id].play()

}
```

---

# 7. Feature 2 — Letter Page

## Concept

Trang thư tình với:

* font viết tay
* text fade-in
* background romantic

---

## Recommended Fonts

```
Great Vibes
Dancing Script
Parisienne
```

Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap" rel="stylesheet">
```

---

## letter.html

```html
<div class="letter">

<p>
From the moment I met you,
my life changed forever...
</p>

</div>
```

---

## CSS

```css
.letter{

font-family: 'Dancing Script', cursive;

font-size: 28px;

line-height: 1.8;

max-width: 700px;

margin:auto;

}
```

---

# 8. Feature 3 — Image Gallery

## Concept

Gallery cuộn với animation.

### Effects

* fade
* parallax
* zoom

---

## gallery.html

```html
<div class="gallery">

<img src="../assets/images/gf1.jpg" data-aos="fade-up">

<img src="../assets/images/gf2.jpg" data-aos="fade-left">

<img src="../assets/images/gf3.jpg" data-aos="zoom-in">

</div>
```

---

## AOS init

```javascript
AOS.init({
duration:1200
})
```

---

# 9. Feature 4 — Gift Page (Snow + Falling Love Text)

Đây là **trang ấn tượng nhất**.

## Visual

```
❄ Snow falling
❤️ Love messages falling
📸 Girlfriend photo center
```

---

## Layout

```html
<canvas id="snow"></canvas>

<img class="center-photo" src="../assets/images/gf1.jpg">

<div id="loveMessages"></div>
```

---

## Love Messages

```javascript
const messages = [

"I Love You ❤️",
"You Are My World",
"Forever With You",
"My Beautiful Girl"

]
```

---

## Falling Text

```javascript
function createMessage(){

let el = document.createElement("div")

el.className = "love"

el.innerText = messages[Math.floor(Math.random()*messages.length)]

el.style.left = Math.random()*100 + "vw"

document.body.appendChild(el)

}
```

Run every second

```javascript
setInterval(createMessage,1000)
```

---

## Snow Effect

Canvas animation.

Pseudo code:

```
create 200 snow particles

loop animation:

update Y position

if reach bottom

reset to top
```

---

# 10. UI Theme

## Color palette

```
Pink #ff6b81
Soft White #fff5f7
Rose #ff4d6d
Dark #1e1e1e
```

---

# 11. Romantic Animations

### Heart floating

### Image glow

### Smooth fade

Example:

```css
@keyframes float {

0% { transform:translateY(0) }

50% { transform:translateY(-10px) }

100% { transform:translateY(0) }

}
```

---

# 12. Mobile Responsive

```css
@media(max-width:768px){

.menu{

flex-direction:column

}

}
```

---

# 13. Deployment

## Option 1 — GitHub Pages

```
push repo
enable pages
done
```

---

## Option 2 — Vercel

```
import project
deploy
```

---

# 14. Future Enhancements

### 💡 Ideas

| Feature           | Description        |
| ----------------- | ------------------ |
| Voice message     | gửi lời nói        |
| Timeline          | timeline tình yêu  |
| Secret page       | câu hỏi quiz       |
| Interactive story | câu chuyện 2 người |

---

# 15. Suggested URL

```
for-my-love.vercel.app
```

---

# 🌟 Bonus Idea (Highly Recommended)

Khi nhập đúng password:

✨ **Heart explosion animation**

---

Nếu bạn muốn, mình có thể **build luôn full project gồm:**

* UI cực đẹp
* Snow effect xịn
* Gallery animation
* Music player đẹp
* Romantic design
* Có thể deploy ngay

Chỉ cần nói mình sẽ gửi:

**“Full Source Code Love Website (300+ dòng)”** cực đẹp. 💖
