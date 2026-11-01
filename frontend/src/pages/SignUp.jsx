import { useState } from "react";
import { signUp } from "../auth.js";

export default function SignUp({ onDone, onSwitch }) {
  const [form, setForm] = useState({ username: "", password: "", confirm: "", classLevel: "6" });
  const [error, setError] = useState("");
  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.username.trim().length < 3) return setError("Username must have at least 3 characters.");
    if (form.password.length < 6) return setError("Password must have at least 6 characters.");
    if (form.password !== form.confirm) return setError("The two passwords do not match.");
    const result = await signUp({ username: form.username, password: form.password, classLevel: Number(form.classLevel) });
    if (result.error) return setError(result.error);
    onDone(result.user);
  }

  return (
    <section aria-labelledby="su-title" className="narrow">
      <h2 id="su-title">Create your account</h2>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="su-user">Username</label>
        <input id="su-user" value={form.username} onChange={set("username")} autoComplete="username" />

        <label htmlFor="su-pass">Password</label>
        <input id="su-pass" type="password" value={form.password} onChange={set("password")} autoComplete="new-password" />

        <label htmlFor="su-confirm">Confirm password</label>
        <input id="su-confirm" type="password" value={form.confirm} onChange={set("confirm")} autoComplete="new-password" />

        <label htmlFor="su-class">Your class</label>
        <select id="su-class" value={form.classLevel} onChange={set("classLevel")}>
          <option value="6">Class 6</option>
          <option value="7">Class 7</option>
          <option value="8">Class 8</option>
        </select>

        {error && <p role="alert" className="error">{error}</p>}
        <button type="submit" className="btn primary">Sign up</button>
      </form>
      <p>Already have an account? <button className="btn ghost" onClick={onSwitch}>Sign in</button></p>
    </section>
  );
}
