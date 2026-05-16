import type {
  NormalizedEquipment,
  NormalizedEquippedItem,
  NormalizedItemSet,
} from "@/lib/readiness/equipment";
import type { ReadinessIssue, ReadinessReport } from "@/lib/readiness/types";

const ENCHANTABLE_SLOTS = new Set([
  "HEAD",
  "SHOULDER",
  "CHEST",
  "LEGS",
  "FEET",
  "FINGER_1",
  "FINGER_2",
  "MAIN_HAND",
]);

const TIER_READY_COUNT = 4;

type AnalyzeReadinessInput = Omit<ReadinessReport, "issues" | "score" | "summary"> & {
  equipment: NormalizedEquipment;
};

export function analyzeReadiness(input: AnalyzeReadinessInput): ReadinessReport {
  const issues = [
    ...findMissingEnchantIssues(input.equipment.items),
    ...findEmptySocketIssues(input.equipment.items),
    ...findTierSetIssues(input.equipment.itemSets),
  ];

  return {
    character: input.character,
    issues,
    score: calculateScore(issues),
    summary: buildSummary(issues),
  };
}

function findMissingEnchantIssues(items: NormalizedEquippedItem[]): ReadinessIssue[] {
  return items
    .filter((item) => ENCHANTABLE_SLOTS.has(item.slotType))
    .filter((item) => item.enchantments.length === 0)
    .map((item) => ({
      id: `missing-enchant-${item.slotType.toLowerCase()}`,
      severity: getEnchantSeverity(item.slotType),
      category: "enchant",
      slot: item.slotName,
      title: `Missing ${item.slotName.toLowerCase()} enchant`,
      description: `${item.itemName ?? item.slotName} has no enchant. Add the current best enchant for your spec before pushing harder content.`,
    }));
}

function findEmptySocketIssues(items: NormalizedEquippedItem[]): ReadinessIssue[] {
  return items.flatMap((item) =>
    item.sockets
      .filter((socket) => !socket.isFilled)
      .map((socket, socketIndex) => ({
        id: `empty-socket-${item.slotType.toLowerCase()}-${socketIndex}`,
        severity: "medium" as const,
        category: "gem" as const,
        slot: item.slotName,
        title: `Empty ${item.slotName.toLowerCase()} socket`,
        description: `${item.itemName ?? item.slotName} has an empty ${socket.name ?? "gem"} socket. Add a gem so the socket is not wasted.`,
      })),
  );
}

function findTierSetIssues(itemSets: NormalizedItemSet[]): ReadinessIssue[] {
  const tierSet = itemSets
    .filter((itemSet) => itemSet.totalCount >= TIER_READY_COUNT)
    .sort((a, b) => b.equippedCount - a.equippedCount)[0];

  if (!tierSet) {
    return [
      {
        id: "tier-set-not-detected",
        severity: "medium",
        category: "tier",
        title: "Tier set not detected",
        description:
          "Battle.net did not report an active 4-piece tier set. If this character should have tier, check whether the right pieces are equipped.",
      },
    ];
  }

  if (tierSet.equippedCount >= TIER_READY_COUNT) {
    return [];
  }

  return [
    {
      id: `tier-set-${tierSet.id ?? "unknown"}`,
      severity: tierSet.equippedCount < 2 ? "high" : "medium",
      category: "tier",
      title: `${tierSet.name ?? "Tier set"} is ${tierSet.equippedCount}/${TIER_READY_COUNT}`,
      description: `Equip ${TIER_READY_COUNT - tierSet.equippedCount} more tier ${TIER_READY_COUNT - tierSet.equippedCount === 1 ? "piece" : "pieces"} to reach the ${TIER_READY_COUNT}-piece bonus.`,
    },
  ];
}

function calculateScore(issues: ReadinessIssue[]) {
  const penalty = issues.reduce((total, issue) => {
    if (issue.severity === "high") {
      return total + 12;
    }

    if (issue.severity === "medium") {
      return total + 7;
    }

    return total + 3;
  }, 0);

  return Math.max(0, 100 - penalty);
}

function buildSummary(issues: ReadinessIssue[]) {
  if (issues.length === 0) {
    return "No missing enchants, empty sockets, or tier-set issues found.";
  }

  const missingEnchants = issues.filter((issue) => issue.category === "enchant").length;
  const emptySockets = issues.filter((issue) => issue.category === "gem").length;
  const tierIssues = issues.filter((issue) => issue.category === "tier").length;
  const parts = [
    formatCount(missingEnchants, "missing enchant"),
    formatCount(emptySockets, "empty socket"),
    formatCount(tierIssues, "tier-set issue"),
  ].filter(Boolean);

  return `Found ${parts.join(", ")}.`;
}

function formatCount(count: number, label: string) {
  if (count === 0) {
    return null;
  }

  return `${count} ${label}${count === 1 ? "" : "s"}`;
}

function getEnchantSeverity(slotType: string): ReadinessIssue["severity"] {
  if (slotType === "MAIN_HAND" || slotType.startsWith("FINGER")) {
    return "high";
  }

  return "medium";
}
