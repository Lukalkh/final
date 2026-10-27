import type { PlayerCount, Profile, Sport } from "./types";

export const SPORT_LIST: Sport[] = ["golf", "tennis", "pickleball"];

export const SPORTS: Record<
  Sport,
  {
    id: Sport;
    label: string;
    skill: string;
    skillMax: number;
    skillStep: number;
    defaultSkill: number;
    defaultLimit: number;
    max: PlayerCount;
    sheet: string;
    slot: string;
    venue: string;
  }
> = {
  golf: {
    id: "golf",
    label: "Golf",
    skill: "HCP",
    skillMax: 54,
    skillStep: 0.1,
    defaultSkill: 16,
    defaultLimit: 18,
    max: 4,
    sheet: "course sheet",
    slot: "tee time",
    venue: "course",
  },
  tennis: {
    id: "tennis",
    label: "Tennis",
    skill: "NTRP",
    skillMax: 7,
    skillStep: 0.5,
    defaultSkill: 3.5,
    defaultLimit: 4,
    max: 4,
    sheet: "court sheet",
    slot: "court",
    venue: "court",
  },
  pickleball: {
    id: "pickleball",
    label: "Pickleball",
    skill: "DUPR",
    skillMax: 8,
    skillStep: 0.1,
    defaultSkill: 3.8,
    defaultLimit: 4.5,
    max: 4,
    sheet: "court sheet",
    slot: "court",
    venue: "court",
  },
};

export function isFull(sport: Sport, players: number): boolean {
  if (sport === "tennis") return players === 2 || players === 4;
  return players === SPORTS[sport].max;
}

export function skillOf(profile: Profile, sport: Sport): number {
  return profile.skills?.[sport] ?? (sport === "golf" ? profile.handicap : SPORTS[sport].defaultSkill);
}

export function seatLabel(sport: Sport, n: number): string {
  if (n === 1) return "Just me";
  if (sport === "tennis" && n === 2) return "Singles";
  if (sport === "tennis" && n === 4) return "Doubles";
  if (n === SPORTS[sport].max) return "Full";
  return `${n} of us`;
}
