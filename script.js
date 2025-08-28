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

fetch("entries.json")
  .then(response => response.json())
  .then(entries => {
    entries.forEach(entry => {
      fetch(entry.file)
        .then(response => response.text())
        .then(markdown => {
          // Fix image paths
          markdown = markdown.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, src) => {
            if (!src.startsWith("http") && !src.includes("Entries/")) {
              return `![${alt}](Entries/${src})`;
            }
            return match;
          });

          // Convert markdown → HTML
          let html = marked.parse(markdown);

          // Create entry box
          const box = document.createElement("div");
          box.classList.add("box");

          // Get the first heading (# Week 1) as the title
          const matchHeading = html.match(/<h1.*?>(.*?)<\/h1>/);
          const title = matchHeading ? matchHeading[1] : "Untitled Entry";

          // Remove first <h1> from content so it doesn’t duplicate
          html = html.replace(/<h1.*?>.*?<\/h1>/, "");

          // Collapsible structure
          box.innerHTML = `
            <div class="entry-header" style="cursor:pointer; font-weight:600; font-size:1.3rem; margin-bottom:0.5rem;">
              ${title} ⯆
            </div>
            <div class="entry-content content" style="display:none; margin-top:0.75rem;">
              ${html}
            </div>
          `;

          // Toggle expand/collapse on click
          const header = box.querySelector(".entry-header");
          const content = box.querySelector(".entry-content");
          header.addEventListener("click", () => {
            const isHidden = content.style.display === "none";
            content.style.display = isHidden ? "block" : "none";
            header.innerHTML = `${title} ${isHidden ? "⯅" : "⯆"}`;
          });

          container.appendChild(box);
        });
    });
  });
