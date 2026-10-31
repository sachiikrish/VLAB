import { useState } from "react";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";

export default function App() {
  const [page, setPage] = useState("home"); // home | login | dashboard
  const [user, setUser] = useState(null);
  const [bigText, setBigText] = useState(false);
  const [lightMode, setLightMode] = useState(false);

  function handleLogin(u) { setUser(u); setPage("dashboard"); }
  function handleLogout() { setUser(null); setPage("home"); }
  function start() { setPage(user ? "dashboard" : "login"); }

  return (
    <div className={`app ${bigText ? "big" : ""} ${lightMode ? "light" : ""}`}>
      <a className="skip" href="#main">Skip to main content</a>

      <header>
        <h1>Virtual Lab</h1>
        <div className="tools" role="group" aria-label="Display settings">
          <button aria-pressed={bigText} onClick={() => setBigText(!bigText)}>Text size</button>
          <button aria-pressed={lightMode} onClick={() => setLightMode(!lightMode)}>Contrast</button>
        </div>
        <nav aria-label="Main menu">
          <button aria-current={page === "home" ? "page" : undefined} onClick={() => setPage("home")}>Home</button>
          {user && (
            <button aria-current={page === "dashboard" ? "page" : undefined} onClick={() => setPage("dashboard")}>
              Experiments
            </button>
          )}
          {user
            ? <button onClick={handleLogout}>Log out</button>
            : <button aria-current={page === "login" ? "page" : undefined} onClick={() => setPage("login")}>Log in</button>}
        </nav>
      </header>

      <main id="main" tabIndex="-1">
        {page === "home" && <Landing onStart={start} />}
        {page === "login" && <Login onLogin={handleLogin} />}
        {page === "dashboard" && user && <Dashboard user={user} />}
      </main>

      <footer><p>Virtual Lab is free for every student. Classes 6 to 8.</p></footer>
    </div>
  );
}
