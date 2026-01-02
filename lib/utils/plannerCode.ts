/**
 * Generates a unique 6-character alphanumeric code for planners.
 * Uses uppercase letters and numbers, excluding ambiguous characters (0, O, I, L, 1).
 */
export function generatePlannerCode(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Formats a planner code for display (e.g., "ABCDEF" -> "ABC-DEF").
 */
export function formatPlannerCode(code: string): string {
  if (code.length !== 6) return code;
  return `${code.slice(0, 3)}-${code.slice(3)}`;
}

/**
 * Normalizes a user-entered planner code (removes dashes/spaces, uppercases).
 */
export function normalizePlannerCode(code: string): string {
  return code.replace(/[^A-Z0-9]/gi, "").toUpperCase();
}
