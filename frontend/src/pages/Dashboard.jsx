import { useState, useMemo } from "react";
import { experiments, classes, subjects } from "../data.js";

const tabs = ["Experiments", "My Progress", "Help"];

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

// Saved in this browser so progress stays after a refresh
function loadDone(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
}

export default function Dashboard({ user }) {
  const storeKey = `vlab-done-${user.name}`;
  const [tab, setTab] = useState("Experiments");
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState(String(user.classLevel));
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [open, setOpen] = useState(null);
  const [done, setDone] = useState(() => loadDone(storeKey));

  const results = useMemo(
    () => experiments.filter((e) =>
      (classFilter === "All" || e.classLevel === Number(classFilter)) &&
      (subjectFilter === "All" || e.subject === subjectFilter) &&
      e.title.toLowerCase().includes(search.toLowerCase())),
    [search, classFilter, subjectFilter]
  );

  function toggleDone(id) {
    const next = done.includes(id) ? done.filter((x) => x !== id) : [...done, id];
    setDone(next);
    try { localStorage.setItem(storeKey, JSON.stringify(next)); } catch {}
  }

  return (
    <section aria-labelledby="dash-title">
      <h2 id="dash-title">Welcome, {user.name}</h2>

      <div role="tablist" aria-label="Dashboard sections" className="tabs">
        {tabs.map((t) => (
          <button key={t} role="tab" id={`tab-${t}`} aria-selected={tab === t}
            aria-controls="panel" onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      <div role="tabpanel" id="panel" aria-labelledby={`tab-${tab}`}>
        {tab === "Experiments" && (
          <>
            <form role="search" aria-label="Find experiments" className="filters" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="search">Search experiments</label>
                <input id="search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div>
                <label htmlFor="f-class">Class</label>
                <select id="f-class" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
                  <option value="All">All classes</option>
                  {classes.map((c) => <option key={c} value={c}>Class {c}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="f-subject">Subject</label>
                <select id="f-subject" value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
                  <option value="All">All subjects</option>
                  {subjects.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </form>

            <p aria-live="polite" className="count">{results.length} experiments found</p>

            <ul className="list">
              {results.map((e) => (
                <li key={e.id} className="card">
                  <h3>{e.title}</h3>
                  <p>Class {e.classLevel} · {e.subject}{done.includes(e.id) ? " · Done" : ""}</p>
                  <p>{e.summary}</p>
                  <button aria-expanded={open === e.id} onClick={() => setOpen(open === e.id ? null : e.id)}>
                    {open === e.id ? "Hide steps" : "Show steps"}
                  </button>

                  {open === e.id && (
                    <div className="steps">
                      <ol>{e.steps.map((s) => <li key={s}>{s}</li>)}</ol>
                      <button onClick={() => speak(`${e.title}. ${e.steps.join(" Next. ")}`)}>Read aloud</button>
                      <button onClick={() => toggleDone(e.id)} aria-pressed={done.includes(e.id)}>
                        {done.includes(e.id) ? "Marked as done" : "Mark as done"}
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}

        {tab === "My Progress" && (
          <>
            <h3>{done.length} of {experiments.length} experiments done</h3>
            {done.length === 0
              ? <p>You have not finished any experiments yet. Open the Experiments tab to begin.</p>
              : <ul>{experiments.filter((e) => done.includes(e.id)).map((e) => <li key={e.id}>{e.title}</li>)}</ul>}
          </>
        )}

        {tab === "Help" && (
          <>
            <h3>How to use Virtual Lab</h3>
            <ul>
              <li>Use Tab to move between buttons and fields.</li>
              <li>Press Enter or Space to select a button.</li>
              <li>Use the Text size and Contrast buttons at the top to change how the page looks.</li>
              <li>Press Read aloud inside an experiment to hear the steps.</li>
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
