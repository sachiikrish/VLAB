function Art() {
  return (
    <svg className="art" viewBox="0 0 400 360" role="img" aria-label="A glowing science flask with an atom and bubbles">
      <defs>
        <linearGradient id="liq" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3ddbd9" /><stop offset="1" stopColor="#8b7cff" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffc933" stopOpacity="0.35" /><stop offset="1" stopColor="#ffc933" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="190" r="175" fill="url(#glow)" />
      <g fill="none" stroke="#ffc933" strokeWidth="3">
        <ellipse cx="305" cy="85" rx="54" ry="19" />
        <ellipse cx="305" cy="85" rx="54" ry="19" transform="rotate(60 305 85)" />
        <ellipse cx="305" cy="85" rx="54" ry="19" transform="rotate(120 305 85)" />
      </g>
      <circle cx="305" cy="85" r="9" fill="#ffc933" />
      <circle cx="359" cy="85" r="6" fill="#3ddbd9" />
      <circle cx="278" cy="38" r="6" fill="#8b7cff" />
      <circle cx="278" cy="132" r="6" fill="#3ddbd9" />
      <path d="M170 60H230V140L300 270Q314 300 282 300H118Q86 300 100 270L170 140Z" fill="#141b34" stroke="#f5f7fa" strokeWidth="5" strokeLinejoin="round" />
      <path d="M130 215Q165 203 200 215T270 215L300 270Q314 300 282 300H118Q86 300 100 270Z" fill="url(#liq)" />
      <circle cx="175" cy="255" r="11" fill="#fff" opacity="0.5" />
      <circle cx="228" cy="240" r="7" fill="#fff" opacity="0.5" />
      <circle cx="205" cy="180" r="8" fill="none" stroke="#3ddbd9" strokeWidth="3" />
      <circle cx="195" cy="120" r="6" fill="none" stroke="#3ddbd9" strokeWidth="3" />
      <rect x="160" y="48" width="80" height="14" rx="7" fill="#ffc933" />
      <g fill="#ffc933">
        <circle cx="40" cy="300" r="9" /><circle cx="40" cy="330" r="9" opacity="0.25" />
        <circle cx="70" cy="300" r="9" opacity="0.25" /><circle cx="70" cy="330" r="9" />
      </g>
      <g fill="#f5f7fa" opacity="0.8">
        <circle cx="60" cy="90" r="3" /><circle cx="120" cy="40" r="2" /><circle cx="350" cy="250" r="3" /><circle cx="30" cy="190" r="2" />
      </g>
    </svg>
  );
}

const tiles = [
  { icon: "🧪", label: "Experiments" },
  { icon: "🔬", label: "Simulation" },
  { icon: "❓", label: "Quiz" },
];

export default function Landing({ user, go }) {
  return (
    <>
      <section className="welcome" aria-labelledby="welcome-title">
        <div>
          <p className="eyebrow">Welcome to</p>
          <h2 id="welcome-title" className="brand">Equilab</h2>
          <p className="lead">An accessible virtual lab: a virtual laboratory that provides an accessible, real-time experience of performing science experiments to people with visual impairment.</p>
          <div className="actions">
            {user ? (
              <button className="btn primary" onClick={() => go("dashboard")}>Open experiments</button>
            ) : (
              <>
                <button className="btn primary" onClick={() => go("signup")}>Sign up</button>
                <button className="btn ghost" onClick={() => go("signin")}>Sign in</button>
              </>
            )}
            <button className="btn ghost" onClick={() => go("about")}>About us</button>
          </div>
        </div>
        <Art />
      </section>

      <ul className="tiles" aria-label="What is inside Equilab">
        {tiles.map((t) => (
          <li key={t.label} className="tile"><span aria-hidden="true">{t.icon}</span> {t.label}</li>
        ))}
      </ul>
    </>
  );
}
