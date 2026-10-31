// Landing page. Edit the arrays below to change the text.

const steps = [
  { title: "Log in", text: "Enter your name and choose your class. No fees, no password." },
  { title: "Pick an experiment", text: "Search or filter by class and subject." },
  { title: "Listen and do", text: "Hear each step read aloud, then try it with real objects at home or in class." },
];

const features = [
  { title: "Screen reader ready", text: "Works with NVDA, JAWS, VoiceOver and TalkBack. Every button and result is labelled." },
  { title: "Read aloud", text: "Every experiment can be spoken step by step, so you never have to read the screen." },
  { title: "Made for low vision", text: "Large text, strong contrast and a font designed for easy reading. You choose the settings." },
  { title: "Keyboard only", text: "Move with Tab, select with Enter. No mouse needed anywhere on the site." },
];

const classes = [
  { level: "Class 6", topics: "Separating mixtures, parts of a flower, float and sink" },
  { level: "Class 7", topics: "Acids and bases, heat in metals, plant growth" },
  { level: "Class 8", topics: "Electric circuits, cells, chemical change" },
];

// Braille dots: each letter lists which of the 6 dots are raised.
const LAB = [[1, 2, 3], [1], [1, 2]];
const dotOrder = [1, 4, 2, 5, 3, 6];

function Braille({ word }) {
  return (
    <div className="braille">
      {word.map((dots, i) => (
        <div className="cell" key={i}>
          {dotOrder.map((n) => <span key={n} className={dots.includes(n) ? "dot on" : "dot"} />)}
        </div>
      ))}
    </div>
  );
}

export default function Landing({ onStart }) {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div>
          <h2 id="hero-title">Science you can hear, touch and understand.</h2>
          <p className="lead">
            Virtual Lab is a free science lab for blind and low vision students in classes 6 to 8.
          </p>
          <div className="actions">
            <button className="btn primary" onClick={onStart}>Start experimenting</button>
            <a className="btn ghost" href="#how">See how it works</a>
          </div>
        </div>
        <figure role="img" aria-label="The word LAB written in Braille dots">
          <Braille word={LAB} />
          <figcaption>“LAB” in Braille</figcaption>
        </figure>
      </section>

      <ul className="facts" aria-label="Key facts">
        <li><strong>Classes 6 to 8</strong> Built for middle school</li>
        <li><strong>3 subjects</strong> Physics, Chemistry, Biology</li>
        <li><strong>100% free</strong> No fees and no ads</li>
        <li><strong>Audio first</strong> Every step can be heard</li>
      </ul>

      <section id="how" aria-labelledby="how-title" className="block">
        <h2 id="how-title">How it works</h2>
        <ol className="grid steps-row">
          {steps.map((s) => (
            <li key={s.title} className="card"><h3>{s.title}</h3><p>{s.text}</p></li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="feat-title" className="block">
        <h2 id="feat-title">Designed for every student</h2>
        <ul className="grid">
          {features.map((f) => (
            <li key={f.title} className="card"><h3>{f.title}</h3><p>{f.text}</p></li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="class-title" className="block">
        <h2 id="class-title">Experiments for your class</h2>
        <ul className="grid">
          {classes.map((c) => (
            <li key={c.level} className="card"><h3>{c.level}</h3><p>{c.topics}</p></li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="why-title" className="block mission">
        <h2 id="why-title">Why we built Virtual Lab</h2>
        <p>
          Most science lessons depend on seeing a board, a beaker or a diagram. Students who are blind or have low vision
          are often left watching from the side. Virtual Lab turns each experiment into clear spoken steps and hands-on
          activities, so every student can take part and learn by doing.
        </p>
      </section>

      <section aria-labelledby="cta-title" className="cta">
        <h2 id="cta-title">Ready for your first experiment?</h2>
        <button className="btn primary" onClick={onStart}>Log in and start</button>
      </section>
    </>
  );
}
