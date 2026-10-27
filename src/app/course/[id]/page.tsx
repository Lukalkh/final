"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { HandicapRuleFields } from "@/components/HandicapRuleFields";
import { suggestedTee, windowLabel } from "@/lib/courses";
import { youIn } from "@/lib/group";
import { ruleLabel } from "@/lib/handicap";
import { SPORTS, isFull, skillOf } from "@/lib/sports";
import { useStore } from "@/lib/store";
import { availabilityFor, money, priceFor, priceLines, venueById } from "@/lib/venues";
import type { HandicapRule } from "@/lib/types";

function CourseInner() {
  const { id } = useParams<{ id: string }>();
  const params = useSearchParams();
  const router = useRouter();
  const { search, profile, groups, postGroup, pickVenue } = useStore();
  const spec = SPORTS[search.sport];
  const skill = skillOf(profile, search.sport);
  const [rule, setRule] = useState<HandicapRule>({ kind: "none", value: spec.defaultLimit });
  const venue = venueById(id);
  if (!venue) return <p className="lede">Venue not found.</p>;

  const walk = search.walk !== "ride" && !!venue.walkable;
  const price = priceFor(venue, walk);
  const avail = availabilityFor(venue, search);
  const scarce = venue.scarceWeekend;
  const tee = suggestedTee(search.window, scarce);
  const fromQuery = params.get("group");
  const active =
    groups.find((group) => group.id === fromQuery) ??
    groups.find(
      (group) =>
        (youIn(group) || group.ownedByYou) &&
        group.sport === search.sport &&
        group.state !== "handed_off",
    );
  const people = active ? active.members.filter((m) => m.rsvp !== "out").length : search.players;
  const full = isFull(search.sport, people);

  function hold() {
    const groupId =
      active?.id ??
      postGroup({
        venueIds: [venue!.id],
        skillRule: rule,
        venueId: venue!.id,
        teeTime: tee,
      }).id;
    pickVenue(groupId, venue!.id, tee);
    router.push(full ? `/handoff/${groupId}` : `/group/${groupId}`);
  }

  return (
    <div className="split">
      <div>
        <p className="kicker">
          {venue.city}, {venue.state} · {spec.label}
        </p>
        <h1>{venue.shortName}</h1>
        <p className="lede">{venue.notes}</p>
        <p className="state">
          {search.date} · {windowLabel(search.window)} · {tee}
          {avail === "soldout" ? " · sold out" : avail === "fill" ? " · join or pair" : ""}
          {active ? ` · ${active.name}` : ""}
        </p>
      </div>
      <aside className="panel">
        <p className="fine">Due at the {spec.venue}</p>
        <p className="mono">{money(price.total)}</p>
        <div className="break">{priceLines(venue, price, walk)}</div>
        {!active && search.players > 1 && avail !== "soldout" ? (
          <div style={{ marginTop: 16 }}>
            <HandicapRuleFields sport={search.sport} rule={rule} onChange={setRule} />
            <p className="fine" style={{ marginTop: 8 }}>
              Group starts at {spec.skill} {skill}. {ruleLabel(rule, spec.skill)}.
            </p>
          </div>
        ) : null}
        <div className="stack" style={{ marginTop: 16 }}>
          {avail === "soldout" ? (
            <Link className="btn clay" href={`/waitlist?course=${venue.id}`}>
              Waitlist
            </Link>
          ) : !active && search.players === 1 ? (
            <Link className="btn clay" href="/">
              Groups
            </Link>
          ) : (
            <button className="btn clay" type="button" onClick={hold}>
              {full ? "Hold" : "Invite"}
            </button>
          )}
          <Link className="btn ghost" href={active ? `/results?group=${active.id}` : "/results"}>
            Back
          </Link>
        </div>
      </aside>
    </div>
  );
}

export default function CoursePage() {
  return (
    <Suspense fallback={<p className="lede">Loading…</p>}>
      <CourseInner />
    </Suspense>
  );
}
