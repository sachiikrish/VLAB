// Demo accounts stored in this browser. Passwords are salted and hashed, never saved as plain text.
// When the backend is ready, replace signUp and signIn with API calls.
const USERS = "equilab-users";
const SESSION = "equilab-session";

function readUsers() {
  try { return JSON.parse(localStorage.getItem(USERS)) || {}; } catch { return {}; }
}

async function hash(password, salt) {
  const bytes = new TextEncoder().encode(salt + password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function signUp({ username, password, classLevel }) {
  const key = username.trim().toLowerCase();
  const all = readUsers();
  if (all[key]) return { error: "That username is already taken. Try another one." };
  const salt = crypto.randomUUID();
  all[key] = { display: username.trim(), salt, hash: await hash(password, salt), classLevel };
  try { localStorage.setItem(USERS, JSON.stringify(all)); } catch { return { error: "Could not save your account in this browser." }; }
  return { user: { name: username.trim(), classLevel } };
}

export async function signIn({ username, password }) {
  const rec = readUsers()[username.trim().toLowerCase()];
  if (!rec || (await hash(password, rec.salt)) !== rec.hash) return { error: "Wrong username or password." };
  return { user: { name: rec.display, classLevel: rec.classLevel } };
}

export function loadSession() {
  try { return JSON.parse(localStorage.getItem(SESSION)); } catch { return null; }
}
export function saveSession(user) {
  try { localStorage.setItem(SESSION, JSON.stringify(user)); } catch { /* storage unavailable */ }
}
export function clearSession() {
  try { localStorage.removeItem(SESSION); } catch { /* storage unavailable */ }
}
