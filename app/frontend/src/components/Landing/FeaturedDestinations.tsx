import { SectionHeading } from './SectionHeading';
import { destinations } from './landingData';

export function FeaturedDestinations() {
  return (
    <section id="destinations" className="px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Featured destinations" title="Curated routes for your next escape" action="View all routes" />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {destinations.map((destination, index) => (
            <article
              key={destination.city}
              className="group animate-fade-in overflow-hidden rounded-lg bg-white shadow-lg shadow-slate-900/5"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div className="relative h-72 overflow-hidden">
                <img src={destination.image} alt={destination.city} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <p className="text-sm font-semibold text-amber-100">{destination.country}</p>
                  <h3 className="mt-1 text-2xl font-semibold">{destination.city}</h3>
                </div>
              </div>
              <div className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-slate-500">Round trip from</p>
                  <p className="text-xl font-bold text-slate-950">{destination.price}</p>
                </div>
                <button className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-800 transition hover:border-slate-950 hover:bg-slate-950 hover:text-white">
                  Select
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
