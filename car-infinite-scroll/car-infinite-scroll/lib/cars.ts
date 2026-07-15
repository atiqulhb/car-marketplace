import { CarFilters, CarsPage, CarsQueryParams, PAGE_SIZE, SORT_OPTIONS, SortOption } from "@/types/cars";
import { cookies } from "next/headers";

// ─── Keystone fetch helper ────────────────────────────────────────────────────

const KEYSTONE_URL = process.env.KEYSTONE_URL ?? "http://localhost:3001/api/graphql";

export async function keystoneFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  opts?: { withAuth?: boolean }
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Forward session cookie for authenticated requests
  if (opts?.withAuth) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.toString();
    if (sessionCookie) headers["Cookie"] = sessionCookie;
  }

  const res = await fetch(KEYSTONE_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    // No cache — TanStack Query manages caching on the client
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Keystone fetch failed: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  if (json.errors?.length) {
    throw new Error(json.errors.map((e: { message: string }) => e.message).join("; "));
  }

  return json.data as T;
}

// ─── Where clause builder ─────────────────────────────────────────────────────

function buildWhere(filters: CarFilters = {}, cursor: string | null | undefined) {
  const AND: object[] = [];

  // Cursor-based pagination — take items strictly after the cursor
  // We use createdAt + id composite to handle ties deterministically
  if (cursor != null) {
    AND.push({ id: { gt: cursor } });
  }

  if (filters.brandSlug) {
    AND.push({ brand: { slug: { equals: filters.brandSlug } } });
  }

  if (filters.modelSlug) {
    AND.push({ model: { slug: { equals: filters.modelSlug } } });
  }

  if (filters.fuelType) {
    AND.push({ fuelType: { equals: filters.fuelType } });
  }

  if (filters.transmission) {
    AND.push({ transmission: { equals: filters.transmission } });
  }

  if (filters.yearMin != null) {
    AND.push({ year: { gte: filters.yearMin } });
  }

  if (filters.yearMax != null) {
    AND.push({ year: { lte: filters.yearMax } });
  }

  // Use != null (loose) to safely allow 0 as a valid price/mileage value
  if (filters.priceMin != null) {
    AND.push({ price: { gte: filters.priceMin } });
  }

  if (filters.priceMax != null) {
    AND.push({ price: { lte: filters.priceMax } });
  }

  if (filters.mileageMax != null) {
    AND.push({ mileage: { lte: filters.mileageMax } });
  }

  if (filters.search) {
    AND.push({
      OR: [
        { title: { contains: filters.search, mode: "insensitive" } },
        { brand: { name: { contains: filters.search, mode: "insensitive" } } },
        { model: { name: { contains: filters.search, mode: "insensitive" } } },
      ],
    });
  }

  return AND.length ? { AND } : {};
}

// ─── GraphQL query ────────────────────────────────────────────────────────────

const CARS_QUERY = /* graphql */ `
  query GetCars($where: CarWhereInput!, $orderBy: [CarOrderByInput!]!, $take: Int!, $skip: Int) {
    cars(where: $where, orderBy: $orderBy, take: $take, skip: $skip) {
      id
      title
      slug
      price
      year
      mileage
      fuelType
      transmission
      brand { id name slug }
      model { id name slug }
      images { url alt }
      createdAt
    }
    carsCount(where: $where)
  }
`;

// ─── Main data fetcher ────────────────────────────────────────────────────────

export async function fetchCarsPage({
  cursor,
  limit = PAGE_SIZE,
  sort = "newest",
  filters = {},
}: CarsQueryParams): Promise<CarsPage> {
  const orderBy = SORT_OPTIONS[sort as SortOption]?.orderBy ?? SORT_OPTIONS.newest.orderBy;
  const where = buildWhere(filters, cursor);

  const data = await keystoneFetch<{
    cars: CarsPage["cars"];
    carsCount: number;
  }>(CARS_QUERY, {
    where,
    orderBy: [orderBy],
    take: limit + 1, // Fetch one extra to know if there's a next page
    skip: 0,
  });

  const cars = data.cars;
  const hasNextPage = cars.length > limit;
  const pageItems = hasNextPage ? cars.slice(0, limit) : cars;
  const nextCursor = hasNextPage ? (pageItems[pageItems.length - 1]?.id ?? null) : null;

  return {
    cars: pageItems,
    nextCursor,
    total: data.carsCount,
  };
}
