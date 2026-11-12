"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { GroupCard } from "@/components/GroupCard";
import { StartGroup } from "@/components/StartGroup";
import { formatHcp } from "@/lib/handicap";
import { youIn, yours } from "@/lib/group";
import { SPORTS, skillOf } from "@/lib/sports";
import { useStore } from "@/lib/store";

export default function HomePage() {
  const router = useRouter();
  const { profile, search, groups, joinGroup } = useStore();
  const spec = SPORTS[search.sport];
  const skill = skillOf(profile, search.sport);

  const mine = useMemo(
    () => yours(groups).filter((group) => group.sport === search.sport && group.state !== "handed_off"),
    [groups, search.sport],
  );

  const board = useMemo(() => {
    const open = groups.filter((group) => group.sport === search.sport && group.state === "open");
    return {
      join: open.filter((group) => group.kind === "join"),
      pair: open.filter((group) => group.kind === "pair"),
      looking: open.filter((group) => group.kind === "looking"),
    };
  }, [groups, search.sport]);

  function confirm(id: string) {
    joinGroup(id);
    router.push(`/group/${id}`);
  }

  return (
    <>
      <div className="hero">
        <p className="kicker">NY / NJ</p>
        <h1>{spec.label}</h1>
        <p className="lede">
          {profile.displayName} · {spec.skill} {formatHcp(skill)}. Join or start a {spec.label.toLowerCase()}{" "}
          group. We only open a {spec.sheet} after people are in.
        </p>
        <div className="hero-rule" />
      </div>
      {mine.length ? (
        <p className="mine">
          <span>Yours</span>
          {mine.map((group) => (
            <Link key={group.id} href={`/group/${group.id}`}>
              {group.name}
            </Link>
          ))}
        </p>
      ) : null}
      <div className="home-layout">
      <div className="home-start">
        <StartGroup key={search.sport} />
      </div>
      <div className="cards">
        <section className="stack board-col">
          <p className="kicker">Need one more</p>
          {board.join.length ? (
            board.join.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                you={skill}
                onJoin={youIn(group) ? undefined : () => confirm(group.id)}
              />
            ))
          ) : (
            <p className="fine">None right now.</p>
          )}
        </section>
        <section className="stack board-col">
          <p className="kicker">Pair a solo</p>
          {board.pair.length ? (
            board.pair.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                you={skill}
                action="Pair up"
                onJoin={youIn(group) ? undefined : () => confirm(group.id)}
              />
            ))
          ) : (
            <p className="fine">None right now.</p>
          )}
        </section>
        <section className="stack board-col">
          <p className="kicker">Looking</p>
          {board.looking.length ? (
            board.looking.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                you={skill}
                onJoin={youIn(group) ? undefined : () => confirm(group.id)}
              />
            ))
          ) : (
            <p className="fine">None right now.</p>
          )}
        </section>
      </div>
      </div>
    </>
  );
}
