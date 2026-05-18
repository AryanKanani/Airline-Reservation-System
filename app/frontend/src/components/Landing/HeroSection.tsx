export function HeroSection() {
  return (
    <section className="relative min-h-[760px] overflow-hidden bg-slate-950 text-white">
      <img
        src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2200&q=85"
        alt="Airliner wing above clouds"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/10" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,6,23,0.55),rgba(2,6,23,0.12),rgba(248,250,252,1))]" />

      <div className="relative mx-auto flex min-h-[760px] max-w-7xl items-center px-5 pb-36 pt-32 sm:px-8 lg:px-10">
        <div className="max-w-3xl animate-rise">
          <p className="mb-5 inline-flex rounded-full border border-amber-200/40 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-100 backdrop-blur">
            Premium routes worldwide
          </p>
          <h1 className="text-5xl font-semibold leading-tight text-white sm:text-6xl lg:text-7xl">
            Fly further with calm, connected travel.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
            Search fares, compare cabins, and plan multi-city journeys with an airline booking experience built for speed and clarity.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#book" className="rounded-full bg-amber-300 px-7 py-4 text-center text-sm font-bold text-slate-950 shadow-xl shadow-amber-300/20 transition hover:bg-amber-200">
              Search flights
            </a>
            <a href="#destinations" className="rounded-full border border-white/25 bg-white/10 px-7 py-4 text-center text-sm font-bold text-white backdrop-blur transition hover:bg-white/15">
              Explore destinations
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
