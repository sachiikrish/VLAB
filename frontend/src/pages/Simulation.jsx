import { useState, useEffect, useRef } from "react";
import { playSim, success, wrong } from "../sound.js";
import { useVoiceCommand } from "../useVoice.js";

export default function Simulation({ items, sim, active, voice, onComplete, onResult }) {
  const [step, setStep] = useState(0);
  const [left, setLeft] = useState(items);
  const [held, setHeld] = useState(null);
  const [log, setLog] = useState([]);
  const [msg, setMsg] = useState("Listen to the step, then choose an item from the list.");
  const heading = useRef(null);
  const total = sim.length;
  const done = step >= total;
  const s = sim[step];

  useEffect(() => { if (active && heading.current) heading.current.focus(); }, [step, active]);

  function choose(item) {
    if (done) return;
    if (item.id !== s.item) {
      wrong(); setHeld(null);
      return setMsg(`${item.name} is not needed now. Listen to the step and try again.`);
    }
    if (held !== item.id) {
      playSim("click"); setHeld(item.id);
      return setMsg(`${item.name} selected. Press Enter again to use it.`);
    }
    playSim(s.sound);
    const nextLog = [...log, s.result];
    setLog(nextLog); setHeld(null); setStep(step + 1);
    if (step + 1 === total) {
      setLeft([]);
      setMsg(`${s.result} The experiment is completed successfully.`);
      setTimeout(success, 3000);
      onComplete(nextLog);
    } else {
      setLeft(left.filter((i) => i.id !== item.id || i.reuse));
      setMsg(s.result);
    }
  }

  function restart() { setStep(0); setLeft(items); setHeld(null); setLog([]); setMsg("Simulation restarted."); }

  function arrows(e) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const btns = [...e.currentTarget.querySelectorAll("button")];
    const i = btns.indexOf(document.activeElement);
    btns[(i + (e.key === "ArrowDown" ? 1 : -1) + btns.length) % btns.length]?.focus();
  }

  useVoiceCommand(voice, (t) => {
    if (!active || done) return;
    const hit = left.find((i) => t.includes(i.name.toLowerCase()) || t.includes(i.name.toLowerCase().split(" ")[0]));
    if (hit) choose(hit);
  });

  return (
    <>
      <section aria-labelledby="how-title" className="card instructions">
        <h3 id="how-title">Instructions</h3>
        <ol>
          <li>Use the Up and Down arrow keys, or Tab, to move through the list of items.</li>
          <li>Press Enter once to select the item.</li>
          <li>Press Enter a second time to use the item in the experiment. You will hear its sound.</li>
          <li>If you choose a wrong item, you hear a low buzz and the step stays the same.</li>
          <li>Used items leave the list. The experiment is complete when every step is done.</li>
          <li>With Voice control on, you can say the name of an item.</li>
        </ol>
      </section>

      {done ? (
        <div role="status" className="card">
          <h3>Experiment completed successfully</h3>
          <p>You finished all {total} steps. Open Generate Result to get your full practical file.</p>
          <div className="btn-row">
            <button className="btn primary" onClick={onResult}>Open Generate Result</button>
            <button onClick={restart}>Do it again</button>
          </div>
        </div>
      ) : (
        <>
          <h3 ref={heading} tabIndex={-1}>Step {step + 1} of {total}: {s.text}</h3>
          <ul className="items" onKeyDown={arrows} aria-label="Apparatus and materials">
            {left.map((i) => (
              <li key={i.id}><button aria-pressed={held === i.id} onClick={() => choose(i)}>{i.name}</button></li>
            ))}
          </ul>
        </>
      )}
      <p role="status" aria-live="polite" className="card msg">{msg}</p>
    </>
  );
}
