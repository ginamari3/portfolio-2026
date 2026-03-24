// ---------- FLUID BACKGROUND ----------
function initFluidBG() {
    const snap = document.getElementById("snap");
    const root = document.documentElement;

    const blob1 = document.querySelector(".blob--1");
    const blob2 = document.querySelector(".blob--2");
    const blob3 = document.querySelector(".blob--3");
    if (!blob1 || !blob2 || !blob3) return;

    const disableFollow = window.matchMedia("(max-width: 680px), (pointer: coarse)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let targetX = window.innerWidth * 0.5;
    let targetY = window.innerHeight * 0.5;

    let x1 = targetX, y1 = targetY;
    let x2 = targetX, y2 = targetY;
    let x3 = targetX, y3 = targetY;

    const lerp = (a, b, t) => a + (b - a) * t;

    if (!disableFollow) {
        window.addEventListener("mousemove", (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
            root.style.setProperty("--mx", `${targetX}px`);
            root.style.setProperty("--my", `${targetY}px`);
        }, { passive: true });
    } else {
        root.style.setProperty("--mx", `${targetX}px`);
        root.style.setProperty("--my", `${targetY}px`);
    }

    if (!reduce) {
        function tick() {
            const t1 = disableFollow ? 0.02 : 0.09;
            const t2 = disableFollow ? 0.015 : 0.06;
            const t3 = disableFollow ? 0.012 : 0.045;

            x1 = lerp(x1, targetX, t1);
            y1 = lerp(y1, targetY, t1);

            x2 = lerp(x2, targetX, t2);
            y2 = lerp(y2, targetY, t2);

            x3 = lerp(x3, targetX, t3);
            y3 = lerp(y3, targetY, t3);

            blob1.style.left = x1 + "px";
            blob1.style.top = y1 + "px";

            blob2.style.left = (x2 + 90) + "px";
            blob2.style.top = (y2 - 70) + "px";

            blob3.style.left = (x3 - 120) + "px";
            blob3.style.top = (y3 + 95) + "px";

            requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    const themes = {
        hero: ["rgba(246,207,217,.42)", "rgba(182,167,255,.34)", "rgba(255,255,255,.16)"],
        projects: ["rgba(182,167,255,.34)", "rgba(246,207,217,.30)", "rgba(255,255,255,.14)"],
        about: ["rgba(246,207,217,.30)", "rgba(182,167,255,.28)", "rgba(255,255,255,.14)"],
        contact: ["rgba(246,207,217,.36)", "rgba(182,167,255,.30)", "rgba(255,255,255,.18)"],
        footer: ["rgba(182,167,255,.26)", "rgba(246,207,217,.22)", "rgba(255,255,255,.12)"],
    };

    const sections = document.querySelectorAll(".snap-sec[data-theme]");
    if (sections.length) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const key = entry.target.dataset.theme;
                const [c1, c2, c3] = themes[key] || themes.hero;
                root.style.setProperty("--c1", c1);
                root.style.setProperty("--c2", c2);
                root.style.setProperty("--c3", c3);
            });
        }, { root: snap || null, threshold: 0.55 });

        sections.forEach((s) => io.observe(s));
    }
}

// INIT
initFluidBG();