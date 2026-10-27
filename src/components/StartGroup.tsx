"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { HandicapRuleFields } from "@/components/HandicapRuleFields";
import { SeatPicker } from "@/components/Seats";
import { VenuePicks } from "@/components/VenuePicks";
import { formatHcp } from "@/lib/handicap";
import { SPORTS, isFull, skillOf } from "@/lib/sports";
import { useStore } from "@/lib/store";
import type { HandicapRule, TimeWindow } from "@/lib/types";
import { venuesFor } from "@/lib/venues";

export function StartGroup() {
  const router = useRouter();
  const { profile, search, setSearch, postGroup } = useStore();
  const spec = SPORTS[search.sport];
  const skill = skillOf(profile, search.sport);
  const venues = venuesFor(search.sport);
  const [rule, setRule] = useState<HandicapRule>({ kind: "none", value: spec.defaultLimit });
  const [picked, setPicked] = useState<string[]>(venues.slice(0, 3).map((venue) => venue.id));
  const full = isFull(search.sport, search.players);

  function submit() {
    if (full) {
      const group = postGroup({
        venueIds: picked.length ? picked : venues.slice(0, 1).map((venue) => venue.id),
        skillRule: rule,
      });
      router.push(`/results?group=${group.id}`);
      return;
    }
    if (picked.length === 0) return;
    const group = postGroup({ venueIds: picked, skillRule: rule });
    router.push(`/group/${group.id}`);
  }

  return (
    <div className="search-card">
      <SeatPicker />
      <div className="fields later">
        <label>
          Date
          <input
            type="date"
            value={search.date}
            onChange={(e) => setSearch({ date: e.target.value })}
          />
        </label>
        <label>
          Window
          <select
            value={search.window}
            onChange={(e) => setSearch({ window: e.target.value as TimeWindow })}
          >
            <option value="early">Early</option>
            <option value="mid">Midday</option>
            <option value="twilight">Twilight</option>
            <option value="any">Any</option>
          </select>
        </label>
        <div style={{ gridColumn: "span 2" }}>
          <HandicapRuleFields sport={search.sport} rule={rule} onChange={setRule} />
        </div>
      </div>
      <div style={{ marginTop: 14 }}>
        <VenuePicks sport={search.sport} picked={picked} onChange={setPicked} />
      </div>
      <p className="fine" style={{ marginTop: 10 }}>
        Your {spec.skill} {formatHcp(skill)}. The group posts first. A {spec.sheet} comes after
        people say yes.
      </p>
      <button className="btn clay wide" type="button" onClick={submit} disabled={!full && picked.length === 0}>
        {full ? `Group is full — see ${spec.sheet}s` : "Post the group"}
      </button>
    </div>
  );
}
