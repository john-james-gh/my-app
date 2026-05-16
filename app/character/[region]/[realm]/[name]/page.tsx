import Link from "next/link";
import { notFound } from "next/navigation";
import { CharacterSummary } from "@/components/character-summary";
import { IssueList } from "@/components/issue-list";
import { ReadinessScore } from "@/components/readiness-score";
import { getMockReadinessReport } from "@/lib/readiness/mock-report";
import { validateCharacterLookup } from "@/lib/validation";

type CharacterPageProps = {
  params: Promise<{
    region: string;
    realm: string;
    name: string;
  }>;
};

export default async function CharacterPage({ params }: CharacterPageProps) {
  const lookup = await params;
  const validation = validateCharacterLookup(lookup);

  if (validation.errors) {
    notFound();
  }

  const report = getMockReadinessReport(validation.data);

  return (
    <main className="raid-shell min-h-screen text-[#f7ecd2]">
      <section className="relative mx-auto w-full max-w-6xl px-5 py-6 sm:px-8 lg:px-10">
        <header className="reveal-in flex flex-col gap-4 border-b border-[rgba(241,207,122,0.18)] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/"
              className="font-display text-sm font-bold uppercase tracking-[0.22em] text-[#f1cf7a] transition hover:text-white"
            >
              Readycheck
            </Link>
            <p className="mt-1 text-sm font-medium text-[#b9a98b]">
              Gems, enchants, and tier-set progress
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md border border-[rgba(241,207,122,0.28)] bg-[#11100d]/80 px-3 text-sm font-bold text-[#f4e2b9] transition hover:border-[#f1cf7a] hover:text-white"
          >
            Check another
          </Link>
        </header>

        <div className="grid gap-5 py-8">
          <div className="reveal-in reveal-delay-1">
            <ReadinessScore report={report} />
          </div>
          <div className="reveal-in reveal-delay-2">
            <CharacterSummary character={report.character} />
          </div>
          <div className="reveal-in reveal-delay-3">
            <IssueList issues={report.issues} />
          </div>
        </div>
      </section>
    </main>
  );
}
