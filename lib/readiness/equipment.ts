export type NormalizedEnchantment = {
  id?: number;
  slotId?: number;
  slotType?: string;
  displayString?: string;
  sourceItemId?: number;
  sourceItemName?: string;
};

export type NormalizedSocket = {
  type?: string;
  name?: string;
  isFilled: boolean;
  itemId?: number;
  itemName?: string;
  displayString?: string;
};

export type NormalizedItemSet = {
  id?: number;
  name?: string;
  equippedCount: number;
  totalCount: number;
};

export type NormalizedEquippedItem = {
  slotType: string;
  slotName: string;
  itemId?: number;
  itemName?: string;
  itemLevel?: number;
  enchantments: NormalizedEnchantment[];
  sockets: NormalizedSocket[];
  itemSet?: NormalizedItemSet;
};

export type NormalizedEquipment = {
  items: NormalizedEquippedItem[];
  itemSets: NormalizedItemSet[];
};

type JsonRecord = Record<string, unknown>;

export function normalizeBattleNetEquipment(payload: unknown): NormalizedEquipment {
  const record = asRecord(payload);
  const items = asArray(record?.equipped_items)
    .map(normalizeEquippedItem)
    .filter((item): item is NormalizedEquippedItem => item !== null);

  const itemSets = asArray(record?.equipped_item_sets)
    .map(normalizeItemSet)
    .filter((itemSet): itemSet is NormalizedItemSet => itemSet !== null);

  return {
    items,
    itemSets,
  };
}

function normalizeEquippedItem(payload: unknown): NormalizedEquippedItem | null {
  const record = asRecord(payload);
  const slot = asRecord(record?.slot);
  const slotType = asString(slot?.type);
  const slotName = readName(slot?.name);

  if (!slotType || !slotName) {
    return null;
  }

  const item = asRecord(record?.item);
  const itemSet = normalizeItemSet(record?.set);

  return {
    slotType,
    slotName,
    itemId: asNumber(item?.id),
    itemName: readName(record?.name) ?? readName(item?.name),
    itemLevel: asNumber(asRecord(record?.level)?.value),
    enchantments: asArray(record?.enchantments)
      .map(normalizeEnchantment)
      .filter((enchantment): enchantment is NormalizedEnchantment => enchantment !== null),
    sockets: asArray(record?.sockets)
      .map(normalizeSocket)
      .filter((socket): socket is NormalizedSocket => socket !== null),
    itemSet: itemSet ?? undefined,
  };
}

function normalizeEnchantment(payload: unknown): NormalizedEnchantment | null {
  const record = asRecord(payload);

  if (!record) {
    return null;
  }

  const enchantmentSlot = asRecord(record.enchantment_slot);
  const sourceItem = asRecord(record.source_item);

  return {
    id: asNumber(record.enchantment_id),
    slotId: asNumber(enchantmentSlot?.id),
    slotType: asString(enchantmentSlot?.type),
    displayString: asString(record.display_string),
    sourceItemId: asNumber(sourceItem?.id),
    sourceItemName: readName(sourceItem?.name),
  };
}

function normalizeSocket(payload: unknown): NormalizedSocket | null {
  const record = asRecord(payload);

  if (!record) {
    return null;
  }

  const socketType = asRecord(record.socket_type);
  const socketItem = asRecord(record.item);

  return {
    type: asString(socketType?.type),
    name: readName(socketType?.name),
    isFilled: Boolean(socketItem),
    itemId: asNumber(socketItem?.id),
    itemName: readName(socketItem?.name),
    displayString: asString(record.display_string),
  };
}

function normalizeItemSet(payload: unknown): NormalizedItemSet | null {
  const record = asRecord(payload);
  const itemSet = asRecord(record?.item_set);
  const items = asArray(record?.items);

  if (!record || !itemSet) {
    return null;
  }

  return {
    id: asNumber(itemSet.id),
    name: readName(itemSet.name),
    equippedCount: items.filter((item) => asRecord(item)?.is_equipped === true).length,
    totalCount: items.length,
  };
}

function readName(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value;
  }

  const record = asRecord(value);

  return (
    asString(record?.en_US) ??
    asString(record?.en_GB) ??
    asString(record?.ko_KR) ??
    asString(record?.zh_TW)
  );
}

function asRecord(value: unknown): JsonRecord | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonRecord)
    : undefined;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" ? value : undefined;
}
