/* ═══════════════════════════════════════════════════════════
   spotify.js – Grammar Learning App (Spotify-like)
═══════════════════════════════════════════════════════════ */

'use strict';

/* ── Data ───────────────────────────────────────────────── */
const CATEGORIES = [
  { id: 'tenses',      name: 'Verb Tenses',         icon: '⏰', color: '#1e3a5f' },
  { id: 'modals',      name: 'Modal Verbs',          icon: '🎯', color: '#3b1a52' },
  { id: 'conditionals',name: 'Conditionals',         icon: '🔀', color: '#4a1c1c' },
  { id: 'passive',     name: 'Passive Voice',        icon: '🔄', color: '#1a3b2b' },
  { id: 'reported',    name: 'Reported Speech',      icon: '💬', color: '#2d2a00' },
  { id: 'relative',    name: 'Relative Clauses',     icon: '🔗', color: '#2a1a00' },
  { id: 'questions',   name: 'Questions',            icon: '❓', color: '#0d2b3b' },
  { id: 'prepositions',name: 'Prepositions',         icon: '📍', color: '#1a1a3b' },
  { id: 'articles',    name: 'Articles & Nouns',     icon: '📝', color: '#2b0d1a' },
  { id: 'adjectives',  name: 'Adj & Adverbs',        icon: '✨', color: '#0d2a2a' },
  { id: 'linkers',     name: 'Linking Words',        icon: '🧩', color: '#1a2b0d' },
  { id: 'advanced',    name: 'Advanced Grammar',     icon: '🎓', color: '#2b1a0d' },
];

