import { windowLabel } from "./courses";
import { averageHcp } from "./handicap";
import type { Group, Member, PlayerCount, Sport } from "./types";

export function capFor(sport: Sport, players: number): PlayerCount {
  if (sport === "tennis") return players <= 2 ? 2 : 4;
  return 4;
}

export function activeMembers(group: Group): Member[] {
  return group.members.filter((member) => member.rsvp !== "out");
}

export function taken(group: Group): number {
  return activeMembers(group).length;
}

export function remaining(group: Group): number {
  return Math.max(0, group.cap - taken(group));
}

export function groupAvg(group: Group): number {
  const skills = activeMembers(group).map((member) => member.skill);
  return averageHcp(skills);
}

export function youIn(group: Group): Member | undefined {
  return group.members.find((member) => member.you);
}

export function isReady(group: Group): boolean {
  return remaining(group) === 0 && activeMembers(group).every((member) => member.rsvp === "in");
}

export function guestMembers(count: number, skill: number): Member[] {
  return Array.from({ length: Math.max(0, count) }, (_, i) => ({
    id: `guest-${i + 1}`,
    name: `Guest ${i + 1}`,
    skill,
    rsvp: "in" as const,
  }));
}

export function whenLabel(group: Pick<Group, "date" | "window" | "teeTime">): string {
  const day = group.date;
  const slot = group.teeTime ?? windowLabel(group.window);
  return `${day} · ${slot}`;
}

export function yours(groups: Group[]): Group[] {
  return groups.filter((group) => Boolean(youIn(group) || group.ownedByYou));
}
