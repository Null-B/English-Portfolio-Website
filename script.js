const cursor = document.querySelector(".cursor");
const links = document.querySelectorAll(".navbar a, .nav-link, nav a, h1, [role='button']");

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
  currentX += (mouseX - currentX) * 0.15;
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
// Portfolio Entries
// ======================================
const container = document.getElementById("entries-container");

fetch("entries.json")
  .then(response => response.json())
  .then(entries => {
    entries.forEach(entry => {
      fetch(entry.file)
        .then(response => response.text())
        .then(markdown => {
          const entryDir = entry.file.substring(0, entry.file.lastIndexOf("/"));

          // Fix relative image paths
          markdown = markdown.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, src) => {
            if (!src.startsWith("http") && !src.includes("Entries/")) {
              return `![${alt}](${entryDir}/${src})`;
            }
            return match;
          });

          let html = marked.parse(markdown);

          // Get the first heading (# Week 1) as the title
          const matchHeading = html.match(/<h1.*?>(.*?)<\/h1>/);
          const title = matchHeading ? matchHeading[1] : "Untitled Entry";

          // Remove first <h1> from content
          html = html.replace(/<h1.*?>.*?<\/h1>/, "");

          if (title === "Untitled Entry") return;

          // Collapsible entry box
          const box = document.createElement("div");
          box.classList.add("box");
          box.innerHTML = `
            <div class="entry-header" style="cursor:pointer; font-weight:600; font-size:1.2rem; margin-bottom:0.8rem;">
              ${title} ⯆
            </div>
            <div class="entry-content content" style="display:none; font-size:0.8rem; margin-top:0.75rem;">
              ${html}
            </div>
          `;

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

// ======================================
// Lightbox
// ======================================
document.addEventListener("click", (e) => {
  const target = e.target;

  if (target.tagName === "IMG" && target.closest(".entry-content")) {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.querySelector(".lightbox-img");
    const lightboxClose = document.querySelector(".lightbox-close");

    lightbox.style.display = "flex";
    lightboxImg.src = target.src;
    lightboxImg.alt = target.alt || "Expanded image";

    const closeLightbox = () => {
      lightbox.style.display = "none";
      lightboxImg.src = "";
      lightboxImg.alt = "";
    };

    lightboxClose.onclick = closeLightbox;
    lightbox.onclick = (ev) => {
      if (ev.target === lightbox) closeLightbox();
    };

    // Close on Escape key
    document.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") closeLightbox();
    }, { once: true });
  }
});

// ======================================
// Scroll Progress Bar + Navbar Highlight
// ======================================
window.addEventListener("scroll", () => {
  const progressBar = document.getElementById("progress-bar");
  const container = document.getElementById("progress-container");
  const hero = document.querySelector(".hero");

  const heroHeight = hero.offsetHeight;

  // --- Progress bar calculation ---
  const rawScrollTop = window.scrollY; // unadjusted
  const scrollTop = rawScrollTop - heroHeight; // adjusted for bar
  const docHeight = Math.max(
    1,
    document.documentElement.scrollHeight - window.innerHeight - heroHeight
  ); // avoid /0

  const scrollPercent = Math.max(0, (scrollTop / docHeight) * 100);

  // Grow the bar
  progressBar.style.height = scrollPercent + "%";

  // Reveal ticks up to the same height
  container.style.setProperty("--progress", scrollPercent + "%");

  // --- Navbar highlight ---
  const sections = document.querySelectorAll("section");
  let current = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100; // adjust for navbar height
    if (rawScrollTop >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.remove("is-active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("is-active");
    }
  });
});

// ================== LIGHT / DARK MODE TOGGLE ==================
const toggleBtn = document.getElementById("theme-toggle");
const root = document.documentElement;

// Apply saved theme on load
if (localStorage.getItem("theme") === "dark") {
  root.classList.add("dark-mode");
  toggleBtn.textContent = "☀️ Light";
} else {
  toggleBtn.textContent = "🌙 Dark";
}

toggleBtn.addEventListener("click", () => {
  if (root.classList.contains("dark-mode")) {
    root.classList.remove("dark-mode");
    localStorage.setItem("theme", "light");
    toggleBtn.textContent = "🌙 Dark";
  } else {
    root.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
    toggleBtn.textContent = "☀️ Light";
  }
});
