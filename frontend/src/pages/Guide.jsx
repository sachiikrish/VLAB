import { useState } from "react";
import { success, tone } from "../sound.js";
import { useVoiceCommand } from "../useVoice.js";

export default function Guide({ exp, voice, onFinish, onClose }) {
  const [i, setI] = useState(0);
  const total = exp.steps.length;

  function next() {
    if (i < total - 1) { tone(660, 0.6); return setI(i + 1); }
    success();
    onFinish(exp.id);
    onClose();
  }
  const back = () => { if (i > 0) { tone(440, 0.6); setI(i - 1); } };

  useVoiceCommand(voice, (t) => {
    if (t.includes("next")) next();
    else if (t.includes("back") || t.includes("previous")) back();
    else if (t.includes("stop") || t.includes("close")) onClose();
  });

  return (
    <section aria-labelledby="guide-title" className="card">
      <h3 id="guide-title">{exp.title}</h3>
      <p className="count">Step {i + 1} of {total}</p>
      <p className="step-big" aria-live="polite">{exp.steps[i]}</p>
      <div className="btn-row">
        <button onClick={back} disabled={i === 0}>Back</button>
        <button className="btn primary" onClick={next}>{i === total - 1 ? "Finish" : "Next"}</button>
        <button onClick={onClose}>Close guide</button>
      </div>
    </section>
  );
}
