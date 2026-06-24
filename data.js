/* ─────────────────────────────────────────
   Site-wide configuration
   ───────────────────────────────────────── */
const SITE_CONFIG = {
  name: 'Buildeva',
  title: 'Buildeva — From Idea to Product',
  description: 'Buildeva is a software house that turns your idea into a live product. We design and build MVPs fast, so you can validate, launch, and grow.',
  email: 'hello@buildeva.com',
};

/* ─────────────────────────────────────────
   Product grid cards data
   Each entry is rendered by renderProductCards() in script.js
   ───────────────────────────────────────── */
const PRODUCT_CARDS = [
  {
    iconColor: 'ios',
    iconPath: '<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/>',
    appIcon: { light: 'imgs/totalnote-light.png', dark: 'imgs/totalnote-dark.png' },
    tags: ['iOS', 'Productivity'],
    title: 'TotalNote',
    description: 'A notes app that calculates totals while you type. Real-time sums, iCloud sync across devices, and a fast clean writing experience — built natively for iOS.',
    weeks: 6,
    appStoreUrl: 'https://apps.apple.com/app/id0000000000',
    comingSoon: true,
  },
  {
    iconColor: 'ios',
    iconPath: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    appIcon: { light: 'imgs/sentences.png', dark: 'imgs/sentences.png' },
    tags: ['iOS', 'Education'],
    title: 'Sentencess',
    description: 'Offline-first bilingual dictionary of Turkish–English sentences written by native speakers — search, bookmark, and build vocabulary in context.',
    appStoreUrl: 'https://apps.apple.com/us/app/sentencess/id1511434058',
  },
  {
    iconColor: 'ios',
    iconPath: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    appIcon: { light: 'imgs/tr-conjugator.png', dark: 'imgs/tr-conjugator.png' },
    tags: ['iOS', 'Education'],
    title: 'Turkish Conjugator',
    description: 'Conjugate Turkish verbs across all tenses — the go-to iOS reference for learners and linguists, with customisable tense labels.',
    appStoreUrl: 'https://apps.apple.com/us/app/turkish-conjugator/id1349382461',
  },
  {
    iconColor: 'module',
    iconPath: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
    tags: ['React Native', 'Mobile'],
    title: 'Step Slider',
    description: 'Animated step slider for React Native — spring snap, tap-to-select, custom shapes, and RTL support.',
    githubUrl: 'https://github.com/ismnoiet/react-native-step-slider',
    npmUrl: 'https://www.npmjs.com/package/react-native-step-slider',
  },
  {
    iconColor: 'module',
    iconPath: '<path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>',
    tags: ['React Native', 'Mobile'],
    title: 'Range Slider',
    description: 'Native iOS range slider for React Native — pick a min/max range or use as a single-handle slider. Styled like UISlider with fully customisable colours and handle size.',
    githubUrl: 'https://github.com/ismnoiet/react-native-range-slider',
  },
  {
    iconColor: 'module',
    iconPath: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
    tags: ['React Native', 'iOS', 'Mobile'],
    title: 'QR Scanner',
    description: 'Native iOS QR code scanner that bursts out of the Dynamic Island — powered by SwiftUI, zero external dependencies, fully configurable via props.',
    githubUrl: 'https://github.com/ismnoiet/react-native-qrcode-scanner',
    npmUrl: 'https://www.npmjs.com/package/@ismnoiet/react-native-qrcode-scanner',
  },
  {
    type: 'next',
    title: '👨‍🍳 We\'re cooking',
    description: 'Something cool is in the oven. We\'ll let you know when it\'s ready.',
  }
];

/* ─────────────────────────────────────────
   Legal accordions data
   Each entry is rendered by renderLegalSections() in script.js
   ───────────────────────────────────────── */
const LEGAL_SECTIONS = [
  {
    hash: 'terms-service',
    title: 'Terms of Service',
    intro: 'By using Buildeva services, you agree to the following basic terms:',
    items: [
      'Project scope, timeline, and deliverables are defined in writing before development starts.',
      'Client provides timely feedback and approvals to keep milestones on track.',
      'All invoices are payable according to agreed payment terms.',
      'Unless otherwise stated, final project code and assets are transferred to the client after full payment.',
      'Either party may end the engagement with written notice, with payment due for completed work.',
      'Buildeva is not liable for indirect damages, lost profits, or third-party service outages.',
    ],
    note: `For a full legal agreement, contact us at <a href="mailto:${SITE_CONFIG.email}">${SITE_CONFIG.email}</a>.`,
  },
  {
    hash: 'privacy-policy',
    title: 'Privacy Policy',
    intro: 'We collect only the information you share when contacting us (for example via email).',
    items: [
      'No account is required to browse this website.',
      'Project materials you share are treated as confidential.',
      'We do not sell personal data to third parties.',
      'You can request data deletion by emailing us.',
    ],
    note: `For full details, contact <a href="mailto:${SITE_CONFIG.email}">${SITE_CONFIG.email}</a>.`,
  },
];
