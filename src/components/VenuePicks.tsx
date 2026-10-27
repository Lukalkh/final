"use client";

import { SPORTS } from "@/lib/sports";
import type { Sport } from "@/lib/types";
import { venuesFor } from "@/lib/venues";

export function VenuePicks({
  sport,
  picked,
  onChange,
  max = 5,
}: {
  sport: Sport;
  picked: string[];
  onChange: (ids: string[]) => void;
  max?: number;
}) {
  const spec = SPORTS[sport];
  const venues = venuesFor(sport);

  function toggle(id: string) {
    if (picked.includes(id)) {
      onChange(picked.filter((item) => item !== id));
      return;
    }
    if (picked.length >= max) return;
    onChange([...picked, id]);
  }

  return (
    <div>
      <p className="kicker">
        {spec.venue[0].toUpperCase() + spec.venue.slice(1)}s · {picked.length}/{max}
      </p>
      <div className="picks">
        {venues.map((venue) => (
          <button
            key={venue.id}
            type="button"
            data-on={picked.includes(venue.id)}
            onClick={() => toggle(venue.id)}
          >
            {venue.shortName}
          </button>
        ))}
      </div>
    </div>
  );
}
