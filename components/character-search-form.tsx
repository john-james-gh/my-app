"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import {
  CharacterLookupErrors,
  REGIONS,
  validateCharacterLookup,
} from "@/lib/validation";

const regionLabels: Record<(typeof REGIONS)[number], string> = {
  us: "US",
  eu: "EU",
  kr: "KR",
  tw: "TW",
};

export function CharacterSearchForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [region, setRegion] = useState<(typeof REGIONS)[number]>("us");
  const [realm, setRealm] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<CharacterLookupErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = validateCharacterLookup({ region, realm, name });

    if (result.errors) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    const href = `/character/${result.data.region}/${result.data.realm}/${result.data.name}`;

    startTransition(() => {
      router.push(href);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="forged-panel rounded-lg p-5 sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-black text-[#fff3d2]">
            Check a character
          </h2>
          <p className="mt-1 text-sm font-medium leading-6 text-[#b9a98b]">
            Region, realm, name. The report URL is shareable.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <label className="text-sm font-bold uppercase tracking-[0.14em] text-[#f1cf7a]" htmlFor="region">
          Region
        </label>
        <div className="mt-2 grid grid-cols-4 gap-2" id="region">
          {REGIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setRegion(option)}
              className={[
                "h-11 rounded-md border text-sm font-black transition",
                region === option
                  ? "border-[#f1cf7a] bg-[#f1cf7a] text-[#160f09] shadow-[0_0_22px_rgba(241,207,122,0.22)]"
                  : "border-[rgba(241,207,122,0.22)] bg-[#090806]/70 text-[#d8c59c] hover:border-[#f1cf7a] hover:text-white",
              ].join(" ")}
              aria-pressed={region === option}
            >
              {regionLabels[option]}
            </button>
          ))}
        </div>
        {errors.region ? (
          <p className="mt-2 text-sm font-bold text-[#ff7c67]">{errors.region}</p>
        ) : null}
      </div>

      <div className="mt-5">
        <label className="text-sm font-bold uppercase tracking-[0.14em] text-[#f1cf7a]" htmlFor="realm">
          Realm
        </label>
        <input
          id="realm"
          name="realm"
          type="text"
          required
          value={realm}
          onChange={(event) => setRealm(event.target.value)}
          placeholder="Area 52"
          className="mt-2 h-12 w-full rounded-md border border-[rgba(241,207,122,0.24)] bg-[#090806]/80 px-3 text-lg font-bold text-[#fff3d2] outline-none transition placeholder:text-[#786a53] focus:border-[#f1cf7a] focus:ring-4 focus:ring-[#d7a84a]/20"
        />
        {errors.realm ? (
          <p className="mt-2 text-sm font-bold text-[#ff7c67]">{errors.realm}</p>
        ) : null}
      </div>

      <div className="mt-5">
        <label className="text-sm font-bold uppercase tracking-[0.14em] text-[#f1cf7a]" htmlFor="name">
          Character
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Thunderguy"
          className="mt-2 h-12 w-full rounded-md border border-[rgba(241,207,122,0.24)] bg-[#090806]/80 px-3 text-lg font-bold text-[#fff3d2] outline-none transition placeholder:text-[#786a53] focus:border-[#f1cf7a] focus:ring-4 focus:ring-[#d7a84a]/20"
        />
        {errors.name ? (
          <p className="mt-2 text-sm font-bold text-[#ff7c67]">{errors.name}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-6 flex h-12 w-full items-center justify-center rounded-md bg-[#b63b2b] px-4 text-base font-black uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:bg-[#d04a38] hover:shadow-[0_12px_36px_rgba(182,59,43,0.3)] disabled:cursor-not-allowed disabled:bg-[#3a332b] disabled:text-[#8c806a]"
      >
        {isPending ? "Checking..." : "Check readiness"}
      </button>
    </form>
  );
}
