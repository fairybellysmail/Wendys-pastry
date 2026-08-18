// Shared, client-safe operational constants and pure logic for the
// Custom Order Atelier. Origin node: Etobicoke, Toronto, Ontario.

export const STUDIO_ORIGIN = "Etobicoke, Toronto, Ontario";
export const NOTIFICATION_EMAIL = "sales@wendysbakehouse.ca";
export const DEPOSIT_CENTS = 5000;
export const FLAT_DELIVERY_FEE_CENTS = 2500;
export const EXTENDED_RATE_CENTS_PER_MILE = 250;
export const LOCAL_RADIUS_MILES = 15;
export const MAX_RADIUS_MILES = 40;
export const WEEKLY_POINT_LIMIT = 10;

export const OCCASIONS = [
  "Wedding",
  "Milestone Birthday",
  "Sweet 16",
  "Holiday",
  "Other",
] as const;

export const STYLES = [
  { value: "Multi-tier / Bespoke Cake", points: 3 },
  { value: "Palette-Knife Single Tier", points: 1 },
  { value: "Cupcake Set (per dozen)", points: 0.5 },
  { value: "Sugar Cookies (per dozen)", points: 0.5 },
] as const;

export const FLAVORS = ["Rich Chocolate Fudge", "Velvet Cream", "Vanilla Bean"] as const;

export type FulfillmentMethod = "pickup" | "white_glove" | "extended";

// Mock distance table keyed by Canadian forward sortation area (first 3
// characters). Replaced by a real geocoding lookup at production cutover.
const FSA_DISTANCES: Record<string, number> = {
  M8V: 1,
  M8W: 2,
  M8X: 3,
  M8Y: 3,
  M8Z: 2,
  M9A: 4,
  M9B: 5,
  M9C: 6,
  M9P: 6,
  M9R: 7,
  M9V: 9,
  M9W: 8,
  M6S: 5,
  M6P: 7,
  M5V: 9,
  M5H: 10,
  M4W: 13,
  L4W: 14,
  L5B: 16,
  L5N: 22,
  L6H: 28,
  L6M: 31,
  L7L: 38,
  L8P: 44,
  N2L: 68,
  K1A: 246,
};

export function normalizePostal(input: string): string {
  return input.replace(/\s+/g, "").toUpperCase();
}

export function isValidPostal(input: string): boolean {
  return /^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(normalizePostal(input));
}

/** Deterministic mock distance in miles from the Etobicoke studio. */
export function distanceFromStudio(postal: string): number {
  const fsa = normalizePostal(postal).slice(0, 3);
  const known = FSA_DISTANCES[fsa];
  if (known !== undefined) return known;
  // Deterministic fallback so the same postal code always resolves the same way.
  let hash = 0;
  for (const char of fsa) hash = (hash * 31 + char.charCodeAt(0)) % 997;
  return Math.round((6 + (hash % 520) / 10) * 10) / 10;
}

export function availableMethods(miles: number): FulfillmentMethod[] {
  if (miles <= LOCAL_RADIUS_MILES) return ["pickup", "white_glove"];
  if (miles <= MAX_RADIUS_MILES) return ["pickup", "extended"];
  return ["pickup"];
}

export function deliveryFeeCents(method: FulfillmentMethod, miles: number): number {
  if (method === "pickup") return 0;
  if (method === "white_glove") return FLAT_DELIVERY_FEE_CENTS;
  const billable = Math.max(0, Math.ceil(miles - LOCAL_RADIUS_MILES));
  return billable * EXTENDED_RATE_CENTS_PER_MILE;
}

export function methodLabel(method: FulfillmentMethod): string {
  if (method === "pickup") return "Studio Pickup (Free)";
  if (method === "white_glove") return "White-Glove Hand Delivery ($25 Flat Fee)";
  return "Extended Distance Delivery ($2.50 / mile beyond 15)";
}

export function pointsForStyle(style: string): number {
  return STYLES.find((entry) => entry.value === style)?.points ?? 1;
}

/** ISO (Monday-based) week start, as a YYYY-MM-DD string. */
export function weekStartKey(date: Date): string {
  const copy = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const weekday = copy.getUTCDay();
  const shift = weekday === 0 ? 6 : weekday - 1;
  copy.setUTCDate(copy.getUTCDate() - shift);
  return copy.toISOString().slice(0, 10);
}

export function dateKey(date: Date): string {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    .toISOString()
    .slice(0, 10);
}

export function formatMoney(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}