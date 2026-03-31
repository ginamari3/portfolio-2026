document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("img-modal");
    const modalImg = document.getElementById("img-expanded");
    const closeBtn = document.querySelector(".img-close");
    const images = document.querySelectorAll(".cs-sitemap-large");

    if (!modal || !modalImg || !closeBtn || !images.length) {
        console.log("Modal setup missing:", { modal, modalImg, closeBtn, images });
        return;
    }

    images.forEach((img) => {
        img.addEventListener("click", () => {
            modal.style.display = "flex";
            modalImg.src = img.src;
            modalImg.alt = img.alt;
        });
    });

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
});