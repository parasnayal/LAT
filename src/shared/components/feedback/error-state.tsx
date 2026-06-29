import type { ReactNode } from "react";

export function ErrorState({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold">{title}</h1>
        {description ? <p className="mt-3 text-sm text-slate-600">{description}</p> : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </main>
  );
}
