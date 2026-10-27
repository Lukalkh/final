"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { suggestedTee } from "@/lib/courses";
import { useStore } from "@/lib/store";
import { money, priceFor, venueById } from "@/lib/venues";

export default function ClaimPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { watches, search, pingWatch, claimWatch, clearOffer, ready } = useStore();
  const [now, setNow] = useState(Date.now());
  const watch = watches.find((item) => item.id === id);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!ready) return <p className="lede">Loading…</p>;
  if (!watch) {
    return (
      <>
        <h1>Hold expired</h1>
        <p className="lede">Start a new watch.</p>
        <Link className="btn clay" href="/waitlist" style={{ marginTop: 16 }}>
          Hold
        </Link>
      </>
    );
  }

  const offer = venueById(watch.offerVenueId ?? watch.venueIds[0] ?? "");
  if (!offer) return <p className="lede">Venue gone.</p>;
  const live = Boolean(watch.offerUntil && watch.offerUntil > now);
  const price = priceFor(offer, search.walk !== "ride");
  const tee = suggestedTee(watch.window, false);
  const left = Math.max(0, (watch.offerUntil ?? 0) - now);
  const mins = Math.floor(left / 60000);
  const secs = Math.floor((left % 60000) / 1000);

  return (
    <div className="split">
      <div>
        <p className="kicker">Claim</p>
        <h1>
          {offer.shortName} · {tee}
        </h1>
        <p className="lede">
          {watch.date} · {watch.players} player{watch.players === 1 ? "" : "s"} · 15 minutes
        </p>
        <p className="state">
          {live
            ? `Expires in ${mins}:${String(secs).padStart(2, "0")}`
            : "No live offer. Ping a demo cancel or wait."}
        </p>
      </div>
      <aside className="panel">
        <p className="fine">Due at venue if you claim</p>
        <p className="mono">{money(price.total)}</p>
        {live ? (
          <button
            className="btn clay wide"
            type="button"
            onClick={() => {
              const group = claimWatch(watch.id);
              if (group) router.push(`/handoff/${group.id}`);
            }}
          >
            Claim
          </button>
        ) : (
          <button className="btn clay wide" type="button" onClick={() => pingWatch(watch.id)}>
            Demo cancel
          </button>
        )}
        <button className="btn ghost wide" type="button" onClick={() => clearOffer(watch.id)}>
          Pass
        </button>
        <Link className="btn link" href="/waitlist">
          Back
        </Link>
      </aside>
    </div>
  );
}
