import "server-only";

import type {
  BattleNetLocale,
  BattleNetRegion,
  BattleNetResult,
} from "@/lib/battlenet/types";

export const battleNetLocales: Record<BattleNetRegion, BattleNetLocale> = {
  us: "en_US",
  eu: "en_GB",
  kr: "ko_KR",
  tw: "zh_TW",
};

export function getBattleNetApiBaseUrl(region: BattleNetRegion) {
  return `https://${region}.api.blizzard.com`;
}

export function getBattleNetTokenUrl(region: BattleNetRegion) {
  return `https://${region}.battle.net/oauth/token`;
}

export function getProfileNamespace(region: BattleNetRegion) {
  return `profile-${region}`;
}

export function getBattleNetCredentials(): BattleNetResult<{
  clientId: string;
  clientSecret: string;
}> {
  const clientId = process.env.BATTLE_NET_CLIENT_ID?.trim();
  const clientSecret = process.env.BATTLE_NET_CLIENT_SECRET?.trim();

  if (!clientId || !clientSecret) {
    return {
      ok: false,
      error: {
        code: "missing_credentials",
        message:
          "Battle.net credentials are missing. Set BATTLE_NET_CLIENT_ID and BATTLE_NET_CLIENT_SECRET.",
      },
    };
  }

  return {
    ok: true,
    data: {
      clientId,
      clientSecret,
    },
  };
}
