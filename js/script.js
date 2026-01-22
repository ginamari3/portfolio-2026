// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* 1) Parallax background */
const parallaxEls = document.querySelectorAll(".parallax");
let latestScrollY = 0;
let ticking = false;

/* 2) Horizontal scroll driven by vertical scroll */
const hscroll = document.querySelector(".hscroll");
const track = document.getElementById("hscrollTrack");

function setHScrollHeight() {
    if (!hscroll || !track) return;

    // total horizontal distance we need to travel
    const maxX = Math.max(0, track.scrollWidth - window.innerWidth);

    // section needs enough vertical height to "spend" turning into horizontal motion
    hscroll.style.height = `${maxX + window.innerHeight}px`;
}

function updateParallax() {
    parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.speed || "0.3");
        const y = -(latestScrollY * speed);
        el.style.backgroundPosition = `center ${y}px`;
    });
}

function updateHScroll() {
    if (!hscroll || !track) return;

    const rect = hscroll.getBoundingClientRect();
    const sectionTop = window.scrollY + rect.top;

    const maxY = Math.max(1, hscroll.offsetHeight - window.innerHeight);
    const y = Math.min(Math.max(window.scrollY - sectionTop, 0), maxY);
    const progress = y / maxY;

    const maxX = Math.max(0, track.scrollWidth - window.innerWidth);
    const x = -maxX * progress;

    track.style.transform = `translate3d(${x}px, 0, 0)`;
}

function onScroll() {
    latestScrollY = window.scrollY;

    if (!ticking) {
        requestAnimationFrame(() => {
            updateParallax();
            updateHScroll();
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener("scroll", onScroll, { passive: true });

window.addEventListener("resize", () => {
    setHScrollHeight();
    updateHScroll();
}, { passive: true });

// IMPORTANT: images load after JS, so recalc on load too
window.addEventListener("load", () => {
    setHScrollHeight();
    updateParallax();
    updateHScroll();
});

// init
setHScrollHeight();
updateParallax();
updateHScroll();
