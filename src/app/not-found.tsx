import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-semibold">Page not found</h1>
        <p className="mt-3 text-slate-600">The page you requested does not exist.</p>
        <Button asChild className="mt-6">
          <Link href={ROUTES.dashboard}>Go to dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
