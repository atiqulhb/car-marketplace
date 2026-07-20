'use client'

import { fetchCarsViaApi } from "@/lib/react-query/cars-query"
import { queryKeys } from "@/lib/react-query/query-keys"
import { useInfiniteQuery } from "@tanstack/react-query"
import CarCard from "@/components/CarCard"
import styles from './styles.module.css'
import { useEffect, useRef } from "react"


export default function CarsDisplay({ filters }) {

    const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
        queryKey: queryKeys.cars(filters),
        initialPageParam: null as string || null,
        queryFn: ({ pageParam }) => fetchCarsViaApi(filters, pageParam),
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    })

    const cars = data?.pages.flatMap(page => page.items) ?? []

    //console.log(data, 'data from cars display')
    //console.log(cars, 'cars from cars display')

    const sentinelRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!hasNextPage) return

        const el = sentinelRef.current
        if (!el) return

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !isFetchingNextPage) {
                fetchNextPage()
            }
        })

        observer.observe(el)
        return () => observer.disconnect()
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])

    return (
        <div className={styles.Grid}>
            {cars?.map((car) => (
                <CarCard key={car.id} info={car}/>
            ))}
            <div ref={sentinelRef}/>
        </div>
    )
}