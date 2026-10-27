"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Dots } from "@/components/Seats";
import { activeMembers, groupAvg, isReady, remaining, taken, whenLabel, youIn } from "@/lib/group";
import { fitsRule, formatHcp, ruleLabel } from "@/lib/handicap";
import { SPORTS, skillOf } from "@/lib/sports";
import { useStore } from "@/lib/store";
import { venueById, venueNames } from "@/lib/venues";

export default function GroupPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const {
    groups,
    profile,
    ready,
    joinGroup,
    leaveGroup,
    inviteFriend,
    setMemberRsvp,
    removeMember,
  } = useStore();
  const [friend, setFriend] = useState("");
  const [copied, setCopied] = useState(false);
  const group = groups.find((item) => item.id === id);

  if (!ready) return <p className="lede">Loading…</p>;
  if (!group) {
    return (
      <>
        <h1>Group gone</h1>
        <p className="lede">It was cancelled or the link is old.</p>
        <Link className="btn clay" href="/" style={{ marginTop: 16 }}>
          Groups
        </Link>
      </>
    );
  }

  const spec = SPORTS[group.sport];
  const skill = skillOf(profile, group.sport);
  const allowed = fitsRule(skill, group.skillRule);
  const mine = youIn(group);
  const venue = group.venueId ? venueById(group.venueId) : undefined;
  const seats = remaining(group);
  const readySheet = isReady(group);

  async function share() {
    const url = `${window.location.origin}/group/${group!.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.prompt("Copy this link", url);
    }
  }

  return (
    <div className="split">
      <div>
        <p className="kicker">
          {spec.label} · {group.state === "handed_off" ? "handed off" : readySheet ? "ready" : "open"}
        </p>
        <h1>{group.name}</h1>
        <p className="lede">
          {whenLabel(group)}
          {venue ? ` · ${venue.shortName}` : ""}
          {` · avg ${spec.skill} ${formatHcp(groupAvg(group))}`}
          {` · ${ruleLabel(group.skillRule, spec.skill)}`}
        </p>
        <p className="fine" style={{ marginTop: 8 }}>
          {venueNames(group.venueIds).join(" / ") || "Any venue"}
        </p>
        <div className="member-list">
          <p className="kicker">
            <Dots filled={taken(group)} max={group.cap} /> {taken(group)} of {group.cap}
          </p>
          {activeMembers(group).map((member) => (
            <div key={member.id} className="member">
              <div>
                <strong>
                  {member.name}
                  {member.you ? " · you" : ""}
                </strong>
                <p className="fine">
                  {spec.skill} {formatHcp(member.skill)} · {member.rsvp}
                </p>
              </div>
              {mine && !member.you && member.rsvp !== "in" ? (
                <div className="member-actions">
                  <button
                    className="btn link"
                    type="button"
                    onClick={() => setMemberRsvp(group.id, member.id, "in")}
                  >
                    Mark in
                  </button>
                  <button
                    className="btn link"
                    type="button"
                    onClick={() => removeMember(group.id, member.id)}
                  >
                    Release
                  </button>
                </div>
              ) : null}
            </div>
          ))}
          {seats ? <p className="fine">{seats} open seat{seats === 1 ? "" : "s"}.</p> : null}
        </div>
        {mine && group.state !== "handed_off" && seats > 0 ? (
          <form
            className="invite-row"
            onSubmit={(e) => {
              e.preventDefault();
              inviteFriend(group.id, friend);
              setFriend("");
            }}
          >
            <input
              placeholder="Friend’s name"
              value={friend}
              onChange={(e) => setFriend(e.target.value)}
            />
            <button className="btn ghost" type="submit" disabled={!friend.trim() || seats === 0}>
              Invite
            </button>
          </form>
        ) : null}
      </div>
      <aside className="panel stack">
        <p className="fine">
          {group.state === "handed_off"
            ? `Pay the ${spec.venue}.`
            : readySheet
              ? `People are in. Hold a ${spec.sheet}.`
              : "Share the group. A sheet waits until seats fill."}
        </p>
        {mine ? (
          <div className="rsvp">
            <button
              className="btn clay"
              type="button"
              data-on={mine.rsvp === "in"}
              onClick={() => setMemberRsvp(group.id, mine.id, "in")}
            >
              In
            </button>
            <button
              className="btn ghost"
              type="button"
              onClick={() => setMemberRsvp(group.id, mine.id, "maybe")}
            >
              Maybe
            </button>
            <button
              className="btn ghost"
              type="button"
              onClick={() => setMemberRsvp(group.id, mine.id, "out")}
            >
              Out
            </button>
          </div>
        ) : group.state === "open" && seats > 0 ? (
          <>
            <button
              className="btn clay wide"
              type="button"
              disabled={!allowed}
              onClick={() => joinGroup(group.id)}
            >
              Join
            </button>
            {allowed ? null : (
              <p className="fine">
                Your {spec.skill} {formatHcp(skill)} does not meet {ruleLabel(group.skillRule, spec.skill)}.
              </p>
            )}
          </>
        ) : null}
        <button className="btn ghost wide" type="button" onClick={share}>
          {copied ? "Link copied" : "Copy share link"}
        </button>
        {readySheet && group.state !== "handed_off" ? (
          <Link className="btn clay wide" href={`/results?group=${group.id}`}>
            See {spec.sheet}s
          </Link>
        ) : null}
        {group.venueId && group.state !== "handed_off" ? (
          <Link className="btn wide" href={`/handoff/${group.id}`}>
            Receipt
          </Link>
        ) : null}
        {group.state === "handed_off" ? (
          <Link className="btn clay wide" href={`/handoff/${group.id}`}>
            Open receipt
          </Link>
        ) : null}
        {mine ? (
          <button
            className="btn link"
            type="button"
            onClick={() => {
              leaveGroup(group.id);
              router.push("/");
            }}
          >
            {group.ownedByYou ? "Cancel group" : "Leave"}
          </button>
        ) : (
          <Link className="btn ghost wide" href="/">
            Back
          </Link>
        )}
        <p className="fine">Posted by {group.ownerName || profile.displayName}.</p>
      </aside>
    </div>
  );
}
