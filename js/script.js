// =======================
// LOADER (failsafe)
// =======================
document.body.classList.add("is-loading");

const loader = document.getElementById("loader");
const loaderPct = document.getElementById("loaderPct");
const loaderFill = document.getElementById("loaderFill");

function hideLoader() {
    if (!loader) return;
    loader.classList.add("is-hidden");
    document.body.classList.remove("is-loading");
}

function startSite() {
    hideLoader();
    initPortfolio();
}

// FAILSAFE: never get stuck
setTimeout(startSite, 1400);

// Normal “fake progress”
(function runLoader() {
    if (!loaderPct || !loaderFill) return;

    let p = 0;
    const duration = 900;
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
// SITE INIT
// =======================
function initPortfolio() {
    const snap = document.getElementById("snap");
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // 1) Rotating hero word
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

    // 2) Progress bar for snap scroll
    const prog = document.getElementById("progressFill");
    function updateProgress() {
        if (!snap || !prog) return;
        const max = snap.scrollHeight - snap.clientHeight;
        const pct = max > 0 ? (snap.scrollTop / max) : 0;
        prog.style.width = `${pct * 100}%`;
    }

    // 3) Parallax: update CSS var based on snap scroll
    function updateParallax() {
        if (!snap) return;
        document.documentElement.style.setProperty("--py", `${snap.scrollTop}px`);
    }

    // 4) Reveal animations (IntersectionObserver)
    const animEls = document.querySelectorAll(".anim");
    if (snap) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) entry.target.classList.add("in");
            });
        }, { root: snap, threshold: 0.12 });

        animEls.forEach(el => io.observe(el));
    }
    // Always reveal hero immediately
    document.querySelectorAll(".hero .anim").forEach(el => el.classList.add("in"));

    // 5) Tilt
    document.querySelectorAll("[data-tilt]").forEach((el) => {
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

    // 6) Horizontal scroll (inside snap container)
    const spacer = document.getElementById("hscrollSpacer");
    const rail = document.getElementById("hscrollRail");

    function setSpacerHeight() {
        if (!snap || !spacer || !rail) return;
        const maxX = Math.max(0, rail.scrollWidth - snap.clientWidth);
        spacer.style.height = `${maxX + snap.clientHeight}px`;
    }

    function updateHorizontal() {
        if (!snap || !spacer || !rail) return;

        const start = spacer.offsetTop;
        const end = start + spacer.offsetHeight - snap.clientHeight;

        const progress = (snap.scrollTop - start) / (end - start);
        const t = Math.max(0, Math.min(progress, 1));

        const maxX = Math.max(0, rail.scrollWidth - snap.clientWidth);
        rail.style.transform = `translate3d(${-maxX * t}px, 0, 0)`;
    }

    let ticking = false;
    function onSnapScroll() {
        if (!snap) return;
        if (!ticking) {
            requestAnimationFrame(() => {
                updateProgress();
                updateParallax();
                updateHorizontal();
                ticking = false;
            });
            ticking = true;
        }
    }

    if (snap) {
        snap.addEventListener("scroll", onSnapScroll, { passive: true });
    }

    window.addEventListener("resize", () => {
        setSpacerHeight();
        updateHorizontal();
    });

    setSpacerHeight();
    updateProgress();
    updateParallax();
    updateHorizontal();
}
