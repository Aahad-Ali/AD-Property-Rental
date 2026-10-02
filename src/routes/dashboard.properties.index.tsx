import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { DashboardShell } from "@/components/dashboard-shell";
import { DataTable } from "@/components/data-table";
import { primaryPhoto } from "@/components/property-card";
import { Alert, Button, EmptyState, ErrorState, LoadingState, StatusBadge } from "@/components/ui/primitives";
import { apiRequest } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { myPropertiesQuery } from "@/lib/queries";
import type { Property } from "@/lib/types";

export const Route = createFileRoute("/dashboard/properties/")({
  head: () => ({
    meta: [
      { title: "My properties — AD Property Rental" },
      { name: "description", content: "Manage the properties you list on AD Property Rental." },
      { property: "og:title", content: "My properties — AD Property Rental" },
      { property: "og:description", content: "Manage the properties you list on AD Property Rental." },
    ],
  }),
  component: () => (
    <DashboardShell
      title="My properties"
      description="Every property you own, including rented ones."
      allow={["owner"]}
      actions={
        <Link to="/dashboard/properties/new">
          <Button variant="flame">Add property</Button>
        </Link>
      }
    >
      <MyProperties />
    </DashboardShell>
  ),
});

function MyProperties() {
  const qc = useQueryClient();
  const { data, isPending, isError, error, refetch } = useQuery(myPropertiesQuery());

  const del = useMutation({
    mutationFn: (id: number) => apiRequest(`/properties/${id}`, { method: "DELETE", auth: true }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["my-properties"] });
      void qc.invalidateQueries({ queryKey: ["properties"] });
    },
  });

  if (isPending) return <LoadingState />;
  if (isError) return <ErrorState error={error} onRetry={() => void refetch()} />;
  if (!data.length)
    return <EmptyState title="No properties yet" description="Add your first property to start receiving rental requests." />;

  return (
    <div className="space-y-4">
      {del.isError ? <Alert>{(del.error as Error).message}</Alert> : null}
      <DataTable<Property>
        rows={data}
        rowKey={(p) => p.PropertyID}
        columns={[
          {
            key: "title",
            header: "Property",
            cell: (p) => {
              const photo = primaryPhoto(p);
              return (
                <div className="flex items-center gap-3 text-left">
                  {photo ? (
                    <img src={photo} alt="" className="hidden size-12 rounded-lg object-cover md:block" />
                  ) : null}
                  <div>
                    <Link to="/properties/$propertyId" params={{ propertyId: String(p.PropertyID) }} className="font-display font-semibold hover:text-primary">
                      {p.Title}
                    </Link>
                    <p className="text-xs text-muted-foreground">{p.City}</p>
                  </div>
                </div>
              );
            },
          },
          { key: "type", header: "Type", cell: (p) => p.PropertyType },
          { key: "rent", header: "Rent", cell: (p) => <span className="font-display font-bold text-primary">{formatCurrency(p.MonthlyRent)}</span> },
          { key: "photos", header: "Photos", cell: (p) => p.photos?.length ?? 0 },
          { key: "status", header: "Status", cell: (p) => <StatusBadge status={p.Status} /> },
          {
            key: "actions",
            header: "Actions",
            align: "right",
            cell: (p) => (
              <div className="flex justify-end gap-2">
                <Link to="/dashboard/properties/$propertyId" params={{ propertyId: String(p.PropertyID) }}>
                  <Button variant="outline" size="sm">Edit</Button>
                </Link>
                <Button
                  variant="danger"
                  size="sm"
                  disabled={del.isPending}
                  onClick={() => {
                    if (window.confirm(`Delete "${p.Title}"? This cannot be undone.`)) del.mutate(p.PropertyID);
                  }}
                >
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
