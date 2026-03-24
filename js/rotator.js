// Rotator
let rotatorInterval = null;
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