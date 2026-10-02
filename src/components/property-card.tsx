import { Link } from "@tanstack/react-router";
import { ImageOff } from "lucide-react";

import { StatusBadge } from "@/components/ui/primitives";
import { bedsLabel, formatCurrency } from "@/lib/format";
import type { Property } from "@/lib/types";

export function primaryPhoto(property: Property): string | null {
  const photos = property.photos ?? [];
  const primary = photos.find((p) => p.IsPrimary) ?? photos[0];
  return primary?.PhotoURL ?? null;
}

export function PropertyCard({ property }: { property: Property }) {
  const photo = primaryPhoto(property);

  return (
    <Link
      to="/properties/$propertyId"
      params={{ propertyId: String(property.PropertyID) }}
      className="group block overflow-hidden rounded-3xl border border-border bg-surface/50 transition-colors hover:border-primary/40"
    >
      <div className="aspect-[3/2] bg-background">
        {photo ? (
          <img
            src={photo}
            alt={property.Title}
            loading="lazy"
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageOff className="size-6" />
            <span className="text-[10px] uppercase tracking-[0.2em]">No photo</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-bold leading-tight">{property.Title}</h3>
          <span className="whitespace-nowrap font-display font-bold text-primary">
            {formatCurrency(property.MonthlyRent)}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {bedsLabel(property.Bedrooms, property.Bathrooms, property.PropertyType)}
        </p>
        <p className="text-sm text-muted-foreground">{property.City}</p>
        <div className="mt-4 flex items-center justify-between">
          <StatusBadge status={property.Status} />
          <span className="font-display text-xs font-bold uppercase tracking-wide text-primary">
            View details →
          </span>
        </div>
      </div>
    </Link>
  );
}
