"use client";

import { ErrorState } from "@/shared/components/feedback/error-state";
import { Button } from "@/shared/components/ui/button";

export default function DashboardError({ reset }: { error: Error; reset: () => void }) {
  return (
    <ErrorState title="Dashboard unavailable" description="Refresh the data or try again later.">
      <Button onClick={reset}>Refresh</Button>
    </ErrorState>
  );
}