const PLAYLISTS = [
  {
    id: 'present-tenses',
    name: 'Present Tenses',
    desc: 'Present Simple, Continuous & Perfect',
    icon: '🟢',
    color: '#0f4c29',
    category: 'tenses',
    tracks: [
      { id: 'present-simple',            name: 'Present Simple',            meta: 'Basic tense · 8 min',     file: 'grammar/present-simple.html' },
      { id: 'present-continuous',        name: 'Present Continuous',        meta: 'Actions now · 8 min',     file: 'grammar/present-continuous.html' },
      { id: 'state-verbs',               name: 'State Verbs',               meta: 'No -ing verbs · 5 min',   file: 'grammar/state-verbs.html' },
      { id: 'present-perfect',           name: 'Present Perfect',           meta: 'Have + past p. · 10 min', file: 'grammar/present-perfect.html' },
      { id: 'present-perfect-vs-past',   name: 'Perfect vs Past Simple',    meta: 'Comparison · 8 min',      file: 'grammar/present-perfect-vs-past-simple.html' },
      { id: 'present-continuous-future', name: 'Present Continuous Future', meta: 'Plans · 6 min',           file: 'grammar/present-continuous-future.html' },
    ],
  },
  {
    id: 'past-tenses',
    name: 'Past Tenses',
    desc: 'Past Simple, Continuous & Perfect',
    icon: '🔵',
    color: '#0d2b4a',
    category: 'tenses',
    tracks: [
      { id: 'past-simple',               name: 'Past Simple',               meta: 'Regular & irregular · 10 min', file: 'grammar/past-simple.html' },
      { id: 'past-continuous',           name: 'Past Continuous',           meta: 'Was/were + -ing · 7 min',      file: 'grammar/past-continuous.html' },
      { id: 'past-simple-vs-continuous', name: 'Past Simple vs Continuous', meta: 'Comparison · 8 min',           file: 'grammar/past-simple-vs-continuous.html' },
      { id: 'past-perfect',              name: 'Past Perfect',              meta: 'Had + past p. · 8 min',        file: 'grammar/past-perfect.html' },
      { id: 'past-perfect-vs-past',      name: 'Perfect vs Simple',         meta: 'Comparison · 7 min',           file: 'grammar/past-perfect-vs-past-simple.html' },
    ],
  },
  {
    id: 'future-tenses',
    name: 'Future Tenses',
    desc: 'Will, Going To, Future Continuous',
    icon: '🟡',
    color: '#4a3a00',
    category: 'tenses',
    tracks: [
      { id: 'future-will',              name: 'Future Will',              meta: 'Predictions · 6 min',       file: 'grammar/future-will.html' },
      { id: 'going-to',                 name: 'Going To',                 meta: 'Plans & intentions · 6 min',file: 'grammar/going-to.html' },
      { id: 'future-facts',             name: 'Future Facts',             meta: 'Timetables · 5 min',        file: 'grammar/future-facts.html' },
      { id: 'future-continuous-perfect',name: 'Future Cont. & Perfect',  meta: 'Will be + -ing · 8 min',    file: 'grammar/future-continuous-perfect.html' },
    ],
  },
  {
    id: 'modal-verbs',
    name: 'Modal Verbs Mix',
    desc: 'Can, Could, May, Must, Should & more',
    icon: '🟣',
    color: '#3b0a5f',
    category: 'modals',
    tracks: [
      { id: 'can-could',         name: 'Can & Could',         meta: 'Ability & permission · 8 min', file: 'grammar/can-could.html' },
      { id: 'may-might',         name: 'May & Might',         meta: 'Possibility · 7 min',          file: 'grammar/may-might.html' },
      { id: 'must-have-to',      name: 'Must & Have To',      meta: 'Obligation · 8 min',           file: 'grammar/must-have-to.html' },
      { id: 'mustnt-donthaveto', name: "Mustn't & Don't Have To", meta: 'Prohibition · 6 min',     file: 'grammar/mustnt-donthaveto.html' },
      { id: 'should-ought',      name: 'Should & Ought To',   meta: 'Advice · 7 min',               file: 'grammar/should-ought.html' },
      { id: 'shall',             name: 'Shall',               meta: 'Offers & suggestions · 5 min', file: 'grammar/shall.html' },
      { id: 'be-able-allowed',   name: 'Be Able / Allowed',   meta: 'Alternatives · 6 min',         file: 'grammar/be-able-allowed.html' },
      { id: 'modals-speculation',name: 'Modals – Speculation',meta: 'Must be / Can\'t be · 8 min',  file: 'grammar/modals-speculation.html' },
    ],
  },
  {
    id: 'conditionals',
    name: 'Conditionals',
    desc: 'Zero to Mixed Conditionals',
    icon: '🔀',
    color: '#4a1c1c',
    category: 'conditionals',
    tracks: [
      { id: 'zero-conditional',  name: 'Zero Conditional',   meta: 'Facts · 5 min',              file: 'grammar/zero-conditional.html' },
      { id: 'first-conditional', name: 'First Conditional',  meta: 'Real future · 6 min',        file: 'grammar/first-conditional.html' },
      { id: 'second-conditional',name: 'Second Conditional', meta: 'Unreal present · 7 min',     file: 'grammar/second-conditional.html' },
      { id: 'third-conditional', name: 'Third Conditional',  meta: 'Unreal past · 8 min',        file: 'grammar/third-conditional.html' },
      { id: 'mixed-conditionals',name: 'Mixed Conditionals', meta: 'Combined · 8 min',           file: 'grammar/mixed-conditionals.html' },
      { id: 'if-when-unless',    name: 'If / When / Unless', meta: 'Connectors · 6 min',         file: 'grammar/if-when-unless.html' },
    ],
  },
  {
    id: 'passive-voice',
    name: 'Passive Voice',
    desc: 'Basic to Advanced Passive Structures',
    icon: '🔄',
    color: '#1a3b2b',
    category: 'passive',
    tracks: [
      { id: 'passive-basic',      name: 'Passive – Basic',         meta: 'Be + past p. · 8 min',     file: 'grammar/passive-basic.html' },
      { id: 'by-agent',           name: 'By-Agent',                meta: 'Who did it · 5 min',        file: 'grammar/by-agent.html' },
      { id: 'passive-two-objects',name: 'Two-Object Passives',     meta: 'Give/send · 7 min',         file: 'grammar/passive-two-objects.html' },
      { id: 'passive-infinitive', name: 'Passive Infinitive',      meta: 'To be + past p. · 6 min',   file: 'grammar/passive-infinitive.html' },
      { id: 'impersonal-passives',name: 'Impersonal Passives',     meta: 'It is said… · 7 min',       file: 'grammar/impersonal-passives.html' },
      { id: 'active-vs-passive',  name: 'Active vs Passive',       meta: 'Comparison · 8 min',        file: 'grammar/active-vs-passive.html' },
    ],
  },
  {
    id: 'reported-speech',
    name: 'Reported Speech',
    desc: 'Statements, Questions & Commands',
    icon: '💬',
    color: '#2d2a00',
    category: 'reported',
    tracks: [
      { id: 'reported-statements',name: 'Reported Statements', meta: 'She said… · 8 min',   file: 'grammar/reported-statements.html' },
      { id: 'reported-questions', name: 'Reported Questions',  meta: 'She asked… · 8 min',  file: 'grammar/reported-questions.html' },
      { id: 'reported-commands',  name: 'Reported Commands',   meta: 'She told… · 6 min',   file: 'grammar/reported-commands.html' },
    ],
  },
  {
    id: 'relative-clauses',
    name: 'Relative Clauses',
    desc: 'Defining, Non-defining & Omitting',
    icon: '🔗',
    color: '#2a1a00',
    category: 'relative',
    tracks: [
      { id: 'defining-relative',    name: 'Defining Relative',     meta: 'Who/which/that · 7 min',  file: 'grammar/defining-relative.html' },
      { id: 'non-defining-relative',name: 'Non-defining Relative', meta: 'Commas · 7 min',           file: 'grammar/non-defining-relative.html' },
      { id: 'omitting-relative',    name: 'Omitting Relative',     meta: 'Contact clauses · 5 min', file: 'grammar/omitting-relative.html' },
    ],
  },
  {
    id: 'questions',
    name: 'Questions Deep Dive',
    desc: 'Yes/No, Wh-, Indirect, Tags',
    icon: '❓',
    color: '#0d2b3b',
    category: 'questions',
    tracks: [
      { id: 'yes-no-questions',   name: 'Yes/No Questions',    meta: 'Do/Does/Did · 6 min',   file: 'grammar/yes-no-questions.html' },
      { id: 'wh-questions',       name: 'Wh- Questions',       meta: 'What/Who/Where · 7 min', file: 'grammar/wh-questions.html' },
      { id: 'indirect-questions', name: 'Indirect Questions',  meta: 'Could you tell me… · 7 min', file: 'grammar/indirect-questions.html' },
      { id: 'question-tags',      name: 'Question Tags',       meta: 'Isn\'t it? · 7 min',    file: 'grammar/question-tags.html' },
    ],
  },
  {
    id: 'prepositions',
    name: 'Prepositions Pack',
    desc: 'Time, Place, After Verbs & More',
    icon: '📍',
    color: '#1a1a3b',
    category: 'prepositions',
    tracks: [
      { id: 'prepositions-time',  name: 'Prepositions of Time',   meta: 'At/In/On · 6 min',   file: 'grammar/prepositions-time.html' },
      { id: 'prepositions-place', name: 'Prepositions of Place',  meta: 'In/On/Under · 6 min', file: 'grammar/prepositions-place.html' },
      { id: 'prepositions-after', name: 'Preps After Verbs/Adj',  meta: 'Depend on · 7 min',   file: 'grammar/prepositions-after.html' },
      { id: 'prepositions-common',name: 'Common Prepositions',    meta: 'By/With/For · 7 min', file: 'grammar/prepositions-common.html' },
      { id: 'dependent-prepositions', name: 'Dependent Prepositions', meta: 'Collocations · 8 min', file: 'grammar/dependent-prepositions.html' },
    ],
  },
  {
    id: 'articles-nouns',
    name: 'Articles & Nouns',
    desc: 'A/An/The, Countable, Quantifiers',
    icon: '📝',
    color: '#2b0d1a',
    category: 'articles',
    tracks: [
      { id: 'articles',             name: 'Articles A/An/The',     meta: 'Determiners · 10 min', file: 'grammar/articles.html' },
      { id: 'countable-uncountable',name: 'Countable & Uncountable',meta: 'Some/Any · 8 min',    file: 'grammar/countable-uncountable.html' },
      { id: 'quantifiers',          name: 'Quantifiers',            meta: 'Much/Many/A lot · 8 min', file: 'grammar/quantifiers.html' },
      { id: 'quantifiers-advanced', name: 'Advanced Quantifiers',   meta: 'Each/Every/All · 8 min',  file: 'grammar/quantifiers-advanced.html' },
      { id: 'demonstratives',       name: 'Demonstratives',         meta: 'This/That/These · 5 min', file: 'grammar/demonstratives.html' },
      { id: 'possessives',          name: 'Possessives',            meta: 'My/Mine/\'s · 6 min',    file: 'grammar/possessives.html' },
      { id: 'pronouns',             name: 'Pronouns',               meta: 'I/Me/Mine · 7 min',       file: 'grammar/pronouns.html' },
    ],
  },
  {
    id: 'adj-adverbs',
    name: 'Adj & Adverb Essentials',
    desc: 'Comparatives, Position, Frequency',
    icon: '✨',
    color: '#0d2a2a',
    category: 'adjectives',
    tracks: [
      { id: 'adjective-vs-adverb',    name: 'Adj vs Adverb',         meta: 'Good vs Well · 6 min',   file: 'grammar/adjective-vs-adverb.html' },
      { id: 'comparative-adverbs',    name: 'Comparative Adverbs',   meta: 'Faster / More quickly · 7 min', file: 'grammar/comparative-adverbs.html' },
      { id: 'adverbs-of-frequency',   name: 'Adverbs of Frequency',  meta: 'Always/Often · 6 min',   file: 'grammar/adverbs-of-frequency.html' },
      { id: 'adverbs-position',       name: 'Adverbs Position',      meta: 'Where to place · 7 min', file: 'grammar/adverbs-position.html' },
    ],
  },
  {
    id: 'linking-words',
    name: 'Linkers & Connectors',
    desc: 'Because, Although, In spite of…',
    icon: '🧩',
    color: '#1a2b0d',
    category: 'linkers',
    tracks: [
      { id: 'basic-linkers',       name: 'Basic Linkers',           meta: 'And/But/So · 5 min',        file: 'grammar/basic-linkers.html' },
      { id: 'contrast-reason',     name: 'Contrast & Reason',       meta: 'Although/Because · 7 min',  file: 'grammar/contrast-reason.html' },
      { id: 'in-spite-of',         name: 'In Spite Of / Despite',   meta: 'Concession · 6 min',        file: 'grammar/in-spite-of.html' },
      { id: 'on-the-other-hand',   name: 'On the Other Hand',       meta: 'Contrast · 5 min',          file: 'grammar/on-the-other-hand.html' },
      { id: 'sequencing-addition', name: 'Sequencing & Addition',   meta: 'Firstly/Moreover · 7 min', file: 'grammar/sequencing-addition.html' },
      { id: 'infinitive-purpose',  name: 'Infinitive of Purpose',   meta: 'In order to · 5 min',       file: 'grammar/infinitive-purpose.html' },
    ],
  },
  {
    id: 'advanced-grammar',
    name: 'Advanced Grammar',
    desc: 'Infinitives, Gerunds, Mixed Forms',
    icon: '🎓',
    color: '#2b1a0d',
    category: 'advanced',
    tracks: [
      { id: 'to-infinitive',  name: 'To-Infinitive',          meta: 'Verb + to · 8 min',          file: 'grammar/to-infinitive.html' },
      { id: 'verb-ing',       name: 'Verb + -ing',            meta: 'Gerund · 8 min',              file: 'grammar/verb-ing.html' },
      { id: 'verbs-both',     name: 'Verbs with Both Forms',  meta: 'Stop/Try/Remember · 8 min',   file: 'grammar/verbs-both-forms.html' },
      { id: 'for-since',      name: 'For / Since / Already',  meta: 'Time expressions · 7 min',    file: 'grammar/for-since-already-yet.html' },
    ],
  },
];

