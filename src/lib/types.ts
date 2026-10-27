export type Pace = "fast" | "steady" | "leisurely";
export type WalkPref = "walk" | "ride" | "either";
export type Holes = 9 | 18;
export type PlayerCount = 1 | 2 | 3 | 4;
export type SinglesPolicy = "join_only" | "none" | "open";
export type TimeWindow = "early" | "mid" | "twilight" | "any";
export type Sport = "golf" | "tennis" | "pickleball";

export type Course = {
  id: string;
  name: string;
  shortName: string;
  city: string;
  state: "NY" | "NJ";
  holes: Holes | "both";
  walkable: boolean;
  singlesPolicy: SinglesPolicy;
  pace: Pace;
  beginnerOk: boolean;
  greensFee: number;
  cartFee: number;
  taxRate: number;
  cancelHours: number;
  scarceWeekend: boolean;
  notes: string;
  rating: number;
  yards: string;
};

export type HandicapRule = {
  kind: "none" | "below" | "above";
  value: number;
};

export type Profile = {
  displayName: string;
  handicap: number;
  skills: Record<Sport, number>;
  pace: Pace;
  walk: WalkPref;
  strangersOk: boolean;
  genderPref: "any" | "women" | "men";
  beginnerOk: boolean;
  setup: boolean;
};

export type Member = {
  id: string;
  name: string;
  skill: number;
  rsvp: "in" | "out" | "maybe" | "pending";
  you?: boolean;
};

export type Group = {
  id: string;
  sport: Sport;
  name: string;
  ownerName: string;
  ownedByYou?: boolean;
  date: string;
  window: TimeWindow;
  teeTime?: string;
  venueIds: string[];
  venueId?: string;
  members: Member[];
  cap: PlayerCount;
  kind: "join" | "pair" | "looking";
  skillRule: HandicapRule;
  state: "open" | "ready" | "handed_off";
  expiresAt?: number;
};

export type Watch = {
  id: string;
  sport: Sport;
  date: string;
  window: TimeWindow;
  players: PlayerCount;
  venueIds: string[];
  offerVenueId?: string;
  offerUntil?: number;
};

export type SearchQuery = {
  sport: Sport;
  date: string;
  window: TimeWindow;
  players: PlayerCount;
  holes: Holes;
  walk: WalkPref;
};

export type LookingCard = {
  id: string;
  sport: Sport;
  name: string;
  handicapAvg: number;
  handicapRule: HandicapRule;
  pace: Pace;
  walk: WalkPref;
  window: string;
  courses: string[];
  beginnerOk: boolean;
  seats: number;
  kind: "join" | "pair" | "looking";
};

export type PriceBreak = {
  greens: number;
  cart: number;
  tax: number;
  total: number;
};
