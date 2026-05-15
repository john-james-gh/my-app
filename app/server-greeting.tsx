async function getServerMessage() {
  return "Rendered by a React Server Component.";
}

export default async function ServerGreeting() {
  const message = await getServerMessage();

  return (
    <section className="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-5 text-left dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
        Server Component
      </p>
      <p className="mt-3 text-lg font-semibold text-zinc-950 dark:text-zinc-50">
        {message}
      </p>
    </section>
  );
}