/* Flat list of all tracks for search */
const ALL_TRACKS = PLAYLISTS.flatMap(p =>
  p.tracks.map(t => ({ ...t, playlistName: p.name, playlistIcon: p.icon, playlistColor: p.color }))
);

/* ── State ──────────────────────────────────────────────── */
let currentPlaylist = null;
let currentTrackId  = null;
let miniPlayerTimer = null;
let miniProgress    = 0;

/* ── DOM helpers ────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; };

/* ── SVG icons ──────────────────────────────────────────── */
const ICONS = {
  play:    '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
  home:    '<svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>',
  search:  '<svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>',
  library: '<svg viewBox="0 0 24 24"><path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 5h-3v5.5c0 1.38-1.12 2.5-2.5 2.5S10 13.88 10 12.5s1.12-2.5 2.5-2.5c.57 0 1.08.19 1.5.5V5h4v2zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"/></svg>',
  more:    '<svg viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>',
  shuffle: '<svg viewBox="0 0 24 24"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/></svg>',
  heart:   '<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
  back:    '<svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>',
  chevron: '<svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>',
  plus:    '<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>',
  pause:   '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>',
};

/* ── Greeting ───────────────────────────────────────────── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning 👋';
  if (h < 18) return 'Good afternoon 👋';
  return 'Good evening 👋';
}

/* ── Tab navigation ─────────────────────────────────────── */
function showTab(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  $('screen-' + id).classList.add('active');
  document.querySelector('[data-tab="' + id + '"]').classList.add('active');
}

