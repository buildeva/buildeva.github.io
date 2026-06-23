/* ── Theme toggle ── */
const html = document.documentElement;
const toggleBtn = document.getElementById('themeToggle');

function getStoredTheme() {
  return localStorage.getItem('repski-theme');
}

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('repski-theme', theme);
}

// Init on load
(function () {
  const stored = getStoredTheme();
  applyTheme(stored || getSystemTheme());
})();

// Toggle on click
toggleBtn.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

// Sync if system pref changes and user hasn't manually set one
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!getStoredTheme()) {
    applyTheme(e.matches ? 'dark' : 'light');
  }
});

/* ── Smooth active nav highlight ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.style.color = '';
          link.style.background = '';
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.style.color = 'var(--accent)';
            link.style.background = 'var(--accent-light)';
          }
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach((s) => observer.observe(s));

/* ── Card entrance animation ── */
const cards = document.querySelectorAll('.app-card, .support-card, .privacy-item');

const cardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        cardObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

// Only animate if reduced motion is not preferred
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(16px)';
    card.style.transition = `opacity 0.4s ease ${i * 0.06}s, transform 0.4s ease ${i * 0.06}s, box-shadow 0.2s ease, background 0.2s ease`;
    cardObserver.observe(card);
  });
}

/* ── Solutions collapse ── */
const collapsibleToggles = document.querySelectorAll('.solution-toggle[aria-controls]');

function openPanel(toggle, panel) {
  panel.hidden = false;
  panel.classList.add('is-open');
  panel.style.maxHeight = `${panel.scrollHeight}px`;
  toggle.setAttribute('aria-expanded', 'true');
}

function closePanel(toggle, panel) {
  panel.style.maxHeight = `${panel.scrollHeight}px`;
  requestAnimationFrame(() => {
    panel.classList.remove('is-open');
    panel.style.maxHeight = '0px';
  });
  toggle.setAttribute('aria-expanded', 'false');

  panel.addEventListener('transitionend', function onEnd(e) {
    if (e.propertyName !== 'max-height') return;
    if (toggle.getAttribute('aria-expanded') === 'false') {
      panel.hidden = true;
    }
    panel.removeEventListener('transitionend', onEnd);
  });
}

collapsibleToggles.forEach((toggle) => {
  const panelId = toggle.getAttribute('aria-controls');
  const panel = panelId ? document.getElementById(panelId) : null;
  if (!panel) return;

  if (toggle.getAttribute('aria-expanded') !== 'true') {
    panel.hidden = true;
    panel.style.maxHeight = '0px';
  }

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      closePanel(toggle, panel);
    } else {
      openPanel(toggle, panel);
    }
  });
});

window.addEventListener('resize', () => {
  collapsibleToggles.forEach((toggle) => {
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    const panelId = toggle.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) return;
    panel.style.maxHeight = `${panel.scrollHeight}px`;
  });
});

/* ── Products filter ── */
const productFilterButtons = document.querySelectorAll('[data-products-filter]');
const productCards = document.querySelectorAll('.solution-card[data-product-category]');

function setActiveProductFilter(selectedButton) {
  productFilterButtons.forEach((button) => {
    const isActive = button === selectedButton;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function applyProductFilter(filterKey) {
  productCards.forEach((card) => {
    const category = card.dataset.productCategory;
    const shouldShow = filterKey === 'all' || category === filterKey;
    card.classList.toggle('solution-card--hidden', !shouldShow);
  });
}

if (productFilterButtons.length && productCards.length) {
  productFilterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filterKey = button.dataset.productsFilter || 'all';
      setActiveProductFilter(button);
      applyProductFilter(filterKey);
    });
  });

  const defaultButton = document.querySelector('[data-products-filter="all"]');
  if (defaultButton) {
    setActiveProductFilter(defaultButton);
    applyProductFilter('all');
  }
}

/* ── Legal accordion hash marker ── */
const legalAccordions = document.querySelectorAll('details[data-hash]');

function openAccordionFromHash(hashValue) {
  legalAccordions.forEach((detailsEl) => {
    const marker = detailsEl.dataset.hash;
    if (!marker) return;
    if (marker === hashValue) {
      detailsEl.open = true;
      detailsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

legalAccordions.forEach((detailsEl) => {
  detailsEl.addEventListener('toggle', () => {
    const marker = detailsEl.dataset.hash;
    if (!marker) return;
    if (detailsEl.open) {
      history.replaceState(null, '', `#${marker}`);
    }
  });
});

const initialHash = window.location.hash.replace('#', '');
if (initialHash) {
  openAccordionFromHash(initialHash);
}

window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '');
  if (!hash) return;
  openAccordionFromHash(hash);
});

/* ── Footer year ── */
const yearEl = document.getElementById('currentYear');
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}
