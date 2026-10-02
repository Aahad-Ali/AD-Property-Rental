import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Alert, Button, Field, Input, Panel } from "@/components/ui/primitives";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — AD Property Rental" },
      {
        name: "description",
        content: "Sign in to your AD Property Rental account to manage rentals, inquiries and payments.",
      },
      { property: "og:title", content: "Sign in — AD Property Rental" },
      { property: "og:description", content: "Sign in to your AD Property Rental account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, isAuthenticated, ready } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (ready && isAuthenticated) void navigate({ to: "/dashboard", replace: true });
  }, [ready, isAuthenticated, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const role = await login(email, password);
      void navigate({ to: role === "admin" ? "/admin" : "/dashboard", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-5 py-16 sm:px-8">
      <h1 className="font-display text-4xl font-black uppercase tracking-tight">Sign in</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Access your AD Property Rental dashboard.
      </p>

      <Panel className="mt-8">
        <form className="space-y-4" onSubmit={submit}>
          <Field label="Email">
            <Input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </Field>
          <Field label="Password">
            <Input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </Field>
          {error ? <Alert>{error}</Alert> : null}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </Panel>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        No account yet?{" "}
        <Link to="/register" className="font-semibold text-primary">
          Create one
        </Link>
      </p>
    </div>
  );
}
