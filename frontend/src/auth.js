import api from "./services/api";

// SIGNUP
export async function signUp({ username, password, classLevel }) {
  try {
    const response = await api.post("/auth/signup", {
      username,
      password,
      classLevel,
    });

    return { user: response.data.user };
  } catch (error) {
    return {
      error: error.response?.data?.error || "Unable to create your account.",
    };
  }
}

// SIGNIN
export async function signIn({ username, password }) {
  try {
    const response = await api.post("/auth/signin", {
      username,
      password,
    });

    const { accessToken, user } = response.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(user));

    return { user };
  } catch (error) {
    return {
      error: error.response?.data?.error || "Unable to sign in.",
    };
  }
}

// RESTORE SESSION
export async function loadSession() {
  try {
    const response = await api.post("/auth/refresh");

    localStorage.setItem("accessToken", response.data.accessToken);

    const userResponse = await api.get("/auth/me");

    const user = userResponse.data.user;

    localStorage.setItem("user", JSON.stringify(user));

    return user;
  } catch (error) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    return null;
  }
}

// GET SAVED USER
export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

// SAVE USER
export function saveSession(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

// LOGOUT
export async function clearSession() {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }
}
