"use client";

import { useCallback } from "react";
import { useQueryStates } from "nuqs";
import { carFilterParsers } from "@/lib/car-params";
import { useCars } from "@/hooks/useCars";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { CarCard } from "./CarCard";
import { CarCardSkeleton } from "./CarCardSkeleton";
import { CarFilters, SortOption } from "@/types/cars";

interface CarGridProps {
  initialSort: SortOption;
  initialFilters: CarFilters;
}

export function CarGrid({ initialSort, initialFilters }: CarGridProps) {
  // Read live URL state — this is what triggers refetches when filters change
  const [params] = useQueryStates(carFilterParsers);

  // Derive typed filters from URL params (same shape as server-side)
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

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useCars(sort, filters);

  // Stable callback — only fires when sentinel enters viewport
  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Sentinel ref — attach to the div at the bottom of the list
  const sentinelRef = useIntersectionObserver(loadMore, {
    rootMargin: "200px", // Start loading 200 px before the sentinel is visible
  });

  // Flatten all pages into one array
  const cars = data?.pages.flatMap((page) => page.cars) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  // ── Error state ──────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="state-message state-message--error">
        <span>⚠️</span>
        <p>Failed to load cars: {error.message}</p>
        <button onClick={() => window.location.reload()} className="btn-retry">
          Try again
        </button>
      </div>
    );
  }

  // ── Empty state ──────────────────────────────────────────────────────────
  if (!isLoading && cars.length === 0) {
    return (
      <div className="state-message state-message--empty">
        <span>🔍</span>
        <p>No cars match your filters.</p>
        <p className="state-hint">Try adjusting your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="car-grid-wrapper">
      {/* Result count */}
      {!isLoading && (
        <p className="results-count">
          {cars.length} of {total.toLocaleString()} cars
        </p>
      )}

      {/* Grid */}
      <div className="car-grid">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => <CarCardSkeleton key={i} />)
          : cars.map((car) => <CarCard key={car.id} car={car} />)
        }

        {/* Skeleton row while fetching the next page */}
        {isFetchingNextPage &&
          Array.from({ length: 4 }).map((_, i) => (
            <CarCardSkeleton key={`next-${i}`} />
          ))
        }
      </div>

      {/* Sentinel — IntersectionObserver target */}
      <div ref={sentinelRef} className="scroll-sentinel" aria-hidden="true" />

      {/* End of list message */}
      {!hasNextPage && cars.length > 0 && !isLoading && (
        <p className="end-of-list">You&apos;ve seen all {total.toLocaleString()} cars</p>
      )}
    </div>
  );
}
