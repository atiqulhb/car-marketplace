import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { carSearchParamsCache } from "@/lib/car-params";
import { prefetchCarsInfiniteQuery } from "@/lib/car-query";
import { CarBrowsePage } from "@/components/cars/CarBrowsePage";
import type { CarFilters, SortOption } from "@/types/cars";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CarsPage({ searchParams }: PageProps) {
  // Parse & validate all URL params on the server (nuqs server cache)
  const params = await carSearchParamsCache.parse(await searchParams);

  // Build the typed filters object from parsed params
  const filters: CarFilters = {
    ...(params.brand        && { brandSlug:    params.brand }),
    ...(params.model        && { modelSlug:    params.model }),
    ...(params.fuelType     && { fuelType:     params.fuelType }),
    ...(params.transmission && { transmission: params.transmission }),
    ...(params.search       && { search:       params.search }),
    ...(params.yearMin   != null && { yearMin:   params.yearMin }),
    ...(params.yearMax   != null && { yearMax:   params.yearMax }),
    ...(params.priceMin  != null && { priceMin:  params.priceMin }),
    ...(params.priceMax  != null && { priceMax:  params.priceMax }),
    ...(params.mileageMax != null && { mileageMax: params.mileageMax }),
  };

  const sort = params.sort as SortOption;

  // Prefetch page 1 directly from Keystone (server-to-server, no HTTP round-trip)
  const queryClient = new QueryClient();
  await prefetchCarsInfiniteQuery(queryClient, { sort, filters });

  return (
    // NuqsAdapter wires nuqs to the Next.js App Router
    <NuqsAdapter>
      {/* HydrationBoundary serializes the prefetched data into the HTML */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CarBrowsePage initialSort={sort} initialFilters={filters} />
      </HydrationBoundary>
    </NuqsAdapter>
  );
}

// Optional: make this page dynamic so URL changes always get fresh data
export const dynamic = "force-dynamic";
