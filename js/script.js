// Year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile nav toggle
const header = document.querySelector(".site-header");
const menuBtn = document.getElementById("menuBtn");

if (header && menuBtn) {
    menuBtn.addEventListener("click", () => {
        const isOpen = header.getAttribute("data-navstate") === "open";
        header.setAttribute("data-navstate", isOpen ? "closed" : "open");
        menuBtn.setAttribute("aria-expanded", String(!isOpen));
    });
}

// Smooth scroll for nav links
document.querySelectorAll('a.scroll[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        const target = document.querySelector(id);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });

        // close mobile nav after click
        if (header) header.setAttribute("data-navstate", "closed");
        if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
    });
});

// About "Read more"
const moreAbout = document.getElementById("more-about");
const toggleAboutBtn = document.getElementById("toggleAboutBtn");

if (moreAbout && toggleAboutBtn) {
    toggleAboutBtn.addEventListener("click", () => {
        const isHidden = moreAbout.hasAttribute("hidden");
        if (isHidden) {
            moreAbout.removeAttribute("hidden");
            toggleAboutBtn.textContent = "Read less";
        } else {
            moreAbout.setAttribute("hidden", "");
            toggleAboutBtn.textContent = "Read more about me";
        }
    });
}

// Scroll reveal
const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
    }, { threshold: 0.12 });

    revealEls.forEach(el => io.observe(el));
} else {
    // fallback: just show everything
    revealEls.forEach(el => el.classList.add("is-visible"));
}
