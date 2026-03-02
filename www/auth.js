// Base URL of the springboot-cucumber backend
const API_BASE_URL = 'http://localhost:8087';

const TOKEN_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

function saveTokens(accessToken, refreshToken) {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
}

function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function _isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp && Date.now() / 1000 > payload.exp;
  } catch {
    return true;
  }
}

function isAuthenticated() {
  const token = getAccessToken();
  if (!token) return false;
  return !_isTokenExpired(token);
}

function logout() {
  const token = getAccessToken();
  if (token) {
    fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    }).catch(() => {});
  }
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  window.location.href = 'login.html';
}
