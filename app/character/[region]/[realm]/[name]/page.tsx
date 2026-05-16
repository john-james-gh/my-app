import Link from "next/link";
import { notFound } from "next/navigation";
import { CharacterSummary } from "@/components/character-summary";
import { IssueList } from "@/components/issue-list";
import { ReadinessScore } from "@/components/readiness-score";
import { getBattleNetCharacterData } from "@/lib/battlenet/client";
import type {
  BattleNetCharacterProfile,
  BattleNetError,
  BattleNetName,
} from "@/lib/battlenet/types";
import { analyzeReadiness } from "@/lib/readiness/analyze";
import { normalizeBattleNetEquipment } from "@/lib/readiness/equipment";
import type { CharacterSummary as CharacterSummaryType } from "@/lib/readiness/types";
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

  const characterData = await getBattleNetCharacterData(validation.data);

  if (!characterData.ok) {
    return <CharacterLookupError error={characterData.error} />;
  }

  const report = analyzeReadiness({
    character: toCharacterSummary(characterData.data.profile, validation.data.region),
    equipment: normalizeBattleNetEquipment(characterData.data.equipment),
  });

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

function CharacterLookupError({ error }: { error: BattleNetError }) {
  return (
    <main className="raid-shell grid min-h-screen place-items-center px-5 text-[#f7ecd2]">
      <section className="forged-panel w-full max-w-lg rounded-lg p-6">
        <p className="font-display text-sm font-bold uppercase tracking-[0.22em] text-[#ff7c67]">
          Lookup failed
        </p>
        <h1 className="font-display mt-3 text-3xl font-black text-[#fff3d2]">
          Could not check this character
        </h1>
        <p className="mt-3 text-sm font-medium leading-6 text-[#d8c59c]">
          {error.message}
        </p>
        {error.status ? (
          <p className="mt-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-[#b9a98b]">
            Battle.net status {error.status}
          </p>
        ) : null}
        <Link
          href="/"
          className="mt-5 inline-flex h-10 items-center rounded-md bg-[#b63b2b] px-4 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#d04a38]"
        >
          Start over
        </Link>
      </section>
    </main>
  );
}

function toCharacterSummary(
  profile: BattleNetCharacterProfile,
  region: string,
): CharacterSummaryType {
  return {
    name: profile.name,
    realm: readName(profile.realm.name) ?? profile.realm.slug,
    region: region.toUpperCase(),
    spec: readName(profile.active_spec?.name) ?? "Unknown spec",
    characterClass: readName(profile.character_class?.name) ?? "Unknown class",
    itemLevel: profile.equipped_item_level ?? profile.average_item_level ?? 0,
  };
}

function readName(value: string | BattleNetName | undefined) {
  if (typeof value === "string") {
    return value;
  }

  return value?.en_US ?? value?.en_GB ?? value?.ko_KR ?? value?.zh_TW;
}
