'use client'

import Link from "next/link"
import Image from "next/image"
import { useToggleWishListing } from "@/hooks/useToggleWishListing"
import { useWishlist } from "@/hooks/useWIshlist"
import { Heart } from 'lucide-react'
import styles from './styles.module.css'

export default function CarCard({ info }) {
    const { id, brand, model, year, price, images, slug } = info

    console.log(images)

    const { toggle } = useToggleWishListing()
    const { wishlist } = useWishlist()

    const isWishListed = wishlist?.has(id)

    return (
        <Link href={{ pathname: `/car/${slug}` }}>
            <div key={id} className={styles.CarCard}>
                <div className={styles.Image}>
                    { images.length > 0 && <Image src={`/api/media${images[0].image.url}`} width={640} height={480} alt={`${brand} ${model} ${year}`}/>}
                </div>
                <div className={styles.WishList}>
                    <Heart style={isWishListed ? { fill: 'Red', color: 'Red' } : { fill: 'none', color: 'Black' }} strokeWidth={1} onClick={() => toggle(id)}/>
                </div>
                <div className={styles.Info}>
                    <h3>{brand} {model} {year}</h3>
                    <p>{Number(price).toLocaleString("en-US", {style:"currency", currency:"USD", minimumFractionDigits: 0, maximumFractionDigits: 2})}</p>
                </div>
            </div>
        </Link>
    )
}