// ---------- ONE-TIME INIT GUARD ----------
let didInit = false;

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

    setTimeout(() => {
        try { loader.remove(); } catch (_) { }
    }, 700);
}

function startApp() {
    if (didInit) return;
    didInit = true;

    hideLoader();
    // initPortfolio();
    // initFluidBG();
    // initNavActive();
}

// Start when fully loaded + backup
// window.addEventListener("load", runLoader);
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

        document.documentElement.style.setProperty("--lpy", `${eased * 80}px`);

        if (t < 1) requestAnimationFrame(tick);
        else setTimeout(startApp, 120);
    }

    requestAnimationFrame(tick);
})();