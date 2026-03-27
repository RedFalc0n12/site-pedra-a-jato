/* ===== menu / modo noturno (execução imediata e no DOMContentLoaded) =====
   - Há duas abordagens: um pequeno toggle inline (seguido de um listener
     que garante execução somente após o DOM estar pronto). Ambas verificam
     a existência dos elementos com o operador optional chaining (?.).
*/

// Toggle rápido (caso o botão exista no DOM em execução imediata)
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
toggle?.addEventListener('click', () => {
  // Alterna o display do nav para a versão mobile criada via estilos inline
  if (nav.style.display === 'flex') {
    nav.style.display = 'none'; // fecha
  } else {
    // abre com estilo column e posição flutuante (apenas para mobile)
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

// Garantir manipulações seguras após DOM pronto (menu e modo escuro)
document.addEventListener("DOMContentLoaded", function() {
  // Menu mobile (segunda verificação — segura se o script executar no head)
  const toggleMenu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  toggleMenu?.addEventListener('click', () => {
    // Alterna visibilidade por simplicidade
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
  });

  // Botão modo noturno: alterna a classe `dark-mode` no <body>
  const toggleDark = document.getElementById("toggle-dark");
  toggleDark?.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });
});

/* ===== lightbox (imagens + vídeos) =====
   Comportamento:
   - `galleryItems` contém imagens e vídeos na ordem visual da galeria.
   - `openLightbox(item, index)` centraliza o comportamento de abrir o modal
     para ambos os tipos. Se for vídeo, carrega e inicia a reprodução.
   - `closeLightbox()` pausa e limpa a fonte do vídeo para liberar recursos.
   - botões prev/next navegam ciclicamente pelos itens da galeria.
*/
document.addEventListener("DOMContentLoaded", function() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxVideo = document.getElementById("lightbox-video");
  const closeBtn = document.querySelector(".lightbox .close");
  const prevBtn = document.querySelector(".lightbox .prev");
  const nextBtn = document.querySelector(".lightbox .next");

  // Reúne imagens e vídeos (se houver) em uma única lista para navegação
  const galleryItems = Array.from(document.querySelectorAll(".gallery img, .gallery video"));
  let currentIndex = 0; // índice do item atualmente exibido no lightbox

  // Fecha o lightbox e garante que o vídeo pare e seja limpo
  function closeLightbox() {
    lightbox.style.display = "none";
    lightboxVideo.pause();
    lightboxVideo.removeAttribute("src");
    lightboxVideo.load();
  }

  // Abre o lightbox para um item (imagem ou vídeo)
  function openLightbox(item, index) {
    currentIndex = index;
    lightbox.style.display = "flex";

    // Pausa qualquer vídeo que esteja tocando na galeria para evitar overlap
    galleryItems.forEach(it => {
      if (it.tagName && it.tagName.toLowerCase() === 'video') {
        try { it.pause(); } catch (err) {}
      }
    });

    if (item.tagName.toLowerCase() === "img") {
      // Exibe imagem
      lightboxImg.style.display = "block";
      lightboxVideo.style.display = "none";
      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt || "Foto do portfólio";

      // Limpa qualquer vídeo que estivesse em execução
      lightboxVideo.pause();
      lightboxVideo.removeAttribute("src");
      lightboxVideo.load();
    } else {
      // Exibe vídeo: busca <source> se existir, senão usa src direto
      lightboxImg.style.display = "none";
      lightboxVideo.style.display = "block";

      const source = item.querySelector("source");
      const videoSrc = source ? source.src : item.currentSrc || item.src;

      lightboxVideo.src = videoSrc;
      lightboxVideo.load();
      lightboxVideo.play();
    }
  }

  // Associa clique de abertura em cada item da galeria
  // - Para imagens: abre diretamente no lightbox
  // - Para vídeos: intercepta o clique para evitar reprodução inline,
  //   pausa o elemento na galeria e abre o vídeo no lightbox
  galleryItems.forEach((item, index) => {
    // vídeos na galeria agora podem estar dentro de um wrapper .video-thumb
    // o botão .video-overlay captura o clique do usuário e chama openLightbox
    if (item.tagName && item.tagName.toLowerCase() === 'video') {
      // evita dependência de click nos controles nativos: adicionamos
      // também um listener por segurança (mas preferimos o overlay)
      item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        try { item.pause(); } catch (err) {}
        item.currentTime = 0;
        openLightbox(item, index);
      });
    } else {
      item.addEventListener("click", () => openLightbox(item, index));
    }
  });

  // Se houver overlays (botões sobre as miniaturas de vídeo), associe a abertura
  document.querySelectorAll('.video-overlay').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const wrapper = btn.closest('.video-thumb');
      if (!wrapper) return;
      const vid = wrapper.querySelector('video');
      if (!vid) return;
      const index = galleryItems.indexOf(vid);
      if (index === -1) return;
      // garante que o vídeo da miniatura não comece a tocar
      try { vid.pause(); } catch (err) {}
      vid.currentTime = 0;
      openLightbox(vid, index);
    });
  });

  // Fechar via botão ou clicando no fundo do lightbox
  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });

  // Função auxiliar para (re)exibir o item corrente segundo `currentIndex`
  function showCurrent() {
    const item = galleryItems[currentIndex];
    openLightbox(item, currentIndex);
  }

  // Navegação anterior/próxima com wrap-around
  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    showCurrent();
  });

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    showCurrent();
  });
});

/* ===== alternador antes/depois =====
   - Elementos com `.toggle-img` devem ter `data-alt` contendo o src alternativo.
   - Ao clicar trocamos `src` e `data-alt`, mantendo o alternativo para revesar.
*/
document.querySelectorAll(".toggle-img").forEach(img => {
  img.addEventListener("click", () => {
    const atual = img.src;
    const alternativo = img.dataset.alt;
    if (!alternativo) return; // segurança: só troca se existir alternativa
    img.src = alternativo;
    img.dataset.alt = atual; // guarda o caminho anterior para permitir revesamento
  });
});

// Autoplay em miniaturas de vídeo: hover (desktop) + play quando entra na viewport (mobile/scroll)
document.addEventListener('DOMContentLoaded', () => {
  const videoThumbs = Array.from(document.querySelectorAll('.video-thumb video'));

  videoThumbs.forEach(v => {
    // garantia para mobile/iOS e autoplay sem gesto
    v.muted = true;
    v.setAttribute('playsinline', '');
    v.preload = v.preload || 'metadata';

    // hover (desktop)
    v.addEventListener('mouseenter', () => {
      try { v.play(); } catch (e) {}
    });
    v.addEventListener('mouseleave', () => {
      try { v.pause(); v.currentTime = 0; } catch (e) {}
    });
  });

  // play/pause quando entra/saí da viewport
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const vid = entry.target;
        if (entry.intersectionRatio >= 0.5) {
          try { vid.play(); } catch (e) {}
        } else {
          try { vid.pause(); vid.currentTime = 0; } catch (e) {}
        }
      });
    }, { threshold: [0.5] });

    videoThumbs.forEach(v => io.observe(v));
  }
});

// FAQ toggle: expande/recolhe respostas ao clicar no botão '+'.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.faq-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const controls = btn.getAttribute('aria-controls');
      const answer = controls ? document.getElementById(controls) : btn.closest('dt')?.nextElementSibling;
      if (!answer) return;
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        btn.setAttribute('aria-expanded', 'false');
        answer.hidden = true;
        btn.textContent = '+';
      } else {
        btn.setAttribute('aria-expanded', 'true');
        answer.hidden = false;
        btn.textContent = '−';
      }
    });
  });
});
