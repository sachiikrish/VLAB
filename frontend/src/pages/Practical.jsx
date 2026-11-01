import { useState } from "react";
import { practicals } from "../practicals.js";
import Simulation from "./Simulation.jsx";

const tabs = ["Practical File", "Simulation", "Generate Result"];

function Doc({ sections }) {
  return sections.map(([title, lines, ordered]) => (
    <section key={title} aria-label={title}>
      <h4>{title}</h4>
      {lines.length === 1 && !ordered ? <p>{lines[0]}</p> : ordered ? <ol>{lines.map((l) => <li key={l}>{l}</li>)}</ol> : <ul>{lines.map((l) => <li key={l}>{l}</li>)}</ul>}
    </section>
  ));
}

export default function Practical({ exp, user, voice, onDone, onBack }) {
  const p = practicals[exp.id];
  const items = p.items.map(([id, name, reuse]) => ({ id, name, reuse }));
  const sim = p.sim.map(([text, item, sound, result]) => ({ text, item, sound, result }));
  const [tab, setTab] = useState(tabs[0]);
  const [log, setLog] = useState(null); // filled in when the simulation is complete

  const file = [
    ["Aim", [p.aim]],
    ["Apparatus and Materials", items.map((i) => i.name)],
    ["Theory", [p.theory]],
    ["Procedure", exp.steps, true],
    ["Precautions", p.precautions],
  ];
  const report = log && [
    ...file.slice(0, 4),
    ["Observations", p.observations],
    ["Record of Your Actions", log, true],
    ["Result", [p.result]],
    file[4],
  ];

  function download() {
    const head = [exp.title, `Class ${exp.classLevel} - ${exp.subject}`, `Student: ${user.name}`, `Date: ${new Date().toLocaleDateString()}`, ""];
    const body = report.flatMap(([t, lines]) => [t.toUpperCase(), ...lines.map((l) => `- ${l}`), ""]);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([[...head, ...body].join("\n")], { type: "text/plain" }));
    a.download = `${exp.title}.txt`;
    a.click();
  }

  return (
    <section aria-labelledby="exp-title">
      <button onClick={onBack}>Back to experiments</button>
      <h3 id="exp-title">{exp.title}</h3>
      <p>Class {exp.classLevel} · {exp.subject}</p>

      <div role="tablist" aria-label="Experiment sections" className="tabs">
        {tabs.map((t) => (
          <button key={t} role="tab" id={`ex-${t}`} aria-selected={tab === t} aria-controls={`ex-panel-${t}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      <div role="tabpanel" id="ex-panel-Practical File" aria-labelledby="ex-Practical File" hidden={tab !== tabs[0]}>
        <Doc sections={file} />
        <button className="btn primary" onClick={() => setTab(tabs[1])}>Start simulation</button>
      </div>

      <div role="tabpanel" id="ex-panel-Simulation" aria-labelledby="ex-Simulation" hidden={tab !== tabs[1]}>
        <Simulation items={items} sim={sim} active={tab === tabs[1]} voice={voice}
          onComplete={(l) => { setLog(l); onDone(exp.id); }} onResult={() => setTab(tabs[2])} />
      </div>

      <div role="tabpanel" id="ex-panel-Generate Result" aria-labelledby="ex-Generate Result" hidden={tab !== tabs[2]}>
        {report ? (
          <>
            <p role="status"><strong>Experiment completed successfully.</strong></p>
            <h3>Practical File: {exp.title}</h3>
            <p>Student: {user.name} · Class {exp.classLevel} · {exp.subject} · {new Date().toLocaleDateString()}</p>
            <Doc sections={report} />
            <div className="btn-row">
              <button className="btn primary" onClick={download}>Download report</button>
              <button onClick={() => window.print()}>Print</button>
            </div>
          </>
        ) : (
          <>
            <p>Complete the simulation first. Your full practical file will appear here.</p>
            <button className="btn primary" onClick={() => setTab(tabs[1])}>Go to Simulation</button>
          </>
        )}
      </div>
    </section>
  );
}
