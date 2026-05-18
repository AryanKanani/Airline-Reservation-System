import { SectionHeading } from './SectionHeading';
import { offers } from './landingData';

export function PromoOffers() {
  return (
    <section id="offers" className="bg-white px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Limited offers" title="Premium travel benefits, made simple" action="Join rewards" />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {offers.map((offer) => (
            <article key={offer.title} className="rounded-lg border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10">
              <p className="text-sm font-bold uppercase text-amber-700">{offer.badge}</p>
              <h3 className="mt-4 text-2xl font-semibold text-slate-950">{offer.title}</h3>
              <p className="mt-3 min-h-20 text-sm leading-6 text-slate-600">{offer.description}</p>
              <button className="mt-6 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800">
                Learn more
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
