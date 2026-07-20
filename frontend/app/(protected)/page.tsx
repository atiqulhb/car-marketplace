import { getQueryClient } from "@/lib/get-query-client";
import { fetchCars, getAuthedUser, getWishlist } from "@/lib/keystone";
import { queryKeys } from "@/lib/react-query/query-keys";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Filters from "@/components/Filters";
import CarsDisplay from "@/components/CarsDisplay";

export default async function Home({ searchParams }) {
  const params = await searchParams;

  const qc = getQueryClient()

  const [firstPage, authedUser] = await Promise.all([
    fetchCars(params, null),
    getAuthedUser()
  ])
  

  qc.setQueryData([queryKeys.cars(params)], {
    pages: [firstPage],
    pageParams: [null]
  })

  qc.setQueryData([queryKeys.authedUser], authedUser)
  
  if (authedUser) {
    qc.setQueryData(
        queryKeys.wishlist(authedUser.id),
        await getWishlist()
    )
}

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <Filters/>
      <CarsDisplay filters={params}/>
    </HydrationBoundary>
  );
}
