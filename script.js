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
