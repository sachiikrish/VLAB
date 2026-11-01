export default function About() {
  return (
    <article aria-labelledby="about-title" className="prose">
      <h2 id="about-title">About Equilab</h2>

      <h3>Our Mission</h3>
      <p>At Equilab, we believe that scientific curiosity should never be bounded by visual ability. Practical experiments are the bedrock of STEM education, yet millions of students with visual disabilities are systematically excluded from active lab work due to visual-first software design.</p>
      <p>Our mission is to democratize science education by building a fully accessible, web-based virtual laboratory that translates visual practicals, apparatus interactions, and data graphing into rich multi-sensory experiences, enabling visually impaired students to learn, experiment, and analyze independently.</p>

      <h3>The Problem We Are Solving</h3>
      <p>Traditional virtual laboratories (like standard school simulation tools) rely heavily on visual cues, drag-and-drop mouse interactions, and visual-only data representations. For students who rely on screen readers or non-visual interaction:</p>
      <ul>
        <li><strong>Interactive barriers:</strong> Mouse-driven circuit building or chemical pouring isolates keyboard and screen-reader users.</li>
        <li><strong>Graphical exclusion:</strong> Graphs, curves, and data trends are rendered as inaccessible visual images, rendering quantitative analysis impossible.</li>
        <li><strong>Workflow fragmentation:</strong> Students must juggle disjointed external tools to calculate results and write up practical journals manually.</li>
      </ul>
      <p>Equilab bridges this gap by unifying learning, experimentation, data analysis, and report generation into one seamless, keyboard-first web application aligned with school science curricula.</p>

      <h3>Core Innovations &amp; Features</h3>
      <h4>1. Multi-Sensory Audio Graphing (Sonification)</h4>
      <p>Instead of relying on visual plots, Equilab uses state-of-the-art Web Audio API sonification to turn graphs into auditory landscapes:</p>
      <ul>
        <li><strong>X-Axis Spatial Panning:</strong> Stereo audio moves from the left ear to the right ear to indicate horizontal progression.</li>
        <li><strong>Y-Axis Pitch Modulation:</strong> Dynamic frequency shifts allow users to hear values. A higher pitch indicates a higher value, while pitch sweeps instantly convey slopes, peaks, and valleys.</li>
      </ul>
      <h4>2. Screen-Reader &amp; Keyboard-First Architecture</h4>
      <p>Built ground-up following WAI-ARIA standards, the entire platform is 100% navigable using intuitive keyboard shortcuts. Every apparatus state, measurement update, and interactive feedback is narrated in real-time via speech synthesis.</p>
      <h4>3. Integrated Accessible Toolkit</h4>
      <ul>
        <li><strong>Inbuilt Scientific Calculator:</strong> An accessible utility allowing students to perform practical calculations without leaving the experiment environment.</li>
        <li><strong>Automated Lab Record Generation:</strong> Eliminates the bottleneck of manual journal writing by automatically outputting structured, screen-reader-friendly lab reports containing the aim, apparatus, observations, and conclusions.</li>
      </ul>

      <h3>Targeted Curriculum Alignment</h3>
      <p>Equilab is designed to integrate directly into class 6th-8th science programs (NCERT/CBSE standards). By structuring experiments across Physics, Chemistry, and Biology, we ensure that students can follow the exact practical syllabus alongside their peers, transforming passive listeners into active experimenters.</p>

      <h3>Future Vision</h3>
      <p>Starting with interactive, accessible practical modules for Classes 6-8, Equilab is designed to scale across all levels of science education:</p>
      <ul>
        <li><strong>Complete K-12 STEM Curriculum Integration:</strong> Expanding interactive simulations and sonified datasets to cover the complete Classes 6-12 NCERT/CBSE syllabus across Physics, Chemistry, and Biology.</li>
        <li><strong>Higher Education &amp; Undergraduate Practicals:</strong> Building complex, multi-variable virtual simulations tailored for undergraduate B.Sc. and engineering lab practicals (e.g., advanced optics, thermodynamics, and organic chemistry titrations).</li>
        <li><strong>Advanced Haptic Feedback:</strong> Integrating specialized haptic hardware and force-feedback devices to simulate real-world physical friction, resistance, and tactile boundaries during experiments.</li>
        <li><strong>AI-Assisted Voice Co-Pilot:</strong> Incorporating an intelligent speech-to-speech assistant to guide students dynamically, answer queries mid-experiment, and offer personalized feedback based on individual learning speed.</li>
      </ul>
    </article>
  );
}
