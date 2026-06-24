/* ─────────────────────────────────────────
   Theme toggle
   ───────────────────────────────────────── */
const html       = document.documentElement;
const toggleBtn  = document.getElementById('themeToggle');

function getStoredTheme()  { return localStorage.getItem('buildeva-theme'); }
function getSystemTheme()  { return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('buildeva-theme', theme);
}

// Apply saved or system theme immediately (before paint)
applyTheme(getStoredTheme() || getSystemTheme());

// Toggle on button click
toggleBtn.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

// Follow system preference if user hasn't manually chosen
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!getStoredTheme()) applyTheme(e.matches ? 'dark' : 'light');
});


/* ─────────────────────────────────────────
   Hamburger / mobile menu
   ───────────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const header     = document.getElementById('header');

function openMenu() {
  hamburger.classList.add('is-open');
  mobileMenu.classList.add('is-open');
  header.classList.add('menu-open');
  hamburger.setAttribute('aria-expanded', 'true');
  mobileMenu.setAttribute('aria-hidden', 'false');
}

function closeMenu() {
  hamburger.classList.remove('is-open');
  mobileMenu.classList.remove('is-open');
  header.classList.remove('menu-open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
}

hamburger.addEventListener('click', () => {
  hamburger.classList.contains('is-open') ? closeMenu() : openMenu();
});

// Close when a mobile nav link is tapped
document.querySelectorAll('.mobile-nav-link').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!header.contains(e.target)) closeMenu();
});


/* ─────────────────────────────────────────
   Dynamic Island scroll behavior
   Full-width at top → floating pill on scroll
   ───────────────────────────────────────── */
const FLOAT_THRESHOLD = 60; // px scrolled before morphing
let   lastScrollY     = window.scrollY;
let   ticking         = false;

function updateHeader() {
  const scrolled = window.scrollY > FLOAT_THRESHOLD;
  if (scrolled) {
    header.classList.add('is-floating');
  } else {
    header.classList.remove('is-floating');
    // Also close mobile menu when snapping back to full-width
    closeMenu();
  }
  lastScrollY = window.scrollY;
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(updateHeader);
    ticking = true;
  }
}, { passive: true });

// Set initial state in case page loads mid-scroll
updateHeader();


/* ─────────────────────────────────────────
   Active nav highlight on scroll
   ───────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        navLinks.forEach((link) => {
          const active = link.getAttribute('href') === id;
          link.style.color      = active ? 'var(--accent)' : '';
          link.style.background = active ? 'var(--accent-light)' : '';
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach((s) => sectionObserver.observe(s));


/* ─────────────────────────────────────────
   Current year in footer
   ───────────────────────────────────────── */
const yearEl = document.getElementById('currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ─────────────────────────────────────────
   Solutions accordion (custom toggle)
   ───────────────────────────────────────── */
document.querySelectorAll('.solution-toggle').forEach((btn) => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    const panelId  = btn.getAttribute('aria-controls');
    const panel    = document.getElementById(panelId);
    if (!panel) return;

    if (expanded) {
      btn.setAttribute('aria-expanded', 'false');
      panel.hidden = true;
    } else {
      btn.setAttribute('aria-expanded', 'true');
      panel.hidden = false;
    }
  });
});


/* ─────────────────────────────────────────
   Products filter
   ───────────────────────────────────────── */
const filterBtns = document.querySelectorAll('.products-filter-btn');
const solutionCards = document.querySelectorAll('.solution-card[data-product-category]');

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.productsFilter;

    // Update active button state
    filterBtns.forEach((b) => {
      b.classList.remove('is-active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('is-active');
    btn.setAttribute('aria-pressed', 'true');

    // Show/hide cards
    solutionCards.forEach((card) => {
      const cat = card.dataset.productCategory;
      const show = filter === 'all' || cat === filter;
      card.style.display = show ? '' : 'none';
    });
  });
});


/* ─────────────────────────────────────────
   Hash-based deep link for terms/privacy
   ───────────────────────────────────────── */
function openAccordionByHash() {
  const hash = window.location.hash.replace('#', '');
  if (!hash) return;
  const target = document.querySelector(`details[data-hash="${hash}"]`);
  if (target) {
    target.open = true;
    setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }
}

window.addEventListener('hashchange', openAccordionByHash);
openAccordionByHash();


if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const cards = document.querySelectorAll('.app-card, .support-card, .privacy-item, .product-card');

  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateY(0)';
          cardObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
  );

  cards.forEach((card, i) => {
    card.style.opacity    = '0';
    card.style.transform  = 'translateY(18px)';
    card.style.transition = `opacity 0.4s ease ${i * 0.055}s, transform 0.4s ease ${i * 0.055}s, box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease`;
    cardObserver.observe(card);
  });
}
