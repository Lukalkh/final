import {
  COURSES,
  availability as golfAvail,
  filterCourses,
  money,
  priceBreak as golfPrice,
  suggestedTee,
  windowLabel,
} from "./courses";
import type { Course, PriceBreak, SearchQuery, SinglesPolicy, Sport } from "./types";

function weekendScarce(scarceWeekend: boolean, date: string) {
  const day = new Date(`${date}T12:00:00`).getDay();
  return (day === 0 || day === 6) && scarceWeekend;
}

export type Venue = {
  id: string;
  sport: Sport;
  name: string;
  shortName: string;
  city: string;
  state: "NY" | "NJ";
  singlesPolicy: SinglesPolicy;
  fee: number;
  extra: number;
  extraLabel: string;
  taxRate: number;
  cancelHours: number;
  scarceWeekend: boolean;
  notes: string;
  walkable?: boolean;
};

const COURT_VENUES: Venue[] = [
  {
    id: "central-park-tennis",
    sport: "tennis",
    name: "Central Park Tennis Center",
    shortName: "Central Park",
    city: "Manhattan",
    state: "NY",
    singlesPolicy: "join_only",
    fee: 24,
    extra: 0,
    extraLabel: "court share",
    taxRate: 0.08875,
    cancelHours: 12,
    scarceWeekend: true,
    notes: "Weekend permits go in minutes. Singles fill an existing court.",
  },
  {
    id: "prospect-tennis",
    sport: "tennis",
    name: "Prospect Park Tennis",
    shortName: "Prospect Park",
    city: "Brooklyn",
    state: "NY",
    singlesPolicy: "join_only",
    fee: 18,
    extra: 0,
    extraLabel: "court share",
    taxRate: 0.08875,
    cancelHours: 12,
    scarceWeekend: true,
    notes: "Public courts. A single does not take a full court on Saturday.",
  },
  {
    id: "riverside-tennis",
    sport: "tennis",
    name: "Riverside Park Tennis",
    shortName: "Riverside",
    city: "Manhattan",
    state: "NY",
    singlesPolicy: "open",
    fee: 16,
    extra: 0,
    extraLabel: "court share",
    taxRate: 0.08875,
    cancelHours: 12,
    scarceWeekend: false,
    notes: "Weekday mornings still open if you confirm a partner first.",
  },
  {
    id: "usta-tennis",
    sport: "tennis",
    name: "USTA Billie Jean King",
    shortName: "USTA",
    city: "Queens",
    state: "NY",
    singlesPolicy: "none",
    fee: 40,
    extra: 0,
    extraLabel: "court share",
    taxRate: 0.08875,
    cancelHours: 24,
    scarceWeekend: true,
    notes: "Indoor public hours. No walk-on singles.",
  },
  {
    id: "overpeck-tennis",
    sport: "tennis",
    name: "Overpeck Tennis",
    shortName: "Overpeck Tennis",
    city: "Teaneck",
    state: "NJ",
    singlesPolicy: "open",
    fee: 20,
    extra: 0,
    extraLabel: "court share",
    taxRate: 0.06625,
    cancelHours: 12,
    scarceWeekend: false,
    notes: "County courts. Doubles is the default Saturday format.",
  },
  {
    id: "hudson-pickle",
    sport: "pickleball",
    name: "Hudson River Park Pickleball",
    shortName: "Hudson River",
    city: "Manhattan",
    state: "NY",
    singlesPolicy: "join_only",
    fee: 0,
    extra: 0,
    extraLabel: "court",
    taxRate: 0,
    cancelHours: 6,
    scarceWeekend: true,
    notes: "Free and slammed. Open play is a group, not a reserved box.",
  },
  {
    id: "mccarren-pickle",
    sport: "pickleball",
    name: "McCarren Park Pickleball",
    shortName: "McCarren",
    city: "Brooklyn",
    state: "NY",
    singlesPolicy: "join_only",
    fee: 0,
    extra: 0,
    extraLabel: "court",
    taxRate: 0,
    cancelHours: 6,
    scarceWeekend: true,
    notes: "Lines form. DUPR mismatch gets rotated off fast.",
  },
  {
    id: "bbp-pickle",
    sport: "pickleball",
    name: "Brooklyn Bridge Park",
    shortName: "Bridge Park",
    city: "Brooklyn",
    state: "NY",
    singlesPolicy: "open",
    fee: 0,
    extra: 0,
    extraLabel: "court",
    taxRate: 0,
    cancelHours: 6,
    scarceWeekend: false,
    notes: "Weekday twilight still has space if four people are already in.",
  },
  {
    id: "liberty-pickle",
    sport: "pickleball",
    name: "Liberty State Park",
    shortName: "Liberty State",
    city: "Jersey City",
    state: "NJ",
    singlesPolicy: "join_only",
    fee: 8,
    extra: 0,
    extraLabel: "court share",
    taxRate: 0.06625,
    cancelHours: 12,
    scarceWeekend: true,
    notes: "Saturday mornings vanish. Fill a game, don't take a court alone.",
  },
  {
    id: "edison-pickle",
    sport: "pickleball",
    name: "Edison Community Courts",
    shortName: "Edison",
    city: "Edison",
    state: "NJ",
    singlesPolicy: "open",
    fee: 6,
    extra: 0,
    extraLabel: "court share",
    taxRate: 0.06625,
    cancelHours: 12,
    scarceWeekend: false,
    notes: "Municipal courts. Invite first, then take the sheet.",
  },
];

