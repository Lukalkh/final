import type { Course, PriceBreak, SearchQuery, TimeWindow } from "./types";

export const COURSES: Course[] = [
  {
    id: "bethpage-yellow",
    name: "Bethpage State Park — Yellow",
    shortName: "Bethpage Yellow",
    city: "Farmingdale",
    state: "NY",
    holes: 18,
    walkable: true,
    singlesPolicy: "join_only",
    pace: "fast",
    beginnerOk: false,
    greensFee: 46,
    cartFee: 22,
    taxRate: 0.08625,
    cancelHours: 24,
    scarceWeekend: true,
    notes: "Weekends vanish at opening. Walking is the local religion. Singles fill existing groups only.",
    rating: 4.6,
    yards: "6,358",
  },
  {
    id: "bethpage-red",
    name: "Bethpage State Park — Red",
    shortName: "Bethpage Red",
    city: "Farmingdale",
    state: "NY",
    holes: 18,
    walkable: true,
    singlesPolicy: "join_only",
    pace: "steady",
    beginnerOk: true,
    greensFee: 38,
    cartFee: 22,
    taxRate: 0.08625,
    cancelHours: 24,
    scarceWeekend: true,
    notes: "The friendliest Bethpage loop. Still scarce Saturday morning. Fine for a first public 18.",
    rating: 4.3,
    yards: "6,225",
  },
  {
    id: "van-cortlandt",
    name: "Van Cortlandt Park",
    shortName: "Van Cortlandt",
    city: "Bronx",
    state: "NY",
    holes: 18,
    walkable: true,
    singlesPolicy: "join_only",
    pace: "leisurely",
    beginnerOk: true,
    greensFee: 49,
    cartFee: 28,
    taxRate: 0.08875,
    cancelHours: 24,
    scarceWeekend: true,
    notes: "Oldest public course in the country. Expect a crowd, a train, and a four-hour-plus Saturday.",
    rating: 4.0,
    yards: "6,102",
  },
  {
    id: "dyker",
    name: "Dyker Beach Golf Course",
    shortName: "Dyker Beach",
    city: "Brooklyn",
    state: "NY",
    holes: 18,
    walkable: true,
    singlesPolicy: "join_only",
    pace: "steady",
    beginnerOk: true,
    greensFee: 54,
    cartFee: 30,
    taxRate: 0.08875,
    cancelHours: 24,
    scarceWeekend: true,
    notes: "Verrazzano views, tight fairways, and a sheet that treats singles as walk-ups.",
    rating: 4.2,
    yards: "6,548",
  },
  {
    id: "clearview",
    name: "Clearview Park Golf Course",
    shortName: "Clearview",
    city: "Bayside",
    state: "NY",
    holes: 18,
    walkable: true,
    singlesPolicy: "open",
    pace: "steady",
    beginnerOk: true,
    greensFee: 52,
    cartFee: 30,
    taxRate: 0.08875,
    cancelHours: 24,
    scarceWeekend: true,
    notes: "One of the few city courses that will still let a single onto a quiet weekday afternoon.",
    rating: 4.1,
    yards: "6,574",
  },
  {
    id: "forest-park",
    name: "Forest Park Golf Course",
    shortName: "Forest Park",
    city: "Woodhaven",
    state: "NY",
    holes: 18,
    walkable: true,
    singlesPolicy: "join_only",
    pace: "leisurely",
    beginnerOk: true,
    greensFee: 47,
    cartFee: 28,
    taxRate: 0.08875,
    cancelHours: 24,
    scarceWeekend: false,
    notes: "Tree-lined and walkable. Weekday twilight is the honest deal.",
    rating: 3.9,
    yards: "6,100",
  },
  {
    id: "marine-park",
    name: "Marine Park Golf Course",
    shortName: "Marine Park",
    city: "Brooklyn",
    state: "NY",
    holes: 18,
    walkable: false,
    singlesPolicy: "none",
    pace: "fast",
    beginnerOk: false,
    greensFee: 58,
    cartFee: 32,
    taxRate: 0.08875,
    cancelHours: 24,
    scarceWeekend: true,
    notes: "Long, windy, cart-first. Online booking is two-to-four only. No singles.",
    rating: 4.0,
    yards: "6,877",
  },
  {
    id: "kissena",
    name: "Kissena Park Golf Course",
    shortName: "Kissena",
    city: "Flushing",
    state: "NY",
    holes: 18,
    walkable: true,
    singlesPolicy: "join_only",
    pace: "leisurely",
    beginnerOk: true,
    greensFee: 41,
    cartFee: 26,
    taxRate: 0.08875,
    cancelHours: 12,
    scarceWeekend: false,
    notes: "Short, hilly, cheap. Good 9-hole energy even when you play 18.",
    rating: 3.7,
    yards: "4,727",
  },
  {
    id: "la-tourette",
    name: "La Tourette Golf Course",
    shortName: "La Tourette",
    city: "Staten Island",
    state: "NY",
    holes: 18,
    walkable: true,
    singlesPolicy: "join_only",
    pace: "steady",
    beginnerOk: true,
    greensFee: 50,
    cartFee: 28,
    taxRate: 0.08875,
    cancelHours: 24,
    scarceWeekend: false,
    notes: "Greenest of the city parks. Midweek mornings actually exist.",
    rating: 4.2,
    yards: "6,700",
  },
  {
    id: "darlington",
    name: "Darlington Golf Course",
    shortName: "Darlington",
    city: "Mahwah",
    state: "NJ",
    holes: 18,
    walkable: true,
    singlesPolicy: "join_only",
    pace: "fast",
    beginnerOk: false,
    greensFee: 62,
    cartFee: 24,
    taxRate: 0.06625,
    cancelHours: 24,
    scarceWeekend: true,
    notes: "Bergen County prize. Weekend mornings are scarce-mode: book four, then invite.",
    rating: 4.5,
    yards: "6,420",
  },
  {
    id: "overpeck",
    name: "Overpeck Golf Course",
    shortName: "Overpeck",
    city: "Teaneck",
    state: "NJ",
    holes: 18,
    walkable: true,
    singlesPolicy: "join_only",
    pace: "steady",
    beginnerOk: true,
    greensFee: 55,
    cartFee: 24,
    taxRate: 0.06625,
    cancelHours: 24,
    scarceWeekend: true,
    notes: "Close to the GW Bridge. Sheet dies on Saturday. Walking discount is real.",
    rating: 4.1,
    yards: "6,512",
  },
  {
    id: "galloping-hill",
    name: "Galloping Hill Golf Course",
    shortName: "Galloping Hill",
    city: "Kenilworth",
    state: "NJ",
    holes: "both",
    walkable: true,
    singlesPolicy: "join_only",
    pace: "steady",
    beginnerOk: true,
    greensFee: 68,
    cartFee: 26,
    taxRate: 0.06625,
    cancelHours: 24,
    scarceWeekend: true,
    notes: "Union County flagship plus a 9-hole. Practice facility is the on-ramp.",
    rating: 4.4,
    yards: "6,696",
  },
  {
    id: "hominy-hill",
    name: "Hominy Hill Golf Course",
    shortName: "Hominy Hill",
    city: "Colts Neck",
    state: "NJ",
    holes: 18,
    walkable: true,
    singlesPolicy: "none",
    pace: "fast",
    beginnerOk: false,
    greensFee: 74,
    cartFee: 26,
    taxRate: 0.06625,
    cancelHours: 48,
    scarceWeekend: true,
    notes: "Monmouth’s best public. No singles online. Bring a group or wait.",
    rating: 4.7,
    yards: "7,049",
  },
  {
    id: "heron-glen",
    name: "Heron Glen Golf Course",
    shortName: "Heron Glen",
    city: "Ringoes",
    state: "NJ",
    holes: 18,
    walkable: true,
    singlesPolicy: "join_only",
    pace: "steady",
    beginnerOk: true,
    greensFee: 59,
    cartFee: 22,
    taxRate: 0.06625,
    cancelHours: 24,
    scarceWeekend: false,
    notes: "Hunterdon municipal. Cancellations actually come back if you watch the sheet.",
    rating: 4.3,
    yards: "6,937",
  },
  {
    id: "ash-brook",
    name: "Ash Brook Golf Course",
    shortName: "Ash Brook",
    city: "Scotch Plains",
    state: "NJ",
    holes: 18,
    walkable: true,
    singlesPolicy: "open",
    pace: "leisurely",
    beginnerOk: true,
    greensFee: 48,
    cartFee: 22,
    taxRate: 0.06625,
    cancelHours: 12,
    scarceWeekend: false,
    notes: "Weekday twilight is open enough to invite first, then book.",
    rating: 3.8,
    yards: "6,407",
  },
  {
    id: "pinch-brook",
    name: "Pinch Brook Golf Course",
    shortName: "Pinch Brook",
    city: "Florham Park",
    state: "NJ",
    holes: 18,
    walkable: true,
    singlesPolicy: "open",
    pace: "leisurely",
    beginnerOk: true,
    greensFee: 44,
    cartFee: 20,
    taxRate: 0.06625,
    cancelHours: 12,
    scarceWeekend: false,
    notes: "Executive-length. Perfect after-work 9 that pretends to be 18.",
    rating: 4.0,
    yards: "5,013",
  },
];

