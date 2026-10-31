import { useState } from "react";

export default function Login({ onLogin }) {
  const [name, setName] = useState("");
  const [classLevel, setClassLevel] = useState("6");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Enter your name to log in.");
      return;
    }
    onLogin({ name: name.trim(), classLevel: Number(classLevel) });
  }

  return (
    <section aria-labelledby="login-title" className="narrow">
      <h2 id="login-title">Log in to Virtual Lab</h2>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="name">Your name</label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)}
          autoComplete="name" aria-invalid={!!error} aria-describedby={error ? "login-error" : undefined} />

        <label htmlFor="class">Your class</label>
        <select id="class" value={classLevel} onChange={(e) => setClassLevel(e.target.value)}>
          <option value="6">Class 6</option>
          <option value="7">Class 7</option>
          <option value="8">Class 8</option>
        </select>

        {error && <p id="login-error" role="alert" className="error">{error}</p>}
        <button type="submit" className="btn primary">Log in</button>
      </form>
    </section>
  );
}
