/* =========================================================
   SHREYA SRIVASTAVA — PORTFOLIO JAVASCRIPT
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------
     1. FOOTER YEAR
  ------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -------------------------------------------------------
     2. THEME TOGGLE
  ------------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon   = themeToggle?.querySelector('.theme-icon');
  const root        = document.documentElement;

  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  root.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    if (themeIcon) themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
  }

  /* -------------------------------------------------------
     3. MOBILE NAV
  ------------------------------------------------------- */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks   = document.getElementById('navLinks');

  menuToggle?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* -------------------------------------------------------
     4. ACTIVE NAV LINK + SCROLL PROGRESS + BACK TO TOP
  ------------------------------------------------------- */
  const sections     = document.querySelectorAll('section[id]');
  const allNavLinks  = document.querySelectorAll('.nav-link');
  const progressBar  = document.getElementById('scrollProgress');
  const backToTopBtn = document.getElementById('backToTop');

  function onScroll() {
    const scrollY   = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress  = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    if (progressBar) progressBar.style.width = progress + '%';
    if (backToTopBtn) backToTopBtn.classList.toggle('visible', scrollY > 500);

    let currentId = 'home';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (scrollY >= top) currentId = section.id;
    });

    allNavLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* -------------------------------------------------------
     5. SCROLL REVEAL
  ------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* -------------------------------------------------------
     6. HERO PARTICLES
  ------------------------------------------------------- */
  const particleContainer = document.getElementById('particles');
  if (particleContainer) {
    const PARTICLE_COUNT = 32;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top  = Math.random() * 100 + '%';
      p.style.animationDuration = (6 + Math.random() * 8) + 's';
      p.style.animationDelay    = (-Math.random() * 10) + 's';
      p.style.background = Math.random() > 0.5 ? '#c4b5fd' : '#60a5fa';
      p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
      particleContainer.appendChild(p);
    }
  }

  /* -------------------------------------------------------
     7. CERTIFICATE MODAL
  ------------------------------------------------------- */
  const certModal    = document.getElementById('certModal');
  const modalTitle   = document.getElementById('modalTitle');
  const modalMeta    = document.getElementById('modalMeta');
  const modalIndex   = document.getElementById('modalIndex');
  const modalPreview = document.getElementById('modalPreview');
  const certCards    = document.querySelectorAll('.cert-card');

  let lastFocusedEl = null;

  function openModal(card) {
    const title = card.getAttribute('data-title') || '';
    const index = card.getAttribute('data-index') || '01';

    // Handle Title Visibility (Minimal for the 11 additional certs)
    if (modalTitle) {
      if (title.trim() === '') {
        modalTitle.style.display = 'none';
      } else {
        modalTitle.style.display = 'block';
        modalTitle.textContent = title;
      }
    }

    // Handle Meta Visibility
    if (modalMeta) {
      if (title.trim() === '') {
        modalMeta.style.display = 'none';
      } else {
        modalMeta.style.display = 'block';
      }
    }

    if (modalIndex) modalIndex.textContent = index;

    if (modalPreview) {
      modalPreview.innerHTML = `<span>${index}</span>`;
      
      // Try to grab the image directly from the card if it exists and isn't broken
      const cardImg = card.querySelector('.cert-thumb img');
      if (cardImg && cardImg.style.display !== 'none' && cardImg.complete && cardImg.naturalWidth > 0) {
        modalPreview.innerHTML = '';
        const img = new Image();
        img.src = cardImg.src;
        img.alt = title || 'Certificate';
        modalPreview.appendChild(img);
      } else {
        // Fallback: try loading .png, .jpg, .jpeg dynamically based on the data-index
        const extensions = ['png', 'jpg', 'jpeg'];
        const tryLoad = (extIdx) => {
          if (extIdx >= extensions.length) return; // all failed
          const img = new Image();
          img.alt = title || 'Certificate';
          img.onload = () => {
            modalPreview.innerHTML = '';
            modalPreview.appendChild(img);
          };
          img.onerror = () => tryLoad(extIdx + 1);
          
          // Special case for the first certificate name
          if (index === '01') {
             img.src = `assets/certificates/AI Skills House_cert.${extensions[extIdx]}`;
          } else {
             // For the rest, map data-index 02->cert-01, 03->cert-02, etc.
             const fileNum = (parseInt(index) - 1).toString().padStart(2, '0');
             img.src = `assets/certificates/cert-${fileNum}.${extensions[extIdx]}`;
          }
        };
        tryLoad(0);
      }
    }

    lastFocusedEl = document.activeElement;
    certModal.classList.add('open');
    certModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    certModal.querySelector('.modal-close')?.focus();
  }

  function closeModal() {
    certModal.classList.remove('open');
    certModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastFocusedEl?.focus();
  }

  certCards.forEach(card => {
    card.querySelector('.cert-open')?.addEventListener('click', () => openModal(card));
  });

  certModal?.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && certModal?.classList.contains('open')) closeModal();
  });

  /* -------------------------------------------------------
     8. CONTACT FORM VALIDATION
  ------------------------------------------------------- */
  const form     = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(fieldName, message) {
    const field = document.getElementById(fieldName)?.closest('.field');
    const errorEl = document.querySelector(`.error[data-for="${fieldName}"]`);
    if (field) field.classList.toggle('invalid', Boolean(message));
    if (errorEl) errorEl.textContent = message || '';
  }

  form?.addEventListener('submit', e => {
    e.preventDefault();
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();
    let valid = true;

    if (name.length < 2)    { setError('name', 'Please enter your name (at least 2 characters).'); valid = false; }
    else setError('name', '');

    if (!emailRegex.test(email)) { setError('email', 'Please enter a valid email address.'); valid = false; }
    else setError('email', '');

    if (message.length < 10) { setError('message', 'Please write a message of at least 10 characters.'); valid = false; }
    else setError('message', '');

    if (!valid) {
      if (formNote) formNote.textContent = 'Please fix the errors above.';
      return;
    }

    if (formNote) formNote.textContent = '✅ Thank you! Your message is validated — connect a backend or mail service to actually send it.';
    form.reset();
  });

});