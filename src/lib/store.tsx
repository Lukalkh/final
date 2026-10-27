"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_DATE, suggestedTee } from "./courses";
import { capFor, guestMembers, groupAvg, remaining, youIn } from "./group";
import { SPORTS, skillOf } from "./sports";
import type { Group, HandicapRule, Member, Profile, SearchQuery, Sport, Watch } from "./types";
import { uid } from "./uid";

const defaultSkills = { golf: 16, tennis: 3.5, pickleball: 3.8 };

const defaultProfile: Profile = {
  displayName: "",
  handicap: 16,
  skills: defaultSkills,
  pace: "steady",
  walk: "either",
  strangersOk: true,
  genderPref: "any",
  beginnerOk: true,
  setup: false,
};

const defaultSearch: SearchQuery = {
  sport: "golf",
  date: DEFAULT_DATE,
  window: "early",
  players: 1,
  holes: 18,
  walk: "walk",
};

function seedGroups(): Group[] {
  const date = DEFAULT_DATE;
  return [
    {
      id: "join-yellow",
      sport: "golf",
      name: "Priya + Mark",
      ownerName: "Priya",
      date,
      window: "early",
      teeTime: "7:12am",
      venueIds: ["bethpage-yellow"],
      members: [
        { id: "priya", name: "Priya", skill: 12, rsvp: "in" },
        { id: "mark", name: "Mark", skill: 15, rsvp: "in" },
      ],
      cap: 4,
      kind: "join",
      skillRule: { kind: "below", value: 18 },
      state: "open",
    },
    {
      id: "join-dyker",
      sport: "golf",
      name: "Luis",
      ownerName: "Luis",
      date,
      window: "early",
      teeTime: "7:36am",
      venueIds: ["dyker"],
      members: [{ id: "luis", name: "Luis", skill: 16, rsvp: "in" }],
      cap: 4,
      kind: "join",
      skillRule: { kind: "none", value: 18 },
      state: "open",
    },
    {
      id: "pair-bronx",
      sport: "golf",
      name: "Alex",
      ownerName: "Alex",
      date,
      window: "early",
      venueIds: ["dyker", "van-cortlandt"],
      members: [{ id: "alex", name: "Alex", skill: 16, rsvp: "in" }],
      cap: 2,
      kind: "pair",
      skillRule: { kind: "below", value: 22 },
      state: "open",
    },
    {
      id: "pair-nj",
      sport: "golf",
      name: "Sam",
      ownerName: "Sam",
      date,
      window: "early",
      venueIds: ["darlington", "overpeck"],
      members: [{ id: "sam", name: "Sam", skill: 11, rsvp: "in" }],
      cap: 2,
      kind: "pair",
      skillRule: { kind: "above", value: 6 },
      state: "open",
    },
    {
      id: "ten-join-cp",
      sport: "tennis",
      name: "Maya + Jen",
      ownerName: "Maya",
      date,
      window: "early",
      teeTime: "8:00am",
      venueIds: ["central-park-tennis"],
      members: [
        { id: "maya", name: "Maya", skill: 3.5, rsvp: "in" },
        { id: "jen", name: "Jen", skill: 3.5, rsvp: "in" },
      ],
      cap: 4,
      kind: "join",
      skillRule: { kind: "below", value: 4 },
      state: "open",
    },
    {
      id: "ten-pair-prospect",
      sport: "tennis",
      name: "Omar",
      ownerName: "Omar",
      date,
      window: "early",
      venueIds: ["prospect-tennis", "riverside-tennis"],
      members: [{ id: "omar", name: "Omar", skill: 4, rsvp: "in" }],
      cap: 2,
      kind: "pair",
      skillRule: { kind: "above", value: 3 },
      state: "open",
    },
    {
      id: "ten-look-riley",
      sport: "tennis",
      name: "Riley",
      ownerName: "Riley",
      date,
      window: "early",
      venueIds: ["riverside-tennis", "overpeck-tennis"],
      members: [{ id: "riley", name: "Riley", skill: 3, rsvp: "in" }],
      cap: 2,
      kind: "looking",
      skillRule: { kind: "none", value: 4 },
      state: "open",
    },
    {
      id: "pick-join-hudson",
      sport: "pickleball",
      name: "Tuesday crew",
      ownerName: "Tuesday crew",
      date,
      window: "early",
      teeTime: "8:30am",
      venueIds: ["hudson-pickle"],
      members: [
        { id: "t1", name: "Nina", skill: 3.8, rsvp: "in" },
        { id: "t2", name: "Chris", skill: 3.7, rsvp: "in" },
        { id: "t3", name: "Pat", skill: 3.9, rsvp: "in" },
      ],
      cap: 4,
      kind: "join",
      skillRule: { kind: "below", value: 4.5 },
      state: "open",
    },
    {
      id: "pick-pair-mccarren",
      sport: "pickleball",
      name: "Kai",
      ownerName: "Kai",
      date,
      window: "early",
      venueIds: ["mccarren-pickle", "bbp-pickle"],
      members: [{ id: "kai", name: "Kai", skill: 4.2, rsvp: "in" }],
      cap: 2,
      kind: "pair",
      skillRule: { kind: "above", value: 3.5 },
      state: "open",
    },
    {
      id: "pick-look-bea",
      sport: "pickleball",
      name: "Bea",
      ownerName: "Bea",
      date,
      window: "early",
      venueIds: ["liberty-pickle", "edison-pickle"],
      members: [{ id: "bea", name: "Bea", skill: 3.2, rsvp: "in" }],
      cap: 4,
      kind: "looking",
      skillRule: { kind: "none", value: 4.5 },
      state: "open",
    },
  ];
}

