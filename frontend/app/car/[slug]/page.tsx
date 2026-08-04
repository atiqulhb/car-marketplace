import Image from 'next/image'
import { getCarInformations } from '@/lib/keystone'
import styles from './Car.module.css'

export default async function CarPage({ params }) {
    const { slug } = await params
    console.log(slug)


   const car = await getCarInformations(slug)
   console.log(car)
   
  return (
    <div>
      <div className={styles.CarImage}>
        <Image src={`/api/media${car?.images[0]?.image?.url}`} width={800} height={600} alt={`${car?.brand?.name} ${car?.model?.name} ${car?.year}`}/>
      </div>
      <div className={styles.Details}>
        <div className={styles.Info}>
            <p className={styles.Make}>{car?.brand?.name} {car?.model?.name} {car?.year}</p>
            <p className={styles.PriceTag}>{Number(car.price).toLocaleString("en-US", {style:"currency", currency:"USD", minimumFractionDigits: 0, maximumFractionDigits: 2})}</p>
            <button className={styles.Button}>Book</button>
            <div className={styles.Specification}>
              <span>SUV</span>
              <span>Hybrid</span>
              <span>VTEC</span>
              <span>204hp</span>
            </div>
        </div>
        <div className={styles.DealerSection}>
          <div className={styles.DealerInfo}>
            <div className={styles.Logo}></div>
            <h2>Kai Motors</h2>
            <p>London, England</p>
            <p>32323-323-2333</p>
          </div>
            <div className={styles.DealerButtons}>
              <button>Visit Store</button>
              <button>Send Message</button>
            </div>
        </div>
      </div>
    </div>
  )
}
