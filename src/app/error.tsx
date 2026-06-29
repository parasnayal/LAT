"use client";

import { ErrorState } from "@/shared/components/feedback/error-state";
import { Button } from "@/shared/components/ui/button";

export default function AppError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState title="Something went wrong" description={error.message}>
      <Button onClick={reset}>Try again</Button>
    </ErrorState>
  );
}
