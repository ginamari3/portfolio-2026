// year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const section = document.getElementById("hParallax");
const track = document.getElementById("hTrack");

let maxTranslate = 0;

function clamp(n, min, max) {
    return Math.max(min, Math.min(n, max));
}

function setSectionHeight() {
    if (!section || !track) return;

    maxTranslate = track.scrollWidth - window.innerWidth;
    maxTranslate = Math.max(0, maxTranslate);

    section.style.height = `${window.innerHeight + maxTranslate}px`;
}

function onScroll() {
    if (!section || !track) return;

    const rect = section.getBoundingClientRect();
    const progressPx = clamp(-rect.top, 0, maxTranslate);

    track.style.transform = `translate3d(${-progressPx}px, 0, 0)`;
}

setSectionHeight();
onScroll();

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", () => {
    setSectionHeight();
    onScroll();
}, { passive: true });

window.addEventListener("load", () => {
    setSectionHeight();
    onScroll();
});
