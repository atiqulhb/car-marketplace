"use client";

import Link from "next/link";
import Image from "next/image";
import { Car } from "@/types/cars";

interface CarCardProps {
  car: Car;
}

const FUEL_ICONS: Record<string, string> = {
  PETROL: "⛽",
  DIESEL: "🛢️",
  ELECTRIC: "⚡",
  HYBRID: "🔋",
  CNG: "💨",
};

export function CarCard({ car }: CarCardProps) {
  const thumbnail = car.images[0]?.url ?? "/placeholder-car.jpg";

  return (
    <Link href={`/cars/${car.slug}`} className="car-card" prefetch={false}>
      {/* Image */}
      <div className="car-card__image-wrapper">
        <Image
          src={thumbnail}
          alt={car.images[0]?.alt ?? car.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="car-card__image"
        />
        <span className="car-card__fuel-badge">
          {FUEL_ICONS[car.fuelType] ?? "🚗"} {car.fuelType}
        </span>
      </div>

      {/* Info */}
      <div className="car-card__body">
        <p className="car-card__brand">{car.brand.name}</p>
        <h3 className="car-card__title">{car.title}</h3>

        <div className="car-card__meta">
          <span>{car.year}</span>
          <span>·</span>
          <span>{car.mileage.toLocaleString()} km</span>
          <span>·</span>
          <span>{car.transmission}</span>
        </div>

        <p className="car-card__price">
          ৳{car.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
