import { CarFilters, CarsPage, CarsQueryParams, SortOption } from "@/types/cars";
import { InfiniteData, QueryClient } from "@tanstack/react-query";

// ─── Query Keys ───────────────────────────────────────────────────────────────
// Structured keys so any change to filters/sort triggers a fresh fetch

export const carKeys = {
  all: ["cars"] as const,
  lists: () => [...carKeys.all, "list"] as const,
  list: (sort: SortOption, filters: CarFilters) =>
    [...carKeys.lists(), { sort, filters }] as const,
};

// ─── Client-side fetcher (hits Next.js Route Handler) ─────────────────────────
// The actual data fetching always goes through the Route Handler so we never
// expose the Keystone URL to the browser.

export async function fetchCarsClient({
  pageParam,
  sort,
  filters,
}: {
  pageParam: string | null;
  sort: SortOption;
  filters: CarFilters;
}): Promise<CarsPage> {
  const params = new URLSearchParams();

  if (pageParam) params.set("cursor", pageParam);
  params.set("sort", sort);

  // Filters — only append non-empty values
  if (filters.brandSlug)     params.set("brand",        filters.brandSlug);
  if (filters.modelSlug)     params.set("model",        filters.modelSlug);
  if (filters.fuelType)      params.set("fuelType",     filters.fuelType);
  if (filters.transmission)  params.set("transmission", filters.transmission);
  if (filters.search)        params.set("search",       filters.search);
  if (filters.yearMin   != null) params.set("yearMin",   String(filters.yearMin));
  if (filters.yearMax   != null) params.set("yearMax",   String(filters.yearMax));
  if (filters.priceMin  != null) params.set("priceMin",  String(filters.priceMin));
  if (filters.priceMax  != null) params.set("priceMax",  String(filters.priceMax));
  if (filters.mileageMax != null) params.set("mileageMax", String(filters.mileageMax));

  const res = await fetch(`/api/cars?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch cars");
  return res.json() as Promise<CarsPage>;
}

// ─── Prefetch helper (Server Components) ─────────────────────────────────────
// Call this in page.tsx to seed the client cache with page 1 data.

export async function prefetchCarsInfiniteQuery(
  queryClient: QueryClient,
  params: Omit<CarsQueryParams, "cursor">
) {
  const { fetchCarsPage } = await import("@/lib/cars");

  const firstPage = await fetchCarsPage({ ...params, cursor: null });

  // Manually set the infinite query data so HydrationBoundary can dehydrate it
  queryClient.setQueryData<InfiniteData<CarsPage>>(
    carKeys.list(params.sort ?? "newest", params.filters ?? {}),
    {
      pages: [firstPage],
      pageParams: [null], // first page has no cursor
    }
  );
}
