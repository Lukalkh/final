"use client";

import Link from "next/link";
import { Dots } from "@/components/Seats";
import { groupAvg, remaining, taken, whenLabel, youIn } from "@/lib/group";
import { fitsRule, formatHcp, ruleLabel } from "@/lib/handicap";
import { SPORTS } from "@/lib/sports";
import type { Group } from "@/lib/types";
import { venueNames } from "@/lib/venues";

export function GroupCard({
  group,
  you,
  action,
  onJoin,
}: {
  group: Group;
  you: number;
  action?: string;
  onJoin?: () => void;
}) {
  const spec = SPORTS[group.sport];
  const ok = fitsRule(you, group.skillRule);
  const mine = Boolean(youIn(group) || group.ownedByYou);
  const seats = remaining(group);
  const label = action ?? (group.kind === "pair" ? "Pair up" : "Ask to join");

  return (
    <article className="card">
      <Dots filled={taken(group)} max={group.cap} />
      <h3>{group.name}</h3>
      <p className="fine">
        Avg {spec.skill} {formatHcp(groupAvg(group))} · {ruleLabel(group.skillRule, spec.skill)}
      </p>
      <p className="fine">
        {venueNames(group.venueIds).join(" / ") || "Any"} · {whenLabel(group)}
      </p>
      <p className="fine">
        {seats === 0 ? "Full" : `${seats} open`}
        {group.state === "ready" ? " · ready for a sheet" : ""}
      </p>
      {mine ? (
        <Link className="btn ghost" href={`/group/${group.id}`}>
          Open
        </Link>
      ) : onJoin ? (
        <>
          <button className="btn clay" type="button" onClick={onJoin} disabled={!ok || seats === 0}>
            {label}
          </button>
          {ok ? null : (
            <p className="fine">
              Your {spec.skill} {formatHcp(you)} does not meet {ruleLabel(group.skillRule, spec.skill)}.
            </p>
          )}
        </>
      ) : null}
    </article>
  );
}
