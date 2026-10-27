"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Dots } from "@/components/Seats";
import { remaining, taken, whenLabel, yours } from "@/lib/group";
import { SPORTS } from "@/lib/sports";
import { useStore } from "@/lib/store";
import { venueById, venueNames } from "@/lib/venues";

function leftLabel(until?: number, now = Date.now()) {
  if (!until) return "";
  const left = Math.max(0, until - now);
  const mins = Math.floor(left / 60000);
  const secs = Math.floor((left % 60000) / 1000);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

export default function YoursPage() {
  const router = useRouter();
  const { groups, watches, search, pingWatch, clearOffer, removeWatch, claimWatch } = useStore();
  const [now, setNow] = useState(Date.now());
  const mine = yours(groups);
  const sportWatches = watches.filter((watch) => watch.sport === search.sport);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    sportWatches.forEach((watch) => {
      if (watch.offerUntil && watch.offerUntil < now) clearOffer(watch.id);
    });
  }, [now, sportWatches, clearOffer]);

  return (
    <>
      <h1>Your rounds</h1>
      <p className="lede">Groups you posted or joined, and holds waiting on a cancel.</p>
      <section className="block">
        <div className="block-head">
          <h2>Groups</h2>
          <p className="fine">{mine.length ? `${mine.length} open or done` : "None yet"}</p>
        </div>
        {mine.length ? (
          mine.map((group) => {
            const spec = SPORTS[group.sport];
            return (
              <article key={group.id} className="row">
                <div>
                  <h2>
                    <Link href={`/group/${group.id}`}>{group.name}</Link>
                  </h2>
                  <p className="fine">
                    {spec.label} · {whenLabel(group)} ·{" "}
                    {venueById(group.venueId ?? "")?.shortName ?? venueNames(group.venueIds).slice(0, 2).join(" / ")}
                  </p>
                  <p className="fine">
                    <Dots filled={taken(group)} max={group.cap} /> {taken(group)}/{group.cap}
                    {group.state === "handed_off" ? " · handed off" : remaining(group) === 0 ? " · ready" : ""}
                  </p>
                </div>
                <Link className="btn ghost" href={`/group/${group.id}`}>
                  Open
                </Link>
              </article>
            );
          })
        ) : (
          <p className="fine" style={{ marginTop: 12 }}>
            Post or join a group on the board.
          </p>
        )}
      </section>
      <section className="block">
        <div className="block-head">
          <h2>Holds</h2>
          <p className="fine">{sportWatches.length ? `${sportWatches.length} watching` : "None"}</p>
        </div>
        {sportWatches.map((watch) => {
          const offer = watch.offerVenueId ? venueById(watch.offerVenueId) : undefined;
          const live = Boolean(offer && watch.offerUntil && watch.offerUntil > now);
          return (
            <article key={watch.id} className={live ? "row offer" : "row"}>
              <div>
                <h2>{live ? offer?.shortName : venueNames(watch.venueIds).slice(0, 2).join(" / ")}</h2>
                <p className="fine">
                  {watch.date} · {watch.players} player{watch.players === 1 ? "" : "s"}
                  {live ? ` · claim ${leftLabel(watch.offerUntil, now)}` : " · waiting on a cancel"}
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
        <p style={{ marginTop: 16 }}>
          <Link className="btn ghost" href="/waitlist">
            Watch a cancel
          </Link>
        </p>
      </section>
    </>
  );
}
