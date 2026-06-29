export function PageLoader({ label = "Loading" }: { label?: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-sm font-medium text-slate-600">{label}</div>
    </main>
  );
}
