export default function LoadingCharacter() {
  return (
    <main className="raid-shell min-h-screen text-[#f7ecd2]">
      <section className="relative mx-auto w-full max-w-6xl px-5 py-6 sm:px-8 lg:px-10">
        <div className="h-16 border-b border-[rgba(241,207,122,0.18)]" />
        <div className="grid gap-5 py-8">
          <div className="h-48 animate-pulse rounded-lg bg-[#1c1712]" />
          <div className="h-32 animate-pulse rounded-lg bg-[#1c1712]" />
          <div className="grid gap-3">
            <div className="h-28 animate-pulse rounded-lg bg-[#1c1712]" />
            <div className="h-28 animate-pulse rounded-lg bg-[#1c1712]" />
            <div className="h-28 animate-pulse rounded-lg bg-[#1c1712]" />
          </div>
        </div>
      </section>
    </main>
  );
}