/* ── Build HOME screen ──────────────────────────────────── */
function buildHome() {
  const screen = $('screen-home');
  screen.innerHTML = '';

  /* Header */
  const header = el('div', 'home-header');
  header.innerHTML = `
    <div class="header-row">
      <div class="greeting">${getGreeting()}</div>
      <div class="header-actions">
        <button class="header-icon-btn" aria-label="Notifications">${ICONS.heart}</button>
        <button class="header-icon-btn" aria-label="History">${ICONS.more}</button>
      </div>
    </div>`;
  screen.appendChild(header);

  /* Scroll-based header bg change */
  screen.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', screen.scrollTop > 40);
  });

  /* Quick picks grid (6 most popular) */
  const qpSection = el('div');
  qpSection.innerHTML = '<div class="section-header"><span class="section-title">Quick picks</span></div>';
  const grid = el('div', 'quick-picks-grid');
  const quickItems = [
    PLAYLISTS[0], PLAYLISTS[1], PLAYLISTS[3], PLAYLISTS[4], PLAYLISTS[5], PLAYLISTS[8]
  ];
  quickItems.forEach(p => {
    const item = el('div', 'quick-pick-item');
    item.innerHTML = `
      <div class="quick-pick-thumb" style="background:${p.color}">${p.icon}</div>
      <span class="quick-pick-name">${p.name}</span>
      <div class="quick-pick-play">${ICONS.play}</div>`;
    item.addEventListener('click', () => openPlaylist(p));
    grid.appendChild(item);
  });
  qpSection.appendChild(grid);
  screen.appendChild(qpSection);

  /* Featured banner */
  const banner = el('div');
  banner.innerHTML = `
    <div class="featured-banner" id="featured-banner">
      <div class="featured-banner-bg">🎓</div>
      <div class="featured-banner-gradient"></div>
      <div class="featured-banner-content">
        <div class="featured-banner-label">Featured lesson</div>
        <div class="featured-banner-title">Master English<br>Grammar</div>
        <div class="featured-banner-desc">70+ lessons across all levels</div>
      </div>
    </div>`;
  screen.appendChild(banner);
  screen.querySelector('#featured-banner').addEventListener('click', () => openPlaylist(PLAYLISTS[0]));

  /* Recently played */
  appendHScrollSection(screen, 'Recently played', PLAYLISTS.slice(0, 6));

  /* Based on your taste */
  appendHScrollSection(screen, 'Conditionals & Modals', PLAYLISTS.slice(3, 8));

  /* More for you */
  appendHScrollSection(screen, 'Expand your knowledge', PLAYLISTS.slice(8));
}

