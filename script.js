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
