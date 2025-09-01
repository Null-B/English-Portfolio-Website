const cursor = document.querySelector(".cursor");
const links = document.querySelectorAll(".navbar a, .nav-link, nav a, h1, [role='button']"); // covers your Bulma navbar

// Target and actual positions
let mouseX = 0, mouseY = 0;
let currentX = 0, currentY = 0;

// Update target position on mouse move
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});


// Animation loop (lerp)
function animateCursor() {
  currentX += (mouseX - currentX) * 0.15; // 0.15 = speed factor
  currentY += (mouseY - currentY) * 0.15;

  cursor.style.left = currentX + "px";
  cursor.style.top  = currentY + "px";

  requestAnimationFrame(animateCursor);
}
animateCursor();


// Grow/shrink on hover
links.forEach(link => {
  link.addEventListener("mouseenter", () => cursor.classList.add("large"));
  link.addEventListener("mouseleave", () => cursor.classList.remove("large"));
});

// ======================================

const container = document.getElementById("entries-container");

fetch("entries.json")
  .then(response => response.json())
  .then(entries => {
    entries.forEach(entry => {
      fetch(entry.file)
        .then(response => response.text())
        .then(markdown => {
          // Fix image paths
          const entryDir = entry.file.substring(0, entry.file.lastIndexOf("/"));

          markdown = markdown.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, src) => {
            if (!src.startsWith("http") && !src.includes("Entries/")) {
              return `![${alt}](${entryDir}/${src})`;
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

          // Skip if entry has no proper title
          if (title === "Untitled Entry") {
            return;
          }

          // Collapsible structure
          box.innerHTML = `
            <div class="entry-header" style="cursor:pointer; font-weight:600; font-size:1.2rem; margin-bottom:0.8rem;">
              ${title} ⯆
            </div>
            <div class="entry-content content" style="display:none; font-size:0.8rem; margin-top:0.75rem;">
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

// Lightbox functionality

// ================== LIGHTBOX FEATURE ==================
document.addEventListener("click", (e) => {
  const target = e.target;

  // Only trigger if an entry image is clicked
  if (target.tagName === "IMG" && target.closest(".entry-content")) {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.querySelector(".lightbox-img");
    const lightboxClose = document.querySelector(".lightbox-close");

    lightbox.style.display = "flex";
    lightboxImg.src = target.src;

    // Close when clicking the X
    lightboxClose.onclick = () => {
      lightbox.style.display = "none";
      lightboxImg.src = "";
    };

    // Close when clicking outside the image
    lightbox.onclick = (ev) => {
      if (ev.target === lightbox) {
        lightbox.style.display = "none";
        lightboxImg.src = "";
      }
    };
  }
});


// ================== VERTICAL SCROLL PROGRESS BAR ==================
window.addEventListener("scroll", () => {
  const progressBar = document.getElementById("progress-bar");

  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;

  progressBar.style.height = scrollPercent + "%";
});