function appendHScrollSection(parent, title, playlists) {
  const section = el('div');
  const seeAllBtn = el('button', 'section-link', 'See all');
  seeAllBtn.addEventListener('click', () => showTab('search'));
  const sectionHeader = el('div', 'section-header');
  sectionHeader.innerHTML = `<span class="section-title">${title}</span>`;
  sectionHeader.appendChild(seeAllBtn);
  section.appendChild(sectionHeader);
  const row = el('div', 'h-scroll');
  playlists.forEach(p => {
    const card = el('div', 'card');
    card.innerHTML = `
      <div class="card-art" style="background:${p.color}">
        <span>${p.icon}</span>
        <div class="card-play">${ICONS.play}</div>
      </div>
      <div class="card-title">${p.name}</div>
      <div class="card-subtitle">${p.desc}</div>`;
    card.addEventListener('click', () => openPlaylist(p));
    row.appendChild(card);
  });
  section.appendChild(row);
  parent.appendChild(section);
}

/* ── Build SEARCH screen ────────────────────────────────── */
function buildSearch() {
  const screen = $('screen-search');
  screen.innerHTML = '';

  const header = el('div', 'search-header');
  header.innerHTML = `
    <div class="search-title">Search</div>
    <div class="search-input-wrap">
      ${ICONS.search}
      <input type="text" id="search-input" placeholder="What do you want to study?" autocomplete="off" />
    </div>`;
  screen.appendChild(header);

  /* Results container (hidden until typing) */
  const results = el('div', 'search-results');
  results.id = 'search-results';
  screen.appendChild(results);

  /* Genres grid */
  const browseSect = el('div');
  browseSect.innerHTML = '<div class="section-header" style="padding-top:16px"><span class="section-title">Browse all</span></div>';
  const grid = el('div', 'genres-grid');
  CATEGORIES.forEach(cat => {
    const card = el('div', 'genre-card');
    card.style.background = cat.color;
    card.innerHTML = `<span class="genre-card-icon">${cat.icon}</span><span class="genre-card-name">${cat.name}</span>`;
    card.addEventListener('click', () => filterByCategory(cat.id));
    grid.appendChild(card);
  });
  browseSect.appendChild(grid);
  screen.appendChild(browseSect);

  /* Search logic */
  const input = $('search-input');
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    const res = $('search-results');
    if (!q) { res.classList.remove('visible'); res.innerHTML = ''; return; }
    const matches = ALL_TRACKS.filter(t =>
      t.name.toLowerCase().includes(q) || t.playlistName.toLowerCase().includes(q)
    );
    res.innerHTML = matches.length
      ? matches.slice(0, 20).map(t => `
          <div class="result-item" data-track="${t.id}" data-playlist="${t.playlistName}">
            <div class="result-art" style="background:${t.playlistColor}">${t.playlistIcon}</div>
            <div class="result-info">
              <div class="result-title">${t.name}</div>
              <div class="result-sub">Lesson · ${t.playlistName}</div>
            </div>
            ${ICONS.chevron}
          </div>`).join('')
      : '<p style="padding:16px;color:var(--text-secondary)">No results found</p>';
    res.classList.add('visible');
    res.querySelectorAll('.result-item').forEach(item => {
      item.addEventListener('click', () => {
        const track = ALL_TRACKS.find(t => t.id === item.dataset.track);
        if (track) openLesson(track);
      });
    });
  });
}

