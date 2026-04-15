// ──────────────────────────────────────────────────────────────────────────
//  renta-api.js  –  Vanilla JS API client for the Renta Form port
//  Mirrors src/apiClient.js from the renta-form React app.
//
//  Change RENTA_API_BASE_URL to the URL of your deployed backend.
// ──────────────────────────────────────────────────────────────────────────

const RENTA_API_BASE_URL = (function () {
  // Allow overriding via a global set before this script loads:
  //   <script>window.RENTA_API_BASE_URL = 'https://your-backend.onrender.com/v1';</script>
  if (window.RENTA_API_BASE_URL) return window.RENTA_API_BASE_URL;
  // Default: same origin /v1 (works when backend serves the front-end)
  return '/v1';
})();

const RENTA_ERROR_USER_BLOCKED = 'USER_BLOCKED';

// ── Internal helpers ───────────────────────────────────────────────────────

async function _rentaRequest(method, path, { body, query } = {}) {
  let url = `${RENTA_API_BASE_URL}${path}`;
  if (query) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== '') params.append(k, v);
    }
    const qs = params.toString();
    if (qs) url += `?${qs}`;
  }
  const opts = { method, headers: {} };
  if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  try {
    const res = await fetch(url, opts);
    const json = await res.json().catch(() => null);
    if (!res.ok) {
      return { data: null, error: { message: json?.error ?? res.statusText }, response: { status: res.status } };
    }
    return { data: json, error: null, response: { status: res.status } };
  } catch (err) {
    return { data: null, error: { message: err.message ?? 'Error de red' } };
  }
}

// ── Auth ───────────────────────────────────────────────────────────────────

function rentaApiLogin({ dniNie, password }) {
  return _rentaRequest('POST', '/auth/login', { body: { dniNie, password } });
}

function rentaApiChangePassword({ dniNie, oldPassword, newPassword }) {
  return _rentaRequest('POST', '/auth/change-password', { body: { dniNie, oldPassword, newPassword } });
}

// ── IRPF preguntas ─────────────────────────────────────────────────────────

function rentaApiGetPreguntas() {
  return _rentaRequest('GET', '/irpf/preguntas');
}

// ── Declaraciones ──────────────────────────────────────────────────────────

function rentaApiListDeclaraciones({ dniNie, estado, page, limit } = {}) {
  return _rentaRequest('GET', '/irpf/declaraciones', { query: { dniNie, estado, page, limit } });
}

function rentaApiCreateDeclaracion(body) {
  return _rentaRequest('POST', '/irpf/declaraciones', { body });
}

function rentaApiGetDeclaracion(id) {
  return _rentaRequest('GET', `/irpf/declaraciones/${encodeURIComponent(id)}`);
}

function rentaApiGetDeclaracionByToken(token) {
  const t = (token || '').trim();
  if (!t) return Promise.resolve({ data: null, error: { message: 'Token requerido' } });
  return _rentaRequest('GET', `/irpf/consulta/${encodeURIComponent(t)}`);
}

function rentaApiUpdateDeclaracion(id, body) {
  return _rentaRequest('PUT', `/irpf/declaraciones/${encodeURIComponent(id)}`, { body });
}

// ── Idiomas & Traducciones ─────────────────────────────────────────────────

function rentaApiGetIdiomas() {
  return _rentaRequest('GET', '/irpf/idiomas');
}

function rentaApiGetTraducciones() {
  return _rentaRequest('GET', '/irpf/traducciones');
}

// ── Language helper ────────────────────────────────────────────────────────

const RENTA_LANG_KEY = 'renta_form_lang';
const RENTA_STATIC_LANGUAGES = [
  { code: 'es', label: 'Español' },
  { code: 'ca', label: 'Català' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
];
const RENTA_LANG_FLAGS = { es: '🇪🇸', fr: '🇫🇷', en: '🇬🇧', de: '🇩🇪', pt: '🇵🇹', it: '🇮🇹', ca: '🏴' };

const RENTA_TOKENS_KEY = 'renta_form_tokens';

/** Simple translation cache loaded once per page */
const _rentaTranslations = { _loaded: false, _langs: RENTA_STATIC_LANGUAGES, _data: {} };

async function rentaLoadTranslations() {
  if (_rentaTranslations._loaded) return;
  try {
    const [idiomasRes, traduccionesRes] = await Promise.all([
      rentaApiGetIdiomas(),
      rentaApiGetTraducciones(),
    ]);
    if (idiomasRes.data && Array.isArray(idiomasRes.data) && idiomasRes.data.length) {
      _rentaTranslations._langs = idiomasRes.data;
    }
    if (traduccionesRes.data && typeof traduccionesRes.data === 'object') {
      _rentaTranslations._data = traduccionesRes.data;
    }
  } catch {
    // fall back to static
  }
  _rentaTranslations._loaded = true;
}

function rentaGetLang() {
  return localStorage.getItem(RENTA_LANG_KEY) || 'es';
}

function rentaSetLang(code) {
  localStorage.setItem(RENTA_LANG_KEY, code);
}

function rentaT(key) {
  const lang = rentaGetLang();
  const langData = _rentaTranslations._data[lang];
  if (langData && langData[key]) return langData[key];
  return key;
}

function rentaAvailableLanguages() {
  return _rentaTranslations._langs;
}
