// StudyBuddy Supplies - Authentication (frontend demo only)
// Session is stored in localStorage. This is NOT secure authentication;
// it is suitable for a single-browser demonstration only.

const SESSION_STORAGE_KEY = 'studyBuddy_session';

function getSession() {
  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) return null;
    const session = JSON.parse(stored);
    if (session && session.loggedIn && session.user) return session;
  } catch (e) {
    // ignore parse errors
  }
  return null;
}

function setSession(user) {
  const session = { loggedIn: true, user, loginTime: new Date().toISOString() };
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  return session;
}

function clearSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

function isLoggedIn() {
  return getSession() !== null;
}

function getCurrentUser() {
  const session = getSession();
  return session ? session.user : null;
}

function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === 'admin';
}

function isCustomer() {
  const user = getCurrentUser();
  return user && user.role === 'customer';
}

function login(username, password, role = 'customer') {
  // Demo-only: accept any non-empty username and password.
  // Do not check against registered accounts.
  const user = String(username).trim();
  const pass = String(password).trim();
  if (!user || !pass) {
    return { ok: false, message: 'Username and password are required.' };
  }
  return { ok: true, user: { name: user, role: role } };
}

function logout() {
  clearSession();
}
