const section = document.getElementById("hParallax");
const track = document.getElementById("hTrack");

let maxTranslate = 0;

function clamp(n, min, max) {
    return Math.max(min, Math.min(n, max));
}

function setSectionHeight() {
    // Horizontal distance we need to travel
    maxTranslate = track.scrollWidth - window.innerWidth;
    maxTranslate = Math.max(0, maxTranslate);

    // Give vertical space to "spend" on the horizontal travel
    section.style.height = `${window.innerHeight + maxTranslate}px`;
}

function onScroll() {
    const rect = section.getBoundingClientRect();

    // progress through the section in pixels
    const progressPx = clamp(-rect.top, 0, maxTranslate);

    // Move track left
    track.style.transform = `translate3d(${-progressPx}px, 0, 0)`;
}

// IMPORTANT: recalc after layout/images load too
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
