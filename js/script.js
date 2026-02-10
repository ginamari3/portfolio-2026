// =======================
// LOADER
// =======================
const loader = document.getElementById("loader");
const loaderPct = document.getElementById("loaderPct");
const loaderFill = document.getElementById("loaderFill");

function startSite() {
    loader.classList.add("is-hidden");
    document.body.classList.remove("is-loading");
    initPortfolio();
}

(function runLoader() {
    let p = 0;
    const duration = 900; // ms
    const start = performance.now();

    function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        p = Math.round(eased * 100);

        loaderPct.textContent = `${p}%`;
        loaderFill.style.width = `${p}%`;

        if (t < 1) requestAnimationFrame(tick);
        else setTimeout(startSite, 200);
    }

    requestAnimationFrame(tick);
})();


// =======================
// MAIN INIT
// =======================
function initPortfolio() {
    const snap = document.getElementById("snap");

    // Footer year
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Active nav link on click (simple)
    const navLinks = document.querySelectorAll(".menu a");
    navLinks.forEach(a => {
        a.addEventListener("click", () => {
            navLinks.forEach(x => x.classList.remove("active"));
            a.classList.add("active");
        });
    });

    // Rotating word
    const words = ["interfaces", "dashboards", "brands", "systems", "experiences"];
    const rot = document.getElementById("rotWord");
    if (rot) {
        let i = 0;
        setInterval(() => {
            rot.classList.add("fade");
            setTimeout(() => {
                i = (i + 1) % words.length;
                rot.textContent = words[i];
                rot.classList.remove("fade");
            }, 250);
        }, 1800);
    }

    // Reveal animations (IntersectionObserver on snap container)
    const animEls = document.querySelectorAll(".anim");
    if (snap) {
        // stagger for the horizontal cards
        document.querySelectorAll(".hscroll-rail .anim").forEach((el, i) => {
            el.style.setProperty("--d", `${i * 80}ms`);
        });

        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) entry.target.classList.add("in");
            });
        }, { root: snap, threshold: 0.12 });

        animEls.forEach(el => io.observe(el));
    }

    // Tilt
    const tiltTargets = document.querySelectorAll("[data-tilt]");
    tiltTargets.forEach((el) => {
        const strength = 10;
        const scale = 1.02;

        function onMove(e) {
            const r = el.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width;
            const py = (e.clientY - r.top) / r.height;

            el.style.setProperty("--mx", `${px * 100}%`);
            el.style.setProperty("--my", `${py * 100}%`);

            const rx = (py - 0.5) * -strength;
            const ry = (px - 0.5) * strength;

            el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`;
        }

        function onLeave() {
            el.style.transform = `perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)`;
        }

        el.addEventListener("mousemove", onMove);
        el.addEventListener("mouseleave", onLeave);
    });

    // Progress bar for snap container
    const prog = document.getElementById("progressFill");
    function updateProgress() {
        if (!snap || !prog) return;
        const max = snap.scrollHeight - snap.clientHeight;
        const pct = max > 0 ? (snap.scrollTop / max) : 0;
        prog.style.width = `${pct * 100}%`;
    }

    // Parallax in HERO (based on snap scroll position)
    const hero = document.querySelector(".hero");
    function updateHeroParallax() {
        if (!snap || !hero) return;
        const rect = hero.getBoundingClientRect();
        // rect is relative to viewport, but snap scroll is the mover
        // When hero is at top: rect.top ~ header height area; we just want a smooth number.
        const y = Math.min(Math.max(-rect.top, 0), snap.clientHeight);
        hero.style.setProperty("--py", `${y}px`);
    }

    // Horizontal scroll: scroll down = translate rail sideways (inside snap)
    const spacer = document.getElementById("hscrollSpacer");
    const rail = document.getElementById("hscrollRail");

    function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

    function setSpacerHeight() {
        if (!spacer || !rail || !snap) return;
        const maxX = rail.scrollWidth - snap.clientWidth;
        const extra = snap.clientHeight * 0.6;
        const h = Math.max(snap.clientHeight * 1.4, maxX + snap.clientHeight + extra);
        spacer.style.height = h + "px";
    }

    function updateHorizontal() {
        if (!spacer || !rail || !snap) return;
        const rect = spacer.getBoundingClientRect();
        const total = spacer.offsetHeight - snap.clientHeight;
        const progressed = clamp((0 - rect.top) / total, 0, 1);

        const maxX = rail.scrollWidth - snap.clientWidth;
        const x = maxX * progressed;

        rail.style.transform = `translate3d(${-x}px, 0, 0)`;
    }

    let ticking = false;
    function onSnapScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            updateProgress();
            updateHeroParallax();
            updateHorizontal();
            ticking = false;
        });
    }

    if (snap) {
        snap.addEventListener("scroll", onSnapScroll, { passive: true });
        window.addEventListener("resize", () => {
            setSpacerHeight();
            updateHeroParallax();
            updateHorizontal();
            updateProgress();
        });

        // initial
        setSpacerHeight();
        updateHeroParallax();
        updateHorizontal();
        updateProgress();
    }
}
