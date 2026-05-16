import { ReadinessReport } from "@/lib/readiness/types";

export function ReadinessScore({ report }: { report: ReadinessReport }) {
  return (
    <section className="forged-panel rounded-lg p-5">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-[0.22em] text-[#72b244]">
            Readiness
          </p>
          <h1 className="font-display mt-2 text-3xl font-black tracking-normal text-[#fff3d2] sm:text-4xl">
            Your character is {report.score}% ready.
          </h1>
          <p className="mt-3 max-w-2xl text-lg font-medium leading-7 text-[#d8c59c]">
            {report.summary}
          </p>
        </div>

        <div
          className="grid size-32 shrink-0 place-items-center rounded-full border border-[rgba(241,207,122,0.35)] shadow-[0_0_48px_rgba(114,178,68,0.13)]"
          style={{
            background: `conic-gradient(#72b244 ${report.score}%, rgba(241,207,122,0.14) 0)`,
          }}
          aria-label={`${report.score}% ready`}
        >
          <div className="grid size-24 place-items-center rounded-full bg-[#090806]">
            <span className="font-display text-3xl font-black text-[#f1cf7a]">
              {report.score}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
