import type { Region } from "@/lib/validation";

export type BattleNetRegion = Region;

export type BattleNetLocale = "en_US" | "en_GB" | "ko_KR" | "zh_TW";

export type BattleNetErrorCode =
  | "missing_credentials"
  | "auth_failed"
  | "not_found"
  | "rate_limited"
  | "unavailable"
  | "invalid_response"
  | "request_failed";

export type BattleNetError = {
  code: BattleNetErrorCode;
  message: string;
  status?: number;
};

export type BattleNetResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: BattleNetError;
    };

export type BattleNetName = {
  en_US?: string;
  en_GB?: string;
  ko_KR?: string;
  zh_TW?: string;
};

export type BattleNetReference = {
  id: number;
  name?: string | BattleNetName;
  key?: {
    href: string;
  };
};

export type CharacterLookupRequest = {
  region: BattleNetRegion;
  realm: string;
  name: string;
};

export type BattleNetCharacterProfile = {
  id: number;
  name: string;
  realm: BattleNetReference & {
    slug: string;
  };
  character_class?: BattleNetReference;
  active_spec?: BattleNetReference;
  level?: number;
  equipped_item_level?: number;
  average_item_level?: number;
};

export type BattleNetEquipmentSlot = {
  type: string;
  name: string | BattleNetName;
};

export type BattleNetEquippedItem = {
  item: BattleNetReference;
  slot: BattleNetEquipmentSlot;
  name?: string | BattleNetName;
  quality?: BattleNetReference & {
    type?: string;
  };
  level?: {
    value: number;
  };
  enchantments?: Array<{
    display_string?: string;
    enchantment_id?: number;
    source_item?: BattleNetReference;
  }>;
  sockets?: Array<{
    socket_type?: BattleNetReference & {
      type?: string;
    };
    item?: BattleNetReference;
  }>;
  set?: {
    item_set?: BattleNetReference;
    items?: Array<BattleNetReference & { is_equipped?: boolean }>;
  };
};

export type BattleNetCharacterEquipment = {
  character: BattleNetReference;
  equipped_items: BattleNetEquippedItem[];
};

export type BattleNetCharacterData = {
  profile: BattleNetCharacterProfile;
  equipment: BattleNetCharacterEquipment;
};
