import { ReadinessReport } from "@/lib/readiness/types";
import { toDisplayName } from "@/lib/validation";

export function getMockReadinessReport(input: {
  region: string;
  realm: string;
  name: string;
}): ReadinessReport {
  const characterName = toDisplayName(input.name).replace(/\s/g, "");
  const realmName = toDisplayName(input.realm);

  return {
    score: 84,
    summary: "Missing 2 enchants, 1 gem, and 1 tier-set milestone.",
    character: {
      name: characterName,
      realm: realmName,
      region: input.region.toUpperCase(),
      spec: "Retribution",
      characterClass: "Paladin",
      itemLevel: 648,
    },
    issues: [
      {
        id: "missing-ring-enchant",
        severity: "high",
        category: "enchant",
        slot: "Ring",
        title: "Missing ring enchant",
        description:
          "Add an enchant to your lowest-value ring slot. This is a cheap, immediate setup fix.",
      },
      {
        id: "missing-bracer-enchant",
        severity: "medium",
        category: "enchant",
        slot: "Wrist",
        title: "Missing wrist enchant",
        description:
          "Your wrist slot has no enchant. Fix this before queueing for keys or raid.",
      },
      {
        id: "empty-socket",
        severity: "medium",
        category: "gem",
        slot: "Neck",
        title: "Empty gem socket",
        description:
          "Fill the open socket on your neck. Empty sockets are one of the easiest setup issues to miss.",
      },
      {
        id: "tier-count",
        severity: "low",
        category: "tier",
        title: "Tier set is incomplete",
        description:
          "You appear to have 3 tier pieces equipped. Track one more piece for the 4-piece bonus.",
      },
    ],
  };
}
