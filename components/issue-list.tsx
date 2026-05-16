import { ReadinessIssue } from "@/lib/readiness/types";

const severityStyles: Record<ReadinessIssue["severity"], string> = {
  high: "border-[#ff7c67] bg-[#b63b2b] text-white",
  medium: "border-[#f1cf7a] bg-[#d7a84a] text-[#160f09]",
  low: "border-[#72b244] bg-[#72b244] text-[#071006]",
};

const categoryLabels: Record<ReadinessIssue["category"], string> = {
  enchant: "Enchant",
  gem: "Gem",
  tier: "Tier",
};

export function IssueList({ issues }: { issues: ReadinessIssue[] }) {
  return (
    <section>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-[0.22em] text-[#72b244]">
            Fix list
          </p>
          <h2 className="font-display mt-2 text-2xl font-black text-[#fff3d2]">
            Missing setup items
          </h2>
        </div>
        <p className="font-mono text-sm font-bold text-[#b9a98b]">{issues.length} issues</p>
      </div>

      <div className="mt-4 grid gap-3">
        {issues.map((issue) => (
          <article
            key={issue.id}
            className="rounded-lg border border-[rgba(241,207,122,0.18)] bg-[#11100d]/82 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition hover:border-[rgba(241,207,122,0.42)]"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={[
                      "rounded-md border px-2 py-1 text-xs font-black uppercase tracking-[0.12em]",
                      severityStyles[issue.severity],
                    ].join(" ")}
                  >
                    {issue.severity}
                  </span>
                  <span className="font-mono text-sm font-bold uppercase tracking-[0.08em] text-[#b9a98b]">
                    {categoryLabels[issue.category]}
                    {issue.slot ? ` - ${issue.slot}` : ""}
                  </span>
                </div>
                <h3 className="font-display mt-3 text-xl font-black text-[#fff3d2]">
                  {issue.title}
                </h3>
                <p className="mt-2 max-w-3xl text-base font-medium leading-6 text-[#d8c59c]">
                  {issue.description}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
