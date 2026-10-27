"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { SPORTS, seatLabel } from "@/lib/sports";
import type { Holes, PlayerCount, TimeWindow, WalkPref } from "@/lib/types";

export function SearchForm({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const { search, setSearch } = useStore();
  const max = SPORTS[search.sport].max;
  const golf = search.sport === "golf";

  return (
    <form
      className={compact ? "" : "search-card"}
      onSubmit={(e) => {
        e.preventDefault();
        router.push("/results");
      }}
    >
      <div className="fields">
        <label>
          Group
          <select
            value={search.players}
            onChange={(e) => setSearch({ players: Number(e.target.value) as PlayerCount })}
          >
            {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {seatLabel(search.sport, n)}
              </option>
            ))}
          </select>
        </label>
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
        {golf ? (
          <>
            <label>
              Holes
              <select
                value={search.holes}
                onChange={(e) => setSearch({ holes: Number(e.target.value) as Holes })}
              >
                <option value={18}>18</option>
                <option value={9}>9</option>
              </select>
            </label>
            <label>
              Walk
              <select
                value={search.walk}
                onChange={(e) => setSearch({ walk: e.target.value as WalkPref })}
              >
                <option value="walk">Walk</option>
                <option value="ride">Ride</option>
                <option value="either">Either</option>
              </select>
            </label>
          </>
        ) : null}
      </div>
    </form>
  );
}
