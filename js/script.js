// =======================
// LOADER (failsafe)
// =======================
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
    try { initPortfolio(); } catch (e) { console.error(e); }
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


// Force-reveal the first screen so you never load into a blank hero
document.querySelectorAll(".hero .anim").forEach(el => el.classList.add("in"));


function setSpacerHeight() {
    if (!spacer || !rail || !snap) return;

    // how far the rail needs to travel horizontally
    const maxX = Math.max(0, rail.scrollWidth - snap.clientWidth);

    // enough vertical scroll distance to complete it
    spacer.style.height = `${maxX + snap.clientHeight}px`;
}

function updateHorizontal() {
    if (!spacer || !rail || !snap) return;

    const start = spacer.offsetTop;
    const end = start + spacer.offsetHeight - snap.clientHeight;

    const progress = (snap.scrollTop - start) / (end - start);
    const t = Math.max(0, Math.min(progress, 1));

    const maxX = Math.max(0, rail.scrollWidth - snap.clientWidth);
    rail.style.transform = `translate3d(${-maxX * t}px, 0, 0)`;
}


// safety: reveal anything already in view
document.querySelectorAll(".anim").forEach(el => el.classList.add("in"));
