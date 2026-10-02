import type { ReactNode } from "react";

export type Column<T> = {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  align?: "right";
  hideOnMobile?: boolean;
};

/**
 * Responsive table: a real table on desktop, stacked label/value rows on
 * small screens so dashboards stay readable on phones.
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  caption,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  caption?: string;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border">
      <table className="hidden w-full md:table">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr className="bg-background/80 text-left">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground ${
                  col.align === "right" ? "text-right" : ""
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-t border-border/60">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-5 py-4 align-middle text-sm ${
                    col.align === "right" ? "text-right" : ""
                  }`}
                >
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="divide-y divide-border/60 md:hidden">
        {rows.map((row) => (
          <div key={rowKey(row)} className="space-y-2 p-4">
            {columns.map((col) => (
              <div key={col.key} className="flex items-start justify-between gap-4">
                <span className="eyebrow pt-0.5">{col.header}</span>
                <span className="text-right text-sm">{col.cell(row)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: ReactNode;
  tone?: "primary" | "accent";
}) {
  return (
    <div className="rounded-2xl bg-background/60 p-5">
      <p className="eyebrow">{label}</p>
      <p
        className={`font-display text-3xl font-black ${
          tone === "primary" ? "text-primary" : tone === "accent" ? "text-accent" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}
