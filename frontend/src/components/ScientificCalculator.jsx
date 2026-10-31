import { useState } from "react";
import { Delete } from "lucide-react";
import {
  describeSolution,
  evaluateExpression,
  formatNumber,
  solveQuadratic,
  type QuadraticSolution,
} from "@/lib/calc-engine";

const FN_KEYS = ["sin(", "cos(", "tan(", "log(", "ln("] as const;

const KEY_BASE =
  "min-h-14 select-none rounded-sm border-[3px] border-foreground bg-key font-mono text-lg font-bold text-neon transition-colors hover:bg-key-hover active:bg-key-hover focus-visible:outline-none";

const NUM_KEY = `${KEY_BASE} text-xl`;
const FN_KEY = `${KEY_BASE} text-base`;
const CLEAR_KEY = `${KEY_BASE} bg-destructive text-destructive-foreground hover:bg-destructive/80`;
const EQUALS_KEY =
  "min-h-14 col-span-2 select-none rounded-sm border-[3px] border-foreground bg-neon font-mono text-2xl font-black text-primary-foreground transition-transform hover:brightness-110 active:scale-[0.98] focus-visible:outline-none";

export function ScientificCalculator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [memory, setMemory] = useState<number | null>(null);
  const [eqnMode, setEqnMode] = useState(false);
  const [coeff, setCoeff] = useState({ a: "", b: "", c: "" });
  const [solution, setSolution] = useState<QuadraticSolution | null>(null);

  const push = (token: string) => {
    setExpression((prev) => prev + token);
    setResult(null);
    setMessage("");
  };

  const backspace = () => {
    setExpression((prev) => prev.slice(0, -1));
    setMessage("");
  };

  const clearAll = () => {
    setExpression("");
    setResult(null);
    setMessage("");
  };

  const evaluate = () => {
    try {
      const value = evaluateExpression(expression);
      setResult(formatNumber(value));
      setMessage(`Result: ${formatNumber(value)}`);
    } catch {
      setResult("Error");
      setMessage("Invalid expression — press C to clear");
    }
  };

  const storeMemory = () => {
    try {
      const value = evaluateExpression(expression);
      setMemory(value);
      setMessage(`Memory stored: ${formatNumber(value)}`);
    } catch {
      setMessage("Cannot store memory: current entry is not a valid expression");
    }
  };

  const recallMemory = () => {
    if (memory === null) {
      setMessage("Memory is empty — press MS to store a value first");
      return;
    }
    push(formatNumber(memory));
    setMessage(`Memory recalled: ${formatNumber(memory)}`);
  };

  const solveEquation = () => {
    const a = Number(coeff.a);
    const b = Number(coeff.b);
    const c = Number(coeff.c);
    if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(c)) {
      setSolution(null);
      setMessage("Enter numeric values for A, B and C");
      return;
    }
    try {
      const s = solveQuadratic(a, b, c);
      setSolution(s);
      setMessage(describeSolution(s));
    } catch (err) {
      setSolution(null);
      setMessage(err instanceof Error ? err.message : "Could not solve equation");
    }
  };

  return (
    <section
      aria-label="Scientific calculator"
      className="mx-auto flex w-full max-w-xl flex-col gap-5"
    >
      {/* Display */}
      <output
        aria-label="Calculator display"
        className="min-h-24 rounded-md border-[3px] border-foreground bg-background px-4 py-3 text-right"
      >
        <span className="block truncate font-mono text-sm text-neon-dim" aria-hidden="true">
          {memory !== null ? `M: ${formatNumber(memory)}` : "M: —"} · EQN {eqnMode ? "ON" : "OFF"}
        </span>
        <span className="mt-1 block truncate font-mono text-2xl font-bold text-neon text-glow">
          {result || expression || "0"}
        </span>
      </output>
      <p role="status" aria-live="polite" className="sr-only">
        {message}
      </p>

      {/* Mode switch */}
      <button
        type="button"
        aria-pressed={eqnMode}
        onClick={() => {
          setEqnMode((v) => !v);
          setSolution(null);
          setMessage("");
        }}
        className="min-h-14 rounded-sm border-[3px] border-foreground bg-panel-2 px-4 font-mono text-lg font-bold text-neon transition-colors hover:bg-key-hover"
      >
        EQN Mode {eqnMode ? "ON" : "OFF"}
      </button>

      {eqnMode ? (
        <div
          role="group"
          aria-label="Equation solver: a times x squared plus b times x plus c equals zero"
          className="flex flex-col gap-4 rounded-md border-[3px] border-foreground bg-panel p-4"
        >
          <p className="font-mono text-base text-neon-dim">
            ax² + bx + c = 0 — enter the three coefficients
          </p>
          {(
            [
              { id: "eqn-a", label: "Value A (coefficient of x²)", key: "a" },
              { id: "eqn-b", label: "Value B (coefficient of x)", key: "b" },
              { id: "eqn-c", label: "Value C (constant term)", key: "c" },
            ] as const
          ).map((field) => (
            <div key={field.id} className="flex flex-col gap-1">
              <label htmlFor={field.id} className="font-mono text-sm font-bold text-foreground">
                {field.label}
              </label>
              <input
                id={field.id}
                type="text"
                inputMode="decimal"
                value={coeff[field.key]}
                onChange={(e) => setCoeff((prev) => ({ ...prev, [field.key]: e.target.value }))}
                className="min-h-14 rounded-sm border-[3px] border-foreground bg-background px-3 font-mono text-xl font-bold text-neon focus-visible:outline-none"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={solveEquation}
            className={EQUALS_KEY + " col-span-1"}
          >
            = Solve
          </button>
          <div aria-live="polite" className="min-h-6 font-mono text-base font-bold text-neon">
            {solution ? describeSolution(solution) : message || "Roots will appear here"}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {/* Scientific function row */}
          <div className="grid grid-cols-5 gap-2">
            {FN_KEYS.map((token) => (
              <button
                key={token}
                type="button"
                onClick={() => push(token)}
                className={FN_KEY}
                aria-label={token.replace("(", "")}
              >
                {token.replace("(", "")}
              </button>
            ))}
          </div>
          {/* Main keypad matrix: 5 columns × 5 rows */}
          <div className="grid grid-cols-5 gap-2" role="group" aria-label="Calculator keypad">
            <button type="button" onClick={clearAll} className={CLEAR_KEY} aria-label="Clear all">
              C
            </button>
            <button
              type="button"
              onClick={backspace}
              className={KEY_BASE}
              aria-label="Backspace"
            >
              <Delete className="mx-auto size-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => push("(")} className={KEY_BASE} aria-label="Open parenthesis">
              (
            </button>
            <button type="button" onClick={() => push(")")} className={KEY_BASE} aria-label="Close parenthesis">
              )
            </button>
            <button type="button" onClick={() => push("sqrt(")} className={FN_KEY} aria-label="Square root">
              √
            </button>

            {["7", "8", "9"].map((d) => (
              <button key={d} type="button" onClick={() => push(d)} className={NUM_KEY}>
                {d}
              </button>
            ))}
            <button type="button" onClick={storeMemory} className={FN_KEY} aria-label="Memory store">
              MS
            </button>
            <button type="button" onClick={() => push("/")} className={NUM_KEY} aria-label="Divide">
              ÷
            </button>

            {["4", "5", "6"].map((d) => (
              <button key={d} type="button" onClick={() => push(d)} className={NUM_KEY}>
                {d}
              </button>
            ))}
            <button type="button" onClick={recallMemory} className={FN_KEY} aria-label="Memory recall">
              MR
            </button>
            <button type="button" onClick={() => push("*")} className={NUM_KEY} aria-label="Multiply">
              ×
            </button>

            {["1", "2", "3"].map((d) => (
              <button key={d} type="button" onClick={() => push(d)} className={NUM_KEY}>
                {d}
              </button>
            ))}
            <button type="button" onClick={() => push("^")} className={FN_KEY} aria-label="Power exponent">
              ^
            </button>
            <button type="button" onClick={() => push("-")} className={NUM_KEY} aria-label="Subtract">
              −
            </button>

            <button type="button" onClick={() => push("0")} className={NUM_KEY}>
              0
            </button>
            <button type="button" onClick={() => push(".")} className={NUM_KEY} aria-label="Decimal point">
              .
            </button>
            <button type="button" onClick={() => push("+")} className={NUM_KEY} aria-label="Add">
              +
            </button>
            <button type="button" onClick={evaluate} className={EQUALS_KEY} aria-label="Equals, calculate result">
              =
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
