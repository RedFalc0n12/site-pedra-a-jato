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