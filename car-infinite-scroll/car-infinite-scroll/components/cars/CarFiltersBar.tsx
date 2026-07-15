"use client";

import { useQueryStates } from "nuqs";
import { carFilterParsers } from "@/lib/car-params";
import { SORT_OPTIONS, FuelType, SortOption, Transmission } from "@/types/cars";

// Example static options — in production, fetch brands/models from Keystone
const BRAND_OPTIONS = [
  { slug: "toyota",  label: "Toyota" },
  { slug: "honda",   label: "Honda" },
  { slug: "bmw",     label: "BMW" },
  { slug: "mercedes",label: "Mercedes" },
  { slug: "ford",    label: "Ford" },
];

const FUEL_OPTIONS: { value: FuelType; label: string }[] = [
  { value: "PETROL",   label: "Petrol" },
  { value: "DIESEL",   label: "Diesel" },
  { value: "ELECTRIC", label: "Electric" },
  { value: "HYBRID",   label: "Hybrid" },
  { value: "CNG",      label: "CNG" },
];

const TRANSMISSION_OPTIONS: { value: Transmission; label: string }[] = [
  { value: "MANUAL",    label: "Manual" },
  { value: "AUTOMATIC", label: "Automatic" },
  { value: "CVT",       label: "CVT" },
];

export function CarFiltersBar() {
  // All filter state lives in the URL — nuqs handles sync automatically
  const [params, setParams] = useQueryStates(carFilterParsers, {
    // Shallow routing: update URL without triggering full navigation
    history: "push",
    shallow: true,
  });

  function reset() {
    setParams({
      brand: "",
      model: "",
      fuelType: "" as FuelType,
      transmission: "" as Transmission,
      yearMin: null,
      yearMax: null,
      priceMin: null,
      priceMax: null,
      mileageMax: null,
      search: "",
      sort: "newest",
    });
  }

  const hasActiveFilters =
    params.brand || params.model || params.fuelType ||
    params.transmission || params.search ||
    params.yearMin != null || params.yearMax != null ||
    params.priceMin != null || params.priceMax != null ||
    params.mileageMax != null;

  return (
    <div className="filters-bar">
      {/* Search */}
      <div className="filter-group filter-group--search">
        <input
          type="search"
          placeholder="Search make, model…"
          value={params.search}
          onChange={(e) => setParams({ search: e.target.value || "" })}
          className="filter-input filter-input--search"
        />
      </div>

      {/* Sort */}
      <div className="filter-group">
        <label className="filter-label">Sort</label>
        <select
          value={params.sort}
          onChange={(e) => setParams({ sort: e.target.value as SortOption })}
          className="filter-select"
        >
          {Object.entries(SORT_OPTIONS).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Brand */}
      <div className="filter-group">
        <label className="filter-label">Brand</label>
        <select
          value={params.brand}
          onChange={(e) => setParams({ brand: e.target.value, model: "" })}
          className="filter-select"
        >
          <option value="">All Brands</option>
          {BRAND_OPTIONS.map((b) => (
            <option key={b.slug} value={b.slug}>{b.label}</option>
          ))}
        </select>
      </div>

      {/* Fuel Type */}
      <div className="filter-group">
        <label className="filter-label">Fuel</label>
        <select
          value={params.fuelType}
          onChange={(e) => setParams({ fuelType: e.target.value as FuelType || ("" as FuelType) })}
          className="filter-select"
        >
          <option value="">Any Fuel</option>
          {FUEL_OPTIONS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      {/* Transmission */}
      <div className="filter-group">
        <label className="filter-label">Transmission</label>
        <select
          value={params.transmission}
          onChange={(e) => setParams({ transmission: e.target.value as Transmission || ("" as Transmission) })}
          className="filter-select"
        >
          <option value="">Any</option>
          {TRANSMISSION_OPTIONS.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Year Range */}
      <div className="filter-group filter-group--range">
        <label className="filter-label">Year</label>
        <div className="range-inputs">
          <input
            type="number"
            placeholder="From"
            value={params.yearMin ?? ""}
            onChange={(e) => setParams({ yearMin: e.target.value ? Number(e.target.value) : null })}
            className="filter-input filter-input--range"
            min={1990}
            max={new Date().getFullYear()}
          />
          <span className="range-sep">–</span>
          <input
            type="number"
            placeholder="To"
            value={params.yearMax ?? ""}
            onChange={(e) => setParams({ yearMax: e.target.value ? Number(e.target.value) : null })}
            className="filter-input filter-input--range"
            min={1990}
            max={new Date().getFullYear()}
          />
        </div>
      </div>

      {/* Price Range */}
      <div className="filter-group filter-group--range">
        <label className="filter-label">Price (৳)</label>
        <div className="range-inputs">
          <input
            type="number"
            placeholder="Min"
            value={params.priceMin ?? ""}
            onChange={(e) => setParams({ priceMin: e.target.value ? Number(e.target.value) : null })}
            className="filter-input filter-input--range"
          />
          <span className="range-sep">–</span>
          <input
            type="number"
            placeholder="Max"
            value={params.priceMax ?? ""}
            onChange={(e) => setParams({ priceMax: e.target.value ? Number(e.target.value) : null })}
            className="filter-input filter-input--range"
          />
        </div>
      </div>

      {/* Mileage */}
      <div className="filter-group">
        <label className="filter-label">Max Mileage (km)</label>
        <input
          type="number"
          placeholder="e.g. 50000"
          value={params.mileageMax ?? ""}
          onChange={(e) => setParams({ mileageMax: e.target.value ? Number(e.target.value) : null })}
          className="filter-input"
        />
      </div>

      {/* Reset */}
      {hasActiveFilters && (
        <button onClick={reset} className="filter-reset">
          Clear All
        </button>
      )}
    </div>
  );
}
