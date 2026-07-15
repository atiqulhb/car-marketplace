export async function fetchCarsViaApi(filters, cursor) {
  const searchParams = new URLSearchParams(filters)

  Object.entries(filters).forEach(([key, value]) => {
    if (value != null) {
      searchParams.set(key, value)
    }
  })

  if (cursor) {
    searchParams.set('cursor', cursor)
  }
  
  const res = await fetch(`/api/cars?${searchParams.toString()}`)
  if (!res.ok) {
    throw new Error(`Failed to fetch cars: ${res.statusText}`)
  }
  return res.json()
}