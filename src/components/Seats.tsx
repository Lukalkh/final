"use client";

import { useStore } from "@/lib/store";
import { SPORTS, seatLabel } from "@/lib/sports";
import type { PlayerCount } from "@/lib/types";

export function Dots({
  filled,
  max = 4,
  ink = false,
}: {
  filled: number;
  max?: number;
  ink?: boolean;
}) {
  const cells = max === 2 ? [1, 2] : [1, 2, 3, 4];
  return (
    <span className={ink ? "dots ink" : "dots"} data-max={max} aria-hidden>
      {cells.map((n) => (
        <i key={n} className={n <= filled ? "on" : undefined} />
      ))}
    </span>
  );
}

export function SeatPicker() {
  const { search, setSearch } = useStore();
  const max = SPORTS[search.sport].max;
  const options = Array.from({ length: max }, (_, i) => (i + 1) as PlayerCount);

  return (
    <div>
      <p className="kicker">Already in your group</p>
      <div className="seats" data-count={max}>
        {options.map((n) => (
          <button
            key={n}
            type="button"
            data-on={search.players === n}
            onClick={() => setSearch({ players: n })}
          >
            <Dots filled={n} max={max} ink={search.players === n} />
            <span>{seatLabel(search.sport, n)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
