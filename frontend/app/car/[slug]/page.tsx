import { getCarInformations } from '@/lib/keystone'

export default async function CarPage({ params }) {
    const { slug } = await params
    console.log(slug)


   const { id , brand, model, dealer } = await getCarInformations(slug)
   console.log(dealer)
   
  return (
    <div>
      <div>page</div>
      <span>{dealer?.name}</span>
    </div>
  )
}
