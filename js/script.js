// Pequeno script para menu mobile (comportamento básico)
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    toggle?.addEventListener('click', () => {
      if (nav.style.display === 'flex') {
        nav.style.display = 'none';
      } else {
        nav.style.display = 'flex';
        nav.style.flexDirection = 'column';
        nav.style.position = 'absolute';
        nav.style.right = '20px';
        nav.style.top = '72px';
        nav.style.background = 'white';
        nav.style.padding = '12px';
        nav.style.borderRadius = '10px';
        nav.style.boxShadow = '0 8px 24px rgba(16,24,40,0.12)';
      }
    });
document.addEventListener("DOMContentLoaded", function() {
  // Menu mobile
  const toggleMenu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  toggleMenu?.addEventListener('click', () => {
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
  });

  // Botão modo noturno
  const toggleDark = document.getElementById("toggle-dark");
  toggleDark?.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });
});

//lightbox
document.addEventListener("DOMContentLoaded", function() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.querySelector(".lightbox .close");

  document.querySelectorAll(".gallery img").forEach(img => {
    img.addEventListener("click", () => {
      lightbox.style.display = "flex";
      lightboxImg.url = img.url;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
    });
  });

  closeBtn.addEventListener("click", () => {
    lightbox.style.display = "none";
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.style.display = "none";
    }
  });
});
