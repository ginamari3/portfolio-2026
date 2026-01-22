// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

/* =========================
   1) Parallax background
   ========================= */
const parallaxEls = document.querySelectorAll(".parallax");
let latestScrollY = 0;
let ticking = false;

function updateParallax() {
    // background moves UP as you scroll DOWN
    parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.speed || "0.3");
        const y = -(latestScrollY * speed);
        el.style.backgroundPosition = `center ${y}px`;
    });
}

/* =========================
   2) Horizontal scroll driven by vertical scroll
   ========================= */
const hscroll = document.querySelector(".hscroll");
const track = document.getElementById("hscrollTrack");

function setHScrollHeight() {
    if (!hscroll || !track) return;

    // How far the track needs to move horizontally:
    // trackWidth - viewportWidth (but never negative)
    const totalScrollX = Math.max(0, track.scrollWidth - window.innerWidth);

    // Make the section tall enough to "spend" vertical scroll converting into horizontal movement
    // Add 1 viewport height so it feels roomy
    hscroll.style.height = `${totalScrollX + window.innerHeight}px`;
}

function updateHScroll() {
    if (!hscroll || !track) return;

    const rect = hscroll.getBoundingClientRect();
    const sectionTop = window.scrollY + rect.top;

    // Progress through this section (0 -> total height - viewport)
    const maxY = Math.max(1, hscroll.offsetHeight - window.innerHeight);
    const progressY = Math.min(Math.max(window.scrollY - sectionTop, 0), maxY);
    const progress = progressY / maxY;

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

// init
setHScrollHeight();
updateParallax();
updateHScroll();
