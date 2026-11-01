import { useState } from "react";
import { signIn } from "../auth.js";

export default function SignIn({ onDone, onSwitch }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.username.trim() || !form.password) return setError("Enter your username and password.");
    const result = await signIn(form);
    if (result.error) return setError(result.error);
    onDone(result.user);
  }

  return (
    <section aria-labelledby="si-title" className="narrow">
      <h2 id="si-title">Sign in to Equilab</h2>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="si-user">Username</label>
        <input id="si-user" value={form.username} onChange={set("username")} autoComplete="username" />

        <label htmlFor="si-pass">Password</label>
        <input id="si-pass" type="password" value={form.password} onChange={set("password")} autoComplete="current-password" />

        {error && <p role="alert" className="error">{error}</p>}
        <button type="submit" className="btn primary">Sign in</button>
      </form>
      <p>New to Equilab? <button className="btn ghost" onClick={onSwitch}>Sign up</button></p>
    </section>
  );
}