function filterByCategory(catId) {
  const screen = $('screen-search');
  const playlists = PLAYLISTS.filter(p => p.category === catId);
  const cat = CATEGORIES.find(c => c.id === catId);

  const overlay = el('div', 'category-overlay');
  overlay.style.cssText = 'position:fixed;inset:0;z-index:300;background:var(--bg-base);overflow-y:auto;padding-bottom:80px;';
  const back = el('div', 'category-overlay-header');
  back.style.cssText = `display:flex;align-items:center;gap:12px;padding:calc(28px + var(--status-h)) 16px 12px;background:${cat.color};`;
  const backBtn = el('button', '', ICONS.back);
  backBtn.style.cssText = 'background:none;border:none;cursor:pointer;color:#fff;display:flex;align-items:center;';
  backBtn.addEventListener('click', () => overlay.remove());
  const catTitle = el('span', '', cat.name);
  catTitle.style.cssText = 'font-size:20px;font-weight:800;color:#fff';
  back.appendChild(backBtn);
  back.appendChild(catTitle);
  overlay.appendChild(back);

  playlists.forEach(p => {
    const item = el('div', 'lib-item');
    item.innerHTML = `
      <div class="lib-art" style="background:${p.color}">${p.icon}</div>
      <div class="lib-info">
        <div class="lib-title">${p.name}</div>
        <div class="lib-meta">${p.tracks.length} lessons · ${p.desc}</div>
      </div>
      ${ICONS.chevron}`;
    item.addEventListener('click', () => { overlay.remove(); openPlaylist(p); });
    overlay.appendChild(item);
  });
  document.body.appendChild(overlay);
}

