const modal = document.getElementById("img-modal");
const modalImg = document.getElementById("img-expanded");
const closeBtn = document.querySelector(".img-close");

document.querySelectorAll(".cs-sitemap-large").forEach(img => {
    img.addEventListener("click", () => {
        modal.style.display = "flex";
        modalImg.src = img.src;
    });
});

closeBtn.onclick = () => modal.style.display = "none";

modal.onclick = (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
};