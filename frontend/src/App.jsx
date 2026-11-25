import { useState, useEffect } from "react";
import Landing from "./pages/Landing.jsx";
import About from "./pages/About.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Calculator from "./pages/Calculator.jsx";
import { loadSession, clearSession } from "./auth.js";
import { useRecognition, useVoiceCommand, voiceSupported } from "./useVoice.js";
import GraphFeature from "./features/App.jsx";

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem("equilab-settings")) || {};
  } catch {
    return {};
  }
}

export default function App() {
  const [settings, setSettings] = useState(loadSettings);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [sessionLoading, setSessionLoading] = useState(true);

  const [page, setPage] = useState("home");
  const [voiceOn, setVoiceOn] = useState(false);
  const [voice, setVoice] = useState({ text: "", n: 0 });

  const { big, light } = settings;

  // Restore authenticated session from backend
  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        const savedUser = await loadSession();

        if (active) {
          setUser(savedUser);
        }
      } finally {
        if (active) {
          setSessionLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  // Handle expired sessions
  useEffect(() => {
    function handleSessionExpired() {
      setUser(null);
      setPage("home");
    }

    window.addEventListener("auth:session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("auth:session-expired", handleSessionExpired);
    };
  }, []);

  function update(changes) {
    const next = { ...settings, ...changes };
    setSettings(next);

    try {
      localStorage.setItem("equilab-settings", JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  }

  // Called after successful signin
  function handleAuth(u) {
    setUser(u);
    setPage("dashboard");
  }

  // Logout
  async function handleLogout() {
    await clearSession();
    setUser(null);
    setPage("home");
  }

  useRecognition(voiceOn, (t) => setVoice((v) => ({ text: t, n: v.n + 1 })));

  useVoiceCommand(voice, (t) => {
    if (t.includes("home")) setPage("home");
    else if (t.includes("about")) setPage("about");
    else if ((t.includes("log out") || t.includes("sign out")) && user) {
      handleLogout();
    }
  });

  const navButton = (id, label) => (
    <button
      aria-current={page === id ? "page" : undefined}
      onClick={() => setPage(id)}
    >
      {label}
    </button>
  );

  return (
    <div className={`app ${big ? "big" : ""} ${light ? "light" : ""}`}>
      <a className="skip" href="#main">
        Skip to main content
      </a>

      <header className={user ? "logged-in-header" : "logged-out-header"}>
  <h1>Equilab</h1>

  <nav aria-label="Main menu">
    {navButton("home", "Home")}

    {!user && navButton("about", "About us")}

    {navButton("calculator", "Calculator")}

    {user && navButton("dashboard", "Experiments")}

    {user && navButton("graph", "Graph")}

    {user ? (
      <button onClick={handleLogout}>Log out</button>
    ) : (
      <>
        {navButton("signin", "Sign in")}
        {navButton("signup", "Sign up")}
      </>
    )}

    {/* Display and voice settings */}
    <div
      className="tools"
      role="group"
      aria-label="Display and voice settings"
    >
      <button aria-pressed={!!big} onClick={() => update({ big: !big })}>
        Text size
      </button>

      <button
        aria-pressed={!!light}
        onClick={() => update({ light: !light })}
      >
        Contrast
      </button>

      <button
        aria-pressed={voiceOn}
        onClick={() => setVoiceOn(!voiceOn)}
        disabled={!voiceSupported()}
        title={voiceSupported() ? "" : "Voice control needs Google Chrome"}
      >
        Voice control
      </button>
    </div>
  </nav>
</header>

      <main id="main" tabIndex="-1">
        {page === "home" && <Landing user={user} go={setPage} />}
        {page === "about" && <About />}
        {page === "graph" && user && <GraphFeature />}

        {!sessionLoading && (
          <>
            {page === "signin" && (
              <SignIn onDone={handleAuth} onSwitch={() => setPage("signup")} />
            )}

            {page === "signup" && (
              <SignUp
                onDone={() => setPage("signin")}
                onSwitch={() => setPage("signin")}
              />
            )}

            {page === "dashboard" && user && (
              <Dashboard user={user} voice={voice} />
            )}
          </>
        )}

        {page === "calculator" && <Calculator />}
      </main>

      <footer>
        <p>Equilab: a free virtual lab for classes 6 to 8.</p>
      </footer>
    </div>
  );
}
