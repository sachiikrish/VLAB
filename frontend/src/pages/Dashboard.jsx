import { useState, useMemo } from "react";
import { experiments, classes, subjects } from "../data.js";
import { useVoiceCommand } from "../useVoice.js";
import Guide from "./Guide.jsx";
import Practical from "./Practical.jsx";
import Quiz from "./Quiz.jsx";

const tabs = ["Experiments", "Quiz", "My Progress", "Help"];
const voiceTabs = { experiment: "Experiments", quiz: "Quiz", progress: "My Progress", help: "Help" };

function loadDone(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
}

export default function Dashboard({ user, voice }) {
  const storeKey = `equilab-done-${user.name}`;
  const [tab, setTab] = useState("Experiments");
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState(String(user.classLevel));
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [open, setOpen] = useState(null);
  const [guided, setGuided] = useState(null);
  const [practical, setPractical] = useState(null);
  const [done, setDone] = useState(() => loadDone(storeKey));

  const results = useMemo(
    () => experiments.filter((e) =>
      (classFilter === "All" || e.classLevel === Number(classFilter)) &&
      (subjectFilter === "All" || e.subject === subjectFilter) &&
      e.title.toLowerCase().includes(search.toLowerCase())),
    [search, classFilter, subjectFilter]
  );

  function save(next) {
    setDone(next);
    try { localStorage.setItem(storeKey, JSON.stringify(next)); } catch { /* storage unavailable */ }
  }
  const toggleDone = (id) => save(done.includes(id) ? done.filter((x) => x !== id) : [...done, id]);
  const markDone = (id) => { if (!done.includes(id)) save([...done, id]); };

  useVoiceCommand(voice, (t) => {
    const key = Object.keys(voiceTabs).find((k) => t.includes(k));
    if (key) { setTab(voiceTabs[key]); setGuided(null); setPractical(null); }
    const c = t.match(/class (6|7|8)/);
    if (c) setClassFilter(c[1]);
  });

  return (
    <section aria-labelledby="dash-title">
      <h2 id="dash-title">Welcome, {user.name}</h2>

      <div role="tablist" aria-label="Dashboard sections" className="tabs">
        {tabs.map((t) => (
          <button key={t} role="tab" id={`tab-${t}`} aria-selected={tab === t}
            aria-controls="panel" onClick={() => { setTab(t); setGuided(null); setPractical(null); }}>{t}</button>
        ))}
      </div>

      <div role="tabpanel" id="panel" aria-labelledby={`tab-${tab}`}>
        {tab === "Experiments" && (practical ? (
          <Practical exp={practical} user={user} voice={voice} onDone={markDone} onBack={() => setPractical(null)} />
        ) : guided ? (
          <Guide exp={guided} voice={voice} onFinish={markDone} onClose={() => setGuided(null)} />
        ) : (
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
                  <div className="btn-row">
                    <button className="btn primary" onClick={() => setPractical(e)}>Open experiment</button>
                    <button onClick={() => setGuided(e)}>Guided steps</button>
                    <button aria-expanded={open === e.id} onClick={() => setOpen(open === e.id ? null : e.id)}>
                      {open === e.id ? "Hide steps" : "Show steps"}
                    </button>
                  </div>
                  {open === e.id && (
                    <div className="steps">
                      <ol>{e.steps.map((s) => <li key={s}>{s}</li>)}</ol>
                                            <button onClick={() => toggleDone(e.id)} aria-pressed={done.includes(e.id)}>
                        {done.includes(e.id) ? "Marked as done" : "Mark as done"}
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </>
        ))}

        {tab === "Quiz" && <Quiz classLevel={user.classLevel} voice={voice} />}

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
            <h3>How to use Equilab</h3>
            <ul>
              <li>Use Tab to move between buttons, and Enter or Space to select.</li>
              <li>Open an experiment to read its practical file, do the simulation with Enter, and generate your result.</li>
              <li>Guided steps shows one step at a time. Use Next and Back.</li>
              <li>Turn on Voice control in the header, then say: next, back, stop, experiments, quiz, progress, help, class 6, class 7, class 8, home. In the quiz, say one, two or three.</li>
              <li>Voice control works best in Google Chrome.</li>
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
