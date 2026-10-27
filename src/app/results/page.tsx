"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SearchForm } from "@/components/SearchForm";
import { Dots } from "@/components/Seats";
import { youIn } from "@/lib/group";
import { SPORTS, isFull } from "@/lib/sports";
import { useStore } from "@/lib/store";
import {
  availabilityFor,
  filterVenues,
  money,
  priceFor,
  priceLines,
  windowLabel,
  type Venue,
} from "@/lib/venues";
import type { PriceBreak } from "@/lib/types";

type Row = { venue: Venue; avail: "open" | "soldout" | "fill"; price: PriceBreak };

function VenueRow({ row, action, href }: { row: Row; action: string; href: string }) {
  return (
    <article className="row">
      <div>
        <h2>
          <Link href={href}>{row.venue.shortName}</Link>
        </h2>
        <p className="fine">
          {row.venue.city}, {row.venue.state}
        </p>
      </div>
      <div className="price-block">
        <span className="fine">Due at venue</span>
        <b>{money(row.price.total)}</b>
        <div className="break">{priceLines(row.venue, row.price, true)}</div>
      </div>
      <Link className={action === "Watch" ? "btn ghost" : "btn clay"} href={href}>
        {action}
      </Link>
    </article>
  );
}

function Block({
  title,
  hint,
  rows,
  action,
  hrefFor,
}: {
  title: string;
  hint: string;
  rows: Row[];
  action: string;
  hrefFor: (row: Row) => string;
}) {
  if (rows.length === 0) return null;
  return (
    <section className="block">
      <div className="block-head">
        <h2>{title}</h2>
        <p className="fine">{hint}</p>
      </div>
      {rows.map((row) => (
        <VenueRow key={row.venue.id} row={row} action={action} href={hrefFor(row)} />
      ))}
    </section>
  );
}

function ResultsInner() {
  const params = useSearchParams();
  const { search, groups } = useStore();
  const spec = SPORTS[search.sport];
  const walk = search.walk !== "ride";
  const fromQuery = params.get("group");
  const active =
    groups.find((group) => group.id === fromQuery) ??
    groups.find(
      (group) =>
        (youIn(group) || group.ownedByYou) &&
        group.sport === search.sport &&
        group.state !== "handed_off",
    );
  const q = active ? `?group=${active.id}` : "";
  const rows = filterVenues(search).map((venue) => ({
    venue,
    avail: availabilityFor(venue, search),
    price: priceFor(venue, walk),
  }));
  const book = rows.filter((r) => r.avail === "open" && (search.players > 1 || Boolean(active)));
  const watch = rows.filter((r) => r.avail === "soldout");
  const full = isFull(search.sport, active ? active.cap : search.players);
  const people = active ? active.members.filter((m) => m.rsvp !== "out").length : search.players;

  return (
    <>
      <div className="toolbar">
        <div>
          <p className="kicker">
            <Dots filled={people} max={spec.max} />{" "}
            {active ? active.name : people === 1 ? "Just you" : `${people} already in`}
          </p>
          <h1>{spec.sheet[0].toUpperCase() + spec.sheet.slice(1)}s</h1>
          <p className="lede" style={{ marginTop: 6 }}>
            {!active && search.players === 1
              ? `A single does not take a ${spec.venue}. Go back to groups.`
              : `${windowLabel(search.window)}. Due at the ${spec.venue} — after the group exists.`}
          </p>
        </div>
      </div>
      <SearchForm compact />
      {!active && search.players === 1 ? (
        <p style={{ margin: "20px 0" }}>
          <Link className="btn clay" href="/">
            Go to groups
          </Link>
        </p>
      ) : (
        <>
          <Block
            title={`Hold a ${spec.venue}`}
            hint={`Your people are in. This is the ${spec.sheet}, not a deal list.`}
            rows={book}
            action={full ? "Hold" : "Invite"}
            hrefFor={(row) => `/course/${row.venue.id}${q}`}
          />
          <Block
            title="Watch for a cancel"
            hint="We only ping matching headcount. Fifteen minutes to claim. No auto-charge."
            rows={watch}
            action="Watch"
            hrefFor={(row) => `/waitlist?course=${row.venue.id}`}
          />
        </>
      )}
    </>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<p className="lede">Loading…</p>}>
      <ResultsInner />
    </Suspense>
  );
}