/* ── Build LIBRARY screen ───────────────────────────────── */
function buildLibrary() {
  const screen = $('screen-library');
  screen.innerHTML = '';

  const header = el('div', 'library-header');
  header.innerHTML = `
    <div class="library-title">Your Library</div>
    <div class="library-header-icons">
      ${ICONS.search}
      ${ICONS.plus}
    </div>`;
  screen.appendChild(header);

  /* Filter pills */
  const pills = el('div', 'filter-pills');
  const filters = ['All', 'Tenses', 'Modals', 'Conditionals', 'Passive', 'Other'];
  filters.forEach((f, i) => {
    const p = el('button', 'pill' + (i === 0 ? ' active' : ''), f);
    p.addEventListener('click', () => {
      document.querySelectorAll('.filter-pills .pill').forEach(x => x.classList.remove('active'));
      p.classList.add('active');
      renderLibraryItems(f === 'All' ? null : f.toLowerCase());
    });
    pills.appendChild(p);
  });
  screen.appendChild(pills);

  const listContainer = el('div');
  listContainer.id = 'library-list';
  screen.appendChild(listContainer);

  function renderLibraryItems(filter) {
    const list = $('library-list');
    list.innerHTML = '';
    const toShow = filter
      ? PLAYLISTS.filter(p => {
          if (filter === 'tenses') return p.category === 'tenses';
          if (filter === 'modals') return p.category === 'modals';
          if (filter === 'conditionals') return p.category === 'conditionals';
          if (filter === 'passive') return p.category === 'passive';
          return !['tenses','modals','conditionals','passive'].includes(p.category);
        })
      : PLAYLISTS;
    toShow.forEach(p => {
      const item = el('div', 'lib-item');
      item.innerHTML = `
        <div class="lib-art" style="background:${p.color}">${p.icon}</div>
        <div class="lib-info">
          <div class="lib-title">${p.name}</div>
          <div class="lib-meta">Playlist · ${p.tracks.length} lessons</div>
        </div>`;
      item.addEventListener('click', () => openPlaylist(p));
      list.appendChild(item);
    });
  }
  renderLibraryItems(null);
}

/* ── Open playlist modal ────────────────────────────────── */
function openPlaylist(playlist) {
  currentPlaylist = playlist;
  const modal = $('modal-playlist');

  modal.querySelector('.modal-hero-bg').textContent = playlist.icon;
  modal.querySelector('.modal-hero-bg').style.background = playlist.color;
  modal.querySelector('.modal-title').textContent = playlist.name;
  modal.querySelector('.modal-desc').textContent = playlist.desc;
  modal.querySelector('.modal-label').textContent = `${playlist.tracks.length} lessons`;

  const list = modal.querySelector('.modal-track-list');
  list.innerHTML = '';
  playlist.tracks.forEach((track, i) => {
    const item = el('div', 'track-item');
    const isPlaying = track.id === currentTrackId;
    item.innerHTML = `
      <span class="track-num ${isPlaying ? 'playing' : ''}">${isPlaying ? '♫' : i + 1}</span>
      <div class="track-info">
        <div class="track-name ${isPlaying ? 'playing' : ''}">${track.name}</div>
        <div class="track-meta">${track.meta}</div>
      </div>
      ${ICONS.more}`;
    item.addEventListener('click', () => openLesson(track));
    list.appendChild(item);
  });

  modal.style.display = 'flex';
  requestAnimationFrame(() => modal.classList.add('open'));
}

