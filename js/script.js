/* ===== RAJAT INSIGHT COACHING - MAIN SCRIPT ===== */

document.addEventListener('DOMContentLoaded', function () {

  /* ===== NAVBAR SCROLL ===== */
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  /* ===== HAMBURGER MENU / MOBILE SIDEBAR ===== */
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  // Build dark overlay - append inside the header so it shares the same
  // stacking context as .nav-menu (header has position:sticky + z-index, which
  // traps child z-index values inside its own stacking context).
  const overlay = document.createElement('div');
  overlay.className = 'mobile-sidebar-overlay';
  const headerEl = document.querySelector('.header');
  (headerEl || document.body).appendChild(overlay);

  // Inject premium sidebar header (logo + coaching name + close button) into nav-menu.
  // This keeps HTML untouched and works on every page automatically.
  if (navMenu && !navMenu.querySelector('.mobile-sidebar-header')) {
    const existingLogo = document.querySelector('.header .logo-img');
    const logoSrc = existingLogo ? existingLogo.getAttribute('src') : 'images/logo.png';

    const sidebarHeader = document.createElement('li');
    sidebarHeader.className = 'mobile-sidebar-header';
    sidebarHeader.setAttribute('aria-hidden', 'false');
    sidebarHeader.style.listStyle = 'none';
    sidebarHeader.innerHTML = `
      <button type="button" class="mobile-sidebar-close" aria-label="Close menu">
        <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      </button>
      <img src="${logoSrc}" alt="Rajat Insight Coaching" class="mobile-sidebar-logo" />
      <div class="mobile-sidebar-name">RAJAT INSIGHT COACHING</div>
      <div class="mobile-sidebar-tagline">Celebrating Excellence</div>
    `;
    navMenu.insertBefore(sidebarHeader, navMenu.firstChild);
  }

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = !navMenu.classList.contains('open');
      hamburger.classList.toggle('active', isOpen);
      navMenu.classList.toggle('open', isOpen);
      overlay.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    overlay.addEventListener('click', closeMenu);
    navMenu.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', closeMenu));
    const closeBtn = navMenu.querySelector('.mobile-sidebar-close');
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  }

  function closeMenu() {
    if (hamburger) hamburger.classList.remove('active');
    if (navMenu) navMenu.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ===== ACTIVE NAV LINK ===== */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || (currentPage === '' && href === 'index.html') || href.endsWith(currentPage))) {
      link.classList.add('active');
    }
  });

  /* ===== SCROLL ANIMATIONS ===== */
  const animEls = document.querySelectorAll('.animate-on-scroll');
  if (animEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    animEls.forEach(el => observer.observe(el));
  }

  /* ===== COUNTER ANIMATION ===== */
  function animateCounter(el, target, duration = 2000) {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = start;
      }
    }, 16);
  }

  const counters = document.querySelectorAll('.counter-num');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          animateCounter(el, target);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(c => counterObserver.observe(c));
  }

  /* ===== BACK TO TOP BUTTON ===== */
  const backTopBtn = document.querySelector('.float-top');
  if (backTopBtn) {
    window.addEventListener('scroll', () => {
      backTopBtn.classList.toggle('show', window.scrollY > 400);
    });
    backTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ===== COURSES FILTER ===== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const courseCards = document.querySelectorAll('.course-card[data-category]');
  if (filterBtns.length && courseCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        courseCards.forEach(card => {
          if (cat === 'all' || card.dataset.category === cat) {
            card.style.display = '';
            card.style.animation = 'fadeInUp 0.4s ease';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ===== FORM HELPERS ===== */
  function showError(field, message) {
    field.classList.add('error');
    const err = field.parentElement.querySelector('.form-error');
    if (err) {
      err.textContent = message;
      err.classList.add('show');
    }
  }

  function clearError(field) {
    field.classList.remove('error');
    const err = field.parentElement.querySelector('.form-error');
    if (err) {
      err.textContent = '';
      err.classList.remove('show');
    }
  }

  function countWords(text) {
    const trimmed = (text || '').trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  }

  /* ===== LIVE INPUT RESTRICTIONS ===== */
  document.querySelectorAll('input[data-validate="name"]').forEach(input => {
    input.addEventListener('input', () => {
      // Strip anything that is not alphabet or space
      const cleaned = input.value.replace(/[^A-Za-z\s]/g, '').slice(0, 30);
      if (cleaned !== input.value) input.value = cleaned;
      clearError(input);
    });
  });

  document.querySelectorAll('input[data-validate="mobile"]').forEach(input => {
    input.addEventListener('input', () => {
      const cleaned = input.value.replace(/\D/g, '').slice(0, 10);
      if (cleaned !== input.value) input.value = cleaned;
      clearError(input);
    });
    input.addEventListener('keypress', (e) => {
      // Block non-digit keypresses
      if (!/[0-9]/.test(e.key) && e.key.length === 1) {
        e.preventDefault();
      }
    });
  });

  /* ===== WORD COUNTER FOR MESSAGE ===== */
  document.querySelectorAll('textarea[data-validate="words200"]').forEach(area => {
    const counter = area.parentElement.querySelector('.char-counter');
    const update = () => {
      const w = countWords(area.value);
      if (counter) {
        counter.textContent = `${w} / 200 words`;
        counter.classList.toggle('warn', w >= 150 && w <= 200);
        counter.classList.toggle('over', w > 200);
      }
      if (w > 200) {
        showError(area, 'Message cannot exceed 200 words.');
      } else {
        clearError(area);
      }
    };
    area.addEventListener('input', update);
    update();
  });

  /* ===== GENERIC INPUT CLEAR ERROR ON FOCUS ===== */
  document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('input', () => {
      if (input.dataset.validate === 'words200') return; // handled separately
      clearError(input);
    });
  });

  /* ===== FORM VALIDATION ===== */
  function validateForm(form) {
    let valid = true;
    const fields = form.querySelectorAll('[required], [data-validate]');
    fields.forEach(field => {
      clearError(field);
      const val = (field.value || '').trim();
      const rule = field.dataset.validate;

      if (field.hasAttribute('required') && !val) {
        showError(field, 'This field is required.');
        valid = false;
        return;
      }

      if (rule === 'name') {
        if (val && !/^[A-Za-z\s]+$/.test(val)) {
          showError(field, 'Only alphabets and spaces are allowed.');
          valid = false;
        } else if (val.length > 30) {
          showError(field, 'Maximum 30 characters allowed.');
          valid = false;
        }
      } else if (rule === 'mobile') {
        if (!/^\d{10}$/.test(val)) {
          showError(field, 'Mobile number must be exactly 10 digits.');
          valid = false;
        }
      } else if (rule === 'words200') {
        if (countWords(val) > 200) {
          showError(field, 'Message cannot exceed 200 words.');
          valid = false;
        }
      } else if (field.type === 'email' && val) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          showError(field, 'Enter a valid email address.');
          valid = false;
        }
      }
    });
    return valid;
  }

  /* ===== FORMSUBMIT AJAX SUBMISSION ===== */
  function handleFormSubmit(form, successElId) {
    return function (e) {
      e.preventDefault();
      if (!validateForm(form)) return;

      const submitBtn = form.querySelector('[type="submit"]');
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      const formData = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
        .then(response => {
          if (response.ok) {
            form.reset();
            // reset counters
            form.querySelectorAll('.char-counter').forEach(c => {
              c.textContent = '0 / 200 words';
              c.classList.remove('warn', 'over');
            });
            form.style.display = 'none';
            const successEl = document.getElementById(successElId);
            if (successEl) {
              successEl.classList.add('show');
              successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          } else {
            response.json().then(data => {
              const msg = (data && data.errors) ? data.errors.map(e => e.message).join(', ') : 'Submission failed. Please try again.';
              alert(msg);
            }).catch(() => alert('Submission failed. Please try again.'));
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
          }
        })
        .catch(() => {
          alert('Network error. Please check your connection and try again.');
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        });
    };
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit(contactForm, 'contactSuccess'));
  }

  const enrollForm = document.getElementById('enrollForm');
  if (enrollForm) {
    enrollForm.addEventListener('submit', handleFormSubmit(enrollForm, 'enrollSuccess'));
  }

  /* ===== SMOOTH SCROLL FOR ANCHOR LINKS ===== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
