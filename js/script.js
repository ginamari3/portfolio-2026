// =========================================================
// PORTFOLIO SCRIPT (HOME + CASE STUDY SAFE) — COPY/PASTE
// - Loader always hides (load event + fallback)
// - Works on snap-scroll home (#snap) OR normal-scroll case pages (#caseMain)
// - No duplicate rotator timers
// - Progress bar works on both pages
// =========================================================

// ---------- ONE-TIME INIT GUARD ----------
let didInit = false;
let rotatorInterval = null;

// ---------- LOADER ----------
document.body.classList.add("is-loading");

const loader = document.getElementById("loader");
const loaderPct = document.getElementById("loaderPct");
const loaderFill = document.getElementById("loaderFill");

function hideLoader() {
    if (!loader) {
        document.body.classList.remove("is-loading");
        return;
    }

    loader.classList.add("is-hidden");
    document.body.classList.remove("is-loading");

    // hard remove after fade so it can't block clicks
    setTimeout(() => {
        try { loader.remove(); } catch (_) { }
    }, 700);
}

function startApp() {
    if (didInit) return;
    didInit = true;

    hideLoader();
    initPortfolio();
}

// Start when fully loaded + a backup fail-safe
window.addEventListener("load", startApp);
setTimeout(startApp, 2500);

// animate loader progress once
(function runLoader() {
    if (!loaderPct || !loaderFill) return;

    const duration = 900;
    const start = performance.now();

    function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const p = Math.round(eased * 100);

        loaderPct.textContent = `${p}%`;
        loaderFill.style.width = `${p}%`;

        // tiny parallax wobble while loading
        document.documentElement.style.setProperty("--lpy", `${eased * 80}px`);

        if (t < 1) requestAnimationFrame(tick);
        else setTimeout(startApp, 120);
    }

    requestAnimationFrame(tick);
})();

// ---------- SITE ----------
function initPortfolio() {
    const snap = document.getElementById("snap");         // home scroller
    const caseMain = document.getElementById("caseMain"); // case page container (optional)
    const yearEl = document.getElementById("year");
    const prog = document.getElementById("progressFill");
    const hero = document.querySelector(".hero");

    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ---- Reveal animations ----
    const animEls = document.querySelectorAll(".anim");
    const revealRoot = snap || null; // if snap exists, observe within it; else viewport
    const revealIO = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
        { root: revealRoot, threshold: 0.12 }
    );
    animEls.forEach((el) => revealIO.observe(el));

    // ---- Rotator (single interval, never duplicates) ----
    const words = ["interfaces", "dashboards", "brands", "systems", "experiences"];
    const rot = document.getElementById("rotWord");
    let i = 0;

    if (rotatorInterval) clearInterval(rotatorInterval);
    if (rot) {
        rotatorInterval = setInterval(() => {
            rot.classList.add("fade");
            setTimeout(() => {
                i = (i + 1) % words.length;
                rot.textContent = words[i];
                rot.classList.remove("fade");
            }, 220);
        }, 1800);
    }

    // ---- Progress (HOME via #snap, CASE via window scroll) ----
    function updateProgress() {
        if (!prog) return;

        // home: snap scroller
        if (snap) {
            const max = snap.scrollHeight - snap.clientHeight;
            const pct = max > 0 ? snap.scrollTop / max : 0;
            prog.style.width = `${pct * 100}%`;
            return;
        }

        // case: document scroll
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        const pct = max > 0 ? doc.scrollTop / max : 0;
        prog.style.width = `${pct * 100}%`;
    }

    // ---- Hero parallax (only relevant on HOME where .hero + #snap exist) ----
    function updateParallax() {
        if (!snap || !hero) return;

        const heroTop = hero.offsetTop;
        const heroH = hero.offsetHeight;

        const y = snap.scrollTop - heroTop;
        const clamped = Math.max(0, Math.min(y, heroH));

        document.documentElement.style.setProperty("--py", `${clamped}px`);
        document.documentElement.style.setProperty("--tpy", `${clamped}px`);
    }

    let ticking = false;
    function onScrollAny() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            updateProgress();
            updateParallax();
            ticking = false;
        });
    }

    if (snap) snap.addEventListener("scroll", onScrollAny, { passive: true });
    window.addEventListener("scroll", onScrollAny, { passive: true }); // supports case pages
    window.addEventListener("resize", onScrollAny);

    // initial paint
    updateProgress();
    updateParallax();
}

