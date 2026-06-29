import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-700">
          <ShieldAlert size={28} aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-3xl font-semibold">Access denied</h1>
        <p className="mt-3 text-slate-600">
          Your account is authenticated, but it does not have the permission required to open this
          PARAKH LAT module.
        </p>
        <Button asChild className="mt-6">
          <Link href={ROUTES.dashboard}>Return to dashboard</Link>
        </Button>
      </section>
    </main>
  );
}
