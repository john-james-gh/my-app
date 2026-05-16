import { describe, expect, test } from "vitest";

import { analyzeReadiness } from "@/lib/readiness/analyze";
import type {
  NormalizedEquipment,
  NormalizedEquippedItem,
  NormalizedItemSet,
} from "@/lib/readiness/equipment";

const character = {
  name: "Aurafarms",
  realm: "Stormrage",
  region: "US",
  spec: "Augmentation",
  characterClass: "Evoker",
  itemLevel: 287,
};

describe("analyzeReadiness", () => {
  test("returns a perfect report when enchants, sockets, and tier are ready", () => {
    const report = analyzeReadiness({
      character,
      equipment: equipment({
        items: [
          item("FINGER_1", "Finger 1", {
            enchantments: [{}],
            sockets: [{ isFilled: true }],
          }),
          item("MAIN_HAND", "Main Hand", {
            enchantments: [{}],
          }),
        ],
        itemSets: [tierSet({ equippedCount: 4, totalCount: 5 })],
      }),
    });

    expect(report.score).toBe(100);
    expect(report.issues).toEqual([]);
    expect(report.summary).toBe(
      "No missing enchants, empty sockets, or tier-set issues found.",
    );
  });

  test("reports missing high-value enchants", () => {
    const report = analyzeReadiness({
      character,
      equipment: equipment({
        items: [
          item("FINGER_1", "Finger 1"),
          item("CHEST", "Chest", { enchantments: [{}] }),
        ],
        itemSets: [tierSet({ equippedCount: 4, totalCount: 5 })],
      }),
    });

    expect(report.score).toBe(88);
    expect(report.issues).toMatchObject([
      {
        id: "missing-enchant-finger_1",
        severity: "high",
        category: "enchant",
        slot: "Finger 1",
        title: "Missing finger 1 enchant",
      },
    ]);
  });

  test("reports medium missing enchants and empty sockets", () => {
    const report = analyzeReadiness({
      character,
      equipment: equipment({
        items: [
          item("CHEST", "Chest"),
          item("NECK", "Neck", {
            sockets: [{ name: "Prismatic", isFilled: false }],
          }),
        ],
        itemSets: [tierSet({ equippedCount: 4, totalCount: 5 })],
      }),
    });

    expect(report.score).toBe(86);
    expect(report.summary).toBe("Found 1 missing enchant, 1 empty socket.");
    expect(report.issues).toMatchObject([
      {
        severity: "medium",
        category: "enchant",
        slot: "Chest",
      },
      {
        id: "empty-socket-neck-0",
        severity: "medium",
        category: "gem",
        slot: "Neck",
        title: "Empty neck socket",
      },
    ]);
  });

  test("reports incomplete tier progress", () => {
    const report = analyzeReadiness({
      character,
      equipment: equipment({
        items: [],
        itemSets: [tierSet({ equippedCount: 2, totalCount: 5 })],
      }),
    });

    expect(report.score).toBe(93);
    expect(report.issues).toMatchObject([
      {
        id: "tier-set-123",
        severity: "medium",
        category: "tier",
        title: "Livery of the Black Talon is 2/4",
      },
    ]);
  });

  test("reports when Battle.net does not expose a tier set", () => {
    const report = analyzeReadiness({
      character,
      equipment: equipment({
        items: [],
        itemSets: [],
      }),
    });

    expect(report.score).toBe(93);
    expect(report.issues).toMatchObject([
      {
        id: "tier-set-not-detected",
        severity: "medium",
        category: "tier",
        title: "Tier set not detected",
      },
    ]);
  });
});

function equipment(input: Partial<NormalizedEquipment>): NormalizedEquipment {
  return {
    items: input.items ?? [],
    itemSets: input.itemSets ?? [],
  };
}

function item(
  slotType: string,
  slotName: string,
  input: Partial<NormalizedEquippedItem> = {},
): NormalizedEquippedItem {
  return {
    slotType,
    slotName,
    itemId: input.itemId ?? 1,
    itemName: input.itemName ?? `${slotName} Item`,
    itemLevel: input.itemLevel ?? 287,
    enchantments: input.enchantments ?? [],
    sockets: input.sockets ?? [],
    itemSet: input.itemSet,
  };
}

function tierSet(input: Partial<NormalizedItemSet> = {}): NormalizedItemSet {
  return {
    id: input.id ?? 123,
    name: input.name ?? "Livery of the Black Talon",
    equippedCount: input.equippedCount ?? 4,
    totalCount: input.totalCount ?? 5,
  };
}
