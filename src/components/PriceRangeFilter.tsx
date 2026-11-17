"use client";

import { useState, type ChangeEvent } from "react";

type PriceRangeFilterProps = {
  min: number;
  max: number;
  selectedMin?: number;
  selectedMax?: number;
};

function formatPrice(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function PriceRangeFilter({
  min,
  max,
  selectedMin,
  selectedMax,
}: PriceRangeFilterProps) {
  const [priceRange, setPriceRange] = useState({
    min: selectedMin ?? min,
    max: selectedMax ?? max,
  });
  const range = max - min;
  const minPosition = range > 0 ? ((priceRange.min - min) / range) * 100 : 0;
  const maxPosition = range > 0 ? ((priceRange.max - min) / range) * 100 : 100;
  const step = Math.max(1, Math.ceil(range / 1000));

  const handleMinChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.currentTarget.value);
    setPriceRange((current) => ({
      ...current,
      min: Math.min(value, current.max),
    }));
  };

  const handleMaxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.currentTarget.value);
    setPriceRange((current) => ({
      ...current,
      max: Math.max(value, current.min),
    }));
  };

  return (
    <div className="store-price-filter">
      <div className="store-price-slider">
        <span className="store-price-track" aria-hidden="true" />
        <span
          className="store-price-fill"
          style={{
            left: `${minPosition}%`,
            right: `${100 - maxPosition}%`,
          }}
          aria-hidden="true"
        />
        <input
          className="store-price-range store-price-range--min"
          type="range"
          min={min}
          max={max}
          step={step}
          value={priceRange.min}
          onChange={handleMinChange}
          aria-label="Minimum price"
          aria-valuetext={formatPrice(priceRange.min)}
        />
        <input
          className="store-price-range store-price-range--max"
          type="range"
          min={min}
          max={max}
          step={step}
          value={priceRange.max}
          onChange={handleMaxChange}
          aria-label="Maximum price"
          aria-valuetext={formatPrice(priceRange.max)}
        />
      </div>
      <div className="store-price-values" aria-live="polite">
        <span>{formatPrice(priceRange.min)}</span>
        <span>To</span>
        <span>{formatPrice(priceRange.max)}</span>
      </div>
      <input
        type="hidden"
        name={priceRange.min > min ? "minPrice" : undefined}
        value={priceRange.min}
      />
      <input
        type="hidden"
        name={priceRange.max < max ? "maxPrice" : undefined}
        value={priceRange.max}
      />
    </div>
  );
}
