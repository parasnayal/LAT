type ModulePlaceholderProps = {
  title: string;
  description: string;
};

export function ModulePlaceholder({ title, description }: ModulePlaceholderProps) {
  return (
    <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      <p className="mt-3 max-w-3xl text-slate-600">{description}</p>
    </section>
  );
}
