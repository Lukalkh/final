"use client";

import { SPORTS } from "@/lib/sports";
import type { HandicapRule, Sport } from "@/lib/types";

export function HandicapRuleFields({
  rule,
  onChange,
  sport,
}: {
  rule: HandicapRule;
  onChange: (rule: HandicapRule) => void;
  sport: Sport;
}) {
  const spec = SPORTS[sport];
  return (
    <div className="rule-fields">
      <label>
        {spec.skill} limit
        <select
          value={rule.kind}
          onChange={(e) =>
            onChange({
              kind: e.target.value as HandicapRule["kind"],
              value: rule.value || spec.defaultLimit,
            })
          }
        >
          <option value="none">No limit</option>
          <option value="below">Must be below</option>
          <option value="above">Must be above</option>
        </select>
      </label>
      {rule.kind !== "none" ? (
        <label>
          {rule.kind === "below" ? "Below" : "Above"}
          <input
            type="number"
            min={0}
            max={spec.skillMax}
            step={spec.skillStep}
            value={rule.value}
            onChange={(e) => onChange({ ...rule, value: Number(e.target.value) })}
          />
        </label>
      ) : null}
    </div>
  );
}
