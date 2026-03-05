# Love Gift Website 💕

A romantic gift website for Women's Day — pure frontend, no backend needed.

## Getting Started

1. **Add your photos** to `assets/images/`:
   - `gf1.jpg` through `gf8.jpg` (gallery + music thumbnails)
   - Portrait/square photos work best

2. **Add your music** to `assets/music/`:
   - `song1.mp3` through `song4.mp3`
   - Update song titles/artists in `js/music.js` → `SONGS` array

3. **Personalize the letter** in `pages/letter.html` — edit the `<p class="letter-para">` paragraphs

4. **Change the password** in `js/password.js` → `CORRECT_PASSWORD` (default: `iloveyou`)

5. **Open `index.html`** in a browser — done!

## Deploy

### GitHub Pages
```
git init && git add . && git commit -m "init"
git remote add origin <your-repo>
git push -u origin main
# → Settings → Pages → branch: main
```

### Vercel
```
npm i -g vercel
vercel
```

## Structure

```
├── index.html        ← Password gate
├── home.html         ← Menu
├── pages/
│   ├── music.html    ← Music player
│   ├── letter.html   ← Love letter
│   ├── gallery.html  ← Photo gallery
│   └── gift.html     ← Snow + falling messages
├── assets/
│   ├── images/       ← Add photos here
│   └── music/        ← Add mp3 files here
├── css/              ← Styles per page
└── js/               ← Logic per page
```

## Password

Default: **`iloveyou`** — change in `js/password.js`
