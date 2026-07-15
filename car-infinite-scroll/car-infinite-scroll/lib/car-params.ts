import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";
import { FuelType, SortOption, Transmission } from "@/types/cars";

const FUEL_TYPES = ["PETROL", "DIESEL", "ELECTRIC", "HYBRID", "CNG"] as const satisfies readonly FuelType[];
const TRANSMISSIONS = ["MANUAL", "AUTOMATIC", "CVT"] as const satisfies readonly Transmission[];
const SORT_KEYS = ["newest", "oldest", "price_asc", "price_desc", "mileage_asc", "year_desc"] as const satisfies readonly SortOption[];

// ─── Param definitions ────────────────────────────────────────────────────────
// Export these so client-side `useQueryStates` can reuse the exact same parsers

export const carFilterParsers = {
  brand:       parseAsString.withDefault(""),
  model:       parseAsString.withDefault(""),
  fuelType:    parseAsStringLiteral(FUEL_TYPES).withDefault("" as FuelType),
  transmission: parseAsStringLiteral(TRANSMISSIONS).withDefault("" as Transmission),
  yearMin:     parseAsInteger,
  yearMax:     parseAsInteger,
  priceMin:    parseAsInteger,
  priceMax:    parseAsInteger,
  mileageMax:  parseAsInteger,
  search:      parseAsString.withDefault(""),
  sort:        parseAsStringLiteral(SORT_KEYS).withDefault("newest"),
};

// ─── Server-side cache ────────────────────────────────────────────────────────
// Used in Server Components / page.tsx to read params without overhead

export const carSearchParamsCache = createSearchParamsCache(carFilterParsers);
