import { useState } from "react";
import Landing from "./pages/Landing.jsx";
import About from "./pages/About.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { loadSession, saveSession, clearSession } from "./auth.js";
import { useRecognition, useVoiceCommand, voiceSupported } from "./useVoice.js";

function loadSettings() {
  try { return JSON.parse(localStorage.getItem("equilab-settings")) || {}; } catch { return {}; }
}

export default function App() {
  const [settings, setSettings] = useState(loadSettings);
  const [user, setUser] = useState(loadSession);
  const [page, setPage] = useState("home"); // home | about | signin | signup | dashboard
  const [voiceOn, setVoiceOn] = useState(false);
  const [voice, setVoice] = useState({ text: "", n: 0 });
  const { big, light } = settings;

  function update(changes) {
    const next = { ...settings, ...changes };
    setSettings(next);
    try { localStorage.setItem("equilab-settings", JSON.stringify(next)); } catch { /* storage unavailable */ }
  }
  function handleAuth(u) { saveSession(u); setUser(u); setPage("dashboard"); }
  function handleLogout() { clearSession(); setUser(null); setPage("home"); }

  useRecognition(voiceOn, (t) => setVoice((v) => ({ text: t, n: v.n + 1 })));
  useVoiceCommand(voice, (t) => {
    if (t.includes("home")) setPage("home");
    else if (t.includes("about")) setPage("about");
    else if ((t.includes("log out") || t.includes("sign out")) && user) handleLogout();
  });

  const navButton = (id, label) => (
    <button aria-current={page === id ? "page" : undefined} onClick={() => setPage(id)}>{label}</button>
  );

  return (
    <div className={`app ${big ? "big" : ""} ${light ? "light" : ""}`}>
      <a className="skip" href="#main">Skip to main content</a>

      <header>
        <h1>Equilab</h1>
        <div className="tools" role="group" aria-label="Display and voice settings">
          <button aria-pressed={!!big} onClick={() => update({ big: !big })}>Text size</button>
          <button aria-pressed={!!light} onClick={() => update({ light: !light })}>Contrast</button>
          <button aria-pressed={voiceOn} onClick={() => setVoiceOn(!voiceOn)} disabled={!voiceSupported()}
            title={voiceSupported() ? "" : "Voice control needs Google Chrome"}>Voice control</button>
        </div>
        <nav aria-label="Main menu">
          {navButton("home", "Home")}
          {navButton("about", "About us")}
          {user ? (
            <>
              {navButton("dashboard", "Experiments")}
              <button onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              {navButton("signin", "Sign in")}
              {navButton("signup", "Sign up")}
            </>
          )}
        </nav>
      </header>

      <main id="main" tabIndex="-1">
        {page === "home" && <Landing user={user} go={setPage} />}
        {page === "about" && <About />}
        {page === "signin" && <SignIn onDone={handleAuth} onSwitch={() => setPage("signup")} />}
        {page === "signup" && <SignUp onDone={handleAuth} onSwitch={() => setPage("signin")} />}
        {page === "dashboard" && user && <Dashboard user={user} voice={voice} />}
      </main>

      <footer><p>Equilab: a free virtual lab for classes 6 to 8.</p></footer>
    </div>
  );
}
