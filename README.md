# 📚 English Portfolio Website

A modern and interactive **portfolio website** built with **HTML, CSS, JavaScript, and Bulma** to showcase my weekly reflections, progress, and final course reflection.

Also a ***vibe*** code project of mine, trying to build a website, with no professional knowledge and a lot of ChatGPT.

🌐 Hosted live on **GitHub Pages** → [View Website](https://github.com/Null-B/English-Portfolio-Website)

## ✨ Features

- 🎨 **Responsive Design** using [Bulma CSS](https://bulma.io)
- 🖱️ **Custom Cursor Effect** (follows mouse, grows on hover)
- 📂 **Dynamic Markdown Loader** – portfolio entries are written in `.md` files and auto-converted to HTML
- 📖 **Collapsible Entries** – each week’s entry can be expanded/collapsed

## 🗂️ Project Structure

```text
Assets/
├─ me.png                       # About Me photo
├─ web_zuerich_polyterrasse...  # Hero background image
Entries/
├─ Port1/
│   ├─ Portfolio-1.md
│   ├─ shared_image_(5).jpg
│   └─ ...
├─ Port2/
│   ├─ Portfolio-2.md
│   ├─ image.png
│   └─ ...
└─ Port13/
    └─ Portfolio-13.md
entries.json                     # Entry list (points to .md files)
index.html                       # Main HTML file
style.css                        # Styling
script.js                        # Interactivity + Markdown loading
```

*Last Updated: 1.9.2025*

## ⚙️ How It Works

1. ✍️ Write weekly entries in **Markdown** (`.md`) inside `Entries/PortX/`.
3. 🖼️ Any images in Markdown (e.g., `![alt](image.png)`) are automatically fixed to load from the same folder as the `.md` file.
4. 🧾 When the page loads, `script.js` fetches the entries, converts Markdown → HTML, and injects them into the website.
5. 📂 Each entry becomes a collapsible section with its title as the header.

## 📸 Screenshots

![alt text](Assets/image.png)

## 🔮 Possible Improvements

- 🌙 Add a Light/Dark mode toggle
- 🖼️ Image Lightbox (click-to-expand)
- 🔍 Search & filter entries
- 🕒 Timeline-style entry display
- 📊 Progress bar showing scroll position

## 🛠️ Built With

- [Bulma](https://bulma.io) – CSS Framework
- [Marked.js](https://marked.js.org/) – Markdown → HTML converter
- Vanilla **JavaScript**
- HTML5 + CSS3
