import { AppShell } from "@/shared/components/layout/app-shell";
import type { ReactNode } from "react";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
