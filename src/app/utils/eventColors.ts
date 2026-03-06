/**
 * Single source of truth for event display colors.
 *
 * Priority rule:
 *   1. If the event has a courseId → ALWAYS use the live course color from
 *      courseColors, regardless of event type (class, study, tutor, assignment).
 *   2. Otherwise fall back to type-based defaults.
 *
 * Using inline CSS via style={{ background }} so Tailwind's static scanner
 * never needs to parse dynamic hex values.
 */

export interface EventColorResult {
  /** CSS gradient string — use as style={{ background: gradient }} */
  gradient: string;
  /** Solid mid-point color — chips, badges, icons */
  solid: string;
}

/** Slightly darken a hex color for the gradient `to` stop */
function darken(hex: string, amount = 28): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return hex;
  const r = Math.max(0, parseInt(clean.slice(0, 2), 16) - amount);
  const g = Math.max(0, parseInt(clean.slice(2, 4), 16) - amount);
  const b = Math.max(0, parseInt(clean.slice(4, 6), 16) - amount);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/** Normalise rgb(…) or any hex string to a 6-digit hex */
function toHex(color: string): string {
  if (!color) return "#5b7ceb";
  if (color.startsWith("#")) return color;
  const m = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (m) {
    return (
      "#" +
      [m[1], m[2], m[3]]
        .map((n) => parseInt(n).toString(16).padStart(2, "0"))
        .join("")
    );
  }
  return color;
}

/** Build a gradient + solid pair from a single base color */
function fromBase(base: string): EventColorResult {
  const hex = toHex(base);
  return {
    gradient: `linear-gradient(135deg, ${hex}, ${darken(hex)})`,
    solid: hex,
  };
}

// ─── Type-based fallbacks (used only when no courseId is present) ─────────────
const TYPE_DEFAULTS: Record<string, EventColorResult> = {
  tutor:      { gradient: "linear-gradient(135deg, #f59e0b, #d97706)", solid: "#f59e0b" },
  study:      { gradient: "linear-gradient(135deg, #14b8a6, #06b6d4)", solid: "#14b8a6" },
  assignment: { gradient: "linear-gradient(135deg, #ef4444, #f97316)", solid: "#ef4444" },
  class:      { gradient: "linear-gradient(135deg, #5b7ceb, #7c3aed)", solid: "#5b7ceb" },
};

export function getEventColors(
  event: {
    type: string;
    color?: string;
    courseId?: number;
  },
  courseColors: Record<number, string>
): EventColorResult {
  // ── Rule 1: courseId present → live course color wins for ALL types ─────────
  if (event.courseId != null) {
    const base = courseColors[event.courseId];
    if (base) return fromBase(base);
  }

  // ── Rule 1.5: custom hex color stored on the event (user-created deadlines) ─
  if (event.color && event.color.startsWith("#")) return fromBase(event.color);

  // ── Rule 2: type-based defaults ────────────────────────────────────────────
  return TYPE_DEFAULTS[event.type] ?? TYPE_DEFAULTS.class;
}