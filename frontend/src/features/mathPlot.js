import { compile } from "mathjs";

const MAX_POINTS = 1000;
const round9 = (n) => Math.round(n * 1e9) / 1e9;
const round4 = (n) => Math.round(n * 1e4) / 1e4; // keeps spoken y-values short

// Turns "y = 2x + 1" (or "sin(x)", "x^2 - 3") into points, sampling x from..to every inc.
export function pointsFromEquation(text, from, to, inc) {
  let expr = String(text).trim().replace(/^(y|f\s*\(\s*x\s*\))\s*=\s*/i, "");
  if (!expr) throw new Error("Type an equation such as y = 2x + 1.");
  if (expr.includes("=")) throw new Error("Use the form y = ... with x as the variable.");

  const a = parseFloat(from);
  const b = parseFloat(to);
  const s = parseFloat(inc);
  if (![a, b, s].every(Number.isFinite)) throw new Error("From, To and Increment must be numbers.");
  if (s <= 0) throw new Error("Increment must be greater than zero.");
  if (b < a) throw new Error("To must be greater than or equal to From.");

  const count = Math.floor((b - a) / s + 1e-9) + 1;
  if (count > MAX_POINTS) {
    throw new Error(`That would make ${count} points. The limit is ${MAX_POINTS}. Use a larger increment.`);
  }

  let fn;
  try {
    fn = compile(expr);
  } catch (e) {
    throw new Error(`Could not read the equation. ${e.message}`);
  }

  const points = [];
  let skipped = 0;
  for (let i = 0; i < count; i++) {
    const x = round9(a + i * s);
    let y;
    try {
      y = fn.evaluate({ x });
    } catch (e) {
      throw new Error(`Could not evaluate the equation. ${e.message}`);
    }
    if (typeof y === "number" && Number.isFinite(y)) points.push({ x, y: round4(y) });
    else skipped++; // undefined here, e.g. 1/x at 0 or sqrt of a negative
  }
  if (!points.length) throw new Error("The equation gave no valid points in that range.");
  return { points, skipped, expr };
}

// Reads "(0,0), (1,2)" or "0,0; 1,2" or one "x y" pair per line.
export function parsePointsText(text) {
  const nums = String(text).match(/[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g) || [];
  if (!nums.length) throw new Error("No numbers found. Type points like (0,0), (1,2), (2,4).");
  if (nums.length % 2) throw new Error("Each point needs an x and a y value, but the number of values is odd.");
  if (nums.length / 2 > MAX_POINTS) throw new Error(`Too many points. The limit is ${MAX_POINTS}.`);
  const points = [];
  for (let i = 0; i < nums.length; i += 2) points.push({ x: Number(nums[i]), y: Number(nums[i + 1]) });
  return points;
}
