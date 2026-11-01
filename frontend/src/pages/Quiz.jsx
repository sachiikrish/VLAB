import { useState } from "react";
import { experiments, quizzes } from "../data.js";
import { success, wrong } from "../sound.js";
import { useVoiceCommand } from "../useVoice.js";

const numbers = { one: 0, "1": 0, two: 1, "2": 1, three: 2, "3": 2 };

export default function Quiz({ classLevel, voice }) {
  const questions = experiments.filter((e) => e.classLevel === classLevel).map((e) => quizzes[e.id]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const [done, setDone] = useState(false);
  const q = questions[idx];

  function answer(i) {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answer) { setScore(score + 1); success(); } else wrong();
  }
  function next() {
    if (picked === null) return;
    if (idx + 1 < questions.length) { setIdx(idx + 1); setPicked(null); } else setDone(true);
  }
  function restart() { setIdx(0); setScore(0); setPicked(null); setDone(false); }

  useVoiceCommand(voice, (t) => {
    const n = (t.match(/\b(one|two|three|1|2|3)\b/) || [])[1];
    if (t.includes("next")) next();
    else if (n !== undefined && !done && numbers[n] < q.options.length) answer(numbers[n]);
  });

  if (done) {
    return (
      <>
        <h3>Quiz finished</h3>
        <p role="status" className="step-big">You scored {score} out of {questions.length}.</p>
        <button className="btn primary" onClick={restart}>Try again</button>
      </>
    );
  }

  return (
    <section aria-labelledby="quiz-title">
      <h3 id="quiz-title">Class {classLevel} quiz: question {idx + 1} of {questions.length}</h3>
      <p className="step-big">{q.q}</p>
      <div className="btn-row">
        {q.options.map((o, i) => (
          <button key={o} onClick={() => answer(i)} aria-pressed={picked === i}>{i + 1}. {o}</button>
        ))}
      </div>
      <p aria-live="polite" className="count">
        {picked === null ? "" : picked === q.answer ? "Correct." : `Not quite. The answer is ${q.options[q.answer]}.`}
      </p>
      <button className="btn primary" onClick={next} disabled={picked === null}>
        {idx + 1 < questions.length ? "Next question" : "See score"}
      </button>
    </section>
  );
}
