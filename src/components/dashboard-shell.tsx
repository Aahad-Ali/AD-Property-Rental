import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { LoadingState } from "@/components/ui/primitives";
import { useAuth } from "@/lib/auth";
import { useRequireAuth } from "@/lib/use-require-auth";
import type { Role } from "@/lib/types";

type NavItem = { to: string; label: string; roles: Role[] };

const NAV: NavItem[] = [
  { to: "/dashboard", label: "Overview", roles: ["renter", "owner", "admin"] },
  { to: "/dashboard/properties", label: "My properties", roles: ["owner"] },
  { to: "/dashboard/rentals", label: "Rental agreements", roles: ["renter", "owner"] },
  { to: "/dashboard/inquiries", label: "Inquiries", roles: ["renter", "owner"] },
  { to: "/dashboard/payments", label: "Payments", roles: ["renter", "owner"] },
  { to: "/dashboard/transactions", label: "Transactions", roles: ["renter", "owner"] },
  { to: "/dashboard/earnings", label: "Earnings", roles: ["owner"] },
  { to: "/dashboard/profile", label: "Profile & security", roles: ["renter", "owner", "admin"] },
];

const ADMIN_NAV: NavItem[] = [
  { to: "/admin", label: "Overview", roles: ["admin"] },
  { to: "/admin/users", label: "Users", roles: ["admin"] },
  { to: "/admin/properties", label: "Properties", roles: ["admin"] },
  { to: "/admin/rentals", label: "Rentals", roles: ["admin"] },
  { to: "/admin/payments", label: "Payments", roles: ["admin"] },
  { to: "/admin/transactions", label: "Transactions", roles: ["admin"] },
];

export function DashboardShell({
  title,
  description,
  actions,
  children,
  area = "dashboard",
  allow,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  area?: "dashboard" | "admin";
  allow?: Role[];
}) {
  const { role } = useAuth();
  const { checking } = useRequireAuth(allow);

  if (checking) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <LoadingState label="Checking your session…" />
      </div>
    );
  }

  const items = (area === "admin" ? ADMIN_NAV : NAV).filter((item) =>
    role ? item.roles.includes(role) : false,
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav className="lg:sticky lg:top-24 lg:self-start">
          <p className="eyebrow">{area === "admin" ? "Administration" : "Account"}</p>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/dashboard" || item.to === "/admin" }}
                activeProps={{ className: "bg-primary/15 text-primary" }}
                className="whitespace-nowrap rounded-lg px-3 py-2 font-display text-xs font-bold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
          {role !== "admin" ? null : (
            <Link
              to={area === "admin" ? "/dashboard" : "/admin"}
              className="mt-4 inline-block rounded-lg px-3 py-2 font-display text-xs font-bold uppercase tracking-wide text-primary"
            >
              {area === "admin" ? "← My account" : "Admin console →"}
            </Link>
          )}
        </nav>

        <main className="min-w-0">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-black uppercase tracking-tight">{title}</h1>
              {description ? (
                <p className="mt-1 max-w-xl text-sm text-muted-foreground">{description}</p>
              ) : null}
            </div>
            {actions}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
