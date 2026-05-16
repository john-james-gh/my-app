import "server-only";

import {
  battleNetLocales,
  getBattleNetApiBaseUrl,
  getProfileNamespace,
} from "@/lib/battlenet/config";
import {
  battleNetFailure,
  mapBattleNetResponseError,
} from "@/lib/battlenet/errors";
import { getBattleNetAccessToken } from "@/lib/battlenet/token";
import type {
  BattleNetCharacterData,
  BattleNetCharacterEquipment,
  BattleNetCharacterProfile,
  BattleNetRegion,
  BattleNetResult,
  CharacterLookupRequest,
} from "@/lib/battlenet/types";

export async function getBattleNetCharacterProfile(
  lookup: CharacterLookupRequest,
): Promise<BattleNetResult<BattleNetCharacterProfile>> {
  return battleNetFetch<BattleNetCharacterProfile>(
    lookup.region,
    `/profile/wow/character/${lookup.realm}/${lookup.name}`,
  );
}

export async function getBattleNetCharacterEquipment(
  lookup: CharacterLookupRequest,
): Promise<BattleNetResult<BattleNetCharacterEquipment>> {
  return battleNetFetch<BattleNetCharacterEquipment>(
    lookup.region,
    `/profile/wow/character/${lookup.realm}/${lookup.name}/equipment`,
  );
}

export async function getBattleNetCharacterData(
  lookup: CharacterLookupRequest,
): Promise<BattleNetResult<BattleNetCharacterData>> {
  const [profile, equipment] = await Promise.all([
    getBattleNetCharacterProfile(lookup),
    getBattleNetCharacterEquipment(lookup),
  ]);

  if (!profile.ok) {
    return profile;
  }

  if (!equipment.ok) {
    return equipment;
  }

  return {
    ok: true,
    data: {
      profile: profile.data,
      equipment: equipment.data,
    },
  };
}

async function battleNetFetch<T>(
  region: BattleNetRegion,
  pathname: string,
): Promise<BattleNetResult<T>> {
  const token = await getBattleNetAccessToken(region);

  if (!token.ok) {
    return token;
  }

  const url = new URL(`${getBattleNetApiBaseUrl(region)}${pathname}`);
  url.searchParams.set("namespace", getProfileNamespace(region));
  url.searchParams.set("locale", battleNetLocales[region]);

  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token.data}`,
      },
    });

    if (!response.ok) {
      return battleNetFailure(mapBattleNetResponseError(response));
    }

    return {
      ok: true,
      data: (await response.json()) as T,
    };
  } catch {
    return battleNetFailure({
      code: "unavailable",
      message: "Could not reach Battle.net while requesting character data.",
    });
  }
}
