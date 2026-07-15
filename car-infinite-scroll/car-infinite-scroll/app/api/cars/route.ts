import { fetchCarsPage } from "@/lib/cars";
import { CarFilters, PAGE_SIZE, SortOption } from "@/types/cars";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  const cursor   = sp.get("cursor") ?? null;
  const sort     = (sp.get("sort") ?? "newest") as SortOption;
  const limit    = Number(sp.get("limit") ?? PAGE_SIZE);

  const filters: CarFilters = {
    brandSlug:    sp.get("brand")        ?? undefined,
    modelSlug:    sp.get("model")        ?? undefined,
    fuelType:     (sp.get("fuelType")    as CarFilters["fuelType"])    ?? undefined,
    transmission: (sp.get("transmission") as CarFilters["transmission"]) ?? undefined,
    search:       sp.get("search")       ?? undefined,
    yearMin:      sp.has("yearMin")    ? Number(sp.get("yearMin"))    : undefined,
    yearMax:      sp.has("yearMax")    ? Number(sp.get("yearMax"))    : undefined,
    priceMin:     sp.has("priceMin")   ? Number(sp.get("priceMin"))   : undefined,
    priceMax:     sp.has("priceMax")   ? Number(sp.get("priceMax"))   : undefined,
    mileageMax:   sp.has("mileageMax") ? Number(sp.get("mileageMax")) : undefined,
  };

  // Strip undefined keys so buildWhere doesn't see empty strings
  Object.keys(filters).forEach((k) => {
    if (filters[k as keyof CarFilters] === undefined) {
      delete filters[k as keyof CarFilters];
    }
  });

  try {
    const page = await fetchCarsPage({ cursor, sort, filters, limit });
    return NextResponse.json(page);
  } catch (err) {
    console.error("[/api/cars]", err);
    return NextResponse.json({ error: "Failed to fetch cars" }, { status: 500 });
  }
}
