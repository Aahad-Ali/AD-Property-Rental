import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Alert, Button, Field, Input, Panel, Select } from "@/components/ui/primitives";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create an account — AD Property Rental" },
      {
        name: "description",
        content:
          "Register as a renter or property owner on AD Property Rental to list properties or request rentals.",
      },
      { property: "og:title", content: "Create an account — AD Property Rental" },
      {
        property: "og:description",
        content: "Register as a renter or property owner on AD Property Rental.",
      },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "renter",
  });
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      await apiRequest<{ message: string }>("/auth/signup", {
        method: "POST",
        body: {
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
          phone: form.phone || null,
        },
      });
      const role = await login(form.email, form.password);
      void navigate({ to: role === "admin" ? "/admin" : "/dashboard", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16 sm:px-8">
      <h1 className="font-display text-4xl font-black uppercase tracking-tight">
        Create account
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Renters request rentals; owners list and manage properties.
      </p>

      <Panel className="mt-8">
        <form className="space-y-4" onSubmit={submit}>
          <Field label="Full name">
            <Input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ada Lovelace"
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
          </Field>
          <Field label="Password">
            <Input
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
          </Field>
          <Field label="Phone" hint="Optional.">
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+1 555 0100"
            />
          </Field>
          <Field label="Account type">
            <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="renter">Renter — rent a property</option>
              <option value="owner">Owner — list properties</option>
            </Select>
          </Field>
          {error ? <Alert>{error}</Alert> : null}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Creating account…" : "Create account"}
          </Button>
        </form>
      </Panel>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already registered?{" "}
        <Link to="/login" className="font-semibold text-primary">
          Sign in
        </Link>
      </p>
    </div>
  );
}
