export default function StoreLoading() {
  return (
    <section
      className="store-results store-results-loading"
      aria-label="Loading products"
      aria-busy="true"
    >
      <p className="visually-hidden" role="status">
        Loading products
      </p>

      <nav className="store-breadcrumb" aria-hidden="true">
        <span className="store-skeleton-block store-loading-breadcrumb-home" />
        <span className="store-skeleton-block store-loading-breadcrumb-separator" />
        <span className="store-skeleton-block store-loading-breadcrumb-current" />
      </nav>

      <header className="store-results-heading" aria-hidden="true">
        <div className="store-loading-heading">
          <span className="store-skeleton-block store-loading-eyebrow" />
          <span className="store-skeleton-block store-loading-title" />
          <span className="store-skeleton-block store-loading-description" />
        </div>
      </header>

      <div className="product-grid catalog-grid" aria-hidden="true">
        {Array.from({ length: 8 }, (_, index) => (
          <div className="store-loading-card" key={index}>
            <span className="store-skeleton-block store-loading-image" />
            <div className="store-loading-card-info">
              <span className="store-skeleton-block store-loading-product-title" />
              <span className="store-skeleton-block store-loading-price" />
              <span className="store-skeleton-block store-loading-rating" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