// ---------- FLUID BACKGROUND (mouse follow + section theme) ----------
(function initFluidBG() {
    const snap = document.getElementById("snap");
    const root = document.documentElement;

    const blob1 = document.querySelector(".blob--1");
    const blob2 = document.querySelector(".blob--2");
    const blob3 = document.querySelector(".blob--3");
    if (!blob1 || !blob2 || !blob3) return;

    // Start centered
    let targetX = window.innerWidth * 0.5;
    let targetY = window.innerHeight * 0.5;

    let x1 = targetX, y1 = targetY;
    let x2 = targetX, y2 = targetY;
    let x3 = targetX, y3 = targetY;

    const lerp = (a, b, t) => a + (b - a) * t;

    // Mouse tracking
    window.addEventListener(
        "mousemove",
        (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
            root.style.setProperty("--mx", `${targetX}px`);
            root.style.setProperty("--my", `${targetY}px`);
        },
        { passive: true }
    );

    // Fluid animation loop
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) {
        function tick() {
            x1 = lerp(x1, targetX, 0.09);
            y1 = lerp(y1, targetY, 0.09);

            x2 = lerp(x2, targetX, 0.06);
            y2 = lerp(y2, targetY, 0.06);

            x3 = lerp(x3, targetX, 0.045);
            y3 = lerp(y3, targetY, 0.045);

            blob1.style.left = x1 + "px";
            blob1.style.top = y1 + "px";

            blob2.style.left = x2 + 90 + "px";
            blob2.style.top = y2 - 70 + "px";

            blob3.style.left = x3 - 120 + "px";
            blob3.style.top = y3 + 95 + "px";

            requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    // Theme palettes
    const themes = {
        hero: ["rgba(246,207,217,.42)", "rgba(182,167,255,.34)", "rgba(255,255,255,.16)"],
        projects: ["rgba(182,167,255,.34)", "rgba(246,207,217,.30)", "rgba(255,255,255,.14)"],
        about: ["rgba(246,207,217,.30)", "rgba(182,167,255,.28)", "rgba(255,255,255,.14)"],
        contact: ["rgba(246,207,217,.36)", "rgba(182,167,255,.30)", "rgba(255,255,255,.18)"],
        footer: ["rgba(182,167,255,.26)", "rgba(246,207,217,.22)", "rgba(255,255,255,.12)"],
        case: ["rgba(182,167,255,.28)", "rgba(246,207,217,.22)", "rgba(255,255,255,.12)"],
    };

    // HOME: observe sections in snap scroller
    const sections = document.querySelectorAll(".snap-sec[data-theme]");
    if (sections.length) {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const key = entry.target.dataset.theme;
                    const [c1, c2, c3] = themes[key] || themes.hero;
                    root.style.setProperty("--c1", c1);
                    root.style.setProperty("--c2", c2);
                    root.style.setProperty("--c3", c3);
                });
            },
            { root: snap || null, threshold: 0.55 }
        );

        sections.forEach((s) => io.observe(s));
    } else {
        // CASE pages: set a stable palette
        const [c1, c2, c3] = themes.case;
        root.style.setProperty("--c1", c1);
        root.style.setProperty("--c2", c2);
        root.style.setProperty("--c3", c3);
    }
})();

// ----- NAV ACTIVE LINK (scrollspy for #snap) -----
(function initNavActive() {
    const snap = document.getElementById("snap");
    const sections = Array.from(document.querySelectorAll(".snap-sec[id]"));
    const links = Array.from(document.querySelectorAll(".menu a[href^='#']"));

    // Only run on HOME where #snap exists
    if (!snap || !sections.length || !links.length) return;

    const setActive = (id) => {
        links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${id}`));
    };

    // Update active on click
    links.forEach((a) => {
        a.addEventListener("click", () => {
            const id = a.getAttribute("href").slice(1);
            setActive(id);
        });
    });

    // Update active on scroll
    const io = new IntersectionObserver(
        (entries) => {
            const visible = entries
                .filter((e) => e.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

            if (visible) setActive(visible.target.id);
        },
        { root: snap, threshold: [0.35, 0.55, 0.75] }
    );

    sections.forEach((sec) => io.observe(sec));
})();