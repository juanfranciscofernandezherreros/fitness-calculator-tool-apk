// ──────────────────────────────────────────────────────────────────────────
//  renta-auth.js  –  Auth utilities for the Renta Form vanilla JS port
//  Mirrors the AuthContext.jsx from the renta-form React app.
// ──────────────────────────────────────────────────────────────────────────

const RENTA_USER_KEY = 'renta_form_user';

/** Persist the logged-in user object (e.g. { dniNie, role }) */
function rentaLogin(userData) {
  localStorage.setItem(RENTA_USER_KEY, JSON.stringify(userData));
}

/** Remove the session */
function rentaLogout() {
  localStorage.removeItem(RENTA_USER_KEY);
}

/**
 * Return the stored user object or null.
 * @returns {{ dniNie: string, role: string } | null}
 */
function rentaGetUser() {
  try {
    const raw = localStorage.getItem(RENTA_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** True when a user is currently stored */
function rentaIsAuthenticated() {
  return rentaGetUser() !== null;
}

/**
 * Redirect to renta-login.html if not authenticated.
 * Call this at the top of protected pages.
 */
function rentaRequireAuth() {
  if (!rentaIsAuthenticated()) {
    window.location.href = 'renta-login.html';
  }
}
