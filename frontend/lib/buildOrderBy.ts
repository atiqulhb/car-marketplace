export function buildOrderBy(filters) {
  switch (filters.sort) {
    case "price_asc":
      return [{ price: "asc" }, { id: 'asc' }];
    case "price_desc":
      return [{ price: "desc" }, { id: 'asc' }];
    case "year_asc":
      return [{ year: "asc" }, { id: 'asc' }];
    case "year_desc":
      return [{ year: "desc" }];
    default:
      return [{ createdAt: "desc" }, { id: 'desc' }];
  }
}