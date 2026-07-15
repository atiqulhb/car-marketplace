"use client";

import { CarFiltersBar } from "./CarFiltersBar";
import { CarGrid } from "./CarGrid";
import { CarFilters, SortOption } from "@/types/cars";

interface CarBrowsePageProps {
  initialSort: SortOption;
  initialFilters: CarFilters;
}

/**
 * Client shell component that holds the filters bar and the infinite grid.
 * Receives initial values from the server-rendered page.tsx (used to match
 * the pre-hydrated query key so TanStack Query picks up the server data).
 */
export function CarBrowsePage({ initialSort, initialFilters }: CarBrowsePageProps) {
  return (
    <main className="browse-page">
      <header className="browse-header">
        <h1 className="browse-title">Browse Cars</h1>
        <p className="browse-subtitle">
          Find your next ride — filter, sort, and scroll.
        </p>
      </header>

      <CarFiltersBar />

      <CarGrid initialSort={initialSort} initialFilters={initialFilters} />
    </main>
  );
}
