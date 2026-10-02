import { useState } from "react";

import { Alert, Button, Field, Input, Select, Textarea } from "@/components/ui/primitives";

export type PropertyFormValues = {
  title: string;
  description: string;
  propertyType: string;
  address: string;
  city: string;
  bedrooms: string;
  bathrooms: string;
  monthlyRent: string;
};

export const emptyProperty: PropertyFormValues = {
  title: "",
  description: "",
  propertyType: "Apartment",
  address: "",
  city: "",
  bedrooms: "1",
  bathrooms: "1",
  monthlyRent: "",
};

const TYPES = ["Apartment", "House", "Studio", "Villa", "Townhouse", "Room", "Commercial"];

export function PropertyForm({
  initial,
  submitLabel,
  withPhotos,
  onSubmit,
}: {
  initial: PropertyFormValues;
  submitLabel: string;
  withPhotos?: boolean;
  onSubmit: (values: PropertyFormValues, photos: File[]) => Promise<void>;
}) {
  const [values, setValues] = useState(initial);
  const [photos, setPhotos] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const set = (key: keyof PropertyFormValues) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setValues({ ...values, [key]: e.target.value });

  const typeOptions = TYPES.includes(values.propertyType) ? TYPES : [values.propertyType, ...TYPES];

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setPending(true);
        try {
          await onSubmit(values, photos);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setPending(false);
        }
      }}
    >
      <Field label="Title">
        <Input required maxLength={150} value={values.title} onChange={set("title")} />
      </Field>
      <Field label="Description">
        <Textarea required value={values.description} onChange={set("description")} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Property type">
          <Select value={values.propertyType} onChange={set("propertyType")}>
            {typeOptions.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
        </Field>
        <Field label="Monthly rent">
          <Input type="number" min={1} step="0.01" required value={values.monthlyRent} onChange={set("monthlyRent")} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Address">
          <Input required maxLength={255} value={values.address} onChange={set("address")} />
        </Field>
        <Field label="City">
          <Input required maxLength={100} value={values.city} onChange={set("city")} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Bedrooms">
          <Input type="number" min={0} required value={values.bedrooms} onChange={set("bedrooms")} />
        </Field>
        <Field label="Bathrooms">
          <Input type="number" min={0} required value={values.bathrooms} onChange={set("bathrooms")} />
        </Field>
      </div>
      {withPhotos ? (
        <Field label="Photos" hint="Up to 10 images. The first one becomes the cover photo.">
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setPhotos(Array.from(e.target.files ?? []).slice(0, 10))}
          />
        </Field>
      ) : null}
      {error ? <Alert>{error}</Alert> : null}
      <Button type="submit" disabled={pending}>{pending ? "Saving…" : submitLabel}</Button>
    </form>
  );
}

export function toPayload(values: PropertyFormValues) {
  return {
    title: values.title,
    description: values.description,
    propertyType: values.propertyType,
    address: values.address,
    city: values.city,
    bedrooms: Number(values.bedrooms),
    bathrooms: Number(values.bathrooms),
    monthlyRent: Number(values.monthlyRent),
  };
}
