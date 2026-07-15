'use client'

import { useToggleWishListing } from "@/hooks/useToggleWishListing"
import { useWishlist } from "@/hooks/useWIshlist"
import { Heart } from 'lucide-react'
import styles from './styles.module.css'

export default function CarCard({ info }) {
    const { id, brand, model, year, price } = info

    const { toggle } = useToggleWishListing()
    const { wishlist } = useWishlist()

    const isWishListed = wishlist?.has(id)

    return (
        <div key={id} className={styles.CarCard}>
            <Heart style={isWishListed ? { fill: 'Red', color: 'Red' } : { fill: 'none', color: 'Black' }} strokeWidth={1} onClick={() => toggle(id)}/>
            <h3>{brand} {model}</h3>
            <p>Year: {year}</p>
            <p>Price: ${price}</p>
        </div>
    )
}