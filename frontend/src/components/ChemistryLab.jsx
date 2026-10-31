import { useState } from "react";
import { FlaskConical, RotateCcw, Zap } from "lucide-react";
import {
  BASE_HEAT_CELSIUS,
  CHEMICALS,
  COMPONENT_A_KEYS,
  COMPONENT_B_KEYS,
  EXPERIMENT_CATALOG,
  runReaction,
  type BeakerState,
  type ChemKey,
  type LabStatus,
} from "@/lib/reactions";

const LIQUID_CLASS: Record<BeakerState, string> = {
  idle: "bg-liquid-idle",
  neutralized: "bg-status-green",
  precipitate: "bg-status-blue",
  solution: "bg-status-blue",
  gas: "bg-status-cyan",
  alert: "bg-status-yellow",
};

const BEAKER_LABEL: Record<BeakerState, string> = {
  idle: "Beaker is empty and ready for an experiment",
  neutralized: "Beaker shows a bright green solution: acid-base neutralization",
  precipitate: "Beaker shows a deep blue mixture: stable precipitate",
  solution: "Beaker shows a clear blue solution: dissolved copper sulfate",
  gas: "Beaker shows an effervescent cyan mixture: carbon dioxide gas release",
  alert: "Beaker shows a bright yellow mixture: active alert",
};

const CHOICE_CLASS =
  "flex min-h-16 cursor-pointer items-center justify-between gap-3 rounded-sm border-[3px] border-foreground bg-key px-4 font-mono transition-colors has-[:checked]:bg-neon has-[:checked]:text-primary-foreground hover:bg-key-hover";

interface LogEntry {
  time: string;
  text: string;
}

function now(): string {
  return new Date().toLocaleTimeString("en-GB", { hour12: false });
}

