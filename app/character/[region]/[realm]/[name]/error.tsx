"use client";

export default function CharacterError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="raid-shell grid min-h-screen place-items-center px-5 text-[#f7ecd2]">
      <section className="forged-panel w-full max-w-lg rounded-lg p-6">
        <p className="font-display text-sm font-bold uppercase tracking-[0.22em] text-[#ff7c67]">
          Lookup failed
        </p>
        <h1 className="font-display mt-3 text-3xl font-black text-[#fff3d2]">Could not load report</h1>
        <p className="mt-3 text-sm font-medium leading-6 text-[#d8c59c]">
          The mocked report route hit an unexpected error. Try the lookup again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 h-10 rounded-md bg-[#b63b2b] px-4 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#d04a38]"
        >
          Retry
        </button>
      </section>
    </main>
  );
}
