/* ─────────────────────────────────────────
   Apply site config from data.js
   Sets title, meta description, and all mailto links
   ───────────────────────────────────────── */
function applySiteConfig() {
  if (typeof SITE_CONFIG === 'undefined') return;

  document.title = SITE_CONFIG.title;

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', SITE_CONFIG.description);

  document.querySelectorAll('a[href^="mailto:"]').forEach((a) => {
    a.href = a.href.replace(/mailto:[^?#]+/, `mailto:${SITE_CONFIG.email}`);
    if (a.textContent.trim().includes('@')) a.textContent = SITE_CONFIG.email;
  });
}

applySiteConfig();


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
  // Swap app icons that have light/dark variants
  document.querySelectorAll('.product-app-icon[data-icon-light]').forEach((img) => {
    img.src = theme === 'dark' ? img.dataset.iconDark : img.dataset.iconLight;
  });
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


/* ─────────────────────────────────────────
   Render product grid from data.js
   ───────────────────────────────────────── */
function renderProductCards() {
  const grid = document.getElementById('productGrid');
  if (!grid || typeof PRODUCT_CARDS === 'undefined') return;

  const iconSvg = (path) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

  grid.innerHTML = PRODUCT_CARDS.map((card) => {
    if (card.type === 'next') {
      return `
        <div class="product-card product-card--next" aria-label="Next product coming soon">
          <div class="product-next-canvas" aria-hidden="true">
            <div class="product-next-dots"></div>
            <div class="product-next-beam"></div>
            <div class="product-next-chip product-next-chip--a">
              <span class="product-next-avatar"></span>
              <div class="product-next-lines">
                <span class="product-next-bar" style="width:78%"></span>
                <span class="product-next-bar" style="width:54%"></span>
                <span class="product-next-bar" style="width:66%"></span>
              </div>
            </div>
            <div class="product-next-chip product-next-chip--b">
              <span class="product-next-avatar"></span>
              <div class="product-next-lines">
                <span class="product-next-bar" style="width:82%"></span>
                <span class="product-next-bar" style="width:48%"></span>
                <span class="product-next-dot-row">
                  <span></span><span></span><span></span>
                  <span class="product-next-bar" style="width:38%; display:inline-block"></span>
                  <span class="product-next-bar" style="width:28%; display:inline-block"></span>
                </span>
                <span class="product-next-bar" style="width:60%"></span>
                <span class="product-next-bar" style="width:72%"></span>
                <span class="product-next-bar" style="width:30%; opacity:0.5"></span>
              </div>
            </div>
            <div class="product-next-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="5" r="1.5"/><circle cx="12" cy="5" r="1.5"/><circle cx="19" cy="5" r="1.5"/><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="19" r="1.5"/><circle cx="12" cy="19" r="1.5"/><circle cx="19" cy="19" r="1.5"/></svg>
            </div>
          </div>
          <div class="product-cta-body">
            <h3 class="product-card-title">${card.title}</h3>
            <p class="product-card-desc">${card.description}</p>
          </div>
        </div>`;
    }

    if (card.type === 'cta') {
      return `
        <div class="product-card product-card--cta">
          <div class="product-cta-gradient" aria-hidden="true">
            <div class="product-cta-dots"></div>
            <div class="product-cta-chip product-cta-chip--1">
              <span class="product-cta-chip-bar" style="width:72%"></span>
              <span class="product-cta-chip-bar" style="width:52%"></span>
              <span class="product-cta-chip-bar" style="width:62%"></span>
            </div>
            <div class="product-cta-chip product-cta-chip--2">
              <span class="product-cta-chip-avatar"></span>
              <div class="product-cta-chip-lines">
                <span class="product-cta-chip-bar" style="width:80%"></span>
                <span class="product-cta-chip-bar" style="width:55%"></span>
              </div>
            </div>
            <div class="product-cta-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="5" r="1.5"/><circle cx="12" cy="5" r="1.5"/><circle cx="19" cy="5" r="1.5"/><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="19" r="1.5"/><circle cx="12" cy="19" r="1.5"/><circle cx="19" cy="19" r="1.5"/></svg>
            </div>
          </div>
          <div class="product-cta-body">
            <h3 class="product-card-title">${card.title}</h3>
            <p class="product-card-desc">${card.description}</p>
            <a href="mailto:${SITE_CONFIG.email}" class="btn btn-primary" style="align-self:flex-start; font-size:14px; padding:10px 18px;">Start a project →</a>
          </div>
        </div>`;
    }

    const pills = card.tags.map((t) => `<span class="product-pill">${t}</span>`).join('');
    const iconEl = card.appIcon
      ? `<img
          src="${card.appIcon.light}"
          data-icon-light="${card.appIcon.light}"
          data-icon-dark="${card.appIcon.dark}"
          alt="${card.title} icon"
          class="product-app-icon"
        />`
      : `<div class="product-icon product-icon--${card.iconColor}">${iconSvg(card.iconPath)}</div>`;
    const footer = card.appStoreUrl
      ? card.comingSoon
        ? `<div class="product-card-footer">
            <span class="product-coming-soon">Coming Soon</span>
          </div>`
        : `<a href="${card.appStoreUrl}" class="solution-appstore-link" target="_blank" rel="noopener" aria-label="${card.title} on the App Store">
          <img src="imgs/download-on-the-app-store.svg" alt="Download on the App Store" class="solution-appstore-badge" />
        </a>`
      : card.githubUrl
      ? `<div class="product-card-footer">
          ${card.npmUrl ? `<a href="${card.npmUrl}" class="product-card-link" target="_blank" rel="noopener">npm <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M7 7h10v10"/></svg></a>` : ''}
          <a href="${card.githubUrl}" class="product-card-link" target="_blank" rel="noopener">GitHub <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M7 7h10v10"/></svg></a>
        </div>`
      : `<div class="product-card-footer">
          <span class="product-card-time">⏱ ${card.weeks} weeks</span>
          <a href="mailto:${SITE_CONFIG.email}?subject=Tell me more about ${card.title}" class="product-card-link">Read more <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M7 7h10v10"/></svg></a>
        </div>`;
    return `
      <div class="product-card">
        <div class="product-card-header">
          ${iconEl}
          <div class="product-tags">${pills}</div>
        </div>
        <h3 class="product-card-title">${card.title}</h3>
        <p class="product-card-desc">${card.description}</p>
        ${footer}
      </div>`;
  }).join('');
}

renderProductCards();


/* ─────────────────────────────────────────
   Render legal accordions from data.js
   ───────────────────────────────────────── */
function renderLegalSections() {
  const stack = document.getElementById('legalStack');
  if (!stack || typeof LEGAL_SECTIONS === 'undefined') return;

  const chevron = `<span class="terms-chevron" aria-hidden="true">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
  </span>`;

  stack.innerHTML = LEGAL_SECTIONS.map((section) => {
    const items = section.items.map((item) => `<li>${item}</li>`).join('');
    const bodyId = section.hash === 'privacy-policy' ? ` id="privacy-policy"` : '';
    return `
      <details class="terms-accordion" data-hash="${section.hash}">
        <summary class="terms-summary">
          ${section.title}
          ${chevron}
        </summary>
        <div class="terms-body"${bodyId}>
          <p>${section.intro}</p>
          <ul>${items}</ul>
          <p class="terms-note">${section.note}</p>
        </div>
      </details>`;
  }).join('');
}

renderLegalSections();


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
