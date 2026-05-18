export function SectionHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action: string }) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-700">{eyebrow}</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-semibold text-slate-950 sm:text-4xl">{title}</h2>
      </div>
      <button className="w-fit rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-slate-900 transition hover:border-slate-950 hover:bg-slate-950 hover:text-white">
        {action}
      </button>
    </div>
  );
}
