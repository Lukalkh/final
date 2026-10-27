"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { suggestedTee } from "@/lib/courses";
import { groupAvg, taken, whenLabel } from "@/lib/group";
import { formatHcp, ruleLabel } from "@/lib/handicap";
import { SPORTS } from "@/lib/sports";
import { useStore } from "@/lib/store";
import { money, priceFor, priceLines, venueById } from "@/lib/venues";

export default function HandoffPage() {
  const { id } = useParams<{ id: string }>();
  const { groups, search, markHandedOff, ready } = useStore();
  const group = groups.find((item) => item.id === id);
  if (!ready) return <p className="lede">Loading…</p>;
  if (!group) return <p className="lede">Group not found.</p>;
  const venue = venueById(group.venueId ?? group.venueIds[0] ?? "");
  if (!venue) return <p className="lede">Pick a venue from the sheets first.</p>;
  const spec = SPORTS[group.sport ?? search.sport];
  const walk = search.walk !== "ride";
  const price = priceFor(venue, walk);
  const tee = group.teeTime ?? suggestedTee(group.window, venue.scarceWeekend);

  return (
    <div className="split">
      <div>
        <p className="kicker">Pay the {spec.venue}</p>
        <h1>{venue.shortName}</h1>
        <p className="lede">
          {whenLabel({ ...group, teeTime: tee })} · {taken(group)} player
          {taken(group) === 1 ? "" : "s"}
          {` · avg ${spec.skill} ${formatHcp(groupAvg(group))}`}
          {` · ${ruleLabel(group.skillRule, spec.skill)}`}
        </p>
        <p className="state">Cancel {venue.cancelHours}h before or the venue keeps the fee.</p>
        <p className="fine" style={{ marginTop: 12 }}>
          {group.members
            .filter((member) => member.rsvp !== "out")
            .map((member) => member.name)
            .join(" · ")}
        </p>
      </div>
      <aside className="panel">
        <p className="fine">Due at the {spec.venue}</p>
        <p className="mono">{money(price.total)}</p>
        <div className="break">{priceLines(venue, price, walk)}</div>
        <button
          className="btn clay wide"
          type="button"
          onClick={() => markHandedOff(group.id)}
        >
          Handed off
        </button>
        {group.state === "handed_off" ? (
          <p className="fine" style={{ marginTop: 10 }}>
            Done. No coupons. Pay there.
          </p>
        ) : (
          <p className="fine" style={{ marginTop: 10 }}>
            Demo only — no live {spec.sheet} yet.
          </p>
        )}
        <Link className="btn ghost wide" href={`/group/${group.id}`}>
          Group
        </Link>
      </aside>
    </div>
  );
}
