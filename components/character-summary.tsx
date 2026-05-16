import { CharacterSummary as CharacterSummaryType } from "@/lib/readiness/types";

export function CharacterSummary({
  character,
}: {
  character: CharacterSummaryType;
}) {
  return (
    <section className="grid gap-3 rounded-lg border border-[rgba(241,207,122,0.18)] bg-[#11100d]/82 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:grid-cols-4">
      <div className="sm:col-span-2">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#b9a98b]">Character</p>
        <p className="font-display mt-1 text-2xl font-black text-[#fff3d2]">
          {character.name}
        </p>
        <p className="mt-1 text-sm font-medium text-[#d8c59c]">
          {character.realm} - {character.region}
        </p>
      </div>
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#b9a98b]">Spec</p>
        <p className="mt-1 text-lg font-black text-[#fff3d2]">
          {character.spec}
        </p>
        <p className="mt-1 text-sm font-medium text-[#d8c59c]">{character.characterClass}</p>
      </div>
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#b9a98b]">Item level</p>
        <p className="mt-1 text-lg font-black text-[#fff3d2]">
          {character.itemLevel}
        </p>
        <p className="mt-1 text-sm font-medium text-[#d8c59c]">Mock data</p>
      </div>
    </section>
  );
}
