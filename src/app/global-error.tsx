"use client";

import "@/shared/styles/globals.css";
import { ErrorState } from "@/shared/components/feedback/error-state";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html lang="en">
      <body>
        <ErrorState title="Application error" description={error.message} />
      </body>
    </html>
  );
}
