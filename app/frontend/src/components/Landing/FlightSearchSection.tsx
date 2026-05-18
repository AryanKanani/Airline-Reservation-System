const tripTypes = ['Round trip', 'One way', 'Multi-city'];

export function FlightSearchSection() {
  return (
    <section id="book" className="relative z-10 -mt-28 px-5 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl rounded-lg border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/10 sm:p-6">
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-5">
          {tripTypes.map((type, index) => (
            <button
              key={type}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                index === 0 ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <form className="grid gap-4 pt-6 lg:grid-cols-[1.1fr_1.1fr_0.9fr_0.9fr_0.8fr_auto]">
          <SearchField label="From" value="New York JFK" helper="United States" />
          <SearchField label="To" value="Dubai DXB" helper="United Arab Emirates" />
          <SearchField label="Depart" value="24 Jun" helper="Tuesday" />
          <SearchField label="Return" value="08 Jul" helper="Tuesday" />
          <SearchField label="Travelers" value="2 Adults" helper="Business" />
          <button className="min-h-[86px] rounded-xl bg-amber-300 px-8 text-sm font-bold text-slate-950 shadow-lg shadow-amber-300/20 transition hover:bg-amber-200">
            Search
          </button>
        </form>
      </div>
    </section>
  );
}

function SearchField({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <label className="block rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-slate-500 focus-within:bg-white">
      <span className="text-xs font-semibold uppercase text-slate-500">{label}</span>
      <input className="mt-1 block w-full bg-transparent text-lg font-semibold text-slate-950 outline-none" defaultValue={value} />
      <span className="text-sm text-slate-500">{helper}</span>
    </label>
  );
}
