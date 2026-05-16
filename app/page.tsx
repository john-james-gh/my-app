import Link from "next/link";
import { CharacterSearchForm } from "@/components/character-search-form";

export default function Home() {
  return (
    <main className="raid-shell min-h-screen text-[#f7ecd2]">
      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="reveal-in flex items-center justify-between border-b border-[rgba(241,207,122,0.18)] pb-5">
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-[0.22em] text-[#f1cf7a]">
              Readycheck
            </p>
            <p className="mt-1 text-sm font-medium text-[#b9a98b]">
              WoW character setup audit
            </p>
          </div>
          <Link
            href="/character/us/stormrage/aurafarms"
            className="hidden rounded-md border border-[rgba(241,207,122,0.28)] bg-[#11100d]/80 px-3 py-2 text-sm font-bold text-[#f4e2b9] transition hover:border-[#f1cf7a] hover:text-white sm:inline-flex"
          >
            View sample
          </Link>
        </header>

        <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_430px] lg:py-16">
          <div className="reveal-in reveal-delay-1 relative max-w-3xl">
            <div
              aria-hidden="true"
              className="font-display pointer-events-none absolute -right-2 -top-16 hidden text-[11rem] font-black leading-none text-[#f1cf7a]/[0.07] lg:block"
            >
              84
            </div>
            <p className="font-display text-sm font-bold uppercase tracking-[0.24em] text-[#72b244]">
              Gems / Enchants / Tier
            </p>
            <h1 className="font-display mt-4 max-w-3xl text-5xl font-black leading-[1.02] tracking-normal text-[#fff3d2] sm:text-6xl lg:text-7xl">
              Paste your character. Fix your gear. Stop being scuffed.
            </h1>
            <p className="mt-6 max-w-2xl text-xl font-medium leading-8 text-[#d8c59c]">
              A fast audit for the setup mistakes that should never make it
              into pull timer.
            </p>

            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[
                ["100%", "sample readiness"],
                ["0", "missing enchants"],
                ["4/4", "tier progress"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="etched-border rounded-lg bg-[#11100d]/70 p-4 backdrop-blur-sm transition hover:border-[rgba(241,207,122,0.5)]"
                >
                  <p className="font-display text-3xl font-black text-[#f1cf7a]">
                    {value}
                  </p>
                  <p className="mt-1 text-sm font-bold uppercase tracking-[0.12em] text-[#b9a98b]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal-in reveal-delay-2">
            <CharacterSearchForm />
          </div>
        </div>
      </section>
    </main>
  );
}