type Store = {
  profile: Profile;
  search: SearchQuery;
  groups: Group[];
  watches: Watch[];
  ready: boolean;
  setProfile: (p: Partial<Profile>) => void;
  setSkill: (sport: Sport, value: number) => void;
  setSearch: (s: Partial<SearchQuery>) => void;
  setSport: (sport: Sport) => void;
  postGroup: (input: {
    venueIds: string[];
    skillRule: HandicapRule;
    venueId?: string;
    teeTime?: string;
  }) => Group;
  joinGroup: (id: string) => Group | null;
  leaveGroup: (id: string) => void;
  inviteFriend: (groupId: string, name: string) => void;
  setMemberRsvp: (groupId: string, memberId: string, rsvp: Member["rsvp"]) => void;
  removeMember: (groupId: string, memberId: string) => void;
  pickVenue: (groupId: string, venueId: string, teeTime: string) => void;
  markHandedOff: (groupId: string) => void;
  addWatch: (watch: Omit<Watch, "id">) => Watch;
  pingWatch: (id: string) => void;
  clearOffer: (id: string) => void;
  removeWatch: (id: string) => void;
  claimWatch: (id: string) => Group | null;
};

const Ctx = createContext<Store | null>(null);

function readProfile(raw: Partial<Profile> & { indexMin?: number; indexMax?: number }): Profile {
  const golf =
    raw.skills?.golf ??
    (typeof raw.handicap === "number" ? raw.handicap : undefined) ??
    defaultSkills.golf;
  return {
    ...defaultProfile,
    ...raw,
    handicap: golf,
    skills: { ...defaultSkills, ...raw.skills, golf },
    setup: Boolean(raw.setup || (raw.displayName && raw.displayName !== "You")),
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<Profile>(defaultProfile);
  const [search, setSearchState] = useState<SearchQuery>(defaultSearch);
  const [groups, setGroups] = useState<Group[]>(seedGroups);
  const [watches, setWatches] = useState<Watch[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("foursome-v2");
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<{
          profile: Profile;
          search: SearchQuery;
          groups: Group[];
          watches: Watch[];
        }>;
        if (parsed.profile) setProfileState(readProfile(parsed.profile));
        if (parsed.search) setSearchState({ ...defaultSearch, ...parsed.search, date: parsed.search.date || DEFAULT_DATE });
        if (parsed.groups?.length) {
          const seeds = seedGroups();
          const merged = seeds.map((seed) => {
            const saved = parsed.groups?.find((group) => group.id === seed.id);
            if (saved && (saved.ownedByYou || saved.members.some((member) => member.you))) return saved;
            return seed;
          });
          const extras = parsed.groups.filter((group) => !seeds.some((seed) => seed.id === group.id));
          setGroups([...extras, ...merged]);
        }
        if (parsed.watches) setWatches(parsed.watches);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("foursome-v2", JSON.stringify({ profile, search, groups, watches }));
  }, [profile, search, groups, watches, ready]);

  const value = useMemo<Store>(
    () => ({
      profile,
      search,
      groups,
      watches,
      ready,
      setProfile: (p) => setProfileState((prev) => ({ ...prev, ...p })),
      setSkill: (sport, value) =>
        setProfileState((prev) => ({
          ...prev,
          handicap: sport === "golf" ? value : prev.handicap,
          skills: { ...prev.skills, [sport]: value },
        })),
      setSearch: (s) => setSearchState((prev) => ({ ...prev, ...s })),
      setSport: (sport) =>
        setSearchState((prev) => ({
          ...prev,
          sport,
          players: prev.players > SPORTS[sport].max ? SPORTS[sport].max : prev.players,
        })),
      postGroup: ({ venueIds, skillRule, venueId, teeTime }) => {
        const skill = skillOf(profile, search.sport);
        const cap = capFor(search.sport, search.players);
        const members: Member[] = [
          { id: "you", name: profile.displayName, skill, rsvp: "in", you: true },
          ...guestMembers(Math.max(0, search.players - 1), skill),
        ];
        const group: Group = {
          id: uid("grp"),
          sport: search.sport,
          name: profile.displayName,
          ownerName: profile.displayName,
          ownedByYou: true,
          date: search.date,
          window: search.window,
          venueIds,
          venueId,
          teeTime,
          members,
          cap,
          kind: search.players === 1 ? "looking" : "join",
          skillRule,
          state: remaining({ cap, members } as Group) === 0 ? "ready" : "open",
        };
        setGroups((prev) => [group, ...prev]);
        return group;
      },
      joinGroup: (id) => {
        const current = groups.find((group) => group.id === id);
        if (!current) return null;
        if (youIn(current) || remaining(current) === 0) return current;
        const skill = skillOf(profile, current.sport);
        const joined: Group = {
          ...current,
          members: [
            ...current.members,
            { id: "you", name: profile.displayName || "You", skill, rsvp: "in", you: true },
          ],
        };
        joined.state = remaining(joined) === 0 ? "ready" : "open";
        setGroups((prev) => prev.map((group) => (group.id === id ? joined : group)));
        return joined;
      },
      leaveGroup: (id) =>
        setGroups((prev) =>
          prev.flatMap((group) => {
            if (group.id !== id) return [group];
            if (group.ownedByYou) return [];
            const next = {
              ...group,
              state: "open" as const,
              members: group.members.filter((member) => !member.you),
            };
            return [next];
          }),
        ),
      inviteFriend: (groupId, name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        setGroups((prev) =>
          prev.map((group) => {
            if (group.id !== groupId || remaining(group) === 0) return group;
            return {
              ...group,
              members: [
                ...group.members,
                {
                  id: uid("m"),
                  name: trimmed,
                  skill: groupAvg(group) || skillOf(profile, group.sport),
                  rsvp: "pending",
                },
              ],
            };
          }),
        );
      },
      setMemberRsvp: (groupId, memberId, rsvp) =>
        setGroups((prev) =>
          prev.map((group) => {
            if (group.id !== groupId) return group;
            const members = group.members.map((member) =>
              member.id === memberId || (member.you && memberId === "you") ? { ...member, rsvp } : member,
            );
            const updated = { ...group, members };
            const seated = members.filter((member) => member.rsvp !== "out");
            updated.state =
              remaining(updated) === 0 && seated.every((member) => member.rsvp === "in") ? "ready" : "open";
            return updated;
          }),
        ),
      removeMember: (groupId, memberId) =>
        setGroups((prev) =>
          prev.map((group) => {
            if (group.id !== groupId) return group;
            const members = group.members.filter((member) => member.id !== memberId);
            return { ...group, members, state: "open" };
          }),
        ),
      pickVenue: (groupId, venueId, teeTime) =>
        setGroups((prev) =>
          prev.map((group) =>
            group.id === groupId ? { ...group, venueId, teeTime, state: "ready" } : group,
          ),
        ),
      markHandedOff: (groupId) =>
        setGroups((prev) =>
          prev.map((group) => (group.id === groupId ? { ...group, state: "handed_off" } : group)),
        ),
      addWatch: (watch) => {
        const row = { ...watch, id: uid("watch") };
        setWatches((prev) => [row, ...prev]);
        return row;
      },
      pingWatch: (id) =>
        setWatches((prev) =>
          prev.map((watch) =>
            watch.id === id
              ? {
                  ...watch,
                  offerVenueId: watch.venueIds[0],
                  offerUntil: Date.now() + 15 * 60 * 1000,
                }
              : watch,
          ),
        ),
      clearOffer: (id) =>
        setWatches((prev) =>
          prev.map((watch) =>
            watch.id === id ? { ...watch, offerVenueId: undefined, offerUntil: undefined } : watch,
          ),
        ),
      removeWatch: (id) => setWatches((prev) => prev.filter((watch) => watch.id !== id)),
      claimWatch: (id) => {
        const watch = watches.find((item) => item.id === id);
        if (!watch) return null;
        const skill = skillOf(profile, watch.sport);
        const cap = capFor(watch.sport, watch.players);
        const members: Member[] = [
          { id: "you", name: profile.displayName, skill, rsvp: "in", you: true },
          ...guestMembers(Math.max(0, watch.players - 1), skill),
        ];
        const group: Group = {
          id: uid("grp"),
          sport: watch.sport,
          name: profile.displayName,
          ownerName: profile.displayName,
          ownedByYou: true,
          date: watch.date,
          window: watch.window,
          venueIds: watch.venueIds,
          venueId: watch.offerVenueId ?? watch.venueIds[0],
          teeTime: suggestedTee(watch.window, false),
          members,
          cap,
          kind: watch.players === 1 ? "looking" : "join",
          skillRule: { kind: "none", value: SPORTS[watch.sport].defaultLimit },
          state: remaining({ cap, members } as Group) === 0 ? "ready" : "open",
        };
        setGroups((prev) => [group, ...prev]);
        setWatches((prev) => prev.filter((item) => item.id !== id));
        return group;
      },
    }),
    [profile, search, groups, watches, ready],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Store missing");
  return ctx;
}

export { uid };
