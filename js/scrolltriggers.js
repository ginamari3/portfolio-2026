
// ENABLE ON SCROLL SCROLL TRACKING 
let ticking = false;
function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
        updateProgress();
        // updateParallax();
        ticking = false;
    });
}

// USE A SINGLE SCROLL PARENT FOR ALL ON SCROLL TRIGGERS
const scrollParent = document.querySelector(".scroll-parent");
scrollParent.addEventListener("scroll", onScroll);

// ON SCROLLPROGRESS BAR
const prog = document.getElementById("progressFill");
function updateProgress() {
    if (!prog || !scrollParent) return;
    const max = scrollParent.scrollHeight - scrollParent.clientHeight;
    const pct = max > 0 ? scrollParent.scrollTop / max : 0;
    prog.style.width = `${pct * 100}%`;
}

// ON SCROLL ANIMATE IN
const animEls = document.querySelectorAll(".anim");
const revealIO = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
    { root: scrollParent || null, threshold: 0.12 }
);
animEls.forEach((el) => revealIO.observe(el));

// ---------- NAV ACTIVE LINK ----------
function initNavActive() {
    const sections = Array.from(document.querySelectorAll(".snap-sec[id]"));
    const links = Array.from(document.querySelectorAll(".menu a[href^='#']"));
    if (!scrollParent || !sections.length || !links.length) return;

    const setActive = (id) => {
        links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${id}`));
    };

    const io = new IntersectionObserver((entries) => {
        const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) setActive(visible.target.id);
    }, { root: scrollParent, threshold: [0.35, 0.55, 0.75] });

    sections.forEach((sec) => io.observe(sec));
}
initNavActive() 