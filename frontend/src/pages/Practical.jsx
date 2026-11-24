import { useState, useEffect } from "react";
import Simulation from "./Simulation.jsx";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const API_URL = `${BACKEND_URI}/experiments`;

const tabs = ["Practical File", "Simulation", "Generate Result"];

function Doc({ sections }) {
  return sections.map(([title, lines = [], ordered]) => (
    <section key={title} aria-label={title}>
      <h4>{title}</h4>

      {lines.length === 1 && !ordered ? (
        <p>{lines[0]}</p>
      ) : ordered ? (
        <ol>
          {lines.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ol>
      ) : (
        <ul>
          {lines.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      )}
    </section>
  ));
}

export default function Practical({ exp, user, voice, onDone, onBack }) {
  const [experiment, setExperiment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [tab, setTab] = useState(tabs[0]);
  const [log, setLog] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchExperiment = async () => {
      try {
        setLoading(true);
        setError("");
        setExperiment(null);
        setLog(null);
        setTab(tabs[0]);

        const response = await fetch(`${API_URL}/${exp.id}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to fetch experiment details");
        }

        const data = await response.json();
        setExperiment(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          setError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchExperiment();

    return () => controller.abort();
  }, [exp.id]);

  if (loading) {
    return <p role="status">Loading practical details...</p>;
  }

  if (error) {
    return (
      <section>
        <p role="alert">{error}</p>
        <button onClick={onBack}>Back to experiments</button>
      </section>
    );
  }

  if (!experiment) {
    return <p>Experiment not found.</p>;
  }

  const items = experiment.items || [];
  const sim = experiment.sim || [];

  const file = [
    ["Aim", [experiment.aim || ""]],
    ["Apparatus and Materials", items.map((i) => i.name)],
    ["Theory", [experiment.theory || ""]],
    ["Procedure", experiment.steps || [], true],
    ["Precautions", experiment.precautions || []],
  ];

  const report = log && [
    ...file.slice(0, 4),
    ["Observations", experiment.observations || []],
    ["Record of Your Actions", log, true],
    ["Result", [experiment.result || ""]],
    file[4],
  ];

  function download() {
    const head = [
      experiment.title,
      `Class ${experiment.classLevel} - ${experiment.subject}`,
      `Student: ${user.name}`,
      `Date: ${new Date().toLocaleDateString()}`,
      "",
    ];

    const body = report.flatMap(([t, lines]) => [
      t.toUpperCase(),
      ...lines.map((l) => `- ${l}`),
      "",
    ]);

    const a = document.createElement("a");

    const url = URL.createObjectURL(
      new Blob([[...head, ...body].join("\n")], {
        type: "text/plain",
      }),
    );

    a.href = url;
    a.download = `${experiment.title}.txt`;
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <section aria-labelledby="exp-title">
      <button onClick={onBack}>Back to experiments</button>

      <h3 id="exp-title">{experiment.title}</h3>

      <p>
        Class {experiment.classLevel} · {experiment.subject}
      </p>

      <div role="tablist" aria-label="Experiment sections" className="tabs">
        {tabs.map((t) => (
          <button
            key={t}
            role="tab"
            id={`ex-${t}`}
            aria-selected={tab === t}
            aria-controls={`ex-panel-${t}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id="ex-panel-Practical File"
        aria-labelledby="ex-Practical File"
        hidden={tab !== tabs[0]}
      >
        <Doc sections={file} />

        <button className="btn primary" onClick={() => setTab(tabs[1])}>
          Start simulation
        </button>
      </div>

      <div
        role="tabpanel"
        id="ex-panel-Simulation"
        aria-labelledby="ex-Simulation"
        hidden={tab !== tabs[1]}
      >
        <Simulation
          items={items}
          sim={sim}
          active={tab === tabs[1]}
          voice={voice}
          onComplete={(l) => {
            setLog(l);
            onDone(experiment.id);
          }}
          onResult={() => setTab(tabs[2])}
        />
      </div>

      <div
        role="tabpanel"
        id="ex-panel-Generate Result"
        aria-labelledby="ex-Generate Result"
        hidden={tab !== tabs[2]}
      >
        {report ? (
          <>
            <p role="status">
              <strong>Experiment completed successfully.</strong>
            </p>

            <h3>Practical File: {experiment.title}</h3>

            <p>
              Student: {user.name} · Class {experiment.classLevel} ·
              {experiment.subject} · {new Date().toLocaleDateString()}
            </p>

            <Doc sections={report} />

            <div className="btn-row">
              <button className="btn primary" onClick={download}>
                Download report
              </button>

              <button onClick={() => window.print()}>Print</button>
            </div>
          </>
        ) : (
          <>
            <p>
              Complete the simulation first. Your full practical file will
              appear here.
            </p>

            <button className="btn primary" onClick={() => setTab(tabs[1])}>
              Go to Simulation
            </button>
          </>
        )}
      </div>
    </section>
  );
}