/* ── Open lesson viewer ─────────────────────────────────── */
function openLesson(track) {
  currentTrackId = track.id;

  /* Update mini player */
  const mp = $('mini-player');
  mp.querySelector('.mini-art').textContent = track.playlistIcon || (currentPlaylist && currentPlaylist.icon) || '📚';
  mp.querySelector('.mini-title').textContent = track.name;
  mp.querySelector('.mini-sub').textContent = track.playlistName || (currentPlaylist && currentPlaylist.name);
  mp.classList.add('visible');
  startMiniProgress();

  const modal = $('modal-lesson');
  modal.querySelector('.modal-hero-bg').textContent = track.playlistIcon || (currentPlaylist && currentPlaylist.icon) || '📚';
  modal.querySelector('.modal-hero-bg').style.background = track.playlistColor || (currentPlaylist && currentPlaylist.color) || '#1db954';
  modal.querySelector('.modal-title').textContent = track.name;
  modal.querySelector('.modal-desc').textContent = track.meta;

  const viewer = modal.querySelector('.lesson-viewer');
  viewer.innerHTML = `<div style="text-align:center;padding:40px 0;color:var(--text-secondary)">
    <div style="font-size:48px;margin-bottom:16px">📖</div>
    <div style="font-weight:700;font-size:16px;color:var(--text-primary);margin-bottom:8px">${track.name}</div>
    <div style="font-size:13px">Loading lesson content…</div>
  </div>`;

  modal.style.display = 'flex';
  requestAnimationFrame(() => modal.classList.add('open'));

  /* Load content via fetch */
  fetch(track.file)
    .then(r => { if (!r.ok) throw new Error(`Failed to load ${track.file}: ${r.status} ${r.statusText}`); return r.text(); })
    .then(html => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      /* Extract main content – try <main>, <article>, <body> */
      const content = doc.querySelector('main') || doc.querySelector('article') || doc.querySelector('.content') || doc.body;
      if (content) {
        /* Strip scripts */
        content.querySelectorAll('script,nav,header,footer,.nav-bar,.status-bar').forEach(e => e.remove());
        viewer.innerHTML = '';
        const wrapper = el('div', 'lesson-viewer');
        wrapper.innerHTML = content.innerHTML;
        /* Force text colors for embedded content */
        wrapper.style.cssText = 'padding:0;';
        viewer.appendChild(wrapper);
      }
    })
    .catch(() => {
      viewer.innerHTML = `
        <h3>${track.name}</h3>
        <p>This lesson covers: <strong>${track.meta}</strong></p>
        <p style="color:var(--text-secondary);font-size:12px;margin-top:16px">
          Open the lesson file directly to view the full content.
        </p>`;
    });
}

/* ── Mini player progress ───────────────────────────────── */
function startMiniProgress() {
  clearInterval(miniPlayerTimer);
  miniProgress = 0;
  const bar = document.querySelector('.mini-progress');
  if (bar) bar.style.width = '0%';
  miniPlayerTimer = setInterval(() => {
    miniProgress = Math.min(miniProgress + 0.5, 100);
    if (bar) bar.style.width = miniProgress + '%';
    if (miniProgress >= 100) clearInterval(miniPlayerTimer);
  }, 300);
}

/* ── Close modals ───────────────────────────────────────── */
function closeModal(id) {
  const modal = $(id);
  modal.classList.remove('open');
  setTimeout(() => { modal.style.display = 'none'; }, 320);
}

/* ── Status bar clock ───────────────────────────────────── */
function updateClock() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  const clock = document.querySelector('.status-bar .clock');
  if (clock) clock.textContent = h + ':' + m;
}

/* ── Init ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  buildHome();
  buildSearch();
  buildLibrary();
  updateClock();
  setInterval(updateClock, 30000);

  /* Back buttons */
  $('btn-back-playlist').addEventListener('click', () => closeModal('modal-playlist'));
  $('btn-back-lesson').addEventListener('click', () => closeModal('modal-lesson'));

  /* Mini player click → reopen lesson modal */
  $('mini-player').addEventListener('click', () => {
    if (currentTrackId) {
      const track = ALL_TRACKS.find(t => t.id === currentTrackId);
      if (track) openLesson(track);
    }
  });

  /* Play button in playlist */
  $('playlist-play-btn').addEventListener('click', () => {
    if (currentPlaylist && currentPlaylist.tracks.length) {
      openLesson({ ...currentPlaylist.tracks[0], playlistIcon: currentPlaylist.icon, playlistName: currentPlaylist.name, playlistColor: currentPlaylist.color });
    }
  });
});
