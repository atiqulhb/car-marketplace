"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchCarsClient, carKeys } from "@/lib/car-query";
import { CarFilters, CarsPage, SortOption } from "@/types/cars";

export function useCars(sort: SortOption, filters: CarFilters) {
  return useInfiniteQuery<
    CarsPage,       // TData — each page shape
    Error,          // TError
    CarsPage,       // TQueryFnData — same as TData here
    ReturnType<typeof carKeys.list>,
    string | null   // TPageParam — our cursor (ID string or null for first page)
  >({
    queryKey: carKeys.list(sort, filters),

    queryFn: ({ pageParam }) =>
      fetchCarsClient({ pageParam, sort, filters }),

    // First page has no cursor
    initialPageParam: null,

    // Extract the cursor from the last page to use as the next pageParam
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,

    // Keep previous data visible while fetching the next page
    // (avoids layout shift during filter changes on already-loaded pages)
    placeholderData: (prev) => prev,

    // Keep data fresh for 60 s; stale after 30 s
    staleTime: 30_000,
    gcTime: 60_000,
  });
}
