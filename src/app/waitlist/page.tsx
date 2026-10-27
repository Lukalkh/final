"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { windowLabel } from "@/lib/courses";
import { SPORTS } from "@/lib/sports";
import { useStore } from "@/lib/store";
import { venueById, venuesFor } from "@/lib/venues";

function leftLabel(until?: number, now = Date.now()) {
  if (!until) return "";
  const left = Math.max(0, until - now);
  const mins = Math.floor(left / 60000);
  const secs = Math.floor((left % 60000) / 1000);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function WaitlistForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { search, watches, addWatch, pingWatch, clearOffer, removeWatch, claimWatch } = useStore();
  const venues = venuesFor(search.sport);
  const spec = SPORTS[search.sport];
  const preset = params.get("course");
  const [picked, setPicked] = useState<string[]>(
    preset ? [preset] : venues.slice(0, 4).map((venue) => venue.id),
  );
  const [now, setNow] = useState(Date.now());
  const mine = watches.filter((watch) => watch.sport === search.sport);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    mine.forEach((watch) => {
      if (watch.offerUntil && watch.offerUntil < now) clearOffer(watch.id);
    });
  }, [mine, now, clearOffer]);

  const selected = useMemo(
    () => picked.map((id) => venues.find((venue) => venue.id === id)).filter(Boolean),
    [picked, venues],
  );

  function toggle(id: string) {
    setPicked((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 5) return prev;
      return [...prev, id];
    });
  }

  function submit() {
    if (picked.length === 0) return;
    addWatch({
      sport: search.sport,
      date: search.date,
      window: search.window,
      players: search.players,
      venueIds: picked,
    });
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <h1>Hold for a matching cancel</h1>
      <p className="lede">
        Up to 5 {spec.venue}s. We ping your headcount only. 15 minutes. No auto-charge.
      </p>
      {mine.length ? (
        <section className="block" style={{ marginTop: 20 }}>
          <p className="kicker">Watching</p>
          {mine.map((watch) => {
            const offer = watch.offerVenueId ? venueById(watch.offerVenueId) : undefined;
            const live = Boolean(offer && watch.offerUntil && watch.offerUntil > now);
            return (
              <article key={watch.id} className={live ? "row offer" : "row"}>
                <div>
                  <h2>{live ? offer?.shortName : `${watch.venueIds.length} ${spec.venue}s`}</h2>
                  <p className="fine">
                    {watch.date} · {windowLabel(watch.window)} · {watch.players}
                    {live ? ` · ${leftLabel(watch.offerUntil, now)}` : ""}
                  </p>
                </div>
                <div className="row-actions">
                  {live ? (
                    <button
                      className="btn clay"
                      type="button"
                      onClick={() => {
                        const group = claimWatch(watch.id);
                        if (group) router.push(`/handoff/${group.id}`);
                      }}
                    >
                      Claim
                    </button>
                  ) : (
                    <button className="btn ghost" type="button" onClick={() => pingWatch(watch.id)}>
                      Demo cancel
                    </button>
                  )}
                  <button className="btn link" type="button" onClick={() => removeWatch(watch.id)}>
                    Drop
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      ) : null}
      <form
        className="panel"
        style={{ marginTop: 20 }}
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <p className="fine">
          {search.date} · {windowLabel(search.window)} · {search.players} · {selected.length}/5
        </p>
        <div className="checks">
          {venues.map((venue) => (
            <label key={venue.id} className="check">
              <input
                type="checkbox"
                checked={picked.includes(venue.id)}
                onChange={() => toggle(venue.id)}
              />
              {venue.shortName}
              <span className="fine">
                {venue.city}, {venue.state}
              </span>
            </label>
          ))}
        </div>
        <button className="btn clay wide" type="button" disabled={picked.length === 0} onClick={submit}>
          Watch
        </button>
      </form>
      <p style={{ marginTop: 16 }}>
        <Link className="btn link" href="/yours">
          See yours
        </Link>
      </p>
    </div>
  );
}

function WaitlistKeyed() {
  const { search } = useStore();
  return <WaitlistForm key={search.sport} />;
}

export default function WaitlistPage() {
  return (
    <Suspense fallback={<p className="lede">Loading…</p>}>
      <WaitlistKeyed />
    </Suspense>
  );
}