export function courseById(id: string): Course | undefined {
  return COURSES.find((course) => course.id === id);
}

export function money(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function priceBreak(course: Course, walk: boolean): PriceBreak {
  const cart = walk && course.walkable ? 0 : course.cartFee;
  const greens = course.greensFee;
  const tax = (greens + cart) * course.taxRate;
  return { greens, cart, tax, total: greens + cart + tax };
}

export function windowLabel(window: TimeWindow): string {
  if (window === "early") return "6:30–9:30am";
  if (window === "mid") return "9:30am–1:30pm";
  if (window === "twilight") return "after 2:30pm";
  return "any time";
}

export function suggestedTee(window: TimeWindow, scarce: boolean): string {
  if (window === "early") return scarce ? "7:12am" : "8:04am";
  if (window === "mid") return "11:20am";
  if (window === "twilight") return "3:08pm";
  return scarce ? "7:36am" : "10:12am";
}

export function isScarce(course: Course, date: string): boolean {
  const day = new Date(`${date}T12:00:00`).getDay();
  const weekend = day === 0 || day === 6;
  return weekend && course.scarceWeekend;
}

export function availability(course: Course, query: SearchQuery): "open" | "soldout" | "fill" {
  const scarce = isScarce(course, query.date);
  if (query.players === 1) {
    if (course.singlesPolicy === "none") return "soldout";
    if (course.singlesPolicy === "join_only") return scarce ? "soldout" : "fill";
    return scarce ? "fill" : "open";
  }
  if (scarce && (course.id === "hominy-hill" || course.id === "bethpage-yellow")) {
    return query.window === "twilight" ? "open" : "soldout";
  }
  if (scarce && query.window === "early") {
    return course.state === "NJ" && course.id !== "ash-brook" ? "soldout" : "open";
  }
  return "open";
}

export function filterCourses(query: SearchQuery): Course[] {
  return COURSES.filter((course) => {
    if (query.holes === 9 && course.holes === 18 && course.id !== "galloping-hill" && course.id !== "pinch-brook") {
      if (course.id === "kissena") return true;
      return query.window === "twilight";
    }
    if (query.walk === "walk" && !course.walkable) return false;
    return true;
  });
}

export const DEFAULT_DATE = (() => {
  const d = new Date();
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7));
  return d.toISOString().slice(0, 10);
})();
