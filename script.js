const cursor = document.querySelector(".cursor");
const links = document.querySelectorAll(".navbar a, .nav-link, nav a, h1"); // covers your Bulma navbar

// Follow the mouse using viewport coordinates
document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top  = e.clientY + "px";
});

// Grow/shrink when hovering nav links
links.forEach(link => {
  link.addEventListener("mouseenter", () => cursor.classList.add("large"));
  link.addEventListener("mouseleave", () => cursor.classList.remove("large"));
});

const container = document.getElementById("entries-container");

// Load entries.json
fetch("entries.json")
  .then(response => response.json())
  .then(entries => {
    entries.forEach(entry => {
      fetch(entry.file)
        .then(response => response.text())
        .then(markdown => {
          // 🔹 Fix image paths: prepend "Entries/" if missing
          markdown = markdown.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, src) => {
            if (!src.startsWith("http") && !src.includes("Entries/")) {
              return `![${alt}](Entries/${src})`;
            }
            return match;
          });

          // Convert markdown → HTML
          let html = marked.parse(markdown);

          // 🔹 Wrap images with style
          html = html.replace(
            /<img(.*?)>/g,
            `<img$1 style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); margin-top: 10px; max-width: 100%; height: auto;">`
          );

          // Create and append box
          const box = document.createElement("div");
          box.classList.add("box");
          box.innerHTML = `<div class="content">${html}</div>`;
          container.appendChild(box);
        })
        .catch(err => console.error("Error loading markdown:", entry.file, err));
    });
  })
  .catch(err => console.error("Error loading entries.json:", err));
