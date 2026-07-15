export function CarCardSkeleton() {
  return (
    <div className="car-card car-card--skeleton" aria-hidden="true">
      <div className="car-card__image-wrapper skeleton-block" />
      <div className="car-card__body">
        <div className="skeleton-line skeleton-line--sm" />
        <div className="skeleton-line skeleton-line--lg" />
        <div className="skeleton-line skeleton-line--md" />
        <div className="skeleton-line skeleton-line--sm" />
      </div>
    </div>
  );
}
