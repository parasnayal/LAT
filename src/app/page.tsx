import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">
          Next.js App Router
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-foreground">
          Feature-based architecture for production teams
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Modules own their feature logic, while shared layers keep reusable UI, services,
          utilities, types, and configuration consistent across the application.
        </p>
        <div className="mt-8 flex gap-3">
          <Button asChild>
            <Link href={ROUTES.dashboard}>Open dashboard</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href={ROUTES.login}>Sign in</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