export function ChemistryLab() {
  const [componentA, setComponentA] = useState<ChemKey | null>(null);
  const [componentB, setComponentB] = useState<ChemKey | null>(null);
  const [beakerState, setBeakerState] = useState<BeakerState>("idle");
  const [heat, setHeat] = useState(BASE_HEAT_CELSIUS);
  const [status, setStatus] = useState<LabStatus>("ACTIVE");
  const [headline, setHeadline] = useState("Workbench ready");
  const [detail, setDetail] = useState("Pick a preset experiment or select two chemicals, then press Execute Reaction.");
  const [log, setLog] = useState<LogEntry[]>([]);

  const addLog = (lines: string[]) => {
    setLog((prev) => [...lines.map((text) => ({ time: now(), text })), ...prev].slice(0, 50));
  };

  const loadPreset = (presetId: string) => {
    const experiment = EXPERIMENT_CATALOG.find((entry) => entry.id === presetId);
    if (!experiment) return;
    setComponentA(experiment.a);
    setComponentB(experiment.b);
    addLog([`Preset experiment loaded: ${experiment.label}`]);
  };

  const execute = () => {
    if (!componentA || !componentB) {
      setBeakerState("alert");
      setStatus("ALERT");
      setHeadline("Active alert: selection incomplete");
      setDetail("Choose both Component A and Component B before executing a reaction.");
      addLog(["Execute pressed with an incomplete selection — alert raised"]);
      return;
    }
    const outcome = runReaction(componentA, componentB);
    if (!outcome) return;
    setBeakerState(outcome.state);
    setHeat(outcome.heat);
    setStatus(outcome.status);
    setHeadline(outcome.headline);
    setDetail(outcome.detail);
    addLog(outcome.logLines);
  };

  const reset = () => {
    setComponentA(null);
    setComponentB(null);
    setBeakerState("idle");
    setHeat(BASE_HEAT_CELSIUS);
    setStatus("ACTIVE");
    setHeadline("Workbench ready");
    setDetail("All states wiped clean. Select two chemicals and press Execute Reaction.");
    setLog([]);
    addLog(["Reset Lab — all states wiped clean"]);
  };

  const renderChoice = (key: ChemKey, name: string, group: "A" | "B") => {
    const selected = group === "A" ? componentA === key : componentB === key;
    return (
      <label key={key} className={CHOICE_CLASS}>
        <input
          type="radio"
          name={`component-${group}`}
          value={key}
          checked={selected}
          onChange={() => (group === "A" ? setComponentA(key) : setComponentB(key))}
          className="sr-only"
          aria-label={`${name} as Component ${group}`}
        />
        <span className="text-base font-bold">{name}</span>
        <span className="text-sm text-neon-dim has-[:checked]:text-primary-foreground">
          {CHEMICALS[key].formula}
        </span>
      </label>
    );
  };

  return (
    <section aria-label="Chemistry lab — titration and reaction solver" className="flex flex-col gap-5">
      {/* Preset experiment selector */}
      <div className="flex flex-col gap-1">
        <label htmlFor="chemistry-experiment" className="font-mono text-base font-black text-neon">
          Preset Experiment
        </label>
        <select
          id="chemistry-experiment"
          onChange={(event) => loadPreset(event.target.value)}
          value=""
          className="min-h-16 rounded-sm border-[3px] border-foreground bg-key px-3 font-mono text-lg font-bold text-neon focus-visible:outline-none"
        >
          <option value="" disabled>
            Choose an experiment to load…
          </option>
          {EXPERIMENT_CATALOG.map((experiment) => (
            <option key={experiment.id} value={experiment.id}>
              {experiment.label}
            </option>
          ))}
        </select>
        <p className="font-mono text-sm text-neon-dim">
          Loading a preset fills both chemical selectors — you can still override them by hand.
        </p>
      </div>

      {/* Metrics header */}
      <div
        aria-live="polite"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        aria-label="Workbench metrics"
      >
        <div className="rounded-md border-[3px] border-foreground bg-panel px-4 py-3">
          <span className="block font-mono text-sm text-neon-dim">HEAT GAUGE</span>
          <span className="font-mono text-2xl font-black text-neon text-glow">{heat}°C</span>
        </div>
        <div className="rounded-md border-[3px] border-foreground bg-panel px-4 py-3">
          <span className="block font-mono text-sm text-neon-dim">STATUS</span>
          <span className="font-mono text-2xl font-black text-neon text-glow">{status}</span>
        </div>
      </div>

      {/* Virtual beaker */}
      <div
        className="relative mx-auto flex h-72 w-full max-w-sm flex-col justify-end overflow-hidden rounded-b-4xl rounded-t-sm border-[3px] border-foreground bg-panel"
        role="img"
        aria-label={BEAKER_LABEL[beakerState]}
      >
        {beakerState !== "idle" && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center gap-4">
            {(beakerState === "gas" ? [0, 0.4, 0.8, 1.2, 1.6, 2] : [0, 0.8, 1.6]).map((delay) => (
              <span
                key={delay}
                className="bubble-rise size-3 rounded-full bg-background/40"
                style={{ animationDelay: `${delay}s` }}
              />
            ))}
          </div>
        )}
        <div
          className={`h-40 w-full rounded-b-4xl transition-colors duration-700 ${LIQUID_CLASS[beakerState]}`}
        />
        <div aria-hidden="true" className="absolute left-3 top-3 h-16 w-1 rounded-full bg-foreground/20" />
      </div>

      <div aria-live="polite" className="rounded-md border-[3px] border-foreground bg-panel px-4 py-3">
        <p className="font-mono text-lg font-black text-neon text-glow">{headline}</p>
        <p className="mt-1 font-mono text-sm text-foreground">{detail}</p>
      </div>

      {/* Component selection */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 font-mono text-base font-black text-neon">
            Chemical Component A
          </legend>
          {COMPONENT_A_KEYS.map((key) =>
            renderChoice(key, CHEMICALS[key].name, "A"),
          )}
        </fieldset>
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 font-mono text-base font-black text-neon">
            Chemical Component B
          </legend>
          {COMPONENT_B_KEYS.map((key) =>
            renderChoice(key, CHEMICALS[key].name, "B"),
          )}
        </fieldset>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={execute}
          className="flex min-h-16 items-center justify-center gap-3 rounded-sm border-[3px] border-foreground bg-neon px-4 font-mono text-lg font-black text-primary-foreground transition-transform hover:brightness-110 active:scale-[0.98]"
        >
          <Zap className="size-6" aria-hidden="true" />
          Execute Reaction
        </button>
        <button
          type="button"
          onClick={reset}
          className="flex min-h-16 items-center justify-center gap-3 rounded-sm border-[3px] border-foreground bg-panel-2 px-4 font-mono text-lg font-black text-neon transition-colors hover:bg-key-hover"
        >
          <RotateCcw className="size-6" aria-hidden="true" />
          Reset Lab
        </button>
      </div>

      {/* Reaction log */}
      <div className="flex flex-col gap-2">
        <h3 className="flex items-center gap-2 font-mono text-base font-black text-neon">
          <FlaskConical className="size-5" aria-hidden="true" />
          Reaction Log
        </h3>
        <div
          role="log"
          aria-live="polite"
          aria-label="Reaction log, newest entries first"
          className="flex h-44 flex-col gap-1 overflow-y-auto rounded-md border-[3px] border-foreground bg-background p-3"
        >
          {log.length === 0 ? (
            <p className="font-mono text-sm text-neon-dim">No reactions logged yet.</p>
          ) : (
            log.map((entry, index) => (
              <p key={`${entry.time}-${index}`} className="font-mono text-sm text-foreground">
                <span className="text-neon-dim">[{entry.time}]</span> {entry.text}
              </p>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
