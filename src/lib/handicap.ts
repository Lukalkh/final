import type { HandicapRule } from "./types";

export const defaultRule: HandicapRule = { kind: "none", value: 18 };

export function formatHcp(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

export function averageHcp(values: number[]): number {
  if (values.length === 0) return 0;
  const raw = values.reduce((sum, n) => sum + n, 0) / values.length;
  return Math.round(raw * 10) / 10;
}

export function fitsRule(handicap: number, rule?: HandicapRule): boolean {
  if (!rule || rule.kind === "none") return true;
  if (rule.kind === "below") return handicap < rule.value;
  return handicap > rule.value;
}

export function ruleLabel(rule?: HandicapRule, skill = "HCP"): string {
  if (!rule || rule.kind === "none") return `Any ${skill}`;
  return rule.kind === "below"
    ? `${skill} below ${formatHcp(rule.value)}`
    : `${skill} above ${formatHcp(rule.value)}`;
}