function asGolf(course: Course): Venue {
  return {
    id: course.id,
    sport: "golf",
    name: course.name,
    shortName: course.shortName,
    city: course.city,
    state: course.state,
    singlesPolicy: course.singlesPolicy,
    fee: course.greensFee,
    extra: course.cartFee,
    extraLabel: "cart",
    taxRate: course.taxRate,
    cancelHours: course.cancelHours,
    scarceWeekend: course.scarceWeekend,
    notes: course.notes,
    walkable: course.walkable,
  };
}

export function venuesFor(sport: Sport): Venue[] {
  if (sport === "golf") return COURSES.map(asGolf);
  return COURT_VENUES.filter((venue) => venue.sport === sport);
}

export function venueById(id: string): Venue | undefined {
  const golf = COURSES.find((course) => course.id === id);
  if (golf) return asGolf(golf);
  return COURT_VENUES.find((venue) => venue.id === id);
}

export function venueByName(name: string, sport: Sport): Venue | undefined {
  return venuesFor(sport).find((venue) => venue.shortName === name);
}

export function venueNames(ids: string[]): string[] {
  return ids.map((id) => venueById(id)?.shortName ?? id);
}

export function priceFor(venue: Venue, walk: boolean): PriceBreak {
  if (venue.sport === "golf") {
    const course = COURSES.find((item) => item.id === venue.id);
    if (course) return golfPrice(course, walk && !!venue.walkable);
  }
  const tax = venue.fee * venue.taxRate;
  return { greens: venue.fee, cart: 0, tax, total: venue.fee + tax };
}

export function priceLines(venue: Venue, price: PriceBreak, walk: boolean): string {
  if (venue.sport === "golf") {
    return `greens ${money(price.greens)} · ${walk ? "walk $0" : `cart ${money(price.cart)}`} · tax ${money(price.tax)}`;
  }
  if (price.total === 0) return "public court · $0";
  return `${venue.extraLabel} ${money(price.greens)}${price.tax ? ` · tax ${money(price.tax)}` : ""}`;
}

export function availabilityFor(venue: Venue, query: SearchQuery): "open" | "soldout" | "fill" {
  if (venue.sport === "golf") {
    const course = COURSES.find((item) => item.id === venue.id);
    if (course) return golfAvail(course, query);
  }
  const scarce = weekendScarce(venue.scarceWeekend, query.date);
  if (query.players === 1) {
    if (venue.singlesPolicy === "none") return "soldout";
    if (venue.singlesPolicy === "join_only") return scarce ? "soldout" : "fill";
    return scarce ? "fill" : "open";
  }
  if (scarce && query.window === "early") return "soldout";
  return "open";
}

export function filterVenues(query: SearchQuery): Venue[] {
  if (query.sport === "golf") return filterCourses(query).map(asGolf);
  return venuesFor(query.sport);
}

export { money, suggestedTee, windowLabel };
