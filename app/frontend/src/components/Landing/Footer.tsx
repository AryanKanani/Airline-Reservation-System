const footerLinks = ['Help center', 'Flight status', 'Baggage', 'Accessibility', 'Privacy'];

export function Footer() {
  return (
    <footer className="bg-slate-950 px-5 py-12 text-white sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-semibold">AeroVista Airways</p>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
            Mock airline booking interface for a modern reservation platform.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          {footerLinks.map((link) => (
            <a key={link} href="#" className="text-sm font-medium text-slate-300 transition hover:text-amber-200">
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
