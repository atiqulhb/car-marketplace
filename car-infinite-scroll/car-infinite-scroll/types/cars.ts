// ─── Car Domain Types ────────────────────────────────────────────────────────

export interface Car {
  id: string;
  title: string;
  slug: string;
  price: number;
  year: number;
  mileage: number;
  fuelType: FuelType;
  transmission: Transmission;
  brand: {
    id: string;
    name: string;
    slug: string;
  };
  model: {
    id: string;
    name: string;
    slug: string;
  };
  images: {
    url: string;
    alt?: string;
  }[];
  createdAt: string;
}

export type FuelType = "PETROL" | "DIESEL" | "ELECTRIC" | "HYBRID" | "CNG";
export type Transmission = "MANUAL" | "AUTOMATIC" | "CVT";

// ─── Filter & Sort Types ──────────────────────────────────────────────────────

export interface CarFilters {
  brandSlug?: string;
  modelSlug?: string;
  fuelType?: FuelType;
  transmission?: Transmission;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  mileageMax?: number;
  search?: string;
}

export type SortOption =
  | "newest"
  | "oldest"
  | "price_asc"
  | "price_desc"
  | "mileage_asc"
  | "year_desc";

export const SORT_OPTIONS: Record<SortOption, { label: string; orderBy: object }> = {
  newest: {
    label: "Newest First",
    orderBy: { createdAt: "desc" },
  },
  oldest: {
    label: "Oldest First",
    orderBy: { createdAt: "asc" },
  },
  price_asc: {
    label: "Price: Low to High",
    orderBy: { price: "asc" },
  },
  price_desc: {
    label: "Price: High to Low",
    orderBy: { price: "desc" },
  },
  mileage_asc: {
    label: "Lowest Mileage",
    orderBy: { mileage: "asc" },
  },
  year_desc: {
    label: "Newest Year",
    orderBy: { year: "desc" },
  },
};

// ─── Pagination Types ─────────────────────────────────────────────────────────

export const PAGE_SIZE = 12;

export interface CarsPage {
  cars: Car[];
  nextCursor: string | null; // ID of the last item — null means no more pages
  total: number;
}

export interface CarsQueryParams {
  cursor?: string | null;
  limit?: number;
  sort?: SortOption;
  filters?: CarFilters;
}
