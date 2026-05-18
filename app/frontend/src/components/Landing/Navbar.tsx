import { useState } from 'react';

const navItems = ['Book', 'Manage', 'Destinations', 'Offers', 'Skywards'];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/15 bg-slate-950/80 text-white shadow-xl shadow-slate-950/10 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <a href="/" className="flex items-center gap-3" aria-label="AeroVista home">
          <span className="grid h-11 w-11 place-items-center rounded-full border border-amber-300/50 bg-white/10 text-lg font-semibold text-amber-200">
            AV
          </span>
          <span className="leading-tight">
            <span className="block text-base font-semibold tracking-wide">AeroVista</span>
            <span className="block text-xs uppercase tracking-[0.24em] text-slate-300">Airways</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-slate-200 transition hover:text-amber-200">
              {item}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <button className="rounded-full px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10">
            Sign in
          </button>
          <button className="rounded-full bg-amber-300 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-300/20 transition hover:bg-amber-200">
            Book now
          </button>
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 lg:hidden"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className="space-y-1.5">
            <span className="block h-0.5 w-5 bg-white" />
            <span className="block h-0.5 w-5 bg-white" />
            <span className="block h-0.5 w-5 bg-white" />
          </span>
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-white/10 bg-slate-950 px-5 py-5 lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-3">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="rounded-lg px-3 py-3 text-sm font-semibold text-slate-100 hover:bg-white/10">
                {item}
              </a>
            ))}
            <button className="mt-2 rounded-full bg-amber-300 px-5 py-3 text-sm font-bold text-slate-950">Book now</button>
          </div>
        </div>
      )}
    </header>
  );
}
