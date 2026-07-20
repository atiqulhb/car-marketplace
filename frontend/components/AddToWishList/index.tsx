'use client'

import { Heart } from 'lucide-react'

export default function AddToWishList() {
    return (
        <div onClick={() => console.log('clicked')}>
            <Heart/>
        </div>
    )
}